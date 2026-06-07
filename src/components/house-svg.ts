import { svg, TemplateResult } from 'lit';

// Color tokens for active states
const COLORS = {
  solar:   { stroke: '#f59e0b', glow: 'rgba(245,158,11,0.5)' },
  battery: { stroke: '#10b981', glow: 'rgba(16,185,129,0.5)' },
  batteryD:{ stroke: '#f97316', glow: 'rgba(249,115,22,0.5)' },
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
  { hour: 6.0,  top: '#1e1b4b', horizon: '#fdba74', stars: 0.2, lights: 0.3, clouds: 'rgba(255, 255, 255, 0.35)' }, // Sunrise
  { hour: 8.0,  top: '#0ea5e9', horizon: '#bae6fd', stars: 0.0, lights: 0.0, clouds: 'rgba(255, 255, 255, 0.92)' }, // Daytime blue
  { hour: 17.0, top: '#0284c7', horizon: '#bae6fd', stars: 0.0, lights: 0.0, clouds: 'rgba(255, 255, 255, 0.92)' },
  { hour: 19.5, top: '#3b0764', horizon: '#f97316', stars: 0.0, lights: 0.5, clouds: 'rgba(255, 255, 255, 0.45)' }, // Early sunset
  { hour: 21.0, top: '#18113c', horizon: '#ea580c', stars: 0.1, lights: 1.0, clouds: 'rgba(255, 255, 255, 0.18)' }, // Late sunset
  { hour: 22.5, top: '#020617', horizon: '#1e293b', stars: 0.6, lights: 1.0, clouds: 'rgba(255, 255, 255, 0.08)' }, // Twilight
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
  if (abs < 1000) return 16.0; // Slow
  return 6.0; // Calm
}

function formatPowerAbs(watts: number): string {
  const abs = Math.abs(watts);
  if (abs >= 1000) return `${(abs / 1000).toFixed(1)} kW`;
  return `${Math.round(abs)} W`;
}

interface SvgParams {
  houseStyle: string;
  timeHour: number;
  timeOfDay: string;
  solar: number;
  load: number;
  batteryPower: number;
  soc: number;
  charger: number;
  grid: number;
  showSolar: boolean;
  showBattery: boolean;
  showEV: boolean;
  onNodeClick: (node: string) => void;
}

export function renderHouseSvg({
  houseStyle,
  timeHour,
  timeOfDay,
  solar,
  load,
  batteryPower,
  soc,
  charger,
  grid,
  showSolar,
  showBattery,
  showEV,
  onNodeClick
}: SvgParams): TemplateResult {
  const Y_GROUND = 480;

  const batteryCharging    = batteryPower > 0;
  const batteryDischarging = batteryPower < 0;
  const gridImporting      = grid > 0;
  const gridExporting      = grid < 0;
  const evActive           = charger > 0;
  const solarActive        = solar > 20;
  const homeActive         = load > 20;

  const batColor   = batteryCharging ? COLORS.battery : COLORS.batteryD;
  const gridColor  = gridImporting ? COLORS.gridI : COLORS.gridE;

  const skyState = getSkyState(timeHour);

  // Time String
  const hours = Math.floor(timeHour);
  const minutes = Math.floor((timeHour % 1) * 60);
  const timeString = `${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}`;

  const timeOfDayLabels: Record<string, string> = {
    morning: 'Ochtend',
    afternoon: 'Middag',
    evening: 'Avond',
    night: 'Nacht'
  };
  const timeOfDayLabel = timeOfDayLabels[timeOfDay] || 'Middag';

  // Calculate Sun Arc Trajectory
  const isSunVisible = timeHour >= 6.0 && timeHour <= 21.0;
  const sunPos = { cx: 450, cy: 600 };
  let sunOpacity = 0;
  let sunColor = '#fef08a';
  let sunGlow = 'rgba(254, 240, 138, 0.65)';
  
  if (isSunVisible) {
    const tSun = (timeHour - 6.0) / 15.0;
    sunPos.cx = 120 + tSun * 720;
    sunPos.cy = 430 - Math.sin(tSun * Math.PI) * 350;
    sunOpacity = Math.max(0, Math.min(1.0, Math.sin(tSun * Math.PI) * 1.5));
    const fSun = Math.sin(tSun * Math.PI);
    sunColor = interpolateColor('#ea580c', '#fef08a', fSun);
    sunGlow = interpolateColor('rgba(234, 88, 12, 0.65)', 'rgba(254, 240, 138, 0.75)', fSun);
  }

  // Calculate Moon Arc Trajectory
  const isMoonVisible = timeHour > 21.0 || timeHour < 6.0;
  const moonPos = { cx: 450, cy: 600 };
  let moonOpacity = 0;
  
  if (isMoonVisible) {
    const tMoon = timeHour >= 21.0 ? (timeHour - 21.0) / 9.0 : (timeHour + 3.0) / 9.0;
    moonPos.cx = 120 + tMoon * 720;
    moonPos.cy = 430 - Math.sin(tMoon * Math.PI) * 350;
    moonOpacity = Math.max(0, Math.min(1.0, Math.sin(tMoon * Math.PI) * 1.5));
  }

  // Cable flow lines definitions
  const solarPath = `M 490,235 L 580,295 L 580,510 L 320,510 L 320,430`;
  const gridPath = `M 85,178 L 120,195 L 120,510 L 320,510 L 320,430`;
  const batteryPath = `M 320,430 L 320,510 L 540,510 L 540,450`;
  const evPath = `M 320,430 L 320,510 L 660,510 L 660,420 C 664,445 675,452 690,452`;

  const flowColor = '#10b981';
  const flowGlow = 'rgba(16, 185, 129, 0.45)';

  const batteryActiveColor = soc < 20 ? '#ef4444' : batteryDischarging ? '#f97316' : '#10b981';
  const batYTop = 472 - 36 * (soc / 100);

  const inverterActive = (showSolar && solarActive) || (showBattery && (batteryCharging || batteryDischarging)) || gridImporting || gridExporting || (showEV && evActive);
  const inverterLedColor = inverterActive ? '#10b981' : '#ef4444';
  const showLights = skyState.lights > 0.05;

  const renderParticles = (path: string, active: boolean, speed: number, reverse = false) => {
    if (!active || speed === 0) return svg``;
    const count = 3;
    return svg`
      ${Array.from({ length: count }).map((_, i) => svg`
        <circle
          r="3.5"
          fill="${flowColor}"
          style="
            offset-path: path('${path}');
            animation: moveParticle ${speed}s linear infinite;
            animation-play-state: running;
            animation-delay: ${-(i / count) * speed}s;
            animation-direction: ${reverse ? 'reverse' : 'normal'};
            filter: drop-shadow(0 0 5px ${flowGlow}) drop-shadow(0 0 2px ${flowColor});
          "
        />
      `)}
    `;
  };

  const renderCable = (path: string, active: boolean, speed: number, reverse = false) => {
    return svg`
      <path d="${path}" class="flowCable" />
      <path
        d="${path}"
        fill="none"
        stroke="${flowColor}"
        stroke-width="3"
        stroke-linecap="round"
        opacity="${active ? 0.25 : 0}"
        style="filter: ${active ? 'blur(3.5px)' : 'none'}; transition: stroke 0.6s ease, opacity 0.6s ease;"
      />
      <path
        d="${path}"
        fill="none"
        stroke="${flowColor}"
        stroke-width="1.2"
        stroke-linecap="round"
        opacity="${active ? 0.55 : 0}"
        style="transition: stroke 0.6s ease, opacity 0.6s ease;"
      />
      ${renderParticles(path, active, speed, reverse)}
    `;
  };

  // Build grid lines dynamically
  const gridLinesX: TemplateResult[] = [];
  const gridLinesY: TemplateResult[] = [];
  for (let x = 0; x <= 960; x += 80) {
    gridLinesX.push(svg`<line x1="${x}" y1="${Y_GROUND}" x2="${x}" y2="620" class="gridLine" />`);
  }
  for (let y = Y_GROUND + 20; y < 620; y += 20) {
    gridLinesY.push(svg`<line x1="0" y1="${y}" x2="960" y2="${y}" class="gridLine" />`);
  }

  // Recalculate HUD cards positions
  interface CardConfig {
    id: string;
    title: string;
    value: string;
    sub: string;
    color: string;
    stroke: string;
    active: boolean;
    line: string;
  }
  const activeCards: CardConfig[] = [
    {
      id: 'grid',
      title: 'Stroomnet',
      value: formatPowerAbs(grid),
      sub: gridExporting ? '↑ Teruglevering' : gridImporting ? '↓ Import' : 'Standby',
      color: gridColor.stroke,
      stroke: gridColor.stroke,
      active: gridImporting || gridExporting,
      line: `M {{X_CENTER}} 550 L 120 195`
    },
    {
      id: 'home',
      title: 'Huisverbruik',
      value: formatPowerAbs(load),
      sub: homeActive ? 'Actief' : 'Standby',
      color: COLORS.home.stroke,
      stroke: COLORS.home.stroke,
      active: homeActive,
      line: `M {{X_CENTER}} 550 L 320 430`
    }
  ];

  if (showBattery) {
    activeCards.push({
      id: 'battery',
      title: 'Thuisaccu',
      value: formatPowerAbs(batteryPower),
      sub: `SoC: ${soc}%`,
      color: batColor.stroke,
      stroke: batColor.stroke,
      active: batteryCharging || batteryDischarging,
      line: `M {{X_CENTER}} 550 L 547.5 445`
    });
  }

  if (showEV) {
    activeCards.push({
      id: 'ev',
      title: 'Laadpaal (EV)',
      value: formatPowerAbs(charger),
      sub: evActive ? 'Bezig met laden' : 'Standby',
      color: COLORS.ev.stroke,
      stroke: COLORS.ev.stroke,
      active: evActive,
      line: `M {{X_CENTER}} 550 L 664 415`
    });
  }

  const cardWidth = 150;
  const totalWidth = activeCards.length * cardWidth;
  const remainingWidth = 960 - totalWidth;
  const gap = remainingWidth / (activeCards.length + 1);

  return svg`
    <svg viewBox="0 0 960 620" xmlns="http://www.w3.org/2000/svg">
      <defs>
        <linearGradient id="sky-grad" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stop-color="${skyState.top}" />
          <stop offset="100%" stop-color="${skyState.horizon}" />
        </linearGradient>

        <linearGradient id="garden-grad" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stop-color="#0f3f26" />
          <stop offset="100%" stop-color="#0a2919" />
        </linearGradient>

        <linearGradient id="driveway-grad" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stop-color="#334155" />
          <stop offset="100%" stop-color="#1e293b" />
        </linearGradient>

        <linearGradient id="solar-panel-grad" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stop-color="#1e1b4b" />
          <stop offset="100%" stop-color="#312e81" />
        </linearGradient>

        <linearGradient id="battery-body-grad" x1="0%" y1="0%" x2="0%" y2="100%">
          <stop offset="0%" stop-color="#f8fafc" />
          <stop offset="100%" stop-color="#cbd5e1" />
        </linearGradient>

        <linearGradient id="car-body-grad" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stop-color="#38bdf8" />
          <stop offset="100%" stop-color="#0284c7" />
        </linearGradient>

        <linearGradient id="lamp-light-grad" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stop-color="#fde047" stop-opacity="0.75" />
          <stop offset="100%" stop-color="#fde047" stop-opacity="0" />
        </linearGradient>

        <filter id="cloud-blur" x="-20%" y="-20%" width="140%" height="140%">
          <feGaussianBlur stdDeviation="8" />
        </filter>
      </defs>

      <!-- Sky -->
      <rect width="960" height="620" fill="url(#sky-grad)" />

      <!-- Stars -->
      ${skyState.stars > 0.05 ? svg`
        <g opacity="${skyState.stars}">
          <circle cx="100" cy="60" r="1.2" class="starFast" fill="#ffffff" />
          <circle cx="180" cy="100" r="1.5" class="starSlow" fill="#ffffff" />
          <circle cx="250" cy="45" r="1.0" class="starMed" fill="#ffffff" />
          <circle cx="320" cy="85" r="1.8" class="starFast" fill="#ffffff" />
          <circle cx="410" cy="70" r="1.2" class="starSlow" fill="#ffffff" />
          <circle cx="530" cy="95" r="1.6" class="starMed" fill="#ffffff" />
          <circle cx="590" cy="50" r="1.3" class="starFast" fill="#ffffff" />
          <circle cx="680" cy="80" r="1.5" class="starSlow" fill="#ffffff" />
          <circle cx="750" cy="40" r="1.1" class="starMed" fill="#ffffff" />
          <circle cx="820" cy="110" r="1.7" class="starFast" fill="#ffffff" />
          <circle cx="890" cy="65" r="1.3" class="starSlow" fill="#ffffff" />
        </g>
      ` : ''}

      <!-- Sun -->
      ${sunOpacity > 0 ? svg`
        <g>
          <circle cx="${sunPos.cx}" cy="${sunPos.cy}" r="55" fill="${sunColor}" opacity="${sunOpacity * 0.15}" style="filter: blur(8px);" />
          <circle cx="${sunPos.cx}" cy="${sunPos.cy}" r="28" fill="${sunColor}" opacity="${sunOpacity}" style="filter: drop-shadow(0 0 16px ${sunGlow});" />
        </g>
      ` : ''}

      <!-- Moon -->
      ${moonOpacity > 0 ? svg`
        <circle cx="${moonPos.cx}" cy="${moonPos.cy}" r="22" fill="#fffef0" opacity="${moonOpacity}" style="filter: drop-shadow(0 0 12px rgba(254, 243, 199, 0.6)) drop-shadow(0 0 4px rgba(255, 255, 255, 0.8));" />
      ` : ''}

      <!-- Clouds -->
      <g opacity="${timeOfDay === 'night' ? 0.35 : 0.85}">
        <path class="cloud1" d="M 120,100 A 20,20 0 0,1 150,85 A 30,30 0 0,1 200,80 A 20,20 0 0,1 230,100 Z" fill="${skyState.clouds}" filter="url(#cloud-blur)" />
        <path class="cloud2" d="M 450,110 A 16,16 0 0,1 475,98 A 24,24 0 0,1 515,94 A 16,16 0 0,1 539,110 Z" fill="${skyState.clouds}" filter="url(#cloud-blur)" />
        <path class="cloud3" d="M 700,95 A 18,18 0 0,1 727,82 A 26,26 0 0,1 770,78 A 18,18 0 0,1 797,95 Z" fill="${skyState.clouds}" filter="url(#cloud-blur)" />
      </g>

      <!-- SVG Sky Clock -->
      <g transform="translate(480, 50)" text-anchor="middle" style="pointer-events: none;">
        <text x="0" y="0" fill="#ffffff" font-size="26px" font-weight="700" font-family="monospace" opacity="0.9" style="filter: drop-shadow(0 0 8px rgba(255,255,255,0.45)); letter-spacing: 1px;">
          ${timeString}
        </text>
        <text x="0" y="18" fill="rgba(255,255,255,0.5)" font-size="10px" font-weight="600" style="letter-spacing: 0.12em;">
          ${timeOfDayLabel.toUpperCase()}
        </text>
      </g>

      <!-- Ground & Grid -->
      <rect x="0" y="${Y_GROUND}" width="630" height="140" class="groundBackground" fill="url(#garden-grad)" />
      <rect x="630" y="${Y_GROUND}" width="330" height="140" class="groundBackground" fill="url(#driveway-grad)" />
      <line x1="630" y1="${Y_GROUND}" x2="630" y2="${Y_GROUND + 140}" stroke="#1e293b" stroke-width="2" opacity="0.6" />
      <line x1="0" y1="${Y_GROUND}" x2="960" y2="${Y_GROUND}" class="horizonLine" />
      ${gridLinesX}
      ${gridLinesY}

      <!-- Grid Tower -->
      <g stroke="#475569" stroke-width="1.8" fill="none" stroke-linecap="round" stroke-linejoin="round">
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
        <line x1="50" y1="160" x2="50" y2="175" stroke="#94a3b8" stroke-width="2.5" />
        <circle cx="50" cy="178" r="2" fill="#94a3b8" />
        <line x1="85" y1="160" x2="85" y2="175" stroke="#94a3b8" stroke-width="2.5" />
        <circle cx="85" cy="178" r="2" fill="#94a3b8" />
        <line x1="155" y1="160" x2="155" y2="175" stroke="#94a3b8" stroke-width="2.5" />
        <circle cx="155" cy="178" r="2" fill="#94a3b8" />
        <line x1="190" y1="160" x2="190" y2="175" stroke="#94a3b8" stroke-width="2.5" />
        <circle cx="190" cy="178" r="2" fill="#94a3b8" />
      </g>
      <path d="M 50,178 Q 20,185 -10,188" stroke="#475569" stroke-width="1.2" fill="none" opacity="0.6" />
      <path d="M 190,178 Q 220,185 240,188" stroke="#475569" stroke-width="1.2" fill="none" opacity="0.4" />

      <!-- EV (Conditional) -->
      ${showEV ? svg`
        <g id="garage-ev-car" opacity="${evActive ? 1.0 : 0.35}" style="transition: opacity 0.6s ease;">
          <ellipse cx="755" cy="${Y_GROUND - 2}" rx="70" ry="6" fill="rgba(0,0,0,0.5)" opacity="0.8" />
          <path
            d="M 690,470 L 690,452 L 715,452 L 735,422 L 785,422 L 805,445 L 825,445 L 830,452 L 830,470 Z"
            fill="url(#car-body-grad)"
            stroke="rgba(255,255,255,0.2)"
            stroke-width="1"
          />
          <polygon points="740,425 762,425 762,442 735,442" fill="#0f172a" opacity="0.8" />
          <polygon points="766,425 782,425 800,442 766,442" fill="#0f172a" opacity="0.8" />
          <circle cx="720" cy="465" r="15" fill="#111827" stroke="#4b5563" stroke-width="2.5" />
          <circle cx="790" cy="465" r="15" fill="#111827" stroke="#4b5563" stroke-width="2.5" />
          <circle cx="828" cy="455" r="2.5" fill="${evActive ? '#00f5ff' : '#64748b'}" style="filter: ${evActive ? 'drop-shadow(0 0 3px #00f5ff)' : 'none'}; transition: fill 0.5s ease;" />
          <rect x="690" y="455" width="4" height="6" fill="${evActive ? '#ef4444' : '#475569'}" style="transition: fill 0.5s ease;" />
        </g>

        <g id="module-charger">
          <rect x="660" y="420" width="8" height="60" fill="#1e293b" stroke="#0f172a" stroke-width="0.8" />
          <line x1="664" y1="420" x2="664" y2="480" stroke="rgba(255,255,255,0.1)" stroke-width="0.8" />
          <rect x="655" y="405" width="18" height="20" fill="#334155" stroke="#1e293b" stroke-width="1" rx="3" />
          <circle
            cx="664"
            cy="415"
            r="3"
            fill="${evActive ? '#a855f7' : '#10b981'}"
            style="filter: ${evActive ? 'drop-shadow(0 0 5px #a855f7)' : 'none'}; transition: fill 0.5s ease;"
          />
          <path
            d="M 664,420 C 664,445 675,452 690,452"
            fill="none"
            stroke="#0f172a"
            stroke-width="2.5"
            stroke-linecap="round"
          />
          ${evActive ? svg`
            <path
              d="M 664,420 C 664,445 675,452 690,452"
              fill="none"
              stroke="#c084fc"
              stroke-width="1.2"
              stroke-dasharray="4,4"
              stroke-linecap="round"
              class="chargingPulse"
            />
          ` : ''}
        </g>
      ` : ''}

      <!-- Dynamic House Component based on selected style -->
      <g id="house-structure">
        ${houseStyle === 'modern-villa' ? svg`
          <!-- Villa -->
          <rect x="320" y="455" width="260" height="25" fill="#2d3748" stroke="#1a202c" stroke-width="0.8" />
          <line x1="320" y1="467" x2="580" y2="467" stroke="#1a202c" stroke-width="0.5" opacity="0.4" />
          <rect x="320" y="300" width="80" height="155" fill="#c2410c" stroke="#78350f" stroke-width="0.8" />
          ${Array.from({ length: 7 }).map((_, i) => svg`<line x1="${330 + i * 10}" y1="300" x2="${330 + i * 10}" y2="455" stroke="#451a03" stroke-width="0.8" opacity="0.35" />`)}
          <rect x="400" y="300" width="180" height="155" fill="#f8fafc" stroke="#cbd5e1" stroke-width="0.8" />
          ${[330, 360, 390, 420].map(y => svg`<line x1="400" y1="${y}" x2="580" y2="${y}" stroke="#cbd5e1" stroke-width="0.5" opacity="0.4" />`)}

          <!-- Door -->
          <g id="house-door">
            <rect x="345" y="380" width="35" height="75" fill="#78350f" stroke="#451a03" stroke-width="1.5" rx="1.5" />
            <line x1="372" y1="410" x2="372" y2="430" stroke="#cbd5e1" stroke-width="1.8" stroke-linecap="round" />
            <rect x="352" y="390" width="6" height="55" fill="${showLights ? '#fde047' : '#1e293b'}" stroke="#451a03" stroke-width="0.8" style="fill: ${showLights ? `rgba(253, 224, 71, ${skyState.lights})` : '#1e293b'}; filter: ${showLights ? `drop-shadow(0 0 4px rgba(253, 224, 71, ${skyState.lights}))` : 'none'}; transition: fill 0.5s ease;" />
            <rect x="340" y="375" width="45" height="5" fill="#334155" stroke="#1e293b" stroke-width="0.8" rx="1" />
          </g>

          <!-- Roof -->
          <polygon points="300,300 450,200 600,300" fill="#1e293b" stroke="#0f172a" stroke-width="1.5" />
          <line x1="300" y1="300" x2="450" y2="200" stroke="#0f172a" stroke-width="3.5" />
          <line x1="600" y1="300" x2="450" y2="200" stroke="#0f172a" stroke-width="3.5" />
          <rect x="295" y="297" width="310" height="6" fill="#64748b" rx="2" />
          <path d="M 595,303 L 595,455 L 598,458" stroke="#64748b" stroke-width="2.5" fill="none" stroke-linecap="round" />

          <!-- Solar Panels (Conditional) -->
          ${showSolar ? svg`
            <g transform="translate(450, 200) rotate(33.7)">
              <rect x="15" y="-12" width="130" height="10" fill="url(#solar-panel-grad)" stroke="#1e1b4b" stroke-width="1.5" rx="2" />
              <line x1="45" y1="-12" x2="45" y2="-2" stroke="#3b82f6" stroke-width="0.5" opacity="0.3" />
              <line x1="85" y1="-12" x2="85" y2="-2" stroke="#3b82f6" stroke-width="0.5" opacity="0.3" />
              <line x1="15" y1="-7" x2="145" y2="-7" stroke="#3b82f6" stroke-width="0.5" opacity="0.3" />
            </g>
          ` : ''}

          <!-- Windows -->
          <rect x="410" y="380" width="130" height="70" class="houseWindow" style="fill: ${showLights ? interpolateColor('#0f172a', '#fef08a', skyState.lights) : '#0f172a'}; stroke: #334155; stroke-width: 2.5; filter: ${showLights ? `drop-shadow(0 0 ${16 * skyState.lights}px rgba(253, 224, 71, ${0.6 * skyState.lights}))` : 'none'};" rx="3" />
          <line x1="475" y1="380" x2="475" y2="450" stroke="#0f172a" stroke-width="1.5" />
          <line x1="410" y1="415" x2="540" y2="415" stroke="#0f172a" stroke-width="1.2" />
          <rect x="440" y="310" width="70" height="45" class="houseWindow" style="fill: ${showLights ? interpolateColor('#0f172a', '#fef08a', skyState.lights) : '#0f172a'}; stroke: #334155; stroke-width: 2.0;" rx="2" />
          <line x1="475" y1="310" x2="475" y2="355" stroke="#0f172a" stroke-width="1.2" />
          <line x1="440" y1="332.5" x2="510" y2="332.5" stroke="#0f172a" stroke-width="1" />
          <circle cx="450" cy="255" r="13" class="houseWindow" style="fill: ${showLights ? interpolateColor('#0f172a', '#fef08a', skyState.lights) : '#0f172a'}; stroke: #334155; stroke-width: 2.0;" />
          <line x1="450" y1="242" x2="450" y2="268" stroke="#0f172a" stroke-width="1" />
          <line x1="437" y1="255" x2="463" y2="255" stroke="#0f172a" stroke-width="1" />
        ` : ''}

        ${houseStyle === 'classic-jaren30' ? svg`
          <!-- Jaren 30 -->
          <rect x="320" y="455" width="260" height="25" fill="#3e2723" stroke="#1b0000" stroke-width="0.8" />
          <rect x="320" y="300" width="260" height="155" fill="#c2410c" stroke="#7c2d12" stroke-width="0.8" />
          <rect x="320" y="362" width="260" height="6" fill="#f8fafc" stroke="#cbd5e1" stroke-width="0.5" />
          ${Array.from({ length: 22 }).map((_, i) => svg`<line x1="320" y1="${300 + i * 7}" x2="580" y2="${300 + i * 7}" stroke="#7c2d12" stroke-width="0.5" opacity="0.3" />`)}

          <!-- Door -->
          <g id="house-door">
            <path d="M 345,455 L 345,395 A 17.5,17.5 0 0,1 380,395 L 380,455 Z" fill="#064e3b" stroke="#022c22" stroke-width="2" />
            <circle cx="373" cy="425" r="2.2" fill="#fbbf24" />
            <path d="M 345,395 A 17.5,17.5 0 0,1 380,395 Z" fill="${showLights ? 'rgba(253, 224, 71, 0.75)' : '#1e293b'}" stroke="#f8fafc" stroke-width="1" />
          </g>

          <!-- Roof -->
          <polygon points="295,300 450,150 605,300" fill="#991b1b" stroke="#450a0a" stroke-width="1.5" />
          <line x1="295" y1="300" x2="450" y2="150" stroke="#f8fafc" stroke-width="3.5" />
          <line x1="605" y1="300" x2="450" y2="150" stroke="#f8fafc" stroke-width="3.5" />
          <rect x="290" y="297" width="320" height="7" fill="#f8fafc" rx="2" stroke="#cbd5e1" stroke-width="0.8" />
          <path d="M 605,304 L 605,455 L 608,458" stroke="#cbd5e1" stroke-width="2.5" fill="none" stroke-linecap="round" />

          <!-- Solar Panels (Conditional) -->
          ${showSolar ? svg`
            <g transform="translate(450, 150) rotate(44.0)">
              <rect x="15" y="-12" width="140" height="10" fill="url(#solar-panel-grad)" stroke="#1e1b4b" stroke-width="1.5" rx="2" />
              <line x1="45" y1="-12" x2="45" y2="-2" stroke="#3b82f6" stroke-width="0.5" opacity="0.3" />
              <line x1="85" y1="-12" x2="85" y2="-2" stroke="#3b82f6" stroke-width="0.5" opacity="0.3" />
              <line x1="15" y1="-7" x2="145" y2="-7" stroke="#3b82f6" stroke-width="0.5" opacity="0.3" />
            </g>
          ` : ''}

          <!-- Windows -->
          <rect x="420" y="375" width="110" height="75" class="houseWindow" style="fill: ${showLights ? interpolateColor('#0f172a', '#fef08a', skyState.lights) : '#0f172a'}; stroke: #f8fafc; stroke-width: 3.0;" rx="1" />
          <line x1="475" y1="375" x2="475" y2="450" stroke="#f8fafc" stroke-width="2" />
          <line x1="420" y1="412.5" x2="530" y2="412.5" stroke="#f8fafc" stroke-width="1.5" />
          <rect x="415" y="310" width="45" height="45" class="houseWindow" style="fill: ${showLights ? interpolateColor('#0f172a', '#fef08a', skyState.lights) : '#0f172a'}; stroke: #f8fafc; stroke-width: 2.5;" rx="1" />
          <line x1="437.5" y1="310" x2="437.5" y2="355" stroke="#f8fafc" stroke-width="1.5" />
          <line x1="415" y1="332.5" x2="460" y2="332.5" stroke="#f8fafc" stroke-width="1.5" />
          <rect x="495" y="310" width="45" height="45" class="houseWindow" style="fill: ${showLights ? interpolateColor('#0f172a', '#fef08a', skyState.lights) : '#0f172a'}; stroke: #f8fafc; stroke-width: 2.5;" rx="1" />
          <line x1="517.5" y1="310" x2="517.5" y2="355" stroke="#f8fafc" stroke-width="1.5" />
          <line x1="495" y1="332.5" x2="540" y2="332.5" stroke="#f8fafc" stroke-width="1.5" />
          <path d="M 437,270 L 437,252 A 13,13 0 0,1 463,252 L 463,270 Z" class="houseWindow" style="fill: ${showLights ? interpolateColor('#0f172a', '#fef08a', skyState.lights) : '#0f172a'}; stroke: #f8fafc; stroke-width: 2.0;" />
          <line x1="450" y1="239" x2="450" y2="270" stroke="#f8fafc" stroke-width="1.2" />
        ` : ''}

        ${houseStyle === 'barnhouse' ? svg`
          <!-- Barnhouse -->
          <rect x="320" y="455" width="260" height="25" fill="#1e293b" stroke="#0f172a" stroke-width="0.8" />
          <rect x="320" y="280" width="260" height="175" fill="#172554" stroke="#0f172a" stroke-width="1" />
          ${Array.from({ length: 22 }).map((_, i) => svg`<line x1="${326 + i * 11}" y1="280" x2="${326 + i * 11}" y2="455" stroke="#020617" stroke-width="0.8" opacity="0.45" />`)}

          <!-- Door -->
          <g id="house-door">
            <rect x="345" y="380" width="35" height="75" fill="#451a03" stroke="#020617" stroke-width="1.5" />
            <line x1="352" y1="395" x2="352" y2="435" stroke="#1e293b" stroke-width="2.5" stroke-linecap="round" />
          </g>

          <!-- Roof -->
          <polygon points="290,280 450,150 610,280" fill="#0f172a" stroke="#020617" stroke-width="2" />
          <line x1="290" y1="280" x2="450" y2="150" stroke="#334155" stroke-width="2.5" />
          <line x1="610" y1="280" x2="450" y2="150" stroke="#334155" stroke-width="2.5" />

          <!-- Solar Panels (Conditional) -->
          ${showSolar ? svg`
            <g transform="translate(450, 150) rotate(39.0)">
              <rect x="15" y="-12" width="135" height="10" fill="url(#solar-panel-grad)" stroke="#1e1b4b" stroke-width="1.5" rx="2" />
              <line x1="45" y1="-12" x2="45" y2="-2" stroke="#3b82f6" stroke-width="0.5" opacity="0.3" />
              <line x1="85" y1="-12" x2="85" y2="-2" stroke="#3b82f6" stroke-width="0.5" opacity="0.3" />
              <line x1="15" y1="-7" x2="145" y2="-7" stroke="#3b82f6" stroke-width="0.5" opacity="0.3" />
            </g>
          ` : ''}

          <!-- Window Facade -->
          <rect x="420" y="270" width="120" height="180" class="houseWindow" style="fill: ${showLights ? interpolateColor('#0f172a', '#fef08a', skyState.lights) : '#0f172a'}; stroke: #0f172a; stroke-width: 3.0;" rx="2" />
          <polygon points="420,270 450,220 480,270" class="houseWindow" style="fill: ${showLights ? interpolateColor('#0f172a', '#fef08a', skyState.lights) : '#0f172a'}; stroke: #0f172a; stroke-width: 2.0;" />
          <line x1="450" y1="220" x2="450" y2="450" stroke="#0f172a" stroke-width="2" />
          <line x1="420" y1="330" x2="540" y2="330" stroke="#0f172a" stroke-width="1.5" />
          <line x1="420" y1="390" x2="540" y2="390" stroke="#0f172a" stroke-width="1.5" />
        ` : ''}

        ${houseStyle === 'cubist-bungalow' ? svg`
          <!-- Cubist Bungalow -->
          <rect x="320" y="455" width="260" height="25" fill="#1e293b" stroke="#0f172a" stroke-width="0.8" />
          <rect x="320" y="320" width="100" height="135" fill="#64748b" stroke="#475569" stroke-width="1" />
          <line x1="320" y1="380" x2="420" y2="380" stroke="#475569" stroke-width="0.8" opacity="0.5" />
          <rect x="420" y="270" width="160" height="185" fill="#f8fafc" stroke="#cbd5e1" stroke-width="1" />
          <rect x="315" y="315" width="110" height="6" fill="#334155" rx="1.5" />
          <rect x="415" y="265" width="170" height="6" fill="#1e293b" rx="1.5" />

          <!-- Door -->
          <g id="house-door">
            <rect x="345" y="380" width="35" height="75" fill="#3b2314" stroke="#1c1009" stroke-width="1.5" />
            <line x1="372" y1="410" x2="372" y2="430" stroke="#cbd5e1" stroke-width="1.8" stroke-linecap="round" />
          </g>

          <!-- Solar Panels (Conditional) -->
          ${showSolar ? svg`
            <g transform="translate(440, 250)">
              <rect x="0" y="0" width="120" height="8" fill="url(#solar-panel-grad)" stroke="#1e1b4b" stroke-width="1.2" rx="1" transform="skewX(-15)" />
              <line x1="30" y1="0" x2="30" y2="8" stroke="#3b82f6" stroke-width="0.5" opacity="0.3" />
              <line x1="60" y1="0" x2="60" y2="8" stroke="#3b82f6" stroke-width="0.5" opacity="0.3" />
              <line x1="90" y1="0" x2="90" y2="8" stroke="#3b82f6" stroke-width="0.5" opacity="0.3" />
            </g>
          ` : ''}

          <!-- Windows -->
          <rect x="440" y="360" width="120" height="80" class="houseWindow" style="fill: ${showLights ? interpolateColor('#0f172a', '#fef08a', skyState.lights) : '#0f172a'}; stroke: #0f172a; stroke-width: 2.5;" rx="1" />
          <line x1="480" y1="360" x2="480" y2="440" stroke="#0f172a" stroke-width="1.5" />
          <line x1="520" y1="360" x2="520" y2="440" stroke="#0f172a" stroke-width="1.5" />
          <rect x="440" y="290" width="120" height="50" class="houseWindow" style="fill: ${showLights ? interpolateColor('#0f172a', '#fef08a', skyState.lights) : '#0f172a'}; stroke: #0f172a; stroke-width: 2.0;" rx="1" />
          <line x1="500" y1="290" x2="500" y2="340" stroke="#0f172a" stroke-width="1.5" />
        ` : ''}

        ${houseStyle === 'townhouse' ? svg`
          <!-- Townhouse -->
          <rect x="320" y="455" width="260" height="25" fill="#292524" stroke="#1c1917" stroke-width="0.8" />
          <polygon points="320,230 450,150 580,230" fill="#292524" stroke="#1c1917" stroke-width="1.2" opacity="0.8" />
          <polygon points="320,230 350,230 350,200 380,200 380,170 410,170 410,140 490,140 490,170 520,170 520,200 550,200 550,230 580,230" fill="#44403c" stroke="#1c1917" stroke-width="1" />
          <rect x="320" y="230" width="260" height="225" fill="#44403c" stroke="#1c1917" stroke-width="1" />
          ${Array.from({ length: 32 }).map((_, i) => svg`<line x1="320" y1="${230 + i * 7}" x2="580" y2="${230 + i * 7}" stroke="#292524" stroke-width="0.5" opacity="0.35" />`)}

          <!-- Door -->
          <g id="house-door">
            <rect x="345" y="380" width="35" height="75" fill="#7c2d12" stroke="#431407" stroke-width="1.8" rx="1" />
            <line x1="372" y1="410" x2="372" y2="430" stroke="#cbd5e1" stroke-width="1.8" stroke-linecap="round" />
          </g>

          <!-- Solar Panels (Conditional) -->
          ${showSolar ? svg`
            <g transform="translate(450, 150) rotate(31.6)">
              <rect x="15" y="-12" width="120" height="10" fill="url(#solar-panel-grad)" stroke="#1e1b4b" stroke-width="1.5" rx="2" />
              <line x1="45" y1="-12" x2="45" y2="-2" stroke="#3b82f6" stroke-width="0.5" opacity="0.3" />
              <line x1="85" y1="-12" x2="85" y2="-2" stroke="#3b82f6" stroke-width="0.5" opacity="0.3" />
              <line x1="15" y1="-7" x2="145" y2="-7" stroke="#3b82f6" stroke-width="0.5" opacity="0.3" />
            </g>
          ` : ''}

          <!-- Windows -->
          <rect x="410" y="375" width="130" height="80" class="houseWindow" style="fill: ${showLights ? interpolateColor('#0f172a', '#fef08a', skyState.lights) : '#0f172a'}; stroke: #f8fafc; stroke-width: 2.5;" rx="1" />
          <line x1="475" y1="375" x2="475" y2="455" stroke="#f8fafc" stroke-width="1.8" />
          <line x1="410" y1="415" x2="540" y2="415" stroke="#f8fafc" stroke-width="1.2" />

          ${[345, 430, 515].map(x => svg`
            <rect x="${x}" y="290" width="35" height="60" class="houseWindow" style="fill: ${showLights ? interpolateColor('#0f172a', '#fef08a', skyState.lights) : '#0f172a'}; stroke: #f8fafc; stroke-width: 2.0;" rx="1" />
            <line x1="${x + 17.5}" y1="290" x2="${x + 17.5}" y2="350" stroke="#f8fafc" stroke-width="1.2" />
            <line x1="${x}" y1="320" x2="${x + 35}" y2="320" stroke="#f8fafc" stroke-width="1" />
          `)}

          ${[390, 480].map(x => svg`
            <rect x="${x}" y="210" width="30" height="45" class="houseWindow" style="fill: ${showLights ? interpolateColor('#0f172a', '#fef08a', skyState.lights) : '#0f172a'}; stroke: #f8fafc; stroke-width: 1.8;" rx="1" />
            <line x1="${x + 15}" y1="210" x2="${x + 15}" y2="255" stroke="#f8fafc" stroke-width="1" />
          `)}
        ` : ''}
      </g>

      <!-- Inverter / Meterkast -->
      <g id="house-inverter">
        <rect x="315" y="420" width="10" height="25" fill="#1e293b" stroke="rgba(255,255,255,0.1)" stroke-width="0.8" rx="1" />
        <circle cx="320" cy="432.5" r="2.5" fill="${inverterLedColor}" style="transition: fill 0.6s ease;" />
        ${inverterActive ? svg`<circle cx="320" cy="432.5" r="2.5" fill="none" stroke="${inverterLedColor}" stroke-width="1.5" class="inverterRing" />` : ''}
      </g>

      <!-- Tesla Powerwall Battery Cabinet (Conditional) -->
      ${showBattery ? svg`
        <g id="house-battery">
          <rect x="530" y="410" width="35" height="70" fill="url(#battery-body-grad)" stroke="#cbd5e1" stroke-width="1" rx="4" />
          <rect x="530" y="410" width="35" height="70" fill="none" stroke="rgba(255,255,255,0.25)" stroke-width="0.8" rx="4" />
          <rect x="535" y="418" width="25" height="12" fill="rgba(0,0,0,0.72)" rx="1.5" />
          <text x="547.5" y="427" text-anchor="middle" fill="${batteryActiveColor}" font-size="8.5px" font-family="monospace" font-weight="bold" style="transition: fill 0.6s ease;">
            ${soc}%
          </text>
          <rect x="546.5" y="436" width="2" height="36" fill="rgba(0,0,0,0.4)" rx="0.5" />
          <rect x="546.5" y="${batYTop}" width="2" height="${472 - batYTop}" fill="${batteryActiveColor}" opacity="0.95" style="transition: y 0.8s ease, height 0.8s ease, fill 0.6s ease;" rx="0.5" />
        </g>
      ` : ''}

      <!-- Flow Lines Cables (Conditional) -->
      ${showSolar ? renderCable(solarPath, solarActive, getFlowSpeed(solar)) : ''}
      ${renderCable(gridPath, gridImporting || gridExporting, getFlowSpeed(grid), gridExporting)}
      ${showBattery ? renderCable(batteryPath, batteryCharging || batteryDischarging, getFlowSpeed(batteryPower), batteryDischarging) : ''}
      ${showEV ? renderCable(evPath, evActive, getFlowSpeed(charger)) : ''}

      <!-- Dynamic Bottom HUD Cards & Indicator lines -->
      ${activeCards.map((card, index) => {
        const x = gap + index * (cardWidth + gap);
        const xCenter = x + 75;
        const linePath = card.line.replace('{{X_CENTER}}', xCenter.toString());

        return svg`
          <g class="interactiveGroup" @click=${() => onNodeClick(card.id)}>
            <path
              d="${linePath}"
              fill="none"
              stroke="${card.active ? card.stroke : 'rgba(255,255,255,0.12)'}"
              stroke-width="1"
              stroke-dasharray="3,3"
              style="transition: stroke 0.6s ease;"
            />
            <g transform="translate(${x}, 550)">
              <rect x="0" y="0" width="150" height="55" class="hudCard ${card.active ? 'hudCardActive' : ''}" style="${card.active ? `color: ${card.color}` : ''}" />
              <text x="12" y="18" class="hudTitle">${card.title}</text>
              <text x="12" y="35" class="hudValue ${card.active ? 'hudActiveText' : ''}" style="${card.active ? `color: ${card.color}` : ''}">
                ${card.active ? card.value : '—'}
              </text>
              <text x="12" y="47" class="hudSub">${card.sub}</text>
            </g>
          </g>
        `;
      })}

      <!-- Solar HUD card on roof slope (Conditional) -->
      ${showSolar ? svg`
        <g class="interactiveGroup" @click=${() => onNodeClick('solar')}>
          <polygon points="450,200 600,300 560,330 430,220" fill="transparent" />
          <path
            d="M 580 167 L 490 235"
            fill="none"
            stroke="${solarActive ? COLORS.solar.stroke : 'rgba(255,255,255,0.12)'}"
            stroke-width="1"
            stroke-dasharray="3,3"
            style="transition: stroke 0.6s ease;"
          />
          <g transform="translate(580, 140)">
            <rect x="0" y="0" width="150" height="55" class="hudCard ${solarActive ? 'hudCardActive' : ''}" style="${solarActive ? `color: ${COLORS.solar.stroke}` : ''}" />
            <text x="12" y="18" class="hudTitle">Zonnepanelen</text>
            <text x="12" y="35" class="hudValue ${solarActive ? 'hudActiveText' : ''}" style="${solarActive ? `color: ${COLORS.solar.stroke}` : ''}">
              ${solarActive ? formatPowerAbs(solar) : '—'}
            </text>
            <text x="12" y="47" class="hudSub">Vandaag: 14.2 kWh</text>
          </g>
        </g>
      ` : ''}
    </svg>
  `;
}
