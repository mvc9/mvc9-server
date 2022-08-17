module.exports = function (mvc9, responser) {
  const requestParser = require('./request-parser');
  const defenderConfig = mvc9.config.defender || {};
  const defender = {
    accessList: [],
    craftyList: {},
    deniedList: {}
  };
  const blackList = [];
  const craftyList = [];
  const accessList = [];
  return (request, response) => {
    // responser(response, request, mvc9);
    const reqObj = requestParser.extract(request);
    mvc9.logger.log({msg: JSON.stringify(reqObj)})
    // response.status(500);
    response.send(requestParser.generateReport(reqObj));
    response.end();
  }
}
