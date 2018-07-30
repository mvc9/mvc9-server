$x.load(function(m) {
  m.userInfo = {};

  $x.mapNode.getMold('navi-bar', function(mold) {
    mold.afterCompile = function (m) {
      $x.mapNode.xEvent('login', 'click', function() {
        baseUtil.openLinkAnchor('/login#' + (location.pathname.match(/[^/].+$/g) || [''])[0], '_self').click();
        console.log('login click', this);
      });

      $x.mapNode.xEvent('regist', 'click', function() {
        baseUtil.openLinkAnchor('/sign_up', '_self').click();
      });
    }
  });

  baseUtil.get({
    url: API_LIST.USER_GETINFO,
    success: function(status, data) {
      if (status.ok) {
        m.userInfo = data;
        $x.mapNode.compile('navi-bar');
      } else {
        if (CONSTANT.ACCESS_LOGIN_URL_REGEXP.test(location.pathname)) {
          location.href = '/login#' + location.pathname;
        }
      }
    }
  });
});
