const WebSocket = require('ws');

const token1 = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiI0NWIyYTA4MzhjOWQ0NjI2Yjc5NTY5NGU1Mzk0ZmU2ZCIsImlhdCI6MTc4MDIyODEwMiwiZXhwIjoyMDk1NTg4MTAyfQ.c-gOuNc3AezEImPkxMvuBeTPVbfpx8CzWqcixCpflM4";
const token2 = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiI0NWIyYTA4MzhjOWQ0NjI2Yjc5NTY5NGU1Mzk0ZmU2ZCIsImlhdCI6MTc8MDIyODEwMiwiZXhwIjoyMDk1NTg4MTAyfQ.c-gOuNc3AezEImPkxMvuBeTPVbfpx8CzWqcixCpflM4";
const url = "wss://84wgzzzm8ai8igpemwargw2qsuihp9ww.ui.nabu.casa/api/websocket";

function tryToken(token, name) {
  return new Promise((resolve) => {
    const ws = new WebSocket(url);
    ws.on('message', (data) => {
      const msg = JSON.parse(data);
      if (msg.type === 'auth_required') {
        ws.send(JSON.stringify({
          type: 'auth',
          access_token: token
        }));
      } else if (msg.type === 'auth_ok') {
        resolve({ success: true, name });
        ws.close();
      } else if (msg.type === 'auth_invalid') {
        resolve({ success: false, name, msg });
        ws.close();
      }
    });
    ws.on('error', (err) => resolve({ success: false, name, error: err }));
  });
}

async function run() {
  console.log('Testing Token 1 (MTc4)...');
  console.log(await tryToken(token1, 'Token 1 (MTc4)'));
  console.log('Testing Token 2 (MTc8)...');
  console.log(await tryToken(token2, 'Token 2 (MTc8)'));
}

run();
