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

module.exports = consoleLogger;
