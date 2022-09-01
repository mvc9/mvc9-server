(function (env) {
  'use strict';

  /* init $mvc object */
  var root = {};
  var $mvc = {
    "name": "mvc9.es5.js",
    "build": 100000,
    "logLevel": 0
  };

  $mvc.isNodeRuntime = !Boolean(env.navigator);
  $mvc.isNodeRuntime ? root = global : root = window;
  $mvc.root = root;

  var m = {};
  var xEventListeners = [];
  var addEventListenerApi = 'addEventListener';
  var removeEventListenerApi = 'removeEventListener';
  var listenerApiPrefix = '';
  var browserInitFlag = false;
  var onloadQueue = [];

  $mvc.browser = {};
  $mvc.browser.H5Support = Boolean(root.applicationCache);


  /*  @description display console messages when $mvc.mode='dev';
   *  @param {String} command log,time,timeEnd,group,groupEnd
   *  @param {String} message log message or group name
   *  @param {String} color style color
   */
  $mvc.console = function (command, message, color, logLevel) {
    logLevel = logLevel || 1;
    if ($mvc.logLevel >= logLevel) {
      if ($mvc.browser.H5Support) {
        switch (command) {
          case 'time':
            console.time(message);
            break;
          case 'timeEnd':
            console.timeEnd(message);
            break;
          case 'group':
            color = color || '#666';
            console.group('%c' + message, 'color:' + color);
            break;
          case 'groupEnd':
            console.groupEnd(message);
            break;
          case 'log':
            color = color || '#111';
            console.log('%c' + message, 'color:' + color);
            break;
          case 'warn':
            color = color || 'f96';
            console.warn('%c' + message, 'color' + color);
            break;
          default:
            console[command](message);
            break;
        }
      } else {
        switch (command) {
          default:
            console.log(message);
            break;
          case 'warn':
            console.warn(message);
            break;
          case 'error':
            console.error(message);
            break;
        }
      }
    }
  }

  /*=====  example XHR(AJAX)  =====*/
  $mvc.XHRSequence = [];
  /*  @description single AJAX request.
   *  @param {Object} param
   *  @return {Object} param
   *
   *  *** how to use $mvc.XHR ***
   *
   *  var param = {
   *      "name": 'request1',
   *      "url": 'www.mvc9.com/api/1',
   *      "method": 'GET',
   *      "header": { "framework": "mvc9" },
   *      "async": true,
   *      "contentType": 'application/json',
   *      "content": { "message": 'Hello content!' },
   *      "onPrevented": function(name) { * your code * },
   *      "preventDuration": 100 // (ms) { after request finished 100 ms, unlock this requset. },
   *      "then": function(status, response) { * your code * } *
   *  }; 
   *  $mvc.XHR(param);
   */

  $mvc.XHR = function (param) {
    var xmlHttp = null;
    xmlHttp = GetXmlHttpObject();
    if (xmlHttp === null) {
      alert("Your brower does not support AJAX!");
      return;
    }
    param = {
      "name": param.name || param.url,
      "url": param.url || '',
      "method": param.method || 'GET',
      "header": param.header || {},
      "contentType": param.contentType || 'application/x-www-form-urlencoded',
      "content": param.content || '',
      "async": !!param.async || true,
      "preventDuration": param.preventDuration || 100,
      "onPrevented": param.onPrevented || function (name) { console.warn('XHR(name:' + name + ') is canceled because of an unfinished XHR request with same name!'); },
      "then": param.then || function () {}
    }

    if (!param.url) {
      console.error('XHR: param.url can not be omitted!');
      return;
    } else {
      for (var m = 0; m < $mvc.XHRSequence.length; m++) {
        if ($mvc.XHRSequence[m] === param.name && param.preventDuration) {
          param.onPrevented(param.name);
          return;
        }
      }
      $mvc.XHRSequence.push(param.name);
    }

    param.header['Content-Type'] = param.contentType;
    if (param.contentType.match(/application\/x-www-form-urlencoded/g)) {
      param.header["X-Requested-With"] = "XMLHttpRequest";
      if (typeof (param.content) === 'object') {
        var formStr = '';
        for (var key in param.content) {
          if (formStr) {
            formStr = formStr + '&' + encodeURIComponent(key) + '=' + encodeURIComponent(param.content[key]);
          } else {
            formStr = encodeURIComponent(key) + '=' + encodeURIComponent(param.content[key]);
          }
        }
        param.content = formStr;
      }
    } else {
      if (JSON) {
        if (typeof (param.content) === 'object') {
          param.content = JSON.stringify(param.content);
        }
      }
    }

    function stateChanged() {
      if (xmlHttp.readyState === 4) {
        setTimeout(function () {
          for (var queueIndex = 0; queueIndex < $mvc.XHRSequence.length; queueIndex++) {
            if ($mvc.XHRSequence[queueIndex] === param.name) {
              $mvc.XHRSequence.splice(queueIndex, 1);
            }
          }
        }, param.preventDuration);
        param.then(xmlHttp.status, xmlHttp.responseText);
      }
    }

    function GetXmlHttpObject() {
      var xmlHttpFunction = null;
      try {
        // Webkit,Firefox,Opera8.0+,Safari
        xmlHttpFunction = new XMLHttpRequest();
      } catch (e) {
        // Internet Explorer
        try {
          xmlHttpFunction = new ActiveXObject("Msxml2.XMLHTTP");
        } catch (e) {
          xmlHttpFunction = new ActiveXObject("Microsoft.XMLHTTP");
        }
      }
      return xmlHttpFunction;
    }

    xmlHttp.onreadystatechange = stateChanged;
    xmlHttp.open(param.method, param.url, param.async);
    for (var headerName in param.header) {
      if (param.header.hasOwnProperty(headerName)) {
        xmlHttp.setRequestHeader(headerName, param.header[headerName]);
      }
    }
    xmlHttp.send(param.content);
    return param;
  }

  /*=====  RegExp  =====*/
  $mvc.regex = {};
  $mvc.regex.nodeMark = new RegExp('{{2,3}[^{}]*}{2,3}', 'g');
  $mvc.regex.scopePathMark = new RegExp('\\$path', 'g');
  $mvc.regex.isRepeatTier = new RegExp('\\$\\d+');

  /*=====  Map Node MVC  =====*/
  $mvc.mapNode = {};
  $mvc.mapNode.molds = [];
  $mvc.mapNode.emptyDom = function () {
    return {
      childNodes: [],
      innerHTML: ''
    }
  };

  $mvc.isNodeRuntime ? $mvc.mapNode.rootNode = new $mvc.mapNode.emptyDom() : $mvc.mapNode.rootNode = document;

  /*  @description window.onload event
   *  @param {Function} fn
   */
  $mvc.load = function (fn) {
    if (!browserInitFlag) {
      browserInitFlag = true;
      window[addEventListenerApi](listenerApiPrefix + 'load', function () {
        $mvc.browserInit(function () {
          for (var n = 0; n < onloadQueue.length; n++) {
            try {
              onloadQueue[n](m);
            } catch (err) {
              throw new Error(err);
            }
          }
        });
      });
    }
    onloadQueue.push(fn);
  };

  $mvc.browserInit = function (callback) {
    if (window.addEventListener) {
      addEventListenerApi = 'addEventListener';
      removeEventListenerApi = 'removeEventListener';
      listenerApiPrefix = '';
    } else {
      addEventListenerApi = 'attachEvent';
      removeEventListenerApi = 'detachEvent';
      listenerApiPrefix = 'on';
    }

    $mvc.mapNode.mapIncludes({
      resourceLoader: $mvc.mapNode.browserResourceLoader,
      callback: function (rootNode) {
        $mvc.mapNode.rootNode = rootNode
        var styleElement = document.createElement('style');
        styleElement.innerHTML = '*[x-if=false],*[x-if="0"],*[x-if=""],*[x-show=false],*[x-show="0"],*[x-show=""] { display: none!important }';
        var headElement = document.getElementsByTagName('head');
        headElement.length && headElement[0].appendChild(styleElement);

        $mvc.mapNode.mapRenderToMold(rootNode);
        $mvc.mapNode.renderScopePath();
        $mvc.mapNode.molds = [];
        $mvc.mapNode.mapRenderToMold(rootNode);
        callback();
      }
    })
  };

  $mvc.nodeJSInit = function () {
    $mvc.mapNode.rootNode = new $mvc.mapNode.emptyDom();
    $mvc.mapNode.molds = [];
    m = {};
    return m;
  };

  $mvc.mapNode.mapNodeByAttributeName = function (node, attributeName, path, matchTask) {
    node = node || $mvc.mapNode.emptyDom;
    //map current node child
    for (var i = 0; i < (node.childNodes || []).length; i++) {
      //if this child is not a text
      if (node.childNodes[i].attributes) {
        //map current child attribute
        for (var n = 0; n < node.childNodes[i].attributes.length; n++) {
          //if this attribute has object.nodeName
          if (node.childNodes[i].attributes[n].nodeName) {
            //if current node's current attribute is 'attributeName'
            if (node.childNodes[i].attributes[n].nodeName === attributeName) {
              matchTask(node.childNodes[i], node.childNodes[i].attributes[n].nodeValue, path);
              break;
            }
          }
        }
        if (n === node.childNodes[i].attributes.length) {
          $mvc.mapNode.mapNodeByAttributeName(node.childNodes[i], attributeName, path, matchTask);
        }
      }
    }
    return node;
  }

  $mvc.mapNode.getElementsByAttributeName = function (node, attributeName, attributeValue) {
    var matchNodes = [];
    var matchTask = function (node, value) {
      if (attributeValue) {
        if (value === attributeValue) {
          matchNodes.push(node);
        }
      } else {
        matchNodes.push(node);
      }
      $mvc.mapNode.mapNodeByAttributeName(node, attributeName, null, matchTask);
    };
    $mvc.mapNode.mapNodeByAttributeName(node, attributeName, null, matchTask);
    return matchNodes;
  };

  $mvc.cleanXEventListeners = function () {
    for (var i = 0; i < xEventListeners.length; i++) {
      if (!xEventListeners[i].element.parentNode) {
        xEventListeners[i].element[removeEventListenerApi](
          listenerApiPrefix + xEventListeners[i].eventType,
          xEventListeners[i].eventCallback,
          xEventListeners[i].useCapture
        );
        $mvc.console('log', 'XEvent Affected: ' + xEventListeners[i].xEventName + '.' + xEventListeners[i].eventType, '#999', 6);
      }
    }
  };

  $mvc.mapNode.xEvent = function (domXEventName, domEventType, domEventAction, useCapture) {
    $mvc.xEventElements = $mvc.xEventElements || [];
    var attachDoms = $mvc.mapNode.getElementsByAttributeName($mvc.mapNode.rootNode, 'x-event', domXEventName);

    for (var i = 0; i < attachDoms.length; i ++) {
      var newEventListener = {
        element: attachDoms[i],
        xEventName: domXEventName,
        eventType: domEventType,
        eventCallback: domEventAction,
        useCapture: useCapture
      };
      newEventListener.element[addEventListenerApi](listenerApiPrefix + newEventListener.eventType, newEventListener.eventCallback, useCapture);
      xEventListeners.push(newEventListener);
    }
    return attachDoms;
  };

  $mvc.mapNode.browserResourceLoader = function (url, callback) {
    var onXHRLoadFinish = function (status, data) {
      if ((/^[2-3]\d\d$/g).test(String(status))) {
        callback(data);
      } else {
        callback('');
      }
    };
    $mvc.XHR({
      url: url,
      then: onXHRLoadFinish,
      preventDuration: 0,
      onPrevented: onXHRLoadFinish
    });
  }

  $mvc.mapNode.mapIncludes = function (param) {
    var options = {
      node: param.node || $mvc.mapNode.rootNode,
      resourceLoader: param.resourceLoader || function () { throw new Error('mapIncludes: resourceLoader should be a function!') },
      pathPrefix: param.cwd || '',
      callback: param.callback || function () {}
    };
    var includes = [];
    var mappedIncludes = 0;
    var mapCallback = function () {
      if (mappedIncludes === includes.length) {
        options.callback(options.node);
      }
    }
    var matchTask = function (node, includePath, path) {
      options.resourceLoader(options.pathPrefix + includePath, function (includeHTML) {
        mappedIncludes = mappedIncludes + 1;
        if (includeHTML !== false) {
          node.removeAttribute('x-include');
          node.innerHTML = includeHTML;
          $mvc.mapNode.mapNodeByAttributeName(node, 'x-include', null, matchTask);
        }
        includes.push($mvc.mapNode.mapNodeByAttributeName(node, 'x-include', null, matchTask));
        mapCallback();
      });
    };
    includes.push($mvc.mapNode.mapNodeByAttributeName(options.node, 'x-include', null, matchTask));
    mapCallback();
  }

  $mvc.mapNode.nodeJSMapIncludes = function (node, readResSync, pathPrefix) {
    var matchTask = function (node, includePath, path) {
      var includeHTML = readResSync(pathPrefix + includePath);
      if (includeHTML !== false) {
        node.innerHTML = includeHTML;
        $mvc.mapNode.mapNodeByAttributeName(node, 'x-include', null, matchTask);
      }
    };
    $mvc.mapNode.mapNodeByAttributeName(node, 'x-include', null, matchTask);
    return node;
  }

  /*  @decscription auto make x-render into a mold;
   *    Caution: Make sure you don't make a dom into mold twice!
   */
  $mvc.mapNode.mapRenderToMold = function (node) {
    node = node || $mvc.mapNode.rootNode;
    var matchTask = function (node, includePath, path) {
      var renderScopeName = node.attributes['x-render']['value'];
      var scopePath = path.join('"').match(/[^\"]+/g) || [];
      scopePath.push(renderScopeName);
      var pathString = scopePath.join('.');
      node.setAttribute('x-path', pathString);
      !$mvc.regex.isRepeatTier.test(renderScopeName) && !$mvc.mapNode.getMold(scopePath) && $mvc.mapNode.mold({ name: renderScopeName, node: node, path: scopePath, xPath: pathString});
      $mvc.mapNode.mapNodeByAttributeName(node, 'x-render', scopePath, matchTask);
    }
    return $mvc.mapNode.mapNodeByAttributeName(node, 'x-render', [], matchTask);
  };

  $mvc.mapNode.renderScopePath = function () {
    for (var n = $mvc.mapNode.molds.length; n > 0; n--) {
      var mold = $mvc.mapNode.molds[n - 1];
      mold.node.innerHTML = mold.node.innerHTML.replace($mvc.regex.scopePathMark, mold.path.join("']['"));
    }
  }

  /*  @description Generate a marked html dom into a mvcNodeMold.
   *  @param {Node} HTMLCollection
   *  @return {Object} mvcNodeMold
   */
  $mvc.mapNode.mold = function (param) {
    $mvc.mapNode.molds.push({
      "name": param.name,
      "node": param.node,
      "path": param.path || [],
      "xPath": param.xPath,
      "nodeMarks": [],
      "nodeRepeats": [],
      "sourceHTML": param.node.innerHTML,
      "beforeRender": param.beforeRender,
      "afterRender": param.afterRender
    });
  };

  $mvc.mapNode.getMold = function(moldPath, callbackAction) {
    var moldPathType = null;
    var regexp = new RegExp('^$');
    if (moldPath && typeof(moldPath) === 'object' && moldPath.join) {
      moldPathType = 'Array';
    }
    if (moldPath && typeof(moldPath) === 'object' && moldPath.test) {
      moldPathType = 'RegExp';
      regexp = moldPath;
    }
    if (moldPath && typeof(moldPath) === 'string') {
      moldPathType = 'String';
      regexp = new RegExp('(^|.)' + moldPath + '$', 'g');
    }
    if (moldPathType === null) {
      console.error('Param Error: Param "moldPath" type error!');
      return;
    }
    for (var n = 0; n < $mvc.mapNode.molds.length; n++) {
      switch (moldPathType) {
        case 'Array':
          if ($mvc.mapNode.molds[n].path.join('"') === moldPath.join('"')) {
            callbackAction && callbackAction($mvc.mapNode.molds[n]);
            return $mvc.mapNode.molds[n];
          }
          break;
        case 'String':
        case 'RegExp':
          if (regexp.test($mvc.mapNode.molds[n].xPath)) {
            callbackAction && callbackAction($mvc.mapNode.molds[n]);
            return $mvc.mapNode.molds[n];
          }
          break;
      }
    }
    return null;
  };

  /*  @description Restore a rendered mvcNodeMold into marked html.
   *  @param {Object} mvcNodeMold
   *  @return {Object} mvcNodeMold
   */
  $mvc.mapNode.restore = function (moldPath) {
    return $mvc.mapNode.getMold(moldPath, restore);
  };

  function restore(nodeData) {
    nodeData.nodeMarks = [];
    nodeData.nodeRepeats = [];
    nodeData.node = nodeData.node || {};
    nodeData.node.innerHTML = nodeData.sourceHTML;
    return nodeData;
  }

  function doRenderEventByPathName(moldName, renderEventName) {
    var renderEventFilter = new RegExp('(^|\\.)' + moldName + '(\\.|$)', 'g');
    var molds = $mvc.mapNode.molds;
    for (var n = 0; n < molds.length; n++) {
      if (molds[n].xPath.match(renderEventFilter)) {
        molds[n][renderEventName] && molds[n][renderEventName](m, molds[n]);
      }
    }
  }

  /*  @description Render a mvcNodeMold by reading window.* varable.
   *  @param {Object} mvcNodeMold
   *  @return {Object} mvcNodeMold
   */
  $mvc.mapNode.render = function (moldPath) {
    var renderedNode;
    $mvc.mapNode.getMold(moldPath, function (mold) {
      $mvc.console('group', '$mvc render', 5);
      $mvc.console('log', 'Mold Name : ' + mold.name, '#33f', 5);
      $mvc.console('log', 'Mold Path : ' + mold.path.join(' -> '), '#69f', 5);
      $mvc.console('log', 'Mold Element TagName : ' + mold.node.localName, '#69f', 5);
      $mvc.console('time', 'Elapsed Time');
      $mvc.console('log', 'Mold Element Class : ' + mold.node.className || 'null', '#69f', 5);
      doRenderEventByPathName(mold.name, 'beforeRender');
      renderedNode = render(mold.path, mold);
      renderedNode = renderNodeSrc(renderedNode);
      doRenderEventByPathName(mold.name, 'afterRender');
      $mvc.console('log', 'Mold Repeats : ' + mold.nodeRepeats.length, '#69f', 5);
      $mvc.console('log', 'Mold Marks : ' + mold.nodeMarks.length, '#69f', 5);
      $mvc.console('timeEnd', 'Elapsed Time', 5);
      $mvc.console('groupEnd', '$mvc render', 5);
    });
    return renderedNode || console.warn("cannot find renderScope mold by moldPath ['" + moldPath.join("','") + "']");
  };

  function render(moldPath, nodeData, rootNode) {
    rootNode = rootNode || $mvc.mapNode.rootNode;
    nodeData.node = $mvc.mapNode.getElementsByAttributeName(rootNode, 'x-path', moldPath.join('.'))[0];
    restore(nodeData);
    nodeData = mapRepeatNode(nodeData);
    nodeData = filtNodeMarks(nodeData);
    nodeData = renderNodeMarks(nodeData);
    $mvc.isNodeRuntime || $mvc.cleanXEventListeners();
    $mvc.isNodeRuntime && nodeData.node.removeAttribute('x-include');
    $mvc.isNodeRuntime && nodeData.node.removeAttribute('x-render');
    $mvc.isNodeRuntime && nodeData.node.removeAttribute('x-path');
    return nodeData;
  }

  function getRenderMarkValue (markString, initalVaule) {
    var value = initalVaule || '';
    try {
      value = eval(markString)
    } catch (err1) {
      try {
        value = eval('m.' + markString)
      } catch (err2) {
        $mvc.console('log', 'Faild Mark Value: ' + markString, '#f96', 5);
      }
    }
    return value
  }

  function mapRepeatNode(nodeData) {
    var matchTask = function (node, attributeValue, tier) {
      var tierRegExp = new RegExp('\\$' + tier, 'g');
      var tempRepeat = {
        "repeatRootNode": node,
        "repeatMark": attributeValue,
        "repeatHTML": node.innerHTML,
        "repeatTier": tier
      };
      nodeData.nodeRepeats.push(tempRepeat);
      var repeatTimes = 0;
      var renderHTML = '';
      var currentRepeatValue = getRenderMarkValue.call({} ,tempRepeat.repeatMark, []);
      if (currentRepeatValue && typeof(currentRepeatValue) === 'object' && currentRepeatValue['concat']) {
        for (repeatTimes; repeatTimes < currentRepeatValue.length; repeatTimes++) {
          var tempHTML = tempRepeat.repeatHTML;
          tempHTML = tempHTML.replace(tierRegExp, repeatTimes);
          renderHTML = renderHTML + tempHTML;
        }
      }
      $mvc.isNodeRuntime && node.removeAttribute('x-repeat');
      node.innerHTML = renderHTML;
      $mvc.mapNode.mapNodeByAttributeName(node, 'x-repeat', tier + 1, matchTask);
    }
    nodeData.node = $mvc.mapNode.mapNodeByAttributeName(nodeData.node, 'x-repeat', 0, matchTask);
    return nodeData;
  }

  function filtNodeMarks(nodeData) {
    nodeData.nodeMarks = (nodeData.node.innerHTML || '').match($mvc.regex.nodeMark) || [];
    return nodeData;
  }

  function renderNodeMarks(nodeData) {
    var htmlStr = nodeData.node.innerHTML;
    var mapedMarks = nodeData.nodeMarks;
    var mark3LRegex = new RegExp('{{{');
    var mark3RRegex = new RegExp('}}}');
    var markFixRegex = [
      new RegExp('{', 'g'),
      new RegExp('}', 'g'),
      new RegExp('<', 'g'),
      new RegExp('>', 'g'),
      new RegExp('\\&amp\\;', 'g'),
      new RegExp('\"', 'g'),
    ];
    var tempMark;
    var tempMarkValue;
    var tempStr;
    var isTrueElement;
    for (var i = 0; i < mapedMarks.length; i++) {
      isTrueElement = mark3LRegex.test(mapedMarks[i]) && mark3RRegex.test(mapedMarks[i]);
      // htmlStr = htmlStr.replace(markFixRegex[4], '&');
      tempMark = mapedMarks[i].replace(markFixRegex[0], '');
      tempMark = tempMark.replace(markFixRegex[1], '');
      tempMark = tempMark.replace(markFixRegex[4], '&');
      tempMarkValue = getRenderMarkValue.call({}, tempMark, null);
      if (tempMarkValue !== undefined && tempMarkValue !== null) {
        tempStr = String(tempMarkValue);
        !isTrueElement && (tempStr = tempStr.replace(markFixRegex[2], '&#60;'));
        !isTrueElement && (tempStr = tempStr.replace(markFixRegex[3], '&#62;'));
        htmlStr = htmlStr.replace(mapedMarks[i], tempStr);
      } else {
        htmlStr = htmlStr.replace(mapedMarks[i], '');
      }
    }
    nodeData.node.innerHTML = htmlStr;
    return nodeData;
  }

  function renderNodeSrc(nodeData) {
    var xSrcElements = $mvc.mapNode.getElementsByAttributeName(nodeData.node, 'x-src');
    for (var xSrcIndex = 0; xSrcIndex < xSrcElements.length; xSrcIndex ++) {
      var xSrcMark = xSrcElements[xSrcIndex].attributes['x-src'].value;
      var xSrcValue = getRenderMarkValue.call({}, xSrcMark, '');
      if (xSrcValue !== undefined && xSrcValue !== null) {
        xSrcElements[xSrcIndex].setAttribute('src', xSrcValue);
      }
    }
    return nodeData;
  }

  /* animate for es5 */
  $mvc.animate = function(obj, json, interval, sp, fn) {
    clearInterval(obj.timer);
    function getStyle(obj, arr) {
      if (obj.currentStyle) {
        return parseInt(obj.currentStyle[arr]) || 0;
      } else {
        return parseInt(document.defaultView.getComputedStyle(obj, null)[arr]) || 0;
      }
    }
    obj.timer = setInterval(function() {
      (function(timer) {
        var flag = true;
        for (var arr in json) {
          if (json.hasOwnProperty(arr)) {
            var icur = 0;
            if (arr === "opacity") {
              icur = Math.round(parseFloat(getStyle(obj, arr)) * 100);
            } else {
              icur = parseInt(getStyle(obj, arr));
            }
            var speed = (json[arr] - icur) * sp;
            speed = speed > 0 ? Math.ceil(speed): Math.floor(speed);
            if (icur !== json[arr]) {
              flag = false;
            }
            if (arr === "opacity") {
              obj.style.filter = "alpha(opacity : ' + (icur + speed) + ' )";
              obj.style.opacity = (icur + speed) / 100;
            } else {
              obj.style[arr] = icur + speed + "px";
            }
          }
        }
        if (flag) {
          clearInterval(timer);
          if (fn) {
            setTimeout(fn);
          }
        }
      })(obj.timer)
    }, interval);
  };

  $mvc.asyncQueue = function(functionsQueue, options) {
    options = options || {};
    if (functionsQueue.constructor.name !== 'Array') {
      throw new Error('asyncQueue.js: Param functionsQueue must be an Array!');
    }
    var queueMemory = {
      step: 0,
      queue: functionsQueue,
      errorCallBack: options.errorCallBack || function (error) { console.error(error) }
    };

    var errCatchAndContinue = function(err) {
      try {
        throw new Error(err);
      } catch (error) {
        queueMemory.lastError = err;
        queueMemory.errorCallBack && typeof(queueMemory.errorCallBack) === 'function' && queueMemory.errorCallBack(err);
        queueMemory.step += 1;
        setTimeout(queueExecuter, 1, functionsQueue[queueMemory.step]);
      }
    };

    var queueExecuter = function(queueFunc) {
      if (queueFunc && typeof(queueFunc) === 'function') {
        try {
          queueMemory.beforeStepCallback && queueMemory.beforeStepCallback();
          queueFunc({
            next: function() {
              queueMemory.step += 1;
              setTimeout(queueExecuter, 1, functionsQueue[queueMemory.step]);
            },
            again: function() {
              setTimeout(queueExecuter, 1, functionsQueue[queueMemory.step]);
            },
            to: function(stepChange) {
              queueMemory.step = queueMemory.step + stepChange;
              setTimeout(queueExecuter, 1, functionsQueue[queueMemory.step]);
            },
            insertNext: function(queueFunc) {
              functionsQueue.splice(queueMemory.step + 1, 0, queueFunc);
            },
            errorAndNext: function(err) {
              errCatchAndContinue(err);
            },
            errorAndExit: function(err) {
              queueMemory.step = functionsQueue.length;
              errCatchAndContinue(err);
            }
          }, queueMemory);
          queueMemory.afterStepCallback && queueMemory.afterStepCallback();
        } catch (err) {
          errCatchAndContinue(err);
        }
      } else {
        if (queueFunc && typeof(queueFunc) !== 'function') {
          var errMsg = 'asyncQueue: The member of queue must be a function!';
          errCatchAndContinue(errMsg);
        } else {
          options.onQueueEnd && options.onQueueEnd(queueMemory);
        }
      }
    };
    // async queue boot
    setTimeout(queueExecuter, 1, functionsQueue[queueMemory.step]);
    return queueMemory;
  };

  typeof(module) !== 'undefined' && (module.exports = $mvc);

  if (!$mvc.isNodeRuntime) {
    root.$x = $mvc;
  } else {
    return $mvc;
  }

})(this);
