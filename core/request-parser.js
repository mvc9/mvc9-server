/* http-info */

const httpInfo = {};

httpInfo.getIP = (req) => {
  const ipPath = [];
  req.ip && ipPath.push({type: 'ip', addr: req.ip});
  req.headers['x-forwarded-for'] && ipPath.push({type: 'x-forwarded-for', addr: req.headers['x-forwarded-for']});
  req.connection && req.connection.remoteAddress && ipPath.push({type: 'connection.remoteAddress', addr: req.connection.remoteAddress});
  req.socket && req.socket.remoteAddress && ipPath.push({type: 'socket.remoteAddress', addr: req.socket.remoteAddress});
  req.connection && req.connection.socket && req.connection.socket.remoteAddress && ipPath.push({type: 'connection.socket.remoteAddress', addr: req.connection.socket.remoteAddress});
  return ipPath
}

httpInfo.extract = (req) => {
  const info = {};
  info['method'] = req.method;
  info['url'] = req.url;
  info['pathname'] = req._parsedUrl.pathname;
  info['host'] = req.hostname || '';
  // info['domain'] = (info['host'].match(/[^\:]+/) || [''])[0];
  // info['port'] = (info['host'].match(/:[^\:]+$/) || [':80'])[0];
  info['clientAddress'] = ((httpInfo.getIP(req)[0] || {addr: ''}).addr.match(/((\.)?\d{1,3}){4}/g) || ['unknown']) || [0];
  // info['dateTime'] = (new Date((new Date()).getTime() - (new Date()).getTimezoneOffset() * 60000).toISOString()).replace('T', ' ');
  info['userAgent'] = req.headers['user-agent'];
  info['headers'] = req.headers;
  info['body'] = req.body;
  return info;
}

httpInfo.generateReport = (request) => {
  const req = request;
  let string = '';
  string = '<!doctype html><header><title>req Infomation</title><meta charset="utf-8"></header>';
  string = string + '<body style="background-color:#f6f6f6;color:#666;font-size:13px;font-family:micorsoft yahei;Arial;helvetica">';
  string = string + '<table style="margin:5% auto;">';
  for (let item in req) {
    string = string + '<tr><td style="max-width:300px;padding:6px;border-bottom:#aaa 1px dashed;">' + item + ':</td>'
      + '<td style="max-width:500px;word-break:break-all;padding:6px;border-bottom:#aaa 1px dashed;">'
      + ((req[item].constructor && req[item].constructor.name) === 'Object' ? Object.keys(req[item]).map((key)=>{return `${key}: ${req[item][key]}<br />`}).join('') : req[item])
      + '</td></tr>';
  }
  string = string + '</table>';
  string = string + '</body></html>';
  return string;
}

module.exports = httpInfo;
