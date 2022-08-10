/* core */
'use strict';
const server = {};
server.fileSystem = require('fs');
server.express = require('express');
server.server = express();
server.expressMiddleWare = {};
server.expressMiddleWare.compression = require('compression');
server.expressMiddleWare.bodyParser = require('body-parser');
server.fileStreamRotator = require('file-stream-rotator');
server.config = null;

server.modules = {
  requestlogger: require('./request-logger'),
  parser: require('./request-parser'),
  vhost: require('./virtual-host'),
  buffer: require('./memory-buffer'),
  router: require('./resource-router'),
  responsor: require('./request-responsor'),
  virtualDom: require('./dom-provider')
};

server.logService = require('./log-service');

server.fnHTTPBeforeStart = [];
server.fnHTTPOnStart = [];
server.fnHTTPAfterStart = [];

server.fnWSBeforeStart = [];
server.fnWSOnStart = [];
server.fnWSAfterStart = [];


server.beforeHTTPStart = (listener) => {
  if (typeof(listener) !== 'function') {
    server.logService.log({name: 'SERVER', content: 'beforeHTTPStart param listener should be a function!', level: 1})
    return
  }
  server.fnHTTPBeforeStart.push(listener);
};

server.onHTTPStart = (listener) => {
  if (typeof(listener) !== 'function') {
    server.logService.log({name: 'SERVER', content: 'onHTTPStart param listener should be a function!', level: 1})
    return
  }
  server.fnHTTPOnStart.push(listener);
}

server.afterHTTPStart = (listener) => {
  if (typeof(listener) !== 'function') {
    server.logService.log({name: 'SERVER', content: 'afterHTTPStart param listener should be a function!', level: 1})
    return
  }
  server.fnHTTPAfterStart.push(listener);
}



server.beforeWSStart = (listener) => {
  if (typeof(listener) !== 'function') {
    server.logService.log({name: 'SERVER', content: 'beforeWSStart param listener should be a function!', level: 1})
    return
  }
  server.fnWSBeforeStart.push(listener);
};

server.onWSStart = (listener) => {
  if (typeof(listener) !== 'function') {
    server.logService.log({name: 'SERVER', content: 'onWSStart param listener should be a function!', level: 1})
    return
  }
  server.fnWSOnStart.push(listener);
}

server.afterWSStart = (listener) => {
  if (typeof(listener) !== 'function') {
    server.logService.log({name: 'SERVER', content: 'afterWSStart param listener should be a function!', level: 1})
    return
  }
  server.fnWSAfterStart.push(listener);
}

server.beforeWSStart = (listener) => {}

server.setLogService = (logService) => {}

server.startHTTPServer = (config) => {
  logOnConsole({ name: 'SERVER', content: 'server booting up...', logLevel: 1 });
}

global.startServer = () => {
  modules.logger = require('./request-logger');
  modules.parser = require('./request-parser');
  modules.vhost = require('./virtual-host');
  modules.buffer = require('./memory-buffer');
  modules.router = require('./resource-router');
  modules.responsor = require('./request-responsor');
  modules.logger.log(modules.logger.accessLogHead());
  modules.virtualDom = require('./dom-provider');

  server.use(bodyParser.json({limit: '1024kb'}));
  server.use(bodyParser.urlencoded({limit: '4096kb', extended: true}));
  config.server.compressionOption = { level: config.server.CompressionLevel };
  config.server.EnableCompression ? server.use(compression(config.server.compressionOption)) : null;
  config.server.portList = modules.vhost.getPortList(config.vhost);

  server.locals.title = config.server.ServerName;
  server.locals.email = config.server.AdminEmail;
  server.all('/\**/', modules.responsor);

  logOnConsole({ name: 'SERVER', content: 'Starting service ...', logLevel: 1 });
  modules.vhost.startListenPort(config.server.portList);
  logOnConsole({ name: 'SERVER', content: `Server is running up`, logLevel: 1 });
};

module.exports = server;
export default server;
