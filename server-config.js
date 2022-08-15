export default {
  // your server public name
  serverName: 'MVC9-Web-Server',
  // your server service name
  serviceName: 'server-1',
  // charset : UTF-8/GBK/GB2312/etc...
  charset: 'UTF-8',
  // Caution: Enable RequestDebug will turn off your web service!
  requestDebug: false,
  // global time zone setting, you can use (new Date()).getTimezoneOffset() to get your time zone offset.
  timezoneOffset: -480,
  // http config.
  http: {
    // port
    port: 8000,
    // where your web service page controllers are.
    webRootDir: 'webApp',
    // turn zlib gzip compression true/false.
    enableCompression: true,
    // level of zlib compression 0-9 (for example 0 disable, 1 faster, 8 normal, 9 best).
    compressionLevel: 1,
    // error page path under the WebRootDir, put null to turn off this option to improve the performance of server request.
    errorPage: 'errorPages',
    // defend DDOS of Flood CC error request attack, use defendMode will disable all error response, such as 404.
    defendMode: false
  },
  // webSocket config
  webSocket: [{
    // it will use /$webRootDir/ws.c.js as the webSocket controller.
    wsUrlPath: '/ws'
  }],
  // logger config
  log: {
    logOnConsole: false,
    cLogPath: '/logs/c',
    httpLogPath: '/logs/http',
    wsLogPath: '/logs/ws',
    errorLogPath: '/logs/error'
  }
}