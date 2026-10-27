import { svg, TemplateResult } from 'lit';

export interface OverkappingParams {
  width: number;
  height: number;
  isDay: boolean;
  lightsOn: boolean;
  barStripOn: boolean;
  dartRingOn: boolean;
  spotjesOn: boolean;
  pcPowerWatts: number;
  onToggleLight: (entityId: string) => void;
  onReturnToHouse: () => void;
}

export function renderOverkappingSvg({
  width,
  height,
  isDay,
  lightsOn,
  barStripOn,
  dartRingOn,
  spotjesOn,
  pcPowerWatts,
  onToggleLight,
  onReturnToHouse
}: OverkappingParams): TemplateResult {
  // Center alignment
  const centerX = width / 2;
  const groundY = height * 0.78;
  const oW = Math.min(width * 0.88, 720); // Overkapping width
  const oH = Math.min(height * 0.52, 340); // Overkapping height
  const oLeft = centerX - oW / 2;
  const oTop = groundY - oH;

  // Colors
  const woodColor = '#3e2723';
  const beamColor = '#271c19';
  const postColor = '#1e2430'; // Modern black/anthracite steel upright posts
  const slatWall = '#4e342e';
  const lawnColor = isDay ? '#1e392a' : '#0d1a13';
  const terraceFloor = isDay ? '#334155' : '#1e293b';

  // Warm light glow
  const anyLightOn = lightsOn || barStripOn || dartRingOn || spotjesOn;
  const ambientWarmth = anyLightOn ? (isDay ? 0.35 : 0.75) : (isDay ? 0 : 0.05);

  return svg`
    <g id="overkapping-scene" class="overkapping-fade-in" style="transition: opacity 0.8s ease;">
      <defs>
        <!-- Terrace tiles pattern -->
        <pattern id="terraceTiles" width="36" height="18" patternUnits="userSpaceOnUse">
          <rect width="36" height="18" fill="${terraceFloor}" />
          <path d="M 0,0 L 36,0 M 0,9 L 36,9 M 0,18 L 36,18 M 18,0 L 18,9 M 9,9 L 9,18 M 27,9 L 27,18" stroke="rgba(0,0,0,0.3)" stroke-width="1" />
        </pattern>
        <!-- Wooden slat wall pattern -->
        <pattern id="woodSlats" width="120" height="8" patternUnits="userSpaceOnUse">
          <rect width="120" height="7" fill="${slatWall}" />
          <line x1="0" y1="7.5" x2="120" y2="7.5" stroke="#1c120c" stroke-width="1" />
        </pattern>
        <!-- Lamp Glow Radial Gradient -->
        <radialGradient id="lampGlowWarm" cx="50%" cy="50%" r="50%">
          <stop offset="0%" stop-color="#fbbf24" stop-opacity="0.8" />
          <stop offset="40%" stop-color="#f59e0b" stop-opacity="0.4" />
          <stop offset="100%" stop-color="#f59e0b" stop-opacity="0" />
        </radialGradient>
        <radialGradient id="barLedCyan" cx="50%" cy="50%" r="50%">
          <stop offset="0%" stop-color="#00f5ff" stop-opacity="0.9" />
          <stop offset="60%" stop-color="#00d2ff" stop-opacity="0.3" />
          <stop offset="100%" stop-color="#00d2ff" stop-opacity="0" />
        </radialGradient>
      </defs>

      <!-- ── TUIN / ACHTERTUIN GRAS & VLONDER ── -->
      <rect x="0" y="${groundY}" width="${width}" height="${height - groundY}" fill="${lawnColor}" />
      
      <!-- Strakke keramische terrastegels onder de overkapping -->
      <polygon points="${oLeft - 30},${groundY + 45} ${oLeft + oW + 30},${groundY + 45} ${oLeft + oW + 10},${groundY} ${oLeft - 10},${groundY}" fill="url(#terraceTiles)" stroke="#0f172a" stroke-width="1.5" />

      <!-- Tuinbeplanting & schutting op de achtergrond -->
      <g opacity="0.6">
        <rect x="${oLeft - 70}" y="${groundY - 140}" width="50" height="140" fill="#2d3748" stroke="#1a202c" stroke-width="1" />
        <line x1="${oLeft - 70}" y1="${groundY - 100}" x2="${oLeft - 20}" y2="${groundY - 100}" stroke="#1a202c" stroke-width="1" />
        <ellipse cx="${oLeft - 45}" cy="${groundY - 130}" rx="22" ry="32" fill="#143424" />
        
        <rect x="${oLeft + oW + 20}" y="${groundY - 140}" width="50" height="140" fill="#2d3748" stroke="#1a202c" stroke-width="1" />
        <ellipse cx="${oLeft + oW + 45}" cy="${groundY - 125}" rx="24" ry="30" fill="#143424" />
      </g>

      <!-- ── OVERKAPPING ACHTERWANDEN (Zwarte/Donkerhouten lamellen) ── -->
      <!-- Linker achterwand (bij dartbaan) -->
      <rect x="${oLeft + 15}" y="${oTop + 35}" width="${oW * 0.42}" height="${oH - 35}" fill="url(#woodSlats)" stroke="#1a202c" stroke-width="1.5" />
      <!-- Rechter achterwand (bij de bar) -->
      <rect x="${oLeft + oW * 0.58}" y="${oTop + 35}" width="${oW * 0.40}" height="${oH - 35}" fill="url(#woodSlats)" stroke="#1a202c" stroke-width="1.5" />

      <!-- Warme sfeergloed over de binnenruimte als er lichten branden -->
      <rect x="${oLeft + 15}" y="${oTop + 35}" width="${oW - 30}" height="${oH - 35}" fill="#f59e0b" opacity="${ambientWarmth}" style="mix-blend-mode: screen; pointer-events: none; transition: opacity 0.5s ease;" />

      <!-- ── DARTBAAN HOEK (Links) ── -->
      <g id="dart-zone" style="cursor: pointer;" @click=${() => onToggleLight('light.overkapping_dartbaan_1_verlichting_ikea_tretakt_smart_plug')}>
        <title>Dartbaan verlichting (klik om te schakelen)</title>
        <!-- Dartbord achterplaat (Hout/Vilt) -->
        <rect x="${oLeft + oW * 0.16}" y="${oTop + 95}" width="65" height="85" rx="4" fill="#1e1b18" stroke="#3e2723" stroke-width="2" />
        
        <!-- Dartbord Surround ring -->
        <circle cx="${oLeft + oW * 0.16 + 32.5}" cy="${oTop + 137}" r="26" fill="#dc2626" />
        <!-- Bord zelf -->
        <circle cx="${oLeft + oW * 0.16 + 32.5}" cy="${oTop + 137}" r="19" fill="#0f172a" stroke="#fbbf24" stroke-width="0.8" />
        <circle cx="${oLeft + oW * 0.16 + 32.5}" cy="${oTop + 137}" r="3" fill="#10b981" />
        <circle cx="${oLeft + oW * 0.16 + 32.5}" cy="${oTop + 137}" r="1.2" fill="#ef4444" />

        <!-- Verlichte Dartbord LED Ring -->
        <circle cx="${oLeft + oW * 0.16 + 32.5}" cy="${oTop + 137}" r="27.5" fill="none" stroke="${dartRingOn ? '#00f5ff' : '#475569'}" stroke-width="2.5" style="transition: stroke 0.3s ease; filter: ${dartRingOn ? 'drop-shadow(0 0 6px #00f5ff)' : 'none'};" />
        
        <!-- Dartbaan PC / Schermpje -->
        <rect x="${oLeft + oW * 0.05}" y="${oTop + 110}" width="32" height="24" rx="2" fill="#0f172a" stroke="#334155" stroke-width="1.2" />
        <rect x="${oLeft + oW * 0.05 + 2}" y="${oTop + 112}" width="28" height="20" rx="1" fill="${pcPowerWatts > 0.5 ? '#1e3a5f' : '#05070a'}" />
        <text x="${oLeft + oW * 0.05 + 16}" y="${oTop + 125}" text-anchor="middle" fill="${pcPowerWatts > 0.5 ? '#38bdf8' : '#334155'}" font-size="7px" font-family="monospace" font-weight="bold">
          ${pcPowerWatts > 0.5 ? `${pcPowerWatts.toFixed(0)}W` : 'OFF'}
        </text>
        <rect x="${oLeft + oW * 0.05 + 14}" y="${oTop + 134}" width="4" height="12" fill="#334155" />
      </g>

      <!-- ── DE BAR MET LEDSTRIP (Rechts) ── -->
      <g id="bar-zone" style="cursor: pointer;" @click=${() => onToggleLight('light.overkapping_barledstrip_ikea_tretakt_smart_plug')}>
        <title>Bar LED-strip (klik om te schakelen)</title>
        <!-- Barmeubel onderbouw (Donker eiken / steigerhout) -->
        <polygon points="${oLeft + oW * 0.64},${groundY} ${oLeft + oW * 0.94},${groundY} ${oLeft + oW * 0.94},${oTop + 175} ${oLeft + oW * 0.64},${oTop + 175}" fill="#2a1d17" stroke="#170f0b" stroke-width="1.5" />
        
        <!-- Barblad (Bovenkant) -->
        <rect x="${oLeft + oW * 0.62}" y="${oTop + 168}" width="${oW * 0.34}" height="10" rx="2" fill="#5c4033" stroke="#2a1d17" stroke-width="1" />
        
        <!-- Bar LED-strip onder het barblad -->
        <rect x="${oLeft + oW * 0.63}" y="${oTop + 178}" width="${oW * 0.32}" height="3" fill="${barStripOn ? '#00f5ff' : '#334155'}" style="transition: fill 0.3s ease; filter: ${barStripOn ? 'drop-shadow(0 4px 10px #00f5ff)' : 'none'};" />

        <!-- 2 Barkrukken -->
        <!-- Kruk 1 -->
        <ellipse cx="${oLeft + oW * 0.70}" cy="${oTop + 195}" rx="12" ry="4" fill="#1e293b" />
        <line x1="${oLeft + oW * 0.70}" y1="${oTop + 195}" x2="${oLeft + oW * 0.68}" y2="${groundY}" stroke="#0f172a" stroke-width="2" />
        <line x1="${oLeft + oW * 0.70}" y1="${oTop + 195}" x2="${oLeft + oW * 0.72}" y2="${groundY}" stroke="#0f172a" stroke-width="2" />
        <!-- Kruk 2 -->
        <ellipse cx="${oLeft + oW * 0.84}" cy="${oTop + 195}" rx="12" ry="4" fill="#1e293b" />
        <line x1="${oLeft + oW * 0.84}" y1="${oTop + 195}" x2="${oLeft + oW * 0.82}" y2="${groundY}" stroke="#0f172a" stroke-width="2" />
        <line x1="${oLeft + oW * 0.84}" y1="${oTop + 195}" x2="${oLeft + oW * 0.86}" y2="${groundY}" stroke="#0f172a" stroke-width="2" />
      </g>

      <!-- ── OVERKAPPING CONSTRUCTIE (Staanders & Dakbalken) ── -->
      <!-- Zwarte robuuste stalen/houten staanders (Voorgrond) -->
      <!-- Linker staander -->
      <rect x="${oLeft}" y="${oTop + 20}" width="16" height="${oH - 20}" fill="${postColor}" stroke="#0f172a" stroke-width="1.5" rx="1" />
      <!-- Midden staander -->
      <rect x="${oLeft + oW * 0.50 - 8}" y="${oTop + 20}" width="16" height="${oH - 20}" fill="${postColor}" stroke="#0f172a" stroke-width="1.5" rx="1" />
      <!-- Rechter staander -->
      <rect x="${oLeft + oW - 16}" y="${oTop + 20}" width="16" height="${oH - 20}" fill="${postColor}" stroke="#0f172a" stroke-width="1.5" rx="1" />

      <!-- Dakbalk / Boei (Modern plat dak met overstek) -->
      <rect x="${oLeft - 20}" y="${oTop}" width="${oW + 40}" height="28" fill="#1b2430" stroke="#090d14" stroke-width="2" rx="2" />
      <!-- Aluminium daktrim -->
      <rect x="${oLeft - 20}" y="${oTop}" width="${oW + 40}" height="4" fill="#94a3b8" />

      <!-- ── VERLICHTING IN HET PLAFOND (Hanglampen & Spotjes) ── -->
      <!-- Hanglamp boven de tafel/kachel links -->
      <g style="cursor: pointer;" @click=${() => onToggleLight('light.overkapping_plafondlampkachel_ikea_tradfri_bulb_e27_ww_globe_806lm')}>
        <title>Plafondlamp Kachel (klik)</title>
        <line x1="${oLeft + oW * 0.30}" y1="${oTop + 28}" x2="${oLeft + oW * 0.30}" y2="${oTop + 65}" stroke="#0f172a" stroke-width="1.8" />
        <path d="M ${oLeft + oW * 0.30 - 14},${oTop + 75} L ${oLeft + oW * 0.30 + 14},${oTop + 75} L ${oLeft + oW * 0.30},${oTop + 65} Z" fill="#0f172a" />
        <circle cx="${oLeft + oW * 0.30}" cy="${oTop + 78}" r="6" fill="${lightsOn ? '#fff' : '#64748b'}" style="filter: ${lightsOn ? 'drop-shadow(0 0 10px #fbbf24)' : 'none'};" />
        ${lightsOn ? svg`<circle cx="${oLeft + oW * 0.30}" cy="${oTop + 85}" r="35" fill="url(#lampGlowWarm)" pointer-events="none" />` : ''}
      </g>

      <!-- Hanglamp boven de bar rechts -->
      <g style="cursor: pointer;" @click=${() => onToggleLight('light.overkapping_plafondlampbar_ikea_tradfri_bulb_e27_ww_globe_806lm')}>
        <title>Plafondlamp Bar (klik)</title>
        <line x1="${oLeft + oW * 0.78}" y1="${oTop + 28}" x2="${oLeft + oW * 0.78}" y2="${oTop + 65}" stroke="#0f172a" stroke-width="1.8" />
        <path d="M ${oLeft + oW * 0.78 - 14},${oTop + 75} L ${oLeft + oW * 0.78 + 14},${oTop + 75} L ${oLeft + oW * 0.78},${oTop + 65} Z" fill="#0f172a" />
        <circle cx="${oLeft + oW * 0.78}" cy="${oTop + 78}" r="6" fill="${lightsOn ? '#fff' : '#64748b'}" style="filter: ${lightsOn ? 'drop-shadow(0 0 10px #fbbf24)' : 'none'};" />
        ${lightsOn ? svg`<circle cx="${oLeft + oW * 0.78}" cy="${oTop + 85}" r="35" fill="url(#lampGlowWarm)" pointer-events="none" />` : ''}
      </g>

      <!-- Subtiele spotjes in de overstek -->
      ${[0.15, 0.45, 0.65, 0.88].map(ratio => svg`
        <circle cx="${oLeft + oW * ratio}" cy="${oTop + 25}" r="2.5" fill="${spotjesOn ? '#fbbf24' : '#475569'}" style="filter: ${spotjesOn ? 'drop-shadow(0 2px 4px #fbbf24)' : 'none'};" />
      `)}

      <!-- ── HUD KAART VOOR DE OVERKAPPING ── -->
      <g transform="translate(${centerX - 130}, ${height - 75})">
        <rect x="0" y="0" width="260" height="60" rx="14" fill="rgba(15, 23, 42, 0.85)" stroke="rgba(255,255,255,0.12)" style="backdrop-filter: blur(12px);" />
        
        <!-- Toggle button voor alle verlichting -->
        <g style="cursor: pointer;" @click=${() => onToggleLight('light.overkapping_verlichting')}>
          <circle cx="30" cy="30" r="16" fill="${anyLightOn ? 'rgba(251, 191, 36, 0.2)' : 'rgba(255,255,255,0.06)'}" stroke="${anyLightOn ? '#fbbf24' : 'rgba(255,255,255,0.15)'}" stroke-width="1.2" />
          <path d="M 30,22 L 30,28 M 30,34 L 30,36 M 24,25 L 28,28 M 36,25 L 32,28" stroke="${anyLightOn ? '#fbbf24' : '#94a3b8'}" stroke-width="1.6" stroke-linecap="round" />
          <circle cx="30" cy="30" r="4" fill="${anyLightOn ? '#fbbf24' : '#64748b'}" />
        </g>

        <text x="58" y="26" fill="#ffffff" font-size="13px" font-weight="600" font-family="'Inter', system-ui, sans-serif">Overkapping & Tuin</text>
        <text x="58" y="44" fill="${anyLightOn ? '#fbbf24' : 'rgba(255,255,255,0.5)'}" font-size="11px" font-family="'Inter', system-ui, sans-serif">
          ${anyLightOn ? 'Verlichting ingeschakeld' : 'Alle verlichting uit'} · Tik voor schakelen
        </text>
      </g>

      <!-- ── TERUG NAAR HUIS KNOP (Duidelijke floating navigatie) ── -->
      <g style="cursor: pointer;" @click=${() => onReturnToHouse()}>
        <g transform="translate(20, 20)">
          <rect x="0" y="0" width="135" height="38" rx="19" fill="rgba(15, 23, 42, 0.85)" stroke="rgba(255,255,255,0.2)" style="backdrop-filter: blur(8px);" />
          <path d="M 22,20 L 16,14 L 22,8 M 16,14 L 30,14" fill="none" stroke="#38bdf8" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" />
          <text x="38" y="24" fill="#ffffff" font-size="12px" font-weight="600" font-family="'Inter', system-ui, sans-serif">Naar Huis</text>
        </g>
      </g>
    </g>
  `;
}
