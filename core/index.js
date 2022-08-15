/* core */
'use strict';

export default function MVC9Server(config) {

  const server = {};
  server.fileSystem = require('fs');
  server.express = require('express');
  server.server = express();
  server.expressMiddleWare = {};
  server.expressMiddleWare.compression = require('compression');
  server.expressMiddleWare.bodyParser = require('body-parser');
  server.logger = require('./log-service');
  server.config = config;
  
  server.modules = {
    parser: require('./request-parser'),
    vhost: require('./virtual-host'),
    buffer: require('./memory-buffer'),
    router: require('./resource-router'),
    responsor: require('./request-responsor'),
    htmlRender: require('./dom-provider')
  };
  
  server.fnHTTPBeforeStart = [];
  server.fnHTTPOnStart = [];
  server.fnHTTPAfterStart = [];
  
  server.fnWSBeforeStart = [];
  server.fnWSOnStart = [];
  server.fnWSAfterStart = [];
  
  server.beforeHTTPStart = (listener) => {
    if (typeof(listener) !== 'function') {
      server.logger.log({msg: 'beforeHTTPStart param listener should be a function!'})
      return
    }
    server.fnHTTPBeforeStart.push(listener);
  };
  
  server.onHTTPStart = (listener) => {
    if (typeof(listener) !== 'function') {
      server.logger.log({msg: 'onHTTPStart param listener should be a function!'})
      return
    }
    server.fnHTTPOnStart.push(listener);
  }
  
  server.afterHTTPStart = (listener) => {
    if (typeof(listener) !== 'function') {
      server.logService.log({msg: 'afterHTTPStart param listener should be a function!'})
      return
    }
    server.fnHTTPAfterStart.push(listener);
  }
  
  
  
  server.beforeWSStart = (listener) => {
    if (typeof(listener) !== 'function') {
      server.logService.log({msg: 'beforeWSStart param listener should be a function!'})
      return
    }
    server.fnWSBeforeStart.push(listener);
  };
  
  server.onWSStart = (listener) => {
    if (typeof(listener) !== 'function') {
      server.logService.log({msg: 'onWSStart param listener should be a function!'})
      return
    }
    server.fnWSOnStart.push(listener);
  }
  
  server.afterWSStart = (listener) => {
    if (typeof(listener) !== 'function') {
      server.logService.log({msg: 'afterWSStart param listener should be a function!'})
      return
    }
    server.fnWSAfterStart.push(listener);
  }
  
  server.startHTTPServer = (config) => {
    logOnConsole({msg: 'server booting up...'});
    if (server.logService) {
      if (server.logService.isDefault) {
        server.beforeHTTPStart(function(server, next) {
          next();
        })
      }
    }
  }
  
  
  global.startServer = () => {
  
    server.server.use(bodyParser.json({limit: '1024kb'}));
    server.server.use(bodyParser.urlencoded({limit: '4096kb', extended: true}));
    config.server.compressionOption = { level: config.server.CompressionLevel };
    config.server.EnableCompression ? server.server.use(compression(config.server.compressionOption)) : null;
    config.server.portList = modules.vhost.getPortList(config.vhost);
  
    server.server.locals.title = config.server.ServerName;
    server.server.all('/\**/', modules.responsor);
  
    logOnConsole({ msg: 'Starting service ...'});
    modules.vhost.startListenPort(config.server.portList);
    logOnConsole({ msg: `Server is running up`});
  };

  return server;
}

module.exports = MVC9Server;
