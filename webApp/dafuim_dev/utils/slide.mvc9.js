/*
* var myslide = slide(parentDom, callback);
* myslide.start(options);
* options:fps[number], range[number], timeRate[number]
* */

function slide(slideParent, options) {
  options = options || {};
  var option = {
    fps: options.fps || 60,
    range: options.range || 8,
    stageTime: options.stageTime || 5000,
    slideCallback: options.slideCallback,
    enableH5: options.enableH5 || false,
    H5AnimationTime: options.H5AnimationTime || 300,
    H5AnimationStyle: options.H5AnimationStyle || ''
  };
  var slideRectUL = slideParent.getElementsByTagName('ul')[0];
  var slideRectLIs = slideParent.getElementsByTagName('li');
  var rectWidth = slideParent.offsetWidth;
  var imageCount = slideRectLIs.length;

  var slideStatus = {
    currentIndex: 1
  };

  if ($x.browser.H5Support && option.enableH5) {
    slideRectUL.style.transition = 'margin-left ' + option.H5AnimationTime + 'ms ' + option.H5AnimationStyle;
  }

  var slideAction = function() {
    $x.animate(slideRectUL, {
      marginLeft: -slideStatus.currentIndex * rectWidth
    }, ($x.browser.H5Support && option.enableH5  ? 100 : 1000 / option.fps), ($x.browser.H5Support && option.enableH5 ? 1 : option.range / 100), function() {
      slideStatus.currentIndex += 1;
      if ($x.browser.H5Support && option.enableH5) {
        if (slideStatus.currentIndex >= imageCount) {
          slideStatus.currentIndex = 0;
        }
      } else {
        if (slideStatus.currentIndex > imageCount) {
          slideRectUL.style.marginLeft = '0px';
          slideStatus.currentIndex = 1;
        }
      }
      if (option.slideCallBack) {
        option.slideCallBack(slideStatus);
      }
    });
  };

  var operates = {
    start: function() {
      slideStatus.timer = setInterval(slideAction, option.stageTime || 3000);
    },
    stop: function() {
      clearInterval(slideStatus.timer);
    },
    stageTo: function(stageIndex) {
      clearInterval(slideStatus.timer);
      slideStatus.currentIndex = stageIndex;
      slideAction();
      slideStatus.timer = setInterval(slideAction, option.stageTime || 3000);
    }
  }

  var imgResize = function() {
    var imgs = slideParent.getElementsByTagName('img');
    rectWidth = slideParent.offsetWidth;
    for (var i = 0; i < imgs.length; i++) {
      imgs[i].style.width = rectWidth + 'px';
    }
    slideRectUL.style.marginLeft = -(slideStatus.currentIndex - 1) * rectWidth;
  }


  var init = function() {
    var mergeFirstLi = document.createElement('li');
    mergeFirstLi.innerHTML = slideRectLIs[0].innerHTML;
    slideRectUL.appendChild(mergeFirstLi);
    imgResize();
    if (window.addEventListener) {
      window.addEventListener('resize', function() {
        imgResize();
      })
    } else {
      window.attachEvent('onresize', function() {
        imgResize();
      })
    }
  }

  init();

  return operates;
}
