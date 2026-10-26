const WebSocket = require('C:/Users/rober/.gemini/antigravity/scratch/node_modules/ws');

const token = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiI0NWIyYTA4MzhjOWQ0NjI2Yjc5NTY5NGU1Mzk0ZmU2ZCIsImlhdCI6MTc4MDIyODEwMiwiZXhwIjoyMDk1NTg4MTAyfQ.c-gOuNc3AezEImPkxMvuBeTPVbfpx8CzWqcixCpflM4";
const url = "wss://84wgzzzm8ai8igpemwargw2qsuihp9ww.ui.nabu.casa/api/websocket";
const { execSync } = require('child_process');
const commitHash = execSync('git rev-parse HEAD').toString().trim();

const ws = new WebSocket(url, { rejectUnauthorized: false });

ws.on('open', () => {
  console.log('Connected to HA');
});

ws.on('message', (data) => {
  const msg = JSON.parse(data);
  if (msg.type === 'auth_required') {
    ws.send(JSON.stringify({
      type: 'auth',
      access_token: token
    }));
  } else if (msg.type === 'auth_ok') {
    const ts = Date.now();
    const newEnergyCardUrl = `https://cdn.jsdelivr.net/gh/Wolterink99/energy-flow-card@${commitHash}/dist/energy-flow-card.js?v=${ts}`;
    const newClaudeSceneUrl = `https://cdn.jsdelivr.net/gh/Wolterink99/energy-flow-card@${commitHash}/dist/claude-energy-scene.js?v=${ts}`;

    console.log(`Updating energy-flow-card resource to: ${newEnergyCardUrl}`);
    ws.send(JSON.stringify({
      id: 1,
      type: 'lovelace/resources/update',
      resource_id: '133a64019132493f90d8c0741f8cdba6',
      url: newEnergyCardUrl,
      res_type: 'module'
    }));

    console.log(`Updating claude-energy-scene resource to: ${newClaudeSceneUrl}`);
    ws.send(JSON.stringify({
      id: 2,
      type: 'lovelace/resources/update',
      resource_id: 'e41c291adbbf4cb58138f46db6d9a7d1',
      url: newClaudeSceneUrl,
      res_type: 'module'
    }));
  } else if (msg.type === 'result') {
    console.log(`Result for request ${msg.id}:`, msg.success ? 'SUCCESS' : msg.error);
    if (msg.id === 2) {
      ws.close();
    }
  }
});
