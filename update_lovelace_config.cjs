const WebSocket = require('ws');

const token = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiI0NWIyYTA4MzhjOWQ0NjI2Yjc5NTY5NGU1Mzk0ZmU2ZCIsImlhdCI6MTc4MDIyODEwMiwiZXhwIjoyMDk1NTg4MTAyfQ.c-gOuNc3AezEImPkxMvuBeTPVbfpx8CzWqcixCpflM4";
const url = "wss://84wgzzzm8ai8igpemwargw2qsuihp9ww.ui.nabu.casa/api/websocket";

const ws = new WebSocket(url);

let messageId = 1;

ws.on('open', () => {
  console.log('Connected');
});

ws.on('message', (data) => {
  const msg = JSON.parse(data);
  if (msg.type === 'auth_required') {
    ws.send(JSON.stringify({
      type: 'auth',
      access_token: token
    }));
  } else if (msg.type === 'auth_ok') {
    console.log('Auth OK');
    ws.send(JSON.stringify({
      id: messageId++,
      type: 'lovelace/config',
      url_path: 'dashboard-screensaver'
    }));
  } else if (msg.type === 'result') {
    if (msg.id === 1) {
      if (msg.success) {
        console.log('Current config fetched successfully.');
        const config = msg.result;
        
        // Find the card configuration
        let updated = false;
        config.views.forEach(view => {
          view.cards.forEach(card => {
            if (card.type === 'custom:energy-flow-card' || card.type === 'energy-flow-card') {
              if (card.entities && card.entities.home_today === 'sensor.totaalverbruik_vandaag') {
                console.log('Found card! Changing home_today from sensor.totaalverbruik_vandaag to sensor.echt_huisverbruik_vandaag');
                card.entities.home_today = 'sensor.echt_huisverbruik_vandaag';
                updated = true;
              }
            }
          });
        });
        
        if (updated) {
          console.log('Sending updated config...');
          ws.send(JSON.stringify({
            id: messageId++,
            type: 'lovelace/config/save',
            url_path: 'dashboard-screensaver',
            config: config
          }));
        } else {
          console.log('Card config was not updated or sensor already set.');
          ws.close();
        }
      } else {
        console.error('Failed to fetch config:', msg.error);
        ws.close();
      }
    } else if (msg.id === 2) {
      console.log('Save result:', JSON.stringify(msg, null, 2));
      ws.close();
    }
  }
});

ws.on('error', (err) => {
  console.error('WS Error:', err);
});

ws.on('close', () => {
  console.log('Closed');
});
