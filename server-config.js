module.exports = {
  // your server public name.
  serverName: 'MVC9-Web-Server',
  // your server service name.
  serviceName: 'server-1',
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
    // use etag
    etag: false,
    // turn zlib gzip compression true/false.
    enableCompression: true,
    // level of zlib compression 0-9 (for example 0 disable, 1 faster, 8 normal, 9 best).
    compressionLevel: 1
  },
  // https config.
  https: {
    // https listen port, set port null or undefined to disable https listen.
    port: 443,
    // if request is using http protocol, redirect it to https.
    useHttpsOnly: false,
    // https cert file
    certFile: 'certification/*.2enc.com.crt',
    // https key file
    keyFile: 'certification/*.2enc.com.key'
  },
  // net service defender
  defender: {
    // defend Flood request attack, use defendMode will disable all error response, such as 404.
    enabled: true,
    // defender scan interval time(ms) rate.
    scanDuration: 5000,
    // how many access history stored to scan
    accessListSize: 10000,
    // how many times in defender.scanDuration will trigger defend.
    deniedFrequency: 50000,
    // defender triggerd deny time(ms)
    denyTime: 100000,
    // defender white list
    whiteList: {
      '127.0.0.11': 2000000000000,
      '0.0.0.0': 2000000000000
    },
    // defender black list
    blackList: {
      '4.4.4.4': 2000000000000
    }
  },
  // logger config
  log: {
    // print log on nodejs console
    logOnConsole: true,
    // console log path
    cLogPath: 'log/c',
    // http log path
    httpLogPath: 'log/http',
    // ws log path
    wsLogPath: 'log/ws',
    // critical error log path
    errorLogPath: 'log/error'
  }
}
