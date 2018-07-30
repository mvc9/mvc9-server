$x.load(function(m) {
  $x.mapNode.getMold(['content'], function(mold) {
    mold.afterCompile = function (m) {
      var slideRect = $x.mapNode.getElementsByAttributeName(document, 'x-slide')[0];
      window.slide = slide(slideRect, {
        enableH5: true,
        H5AnimationTime: 500
      });
      slide.start();
    }
  })
});