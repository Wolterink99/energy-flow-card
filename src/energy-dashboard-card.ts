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

    .flow-svg {
      position: absolute;
      top: 0;
      left: 0;
      width: 100%;
      height: 100%;
      overflow: visible;
      pointer-events: none;
    }

    /* Node Grid layout inside Flow Container */
    .nodes-grid {
      display: grid;
      grid-template-columns: 1fr 1fr;
      grid-template-rows: 1fr 1fr;
      gap: 60px 80px;
      width: 100%;
      max-width: 540px;
      height: 100%;
      min-height: 460px;
      align-items: center;
      justify-items: center;
      z-index: 2;
    }

    /* Node Component */
    .node-dial {
      position: relative;
      width: 180px;
      height: 180px;
      display: flex;
      flex-direction: column;
      align-items: center;
      justify-content: center;
      cursor: pointer;
      user-select: none;
      transition: transform 0.2s ease;
    }

    .node-dial:hover {
      transform: scale(1.03);
    }

    .node-svg-ring {
      position: absolute;
      top: 0;
      left: 0;
      width: 100%;
      height: 100%;
      transform: rotate(-90deg);
    }

    .node-inner-disc {
      position: absolute;
      width: 144px;
      height: 144px;
      background: #141821;
      border-radius: 50%;
      box-shadow: inset 0 2px 10px rgba(0, 0, 0, 0.6), 0 4px 14px rgba(0, 0, 0, 0.4);
      display: flex;
      flex-direction: column;
      align-items: center;
      justify-content: center;
      z-index: 3;
      padding: 8px;
    }

    .node-icon-box {
      width: 28px;
      height: 28px;
      display: flex;
      align-items: center;
      justify-content: center;
      margin-bottom: 2px;
    }

    .node-icon-box svg {
      width: 22px;
      height: 22px;
    }

    .node-title {
      font-size: 11px;
      font-weight: 600;
      text-transform: uppercase;
      letter-spacing: 0.05em;
      color: #94a3b8;
      margin-bottom: 2px;
    }

    .node-val {
      font-size: 22px;
      font-weight: 700;
      color: #f8fafc;
      line-height: 1.1;
      display: flex;
      align-items: baseline;
      gap: 3px;
    }

    .node-val .unit {
      font-size: 12px;
      font-weight: 500;
      color: #94a3b8;
    }

    .node-subtext {
      font-size: 11px;
      font-weight: 500;
      color: #94a3b8;
      margin-top: 3px;
      text-align: center;
      white-space: nowrap;
    }

    .node-badge {
      position: absolute;
      bottom: -10px;
      background: #181d26;
      border: 1px solid rgba(255, 255, 255, 0.12);
      border-radius: 9999px;
      padding: 3px 10px;
      font-size: 10px;
      font-weight: 600;
      letter-spacing: 0.04em;
      z-index: 4;
      white-space: nowrap;
    }

    .node-badge.status-green {
      color: #10b981;
      border-color: rgba(16, 185, 129, 0.35);
      background: rgba(16, 185, 129, 0.1);
    }

    .node-badge.status-red {
      color: #ef4444;
      border-color: rgba(239, 68, 68, 0.35);
      background: rgba(239, 68, 68, 0.1);
    }

    .node-badge.status-amber {
      color: #f59e0b;
      border-color: rgba(245, 158, 11, 0.35);
      background: rgba(245, 158, 11, 0.1);
    }

    /* Flow Animations */
    .flow-line {
      fill: none;
      stroke-width: 2.5;
      stroke-linecap: round;
      stroke-dasharray: 6 10;
      animation: dashFlow 1.5s linear infinite;
    }

    @keyframes dashFlow {
      from { stroke-dashoffset: 32; }
      to { stroke-dashoffset: 0; }
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

    /* Chart Legend */
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

  private _getState(entityId?: string): string {
    if (!entityId || !this.hass || !this.hass.states[entityId]) return '';
    return this.hass.states[entityId].state;
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

    const solarW = Math.max(0, this._getNumber(cfg.solar_power || 'sensor.totale_live_zonnestroom'));
    const solarToday = this._getNumber(cfg.solar_today || 'sensor.totale_opwek_vandaag_2');

    const gridW = this._getNumber(cfg.grid_power || 'sensor.p1_meter_power');
    const isGridImport = gridW >= 0;
    const gridImportToday = this._getNumber(cfg.grid_import_today || 'sensor.p1_netstroom_afname_vandaag');
    const gridExportToday = this._getNumber(cfg.grid_export_today || 'sensor.p1_teruglevering_vandaag');

    const batW = this._getNumber(cfg.battery_power || 'sensor.thuisbatterij_vermogen');
    const batSoC = Math.min(100, Math.max(0, this._getNumber(cfg.battery_soc || 'sensor.thuisbatterij_percentage', 94)));
    const batChargedToday = this._getNumber(cfg.battery_charged_today || 'sensor.thuisbatterij_levering_vandaag');
    const isBatCharging = batW > 20;
    const isBatDischarging = batW < -20;

    const homeW = Math.max(0, this._getNumber(cfg.home_power || 'sensor.live_huisverbruik'));
    const homeToday = this._getNumber(cfg.home_today || 'sensor.echt_huisverbruik_vandaag');

    const totalConsumed = homeToday + batChargedToday;
    const directSolar = Math.min(solarToday, totalConsumed);
    const autarky = totalConsumed > 0 ? Math.round((directSolar / totalConsumed) * 100) : 0;

    const r = 80;
    const circ = 2 * Math.PI * r;

    // Battery SoC Ring
    const batProgress = (batSoC / 100) * circ;
    const batOffset = circ - batProgress;

    // House Segmented Ring
    const solarToHouse = Math.min(solarW, homeW);
    const batToHouse = isBatDischarging ? Math.min(Math.abs(batW), Math.max(0, homeW - solarToHouse)) : 0;
    const gridToHouse = isGridImport ? Math.max(0, homeW - solarToHouse - batToHouse) : 0;
    const totalMix = (solarToHouse + batToHouse + gridToHouse) || 1;

    const fracSolar = solarToHouse / totalMix;
    const fracBat = batToHouse / totalMix;
    const fracGrid = gridToHouse / totalMix;

    const lenSolar = fracSolar * circ;
    const lenBat = fracBat * circ;
    const lenGrid = fracGrid * circ;

    const offsetSolar = 0;
    const offsetBat = -lenSolar;
    const offsetGrid = -(lenSolar + lenBat);

    return html`
      <div class="dashboard-wrapper">
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

        <div class="dashboard-grid">
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
              <svg class="flow-svg" viewBox="0 0 540 460">
                ${solarW > 20 && isBatCharging ? svg`
                  <line x1="135" y1="175" x2="135" y2="285" stroke="#f59e0b" class="flow-line" style="animation-duration: ${Math.max(0.7, 3000 / Math.max(200, batW))}s;" />
                ` : ''}

                ${solarToHouse > 20 ? svg`
                  <path d="M 175 155 Q 270 230 365 305" stroke="#f59e0b" class="flow-line" style="animation-duration: ${Math.max(0.7, 3000 / Math.max(200, solarToHouse))}s;" />
                ` : ''}

                ${!isGridImport && Math.abs(gridW) > 20 ? svg`
                  <line x1="195" y1="115" x2="345" y2="115" stroke="#10b981" class="flow-line" style="animation-duration: ${Math.max(0.7, 3000 / Math.max(200, Math.abs(gridW)))}s;" />
                ` : ''}

                ${isGridImport && isBatCharging && gridW > 20 ? svg`
                  <path d="M 365 155 Q 270 230 175 305" stroke="#3b82f6" class="flow-line" style="animation-duration: ${Math.max(0.7, 3000 / Math.max(200, batW))}s;" />
                ` : ''}

                ${gridToHouse > 20 ? svg`
                  <line x1="405" y1="175" x2="405" y2="285" stroke="${gridW > 3000 ? '#ef4444' : '#3b82f6'}" class="flow-line" style="animation-duration: ${Math.max(0.7, 3000 / Math.max(200, gridToHouse))}s;" />
                ` : ''}

                ${batToHouse > 20 ? svg`
                  <line x1="195" y1="345" x2="345" y2="345" stroke="#10b981" class="flow-line" style="animation-duration: ${Math.max(0.7, 3000 / Math.max(200, batToHouse))}s;" />
                ` : ''}
              </svg>

              <div class="nodes-grid">
                <!-- 1. ZON -->
                <div class="node-dial">
                  <svg class="node-svg-ring" viewBox="0 0 180 180">
                    <circle cx="90" cy="90" r="${r}" fill="none" stroke="rgba(245, 158, 11, 0.15)" stroke-width="8" />
                    <circle cx="90" cy="90" r="${r}" fill="none" stroke="#f59e0b" stroke-width="8"
                      stroke-dasharray="${circ}" stroke-dashoffset="${solarW > 0 ? 0 : circ}" stroke-linecap="round" />
                  </svg>
                  <div class="node-inner-disc">
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
                </div>

                <!-- 2. NET -->
                <div class="node-dial">
                  <svg class="node-svg-ring" viewBox="0 0 180 180">
                    <circle cx="90" cy="90" r="${r}" fill="none" stroke="rgba(255, 255, 255, 0.08)" stroke-width="8" />
                    <circle cx="90" cy="90" r="${r}" fill="none" stroke="${isGridImport ? '#3b82f6' : '#10b981'}" stroke-width="8"
                      stroke-dasharray="${circ}" stroke-dashoffset="0" stroke-linecap="round" />
                  </svg>
                  <div class="node-inner-disc">
                    <div class="node-icon-box" style="color: ${isGridImport ? '#3b82f6' : '#10b981'};">
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
                  </div>
                  <div class="node-badge ${isGridImport ? 'status-amber' : 'status-green'}">
                    ${isGridImport ? 'Afname' : 'Teruglevering'}
                  </div>
                </div>

                <!-- 3. BATTERIJ -->
                <div class="node-dial">
                  <svg class="node-svg-ring" viewBox="0 0 180 180">
                    <circle cx="90" cy="90" r="${r}" fill="none" stroke="rgba(255, 255, 255, 0.08)" stroke-width="8" />
                    <circle cx="90" cy="90" r="${r}" fill="none" stroke="#10b981" stroke-width="8"
                      stroke-dasharray="${circ}" stroke-dashoffset="${batOffset}" stroke-linecap="round" />
                  </svg>
                  <div class="node-inner-disc">
                    <div class="node-icon-box" style="color: #10b981;">
                      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                        <rect x="2" y="7" width="16" height="10" rx="2" ry="2"></rect>
                        <line x1="22" y1="11" x2="22" y2="13"></line>
                        <polygon points="10 9 7 13 11 13 8 16 13 12 9 12 10 9" fill="#10b981" stroke="none"></polygon>
                      </svg>
                    </div>
                    <span class="node-title">Batterij</span>
                    <div class="node-val">
                      ${batSoC.toFixed(0)}<span class="unit" style="font-size: 16px;">%</span>
                    </div>
                    <span class="node-subtext">
                      ${batW !== 0 ? `${this._formatPower(batW).value} ${this._formatPower(batW).unit}` : 'Standby'}
                    </span>
                  </div>
                  <div class="node-badge ${isBatCharging ? 'status-green' : isBatDischarging ? 'status-amber' : ''}">
                    ${isBatCharging ? `Laden ${this._formatPower(batW).value} ${this._formatPower(batW).unit}` : isBatDischarging ? `Ontladen ${this._formatPower(batW).value} ${this._formatPower(batW).unit}` : 'Standby'}
                  </div>
                </div>

                <!-- 4. HUIS -->
                <div class="node-dial">
                  <svg class="node-svg-ring" viewBox="0 0 180 180">
                    <circle cx="90" cy="90" r="${r}" fill="none" stroke="rgba(255, 255, 255, 0.08)" stroke-width="8" />
                    ${lenSolar > 0 ? svg`
                      <circle cx="90" cy="90" r="${r}" fill="none" stroke="#f59e0b" stroke-width="8"
                        stroke-dasharray="${lenSolar} ${circ}" stroke-dashoffset="${offsetSolar}" />
                    ` : ''}
                    ${lenBat > 0 ? svg`
                      <circle cx="90" cy="90" r="${r}" fill="none" stroke="#10b981" stroke-width="8"
                        stroke-dasharray="${lenBat} ${circ}" stroke-dashoffset="${offsetBat}" />
                    ` : ''}
                    ${lenGrid > 0 ? svg`
                      <circle cx="90" cy="90" r="${r}" fill="none" stroke="#3b82f6" stroke-width="8"
                        stroke-dasharray="${lenGrid} ${circ}" stroke-dashoffset="${offsetGrid}" />
                    ` : ''}
                  </svg>
                  <div class="node-inner-disc">
                    <div class="node-icon-box" style="color: #f1f5f9;">
                      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                        <path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"></path>
                        <polyline points="9 22 9 12 15 12 15 22"></polyline>
                      </svg>
                    </div>
                    <span class="node-title">Huis</span>
                    <div class="node-val">
                      ${this._formatPower(homeW).value}
                      <span class="unit">${this._formatPower(homeW).unit}</span>
                    </div>
                    <span class="node-subtext">Vandaag ${this._formatEnergy(homeToday)}</span>
                  </div>
                </div>
              </div>
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
