const WebSocket = require('ws');

const token = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiI0NWIyYTA4MzhjOWQ0NjI2Yjc5NTY5NGU1Mzk0ZmU2ZCIsImlhdCI6MTc4MDIyODEwMiwiZXhwIjoyMDk1NTg4MTAyfQ.c-gOuNc3AezEImPkxMvuBeTPVbfpx8CzWqcixCpflM4";
const url = "wss://84wgzzzm8ai8igpemwargw2qsuihp9ww.ui.nabu.casa/api/websocket";

const ws = new WebSocket(url);

let messageId = 1;

ws.on('open', () => {
  console.log('Connected to HA WebSocket');
});

ws.on('message', (data) => {
  const msg = JSON.parse(data);
  console.log('Received type:', msg.type);
  
  if (msg.type === 'auth_required') {
    ws.send(JSON.stringify({
      type: 'auth',
      access_token: token
    }));
  } else if (msg.type === 'auth_ok') {
    console.log('Auth OK!');
    
    // Query dashboards
    ws.send(JSON.stringify({
      id: messageId++,
      type: 'lovelace/dashboards'
    }));
    
    // Query screensaver config
    ws.send(JSON.stringify({
      id: messageId++,
      type: 'lovelace/config',
      url_path: 'dashboard-screensaver'
    }));
  } else {
    console.log('Message:', JSON.stringify(msg, null, 2));
    if (msg.id === 2) {
      console.log('Screensaver Config:', JSON.stringify(msg.result, null, 2));
      ws.close();
    } else if (msg.id === 1) {
      console.log('Dashboards:', JSON.stringify(msg.result, null, 2));
    }
  }
});

ws.on('error', (err) => {
  console.error('WS Error:', err);
});

ws.on('close', () => {
  console.log('WS Connection closed');
});
