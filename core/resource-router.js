/* map file generate resource map */

const fileSystem = require('fs');
const path = require('path')

const resRouter = {};

resRouter.routes = {};

resRouter.mapFileSync = (dirPath) => {
  const fileList = [];
  const mapDirFiles = (dirPath) => {
    const dirFiles = fileSystem.readdirSync(dirPath);
    dirFiles.map((fileName) => {
      const filePath = path.join(dirPath, fileName);
      if (fileSystem.statSync(filePath).isDirectory()) {
        mapDirFiles(filePath);
      } else {
        const fileData = fileSystem.readFileSync(filePath, {encoding: null, flag: 'r'});
        fileList.push({
          fileName,
          filePath,
          fileData
        });
      }
    });
  }
  mapDirFiles(dirPath);
  return fileList;
}

resRouter.fileMapToRoute = (fileMap) => {
  fileMap.forEach((fileItem) => {
    const urlPath = fileItem.filePath.replace(resRouter.rootPath, '').replace(/\\/g, '/');
    if ((/\.c\.js$/g).test(urlPath)) {
      const path = urlPath.replace(/\.c\.js$/g, '');
      const routeRes = {type: 'request', data: require(fileItem.filePath)};
      resRouter.routes[path] = routeRes;
    } else if ((/\.ws\.js$/g).test(urlPath)) {
      const path = urlPath.replace(/\.ws\.js$/g, '');
      const routeRes = {type: 'websocket', data: require(fileItem.filePath)};
      resRouter.routes[path] = routeRes;
    } else {
      const path = urlPath.replace(/\.\w+$/g, '');
      const fileType = (urlPath.match(/\.\w+$/g) || [''])[0];
      const routeRes = {type: fileType, data: fileItem.fileData};
      resRouter.routes[urlPath] = routeRes;
      if ((/html$/g).test(fileType)) {
        if (!resRouter.routes[path]) {
          resRouter.routes[path] = routeRes;
        }
      }
    }
  })
}

resRouter.updateRoutes = (rootPath) => {
  const fileMap = resRouter.mapFileSync(rootPath);
  resRouter.fileMapToRoute(fileMap);
};

resRouter.initRoutes = (rootPath) => {
  resRouter.routes = {};
  resRouter.rootPath = rootPath;
  resRouter.updateRoutes(rootPath);
  if (resRouter.routes['/index']) {
    resRouter.routes['/'] = resRouter.routes['/index'];
  }
};

module.exports = resRouter;
