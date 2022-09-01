
function LogFileStream() {
  const fileSystem = require('fs');
  /* logger */
  const logger = {
    fileName: null,
    fileTimeStamp: 0,
    status: 0,
    logStream: null
  };

  // ensure log directory exists
  logger.confirmWriteDirectory = (logDirectory) => {
    fileSystem.existsSync(logDirectory) || fileSystem.mkdirSync(logDirectory);
  }

  logger.confirmWriteFile = (fullPath) => {
    let fileInfo = { size: 0 };
    try {
      fileInfo = fileSystem.statSync(fullPath);
    } catch (err) {}
    return fileInfo.size;
  }

  logger.start = (logPath, fileName, fileTimeStamp = (new Date()).getTime()) => {

    logger.status = 1;
    logger.fileTimeStamp = fileTimeStamp;


    if (logPath) {
      logger.confirmWriteDirectory(logPath);
    }
    if (fileName) {
      logger.fileName = fileName;
    }

    const fileFullPath = `${logPath}/${fileName}.log`;
    const startIndex = logger.confirmWriteFile(fileFullPath);
    const writeFlag = startIndex ? 'a' : 'w'

    logger.logStream = fileSystem.createWriteStream(fileFullPath, {flags: writeFlag, start: startIndex});
  }

  logger.log = (string) => {
    if (logger.logStream) {
      try {
        logger.logStream.write(string + '\r\n')
      } catch (err) {
        throw err;
      }
    } else {
      console.warn('write log failed as logStream not ready, content:\r\b', string)
    }
  };

  logger.closeStream = () => {
    if (logger.status !== 0) {
      logger.status = 0;
      logger.logStream.end();
    }
  }

  logger.getFileStreamHandler = () => {
    return logger.logStream;
  }

  logger.getStatus = () => {
    return logger.logStream;
  }

  return logger;
}

// exports the logger
module.exports = LogFileStream;
