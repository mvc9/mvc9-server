
module.exports = function requestControl(mvc9) {
  return (req, res) => {
    res.set('Content-Type', 'application/json');
    res.end(JSON.stringify({
      data: {
        signUrl: 'http://127.0.0.1:8000/upload'
      },
      code: 200,
      msg: ''
    }));
  }
}
