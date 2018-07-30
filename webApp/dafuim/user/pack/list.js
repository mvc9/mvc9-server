$x.load(function(m) {
  m.appList = [];
  m.myPurchase = {};

  m.getAppShortLink = function(appId) {
    return CONSTANT.APPPREVIEWLINK + appId;
  };

  m.goPackLink = '/pack_purchase';

  $x.mapNode.getMold(['mainBody', 'packListTable'], function(mold) {
    mold.afterCompile = function (m) {
      $x.mapNode.xEvent('downOrigin', 'click', function () {
        var appInfoIndex = this.attributes['x-index'].value
        console.log('downOrigin.clicked: ', appInfoIndex);
        baseUtil.openLinkAnchor(m.appList[appInfoIndex].pack_path).click();
      });
      $x.mapNode.xEvent('deleteApp', 'click', function () {
        var appName = this.attributes['app-name'].value;
        var appId =  this.attributes['app-id'].value
        ui.modal.confirm({
          name: 'pack-list-delete-confirm',
          className: 'list-delete-dialog',
          innerHTML: '确定删除 ' + appName + ' ？',
          onConfirm: function () {
            baseUtil.post({
              url: API_LIST.USER_MYPACK_DELETE_APP,
              content: { appId: appId},
              success: function (status, data) {
                ui.modal.close('pack-list-delete-confirm');
                if (status.ok) {
                  getMyPackList();
                  ui.modal.message({
                    name: 'list-delete-message',
                    className: 'list-delete-dialog',
                    innerHTML: '删除 ' + appName + ' 成功',
                    onConfirm: function () {
                      ui.modal.close('list-delete-message');
                    }
                  });
                } else if(status.errMsg) {
                  ui.modal.message({
                    name: 'list-delete-message',
                    className: 'list-delete-dialog',
                    innerHTML: '删除 ' + appName + ' 失败',
                    onConfirm: function () {
                      ui.modal.close('list-delete-message');
                    }
                  });
                }
              }
            });
          }
        });
      });
    }
  });

  baseUtil.get({
    url: API_LIST.USER_MYPACK_MYPURCHASE,
    content: { type: 1 },
    success: function (status, data) {
      if (status.ok) {
        m.myPurchase = data || {};
        if (String(data.limited_nums) !== '0') {
          m.goPackLink = '/pack_setting';
        } else {
          m.goPackLink = '/pack_purchase';
        }
        $x.mapNode.compile('mainBody');
      }
    }
  });

  var getMyPackList = function () {
    $x.asyncQueue([
      function (op, qm) {
        baseUtil.get({
          url: API_LIST.USER_MYPACK_PACKLIST,
          content: { size: 99, token: baseUtil.userToken },
          success: function(status, data) {
            if (status.ok) {
              m.appList = data.lists;
              $x.mapNode.compile('packListTable');
            }
            op.next();
          }
        })
      },
      function (op, qm) {
        var packListTable = $x.mapNode.getMold('packListTable').node;
        var qrcodeImgs = $x.mapNode.getElementsByAttributeName(packListTable, 'qrcode-applink');
        qrcodeImgs.map((qrcodeImg) => {
          QRCode.toDataURL(m.getAppShortLink(qrcodeImg.attributes['qrcode-applink'].value), {errorCorrectionLevel:'H'}, function(err, qrcodeImgBase64) {
            qrcodeImg.src = qrcodeImgBase64
          });
        });
        op.next();
      }
    ], {
      errorCallBack: function(error) {
        console.warn(error);
      }
    });
  };

  (function init () {
    getMyPackList();
    var freshPackListTimer = setInterval(getMyPackList, 1000 * 60 * 5);
  })()
});
