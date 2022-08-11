const consoleLogger = {};

consoleLogger.logOnConsole = (message) => {
  let msg = {
    content: message.msg,
    logType: message.logType || 'log'
  }
  console[msg.logType](msg.content);
};

module.exports = consoleLogger;
