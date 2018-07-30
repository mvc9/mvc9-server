$x.load(function(m){
  m.navData = ['navItem1', 'navItem2', 'navItem3', 'navItem4'];
  $x.mapNode.mapRenderToMold(document);
  $x.mapNode.compile('nav');
  $x.mapNode.compile('content');
});