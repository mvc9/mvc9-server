// {
//   // your website name
//   Name: 'mvc9.com',
//   // your website domain (caution: we do not use "*.domain.com" but ".domain.com")
//   Domain: 'www.mvc9.com',
//   // your website domain (caution: we do not use "*.domain.com" but ".domain.com")
//   Domain2: '*.mvc9.com',
//   // port
//   Port: 80,
//   // https
//   HTTPS: false,
//   // your website root folder
//   RootFolder: 'mvc9',
//   // enable special route (for spider or some otherthing)
//   MVCRender: false,
//   // checking string in request header for MVCRender
//   MVCPartten: [/[Ss]pider/],
//   // turn Cache function true/false
//   Cache: false,
//   // how long would recache the view page (for example "60000" ms)
//   CacheValidityTime: 60000
// }

const vhostList = [];

vhostList.push({
  Name: 'Default',
  Domain: 'vpn.mvc9.com',
  Port: 3000,
  HTTPS: false,
  RootFolder: 'vpn',
  MVCRender: false,
  MVCPartten: [/[Ss]pider/],
  Cache: false,
  CacheValidityTime: 60000
});

vhostList.push({
  Name: 'mvc9.com',
  Domain: 'www.mvc9.com',
  Port: 80,
  HTTPS: false,
  RootFolder: 'mvc9',
  MVCRender: false,
  MVCPartten: [/[Ss]pider/],
  Cache: false,
  CacheValidityTime: 60000
});

module.exports = vhostList;
