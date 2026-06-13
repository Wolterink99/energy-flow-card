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
        <line x1="${15 + i * 17.5}" y1="0" x2="${-2 + i * 17.5}" y2="40"
          class="rainDrop"
          style="animation-delay: ${(i % 7) * 0.12}s; animation-duration: ${0.9 + (i % 4) * 0.12}s;" />
      `)}
    </g>
  `;
}

// In standard 800x600 layout
function renderSnow(): TemplateResult {
  return svg`
    <g style="pointer-events: none;">
      ${Array.from({ length: 40 }).map((_, i) => svg`
        <circle cx="${15 + i * 20}" cy="0" r="${1.8 + (i % 4) * 0.6}"
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
  const showLights = skyState.lights > 0.05 || weather === 'rainy' || weather === 'lightning';

  // Sky colors with weather adaptation
  let skyTop = skyState.top;
  let skyHorizon = skyState.horizon;
  let cloudColor = skyState.clouds;
  let cloudOpacity = timeOfDay === 'night' ? 0.18 : 0.48;

  if (weather === 'cloudy') {
    cloudColor = '#cbd5e1';
    skyHorizon = interpolateColor(skyState.horizon, '#94a3b8', 0.15);
    cloudOpacity = 0.98;
  } else if (weather === 'rainy' || weather === 'lightning') {
    cloudColor = '#1f2937';
    skyTop = cloudColor;
    skyHorizon = interpolateColor(skyState.horizon, '#334155', 0.5);
    cloudOpacity = 0.99;
  } else if (weather === 'snowy') {
    cloudColor = '#334155';
    skyTop = cloudColor;
    skyHorizon = interpolateColor(skyState.horizon, '#4a5568', 0.4);
    cloudOpacity = 0.98;
  } else if (weather === 'foggy') {
    skyTop = interpolateColor(skyState.top, '#64748b', 0.65);
    skyHorizon = interpolateColor(skyState.horizon, '#94a3b8', 0.65);
    cloudColor = 'rgba(203, 213, 225, 0.4)';
    cloudOpacity = 0.50;
  }

  // ── Window appearance ──
  const isDay = timeHour >= 8.0 && timeHour <= 18.0;
  const windowFill = isDay
    ? 'url(#window-day)'
    : (showLights ? 'url(#window-night)' : 'url(#window-dark)');
  const windowFilter = isDay
    ? 'none'
    : (showLights ? 'drop-shadow(0 0 6px rgba(251, 191, 36, 0.45))' : 'none');

  // ── Sun trajectory (using 800x600 viewBox) ──
  const isSunVisible = timeHour >= 6.0 && timeHour <= 21.0 && weather !== 'rainy' && weather !== 'lightning' && weather !== 'cloudy' && weather !== 'snowy' && weather !== 'foggy';
  const sunPos = { cx: 400, cy: 500 };
  let sunOpacity = 0;
  let sunColor = '#fef08a';
  let sunGlow = 'rgba(254, 240, 138, 0.65)';

  if (isSunVisible) {
    const tSun = (timeHour - 6.0) / 15.0;
    sunPos.cx = -50 + tSun * 900;
    sunPos.cy = 480 - Math.sin(tSun * Math.PI) * 440;
    sunOpacity = Math.max(0, Math.min(1.0, Math.sin(tSun * Math.PI) * 1.5));
    const fSun = Math.sin(tSun * Math.PI);
    sunColor = interpolateColor('#ea580c', '#fef08a', fSun);
    sunGlow = interpolateColor('rgba(234, 88, 12, 0.65)', 'rgba(254, 240, 138, 0.75)', fSun);
  }

  // ── Moon trajectory (using 800x600 viewBox) ──
  const isMoonVisible = (timeHour > 21.0 || timeHour < 6.0) && weather !== 'rainy' && weather !== 'lightning' && weather !== 'cloudy' && weather !== 'snowy' && weather !== 'foggy';
  const moonPos = { cx: 400, cy: 500 };
  let moonOpacity = 0;

  if (isMoonVisible) {
    const tMoon = timeHour > 21.0 ? (timeHour - 21.0) / 9.0 : (timeHour + 3.0) / 9.0;
    moonPos.cx = -50 + tMoon * 900;
    moonPos.cy = 480 - Math.sin(tMoon * Math.PI) * 400;
    moonOpacity = Math.max(0, Math.min(0.9, Math.sin(tMoon * Math.PI) * 1.8));
  }

  // ── Inverter and meterkast coordinates ──
  const mkX = 345;
  const mkY = 350;
  const invX = 380;
  const invY = 230;

  // 1-to-1 matching coordinates with dashboard
  const gridPath = `M 93,390 L 93,440 L ${mkX},440 L ${mkX},${mkY}`;
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

  interface CardConfig { id: string; title: string; value: string; sub: string; color: string; active: boolean; }
  const bottomCards: CardConfig[] = [
    { id: 'grid',  title: 'Stroomnet',    value: formatPowerAbs(grid),        sub: gridSub,    color: gridColor.stroke,       active: gridImporting || gridExporting },
  ];
  if (showBattery) bottomCards.push({ id: 'battery', title: 'Thuisaccu', value: batteryCharging || batteryDischarging ? formatPowerAbs(batteryPower) : 'Standby', sub: batterySub, color: batColor.stroke, active: batteryCharging || batteryDischarging });
  bottomCards.push({ id: 'home',  title: 'Huisverbruik', value: formatPowerAbs(load),        sub: homeSub,    color: COLORS.home.stroke,     active: homeActive });
  if (showEV)      bottomCards.push({ id: 'ev', title: 'Laadpaal (EV)', value: formatPowerAbs(charger), sub: evSub, color: COLORS.ev.stroke, active: evActive });

  const cardWidth = 170;
  const totalWidth = bottomCards.length * cardWidth;
  const remainingWidth = 800 - totalWidth;
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
    <svg viewBox="0 0 800 600" xmlns="http://www.w3.org/2000/svg">
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
          <rect width="800" height="600" rx="12" ry="12" />
        </clipPath>
      </defs>

      <g clip-path="url(#scene-clip)">
        <!-- Sky background -->
        <rect width="800" height="600" fill="url(#sky-grad)" />

        <!-- Stars -->
        ${skyState.stars > 0.05 && weather !== 'rainy' && weather !== 'lightning' && weather !== 'cloudy' ? svg`
          <g opacity="${skyState.stars}" style="pointer-events: none;">
            <circle cx="80"  cy="50"  r="1.0" class="starFast" fill="#ffffff" />
            <circle cx="210" cy="95"  r="1.2" fill="#ffffff" />
            <circle cx="340" cy="40"  r="1.0" class="starFast" fill="#ffffff" />
            <circle cx="480" cy="110" r="1.5" fill="#ffffff" />
            <circle cx="620" cy="65"  r="1.2" class="starFast" fill="#ffffff" />
            <circle cx="730" cy="120" r="1.0" fill="#ffffff" />
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

        <!-- Falling precipitation -->
        ${weather === 'rainy' ? renderRain() : ''}
        ${weather === 'snowy' ? renderSnow() : ''}

        <!-- Cloud layers -->
        <g opacity="${cloudOpacity}" style="pointer-events: none;">
          ${(weather === 'cloudy' || weather === 'rainy' || weather === 'lightning' || weather === 'snowy') ? svg`
            <path d="M 0,-10 L 800,-10 L 800,12 Q 785,18 770,12 Q 755,18 740,12 Q 725,18 710,12 Q 695,18 680,12 Q 665,18 650,12 Q 635,18 620,12 Q 605,18 590,12 Q 575,18 560,12 Q 545,18 530,12 Q 515,18 500,12 Q 485,18 470,12 Q 455,18 440,12 Q 425,18 410,12 Q 395,18 380,12 Q 365,18 350,12 Q 335,18 320,12 Q 305,18 290,12 Q 275,18 260,12 Q 245,18 230,12 Q 215,18 200,12 Q 185,18 170,12 Q 155,18 140,12 Q 125,18 110,12 Q 95,18 80,12 Q 65,18 50,12 Q 35,18 20,12 Q 10,18 0,12 Z" fill="${cloudColor}" />
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
          <path d="M 420,60 L 390,150 L 430,150 L 370,260 L 400,260 L 350,380" class="lightningBolt" />
          <path d="M 180,40 L 155,110 L 180,110 L 140,180" class="lightningBolt" style="animation-delay: 1.5s; stroke-width: 2;" />
        ` : ''}

        <!-- ════════════════════════════════════════════════════════════════ -->
        <!-- GROUND, MAST, HOUSE, AND CABLES: Translated inside y+70 group  -->
        <!-- ════════════════════════════════════════════════════════════════ -->
        <g transform="translate(0, 70)">

          <!-- Ground (Full width grass base) -->
          <rect x="0" y="410" width="800" height="120" fill="url(#garden-grad)" />
          
          <!-- Driveway (Thin concrete layer) -->
          <rect x="490" y="410" width="310" height="20" fill="url(#driveway-grad)" />
          <line x1="0" y1="410" x2="800" y2="410" class="horizonLine" />

          <!-- High-Voltage Electricity Mast (Elektramast) in background -->
          <g id="electricity-mast" class="interactiveGroup gridGroup" transform="translate(-15, -22) scale(0.9)" @click=${() => onNodeClick('grid')}>
            <rect x="63" y="474" width="14" height="8" fill="#64748b" stroke="#475569" stroke-width="1.2" rx="1" />
            <rect x="163" y="474" width="14" height="8" fill="#64748b" stroke="#475569" stroke-width="1.2" rx="1" />

            <!-- Sagging high-voltage transmission lines -->
            <path d="M -80,140 Q -15,160 50,180" fill="none" stroke="#334155" stroke-width="1.8" opacity="0.65" />
            <path d="M -80,145 Q 0,165 85,180" fill="none" stroke="#334155" stroke-width="1.8" opacity="0.65" />
            <path d="M -80,140 Q 30,160 155,180" fill="none" stroke="#334155" stroke-width="1.8" opacity="0.65" />
            <path d="M -80,145 Q 50,165 190,180" fill="none" stroke="#334155" stroke-width="1.8" opacity="0.65" />
            
            <!-- Top shield/earth wires -->
            <path d="M -80,60 Q 20,80 120,100" fill="none" stroke="#475569" stroke-width="1.0" opacity="0.5" />

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
              <path d="M 50,160 L 50,180" stroke="#64748b" stroke-width="1.5" />
              <ellipse cx="50" cy="166" rx="6" ry="2.5" fill="#a5f3fc" stroke="#3b82f6" stroke-width="0.5" opacity="0.85" />
              <ellipse cx="50" cy="171" rx="6" ry="2.5" fill="#a5f3fc" stroke="#3b82f6" stroke-width="0.5" opacity="0.85" />
              <ellipse cx="50" cy="176" rx="6" ry="2.5" fill="#a5f3fc" stroke="#3b82f6" stroke-width="0.5" opacity="0.85" />
              
              <path d="M 85,160 L 85,180" stroke="#64748b" stroke-width="1.5" />
              <ellipse cx="85" cy="166" rx="6" ry="2.5" fill="#a5f3fc" stroke="#3b82f6" stroke-width="0.5" opacity="0.85" />
              <ellipse cx="85" cy="171" rx="6" ry="2.5" fill="#a5f3fc" stroke="#3b82f6" stroke-width="0.5" opacity="0.85" />
              <ellipse cx="85" cy="176" rx="6" ry="2.5" fill="#a5f3fc" stroke="#3b82f6" stroke-width="0.5" opacity="0.85" />

              <path d="M 155,160 L 155,180" stroke="#64748b" stroke-width="1.5" />
              <ellipse cx="155" cy="166" rx="6" ry="2.5" fill="#a5f3fc" stroke="#3b82f6" stroke-width="0.5" opacity="0.85" />
              <ellipse cx="155" cy="171" rx="6" ry="2.5" fill="#a5f3fc" stroke="#3b82f6" stroke-width="0.5" opacity="0.85" />
              <ellipse cx="155" cy="176" rx="6" ry="2.5" fill="#a5f3fc" stroke="#3b82f6" stroke-width="0.5" opacity="0.85" />

              <path d="M 190,160 L 190,180" stroke="#64748b" stroke-width="1.5" />
              <ellipse cx="190" cy="166" rx="6" ry="2.5" fill="#a5f3fc" stroke="#3b82f6" stroke-width="0.5" opacity="0.85" />
              <ellipse cx="190" cy="171" rx="6" ry="2.5" fill="#a5f3fc" stroke="#3b82f6" stroke-width="0.5" opacity="0.85" />
              <ellipse cx="190" cy="176" rx="6" ry="2.5" fill="#a5f3fc" stroke="#3b82f6" stroke-width="0.5" opacity="0.85" />
            </g>
          </g>

          <!-- Transformer / Distribution Box -->
          <g id="grid-transformer-box">
            <rect x="77" y="365" width="32" height="45" fill="#334155" stroke="#1e293b" stroke-width="1.8" rx="3" />
            <line x1="93" y1="365" x2="93" y2="410" stroke="#1e293b" stroke-width="1" />
            <circle cx="85" cy="390" r="1.5" fill="#1e293b" />
            <rect x="83" y="375" width="20" height="12" fill="#fef08a" stroke="#ca8a04" stroke-width="0.8" rx="1" />
            <polygon points="92,377 96,377 93,381 97,381 91,385 94,381 91,381" fill="#ca8a04" />
          </g>

          <!-- ── HOUSE GEOMETRY ── -->
          <g id="house-structure" class="interactiveGroup homeGroup" @click=${() => onNodeClick('home')}>
            <!-- LEFT WING -->
            <g id="left-wing">
              <rect x="180" y="300" width="140" height="110" fill="url(#jaren30-brick-pat)" stroke="#0f172a" stroke-width="2" />
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

          ${renderCable(
            gridPath,
            gridImporting || gridExporting, getFlowSpeed(grid), gridColor.stroke, gridColor.glow, gridExporting
          )}

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
        <!-- End of translate(0, 70) group -->

        <!-- Lightning Screen Flashes -->
        ${weather === 'lightning' ? svg`
          <rect width="800" height="600" fill="#fde047" opacity="0" style="mix-blend-mode: overlay; pointer-events: none; animation: lightningFlash 4s infinite;" />
        ` : ''}

        <!-- Fog overlay -->
        ${weather === 'foggy' ? svg`
          <rect width="800" height="600" fill="rgba(203, 213, 225, 0.45)" style="filter: blur(8px); pointer-events: none;" />
          <rect width="800" height="600" fill="rgba(241, 245, 249, 0.25)" style="filter: blur(4px); pointer-events: none;" />
        ` : ''}

        <!-- ════════════════════════════════════════════════════════════════ -->
        <!-- SOLAR HUD CARD (Top right sky area, using 800x600 layout)        -->
        <!-- ════════════════════════════════════════════════════════════════ -->
        ${showSolar ? svg`
          <g class="interactiveGroup solarGroup" @click=${() => onNodeClick('solar')}>
            <g transform="translate(580, 75)">
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
        <!-- BOTTOM HUD CARDS (using 800x600 layout with dynamic gaps)        -->
        <!-- ════════════════════════════════════════════════════════════════ -->
        ${bottomCards.map((card, index) => {
          const x = gap + index * (cardWidth + gap);
          return svg`
            <g class="interactiveGroup" @click=${() => onNodeClick(card.id)}>
              <g transform="translate(${x}, 525)">
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
