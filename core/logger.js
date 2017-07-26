/* logger */
const logger = {};
const logDirectory = config.server.logAccess || config.rootDirectory + '/log';

// ensure log directory exists
fileSystem.existsSync(logDirectory) || fileSystem.mkdirSync(logDirectory);

logger.getLogFileName = () => {
  return `${logDirectory}/access-log-${(new Date((new Date()).getTime() - (new Date()).getTimezoneOffset() * 60000).toISOString()).split('T')[0]}.html`;
}

// logger.lastLogFileName = logger.getLogFileName();

// create a rotating write stream
logger.accessLogStream = fileStreamRotator.getStream({
  filename: logger.lastLogFileName || `${logDirectory}/.loginit`,
  verbose: false
});

logger.log = (content, charset) => {
  charset = charset || config.server.Charset;
  if (config.server.WriteLog) {
    if (logger.lastLogFileName !== logger.getLogFileName()) {
      logger.lastLogFileName = logger.getLogFileName();
      accessLogStream.write(logger.accessLogFoot(), charset);
      logger.accessLogStream.emit('new', logger.lastLogFileName);
      accessLogStream.write(logger.accessLogHead(), charset);
    }
    accessLogStream.write(content, charset);
  }
};

logger.accessLogHead = () => {
  let string = new String();
  string = `<!doctype html><header><title>Access Log: ${logger.lastLogFileName}</title><meta charset="${config.server.Charset}"></header>`;
  string = string + '<body style="background-color:#f6f6f6;color:#666;font-size:13px;font-family:micorsoft yahei;Arial;helvetica">';
  string = string + '\r\n<table style="margin:5% auto;">\r\n';
  return string;
};

logger.acccessLogBody = (access) => {
  let string = '<tr>';
  for (let item in access) {
    string = string + '<td style="max-width:150px;padding:6px;border-bottom:#aaa 1px dashed;text-align:right;">' + item + ':</td><td style="max-width:275px;word-break:break-all;padding:6px;border-bottom:#aaa 1px dashed;text-align:left;">' + access[item] + '</td>';
  }
  string = string + '</tr>\r\n';
};

logger.accessLogFoot = () => {
  let string = new String();
  string = '</table></body></html>';
  return string;
};

// exports the logger
module.exports = logger;
