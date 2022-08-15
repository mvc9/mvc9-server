
function LoggerFileStream(server) {
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

  logger.getCurrentDate = (dateObject, timezoneOffset = 0) => {
    const date = (new Date((dateObject).getTime() - timezoneOffset * 60000));
    const pureTimeStr = date.toISOString().replace(/\.\d{0,3}(Z?)$/g, '');
    return pureTimeStr.replace(/[T\:]/g, '-').replace(/-/g, '_');
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
    logger.logStream = server.fileSystem.createWriteStream(`${logPath}/${fileName}`, {flags: 'aw'});
  }

  logger.log = (string) => {
    logger.logStream.write(string)
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
}

// exports the logger
module.exports = logger;
