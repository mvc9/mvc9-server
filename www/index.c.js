
module.exports = function reqControl(mvc9) {
  return (req, res) => {
    res.send(mvc9.modules.parser.generateReport(req.reqInfo));
    res.end();
  }
}
