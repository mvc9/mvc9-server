/* server starts */

/* this file only for node_modules import or require */
require('./core/core');
config.rootDirectory = `${__dirname}../../`;

/* you should create and require your config files at your project root path */
/* for example */
// config.vhost = require('./config/vhost.config');
// config.route = require('./config/route.config');
// config.server = require('./config/server.config');

/* and then you can start your server now */
// startServer();
