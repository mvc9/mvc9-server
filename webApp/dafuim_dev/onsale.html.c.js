((c, content) => {
  return (new Promise((responseOk, responseError) => {
    const $x = eval(c.lib.buffer.readRes(`${c.rootPath}/utils/mvc9.js`));
    let docDom = c.lib.virtualDom(content);

    const queue = [
      (op, m) => {
        m.m = $x.nodeJSInit();
        docDom = $x.mapNode.mapIncludes(docDom, c.lib.buffer.readRes, c.path);
        $x.mapNode.rootNode = docDom;
        $x.mapNode.mapRenderToMold(docDom);
        op.next();
      },
      (op, m) => {
        const modelHead = eval(c.lib.buffer.readRes(`${c.rootPath}/components/head.tpl.c.js`));
        modelHead(c).then((data) => {
          m.m.head = data;
          m.m.head.headTitle = '上架 - 大福 | dafu.im';
          $x.mapNode.compile(['head']);
          op.next();
        }).catch(op.errorAndNext);
      },
      (op, m) => {
        const modelNavi = eval(c.lib.buffer.readRes(`${c.rootPath}/components/navi.tpl.c.js`));
        modelNavi(c).then((data) => {
          m.m.navi = data;
          $x.mapNode.compile(['navi']);
          op.next();
        }).catch(op.errorAndNext);
      },
      (op, m) => {
        if (!m.lastError) {
          responseOk('<!DOCTYPE HTML>' + $x.mapNode.rootNode.body.parentElement.outerHTML);
        } else {
          responseError(m.lastError);
        }
        op.next();
      }
    ];
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
