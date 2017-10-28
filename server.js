/* server starts */
require('./core/core');
config.rootDirectory = `${__dirname}../../`;
config.route = require('./config/route.config');
config.server = require('./config/server.config');
