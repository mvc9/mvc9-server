/* mvc9 index */

function MVC9Server(config, memo) {

  if (!config) {
    throw new Error('MVC9Server constructor param config should not be empty!');
  }

  const mvc9 = {
    memo: memo || {}
  };
  mvc9.config = config;
  mvc9.fileSystem = require('fs');
  mvc9.express = require('express');
  mvc9.server = mvc9.express();
  mvc9.expressMiddleWare = {};
  mvc9.expressMiddleWare.compression = require('compression');
  mvc9.expressMiddleWare.bodyParser = require('body-parser');


  const LogService = require('./log-service');
  mvc9.logger = new LogService(config);
  
  mvc9.modules = {
    parser: require('./request-parser'),
    router: require('./resource-router'),
    defender: require('./defender'),
    responsor: require('./request-responsor'),
    htmlRender: require('./dom-provider')
  };
  
  mvc9.fnHTTPBeforeStart = [];
  mvc9.fnHTTPOnStart = [];
  mvc9.fnHTTPAfterStart = [];
  
  mvc9.fnWSBeforeStart = [];
  mvc9.fnWSOnStart = [];
  mvc9.fnWSAfterStart = [];
  
  mvc9.beforeHTTPStart = (listener) => {
    if (typeof(listener) !== 'function') {
      mvc9.logger.log({msg: 'beforeHTTPStart param listener should be a function!'})
      return
    }
    mvc9.fnHTTPBeforeStart.push(listener);
  };
  
  mvc9.onHTTPStart = (listener) => {
    if (typeof(listener) !== 'function') {
      mvc9.logger.log({msg: 'onHTTPStart param listener should be a function!'})
      return
    }
    mvc9.fnHTTPOnStart.push(listener);
  }
  
  mvc9.afterHTTPStart = (listener) => {
    if (typeof(listener) !== 'function') {
      mvc9.logger.log({msg: 'afterHTTPStart param listener should be a function!'})
      return
    }
    mvc9.fnHTTPAfterStart.push(listener);
  }
  
  
  mvc9.beforeWSStart = (listener) => {
    if (typeof(listener) !== 'function') {
      mvc9.logger.log({msg: 'beforeWSStart param listener should be a function!'})
      return
    }
    mvc9.fnWSBeforeStart.push(listener);
  };
  
  mvc9.onWSStart = (listener) => {
    if (typeof(listener) !== 'function') {
      mvc9.logger.log({msg: 'onWSStart param listener should be a function!'})
      return
    }
    mvc9.fnWSOnStart.push(listener);
  }
  
  mvc9.afterWSStart = (listener) => {
    if (typeof(listener) !== 'function') {
      mvc9.logger.log({msg: 'afterWSStart param listener should be a function!'})
      return
    }
    mvc9.fnWSAfterStart.push(listener);
  }
  
  mvc9.startHTTPServer = (config) => {
    mvc9.logger.log({msg: 'server booting up...'});
    if (mvc9.logService) {
      if (mvc9.logService.isDefault) {
        mvc9.beforeHTTPStart(function(mvc9, next) {
          next();
        })
      }
    }
  }
  
  mvc9.use = (plugin) => {
    plugin(mvc9);
  }
  
  mvc9.bootup = () => {
    mvc9.server.use(mvc9.modules.defender(mvc9));
    mvc9.server.use(mvc9.expressMiddleWare.bodyParser.json({limit: '1024kb'}));
    mvc9.server.use(mvc9.expressMiddleWare.bodyParser.urlencoded({limit: '4096kb', extended: true}));
    config.http.compressionOption = { level: config.http.CompressionLevel };
    config.http.enableCompression ? mvc9.server.use(mvc9.expressMiddleWare.compression(config.http.compressionOption)) : null;
  
    mvc9.server.locals.title = config.ServerName;
    mvc9.server.all('/\**/', () => {
      
    });

    mvc9.logger.log({ msg: 'Starting service ...'});
    mvc9.server.listen(config.http.port, () => {
      mvc9.logger.log({ msg: `Server listen on port ${config.http.port}`});
    })
  };

  return mvc9;
}

module.exports = MVC9Server;
