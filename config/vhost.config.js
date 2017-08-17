// {
//   // your website name
//   Name: 'mvc9.com',
//   // your website domain (caution: we do not use "*.domain.com")
//   Domain: 'www.mvc9.com',
//   // your website domain (caution: we do not use "*.domain.com")
//   Domain2: 'test.mvc9.com',
//   // port
//   Port: 80,
//   // HTTPS is not support in this version
//   HTTPS: false,
//   // your website root folder
//   RootFolder: 'mvc9',
//   // enable special route (for spider or some otherthing)
// }

const vhostList = [];

vhostList.push({
  Name: 'mvc9.com',
  Domain: 'www.mvc9.com',
  Domain2: 'mvc9.com',
  Port: 80,
  RootFolder: 'mvc9'
});

vhostList.push({
  Name: 'tutorial',
  Domain: '127.0.0.1',
  Domain2: 'localhost',
  Port: 80,
  RootFolder: 'tutorial'
});

module.exports = vhostList;
