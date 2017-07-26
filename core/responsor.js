module.exports = (request, response) => {
  const timeStamp = (new Date()).getTime();
  response.set('X-Date-Time', (new Date()).toLocaleString());
  response.set('X-Powered-By', config.server.ServerName);

  const comparse = modules.parser.extract(request);
  // response.send(modules.parser.generateReport(comparse));
  // return;

  const responseponseErrorPage = (path, status) => {
    let pageDocument = '';
    if (config.server.ErrorPage) {
      pageDocument = fileSystem.readFileSync(`${path}\\${config.server.ErrorPage}\\${status}.${config.route.pageSuffix}`);
    }
    response.contentType('text/html');
    response.status(status).send(pageDocument);
    comparse.status = status;
  }

  const webrootPath = `${config.rootDirectory}\\webroot`;
  const vhostFolder = modules.router.toresponseFolder(comparse.host, config.vhost);
  if (!vhostFolder) {
    responseponseErrorPage(webrootPath, 403);
    return;
  }
  const vhostresponsePath = `${webrootPath}\\${vhostFolder}`;
  const responseLink = modules.router.toresponse(comparse.pathname, vhostresponsePath, config.route);
  const responseData = modules.router.loadresponse(responseLink);
  if (responseData === false) {
    responseponseErrorPage(webrootPath, 404);
    return;
  }
  response.send(`vhostresponsePath: ${vhostresponsePath}<br />responseLink: ${JSON.stringify(responseLink)}<br />responseData: ${responseData}`);
}
