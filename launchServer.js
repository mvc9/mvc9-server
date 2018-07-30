/* launchServer */
require('./core/core');
config.rootDirectory = __dirname;
config.vhost = require('./config/vhost.config');
config.route = require('./config/route.config');
config.server = require('./config/server.config');

startServer();
