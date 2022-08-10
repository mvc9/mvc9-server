
const logService = {
  logOnConsole: require('./console-log').logOnConsole
};

logService.unhandledPromiseRejection = process.on('unhandledRejection', (reason, promiseRefer) => {
  consoleLogger.logOnConsole({
    name:  'PROMISE REJECTION',
    content: "Unhandled Rejection at: Promise",
    logLevel: 3
  });
  consoleLogger.logOnConsole({
    name:  ' ',
    content: promiseRefer,
    logLevel: 3
  });
  consoleLogger.logOnConsole({
    name:  'Reject Reason',
    content: reason,
    logLevel: 3
  });
  // application specific logging, throwing an error, or other logic here
});

logService.uncaughtException = process.on('uncaughtException', (error) => {
  consoleLogger.logOnConsole({
    name:  'ERROR EXCEPTION',
    content: "An exception caughted: ",
    logLevel: 3
  });
  consoleLogger.logOnConsole({
    name:  'Exception detail',
    content: error,
    logLevel: 3
  });
  // application specific logging, throwing an error, or other logic here
});

logService.log = function (logItem) {
  logService.logOnConsole(logItem);
}

module.exports = logService;
