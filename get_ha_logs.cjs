const https = require('https');

const token = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiI0NWIyYTA4MzhjOWQ0NjI2Yjc5NTY5NGU1Mzk0ZmU2ZCIsImlhdCI6MTc4MDIyODEwMiwiZXhwIjoyMDk1NTg4MTAyfQ.c-gOuNc3AezEImPkxMvuBeTPVbfpx8CzWqcixCpflM4";
const base = "https://84wgzzzm8ai8igpemwargw2qsuihp9ww.ui.nabu.casa";

function makeRequest(path) {
  return new Promise((resolve, reject) => {
    const url = new URL(base + path);
    const options = {
      hostname: url.hostname,
      port: 443,
      path: url.pathname,
      method: 'GET',
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json'
      },
      timeout: 10000
    };

    const req = https.request(options, (res) => {
      let body = '';
      res.on('data', chunk => body += chunk);
      res.on('end', () => {
        resolve({ statusCode: res.statusCode, body });
      });
    });

    req.on('error', reject);
    req.end();
  });
}

async function run() {
  try {
    const res = await makeRequest('/api/error_log');
    console.log(`Status: ${res.statusCode}`);
    console.log(res.body.substring(res.body.length - 2000));
  } catch (e) {
    console.error('Error:', e.message);
  }
}

run();
