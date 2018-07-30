const consoleLogger = {};

consoleLogger.logOnConsole = (message) => {
  let msg = {
    name: message.name,
    content: message.content,
    logLevel: message.logLevel
  }
  if (msg.logLevel <= config.server.LogLevel) {
    let contentHead;
    msg.name ? contentHead = msg.name + ' :' : contentHead = 'LOG :';
    console.log(contentHead, msg.content);
  }
};

consoleLogger.unhandledPromiseRejection = process.on('unhandledRejection', (reason, promiseRefer) => {
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

consoleLogger.uncaughtException = process.on('uncaughtException', (error) => {
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

module.exports = consoleLogger;
