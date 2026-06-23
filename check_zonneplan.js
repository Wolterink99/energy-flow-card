const WebSocket = require('ws');

const token = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiI0NWIyYTA4MzhjOWQ0NjI2Yjc5NTY5NGU1Mzk0ZmU2ZCIsImlhdCI6MTc4MDIyODEwMiwiZXhwIjoyMDk1NTg4MTAyfQ.c-gOuNc3AezEImPkxMvuBeTPVbfpx8CzWqcixCpflM4";
const url = "wss://84wgzzzm8ai8igpemwargw2qsuihp9ww.ui.nabu.casa/api/websocket";

const ws = new WebSocket(url);

ws.on('open', () => {
  console.log('Connected to Home Assistant');
});

ws.on('message', (data) => {
  const msg = JSON.parse(data);
  if (msg.type === 'auth_required') {
    ws.send(JSON.stringify({
      type: 'auth',
      access_token: token
    }));
  } else if (msg.type === 'auth_ok') {
    console.log('Auth OK, querying state...');
    ws.send(JSON.stringify({
      id: 1,
      type: 'get_states'
    }));
  } else if (msg.type === 'result' && msg.id === 1) {
    const states = msg.result || [];
    const zonneplan = states.find(s => s.entity_id === 'sensor.zonneplan_current_electricity_tariff');
    if (zonneplan) {
      console.log('Zonneplan State:', JSON.stringify(zonneplan, null, 2));
    } else {
      console.log('Zonneplan entity not found. Available zonneplan entities:');
      const zEntities = states.filter(s => s.entity_id.includes('zonneplan'));
      console.log(zEntities.map(s => s.entity_id));
    }
    ws.close();
  }
});
