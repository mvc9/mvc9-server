module.exports = {
  // your server name
  ServerName: 'MVC9-Web-Server',
  // charset : UTF-8/GBK/GB2312/etc...
  Charset: 'UTF-8',
  // charset : UTF-8/GBK/GB2312/etc...
  FileCharset: 'base64',
  // your web application root directory
  WebRootDir: 'webApp',
  // server admin's email
  AdminEmail: 'null',
  // turn zlib gzip compression true/false
  EnableCompression: true,
  // level of zlib compression 0-9 (for example 0 disable, 1 faster, 8 normal, 9 best)
  CompressionLevel: 3,
  // error page path under the WebRootDir, put null to turn off this option to improve the performance of server request
  ErrorPage: 'errorPages',
  // turn console server log true/false
  LogLevel: 6,
  // write access log file true/false
  WriteLog: true,
  // buffer life(ms), put 0 to turn off file read buffer
  BufferTime: 60000,
  // Caution: Enable RequestDebug will turn off your web service!
  RequestDebug: false
}