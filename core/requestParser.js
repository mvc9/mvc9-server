/* reqestParser */

const reqestParser = {};

reqestParser.extract = (request) => {
  const reqParse = {};
  reqParse['method'] = request.method;
  reqParse['url'] = request.url;
  reqParse['pathname'] = request._parsedUrl.pathname;
  reqParse['host'] = request.headers['host'] || '';
  reqParse['domain'] = (reqParse['host'].match(/[^\:]+/) || [''])[0];
  reqParse['port'] = (reqParse['host'].match(/:[^\:]+$/) || [':80'])[0];
  reqParse['clientAddress'] = (
    (
      request.ip ||
      request.headers['x-forwarded-for'] ||
      request.connection.remoteAddress ||
      request.socket.remoteAddress ||
      request.connection.socket.remoteAddress ||
      ''
    )
    .match(/\d+\.\d+\.\d+\.\d+$/g) || ['unknown'])[0];
  reqParse['dateTime'] = (new Date((new Date()).getTime() - (new Date()).getTimezoneOffset() * 60000).toISOString()).replace('T', ' ');
  reqParse['userAgent'] = request.headers['user-agent'];
  reqParse['headers'] = request.headers;
  reqParse['body'] = request.body;
  return reqParse;
}

reqestParser.generateReport = (request) => {
  const req = request;
  let string = '';
  string = '<!doctype html><header><title>Request Infomation</title><meta charset="utf-8"></header>';
  string = string + '<body style="background-color:#f6f6f6;color:#666;font-size:13px;font-family:micorsoft yahei;Arial;helvetica">';
  string = string + '<table style="margin:5% auto;">';
  for (let item in req) {
    string = string + '<tr><td style="max-width:300px;padding:6px;border-bottom:#aaa 1px dashed;">' + item + ':</td>'
      + '<td style="max-width:500px;word-break:break-all;padding:6px;border-bottom:#aaa 1px dashed;">'
      + (req[item].constructor.name === 'Object' ? Object.keys(req[item]).map((key)=>{return `${key}: ${req[item][key]}<br />`}).join('') : req[item])
      + '</td></tr>';
  }
  string = string + '</table>';
  string = string + '</body></html>';
  return string;
}

module.exports = reqestParser;
