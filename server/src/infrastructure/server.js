const express = require('express');
const path = require('path');
const socket = require('socket.io');

const addQuery = (key, query) => {
    queries[key] = query;
    subscriptions[key] = {};
};

const emitUpdate = query => {
    if (!hasSubscriptions(query)) return;

    queries[query]().then(result =>
        Object.values(subscriptions[query]).forEach(client =>
            client.emit('update', { query, result })
        )
    );
};

const listenOn = port => startSocket(startExpress(port));

module.exports = {
    addQuery,
    emitUpdate,
    listenOn
};

/** HTTP API */

const app = express();

const startExpress = port =>
    app.listen(port, () =>
        console.log(`Listening on http://localhost:${port}`)
    );

app.use(express.static(path.join(__dirname, '..', 'static')));

app.get('*', (req, res) => {
    const query = req.path;
    if (!(query in queries)) return res.status(404).end('Not Found');

    queries[query](req)
        .then(result => res.end(result))
        .catch(
            err => console.error(err) || res.status(500).end('Server Error')
        );
});

/** Subscriptions */

const queries = {};
const subscriptions = {};

const hasSubscriptions = query => !!Object.keys(subscriptions[query]).length;

const subscribe = (query, client) => {
    if (!(query in subscriptions)) return console.error('Not found: ' + query);
    subscriptions[query][client.id] = client;
    emitUpdate(query);
    console.log('subscribed', query, client.id);
};

const unsubscribe = (query, client) => {
    if (!(query in subscriptions)) return console.error('Not found: ' + query);
    delete subscriptions[query][client.id];
    console.log('unsubscribed', query, client.id);
};

const unsubscribeAll = client => {
    Object.keys(subscriptions).forEach(query => {
        if (client.id in subscriptions[query]) unsubscribe(query, client);
    });
};

const startSocket = server => {
    const io = socket(server);
    io.on('connection', client => {
        client.on('subscribe', query => subscribe(query, client));
        client.on('unsubscribe', query => unsubscribe(query, client));
        client.on('disconnect', () => unsubscribeAll(client));
    });
};
