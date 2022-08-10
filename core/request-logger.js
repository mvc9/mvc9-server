/* logger */
const logger = {};
const logDirectory = config.server.logAccess || config.rootDirectory + '/log';

// ensure log directory exists
fileSystem.existsSync(logDirectory) || fileSystem.mkdirSync(logDirectory);

logger.getCurrentDate = () => {
  return (new Date((new Date()).getTime() - (new Date()).getTimezoneOffset() * 60000).toISOString()).split('T')[0];
}

logger.logFileName = () => 'access-log-%DATE%.html'.replace('%DATE%', logger.getCurrentDate());

logger.lastLogFileName = `${logDirectory}/${logger.logFileName()}`;

// create a rotating write stream
if (config.server.WriteLog) {
  logger.accessLogStream = fileStreamRotator.getStream({
    filename: logger.lastLogFileName,
    date_format: 'YYYY-MM-DD',
    // frequency: 'daily',
    verbose: false,
  });
}

logger.log = (content, charset) => {
  charset = charset || config.server.Charset;
  if (config.server.WriteLog) {
    logger.accessLogStream.write(content, charset);
  }
};

logger.accessLogHead = () => {
  let string = '';
  let isThisLogExsist = fileSystem.existsSync(logger.lastLogFileName);
  if (!isThisLogExsist) {
    string = `<!doctype html><header><title>Access Log: ${logger.getCurrentDate()}</title><meta charset="${config.server.Charset}"></header>`;
    string = string + '<body style="background-color:#f6f6f6;color:#666;font-size:13px;font-family:micorsoft yahei;Arial;helvetica">';
    string = string + '\r\n<style>table tr td {width:auto;max-width:300px;padding:6px;border-bottom:#aaa 1px dashed;word-break:break-all;}</style>\r\n';
    string = string + '\r\n<table style="margin:5% auto;">\r\n';
  }
  return string;
};

logger.acccessLogBody = (access) => {
  let string = '<tr>';
  for (let item in access) {
    string = string + '<td>' + item + ':</td><td>' + access[item] + '</td>';
  }
  string = string + '</tr>\r\n';
  return string;
};

logger.accessLogFoot = () => {
  let string = new String();
  string = '</table></body></html>';
  return string;
};

// exports the logger
module.exports = logger;
