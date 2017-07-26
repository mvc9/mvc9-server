/* core */
'use strict';
global.fileSystem = require('fs');
global.express = require('express');
global.server = express();
global.compression = require('compression');
global.fileStreamRotator = require('file-stream-rotator');
global.logOnConsole = require('./printer').logOnConsole;
global.config = {};
global.modules = {};
global.startServer = () => {
  logOnConsole({ name: 'SERVER', content: 'Load modules ...', logLevel: 1 });
  modules.logger = require('./logger');
  modules.parser = require('./parser');
  modules.vhost = require('./vhost');
  modules.buffer = require('./buffer');
  modules.router = require('./router');
  modules.responsor = require('./responsor');
  modules.logger.log(modules.logger.accessLogHead());

  config.server.compressionOption = { level: config.server.CompressionLevel };
  config.server.EnableCompression ? server.use(compression(config.server.compressionOption)) : null;
  config.server.portList = modules.vhost.getPortList(config.vhost);

  server.locals.title = config.server.ServerName;
  server.locals.email = config.server.AdminEmail;
  server.all('/\**/', modules.responsor);

  logOnConsole({ name: 'SERVER', content: 'Starting service ...', logLevel: 1 });
  modules.vhost.startListenPort(config.server.portList);
  logOnConsole({ name: 'SERVER', content: `Server is running up`, logLevel: 1 });
}
