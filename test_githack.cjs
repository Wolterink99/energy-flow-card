const https = require('https');

const url = "https://raw.githack.com/Wolterink99/energy-flow-card/main/dist/energy-flow-card.js";

https.get(url, (res) => {
  console.log('Status Code:', res.statusCode);
  console.log('Content-Type:', res.headers['content-type']);
  res.resume();
}).on('error', (e) => {
  console.error('Error:', e);
});
