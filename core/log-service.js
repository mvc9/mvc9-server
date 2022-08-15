
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
    msg: "PROMISE REJECTION: Unhandled Rejection at: Promise",
    type: -1
  });
  consoleLogger.logOnConsole({
    msg: promiseRefer,
    type: -1
  });
  consoleLogger.logOnConsole({
    msg: 'Reject Reason' + reason,
    type: -1
  });
  // application specific logging, throwing an error, or other logic here
});

logService.uncaughtException = process.on('uncaughtException', (error) => {
  consoleLogger.logOnConsole({
    msg: "ERROR EXCEPTION: An unhandled exception caughted: ",
    logLevel: -1
  });
  consoleLogger.logOnConsole({
    msg: error,
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

logService.logConsole = function (msg) {
  if (logService.cLogger) {
    const currentTime = new Date();
    const currentTimeInt = currentTime.getTime();
    const splitCheckDuriation = 60 * 1000;
    const currentDateStr = logService.cLogger.getCurrentDate(currentTime, logService.config.timezoneOffset);
    if ((currentTimeInt - logService.cLogger.lastSplitCheckTime) > splitCheckDuriation) {
      logService.cLogger.lastSplitCheckTime = currentTimeInt;
      const currentDateFileName = currentDateStr.replace(/-\d{2}_\d{2}_\d{2}/g, '');
      if (logService.cLogger.fileName !== currentDateFileName) {
        logService.cLogger.closeStream();
        logService.cLogger.start(logService.config.log.cLogPath, currentDateFileName);
      }
    }
    logService.cLogger.log(msg);
  }
}

logService.logHTTP = function (msg) {
  if (logService.httpLogger) {
    const currentTime = new Date();
    const currentTimeInt = currentTime.getTime();
    const splitCheckDuriation = 60 * 1000;
    if ((currentTimeInt - logService.httpLogger.lastSplitCheckTime) > splitCheckDuriation) {
      logService.httpLogger.lastSplitCheckTime = currentTimeInt;
      const currentDateStr = logService.httpLogger.getCurrentDate(currentTime, logService.config.timezoneOffset);
      const currentDateFileName = currentDateStr.replace(/-\d{2}_\d{2}_\d{2}/g, '');
      if (logService.httpLogger.fileName !== currentDateFileName) {
        logService.httpLogger.closeStream();
        logService.httpLogger.start(logService.config.log.httpLogPath, currentDateFileName);
      }
      logService.httpLogger.log(msg);
    }
  }
}

logService.logWS = function (msg) {
  if (logService.wsLogger) {
    const currentTime = new Date();
    const currentTimeInt = currentTime.getTime();
    const splitCheckDuriation = 60 * 1000;
    if ((currentTimeInt - logService.wsLogger.lastSplitCheckTime) > splitCheckDuriation) {
      logService.wsLogger.lastSplitCheckTime = currentTimeInt;
      const currentDateStr = logService.wsLogger.getCurrentDate(currentTime, logService.config.timezoneOffset);
      const currentDateFileName = currentDateStr.replace(/-\d{2}_\d{2}_\d{2}/g, '');
      if (logService.wsLogger.fileName !== currentDateFileName) {
        logService.wsLogger.closeStream();
        logService.wsLogger.start(logService.config.log.wsLogPath, currentDateFileName);
      }
      logService.wsLogger.log(msg);
    }
  }
}

logService.logError = function (msg) {
  if (logService.cLogger) {
    const currentTime = new Date();
    const currentTimeInt = currentTime.getTime();
    const splitCheckDuriation = 60 * 1000;
    if ((currentTimeInt - logService.cLogger.lastSplitCheckTime) > splitCheckDuriation) {
      logService.cLogger.lastSplitCheckTime = currentTimeInt;
      const currentDateStr = logService.cLogger.getCurrentDate(currentTime, logService.config.timezoneOffset);
      const currentDateFileName = currentDateStr.replace(/-\d{2}_\d{2}_\d{2}/g, '');
      if (logService.cLogger.fileName !== currentDateFileName) {
        logService.cLogger.closeStream();
        logService.cLogger.start(logService.config.log.errorLogPath, currentDateFileName);
      }
      logService.cLogger.log(msg);
    }
  }
}

logService.log = function (logItem) {
  if (logService.config.log.logOnConsole) {
    logService.logOnConsole(logItem);
  }
  switch (logItem.type) {
    default:
      logService.logConsole(logItem.msg);
    case -1:
      logService.logError(logItem.msg);
    case 1:
      logService.logConsole(logItem.msg);
    case 2:
      logService.logWS(logItem.msg);
    case 3:
      logService.logHTTP(logItem.msg);
  }
}

module.exports = logService;
