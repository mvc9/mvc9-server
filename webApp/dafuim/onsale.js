$x.load(function(m) {
  $x.mapNode.getMold(['content'], function(mold) {
    mold.afterCompile = function (m) {
      $x.mapNode.xEvent('apk-upload', 'change', function(event) {
        var files = event.target.files;
        var queue1 = [
          function(op, qm) {
            var nextQueueOffset = +3;
            qm.filename = files[0].name;
            qm.filesize = files[0].size;
            qm.filesuffix = (qm.filename.match(/.[^\.]+$/g)[0] || ['']);
            qm.iconContent = 'data:image/png;base64,';
            switch (qm.filesuffix) {
              case '.apk':
                m.appFileType = '安卓APP';
                nextQueueOffset = +1;
                break;
              case '.ipa':
                m.appFileType = 'iOS APP';
                nextQueueOffset = +2;
                break;
              default:
                op.errorAndExit('file type error!');
                alert('请选择apk包或者ipa包！');
                break;
            }
            var appZip = new JSZip();
            appZip.loadAsync(files[0]).then(function (thisZip) {
              qm.appZip = thisZip;
              op.to(nextQueueOffset);
            }).catch(op.errorAndNext);
          },
          function(op, qm) {
            // if is *.apk
            var androidIconRegexp = new RegExp('.*(drawable).*(/icon.png)$','g');
            var iconZipPaths = [];
            Object.keys(qm.appZip.files).map(function(filePath) {
              if (filePath.match(androidIconRegexp)) {
                console.log('icon file path:', filePath);
                iconZipPaths.push(filePath);
              }
            });
            console.log('iconZipPaths', iconZipPaths);
            var longerPath = '';
            iconZipPaths.map(function(path) {
              if (path.length > longerPath.length) {
                longerPath = path;
              }
            });
            qm.iconPath = longerPath;
            op.to(+2);
          },
          function (op, qm) {
            // if is *.ipa
            var iOSIconRegexps = [
              new RegExp('.*(AppIcon60).*(3x).*(.png)$','gi'),
              new RegExp('.*(AppIcon60).*(.png)$','gi'),
              new RegExp('.*(AppIcon40).*(.png)$','gi'),
              new RegExp('.*(AppIcon).*(.png)$','gi')
            ];
            iOSIconRegexps.map(function(regexp) {
              Object.keys(qm.appZip.files).map(function(filePath) {
                if (filePath.match(regexp) && !qm.iconPath) {
                  console.log('icon file path:', filePath);
                  qm.iconPath = filePath;
                }
              });
            });
            op.next();
          },
          function (op, qm) {
            qm.appZip.file(qm.iconPath).async('base64').then(function(content) {
              qm.iconContent = qm.iconContent + content;
              op.next();
            }).catch(op.errorAndNext);
          },
          function (op, qm) {
            m.appIconContent = qm.iconContent;
            m.appFileSize = qm.filesize;
            $x.mapNode.compile(['content', 'manifestResult']);
            op.next();
          }
        ];
        asyncQueue(queue1, function(qm) {
          console.log('queueMem: ', qm);
        });

        // var zipOriginFiles = {};
        // console.log('uploadChange: ', e);
        // var files = e.target.files;
        // console.log('files:', files);
        // var appZip = new JSZip();
        // var postAPKBinary;
        // appZip.loadAsync(files[0]).then(function(thisZip) {
        //   console.log('appZip:', thisZip);
        //   const newAppXmlPack = {};
        //   zipOriginFiles = thisZip.files;
        //   Object.keys(thisZip.files).map((filePathName, index) => {
        //     if (filePathName.match(/((AndroidManifest\.xml)|(\.arsc))$/)) {
        //       newAppXmlPack[filePathName] = thisZip.files[filePathName];
        //     }
        //   });
        //   thisZip.files = newAppXmlPack;
        //   console.log('APKXMLZip:', thisZip);
        //   thisZip.generateAsync({
        //     type: 'uint8array',
        //     compression: "DEFLATE",
        //     compressionOptions: {
        //       level: 9
        //     }
        //   }).then((binaryString) => {
        //     postAPKBinary = '';
        //     console.log('binaryString:', binaryString.length);
        //     binaryString.map((byte, index) => {
        //       postAPKBinary = postAPKBinary + (byte.toString(16).length - 1 ? '' : '0') + byte.toString(16);
        //     });
        //     console.log('postAPKBinary:', postAPKBinary.length);
        //     // location.href="data:application/zip;base64,"+binaryString;
        //     $x.httpCom({
        //       url: 'functions/apkAnalyse',
        //       method: 'POST',
        //       content: `data=${postAPKBinary}`,
        //       finishCallback: function (status, response) {
        //         var responseObj = JSON.parse(response);
        //         var manifestObjTree = new XML.ObjTree();
        //         var manifestObj = manifestObjTree.parseXML(responseObj.result);
        //         console.log(manifestObj);
        //         m.manifest = manifestObj.manifest;
        //         console.log('zipOriginFiles', zipOriginFiles);
        //         var manifesticonpath = m.manifest['application']['-android:icon'];
        //         var iconpath = (manifesticonpath.match(/[^\@]+/g) || [''])[0];
        //         var iconPathMatch = iconpath.match(/[^\/]+/g) || [''];
        //         var regex = new RegExp('.*('+ iconPathMatch[0] +').*(/'+ iconPathMatch[iconPathMatch.length-1] +'.png)$', 'g');
        //         var iconZipPaths = [];
        //         console.log(regex);
        //         Object.keys(zipOriginFiles).map((filePath) => {
        //           if (filePath.match(regex)) {
        //             console.log('icon file path:', filePath);
        //             iconZipPaths.push(filePath);
        //           }
        //         });
        //         console.log('iconZipPaths', iconZipPaths);
        //         var longerPath = '';
        //         iconZipPaths.map((path) => {
        //           if (path.length > longerPath.length) {
        //             longerPath = path;
        //           }
        //         });
        //         console.log('longerPath:', longerPath);
        //         var iconFile;
        //         thisZip.files = zipOriginFiles;
        //         thisZip.file(longerPath).async("base64").then((content) => {
        //           iconFile = 'data:image/png;base64,' + content;
        //           m.manifest.iconContent = iconFile;
        //           $x.mapNode.compile(['content', 'manifestResult']);
        //         })
        //       }
        //     });
        //   });
        // });
      });
    };
  })
  // $x.mapNode.compile(['content', 'manifest-result']);
}, true);