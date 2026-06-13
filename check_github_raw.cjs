const https = require('https');

const url = "https://raw.githubusercontent.com/Wolterink99/energy-flow-card/main/dist/energy-flow-card.js?t=1781374960326";

https.get(url, (res) => {
  console.log('Status Code:', res.statusCode);
  console.log('Headers:', res.headers);
  let body = '';
  res.on('data', chunk => body += chunk);
  res.on('end', () => {
    console.log('Size:', body.length);
    console.log('Snippet:', body.substring(0, 500));
  });
}).on('error', (e) => {
  console.error('Error:', e);
});
