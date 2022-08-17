const router = {};

router.toResFolder = (domain, port, vhostList) => {
  const parsePort = parseInt(port.replace(':', ''));
  let folder = '';
  vhostList.map((vhost, index) => {
    if (domain === vhost.Domain && parsePort === vhost.Port) {
      folder = vhost.RootFolder;
    }
    if (domain === vhost.Domain2 && parsePort === vhost.Port) {
      folder = vhost.RootFolder;
    }
  })
  return folder;
}

router.toRes = (pathname, rootPath, routeConfig) => {
  const matchPath = (pathName) => {
    const pathnameNoParamRegex = new RegExp('^(/(?!p/)[^/]+)+', 'g');
    const pathNameNoParam = (pathName.match(pathnameNoParamRegex) || ['/'])[0];
    const regExpPath = new RegExp('/([^\\/]+/)+');
    const regExpSuffix = new RegExp('[^\\.]+$');
    const pathSplit = (pathNameNoParam.match(regExpPath) || [])[0] || '/';
    const paths = pathNameNoParam.split(pathSplit);
    const target = paths[paths.length - 1] || 'index';
    const targetSuffix = target.match(regExpSuffix) || [];
    return {
      type: 'file',
      rootPath: rootPath,
      path: pathSplit,
      target: target,
      targetSuffix: targetSuffix[0]
    };
  }

  let resLink = matchPath(pathname);
  if (resLink.targetSuffix !== resLink.target) {
    if (resLink.target.match(new RegExp(`\\.${routeConfig.controllerSuffix}`))) {
      resLink.type = 'controller';
    }
  } else {
    Object.keys(routeConfig.redirect || {}).map((matchKey) => {
      const matchRegex = new RegExp(matchKey);
      if (matchRegex.test(pathname)) {
        resLink = matchPath(routeConfig.redirect[matchKey]);
      }
    })
    resLink.type = 'page';
  }
  return resLink;
}

router.loadRes = (resLink) => {
  switch (resLink.type) {
    case 'page':
      resLink.charset = config.server.Charset;
      resLink.targetSuffix = 'html';
      resLink.target === '/' ?
      resLink.target = `index.${config.route.pageSuffix}` : resLink.target = `${resLink.target}.${config.route.pageSuffix}`;
    case 'file':
      resLink.charset = resLink.charset || config.server.FileCharset;
      const fileData = modules.buffer.readRes(`${resLink.rootPath}${resLink.path}${resLink.target}`, resLink.charset);
      return fileData === false ? false : fileData;
      break;
    case 'controller':
      return false;
  }
  return 0;
}

module.exports = router;
