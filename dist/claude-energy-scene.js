/* claude-energy-scene v3 — energie-screensaver en -dashboard voor Home Assistant.
 * Geen dependencies. Minimale config:
 *   type: custom:claude-energy-scene
 *   screensaver: true            # tik op achtergrond -> tap_action / navigatie
 *   battery_invert: true         # negatief batterijvermogen = ontladen
 *   tap_action: { action: navigate, navigation_path: /lovelace/0 }
 *   entities: { load, home_today, solar, solar_today, grid, grid_import_today, grid_export_today,
 *               grid_price, battery_power, battery_soc, battery_charge_today, battery_discharge_today,
 *               weather, sun }
 * Optioneel:
 *   statistics: { grid_import, grid_export, grid_import_cost, grid_export_compensation, solar,
 *                 battery_charge, battery_discharge }   (standaard uit het Energie-dashboard)
 *   powerplay: { today, month, prev_month, year }      (Zonneplan; standaard automatisch gevonden)
 */
const VERSION = '3.0.0';
const FONT_URL = 'https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600&display=swap';

/* ---------- opmaak ---------- */
const NL = 'nl-NL';
const NF = [0, 1, 2, 3].map((d) => new Intl.NumberFormat(NL, { minimumFractionDigits: d, maximumFractionDigits: d }));
const num = (v, d = 1) => NF[d].format(v);
const fmtPower = (w) => {
  const a = Math.abs(w || 0);
  return a < 1000 ? { v: num(a, 0), u: 'W' } : { v: num(a / 1000, a < 10000 ? 2 : 1), u: 'kW' };
};
const fmtKwh = (v, d = 1) => (v == null || !isFinite(v) ? '–' : `${num(v, d)} kWh`);
const fmtEur = (v, d = 2) => (v == null || !isFinite(v) ? '–' : `${v < 0 ? '− ' : ''}€ ${num(Math.abs(v), d)}`);
const fmtEurS = (v) => (v == null || !isFinite(v) ? '–' : `${v < 0 ? '−' : '+'} € ${num(Math.abs(v), 2)}`);
const fmtHM = (t) => new Date(t).toLocaleTimeString(NL, { hour: '2-digit', minute: '2-digit' });
const fmtPct = (v) => (v == null || !isFinite(v) ? '–' : `${num(v, 0)}%`);
const DAYS = ['zondag', 'maandag', 'dinsdag', 'woensdag', 'donderdag', 'vrijdag', 'zaterdag'];
const MONTHS = ['januari', 'februari', 'maart', 'april', 'mei', 'juni', 'juli', 'augustus', 'september', 'oktober', 'november', 'december'];
const cap = (s) => s.charAt(0).toUpperCase() + s.slice(1);
const ymd = (d) => `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`;

const clamp = (v, a, b) => Math.min(b, Math.max(a, v));
const hex = (h) => [1, 3, 5].map((i) => parseInt(h.slice(i, i + 2), 16));
const mixRGB = (a, b, t) => a.map((v, i) => Math.round(v + (b[i] - v) * t));
const rgb = (a) => `rgb(${a[0]},${a[1]},${a[2]})`;
const mix = (h1, h2, t) => rgb(mixRGB(hex(h1), hex(h2), t));
const toMs = (v) => (typeof v === 'number' ? (v < 1e12 ? v * 1000 : v) : new Date(v).getTime());
const sum = (a) => a.reduce((s, v) => s + (v || 0), 0);
let seed = 11;
const rand = () => ((seed = (seed * 16807) % 2147483647) / 2147483647);

/* ---------- kleuren ---------- */
const C = {
  solar: '#F2B33D', import: '#E8705F', export: '#46B98A', battery: '#5B9DF5', batteryOut: '#A889F0',
  home: '#C9CED6', soc: '#E9ECF1', low: '#46B98A', normal: '#8C95A3', high: '#E8705F', idle: '#7C8594',
  ev: '#3CC4D6', socLow: '#E8705F', socMid: '#F2A33D', socHigh: '#46B98A',
};
// laadniveau-kleur: bijna leeg rood, daarna oranje, daarna groen
const socColor = (soc) => (soc == null ? C.idle : soc < 20 ? C.socLow : soc < 50 ? C.socMid : C.socHigh);
const CONDITIONS = ['sunny', 'clear-night', 'partlycloudy', 'cloudy', 'fog', 'windy', 'windy-variant', 'rainy', 'pouring', 'lightning', 'lightning-rainy', 'hail', 'snowy', 'snowy-rainy', 'exceptional'];
// scènekleuren: [nacht, dag]
const PAL = {
  wall: ['#3C2119', '#97452F'], 'wall-side': ['#2C1812', '#7A3725'], 'wall-line': ['#251410', '#6E2F20'],
  plinth: ['#26140F', '#5E2A1E'], band: ['#5C4024', '#D9A15C'], board: ['#3A3D42', '#F1F1EC'],
  clad: ['#1A1D23', '#4B525C'], 'clad-line': ['#121418', '#3A4048'],
  roof: ['#14171C', '#33373E'], 'roof-line': ['#0D0F13', '#26292F'], ridge: ['#0B0D10', '#202328'],
  frame: ['#2E3036', '#EDEEEA'], sill: ['#33363C', '#D6D7D2'], glass: ['#101826', '#8FB0CC'],
  door: ['#20242A', '#5A6068'], 'door-line': ['#171A1F', '#474C53'], dframe: ['#121418', '#262A31'],
  panel: ['#0D1422', '#1E2B44'], 'panel-line': ['#2A374F', '#8193AE'],
  grass: ['#0F1D14', '#557F49'], 'grass-front': ['#0C1810', '#46703D'], soil: ['#0A0E0C', '#1B231D'], lane: ['#18201B', '#2B362E'],
  'hill-far': ['#0B111C', '#8BA3BA'], 'hill-near': ['#0B1512', '#6C8D69'],
  pylon: ['#2A3244', '#7D8795'], tree: ['#0D1812', '#41643B'], shrub: ['#0C1610', '#4A6E3F'],
  cab: ['#1A202A', '#E3E6EA'], 'cab-edge': ['#2C3443', '#B5BBC3'], 'cab-screen': ['#0A0E15', '#1E232B'],
  cloud: ['#1B2131', '#EEF1F5'],
  pave: ['#26150F', '#8C4A38'], 'pave-line': ['#1C0F0B', '#74392A'], bed: ['#110E0B', '#3F3228'],
  flower: ['#4F5449', '#EEF0E2'], 'shrub-lt': ['#151F12', '#A4A957'], hedge: ['#0B140E', '#3B5E34'], fence: ['#14110E', '#6B5747'],
  'fence-line': ['#0E0C0A', '#54433A'], post: ['#0B0C0E', '#2A2C30'],
  'board-side': ['#2E3135', '#D6D7D1'], insul: ['#3A4256', '#9AA6B8'],
  car: ['#1C2028', '#8E96A0'], 'car-side': ['#14171D', '#6E7782'], 'car-top': ['#232832', '#AAB2BB'], charger: ['#2B2F36', '#B7BABF'],
};
const SKY = { night: ['#04070E', '#0C1322'], twilight: ['#1A2238', '#7E5A4E'], day: ['#4E7CB2', '#AAC3DB'] };

const WEATHER_NL = {
  'clear-night': 'Helder', cloudy: 'Bewolkt', fog: 'Mist', hail: 'Hagel', lightning: 'Onweer',
  'lightning-rainy': 'Onweersbuien', partlycloudy: 'Half bewolkt', pouring: 'Zware regen', rainy: 'Regen',
  snowy: 'Sneeuw', 'snowy-rainy': 'Natte sneeuw', sunny: 'Zonnig', windy: 'Winderig', 'windy-variant': 'Winderig',
  exceptional: 'Uitzonderlijk',
};

/* ---------- iconen (24x24, lijn) ---------- */
const I = (p) => `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.75" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">${p}</svg>`;
const CLOUD = 'M7.5 18h9a4 4 0 0 0 .6-7.95A5.5 5.5 0 0 0 6.6 11.2 3.4 3.4 0 0 0 7.5 18z';
const CLOUD_UP = 'M7.5 15h9a4 4 0 0 0 .6-7.95A5.5 5.5 0 0 0 6.6 8.2 3.4 3.4 0 0 0 7.5 15z';
const ICON = {
  solar: I('<path d="M4.5 5h15l-1.6 10H6.1z"/><path d="M5.3 10h13.4M9.8 5l-.6 10M14.2 5l.6 10M12 15v4M8 19h8"/>'),
  grid: I('<path d="M8 21l4-17 4 17"/><path d="M5 8h14M6.5 12.5h11M9.6 12.5l4.8 6M14.4 12.5l-4.8 6M12 4V2.5"/>'),
  battery: I('<rect x="3" y="7" width="16" height="10" rx="2"/><path d="M21.5 10.5v3M7 10v4M10.5 10v4"/>'),
  home: I('<path d="M3.5 11 12 4l8.5 7"/><path d="M5.5 9.5V20h13V9.5"/><path d="M10 20v-5.5h4V20"/>'),
  price: I('<path d="M17.5 6.6A7 7 0 1 0 17.5 17.4"/><path d="M4 10.4h9M4 13.6h9"/>'),
  total: I('<path d="M4 20h16"/><path d="M6.5 16.5v-5M11 16.5V7.5M15.5 16.5v-7M20 16.5V4.5"/>'),
  plug: I('<path d="M9 3v5M15 3v5"/><path d="M6.5 8h11v3a5.5 5.5 0 0 1-11 0z"/><path d="M12 16.5V21"/>'),
  sliders: I('<path d="M4 7h10M18 7h2M4 17h4M12 17h8"/><circle cx="16" cy="7" r="2"/><circle cx="10" cy="17" r="2"/>'),
  close: I('<path d="M6 6l12 12M18 6 6 18"/>'),
  prev: I('<path d="M15 5l-7 7 7 7"/>'),
  next: I('<path d="M9 5l7 7-7 7"/>'),
  sun: I('<circle cx="12" cy="12" r="4"/><path d="M12 2.5v2M12 19.5v2M4.6 4.6 6 6M18 18l1.4 1.4M2.5 12h2M19.5 12h2M4.6 19.4 6 18M18 6l1.4-1.4"/>'),
  moon: I('<path d="M19.5 14.6A8 8 0 1 1 9.4 4.5a6.4 6.4 0 0 0 10.1 10.1z"/>'),
  cloud: I(`<path d="${CLOUD}"/>`),
  partly: I(`<path d="M8.5 5.2V3.8M4.3 7 3.3 6M3.5 11H2M12.7 7l1-1"/><path d="M5.6 12.6A3.6 3.6 0 0 1 11.8 9"/><path d="M9.5 20h7.5a3.5 3.5 0 0 0 .5-6.96A4.8 4.8 0 0 0 8.6 14a3 3 0 0 0 .9 6z"/>`),
  rain: I(`<path d="${CLOUD_UP}"/><path d="M8.5 18l-1 2.5M12.5 18l-1 2.5M16.5 18l-1 2.5"/>`),
  pouring: I(`<path d="${CLOUD_UP}"/><path d="M8 17.5l-1.5 4M12 17.5l-1.5 4M16 17.5l-1.5 4"/>`),
  snow: I(`<path d="${CLOUD_UP}"/><path d="M8.5 19h.01M12 20.5h.01M15.5 19h.01"/>`),
  fog: I('<path d="M4 9h16M6 13h12M4 17h16"/>'),
  storm: I(`<path d="${CLOUD_UP}"/><path d="M12.5 15.5 10.5 19h3l-2 3.5"/>`),
  wind: I('<path d="M3 8.5h10.5a2.75 2.75 0 1 0-2.7-3.2M3 15.5h14.5a2.75 2.75 0 1 1-2.7 3.2M3 12h8"/>'),
};
const WEATHER_ICON = {
  'clear-night': 'moon', cloudy: 'cloud', fog: 'fog', hail: 'snow', lightning: 'storm', 'lightning-rainy': 'storm',
  partlycloudy: 'partly', pouring: 'pouring', rainy: 'rain', snowy: 'snow', 'snowy-rainy': 'snow', sunny: 'sun',
  windy: 'wind', 'windy-variant': 'wind', exceptional: 'cloud',
};

/* =====================================================================
 * Scène. Tekenvlak 1600 breed, maaiveld (voorkant) y=560.
 * De woning staat in schuine parallelprojectie: de voorgevel op ware grootte,
 * de diepte loopt langs vector D naar links-achter. Alles wat "naar achter" ligt
 * gebruikt dezelfde D, zodat dakvlak, zijgevel, panelen en grasvlak op elkaar aansluiten.
 * ===================================================================== */
const FULL_UNIT = 390;         // ware lengte-eenheden per diepte-eenheid (woning ~10 m)
const GROUND = 560;           // straatrand (voorkant van het terrein)
const VB = { y: 100, h: 470 }; // eindigt vlak onder de grasrand: de onderbalk sluit direct aan
const D = [-130, -48];         // dieptevector: 1 = diepte van de woning (~10 m)
const VF = 0.6;                // gevel staat zoveel diepte achter de straatrand (ruimte voor oprit en tuin)
const HX = 70, HY = VF * D[1]; // verschuiving van de woning op het scherm
// schaal: een deur van 2,1 m is 82 eenheden hoog -> 1 m ≈ 39 eenheden
const add = (p, q, k = 1) => [p[0] + q[0] * k, p[1] + q[1] * k];
const sh = (p) => [p[0] + HX, p[1] + HY];
const pt = (p) => `${p[0].toFixed(1)},${p[1].toFixed(1)}`;
const poly = (ps) => ps.map(pt).join(' ');
// Woning in eigen coördinaten (gevelvoet op y=GROUND); de linker zijgevel loopt in de diepte onder het dakvlak.
const H = { l: 652, r: 948, apex: [800, 236], eaveL: [636, 440], eaveR: [964, 440] };
H.slopeL = (H.eaveL[1] - H.apex[1]) / (H.apex[0] - H.eaveL[0]);
H.slopeR = (H.eaveR[1] - H.apex[1]) / (H.eaveR[0] - H.apex[0]);
const boardY = (x) => H.apex[1] + (x < H.apex[0] ? (H.apex[0] - x) * H.slopeL : (x - H.apex[0]) * H.slopeR);
// linker dakvlak: u = goot->nok, v = diepte (0 voor, 1 achter)
const roofPt = (u, v) => add(add(H.eaveL, [H.apex[0] - H.eaveL[0], H.apex[1] - H.eaveL[1]], u), D, v);
// hoogte van het dakvlak op scherm-x, op diepte v
const roofY = (x, v) => { const u = (x - H.eaveL[0] - v * D[0]) / (H.apex[0] - H.eaveL[0]); return H.eaveL[1] + u * (H.apex[1] - H.eaveL[1]) + v * D[1]; };
// punt op het maaiveld rond de woning; dv = diepte t.o.v. de gevel (negatief = ervoor)
const gl = (x, dv, h = 0) => [x + dv * D[0], GROUND + dv * D[1] - h];
// punt op de linker zijgevel: v = diepte (0..1), h = hoogte boven maaiveld
const sw = (v, h = 0) => add([H.l, GROUND - h], D, v);
const DOOR = { v0: 0.45, v1: 0.57, h: 84 };                      // voordeur in de zijgevel; daarachter zit de meterkast
const WIN = { v0: 0.045, v1: 0.3, h0: 26, h1: 84 };            // zijraam (met kamerlicht)
const BAT = { x0: 626, x1: H.l, v0: 0.85, v1: 0.89, h: 46 };    // thuisbatterij (~1,2 m) tegen de achterhoek
const GATE = { x0: 470, x1: H.l, v: 1.0, h: 74 };               // poort (~1,9 m), twee vlakken, sluit aan op het huis
const DRIVE = { x0: 470, x1: H.l - 2 };
const CAR = { x0: 606, x1: 676, v0: -0.4, len: 0.45 };          // auto op de oprit, naast de tuin
const EVC = { x: 660, v: -0.4, h: 66 };                         // laadpaal aan de rand van de tuin

// pad met afgeronde hoeken door een reeks punten
function roundedPath(pts, r = 10) {
  let d = `M${pts[0][0].toFixed(1)} ${pts[0][1].toFixed(1)}`;
  for (let i = 1; i < pts.length - 1; i++) {
    const [x0, y0] = pts[i - 1], [x1, y1] = pts[i], [x2, y2] = pts[i + 1];
    const l1 = Math.hypot(x1 - x0, y1 - y0), l2 = Math.hypot(x2 - x1, y2 - y1);
    const rr = Math.min(r, l1 / 2, l2 / 2);
    const ax = x1 - ((x1 - x0) / l1) * rr, ay = y1 - ((y1 - y0) / l1) * rr;
    const bx = x1 + ((x2 - x1) / l2) * rr, by = y1 + ((y2 - y1) / l2) * rr;
    d += ` L${ax.toFixed(1)} ${ay.toFixed(1)} Q${x1.toFixed(1)} ${y1.toFixed(1)} ${bx.toFixed(1)} ${by.toFixed(1)}`;
  }
  const [lx, ly] = pts[pts.length - 1];
  return `${d} L${lx.toFixed(1)} ${ly.toFixed(1)}`;
}

/* --- hoogspanningsmast: vakwerk met taps toelopende poten, twee traversen, isolatorkettingen --- */
const PL = { legB: 42, legT: 11, top: 262, peak: 306, armL: [-222, 72], armU: [-262, 56], ins: 22 };
const legX = (y) => PL.legB - (-y / PL.top) * (PL.legB - PL.legT);
function pylonSVG(x, b, s) {
  const lv = [0, -48, -92, -132, -168, -200, -230, -262];
  let brace = '';
  for (let i = 0; i < lv.length - 1; i++) {
    const a = legX(lv[i]), c = legX(lv[i + 1]);
    brace += `M${-c} ${lv[i + 1]}H${c}M${-a} ${lv[i]}L${c} ${lv[i + 1]}M${a} ${lv[i]}L${-c} ${lv[i + 1]}`;
  }
  const [yl, wl] = PL.armL, [yu, wu] = PL.armU;
  const arms = `M${-wl} ${yl}H${wl}M${-wl} ${yl}L${-legX(yl - 22)} ${yl - 22}M${wl} ${yl}L${legX(yl - 22)} ${yl - 22}
    M${-wl * 0.62} ${yl}L${-wl * 0.4} ${yl - 14}M${wl * 0.62} ${yl}L${wl * 0.4} ${yl - 14}
    M${-wu} ${yu}H${wu}M${-wu} ${yu}L-5 ${yu - 22}M${wu} ${yu}L5 ${yu - 22}M${-wu * 0.6} ${yu}L${-wu * 0.38} ${yu - 9}M${wu * 0.6} ${yu}L${wu * 0.38} ${yu - 9}
    M-16 ${-PL.peak + 6}H16`;
  const ins = (ix, iy) => `<path d="M${ix} ${iy}V${iy + PL.ins}" stroke-width="1"/>` +
    [4, 9, 14, 19].map((d) => `<ellipse cx="${ix}" cy="${iy + d}" rx="3.2" ry="1.3" fill="var(--insul)" stroke="none"/>`).join('');
  return `<g transform="translate(${x} ${b}) scale(${s})" class="pylon">
    <rect x="${-PL.legB - 7}" y="-3" width="14" height="5" fill="var(--pylon)" stroke="none"/><rect x="${PL.legB - 7}" y="-3" width="14" height="5" fill="var(--pylon)" stroke="none"/>
    <path d="M${-PL.legB} 0L${-PL.legT} ${-PL.top}L0 ${-PL.peak}L${PL.legT} ${-PL.top}L${PL.legB} 0" stroke-width="2.4"/>
    <path d="${brace}" stroke-width="1"/>
    <path d="${arms}" stroke-width="1.6"/>
    ${ins(-wl, yl)}${ins(wl, yl)}${ins(-wu, yu)}${ins(wu, yu)}</g>`;
}
// masten lopen in de diepte weg langs D (zelfde perspectief als de woning)
const PYLONS = [0, 1, 2, 3].map((k) => [230 + k * D[0], GROUND + k * D[1], [1, 0.66, 0.46, 0.32][k]]);
const pylonPts = ([x, b, s]) => {
  const [yl, wl] = PL.armL, [yu, wu] = PL.armU, i = PL.ins;
  return [[x - wl * s, b + (yl + i) * s], [x + wl * s, b + (yl + i) * s], [x - wu * s, b + (yu + i) * s], [x + wu * s, b + (yu + i) * s], [x, b - PL.peak * s]];
};
const LAWN_BACK = GROUND + 3.2 * D[1];

function hillPath(y0, amp, ph, f1, f2) {
  let d = `M-2400 ${GROUND} L-2400 ${y0}`;
  for (let x = -2400; x <= 4000; x += 20) {
    const y = y0 - amp * (0.5 + 0.5 * Math.sin(x / f1 + ph)) - amp * 0.3 * Math.sin(x / f2 + ph * 2);
    d += ` L${x} ${y.toFixed(1)}`;
  }
  return `${d} L4000 ${GROUND} Z`;
}

// vensterbank van donkere baksteen (rollaag)
const brickSill = (x, w, y) => `<rect x="${x - 4}" y="${y}" width="${w + 8}" height="5" fill="var(--plinth)"/>
  <rect x="${x - 4}" y="${y}" width="${w + 8}" height="1.2" fill="var(--wall-line)"/>`;
// bovenraam: smalle crèmewitte lijst, donker kozijn met twee draaiende delen
function upperWin(x, y, w, h) {
  const m = x + w / 2, pw = w / 2 - 8;
  return `<rect x="${x}" y="${y}" width="${w}" height="${h}" fill="var(--frame)"/>
    <rect x="${x + 2.5}" y="${y + 2.5}" width="${w - 5}" height="${h - 5}" fill="var(--dframe)"/>
    <rect class="glass" x="${x + 5.5}" y="${y + 5.5}" width="${pw}" height="${h - 11}"/>
    <rect class="glass" x="${m + 2.5}" y="${y + 5.5}" width="${pw}" height="${h - 11}"/>
    ${brickSill(x, w, y + h)}`;
}
// benedenraam: breed wit kozijn; optioneel bovenlicht met donker kozijntje.
// Met `key` licht het glas op volgens de verlichting van die kamer (config window_lights).
function groundWin(x, y, w, h, transom = 0, key = '') {
  const pane = (px, py, pw, ph) => `<rect class="glass" x="${px}" y="${py}" width="${pw}" height="${ph}"${key ? ` data-win="${key}"` : ''}/>` +
    (key ? `<rect data-wg="${key}" x="${px}" y="${py}" width="${pw}" height="${ph}" fill="#F3C67E" opacity="0"/>` : '');
  let s = `<rect x="${x}" y="${y}" width="${w}" height="${h}" fill="var(--frame)"/>`;
  if (transom) {
    s += `<rect x="${x + 5}" y="${y + 5}" width="${w - 10}" height="${transom}" fill="var(--dframe)"/>
      ${pane(x + 7.5, y + 7.5, w - 15, transom - 5)}${pane(x + 5, y + 9 + transom, w - 10, h - 14 - transom)}`;
  } else s += pane(x + 5, y + 5, w - 10, h - 10);
  return `${s}${brickSill(x, w, y + h)}`;
}
// stroombanen (schermcoördinaten): alle kabels lopen naar de voordeur, daarachter zit de meterkast
const DV = (DOOR.v0 + DOOR.v1) / 2;
const DOOR_FOOT = sh(sw(DV));
const BAT_TOP = sh(gl((BAT.x0 + BAT.x1) / 2, BAT.v0, BAT.h));
const BAT_FOOT = sh(gl((BAT.x0 + BAT.x1) / 2, BAT.v0));
const EV_FOOT = sh(gl(EVC.x, EVC.v));
const EV_TOP = sh(gl(EVC.x, EVC.v, EVC.h));
// knooppunt voor de deur, op de grond net buiten de goot (x=636): hier komen alle kabels samen
const JG = 636;
const J = sh(gl(JG, DV));
const gp = (x, v) => sh(gl(x, v));
// paneelkabel: recht het dakvlak af naar de goot boven de deur, dan langs de gevel omlaag naar de deur
const SOLAR_CABLE = [roofPt(0.3, DV), roofPt(0, DV), [roofPt(0, DV)[0], GROUND + DV * D[1]]];
const PY = pylonPts(PYLONS[0]);
// padrichting = richting van "vooruit": net -> huis, zon -> huis, huis -> batterij (laden), huis -> laadpaal
const FLOWS = {
  grid: [[PY[1][0] + 28, J[1]], J],                                   // horizontaal uit het trafohuisje naar het knooppunt voor de voordeur
  battery: [J, gp(JG, 0.84), BAT_FOOT],                               // langs de zijmuur naar achteren, naar de batterij
  solar: SOLAR_CABLE.map(sh),                                         // recht over het dak, via de goot naar de voordeur
};
// labels: dev = ankerpunt op het apparaat, pos = ankerpunt van het kaartje, al = uitlijning
const TX = PY[1][0], TF = J[1] + 24;  // trafohuisje naast de mast
const LABELS = {
  solar: { dev: sh(roofPt(0.55, 0.5)), pos: [540, 192], al: 'bc' },   // zweeft in de lucht
  grid: { dev: [TX, TF + 1], row: true },                              // onder de netpaal
  battery: { dev: BAT_FOOT, row: true },                               // links naast de laadpaal
  ev: { dev: EV_FOOT, row: true },                                     // onder de laadpaal
  home: { dev: sh([800, GROUND - 8]), row: true },                     // rechts naast de laadpaal
};
const ROW_ORDER = ['grid', 'battery', 'ev', 'home', 'price', 'overview'];
// vermogenslabels in de scène, direct bij het apparaat
const SOLAR_TAG = sh(roofPt(0.5, 1));   // midden van de linker dakrand
const TAGS = { grid: [TX, TF - 74], battery: [BAT_TOP[0], BAT_TOP[1] - 6], solar: [SOLAR_TAG[0] - 10, SOLAR_TAG[1], 'l'] };
function sceneSVG() {
  seed = 11;
  const stars = Array.from({ length: 90 }, () => {
    const x = (rand() * 2400 - 400).toFixed(0), y = (rand() * 1000 - 600).toFixed(0);
    const r = (0.5 + rand() * 0.9).toFixed(2), o = (0.35 + rand() * 0.65).toFixed(2);
    const tw = rand() < 0.3 ? ` class="tw" style="animation-delay:-${(rand() * 4).toFixed(1)}s"` : '';
    return `<circle cx="${x}" cy="${y}" r="${r}" opacity="${o}"${tw}/>`;
  }).join('');
  const cloudDefs = [[160, 110, 1.25], [560, 50, 0.9], [980, 130, 1.4], [1380, 70, 1.05], [-180, 180, 1.1], [1780, 160, 1.2], [760, 200, 0.8], [1180, 20, 0.85]];
  const clouds = cloudDefs.map(([x, y, s], i) => `<g class="cloud" data-i="${i}" style="animation-duration:${140 + i * 23}s;animation-delay:-${i * 31}s">
      <g transform="translate(${x} ${y}) scale(${s})"><ellipse cx="0" cy="0" rx="110" ry="20"/><ellipse cx="-38" cy="-10" rx="52" ry="22"/>
      <ellipse cx="22" cy="-18" rx="60" ry="26"/><ellipse cx="74" cy="-5" rx="42" ry="17"/></g></g>`).join('');
  const drops = Array.from({ length: 120 }, () => {
    const x = (rand() * 2400 - 400).toFixed(0), len = (14 + rand() * 10).toFixed(0);
    return `<line x1="${x}" y1="0" x2="${x}" y2="${len}" style="animation-duration:${(0.7 + rand() * 0.45).toFixed(2)}s;animation-delay:-${(rand() * 2).toFixed(2)}s"/>`;
  }).join('');
  const flakes = Array.from({ length: 90 }, () => {
    const x = (rand() * 2400 - 400).toFixed(0);
    return `<circle cx="${x}" cy="0" r="${(1.2 + rand() * 1.6).toFixed(1)}" style="animation-duration:${(9 + rand() * 8).toFixed(1)}s;animation-delay:-${(rand() * 16).toFixed(1)}s"/>`;
  }).join('');
  const hail = Array.from({ length: 70 }, () => {
    const x = (rand() * 2400 - 400).toFixed(0);
    return `<circle cx="${x}" cy="0" r="${(1.3 + rand() * 1.2).toFixed(1)}" style="animation-duration:${(0.45 + rand() * 0.3).toFixed(2)}s;animation-delay:-${(rand() * 1.5).toFixed(2)}s"/>`;
  }).join('');
  const rays = Array.from({ length: 12 }, (_, i) => { const a = (i / 12) * Math.PI * 2; return `M${(Math.cos(a) * 32).toFixed(1)} ${(Math.sin(a) * 32).toFixed(1)}L${(Math.cos(a) * 50).toFixed(1)} ${(Math.sin(a) * 50).toFixed(1)}`; }).join('');

  const pylons = PYLONS.slice().reverse().map(([x, b, s]) => pylonSVG(x, b, s)).join('');
  let wires = '';
  for (let i = 0; i < PYLONS.length - 1; i++) {
    const a = pylonPts(PYLONS[i]), b = pylonPts(PYLONS[i + 1]);
    for (let k = 0; k < 5; k++) {
      const [x1, y1] = a[k], [x2, y2] = b[k];
      wires += `<path d="M${x1.toFixed(1)} ${y1.toFixed(1)} Q${((x1 + x2) / 2).toFixed(1)} ${(Math.max(y1, y2) + 14 * PYLONS[i][2]).toFixed(1)} ${x2.toFixed(1)} ${y2.toFixed(1)}"${k === 4 ? ' stroke-width=".6"' : ''}/>`;
    }
  }

  /* --- woning (eigen coördinaten) --- */
  const A = H.apex, A2 = add(A, D), EL = H.eaveL, EL2 = add(EL, D);
  const W0 = [H.l, GROUND], W1 = [H.l, 432];
  const side = poly([W0, W1, add(W1, D), add(W0, D)]);
  // zijraam: wit kozijn, glas dat 's avonds oplicht zoals de andere ramen
  const w = WIN;
  // alles ligt in het vlak van de zijgevel (verticale zijden, horizontale zijden langs de dieptevector), dus nooit scheef
  const wq = (a, b, h0, h1) => poly([sw(a, h0), sw(b, h0), sw(b, h1), sw(a, h1)]);
  const wm = 0.014, hm = 4.5;
  const sideWin = `<polygon points="${wq(w.v0 - wm, w.v1 + wm, w.h0 - hm, w.h1 + hm)}" fill="var(--frame)"/>
    <polygon class="glass" points="${wq(w.v0, w.v1, w.h0, w.h1)}"/>
    <polygon points="${wq(w.v0 - 0.035, w.v1 + 0.035, w.h0 - hm - 5, w.h0 - hm)}" fill="var(--plinth)"/>
    <polygon points="${wq(w.v0 - 0.035, w.v1 + 0.035, w.h0 - hm - 1.4, w.h0 - hm)}" fill="var(--wall-line)"/>`;
  const roof = poly([EL, A, A2, EL2]);
  let roofLines = '';
  for (let u = 0.05; u < 1; u += 0.05) roofLines += `M${pt(roofPt(u, 0))} L${pt(roofPt(u, 1))}`;
  let panels = '';
  const rows = [[0.3, 0.55], [0.58, 0.83]], cols = 5, v0 = 0.1, v1 = 0.9, gap = 0.012;
  rows.forEach(([ua, ub]) => {
    for (let c = 0; c < cols; c++) {
      const va = v0 + ((v1 - v0) / cols) * c + gap / 2, vb = v0 + ((v1 - v0) / cols) * (c + 1) - gap / 2;
      const q = [roofPt(ua, va), roofPt(ub, va), roofPt(ub, vb), roofPt(ua, vb)];
      const um = (ua + ub) / 2, vm = (va + vb) / 2;
      panels += `<polygon points="${poly(q)}" fill="var(--panel)" stroke="var(--panel-line)" stroke-width="1" stroke-linejoin="round"/>
        <path d="M${pt(roofPt(um, va))}L${pt(roofPt(um, vb))}M${pt(roofPt(ua, vm))}L${pt(roofPt(ub, vm))}" stroke="var(--panel-line)" stroke-width=".6" opacity=".6"/>`;
    }
  });
  // schoorsteen: staande koker op het dakvlak bij de nok; de voet volgt de dakhelling
  const cv = 0.14, cdep = 0.05, cc = roofPt(0.9, cv)[0], cx0 = cc - 9, cx1 = cc + 9;
  const cyt = roofY(cx1, cv) - 30, cdv = [D[0] * cdep, D[1] * cdep];
  const chimney = `
    <polygon points="${poly([[cx0, cyt], add([cx0, cyt], cdv), add([cx0, roofY(cx0, cv)], cdv), [cx0, roofY(cx0, cv)]])}" fill="var(--wall-side)"/>
    <polygon points="${poly([[cx0, cyt], [cx1, cyt], [cx1, roofY(cx1, cv)], [cx0, roofY(cx0, cv)]])}" fill="var(--wall)"/>
    <polygon points="${poly([[cx0 - 2, cyt], [cx1 + 2, cyt], add([cx1 + 2, cyt], cdv), add([cx0 - 2, cyt], cdv)])}" fill="var(--ridge)"/>
    <rect x="${(cx0 - 2).toFixed(1)}" y="${(cyt).toFixed(1)}" width="22" height="4" fill="var(--ridge)"/>`;
  const facade = poly([[H.l, GROUND], [H.l, boardY(H.l)], A, [H.r, boardY(H.r)], [H.r, GROUND]]);
  // siermetselwerk: twee rijen lichte koppen; boven de ramen trapt de band een laag op
  const band = (y, x1 = H.l, x2 = H.r) => `<line x1="${x1}" x2="${x2}" y1="${y}" y2="${y}" stroke="var(--band)" stroke-width="3" stroke-dasharray="5 5"/>
    <line x1="${x1}" x2="${x2}" y1="${y + 3.5}" y2="${y + 3.5}" stroke="var(--band)" stroke-width="3" stroke-dasharray="5 5" stroke-dashoffset="5"/>`;
  const bands = band(343) + band(334, 727, 791) + band(334, 809, 873) + band(448) + band(439, 663, 721) + band(439, 879, 939);
  const cladY = 300, cladL = (cladY - A[1]) / H.slopeL, cladR = (cladY - A[1]) / H.slopeR;
  let cladLines = '';
  for (let x = A[0] - cladL + 7; x < A[0] + cladR; x += 7) cladLines += `M${x.toFixed(1)} ${A[1]}V${cladY}`;

  // gewone voordeur in de zijgevel: wit kozijn, donkere deur met glaspaneel, stoep
  const d = DOOR;
  const door = `
    <polygon points="${poly([sw(d.v0 - 0.012, 0), sw(d.v0 - 0.012, d.h + 5), sw(d.v1 + 0.012, d.h + 5), sw(d.v1 + 0.012, 0)])}" fill="var(--frame)"/>
    <polygon points="${poly([sw(d.v0, 0), sw(d.v0, d.h), sw(d.v1, d.h), sw(d.v1, 0)])}" fill="var(--door)"/>
    <polygon points="${poly([sw(d.v0 + 0.022, d.h - 34), sw(d.v0 + 0.022, d.h - 8), sw(d.v1 - 0.022, d.h - 8), sw(d.v1 - 0.022, d.h - 34)])}" class="glass"/>
    <path d="M${pt(sw(d.v1 - 0.02, 40))}L${pt(sw(d.v1 - 0.034, 40))}" stroke="var(--sill)" stroke-width="2" stroke-linecap="round"/>
    <polygon points="${poly([add(sw(d.v0 - 0.025, 0), [-8, 0]), add(sw(d.v1 + 0.025, 0), [-8, 0]), add(sw(d.v1 + 0.025, 0), [-8, 4]), add(sw(d.v0 - 0.025, 0), [-8, 4])])}" fill="var(--sill)"/>`;

  // poort van twee vlakken met houten latten, sluit aan op de achterhoek van het huis
  const g = GATE, gL = gl(g.x0, g.v), gR = gl(g.x1, g.v), gM = [(gL[0] + gR[0]) / 2, gL[1]];
  let slats = '';
  for (let y = 6; y < g.h - 2; y += 6) slats += `M${gL[0].toFixed(1)} ${(gL[1] - y).toFixed(1)}H${gR[0].toFixed(1)}`;
  const gate = `<rect x="${gL[0].toFixed(1)}" y="${(gL[1] - g.h).toFixed(1)}" width="${(gR[0] - gL[0]).toFixed(1)}" height="${g.h}" fill="var(--fence)"/>
    <path d="${slats}" stroke="var(--fence-line)" stroke-width="1.2"/>
    ${[gL[0], gM[0] - 2, gR[0] - 4].map((x) => `<rect x="${x.toFixed(1)}" y="${(gL[1] - g.h - 3).toFixed(1)}" width="4" height="${g.h + 3}" fill="var(--post)"/>`).join('')}`;

  // thuisbatterij tegen de achterhoek: voorvlak + linkerzijvlak + bovenvlak, ledbalk met laadniveau
  const B = BAT, bd = B.v1 - B.v0, bFL = gl(B.x0, B.v0), bFR = gl(B.x1, B.v0), bh = B.h, bw = bFR[0] - bFL[0];
  const battery = `
    <polygon points="${poly([bFL, [bFL[0], bFL[1] - bh], add([bFL[0], bFL[1] - bh], D, bd), add(bFL, D, bd)])}" fill="var(--cab-edge)"/>
    <polygon points="${poly([[bFL[0], bFL[1] - bh], [bFR[0], bFR[1] - bh], add([bFR[0], bFR[1] - bh], D, bd), add([bFL[0], bFL[1] - bh], D, bd)])}" fill="var(--cab-edge)" opacity=".8"/>
    <rect x="${bFL[0].toFixed(1)}" y="${(bFL[1] - bh).toFixed(1)}" width="${bw.toFixed(1)}" height="${bh}" rx="2" fill="var(--cab)" stroke="var(--cab-edge)" stroke-width="1"/>
    <rect x="${(bFL[0] + bw / 2 - 4).toFixed(1)}" y="${(bFL[1] - bh + 9).toFixed(1)}" width="8" height="${bh - 16}" rx="2" fill="var(--cab-screen)"/>
    <g id="soc-seg">${[0, 1, 2, 3, 4].map((k) => `<rect x="${(bFL[0] + bw / 2 - 2.5).toFixed(1)}" y="${(bFL[1] - 12 - k * 5.6).toFixed(1)}" width="5" height="4" rx=".8"/>`).join('')}</g>
    <circle id="bat-led" cx="${(bFL[0] + bw / 2).toFixed(1)}" cy="${(bFL[1] - bh + 5).toFixed(1)}" r="1.6"/>`;

  // oprit: van de straat langs de zijgevel tot aan de poort
  const dr = DRIVE;
  const drive = poly([gl(dr.x0, g.v), gl(dr.x1, g.v), gl(dr.x1, -VF), gl(dr.x0, -VF)]);
  let driveLines = '';
  for (let x = dr.x0 + 12; x < dr.x1; x += 12) driveLines += `M${pt(gl(x, g.v))}L${pt(gl(x, -VF))}`;
  for (let v = g.v - 0.05; v > -VF; v -= 0.05) driveLines += `M${pt(gl(dr.x0, v))}L${pt(gl(dr.x1, v))}`;
  // voortuin: van de gevel tot de straatrand, met een smalle hoge boom in het midden
  const bed = poly([gl(H.l + 2, 0), gl(H.r, 0), gl(H.r, -VF), gl(H.l + 2, -VF)]); // even breed als het huis
  seed = 29;
  let plants = '';
  for (let i = 0; i < 46; i++) {
    const x = H.l + 12 + rand() * (H.r - H.l - 24), v = -0.04 - rand() * (VF - 0.06), [px, py] = gl(x, v);
    const kind = rand(), r = 5 + rand() * 7;
    const fill = kind < 0.32 ? 'var(--flower)' : kind < 0.58 ? 'var(--shrub-lt)' : 'var(--shrub)';
    plants += `<ellipse cx="${px.toFixed(1)}" cy="${(py - r * 0.6).toFixed(1)}" rx="${(r * 1.3).toFixed(1)}" ry="${r.toFixed(1)}" fill="${fill}"/>`;
  }
  const tree = gl(860, -0.3);

  // auto: simpele hatchback in zijaanzicht, in het vlak van de oprit (loopt mee met de diepterichting)
  const c = CAR, F0 = gl(c.x0, c.v0), CW = c.x1 - c.x0, CLEN = 164, CDEP = CLEN / FULL_UNIT;
  const cL = [D[0] * CDEP, D[1] * CDEP];
  const cp = (d, h) => [F0[0] + cL[0] * d, F0[1] - h + cL[1] * d];    // d = 0 (neus, naar de straat) .. 1 (achterkant)
  const fp = (x, h) => [F0[0] + x, F0[1] - h];
  const cpath = (items) => items.map((it) => (it === 'Z' ? 'Z' : `${it[0]}${it.slice(1).map((q) => pt(cp(q[0], q[1]))).join(' ')}`)).join('');
  const wheelPts = (d, rr) => Array.from({ length: 28 }, (_, i) => { const a = (i / 28) * Math.PI * 2; return cp(d + (Math.cos(a) * rr) / CLEN, 12 + Math.sin(a) * rr); });
  const wheel = (d) => `<polygon points="${poly(wheelPts(d, 12.5))}" fill="#101216"/><polygon points="${poly(wheelPts(d, 7.5))}" fill="#C9CFD7"/><polygon points="${poly(wheelPts(d, 2.4))}" fill="#4A515B"/>`;
  const shadowC = [F0[0] + cL[0] * 0.5, F0[1] + cL[1] * 0.5 + 2];
  const car = `
    <ellipse cx="${shadowC[0].toFixed(1)}" cy="${shadowC[1].toFixed(1)}" rx="${(Math.hypot(cL[0], cL[1]) / 2 + 8).toFixed(1)}" ry="6" fill="#000" opacity=".28" transform="rotate(${(Math.atan2(D[1], D[0]) * 180 / Math.PI + 180).toFixed(1)} ${shadowC[0].toFixed(1)} ${shadowC[1].toFixed(1)})"/>
    <path d="${cpath([['M', [0, 10]], ['L', [0, 27]], ['Q', [0, 33], [0.07, 35]], ['L', [0.26, 38]], ['C', [0.31, 46], [0.37, 54], [0.45, 56]], ['C', [0.56, 57.5], [0.68, 57.2], [0.76, 55.5]],
      ['C', [0.85, 53], [0.92, 46], [0.95, 40]], ['Q', [1, 38], [1, 32]], ['L', [1, 10]], 'Z'])}" fill="var(--car)" stroke="var(--car-side)" stroke-width="1"/>
    <path d="${cpath([['M', [0.33, 40]], ['L', [0.42, 54]], ['L', [0.55, 55.4]], ['L', [0.55, 40]], 'Z'])}" class="carglass"/>
    <path d="${cpath([['M', [0.58, 40]], ['L', [0.58, 55.4]], ['L', [0.72, 55]], ['L', [0.87, 44.5]], ['L', [0.86, 40]], 'Z'])}" class="carglass"/>
    <path d="M${pt(cp(0.565, 12))}L${pt(cp(0.565, 56))}" stroke="#000" stroke-opacity=".3" stroke-width="1"/>
    <path d="${cpath([['M', [0.08, 34]], ['L', [0.98, 34]]])}" stroke="#fff" stroke-opacity=".3" stroke-width="1"/>
    <polygon points="${poly([cp(0, 24), cp(0.025, 24), cp(0.045, 31), cp(0, 31)])}" fill="#F2F5F8"/>
    <polygon points="${poly([cp(0.975, 26), cp(1, 26), cp(1, 34), cp(0.97, 34)])}" fill="#D2443A"/>
    <polygon points="${poly([cp(0.12, 10), cp(0.88, 10), cp(0.88, 14), cp(0.12, 14)])}" fill="#1A1D22"/>
    ${wheel(0.2)}${wheel(0.8)}`;

  // laadpaal: slanke zuil, voorkant (display + ledring) naar links gericht, naar de auto en de oprit
  const xl = EVC.x - 6, xr = EVC.x + 6, vA = EVC.v - 0.037, vB = EVC.v + 0.037;
  const fc = (f, h, x = xl) => gl(x, vA + f * (vB - vA), h);     // punt op het linker (voor)vlak: f = 0..1 langs de diepte
  const circ = (f, h, r) => Array.from({ length: 22 }, (_, i) => { const a = (i / 22) * Math.PI * 2; return fc(f + (Math.cos(a) * r) / (FULL_UNIT * (vB - vA)), h + Math.sin(a) * r); });
  const hol = fc(0.5, 30);                                       // plugvak onder het display
  const portPt = cp(0.015, 28);                                 // laadaansluiting rechtsvoor op de auto
  const cableD = `M${pt(hol)}Q${pt([(hol[0] + portPt[0]) / 2, Math.max(hol[1], portPt[1]) + 11])} ${pt(portPt)}`;  // hangt rustig door, raakt de grond niet
  const evPath = cableD;                                                                                          // stroom loopt alleen van het plugvak naar de auto
  const charger = `
    <polygon points="${poly([fc(0.34, 0), fc(0.66, 0), fc(0.66, 28), fc(0.34, 28)])}" fill="var(--post)"/>
    <polygon points="${poly([fc(0.66, 0, xr), fc(0.66, 0), fc(0.66, 28), fc(0.66, 28, xr)])}" fill="var(--post)" opacity=".7"/>
    <polygon points="${poly([fc(0, 24, xl), fc(0, 24, xr), fc(0, 66, xr), fc(0, 66, xl)])}" fill="var(--cab-edge)"/>
    <polygon points="${poly([fc(0, 66), fc(0, 66, xr), fc(1, 66, xr), fc(1, 66)])}" fill="var(--charger)" opacity=".85"/>
    <polygon points="${poly([fc(0.06, 24), fc(0.94, 24), fc(1, 30), fc(1, 60), fc(0.94, 66), fc(0.06, 66), fc(0, 60), fc(0, 30)])}" fill="var(--charger)" stroke="var(--cab-edge)" stroke-width=".8"/>
    <polygon points="${poly([fc(0.17, 61), fc(0.83, 61), fc(0.9, 55), fc(0.9, 43), fc(0.83, 38), fc(0.17, 38), fc(0.1, 43), fc(0.1, 55)])}" fill="#08090C"/>
    <polygon id="ev-led" points="${poly(circ(0.5, 49.5, 6.2))}" fill="#4A5263"/>
    <polygon points="${poly(circ(0.5, 49.5, 2.4))}" fill="#08090C"/>
    <polygon points="${poly([fc(0.3, 26), fc(0.7, 26), fc(0.7, 34), fc(0.3, 34)])}" fill="#15181D"/>
    <path d="${cableD}" fill="none" stroke="#15181D" stroke-width="2.6" stroke-linecap="round"/>
    <path id="fp-ev2" class="lane-on" d="${evPath}" fill="none"/><g id="fd-ev2" class="dots"></g>`;

  // trafohuisje naast de mast: staat verhoogd zodat de kabel vanaf het huis op halve hoogte binnenkomt
  const TX = PY[1][0], TF = J[1] + 24, TH = 56, TW = 22, TT = TF - TH;
  const trafo = `
    <path d="M${TX.toFixed(1)} ${PY[1][1].toFixed(1)}V${(TT - 9).toFixed(1)}" stroke="var(--pylon)" stroke-width="1.2" fill="none"/>
    <rect x="${TX - TW - 3}" y="${TF - 3}" width="${(TW + 3) * 2}" height="3" fill="var(--cab-edge)"/>
    <rect x="${TX - TW}" y="${TT}" width="${TW * 2}" height="${TH - 3}" fill="var(--cab)" stroke="var(--cab-edge)" stroke-width="1.5"/>
    <polygon points="${poly([[TX - TW - 4, TT], [TX + TW + 4, TT], [TX + TW - 5, TT - 9], [TX - TW + 5, TT - 9]])}" fill="var(--roof)" stroke="var(--cab-edge)" stroke-width="1"/>
    <path d="M${TX} ${TT + 3}V${TF - 6}" stroke="var(--cab-edge)" stroke-width="1.2"/>
    <path d="M${TX - 16} ${TT + 8}h11M${TX - 16} ${TT + 12}h11M${TX - 16} ${TT + 16}h11M${TX + 5} ${TT + 8}h11M${TX + 5} ${TT + 12}h11M${TX + 5} ${TT + 16}h11" stroke="var(--cab-edge)" stroke-width="1"/>
    <path d="M${TX - 4} ${TT + 31}l4 -7l4 7z" fill="#F2B33D"/><path d="M${TX + 0.5} ${TT + 26.5}l-1.6 2.6h1.5l-.5 2.4l1.8 -2.8h-1.5z" fill="#1A1D23"/>
    <rect x="${TX + TW}" y="${J[1] - 2.5}" width="6" height="5" rx="1" fill="var(--cab-edge)"/>`;

  const lanes = Object.entries(FLOWS).map(([k, pts]) => {
    const d = roundedPath(pts, 10);
    return `<g class="flow-${k}"><path class="lane" d="${d}"/><path id="fp-${k}" class="lane-on" d="${d}"/><g id="fd-${k}" class="dots"></g></g>`;
  }).join('');

  return `<svg viewBox="0 ${VB.y} 1600 ${VB.h}" preserveAspectRatio="xMidYMax meet" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink">
  <defs>
    <pattern id="brick" width="22" height="9" patternUnits="userSpaceOnUse">
      <path d="M0 .5H22M0 5H22M5.5 .5V5M16.5 5V9.5" stroke="var(--wall-line)" stroke-width=".7" fill="none"/></pattern>
    <clipPath id="facadeClip"><polygon points="${facade}"/></clipPath>
    <clipPath id="roofClip"><polygon points="${roof}"/></clipPath>
    <clipPath id="skyClip"><rect x="-2400" y="-1400" width="6400" height="${1400 + GROUND}"/></clipPath>
    <radialGradient id="sunHalo"><stop offset="0" stop-color="#FFE9B0" stop-opacity=".55"/><stop offset="1" stop-color="#FFE9B0" stop-opacity="0"/></radialGradient>
    <mask id="moonMask"><rect x="-30" y="-30" width="60" height="60" fill="#fff"/><circle cx="7" cy="-5" r="14" fill="#000"/></mask>
    <linearGradient id="carG" x1="0" y1="0" x2="0" y2="1"><stop offset="0" style="stop-color:var(--car-top)"/><stop offset=".55" style="stop-color:var(--car)"/><stop offset="1" style="stop-color:var(--car-side)"/></linearGradient>
    <filter id="soft" x="-20%" y="-50%" width="140%" height="200%"><feGaussianBlur stdDeviation="5"/></filter>
    <filter id="fogblur" x="-10%" y="-100%" width="120%" height="300%"><feGaussianBlur stdDeviation="9"/></filter>
  </defs>
  <g id="stars" fill="#fff">${stars}</g>
  <g id="orb"><circle id="sun-halo" r="140" fill="url(#sunHalo)"/><g id="rays"><path d="${rays}" stroke="#FFE7A8" stroke-width="2" stroke-linecap="round" opacity=".55"/></g>
    <circle id="sun" r="22" fill="#FFE7A8"/><circle id="moon" r="16" fill="#E6EAF2" mask="url(#moonMask)"/></g>
  <g id="clouds" filter="url(#soft)">${clouds}</g>
  <path d="${hillPath(LAWN_BACK - 6, 24, 0.6, 310, 97)}" fill="var(--hill-far)"/>
  <path d="${hillPath(LAWN_BACK + 4, 10, 2.1, 230, 71)}" fill="var(--hill-near)"/>
  <rect x="-2400" y="${LAWN_BACK}" width="6400" height="${GROUND - LAWN_BACK}" fill="var(--grass)"/>
  <rect id="snow-lawn" x="-2400" y="${LAWN_BACK}" width="6400" height="${GROUND - LAWN_BACK}" fill="#EEF2F7" opacity="0"/>
  <rect x="-2400" y="${GROUND}" width="6400" height="5" fill="var(--grass-front)"/>
  <rect x="-2400" y="${GROUND + 5}" width="6400" height="2000" fill="var(--soil)"/>

  <!-- hoogspanning (achterste masten eerst) -->
  <g fill="none" stroke="var(--pylon)" stroke-width="1" opacity=".85">${wires}</g>
  <g fill="none" stroke="var(--pylon)" stroke-linejoin="round">${pylons}</g>

  <!-- bomen achter -->
  <g fill="var(--tree)">
    <g class="sway" style="--sd:1"><rect x="1307" y="${LAWN_BACK + 46}" width="6" height="40"/><ellipse cx="1310" cy="${LAWN_BACK + 12}" rx="36" ry="52"/></g>
    <g class="sway" style="--sd:1.3"><rect x="1414" y="${LAWN_BACK + 60}" width="5" height="34"/><ellipse cx="1416.5" cy="${LAWN_BACK + 36}" rx="25" ry="36"/></g></g>

  <g transform="translate(${HX} ${HY})">
    <polygon points="${drive}" fill="var(--pave)"/>
    <path d="${driveLines}" stroke="var(--pave-line)" stroke-width=".8"/>
    <g>${gate}</g>
    <!-- woning -->
    <g data-pop="home" class="hit">
      <polygon points="${side}" fill="var(--wall-side)"/>
      <polygon points="${poly([[H.l, GROUND - 20], [H.l, GROUND], add([H.l, GROUND], D), add([H.l, GROUND - 20], D)])}" fill="var(--plinth)" opacity=".8"/>
      ${sideWin}
    </g>
    <g data-pop="solar" class="hit">
      <polygon points="${roof}" fill="var(--roof)"/>
      <path d="${roofLines}" stroke="var(--roof-line)" stroke-width="1" clip-path="url(#roofClip)"/>
      <polygon id="snow-roof" points="${roof}" fill="#F1F4F8" opacity="0"/>
      <g id="panels">${panels}</g>
      <path d="M${pt(A)}L${pt(A2)}" stroke="var(--ridge)" stroke-width="5" stroke-linecap="round"/>
      ${chimney}
      <path d="M${pt(EL)}L${pt(EL2)}" stroke="var(--board)" stroke-width="5"/>
    </g>
    <g data-pop="battery" class="hit">${battery}</g>
    <g data-pop="overview" class="hit">${door}</g>
    <!-- paneelkabel: recht over het dak naar de goot, langs de gevel naar de voordeur -->
    <path d="M${SOLAR_CABLE.map(pt).join('L')}" stroke="var(--ridge)" stroke-width="2.5" fill="none" stroke-linejoin="round"/>
    <g data-pop="home" class="hit">
      <polygon points="${facade}" fill="var(--wall)"/>
      <polygon points="${facade}" fill="url(#brick)"/>
      <g clip-path="url(#facadeClip)">
        <polygon points="${poly([A, [A[0] - cladL, cladY], [A[0] + cladR, cladY]])}" fill="var(--clad)"/>
        <path d="${cladLines}" stroke="var(--clad-line)" stroke-width="1.2"/>
        <rect x="${A[0] - cladL}" y="${cladY}" width="${cladL + cladR}" height="3" fill="var(--board)"/>
        ${bands}
        <rect x="${H.l}" y="${GROUND - 20}" width="${H.r - H.l}" height="20" fill="var(--plinth)"/>
      </g>
      <line x1="${H.l}" x2="${H.l}" y1="${boardY(H.l)}" y2="${GROUND}" stroke="var(--wall-line)" stroke-width="1.5"/>
      ${upperWin(735, 350, 48, 64)}${upperWin(817, 350, 48, 64)}
      ${groundWin(670, 456, 44, 78, 20)}${groundWin(738, 460, 128, 74, 0, 'living')}${groundWin(886, 456, 44, 78, 20)}
      <path d="M${pt(H.eaveL)}L${pt(A)}L${pt(H.eaveR)}" fill="none" stroke="var(--board)" stroke-width="13" stroke-linejoin="miter"/>
      <path d="M${pt(H.eaveR)}l9 0" stroke="var(--board)" stroke-width="6"/>
    </g>
    <!-- voortuin -->
    <polygon points="${bed}" fill="var(--bed)"/>
    ${plants}

    <g class="sway" style="--sd:.8"><rect x="${(tree[0] - 2.5).toFixed(1)}" y="${(tree[1] - 46).toFixed(1)}" width="5" height="46" fill="var(--tree)"/>
      <ellipse cx="${tree[0].toFixed(1)}" cy="${(tree[1] - 122).toFixed(1)}" rx="16" ry="84" fill="var(--hedge)"/></g>
  </g>

  <!-- hoofdmast: trafohuisje (verhoogd, kabel komt op halve hoogte binnen) -->
  <g data-pop="grid" class="hit">${trafo}
    <rect x="156" y="250" width="160" height="310" fill="transparent"/></g>

  <!-- stroombanen; alles komt samen bij de voordeur (meterkast) -->
  <g id="flows">${lanes}<circle cx="${J[0].toFixed(1)}" cy="${J[1].toFixed(1)}" r="4.5" fill="var(--cab-screen)" stroke="var(--cab-edge)" stroke-width="1.5"/></g>

  <!-- auto en laadpaal staan voor de kabels -->
  <g transform="translate(${HX} ${HY})">

    <g id="ev" style="display:none"><g data-pop="ev-car">${car}</g>${charger}</g>
  </g>

  <!-- weer -->
  <g id="fog" opacity="0" filter="url(#fogblur)" fill="#C9D1DC">
    <rect class="fogband" x="-2400" y="${LAWN_BACK - 30}" width="6400" height="46" opacity=".45" style="animation-duration:70s"/>
    <rect class="fogband" x="-2400" y="${LAWN_BACK + 30}" width="6400" height="40" opacity=".55" style="animation-duration:50s;animation-delay:-20s"/>
    <rect class="fogband" x="-2400" y="${GROUND - 46}" width="6400" height="36" opacity=".5" style="animation-duration:60s;animation-delay:-35s"/></g>
  <g clip-path="url(#skyClip)">
    <g id="rain" stroke="#B8C6DA" stroke-width="1" stroke-linecap="round" opacity="0">${drops}</g>
    <g id="hail" fill="#E8EDF3" opacity="0">${hail}</g>
    <g id="snow" fill="#F2F5FA" opacity="0">${flakes}</g>
  </g>
  <path id="bolt" d="M1120 40 L1098 150 L1124 150 L1090 290 L1140 132 L1112 132 L1136 40 Z" fill="#F4F6FF" opacity="0"/>
  <rect id="flash" x="-2400" y="-1400" width="6400" height="${1400 + GROUND + 200}" fill="#E6ECFF" opacity="0" pointer-events="none"/>
</svg>`;
}

/* ---------- grafieken ---------- */
function niceTicks(min, max, count = 4) {
  if (!(max > min)) { max = min + 1; }
  const raw = (max - min) / count, mag = Math.pow(10, Math.floor(Math.log10(raw))), e = raw / mag;
  const step = (e >= 7.5 ? 10 : e >= 3.5 ? 5 : e >= 1.5 ? 2 : 1) * mag;
  const lo = Math.floor(min / step) * step, hi = Math.ceil(max / step) * step, ticks = [];
  for (let v = lo; v <= hi + step / 2; v += step) ticks.push(+v.toFixed(10));
  return { lo, hi, ticks };
}
let chartUid = 0;

/* ---------- CSS ---------- */
const CSS = `
:host { display:block; position:fixed !important; top:0 !important; left:0 !important; width:100vw !important; height:100vh !important; z-index:999 !important; margin:0 !important; padding:0 !important; --text:#EEF0F3; --text2:#A4ACB9; --text3:#6C7584; --line:rgba(255,255,255,.08);
  --surface:rgba(12,16,22,.80); --c-battery:${C.battery};
  font-family:Inter,'Segoe UI Variable Text','Segoe UI',system-ui,-apple-system,Roboto,sans-serif; font-feature-settings:'tnum' 1,'cv11' 1;
  -webkit-font-smoothing:antialiased; -webkit-tap-highlight-color:transparent; }
* { box-sizing:border-box; }
button { font:inherit; color:inherit; }
.root { position:relative; height:var(--h,100vh); overflow:hidden; background:var(--soil,#0A0E0C); color:var(--text); user-select:none; -webkit-user-select:none; }
.sky { position:absolute; left:0; right:0; top:0; height:var(--horizon,70%); transition:background 6s linear; }
.stage { position:relative; height:100%; display:grid; grid-template-rows:auto minmax(0,1fr) auto; transition:transform 3s ease; }
header { display:grid; grid-template-columns:1fr auto 1fr; align-items:start; gap:24px; padding:clamp(16px,3.2vh,40px) clamp(16px,3vw,48px) 0; position:relative; z-index:2; }
.clock { text-align:center; grid-column:2; }
.hright { grid-column:3; justify-self:end; }
@media (max-width:900px) { header { display:flex; justify-content:space-between; } .clock { text-align:left; } }
.time { font-size:clamp(48px,6.4vw,108px); font-weight:300; letter-spacing:-.04em; line-height:.92; }
.date { margin-top:clamp(6px,1vh,12px); font-size:clamp(13px,1.2vw,19px); color:var(--text2); }
.hright { display:flex; flex-direction:column; align-items:flex-end; gap:clamp(10px,1.6vh,18px); }
.weather { display:flex; align-items:center; gap:clamp(10px,1vw,16px); padding:8px 12px; margin:-8px -12px; border-radius:14px; cursor:pointer; background:none; border:0; text-align:right; }
.weather:hover { background:rgba(255,255,255,.05); }
.weather .ic { width:clamp(30px,2.8vw,44px); height:clamp(30px,2.8vw,44px); color:var(--text); }
.w-temp { font-size:clamp(26px,2.6vw,42px); font-weight:300; letter-spacing:-.03em; line-height:1; }
.w-sub { margin-top:6px; font-size:clamp(12px,.95vw,14px); color:var(--text2); white-space:nowrap; }
.chips { display:flex; gap:8px; flex-wrap:wrap; justify-content:flex-end; }
.ch-b { position:absolute; right:clamp(12px,1.6vw,24px); bottom:clamp(10px,1.6vh,18px); z-index:4; flex-wrap:nowrap; }
.ch-h { display:none; }
.root.compact .ch-h { display:flex; }
.root.compact .ch-b { display:none; }
.chip { display:inline-flex; align-items:center; gap:10px; padding:8px 14px 8px 10px; border-radius:12px; background:var(--surface); border:1px solid var(--line);
  -webkit-backdrop-filter:blur(14px); backdrop-filter:blur(14px); cursor:pointer; text-align:left; transition:border-color .2s; }
.chip:hover { border-color:rgba(255,255,255,.18); }
.chip .ci { width:30px; height:30px; border-radius:9px; display:grid; place-items:center; color:var(--c); background:rgba(255,255,255,.06); flex:none; }
.chip .ci svg { width:18px; height:18px; }
.chip .cl { font-size:11px; color:var(--text2); line-height:1.2; }
.chip .cv { font-size:15px; font-weight:500; letter-spacing:-.01em; line-height:1.3; white-space:nowrap; }
.chip .cv small { font-size:11px; color:var(--text2); font-weight:500; margin-left:3px; }
.scene { position:relative; min-height:0; }
.scene > svg { position:absolute; inset:0; width:100%; height:100%; overflow:visible; }
.hit { cursor:pointer; }
.lane { fill:none; stroke:var(--lane); stroke-width:2.5; }
.lane-on { fill:none; stroke-width:2.5; opacity:0; transition:opacity .6s, stroke .6s; }
#fog, #rain, #snow, #hail, #bolt, #flash, #clouds, #stars, #orb { pointer-events:none; }
.cloud { animation:drift linear infinite alternate; }
@keyframes drift { from { transform:translateX(-70px); } to { transform:translateX(90px); } }
#rain line { animation:fall linear infinite; }
@keyframes fall { from { transform:translate(0,-80px) skewX(var(--skew,-12deg)); } to { transform:translate(var(--drift,-110px),${GROUND + 80}px) skewX(var(--skew,-12deg)); } }
#snow circle { animation:snowfall linear infinite; }
@keyframes snowfall { from { transform:translate(0,-40px); } to { transform:translate(60px,${GROUND + 40}px); } }
.tw { animation:tw 4s ease-in-out infinite alternate; }
@keyframes tw { from { opacity:.2; } to { opacity:.9; } }
#bat-led.pulse, #ev-led.pulse { animation:pulse 2s ease-in-out infinite; }
/* weer */
#rain.light line:nth-child(3n), #rain.light line:nth-child(3n+1) { display:none; }
#rain.pour line { animation-duration:.42s !important; }
#hail circle { animation:fall linear infinite; }
#clouds.windy .cloud { animation-duration:38s !important; }
#clouds.storm .cloud { animation-duration:60s !important; }
.sway { transform-box:fill-box; transform-origin:50% 100%; animation:sway calc(var(--sway-dur,7s) * var(--sd,1)) ease-in-out infinite alternate; }
@keyframes sway { from { transform:rotate(calc(var(--sway,.4deg) * -1)); } to { transform:rotate(var(--sway,.4deg)); } }
.fogband { animation:fogdrift linear infinite alternate; }
@keyframes fogdrift { from { transform:translateX(-160px); } to { transform:translateX(160px); } }
#rays { animation:spin 80s linear infinite; }
@keyframes spin { to { transform:rotate(360deg); } }
#flash.on { animation:flash 7s infinite; }
#bolt.on { animation:bolt 7s infinite; }
@keyframes flash { 0%, 86% { opacity:0; } 87% { opacity:.55; } 88% { opacity:.05; } 89% { opacity:.4; } 91%, 100% { opacity:0; } }
@keyframes bolt { 0%, 86% { opacity:0; } 87%, 89% { opacity:.95; } 88% { opacity:.3; } 90%, 100% { opacity:0; } }
.carglass { fill:var(--glass); opacity:.85; }
@keyframes pulse { 50% { opacity:.3; } }

/* labels bij de apparaten */
.leaders { position:absolute; left:0; top:0; width:100%; height:100%; pointer-events:none; overflow:visible; }
.labels { position:absolute; inset:0; pointer-events:none; }
.tag { position:absolute; left:0; top:0; transform-origin:50% 100%; pointer-events:auto; cursor:pointer; display:flex; align-items:baseline; gap:6px; padding:5px 10px; border-radius:10px; background:var(--surface); border:1px solid var(--line);
  -webkit-backdrop-filter:blur(12px); backdrop-filter:blur(12px); white-space:nowrap; font-size:11px; color:var(--text2); }
.tag b { font-size:14px; font-weight:600; letter-spacing:-.01em; color:var(--tc,var(--text)); font-variant-numeric:tabular-nums; }
.card { position:absolute; left:0; top:0; width:214px; pointer-events:auto; cursor:pointer; text-align:left; background:var(--surface); border:1px solid var(--line);
  border-radius:14px; padding:11px 13px 12px; -webkit-backdrop-filter:blur(14px); backdrop-filter:blur(14px); transition:border-color .2s; }
.card:hover { border-color:rgba(255,255,255,.18); }
.c-head { display:flex; align-items:center; gap:7px; font-size:12px; font-weight:500; color:var(--text2); min-height:20px; }
.c-head svg { width:15px; height:15px; color:var(--c); flex:none; }
.c-head > span:not(.pill) { min-width:0; overflow:hidden; text-overflow:ellipsis; white-space:nowrap; }
.pill { margin-left:auto; flex:none; font-size:10.5px; font-weight:500; padding:2px 7px; border-radius:999px; color:var(--pc,var(--text2)); background:rgba(255,255,255,.06); white-space:nowrap; }
@supports (color: color-mix(in srgb, red 50%, blue)) { .pill { background:color-mix(in srgb, var(--pc,#fff) 15%, transparent); }
  .chip .ci, .sh-icon { background:color-mix(in srgb, var(--c) 15%, transparent); } }
.pill:empty { display:none; }
.c-val { margin-top:7px; font-size:28px; font-weight:400; letter-spacing:-.03em; line-height:1; white-space:nowrap; }
.c-val small { font-size:12px; font-weight:500; letter-spacing:0; color:var(--text2); margin-left:4px; }
.c-sub { margin-top:7px; font-size:11.5px; color:var(--text2); white-space:nowrap; overflow:hidden; text-overflow:ellipsis; }
.socbar { display:flex; gap:3px; margin-top:9px; }
.socbar i { flex:1; height:4px; border-radius:2px; background:rgba(255,255,255,.09); }
.socbar i.on { background:var(--soc-c, var(--c-battery)); }
/* onderbalk: één rij, alle kaartjes even groot en precies zo hoog als de kaartjes zelf */
.dock { display:grid; grid-auto-flow:column; grid-auto-columns:minmax(0,1fr); align-items:stretch; gap:10px; padding:10px clamp(12px,1.6vw,24px) clamp(10px,1.4vh,16px); position:relative; z-index:1; }
.dock .card { position:relative; left:auto; top:auto; width:auto; display:flex; flex-direction:column; }
.dock .c-sub { margin-top:auto; padding-top:7px; }

@media (max-width:1100px) { .dock { grid-auto-flow:row; grid-template-columns:repeat(3,minmax(0,1fr)); } }
.root.compact .dock { grid-auto-flow:row; grid-template-columns:repeat(2,minmax(0,1fr)); gap:8px; padding:10px 16px 16px; }
.root.compact .labels, .root.compact .leaders { display:none; }
.leaders { z-index:1; }
.root.compact .chips .chip .cl { display:none; }

/* modals */
.modal { position:fixed; inset:0; z-index:20; display:flex; align-items:center; justify-content:center; padding:clamp(8px,3vw,32px);
  background:rgba(3,5,9,.62); -webkit-backdrop-filter:blur(6px); backdrop-filter:blur(6px); opacity:0; pointer-events:none; transition:opacity .18s ease; }
.modal.open { opacity:1; pointer-events:auto; }
.sheet { width:min(980px,100%); max-height:100%; overflow:auto; background:#0F131A; border:1px solid var(--line); border-radius:20px;
  box-shadow:0 30px 80px rgba(0,0,0,.55); transform:translateY(10px); transition:transform .22s ease; color:var(--text); }
.sheet.wide { width:min(1240px,100%); }
.modal.open .sheet { transform:none; }
.sh-head { display:flex; align-items:center; gap:14px; padding:20px 20px 18px 24px; border-bottom:1px solid var(--line); flex-wrap:wrap; }
.sh-icon { width:40px; height:40px; flex:none; border-radius:12px; display:grid; place-items:center; color:var(--c); background:rgba(255,255,255,.06); }
.sh-icon svg { width:22px; height:22px; }
.sh-title { min-width:0; }
.sh-title h2 { margin:0; font-size:18px; font-weight:600; letter-spacing:-.01em; }
.sh-sub { margin-top:3px; font-size:13px; color:var(--text2); }
.sh-live { margin-left:auto; font-size:clamp(24px,3vw,32px); font-weight:400; letter-spacing:-.03em; white-space:nowrap; }
.sh-live small { font-size:14px; font-weight:500; letter-spacing:0; color:var(--text2); margin-left:4px; }
.sh-tools { margin-left:auto; display:flex; align-items:center; gap:8px; flex-wrap:wrap; }
.iconbtn, .close { flex:none; width:38px; height:38px; border-radius:10px; border:1px solid var(--line); background:transparent; color:var(--text2); display:grid; place-items:center; cursor:pointer; }
.iconbtn:hover, .close:hover { color:var(--text); background:rgba(255,255,255,.05); }
.iconbtn:disabled { opacity:.35; cursor:default; }
.iconbtn svg, .close svg { width:18px; height:18px; }
.close { margin-left:8px; }
.kpis { display:grid; grid-template-columns:repeat(auto-fit,minmax(160px,1fr)); border-bottom:1px solid var(--line); }
.kpi { padding:16px 24px; border-right:1px solid var(--line); }
.kpi:last-child { border-right:0; }
.kpi .l { font-size:12px; color:var(--text2); }
.kpi .v { margin-top:6px; font-size:20px; font-weight:500; letter-spacing:-.015em; white-space:nowrap; }
.kpi .h { margin-top:3px; font-size:12px; color:var(--text3); white-space:nowrap; }
.sh-bar { display:flex; align-items:center; justify-content:space-between; gap:12px 20px; flex-wrap:wrap; padding:16px 24px 6px; }
.seg { display:inline-flex; padding:3px; gap:2px; border-radius:10px; background:rgba(255,255,255,.04); border:1px solid var(--line); }
.seg button { border:0; background:transparent; color:var(--text2); font-size:13px; font-weight:500; padding:6px 12px; border-radius:7px; cursor:pointer; white-space:nowrap; }
.seg button:hover { color:var(--text); }
.seg button[aria-pressed="true"] { background:rgba(255,255,255,.1); color:var(--text); }
.legend { display:flex; flex-wrap:wrap; gap:6px 16px; font-size:12px; color:var(--text2); }
.legend span { display:inline-flex; align-items:center; gap:6px; }
.legend i { width:10px; height:3px; border-radius:2px; background:var(--c); }
.chart { position:relative; height:clamp(220px,34vh,300px); margin:6px 12px 0 8px; }
.chart svg { display:block; width:100%; height:100%; }
.chart .msg, .ov-msg { position:absolute; inset:0; display:grid; place-items:center; color:var(--text3); font-size:13px; }
.chart .ax { fill:var(--text3); font-size:11px; font-family:inherit; }
.tip { position:absolute; top:0; left:0; pointer-events:none; background:#1A1F28; border:1px solid rgba(255,255,255,.12); border-radius:10px;
  padding:9px 11px; font-size:12px; min-width:170px; box-shadow:0 10px 30px rgba(0,0,0,.45); opacity:0; transition:opacity .12s; z-index:2; }
.tip b { display:block; font-weight:600; margin-bottom:6px; color:var(--text); }
.tip .r { display:flex; align-items:center; gap:8px; color:var(--text2); margin-top:3px; }
.tip .r i { width:8px; height:8px; border-radius:2px; background:var(--c); flex:none; }
.tip .r span { margin-left:auto; padding-left:12px; color:var(--text); font-weight:500; }
.tip .r.sum { border-top:1px solid rgba(255,255,255,.1); margin-top:6px; padding-top:6px; color:var(--text); }
.foot { padding:12px 24px 18px; font-size:12px; color:var(--text3); line-height:1.5; }

/* energieoverzicht */
.ov-body { position:relative; display:grid; grid-template-columns:minmax(0,1fr) minmax(0,1.15fr); min-height:420px; }
.ov-col { padding:20px 24px; min-width:0; }
.ov-col + .ov-col { border-left:1px solid var(--line); }
.ov-col h3 { margin:0 0 12px; font-size:13px; font-weight:600; color:var(--text2); letter-spacing:.01em; }
.hero { padding-bottom:18px; margin-bottom:18px; border-bottom:1px solid var(--line); }
.hero .l { font-size:13px; color:var(--text2); }
.hero .big { margin-top:6px; font-size:clamp(34px,4vw,48px); font-weight:400; letter-spacing:-.035em; line-height:1; }
.hero .h { margin-top:8px; font-size:13px; color:var(--text2); }
.hero .h b { color:var(--text); font-weight:500; }
.wf-row { display:grid; grid-template-columns:minmax(120px,1.1fr) minmax(80px,1.4fr) auto; align-items:center; gap:14px; padding:9px 0; }
.wf-row .n { font-size:13px; font-weight:500; }
.wf-row .n small { display:block; margin-top:2px; font-size:11.5px; font-weight:400; color:var(--text3); }
.wf-row .tr { position:relative; height:10px; border-radius:3px; background:rgba(255,255,255,.04); }
.wf-row .tr i { position:absolute; top:0; bottom:0; border-radius:3px; background:var(--c); }
.wf-row .a { font-size:14px; font-weight:500; text-align:right; white-space:nowrap; min-width:84px; }
.wf-row.total { border-top:1px solid var(--line); margin-top:4px; padding-top:13px; }
.wf-row.total .n, .wf-row.total .a { font-weight:600; }
.wf-row.muted .n, .wf-row.muted .a { color:var(--text2); }
.note { margin-top:10px; font-size:12px; color:var(--text3); line-height:1.5; }
.bal { margin-bottom:20px; }
.bal .bt { display:flex; justify-content:space-between; font-size:12px; color:var(--text2); margin-bottom:7px; }
.bal .bt b { color:var(--text); font-weight:500; }
.bal .bar { display:flex; height:12px; border-radius:4px; overflow:hidden; gap:2px; background:rgba(255,255,255,.04); }
.bal .bar i { display:block; height:100%; background:var(--c); }
.bal .lg { display:flex; flex-wrap:wrap; gap:6px 16px; margin-top:8px; font-size:12px; color:var(--text2); }
.bal .lg span { display:inline-flex; align-items:center; gap:6px; }
.bal .lg i { width:8px; height:8px; border-radius:2px; background:var(--c); }
.bal .lg b { color:var(--text); font-weight:500; }
.ov-chart { position:relative; height:240px; margin:0 -6px; }
.ov-chart svg { display:block; width:100%; height:100%; }
.ov-chart .ax { fill:var(--text3); font-size:11px; font-family:inherit; }

.ovt { grid-column:1/-1; display:grid; grid-template-columns:repeat(4,minmax(0,1fr)); border-bottom:1px solid var(--line); }
.ovt .t { padding:18px 24px; border-right:1px solid var(--line); min-width:0; }
.ovt .t:last-child { border-right:0; }
.ovt .l { display:flex; align-items:center; gap:8px; font-size:12.5px; color:var(--text2); }
.ovt .l i { width:8px; height:8px; border-radius:2px; background:var(--c); flex:none; }
.ovt .v { margin-top:8px; font-size:clamp(26px,2.8vw,38px); font-weight:400; letter-spacing:-.03em; line-height:1; white-space:nowrap; }
.ovt .v small { font-size:.42em; font-weight:500; letter-spacing:0; color:var(--text2); }
.ovt .v .cur { font-size:.6em; color:var(--text2); margin-right:2px; }
.ovt .h { margin-top:9px; font-size:12.5px; color:var(--text2); line-height:1.4; }
.ov-wide { grid-column:1/-1; border-left:0 !important; border-top:1px solid var(--line); }
.stack { display:flex; height:14px; border-radius:5px; overflow:hidden; gap:2px; background:rgba(255,255,255,.04); margin-bottom:12px; }
.stack i { display:block; height:100%; background:var(--c); }
.src-head, .src-row { display:grid; grid-template-columns:14px minmax(0,1fr) 84px 52px 76px; align-items:center; gap:8px; }
.src-head { font-size:11.5px; color:var(--text3); padding:2px 0 4px; }
.src-row { padding:10px 0; border-top:1px solid var(--line); }
.src-row > i { width:10px; height:10px; border-radius:3px; background:var(--c); }
.src-row .n { font-size:13.5px; font-weight:500; min-width:0; }
.src-row .n small, .cost-row .n small { display:block; margin-top:2px; font-size:11.5px; font-weight:400; color:var(--text3); }
.src-row .k, .src-row .p, .src-row .e, .src-head .k, .src-head .p, .src-head .e { text-align:right; font-variant-numeric:tabular-nums; white-space:nowrap; }
.src-row .k { font-size:14px; font-weight:500; } .src-row .k small { font-size:11px; color:var(--text2); font-weight:400; }
.src-row .p { font-size:12.5px; color:var(--text2); } .src-row .e { font-size:14px; font-weight:500; }
.src-row.total { border-top:1px solid rgba(255,255,255,.16); } .src-row.total .n, .src-row.total .k, .src-row.total .e { font-weight:600; }
.src-row.total > i { visibility:hidden; }
.cost-row { display:flex; justify-content:space-between; align-items:baseline; gap:16px; padding:11px 0; border-top:1px solid var(--line); }
.cost-row:first-of-type { border-top:0; padding-top:2px; }
.cost-row .n { font-size:13.5px; font-weight:500; } .cost-row .a { font-size:15px; font-weight:500; white-space:nowrap; font-variant-numeric:tabular-nums; }
.cost-row.total { border-top:1px solid rgba(255,255,255,.16); } .cost-row.total .n, .cost-row.total .a { font-weight:600; }
.cost-row.total .a { font-size:20px; letter-spacing:-.02em; }
.cost-row.muted .n, .cost-row.muted .a { color:var(--text2); }
@media (max-width:900px) { .ovt { grid-template-columns:repeat(2,minmax(0,1fr)); } .ovt .t:nth-child(2) { border-right:0; } .ovt .t:nth-child(-n+2) { border-bottom:1px solid var(--line); } }
@media (max-width:640px) { .ovt .t { padding:14px 16px; } .src-head, .src-row { grid-template-columns:12px minmax(0,1fr) 68px 40px 66px; gap:6px; } }.card:focus-visible, .chip:focus-visible, .seg button:focus-visible, .close:focus-visible, .iconbtn:focus-visible, .weather:focus-visible { outline:2px solid #8FB4FF; outline-offset:2px; }
@media (max-width:900px) { .ov-body { grid-template-columns:1fr; } .ov-col + .ov-col { border-left:0; border-top:1px solid var(--line); } }
@media (max-width:640px) { .kpi { padding:12px 16px; } .sh-head { padding:16px; } .sh-bar { padding:12px 16px 4px; } .ov-col { padding:16px; }
  .seg button { padding:6px 9px; font-size:12px; } .kpi .v { font-size:18px; } .sh-tools { margin-left:0; width:100%; } }
@media (prefers-reduced-motion: reduce) { .cloud, #rain line, #snow circle, #hail circle, .tw, .sway, .fogband, #rays, #bat-led.pulse, #ev-led.pulse { animation:none !important; } }

/* tijdelijk simulatiepaneel */
.simbtn { position:absolute; left:clamp(12px,1.6vw,24px); top:clamp(12px,1.6vh,20px); z-index:6; display:inline-flex; align-items:center; gap:8px;
  padding:7px 12px; border-radius:10px; background:var(--surface); border:1px solid var(--line); color:var(--text2); font-size:12px; font-weight:500; cursor:pointer;
  -webkit-backdrop-filter:blur(12px); backdrop-filter:blur(12px); }
.simbtn:hover { color:var(--text); }
.simbtn.on { color:#F2A33D; border-color:rgba(242,163,61,.45); }
.sim { position:absolute; left:clamp(12px,1.6vw,24px); top:calc(clamp(12px,1.6vh,20px) + 44px); z-index:7; width:320px; max-height:calc(100% - 140px); overflow:auto;
  background:rgba(15,19,26,.94); border:1px solid var(--line); border-radius:16px; padding:14px 16px 12px; box-shadow:0 20px 50px rgba(0,0,0,.5);
  -webkit-backdrop-filter:blur(16px); backdrop-filter:blur(16px); display:none; user-select:none; }
.sim.open { display:block; }
.sim h4 { margin:0 0 2px; font-size:14px; font-weight:600; }
.sim .hint { font-size:11.5px; color:var(--text3); margin-bottom:10px; }
.sim .row { padding:8px 0; border-top:1px solid var(--line); }
.sim .rh { display:flex; align-items:center; gap:8px; font-size:12.5px; color:var(--text2); }
.sim .rh label { display:flex; align-items:center; gap:8px; cursor:pointer; }
.sim .rh .val { margin-left:auto; color:var(--text); font-weight:500; font-variant-numeric:tabular-nums; }
.sim input[type=checkbox] { accent-color:#F2A33D; width:14px; height:14px; margin:0; }
.sim input[type=range] { width:100%; margin:8px 0 0; accent-color:#F2A33D; }
.sim select { width:100%; margin-top:8px; background:#1A1F28; color:var(--text); border:1px solid var(--line); border-radius:8px; padding:6px 8px; font:inherit; font-size:12.5px; }
.sim .row.off input[type=range], .sim .row.off select { opacity:.4; }
.sim .acts { display:flex; gap:8px; margin-top:10px; }
.sim .acts button { flex:1; padding:7px 10px; border-radius:8px; border:1px solid var(--line); background:rgba(255,255,255,.05); color:var(--text); font-size:12px; cursor:pointer; }
`;

/* ===================================================================== */
class ClaudeEnergyScene extends HTMLElement {
  constructor() {
    super();
    this.attachShadow({ mode: 'open' });
    this._cfg = {};
    this._hass = null;
    this._built = false;
    this._cache = {};
    this._flowKey = {};
    this._pop = null;
    this._ov = null;
    this._reduced = window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  }

  static getStubConfig() { return { screensaver: false, battery_invert: false, entities: {} }; }

  setConfig(config) {
    if (!config || !config.entities) throw new Error('claude-energy-scene: "entities" ontbreekt');
    this._cfg = config;
    if (this._built) this._update();
  }

  set hass(hass) {
    this._hass = hass;
    if (!this._built) this._build();
    this._update();
  }

  getCardSize() { return 12; }

  connectedCallback() {
    if (!document.querySelector(`link[href="${FONT_URL}"]`)) {
      const l = document.createElement('link'); l.rel = 'stylesheet'; l.href = FONT_URL; document.head.appendChild(l);
    }
    this._timers = [
      setInterval(() => this._clock(), 1000),
      setInterval(() => this._built && this._scene(), 60000),
      setInterval(() => this._shift(), 240000),
      setInterval(() => this._todayChip(), 600000),
    ];
    if (this._built) this._observe();
    this._locHandler = () => this._handleLocationChanged();
    window.addEventListener('location-changed', this._locHandler);
    window.addEventListener('popstate', this._locHandler);
    if (this._cfg && this._cfg.screensaver) {
      this._hideSidebarAndHeader();
      setTimeout(() => this._hideSidebarAndHeader(), 100);
      setTimeout(() => this._hideSidebarAndHeader(), 500);
    }
  }

  disconnectedCallback() {
    (this._timers || []).forEach(clearInterval);
    if (this._ro) this._ro.disconnect();
    clearTimeout(this._popTimer);
    window.removeEventListener('keydown', this._onKey);
    if (this._locHandler) {
      window.removeEventListener('location-changed', this._locHandler);
      window.removeEventListener('popstate', this._locHandler);
    }
    this._restoreSidebarAndHeader();
  }

  _handleLocationChanged() {
    this._restoreSidebarAndHeader();
    setTimeout(() => this._restoreSidebarAndHeader(), 100);
    setTimeout(() => this._restoreSidebarAndHeader(), 500);
  }

  _hideSidebarAndHeader() {
    if (!this._cfg || !this._cfg.screensaver) return;
    try {
      const doc = document;
      const homeAssistant = doc.querySelector('home-assistant');
      if (!homeAssistant) return;
      const main = homeAssistant.shadowRoot && homeAssistant.shadowRoot.querySelector('home-assistant-main');
      if (!main || !main.shadowRoot) return;
      const mainShadow = main.shadowRoot;

      const sidebar = mainShadow.querySelector('ha-sidebar');
      if (sidebar) {
        sidebar.style.width = '0px';
        sidebar.style.display = 'none';
      }

      const contentContainer = mainShadow.querySelector('.content');
      if (contentContainer) {
        contentContainer.style.paddingLeft = '0px';
        contentContainer.style.marginLeft = '0px';
      }

      const partialResolver = mainShadow.querySelector('partial-panel-resolver');
      const lovelace = partialResolver && partialResolver.querySelector('ha-panel-lovelace');
      const huiRoot = lovelace && lovelace.shadowRoot && lovelace.shadowRoot.querySelector('hui-root');
      if (huiRoot && huiRoot.shadowRoot) {
        const header = huiRoot.shadowRoot.querySelector('.header') || huiRoot.shadowRoot.querySelector('app-header');
        if (header) {
          header.style.display = 'none';
          header.style.height = '0px';
        }
        const mainContainer = huiRoot.shadowRoot.querySelector('#view');
        if (mainContainer) {
          mainContainer.style.paddingTop = '0px';
          mainContainer.style.marginTop = '0px';
        }
      }
    } catch (e) {
      console.warn('[claude-energy-scene] Failed to hide sidebar/header via JS:', e);
    }
  }

  _restoreSidebarAndHeader() {
    try {
      const doc = document;
      const homeAssistant = doc.querySelector('home-assistant');
      if (!homeAssistant) return;
      const main = homeAssistant.shadowRoot && homeAssistant.shadowRoot.querySelector('home-assistant-main');
      if (!main || !main.shadowRoot) return;
      const mainShadow = main.shadowRoot;

      const sidebar = mainShadow.querySelector('ha-sidebar');
      if (sidebar) {
        sidebar.style.width = '';
        sidebar.style.display = '';
      }

      const contentContainer = mainShadow.querySelector('.content');
      if (contentContainer) {
        contentContainer.style.paddingLeft = '';
        contentContainer.style.marginLeft = '';
      }

      const partialResolver = mainShadow.querySelector('partial-panel-resolver');
      const lovelace = partialResolver && partialResolver.querySelector('ha-panel-lovelace');
      const huiRoot = lovelace && lovelace.shadowRoot && lovelace.shadowRoot.querySelector('hui-root');
      if (huiRoot && huiRoot.shadowRoot) {
        const header = huiRoot.shadowRoot.querySelector('.header') || huiRoot.shadowRoot.querySelector('app-header');
        if (header) {
          header.style.display = '';
          header.style.height = '';
        }
        const mainContainer = huiRoot.shadowRoot.querySelector('#view');
        if (mainContainer) {
          mainContainer.style.paddingTop = '';
          mainContainer.style.marginTop = '';
        }
      }
    } catch (e) {
      console.warn('[claude-energy-scene] Failed to restore sidebar/header via JS:', e);
    }
  }

  /* ----- helpers ----- */
  _ent(key) { return this._cfg.entities && this._cfg.entities[key]; }
  _st(key) { const id = this._ent(key); return (id && this._hass && this._hass.states[id]) || null; }
  _num(key) { const s = this._st(key); if (!s) return null; const v = parseFloat(s.state); return isFinite(v) ? v : null; }
  _numId(id) { const s = id && this._hass && this._hass.states[id]; if (!s) return null; const v = parseFloat(s.state); return isFinite(v) ? v : null; }
  _scale(key) { const s = this._st(key); const u = s && s.attributes.unit_of_measurement; return u === 'kW' ? 1000 : u === 'MW' ? 1e6 : 1; }
  _watts(key) { const v = this._num(key); return v == null ? 0 : v * this._scale(key); }
  _discharge(raw) { return this._cfg.battery_invert ? -raw : raw; }
  $(s) { return this.shadowRoot.querySelector(s); }
  $$(s) { return this.shadowRoot.querySelectorAll(s); }
  _setF(f, v) { this.$$(`[data-f="${f}"]`).forEach((el) => { if (el.textContent !== v) el.textContent = v; }); }

  // live waarden; het simulatiepaneel kan ze overschrijven (dan wordt het net uit de balans berekend)
  _live() {
    const S = this._sim || {};
    let grid = this._watts('grid');
    const solar = S.solar != null ? S.solar : Math.max(0, this._watts('solar'));
    const load = S.load != null ? S.load : Math.max(0, this._watts('load'));
    let dis = S.bat != null ? -S.bat : this._discharge(this._watts('battery_power'));
    // standby-verbruik van de omvormer (tot ~65 W) is geen laden of ontladen: tonen we als 0
    if (Math.abs(dis) <= (this._cfg.battery_standby_w != null ? +this._cfg.battery_standby_w : 65)) dis = 0;
    const soc = S.soc != null ? S.soc : this._num('battery_soc');
    const evOn = S.ev != null ? S.ev : !!this._ent('ev_power');
    const ev = !evOn ? 0 : S.evp != null ? S.evp : Math.max(0, this._watts('ev_power'));
    if (['solar', 'load', 'bat', 'evp', 'ev'].some((k) => S[k] != null)) grid = load + ev - solar - dis;
    return { grid, solar, load, dis, soc, ev, evOn };
  }

  /* ----- opbouw ----- */
  _cardHTML(k, label, icon, color, extra = '') {
    return `<button class="card" data-pop="${k}" data-card="${k}" style="--c:${color}">
      <div class="c-head">${icon}<span>${label}</span><span class="pill" data-f="${k}-pill"></span></div>
      <div class="c-val"><span data-f="${k}-v">–</span><small data-f="${k}-u"></small></div>${extra}
      <div class="c-sub" data-f="${k}-s"></div></button>`;
  }

  _build() {
    this._built = true;
    const soc = `<div class="socbar">${'<i></i>'.repeat(10)}</div>`;
    const hasPrice = !!this._ent('grid_price');
    const labelCards = () => ['solar', 'grid', 'battery'].map((k) => `<div class="tag" data-tag="${k}" data-pop="${k}"><b data-f="${k}-tag"></b><span data-f="${k}-tagl"></span></div>`).join('');
    // onderbalk: één rij, alle kaartjes even groot
    const dockCards = () => [
      this._cardHTML('grid', 'Stroomnet', ICON.grid, C.import),
      this._cardHTML('battery', 'Thuisbatterij', ICON.battery, C.battery, soc),
      this._cardHTML('solar', 'Zonnepanelen', ICON.solar, C.solar),
      this._cardHTML('ev', 'Laadpaal', ICON.plug, C.ev),
      this._cardHTML('home', 'Huisverbruik', ICON.home, C.home),
      hasPrice ? this._cardHTML('price', 'Stroomprijs', ICON.price, C.normal) : '',
      this._cardHTML('overview', 'Energieoverzicht', ICON.total, C.home),
    ].join('');
    this.shadowRoot.innerHTML = `<style>${CSS}</style>
    <div class="root" id="root">
      <div class="sky" id="sky"></div>
      <div class="stage" id="stage">
        <header>
          <div class="clock"><div class="time" id="time">--:--</div><div class="date" id="date"></div></div>
          <div class="hright">
            <button class="weather" id="weather" aria-label="Weer"><div><div class="w-temp" id="w-temp">–</div><div class="w-sub" id="w-sub"></div></div><span class="ic" id="w-icon"></span></button>
          </div>
        </header>
        <div class="scene" id="scene">${sceneSVG()}<div class="labels" id="labels">${labelCards()}</div></div>

        <div class="dock" id="dock">${dockCards()}</div>
      </div>
      ${this._cfg.simulator === false ? '' : `<button class="simbtn" id="simbtn">${ICON.sliders.replace('<svg ', '<svg width="15" height="15" ')}Simulatie</button>
      <div class="sim" id="sim"></div>`}
    </div>
    <div class="modal" id="modal" aria-hidden="true">
      <div class="sheet" role="dialog" aria-modal="true" aria-labelledby="sh-h">
        <div class="sh-head"><div class="sh-icon" id="sh-icon"></div>
          <div class="sh-title"><h2 id="sh-h"></h2><div class="sh-sub" id="sh-sub"></div></div>
          <div class="sh-live" id="sh-live"></div>
          <button class="close" data-close aria-label="Sluiten">${ICON.close}</button></div>
        <div class="kpis" id="kpis"></div>
        <div class="sh-bar"><div class="seg" id="seg"></div><div class="legend" id="legend"></div></div>
        <div class="chart" id="chart"></div>
        <div class="foot" id="foot"></div>
      </div>
    </div>
    <div class="modal" id="ovm" aria-hidden="true">
      <div class="sheet wide" role="dialog" aria-modal="true" aria-labelledby="ov-h">
        <div class="sh-head"><div class="sh-icon" style="--c:${C.home}">${ICON.total}</div>
          <div class="sh-title"><h2 id="ov-h">Energieoverzicht</h2><div class="sh-sub" id="ov-sub"></div></div>
          <div class="sh-tools">
            <div class="seg" id="ov-seg">${[['day', 'Dag'], ['week', 'Week'], ['month', 'Maand'], ['year', 'Jaar']].map(([k, l]) => `<button data-k="${k}">${l}</button>`).join('')}</div>
            <button class="iconbtn" id="ov-prev" aria-label="Vorige periode">${ICON.prev}</button>
            <button class="iconbtn" id="ov-next" aria-label="Volgende periode">${ICON.next}</button>
          </div>
          <button class="close" data-close aria-label="Sluiten">${ICON.close}</button></div>
        <div class="ov-body" id="ov-body"></div>
      </div>
    </div>`;

    if (this._cfg.height) this.$('#root').style.setProperty('--h', this._cfg.height);
    this._svg = this.$('#scene > svg');
    this._flows = {};
    [...Object.keys(FLOWS), 'ev2'].forEach((k) => {
      const p = this.$(`#fp-${k}`);
      let len = 80;
      try { len = p.getTotalLength() || 80; } catch (e) { /* nog niet zichtbaar */ }
      this._flows[k] = { path: p, dots: this.$(`#fd-${k}`), len };
    });

    this.$('#root').addEventListener('click', (e) => this._onClick(e));
    ['#modal', '#ovm'].forEach((id) => {
      const m = this.$(id);
      m.addEventListener('click', (e) => { if (e.target === m || e.target.closest('[data-close]')) this._closeAll(); });
      m.addEventListener('pointermove', () => this._armPopTimer());
    });
    this.$$('#ov-seg button').forEach((b) => b.addEventListener('click', () => { this._ov.kind = b.dataset.k; this._ov.off = 0; this._loadOverview(); }));
    this.$('#ov-prev').addEventListener('click', () => { this._ov.off--; this._loadOverview(); });
    this.$('#ov-next').addEventListener('click', () => { if (this._ov.off < 0) { this._ov.off++; this._loadOverview(); } });
    this._onKey = (e) => { if (e.key === 'Escape') this._closeAll(); };
    window.addEventListener('keydown', this._onKey);
    if (this.$('#simbtn')) this._buildSim();
    this._observe();
    this._clock();
    this._setF('overview-v', '–'); this._setF('overview-s', 'Kosten vandaag · tik voor details');
    setTimeout(() => this._todayChip(), 1500);
  }

  /* ----- tijdelijk simulatiepaneel: overschrijft tijd, weer en vermogens ----- */
  _buildSim() {
    this._sim = {};
    const fmtW = (v) => { const p = fmtPower(v); return `${v < 0 ? '−' : ''}${p.v} ${p.u}`; };
    const hm = (v) => `${String(Math.floor(v)).padStart(2, '0')}:${String(Math.round((v % 1) * 60)).padStart(2, '0')}`;
    this._simRows = [
      ['time', 'Tijd van de dag', 0, 24, 0.25, hm],
      ['cond', 'Weer'],
      ['cover', 'Bewolking', 0, 100, 1, (v) => `${v}%`],
      ['wind', 'Wind', 0, 100, 1, (v) => `${v} km/u`],
      ['temp', 'Temperatuur', -10, 35, 0.5, (v) => `${num(v, 1)}°`],
      ['solar', 'Zonnepanelen', 0, 8000, 50, fmtW],
      ['load', 'Huisverbruik', 0, 12000, 50, fmtW],
      ['soc', 'Laadniveau batterij', 0, 100, 1, (v) => `${v}%`],
      ['bat', 'Batterij (+ laden / − ontladen)', -11000, 11000, 100, fmtW],
      ['ev', 'Laadpaal met auto'],
      ['evp', 'Laadvermogen auto', 0, 11000, 100, fmtW],
    ];
    const el = this.$('#sim');
    el.innerHTML = `<h4>Simulatie</h4><div class="hint">Tijdelijk testpaneel. Vink een regel aan om de live waarde te overschrijven; het net volgt dan uit de balans.</div>
      ${this._simRows.map(([k, label, mn, mx, st]) => `<div class="row off" data-k="${k}"><div class="rh"><label><input type="checkbox" data-en>${label}</label><span class="val"></span></div>
        ${k === 'cond' ? `<select>${CONDITIONS.map((c) => `<option value="${c}">${WEATHER_NL[c] || c}</option>`).join('')}</select>`
          : k === 'ev' ? '' : `<input type="range" min="${mn}" max="${mx}" step="${st}">`}</div>`).join('')}
      <div class="acts"><button data-act="reset">Alles live</button><button data-act="close">Sluiten</button></div>`;
    const apply = () => {
      this.$('#simbtn').classList.toggle('on', Object.keys(this._sim).length > 0);
      this._flowKey = {};
      this._update(); this._scene(); this._simLabels();
    };
    el.querySelectorAll('.row').forEach((row) => {
      const k = row.dataset.k, en = row.querySelector('[data-en]'), ctl = row.querySelector('input[type=range], select');
      const read = () => (k === 'cond' ? ctl.value : k === 'ev' ? true : +ctl.value);
      en.addEventListener('change', () => { if (en.checked) this._sim[k] = read(); else delete this._sim[k]; row.classList.toggle('off', !en.checked); apply(); });
      if (ctl) ctl.addEventListener('input', () => { en.checked = true; row.classList.remove('off'); this._sim[k] = read(); apply(); });
    });
    el.querySelector('[data-act=reset]').addEventListener('click', () => {
      this._sim = {}; el.querySelectorAll('[data-en]').forEach((c) => { c.checked = false; }); el.querySelectorAll('.row').forEach((r) => r.classList.add('off'));
      this._simSeed(); apply();
    });
    el.querySelector('[data-act=close]').addEventListener('click', () => el.classList.remove('open'));
    this.$('#simbtn').addEventListener('click', (e) => { e.stopPropagation(); if (!el.classList.contains('open')) this._simSeed(); el.classList.toggle('open'); });
    ['click', 'pointerdown'].forEach((t) => el.addEventListener(t, (e) => e.stopPropagation()));
  }

  // regels die niet overschreven zijn tonen de huidige live waarde als startpunt
  _simSeed() {
    if (!this._hass) return;
    const w = this._st('weather'), wa = (w && w.attributes) || {}, d = new Date(), L = this._live();
    const live = { time: d.getHours() + Math.round(d.getMinutes() / 15) / 4, cond: w ? w.state : 'cloudy', cover: Math.round(+wa.cloud_coverage || 0),
      wind: Math.round(+wa.wind_speed || 0), temp: +wa.temperature || 10, solar: Math.round(L.solar), load: Math.round(L.load),
      soc: Math.round(L.soc || 0), bat: Math.round(-L.dis), evp: 7400 };
    this.$$('#sim .row').forEach((row) => {
      const k = row.dataset.k, ctl = row.querySelector('input[type=range], select');
      if (ctl && this._sim[k] == null && live[k] != null) ctl.value = live[k];
    });
    this._simLabels();
  }

  _simLabels() {
    this.$$('#sim .row').forEach((row) => {
      const k = row.dataset.k, def = this._simRows.find((r) => r[0] === k), ctl = row.querySelector('input[type=range], select'), val = row.querySelector('.val');
      if (k === 'cond') val.textContent = WEATHER_NL[ctl.value] || ctl.value;
      else if (k === 'ev') val.textContent = this._sim.ev ? 'aan' : 'live';
      else val.textContent = def[5](+ctl.value);
    });
  }

  _observe() {
    if (this._ro) this._ro.disconnect();
    this._ro = new ResizeObserver(() => {
      this._layout();
      if (this._pop && this._pop.draw) this._pop.draw();
      if (this._ov && this._ov.draw) this._ov.draw();
    });
    ['#root', '#chart', '#ov-body'].forEach((s) => this._ro.observe(this.$(s)));
  }

  // schaal en positie van de scène; lucht, labels en lijnen sluiten daarop aan
  _layout() {
    const svg = this._svg, root = this.$('#root');
    if (!svg) return;
    const r = svg.getBoundingClientRect(), rr = root.getBoundingClientRect();
    if (!r.width || !r.height) return;
    const vbW = Math.round(clamp((r.width / r.height) * VB.h, 1300, 1600)), vx = 800 - vbW / 2;
    if (vbW !== this._vbW) { this._vbW = vbW; svg.setAttribute('viewBox', `${vx} ${VB.y} ${vbW} ${VB.h}`); }
    const s = Math.min(r.width / vbW, r.height / VB.h);
    const ox = (r.width - vbW * s) / 2, oy = r.height - VB.h * s;
    const P = ([x, y]) => [ox + (x - vx) * s, oy + (y - VB.y) * s];
    root.style.setProperty('--horizon', `${Math.round(r.top - rr.top + P([0, GROUND])[1])}px`);

    const compact = s < 0.62 || rr.width < 700;
    root.classList.toggle('compact', compact);
    if (compact) return;
    const k = clamp(s, 0.72, 1.3);
    Object.entries(TAGS).forEach(([key, q]) => {
      const el = this.$(`#labels [data-tag="${key}"]`); if (!el) return;
      const [tx, ty] = P(q), left = q[2] === 'l';   // 'l': label staat links van het punt, op halve hoogte
      el.style.transformOrigin = left ? '100% 50%' : '50% 100%';
      el.style.transform = `translate(${tx.toFixed(1)}px,${ty.toFixed(1)}px) translate(${left ? '-100%,-50%' : '-50%,-100%'}) scale(${k.toFixed(3)})`;
    });
  }

  _shift() {
    const st = this.$('#stage'); if (!st) return;
    st.style.transform = `translate(${Math.round(rand() * 6 - 3)}px, ${Math.round(rand() * 6 - 3)}px)`;
  }

  /* ----- interactie ----- */
  _onClick(e) {
    const path = e.composedPath();
    const pop = path.find((n) => n.dataset && n.dataset.pop);
    if (pop) { pop.dataset.pop === 'overview' ? this._openOverview() : this._openPopup(pop.dataset.pop); return; }
    if (path.find((n) => n.id === 'weather')) {
      const id = this._ent('weather');
      if (id) this.dispatchEvent(new CustomEvent('hass-more-info', { detail: { entityId: id }, bubbles: true, composed: true }));
      return;
    }
    const a = this._cfg.tap_action || (this._cfg.screensaver ? { action: 'navigate', navigation_path: '/lovelace/0' } : null);
    if (a && a.action === 'navigate' && a.navigation_path) {
      history.pushState(null, '', a.navigation_path);
      window.dispatchEvent(new CustomEvent('location-changed', { detail: { replace: false } }));
    }
  }

  _clock() {
    if (!this._built) return;
    const d = new Date();
    this.$('#time').textContent = d.toLocaleTimeString(NL, { hour: '2-digit', minute: '2-digit' });
    this.$('#date').textContent = `${cap(DAYS[d.getDay()])} ${d.getDate()} ${MONTHS[d.getMonth()]}`;
  }

  /* ----- live data ----- */
  _update() {
    if (!this._built || !this._hass) return;
    if (this._cfg && this._cfg.screensaver) this._hideSidebarAndHeader();
    const L = this._live();
    const pill = (k, text, color) => this.$$(`[data-f="${k}-pill"]`).forEach((el) => { el.textContent = text || ''; el.style.setProperty('--pc', color); });
    const setP = (k, w) => { const p = fmtPower(w); this._setF(`${k}-v`, p.v); this._setF(`${k}-u`, p.u); };

    setP('solar', L.solar);
    pill('solar', L.solar > 25 ? 'Actief' : '', C.solar);
    this._setF('solar-s', `Vandaag ${fmtKwh(this._num('solar_today'))}`);

    setP('grid', L.grid);
    const gImp = L.grid > 25, gExp = L.grid < -25;
    pill('grid', gImp ? 'Afname' : gExp ? 'Teruglevering' : 'Stand-by', gImp ? C.import : gExp ? C.export : C.idle);
    this.$$('[data-card="grid"]').forEach((el) => el.style.setProperty('--c', gExp ? C.export : C.import));
    this._setF('grid-s', `↓ ${fmtKwh(this._num('grid_import_today'))}  ↑ ${fmtKwh(this._num('grid_export_today'))}`);

    setP('battery', L.dis);
    const bOut = L.dis > 25, bIn = L.dis < -25;
    pill('battery', bOut ? 'Ontladen' : bIn ? 'Laden' : 'Stand-by', bOut || bIn ? C.battery : C.idle);
    const lit = Math.round((L.soc || 0) / 10);
    this.$$('.socbar').forEach((b) => b.querySelectorAll('i').forEach((s, i) => s.classList.toggle('on', i < lit)));
    this._setF('battery-s', `${fmtPct(L.soc)} · ↓ ${fmtKwh(this._num('battery_charge_today'))}  ↑ ${fmtKwh(this._num('battery_discharge_today'))}`);

    // vermogen direct bij het apparaat in de scène
    const ts = fmtPower(L.solar);
    this._setF('solar-tag', `${ts.v} ${ts.u}`); this._setF('solar-tagl', L.solar > 25 ? 'opwek' : 'geen opwek');
    const st = this.$('[data-tag="solar"]'); if (st) st.style.setProperty('--tc', L.solar > 25 ? C.solar : 'var(--text)');
    const tg = fmtPower(L.grid), tb = fmtPower(L.dis);
    this._setF('grid-tag', `${tg.v} ${tg.u}`); this._setF('grid-tagl', gImp ? 'afname' : gExp ? 'teruglevering' : 'stand-by');
    this._setF('battery-tag', `${tb.v} ${tb.u}`); this._setF('battery-tagl', bOut ? 'ontladen' : bIn ? 'laden' : 'stand-by');
    const gt = this.$('[data-tag="grid"]'), bt = this.$('[data-tag="battery"]');
    if (gt) gt.style.setProperty('--tc', gImp ? C.import : gExp ? C.export : 'var(--text)');
    if (bt) bt.style.setProperty('--tc', bOut || bIn ? C.battery : 'var(--text)');

    setP('home', L.load);
    this._setF('home-s', `Vandaag ${fmtKwh(this._num('home_today'))}`);

    if (this._ent('grid_price')) {
      const price = this._num('grid_price');
      this._setF('price-v', price == null ? '–' : num(price, 2)); this._setF('price-u', '€/kWh');
      const fc = this._prices(), lvl = this._level(this._curPrice(fc), fc);
      this.$$('[data-f="price-pill"]').forEach((pp) => { pp.textContent = lvl.label; pp.style.setProperty('--pc', lvl.color); });
      const nowT = Date.now(), fut = fc.filter((x) => x.t + 3600e3 > nowT && x.t < nowT + 24 * 3600e3);
      const low = fut.reduce((m, x) => (!m || x.v < m.v ? x : m), null);
      this._setF('price-s', low ? `Laagst ${fmtHM(low.t)} · ${fmtEur(low.v)}` : '');
    }

    // laadpaal
    const evChg = L.ev > 25;
    if (this._evShown !== L.evOn) {
      this._evShown = L.evOn;
      this.$('#ev').style.display = L.evOn ? '' : 'none';
      this.$$('[data-card="ev"]').forEach((el) => { el.style.display = L.evOn ? '' : 'none'; });
      this.$$('.flow-ev').forEach((el) => { el.style.display = L.evOn ? '' : 'none'; });
      requestAnimationFrame(() => this._layout());
    }
    setP('ev', L.ev);
    pill('ev', evChg ? 'Laden' : 'Verbonden', evChg ? C.ev : C.idle);
    this._setF('ev-s', evChg ? 'Auto wordt geladen' : 'Auto aangesloten');
    const evLed = this.$('#ev-led');
    evLed.setAttribute('fill', evChg ? C.ev : '#4A5263'); evLed.classList.toggle('pulse', evChg);

    this._setFlow('grid', L.grid, L.grid > 0, L.grid > 0 ? C.import : C.export);
    this._setFlow('battery', L.dis, L.dis < 0, C.battery);
    this._setFlow('solar', L.solar, true, C.solar);
    this._setFlow('ev', L.evOn ? L.ev : 0, true, C.ev);   // huis -> laadpaal
    this._setFlow('ev2', L.evOn ? L.ev : 0, true, C.ev);  // laadpaal -> kabel -> auto
    // batterij: ledbalk kleurt rood (bijna leeg), oranje, groen (vol)
    const sc = socColor(L.soc);
    this.$('#root').style.setProperty('--soc-c', sc);
    const segOn = Math.ceil(clamp(L.soc || 0, 0, 100) / 20);
    this.$$('#soc-seg rect').forEach((r, k) => r.setAttribute('fill', k < segOn ? sc : 'rgba(255,255,255,.1)'));
    const led = this.$('#bat-led');
    led.setAttribute('fill', bOut || bIn ? sc : '#4A5263');
    led.classList.toggle('pulse', bOut || bIn);
    this.$('#panels').style.filter = L.solar > 50 ? `brightness(${(1 + clamp(L.solar / 8000, 0, 0.5)).toFixed(2)})` : '';

    if (!this._sceneDone) { this._sceneDone = true; this._scene(); requestAnimationFrame(() => this._layout()); }
    this._windows();
    if (this._pop) this._popupLive();
  }

  _setFlow(k, watts, forward, color) {
    const f = this._flows[k]; if (!f) return;
    const a = Math.abs(watts), on = a >= 25;
    f.path.style.opacity = on ? '.5' : '0';
    f.path.style.stroke = color;
    f.dots.setAttribute('fill', color);
    if (!on || this._reduced) { f.dots.innerHTML = ''; this._flowKey[k] = null; return; }
    // snelheid in eenheden per seconde: rustig bij weinig vermogen (onder ~800 W langzaam), vlot maar vloeiend bij veel
    const speed = 9 + 61 * Math.sqrt(clamp(a / 10000, 0, 1));
    const cur = this._flowKey[k];
    if (cur && cur.fwd === forward && Math.abs(speed / cur.speed - 1) < 0.18) return;
    // fase van de stippen behouden bij een snelheidswissel, zodat ze niet terugspringen
    const T = this._svg.getCurrentTime ? this._svg.getCurrentTime() : 0;
    let len = f.len;
    try { len = f.path.getTotalLength() || f.len; } catch (e) { /* element nog niet zichtbaar */ }
    const dur = len / speed, n = Math.max(2, Math.round(len / 70));
    let p0 = 0;
    if (cur && cur.fwd === forward) p0 = (((cur.p0 + (T - cur.t0) / cur.dur) % 1) + 1) % 1;
    this._flowKey[k] = { fwd: forward, speed, dur, t0: T, p0 };
    f.dots.innerHTML = Array.from({ length: n }, (_, i) => {
      const ph = (p0 + i / n) % 1;
      return `<circle r="3.4"><animateMotion dur="${dur.toFixed(2)}s" begin="${(T - ph * dur).toFixed(3)}s" repeatCount="indefinite" calcMode="linear" keyTimes="0;1" keyPoints="${forward ? '0;1' : '1;0'}"><mpath href="#fp-${k}" xlink:href="#fp-${k}"/></animateMotion></circle>`;
    }).join('');
  }

  /* ----- prijzen ----- */
  _prices() {
    const s = this._st('grid_price'); if (!s) return [];
    const a = s.attributes || {};
    let arr = a.forecast || a.prices || a.data || [];
    if (a.raw_today) arr = [...a.raw_today, ...(a.raw_tomorrow || [])];
    return arr.map((x) => {
      let v = x.electricity_price ?? x.price ?? x.value ?? x.total;
      if (v == null) return null;
      v = +v; if (Math.abs(v) > 50) v /= 1e7; // Zonneplan levert prijzen x 10^7
      const t = toMs(x.datetime || x.start || x.from || x.startsAt);
      return isFinite(t) ? { t, v, g: x.tariff_group } : null;
    }).filter(Boolean).sort((a, b) => a.t - b.t);
  }
  _curPrice(fc) { const now = Date.now(); return fc.find((x) => x.t <= now && x.t + 3600e3 > now) || null; }
  _level(x, list) {
    const map = { low: ['Laag', C.low], normal: ['Normaal', C.normal], high: ['Hoog', C.high] };
    if (x && x.g && map[x.g]) return { label: map[x.g][0], color: map[x.g][1] };
    if (!x || !list.length) return { label: '', color: C.normal };
    const vs = list.map((y) => y.v).sort((a, b) => a - b), q1 = vs[Math.floor(vs.length / 3)], q2 = vs[Math.floor((vs.length * 2) / 3)];
    return x.v <= q1 ? { label: 'Laag', color: C.low } : x.v >= q2 ? { label: 'Hoog', color: C.high } : { label: 'Normaal', color: C.normal };
  }

  // Ramen volgen de verlichting. Config window_lights:
  //   [ids]                    alle ramen branden zodra minstens één lamp aan is, anders zijn ze donker (ook 's avonds)
  //   { sleutel: [ids], ... }  per raam (zie groundWin), bv. { living: [...] }; helderheid van de dimmer bepaalt de gloed
  _windows() {
    const lw = this._cfg.window_lights; if (!lw) return;
    const level = (ids) => {
      let b = 0;
      [].concat(ids).forEach((id) => {
        const s = this._hass && this._hass.states[id];
        if (!s || s.state !== 'on') return;
        const br = s.attributes && s.attributes.brightness;
        b = Math.max(b, br != null ? clamp(br / 255, 0.2, 1) : 1);
      });
      return b;
    };
    const ids = Array.isArray(lw) ? lw : lw.huis;
    if (ids) {
      const b = level(ids);
      const fill = b > 0 ? mix('#5A4630', '#F3C67E', 0.45 + 0.55 * b) : 'var(--glass)';
      this.$$('.glass').forEach((g) => g.setAttribute('fill', fill));
      return;
    }
    Object.keys(lw).forEach((key) => {
      const b = level(lw[key]);
      this.$$(`[data-wg="${key}"]`).forEach((g) => g.setAttribute('opacity', (b * 0.97).toFixed(2)));
    });
  }
  /* ----- lucht, licht en weer ----- */
  _scene() {
    if (!this._hass) return;
    const sun = this._hass.states[this._ent('sun') || 'sun.sun'];
    const S = this._sim || {};
    const w = this._st('weather');
    const cond = S.cond != null ? S.cond : w ? w.state : 'cloudy';
    const wa = (w && w.attributes) || {};
    const hourSun = (hr) => [Math.sin(((hr - 7) / 11) * Math.PI) * 35, 90 + ((hr - 7) / 11) * 180];
    let elev, az;
    if (S.time != null) [elev, az] = hourSun(S.time);
    else if (this._cfg.time_override != null && this._cfg.time_override !== '') [elev, az] = hourSun(+this._cfg.time_override);
    else if (sun && sun.attributes.elevation != null) { elev = +sun.attributes.elevation; az = +sun.attributes.azimuth; }
    else { const d = new Date(); [elev, az] = hourSun(d.getHours() + d.getMinutes() / 60); }

    const coverDef = { sunny: 5, 'clear-night': 5, partlycloudy: 45, windy: 30, 'windy-variant': 50, cloudy: 90, fog: 80, rainy: 100, pouring: 100, lightning: 95, 'lightning-rainy': 100, snowy: 95, 'snowy-rainy': 100, hail: 100, exceptional: 70 };
    const coverPct = S.cover != null ? S.cover : S.cond == null && wa.cloud_coverage != null ? +wa.cloud_coverage : coverDef[cond] ?? 40;
    const cover = clamp(coverPct / 100, 0, 1);
    const windKmh = S.wind != null ? S.wind : +wa.wind_speed || 0;
    const temp = S.temp != null ? S.temp : wa.temperature;
    const rainy = ['rainy', 'pouring', 'lightning-rainy', 'hail', 'snowy-rainy'].includes(cond);
    const snowy = ['snowy', 'snowy-rainy'].includes(cond);
    const storm = ['lightning', 'lightning-rainy'].includes(cond);
    const windy = ['windy', 'windy-variant'].includes(cond) || windKmh > 35;

    const nt = SKY.night, tw = SKY.twilight, dy = SKY.day;
    let top, bot;
    if (elev < 0) { const k = clamp((elev + 10) / 10, 0, 1); top = mixRGB(hex(nt[0]), hex(tw[0]), k); bot = mixRGB(hex(nt[1]), hex(tw[1]), k); }
    else { const k = clamp(elev / 15, 0, 1); top = mixRGB(hex(tw[0]), hex(dy[0]), k); bot = mixRGB(hex(tw[1]), hex(dy[1]), k); }
    const desat = (a, t) => { const l = a[0] * 0.3 + a[1] * 0.59 + a[2] * 0.11; return a.map((v) => Math.round((v + (l - v) * t) * (1 - 0.28 * t))); };
    top = desat(top, cover * 0.75); bot = desat(bot, cover * 0.75);
    this.$('#sky').style.background = `linear-gradient(180deg, ${rgb(top)} 0%, ${rgb(bot)} 100%)`;

    const day = clamp((elev + 4) / 16, 0, 1) * (1 - 0.3 * cover);
    const root = this.$('#root');
    for (const [k, [n, d]] of Object.entries(PAL)) root.style.setProperty(`--${k}`, mix(n, d, day));
    const lit = elev < 3;
    const lw = this._cfg.window_lights, allLinked = Array.isArray(lw) || (lw && lw.huis);
    const linked = (lw && !Array.isArray(lw)) ? lw : {};
    this.$$('.glass').forEach((g) => g.setAttribute('fill', allLinked || (g.dataset.win && linked[g.dataset.win]) ? 'var(--glass)' : lit ? '#EFC27A' : 'var(--glass)'));
    this._windows();

    const up = elev > -2;
    const x = clamp(800 + ((az - 180) / 90) * 560, 120, 1480), y = clamp(GROUND - 40 - elev * 8, 60, GROUND - 30);
    this.$('#orb').setAttribute('transform', up ? `translate(${x.toFixed(0)} ${y.toFixed(0)})` : 'translate(1230 120)');
    const vis = 1 - cover * 0.85;
    this.$('#sun').setAttribute('opacity', up ? vis.toFixed(2) : '0');
    this.$('#sun-halo').setAttribute('opacity', up ? (vis * clamp(elev / 10, 0.3, 1)).toFixed(2) : '0');
    this.$('#moon').setAttribute('opacity', up ? '0' : (1 - cover * 0.8).toFixed(2));
    this.$('#stars').setAttribute('opacity', (clamp(-elev / 10, 0, 1) * (1 - cover)).toFixed(2));

    const nClouds = Math.round(cover * 8);
    this.$$('.cloud').forEach((c) => c.setAttribute('opacity', +c.dataset.i < nClouds ? '1' : '0'));
    const cl = this.$('#clouds');
    cl.setAttribute('fill', rainy || snowy ? mix('#141925', '#8D96A4', day) : 'var(--cloud)');
    cl.setAttribute('opacity', (0.45 + 0.4 * cover).toFixed(2));

    // wind: regen helt mee, bomen bewegen, wolken drijven sneller
    const wind = clamp(windKmh / 60, 0, 1);
    const sc = this.$('#scene');
    sc.style.setProperty('--skew', `${(-6 - wind * 16).toFixed(1)}deg`);
    sc.style.setProperty('--drift', `${(-40 - wind * 160).toFixed(0)}px`);
    sc.style.setProperty('--sway', `${(0.3 + wind * 3.2).toFixed(2)}deg`);
    sc.style.setProperty('--sway-dur', `${(7 - wind * 4.8).toFixed(2)}s`);
    cl.classList.toggle('windy', windy && !storm);
    cl.classList.toggle('storm', storm);
    // neerslag
    const heavy = ['pouring', 'lightning-rainy'].includes(cond);
    const rain = this.$('#rain');
    rain.classList.toggle('pour', heavy);
    rain.classList.toggle('light', ['rainy', 'snowy-rainy', 'hail'].includes(cond));
    rain.setAttribute('opacity', rainy ? (heavy ? '.6' : '.4') : '0');
    this.$('#hail').setAttribute('opacity', cond === 'hail' ? '.9' : '0');
    this.$('#snow').setAttribute('opacity', snowy ? '.85' : '0');
    // sneeuw blijft liggen op dak en gras
    this.$('#snow-roof').setAttribute('opacity', cond === 'snowy' ? '.82' : cond === 'snowy-rainy' ? '.35' : '0');
    this.$('#snow-lawn').setAttribute('opacity', cond === 'snowy' ? '.72' : cond === 'snowy-rainy' ? '.25' : '0');
    this.$('#fog').setAttribute('opacity', cond === 'fog' ? '1' : cond === 'exceptional' ? '.4' : '0');
    // onweer: bliksemflits en schicht
    this.$('#flash').classList.toggle('on', storm && !this._reduced);
    this.$('#bolt').classList.toggle('on', storm && !this._reduced);
    // zon: stralen bij helder weer
    this.$('#rays').setAttribute('opacity', up && ['sunny', 'partlycloudy', 'windy'].includes(cond) ? (vis * clamp(elev / 12, 0, 1)).toFixed(2) : '0');

    if (w || S.cond != null) {
      this.$('#w-temp').textContent = temp != null ? `${num(+temp, 1)}°` : '–';
      const sub = [WEATHER_NL[cond] || cond];
      if (windKmh != null) sub.push(`${num(+windKmh, 0)} km/u`);
      if (wa.humidity != null) sub.push(`${num(+wa.humidity, 0)}%`);
      this.$('#w-sub').textContent = sub.join(' · ');
      const ic = ICON[(cond === 'sunny' || cond === 'partlycloudy') && !up ? (cond === 'sunny' ? 'moon' : 'cloud') : WEATHER_ICON[cond] || 'cloud'];
      if (this._wIcon !== ic) { this._wIcon = ic; this.$('#w-icon').innerHTML = ic; }
    }
  }

  /* ===================== popups per apparaat ===================== */
  _openPopup(kind) {
    const meta = {
      solar: ['Zonnepanelen', ICON.solar, C.solar], grid: ['Stroomnet', ICON.grid, C.import],
      battery: ['Thuisbatterij', ICON.battery, C.battery], home: ['Huisverbruik', ICON.home, C.home],
      price: ['Stroomprijs', ICON.price, C.normal],
    }[kind];
    if (!meta) return;
    this._closeAll();
    this._pop = { kind, range: kind === 'price' ? 'forecast' : '24h', derived: {} };
    this.$('#sh-h').textContent = meta[0];
    this.$('#sh-icon').innerHTML = meta[1];
    this.$('#sh-icon').style.setProperty('--c', meta[2]);
    const ranges = kind === 'price' ? [] : [['24h', '24 uur'], ['7d', '7 dagen'], ['30d', '30 dagen'], ['12m', '12 maanden']];
    const seg = this.$('#seg');
    seg.style.display = ranges.length ? '' : 'none';
    seg.innerHTML = ranges.map(([k, l]) => `<button data-r="${k}" aria-pressed="${k === this._pop.range}">${l}</button>`).join('');
    seg.querySelectorAll('button').forEach((b) => b.addEventListener('click', () => {
      this._pop.range = b.dataset.r;
      seg.querySelectorAll('button').forEach((x) => x.setAttribute('aria-pressed', x === b));
      this._loadChart();
    }));
    this._popupLive();
    const m = this.$('#modal'); m.classList.add('open'); m.setAttribute('aria-hidden', 'false');
    this._armPopTimer();
    this._loadChart();
    if (kind !== 'price') this._loadWeekKpi();
  }

  _closeAll() {
    ['#modal', '#ovm'].forEach((id) => { const m = this.$(id); if (m) { m.classList.remove('open'); m.setAttribute('aria-hidden', 'true'); } });
    this._pop = null; if (this._ov) this._ov.open = false;
    clearTimeout(this._popTimer);
  }

  _armPopTimer() {
    clearTimeout(this._popTimer);
    this._popTimer = setTimeout(() => this._closeAll(), (this._cfg.popup_timeout || 120) * 1000);
  }

  _popupLive() {
    const P = this._pop; if (!P) return;
    const L = this._live(), d = P.derived;
    let status = '', live = null, kpis = [];
    const pw = (w) => { const p = fmtPower(w); return `${p.v}<small>${p.u}</small>`; };
    const kImp = this._num('grid_import_today'), kExp = this._num('grid_export_today'), kHome = this._num('home_today');
    if (P.kind === 'solar') {
      status = L.solar > 25 ? 'Produceert nu' : 'Geen opwek';
      live = pw(L.solar);
      kpis = [['Vandaag', fmtKwh(this._num('solar_today'))], ['Piek (24 uur)', d.peak != null ? `${fmtPower(d.peak).v} ${fmtPower(d.peak).u}` : '–', d.peakT ? `om ${fmtHM(d.peakT)}` : ''],
        ['Gemiddeld per dag', fmtKwh(d.avg7), 'afgelopen 7 dagen']];
    } else if (P.kind === 'grid') {
      status = L.grid > 25 ? 'Afname van het net' : L.grid < -25 ? 'Teruglevering aan het net' : 'Stand-by';
      live = pw(L.grid);
      const net = kImp != null && kExp != null ? kImp - kExp : null;
      kpis = [['Afname vandaag', fmtKwh(kImp)], ['Teruglevering vandaag', fmtKwh(kExp)], ['Netto vandaag', fmtKwh(net), net != null ? (net >= 0 ? 'afname' : 'teruglevering') : ''],
        ['Prijs nu', this._num('grid_price') != null ? fmtEur(this._num('grid_price')) : '–', 'per kWh']];
    } else if (P.kind === 'battery') {
      status = L.dis > 25 ? 'Ontladen' : L.dis < -25 ? 'Laden' : 'Stand-by';
      live = pw(L.dis);
      kpis = [['Laadniveau', fmtPct(L.soc)], ['Geladen vandaag', fmtKwh(this._num('battery_charge_today'))], ['Ontladen vandaag', fmtKwh(this._num('battery_discharge_today'))],
        ['Gemiddeld per dag', fmtKwh(d.avg7), 'geladen, afgelopen 7 dagen']];
    } else if (P.kind === 'home') {
      status = 'Actueel verbruik';
      live = pw(L.load);
      kpis = [['Vandaag', fmtKwh(kHome)], ['Gemiddeld vermogen', d.mean != null ? `${fmtPower(d.mean).v} ${fmtPower(d.mean).u}` : '–', 'afgelopen 24 uur'],
        ['Gemiddeld per dag', fmtKwh(d.avg7), 'afgelopen 7 dagen']];
    } else if (P.kind === 'price') {
      const fc = this._prices(), cur = this._curPrice(fc), lvl = this._level(cur, fc);
      const t0 = new Date(); t0.setHours(0, 0, 0, 0);
      const today = fc.filter((x) => x.t >= +t0 && x.t < +t0 + 86400e3);
      const mn = today.reduce((m, x) => (!m || x.v < m.v ? x : m), null), mx = today.reduce((m, x) => (!m || x.v > m.v ? x : m), null);
      const avg = today.length ? today.reduce((s, x) => s + x.v, 0) / today.length : null;
      const next = fc.filter((x) => x.t > Date.now()).reduce((m, x) => (!m || x.v < m.v ? x : m), null);
      status = lvl.label ? `Tarief ${lvl.label.toLowerCase()}` : 'Dynamisch tarief';
      live = this._num('grid_price') != null ? `${fmtEur(this._num('grid_price'), 3)}<small>/kWh</small>` : '–';
      kpis = [['Gemiddeld vandaag', fmtEur(avg, 3)], ['Laagste vandaag', mn ? fmtEur(mn.v, 3) : '–', mn ? `${fmtHM(mn.t)} – ${fmtHM(mn.t + 3600e3)}` : ''],
        ['Hoogste vandaag', mx ? fmtEur(mx.v, 3) : '–', mx ? `${fmtHM(mx.t)} – ${fmtHM(mx.t + 3600e3)}` : ''],
        ['Goedkoopst vanaf nu', next ? fmtEur(next.v, 3) : '–', next ? `${new Date(next.t).getDate() !== new Date().getDate() ? 'morgen ' : ''}${fmtHM(next.t)}` : '']];
    }
    this.$('#sh-sub').textContent = status;
    this.$('#sh-live').innerHTML = live || '';
    this.$('#kpis').innerHTML = kpis.map(([l, v, h]) => `<div class="kpi"><div class="l">${l}</div><div class="v">${v}</div>${h ? `<div class="h">${h}</div>` : ''}</div>`).join('');
  }

  /* ----- statistiek ----- */
  async _ws(msg, ttl = 120e3) {
    const key = JSON.stringify(msg);
    const c = this._cache[key];
    if (c && Date.now() - c.t < ttl) return c.d;
    const d = await this._hass.callWS(msg);
    this._cache[key] = { t: Date.now(), d };
    return d;
  }

  async _stats(ids, start, end, period, types) {
    if (!ids.length) return {};
    const msg = { type: 'recorder/statistics_during_period', start_time: new Date(start).toISOString(), period, statistic_ids: ids, types };
    if (end) msg.end_time = new Date(end).toISOString();
    return this._ws(msg);
  }

  async _statIds() {
    if (this._ids) return this._ids;
    const o = this._cfg.statistics || {};
    let prefs = null;
    try { prefs = await this._ws({ type: 'energy/get_prefs' }, 3600e3); } catch (e) { /* geen energie-config */ }
    const ids = { grid_import: [], grid_export: [], grid_import_cost: [], grid_export_compensation: [], solar: [], battery_charge: [], battery_discharge: [] };
    (prefs && prefs.energy_sources || []).forEach((s) => {
      if (s.type === 'grid') {
        (s.flow_from || []).forEach((f) => { if (f.stat_energy_from) { ids.grid_import.push(f.stat_energy_from); ids.grid_import_cost.push(f.stat_cost || `${f.stat_energy_from}_cost`); } });
        (s.flow_to || []).forEach((f) => { if (f.stat_energy_to) { ids.grid_export.push(f.stat_energy_to); ids.grid_export_compensation.push(f.stat_compensation || `${f.stat_energy_to}_compensation`); } });
      } else if (s.type === 'solar' && s.stat_energy_from) ids.solar.push(s.stat_energy_from);
      else if (s.type === 'battery') {
        if (s.stat_energy_to) ids.battery_charge.push(s.stat_energy_to);
        if (s.stat_energy_from) ids.battery_discharge.push(s.stat_energy_from);
      }
    });
    Object.keys(ids).forEach((k) => { if (o[k]) ids[k] = [].concat(o[k]); });
    this._ids = ids;
    return ids;
  }

  _rangeBounds(range) {
    const now = new Date(), s = new Date(now);
    if (range === '24h') return { start: new Date(+now - 24 * 3600e3), period: '5minute' };
    s.setHours(0, 0, 0, 0);
    if (range === '7d') { s.setDate(s.getDate() - 6); return { start: s, period: 'day', n: 7 }; }
    if (range === '30d') { s.setDate(s.getDate() - 29); return { start: s, period: 'day', n: 30 }; }
    s.setDate(1); s.setMonth(s.getMonth() - 11); return { start: s, period: 'month', n: 12 };
  }

  async _energy(range) {
    const ids = await this._statIds();
    const { start, period, n } = this._rangeBounds(range);
    const keys = ['grid_import', 'grid_export', 'solar', 'battery_charge', 'battery_discharge'];
    const all = [...new Set(keys.flatMap((k) => ids[k]))];
    const res = await this._stats(all, start, null, period, ['change']);
    const buckets = [];
    const d = new Date(start);
    for (let i = 0; i < n; i++) { buckets.push(+d); if (period === 'day') d.setDate(d.getDate() + 1); else d.setMonth(d.getMonth() + 1); }
    const idx = (t) => { for (let i = buckets.length - 1; i >= 0; i--) if (t >= buckets[i] - 3600e3) return i; return -1; };
    const e = { t: buckets, period };
    keys.forEach((k) => {
      const out = new Array(n).fill(null);
      ids[k].forEach((id) => (res[id] || []).forEach((r) => { const i = idx(toMs(r.start)); if (i >= 0 && r.change != null) out[i] = (out[i] || 0) + r.change; }));
      e[k] = out;
    });
    e.home = buckets.map((_, i) => {
      const v = [e.grid_import[i], e.solar[i], e.battery_discharge[i], e.grid_export[i], e.battery_charge[i]];
      if (v.every((x) => x == null)) return null;
      return Math.max(0, (v[0] || 0) + (v[1] || 0) + (v[2] || 0) - (v[3] || 0) - (v[4] || 0));
    });
    return e;
  }

  async _loadWeekKpi() {
    const P = this._pop;
    try {
      const e = await this._energy('7d');
      if (P !== this._pop) return;
      const key = { solar: 'solar', battery: 'battery_charge', home: 'home', grid: 'grid_import' }[P.kind];
      const vals = (e[key] || []).slice(0, -1).filter((v) => v != null);
      P.derived.avg7 = vals.length ? vals.reduce((a, b) => a + b, 0) / vals.length : null;
      this._popupLive();
    } catch (err) { /* KPI blijft leeg */ }
  }

  async _loadChart() {
    const P = this._pop; if (!P) return;
    const el = this.$('#chart'), range = P.range, kind = P.kind;
    P.draw = null;
    el.innerHTML = '<div class="msg">Gegevens laden…</div>';
    this.$('#legend').innerHTML = '';
    try {
      let cfg;
      if (kind === 'price') cfg = this._priceChart();
      else if (range === '24h') cfg = await this._powerChart(kind);
      else cfg = await this._energyChart(kind, range);
      if (P !== this._pop || range !== P.range) return;
      this.$('#legend').innerHTML = cfg.legend.map(([n, c]) => `<span style="--c:${c}"><i></i>${n}</span>`).join('');
      this.$('#foot').textContent = cfg.foot;
      P.draw = () => (cfg.type === 'bars' ? this._drawBars(el, cfg) : this._drawLines(el, cfg));
      P.draw();
    } catch (err) {
      if (P === this._pop) el.innerHTML = `<div class="msg">Geen gegevens beschikbaar${err && err.message ? ` (${err.message})` : ''}</div>`;
    }
  }

  async _powerChart(kind) {
    const { start } = this._rangeBounds('24h');
    const map = { solar: ['solar'], grid: ['grid'], battery: ['battery_power', 'battery_soc'], home: ['load'] }[kind];
    const ids = map.map((k) => this._ent(k)).filter(Boolean);
    const res = await this._stats(ids, start, null, '5minute', ['mean']);
    const series = (k, f = (v) => v) => {
      const id = this._ent(k), sc = this._scale(k);
      return (res[id] || []).filter((r) => r.mean != null).map((r) => [toMs(r.start) + 150e3, f(r.mean * sc)]);
    };
    const now = Date.now(), x0 = +start, L = this._live();
    let cfg;
    if (kind === 'solar') {
      const s = series('solar', (v) => Math.max(0, v)); s.push([now, L.solar]);
      const pk = s.reduce((m, p) => (p[1] > m[1] ? p : m), [0, 0]);
      this._pop.derived.peak = pk[1]; this._pop.derived.peakT = pk[0] || null;
      cfg = { series: [{ name: 'Opwek', color: C.solar, data: s }], legend: [['Opwek', C.solar]] };
    } else if (kind === 'grid') {
      const s = series('grid'); s.push([now, L.grid]);
      cfg = { series: [{ name: 'Net', color: C.import, neg: C.export, data: s, pos: 'Afname', negName: 'Teruglevering' }], legend: [['Afname', C.import], ['Teruglevering', C.export]] };
    } else if (kind === 'battery') {
      const s = series('battery_power', (v) => -this._discharge(v)); s.push([now, -L.dis]);
      const soc = series('battery_soc'); if (L.soc != null) soc.push([now, L.soc]);
      cfg = { series: [{ name: 'Batterij', color: C.battery, neg: C.batteryOut, data: s, pos: 'Laden', negName: 'Ontladen' },
        { name: 'Laadniveau', color: C.soc, data: soc, axis: 'y2', line: true }],
      y2: { min: 0, max: 100, fmt: (v) => `${v}%` }, legend: [['Laden', C.battery], ['Ontladen', C.batteryOut], ['Laadniveau', C.soc]] };
    } else {
      const s = series('load', (v) => Math.max(0, v)); s.push([now, L.load]);
      this._pop.derived.mean = s.length ? s.reduce((a, p) => a + p[1], 0) / s.length : null;
      cfg = { series: [{ name: 'Verbruik', color: C.home, data: s }], legend: [['Verbruik', C.home]] };
    }
    this._popupLive();
    return Object.assign(cfg, { type: 'lines', x0, x1: now, foot: 'Bron: Home Assistant-statistiek, gemiddelden per 5 minuten.' });
  }

  async _energyChart(kind, range) {
    const e = await this._energy(range);
    const lab = e.t.map((t) => {
      const d = new Date(t);
      if (e.period === 'month') return { s: MONTHS[d.getMonth()].slice(0, 3), l: `${cap(MONTHS[d.getMonth()])} ${d.getFullYear()}` };
      return { s: e.t.length <= 7 ? `${DAYS[d.getDay()].slice(0, 2)} ${d.getDate()}` : `${d.getDate()}`, l: `${cap(DAYS[d.getDay()])} ${d.getDate()} ${MONTHS[d.getMonth()]}` };
    });
    let series, legend;
    if (kind === 'solar') { series = [{ name: 'Opwek', color: C.solar, values: e.solar }]; legend = [['Opwek', C.solar]]; }
    else if (kind === 'grid') {
      series = [{ name: 'Afname', color: C.import, values: e.grid_import }, { name: 'Teruglevering', color: C.export, values: e.grid_export, neg: true }];
      legend = [['Afname', C.import], ['Teruglevering', C.export]];
    } else if (kind === 'battery') {
      series = [{ name: 'Geladen', color: C.battery, values: e.battery_charge }, { name: 'Ontladen', color: C.batteryOut, values: e.battery_discharge, neg: true }];
      legend = [['Geladen', C.battery], ['Ontladen', C.batteryOut]];
    } else { series = [{ name: 'Verbruik', color: C.home, values: e.home }]; legend = [['Verbruik', C.home]]; }
    return { type: 'bars', cats: lab, series, legend, highlight: lab.length - 1, unit: 'kWh', fmt: (v) => fmtKwh(v),
      foot: kind === 'home' ? 'Berekend uit het Energie-dashboard van Home Assistant: afname + opwek + ontladen − teruglevering − laden.' : 'Bron: Energie-dashboard van Home Assistant. De laatste staaf loopt nog.' };
  }

  _priceChart() {
    const fc = this._prices();
    const t0 = new Date(); t0.setHours(0, 0, 0, 0);
    const list = fc.filter((x) => x.t >= +t0);
    if (!list.length) throw new Error('geen prijsvoorspelling');
    const cur = this._curPrice(fc), curIdx = list.findIndex((x) => cur && x.t === cur.t);
    const avg = list.reduce((s, x) => s + x.v, 0) / list.length;
    return {
      type: 'bars', unit: '€/kWh', fmt: (v) => fmtEur(v, 3),
      cats: list.map((x) => { const d = new Date(x.t); const tomorrow = d.getDate() !== t0.getDate(); return { s: `${String(d.getHours()).padStart(2, '0')}`, l: `${tomorrow ? 'Morgen' : 'Vandaag'} ${fmtHM(x.t)} – ${fmtHM(x.t + 3600e3)}`, day: tomorrow ? 'morgen' : 'vandaag' }; }),
      series: [{ name: 'Prijs', values: list.map((x) => x.v), colors: list.map((x) => this._level(x, list).color) }],
      highlight: curIdx, dimBefore: curIdx, avg, axisFmt: (v) => num(v, 2), hourly: true,
      legend: [['Laag', C.low], ['Normaal', C.normal], ['Hoog', C.high]],
      foot: `Uurprijzen inclusief belastingen. Stippellijn: gemiddelde (${fmtEur(avg, 3)}).`,
    };
  }

  /* ===================== energieoverzicht ===================== */
  _openOverview() {
    this._closeAll();
    this._ov = this._ov || { kind: 'day', off: 0 };
    this._ov.open = true;
    const m = this.$('#ovm'); m.classList.add('open'); m.setAttribute('aria-hidden', 'false');
    this._armPopTimer();
    this._loadOverview();
  }

  _ovPeriod(kind, off) {
    const s = new Date(); s.setHours(0, 0, 0, 0);
    let e, n, label, bucket;
    if (kind === 'day') {
      s.setDate(s.getDate() + off); e = new Date(s); e.setDate(e.getDate() + 1); n = 24; bucket = 'hour';
      label = off === 0 ? 'Vandaag' : off === -1 ? 'Gisteren' : `${cap(DAYS[s.getDay()])} ${s.getDate()} ${MONTHS[s.getMonth()]}`;
    } else if (kind === 'week') {
      s.setDate(s.getDate() - ((s.getDay() + 6) % 7) + off * 7); e = new Date(s); e.setDate(e.getDate() + 7); n = 7; bucket = 'day';
      const l = new Date(e); l.setDate(l.getDate() - 1);
      const th = new Date(s); th.setDate(th.getDate() + 3); const y0 = new Date(th.getFullYear(), 0, 1);
      const wk = 1 + Math.round(((th - y0) / 864e5 - 3 + ((y0.getDay() + 6) % 7)) / 7);
      label = `Week ${wk} · ${s.getDate()} ${MONTHS[s.getMonth()].slice(0, 3)} – ${l.getDate()} ${MONTHS[l.getMonth()].slice(0, 3)}`;
    } else if (kind === 'month') {
      s.setDate(1); s.setMonth(s.getMonth() + off); e = new Date(s); e.setMonth(e.getMonth() + 1); n = Math.round((e - s) / 864e5); bucket = 'day';
      label = `${cap(MONTHS[s.getMonth()])} ${s.getFullYear()}`;
    } else {
      s.setMonth(0, 1); s.setFullYear(s.getFullYear() + off); e = new Date(s); e.setFullYear(e.getFullYear() + 1); n = 12; bucket = 'month';
      label = `${s.getFullYear()}`;
    }
    return { s, e, n, bucket, label };
  }

  _bucketStarts(p) {
    const out = [], d = new Date(p.s);
    for (let i = 0; i < p.n; i++) {
      out.push(+d);
      if (p.bucket === 'hour') d.setHours(d.getHours() + 1); else if (p.bucket === 'day') d.setDate(d.getDate() + 1); else d.setMonth(d.getMonth() + 1);
    }
    return out;
  }

  // Alle energie- en kostencijfers voor een periode, per uur berekend.
  async _overviewData(kind, off) {
    const p = this._ovPeriod(kind, off);
    const ids = await this._statIds();
    const now = Date.now();
    const end = Math.min(+p.e, now);
    const keys = ['grid_import', 'grid_export', 'grid_import_cost', 'grid_export_compensation', 'solar', 'battery_charge', 'battery_discharge'];
    const all = [...new Set(keys.flatMap((k) => ids[k]))];
    const priceId = this._ent('grid_price');
    const hours = new Map();
    const add = (res, t0) => keys.forEach((k) => ids[k].forEach((id) => (res[id] || []).forEach((r) => {
      if (r.change == null) return;
      const t = t0 != null ? t0 : toMs(r.start);
      const h = hours.get(t) || {}; h[k] = (h[k] || 0) + r.change; hours.set(t, h);
    })));
    if (end > +p.s) {
      const [res, pr] = await Promise.all([
        this._stats(all, p.s, end, 'hour', ['change']),
        priceId ? this._stats([priceId], p.s, end, 'hour', ['mean']) : Promise.resolve({}),
      ]);
      add(res);
      (pr[priceId] || []).forEach((r) => { if (r.mean == null) return; const t = toMs(r.start); const h = hours.get(t) || {}; h.price = r.mean; hours.set(t, h); });
      // lopend uur: uit de 5-minutenstatistiek
      const hs = new Date(now); hs.setMinutes(0, 0, 0);
      if (+hs >= +p.s && +hs < +p.e) {
        const r5 = await this._stats(all, +hs, null, '5minute', ['change']);
        add(r5, +hs);
        const h = hours.get(+hs); if (h && h.price == null && this._num('grid_price') != null) h.price = this._num('grid_price');
      }
    }
    // prijs per uur; ontbreekt die, dan afleiden uit de kostensensor (zelfde prijs die HA gebruikte)
    let lastP = null;
    const T = { imp: 0, exp: 0, sol: 0, chg: 0, dis: 0, home: 0, impC: 0, expC: 0, solV: 0, batV: 0, gaps: 0, g2h: 0, s2h: 0, b2h: 0, g2hV: 0, s2hV: 0, b2hV: 0, g2b: 0 };
    const starts = this._bucketStarts(p);
    const B = starts.map(() => ({ imp: 0, exp: 0, impC: 0, expC: 0, solV: 0, batV: 0, sol: 0, home: 0 }));
    const bIdx = (t) => { for (let i = starts.length - 1; i >= 0; i--) if (t >= starts[i]) return i; return -1; };
    [...hours.keys()].sort((a, b) => a - b).forEach((t) => {
      const h = hours.get(t);
      const imp = h.grid_import || 0, exp = h.grid_export || 0, sol = h.solar || 0, chg = h.battery_charge || 0, dis = h.battery_discharge || 0;
      let pr = h.price;
      if (pr == null && imp > 0.05 && h.grid_import_cost != null) pr = h.grid_import_cost / imp;
      if (pr == null && exp > 0.05 && h.grid_export_compensation != null) pr = h.grid_export_compensation / exp;
      if (pr == null) pr = lastP;
      if (pr != null) lastP = pr;
      const impC = h.grid_import_cost != null ? h.grid_import_cost : imp * (pr || 0);
      const expC = h.grid_export_compensation != null ? h.grid_export_compensation : exp * (pr || 0);
      const home = imp + sol + dis - exp - chg; // niet afkappen: dan blijft de energiebalans exact
      if (home < -0.3) T.gaps++;
      const solV = sol * (pr || 0), batV = (dis - chg) * (pr || 0);
      // waar kwam het huisverbruik van dit uur vandaan? eerst eigen zon, dan batterij, de rest van het net
      const hp = Math.max(home, 0), s2h = Math.min(hp, sol), b2h = Math.min(dis, hp - s2h), g2h = hp - s2h - b2h;
      const g2b = Math.max(0, chg - Math.max(0, sol - s2h)); // deel van het laden dat niet uit overtollige zon kwam
      const P = pr || 0;
      Object.entries({ imp, exp, sol, chg, dis, home, impC, expC, solV, batV, s2h, b2h, g2h, g2b, s2hV: s2h * P, b2hV: b2h * P, g2hV: g2h * P }).forEach(([k, v]) => (T[k] += v));
      const i = bIdx(t); if (i >= 0) { const b = B[i]; b.imp += imp; b.exp += exp; b.impC += impC; b.expC += expC; b.solV += solV; b.batV += batV; b.sol += sol; b.home += home; }
    });
    T.net = T.impC - T.expC;
    T.homeC = T.net + T.solV + T.batV; // sluit exact: netto = huis − zon − batterij
    T.pp = this._powerplay(kind, off, p);
    return { p, T, B, starts, has: hours.size > 0 };
  }

  // Zonneplan Powerplay-resultaat voor de periode (ter informatie)
  _powerplay(kind, off, p) {
    const pp = this._cfg.powerplay || {};
    const st = this._hass.states;
    const id = (k, def) => pp[k] || (st[def] ? def : null);
    const today = id('today', 'sensor.thuisbatterij_vandaag'), month = id('month', 'sensor.thuisbatterij_opbrengst_deze_maand');
    const prev = id('prev_month', 'sensor.thuisbatterij_opbrengst_vorige_maand'), year = id('year', 'sensor.thuisbatterij_opbrengst_dit_jaar');
    if (!today && !month && !year) return null;
    const days = {};
    [prev, month].forEach((m) => { const d = m && st[m] && st[m].attributes.days; if (d) Object.assign(days, d); });
    const todayKey = ymd(new Date());
    const dayVal = (key) => (key === todayKey && today ? this._numId(today) : days[key] && typeof days[key].result === 'number' ? days[key].result : null);
    if (kind === 'day') return dayVal(ymd(p.s));
    if (kind === 'week') {
      let t = 0, any = false; const d = new Date(p.s);
      for (let i = 0; i < 7; i++) { const v = dayVal(ymd(d)); if (v != null) { t += v; any = true; } d.setDate(d.getDate() + 1); }
      return any ? t : null;
    }
    if (kind === 'month') return off === 0 && month ? this._numId(month) : off === -1 && prev ? this._numId(prev) : null;
    if (kind === 'year') {
      if (off !== 0 || !year) return null;
      return this._numId(year);
    }
    return null;
  }

  async _todayChip() {
    if (!this._hass || !this._hass.callWS) return;
    try {
      const { T, has } = await this._overviewData('day', 0);
      if (!has) return;
      const tot = T.net - (T.pp || 0); // zelfde totaal als in het overzicht: na Powerplay
      this._setF('overview-v', fmtEur(Math.abs(tot)));
      this.$$('[data-f="overview-v"]').forEach((el) => { el.style.color = Math.abs(tot) < 0.005 ? '' : tot > 0 ? C.import : C.export; }); // kosten rood, winst groen
      this._setF('overview-s', `${tot >= 0 ? 'Kosten' : 'Opbrengst'} vandaag · tik voor details`);
    } catch (e) { /* chip blijft neutraal */ }
  }

  async _loadOverview() {
    const O = this._ov; if (!O) return;
    const { kind, off } = O;
    this.$$('#ov-seg button').forEach((b) => b.setAttribute('aria-pressed', b.dataset.k === kind));
    this.$('#ov-next').disabled = off >= 0;
    const p = this._ovPeriod(kind, off);
    this.$('#ov-sub').textContent = p.label;
    const body = this.$('#ov-body');
    body.innerHTML = `<div class="ov-msg">Gegevens laden…${kind === 'year' ? ' (een jaar per uur kan even duren)' : ''}</div>`;
    O.draw = null;
    let data;
    try { data = await this._overviewData(kind, off); } catch (e) { body.innerHTML = `<div class="ov-msg">Geen gegevens beschikbaar (${e.message || e})</div>`; return; }
    if (O.kind !== kind || O.off !== off || !O.open) return;
    if (!data.has) { body.innerHTML = '<div class="ov-msg">Geen gegevens voor deze periode</div>'; return; }
    const { T, B, starts } = data;

    const unit = kind === 'day' ? 'uur' : kind === 'year' ? 'maand' : 'dag';
    const own = T.s2h + T.b2h, ownV = T.s2hV + T.b2hV, tot = T.g2h + own || 1;
    const pct = (v) => `${num((v / tot) * 100, 0)}%`;
    const stored = T.chg - T.dis;
    const final = T.pp != null ? T.net - T.pp : T.net;
    const tile = (label, color, value, unitTxt, hint) => `<div class="t" style="--c:${color}"><div class="l"><i></i>${label}</div>
      <div class="v">${value}<small>${unitTxt}</small></div><div class="h">${hint}</div></div>`;
    const srcRow = (name, color, kwh, eur, hint = '', eurColor = '') => `<div class="src-row" style="--c:${color}"><i></i><span class="n">${name}${hint ? `<small>${hint}</small>` : ''}</span>
      <span class="k">${num(kwh, 1)}<small> kWh</small></span><span class="p">${pct(kwh)}</span><span class="e"${eurColor ? ` style="color:${eurColor}"` : ''}>${fmtEur(eur)}</span></div>`;
    const costRow = (name, hint, amount, cls = '', color = '') => `<div class="cost-row ${cls}"><span class="n">${name}${hint ? `<small>${hint}</small>` : ''}</span><span class="a"${color ? ` style="color:${color}"` : ''}>${amount}</span></div>`;
    const money = (v) => (Math.abs(v) < 0.005 ? 'var(--text)' : v > 0 ? C.import : C.export); // kosten rood, winst groen
    const notes = [];
    if (Math.abs(stored) > 1) notes.push(stored > 0 ? `De batterij heeft in deze periode ${fmtKwh(stored)} meer geladen dan ontladen. Die energie zit nog in de batterij en levert pas later iets op.` : `De batterij heeft ${fmtKwh(-stored)} meer ontladen dan geladen; dat kwam uit een eerdere lading.`);
    if (T.gaps > 2) notes.push(`In ${T.gaps} uur ontbreken metingen, dus de verdeling over net, zon en batterij is in die uren onzeker. De netto kosten blijven exact.`);
    if (T.pp != null) notes.push('Powerplay is Zonneplans eigen berekening van de batterijhandel. Of dit bovenop je P1-rekening wordt uitbetaald, hangt af van je contract.');

    body.innerHTML = `
      <div class="ovt">
        ${tile('Verbruik huis', C.home, num(T.home, 1), ' kWh', `Totaal ${p.label.toLowerCase()}`)}
        ${tile('Van het net', C.import, num(T.g2h, 1), ' kWh', `${pct(T.g2h)} van het verbruik · <span style="color:${C.import}">${fmtEur(T.g2hV)}</span>`)}
        ${tile('Eigen stroom', C.solar, num(own, 1), ' kWh', `${pct(own)} van het verbruik · <span style="color:${C.export}">${fmtEur(ownV)} bespaard</span>`)}
        ${tile('Netto kosten', final >= 0 ? C.import : C.export, `<span style="color:${money(final)}">${fmtEur(final).replace('€ ', '<span class="cur">€</span> ')}</span>`, '', T.pp != null ? `${final >= 0 ? 'betaald' : 'verdiend'} na Powerplay · P1-meter ${fmtEur(T.net)}` : `${final >= 0 ? 'betaald' : 'verdiend'} aan het net`)}
      </div>
      <div class="ov-col">
        <h3>Waar kwam het verbruik vandaan?</h3>
        <div class="stack">${[[T.g2h, C.import], [T.s2h, C.solar], [T.b2h, C.battery]].map(([v, c]) => (v > 0 ? `<i style="--c:${c};flex:${v}"></i>` : '')).join('')}</div>
        <div class="src-head"><span></span><span></span><span class="k">Energie</span><span class="p">Aandeel</span><span class="e">Waarde</span></div>
        ${srcRow('Van het net', C.import, T.g2h, T.g2hV, '', C.import)}
        ${srcRow('Zonnepanelen', C.solar, T.s2h, T.s2hV, `direct verbruikt van ${fmtKwh(T.sol)} opgewekt`, C.export)}
        ${srcRow('Thuisbatterij', C.battery, T.b2h, T.b2hV, `${fmtKwh(T.chg)} geladen · ${fmtKwh(T.dis)} ontladen`, C.export)}
        <div class="src-row total"><i></i><span class="n">Totaal verbruik</span><span class="k">${num(T.g2h + own, 1)}<small> kWh</small></span><span class="p">100%</span><span class="e">${fmtEur(T.g2hV + ownV)}</span></div>

      </div>
      <div class="ov-col">
        <h3>Kosten</h3>
        ${costRow('Ingekocht van het net', `${fmtKwh(T.imp)}${T.g2b > 0.5 ? ` · waarvan ${fmtKwh(T.g2b)} voor de batterij` : ''}`, fmtEur(T.impC), '', C.import)}
        ${costRow('Teruggeleverd aan het net', fmtKwh(T.exp), fmtEurS(-T.expC), '', C.export)}
        ${costRow('Netto stroomkosten', 'volgens je P1-meter', fmtEur(T.net), 'total', money(T.net))}
        ${T.pp != null ? costRow('Powerplay (Zonneplan)', 'resultaat batterijhandel', fmtEurS(-T.pp), '', T.pp >= 0 ? C.export : C.import) + costRow('Totaal na Powerplay', '', fmtEur(final), 'total', money(final)) : ''}

      </div>
      <div class="ov-col ov-wide"><h3>Netto kosten per ${unit}</h3><div class="ov-chart" id="ov-chart"></div></div>`;

    const cats = starts.map((t) => {
      const d = new Date(t);
      if (kind === 'day') return { s: String(d.getHours()).padStart(2, '0'), l: `${fmtHM(t)} – ${fmtHM(t + 3600e3)}` };
      if (kind === 'year') return { s: MONTHS[d.getMonth()].slice(0, 3), l: `${cap(MONTHS[d.getMonth()])} ${d.getFullYear()}` };
      return { s: kind === 'week' ? `${DAYS[d.getDay()].slice(0, 2)} ${d.getDate()}` : `${d.getDate()}`, l: `${cap(DAYS[d.getDay()])} ${d.getDate()} ${MONTHS[d.getMonth()]}` };
    });
    const net = B.map((b, i) => (starts[i] > Date.now() || (b.imp === 0 && b.exp === 0) ? null : b.impC - b.expC));
    const cfg = {
      type: 'bars', unit: '€', cats, axisFmt: (v) => num(v, Math.abs(v) < 10 && v % 1 ? 1 : 0), hourly: false,
      series: [{ name: 'Netto', values: net, colors: net.map((v) => (v != null && v < 0 ? C.export : C.import)) }],
      tip: (i) => {
        const b = B[i]; if (net[i] == null) return '<div class="r">Geen gegevens</div>';
        return `<div class="r" style="--c:${C.import}"><i></i>Afname ${fmtKwh(b.imp)}<span>${fmtEur(b.impC)}</span></div>
          <div class="r" style="--c:${C.export}"><i></i>Teruglevering ${fmtKwh(b.exp)}<span>${fmtEurS(-b.expC)}</span></div>
          <div class="r" style="--c:${C.solar}"><i></i>Zon (toegerekend)<span>${fmtEurS(-b.solV)}</span></div>
          <div class="r" style="--c:${C.battery}"><i></i>Batterij (toegerekend)<span>${fmtEurS(-b.batV)}</span></div>
          <div class="r sum">Netto<span>${fmtEur(net[i])}</span></div>`;
      },
    };
    O.draw = () => this._drawBars(this.$('#ov-chart'), cfg);
    O.draw();
  }

  /* ----- tekenen: lijn/vlak ----- */
  _drawLines(el, cfg) {
    const W = el.clientWidth, H = el.clientHeight; if (!W || !H) return;
    const uid = `c${++chartUid}`, hasY2 = !!cfg.y2;
    const pad = { l: 56, r: hasY2 ? 46 : 14, t: 12, b: 28 };
    const iw = W - pad.l - pad.r, ih = H - pad.t - pad.b;
    const ys = cfg.series.filter((s) => s.axis !== 'y2');
    let mn = 0, mx = 0;
    ys.forEach((s) => s.data.forEach(([, v]) => { mn = Math.min(mn, v); mx = Math.max(mx, v); }));
    if (mx - mn < 100) mx = mn + 100;
    const kw = Math.max(Math.abs(mn), Math.abs(mx)) >= 1000;
    const tk = niceTicks(mn, mx, 4);
    const X = (t) => pad.l + ((t - cfg.x0) / (cfg.x1 - cfg.x0)) * iw;
    const Y = (v) => pad.t + (1 - (v - tk.lo) / (tk.hi - tk.lo)) * ih;
    const Y2 = (v) => pad.t + (1 - (v - cfg.y2.min) / (cfg.y2.max - cfg.y2.min)) * ih;
    const fmtAx = (v) => { v = Math.abs(v); return kw ? `${num(v / 1000, Math.abs(tk.ticks[1] - tk.ticks[0]) < 1000 ? 1 : 0)} kW` : `${num(v, 0)} W`; };
    let g = '';
    tk.ticks.forEach((v) => {
      g += `<line x1="${pad.l}" x2="${W - pad.r}" y1="${Y(v)}" y2="${Y(v)}" stroke="rgba(255,255,255,${v === 0 ? 0.22 : 0.06})"/>`;
      g += `<text class="ax" x="${pad.l - 10}" y="${Y(v) + 4}" text-anchor="end">${fmtAx(v)}</text>`;
    });
    if (hasY2) [0, 50, 100].forEach((v) => (g += `<text class="ax" x="${W - pad.r + 10}" y="${Y2(v) + 4}">${cfg.y2.fmt(v)}</text>`));
    const h0 = new Date(cfg.x0); h0.setMinutes(0, 0, 0);
    for (let t = +h0 + 3600e3; t < cfg.x1; t += 3600e3) {
      const d = new Date(t); if (d.getHours() % (iw < 520 ? 6 : 3)) continue;
      g += `<line x1="${X(t)}" x2="${X(t)}" y1="${pad.t}" y2="${pad.t + ih}" stroke="rgba(255,255,255,.04)"/>`;
      g += `<text class="ax" x="${X(t)}" y="${H - 8}" text-anchor="middle">${String(d.getHours()).padStart(2, '0')}:00</text>`;
    }
    const y0 = Y(0);
    let defs = `<clipPath id="${uid}p"><rect x="0" y="0" width="${W}" height="${y0}"/></clipPath><clipPath id="${uid}n"><rect x="0" y="${y0}" width="${W}" height="${H}"/></clipPath>`;
    let body = '';
    cfg.series.forEach((s, si) => {
      if (!s.data.length) return;
      const yf = s.axis === 'y2' ? Y2 : Y;
      const line = s.data.map(([t, v], i) => `${i ? 'L' : 'M'}${X(t).toFixed(1)} ${yf(v).toFixed(1)}`).join('');
      if (s.line) { body += `<path d="${line}" fill="none" stroke="${s.color}" stroke-width="1.5" stroke-dasharray="4 3" opacity=".85"/>`; return; }
      const area = `${line}L${X(s.data[s.data.length - 1][0]).toFixed(1)} ${y0}L${X(s.data[0][0]).toFixed(1)} ${y0}Z`;
      const parts = s.neg ? [[s.color, `${uid}p`], [s.neg, `${uid}n`]] : [[s.color, null]];
      parts.forEach(([col, clip], pi) => {
        const gid = `${uid}g${si}${pi}`, upw = pi === 0;
        defs += `<linearGradient id="${gid}" x1="0" y1="${upw ? 0 : 1}" x2="0" y2="${upw ? 1 : 0}"><stop offset="0" stop-color="${col}" stop-opacity=".32"/><stop offset="1" stop-color="${col}" stop-opacity=".02"/></linearGradient>`;
        const cp = clip ? ` clip-path="url(#${clip})"` : '';
        body += `<path d="${area}" fill="url(#${gid})"${cp}/><path d="${line}" fill="none" stroke="${col}" stroke-width="1.75" stroke-linejoin="round"${cp}/>`;
      });
    });
    el.innerHTML = `<svg viewBox="0 0 ${W} ${H}"><defs>${defs}</defs>${g}${body}
      <line class="xh" x1="0" x2="0" y1="${pad.t}" y2="${pad.t + ih}" stroke="rgba(255,255,255,.35)" opacity="0"/><g class="dots"></g>
      <rect class="ov" x="${pad.l}" y="${pad.t}" width="${iw}" height="${ih}" fill="transparent"/></svg><div class="tip"></div>`;
    const tip = el.querySelector('.tip'), xh = el.querySelector('.xh'), dots = el.querySelector('.dots');
    const near = (data, t) => { let lo = 0, hi = data.length - 1; while (hi - lo > 1) { const m = (lo + hi) >> 1; if (data[m][0] < t) lo = m; else hi = m; } return Math.abs(data[lo][0] - t) < Math.abs(data[hi][0] - t) ? data[lo] : data[hi]; };
    const move = (ev) => {
      const r = el.getBoundingClientRect(), px = clamp(ev.clientX - r.left, pad.l, pad.l + iw);
      const t = cfg.x0 + ((px - pad.l) / iw) * (cfg.x1 - cfg.x0);
      let rows = '', dd = '', tt = null;
      cfg.series.forEach((s) => {
        if (!s.data.length) return;
        const pnt = near(s.data, t); tt = tt || pnt[0];
        const yf = s.axis === 'y2' ? Y2 : Y, neg = s.neg && pnt[1] < 0, col = neg ? s.neg : s.color;
        const name = s.pos ? (Math.abs(pnt[1]) < 25 ? 'Stand-by' : neg ? s.negName : s.pos) : s.name;
        const val = s.axis === 'y2' ? fmtPct(pnt[1]) : (() => { const f = fmtPower(pnt[1]); return `${f.v} ${f.u}`; })();
        rows += `<div class="r" style="--c:${col}"><i></i>${name}<span>${val}</span></div>`;
        dd += `<circle cx="${X(pnt[0])}" cy="${yf(pnt[1])}" r="3.5" fill="${col}" stroke="#0F131A" stroke-width="2"/>`;
      });
      xh.setAttribute('x1', X(tt)); xh.setAttribute('x2', X(tt)); xh.setAttribute('opacity', '1');
      dots.innerHTML = dd;
      tip.innerHTML = `<b>${fmtHM(tt)}</b>${rows}`;
      const tw = tip.offsetWidth, left = X(tt) + 14 + tw > W ? X(tt) - 14 - tw : X(tt) + 14;
      tip.style.transform = `translate(${left}px, ${pad.t + 6}px)`; tip.style.opacity = '1';
    };
    const leave = () => { tip.style.opacity = '0'; xh.setAttribute('opacity', '0'); dots.innerHTML = ''; };
    const ov = el.querySelector('.ov');
    ov.addEventListener('pointermove', move); ov.addEventListener('pointerdown', move); ov.addEventListener('pointerleave', leave);
  }

  /* ----- tekenen: staven ----- */
  _drawBars(el, cfg) {
    if (!el) return;
    const W = el.clientWidth, H = el.clientHeight; if (!W || !H) return;
    const n = cfg.cats.length;
    const pad = { l: 52, r: 10, t: 24, b: cfg.hourly ? 40 : 28 };
    const iw = W - pad.l - pad.r, ih = H - pad.t - pad.b;
    let mx = 0, mn = 0;
    for (let i = 0; i < n; i++) {
      let up = 0, dn = 0;
      cfg.series.forEach((s) => { const v = s.values[i] || 0; if (s.neg) dn -= v; else if (v >= 0) up += v; else dn += v; });
      mx = Math.max(mx, up); mn = Math.min(mn, dn);
    }
    if (mx - mn <= 0) mx = 1;
    const tk = niceTicks(mn, mx, 4);
    const Y = (v) => pad.t + (1 - (v - tk.lo) / (tk.hi - tk.lo)) * ih;
    const band = iw / n, bw = Math.min(32, band * (n > 40 ? 0.7 : 0.62));
    const axf = cfg.axisFmt || ((v) => num(Math.abs(v), Math.abs(tk.ticks[1] - tk.ticks[0]) < 1 ? 1 : 0));
    let g = '';
    tk.ticks.forEach((v) => {
      g += `<line x1="${pad.l}" x2="${W - pad.r}" y1="${Y(v)}" y2="${Y(v)}" stroke="rgba(255,255,255,${v === 0 ? 0.22 : 0.06})"/>`;
      g += `<text class="ax" x="${pad.l - 10}" y="${Y(v) + 4}" text-anchor="end">${axf(v)}</text>`;
    });
    g += `<text class="ax" x="${pad.l - 10}" y="11" text-anchor="end">${cfg.unit}</text>`;
    const every = n > 24 ? (cfg.hourly ? 3 : 5) : n > 14 ? 2 : 1;
    let body = '';
    for (let i = 0; i < n; i++) {
      const cx = pad.l + band * (i + 0.5);
      let up = 0, dn = 0;
      const dim = cfg.dimBefore != null && cfg.dimBefore >= 0 && i < cfg.dimBefore;
      cfg.series.forEach((s) => {
        const raw = s.values[i]; if (raw == null) return;
        const v = s.neg ? -raw : raw, col = s.colors ? s.colors[i] : s.color;
        const a = v >= 0 ? up : dn, b = a + v;
        if (v >= 0) up = b; else dn = b;
        const y1 = Y(Math.max(a, b)), y2 = Y(Math.min(a, b)), h = Math.max(1, y2 - y1);
        body += `<rect x="${(cx - bw / 2).toFixed(1)}" y="${y1.toFixed(1)}" width="${bw.toFixed(1)}" height="${h.toFixed(1)}" rx="${Math.min(3, bw / 4).toFixed(1)}" fill="${col}" opacity="${dim ? 0.35 : i === cfg.highlight || cfg.highlight == null ? 1 : 0.82}"/>`;
      });
      if (i % every === 0) g += `<text class="ax" x="${cx}" y="${pad.t + ih + 16}" text-anchor="middle">${cfg.cats[i].s}</text>`;
      if (cfg.hourly && (i === 0 || cfg.cats[i].day !== cfg.cats[i - 1].day)) {
        g += `<text class="ax" x="${cx - band / 2 + 2}" y="${pad.t + ih + 32}" style="font-weight:600">${cfg.cats[i].day}</text>`;
        if (i) g += `<line x1="${cx - band / 2}" x2="${cx - band / 2}" y1="${pad.t}" y2="${pad.t + ih + 22}" stroke="rgba(255,255,255,.12)"/>`;
      }
    }
    if (cfg.highlight != null && cfg.highlight >= 0 && cfg.hourly) {
      const cx = pad.l + band * (cfg.highlight + 0.5);
      body += `<text class="ax" x="${cx}" y="${pad.t - 6}" text-anchor="middle" style="fill:var(--text);font-weight:600">nu</text>`;
    }
    if (cfg.avg != null) body += `<line x1="${pad.l}" x2="${W - pad.r}" y1="${Y(cfg.avg)}" y2="${Y(cfg.avg)}" stroke="rgba(255,255,255,.45)" stroke-dasharray="4 4"/>`;
    el.innerHTML = `<svg viewBox="0 0 ${W} ${H}">${g}<rect class="hl" x="0" y="${pad.t}" width="${band}" height="${ih}" fill="rgba(255,255,255,.05)" opacity="0"/>${body}
      <rect class="ov" x="${pad.l}" y="${pad.t}" width="${iw}" height="${ih}" fill="transparent"/></svg><div class="tip"></div>`;
    const tip = el.querySelector('.tip'), hl = el.querySelector('.hl');
    const move = (ev) => {
      const r = el.getBoundingClientRect(), i = clamp(Math.floor((ev.clientX - r.left - pad.l) / band), 0, n - 1);
      hl.setAttribute('x', pad.l + band * i); hl.setAttribute('opacity', '1');
      const rows = cfg.tip ? cfg.tip(i) : cfg.series.map((s) => `<div class="r" style="--c:${s.colors ? s.colors[i] : s.color}"><i></i>${s.name}<span>${s.values[i] == null ? '–' : cfg.fmt(s.values[i])}</span></div>`).join('');
      tip.innerHTML = `<b>${cfg.cats[i].l}</b>${rows}`;
      const cx = pad.l + band * (i + 0.5), tw = tip.offsetWidth, left = cx + band / 2 + 8 + tw > W ? cx - band / 2 - 8 - tw : cx + band / 2 + 8;
      tip.style.transform = `translate(${Math.max(0, left)}px, ${pad.t + 6}px)`; tip.style.opacity = '1';
    };
    const leave = () => { tip.style.opacity = '0'; hl.setAttribute('opacity', '0'); };
    const ov = el.querySelector('.ov');
    ov.addEventListener('pointermove', move); ov.addEventListener('pointerdown', move); ov.addEventListener('pointerleave', leave);
  }
}

if (!customElements.get('claude-energy-scene')) customElements.define('claude-energy-scene', ClaudeEnergyScene);
window.customCards = window.customCards || [];
if (!window.customCards.find((c) => c.type === 'claude-energy-scene')) {
  window.customCards.push({ type: 'claude-energy-scene', name: 'Claude Energy Scene', description: 'Energie-screensaver met live scène, popups en energieoverzicht' });
}
console.info(`%c CLAUDE-ENERGY-SCENE %c ${VERSION} `, 'background:#5B9DF5;color:#fff;border-radius:3px 0 0 3px', 'background:#1A1F28;color:#fff;border-radius:0 3px 3px 0');
