
const LogFileStream = require('./log-file-stream');

const logService = {
  isDefault: true,    // this should be false or undefined if you use your own custom logService
  config: {},
  logOnConsole: require('./console-log').logOnConsole,
  httpLogger: null,
  wsLogger: null,
  cLogger: null,
  errorLogger: null
};

logService.unhandledPromiseRejection = process.on('unhandledRejection', (reason, promiseRefer) => {
  consoleLogger.logOnConsole({
    content: "PROMISE REJECTION: Unhandled Rejection at: Promise",
    type: -1
  });
  consoleLogger.logOnConsole({
    content: promiseRefer,
    type: -1
  });
  consoleLogger.logOnConsole({
    content: 'Reject Reason' + reason,
    type: -1
  });
  // application specific logging, throwing an error, or other logic here
});

logService.uncaughtException = process.on('uncaughtException', (error) => {
  consoleLogger.logOnConsole({
    content: "ERROR EXCEPTION: An unhandled exception caughted: ",
    logLevel: -1
  });
  consoleLogger.logOnConsole({
    content: error,
    logLevel: -1
  });
  // application specific logging, throwing an error, or other logic here
});

logService.init = function (server) {
  if (server.config && server.config.log) {
    logService.config = server.config.log;
    if (logService.config.httpLogPath) {
      logService.httpLogger = new LogFileStream(server);
    }
    if (logService.config.wsLogPath) {
      logService.wsLogger = new LogFileStream(server);
    }
    if (logService.config.cLogPath) {
      logService.cLogger = new LogFileStream(server);
    }
    if (logService.config.errorLogPath) {
      logService.errorLogger = new LogFileStream(server);
    }
  } else {
    throw new Error('logService.init(server): server.config.log should be an object.')
  }
}

logService.log = function (logItem) {
  logService.logOnConsole(logItem);
  switch (logItem.type) {
    default:
      if (logService.config.logOnConsole) {
        logService.logOnConsole(logItem);
      }
      logService.cLogger.log(logItem.msg);
  }
}

module.exports = logService;
