
var API_LIST = {
  'USER_GETINFO': '/api/userInfo/get', // method = get
  'USER_MYPACK_PACKLIST': '/apps/lists', // method = get, param: token(baseUtil.userToken)
  'USER_MYPACK_MYPURCHASE': '/user/my-services', // method = get, param: type(type=1封装,type=2签名,type=3分发)
  'USER_MYPACK_DETAIL': '/apps/detail', // method = get, param: appId
  'USER_MYPACK_DELETE_APP': '/apps/delete', // method = post, param: appId
  'APP_DOWNLOAD_PREVIEW_INFO': '/apps/preview', // method = get, param: appId
  'NULL': '/null' // null
};

var CONSTANT = {};

CONSTANT.ACCESS_LOGIN_URL_REGEXP = /^\/(user|setting)\//gi;

CONSTANT.APPPREVIEWLINK = location.hostname + '/download/preview/p/';

CONSTANT.APPDEVICE = {
  '1': '安卓',
  '2': '苹果',
  '3': '安卓和苹果'
};

var baseUtil = {};

baseUtil.DAFUPAGESERVER = {
  'DEV': 'vue.dafu.im',
  'TEST': 'test.dafu.im',
  'PROD': 'dafu.im'
};

baseUtil.DAFUAPISERVER = {
  'DEV': '//api.dafu.im',
  'TEST': '//dev.dafu.im',
  'PROD': '//api.dafu.im'
};

baseUtil.getApiHost = function() {
  var hostName = location.hostname;
  switch (hostName) {
    case baseUtil.DAFUPAGESERVER.DEV:
      return baseUtil.DAFUAPISERVER.DEV;
    case baseUtil.DAFUPAGESERVER.TEST:
      return baseUtil.DAFUAPISERVER.TEST;
    case baseUtil.DAFUPAGESERVER.PROD:
      return baseUtil.DAFUAPISERVER.PROD;
    default:
      $x.logLevel = 9;
      return baseUtil.DAFUAPISERVER.DEV
  }
};

baseUtil.apiHost = baseUtil.getApiHost();

baseUtil.userToken = localStorage.getItem('userToken');

var onRequestSuccess = function(status, data, success) {
  var reciveData = {};
  var responseStatus = false;
  var ok = false
  var errMsg = '';
  try {
    reciveData = JSON.parse(data)
    responseStatus = reciveData.code;
  } catch (err) {
    responseStatus = -1;
  }
  if (String(responseStatus) === '200') {
    ok = true;
    reciveData = reciveData.data;
  } else if (responseStatus !== -1) {
    errMsg = reciveData.msg;
  }
  success({httpOk: Boolean(String(status).match(/2\d\d/g)), messageStatus: responseStatus, ok: ok, errMsg: errMsg}, reciveData);
};

baseUtil.get = function(options) {
  if (options.content && options.content.constructor.name === 'Object') {
    options.queryString = '?';
    options.queryArray = [];
    for (var queryKey in options.content) {
      if (options.content.hasOwnProperty(queryKey))
      options.queryArray.push(queryKey + '=' + options.content[queryKey])
    }
    options.queryString = options.queryString + options.queryArray.join('&');
  }
  options.url = baseUtil.apiHost + options.url + (options.queryString || '');
  options.name = options.url;
  options.contentType = 'application/json';
  options.header = options.header || {};
  options.header.token = baseUtil.userToken;
  options.then = function (status, data) {
    onRequestSuccess(status, data, options.success)
  };
  return $x.httpCom(options);
};

baseUtil.post = function(options) {
  options.name = options.url;
  options.url = baseUtil.apiHost + options.url
  options.method = 'POST';
  options.contentType = 'application/json';
  options.header = options.header || {};
  options.header.token = baseUtil.userToken;
  options.then = function (status, data) {
    onRequestSuccess(status, data, options.success)
  };
  return $x.httpCom(options);
};

baseUtil.paramToArray = function () {
  var pathname = location.pathname;
  var pathnameParamRegex = new RegExp('(/(?!p/)[^/]+)+$', 'g');
  var splitParamRegex = new RegExp('[^/]+', 'g');
  var pathnameParam = (pathname.match(pathnameParamRegex) || [''])[0];
  return pathnameParam.match(splitParamRegex) || []
};

baseUtil.paramArray = baseUtil.paramToArray();

baseUtil.openLinkAnchor = function (url, target) {
  var anchorDom = document.createElement('a');
  anchorDom.href = url || '#';
  anchorDom.target = target || '_blank';
  return anchorDom;
};

baseUtil.canvasQuickDraw2D = function (options) {
  option = {
    canvasWidth: options.width || 256,
    canvasHeight: options.height || 256,
    canvasBackgroundColor: options.backgroundColor || 'rgba(0, 0, 0, 0)',
    drawImages: options.drawImages || [
      // {
      //   imgElement: imgElement,
      //   marginLeft: 0,
      //   marginTop: 0
      // }
    ],
    drawTexts: options.drawTexts || [
      // {
      //   font: '12px verdana',
      //   text: 'test',
      //   fontColor: '#00f',
      //   marginLeft: 10,
      //   marginBottom: 20
      // }
    ],
    base64ImageType: options.base64ImageType || 'image/png'
  };

  var elementCanvas = document.createElement('canvas');
  elementCanvas.width = option.canvasWidth;
  elementCanvas.height = option.canvasHeight;
  var ctx = elementCanvas.getContext('2d');
  ctx.fillStyle = option.canvasBackgroundColor;
  ctx.fillRect(0, 0, option.canvasWidth, option.canvasHeight);
  for (var imageIndex = 0; imageIndex < option.drawImages.length; imageIndex++) {
    ctx.drawImage(option.drawImages[imageIndex].imgElement, option.drawImages[imageIndex].marginLeft, option.drawImages[imageIndex].marginTop);
  }
  for (var textIndex = 0; textIndex < option.drawTexts.length; textIndex++) {
    ctx.font = option.drawTexts[textIndex].font;
    ctx.fillStyle = option.drawTexts[textIndex].fontColor;
    ctx.fillText(option.drawTexts[textIndex].text, option.drawTexts[textIndex].marginLeft, option.drawTexts[textIndex].marginBottom);
  }
  return elementCanvas.toDataURL(option.base64ImageType);
};
