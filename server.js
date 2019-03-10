const express = require('express');
const busboy = require('connect-busboy');
const path = require('path');
const fs = require('fs-extra');
const whiskers = require('whiskers');
const os = require('os');

const sys = require('sys');
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
app.use(busboy({highWaterMark: 2 * 1024 * 1024,}));
app.engine('.html', whiskers.__express);

app.get('/', (req, res) => {
  const GB = n => (Math.round(n / (1024 * 1024 * 1024) * 100) / 100) + 'GB';
  var perc = Math.round(os.freemem() / os.totalmem() * 100);

  execute('df -h /')
    .then(space => execute(`ls ${toolsDir}`)
      .then(tools => Promise.all(tools.toString().split('\n').filter(s=>s.length)
        .map(tool => readJson(`${toolsDir}/${tool}/tool/meta.json`))))
      .then(tools => Promise.all(tools.map(tool => fileExists(`${toolsDir}/${tool.name}/__installing.lock`)
        .then(installing => installing
          ? 'pending'
          : execute(`cd ${toolsDir}/${tool.name} && sh tool/status.sh`).then(status => status != '0' ? 'running' : 'stopped'))
        .then(status => ({...tool, status, installed: status != 'pending', running: status == 'running'}))
      )))
      .then(tools => res.render('index.html', {
        space: space.toString(),
        memory: GB(os.freemem()) + ' / ' + GB(os.totalmem()) + ' (' + perc + '%)',
        tools: tools,
        boxDomain
      })))
});

app.route('/install').post((req, res,) => {
  const tmpFolder = path.join('upload', '_tmp' + Date.now());

  upload(req, 'upload')
    .then(filePath => execute(`mkdir ${tmpFolder}`)
      .then(() => execute(`tar -xf ${filePath} -C ${tmpFolder}`))
      .then(() => readJson(`${tmpFolder}/tool/meta.json`))
      .then(manifest => execute(`mv ${tmpFolder} ${toolsDir}/${manifest.name}`)
        .then(() => res.redirect('back'))
        .then(() => execute(`touch ${toolsDir}/${manifest.name}/__installing.lock`))
        .then(() => installVirtualHost(manifest.name))
        .then(port => execute(`cd ${toolsDir}/${manifest.name} && TOOL_PORT=${port} sh tool/install.sh`))
        .then(() => execute(`rm ${filePath}`))
        .then(() => execute(`rm ${toolsDir}/${manifest.name}/__installing.lock`))))
    .catch(console.log);
});

app.get('/:tool/start', (req, res) =>
  execute(`cd ${toolsDir}/${req.params.tool} && sh tool/start.sh`)
    .catch(console.log)
    .then(() => res.redirect('back')));

app.get('/:tool/stop', (req, res) =>
  execute(`cd ${toolsDir}/${req.params.tool} && sh tool/stop.sh`)
    .catch(console.log)
    .then(() => res.redirect('back')));

app.get('/:tool/remove', (req, res) =>
  removeVirtualHost(req.params.tool)
    .then(() => execute(`cd ${toolsDir}/${req.params.tool} && sh tool/remove.sh`))
    .then(() => execute(`rm -rf ${toolsDir}/${req.params.tool}`))
    .catch(console.log)
    .then(() => res.redirect('back')));

app.get('/shutdown', (req, res) =>
  execute(`sudo shutdown 0`)
    .catch(console.log)
    .then(() => res.render('shutdown.html')));

app.get('/assets/:file', (req, res) =>
  res.sendFile(__dirname + '/assets/' + req.params.file));

app.get('/captive_portal', (req, res) =>
  res.render('captive_portal.html'));

const server = app.listen(port, () =>
  console.log(`Listening on port ${server.address().port}`));


const installVirtualHost = (toolName) => {
  let freePort = basePort;

  return readJson('used_ports.json')
    .catch(() => ({}))
    .then(usedPorts => {
      while (Object.values(usedPorts).indexOf(freePort) > -1) freePort++;
      usedPorts[toolName] = freePort;
      return writeJson('used_ports.json', usedPorts)
    })
    .then(() => readFile('nginx_virtual_host.conf.template'))
    .then(template => whiskers.render(template, {
      tool: {name: toolName, port: freePort},
      box: {domain: boxDomain}
    }))
    .then(conf => writeFile(`${nginxConfigDir}/lumi_${toolName}.conf`, conf))
    .then(() => {
      execute('sudo systemctl restart nginx').catch(console.log);
      return freePort
    })
};

const removeVirtualHost = toolName => {
  return execute(`sudo rm -rf ${nginxConfigDir}/lumi_${toolName}.conf`)
    .then(() => {
      execute('sudo systemctl restart nginx').catch(console.log);
    })
    .then(() => readJson('used_ports.json'))
    .then(usedPorts => {
      delete usedPorts[toolName];
      return writeJson('used_ports.json', usedPorts)
    })
};

const execute = command => new Promise((y, n) => {
  console.log('executing:', command);
  exec(command, (err, stdout, stderr) => {
    if (err) return n(stderr.toString());
    console.log('result:', stdout.toString().trim(), stderr.toString());
    y(stdout.toString().trim())
  })
});

const upload = (req, toPath) => new Promise((y) => {
  req.pipe(req.busboy);
  fs.ensureDir(toPath);

  req.busboy.on('file', (fieldname, file, filename) => {
    console.log(`Upload of '${filename}' started`);

    const filePath = path.join(toPath, filename);
    const fstream = fs.createWriteStream(filePath);
    file.pipe(fstream);

    fstream.on('close', () => {
      console.log(`Upload of '${filePath}' finished`);
      y(filePath)
    });
  })
});

const readFile = path => new Promise((y, n) =>
  fs.readFile(path, 'utf8', (err, data) => err ? n(err) : y(data)));

const readJson = path => readFile(path).then(JSON.parse);

const writeFile = (path, data) => new Promise((y, n) =>
  fs.writeFile(path, data, err => err ? n(err) : y()));

const writeJson = (path, data) => writeFile(path, JSON.stringify(data));

const fileExists = path => new Promise((y, n) => fs.access(path, err => y(!err)));