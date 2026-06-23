const WebSocket = require('ws');
const fs = require('fs');

const token = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiI0NWIyYTA4MzhjOWQ0NjI2Yjc5NTY5NGU1Mzk0ZmU2ZCIsImlhdCI6MTc4MDIyODEwMiwiZXhwIjoyMDk1NTg4MTAyfQ.c-gOuNc3AezEImPkxMvuBeTPVbfpx8CzWqcixCpflM4";
const url = "wss://84wgzzzm8ai8igpemwargw2qsuihp9ww.ui.nabu.casa/api/websocket";

const ws = new WebSocket(url);

ws.on('open', () => {
  console.log('Connected, waiting for auth...');
});

ws.on('message', (data) => {
  const msg = JSON.parse(data);
  if (msg.type === 'auth_required') {
    ws.send(JSON.stringify({
      type: 'auth',
      access_token: token
    }));
  } else if (msg.type === 'auth_ok') {
    console.log('Authenticated, requesting states...');
    ws.send(JSON.stringify({
      id: 1,
      type: 'get_states'
    }));
  } else if (msg.type === 'result') {
    if (msg.success) {
      const states = msg.result;
      let output = '';
      states.forEach(st => {
        if (st.entity_id.startsWith('sensor.')) {
          output += `${st.entity_id}: ${st.state} (friendly_name: ${st.attributes.friendly_name})\n`;
        }
      });
      fs.writeFileSync('all_sensors_dump.txt', output);
      console.log('Saved to all_sensors_dump.txt');
    } else {
      console.error('Error fetching states:', msg.error);
    }
    ws.close();
  }
});
