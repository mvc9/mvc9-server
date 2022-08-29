const { response } = require("express");

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
          case 'controller':
            if (routeRes.data.name === 'reqControl') {
              req.reqInfo = reqInfo;
              // routeRes.data(req, res);
              res.status(505);
              res.end();
            } else {
              mvc9.logger.log({msg: `Router: Wrong controller function name of url "${routePath}", request will return error 500.`, type: -1});
              res.status(500);
              res.end();
            }
          break;
        }
      } else {
        res.status(404);
        res.end();
      }
    }
  }
}
