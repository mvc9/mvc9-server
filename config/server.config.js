module.exports = {
  // your server name
  ServerName: 'MVC9-Web-Server',
  // send server name in request header
  SendServerName: true,
  // charset : UTF-8/GBK/GB2312/etc...
  Charset: 'UTF-8',
  // server admin's email
  AdminEmail: 'null',
  // turn zlib gzip compression true/false
  EnableCompression: true,
  // leve of zlib 0-9 (for example 0 disable, 1 faster, 8 normal, 9 best)
  CompressionLevel: 6,
  // display error page such as "404" "500" "502", put false to turn off this option could improve the performance of server request.
  ErrorPage: 'errorPages',
  // turn console server log true/false
  LogLevel: 6,
  // write access log file true/false
  WriteLog: true,
  // buffer life(ms), put 0 to turn off file read buffer
  BufferTime: 60000
}
