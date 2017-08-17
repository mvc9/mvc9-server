const vhost = {};

vhost.getPortList = (vhosts) => {
  vhosts = vhosts || [];
  const portList = {};
  for (let n = 0; n < vhosts.length; n++) {
    if (vhosts[n].Port) {
      portList[vhosts[n].Port] = true;
    }
  }
  return portList;
}

vhost.startListenPort = (portList) => {
  let portMap = portList || {};
  for (let port in portMap) {
    server.listen(port, () => {
      logOnConsole({
        name: 'SERVER',
        content: 'Listening on port ' + port,
        logLevel: 2
      });
    });
  }
}

module.exports = vhost;
