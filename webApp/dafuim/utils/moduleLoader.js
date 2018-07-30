(function () {
  // pathname对应的js加载列表
  var moduleLoadList = {
    '/': {
      script: [
        '/utils/slide.mvc9.js'
      ],
      css: []
    },
    '/index': {
      script: [
        '/utils/slide.mvc9.js'
      ]
    },
    '/download/preview': {
      script: [
        '/utils/qrcode.js',
        '/utils/clipboard.min.js'
      ]
    },
    '/user/pack/list': {
      script: [
        '/utils/qrcode.js'
      ]
    },
    '/user/pack/detail': {
      script: [
        '/utils/qrcode.js'
      ]
    }
  }

  var pathname = location.pathname;
  var pathnameNoParamRegex = new RegExp('^(/(?!p/)[^/]+)+', 'g');
  var matchedPathName = (pathname.match(pathnameNoParamRegex) || ['/'])[0];

  if (moduleLoadList[matchedPathName] && moduleLoadList[matchedPathName].css && moduleLoadList[matchedPathName].css.hasOwnProperty('length')) {
    var currentCSSList = moduleLoadList[matchedPathName].css || []
    for (var cssIndex = 0; cssIndex < currentCSSList.length; cssIndex++) {
      document.writeln('<link href="' + currentCSSList[cssIndex] + '" rel="stylesheet" />');
    }
  }

  if (moduleLoadList[matchedPathName] && moduleLoadList[matchedPathName].script && moduleLoadList[matchedPathName].script.hasOwnProperty('length')) {
    var currentScriptList = moduleLoadList[matchedPathName].script || []
    for (var scriptIndex = 0; scriptIndex < currentScriptList.length; scriptIndex++) {
      document.writeln('<script src="' + currentScriptList[scriptIndex] + '"></script>');
    }
  }

  // 自动初始化页面渲染
  $x.load(function(m) {
    var bootUpCompile = function() {
      $x.browserInit();
      for (var n = 0; n < $x.mapNode.molds.length; n++) {
        try {
          $x.mapNode.compile($x.mapNode.molds[n].path);
        } catch (err) {
          console.error(err);
        }
      }
      document.body.style.visibility = 'visible';
    };
    setTimeout(bootUpCompile, 100);
  })
})();
