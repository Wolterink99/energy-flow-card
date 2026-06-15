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
    
    // Request history for the last 3 days
    const now = new Date();
    const startTime = new Date(now.getTime() - 3 * 24 * 60 * 60 * 1000).toISOString();
    
    ws.send(JSON.stringify({
      id: 1,
      type: 'history/history_during_period',
      start_time: startTime,
      entity_ids: ['sensor.totale_opwek_vandaag_2'],
      significant_changes_only: false,
      no_attributes: true
    }));
  } else if (msg.type === 'result' && msg.id === 1) {
    const entityHistory = msg.result['sensor.totale_opwek_vandaag_2'];
    if (entityHistory) {
      console.log('History length:', entityHistory.length);
      
      const dailyMax = {};
      const sorted = [...entityHistory].sort((a, b) => a.lu - b.lu);
      
      sorted.forEach(item => {
        const val = parseFloat(item.s);
        if (isNaN(val)) return;
        
        const date = new Date(item.lu * 1000);
        const dateKey = date.toISOString().split('T')[0];
        const weekday = date.toLocaleDateString('nl-NL', { weekday: 'short' });
        
        if (!dailyMax[dateKey] || val > dailyMax[dateKey].maxValue) {
          dailyMax[dateKey] = { weekday, maxValue: val };
        }
      });
      
      const result = Object.keys(dailyMax)
        .sort()
        .slice(-7)
        .map(key => ({
          date: key,
          day: dailyMax[key].weekday,
          value: dailyMax[key].maxValue
        }));
        
      console.log('Processed Daily Totals (Last 7 Days):', result);
    }
    ws.close();
  }
});
