
module.exports = function requestControl(mvc9) {
  return (req, res) => {
    mvc9.logger.log({msg: 'Upload: receive byte length = ' + req.body.length});
    mvc9.logger.log({msg: 'Upload: receive bytes content:'});
    mvc9.logger.log({msg: JSON.stringify(req.body)});
    res.send(mvc9.modules.parser.generateReport(req.reqInfo));
    res.end();
  }
}
