/* launchServer */
const Server = require('./core/index');
const config = require('./server-config');
config.rootDirectory = __dirname;

const app = new Server(config);
app.start();
