$x.load(function(m) {
  m.appInfo = [{}];

  m.getAppShortLink = function(appId) {
    return CONSTANT.APPPREVIEWLINK + appId;
  };

  // $x.mapNode.getMold(['mainBody', 'packListTable'], function(mold) {
  //   mold.afterCompile = function (m) {
  //     $x.mapNode.xEvent('downOrigin', 'click', function() {
  //       var appInfoIndex = this.attributes['x-index'].value
  //       console.log('downOrigin.clicked: ', appInfoIndex);
  //       baseUtil.openLinkAnchor(m.appList[appInfoIndex].pack_path).click();
  //     })
  //   }
  // })

  baseUtil.get({
    url: API_LIST.USER_MYPACK_DETAIL,
    content: { appId: baseUtil.paramArray[0] },
    success: function(status, data) {
      if (status.ok) {
        m.appInfo = data;
        $x.mapNode.compile('mainBody');
        setTimeout(function () {
          var qrcodeImgs = $x.mapNode.getElementsByAttributeName(document.body, 'qrcode-applink');
          console.log('qrcodeImgs: ', qrcodeImgs);
          qrcodeImgs.map((qrcodeImg) => {
            QRCode.toDataURL(m.getAppShortLink(qrcodeImg.attributes['qrcode-applink'].value), {errorCorrectionLevel:'H'}, function(err, qrcodeImgBase64) {
              console.log('err, qrcodeImgBase64: ', err, qrcodeImgBase64);
              qrcodeImg.src = qrcodeImgBase64
            });
          });
        }, 1000);
      }
    }
  })
})