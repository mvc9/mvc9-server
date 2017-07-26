const router = {};

router.toResFolder = (domain, vhostList) => {
  let folder = '';
  vhostList.map((vhost, index) => {
    if (domain === vhost.Domain) {
      folder = vhost.RootFolder;
    }
  })
  return folder;
}

router.toRes = (pathname, rootPath, routeConfig) => {
  const regExpPath = new RegExp('/([^\\.]+/)+');
  const regExpSuffix = new RegExp('[^\\.]+$')
  const pathSplit = (pathname.match(regExpPath) || [])[0];
  const paths = pathname.split(pathSplit);
  const target = paths[paths.length - 1];
  let resLink = {
    type: 'file',
    rootPath: rootPath,
    path: pathSplit,
    target: target

  };
  let targetSuffix = target.match(regExpSuffix) || [];
  if (targetSuffix[0] !== target) {
    routeConfig.apiSuffix.map((apiMark, index) => {
      if (targetSuffix[0] === apiMark) {
        resLink.type = 'api';
      }
    });
  } else {
    resLink.type = 'page';
  }
  return resLink;
}

router.loadRes = (resLink) => {
  switch (resLink.type) {
    default: break;
    case 'page':
        resLink.target === '/' ?
        resLink.target = `\\index.${config.route.pageSuffix}` : resLink.target = `${resLink.target}.${config.route.pageSuffix}`;
    case 'file':
    case 'page':
        const fileData = modules.buffer.readRes(`${resLink.rootPath}${resLink.target}`);
      return fileData === false ? false : fileData;
      break;
    case 'api':
        return true;
  }
  return 0;
}

module.exports = router;
