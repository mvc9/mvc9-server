module.exports = (request, response) => {
  const timeStamp = (new Date()).getTime();
  const comparse = modules.parser.extract(request);
  comparse.status = 200;

  if (config.server.RequestDebug) {
    response.send(modules.parser.generateReport(comparse));
    return;
  }

  let responseLink = {};
  let responseContent = '';
  const responseponseErrorPage = (path, status) => {
    let pageDocument = '';
    if (config.server.ErrorPage) {
      pageDocument = modules.buffer.readRes(`${path}\\${config.server.ErrorPage}\\${status}.${config.route.pageSuffix}`, null, false, config.server.BufferTime * 10);
    }
    responseLink = {
      type: 'error',
      targetSuffix: config.route.pageSuffix
    };
    comparse.status = status;
    return pageDocument;
  }

  const webrootPath = `${config.rootDirectory}\\webroot`;
  const vhostFolder = modules.router.toResFolder(comparse.host, config.vhost);
  if (!vhostFolder) {
    responseContent = responseponseErrorPage(webrootPath, 403);
  } else {
    const vhostresponsePath = `${webrootPath}\\${vhostFolder}`;
    responseLink = modules.router.toRes(comparse.pathname, vhostresponsePath, config.route);
    const resData = modules.router.loadRes(responseLink);
    if (resData === false) {
      responseContent = responseponseErrorPage(webrootPath, 404);
    } else {
      responseContent = resData;
    }
  }

  const doResponse = () => {
    response.set('X-Date-Time', (new Date()).toLocaleString());
    response.set('X-Powered-By', config.server.ServerName);
    response.type(responseLink.targetSuffix);
    response.status(comparse.status).send(responseContent);
    response.end();

    comparse.timeCost = (new Date()).getTime() - timeStamp;

    logOnConsole({
      name: 'HTTP',
      content: `STATUS ${comparse.status} | ${comparse.method.toUpperCase()} ${comparse.url} | ${comparse.clientAddress} | ${comparse.timeCost}ms`,
      logLevel: 2
    });
    modules.logger.log(modules.logger.acccessLogBody(comparse));
  }

  switch (responseLink.type) {
    default:
      doResponse();
      break;
    case 'page':
      const controllerFullPath = `${responseLink.rootPath}${responseLink.path}${responseLink.target}.${config.route.controllerSuffix}`;
      const hasController = fileSystem.existsSync(controllerFullPath);
      if (hasController) {
        const compileBuffered = modules.buffer.readMem(`${controllerFullPath}.compile`);
        if (!compileBuffered) {
          const doCompile = new Promise((resolve, reject) => {
            const controller = require(controllerFullPath);
            const control = {
              lib: modules,
              request: comparse,
              path: `${responseLink.rootPath}${responseLink.path}`,
              file: responseLink.target
            };
            resolve(controller(control, responseContent));
          }).then((content) => {
            responseContent = modules.buffer.writeMem(`${controllerFullPath}.compile`, content);
            doResponse();
          }).catch((error) => {
            responseContent = modules.buffer.writeMem(`${controllerFullPath}.compile`, responseponseErrorPage(webrootPath, 500));
            doResponse();
            logOnConsole({
              name: 'CONTROLLER',
              content: error,
              logLevel: 2
            });
          });
          return;
        } else {
          responseContent = compileBuffered;
        }
      }
      doResponse();
      break;
  }
}
