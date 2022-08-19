module.exports = function defender (mvc9) {
  const requestParser = require('./request-parser');
  const defenderConfig = mvc9.config.defender || {};
  mvc9.defender = {
    ...defenderConfig,
    accessCount: 0,
    defendCount: 0,
    scannorInterval: null,
    accessList: [],
    addWhiteList: (ip, time) => {
      if (ip) {
        mvc9.defender.whiteList[ip] = time;
        mvc9.logger.log({msg: `Defender: Add ip:${ip} to white list, expires = ${time}`});
      }
    },
    addBlackList: (ip, time) => {
      if (ip) {
        mvc9.defender.blackList[ip] = time;
        mvc9.logger.log({msg: `Defender: Add ip:${ip} to black list, expires = ${time}`});
      }
    }
  };

  if (mvc9.defender.enabled) {
    mvc9.defender.Scannor = setInterval(() => {
      const defender = mvc9.defender;
      const accessIPCount = {};
      const nowTime = (new Date()).getTime();
      defender.accessList.forEach((c) => {
        const isExsist = accessIPCount[c];
        if (isExsist) {
          accessIPCount[c] = isExsist + 1;
        } else {
          accessIPCount[c] = 1;
        }
      })
      for (let ipC in accessIPCount) {
        if (accessIPCount[ipC] >= defender.deniedFrequency) {
          defender.addBlackList(ipC, nowTime + defender.denyTime);
        }
      }
      defender.accessList = [];
      mvc9.logger.log({msg: `Defender Report: Normal access: ${defender.accessCount} times.`});
      mvc9.logger.log({msg: `Defender Report: Defend attack: ${defender.defendCount} times.`});
    }, mvc9.defender.scanDuration);
  }

  function defenderMiddleware() {
    const param = {};
    const n = ['req', 'res', 'next'];
    const e = ['err', 'req', 'res', 'next'];
    const p = arguments.length === 4 ? e : n;

    p.forEach((key, i) => {
      param[key] = arguments[i];
    })

    const reqInfo = requestParser.extract(param.req);

    const defender = mvc9.defender;

    if (param.err && defender.enabled) {
      param.res.end();
    }

    if (defender.enabled) {
      const nowTimeInt = (new Date()).getTime();
      const clientIP = reqInfo['IPv4'];
      const white = defender.whiteList[clientIP];
      const black = defender.blackList[clientIP];
      if (white) {
        if (white > nowTimeInt) {
          param.next();
          return;
        } else {
          delete defender.whiteList[clientIP];
        }
      }
      if (black) {
        if (black > nowTimeInt) {
          param.req.destroy();
          defender.defendCount = defender.defendCount + 1;
          return;
        } else {
          delete defender.blackList[clientIP];
        }
      }
      if (defender.accessList.length <= defender.accessListSize) {
        defender.accessList.push(clientIP);
      } else {
        defender.accessList.shift();
        defender.accessList.push(clientIP);
      }
    }
    
    defender.accessCount = defender.accessCount + 1;
    param.res.removeHeader('X-Powered-By');
    param.res.send(requestParser.generateReport(reqInfo));
    param.res.end();
    param.next();
  }

  return defenderMiddleware;
}
