const WebSocket = require('ws');

const token = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiI0NWIyYTA4MzhjOWQ0NjI2Yjc5NTY5NGU1Mzk0ZmU2ZCIsImlhdCI6MTc4MDIyODEwMiwiZXhwIjoyMDk1NTg4MTAyfQ.c-gOuNc3AezEImPkxMvuBeTPVbfpx8CzWqcixCpflM4";
const url = "wss://84wgzzzm8ai8igpemwargw2qsuihp9ww.ui.nabu.casa/api/websocket";
const commitHash = "e77c93c708d160a8261cd536ab6a32bf58acede2";

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
    const newUrl = `https://cdn.jsdelivr.net/gh/Wolterink99/energy-flow-card@${commitHash}/dist/energy-flow-card.js?v=${Date.now()}`;
    console.log(`Updating resource to: ${newUrl}`);
    ws.send(JSON.stringify({
      id: 1,
      type: 'lovelace/resources/update',
      resource_id: '133a64019132493f90d8c0741f8cdba6',
      url: newUrl,
      res_type: 'module'
    }));
  } else if (msg.type === 'result') {
    console.log('Result:', JSON.stringify(msg, null, 2));
    ws.close();
  }
});
