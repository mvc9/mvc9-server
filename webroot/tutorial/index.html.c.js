module.exports = (c, content) => {
  require('./lib/mvc9.js');
  let docDom = c.lib.virtualDom(content);

  $x.init();
  docDom = $x.mapNode.mapIncludes(docDom, c.lib.buffer.readRes, c.path);
  $x.mapNode.rootNode = docDom;
  $x.mapNode.mapRenderToMold(docDom);


  $x.root.m.jsFilePath = 'index';

  $x.mapNode.compile(['head']);

  return $x.mapNode.rootNode.body.parentElement.outerHTML;
}
