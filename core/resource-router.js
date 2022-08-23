/* map file generate resource map */

const fileSystem = require('fs');

const resRouter = {};

resRouter.routes = {};

resRouter.mapFileSync = (dirPath, charset = 'UTF-8') => {
  const fileList = [];
  const mapDirFiles = (dirPath) => {
    const dirFiles = fs.readdirSync(dirPath);
    dirFiles.map((fileName) => {
      const filePath = path.join(dirPath, fileName);
      if (fs.statSync(filePath).isDirectory()) {
        mapDirFiles(filePath);
      } else {
        const fileData = fs.readFileSync(filePath, charset);
        fileList.push({
          fileName,
          fileData,
          filePath
        });
      }
    });
  }
  mapDirFiles(dirPath);
  return fileList;
}

resRouter.updateRoute = (path) => {
  const file = 
};

resRouter.updateRoutes = (paths) => {};

resRouter.initRoutes = () => {};

module.exports = resRouter;
