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

function renderRain(): TemplateResult {
  return svg`
    <g style="pointer-events: none;">
      ${Array.from({ length: 45 }).map((_, i) => svg`
        <line x1="${15 + i * 21}" y1="0" x2="${-2 + i * 21}" y2="40"
          class="rainDrop"
          style="animation-delay: ${(i % 7) * 0.12}s; animation-duration: ${0.9 + (i % 4) * 0.12}s;" />
      `)}
    </g>
  `;
}

function renderSnow(): TemplateResult {
  return svg`
    <g style="pointer-events: none;">
      ${Array.from({ length: 40 }).map((_, i) => svg`
        <circle cx="${15 + i * 24}" cy="0" r="${1.8 + (i % 4) * 0.6}"
          class="snowFlake"
          style="animation-delay: ${(i % 8) * 0.4}s; animation-duration: ${3.5 + (i % 5) * 0.6}s;" />
      `)}
    </g>
  `;
}

interface SvgParams {
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
  onNodeClick: (node: string) => void;
}

export function renderHouseSvg({
  houseStyle = 'classic-jaren30',
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
  onNodeClick
}: SvgParams): TemplateResult {

  // Normalize timeHour so sunrise=6.0 and sunset=21.0
  let timeHour = rawTimeHour;
  if (rawTimeHour >= sunriseHour && rawTimeHour <= sunsetHour) {
    timeHour = 6.0 + ((rawTimeHour - sunriseHour) / (sunsetHour - sunriseHour)) * 15.0;
  } else if (rawTimeHour > sunsetHour) {
    timeHour = 21.0 + ((rawTimeHour - sunsetHour) / (24.0 - sunsetHour)) * 3.0;
  } else {
    timeHour = (rawTimeHour / sunriseHour) * 6.0;
  }

  // Na normalisatie in energy-flow-card.ts: batteryPower > 0 = laden, < 0 = ontladen
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
  const showLights = skyState.lights > 0.05 || weather === 'rainy' || weather === 'lightning';

  // Sky colors with weather adaptation
  let skyTop = skyState.top;
  let skyHorizon = skyState.horizon;
  let cloudColor = skyState.clouds;
  let cloudOpacity = timeOfDay === 'night' ? 0.18 : 0.48;

  if (weather === 'cloudy') {
    cloudColor = '#cbd5e1'; // Light grey clouds
    // skyTop stays blue — lucht blijft blauw bij bewolkt
    skyHorizon = interpolateColor(skyState.horizon, '#94a3b8', 0.15); // Licht gedempt, maar blauw
    cloudOpacity = 0.98;
  } else if (weather === 'rainy' || weather === 'lightning') {
    cloudColor = '#1f2937'; // Very dark grey clouds for rain
    skyTop = cloudColor;
    skyHorizon = interpolateColor(skyState.horizon, '#334155', 0.5);
    cloudOpacity = 0.99;
  } else if (weather === 'snowy') {
    cloudColor = '#334155'; // Dark grey for snow
    skyTop = cloudColor;
    skyHorizon = interpolateColor(skyState.horizon, '#4a5568', 0.4);
    cloudOpacity = 0.98;
  } else if (weather === 'foggy') {
    skyTop = interpolateColor(skyState.top, '#64748b', 0.65);
    skyHorizon = interpolateColor(skyState.horizon, '#94a3b8', 0.65);
    cloudColor = 'rgba(203, 213, 225, 0.4)';
    cloudOpacity = 0.50;
  }

  // ── Sun trajectory (HACS viewBox: 960x590, content in translate(0,84) group) ──
  // Ground at y=576 (=480*1.2), top of content at y=84 (=70*1.2)
  // Sun arc: from edge to edge with a peak well above the house roof (~y=100)
  const isSunVisible = timeHour >= 6.0 && timeHour <= 21.0 && weather !== 'rainy' && weather !== 'lightning' && weather !== 'cloudy' && weather !== 'snowy' && weather !== 'foggy';
  const sunPos = { cx: 480, cy: 600 };
  let sunOpacity = 0;
  let sunColor = '#fef08a';
  let sunGlow = 'rgba(254, 240, 138, 0.65)';

  if (isSunVisible) {
    const tSun = (timeHour - 6.0) / 15.0;
    sunPos.cx = -60 + tSun * 1080;
    sunPos.cy = 576 - Math.sin(tSun * Math.PI) * 528;
    sunOpacity = Math.max(0, Math.min(1.0, Math.sin(tSun * Math.PI) * 1.5));
    const fSun = Math.sin(tSun * Math.PI);
    sunColor = interpolateColor('#ea580c', '#fef08a', fSun);
    sunGlow = interpolateColor('rgba(234, 88, 12, 0.65)', 'rgba(254, 240, 138, 0.75)', fSun);
  }

  // ── Moon trajectory ──
  const isMoonVisible = (timeHour > 21.0 || timeHour < 6.0) && weather !== 'rainy' && weather !== 'lightning' && weather !== 'cloudy' && weather !== 'snowy' && weather !== 'foggy';
  const moonPos = { cx: 480, cy: 600 };
  let moonOpacity = 0;

  if (isMoonVisible) {
    const tMoon = timeHour > 21.0 ? (timeHour - 21.0) / 9.0 : (timeHour + 3.0) / 9.0;
    moonPos.cx = -60 + tMoon * 1080;
    moonPos.cy = 576 - Math.sin(tMoon * Math.PI) * 480;
    moonOpacity = Math.max(0, Math.min(0.9, Math.sin(tMoon * Math.PI) * 1.8));
  }

  // ── Window appearance ──
  // Day: reflective grey-blue; Night: warm amber glow
  const isDay = timeHour >= 8.0 && timeHour <= 18.0;
  const windowFill = isDay
    ? 'url(#window-day)'
    : (showLights ? 'url(#window-night)' : 'url(#window-dark)');
  const windowFilter = isDay
    ? 'none'
    : (showLights ? 'drop-shadow(0 0 6px rgba(251, 191, 36, 0.45))' : 'none');

  // ── Coordinate system ──
  // HACS SVG: 960×590. We scale Card-2 coordinates (800×600 with translate(0,70)) by 1.2×.
  // All coordinates below are in the 1.2-scaled space. The house group sits inside a
  // `<g transform="scale(1.2) translate(0,0)">` that wraps from line ~580 to ~750.

  // Cable paths use the scaled coordinate space (multiply Card-2 coords by 1.2)
  // Card-2: mkX=345, mkY=350; in translate(0,70) group → screen y = 420
  // Scaled: mkX=414, mkY=504 (350+70)*1.2 = 504; OR think of it as 345*1.2=414, (350+70)*1.2=504
  // But since these are inside the scale(1.2) group, we use unscaled coords: mkX=345, mkY=420
  // Cable paths are OUTSIDE the scaled group, so we must use visual (scaled) coordinates.
  const sx = (x: number) => 450 + 1.15 * (x - 450);
  const sy = (y: number) => 480 + 1.15 * (y - 480);

  const mkX = Math.round(sx(355));
  const mkY = Math.round(sy(432.5));

  const isJaren30 = houseStyle === 'classic-jaren30';
  const batX = isJaren30 ? 600 : 545;

  const gridPath = `M 192,455 L 192,493 L ${mkX},493 L ${mkX},${mkY}`;

  const solarPath = `M ${Math.round(sx(320))},${Math.round(sy(340))} L ${Math.round(sx(320))},${Math.round(sy(370))} L ${mkX},${Math.round(sy(370))} L ${mkX},${mkY}`;

  const batteryPath = `M ${sx(310)},${sy(420)} L ${mkX},${mkY}`;
  const evPath = `M ${mkX},${mkY} L ${mkX},503 L 664,503 L 664,415`;

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

  const evSub = evToday !== null ? `Vandaag: ${evToday.toFixed(1)} kWh` : (evActive ? 'Bezig met laden' : 'Standby');

  // Bottom cards: grid, home, and conditionally battery, EV
  interface CardConfig { id: string; title: string; value: string; sub: string; color: string; active: boolean; }
  const bottomCards: CardConfig[] = [
    { id: 'grid',  title: 'Stroomnet',    value: formatPowerAbs(grid),        sub: gridSub,    color: gridColor.stroke,       active: gridImporting || gridExporting },
    { id: 'home',  title: 'Huisverbruik', value: formatPowerAbs(load),        sub: homeSub,    color: COLORS.home.stroke,     active: homeActive },
  ];
  if (showBattery) bottomCards.push({ id: 'battery', title: 'Thuisaccu', value: formatPowerAbs(batteryPower), sub: batterySub, color: batColor.stroke, active: batteryCharging || batteryDischarging });
  if (showEV)      bottomCards.push({ id: 'ev', title: 'Laadpaal (EV)', value: formatPowerAbs(charger), sub: evSub, color: COLORS.ev.stroke, active: evActive });

  const cardWidth = 170;
  const totalWidth = bottomCards.length * cardWidth;
  const remainingWidth = 960 - totalWidth;
  const gap = remainingWidth / (bottomCards.length + 1);

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



  return svg`
    <svg viewBox="0 0 960 590" xmlns="http://www.w3.org/2000/svg">
      <defs>
        <!-- Sky gradient -->
        <linearGradient id="sky-grad" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stop-color="${skyTop}" />
          <stop offset="100%" stop-color="${skyHorizon}" />
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

        <linearGradient id="car-body-grad" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stop-color="#38bdf8" />
          <stop offset="100%" stop-color="#0284c7" />
        </linearGradient>

        <linearGradient id="lamp-light-grad" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stop-color="#fde047" stop-opacity="0.75" />
          <stop offset="100%" stop-color="#fde047" stop-opacity="0" />
        </linearGradient>

        <pattern id="soldier-course" width="8" height="10" patternUnits="userSpaceOnUse">
          <rect x="0" y="0" width="4" height="10" fill="#fcd34d" />
          <rect x="4" y="0" width="4" height="10" fill="#b91c1c" />
          <line x1="0" y1="0" x2="0" y2="10" stroke="#7f1d1d" stroke-width="0.5" />
          <line x1="4" y1="0" x2="4" y2="10" stroke="#7f1d1d" stroke-width="0.5" />
        </pattern>

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

        <!-- Brick texture pattern -->
        <pattern id="brick-pat" width="60" height="40" patternUnits="userSpaceOnUse">
          <!-- Layer 1: full orange-brown field -->
          <rect width="60" height="40" fill="#8b4513" />
          <!-- Brick row 1 (offset 0) -->
          <rect x="0"  y="1"  width="27" height="17" fill="#c1440e" rx="0.5" />
          <rect x="31" y="1"  width="29" height="17" fill="#b33a0a" rx="0.5" />
          <!-- Brick row 2 (offset half) -->
          <rect x="0"  y="22" width="13" height="17" fill="#bf3e0c" rx="0.5" />
          <rect x="16" y="22" width="28" height="17" fill="#c64812" rx="0.5" />
          <rect x="48" y="22" width="12" height="17" fill="#b83c0c" rx="0.5" />
          <!-- Mortar lines -->
          <line x1="0"  y1="19" x2="60" y2="19" stroke="#5a3214" stroke-width="1.5" />
          <line x1="0"  y1="20" x2="60" y2="20" stroke="#5a3214" stroke-width="0.5" opacity="0.4" />
          <line x1="0"  y1="40" x2="60" y2="40" stroke="#5a3214" stroke-width="1.5" />
          <line x1="29" y1="1"  x2="29" y2="19" stroke="#5a3214" stroke-width="1.5" />
          <line x1="14" y1="22" x2="14" y2="39" stroke="#5a3214" stroke-width="1.5" />
          <line x1="46" y1="22" x2="46" y2="39" stroke="#5a3214" stroke-width="1.5" />
        </pattern>

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
          <rect width="960" height="590" rx="12" ry="12" />
        </clipPath>
      </defs>

      <g clip-path="url(#scene-clip)">
        <!-- Sky background -->
        <rect width="960" height="590" fill="url(#sky-grad)" />

        <!-- Stars -->
        ${skyState.stars > 0.05 && weather !== 'rainy' && weather !== 'lightning' && weather !== 'cloudy' ? svg`
          <g opacity="${skyState.stars}" style="pointer-events: none;">
            <circle cx="96"  cy="60"  r="1.2" class="starFast" fill="#ffffff" />
            <circle cx="216" cy="114" r="1.5" fill="#ffffff" />
            <circle cx="408" cy="48"  r="1.0" class="starFast" fill="#ffffff" />
            <circle cx="576" cy="132" r="1.8" fill="#ffffff" />
            <circle cx="744" cy="78"  r="1.2" class="starFast" fill="#ffffff" />
            <circle cx="876" cy="144" r="1.0" fill="#ffffff" />
            <circle cx="312" cy="90"  r="1.4" class="starMed"  fill="#ffffff" />
            <circle cx="660" cy="55"  r="1.1" class="starSlow" fill="#ffffff" />
          </g>
        ` : ''}

        <!-- Dynamic Sun -->
        ${sunOpacity > 0 ? svg`
          <g style="pointer-events: none;">
            <circle cx="${sunPos.cx}" cy="${sunPos.cy}" r="54" fill="${sunColor}" opacity="${sunOpacity * 0.15}" style="filter: blur(8px);" />
            <circle cx="${sunPos.cx}" cy="${sunPos.cy}" r="26" fill="${sunColor}" opacity="${sunOpacity}" style="filter: drop-shadow(0 0 14px ${sunGlow});" />
          </g>
        ` : ''}

        <!-- Dynamic Moon -->
        ${moonOpacity > 0 ? svg`
          <g style="pointer-events: none;" opacity="${moonOpacity}">
            <circle cx="${moonPos.cx}" cy="${moonPos.cy}" r="30" fill="#e2e8f0" opacity="0.15" style="filter: blur(4px);" />
            <circle cx="${moonPos.cx}" cy="${moonPos.cy}" r="17" fill="#f1f5f9" />
            <circle cx="${moonPos.cx + 6}" cy="${moonPos.cy - 4}" r="16" fill="url(#sky-grad)" />
          </g>
        ` : ''}

        <!-- Falling precipitation -->
        ${weather === 'rainy' ? renderRain() : ''}
        ${weather === 'snowy' ? renderSnow() : ''}

        <!-- Cloud layers -->
        <g opacity="${cloudOpacity}" style="pointer-events: none;">
          ${(weather === 'cloudy' || weather === 'rainy' || weather === 'lightning' || weather === 'snowy') ? svg`
            <path d="M 0,-10 L 960,-10 L 960,12 Q 945,18 930,12 Q 915,18 900,12 Q 885,18 870,12 Q 855,18 840,12 Q 825,18 810,12 Q 795,18 780,12 Q 765,18 750,12 Q 735,18 720,12 Q 705,18 690,12 Q 675,18 660,12 Q 645,18 630,12 Q 615,18 600,12 Q 585,18 570,12 Q 555,18 540,12 Q 525,18 510,12 Q 495,18 480,12 Q 465,18 450,12 Q 435,18 420,12 Q 405,18 390,12 Q 375,18 360,12 Q 345,18 330,12 Q 315,18 300,12 Q 285,18 270,12 Q 255,18 240,12 Q 225,18 210,12 Q 195,18 180,12 Q 165,18 150,12 Q 135,18 120,12 Q 105,18 90,12 Q 75,18 60,12 Q 45,18 30,12 Q 15,18 0,12 Z" fill="${cloudColor}" />
          ` : ''}
          ${(clouds || []).map(c => renderHDCloud(
            'customDriftCloud',
            0,
            c.y,
            c.scale,
            cloudColor,
            c.opacityMultiplier,
            `animation-duration: ${c.speed}s; animation-delay: ${c.delay}s;`
          ))}
        </g>

        <!-- Lightning bolts (background) -->
        ${weather === 'lightning' ? svg`
          <path d="M 504,72 L 468,180 L 516,180 L 444,312 L 480,312 L 420,456" class="lightningBolt" />
          <path d="M 220,50 L 190,130 L 220,130 L 170,220" class="lightningBolt" style="animation-delay: 1.5s; stroke-width: 2;" />
        ` : ''}

        <!-- ════════════════════════════════════════════════════════════════ -->
        <!-- GROUND & ELECTRICITY MAST: Outside scaled group                 -->
        <!-- ════════════════════════════════════════════════════════════════ -->
        <!-- Ground (full width) -->
        <rect x="0" y="480" width="630" height="110" fill="url(#garden-grad)" />
        <!-- Driveway -->
        <rect x="630" y="480" width="330" height="110" fill="url(#driveway-grad)" />
        <line x1="0" y1="480" x2="960" y2="480" class="horizonLine" />

        <!-- High-Voltage Electricity Mast (Resting on ground) -->
        <g id="electricity-mast" class="interactiveGroup gridGroup" @click=${() => onNodeClick('grid')}>
          <rect x="63" y="474" width="14" height="8" fill="#64748b" stroke="#475569" stroke-width="1.2" rx="1" />
          <rect x="163" y="474" width="14" height="8" fill="#64748b" stroke="#475569" stroke-width="1.2" rx="1" />

          <!-- Sagging HV transmission lines -->
          <path d="M -80,210 Q -15,230 50,250" fill="none" stroke="#334155" stroke-width="1.8" opacity="0.65" />
          <path d="M -80,215 Q 0,235 85,250" fill="none" stroke="#334155" stroke-width="1.8" opacity="0.65" />
          <path d="M -80,210 Q 30,230 155,250" fill="none" stroke="#334155" stroke-width="1.8" opacity="0.65" />
          <path d="M -80,215 Q 50,235 190,250" fill="none" stroke="#334155" stroke-width="1.8" opacity="0.65" />
          <path d="M -80,130 Q 20,150 120,170" fill="none" stroke="#475569" stroke-width="1.0" opacity="0.5" />

          <g stroke="#475569" stroke-width="2.8" fill="none" stroke-linecap="round" stroke-linejoin="round">
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

            <!-- Insulator strings -->
            <line x1="50" y1="160" x2="50" y2="175" stroke="#94a3b8" stroke-width="2.5" />
            <circle cx="50" cy="178" r="2" fill="#94a3b8" />
            <line x1="85" y1="160" x2="85" y2="175" stroke="#94a3b8" stroke-width="2.5" />
            <circle cx="85" cy="178" r="2" fill="#94a3b8" />
            <line x1="155" y1="160" x2="155" y2="175" stroke="#94a3b8" stroke-width="2.5" />
            <circle cx="155" cy="178" r="2" fill="#94a3b8" />
            <line x1="190" y1="160" x2="190" y2="175" stroke="#94a3b8" stroke-width="2.5" />
            <circle cx="190" cy="178" r="2" fill="#94a3b8" />
          </g>
        </g>

        <!-- Transformer/Distribution Box -->
        <g id="grid-transformer-box">
          <rect x="180" y="442" width="24" height="38" fill="#334155" stroke="#1e293b" stroke-width="1.5" rx="2" />
          <line x1="192" y1="442" x2="192" y2="480" stroke="#1e293b" stroke-width="0.8" />
          <circle cx="188" cy="462" r="1.5" fill="#1e293b" />
          <rect x="182" y="448" width="20" height="12" fill="#fef08a" stroke="#ca8a04" stroke-width="0.8" rx="1" />
          <polygon points="191,449 195,449 192,453 196,453 190,457 193,453 190,453" fill="#ca8a04" />
        </g>

        <!-- ════════════════════════════════════════════════════════════════ -->
        <!-- HOUSE & APPLIANCES: Scaled around center of base (450, 480)      -->
        <!-- ════════════════════════════════════════════════════════════════ -->
        <g transform="translate(450, 480) scale(1.15) translate(-450, -480)">

          <!-- ── HOUSE DESIGNS ── -->
          <g id="house-structure" class="interactiveGroup homeGroup" @click=${() => onNodeClick('home')}>
            ${false ? svg`
              <!-- Plinth / Foundation Base -->
              <rect x="290" y="455" width="20" height="25" fill="#2d3748" stroke="#1a202c" stroke-width="0.8" />
              <rect x="345" y="455" width="245" height="25" fill="#2d3748" stroke="#1a202c" stroke-width="0.8" />
              <line x1="290" y1="467" x2="310" y2="467" stroke="#1a202c" stroke-width="0.5" opacity="0.4" />
              <line x1="345" y1="467" x2="590" y2="467" stroke="#1a202c" stroke-width="0.5" opacity="0.4" />

              <!-- Left Gevel Wall (Textured Cedar planks) -->
              <rect x="290" y="300" width="90" height="155" fill="#c2410c" stroke="#78350f" stroke-width="0.8" />
              ${Array.from({ length: 8 }).map((_, i) => svg`
                <line x1="${300 + i * 10}" y1="300" x2="${300 + i * 10}" y2="455" stroke="#451a03" stroke-width="0.8" opacity="0.35" />
              `)}

              <!-- Right Gevel Wall (White Stucco) -->
              <rect x="380" y="300" width="210" height="155" fill="#f8fafc" stroke="#cbd5e1" stroke-width="0.8" />
              <line x1="380" y1="330" x2="590" y2="330" stroke="#cbd5e1" stroke-width="0.5" opacity="0.4" />
              <line x1="380" y1="360" x2="590" y2="360" stroke="#cbd5e1" stroke-width="0.5" opacity="0.4" />
              <line x1="380" y1="390" x2="590" y2="390" stroke="#cbd5e1" stroke-width="0.5" opacity="0.4" />
              <line x1="380" y1="420" x2="590" y2="420" stroke="#cbd5e1" stroke-width="0.5" opacity="0.4" />

              <!-- Entrance Plant Pot & Monstera -->
              <g id="entrance-plant">
                <polygon points="294,455 304,455 302,446 296,446" fill="#1e293b" />
                <path d="M 298,446 Q 289,435 292,430 Q 297,430 298,440" fill="#22c55e" />
                <path d="M 298,446 Q 305,432 302,427 Q 297,427 298,440" fill="#16a34a" />
                <path d="M 298,446 Q 293,437 296,436" stroke="#15803d" stroke-width="2.0" fill="none" stroke-linecap="round" />
              </g>

              <!-- Voordeur (Front Door - Starts on ground, y=480) -->
              <g id="house-door">
                <rect x="310" y="380" width="35" height="100" fill="#78350f" stroke="#451a03" stroke-width="1.5" rx="1.5" />
                <line x1="337" y1="410" x2="337" y2="435" stroke="#cbd5e1" stroke-width="1.8" stroke-linecap="round" />
                <rect x="317" y="390" width="6" height="70" fill="${showLights ? '#fde047' : '#1e293b'}" stroke="#451a03" stroke-width="0.8" style="fill: ${showLights ? `rgba(253, 224, 71, ${skyState.lights})` : '#1e293b'}; filter: ${showLights ? `drop-shadow(0 0 4px rgba(253, 224, 71, ${skyState.lights}))` : 'none'}; transition: fill 0.5s ease;" />
                <rect x="305" y="375" width="45" height="5" fill="#334155" stroke="#1e293b" stroke-width="0.8" rx="1" />
              </g>

              <!-- Roof Structure -->
              <polygon points="270,300 440,200 610,300" fill="#1e293b" stroke="#0f172a" stroke-width="1.5" />
              <line x1="270" y1="300" x2="440" y2="200" stroke="#0f172a" stroke-width="3.5" />
              <line x1="610" y1="300" x2="440" y2="200" stroke="#0f172a" stroke-width="3.5" />
              <rect x="265" y="297" width="350" height="6" fill="#64748b" rx="2" />
              <path d="M 610,303 L 610,455 L 613,458" stroke="#64748b" stroke-width="2.5" fill="none" stroke-linecap="round" stroke-linejoin="round" />

              <!-- Solar Panel Array -->
              <g transform="translate(440, 200) rotate(30.5)">
                <rect x="15" y="-12" width="130" height="10" fill="url(#solar-panel-grad)" stroke="#1e1b4b" stroke-width="1.5" rx="2" />
                <line x1="45" y1="-12" x2="45" y2="-2" stroke="#3b82f6" stroke-width="0.5" opacity="0.3" />
                <line x1="85" y1="-12" x2="85" y2="-2" stroke="#3b82f6" stroke-width="0.5" opacity="0.3" />
                <line x1="15" y1="-7" x2="145" y2="-7" stroke="#3b82f6" stroke-width="0.5" opacity="0.3" />
              </g>

              <!-- Windows -->
              <rect x="395" y="380" width="130" height="70" fill="${windowFill}" stroke="#334155" stroke-width="2.5" style="filter: ${windowFilter}; transition: fill 0.5s ease, filter 0.5s ease;" rx="3" />
              <g opacity="${skyState.lights}">
                <line x1="460" y1="380" x2="460" y2="400" stroke="#334155" stroke-width="1" />
                <path d="M 450,405 L 470,405 L 460,400 Z" fill="#334155" />
                <circle cx="460" cy="406" r="4.5" fill="#ffffff" style="filter: drop-shadow(0 0 8px #fde047);" />
                <polygon points="505,415 485,450 525,450" fill="url(#lamp-light-grad)" opacity="0.35" />
                <line x1="505" y1="450" x2="505" y2="415" stroke="#334155" stroke-width="1" />
                <polygon points="498,415 512,415 509,409 501,409" fill="#475569" />
              </g>
              <g opacity="${1.0 - skyState.lights}">
                <polygon points="395,415 420,380 435,380 395,435" fill="rgba(255,255,255,0.06)" style="pointer-events: none;" />
                <polygon points="445,450 495,380 510,380 460,450" fill="rgba(255,255,255,0.06)" style="pointer-events: none;" />
              </g>
              <line x1="460" y1="380" x2="460" y2="450" stroke="#0f172a" stroke-width="1.5" />
              <line x1="395" y1="415" x2="525" y2="415" stroke="#0f172a" stroke-width="1.2" />

              <rect x="405" y="310" width="30" height="45" fill="${windowFill}" stroke="#334155" stroke-width="2.0" style="filter: ${windowFilter};" rx="1.5" />
              <line x1="420" y1="310" x2="420" y2="355" stroke="#0f172a" stroke-width="1.2" />
              
              <rect x="485" y="310" width="30" height="45" fill="${windowFill}" stroke="#334155" stroke-width="2.0" style="filter: ${windowFilter};" rx="1.5" />
              <line x1="500" y1="310" x2="500" y2="355" stroke="#0f172a" stroke-width="1.2" />

              <circle cx="440" cy="255" r="13" fill="${windowFill}" stroke="#334155" stroke-width="2.0" style="filter: ${windowFilter};" />
              <line x1="440" y1="242" x2="440" y2="268" stroke="#0f172a" stroke-width="1" />
            ` : ''}

            ${false ? svg`
              <!-- Plinth (Bottom dark brick) -->
              <rect x="290" y="450" width="300" height="10" fill="#2d2524" stroke="#1b0000" stroke-width="0.8" />
              
              <!-- Main Wall (Red brick pentagon shape under roof) -->
              <polygon points="290,450 290,370 440,150 590,370 590,450" fill="#9a3412" />
              <polygon points="290,450 290,370 440,150 590,370 590,450" fill="url(#jaren30-brick-pat)" stroke="#7f1d1d" stroke-width="0.8" />
              
              <!-- Fine horizontal brick mortar lines across the pentagon -->
              ${Array.from({ length: 50 }).map((_, i) => {
                const y = 450 - i * 6;
                if (y < 150) return '';
                let x1 = 290;
                let x2 = 590;
                if (y < 370) {
                  x1 = 290 + (370 - y) * 0.682;
                  x2 = 590 - (370 - y) * 0.682;
                }
                return svg`<line x1="${x1}" y1="${y}" x2="${x2}" y2="${y}" stroke="#7f1d1d" stroke-width="0.5" opacity="0.4" />`;
              })}

              <!-- Left Side Entrance Extension (From Photo 3) -->
              <rect x="260" y="450" width="30" height="10" fill="#2d2524" stroke="#1b0000" stroke-width="0.8" />
              <rect x="260" y="370" width="30" height="80" fill="#9a3412" />
              <rect x="260" y="370" width="30" height="80" fill="url(#jaren30-brick-pat)" stroke="#7f1d1d" stroke-width="0.8" />
              <!-- Left side extension horizontal mortar lines -->
              ${Array.from({ length: 14 }).map((_, i) => {
                const y = 450 - i * 6;
                return svg`<line x1="260" y1="${y}" x2="290" y2="${y}" stroke="#7f1d1d" stroke-width="0.5" opacity="0.4" />`;
              })}
              <polygon points="255,370 290,355 290,370" fill="#1e293b" stroke="#0f172a" stroke-width="0.8" />
              <!-- White bargeboard on extension roof slope -->
              <line x1="255" y1="370" x2="290" y2="355" stroke="#f8fafc" stroke-width="2.5" />
              <!-- Side entrance door -->
              <rect x="264" y="380" width="22" height="65" fill="#1e293b" stroke="#0f172a" stroke-width="1" rx="1" />
              <rect x="272" y="385" width="6" height="30" fill="${showLights ? '#fde047' : '#0f172a'}" opacity="0.8" style="fill: ${showLights ? `rgba(253, 224, 71, ${skyState.lights})` : '#0f172a'}; transition: fill 0.5s ease;" />

              <!-- Soldier Course Accent Bands (Alternating red/yellow bricks filled with pattern) -->
              <!-- Ground floor windows header soldier course -->
              <rect x="290" y="362" width="300" height="10" fill="url(#soldier-course)" stroke="#7f1d1d" stroke-width="0.8" />
              <!-- First floor windows sill horizontal accent line -->
              <rect x="300" y="359" width="280" height="8" fill="url(#soldier-course)" stroke="#7f1d1d" stroke-width="0.8" />

              <!-- Downstairs Windows (Dark frames, white blinds from photos) -->
              <!-- Left Narrow Window -->
              <rect
                x="305"
                y="375"
                width="35"
                height="75"
                fill="${windowFill}"
                stroke="#0f172a"
                stroke-width="2.5"
                style="filter: ${windowFilter}; transition: fill 0.5s ease;"
                rx="1"
              />
              <rect x="307" y="377" width="31" height="22" fill="#cbd5e1" opacity="0.9" rx="0.5" />
              <line x1="305" y1="412.5" x2="340" y2="412.5" stroke="#0f172a" stroke-width="1.5" />

              <!-- Center Large Window -->
              <rect
                x="375"
                y="375"
                width="130"
                height="75"
                fill="${windowFill}"
                stroke="#0f172a"
                stroke-width="3.0"
                style="filter: ${windowFilter}; transition: fill 0.5s ease;"
                rx="1"
              />
              <rect x="377" y="377" width="126" height="22" fill="#cbd5e1" opacity="0.9" rx="0.5" />
              <line x1="375" y1="412.5" x2="505" y2="412.5" stroke="#0f172a" stroke-width="2.0" />

              <!-- Right Narrow Window -->
              <rect
                x="540"
                y="375"
                width="35"
                height="75"
                fill="${windowFill}"
                stroke="#0f172a"
                stroke-width="2.5"
                style="filter: ${windowFilter}; transition: fill 0.5s ease;"
                rx="1"
              />
              <rect x="542" y="377" width="31" height="22" fill="#cbd5e1" opacity="0.9" rx="0.5" />
              <line x1="540" y1="412.5" x2="575" y2="412.5" stroke="#0f172a" stroke-width="1.5" />

              <!-- First Floor Windows - Double casement style with black frames, placed inside triangle -->
              <rect
                x="355"
                y="312"
                width="45"
                height="46"
                fill="${windowFill}"
                stroke="#0f172a"
                stroke-width="2.5"
                style="filter: ${windowFilter}; transition: fill 0.5s ease;"
                rx="1"
              />
              <line x1="377.5" y1="312" x2="377.5" y2="358" stroke="#0f172a" stroke-width="1.8" />
              <!-- Left Window Lintel -->
              <rect x="355" y="302" width="45" height="10" fill="url(#soldier-course)" stroke="#7f1d1d" stroke-width="0.8" />
              
              <rect
                x="480"
                y="312"
                width="45"
                height="46"
                fill="${windowFill}"
                stroke="#0f172a"
                stroke-width="2.5"
                style="filter: ${windowFilter}; transition: fill 0.5s ease;"
                rx="1"
              />
              <line x1="502.5" y1="312" x2="502.5" y2="358" stroke="#0f172a" stroke-width="1.8" />
              <!-- Right Window Lintel -->
              <rect x="480" y="302" width="45" height="10" fill="url(#soldier-course)" stroke="#7f1d1d" stroke-width="0.8" />

              <!-- Gable Roof Framing & peak details -->
              <!-- White gutter/eave trim -->
              <rect x="280" y="367" width="320" height="6" fill="#f8fafc" rx="1" />
              <!-- White bargeboard trim framing the gable -->
              <line x1="290" y1="370" x2="440" y2="150" stroke="#f8fafc" stroke-width="5.0" stroke-linecap="round" />
              <line x1="590" y1="370" x2="440" y2="150" stroke="#f8fafc" stroke-width="5.0" stroke-linecap="round" />

              <!-- Dark peak horizontal wooden cladding (from photo) -->
              <polygon points="361.5,265 440,150 518.5,265" fill="#1e293b" stroke="#0f172a" stroke-width="1.2" />
              ${Array.from({ length: 20 }).map((_, idx) => {
                const y = 150 + idx * 6;
                if (y > 265) return '';
                const dx = (y - 150) * (78.5 / 115);
                const x1 = 440 - dx;
                const x2 = 440 + dx;
                return svg`<line x1="${x1}" y1="${y}" x2="${x2}" y2="${y}" stroke="#0f172a" stroke-width="0.8" opacity="0.45" />`;
              })}

              <!-- Chimney (seen in photos) -->
              <rect x="445" y="115" width="16" height="36" fill="#4a5568" stroke="#1a202c" stroke-width="1" />
              <rect x="442" y="110" width="22" height="6" fill="#1a202c" rx="0.5" />

              <!-- Solar panels on roof side (highly visible in photos 2 & 3, rotated parallel to steep roof) -->
              ${showSolar ? svg`
                <g transform="translate(440, 150) rotate(55.7)">
                  <rect x="15" y="-12" width="140" height="10" fill="url(#solar-panel-grad)" stroke="#1e1b4b" stroke-width="1.5" rx="2" />
                  <line x1="45" y1="-12" x2="45" y2="-2" stroke="#3b82f6" stroke-width="0.5" opacity="0.3" />
                  <line x1="85" y1="-12" x2="85" y2="-2" stroke="#3b82f6" stroke-width="0.5" opacity="0.3" />
                  <line x1="15" y1="-7" x2="155" y2="-7" stroke="#3b82f6" stroke-width="0.5" opacity="0.3" />
                </g>
              ` : ''}

              <!-- Hydrangea bushes (Right, from photo) -->
              <g id="front-garden-hydrangeas" style="pointer-events: none;">
                <circle cx="538" cy="450" r="10" fill="#15803d" />
                <circle cx="550" cy="448" r="12" fill="#16a34a" />
                <circle cx="565" cy="450" r="10" fill="#15803d" />
                <!-- Fluffy white hydrangea flowers -->
                <circle cx="536" cy="443" r="5" fill="#fef08a" opacity="0.9" />
                <circle cx="548" cy="439" r="7" fill="#ffffff" opacity="0.9" />
                <circle cx="560" cy="442" r="6" fill="#fef08a" opacity="0.9" />
                <circle cx="566" cy="445" r="4" fill="#ffffff" opacity="0.9" />
              </g>
            ` : ''}


            ${false ? svg`
              <rect x="290" y="455" width="300" height="25" fill="#1e293b" stroke="#0f172a" stroke-width="0.8" />
              <rect x="290" y="280" width="300" height="175" fill="#172554" stroke="#0f172a" stroke-width="1" />
              ${Array.from({ length: 26 }).map((_, i) => svg`
                <line x1="${300 + i * 11}" y1="280" x2="${300 + i * 11}" y2="455" stroke="#020617" stroke-width="0.8" opacity="0.45" />
              `)}
              <!-- Door -->
              <g id="house-door">
                <rect x="310" y="380" width="35" height="75" fill="#451a03" stroke="#020617" stroke-width="1.5" />
                <line x1="317" y1="395" x2="317" y2="435" stroke="#1e293b" stroke-width="2.5" stroke-linecap="round" />
              </g>
              <!-- Roof -->
              <polygon points="260,280 440,150 620,280" fill="#0f172a" stroke="#020617" stroke-width="2" />
              <line x1="260" y1="280" x2="440" y2="150" stroke="#334155" stroke-width="2.5" />
              <line x1="620" y1="280" x2="440" y2="150" stroke="#334155" stroke-width="2.5" />
              <!-- Solar panels -->
              <g transform="translate(440, 150) rotate(37.5)">
                <rect x="15" y="-12" width="135" height="10" fill="url(#solar-panel-grad)" stroke="#1e1b4b" stroke-width="1.5" rx="2" />
              </g>
              <!-- Tall window -->
              <rect x="395" y="270" width="120" height="180" fill="${windowFill}" stroke="#0f172a" stroke-width="3.0" style="filter: ${windowFilter}; transition: fill 0.5s ease;" rx="2" />
              <polygon points="395,270 440,220 485,270" fill="${windowFill}" stroke="#0f172a" stroke-width="2.0" style="filter: ${windowFilter};" />
              <line x1="440" y1="220" x2="440" y2="450" stroke="#0f172a" stroke-width="2" />
              <line x1="395" y1="330" x2="515" y2="330" stroke="#0f172a" stroke-width="1.5" />
              <line x1="395" y1="390" x2="515" y2="390" stroke="#0f172a" stroke-width="1.5" />
            ` : ''}

            ${false ? svg`
              <rect x="290" y="455" width="300" height="25" fill="#1e293b" stroke="#0f172a" stroke-width="0.8" />
              <rect x="290" y="320" width="90" height="135" fill="#64748b" stroke="#475569" stroke-width="1" />
              <line x1="290" y1="380" x2="380" y2="380" stroke="#475569" stroke-width="0.8" opacity="0.5" />
              <rect x="380" y="270" width="210" height="185" fill="#f8fafc" stroke="#cbd5e1" stroke-width="1" />
              <rect x="285" y="315" width="100" height="6" fill="#334155" rx="1.5" />
              <rect x="375" y="265" width="220" height="6" fill="#1e293b" rx="1.5" />
              <!-- Door -->
              <g id="house-door">
                <rect x="310" y="380" width="35" height="75" fill="#3b2314" stroke="#1c1009" stroke-width="1.5" />
                <line x1="337" y1="410" x2="337" y2="430" stroke="#cbd5e1" stroke-width="1.8" stroke-linecap="round" />
              </g>
              <!-- Solar panels -->
              <g id="cubist-solar-mounting">
                <line x1="445" y1="270" x2="545" y2="270" stroke="#334155" stroke-width="2.5" stroke-linecap="round" />
                <line x1="535" y1="270" x2="535" y2="242" stroke="#475569" stroke-width="2.0" />
                <line x1="455" y1="270" x2="455" y2="263" stroke="#475569" stroke-width="2.0" />
                <g transform="translate(440, 268) rotate(-15)">
                  <rect x="0" y="-10" width="110" height="10" fill="url(#solar-panel-grad)" stroke="#1e1b4b" stroke-width="1.5" rx="1" />
                  <line x1="27.5" y1="-10" x2="27.5" y2="0" stroke="#3b82f6" stroke-width="0.5" opacity="0.3" />
                  <line x1="55" y1="-10" x2="55" y2="0" stroke="#3b82f6" stroke-width="0.5" opacity="0.3" />
                  <line x1="82.5" y1="-10" x2="82.5" y2="0" stroke="#3b82f6" stroke-width="0.5" opacity="0.3" />
                  <line x1="0" y1="-5" x2="110" y2="-5" stroke="#3b82f6" stroke-width="0.5" opacity="0.3" />
                </g>
              </g>
              <!-- Windows -->
              <rect x="395" y="360" width="120" height="80" fill="${windowFill}" stroke="#0f172a" stroke-width="2.5" style="filter: ${windowFilter}; transition: fill 0.5s ease;" rx="1" />
              <line x1="435" y1="360" x2="435" y2="440" stroke="#0f172a" stroke-width="1.5" />
              <line x1="475" y1="360" x2="475" y2="440" stroke="#0f172a" stroke-width="1.5" />
              <rect x="395" y="290" width="120" height="50" fill="${windowFill}" stroke="#0f172a" stroke-width="2.0" style="filter: ${windowFilter}; transition: fill 0.5s ease;" rx="1" />
              <line x1="455" y1="290" x2="455" y2="340" stroke="#0f172a" stroke-width="1.5" />
            ` : ''}

            ${false ? svg`
              <rect x="290" y="455" width="300" height="25" fill="#292524" stroke="#1c1917" stroke-width="0.8" />
              <polygon points="290,230 440,150 590,230" fill="#292524" stroke="#1c1917" stroke-width="1.2" opacity="0.8" />
              <polygon points="290,230 320,230 320,200 350,200 350,170 380,170 380,140 500,140 500,170 530,170 530,200 560,200 560,230 590,230" fill="#44403c" stroke="#1c1917" stroke-width="1" />
              <rect x="290" y="230" width="300" height="225" fill="#44403c" stroke="#1c1917" stroke-width="1" />
              ${Array.from({ length: 32 }).map((_, i) => svg`
                <line x1="290" y1="${230 + i * 7}" x2="590" y2="${230 + i * 7}" stroke="#292524" stroke-width="0.5" opacity="0.35" />
              `)}
              <!-- Door -->
              <g id="house-door">
                <rect x="310" y="380" width="35" height="75" fill="#7c2d12" stroke="#431407" stroke-width="1.8" rx="1" />
                <line x1="337" y1="410" x2="337" y2="430" stroke="#cbd5e1" stroke-width="1.8" stroke-linecap="round" />
              </g>
              <!-- Solar panels -->
              <g transform="translate(440, 150) rotate(29.6)">
                <rect x="15" y="-12" width="120" height="10" fill="url(#solar-panel-grad)" stroke="#1e1b4b" stroke-width="1.5" rx="2" />
              </g>
              <!-- Windows -->
              <rect x="395" y="375" width="130" height="80" fill="${windowFill}" stroke="#f8fafc" stroke-width="2.5" style="filter: ${windowFilter}; transition: fill 0.5s ease;" rx="1" />
              <line x1="460" y1="375" x2="460" y2="455" stroke="#f8fafc" stroke-width="1.8" />
              <line x1="395" y1="415" x2="525" y2="415" stroke="#f8fafc" stroke-width="1.2" />
              ${[335, 420, 505].map((x) => svg`
                <rect x="${x}" y="290" width="35" height="60" fill="${windowFill}" stroke="#f8fafc" stroke-width="2.0" style="filter: ${windowFilter}; transition: fill 0.5s ease;" rx="1" />
                <line x1="${x + 17.5}" y1="290" x2="${x + 17.5}" y2="350" stroke="#f8fafc" stroke-width="1.2" />
              `)}
              ${[370, 460].map((x) => svg`
                <rect x="${x}" y="210" width="30" height="45" fill="${windowFill}" stroke="#f8fafc" stroke-width="1.8" style="filter: ${windowFilter}; transition: fill 0.5s ease;" rx="1" />
                <line x1="${x + 15}" y1="210" x2="${x + 15}" y2="255" stroke="#f8fafc" stroke-width="1" />
              `)}
            ` : ''}

            <!-- Fallback Default Brick House -->
            ${svg`
              <!-- LEFT WING -->
              <g id="left-wing">
                <rect x="180" y="370" width="140" height="110" fill="#9a3412" />
                <rect x="180" y="370" width="140" height="110" fill="url(#jaren30-brick-pat)" stroke="#0f172a" stroke-width="2" />
                <polygon points="175,370 205,330 320,330 320,370" fill="url(#tiles-pat)" stroke="#0f172a" stroke-width="2" />
                <line x1="172" y1="373" x2="205" y2="328" stroke="#0f172a" stroke-width="12" stroke-linecap="round" />
                <line x1="172" y1="373" x2="205" y2="328" stroke="#1e293b" stroke-width="8"  stroke-linecap="round" />
                <line x1="205" y1="330" x2="320" y2="330" stroke="#0f172a" stroke-width="8" />
                <line x1="205" y1="330" x2="320" y2="330" stroke="#1e293b" stroke-width="4" />
                <rect x="230" y="390" width="40" height="45" fill="${windowFill}" stroke="#0f172a" stroke-width="2" style="filter: ${windowFilter}; transition: fill 0.5s ease, filter 0.5s ease;" />
                <line x1="250" y1="390" x2="250" y2="435" stroke="#0f172a" stroke-width="1.2" />
                <line x1="230" y1="412.5" x2="270" y2="412.5" stroke="#0f172a" stroke-width="1.2" />
              </g>

              <!-- RIGHT WING -->
              <g id="right-wing">
                <polygon points="380,480 380,270 500,130 680,340 680,480" fill="#9a3412" />
                <polygon points="380,480 380,270 500,130 680,340 680,480" fill="url(#jaren30-brick-pat)" stroke="#0f172a" stroke-width="2" />
                <line x1="380" y1="270" x2="500" y2="130" stroke="#0f172a" stroke-width="12" stroke-linecap="round" />
                <line x1="380" y1="270" x2="500" y2="130" stroke="#1e293b" stroke-width="8"  stroke-linecap="round" />
                <line x1="692" y1="354" x2="500" y2="130" stroke="#0f172a" stroke-width="12" stroke-linecap="round" />
                <line x1="692" y1="354" x2="500" y2="130" stroke="#1e293b" stroke-width="8"  stroke-linecap="round" />
                <rect x="465" y="385" width="40" height="45" fill="${windowFill}" stroke="#0f172a" stroke-width="2" style="filter: ${windowFilter}; transition: fill 0.5s ease, filter 0.5s ease;" />
                <line x1="485" y1="385" x2="485" y2="430" stroke="#0f172a" stroke-width="1.2" />
                <line x1="465" y1="407.5" x2="505" y2="407.5" stroke="#0f172a" stroke-width="1.2" />
                <rect x="555" y="385" width="40" height="45" fill="${windowFill}" stroke="#0f172a" stroke-width="2" style="filter: ${windowFilter}; transition: fill 0.5s ease, filter 0.5s ease;" />
                <line x1="575" y1="385" x2="575" y2="430" stroke="#0f172a" stroke-width="1.2" />
                <line x1="555" y1="407.5" x2="595" y2="407.5" stroke="#0f172a" stroke-width="1.2" />
                <rect x="480" y="280" width="40" height="40" fill="${windowFill}" stroke="#0f172a" stroke-width="2" style="filter: ${windowFilter}; transition: fill 0.5s ease, filter 0.5s ease;" />
                <line x1="500" y1="280" x2="500" y2="320" stroke="#0f172a" stroke-width="1.2" />
                <line x1="480" y1="300" x2="520" y2="300" stroke="#0f172a" stroke-width="1.2" />
              </g>

              <!-- CENTER ENTRANCE GABLE -->
              <g id="center-portal">
                <polygon points="320,480 320,340 380,270 440,340 440,480" fill="#9a3412" />
                <polygon points="320,480 320,340 380,270 440,340 440,480" fill="url(#jaren30-brick-pat)" stroke="#0f172a" stroke-width="2" />
                <line x1="308" y1="354" x2="380" y2="270" stroke="#0f172a" stroke-width="12" stroke-linecap="round" />
                <line x1="308" y1="354" x2="380" y2="270" stroke="#1e293b" stroke-width="8"  stroke-linecap="round" />
                <line x1="452" y1="354" x2="380" y2="270" stroke="#0f172a" stroke-width="12" stroke-linecap="round" />
                <line x1="452" y1="354" x2="380" y2="270" stroke="#1e293b" stroke-width="8"  stroke-linecap="round" />
                <rect x="360" y="395" width="40" height="85" fill="#052e16" stroke="#021b0d" stroke-width="2" />
                <circle cx="390" cy="435" r="2" fill="#fbbf24" />
              </g>
            `}
          </g>

          <!-- ── SOLAR PANELS (conditional) ── -->
          ${showSolar ? svg`
            <g id="solar-panels" class="interactiveGroup solarGroup" @click=${(e: Event) => { e.stopPropagation(); onNodeClick('solar'); }}>
              <!-- Only render solar panels if it is the default wing house, since the custom styles have solar panels integrated on their roofs -->
              ${svg`
                <g transform="translate(320, 340) rotate(-49.4)">
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
              `}
            </g>
          ` : ''}

          <!-- ── METERKAST / INVERTER (fuse box & inverter combined) ── -->
          <g id="house-inverter">
            <rect x="350" y="420" width="10" height="25" fill="#1e293b" stroke="rgba(255,255,255,0.1)" stroke-width="0.8" rx="1" />
            <circle cx="355" cy="432.5" r="2.5" fill="${solarActive || batteryCharging || batteryDischarging || gridImporting || gridExporting || evActive ? '#10b981' : '#ef4444'}" style="transition: fill 0.6s ease;" />
          </g>

          <!-- ── BATTERY (conditional) ── -->
          ${showBattery ? svg`
            <g id="house-battery" class="interactiveGroup batteryGroup" @click=${(e: Event) => { e.stopPropagation(); onNodeClick('battery'); }}>
              <rect x="${batX}" y="410" width="35" height="70" fill="url(#battery-body-grad)" stroke="#cbd5e1" stroke-width="1" rx="4" />
              <rect x="${batX}" y="410" width="35" height="70" fill="none" stroke="rgba(255,255,255,0.25)" stroke-width="0.8" rx="4" />
              
              <rect x="${batX + 5}" y="418" width="25" height="12" fill="rgba(0,0,0,0.72)" rx="1.5" />
              <text x="${batX + 17.5}" y="427" text-anchor="middle" fill="${soc < 20 ? '#ef4444' : (batteryDischarging ? '#f97316' : '#10b981')}" font-size="8.5px" font-family="monospace" font-weight="bold" style="transition: fill 0.6s ease;">
                ${soc}%
              </text>
              
              <rect x="${batX + 16.5}" y="436" width="2" height="36" fill="rgba(0,0,0,0.4)" rx="0.5" />
              <rect x="${batX + 16.5}" y="${472 - 36 * (soc / 100)}" width="2" height="${36 * (soc / 100)}" fill="${soc < 20 ? '#ef4444' : (batteryDischarging ? '#f97316' : '#10b981')}" opacity="0.95" style="transition: y 0.8s ease, height 0.8s ease, fill 0.6s ease;" rx="0.5" />
            </g>
          ` : ''}

          <!-- ── EV CHARGER (conditional) ── -->
          ${showEV ? svg`
            <g id="ev-charger" class="interactiveGroup evGroup" @click=${(e: Event) => { e.stopPropagation(); onNodeClick('ev'); }}>
              <rect x="448" y="425" width="14" height="55" fill="#1e293b" rx="2" />
              <rect x="443" y="415" width="24" height="20" fill="#334155" stroke="#1e293b" stroke-width="1" rx="3" />
              <circle cx="455" cy="425" r="4"
                fill="${evActive ? '#a855f7' : '#10b981'}"
                style="filter: ${evActive ? 'drop-shadow(0 0 6px #a855f7)' : 'none'}; transition: fill 0.5s ease;" />
              <!-- Charging cable -->
              <path d="M 455,440 C 460,460 475,470 495,465" fill="none" stroke="#a855f7" stroke-width="2.5" stroke-dasharray="4,3" />
            </g>

            <!-- EV Car -->
            <g id="ev-car" class="interactiveGroup evGroup" opacity="${evActive ? 1.0 : 0.4}" style="transition: opacity 0.6s ease;" @click=${(e: Event) => { e.stopPropagation(); onNodeClick('ev'); }}>
              ${carType === 'hatchback' ? svg`
                <g transform="translate(490, 430)">
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
                <g transform="translate(500, 432)">
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
                <g transform="translate(500, 422)">
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

        </g>
        <!-- End of scaled group -->

        <!-- ════════════════════════════════════════════════════════════════ -->
        <!-- FLOW CABLES: Drawn outside the scaled group using scaled coords -->
        <!-- ════════════════════════════════════════════════════════════════ -->
        ${showSolar ? renderCable(
          solarPath,
          solarActive, getFlowSpeed(solar), COLORS.solar.stroke, COLORS.solar.glow
        ) : ''}

        ${renderCable(
          gridPath,
          gridImporting || gridExporting, getFlowSpeed(grid), gridColor.stroke, gridColor.glow, gridExporting
        )}

        ${showBattery ? renderCable(
          batteryPath,
          batteryCharging || batteryDischarging, getFlowSpeed(batteryPower), batColor.stroke, batColor.glow,
          batteryCharging   // reverse when charging
        ) : ''}

        ${showEV ? renderCable(
          evPath,
          evActive, getFlowSpeed(charger), COLORS.ev.stroke, COLORS.ev.glow
        ) : ''}

        <!-- Lightning bolt & Full-Screen flashes -->
        ${weather === 'lightning' ? svg`
          <rect width="960" height="590" fill="#fde047" opacity="0" style="mix-blend-mode: overlay; pointer-events: none; animation: lightningFlash 4s infinite;" />
        ` : ''}


        <!-- Fog overlay (Thicker layer with depth) -->
        ${weather === 'foggy' ? svg`
          <rect width="960" height="590" fill="rgba(203, 213, 225, 0.45)" style="filter: blur(8px); pointer-events: none;" />
          <rect width="960" height="590" fill="rgba(241, 245, 249, 0.25)" style="filter: blur(4px); pointer-events: none;" />
        ` : ''}

        <!-- ════════════════════════════════════════════════════════════════ -->
        <!-- SOLAR HUD card (top right sky area)                            -->
        <!-- ════════════════════════════════════════════════════════════════ -->
        ${showSolar ? svg`
          <g class="interactiveGroup solarGroup" @click=${() => onNodeClick('solar')}>
            <g transform="translate(696, 90)">
              <rect x="0" y="0" width="200" height="65"
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
        <!-- BOTTOM HUD CARDS (grid, home, battery, ev)                     -->
        <!-- ════════════════════════════════════════════════════════════════ -->
        ${bottomCards.map((card, index) => {
          const x = gap + index * (cardWidth + gap);
          return svg`
            <g class="interactiveGroup" @click=${() => onNodeClick(card.id)}>
              <g transform="translate(${x}, 510)">
                <rect x="0" y="0" width="170" height="65"
                  class="hudCard ${card.active ? 'hudCardActive' : ''}"
                  rx="8" ry="8"
                  style="${card.active ? `color: ${card.color}` : ''}" />
                <text x="12" y="20" class="hudTitle">${card.title}</text>
                <text x="12" y="39" class="hudValue ${card.active ? 'hudActiveText' : ''}"
                  style="${card.active ? `color: ${card.color}` : ''}">
                  ${card.active ? card.value : '—'}
                </text>
                <text x="12" y="53" class="hudSub">${card.sub}</text>
              </g>
            </g>
          `;
        })}
      </g>
    </svg>
  `;
}
