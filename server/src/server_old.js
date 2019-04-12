const express = require('express');
const busboy = require('connect-busboy');
const path = require('path');
const fs = require('fs-extra');
const whiskers = require('whiskers');
const os = require('os');

const exec = require('child_process').exec;

require('dotenv').config();

const port = process.env.PORT || 4200;
const basePort = parseInt(process.env.BASE_PORT) || 4201;
const boxDomain = process.env.BOX_DOMAIN || 'localhost';
const toolsDir = process.env.TOOLS_DIR || 'local/tools';
const nginxConfigDir = process.env.NGINX_CONFIG_DIR || 'local/nginx_conf';

fs.ensureDir(toolsDir);
fs.ensureDir(nginxConfigDir);

const app = express();
app.use(busboy({ highWaterMark: 2 * 1024 * 1024 }));
app.engine('.html', whiskers.__express);
app.set('views', __dirname + '/views');

app.route('/install').post((req, res) => {
    const tmpFolder = path.join('upload', '_tmp' + Date.now());

    upload(req, 'upload')
        .then(filePath =>
            execute(`mkdir ${tmpFolder}`)
                .then(() => execute(`tar -xf ${filePath} -C ${tmpFolder}`))
                .then(() => readJson(`${tmpFolder}/tool/meta.json`))
                .then(manifest =>
                    execute(`mv ${tmpFolder} ${toolsDir}/${manifest.name}`)
                        .then(() => res.redirect('back'))
                        .then(() =>
                            execute(
                                `touch ${toolsDir}/${
                                    manifest.name
                                }/__installing.lock`
                            )
                        )
                        .then(() => installVirtualHost(manifest.name))
                        .then(port =>
                            execute(
                                `cd ${toolsDir}/${
                                    manifest.name
                                } && TOOL_PORT=${port} sh tool/install.sh`
                            )
                        )
                        .then(() => execute(`rm ${filePath}`))
                        .then(() =>
                            execute(
                                `rm ${toolsDir}/${
                                    manifest.name
                                }/__installing.lock`
                            )
                        )
                )
        )
        .catch(console.log);
});

app.get('/:tool/start', (req, res) =>
    execute(`cd ${toolsDir}/${req.params.tool} && sh tool/start.sh`)
        .catch(console.log)
        .then(() => res.redirect('back'))
);

app.get('/:tool/stop', (req, res) =>
    execute(`cd ${toolsDir}/${req.params.tool} && sh tool/stop.sh`)
        .catch(console.log)
        .then(() => res.redirect('back'))
);

app.get('/:tool/remove', (req, res) =>
    removeVirtualHost(req.params.tool)
        .then(() =>
            execute(`cd ${toolsDir}/${req.params.tool} && sh tool/remove.sh`)
        )
        .then(() => execute(`rm -rf ${toolsDir}/${req.params.tool}`))
        .catch(console.log)
        .then(() => res.redirect('back'))
);

app.post('/shutdown', (req, res) => {
    res.render('shutdown.html');
    execute(`sleep 1 && sudo shutdown now`).catch(console.log);
});

app.get('/assets/:file', (req, res) =>
    res.sendFile(__dirname + '/assets/' + req.params.file)
);

app.get('/captive_portal', (req, res) => res.render('captive_portal.html'));

const server = app.listen(port, () =>
    console.log(`Listening on http://localhost:${server.address().port}`)
);

const installVirtualHost = toolName => {
    let freePort = basePort;

    return readJson('used_ports.json')
        .catch(() => ({}))
        .then(usedPorts => {
            while (Object.values(usedPorts).indexOf(freePort) > -1) freePort++;
            usedPorts[toolName] = freePort;
            return writeJson('used_ports.json', usedPorts);
        })
        .then(() => readFile('nginx_virtual_host.conf.template'))
        .then(template =>
            whiskers.render(template, {
                tool: { name: toolName, port: freePort },
                box: { domain: boxDomain }
            })
        )
        .then(conf =>
            writeFile(`${nginxConfigDir}/lumi_${toolName}.conf`, conf)
        )
        .then(() => {
            execute('sudo systemctl restart nginx').catch(console.log);
            return freePort;
        });
};

const removeVirtualHost = toolName => {
    return execute(`sudo rm -rf ${nginxConfigDir}/lumi_${toolName}.conf`)
        .then(() => {
            execute('sudo systemctl restart nginx').catch(console.log);
        })
        .then(() => readJson('used_ports.json'))
        .then(usedPorts => {
            delete usedPorts[toolName];
            return writeJson('used_ports.json', usedPorts);
        });
};

const upload = (req, toPath) =>
    new Promise(y => {
        req.pipe(req.busboy);
        fs.ensureDir(toPath);

        req.busboy.on('file', (fieldname, file, filename) => {
            console.log(`Upload of '${filename}' started`);

            const filePath = path.join(toPath, filename);
            const fstream = fs.createWriteStream(filePath);
            file.pipe(fstream);

            fstream.on('close', () => {
                console.log(`Upload of '${filePath}' finished`);
                y(filePath);
            });
        });
    });
