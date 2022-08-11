
function LoggerFileStream(server) {
  /* logger */
  const logger = {
    status: 0,
    logStream: null
  };

  // ensure log directory exists
  logger.confirmWriteDirectory = (logDirectory) => {
    fileSystem.existsSync(logDirectory) || fileSystem.mkdirSync(logDirectory);
  }

  logger.getCurrentDate = (timezoneOffset = (new Date()).getTimezoneOffset()) => {
    const date = (new Date((new Date()).getTime() - timezoneOffset * 60000));
    const pureTimeStr = date.toISOString().replace(/\.\d{0,3}(Z?)$/g, '');
    return pureTimeStr.replace(/[T\:]/g, '-').replace(/-/g, '_');
  }

  logger.start = (logPath, fileName) => {
    logger.status = 1;
    logger.confirmWriteDirectory(logPath);
    logger.logStream = server.fileSystem.createWriteStream(`${logPath}/${fileName}`, {flags: 'aw'});
  }

  logger.log = (string) => {
    logger.logStream.write(string)
  };

  logger.finish = () => {
    logger.status = 0;
    logger.logStream.end();
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
