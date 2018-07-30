((c, content) => {
  return (new Promise((responseOk, responseError) => {
    // 加载mvc9渲染引擎
    const $x = eval(c.lib.buffer.readRes(`${c.rootPath}/utils/mvc9.js`));
    // 初始化虚拟document
    let docDom = c.lib.virtualDom(content);

    // 渲染队列任务
    const queue = [
      (op, m) => {
        // 初始化渲染空间
        m.m = $x.nodeJSInit();
        docDom = $x.mapNode.nodeJSMapIncludes(docDom, c.lib.buffer.readRes, c.rootPath + '/');
        $x.mapNode.rootNode = docDom;
        $x.mapNode.mapRenderToMold(docDom);
        op.next();
      },
      (op, m) => {
        // 渲染head部分
        const modelHead = eval(c.lib.buffer.readRes(`${c.rootPath}/components/head.tpl.c.js`));
        modelHead(c).then((data) => {
          m.m.head = data;
          m.m.head.headTitle = '首页 - 大福 | dafu.im | 应用内测平台 | iOS应用Beta测试 | Android应用内测';
          $x.mapNode.compile('head');
          op.next();
        }).catch(op.errorAndNext);
      },
      (op, m) => {
        // 渲染Navi部分
        const modelNavi = eval(c.lib.buffer.readRes(`${c.rootPath}/components/navi.tpl.c.js`));
        modelNavi(c).then((data) => {
          m.m.navi = data;
          $x.mapNode.compile('navi');
          op.next();
        }).catch(op.errorAndNext);
      },
      (op, m) => {
        // 如果没有异常就返回渲染后的页面
        if (!m.lastError) {
          responseOk('<!DOCTYPE HTML>' + $x.mapNode.rootNode.body.parentElement.outerHTML);
        }
        op.next();
      }
    ];

    // 异步队列执行
    $x.asyncQueue(queue, {
      onQueueEnd: (queueMem) => {
        // 队列执行结束的回调
        if (queueMem.lastError) {
          responseError(queueMem.lastError);
        }
      }
    });
  }));
});
