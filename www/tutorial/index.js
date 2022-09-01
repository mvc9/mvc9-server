$x.load(function(m){
	$x.logLevel = 9;
  m.navData = ['navItem1', 'navItem2', 'navItem3', 'navItem4'];
  // $x.mapNode.mapRenderToMold(document);
  $x.mapNode.render(['content']);
  setTimeout(() => {$x.mapNode.render(['nav'])}, 10);
});