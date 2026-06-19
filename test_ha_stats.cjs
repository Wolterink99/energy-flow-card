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
    console.log('Auth OK');
    
    // Request statistics
    const now = new Date();
    const startTime = new Date(now.getTime() - 365 * 24 * 60 * 60 * 1000).toISOString(); // Let's try 1 year to see if we can get monthly/yearly too!
    
    ws.send(JSON.stringify({
      id: 1,
      type: 'recorder/statistics_during_period',
      start_time: startTime,
      statistic_ids: ['sensor.totale_opwek_vandaag_2'],
      period: 'day'
    }));
  } else if (msg.type === 'result' && msg.id === 1) {
    console.log('Result:', JSON.stringify(msg, null, 2));
    ws.close();
  }
});
