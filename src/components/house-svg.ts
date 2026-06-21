import { svg, TemplateResult } from 'lit';
import { BRICK_TEXTURE_BASE64 } from './brick-texture-base64';

// Color tokens for active states
const COLORS = {
  solar:   { stroke: '#10b981', glow: 'rgba(16,185,129,0.5)' },
  battery: { stroke: '#10b981', glow: 'rgba(16,185,129,0.5)' },
  batteryD:{ stroke: '#ef4444', glow: 'rgba(239,68,68,0.5)' },
  gridI:   { stroke: '#06b6d4', glow: 'rgba(6,182,212,0.5)' },
  gridE:   { stroke: '#22c55e', glow: 'rgba(34,197,94,0.5)' },
  ev:      { stroke: '#a855f7', glow: 'rgba(168,85,247,0.5)' },
  home:    { stroke: '#e2e8f0', glow: 'rgba(226,232,240,0.3)' },
};

const WEATHER_TRANSLATIONS: Record<string, string> = {
  'sunny': 'Zonnig',
  'clear-night': 'Heldere nacht',
  'cloudy': 'Bewolkt',
  'fog': 'Mistig',
  'hail': 'Hagel',
  'lightning': 'Onweer',
  'lightning-rainy': 'Onweer met regen',
  'partlycloudy': 'Licht bewolkt',
  'pouring': 'Stortregen',
  'rainy': 'Regen',
  'snowy': 'Sneeuw',
  'snowy-rainy': 'Natte sneeuw',
  'windy': 'Winderig',
  'windy-variant': 'Winderig',
  'exceptional': 'Uitzonderlijk'
};

// Continuous Sky Interpolation Keyframes
interface SkyKeyframe {
  hour: number;
  top: string;
  horizon: string;
  stars: number;
  lights: number;
  clouds: string;
}

const SKY_KEYFRAMES: SkyKeyframe[] = [
  { hour: 0,    top: '#020617', horizon: '#0f172a', stars: 0.8, lights: 1.0, clouds: 'rgba(255, 255, 255, 0.08)' },
  { hour: 4.5,  top: '#020617', horizon: '#0f172a', stars: 0.8, lights: 1.0, clouds: 'rgba(255, 255, 255, 0.08)' },
  { hour: 6.0,  top: '#1e1b4b', horizon: '#fdba74', stars: 0.2, lights: 0.3, clouds: 'rgba(255, 255, 255, 0.35)' },
  { hour: 8.0,  top: '#0ea5e9', horizon: '#bae6fd', stars: 0.0, lights: 0.0, clouds: 'rgba(255, 255, 255, 0.65)' },
  { hour: 17.0, top: '#0284c7', horizon: '#bae6fd', stars: 0.0, lights: 0.0, clouds: 'rgba(255, 255, 255, 0.65)' },
  { hour: 19.5, top: '#3b0764', horizon: '#f97316', stars: 0.0, lights: 0.5, clouds: 'rgba(255, 255, 255, 0.45)' },
  { hour: 21.0, top: '#18113c', horizon: '#ea580c', stars: 0.1, lights: 1.0, clouds: 'rgba(255, 255, 255, 0.18)' },
  { hour: 22.5, top: '#020617', horizon: '#1e293b', stars: 0.6, lights: 1.0, clouds: 'rgba(255, 255, 255, 0.08)' },
  { hour: 24,   top: '#020617', horizon: '#0f172a', stars: 0.8, lights: 1.0, clouds: 'rgba(255, 255, 255, 0.08)' }
];

function parseHex(hex: string) {
  const c = hex.replace('#', '');
  const r = parseInt(c.substring(0, 2), 16);
  const g = parseInt(c.substring(2, 4), 16);
  const b = parseInt(c.substring(4, 6), 16);
  return { r, g, b };
}

function toHex(r: number, g: number, b: number) {
  const toHexStr = (n: number) => {
    const s = Math.max(0, Math.min(255, Math.round(n))).toString(16);
    return s.length === 1 ? '0' + s : s;
  };
  return `#${toHexStr(r)}${toHexStr(g)}${toHexStr(b)}`;
}

function interpolateColor(color1: string, color2: string, factor: number): string {
  if (color1.startsWith('rgba') || color2.startsWith('rgba')) {
    const getAlpha = (rgba: string) => {
      const match = rgba.match(/[\d.]+\)$/);
      return match ? parseFloat(match[0]) : 1.0;
    };
    const a1 = getAlpha(color1);
    const a2 = getAlpha(color2);
    const a = a1 + (a2 - a1) * factor;
    return `rgba(255, 255, 255, ${a})`;
  }
  const c1 = parseHex(color1);
  const c2 = parseHex(color2);
  const r = c1.r + (c2.r - c1.r) * factor;
  const g = c1.g + (c2.g - c1.g) * factor;
  const b = c1.b + (c2.b - c1.b) * factor;
  return toHex(r, g, b);
}

export function getSkyState(hour: number) {
  let lower = SKY_KEYFRAMES[0];
  let upper = SKY_KEYFRAMES[SKY_KEYFRAMES.length - 1];
  for (let i = 0; i < SKY_KEYFRAMES.length - 1; i++) {
    if (hour >= SKY_KEYFRAMES[i].hour && hour <= SKY_KEYFRAMES[i+1].hour) {
      lower = SKY_KEYFRAMES[i];
      upper = SKY_KEYFRAMES[i+1];
      break;
    }
  }
  const range = upper.hour - lower.hour;
  const factor = range === 0 ? 0 : (hour - lower.hour) / range;
  return {
    top: interpolateColor(lower.top, upper.top, factor),
    horizon: interpolateColor(lower.horizon, upper.horizon, factor),
    stars: lower.stars + (upper.stars - lower.stars) * factor,
    lights: lower.lights + (upper.lights - lower.lights) * factor,
    clouds: interpolateColor(lower.clouds, upper.clouds, factor)
  };
}

function getFlowSpeed(watts: number): number {
  const abs = Math.abs(watts);
  if (abs < 20) return 0;
  if (abs < 1000) return 16.0;
  return 6.0;
}

function formatPowerAbs(watts: number): string {
  const abs = Math.abs(watts);
  if (abs >= 1000) return `${(abs / 1000).toFixed(1)} kW`;
  return `${Math.round(abs)} W`;
}

function renderHDCloud(className: string, x: number, y: number, scale = 1, color = '#ffffff', opacity = 0.9, style = ''): TemplateResult {
  return svg`
    <g transform="translate(${x}, ${y}) scale(${scale})" opacity="${opacity}" style="transition: opacity 1.5s ease;">
      <g class="${className}" style="${style}">
        <path d="M 20,40 Q 10,25 25,15 Q 40,5 60,15 Q 80,0 100,15 Q 120,5 130,25 Q 140,40 120,45 Q 100,50 60,45 Q 20,50 20,40 Z" fill="rgba(15, 23, 42, 0.15)" transform="translate(0, 4) scale(1.02)" />
        <path d="M 20,40 Q 10,25 25,15 Q 40,5 60,15 Q 80,0 100,15 Q 120,5 130,25 Q 140,40 120,45 Q 100,50 60,45 Q 20,50 20,40 Z" fill="${color}" style="transition: fill 1.5s ease;" />
      </g>
    </g>
  `;
}

function renderRain(width: number, intensity: 'light' | 'normal' | 'heavy' = 'normal'): TemplateResult {
  let spacing = 18;
  let baseDuration = 0.9;
  if (intensity === 'light') {
    spacing = 36;
    baseDuration = 1.3;
  } else if (intensity === 'heavy') {
    spacing = 9;
    baseDuration = 0.55;
  }
  const count = Math.ceil(width / spacing);
  return svg`
    <g style="pointer-events: none;">
      ${Array.from({ length: count }).map((_, i) => svg`
        <line x1="${15 + i * spacing}" y1="0" x2="${-2 + i * spacing}" y2="40"
          class="rainDrop"
          style="animation-delay: ${(i % 7) * 0.12}s; animation-duration: ${baseDuration + (i % 4) * 0.12}s;" />
      `)}
    </g>
  `;
}

function renderSnow(width: number): TemplateResult {
  const count = Math.ceil(width / 20);
  return svg`
    <g style="pointer-events: none;">
      ${Array.from({ length: count }).map((_, i) => svg`
        <circle cx="${15 + i * 20}" cy="0" r="${1.8 + (i % 4) * 0.6}"
          class="snowFlake"
          style="animation-delay: ${(i % 8) * 0.4}s; animation-duration: ${3.5 + (i % 5) * 0.6}s;" />
      `)}
    </g>
  `;
}

interface SvgParams {
  containerWidth: number;
  containerHeight: number;
  houseStyle?: string;
  carType?: string;
  timeHour: number;
  timeOfDay: string;
  solar: number;
  solarToday: number | null;
  load: number;
  batteryPower: number;
  soc: number;
  charger: number;
  grid: number;
  showSolar: boolean;
  showBattery: boolean;
  showEV: boolean;
  weather?: string;
  clouds?: any[];
  sunriseHour?: number;
  sunsetHour?: number;
  gridImportToday?: number | null;
  gridExportToday?: number | null;
  homeToday?: number | null;
  batteryChargeToday?: number | null;
  batteryDischargeToday?: number | null;
  evToday?: number | null;
  showLights?: boolean;
  gridPrice?: number | null;
  gridPriceUnit?: string;
  rainIntensity?: 'light' | 'normal' | 'heavy';
  windSpeed?: number;
  temperature?: number | null;
  onNodeClick: (node: string) => void;
}

const getOvercastDeckPath = (W: number, baseY: number, seed: number): string => {
  let path = `M 0,${baseY}`;
  const segments = 12;
  const segmentWidth = W / segments;
  
  for (let i = 0; i < segments; i++) {
    const startX = i * segmentWidth;
    const endX = (i + 1) * segmentWidth;
    const midX = (startX + endX) / 2;
    
    const waveNum = (i + seed) % 5;
    let bumpHeight = 22;
    if (waveNum === 1) bumpHeight = 38;
    else if (waveNum === 2) bumpHeight = 14;
    else if (waveNum === 3) bumpHeight = 28;
    else if (waveNum === 4) bumpHeight = 44;
    
    path += ` Q ${midX},${baseY + bumpHeight} ${endX},${baseY}`;
  }
  path += ` L ${W},0 L 0,0 Z`;
  return path;
};

const getPylonTips = (xOffset: number, yOffset: number, S: number) => {
  return [
    { x: xOffset + S * 50, y: yOffset + S * 180 },
    { x: xOffset + S * 85, y: yOffset + S * 180 },
    { x: xOffset + S * 155, y: yOffset + S * 180 },
    { x: xOffset + S * 190, y: yOffset + S * 180 }
  ];
};

const drawSaggingWire = (pStart: {x: number, y: number}, pEnd: {x: number, y: number}, sag: number) => {
  const midX = (pStart.x + pEnd.x) / 2;
  const midY = (pStart.y + pEnd.y) / 2 + sag;
  return `M ${pStart.x},${pStart.y} Q ${midX},${midY} ${pEnd.x},${pEnd.y}`;
};

const renderSinglePylon = (x: number, y: number, scale: number, opacity: number, strokeColor: string) => {
  return svg`
    <g transform="translate(${x}, ${y}) scale(${scale})" opacity="${opacity}" stroke="${strokeColor}" fill="none" stroke-linecap="round" stroke-linejoin="round" style="pointer-events: none;">
      <rect x="63" y="474" width="14" height="8" fill="#64748b" stroke="${strokeColor}" stroke-width="1.2" rx="1" />
      <rect x="163" y="474" width="14" height="8" fill="#64748b" stroke="${strokeColor}" stroke-width="1.2" rx="1" />
      <g stroke-width="2.8">
        <path d="M 70,480 L 105,290 L 85,160 L 95,120" />
        <path d="M 170,480 L 135,290 L 155,160 L 145,120" />
        <line x1="79" y1="380" x2="161" y2="380" />
        <line x1="105" y1="290" x2="135" y2="290" />
        <line x1="95" y1="220" x2="145" y2="220" />
        <line x1="85" y1="160" x2="155" y2="160" />
        <line x1="95" y1="120" x2="145" y2="120" />
        <line x1="105" y1="100" x2="135" y2="100" />
        <line x1="70" y1="480" x2="161" y2="380" />
        <line x1="170" y1="480" x2="79" y2="380" />
        <line x1="79" y1="380" x2="135" y2="290" />
        <line x1="161" y1="380" x2="105" y2="290" />
        <line x1="105" y1="290" x2="145" y2="220" />
        <line x1="135" y1="290" x2="95" y2="220" />
        <line x1="95" y1="220" x2="155" y2="160" />
        <line x1="145" y1="220" x2="85" y2="160" />
        <line x1="85" y1="160" x2="145" y2="120" />
        <line x1="155" y1="160" x2="95" y2="120" />
        <line x1="95" y1="120" x2="135" y2="100" />
        <line x1="145" y1="120" x2="105" y2="100" />
        <line x1="40" y1="160" x2="200" y2="160" />
        <line x1="40" y1="160" x2="95" y2="220" />
        <line x1="200" y1="160" x2="145" y2="220" />
        <line x1="80" y1="100" x2="160" y2="100" />
        <line x1="80" y1="100" x2="95" y2="120" />
        <line x1="160" y1="100" x2="145" y2="120" />

        <!-- Insulators -->
        <path d="M 50,160 L 50,180" stroke-width="1.5" />
        <path d="M 85,160 L 85,180" stroke-width="1.5" />
        <path d="M 155,160 L 155,180" stroke-width="1.5" />
        <path d="M 190,160 L 190,180" stroke-width="1.5" />
      </g>
    </g>
  `;
};

export function renderHouseSvg({
  containerWidth,
  containerHeight,
  carType = 'hatchback',
  timeHour: rawTimeHour,
  timeOfDay,
  solar,
  solarToday,
  load,
  batteryPower,
  soc,
  charger,
  grid,
  showSolar,
  showBattery,
  showEV,
  weather = 'sunny',
  clouds = [],
  sunriseHour = 6.0,
  sunsetHour = 21.0,
  gridImportToday = null,
  gridExportToday = null,
  homeToday = null,
  batteryChargeToday = null,
  batteryDischargeToday = null,
  evToday = null,
  showLights: passedShowLights = undefined,
  gridPrice = null,
  gridPriceUnit = '€/kWh',
  rainIntensity = 'normal',
  windSpeed = 10,
  temperature = null,
  onNodeClick
}: SvgParams): TemplateResult {

  // Map weather states to primary visual groups
  let visualWeather = weather;
  if (weather === 'pouring' || weather === 'lightning-rainy') {
    visualWeather = 'rainy';
  } else if (weather === 'snowy-rainy' || weather === 'hail') {
    visualWeather = 'snowy';
  } else if (weather === 'fog') {
    visualWeather = 'foggy';
  }

  // Resolve fluid dimensions (fall back to standard 800x600 if container is not measured yet)
  const width = containerWidth || 800;
  const height = containerHeight || 600;

  // Horizontal translation to center the house group
  const translateX = (width - 800) / 2;
  const mastX = 20 - translateX;

  // Normalize timeHour so sunrise=6.0 and sunset=21.0
  let timeHour = rawTimeHour;
  if (rawTimeHour >= sunriseHour && rawTimeHour <= sunsetHour) {
    timeHour = 6.0 + ((rawTimeHour - sunriseHour) / (sunsetHour - sunriseHour)) * 15.0;
  } else if (rawTimeHour > sunsetHour) {
    timeHour = 21.0 + ((rawTimeHour - sunsetHour) / (24.0 - sunsetHour)) * 3.0;
  } else {
    timeHour = (rawTimeHour / sunriseHour) * 6.0;
  }

  // Polarity status calculations
  const batteryCharging    = batteryPower > 0.05;
  const batteryDischarging = batteryPower < -0.05;
  const gridImporting      = grid > 0.05;
  const gridExporting      = grid < -0.05;
  const evActive           = charger > 0.1;
  const solarActive        = solar > 20;
  const homeActive         = load > 20;

  const isExportingDischarge = batteryDischarging && gridExporting;
  const batColor = (batteryCharging || isExportingDischarge) ? COLORS.battery : COLORS.batteryD;
  const gridColor = gridImporting ? COLORS.gridI : COLORS.gridE;

  const skyState = getSkyState(timeHour);
  const resolvedShowLights = passedShowLights !== undefined
    ? passedShowLights
    : (skyState.lights > 0.05 || visualWeather === 'rainy' || visualWeather === 'lightning');

  // Sky colors with weather adaptation
  let skyTop = skyState.top;
  let skyHorizon = skyState.horizon;
  let cloudColor = skyState.clouds;
  let cloudOpacity = timeOfDay === 'night' ? 0.18 : 0.48;


  const turbineDuration = windSpeed > 0.5 ? Math.max(1.2, Math.min(18, 45 / (windSpeed / 5))) : 0;

  const showLights = resolvedShowLights;

  if (visualWeather === 'cloudy') {
    cloudColor = '#b8c5d6'; // nice overcast light gray-blue
    skyHorizon = interpolateColor(skyState.horizon, '#94a3b8', 0.15);
    cloudOpacity = 0.98;
  } else if (visualWeather === 'rainy' || visualWeather === 'lightning') {
    cloudColor = '#475569'; // dark rain clouds
    skyTop = '#1f2937';
    skyHorizon = interpolateColor(skyState.horizon, '#1e293b', 0.55);
    cloudOpacity = 0.99;
  } else if (visualWeather === 'snowy') {
    cloudColor = '#7a889b'; // cold snowy slate gray
    skyTop = '#475569';
    skyHorizon = interpolateColor(skyState.horizon, '#334155', 0.4);
    cloudOpacity = 0.98;
  } else if (visualWeather === 'foggy') {
    skyTop = interpolateColor(skyState.top, '#64748b', 0.65);
    skyHorizon = interpolateColor(skyState.horizon, '#94a3b8', 0.65);
    cloudColor = '#a8b5c6';
    cloudOpacity = 0.50;
  } else if (visualWeather === 'partlycloudy') {
    skyTop = interpolateColor(skyState.top, '#475569', 0.1);
    skyHorizon = interpolateColor(skyState.horizon, '#64748b', 0.1);
    cloudColor = '#e2e8f0'; // very light gray-white
    cloudOpacity = 0.65;
  } else {
    // Default/sunny: pure white
    cloudColor = '#ffffff';
    cloudOpacity = 0.48;
  }

  // ── Window appearance ──
  const isDay = timeHour >= 8.0 && timeHour <= 18.0;
  const windowFill = isDay
    ? 'url(#window-day)'
    : (resolvedShowLights ? 'url(#window-night)' : 'url(#window-dark)');
  const windowFilter = isDay
    ? 'none'
    : (resolvedShowLights ? 'drop-shadow(0 0 6px rgba(251, 191, 36, 0.45))' : 'none');

  // ── Sun trajectory (using dynamic width and height) ──
  const isSunVisible = timeHour >= 6.0 && timeHour <= 21.0 && visualWeather !== 'rainy' && visualWeather !== 'lightning' && visualWeather !== 'cloudy' && visualWeather !== 'snowy' && visualWeather !== 'foggy';
  const sunPos = { cx: width / 2, cy: height };
  let sunOpacity = 0;
  let sunColor = '#fef08a';
  let sunGlow = 'rgba(254, 240, 138, 0.65)';

  if (isSunVisible) {
    const tSun = (timeHour - 6.0) / 15.0;
    sunPos.cx = -60 + tSun * (width + 120);
    sunPos.cy = (height - 120) - Math.sin(tSun * Math.PI) * (height - 160);
    sunOpacity = Math.max(0, Math.min(1.0, Math.sin(tSun * Math.PI) * 1.5));
    const fSun = Math.sin(tSun * Math.PI);
    sunColor = interpolateColor('#ea580c', '#fef08a', fSun);
    sunGlow = interpolateColor('rgba(234, 88, 12, 0.65)', 'rgba(254, 240, 138, 0.75)', fSun);
  }

  // ── Moon trajectory (using dynamic width and height) ──
  const isMoonVisible = (timeHour > 21.0 || timeHour < 6.0) && visualWeather !== 'rainy' && visualWeather !== 'lightning' && visualWeather !== 'cloudy' && visualWeather !== 'snowy' && visualWeather !== 'foggy';
  const moonPos = { cx: width / 2, cy: height };
  let moonOpacity = 0;

  if (isMoonVisible) {
    const tMoon = timeHour > 21.0 ? (timeHour - 21.0) / 9.0 : (timeHour + 3.0) / 9.0;
    moonPos.cx = -60 + tMoon * (width + 120);
    moonPos.cy = (height - 120) - Math.sin(tMoon * Math.PI) * (height - 200);
    moonOpacity = Math.max(0, Math.min(0.9, Math.sin(tMoon * Math.PI) * 1.8));
  }

  // ── Inverter and meterkast coordinates ──
  const mkX = 345;
  const mkY = 350;
  const invX = 380;
  const invY = 230;

  // Calculate pylon tips for the perspective pylons group
  const p1Tips = getPylonTips(mastX, -22, 0.9);
  const p2Tips = getPylonTips(mastX + 145.6, 112.4, 0.62);
  const p3Tips = getPylonTips(mastX + 249.6, 208.4, 0.42);
  const p4Tips = getPylonTips(mastX + 316.4, 275.6, 0.28);
  const p5Tips = getPylonTips(mastX + 358.4, 323.6, 0.18);

  // Cable paths between components and the meterkast
  const gridPath = `M 13,410 L 13,440 L ${mkX},440 L ${mkX},${mkY}`;
  const solarPath = `M ${invX},${invY} L ${invX},270 L ${mkX},270 L ${mkX},${mkY}`;
  const batteryPath = `M 310,350 L ${mkX},${mkY}`;
  const evPath = `M ${mkX},${mkY} L ${mkX},440 L 455,440 L 455,395`;

  // ── HUD Cards configuration ──
  let gridSub = gridExporting ? '↑ Teruglevering' : gridImporting ? '↓ Import' : 'Standby';
  if (gridImportToday !== null && gridExportToday !== null) {
    gridSub = `↓${gridImportToday.toFixed(1)} ↑${gridExportToday.toFixed(1)} kWh`;
  } else if (gridImportToday !== null) {
    gridSub = `Import: ${gridImportToday.toFixed(1)} kWh`;
  } else if (gridExportToday !== null) {
    gridSub = `Terug: ${gridExportToday.toFixed(1)} kWh`;
  }

  const homeSub = homeToday !== null ? `Vandaag: ${homeToday.toFixed(1)} kWh` : (homeActive ? 'Actief' : 'Standby');

  let batterySub = `SoC: ${soc}%`;
  if (batteryChargeToday !== null && batteryDischargeToday !== null) {
    batterySub = `SoC: ${soc}% (↓${batteryChargeToday.toFixed(1)} ↑${batteryDischargeToday.toFixed(1)})`;
  } else if (batteryChargeToday !== null) {
    batterySub = `SoC: ${soc}% (↓${batteryChargeToday.toFixed(1)})`;
  }

  const evSub = evToday !== null ? `Vandaag: ${evToday.toFixed(1)} kWh` : (evActive ? 'Laden' : 'Standby');

  let gridPriceLabel = '';
  if (gridPrice !== null) {
    const formattedPrice = gridPrice.toLocaleString('nl-NL', { minimumFractionDigits: 2, maximumFractionDigits: 3 });
    gridPriceLabel = `€ ${formattedPrice}`;
  }

  interface CardConfig { id: string; title: string; value: string; sub: string; color: string; active: boolean; }
  const bottomCards: CardConfig[] = [
    { id: 'grid',  title: 'Stroomnet',    value: formatPowerAbs(grid),        sub: gridSub,    color: gridColor.stroke,       active: gridImporting || gridExporting },
  ];
  if (showBattery) bottomCards.push({ id: 'battery', title: 'Thuisaccu', value: batteryCharging || batteryDischarging ? formatPowerAbs(batteryPower) : 'Standby', sub: batterySub, color: batColor.stroke, active: batteryCharging || batteryDischarging });
  bottomCards.push({ id: 'home',  title: 'Huisverbruik', value: formatPowerAbs(load),        sub: homeSub,    color: COLORS.home.stroke,     active: homeActive });
  if (showEV)      bottomCards.push({ id: 'ev', title: 'Laadpaal (EV)', value: formatPowerAbs(charger), sub: evSub, color: COLORS.ev.stroke, active: evActive });


  // ── Particle and cable rendering ──
  const renderParticles = (path: string, active: boolean, speed: number, color: string, glow: string, reverse = false) => {
    if (!active || speed === 0) return svg``;
    const count = 3;
    return svg`
      ${Array.from({ length: count }).map((_, i) => svg`
        <circle r="3.5" fill="${color}"
          style="
            offset-path: path('${path}');
            animation: moveParticle ${speed}s linear infinite;
            animation-play-state: running;
            animation-delay: ${-(i / count) * speed}s;
            animation-direction: ${reverse ? 'reverse' : 'normal'};
            filter: drop-shadow(0 0 5px ${glow}) drop-shadow(0 0 2px ${color});
          " />
      `)}
    `;
  };

  const renderCable = (path: string, active: boolean, speed: number, color: string, glow: string, reverse = false) => {
    return svg`
      <path d="${path}" class="flowCable" />
      <path d="${path}" fill="none" stroke="${color}" stroke-width="3" stroke-linecap="round"
        opacity="${active ? 0.25 : 0}"
        style="filter: ${active ? 'blur(3.5px)' : 'none'}; transition: stroke 0.6s ease, opacity 0.6s ease;" />
      <path d="${path}" fill="none" stroke="${color}" stroke-width="1.2" stroke-linecap="round"
        opacity="${active ? 0.55 : 0}"
        style="transition: stroke 0.6s ease, opacity 0.6s ease;" />
      ${renderParticles(path, active, speed, color, glow, reverse)}
    `;
  };

  // Build fluid overcast background cloud path
  let overcastPath = `M 0,-10 L ${width},-10 L ${width},12`;
  for (let x = width; x > 0; x -= 30) {
    overcastPath += ` Q ${x - 15},18 ${x - 30},12`;
  }
  overcastPath += ` Z`;

  // Vertical translation to pin the ground and house to the bottom of the viewport
  const translateY = height - 530;

  return svg`
    <svg viewBox="0 0 ${width} ${height}" xmlns="http://www.w3.org/2000/svg">
      <defs>
        <!-- Sky gradient -->
        <linearGradient id="sky-grad" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stop-color="${skyTop}" />
          <stop offset="100%" stop-color="${skyHorizon}" />
        </linearGradient>

        <linearGradient id="shooting-star-grad" x1="1" y1="0" x2="0" y2="0">
          <stop offset="0%" stop-color="#ffffff" stop-opacity="1" />
          <stop offset="100%" stop-color="#ffffff" stop-opacity="0" />
        </linearGradient>

        <linearGradient id="garden-grad" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stop-color="#0f3f26" />
          <stop offset="100%" stop-color="#0a2919" />
        </linearGradient>

        <linearGradient id="driveway-grad" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stop-color="#334155" />
          <stop offset="100%" stop-color="#1e293b" />
        </linearGradient>

        <!-- Solar panel gradient -->
        <linearGradient id="solar-panel-grad" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stop-color="#1e1b4b" />
          <stop offset="100%" stop-color="#312e81" />
        </linearGradient>

        <linearGradient id="lamp-light-grad" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stop-color="#fde047" stop-opacity="0.75" />
          <stop offset="100%" stop-color="#fde047" stop-opacity="0" />
        </linearGradient>

        <!-- Reflective daytime window gradient -->
        <linearGradient id="window-day" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0%" stop-color="#94a3b8" />
          <stop offset="35%" stop-color="#cbd5e1" />
          <stop offset="40%" stop-color="#f8fafc" />
          <stop offset="45%" stop-color="#cbd5e1" />
          <stop offset="80%" stop-color="#64748b" />
          <stop offset="100%" stop-color="#475569" />
        </linearGradient>

        <!-- Warm amber night window -->
        <linearGradient id="window-night" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stop-color="#fef3c7" />
          <stop offset="100%" stop-color="#fcd34d" />
        </linearGradient>

        <!-- Dark window -->
        <linearGradient id="window-dark" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stop-color="#1e293b" />
          <stop offset="100%" stop-color="#0f172a" />
        </linearGradient>

        <!-- Jaren 30 brick texture pattern -->
        <pattern id="jaren30-brick-pat" width="60" height="40" patternUnits="userSpaceOnUse">
          <image href="${BRICK_TEXTURE_BASE64}" width="60" height="40" preserveAspectRatio="none" />
        </pattern>

        <!-- Roof tile pattern -->
        <pattern id="tiles-pat" width="12" height="12" patternUnits="userSpaceOnUse">
          <rect width="12" height="12" fill="#1e293b" />
          <path d="M 0,12 Q 6,0 12,12" fill="none" stroke="#0f172a" stroke-width="1.2" />
        </pattern>

        <!-- Clip path for the whole scene -->
        <clipPath id="scene-clip">
          <rect width="${width}" height="${height}" rx="0" ry="0" />
        </clipPath>
      </defs>

      <g clip-path="url(#scene-clip)">
        <!-- Sky background -->
        <rect width="${width}" height="${height}" fill="url(#sky-grad)" />

        <!-- Stars (dynamically distributed across width) -->
        ${skyState.stars > 0.05 && visualWeather !== 'rainy' && visualWeather !== 'lightning' && visualWeather !== 'cloudy' ? svg`
          <g opacity="${skyState.stars}" style="pointer-events: none;">
            <circle cx="${width * 0.1}"  cy="${height * 0.08}"  r="1.0" class="starFast" fill="#ffffff" />
            <circle cx="${width * 0.26}" cy="${height * 0.16}"  r="1.2" class="starMed" fill="#ffffff" />
            <circle cx="${width * 0.42}" cy="${height * 0.07}"  r="1.0" class="starFast" fill="#ffffff" />
            <circle cx="${width * 0.6}"  cy="${height * 0.18}"  r="1.5" class="starSlow" fill="#ffffff" />
            <circle cx="${width * 0.77}" cy="${height * 0.11}"  r="1.2" class="starFast" fill="#ffffff" />
            <circle cx="${width * 0.91}" cy="${height * 0.2}"   r="1.0" class="starMed" fill="#ffffff" />
          </g>
          <!-- Shooting Star -->
          <g style="animation: shootingStar 18s infinite linear; animation-delay: 8s; pointer-events: none;">
            <circle cx="0" cy="0" r="1.5" fill="#ffffff" style="filter: drop-shadow(0 0 4px #ffffff);" />
            <line x1="0" y1="0" x2="40" y2="-10" stroke="url(#shooting-star-grad)" stroke-width="1.5" />
          </g>
        ` : ''}

        <!-- Dynamic Sun -->
        ${sunOpacity > 0 ? svg`
          <g style="pointer-events: none;">
            <circle cx="${sunPos.cx}" cy="${sunPos.cy}" r="45" fill="${sunColor}" opacity="${sunOpacity * 0.15}" style="filter: blur(8px);" />
            <circle cx="${sunPos.cx}" cy="${sunPos.cy}" r="22" fill="${sunColor}" opacity="${sunOpacity}" style="filter: drop-shadow(0 0 12px ${sunGlow});" />
          </g>
        ` : ''}

        <!-- Dynamic Moon -->
        ${moonOpacity > 0 ? svg`
          <g style="pointer-events: none;" opacity="${moonOpacity}">
            <circle cx="${moonPos.cx}" cy="${moonPos.cy}" r="25" fill="#e2e8f0" opacity="0.15" style="filter: blur(4px);" />
            <circle cx="${moonPos.cx}" cy="${moonPos.cy}" r="14" fill="#f1f5f9" />
            <circle cx="${moonPos.cx + 5}" cy="${moonPos.cy - 3}" r="13" fill="url(#sky-grad)" />
          </g>
        ` : ''}

        <!-- Flying Birds during the day -->
        ${isSunVisible && visualWeather !== 'rainy' && visualWeather !== 'lightning' && visualWeather !== 'snowy' && visualWeather !== 'foggy' ? svg`
          <style>
            @keyframes flyBird1 {
              0% { transform: translate(-40px, 45px) scale(0.55); }
              100% { transform: translate(${width + 40}px, 35px) scale(0.55); }
            }
            @keyframes flyBird2 {
              0% { transform: translate(-40px, 110px) scale(0.4); }
              100% { transform: translate(${width + 40}px, 95px) scale(0.4); }
            }
            @keyframes flyBird3 {
              0% { transform: translate(-40px, 160px) scale(0.65); }
              100% { transform: translate(${width + 40}px, 145px) scale(0.65); }
            }
            @keyframes flyBird4 {
              0% { transform: translate(-40px, 80px) scale(0.48); }
              100% { transform: translate(${width + 40}px, 70px) scale(0.48); }
            }
            @keyframes flap {
              0% { transform: scaleY(1.0); }
              50% { transform: scaleY(0.2); }
              100% { transform: scaleY(1.0); }
            }
            .bird {
              fill: none;
              stroke: rgba(15, 23, 42, 0.4);
              stroke-width: 1.8;
              stroke-linecap: round;
              stroke-linejoin: round;
              transform-origin: center;
            }
          </style>
          <g style="pointer-events: none;">
            <g style="animation: flyBird1 28s infinite linear; animation-delay: 1s; transform: translate(-100px, -100px);">
              <path d="M 0,4 Q 5,-2 10,4 Q 15,-2 20,4" class="bird" style="animation: flap 0.5s infinite ease-in-out; transform-origin: 10px 4px;" />
            </g>
            <g style="animation: flyBird2 36s infinite linear; animation-delay: 8s; transform: translate(-100px, -100px);">
              <path d="M 0,4 Q 5,-2 10,4 Q 15,-2 20,4" class="bird" style="animation: flap 0.7s infinite ease-in-out; transform-origin: 10px 4px;" />
            </g>
            <g style="animation: flyBird3 22s infinite linear; animation-delay: 15s; transform: translate(-100px, -100px);">
              <path d="M 0,4 Q 5,-2 10,4 Q 15,-2 20,4" class="bird" style="animation: flap 0.4s infinite ease-in-out; transform-origin: 10px 4px;" />
            </g>
            <g style="animation: flyBird4 31s infinite linear; animation-delay: 22s; transform: translate(-100px, -100px);">
              <path d="M 0,4 Q 5,-2 10,4 Q 15,-2 20,4" class="bird" style="animation: flap 0.6s infinite ease-in-out; transform-origin: 10px 4px;" />
            </g>
          </g>
        ` : ''}

        <!-- Falling precipitation -->
        ${visualWeather === 'rainy' ? renderRain(width, rainIntensity) : ''}
        ${visualWeather === 'snowy' ? renderSnow(width) : ''}

        <!-- Cloud layers -->
        ${(visualWeather === 'cloudy' || visualWeather === 'rainy' || visualWeather === 'lightning' || visualWeather === 'snowy') ? svg`
          <style>
            @keyframes scrollCloudsBack { 0% { transform: translateX(0px); } 100% { transform: translateX(-${width}px); } }
            @keyframes scrollCloudsMid { 0% { transform: translateX(0px); } 100% { transform: translateX(-${width}px); } }
            @keyframes scrollCloudsFront { 0% { transform: translateX(0px); } 100% { transform: translateX(-${width}px); } }
            
            .cloud-layer-back { animation: scrollCloudsBack 140s infinite linear; filter: drop-shadow(0 4px 6px rgba(0,0,0,0.25)); }
            .cloud-layer-mid { animation: scrollCloudsMid 90s infinite linear; filter: drop-shadow(0 6px 10px rgba(0,0,0,0.3)); }
            .cloud-layer-front { animation: scrollCloudsFront 50s infinite linear; filter: drop-shadow(0 8px 14px rgba(0,0,0,0.35)); }
          </style>
          
          <g opacity="${cloudOpacity}" style="pointer-events: none;">
            <!-- Layer 1 (Back - Darkest) -->
            <g class="cloud-layer-back">
              <path d="${getOvercastDeckPath(width, 100, 1)}" fill="${interpolateColor(cloudColor, '#111827', 0.20)}" />
              <path d="${getOvercastDeckPath(width, 100, 1)}" transform="translate(${width}, 0)" fill="${interpolateColor(cloudColor, '#111827', 0.20)}" />
            </g>
            
            <!-- Layer 2 (Middle - Medium) -->
            <g class="cloud-layer-mid">
              <path d="${getOvercastDeckPath(width, 125, 3)}" fill="${interpolateColor(cloudColor, '#1f2937', 0.10)}" />
              <path d="${getOvercastDeckPath(width, 125, 3)}" transform="translate(${width}, 0)" fill="${interpolateColor(cloudColor, '#1f2937', 0.10)}" />
            </g>
            
            <!-- Layer 3 (Front - Main Color) -->
            <g class="cloud-layer-front">
              <path d="${getOvercastDeckPath(width, 150, 5)}" fill="${cloudColor}" />
              <path d="${getOvercastDeckPath(width, 150, 5)}" transform="translate(${width}, 0)" fill="${cloudColor}" />
            </g>
          </g>
        ` : svg`
          <!-- Floating Cloud layers (Only for sunny/partlycloudy) -->
          <g opacity="${cloudOpacity}" style="pointer-events: none;">
            ${(clouds || []).map(c => {
              const minY = 20;
              // Limit the clouds to the top 40% of the screen height so they never touch the house
              const maxY = height * 0.40;
              const deltaY = Math.max(20, maxY - minY);
              const yFactor = c.yFactor !== undefined ? c.yFactor : 0.5;
              const cloudY = minY + yFactor * deltaY;
              return renderHDCloud(
                'customDriftCloud',
                0,
                cloudY,
                c.scale,
                cloudColor,
                c.opacityMultiplier,
                `animation-duration: ${c.speed}s; animation-delay: ${c.delay}s;`
              );
            })}
          </g>
        `}

        <!-- Lightning bolts (background, shifted dynamically to remain centered) -->
        ${visualWeather === 'lightning' ? svg`
          <path d="M ${width / 2 + 20},60 L ${width / 2 - 10},150 L ${width / 2 + 30},150 L ${width / 2 - 30},260 L ${width / 2},260 L ${width / 2 - 50},380" class="lightningBolt" />
          <path d="M ${width * 0.225},40 L ${width * 0.194},110 L ${width * 0.225},110 L ${width * 0.175},180" class="lightningBolt" style="animation-delay: 1.5s; stroke-width: 2;" />
        ` : ''}

        <!-- ════════════════════════════════════════════════════════════════ -->
        <!-- GROUND, MAST, HOUSE, AND CABLES: Translated inside dynamic group-->
        <!-- ════════════════════════════════════════════════════════════════ -->
        <g transform="translate(${translateX}, ${translateY})">

          <!-- Wind Turbines in the far background (behind pylon cables and ground) -->
          <!-- Small Wind Turbine (further) -->
          <g id="wind-turbine-small" style="pointer-events: none;" opacity="0.3">
            <path d="M 93,410 L 94.5,330 L 95.5,330 L 97,410 Z" fill="#475569" opacity="0.7" />
            <g style="transform-origin: 95px 330px; ${turbineDuration > 0 ? `animation: spinWindTurbine ${turbineDuration * 1.2}s linear infinite; animation-delay: -0.4s;` : ''}">
              <circle cx="95" cy="330" r="2.2" fill="#64748b" />
              <path d="M 95,330 Q 94,295 95,285 Q 96,295 95,330" fill="#cbd5e1" />
              <path d="M 95,330 Q 94,295 95,285 Q 96,295 95,330" fill="#cbd5e1" transform="rotate(120 95 330)" />
              <path d="M 95,330 Q 94,295 95,285 Q 96,295 95,330" fill="#cbd5e1" transform="rotate(240 95 330)" />
            </g>
          </g>
          <!-- Medium Wind Turbine -->
          <g id="wind-turbine-med" style="pointer-events: none;" opacity="0.45">
            <path d="M 51,410 L 53.5,290 L 56.5,290 L 59,410 Z" fill="#475569" opacity="0.7" />
            <g style="transform-origin: 55px 290px; ${turbineDuration > 0 ? `animation: spinWindTurbine ${turbineDuration}s linear infinite;` : ''}">
              <circle cx="55" cy="290" r="3.5" fill="#64748b" />
              <path d="M 55,290 Q 53,235 55,220 Q 57,235 55,290" fill="#cbd5e1" />
              <path d="M 55,290 Q 53,235 55,220 Q 57,235 55,290" fill="#cbd5e1" transform="rotate(120 55 290)" />
              <path d="M 55,290 Q 53,235 55,220 Q 57,235 55,290" fill="#cbd5e1" transform="rotate(240 55 290)" />
            </g>
          </g>

          <!-- Ground (grass base spanning full screen width) -->
          <rect x="${-translateX}" y="410" width="${width}" height="120" fill="url(#garden-grad)" />
          
          <!-- Driveway: from center gable (x=320) to right edge, rounded left corners -->
          <path d="M 320,410 Q 320,430 340,430 L ${width - translateX},430 L ${width - translateX},410 Z" fill="url(#driveway-grad)" />
          <line x1="${-translateX}" y1="410" x2="${width - translateX}" y2="410" class="horizonLine" />

          <!-- Perspective High-Voltage Electricity Pylons (Elektramasten) fading into the distance -->
          <!-- Background Pylons (Right/Far) -->
          ${renderSinglePylon(mastX + 358.4, 323.6, 0.18, 0.22, '#64748b')}
          ${renderSinglePylon(mastX + 316.4, 275.6, 0.28, 0.38, '#5d6d82')}
          ${renderSinglePylon(mastX + 249.6, 208.4, 0.42, 0.58, '#546479')}
          ${renderSinglePylon(mastX + 145.6, 112.4, 0.62, 0.78, '#4c5c71')}

          <!-- Parallax sagging power lines between pylons -->
          <!-- Segment P5 (Far) to P4 -->
          <path d="${drawSaggingWire(p5Tips[0], p4Tips[0], 5)} 
                   ${drawSaggingWire(p5Tips[1], p4Tips[1], 5)} 
                   ${drawSaggingWire(p5Tips[2], p4Tips[2], 5)} 
                   ${drawSaggingWire(p5Tips[3], p4Tips[3], 5)}" 
                fill="none" stroke="#64748b" stroke-width="0.5" opacity="0.15" />
                
          <!-- Segment P4 to P3 -->
          <path d="${drawSaggingWire(p4Tips[0], p3Tips[0], 9)} 
                   ${drawSaggingWire(p4Tips[1], p3Tips[1], 9)} 
                   ${drawSaggingWire(p4Tips[2], p3Tips[2], 9)} 
                   ${drawSaggingWire(p4Tips[3], p3Tips[3], 9)}" 
                fill="none" stroke="#5d6d82" stroke-width="0.8" opacity="0.32" />

          <!-- Segment P3 to P2 -->
          <path d="${drawSaggingWire(p3Tips[0], p2Tips[0], 14)} 
                   ${drawSaggingWire(p3Tips[1], p2Tips[1], 14)} 
                   ${drawSaggingWire(p3Tips[2], p2Tips[2], 14)} 
                   ${drawSaggingWire(p3Tips[3], p2Tips[3], 14)}" 
                fill="none" stroke="#546479" stroke-width="1.2" opacity="0.52" />

          <!-- Segment P2 to P1 (Foreground) -->
          <path d="${drawSaggingWire(p2Tips[0], p1Tips[0], 22)} 
                   ${drawSaggingWire(p2Tips[1], p1Tips[1], 22)} 
                   ${drawSaggingWire(p2Tips[2], p1Tips[2], 22)} 
                   ${drawSaggingWire(p2Tips[3], p1Tips[3], 22)}" 
                fill="none" stroke="#4c5c71" stroke-width="1.6" opacity="0.75" />

          <!-- Wires going off-screen left from foreground P1 -->
          <path d="${drawSaggingWire({x: -translateX, y: p1Tips[0].y - 35}, p1Tips[0], 30)} 
                   ${drawSaggingWire({x: -translateX, y: p1Tips[1].y - 35}, p1Tips[1], 30)} 
                   ${drawSaggingWire({x: -translateX, y: p1Tips[3].y - 35}, p1Tips[3], 30)}" 
                fill="none" stroke="#4c5c71" stroke-width="1.8" opacity="0.8" />

          <!-- Wires extending past P5 into the horizon -->
          <path d="M ${p5Tips[0].x},${p5Tips[0].y} L ${p5Tips[0].x + 50},${p5Tips[0].y - 2} 
                   M ${p5Tips[1].x},${p5Tips[1].y} L ${p5Tips[1].x + 50},${p5Tips[1].y - 2} 
                   M ${p5Tips[2].x},${p5Tips[2].y} L ${p5Tips[2].x + 50},${p5Tips[2].y - 2} 
                   M ${p5Tips[3].x},${p5Tips[3].y} L ${p5Tips[3].x + 50},${p5Tips[3].y - 2}" 
                fill="none" stroke="#64748b" stroke-width="0.3" opacity="0.1" />

          <!-- Interactive Foreground Mast (Pylon 1) -->
          <g id="electricity-mast" class="interactiveGroup gridGroup" @click=${() => onNodeClick('grid')}>
            ${renderSinglePylon(mastX, -22, 0.9, 1.0, '#475569')}
            <!-- Larger transparent tap target for tablets -->
            <rect x="${mastX}" y="100" width="200" height="380" fill="transparent" style="cursor: pointer;" />
          </g>

          <!-- Transformer / Distribution Box -->
          <g id="grid-transformer-box">
            <rect x="-3" y="365" width="32" height="45" fill="#334155" stroke="#1e293b" stroke-width="1.8" rx="3" />
            <line x1="13" y1="365" x2="13" y2="410" stroke="#1e293b" stroke-width="1" />
            <circle cx="5" cy="390" r="1.5" fill="#1e293b" />
            <rect x="3" y="375" width="20" height="12" fill="#fef08a" stroke="#ca8a04" stroke-width="0.8" rx="1" />
            <polygon points="12,377 16,377 13,381 17,381 11,385 14,381 11,381" fill="#ca8a04" />
          </g>

          <!-- ── HOUSE GEOMETRY ── -->
          <g id="house-structure" class="interactiveGroup homeGroup" @click=${() => onNodeClick('home')}>
            <!-- LEFT WING -->
            <g id="left-wing">
              <rect x="180" y="300" width="140" height="110" fill="url(#jaren30-brick-pat)" stroke="#0f172a" stroke-width="2" />
              <rect x="180" y="300" width="140" height="110" fill="black" opacity="0.32" style="pointer-events: none;" />
              <polygon points="175,300 205,260 320,260 320,300" fill="url(#tiles-pat)" stroke="#0f172a" stroke-width="2" />
              
              <!-- Left roof trim -->
              <line x1="172" y1="303" x2="205" y2="258" stroke="#0f172a" stroke-width="12" stroke-linecap="round" />
              <line x1="172" y1="303" x2="205" y2="258" stroke="#1e293b" stroke-width="8"  stroke-linecap="round" />
              <line x1="205" y1="260" x2="320" y2="260" stroke="#0f172a" stroke-width="8" />
              <line x1="205" y1="260" x2="320" y2="260" stroke="#1e293b" stroke-width="4" />
              
              <!-- Window -->
              <rect x="230" y="320" width="40" height="45" fill="${windowFill}" stroke="#0f172a" stroke-width="2" style="filter: ${windowFilter}; transition: fill 0.5s ease, filter 0.5s ease;" />
              <line x1="250" y1="320" x2="250" y2="365" stroke="#0f172a" stroke-width="1.2" />
              <line x1="230" y1="342.5" x2="270" y2="342.5" stroke="#0f172a" stroke-width="1.2" />
            </g>

            <!-- RIGHT WING -->
            <g id="right-wing">
              <polygon points="380,410 380,200 500,60 680,270 680,410" fill="url(#jaren30-brick-pat)" stroke="#0f172a" stroke-width="2" />
              <polygon points="380,410 380,200 500,60 680,270 680,410" fill="black" opacity="0.32" style="pointer-events: none;" />
              
              <line x1="380" y1="200" x2="500" y2="60" stroke="#0f172a" stroke-width="12" stroke-linecap="round" />
              <line x1="380" y1="200" x2="500" y2="60" stroke="#1e293b" stroke-width="8"  stroke-linecap="round" />
              <line x1="692" y1="284" x2="500" y2="60" stroke="#0f172a" stroke-width="12" stroke-linecap="round" />
              <line x1="692" y1="284" x2="500" y2="60" stroke="#1e293b" stroke-width="8"  stroke-linecap="round" />
              
              <!-- Downstairs windows -->
              <rect x="465" y="315" width="40" height="45" fill="${windowFill}" stroke="#0f172a" stroke-width="2" style="filter: ${windowFilter}; transition: fill 0.5s ease, filter 0.5s ease;" />
              <line x1="485" y1="315" x2="485" y2="360" stroke="#0f172a" stroke-width="1.2" />
              <line x1="465" y1="337.5" x2="505" y2="337.5" stroke="#0f172a" stroke-width="1.2" />
              
              <rect x="555" y="315" width="40" height="45" fill="${windowFill}" stroke="#0f172a" stroke-width="2" style="filter: ${windowFilter}; transition: fill 0.5s ease, filter 0.5s ease;" />
              <line x1="575" y1="315" x2="575" y2="360" stroke="#0f172a" stroke-width="1.2" />
              <line x1="555" y1="337.5" x2="595" y2="337.5" stroke="#0f172a" stroke-width="1.2" />
              
              <!-- Upstairs window -->
              <rect x="480" y="210" width="40" height="40" fill="${windowFill}" stroke="#0f172a" stroke-width="2" style="filter: ${windowFilter}; transition: fill 0.5s ease, filter 0.5s ease;" />
              <line x1="500" y1="210" x2="500" y2="250" stroke="#0f172a" stroke-width="1.2" />
              <line x1="480" y1="230" x2="520" y2="230" stroke="#0f172a" stroke-width="1.2" />
            </g>

            <!-- CENTER ENTRANCE GABLE -->
            <g id="center-portal">
              <polygon points="320,410 320,270 380,200 440,270 440,410" fill="url(#jaren30-brick-pat)" stroke="#0f172a" stroke-width="2" />
              <polygon points="320,410 320,270 380,200 440,270 440,410" fill="black" opacity="0.32" style="pointer-events: none;" />
              <line x1="308" y1="284" x2="380" y2="200" stroke="#0f172a" stroke-width="12" stroke-linecap="round" />
              <line x1="308" y1="284" x2="380" y2="200" stroke="#1e293b" stroke-width="8"  stroke-linecap="round" />
              <line x1="452" y1="284" x2="380" y2="200" stroke="#0f172a" stroke-width="12" stroke-linecap="round" />
              <line x1="452" y1="284" x2="380" y2="200" stroke="#1e293b" stroke-width="8"  stroke-linecap="round" />
              
              <!-- Front Door -->
              <rect x="360" y="325" width="40" height="85" fill="#451a03" stroke="#1c1009" stroke-width="2" />
              <circle cx="390" cy="365" r="2" fill="#fbbf24" />
            </g>
          </g>

          <!-- ── SOLAR PANELS (continuous array flat on roof slope) ── -->
          ${showSolar ? svg`
            <g id="solar-panels" class="interactiveGroup solarGroup" @click=${(e: Event) => { e.stopPropagation(); onNodeClick('solar'); }}>
              <g transform="translate(320, 270) rotate(-49.4)">
                <!-- Mounting rods -->
                <line x1="25"  y1="-7" x2="25"  y2="0" stroke="#0f172a" stroke-width="2" />
                <line x1="25"  y1="-7" x2="25"  y2="0" stroke="#475569" stroke-width="1.2" />
                <line x1="75"  y1="-7" x2="75"  y2="0" stroke="#0f172a" stroke-width="2" />
                <line x1="75"  y1="-7" x2="75"  y2="0" stroke="#475569" stroke-width="1.2" />
                <line x1="125" y1="-7" x2="125" y2="0" stroke="#0f172a" stroke-width="2" />
                <line x1="125" y1="-7" x2="125" y2="0" stroke="#475569" stroke-width="1.2" />
                <line x1="175" y1="-7" x2="175" y2="0" stroke="#0f172a" stroke-width="2" />
                <line x1="175" y1="-7" x2="175" y2="0" stroke="#475569" stroke-width="1.2" />
                <line x1="225" y1="-7" x2="225" y2="0" stroke="#0f172a" stroke-width="2" />
                <line x1="225" y1="-7" x2="225" y2="0" stroke="#475569" stroke-width="1.2" />

                <!-- Panel body -->
                <rect x="10" y="-13" width="235" height="6" fill="url(#solar-panel-grad)" stroke="#1e40af" stroke-width="1.2" rx="1.5" />
                <line x1="10"    y1="-10" x2="245"   y2="-10" stroke="#3b82f6" stroke-width="0.6" opacity="0.4" />
                <line x1="33.5"  y1="-13" x2="33.5"  y2="-7"  stroke="#3b82f6" stroke-width="0.6" opacity="0.4" />
                <line x1="57"    y1="-13" x2="57"    y2="-7"  stroke="#3b82f6" stroke-width="0.6" opacity="0.4" />
                <line x1="80.5"  y1="-13" x2="80.5"  y2="-7"  stroke="#3b82f6" stroke-width="0.6" opacity="0.4" />
                <line x1="104"   y1="-13" x2="104"   y2="-7"  stroke="#3b82f6" stroke-width="0.6" opacity="0.4" />
                <line x1="127.5" y1="-13" x2="127.5" y2="-7"  stroke="#3b82f6" stroke-width="0.6" opacity="0.4" />
                <line x1="151"   y1="-13" x2="151"   y2="-7"  stroke="#3b82f6" stroke-width="0.6" opacity="0.4" />
                <line x1="174.5" y1="-13" x2="174.5" y2="-7"  stroke="#3b82f6" stroke-width="0.6" opacity="0.4" />
                <line x1="198"   y1="-13" x2="198"   y2="-7"  stroke="#3b82f6" stroke-width="0.6" opacity="0.4" />
                <line x1="221.5" y1="-13" x2="221.5" y2="-7"  stroke="#3b82f6" stroke-width="0.6" opacity="0.4" />
              </g>
            </g>
          ` : ''}

          <!-- ── INVERTER (Omvormer) under center gable roof ── -->
          <g id="inverter-omvormer">
            <rect x="373" y="225" width="14" height="18" fill="#1e293b" stroke="#475569" stroke-width="1" rx="1.5" />
            <rect x="376" y="236" width="8" height="4" fill="#0f172a" rx="0.5" />
            <circle cx="380" cy="231" r="1.5" fill="#f59e0b" />
          </g>

          <!-- ── METERKAST location ── -->
          <g id="house-inverter">
            <rect x="${mkX - 5}" y="${mkY - 10}" width="10" height="20" fill="#1e293b" rx="1" />
            <circle cx="${mkX}" cy="${mkY}" r="2.5" fill="${solarActive || batteryCharging || batteryDischarging || gridImporting || gridExporting || evActive ? '#10b981' : '#ef4444'}" style="transition: fill 0.6s ease;" />
          </g>

          <!-- ── THUISACCU (Battery against left wing wall) ── -->
          ${showBattery ? svg`
            <g id="house-battery" class="interactiveGroup batteryGroup" @click=${(e: Event) => { e.stopPropagation(); onNodeClick('battery'); }}>
              <rect x="280" y="340" width="30" height="70" fill="url(#battery-body-grad)" stroke="#cbd5e1" stroke-width="1.5" rx="3" />
              
              <rect x="285" y="348" width="20" height="10" fill="rgba(0,0,0,0.72)" rx="1.5" />
              <text x="295" y="356" text-anchor="middle" fill="${soc < 20 ? '#ef4444' : (batteryDischarging ? '#f97316' : '#10b981')}" font-size="8px" font-family="monospace" font-weight="bold" style="transition: fill 0.6s ease;">
                ${soc}%
              </text>
              
              <rect x="294" y="365" width="2" height="40" fill="rgba(0,0,0,0.15)" rx="0.5" />
              <rect x="294" y="${405 - 40 * (soc / 100)}" width="2" height="${40 * (soc / 100)}" fill="${soc < 20 ? '#ef4444' : (batteryDischarging ? '#f97316' : '#10b981')}" opacity="0.95" style="transition: y 0.8s ease, height 0.8s ease, fill 0.6s ease;" rx="0.5" />
            </g>
          ` : ''}

          <!-- ── EV CHARGER ── -->
          ${showEV ? svg`
            <g id="ev-charger" class="interactiveGroup evGroup" @click=${(e: Event) => { e.stopPropagation(); onNodeClick('ev'); }}>
              <rect x="450" y="355" width="10" height="55" fill="#1e293b" rx="1" />
              <circle cx="455" cy="365" r="3.5"
                fill="${evActive ? '#a855f7' : '#10b981'}"
                style="filter: ${evActive ? 'drop-shadow(0 0 6px #a855f7)' : 'none'}; transition: fill 0.5s ease;" />
              <!-- Charging cable -->
              <path d="M 455,370 C 460,390 475,400 495,395" fill="none" stroke="#a855f7" stroke-width="2" stroke-dasharray="3,3" />
            </g>

            <!-- EV Car (Vector drawing shifted up by 70px) -->
            <g id="ev-car" class="interactiveGroup evGroup" opacity="${evActive ? 1.0 : 0.4}" style="transition: opacity 0.6s ease;" @click=${(e: Event) => { e.stopPropagation(); onNodeClick('ev'); }}>
              ${carType === 'hatchback' ? svg`
                <g transform="translate(490, 360)">
                  <ellipse cx="90" cy="55" rx="90" ry="6" fill="rgba(0,0,0,0.4)" />
                  <path d="M 0,44 C 0,44 4,28 18,28 C 32,28 50,8 75,6 C 100,4 118,16 132,28 C 148,40 158,44 160,44 L 158,52 L 2,52 Z"
                    fill="#475569" stroke="rgba(255,255,255,0.2)" stroke-width="1" />
                  <path d="M 32,28 C 44,14 68,10 86,10 C 102,10 114,22 120,27 L 116,37 L 28,37 Z" fill="#0f172a" opacity="0.85" />
                  <path d="M 38,29 L 68,29 L 68,36 L 34,36 Z" fill="rgba(255,255,255,0.12)" />
                  <path d="M 72,29 L 106,29 L 112,36 L 72,36 Z" fill="rgba(255,255,255,0.12)" />
                  <path d="M 0,44 C 4,44 7,46 9,48 L 0,50 Z" fill="#e0f2fe" style="filter: drop-shadow(0 0 5px #00f5ff);" />
                  <path d="M 160,44 C 157,44 156,46 155,48 L 160,50 Z" fill="#ef4444" style="filter: drop-shadow(0 0 3px #ef4444);" />
                  <circle cx="32" cy="50" r="16" fill="#090d16" />
                  <circle cx="32" cy="50" r="10" fill="#475569" stroke="#cbd5e1" stroke-width="1.5" />
                  ${Array.from({ length: 6 }).map((_, idx) => {
                    const angle = (idx * Math.PI) / 3;
                    return svg`<line x1="32" y1="50" x2="${32 + Math.cos(angle) * 10}" y2="${50 + Math.sin(angle) * 10}" stroke="#cbd5e1" stroke-width="1.2" />`;
                  })}
                  <circle cx="118" cy="50" r="16" fill="#090d16" />
                  <circle cx="118" cy="50" r="10" fill="#475569" stroke="#cbd5e1" stroke-width="1.5" />
                  ${Array.from({ length: 6 }).map((_, idx) => {
                    const angle = (idx * Math.PI) / 3;
                    return svg`<line x1="118" y1="50" x2="${118 + Math.cos(angle) * 10}" y2="${50 + Math.sin(angle) * 10}" stroke="#cbd5e1" stroke-width="1.2" />`;
                  })}
                </g>
              ` : ''}
              ${carType === 'sedan' ? svg`
                <g transform="translate(500, 362)">
                  <ellipse cx="70" cy="48" rx="74" ry="4.5" fill="rgba(0,0,0,0.45)" />
                  <path
                    d="M 0,38 C 0,38 8,24 22,24 C 36,24 50,4 75,3 C 100,2 115,16 125,24 L 138,28 C 140,32 140,38 138,42 L 136,46 L 2,46 Z"
                    fill="url(#car-body-grad)"
                    stroke="rgba(255,255,255,0.2)"
                    stroke-width="1"
                  />
                  <path d="M 32,23 C 44,10 68,6 84,6 C 96,6 108,14 116,21 L 112,31 L 28,31 Z" fill="#0f172a" opacity="0.85" />
                  <path d="M 38,24 L 66,24 L 66,29 L 34,29 Z" fill="rgba(255,255,255,0.15)" />
                  <path d="M 70,24 L 102,24 L 108,29 L 70,29 Z" fill="rgba(255,255,255,0.15)" />
                  <path d="M 0,38 C 4,38 6,40 8,42 L 0,44 Z" fill="#e0f2fe" style="filter: drop-shadow(0 0 5px #00f5ff);" />
                  <path d="M 138,36 C 136,36 135,38 134,40 L 138,42 Z" fill="#ef4444" style="filter: drop-shadow(0 0 3px #ef4444);" />
                  <rect x="55" y="34" width="8" height="2" rx="1" fill="#1e293b" opacity="0.6" />
                  <rect x="85" y="34" width="8" height="2" rx="1" fill="#1e293b" opacity="0.6" />
                  <path d="M 28,32 C 24,32 23,30 25,30 Z" fill="url(#car-body-grad)" />
                  <circle cx="30" cy="44" r="13.5" fill="#090d16" />
                  <circle cx="30" cy="44" r="8.5" fill="#475569" stroke="#cbd5e1" stroke-width="1.5" />
                  ${Array.from({ length: 7 }).map((_, idx) => {
                    const angle = (idx * 2 * Math.PI) / 7;
                    return svg`<line x1="30" y1="44" x2="${30 + Math.cos(angle) * 8.5}" y2="${44 + Math.sin(angle) * 8.5}" stroke="#cbd5e1" stroke-width="1.2" />`;
                  })}
                  <circle cx="103" cy="44" r="13.5" fill="#090d16" />
                  <circle cx="103" cy="44" r="8.5" fill="#475569" stroke="#cbd5e1" stroke-width="1.5" />
                  ${Array.from({ length: 7 }).map((_, idx) => {
                    const angle = (idx * 2 * Math.PI) / 7;
                    return svg`<line x1="103" y1="44" x2="${103 + Math.cos(angle) * 8.5}" y2="${44 + Math.sin(angle) * 8.5}" stroke="#cbd5e1" stroke-width="1.2" />`;
                  })}
                </g>
              ` : ''}
              ${carType === 'suv' ? svg`
                <g transform="translate(500, 352)">
                  <ellipse cx="70" cy="58" rx="74" ry="5.5" fill="rgba(0,0,0,0.45)" />
                  <path d="M 15,56 A 17,17 0 0,1 47,56" fill="none" stroke="#1f2937" stroke-width="3" />
                  <path d="M 88,56 A 17,17 0 0,1 120,56" fill="none" stroke="#1f2937" stroke-width="3" />
                  <path
                    d="M 0,48 C 0,48 4,30 18,30 C 32,30 45,6 70,4 C 95,2 112,18 122,28 L 138,32 C 140,36 140,46 138,50 L 136,56 L 2,56 Z"
                    fill="url(#car-body-grad)"
                    stroke="rgba(255,255,255,0.2)"
                    stroke-width="1"
                  />
                  <path d="M 32,29 C 44,12 68,8 84,8 C 98,8 108,18 116,27 L 112,38 L 28,38 Z" fill="#0f172a" opacity="0.85" />
                  <path d="M 38,30 L 66,30 L 66,36 L 34,36 Z" fill="rgba(255,255,255,0.15)" />
                  <path d="M 70,30 L 102,30 L 108,36 L 70,36 Z" fill="rgba(255,255,255,0.15)" />
                  <path d="M 0,48 C 4,48 6,50 8,52 L 0,54 Z" fill="#e0f2fe" style="filter: drop-shadow(0 0 5px #00f5ff);" />
                  <path d="M 138,44 C 136,44 135,46 134,48 L 138,50 Z" fill="#ef4444" style="filter: drop-shadow(0 0 3px #ef4444);" />
                  <rect x="55" y="42" width="8" height="2" rx="1" fill="#1e293b" opacity="0.6" />
                  <rect x="85" y="42" width="8" height="2" rx="1" fill="#1e293b" opacity="0.6" />
                  <path d="M 28,32 C 24,32 23,30 25,30 Z" fill="url(#car-body-grad)" />
                  <circle cx="31" cy="54" r="15.5" fill="#090d16" />
                  <circle cx="31" cy="54" r="10" fill="#475569" stroke="#cbd5e1" stroke-width="1.5" />
                  ${Array.from({ length: 5 }).map((_, idx) => {
                    const angle = (idx * 2 * Math.PI) / 5;
                    return svg`<line x1="31" y1="54" x2="${31 + Math.cos(angle) * 10}" y2="${54 + Math.sin(angle) * 10}" stroke="#cbd5e1" stroke-width="1.5" />`;
                  })}
                  <circle cx="104" cy="54" r="15.5" fill="#090d16" />
                  <circle cx="104" cy="54" r="10" fill="#475569" stroke="#cbd5e1" stroke-width="1.5" />
                  ${Array.from({ length: 5 }).map((_, idx) => {
                    const angle = (idx * 2 * Math.PI) / 5;
                    return svg`<line x1="104" y1="54" x2="${104 + Math.cos(angle) * 10}" y2="${54 + Math.sin(angle) * 10}" stroke="#cbd5e1" stroke-width="1.5" />`;
                  })}
                </g>
              ` : ''}
            </g>
          ` : ''}

          <!-- ── FLOW CABLES (Rendered inside the y+70 group) ── -->
          ${showSolar ? renderCable(
            solarPath,
            solarActive, getFlowSpeed(solar), COLORS.solar.stroke, COLORS.solar.glow
          ) : ''}

          <!-- Grid cable: underground from transformer box to meterkast (no pylon-to-box cable) -->
          ${renderCable(gridPath, gridImporting || gridExporting, getFlowSpeed(grid), gridColor.stroke, gridColor.glow, gridExporting)}

          ${showBattery ? renderCable(
            batteryPath,
            batteryCharging || batteryDischarging, getFlowSpeed(batteryPower), batColor.stroke, batColor.glow,
            batteryCharging
          ) : ''}

          ${showEV ? renderCable(
            evPath,
            evActive, getFlowSpeed(charger), COLORS.ev.stroke, COLORS.ev.glow
          ) : ''}

        </g>
        <!-- End of translate group -->

        <!-- Lightning Screen Flashes -->
        ${visualWeather === 'lightning' ? svg`
          <rect width="${width}" height="${height}" fill="#fde047" opacity="0" style="mix-blend-mode: overlay; pointer-events: none; animation: lightningFlash 4s infinite;" />
        ` : ''}

        <!-- Fog overlay -->
        ${visualWeather === 'foggy' ? svg`
          <rect width="${width}" height="${height}" fill="rgba(203, 213, 225, 0.45)" style="filter: blur(8px); pointer-events: none;" />
          <rect width="${width}" height="${height}" fill="rgba(241, 245, 249, 0.25)" style="filter: blur(4px); pointer-events: none;" />
        ` : ''}

        <!-- ════════════════════════════════════════════════════════════════ -->
        <!-- WEATHER HUD CARD (Top left sky area, aligned with Stroomnet)    -->
        <!-- ════════════════════════════════════════════════════════════════ -->
        ${weather ? svg`
          <g class="interactiveGroup weatherGroup" @click=${() => onNodeClick('weather')}>
            <g transform="translate(${width - 190}, 20)">
              <rect x="0" y="0" width="170" height="65"
                class="hudCard"
                rx="8" ry="8" />
              <text x="12" y="20" class="hudTitle">Weer</text>
              <text x="12" y="39" class="hudValue">
                ${temperature !== null ? `${temperature.toFixed(1)} °C` : '—'}
              </text>
              <text x="12" y="53" class="hudSub">
                ${WEATHER_TRANSLATIONS[weather] || weather}
              </text>
            </g>
          </g>
        ` : ''}

        <!-- ════════════════════════════════════════════════════════════════ -->
        <!-- SOLAR HUD CARD (Top right sky area, dynamically aligned)        -->
        <!-- ════════════════════════════════════════════════════════════════ -->
        ${showSolar ? svg`
          <g class="interactiveGroup solarGroup" @click=${() => onNodeClick('solar')}>
            <!-- Solar panels are at design x=320, y=270 (inside translate group)
                 So SVG x = translateX+320, SVG y = translateY+270
                 Card goes LEFT of the panels at the same roof height -->
            <g transform="translate(${translateX + 130}, ${translateY + 90})">
              <rect x="0" y="0" width="170" height="65"
                class="hudCard ${solarActive ? 'hudCardActive' : ''}"
                rx="8" ry="8"
                style="${solarActive ? `color: ${COLORS.solar.stroke}` : ''}" />
              <text x="12" y="20" class="hudTitle">Zonnepanelen</text>
              <text x="12" y="39" class="hudValue ${solarActive ? 'hudActiveText' : ''}"
                style="${solarActive ? `color: ${COLORS.solar.stroke}` : ''}">
                ${solarActive ? formatPowerAbs(solar) : '—'}
              </text>
              <text x="12" y="53" class="hudSub">
                ${solarToday !== null ? `Vandaag: ${solarToday.toFixed(1)} kWh` : (solarActive ? 'Opwek actief' : 'Geen opwek')}
              </text>
            </g>
          </g>
        ` : ''}

        <!-- ════════════════════════════════════════════════════════════════ -->
        <!-- BOTTOM HUD CARDS (using dynamic gaps & screen bottom alignment) -->
        <!-- ════════════════════════════════════════════════════════════════ -->
        <!-- ════════════════════════════════════════════════════════════════ -->
        <!-- BOTTOM HUD CARDS (Static positions aligned to house elements)   -->
        <!-- ════════════════════════════════════════════════════════════════ -->
        <!-- ── HUD CARDS positie-uitleg ─────────────────────────────────────────────
             De mast staat altijd op SVG x=20 (ongeacht schermgrootte),
             want mastX = 20-translateX en de mast zit IN de translate-groep.
             Huiselementen: SVG x = translateX + design_x
               - Accu:     design x=280  → translateX+280
               - Meterkast: mkX=345      → translateX+345
               - Laadpaal:  design x=455 → translateX+455
             Cards zijn 170px breed, gecentreerd op het element.
        ──────────────────────────────────────────────────────────────────────────── -->

        <!-- 1. Stroomnet — onder de masten (mast is altijd op SVG x=20) -->
        <g class="interactiveGroup gridGroup" @click=${() => onNodeClick('grid')}>
          <g transform="translate(20, ${height - 75})">
            <rect x="0" y="0" width="170" height="65"
              class="hudCard ${gridImporting || gridExporting ? 'hudCardActive' : ''}"
              rx="8" ry="8"
              style="${gridImporting || gridExporting ? `color: ${gridColor.stroke}` : ''}" />
            <text x="12" y="20" class="hudTitle">Stroomnet</text>
            ${gridPriceLabel ? svg`
              <text x="158" y="20" class="hudTitle" text-anchor="end" fill="#fbbf24" font-weight="bold">${gridPriceLabel}</text>
            ` : ''}
            <text x="12" y="39" class="hudValue ${gridImporting || gridExporting ? 'hudActiveText' : ''}"
              style="${gridImporting || gridExporting ? `color: ${gridColor.stroke}` : ''}">
              ${gridImporting || gridExporting ? formatPowerAbs(grid) : '—'}
            </text>
            <text x="12" y="53" class="hudSub">${gridSub}</text>
          </g>
        </g>

        <!-- 2. Thuisaccu — ruimte gereserveerd onder de accupositie (design x=280, SVG x=translateX+280) -->
        ${showBattery ? svg`
          <g class="interactiveGroup batteryGroup" @click=${() => onNodeClick('battery')}>
            <g transform="translate(${translateX + 195}, ${height - 75})">
              <rect x="0" y="0" width="170" height="65"
                class="hudCard ${batteryCharging || batteryDischarging ? 'hudCardActive' : ''}"
                rx="8" ry="8"
                style="${batteryCharging || batteryDischarging ? `color: ${batColor.stroke}` : ''}" />
              <text x="12" y="20" class="hudTitle">Thuisaccu</text>
              <text x="12" y="39" class="hudValue ${batteryCharging || batteryDischarging ? 'hudActiveText' : ''}"
                style="${batteryCharging || batteryDischarging ? `color: ${batColor.stroke}` : ''}">
                ${batteryCharging || batteryDischarging ? formatPowerAbs(batteryPower) : 'Standby'}
              </text>
              <text x="12" y="53" class="hudSub">${batterySub}</text>
            </g>
          </g>
        ` : ''}

        <!-- 3. Huisverbruik — onder de meterkast (mkX=345, gecentreerd: translateX+345-85=translateX+260) -->
        <g class="interactiveGroup homeGroup" @click=${() => onNodeClick('home')}>
          <g transform="translate(${translateX + 260}, ${height - 75})">
            <rect x="0" y="0" width="170" height="65"
              class="hudCard ${homeActive ? 'hudCardActive' : ''}"
              rx="8" ry="8"
              style="${homeActive ? `color: ${COLORS.home.stroke}` : ''}" />
            <text x="12" y="20" class="hudTitle">Huisverbruik</text>
            <text x="12" y="39" class="hudValue ${homeActive ? 'hudActiveText' : ''}"
              style="${homeActive ? `color: ${COLORS.home.stroke}` : ''}">
              ${homeActive ? formatPowerAbs(load) : '—'}
            </text>
            <text x="12" y="53" class="hudSub">${homeSub}</text>
          </g>
        </g>

        <!-- 4. Laadpaal (EV) — onder de laadpaal (design x=455, gecentreerd: translateX+455-85=translateX+370) -->
        ${showEV ? svg`
          <g class="interactiveGroup evGroup" @click=${() => onNodeClick('ev')}>
            <g transform="translate(${translateX + 370}, ${height - 75})">
              <rect x="0" y="0" width="170" height="65"
                class="hudCard ${evActive ? 'hudCardActive' : ''}"
                rx="8" ry="8"
                style="${evActive ? `color: ${COLORS.ev.stroke}` : ''}" />
              <text x="12" y="20" class="hudTitle">Laadpaal (EV)</text>
              <text x="12" y="39" class="hudValue ${evActive ? 'hudActiveText' : ''}"
                style="${evActive ? `color: ${COLORS.ev.stroke}` : ''}">
                ${evActive ? formatPowerAbs(charger) : '—'}
              </text>
              <text x="12" y="53" class="hudSub">${evSub}</text>
            </g>
          </g>
        ` : ''}
      </g>
    </svg>
  `;
}
