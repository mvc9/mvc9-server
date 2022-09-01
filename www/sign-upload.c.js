
module.exports = function reqControl(mvc9) {
  return (req, res) => {
    res.end(JSON.stringify({
      data: {
        signUrl: 'https://127.0.0.1/upload'
      },
      code: 200
    }));
  }
}
