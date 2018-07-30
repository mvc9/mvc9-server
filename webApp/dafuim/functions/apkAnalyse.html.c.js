((c, content) => {
  return (new Promise((resolve, reject) => {
    const asyncQueue = eval(c.lib.buffer.readRes(`${c.rootPath}/utils/asyncQueue.js`));

    const queue = [
      (op, m) => {
        m.errorCallBack = (err) => {
          reject(err);
        };
        op.next();
      },
      (op, m) => {
        m.fileSystem = require('fs');
        m.apkZipFileData = c.request.body.data;
        m.apkPackTime = (new Date).getTime();
        fileSystem.writeFile(`${c.rootPath}/workspace/apk_clear_${m.apkPackTime}.apk`, (new Buffer(m.apkZipFileData, 'hex')), (err) => {
          if (!err) {
            op.next();
          } else {
            throw new Error(err);
          }
        });
      },
      (op, m) => {
        m.apkDecodeProcess = require('child_process');
        m.apkDecodeProcess.exec(
          `java -jar ${c.rootPath}/utils/apktool.jar d apk_clear_${m.apkPackTime}.apk -s -f -o apk_clear_${m.apkPackTime} && cat apk_clear_${m.apkPackTime}/AndroidManifest.xml`,
          {
            cwd: `${c.rootPath}/workspace`
          },
          (error, stdout, stderr) => {
            m.apkDecodeResult = stdout
            op.next();
          }
        );
      },
      (op, m) => {
        m.fileSystem.readFile(`${c.rootPath}/workspace/apk_clear_${m.apkPackTime}/AndroidManifest.xml`, 'UTF-8', (err, data) => {
          if (!err) {
            m.apkReadManifestResult = data
            op.next();
          } else {
            throw new Error(err);
          }
        });
      },
      // (op, m) => {
      //   m.apkDecodeProcess.exec(
      //     `del apk_clear_${m.apkPackTime}.apk && rm -rf apk_clear_${m.apkPackTime}`,
      //     {
      //       cwd: `${c.rootPath}/workspace`
      //     },
      //     (error, stdout, stderr) => {
      //       m.delCacheResult = stdout
      //       op.next();
      //     }
      //   );
      // },
      (op, m) => {
        resolve(`{"success": true, "result": ${JSON.stringify(m.apkReadManifestResult)}}`);
        op.next();
      },
    ];
    asyncQueue(queue);
  }));
});