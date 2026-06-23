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
  } else if (msg.type === 'result') {
    if (msg.success) {
      const states = msg.result;
      const targetSensors = [
        'sensor.totale_live_zonnestroom',
        'sensor.totale_actuele_zonneproductie',
        'sensor.live_huisverbruik',
        'sensor.actueel_huisverbruik',
        'sensor.echt_huisverbruik_vandaag',
        'sensor.totaalverbruik_vandaag',
        'sensor.p1_meter_power',
        'switch.buiten_zwembadpomp_ledvance_plug_outdoor_eu_t'
      ];
      
      console.log('--- SENSOR STATES ---');
      targetSensors.forEach(s => {
        const match = states.find(st => st.entity_id === s);
        if (match) {
          console.log(`${s}: ${match.state} (friendly_name: ${match.attributes.friendly_name})`);
        } else {
          console.log(`${s}: NOT FOUND`);
        }
      });
    } else {
      console.error('Error fetching states:', msg.error);
    }
    ws.close();
  }
});
