
module.exports = function reqControl(mvc9) {
  return (req, res) => {
    console.log('------- upload -------:');
    console.log(req.body);
    res.send(mvc9.modules.parser.generateReport(req.reqInfo));
    res.end();
  }
}
