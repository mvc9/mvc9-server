module.exports = (c, content) => {
  require('./lib/mvc9.js');
  let docDom = c.lib.virtualDom(content);

  $x.init();
  docDom = $x.mapNode.mapIncludes(docDom, c.lib.buffer.readRes, c.path);
  $x.mapNode.rootNode = docDom;
  $x.mapNode.mapRenderToMold(docDom);
  $x.root.m.jsFilePath = 'index';

  $x.mapNode.compile(['head']);
  c.response.set('token', 'QWERTYUIOP-1234567890X-1');// you can set header like this
  // console.log('request.body', c.request.body);// get post body by json phrase

  return $x.mapNode.rootNode.body.parentElement.outerHTML;
}
