
module.exports = function (mvc9, serveType) {
  return (req, res) => {
    if (serveType === 'request') {
      const reqInfo = mvc9.modules.parser.extract(req);
      const routes = mvc9.modules.router.routes;
      const routePath = reqInfo.pathname.replace(/\/\//g, '/');
      const routeRes = routes[routePath];
      if (routeRes) {
        switch (routeRes.type) {
          default:
            res.type(routeRes.type);
            res.end(routeRes.data);
          break;
          case 'request':
            if (routeRes.data.name === 'requestControl') {
              req.reqInfo = reqInfo;
              try {
                mvc9.logger.log({msg: `REQUEST: status=${200} client=${reqInfo.IPv4} method=${reqInfo.method} host=${reqInfo.host} URL=${reqInfo.url} bodyLenth=${reqInfo.body && reqInfo.body.length !== undefined ? reqInfo.body.length : 'null'}`, type: 3});
                routeRes.data(mvc9)(req, res);
              } catch (err) {
                mvc9.logger.log({msg: `REQUEST: status=${500} client=${reqInfo.IPv4} method=${reqInfo.method} host=${reqInfo.host} URL=${reqInfo.url} bodyLenth=${reqInfo.body && reqInfo.body.length !== undefined ? reqInfo.body.length : 'null'}`, type: 3});
                mvc9.logger.log({msg: err, type: -1});
                res.status(505);
                res.end();
              }
            } else {
              mvc9.logger.log({msg: `Router: Wrong controller function name of url "${routePath}", request will return error 500.`, type: -1});
              res.status(501);
              res.end();
            }
          break;
        }
      } else {
        mvc9.logger.log({msg: `REQUEST: status=${404} [${reqInfo.IPv4}] method=${reqInfo.method} host=${reqInfo.host} URL=${reqInfo.url} bodyLenth=${reqInfo.body ? reqInfo.body.length : null}`, type: 3});
        res.status(404);
        res.end();
      }
    }
  }
}
