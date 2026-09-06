import { LitElement, html, svg, css, TemplateResult, PropertyValues } from 'lit';
import { property, state } from 'lit/decorators.js';
import { HomeAssistant } from './types';

export interface EnergyDashboardConfig {
  type: string;
  title?: string;
  entities?: {
    grid_power?: string;
    grid_import_today?: string;
    grid_export_today?: string;
    solar_power?: string;
    solar_today?: string;
    battery_power?: string;
    battery_soc?: string;
    battery_status?: string;
    battery_charged_today?: string;
    battery_discharged_today?: string;
    home_power?: string;
    home_today?: string;
    tariff?: string;
  };
}

export class EnergyDashboardCard extends LitElement {
  @property({ attribute: false }) public hass!: HomeAssistant;
  @property({ attribute: false }) public config!: EnergyDashboardConfig;

  @state() private _selectedPeriod: 'vandaag' | 'maand' | 'jaar' = 'vandaag';
  @state() private _todayStats: any = {};
  @state() private _monthlyStats: any = {};
  @state() private _loadingStats: boolean = false;
  @state() private _lastFetchTime: number = 0;

  static styles = css`
    :host {
      display: block;
      width: 100%;
      height: 100%;
      box-sizing: border-box;
      font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Inter, sans-serif;
      color: #f1f5f9;
      background-color: #12151b;
      -webkit-font-smoothing: antialiased;
    }

    * {
      box-sizing: border-box;
    }

    .dashboard-wrapper {
      display: flex;
      flex-direction: column;
      gap: 20px;
      padding: 24px;
      min-height: 100%;
      background: #12151b;
    }

    .dashboard-header {
      display: flex;
      justify-content: space-between;
      align-items: center;
      padding-bottom: 4px;
    }

    .header-title-box {
      display: flex;
      align-items: center;
      gap: 12px;
    }

    .live-indicator {
      display: flex;
      align-items: center;
      gap: 6px;
      padding: 4px 10px;
      background: rgba(16, 185, 129, 0.12);
      border: 1px solid rgba(16, 185, 129, 0.35);
      border-radius: 9999px;
      font-size: 11px;
      font-weight: 700;
      letter-spacing: 0.08em;
      color: #10b981;
      text-transform: uppercase;
    }

    .pulse-dot {
      width: 7px;
      height: 7px;
      background-color: #10b981;
      border-radius: 50%;
      animation: pulse 2s cubic-bezier(0.4, 0, 0.6, 1) infinite;
    }

    @keyframes pulse {
      0%, 100% { opacity: 1; transform: scale(1); }
      50% { opacity: 0.4; transform: scale(0.85); }
    }

    .header-title {
      font-size: 22px;
      font-weight: 700;
      color: #f8fafc;
      letter-spacing: -0.02em;
      margin: 0;
    }

    .header-kpi-bar {
      display: flex;
      align-items: center;
      gap: 16px;
    }

    .kpi-pill {
      display: flex;
      align-items: center;
      gap: 8px;
      background: #181d26;
      border: 1px solid rgba(255, 255, 255, 0.08);
      border-radius: 12px;
      padding: 6px 14px;
      font-size: 13px;
      color: #94a3b8;
    }

    .kpi-pill strong {
      color: #f1f5f9;
      font-weight: 600;
    }

    .kpi-pill.positive strong {
      color: #10b981;
    }

    .kpi-pill.warning strong {
      color: #ef4444;
    }

    /* Main Grid */
    .dashboard-grid {
      display: grid;
      grid-template-columns: 1.15fr 1fr;
      gap: 24px;
      flex: 1;
    }

    @media (max-width: 1024px) {
      .dashboard-grid {
        grid-template-columns: 1fr;
      }
    }

    /* Panels */
    .panel-card {
      background: #181d26;
      border: 1px solid #10b981;
      border-radius: 20px;
      padding: 24px;
      display: flex;
      flex-direction: column;
      position: relative;
      overflow: hidden;
      box-shadow: 0 12px 32px rgba(0, 0, 0, 0.35);
    }

    .panel-title-bar {
      display: flex;
      justify-content: space-between;
      align-items: center;
      margin-bottom: 20px;
    }

    .panel-title {
      font-size: 16px;
      font-weight: 600;
      color: #e2e8f0;
      letter-spacing: -0.01em;
      margin: 0;
      display: flex;
      align-items: center;
      gap: 8px;
    }

    /* Period Tabs */
    .tabs-container {
      display: flex;
      background: #12151b;
      border: 1px solid rgba(255, 255, 255, 0.08);
      border-radius: 12px;
      padding: 3px;
      gap: 2px;
    }

    .tab-btn {
      background: transparent;
      border: none;
      color: #94a3b8;
      padding: 6px 14px;
      border-radius: 9px;
      font-size: 13px;
      font-weight: 500;
      cursor: pointer;
      transition: all 0.2s ease;
    }

    .tab-btn:hover {
      color: #f1f5f9;
    }

    .tab-btn.active {
      background: #252d3d;
      color: #10b981;
      font-weight: 600;
      box-shadow: 0 2px 6px rgba(0, 0, 0, 0.25);
    }

    /* Flowchart Canvas */
    .flow-container {
      position: relative;
      width: 100%;
      min-height: 480px;
      display: flex;
      align-items: center;
      justify-content: center;
      flex: 1;
    }

    .unified-flow-svg {
      width: 100%;
      max-width: 540px;
      height: 100%;
      min-height: 460px;
      overflow: visible;
    }

    /* Disc HTML inside ForeignObject */
    .node-disc-content {
      width: 100%;
      height: 100%;
      display: flex;
      flex-direction: column;
      align-items: center;
      justify-content: center;
      text-align: center;
      padding: 6px;
      user-select: none;
      cursor: pointer;
    }

    .node-icon-box {
      width: 24px;
      height: 24px;
      display: flex;
      align-items: center;
      justify-content: center;
      margin-bottom: 2px;
    }

    .node-icon-box svg {
      width: 20px;
      height: 20px;
    }

    .node-title {
      font-size: 11px;
      font-weight: 700;
      text-transform: uppercase;
      letter-spacing: 0.06em;
      color: #94a3b8;
      line-height: 1.2;
    }

    .node-val {
      font-size: 21px;
      font-weight: 700;
      color: #f8fafc;
      line-height: 1.15;
      display: flex;
      align-items: baseline;
      justify-content: center;
      gap: 2px;
      margin: 2px 0;
    }

    .node-val .unit {
      font-size: 12px;
      font-weight: 500;
      color: #94a3b8;
    }

    .node-subtext {
      font-size: 10.5px;
      font-weight: 500;
      color: #94a3b8;
      line-height: 1.2;
      white-space: nowrap;
    }

    .node-status-pill {
      display: inline-block;
      margin-top: 3px;
      padding: 1px 7px;
      border-radius: 9999px;
      font-size: 9.5px;
      font-weight: 600;
      letter-spacing: 0.03em;
    }

    .pill-green {
      background: rgba(16, 185, 129, 0.15);
      color: #10b981;
      border: 1px solid rgba(16, 185, 129, 0.3);
    }

    .pill-blue {
      background: rgba(56, 189, 248, 0.15);
      color: #38bdf8;
      border: 1px solid rgba(56, 189, 248, 0.3);
    }

    .pill-amber {
      background: rgba(245, 158, 11, 0.15);
      color: #f59e0b;
      border: 1px solid rgba(245, 158, 11, 0.3);
    }

    .pill-red {
      background: rgba(239, 68, 68, 0.15);
      color: #ef4444;
      border: 1px solid rgba(239, 68, 68, 0.3);
    }

    /* Chart & History Content */
    .chart-container {
      display: flex;
      flex-direction: column;
      flex: 1;
      justify-content: space-between;
      gap: 16px;
    }

    .chart-svg-box {
      position: relative;
      width: 100%;
      height: 320px;
      background: #13161e;
      border: 1px solid rgba(255, 255, 255, 0.05);
      border-radius: 14px;
      overflow: hidden;
      padding: 12px;
    }

    .chart-svg {
      width: 100%;
      height: 100%;
    }

    .chart-kpi-row {
      display: grid;
      grid-template-columns: repeat(3, 1fr);
      gap: 12px;
    }

    .chart-kpi-card {
      background: #141821;
      border: 1px solid rgba(255, 255, 255, 0.06);
      border-radius: 14px;
      padding: 14px;
      display: flex;
      flex-direction: column;
      gap: 4px;
    }

    .chart-kpi-label {
      font-size: 11px;
      font-weight: 500;
      color: #94a3b8;
      text-transform: uppercase;
      letter-spacing: 0.05em;
    }

    .chart-kpi-value {
      font-size: 18px;
      font-weight: 700;
      color: #f8fafc;
    }

    .chart-kpi-sub {
      font-size: 11px;
      color: #64748b;
    }

    .chart-legend {
      display: flex;
      align-items: center;
      gap: 16px;
      font-size: 12px;
      color: #94a3b8;
      margin-top: 6px;
    }

    .legend-item {
      display: flex;
      align-items: center;
      gap: 6px;
    }

    .legend-color {
      width: 10px;
      height: 10px;
      border-radius: 2px;
    }
  `;

  public setConfig(config: EnergyDashboardConfig): void {
    if (!config) {
      throw new Error('Geen geldige configuratie opgegeven.');
    }
    this.config = {
      title: 'Energie Beheer',
      ...config
    };
  }

  protected updated(changedProperties: PropertyValues): void {
    super.updated(changedProperties);
    if (changedProperties.has('hass') && this.hass) {
      const now = Date.now();
      if (now - this._lastFetchTime > 60000) {
        this._fetchHistoricalData();
      }
    }
  }

  private async _fetchHistoricalData(): Promise<void> {
    if (!this.hass || this._loadingStats) return;
    this._loadingStats = true;
    this._lastFetchTime = Date.now();

    try {
      const now = new Date();
      const startOfDay = new Date(now.getFullYear(), now.getMonth(), now.getDate(), 0, 0, 0);
      const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1, 0, 0, 0);

      const todayRes = await (this.hass as any).callWS({
        type: 'recorder/statistics_during_period',
        start_time: startOfDay.toISOString(),
        statistic_ids: [
          this.config.entities?.solar_power || 'sensor.totale_live_zonnestroom',
          this.config.entities?.grid_power || 'sensor.p1_meter_power',
          this.config.entities?.battery_power || 'sensor.thuisbatterij_vermogen',
          this.config.entities?.home_power || 'sensor.live_huisverbruik'
        ],
        period: '5minute'
      });

      if (todayRes) {
        this._todayStats = todayRes;
      }

      const monthRes = await (this.hass as any).callWS({
        type: 'recorder/statistics_during_period',
        start_time: startOfMonth.toISOString(),
        statistic_ids: [
          this.config.entities?.solar_today || 'sensor.totale_opwek_vandaag_2',
          this.config.entities?.grid_import_today || 'sensor.p1_netstroom_afname_vandaag',
          this.config.entities?.home_today || 'sensor.echt_huisverbruik_vandaag'
        ],
        period: 'day'
      });

      if (monthRes) {
        this._monthlyStats = monthRes;
      }
    } catch (e) {
      console.warn('Fout bij ophalen statistieken via WebSocket:', e);
    } finally {
      this._loadingStats = false;
      this.requestUpdate();
    }
  }

  private _getNumber(entityId?: string, fallback = 0): number {
    if (!entityId || !this.hass || !this.hass.states[entityId]) return fallback;
    const val = parseFloat(this.hass.states[entityId].state);
    return isNaN(val) ? fallback : val;
  }

  private _formatPower(watts: number): { value: string; unit: string } {
    const abs = Math.abs(watts);
    if (abs >= 1000) {
      return {
        value: (abs / 1000).toLocaleString('nl-NL', { minimumFractionDigits: 1, maximumFractionDigits: 1 }),
        unit: 'kW'
      };
    }
    return {
      value: Math.round(abs).toString(),
      unit: 'W'
    };
  }

  private _formatEnergy(kWh: number): string {
    return kWh.toLocaleString('nl-NL', { minimumFractionDigits: 1, maximumFractionDigits: 1 }) + ' kWh';
  }

  protected render(): TemplateResult {
    const cfg = this.config.entities || {};

    // 1. Raw sensor readings
    const solarW = Math.max(0, this._getNumber(cfg.solar_power || 'sensor.totale_live_zonnestroom'));
    const solarToday = this._getNumber(cfg.solar_today || 'sensor.totale_opwek_vandaag_2');

    const gridW = this._getNumber(cfg.grid_power || 'sensor.p1_meter_power');
    const isGridImport = gridW >= 0;
    const gridImportW = Math.max(0, gridW);
    const gridExportW = Math.max(0, -gridW);
    const gridImportToday = this._getNumber(cfg.grid_import_today || 'sensor.p1_netstroom_afname_vandaag');
    const gridExportToday = this._getNumber(cfg.grid_export_today || 'sensor.p1_teruglevering_vandaag');

    const batRawW = this._getNumber(cfg.battery_power || 'sensor.thuisbatterij_vermogen');
    const batChargeW = Math.max(0, batRawW);
    const batDischargeW = Math.max(0, -batRawW);
    const batSoC = Math.min(100, Math.max(0, this._getNumber(cfg.battery_soc || 'sensor.thuisbatterij_percentage', 99)));
    const batChargedToday = this._getNumber(cfg.battery_charged_today || 'sensor.thuisbatterij_levering_vandaag');
    const isBatCharging = batChargeW > 20;
    const isBatDischarging = batDischargeW > 20;

    const homeRawW = Math.max(0, this._getNumber(cfg.home_power || 'sensor.live_huisverbruik'));
    const homeToday = this._getNumber(cfg.home_today || 'sensor.echt_huisverbruik_vandaag');

    // 2. Physical Flow Routing Engine
    let availSolar = solarW;
    let demandHome = homeRawW;
    let demandBatCharge = batChargeW;
    let availBatDischarge = batDischargeW;
    let availGridImport = gridImportW;

    // A: Solar to Home
    const flowSolarToHome = Math.min(availSolar, demandHome);
    availSolar -= flowSolarToHome;
    demandHome -= flowSolarToHome;

    // B: Solar to Battery
    const flowSolarToBat = Math.min(availSolar, demandBatCharge);
    availSolar -= flowSolarToBat;
    demandBatCharge -= flowSolarToBat;

    // C: Solar to Grid (Export)
    const flowSolarToGrid = Math.min(availSolar, gridExportW);

    // D: Battery to Home
    const flowBatToHome = Math.min(availBatDischarge, demandHome);
    availBatDischarge -= flowBatToHome;
    demandHome -= flowBatToHome;

    // E: Battery to Grid (Powerplay export)
    const flowBatToGrid = Math.min(availBatDischarge, Math.max(0, gridExportW - flowSolarToGrid));

    // F: Grid to Home (Import)
    const flowGridToHome = Math.min(availGridImport, demandHome);
    availGridImport -= flowGridToHome;
    demandHome -= flowGridToHome;

    // G: Grid to Battery (Dynamisch laden vanaf net!)
    const flowGridToBat = Math.min(availGridImport, demandBatCharge);

    // Autarky / Zelfvoorziening
    const totalConsumedToday = homeToday + batChargedToday;
    const autarky = totalConsumedToday > 0 ? Math.round((Math.min(solarToday, totalConsumedToday) / totalConsumedToday) * 100) : 0;

    // Geometry layout:
    // Swapped layout:
    // Top-Left: ZON (x=125, y=110)
    // Top-Right: HUIS (x=395, y=110)
    // Bottom-Left: BATTERIJ (x=125, y=330)
    // Bottom-Right: NET (x=395, y=330)
    const xL = 125;
    const xR = 395;
    const yT = 110;
    const yB = 330;
    const R = 75; // outer ring radius
    const rDisc = 65; // inner disc radius
    const circ = 2 * Math.PI * R; // ~471.24

    // House Segmented Ring:
    const effectiveHome = (flowSolarToHome + flowBatToHome + flowGridToHome) || homeRawW || 1;
    const fracSolar = Math.min(1, flowSolarToHome / effectiveHome);
    const fracBat = Math.min(1, flowBatToHome / effectiveHome);
    const fracGrid = Math.min(1, flowGridToHome / effectiveHome);

    const lenSolar = fracSolar * circ;
    const lenBat = fracBat * circ;
    const lenGrid = fracGrid * circ;

    const offsetSolar = 0;
    const offsetBat = -lenSolar;
    const offsetGrid = -(lenSolar + lenBat);

    // Battery SoC progress arc
    const batProgress = (batSoC / 100) * circ;
    const batOffset = circ - batProgress;

    // Exact connection points (touching ring boundary at radius R=75):
    // 1. Zon -> Huis (Top Horizontal line: from (xL+R, yT) to (xR-R, yT))
    const pZonHuis = `M ${xL + R} ${yT} L ${xR - R} ${yT}`;

    // 2. Zon -> Batterij (Left Vertical line: from (xL, yT+R) to (xL, yB-R))
    const pZonBat = `M ${xL} ${yT + R} L ${xL} ${yB - R}`;

    // 3. Net -> Huis (Right Vertical line: from (xR, yB-R) to (xR, yT+R))
    const pNetHuis = `M ${xR} ${yB - R} L ${xR} ${yT + R}`;

    // 4. Net -> Batterij (Bottom Horizontal line: from (xR-R, yB) to (xL+R, yB))
    const pNetBat = `M ${xR - R} ${yB} L ${xL + R} ${yB}`;
    const pBatNet = `M ${xL + R} ${yB} L ${xR - R} ${yB}`;

    // 5. Batterij -> Huis (Smooth central S-curve: from (xL+R, yB) up through center x=260 to (xR-R, yT))
    const xMid = (xL + xR) / 2; // 260
    const pBatHuis = `M ${xL + R} ${yB} L ${xMid - 25} ${yB} Q ${xMid} ${yB} ${xMid} ${yB - 25} L ${xMid} ${yT + 25} Q ${xMid} ${yT} ${xMid + 25} ${yT} L ${xR - R} ${yT}`;

    // 6. Zon -> Net (Smooth central S-curve: from (xL+R, yT) down through center x=260 to (xR-R, yB))
    const pZonNet = `M ${xL + R} ${yT} L ${xMid - 25} ${yT} Q ${xMid} ${yT} ${xMid} ${yT + 25} L ${xMid} ${yB - 25} Q ${xMid} ${yB} ${xMid + 25} ${yB} L ${xR - R} ${yB}`;

    const getDur = (watts: number) => {
      return Math.max(0.75, Math.min(3.5, 3000 / Math.max(100, watts))).toFixed(2);
    };

    return html`
      <div class="dashboard-wrapper">
        <!-- Header -->
        <div class="dashboard-header">
          <div class="header-title-box">
            <div class="live-indicator">
              <span class="pulse-dot"></span>
              LIVE 1s
            </div>
            <h1 class="header-title">${this.config.title || 'Energie Overzicht'}</h1>
          </div>

          <div class="header-kpi-bar">
            <div class="kpi-pill">
              Autonomie: <strong>${autarky}%</strong>
            </div>
            <div class="kpi-pill ${isGridImport ? 'warning' : 'positive'}">
              Netto vandaag: <strong>${(gridImportToday - gridExportToday).toFixed(1)} kWh</strong>
            </div>
          </div>
        </div>

        <!-- Grid Body -->
        <div class="dashboard-grid">
          <!-- Left: Flowchart Panel -->
          <div class="panel-card">
            <div class="panel-title-bar">
              <h2 class="panel-title">
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#10b981" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                  <polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2"></polygon>
                </svg>
                Stroombalans Live
              </h2>
              <span style="font-size: 12px; color: #94a3b8;">Realtime energiestromen</span>
            </div>

            <div class="flow-container">
              <!-- Fully Coordinated SVG with mathematical sub-pixel alignment -->
              <svg class="unified-flow-svg" viewBox="0 0 520 440">
                <defs>
                  <filter id="glow-gold" x="-50%" y="-50%" width="200%" height="200%">
                    <feGaussianBlur stdDeviation="2.5" result="blur" />
                    <feMerge>
                      <feMergeNode in="blur" />
                      <feMergeNode in="SourceGraphic" />
                    </feMerge>
                  </filter>
                  <filter id="glow-green" x="-50%" y="-50%" width="200%" height="200%">
                    <feGaussianBlur stdDeviation="2.5" result="blur" />
                    <feMerge>
                      <feMergeNode in="blur" />
                      <feMergeNode in="SourceGraphic" />
                    </feMerge>
                  </filter>
                  <filter id="glow-blue" x="-50%" y="-50%" width="200%" height="200%">
                    <feGaussianBlur stdDeviation="2.5" result="blur" />
                    <feMerge>
                      <feMergeNode in="blur" />
                      <feMergeNode in="SourceGraphic" />
                    </feMerge>
                  </filter>
                </defs>

                <!-- 1. BASE STATIC TRACKS (Subtle dotted lines connecting node edges) -->
                <path d="${pZonHuis}" fill="none" stroke="rgba(255, 255, 255, 0.12)" stroke-width="1.5" stroke-dasharray="3 5" />
                <path d="${pZonBat}" fill="none" stroke="rgba(255, 255, 255, 0.12)" stroke-width="1.5" stroke-dasharray="3 5" />
                <path d="${pNetHuis}" fill="none" stroke="rgba(255, 255, 255, 0.12)" stroke-width="1.5" stroke-dasharray="3 5" />
                <path d="${pNetBat}" fill="none" stroke="rgba(255, 255, 255, 0.12)" stroke-width="1.5" stroke-dasharray="3 5" />
                <path d="${pBatHuis}" fill="none" stroke="rgba(255, 255, 255, 0.12)" stroke-width="1.5" stroke-dasharray="3 5" />
                <path d="${pZonNet}" fill="none" stroke="rgba(255, 255, 255, 0.12)" stroke-width="1.5" stroke-dasharray="3 5" />

                <!-- 2. ACTIVE FLOWS & GLOWING MOVING BOLLETJES -->

                <!-- Flow Zon -> Huis (Direct horizontal top line) -->
                ${flowSolarToHome > 20 ? svg`
                  <path d="${pZonHuis}" fill="none" stroke="rgba(245, 158, 11, 0.35)" stroke-width="2" />
                  <circle r="4.5" fill="#f59e0b" filter="url(#glow-gold)">
                    <animateMotion dur="${getDur(flowSolarToHome)}s" repeatCount="indefinite" path="${pZonHuis}" />
                  </circle>
                  <circle r="4.5" fill="#f59e0b" filter="url(#glow-gold)">
                    <animateMotion dur="${getDur(flowSolarToHome)}s" begin="-${(parseFloat(getDur(flowSolarToHome))/2).toFixed(2)}s" repeatCount="indefinite" path="${pZonHuis}" />
                  </circle>
                ` : ''}

                <!-- Flow Zon -> Batterij (Direct vertical left line) -->
                ${flowSolarToBat > 20 ? svg`
                  <path d="${pZonBat}" fill="none" stroke="rgba(245, 158, 11, 0.35)" stroke-width="2" />
                  <circle r="4.5" fill="#f59e0b" filter="url(#glow-gold)">
                    <animateMotion dur="${getDur(flowSolarToBat)}s" repeatCount="indefinite" path="${pZonBat}" />
                  </circle>
                  <circle r="4.5" fill="#f59e0b" filter="url(#glow-gold)">
                    <animateMotion dur="${getDur(flowSolarToBat)}s" begin="-${(parseFloat(getDur(flowSolarToBat))/2).toFixed(2)}s" repeatCount="indefinite" path="${pZonBat}" />
                  </circle>
                ` : ''}

                <!-- Flow Net -> Huis (Direct vertical right line up) -->
                ${flowGridToHome > 20 ? svg`
                  <path d="${pNetHuis}" fill="none" stroke="rgba(56, 189, 248, 0.35)" stroke-width="2" />
                  <circle r="4.5" fill="#38bdf8" filter="url(#glow-blue)">
                    <animateMotion dur="${getDur(flowGridToHome)}s" repeatCount="indefinite" path="${pNetHuis}" />
                  </circle>
                  <circle r="4.5" fill="#38bdf8" filter="url(#glow-blue)">
                    <animateMotion dur="${getDur(flowGridToHome)}s" begin="-${(parseFloat(getDur(flowGridToHome))/2).toFixed(2)}s" repeatCount="indefinite" path="${pNetHuis}" />
                  </circle>
                ` : ''}

                <!-- Flow Net -> Batterij (Direct horizontal bottom line left) -->
                ${flowGridToBat > 20 ? svg`
                  <path d="${pNetBat}" fill="none" stroke="rgba(56, 189, 248, 0.35)" stroke-width="2" />
                  <circle r="4.5" fill="#38bdf8" filter="url(#glow-blue)">
                    <animateMotion dur="${getDur(flowGridToBat)}s" repeatCount="indefinite" path="${pNetBat}" />
                  </circle>
                  <circle r="4.5" fill="#38bdf8" filter="url(#glow-blue)">
                    <animateMotion dur="${getDur(flowGridToBat)}s" begin="-${(parseFloat(getDur(flowGridToBat))/2).toFixed(2)}s" repeatCount="indefinite" path="${pNetBat}" />
                  </circle>
                ` : ''}

                <!-- Flow Batterij -> Huis (Central smooth S-curve) -->
                ${flowBatToHome > 20 ? svg`
                  <path d="${pBatHuis}" fill="none" stroke="rgba(16, 185, 129, 0.35)" stroke-width="2" />
                  <circle r="4.5" fill="#10b981" filter="url(#glow-green)">
                    <animateMotion dur="${getDur(flowBatToHome)}s" repeatCount="indefinite" path="${pBatHuis}" />
                  </circle>
                  <circle r="4.5" fill="#10b981" filter="url(#glow-green)">
                    <animateMotion dur="${getDur(flowBatToHome)}s" begin="-${(parseFloat(getDur(flowBatToHome))/2).toFixed(2)}s" repeatCount="indefinite" path="${pBatHuis}" />
                  </circle>
                ` : ''}

                <!-- Flow Zon -> Net (Central smooth S-curve) -->
                ${flowSolarToGrid > 20 ? svg`
                  <path d="${pZonNet}" fill="none" stroke="rgba(16, 185, 129, 0.35)" stroke-width="2" />
                  <circle r="4.5" fill="#10b981" filter="url(#glow-green)">
                    <animateMotion dur="${getDur(flowSolarToGrid)}s" repeatCount="indefinite" path="${pZonNet}" />
                  </circle>
                  <circle r="4.5" fill="#10b981" filter="url(#glow-green)">
                    <animateMotion dur="${getDur(flowSolarToGrid)}s" begin="-${(parseFloat(getDur(flowSolarToGrid))/2).toFixed(2)}s" repeatCount="indefinite" path="${pZonNet}" />
                  </circle>
                ` : ''}

                <!-- Flow Batterij -> Net (Direct horizontal bottom line right) -->
                ${flowBatToGrid > 20 ? svg`
                  <path d="${pBatNet}" fill="none" stroke="rgba(16, 185, 129, 0.35)" stroke-width="2" />
                  <circle r="4.5" fill="#10b981" filter="url(#glow-green)">
                    <animateMotion dur="${getDur(flowBatToGrid)}s" repeatCount="indefinite" path="${pBatNet}" />
                  </circle>
                  <circle r="4.5" fill="#10b981" filter="url(#glow-green)">
                    <animateMotion dur="${getDur(flowBatToGrid)}s" begin="-${(parseFloat(getDur(flowBatToGrid))/2).toFixed(2)}s" repeatCount="indefinite" path="${pBatNet}" />
                  </circle>
                ` : ''}

                <!-- 3. THE 4 NODES (Exact coordinated placement) -->

                <!-- NODE 1: ZON (Top-Left x=125, y=110) -->
                <g transform="translate(${xL}, ${yT})">
                  <!-- Outer Ring -->
                  <circle cx="0" cy="0" r="${R}" fill="none" stroke="rgba(245, 158, 11, 0.15)" stroke-width="8" />
                  <circle cx="0" cy="0" r="${R}" fill="none" stroke="#f59e0b" stroke-width="8"
                    stroke-dasharray="${circ}" stroke-dashoffset="${solarW > 0 ? 0 : circ}"
                    transform="rotate(-90)" stroke-linecap="round" />
                  <!-- Inner Solid Disc -->
                  <circle cx="0" cy="0" r="${rDisc}" fill="#141821" stroke="rgba(255, 255, 255, 0.08)" stroke-width="1" />
                  <!-- Disc Content -->
                  <foreignObject x="${-rDisc}" y="${-rDisc}" width="${rDisc * 2}" height="${rDisc * 2}">
                    <div class="node-disc-content">
                      <div class="node-icon-box" style="color: #f59e0b;">
                        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round">
                          <circle cx="12" cy="12" r="5"></circle>
                          <line x1="12" y1="1" x2="12" y2="3"></line>
                          <line x1="12" y1="21" x2="12" y2="23"></line>
                          <line x1="4.22" y1="4.22" x2="5.64" y2="5.64"></line>
                          <line x1="18.36" y1="18.36" x2="19.78" y2="19.78"></line>
                          <line x1="1" y1="12" x2="3" y2="12"></line>
                          <line x1="21" y1="12" x2="23" y2="12"></line>
                          <line x1="4.22" y1="19.78" x2="5.64" y2="18.36"></line>
                          <line x1="18.36" y1="5.64" x2="19.78" y2="4.22"></line>
                        </svg>
                      </div>
                      <span class="node-title">Zon</span>
                      <div class="node-val">
                        ${this._formatPower(solarW).value}
                        <span class="unit">${this._formatPower(solarW).unit}</span>
                      </div>
                      <span class="node-subtext">Vandaag ${this._formatEnergy(solarToday)}</span>
                    </div>
                  </foreignObject>
                </g>

                <!-- NODE 2: HUIS (Top-Right x=395, y=110) -->
                <g transform="translate(${xR}, ${yT})">
                  <!-- Base Track -->
                  <circle cx="0" cy="0" r="${R}" fill="none" stroke="rgba(255, 255, 255, 0.08)" stroke-width="8" />
                  <!-- Solar Segment (Yellow) -->
                  ${lenSolar > 0 ? svg`
                    <circle cx="0" cy="0" r="${R}" fill="none" stroke="#f59e0b" stroke-width="8"
                      stroke-dasharray="${lenSolar} ${circ}" stroke-dashoffset="${offsetSolar}" transform="rotate(-90)" />
                  ` : ''}
                  <!-- Battery Segment (Green) -->
                  ${lenBat > 0 ? svg`
                    <circle cx="0" cy="0" r="${R}" fill="none" stroke="#10b981" stroke-width="8"
                      stroke-dasharray="${lenBat} ${circ}" stroke-dashoffset="${offsetBat}" transform="rotate(-90)" />
                  ` : ''}
                  <!-- Grid Segment (Blue) -->
                  ${lenGrid > 0 ? svg`
                    <circle cx="0" cy="0" r="${R}" fill="none" stroke="#38bdf8" stroke-width="8"
                      stroke-dasharray="${lenGrid} ${circ}" stroke-dashoffset="${offsetGrid}" transform="rotate(-90)" />
                  ` : ''}
                  <!-- Inner Solid Disc -->
                  <circle cx="0" cy="0" r="${rDisc}" fill="#141821" stroke="rgba(255, 255, 255, 0.08)" stroke-width="1" />
                  <!-- Disc Content -->
                  <foreignObject x="${-rDisc}" y="${-rDisc}" width="${rDisc * 2}" height="${rDisc * 2}">
                    <div class="node-disc-content">
                      <div class="node-icon-box" style="color: #f1f5f9;">
                        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                          <path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"></path>
                          <polyline points="9 22 9 12 15 12 15 22"></polyline>
                        </svg>
                      </div>
                      <span class="node-title">Huis</span>
                      <div class="node-val">
                        ${this._formatPower(homeRawW).value}
                        <span class="unit">${this._formatPower(homeRawW).unit}</span>
                      </div>
                      <span class="node-subtext">Vandaag ${this._formatEnergy(homeToday)}</span>
                    </div>
                  </foreignObject>
                </g>

                <!-- NODE 3: BATTERIJ (Bottom-Left x=125, y=330) -->
                <g transform="translate(${xL}, ${yB})">
                  <!-- Background track -->
                  <circle cx="0" cy="0" r="${R}" fill="none" stroke="rgba(255, 255, 255, 0.08)" stroke-width="8" />
                  <!-- Dynamic Progress Ring for SoC % -->
                  <circle cx="0" cy="0" r="${R}" fill="none" stroke="#10b981" stroke-width="8"
                    stroke-dasharray="${circ}" stroke-dashoffset="${batOffset}"
                    transform="rotate(-90)" stroke-linecap="round" />
                  <!-- Inner Solid Disc -->
                  <circle cx="0" cy="0" r="${rDisc}" fill="#141821" stroke="rgba(255, 255, 255, 0.08)" stroke-width="1" />
                  <!-- Disc Content -->
                  <foreignObject x="${-rDisc}" y="${-rDisc}" width="${rDisc * 2}" height="${rDisc * 2}">
                    <div class="node-disc-content">
                      <div class="node-icon-box" style="color: #10b981;">
                        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                          <rect x="2" y="7" width="16" height="10" rx="2" ry="2"></rect>
                          <line x1="22" y1="11" x2="22" y2="13"></line>
                          <polygon points="10 9 7 13 11 13 8 16 13 12 9 12 10 9" fill="#10b981" stroke="none"></polygon>
                        </svg>
                      </div>
                      <span class="node-title">Batterij</span>
                      <div class="node-val">
                        ${batSoC.toFixed(0)}<span class="unit" style="font-size: 15px;">%</span>
                      </div>
                      <span class="node-subtext">
                        ${batRawW !== 0 ? `${this._formatPower(batRawW).value} ${this._formatPower(batRawW).unit}` : 'Standby'}
                      </span>
                      <span class="node-status-pill ${isBatCharging ? 'pill-green' : isBatDischarging ? 'pill-amber' : ''}">
                        ${isBatCharging ? 'Laden' : isBatDischarging ? 'Ontladen' : 'Standby'}
                      </span>
                    </div>
                  </foreignObject>
                </g>

                <!-- NODE 4: NET (Bottom-Right x=395, y=330) -->
                <g transform="translate(${xR}, ${yB})">
                  <!-- Outer Ring -->
                  <circle cx="0" cy="0" r="${R}" fill="none" stroke="rgba(255, 255, 255, 0.08)" stroke-width="8" />
                  <circle cx="0" cy="0" r="${R}" fill="none" stroke="${isGridImport ? '#38bdf8' : '#10b981'}" stroke-width="8"
                    stroke-dasharray="${circ}" stroke-dashoffset="0"
                    transform="rotate(-90)" stroke-linecap="round" />
                  <!-- Inner Solid Disc -->
                  <circle cx="0" cy="0" r="${rDisc}" fill="#141821" stroke="rgba(255, 255, 255, 0.08)" stroke-width="1" />
                  <!-- Disc Content -->
                  <foreignObject x="${-rDisc}" y="${-rDisc}" width="${rDisc * 2}" height="${rDisc * 2}">
                    <div class="node-disc-content">
                      <div class="node-icon-box" style="color: ${isGridImport ? '#38bdf8' : '#10b981'};">
                        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                          <path d="M4 22h16"></path>
                          <path d="M7 22l5-19 5 19"></path>
                          <path d="M6 13h12"></path>
                          <path d="M8 8h8"></path>
                        </svg>
                      </div>
                      <span class="node-title">Net</span>
                      <div class="node-val" style="color: ${isGridImport ? '#f8fafc' : '#10b981'};">
                        ${this._formatPower(gridW).value}
                        <span class="unit">${this._formatPower(gridW).unit}</span>
                      </div>
                      <span class="node-subtext">
                        ${isGridImport ? `Import ${this._formatEnergy(gridImportToday)}` : `Export ${this._formatEnergy(gridExportToday)}`}
                      </span>
                      <span class="node-status-pill ${isGridImport ? 'pill-blue' : 'pill-green'}">
                        ${isGridImport ? 'Afname' : 'Teruglevering'}
                      </span>
                    </div>
                  </foreignObject>
                </g>
              </svg>
            </div>
          </div>

          <!-- Right: History & Analytics Panel -->
          <div class="panel-card">
            <div class="panel-title-bar">
              <h2 class="panel-title">
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#10b981" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                  <line x1="18" y1="20" x2="18" y2="10"></line>
                  <line x1="12" y1="20" x2="12" y2="4"></line>
                  <line x1="6" y1="20" x2="6" y2="14"></line>
                </svg>
                Historie & Trends
              </h2>

              <div class="tabs-container">
                <button class="tab-btn ${this._selectedPeriod === 'vandaag' ? 'active' : ''}"
                  @click="${() => { this._selectedPeriod = 'vandaag'; }}">
                  Vandaag
                </button>
                <button class="tab-btn ${this._selectedPeriod === 'maand' ? 'active' : ''}"
                  @click="${() => { this._selectedPeriod = 'maand'; }}">
                  Maand
                </button>
                <button class="tab-btn ${this._selectedPeriod === 'jaar' ? 'active' : ''}"
                  @click="${() => { this._selectedPeriod = 'jaar'; }}">
                  Jaar
                </button>
              </div>
            </div>

            <div class="chart-container">
              <div class="chart-svg-box">
                ${this._renderChartContent()}
              </div>

              <div class="chart-legend">
                <div class="legend-item">
                  <span class="legend-color" style="background: #10b981;"></span>
                  Zonne-energie
                </div>
                <div class="legend-item">
                  <span class="legend-color" style="background: #ef4444;"></span>
                  Net Import
                </div>
                <div class="legend-item">
                  <span class="legend-color" style="background: #94a3b8;"></span>
                  Huisverbruik
                </div>
              </div>

              <div class="chart-kpi-row">
                <div class="chart-kpi-card">
                  <span class="chart-kpi-label">Zon Vandaag</span>
                  <span class="chart-kpi-value" style="color: #f59e0b;">${this._formatEnergy(solarToday)}</span>
                  <span class="chart-kpi-sub">Opwekking</span>
                </div>
                <div class="chart-kpi-card">
                  <span class="chart-kpi-label">Net Vandaag</span>
                  <span class="chart-kpi-value" style="color: ${gridImportToday > gridExportToday ? '#ef4444' : '#10b981'};">
                    ${this._formatEnergy(gridImportToday)}
                  </span>
                  <span class="chart-kpi-sub">Afgenomen</span>
                </div>
                <div class="chart-kpi-card">
                  <span class="chart-kpi-label">Accu Geladen</span>
                  <span class="chart-kpi-value" style="color: #10b981;">${this._formatEnergy(batChargedToday)}</span>
                  <span class="chart-kpi-sub">Vandaag</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    `;
  }

  private _renderChartContent(): TemplateResult {
    const w = 500;
    const h = 280;
    const padX = 40;
    const padY = 20;

    if (this._selectedPeriod === 'vandaag') {
      const solarKey = this.config.entities?.solar_power || 'sensor.totale_live_zonnestroom';
      const netKey = this.config.entities?.grid_power || 'sensor.p1_meter_power';

      const solarPoints = (this._todayStats as any)[solarKey] || [];
      const netPoints = (this._todayStats as any)[netKey] || [];

      const count = Math.max(solarPoints.length, 1);
      const maxY = 8000;

      let solarPath = `M ${padX} ${h - padY}`;
      solarPoints.forEach((pt: any, i: number) => {
        const x = padX + (i / 288) * (w - padX * 2);
        const yVal = Math.max(0, pt.mean || 0);
        const y = h - padY - (yVal / maxY) * (h - padY * 2);
        solarPath += ` L ${x.toFixed(1)} ${y.toFixed(1)}`;
      });
      const lastX = padX + ((count - 1) / 288) * (w - padX * 2);
      const solarArea = solarPath + ` L ${lastX} ${h - padY} Z`;

      let netPath = `M ${padX} ${h - padY}`;
      netPoints.forEach((pt: any, i: number) => {
        const x = padX + (i / 288) * (w - padX * 2);
        const yVal = Math.max(0, pt.mean || 0);
        const y = h - padY - (yVal / maxY) * (h - padY * 2);
        netPath += ` L ${x.toFixed(1)} ${y.toFixed(1)}`;
      });
      const netArea = netPath + ` L ${lastX} ${h - padY} Z`;

      return svg`
        <svg class="chart-svg" viewBox="0 0 ${w} ${h}">
          <defs>
            <linearGradient id="chartSolarGrad" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stop-color="#10b981" stop-opacity="0.5"/>
              <stop offset="100%" stop-color="#10b981" stop-opacity="0"/>
            </linearGradient>
            <linearGradient id="chartNetGrad" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stop-color="#ef4444" stop-opacity="0.4"/>
              <stop offset="100%" stop-color="#ef4444" stop-opacity="0"/>
            </linearGradient>
          </defs>

          <line x1="${padX}" y1="${padY}" x2="${w - padX}" y2="${padY}" stroke="rgba(255,255,255,0.06)" />
          <line x1="${padX}" y1="${h/2}" x2="${w - padX}" y2="${h/2}" stroke="rgba(255,255,255,0.06)" />
          <line x1="${padX}" y1="${h - padY}" x2="${w - padX}" y2="${h - padY}" stroke="rgba(255,255,255,0.12)" />

          <text x="${padX - 8}" y="${padY + 4}" fill="#64748b" font-size="10" text-anchor="end">8 kW</text>
          <text x="${padX - 8}" y="${h/2 + 4}" fill="#64748b" font-size="10" text-anchor="end">4 kW</text>
          <text x="${padX - 8}" y="${h - padY + 4}" fill="#64748b" font-size="10" text-anchor="end">0</text>

          <text x="${padX}" y="${h - 4}" fill="#64748b" font-size="10">00:00</text>
          <text x="${w/2}" y="${h - 4}" fill="#64748b" font-size="10" text-anchor="middle">12:00</text>
          <text x="${w - padX}" y="${h - 4}" fill="#64748b" font-size="10" text-anchor="end">24:00</text>

          ${solarPoints.length > 0 ? svg`
            <path d="${solarArea}" fill="url(#chartSolarGrad)" />
            <path d="${solarPath}" fill="none" stroke="#10b981" stroke-width="2" />
          ` : ''}

          ${netPoints.length > 0 ? svg`
            <path d="${netArea}" fill="url(#chartNetGrad)" />
            <path d="${netPath}" fill="none" stroke="#ef4444" stroke-width="1.5" />
          ` : ''}

          ${svg`
            <line x1="${lastX}" y1="${padY}" x2="${lastX}" y2="${h - padY}" stroke="rgba(255,255,255,0.4)" stroke-dasharray="3 3" />
          `}
        </svg>
      `;
    } else {
      const solarTodayKey = this.config.entities?.solar_today || 'sensor.totale_opwek_vandaag_2';
      const gridImportKey = this.config.entities?.grid_import_today || 'sensor.p1_netstroom_afname_vandaag';

      const solarDays = (this._monthlyStats as any)[solarTodayKey] || [];
      const gridDays = (this._monthlyStats as any)[gridImportKey] || [];

      const numDays = Math.max(solarDays.length, 7);
      const barWidth = Math.max(6, (w - padX * 2) / (numDays * 2.5));

      return svg`
        <svg class="chart-svg" viewBox="0 0 ${w} ${h}">
          <line x1="${padX}" y1="${padY}" x2="${w - padX}" y2="${padY}" stroke="rgba(255,255,255,0.06)" />
          <line x1="${padX}" y1="${h/2}" x2="${w - padX}" y2="${h/2}" stroke="rgba(255,255,255,0.06)" />
          <line x1="${padX}" y1="${h - padY}" x2="${w - padX}" y2="${h - padY}" stroke="rgba(255,255,255,0.12)" />

          <text x="${padX - 8}" y="${padY + 4}" fill="#64748b" font-size="10" text-anchor="end">40 kWh</text>
          <text x="${padX - 8}" y="${h/2 + 4}" fill="#64748b" font-size="10" text-anchor="end">20 kWh</text>
          <text x="${padX - 8}" y="${h - padY + 4}" fill="#64748b" font-size="10" text-anchor="end">0</text>

          ${solarDays.map((pt: any, i: number) => {
            const x = padX + i * ((w - padX * 2) / numDays) + 6;
            const sVal = pt.state || pt.change || 0;
            const barH = Math.min(h - padY * 2, (sVal / 40) * (h - padY * 2));
            const y = h - padY - barH;

            const gPt = gridDays[i];
            const gVal = gPt ? (gPt.state || gPt.change || 0) : 0;
            const gBarH = Math.min(h - padY * 2, (gVal / 40) * (h - padY * 2));
            const gy = h - padY - gBarH;

            return svg`
              <rect x="${x}" y="${y}" width="${barWidth}" height="${barH}" rx="2" fill="#10b981" />
              <rect x="${x + barWidth + 2}" y="${gy}" width="${barWidth}" height="${gBarH}" rx="2" fill="#ef4444" />
              <text x="${x + barWidth}" y="${h - 4}" fill="#64748b" font-size="9" text-anchor="middle">
                ${new Date(pt.start).getDate()}
              </text>
            `;
          })}
        </svg>
      `;
    }
  }

  public getCardSize(): number {
    return 8;
  }
}

if (!customElements.get('energy-dashboard-card')) {
  customElements.define('energy-dashboard-card', EnergyDashboardCard);
}
