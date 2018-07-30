((c) => {
  return (new Promise((modelReturn, modelError) => {
    const naviModelData = {};
    naviModelData.logoSrc = '/images/logo.png';
    naviModelData.links = [
      {
        name: '首页',
        url: '/'
      }, {
        name: '封装',
        url: '/pack'
      }, {
        name: '上架',
        url: '/sale'
      }, {
        name: '签名',
        url: '/sign'
      // }, {
      //   name: '发布',
      //   url: '/publish'
      }, {
        name: '工具箱',
        url: '/kit'
      }//, {
      //   name: '价格',
      //   url: '/purchase'
      // }
    ];
    naviModelData.currentPath = ((c.file.match(/^((?!\.\w+$).)*/) || [])[0] || '').replace('index', '/');
    modelReturn(naviModelData);
  }));
});
