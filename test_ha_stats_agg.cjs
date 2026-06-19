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
    
    // Request statistics for 365 days
    const now = new Date();
    const startTime = new Date(now.getTime() - 365 * 24 * 60 * 60 * 1000).toISOString();
    
    ws.send(JSON.stringify({
      id: 1,
      type: 'recorder/statistics_during_period',
      start_time: startTime,
      statistic_ids: ['sensor.totale_opwek_vandaag_2'],
      period: 'day'
    }));
  } else if (msg.type === 'result' && msg.id === 1) {
    const rawStats = msg.result['sensor.totale_opwek_vandaag_2'] || [];
    console.log('Raw stats count:', rawStats.length);
    
    // 1. Process 7-day week history
    const last7Days = rawStats.slice(-7).map(point => {
      const date = new Date(point.start);
      return {
        label: date.toLocaleDateString('nl-NL', { weekday: 'short' }),
        value: point.state || 0
      };
    });
    console.log('Last 7 Days (Week):', last7Days);
    
    // 2. Process Monthly history (group daily values by month)
    const monthlyGroups = {};
    rawStats.forEach(point => {
      const date = new Date(point.start);
      const year = date.getFullYear();
      const month = date.getMonth(); // 0-11
      const monthKey = `${year}-${month.toString().padStart(2, '0')}`;
      const monthLabel = date.toLocaleDateString('nl-NL', { month: 'short' }); // e.g. "jan."
      
      // Since point.state is the cumulative value for the day, we sum the "change" or just add the daily states?
      // Wait! If the sensor is a daily resetting sensor, then its "state" at the end of the day is the daily total!
      // So to get the monthly total, we sum all the daily maximum states of that month!
      if (!monthlyGroups[monthKey]) {
        monthlyGroups[monthKey] = { label: monthLabel, sum: 0 };
      }
      monthlyGroups[monthKey].sum += point.state || 0;
    });
    
    const monthlyResults = Object.keys(monthlyGroups)
      .sort()
      .slice(-12)
      .map(key => ({
        label: monthlyGroups[key].label,
        value: monthlyGroups[key].sum
      }));
    console.log('Monthly Totals (Last 12 Months):', monthlyResults);

    // 3. Process Yearly history
    const yearlyGroups = {};
    rawStats.forEach(point => {
      const date = new Date(point.start);
      const year = date.getFullYear();
      if (!yearlyGroups[year]) {
        yearlyGroups[year] = 0;
      }
      yearlyGroups[year] += point.state || 0;
    });
    const yearlyResults = Object.keys(yearlyGroups).map(year => ({
      label: year,
      value: yearlyGroups[year]
    }));
    console.log('Yearly Totals:', yearlyResults);
    
    ws.close();
  }
});
