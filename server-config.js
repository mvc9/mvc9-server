module.exports = {
  // your server public name.
  serverName: 'MVC9-Web-Server',
  // your server service name.
  serviceName: 'server-1',
  // Caution: Enable RequestDebug will turn off your web service!
  requestDebug: false,
  // global time zone setting, you can use (new Date()).getTimezoneOffset() to get your time zone offset.
  timezoneOffset: -480,
  // server absolute base directory.
  baseDir: __dirname,
  // http config.
  http: {
    // http listen port, set port null or undefined to disable http listen.
    port: 8000,
    // where your web service page controllers are.
    webRootDir: 'webApp',
    // turn zlib gzip compression true/false.
    enableCompression: true,
    // level of zlib compression 0-9 (for example 0 disable, 1 faster, 8 normal, 9 best).
    compressionLevel: 1,
    // use etag
    etag: false,
    // error page path under the WebRootDir, put null to turn off this option to improve the performance of server request.
    errorPage: 'errorPages'
  },
  // https config.
  https: {
    // https listen port, set port null or undefined to disable https listen.
    port: 443,
    // if request is using http protocol, redirect it to https.
    useHttpsOnly: true,
    // https cert file
    certFile: 'certification/*.2enc.com.crt',
    // https key file
    keyFile: 'certification/*.2enc.com.key'
  },
  // webSocket config
  webSocket: [{
    // it will use /$webRootDir/ws.c.js as the webSocket controller.
    wsUrlPath: '/ws'
  }],
  // net service defender
  defender: {
    // defend Flood request attack, use defendMode will disable all error response, such as 404.
    enabled: true,
    scanDuration: 5000,
    accessListSize: 10000,
    deniedFrequency: 30,
    denyTime: 100000,
    whiteList: {
      '127.0.0.1': 2000000000000,
      '0.0.0.0': 2000000000000
    },
    blackList: {
      '4.4.4.4': 2000000000000
    }
  },
  // logger config
  log: {
    logOnConsole: true,
    cLogPath: 'log/c',
    httpLogPath: 'log/http',
    wsLogPath: 'log/ws',
    errorLogPath: 'log/error'
  }
}
