/* document enviroment provider */

// require dependency jsDom
const jsDom = require('jsdom');

const makeDocument = (htmlText) => {
  const { JSDOM } = jsDom;
  const htmlWindow = new JSDOM(htmlText);
  return htmlWindow.window.document;
}

module.exports = makeDocument;
