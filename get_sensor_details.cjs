const WebSocket = require('ws');

const token = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiI0NWIyYTA4MzhjOWQ0NjI2Yjc5NTY5NGU1Mzk0ZmU2ZCIsImlhdCI6MTc4MDIyODEwMiwiZXhwIjoyMDk1NTg4MTAyfQ.c-gOuNc3AezEImPkxMvuBeTPVbfpx8CzWqcixCpflM4";
const url = "wss://84wgzzzm8ai8igpemwargw2qsuihp9ww.ui.nabu.casa/api/websocket";

const ws = new WebSocket(url);

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
    ws.send(JSON.stringify({
      id: 1,
      type: 'get_states'
    }));
  } else if (msg.type === 'result' && msg.id === 1) {
    console.log('--- POOL / PUMP SENSORS ---');
    const matches = msg.result.filter(e => 
      e.entity_id.toLowerCase().includes('pomp') || 
      e.entity_id.toLowerCase().includes('pump') || 
      e.entity_id.toLowerCase().includes('zwembad') || 
      e.entity_id.toLowerCase().includes('pool') ||
      (e.attributes.friendly_name && e.attributes.friendly_name.toLowerCase().includes('pomp')) ||
      (e.attributes.friendly_name && e.attributes.friendly_name.toLowerCase().includes('pump')) ||
      (e.attributes.friendly_name && e.attributes.friendly_name.toLowerCase().includes('zwembad')) ||
      (e.attributes.friendly_name && e.attributes.friendly_name.toLowerCase().includes('pool'))
    );
    matches.forEach(e => {
      console.log(`${e.entity_id}: state=${e.state}, unit="${e.attributes.unit_of_measurement || ''}", name="${e.attributes.friendly_name}"`);
    });
    ws.close();
  }
});
