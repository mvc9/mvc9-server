/* reqestParser */

const reqestParser = {};

reqestParser.extract = (request) => {
  const reqParse = {};
  reqParse['method'] = request.method;
  reqParse['url'] = request.url;
  reqParse['pathname'] = request._parsedUrl.pathname;
  reqParse['host'] = request.headers['host'];
  // reqParse['serverport'] = request.connection.server._connectionKey.match(/\d+$/g)[0];
  reqParse['clientAddress'] = (request.headers['x-forwarded-for'] ||
    request.connection.remoteAddress ||
    request.socket.remoteAddress ||
    request.connection.socket.remoteAddress ||
    '').match(/\d+\.\d+\.\d+\.\d+$/g)[0];
  reqParse['dateTime'] = (new Date((new Date()).getTime() - (new Date()).getTimezoneOffset() * 60000).toISOString()).replace('T', ' ');
  reqParse['userAgent'] = request.headers['user-agent'];
  // for (let item in request.headers) {
  //   reqParse[item] = request.headers[item];
  // }
  return reqParse;
}

reqestParser.generateReport = (request) => {
  let req = request;
  let string = new String();
  string = '<!doctype html><header><title>Request Infomation</title><meta charset="utf-8"></header>';
  string = string + '<body style="background-color:#f6f6f6;color:#666;font-size:13px;font-family:micorsoft yahei;Arial;helvetica">';
  string = string + '<table style="margin:5% auto;">';
  for (let item in req) {
    string = string + '<tr><td style="max-width:300px;padding:6px;border-bottom:#aaa 1px dashed;">' + item + ':</td><td style="max-width:500px;word-break:break-all;padding:6px;border-bottom:#aaa 1px dashed;">' + req[item] + '</td></tr>';
  }
  string = string + '</table>';
  string = string + '</body></html>';
  return string;
}

module.exports = reqestParser;
