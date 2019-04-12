const os = require('os');
const fs = require('fs');
const exec = require('child_process').exec;

const execute = command =>
    new Promise((y, n) => {
        console.log('### executing:', command);
        exec(command, (err, stdout, stderr) => {
            if (err) return n(stderr.toString());
            console.log(
                '### result:',
                stdout.toString().trim(),
                stderr.toString()
            );
            y(stdout.toString().trim());
        });
    });

module.exports = {
    execute,
    freemem: os.freemem,
    totalmem: os.freemem,
    setInterval,
    readFile: path =>
        new Promise((y, n) =>
            fs.readFile(path, 'utf8', (err, data) => (err ? n(err) : y(data)))
        ),
    writeFile: (path, data) =>
        new Promise((y, n) =>
            s.writeFile(path, data, err => (err ? n(err) : y()))
        ),
    fileExists: path => new Promise(y => fs.access(path, err => y(!err)))
};
