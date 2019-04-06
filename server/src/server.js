const express = require('express');
const path = require('path');
const socket = require('socket.io');
const os = require('os');
const exec = require('child_process').exec;

/**
 * Domain
 */

const queries = {

    '/resources': () =>
        execute('df -h /')
            .then(parseSpace)
            .then(disk => Promise.resolve(({
                date: new Date().toISOString(),
                memory: memory(os.totalmem() - os.freemem(), os.totalmem()),
                disk
            })))
}

const parseSpace = space => {
    const parts = space.split('\n')[1].replace(/\s+/g, ' ').split(' ');
    return {
        used: parts[2],
        total: parts[1],
        percentage: parts[4]
    }
}

const memory = (used, total) => ({
    used: GB(used),
    total: GB(total),
    percentage: Math.round(used / total * 100) + '%'
})
const GB = n => Math.round((n / (1024 * 1024 * 1024)) * 100) / 100 + 'GB';

const execute = command =>
    new Promise((y, n) => {
        console.log('executing:', command);
        exec(command, (err, stdout, stderr) => {
            if (err) return n(stderr.toString());
            console.log('result:', stdout.toString().trim(), stderr.toString());
            y(stdout.toString().trim());
        });
    });

setInterval(() => update('/resources'), 5000)


/**
 * Infrastructure
 */

const port = process.env.PORT || 4200;

const app = express();
const server = app.listen(port, () =>
    console.log(`Listening on http://localhost:${server.address().port}`));

app.use(express.static(path.join(__dirname, 'static')))

app.get('*', (req, res) => {
    const query = req.path

    if (!(query in queries)) return res.status(404).end('Not Found')

    queries[query](req)
        .then(result => res.json(result))
        .catch(err => console.error(err) || res.status(500).end('Server Error'))

});

const subscriptions = Object.keys(queries).reduce((acc, i) => ({ ...acc, [i]: {} }), {})

const hasSubscriptions = query => !!Object.keys(subscriptions[query]).length

const update = query => {
    if (!hasSubscriptions(query)) return;
     
    queries[query]().then(result =>
        Object.values(subscriptions[query]).forEach(client =>
            client.emit('update', { query, result })))
}

const io = socket(server);
io.on('connection', client => {
    client.on('subscribe', query => {
        if (!(query in subscriptions)) return console.error('Not found: ' + query)
        subscriptions[query][client.id] = client
        update(query)
        console.log('subscribed', query, client.id)
    });
    client.on('unsubscribe', query => {
        if (!(query in subscriptions)) return console.error('Not found: ' + query)
        delete subscriptions[query][client.id]
        console.log('unsubscribed', query, client.id)
    });
    client.on('disconnect', () =>
        Object.values(subscriptions).forEach(sub => delete sub[client.id]))
});