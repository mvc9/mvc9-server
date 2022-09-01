
module.exports = function requestControl(mvc9) {
  return (req, res) => {
    res.send(mvc9.modules.parser.generateReport(req.reqInfo));
    res.end();
  }
}
