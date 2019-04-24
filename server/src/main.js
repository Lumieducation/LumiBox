const system = require('./infrastructure/system');
const server = require('./infrastructure/server');

const port = process.env.PORT || 4200;
const toolsDir = process.env.TOOLS_DIR || 'local/tools';
const hostName = process.env.HOST_NAME || 'localhost:' + port

require('./domain/queries/resources')({ system }).installOn(server);
require('./domain/queries/tools')({ system, toolsDir, hostName }).installOn(server);

server.listenOn(port);
