const WebSocket = require('ws');

const token = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiI0NWIyYTA4MzhjOWQ0NjI2Yjc5NTY5NGU1Mzk0ZmU2ZCIsImlhdCI6MTc4MDIyODEwMiwiZXhwIjoyMDk1NTg4MTAyfQ.c-gOuNc3AezEImPkxMvuBeTPVbfpx8CzWqcixCpflM4";
const url = "wss://84wgzzzm8ai8igpemwargw2qsuihp9ww.ui.nabu.casa/api/websocket";

const ws = new WebSocket(url);

ws.on('open', () => {
  ws.send(JSON.stringify({
    type: 'auth',
    access_token: token
  }));
});

ws.on('message', (data) => {
  const msg = JSON.parse(data);
  if (msg.type === 'auth_ok') {
    ws.send(JSON.stringify({
      id: 1,
      type: 'get_states'
    }));
  } else if (msg.type === 'result' && msg.id === 1) {
    console.log('--- ALL TEMPERATURE SENSORS ---');
    const sensors = msg.result.filter(e => 
      (e.entity_id.startsWith('sensor.') && e.attributes.unit_of_measurement === '°C') ||
      e.attributes.device_class === 'temperature'
    );
    sensors.forEach(e => {
      console.log(`${e.entity_id}: state=${e.state}, friendly_name="${e.attributes.friendly_name}"`);
    });
    ws.close();
  }
});
