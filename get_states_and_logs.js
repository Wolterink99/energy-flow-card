const WebSocket = require('ws');

const token = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiI0NWIyYTA4MzhjOWQ0NjI2Yjc5NTY5NGU1Mzk0ZmU2ZCIsImlhdCI6MTc4MDIyODEwMiwiZXhwIjoyMDk1NTg4MTAyfQ.c-gOuNc3AezEImPkxMvuBeTPVbfpx8CzWqcixCpflM4";
const url = "wss://84wgzzzm8ai8igpemwargw2qsuihp9ww.ui.nabu.casa/api/websocket";

const ws = new WebSocket(url);

let messageId = 1;
let statesId = null;
let logsId = null;

ws.on('open', () => {
  console.log('Connected to HA WebSocket');
});

ws.on('message', (data) => {
  const msg = JSON.parse(data);
  
  if (msg.type === 'auth_required') {
    ws.send(JSON.stringify({
      type: 'auth',
      access_token: token
    }));
  } else if (msg.type === 'auth_ok') {
    console.log('Auth OK!');
    
    // Request states
    statesId = messageId++;
    ws.send(JSON.stringify({
      id: statesId,
      type: 'get_states'
    }));
    
    // Request system logs
    logsId = messageId++;
    ws.send(JSON.stringify({
      id: logsId,
      type: 'system_log/list'
    }));
  } else if (msg.type === 'result') {
    if (msg.id === statesId) {
      console.log('\n--- HEAT PUMP ENTITIES ---');
      const wpEntities = msg.result.filter(e => e.entity_id.includes('wp_'));
      if (wpEntities.length === 0) {
        console.log('No wp_ entities found!');
      } else {
        wpEntities.forEach(e => {
          console.log(`${e.entity_id}: state=${e.state}, name="${e.attributes.friendly_name}"`);
        });
      }
    } else if (msg.id === logsId) {
      console.log('\n--- MODBUS SYSTEM LOGS ---');
      const modbusLogs = msg.result.filter(log => 
        log.message.toLowerCase().includes('modbus') || 
        log.message.toLowerCase().includes('pymodbus') || 
        log.message.toLowerCase().includes('warmtepomp') ||
        log.message.toLowerCase().includes('sprsun')
      );
      if (modbusLogs.length === 0) {
        console.log('No Modbus-related log entries found.');
      } else {
        modbusLogs.forEach(log => {
          console.log(`[${log.level}] ${log.name}: ${log.message}`);
        });
      }
      ws.close();
    }
  }
});

ws.on('error', (err) => {
  console.error('WS Error:', err);
});

ws.on('close', () => {
  console.log('WS Connection closed');
});
