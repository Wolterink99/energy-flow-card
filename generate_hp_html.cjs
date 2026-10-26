const fs = require('fs');
const path = require('path');

const srcFile = 'C:\\Users\\rober\\Downloads\\warmtepomp-dashboard.html';
let html = fs.readFileSync(srcFile, 'utf8');

// Update modal styling to fit iframe cleanly
html = html.replace(
  '.modal{position:fixed;left:50%;top:50%;width:min(1440px,calc(100vw - 32px));height:min(900px,calc(100vh - 32px));transform:translate(-50%,-50%);',
  '.modal{position:fixed;left:0;top:0;width:100%;height:100%;transform:none;border-radius:20px;'
);
html = html.replace(
  'body{background:radial-gradient(120% 100% at 50% 0%,#141a26 0%,var(--backdrop) 70%);',
  'body{background:#0e1117;margin:0;padding:0;'
);

// Update HA_BRIDGE
html = html.replace(
  'const HA_BRIDGE = { callService: null };',
  'const HA_BRIDGE = { callService: (d, s, data) => { if (window.parent && window.parent !== window) window.parent.postMessage({ type: "ha-call-service", domain: d, service: s, data: data }, "*"); } };'
);

// Update closeModal
html = html.replace(
  "function closeModal() { $('#modal').hidden = true; $('#reopen').hidden = false; }",
  "function closeModal() { $('#modal').hidden = true; $('#reopen').hidden = false; if (window.parent && window.parent !== window) window.parent.postMessage({ type: 'close-heatpump-popup' }, '*'); }"
);

// Update battery power sensor entity
html = html.replace(
  "batt_w:       { id: 'sensor.thuisbatterij_netto_vermogen', type: 'number' }",
  "batt_w:       { id: 'sensor.kwh_meter_3_phase_thuisbatterij_35_kw_vermogen', type: 'number' }"
);

// Add message listener for hass-update
const injectCode = `
window.addEventListener('message', (ev) => {
  if (ev.data && ev.data.type === 'hass-update' && ev.data.hass) {
    fromHass(ev.data.hass);
  }
});
if (window.parent && window.parent !== window) {
  window.parent.postMessage({ type: 'heatpump-ready' }, '*');
}
`;

html = html.replace('</script>', injectCode + '\n</script>');

// We can encode html as base64 or json string so no escaping issues
const jsonString = JSON.stringify(html);
const tsContent = `export const WARMTEPOMP_DASHBOARD_HTML: string = ${jsonString};\n`;

const targetFile = path.join(__dirname, 'src', 'components', 'warmtepomp-dashboard-html.ts');
fs.writeFileSync(targetFile, tsContent, 'utf8');
console.log('Successfully generated:', targetFile, 'Length:', html.length);
