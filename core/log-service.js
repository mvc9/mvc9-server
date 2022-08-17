// default log service of mvc9
// this constructor only can construct once!
function LogService(config) {

  if (!config) {
    throw new Error('MVC9Server:LogService: constructor param config should not be empty!');
  }
  const LogFileStream = require('./log-file-stream');

  const logService = {
    isDefault: true,    // this should be false or undefined if you use your own custom logService
    config: config,
    httpLogger: null,
    wsLogger: null,
    cLogger: null,
    errorLogger: null
  };

  logService.getCurrentDate = (dateObject, timezoneOffset = 0) => {
    const date = (new Date((dateObject).getTime() - timezoneOffset * 60000));
    const pureTimeStr = date.toISOString().replace(/\.\d{0,3}(Z?)$/g, '');
    return pureTimeStr; // .replace(/[T\:]/g, '-').replace(/-/g, '_');
  }

  logService.getDailyFileName = (dateTime) => {
    const currentTime = dateTime || new Date();
    const currentDateStr = logService.getCurrentDate(currentTime, logService.config.timezoneOffset);
    return currentDateStr.replace(/T\d{2}\:\d{2}\:\d{2}/g, '');
  }
  
  logService.init = function () {
    if (logService.config && logService.config.log) {
      const currentTime = new Date();
      const currentDateFileName = logService.getDailyFileName(currentTime);
      if (logService.config.log.errorLogPath) {
        logService.errorLogger = new LogFileStream();
        logService.errorLogger.start(`${logService.config.baseDir}/${logService.config.log.errorLogPath}`, currentDateFileName);
        logService.errorLogger.log('/* log stream init timestamp = ' + currentTime.getTime() + ' */');
      }
      if (logService.config.log.cLogPath) {
        logService.cLogger = new LogFileStream();
        logService.cLogger.start(`${logService.config.baseDir}/${logService.config.log.cLogPath}`, currentDateFileName);
        logService.cLogger.log('/* log stream init timestamp = ' + currentTime.getTime() + ' */');
      }
      if (logService.config.log.httpLogPath) {
        logService.httpLogger = new LogFileStream();
        logService.httpLogger.start(`${logService.config.baseDir}/${logService.config.log.httpLogPath}`, currentDateFileName);
        logService.httpLogger.log('/* log stream init timestamp = ' + currentTime.getTime() + ' */');
      }
      if (logService.config.log.wsLogPath) {
        logService.wsLogger = new LogFileStream();
        logService.wsLogger.start(`${logService.config.baseDir}/${logService.config.log.wsLogPath}`, currentDateFileName);
        logService.wsLogger.log('/* log stream init timestamp = ' + currentTime.getTime() + ' */');
      }
    } else {
      throw new Error('logService.init(): config.log should be an object.')
    }
  }

  logService.logConsole = function (msg) {
    if (logService.cLogger) {
      const currentTime = new Date();
      const currentTimeInt = currentTime.getTime();
      const splitCheckDuriation = 60 * 1000;
      const currentDateStr = logService.getCurrentDate(currentTime, logService.config.timezoneOffset);
      const currentLogDate = currentDateStr.replace(/T/g, ' ');
      if ((currentTimeInt - logService.cLogger.lastSplitCheckTime) > splitCheckDuriation) {
        logService.cLogger.lastSplitCheckTime = currentTimeInt;
        const currentDateFileName = logService.getDailyFileName(currentTime);
        if (logService.cLogger.fileName !== currentDateFileName) {
          logService.cLogger.closeStream();
          logService.cLogger.start(logService.config.log.cLogPath, currentDateFileName);
        }
      }

      const logMsgStr = `[${currentLogDate}]: ${msg}`;
      if (logService.config.log.logOnConsole) {
        console.log(`[${currentLogDate}]:`, msg);
      }
      logService.cLogger.log(logMsgStr);
    }
  }
  
  logService.logHTTP = function (msg) {
    if (logService.httpLogger) {
      const currentTime = new Date();
      const currentTimeInt = currentTime.getTime();
      const splitCheckDuriation = 60 * 1000;
      if ((currentTimeInt - logService.httpLogger.lastSplitCheckTime) > splitCheckDuriation) {
        logService.httpLogger.lastSplitCheckTime = currentTimeInt;
        const currentDateFileName = logService.getDailyFileName(currentTime);
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
        const currentDateFileName = logService.getDailyFileName(currentTime);
        if (logService.wsLogger.fileName !== currentDateFileName) {
          logService.wsLogger.closeStream();
          logService.wsLogger.start(logService.config.log.wsLogPath, currentDateFileName);
        }
        logService.wsLogger.log(msg);
      }
    }
  }
  
  logService.logError = function (msg) {
    if (logService.errorLogger) {
      const currentTime = new Date();
      const currentTimeInt = currentTime.getTime();
      const splitCheckDuriation = 60 * 1000;
      const currentDateStr = logService.getCurrentDate(currentTime, logService.config.timezoneOffset);
      const currentLogDate = currentDateStr.replace(/T/g, ' ');
      if ((currentTimeInt - logService.errorLogger.lastSplitCheckTime) > splitCheckDuriation) {
        logService.errorLogger.lastSplitCheckTime = currentTimeInt;
        const currentDateFileName = logService.getDailyFileName(currentTime);
        if (logService.errorLogger.fileName !== currentDateFileName) {
          logService.errorLogger.closeStream();
          logService.errorLogger.start(logService.config.log.errorLogPath, currentDateFileName);
        }
        
      }
      const logMsgStr = `[${currentLogDate}]: ${msg.stack ? msg.stack : msg}`;
      if (logService.config.log.logOnConsole) {
        console.log(`[${currentLogDate}]:`, msg);
      }
      logService.errorLogger.log(logMsgStr);
    }
  }
  
  logService.log = function (logItem) {
    switch (logItem.type) {
      default:
        logService.logConsole(logItem.msg);
        break;
      case -1:
        logService.logError(logItem.msg);
        break;
      case 1:
        logService.logConsole(logItem.msg);
        break;
      case 2:
        logService.logWS(logItem.msg);
        break;
      case 3:
        logService.logHTTP(logItem.msg);
        break;
    }
  }
    
  logService.unhandledPromiseRejection = process.on('unhandledRejection', (reason, promiseRefer) => {
    logService.log({
      msg: "PROMISE REJECTION: Unhandled Rejection at: Promise",
      type: -1
    });
    logService.log({
      msg: promiseRefer,
      type: -1
    });
    logService.log({
      msg: 'Reject Reason' + reason,
      type: -1
    });
    // application specific logging, throwing an error, or other logic here
  });
  
  logService.uncaughtException = process.on('uncaughtException', (error) => {
    logService.log({
      msg: "ERROR EXCEPTION: An unhandled exception caughted: ",
      type: -1
    });
    logService.log({
      msg: error,
      type: -1
    });
    // application specific logging, throwing an error, or other logic here
  });

  logService.init();
  
  return logService;
}

module.exports = LogService;
