const WebSocket = require('ws');

const token = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiI0NWIyYTA4MzhjOWQ0NjI2Yjc5NTY5NGU1Mzk0ZmU2ZCIsImlhdCI6MTc4MDIyODEwMiwiZXhwIjoyMDk1NTg4MTAyfQ.c-gOuNc3AezEImPkxMvuBeTPVbfpx8CzWqcixCpflM4";
const url = "wss://84wgzzzm8ai8igpemwargw2qsuihp9ww.ui.nabu.casa/api/websocket";

const ws = new WebSocket(url);

let messageId = 1;

ws.on('open', () => {
  console.log('Connected to HA');
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
        
        let updated = false;
        
        const updateCards = (cards) => {
          if (!cards) return;
          cards.forEach(card => {
            if (card.type === 'custom:energy-flow-card') {
              console.log('Found energy flow card. Updating car_type to /local/vw_golf_id3.png');
              card.car_type = '/local/vw_golf_id3.png';
              card.show_ev = true;
              updated = true;
            }
            if (card.cards) {
              updateCards(card.cards);
            }
          });
        };

        config.views.forEach(view => {
          updateCards(view.cards);
        });
        
        if (updated) {
          console.log('Saving updated dashboard config...');
          ws.send(JSON.stringify({
            id: messageId++,
            type: 'lovelace/config/save',
            url_path: 'dashboard-screensaver',
            config: config
          }));
        } else {
          console.log('No energy-flow-card found to update.');
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
  console.log('Closed connection');
});
