const system = require('./infrasctructure/system')
const server = require('./infrasctructure/server')

const port = process.env.PORT || 4200;

require('./domain/queries/resources')({system, server})

server.listenOn(port)