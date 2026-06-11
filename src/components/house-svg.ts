import { svg, TemplateResult } from 'lit';

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

function getSkyState(hour: number) {
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

function renderHDCloud(className: string, x: number, y: number, scale = 1, color = '#ffffff', opacity = 0.9): TemplateResult {
  return svg`
    <g transform="translate(${x}, ${y}) scale(${scale})" opacity="${opacity}" style="transition: opacity 1.5s ease;">
      <g class="${className}">
        <path d="M 20,40 Q 10,25 25,15 Q 40,5 60,15 Q 80,0 100,15 Q 120,5 130,25 Q 140,40 120,45 Q 100,50 60,45 Q 20,50 20,40 Z" fill="rgba(15, 23, 42, 0.15)" transform="translate(0, 4) scale(1.02)" />
        <path d="M 20,40 Q 10,25 25,15 Q 40,5 60,15 Q 80,0 100,15 Q 120,5 130,25 Q 140,40 120,45 Q 100,50 60,45 Q 20,50 20,40 Z" fill="${color}" style="transition: fill 1.5s ease;" />
      </g>
    </g>
  `;
}

function renderRain(): TemplateResult {
  return svg`
    <g style="pointer-events: none;">
      ${Array.from({ length: 18 }).map((_, i) => svg`
        <line x1="${25 + i * 55}" y1="0" x2="${8 + i * 55}" y2="40"
          class="rainDrop"
          style="animation-delay: ${(i % 5) * 0.12}s; animation-duration: ${0.6 + (i % 3) * 0.1}s;" />
      `)}
    </g>
  `;
}

function renderSnow(): TemplateResult {
  return svg`
    <g style="pointer-events: none;">
      ${Array.from({ length: 22 }).map((_, i) => svg`
        <circle cx="${25 + i * 45}" cy="0" r="${1.8 + (i % 3) * 0.6}"
          class="snowFlake"
          style="animation-delay: ${(i % 6) * 0.5}s; animation-duration: ${4.5 + (i % 4) * 0.7}s;" />
      `)}
    </g>
  `;
}

interface SvgParams {
  houseStyle?: string;   // kept for API compatibility, ignored
  carType?: string;      // kept for API compatibility, ignored
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
    skyTop = interpolateColor(skyState.top, '#475569', 0.5);
    skyHorizon = interpolateColor(skyState.horizon, '#94a3b8', 0.5);
    cloudColor = 'rgba(241, 245, 249, 0.55)';
    cloudOpacity = 0.65;
  } else if (weather === 'rainy' || weather === 'lightning') {
    skyTop = interpolateColor(skyState.top, '#1e293b', 0.75);
    skyHorizon = interpolateColor(skyState.horizon, '#475569', 0.75);
    cloudColor = 'rgba(100, 116, 139, 0.5)';
    cloudOpacity = 0.65;
  } else if (weather === 'snowy') {
    skyTop = interpolateColor(skyState.top, '#cbd5e1', 0.4);
    skyHorizon = interpolateColor(skyState.horizon, '#f1f5f9', 0.4);
    cloudColor = 'rgba(255, 255, 255, 0.6)';
    cloudOpacity = 0.70;
  } else if (weather === 'foggy') {
    skyTop = interpolateColor(skyState.top, '#94a3b8', 0.6);
    skyHorizon = interpolateColor(skyState.horizon, '#cbd5e1', 0.6);
    cloudColor = 'rgba(226, 232, 240, 0.4)';
    cloudOpacity = 0.50;
  }

  // ── Sun trajectory (HACS viewBox: 960x590, content in translate(0,84) group) ──
  // Ground at y=576 (=480*1.2), top of content at y=84 (=70*1.2)
  // Sun arc: from edge to edge with a peak well above the house roof (~y=100)
  const isSunVisible = timeHour >= 6.0 && timeHour <= 21.0 && weather !== 'rainy' && weather !== 'lightning' && weather !== 'cloudy';
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
  const isMoonVisible = (timeHour > 21.0 || timeHour < 6.0) && weather !== 'rainy' && weather !== 'lightning' && weather !== 'cloudy';
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

  const mkX = Math.round(sx(345));
  const mkY = Math.round(sy(420));
  const invX = Math.round(sx(380));
  const invY = Math.round(sy(300));

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

  // SoC bar calculations for battery
  const batYTop = 405 - 40 * (soc / 100);

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

        <!-- Cloud layers -->
        ${renderHDCloud('cloud1', 72,  36,  0.65, cloudColor, cloudOpacity * 0.75)}
        ${renderHDCloud('cloud2', 432, 84,  0.85, cloudColor, cloudOpacity * 0.85)}
        ${renderHDCloud('cloud3', 744, 132, 1.0,  cloudColor, cloudOpacity)}
        ${weather === 'cloudy' || weather === 'rainy' || weather === 'lightning' ? svg`
          ${renderHDCloud('cloud2', 240, 60,  0.75, cloudColor, cloudOpacity * 0.8)}
          ${renderHDCloud('cloud1', 588, 108, 0.9,  cloudColor, cloudOpacity * 0.8)}
        ` : ''}

        <!-- Lightning bolt -->
        ${weather === 'lightning' ? svg`
          <path d="M 504,72 L 468,180 L 516,180 L 444,312 L 480,312 L 420,456" class="lightningBolt" />
        ` : ''}

        <!-- Falling precipitation -->
        ${weather === 'rainy' ? renderRain() : ''}
        ${weather === 'snowy' ? renderSnow() : ''}

        <!-- Fog overlay -->
        ${weather === 'foggy' ? svg`
          <rect width="960" height="590" fill="rgba(226, 232, 240, 0.22)" style="filter: blur(5px); pointer-events: none;" />
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

        <!-- Transformer/Distribution Box -->
        <g id="grid-transformer-box">
          <rect x="77" y="435" width="32" height="45" fill="#334155" stroke="#1e293b" stroke-width="1.8" rx="3" />
          <line x1="93" y1="435" x2="93" y2="480" stroke="#1e293b" stroke-width="1" />
          <circle cx="85" cy="460" r="1.5" fill="#1e293b" />
          <rect x="83" y="445" width="20" height="12" fill="#fef08a" stroke="#ca8a04" stroke-width="0.8" rx="1" />
          <polygon points="92,447 96,447 93,451 97,451 91,455 94,451 91,451" fill="#ca8a04" />
        </g>

        <!-- ════════════════════════════════════════════════════════════════ -->
        <!-- HOUSE & APPLIANCES: Scaled around center of base (450, 480)      -->
        <!-- ════════════════════════════════════════════════════════════════ -->
        <g transform="translate(450, 480) scale(1.15) translate(-450, -480)">

          <!-- ── LEFT WING ── -->
          <g id="left-wing" class="interactiveGroup homeGroup" @click=${() => onNodeClick('home')}>
            <rect x="180" y="370" width="140" height="110" fill="url(#brick-pat)" stroke="#0f172a" stroke-width="2" />
            <polygon points="175,370 205,330 320,330 320,370" fill="url(#tiles-pat)" stroke="#0f172a" stroke-width="2" />
            <!-- Roof trim left edge -->
            <line x1="172" y1="373" x2="205" y2="328" stroke="#0f172a" stroke-width="12" stroke-linecap="round" />
            <line x1="172" y1="373" x2="205" y2="328" stroke="#1e293b" stroke-width="8"  stroke-linecap="round" />
            <!-- Roof trim top edge -->
            <line x1="205" y1="330" x2="320" y2="330" stroke="#0f172a" stroke-width="8" />
            <line x1="205" y1="330" x2="320" y2="330" stroke="#1e293b" stroke-width="4" />
            <!-- Window -->
            <rect x="230" y="390" width="40" height="45"
              fill="${windowFill}" stroke="#0f172a" stroke-width="2"
              style="filter: ${windowFilter}; transition: fill 0.5s ease, filter 0.5s ease;" />
            <line x1="250" y1="390" x2="250" y2="435" stroke="#0f172a" stroke-width="1.2" />
            <line x1="230" y1="412.5" x2="270" y2="412.5" stroke="#0f172a" stroke-width="1.2" />
          </g>

          <!-- ── RIGHT WING ── -->
          <g id="right-wing" class="interactiveGroup homeGroup" @click=${() => onNodeClick('home')}>
            <polygon points="380,480 380,270 500,130 680,340 680,480" fill="url(#brick-pat)" stroke="#0f172a" stroke-width="2" />
            <!-- Roof trim left slope -->
            <line x1="380" y1="270" x2="500" y2="130" stroke="#0f172a" stroke-width="12" stroke-linecap="round" />
            <line x1="380" y1="270" x2="500" y2="130" stroke="#1e293b" stroke-width="8"  stroke-linecap="round" />
            <!-- Roof trim right slope -->
            <line x1="692" y1="354" x2="500" y2="130" stroke="#0f172a" stroke-width="12" stroke-linecap="round" />
            <line x1="692" y1="354" x2="500" y2="130" stroke="#1e293b" stroke-width="8"  stroke-linecap="round" />
            <!-- Downstairs windows (2) -->
            <rect x="465" y="385" width="40" height="45"
              fill="${windowFill}" stroke="#0f172a" stroke-width="2"
              style="filter: ${windowFilter}; transition: fill 0.5s ease, filter 0.5s ease;" />
            <line x1="485" y1="385" x2="485" y2="430" stroke="#0f172a" stroke-width="1.2" />
            <line x1="465" y1="407.5" x2="505" y2="407.5" stroke="#0f172a" stroke-width="1.2" />

            <rect x="555" y="385" width="40" height="45"
              fill="${windowFill}" stroke="#0f172a" stroke-width="2"
              style="filter: ${windowFilter}; transition: fill 0.5s ease, filter 0.5s ease;" />
            <line x1="575" y1="385" x2="575" y2="430" stroke="#0f172a" stroke-width="1.2" />
            <line x1="555" y1="407.5" x2="595" y2="407.5" stroke="#0f172a" stroke-width="1.2" />

            <!-- Upstairs window -->
            <rect x="480" y="280" width="40" height="40"
              fill="${windowFill}" stroke="#0f172a" stroke-width="2"
              style="filter: ${windowFilter}; transition: fill 0.5s ease, filter 0.5s ease;" />
            <line x1="500" y1="280" x2="500" y2="320" stroke="#0f172a" stroke-width="1.2" />
            <line x1="480" y1="300" x2="520" y2="300" stroke="#0f172a" stroke-width="1.2" />
          </g>

          <!-- ── CENTER ENTRANCE GABLE ── -->
          <g id="center-portal" class="interactiveGroup homeGroup" @click=${() => onNodeClick('home')}>
            <polygon points="320,480 320,340 380,270 440,340 440,480" fill="url(#brick-pat)" stroke="#0f172a" stroke-width="2" />
            <!-- Roof trim -->
            <line x1="308" y1="354" x2="380" y2="270" stroke="#0f172a" stroke-width="12" stroke-linecap="round" />
            <line x1="308" y1="354" x2="380" y2="270" stroke="#1e293b" stroke-width="8"  stroke-linecap="round" />
            <line x1="452" y1="354" x2="380" y2="270" stroke="#0f172a" stroke-width="12" stroke-linecap="round" />
            <line x1="452" y1="354" x2="380" y2="270" stroke="#1e293b" stroke-width="8"  stroke-linecap="round" />
            <!-- Front door – very dark green -->
            <rect x="360" y="395" width="40" height="85" fill="#052e16" stroke="#021b0d" stroke-width="2" />
            <circle cx="390" cy="435" r="2" fill="#fbbf24" />
          </g>

          <!-- ── SOLAR PANELS (conditional) ── -->
          ${showSolar ? svg`
            <g id="solar-panels" class="interactiveGroup solarGroup" @click=${(e: Event) => { e.stopPropagation(); onNodeClick('solar'); }}>
              <g transform="translate(320, 340) rotate(-49.4)">
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
                <!-- Grid lines -->
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

          <!-- ── INVERTER (Omvormer) ── -->
          <g id="inverter">
            <rect x="373" y="295" width="14" height="18" fill="#1e293b" stroke="#475569" stroke-width="1" rx="1.5" />
            <rect x="376" y="306" width="8" height="4" fill="#0f172a" rx="0.5" />
            <circle cx="380" cy="301" r="1.5" fill="#f59e0b" />
          </g>

          <!-- ── METERKAST (fuse box) ── -->
          <rect x="340" y="410" width="10" height="20" fill="#1e293b" rx="1" />
          <circle cx="345" cy="420" r="2.5" fill="#10b981" />

          <!-- ── BATTERY (conditional) ── -->
          ${showBattery ? svg`
            <g id="house-battery" class="interactiveGroup batteryGroup" @click=${(e: Event) => { e.stopPropagation(); onNodeClick('battery'); }}>
              <rect x="280" y="410" width="30" height="70" fill="#f8fafc" stroke="#cbd5e1" stroke-width="1.5" rx="3" />
              <rect x="285" y="418" width="20" height="10" fill="#000" rx="1.5" />
              <text x="295" y="426" fill="#10b981" font-size="8" font-weight="bold" text-anchor="middle">${soc}%</text>
              <!-- SoC bar track -->
              <rect x="294" y="435" width="2" height="40" fill="rgba(0,0,0,0.15)" rx="0.5" />
              <!-- SoC bar fill -->
              <rect x="294" y="${batYTop}" width="2" height="${475 - batYTop}" fill="${soc < 20 ? '#ef4444' : (batteryCharging ? '#10b981' : '#ef4444')}" rx="0.5" />
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

            <!-- EV Car (drawn SVG to avoid image dependency) -->
            <g id="ev-car" class="interactiveGroup evGroup" opacity="${evActive ? 1.0 : 0.4}" style="transition: opacity 0.6s ease;" @click=${(e: Event) => { e.stopPropagation(); onNodeClick('ev'); }}>
              <g transform="translate(490, 430)">
                <!-- Car shadow -->
                <ellipse cx="90" cy="55" rx="90" ry="6" fill="rgba(0,0,0,0.4)" />
                <!-- Car body -->
                <path d="M 0,44 C 0,44 4,28 18,28 C 32,28 50,8 75,6 C 100,4 118,16 132,28 C 148,40 158,44 160,44 L 158,52 L 2,52 Z"
                  fill="#475569" stroke="rgba(255,255,255,0.2)" stroke-width="1" />
                <!-- Windows -->
                <path d="M 32,28 C 44,14 68,10 86,10 C 102,10 114,22 120,27 L 116,37 L 28,37 Z" fill="#0f172a" opacity="0.85" />
                <path d="M 38,29 L 68,29 L 68,36 L 34,36 Z" fill="rgba(255,255,255,0.12)" />
                <path d="M 72,29 L 106,29 L 112,36 L 72,36 Z" fill="rgba(255,255,255,0.12)" />
                <!-- Headlight -->
                <path d="M 0,44 C 4,44 7,46 9,48 L 0,50 Z" fill="#e0f2fe" style="filter: drop-shadow(0 0 5px #00f5ff);" />
                <!-- Taillight -->
                <path d="M 160,44 C 157,44 156,46 155,48 L 160,50 Z" fill="#ef4444" style="filter: drop-shadow(0 0 3px #ef4444);" />
                <!-- Front wheel -->
                <circle cx="32" cy="50" r="16" fill="#090d16" />
                <circle cx="32" cy="50" r="10" fill="#475569" stroke="#cbd5e1" stroke-width="1.5" />
                ${Array.from({ length: 6 }).map((_, idx) => {
                  const angle = (idx * Math.PI) / 3;
                  return svg`<line x1="32" y1="50" x2="${32 + Math.cos(angle) * 10}" y2="${50 + Math.sin(angle) * 10}" stroke="#cbd5e1" stroke-width="1.2" />`;
                })}
                <!-- Rear wheel -->
                <circle cx="118" cy="50" r="16" fill="#090d16" />
                <circle cx="118" cy="50" r="10" fill="#475569" stroke="#cbd5e1" stroke-width="1.5" />
                ${Array.from({ length: 6 }).map((_, idx) => {
                  const angle = (idx * Math.PI) / 3;
                  return svg`<line x1="118" y1="50" x2="${118 + Math.cos(angle) * 10}" y2="${50 + Math.sin(angle) * 10}" stroke="#cbd5e1" stroke-width="1.2" />`;
                })}
              </g>
            </g>
          ` : ''}

        </g>
        <!-- End of scaled group -->

        <!-- ════════════════════════════════════════════════════════════════ -->
        <!-- FLOW CABLES: Drawn outside the scaled group using scaled coords -->
        <!-- ════════════════════════════════════════════════════════════════ -->
        ${showSolar ? renderCable(
          `M ${invX},${invY} L ${invX},${sy(408)} L ${mkX},${sy(408)} L ${mkX},${mkY}`,
          solarActive, getFlowSpeed(solar), COLORS.solar.stroke, COLORS.solar.glow
        ) : ''}

        ${renderCable(
          `M 93,468 L 93,530 L ${mkX},530 L ${mkX},${mkY}`,
          gridImporting || gridExporting, getFlowSpeed(grid), gridColor.stroke, gridColor.glow, gridExporting
        )}

        ${showBattery ? renderCable(
          `M ${sx(310)},${sy(420)} L ${mkX},${mkY}`,
          batteryCharging || batteryDischarging, getFlowSpeed(batteryPower), batColor.stroke, batColor.glow,
          batteryCharging   // reverse when charging (particles flow toward battery)
        ) : ''}

        ${showEV ? renderCable(
          `M ${mkX},${mkY} L ${mkX},${sy(530)} L ${sx(546)},${sy(530)} L ${sx(546)},${sy(475)}`,
          evActive, getFlowSpeed(charger), COLORS.ev.stroke, COLORS.ev.glow
        ) : ''}

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
