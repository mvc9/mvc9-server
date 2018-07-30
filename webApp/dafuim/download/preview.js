$x.load(function (m) {
  m.app = {
    // app_name: 'Google',
    // version: '1.0.0',
    // icon_link: 'https://pic.dafuvip.com/icons/587.png?1499775492&imageView2/1/w/120/h/120/ignore-error/1',
    // app_link: 'http://down.dafu.im/1def380a6afdb69a83d7d23ec7c73f66/Google.apk?sign=d29f8a92ffb7bd3c7819a2908d38f43a&t=5aea8512',
    // device: 3
  };

  $x.mapNode.getMold(['content'], function(mold) {
    mold.afterCompile = function (m) {
      $x.mapNode.xEvent('icon-click', 'click', function() {
        console.log('icon-click: clicked!')
      });
      $x.mapNode.xEvent('down-qrcode', 'click', function() {
        console.log(m.qrcodeDown);
        var qrCodeDownWindow = window.open();
        qrCodeDownWindow.document.writeln('<img src="' + m.qrcodeDown + '" />');
      });
      QRCode.toDataURL(location.origin + location.pathname, {errorCorrectionLevel:'H'}, function(err, qrcodeImgBase64) {
        var qrcodeImg = $x.mapNode.getElementsByAttributeName(document.body, 'x-qrcode', 'qrcode1')[0];
        qrcodeImg.src = qrcodeImgBase64
        m.qrcodeDown = qrcodeImgBase64
      });
      var clipboard = new Clipboard('.copy-btn');
      clipboard.on('success', function(e) {
        // console.info('Action:', e.action);
        // console.info('Text:', e.text);
        // console.info('Trigger:', e.trigger);
        alert('复制成功');
      });
    }
  })

  m.deviceList = [['安卓手机'], ['苹果手机'], ['苹果手机', '安卓手机']];

  baseUtil.get({
    url: API_LIST.APP_DOWNLOAD_PREVIEW_INFO,
    content: {appId: baseUtil.paramArray[0]},
    success: function(status, data) {
      if (status.ok) {
        m.app = data
        document.title = m.app.app_name || '下载';
        $x.mapNode.compile(['content'])
      }
    }
  })
})