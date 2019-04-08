const os = require('os');
const exec = require('child_process').exec;

const execute = command =>
    new Promise((y, n) => {
        console.log('### executing:', command);
        exec(command, (err, stdout, stderr) => {
            if (err) return n(stderr.toString());
            console.log('### result:', stdout.toString().trim(), stderr.toString());
            y(stdout.toString().trim());
        });
    });

module.exports = {
    execute,
    freemem: os.freemem,
    totalmem: os.freemem,
    setInterval
}