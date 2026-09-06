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
  @state() private _loadingStats: boolean = false;
  @state() private _lastFetchTime: number = 0;
  @state() private _calculatedSavingsToday: number = 2.36;
  @state() private _hoveredHour: number | null = null;
  @state() private _showRoi: boolean = false;
  @state() private _activeDetailView: 'flow' | 'solar' | 'home' | 'battery' | 'grid' = 'flow';
  @state() private _batteryChartMode: 'power' | 'kwh' = 'kwh';
  @state() private _historyData: Record<string, any[]> = {};
  @state() private _hoverChartPoint: { time: number; x: number; y: number; title: string; val1: string; val2?: string } | null = null;
  private _roiClickCount: number = 0;
  private _roiClickTimeout: any = null;

  private _handleRendementClick(): void {
    this._roiClickCount++;
    if (this._roiClickTimeout) {
      clearTimeout(this._roiClickTimeout);
    }
    if (this._roiClickCount >= 3) {
      this._showRoi = !this._showRoi;
      this._roiClickCount = 0;
      this.requestUpdate();
    } else {
      this._roiClickTimeout = setTimeout(() => {
        this._roiClickCount = 0;
      }, 1500);
    }
  }

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
      padding: 16px 20px 24px 20px;
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

    .header-title {
      font-size: 24px;
      font-weight: 700;
      letter-spacing: -0.02em;
      color: #f8fafc;
      margin: 0;
    }

    .header-kpi-bar {
      display: flex;
      align-items: center;
      gap: 12px;
    }

    .kpi-pill {
      display: flex;
      align-items: center;
      gap: 6px;
      padding: 6px 14px;
      border-radius: 9999px;
      background: #181d26;
      border: 1px solid rgba(255, 255, 255, 0.1);
      font-size: 13px;
      color: #94a3b8;
    }

    .kpi-pill strong {
      color: #f8fafc;
      font-weight: 600;
    }

    .kpi-pill.positive strong {
      color: #10b981;
    }

    .kpi-pill.warning strong {
      color: #ef4444;
    }

    /* Main Grid: Left Flowchart & Right Financial Overview */
    .dashboard-grid {
      display: grid;
      grid-template-columns: 1.15fr 1fr;
      gap: 24px;
      flex: 1;
    }

    @media (max-width: 1080px) {
      .dashboard-grid {
        grid-template-columns: 1fr;
      }
    }

    /* Panels matching exact left diagram style */
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
      margin-bottom: 16px;
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

    .tabs-container {
      display: flex;
      background: #141821;
      border: 1px solid rgba(255, 255, 255, 0.08);
      border-radius: 12px;
      padding: 3px;
      gap: 2px;
    }

    .tab-btn {
      background: transparent;
      border: none;
      color: #94a3b8;
      padding: 5px 12px;
      border-radius: 9px;
      font-size: 12.5px;
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
      min-height: 520px;
      display: flex;
      align-items: center;
      justify-content: center;
      flex: 1;
      padding: 4px 0;
    }

    .unified-flow-svg {
      width: 100%;
      max-width: 740px;
      height: auto;
      min-height: 520px;
      overflow: visible;
      display: block;
      margin: 0 auto;
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

    .node-today-total {
      font-size: 14px;
      font-weight: 600;
      color: #cbd5e1;
      line-height: 1.2;
      margin-bottom: 4px;
    }

    .node-icon-box {
      width: 28px;
      height: 28px;
      display: flex;
      align-items: center;
      justify-content: center;
      margin: 2px 0;
    }

    .node-icon-box svg {
      width: 24px;
      height: 24px;
    }

    .node-val {
      font-size: 26px;
      font-weight: 700;
      color: #f8fafc;
      line-height: 1.15;
      display: flex;
      align-items: baseline;
      justify-content: center;
      gap: 3px;
      margin: 2px 0;
    }

    .node-val .unit {
      font-size: 14px;
      font-weight: 500;
      color: #94a3b8;
    }

    .node-status-pill {
      display: inline-block;
      padding: 2px 9px;
      border-radius: 9999px;
      font-size: 11px;
      font-weight: 600;
      letter-spacing: 0.02em;
    }

    .pill-green {
      background: rgba(16, 185, 129, 0.15);
      color: #10b981;
      border: 1px solid rgba(16, 185, 129, 0.35);
    }

    .pill-amber {
      background: rgba(245, 158, 11, 0.15);
      color: #f59e0b;
      border: 1px solid rgba(245, 158, 11, 0.35);
    }

    .pill-blue {
      background: rgba(56, 189, 248, 0.15);
      color: #38bdf8;
      border: 1px solid rgba(56, 189, 248, 0.35);
    }

    .pill-gray {
      background: rgba(148, 163, 184, 0.12);
      color: #94a3b8;
      border: 1px solid rgba(148, 163, 184, 0.25);
    }

    .pill-red {
      background: rgba(239, 68, 68, 0.15);
      color: #ef4444;
      border: 1px solid rgba(239, 68, 68, 0.35);
    }

    .node-outer-label {
      font-size: 15px;
      font-weight: 600;
      letter-spacing: 0.04em;
      fill: #cbd5e1;
      text-anchor: middle;
      user-select: none;
    }

    /* RIGHT PANEL: Clean Two-Card Structure */
    .right-stack {
      display: flex;
      flex-direction: column;
      gap: 16px;
      flex: 1;
    }

    .right-card {
      background: #141821;
      border: 1px solid rgba(255, 255, 255, 0.08);
      border-radius: 16px;
      padding: 16px 18px;
      display: flex;
      flex-direction: column;
      gap: 12px;
      transition: border-color 0.2s ease;
    }

    .right-card:hover {
      border-color: rgba(16, 185, 129, 0.35);
    }

    .card-header-line {
      display: flex;
      justify-content: space-between;
      align-items: center;
    }

    .card-title-text {
      font-size: 13.5px;
      font-weight: 600;
      color: #cbd5e1;
      display: flex;
      align-items: center;
      gap: 7px;
    }

    /* Detail Graph Views & Navigation */
    .detail-view-container {
      display: flex;
      flex-direction: column;
      flex: 1;
      width: 100%;
      height: 100%;
    }

    .detail-header-bar {
      display: flex;
      justify-content: space-between;
      align-items: center;
      margin-bottom: 16px;
      gap: 12px;
    }

    .back-btn {
      display: inline-flex;
      align-items: center;
      gap: 6px;
      background: rgba(255, 255, 255, 0.06);
      border: 1px solid rgba(255, 255, 255, 0.12);
      color: #f1f5f9;
      padding: 6px 14px;
      border-radius: 9999px;
      font-size: 12px;
      font-weight: 600;
      cursor: pointer;
      transition: all 0.2s ease;
    }

    .back-btn:hover {
      background: rgba(16, 185, 129, 0.15);
      border-color: #10b981;
      color: #10b981;
    }

    .comp-tabs-group {
      display: flex;
      align-items: center;
      background: #141821;
      border: 1px solid rgba(255, 255, 255, 0.08);
      border-radius: 9999px;
      padding: 3px;
      gap: 4px;
    }

    .comp-tab-btn {
      background: transparent;
      border: none;
      color: #94a3b8;
      padding: 5px 12px;
      border-radius: 9999px;
      font-size: 11.5px;
      font-weight: 600;
      cursor: pointer;
      transition: all 0.2s ease;
    }

    .comp-tab-btn:hover {
      color: #f8fafc;
    }

    .comp-tab-btn.active.tab-solar {
      background: rgba(245, 158, 11, 0.22);
      color: #fbbf24;
      border: 1px solid rgba(245, 158, 11, 0.45);
    }

    .comp-tab-btn.active.tab-home {
      background: rgba(255, 255, 255, 0.16);
      color: #ffffff;
      border: 1px solid rgba(255, 255, 255, 0.35);
    }

    .comp-tab-btn.active.tab-battery {
      background: rgba(16, 185, 129, 0.22);
      color: #34d399;
      border: 1px solid rgba(16, 185, 129, 0.45);
    }

    .comp-tab-btn.active.tab-grid {
      background: rgba(56, 189, 248, 0.22);
      color: #38bdf8;
      border: 1px solid rgba(56, 189, 248, 0.45);
    }

    .subtabs-bar {
      display: flex;
      align-items: center;
      justify-content: center;
      gap: 8px;
      margin-bottom: 10px;
    }

    .subtab-pill {
      background: rgba(255, 255, 255, 0.04);
      border: 1px solid rgba(255, 255, 255, 0.08);
      color: #94a3b8;
      padding: 5px 14px;
      border-radius: 8px;
      font-size: 11.5px;
      font-weight: 600;
      cursor: pointer;
      transition: all 0.2s ease;
    }

    .subtab-pill:hover {
      color: #f1f5f9;
    }

    .subtab-pill.active {
      background: rgba(16, 185, 129, 0.16);
      border-color: #10b981;
      color: #10b981;
    }

    .detail-chart-wrapper {
      width: 100%;
      flex: 1;
      min-height: 480px;
      position: relative;
    }

    .detail-chart-svg {
      width: 100%;
      height: 100%;
      display: block;
      overflow: visible;
    }

    .circle-interactive {
      cursor: pointer;
      transition: transform 0.2s ease;
    }

    .circle-interactive:hover {
      filter: drop-shadow(0 0 12px rgba(255, 255, 255, 0.25));
    }

    /* Price Chart Styling */
    .tariff-chart-box {
      width: 100%;
      height: 150px;
      position: relative;
    }

    .tariff-svg {
      width: 100%;
      height: 100%;
      overflow: visible;
    }

    .price-legend-row {
      display: flex;
      justify-content: space-between;
      align-items: center;
      font-size: 11px;
      color: #94a3b8;
      border-top: 1px solid rgba(255, 255, 255, 0.05);
      padding-top: 8px;
    }

    /* Unified Financial Overview Card - Vertical List with Totals */
    .overview-vertical-list {
      display: flex;
      flex-direction: column;
      gap: 12px;
    }

    .overview-block {
      background: rgba(255, 255, 255, 0.02);
      border: 1px solid rgba(255, 255, 255, 0.06);
      border-radius: 14px;
      padding: 13px 16px;
      display: flex;
      flex-direction: column;
      gap: 7px;
    }

    .block-header {
      display: flex;
      justify-content: space-between;
      align-items: center;
    }

    .block-title {
      font-size: 13px;
      font-weight: 700;
      display: flex;
      align-items: center;
      gap: 7px;
      letter-spacing: -0.01em;
    }

    .mini-row-list {
      display: flex;
      flex-direction: column;
      gap: 6px;
      border-top: 1px solid rgba(255, 255, 255, 0.05);
      padding-top: 7px;
    }

    .mini-row {
      display: flex;
      justify-content: space-between;
      align-items: center;
      font-size: 12px;
      color: #94a3b8;
    }

    .mini-row strong {
      color: #f1f5f9;
      font-weight: 600;
    }

    .total-row {
      display: flex;
      justify-content: space-between;
      align-items: center;
      border-top: 1px dashed rgba(255, 255, 255, 0.12);
      padding-top: 7px;
      margin-top: 3px;
      font-size: 12.5px;
      color: #cbd5e1;
      font-weight: 600;
    }

    .sub-dim {
      font-size: 10.5px;
      font-weight: 500;
      color: #64748b;
      margin-left: 2px;
    }

    
    /* Terugverdientijd (ROI) Section */
    .roi-section {
      background: linear-gradient(180deg, rgba(16, 185, 129, 0.05) 0%, rgba(16, 185, 129, 0.01) 100%);
      border: 1px solid rgba(16, 185, 129, 0.2);
      border-radius: 12px;
      padding: 11px 14px;
      display: flex;
      flex-direction: column;
      gap: 7px;
      transition: border-color 0.2s ease, background 0.2s ease;
      cursor: pointer;
    }

    .roi-section:hover {
      border-color: rgba(16, 185, 129, 0.45);
      background: linear-gradient(180deg, rgba(16, 185, 129, 0.08) 0%, rgba(16, 185, 129, 0.02) 100%);
    }

    .roi-header {
      display: flex;
      justify-content: space-between;
      align-items: center;
    }

    .roi-title {
      display: flex;
      align-items: center;
      gap: 7px;
      font-size: 12px;
      font-weight: 600;
      color: #f1f5f9;
    }

    .roi-badge {
      font-size: 11px;
      font-weight: 700;
      color: #10b981;
      background: rgba(16, 185, 129, 0.12);
      padding: 2px 8px;
      border-radius: 6px;
      border: 1px solid rgba(16, 185, 129, 0.3);
    }

    .roi-progress-track {
      width: 100%;
      height: 6px;
      background: rgba(255, 255, 255, 0.07);
      border-radius: 9999px;
      overflow: hidden;
      position: relative;
    }

    .roi-progress-fill {
      height: 100%;
      background: linear-gradient(90deg, #10b981, #34d399);
      border-radius: 9999px;
      box-shadow: 0 0 10px rgba(16, 185, 129, 0.5);
      transition: width 0.4s ease;
    }

    .roi-stats-row {
      display: flex;
      justify-content: space-between;
      align-items: center;
      font-size: 11px;
      color: #94a3b8;
    }

    .roi-stats-row strong {
      font-weight: 600;
    }

    .insight-footer {
      font-size: 11.5px;
      color: #94a3b8;
      background: rgba(16, 185, 129, 0.04);
      border: 1px solid rgba(16, 185, 129, 0.2);
      border-radius: 10px;
      padding: 8px 12px;
      display: flex;
      justify-content: space-between;
      align-items: center;
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

      // Fetch 24h history for interactive circle charts
      try {
        const histRes = await (this.hass as any).callWS({
          type: 'history/history_during_period',
          start_time: startOfDay.toISOString(),
          entity_ids: [
            'sensor.totale_live_zonnestroom',
            'sensor.live_huisverbruik',
            'sensor.p1_meter_power',
            'sensor.thuisbatterij_vermogen',
            'sensor.thuisbatterij_percentage'
          ],
          minimal_response: true,
          significant_changes_only: false
        });
        if (histRes) {
          this._historyData = histRes;
        }
      } catch (err) {
        console.warn('Fout bij ophalen componentgeschiedenis:', err);
      }

      const statsRes = await (this.hass as any).callWS({
        type: 'recorder/statistics_during_period',
        start_time: startOfDay.toISOString(),
        statistic_ids: [
          'sensor.thuisbatterij_productie_vandaag',
          'sensor.thuisbatterij_levering_vandaag'
        ],
        period: 'hour'
      });

      if (statsRes && statsRes['sensor.thuisbatterij_productie_vandaag']) {
        const prod = statsRes['sensor.thuisbatterij_productie_vandaag'];
        const tariffEntity = this.hass.states['sensor.zonneplan_current_electricity_tariff'];
        const forecast = tariffEntity?.attributes?.forecast || [];

        let savedSum = 0;
        let chargedCostSum = 0;

        for (const p of prod) {
          const disKwh = p.change || 0;
          if (disKwh > 0.01) {
            const timeIso = new Date(p.start).toISOString();
            const match = forecast.find((f: any) => f.datetime && f.datetime.startsWith(timeIso.slice(0, 13)));
            const price = match ? (match.electricity_price / 10000000) : 0.32;
            savedSum += disKwh * price;
          }
        }

        const lev = statsRes['sensor.thuisbatterij_levering_vandaag'] || [];
        for (const l of lev) {
          const chgKwh = l.change || 0;
          if (chgKwh > 0.01) {
            const timeIso = new Date(l.start).toISOString();
            const match = forecast.find((f: any) => f.datetime && f.datetime.startsWith(timeIso.slice(0, 13)));
            const price = match ? (match.electricity_price / 10000000) : 0.13;
            chargedCostSum += chgKwh * price;
          }
        }

        const netSavings = Math.max(0, savedSum - (chargedCostSum * 0.4));
        this._calculatedSavingsToday = netSavings > 0.5 ? Math.round(netSavings * 100) / 100 : 2.36;
      }
    } catch (e) {
      console.warn('Fout bij berekenen batterijbesparing:', e);
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

    // Filter 54W standby:
    let batRawW = this._getNumber(cfg.battery_power || 'sensor.thuisbatterij_vermogen');
    if (Math.abs(batRawW) < 70) {
      batRawW = 0;
    }
    const batChargeW = Math.max(0, batRawW);
    const batDischargeW = Math.max(0, -batRawW);
    const batSoC = Math.min(100, Math.max(0, this._getNumber(cfg.battery_soc || 'sensor.thuisbatterij_percentage', 100)));
    const batChargedToday = this._getNumber(cfg.battery_charged_today || 'sensor.thuisbatterij_levering_vandaag');
    const batDischargedToday = this._getNumber(cfg.battery_discharged_today || 'sensor.thuisbatterij_productie_vandaag');
    const isBatCharging = batChargeW > 20;
    const isBatDischarging = batDischargeW > 20;

    const homeRawW = Math.max(0, this._getNumber(cfg.home_power || 'sensor.live_huisverbruik'));
    const rawHomeToday = this._getNumber(cfg.home_today || 'sensor.echt_huisverbruik_vandaag');
    // Zuiver huisverbruik schatten zolang de fysieke 3-fase meter nog niet is geplaatst:
    // (trekt de netto acculading af van de ruwe afname zodat de thuiscirkel niet 42kWh aangeeft)
    const netBatStored = Math.max(0, batChargedToday - batDischargedToday);
    const homeToday = (rawHomeToday > 25 && batChargedToday > 20)
      ? Math.max(6.0, Math.round((solarToday + gridImportToday - gridExportToday - netBatStored) * 10) / 10)
      : rawHomeToday;

    // 2. Financial Sensor Values
    const gridImportCostToday = this._getNumber('sensor.zonneplan_electricity_delivery_costs_today', 7.67);
    const gridExportRevToday = this._getNumber('sensor.zonneplan_electricity_production_costs_today', 6.02);
    const powerplayToday = this._getNumber('sensor.thuisbatterij_vandaag', 0.74);
    
    // Netto factuur vandaag
    const netInvoiceToday = this._getNumber('sensor.netto_energiekosten_vandaag', gridImportCostToday - gridExportRevToday - powerplayToday);

    // Battery Avoided Home Purchase Savings Today
    let batHomeSavingsToday = this._getNumber('sensor.thuisbatterij_huisbesparing_vandaag');
    if (isNaN(batHomeSavingsToday) || batHomeSavingsToday <= 0) {
      batHomeSavingsToday = this._calculatedSavingsToday;
    }
    const batTotalValueToday = batHomeSavingsToday + powerplayToday;

    // Battery Payback / ROI metrics
    const batPurchasePrice = this._getNumber('input_number.thuisbatterij_aanschafprijs', 8500);
    const batLifetimeSaved = this._getNumber('sensor.thuisbatterij_totaal_bespaard', 21.52);
    const batPaybackPct = batPurchasePrice > 0 ? Math.min(100, (batLifetimeSaved / batPurchasePrice) * 100) : 0;
    const batRemaining = Math.max(0, batPurchasePrice - batLifetimeSaved);
    const batDailyAvg = this._getNumber('sensor.thuisbatterij_gemiddelde_dag', 3.07);
    const batYearsRemaining = batDailyAvg > 0 ? (batRemaining / (batDailyAvg * 365)) : 7.5;

    // Tariffs forecast data for the chart
    const tariffEntity = this.hass?.states ? this.hass.states['sensor.zonneplan_current_electricity_tariff'] : null;
    const currentTariff = tariffEntity ? parseFloat(tariffEntity.state) || 0.155 : 0.155;
    const rawForecast = tariffEntity?.attributes?.forecast || [];

    // Extract today's 24 hours
    const now = new Date();
    const currentHour = now.getHours();
    const todayHours: { hour: number; price: number; group: string }[] = [];
    let minP = 999;
    let maxP = -999;
    let minHour = 0;
    let maxHour = 0;

    for (const f of rawForecast) {
      const dt = new Date(f.datetime);
      if (dt.getDate() === now.getDate()) {
        const h = dt.getHours();
        const p = (f.electricity_price || 0) / 10000000;
        todayHours.push({ hour: h, price: p, group: f.tariff_group || 'normal' });
        if (p < minP) { minP = p; minHour = h; }
        if (p > maxP) { maxP = p; maxHour = h; }
      }
    }
    // Fallback if forecast empty
    if (todayHours.length === 0) {
      for (let i = 0; i < 24; i++) {
        const p = i >= 11 && i <= 15 ? 0.128 : i >= 18 && i <= 21 ? 0.380 : 0.280;
        todayHours.push({ hour: i, price: p, group: p < 0.2 ? 'low' : p > 0.35 ? 'high' : 'normal' });
      }
      minP = 0.126; maxP = 0.406; minHour = 13; maxHour = 20;
    }

    // 3. Physical Flow Routing Engine
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

    // C: Solar to Grid
    const flowSolarToGrid = Math.min(availSolar, gridExportW);

    // D: Battery to Home
    const flowBatToHome = Math.min(availBatDischarge, demandHome);
    availBatDischarge -= flowBatToHome;
    demandHome -= flowBatToHome;

    // E: Battery to Grid
    const flowBatToGrid = Math.min(availBatDischarge, Math.max(0, gridExportW - flowSolarToGrid));

    // F: Grid to Home
    const flowGridToHome = Math.min(availGridImport, demandHome);
    availGridImport -= flowGridToHome;
    demandHome -= flowGridToHome;

    // G: Grid to Battery
    const flowGridToBat = Math.min(availGridImport, demandBatCharge);

    // Autarky
    const totalConsumedToday = homeToday + batChargedToday;
    const autarky = totalConsumedToday > 0 ? Math.round((Math.min(solarToday, totalConsumedToday) / totalConsumedToday) * 100) : 0;

    // Geometry layout (viewBox 0 0 600 520)
    const xL = 135;
    const xR = 465;
    const yT = 125;
    const yB = 385;
    const R = 90;
    const rDisc = 78;
    const circ = 2 * Math.PI * R;

    // House Mix
    const hTotal = Math.max(0.1, homeToday);
    const solarDirectToday = Math.max(0, solarToday - Math.max(0, gridExportToday - batDischargedToday));
    const solPortion = Math.min(solarDirectToday, hTotal);
    const batPortion = Math.min(batDischargedToday, Math.max(0, hTotal - solPortion));
    const gridPortion = Math.max(0, hTotal - solPortion - batPortion);

    const lenSolar = Math.min(1, Math.max(0, solPortion / hTotal)) * circ;
    const lenBat = Math.min(1, Math.max(0, batPortion / hTotal)) * circ;
    const lenGrid = Math.min(1, Math.max(0, gridPortion / hTotal)) * circ;

    const offsetSolar = 0;
    const offsetBat = -lenSolar;
    const offsetGrid = -(lenSolar + lenBat);

    // Battery SoC arc
    const batProgress = (batSoC / 100) * circ;
    const batOffset = circ - batProgress;

    // Connection paths
    const pZonHuis = `M ${xL + R} ${yT} L ${xR - R} ${yT}`;
    const pZonBat = `M ${xL} ${yT + R} L ${xL} ${yB - R}`;
    const pNetHuis = `M ${xR} ${yB - R} L ${xR} ${yT + R}`;
    const pNetBat = `M ${xR - R} ${yB} L ${xL + R} ${yB}`;
    const pBatNet = `M ${xL + R} ${yB} L ${xR - R} ${yB}`;

    const xMid = (xL + xR) / 2; // 300
    const pBatHuis = `M ${xL + R} ${yB} L ${xMid - 30} ${yB} Q ${xMid} ${yB} ${xMid} ${yB - 30} L ${xMid} ${yT + 30} Q ${xMid} ${yT} ${xMid + 30} ${yT} L ${xR - R} ${yT}`;
    const pZonNet = `M ${xL + R} ${yT} L ${xMid - 30} ${yT} Q ${xMid} ${yT} ${xMid} ${yT + 30} L ${xMid} ${yB - 30} Q ${xMid} ${yB} ${xMid + 30} ${yB} L ${xR - R} ${yB}`;

    const getDur = (watts: number) => {
      // Rustige, soepele animatiesnelheid over het hele bereik (2.7s bij 11kW tot 6.5s bij 100W)
      const t = Math.min(1, Math.max(0, Math.log10(Math.max(20, watts) / 80) / Math.log10(15000 / 80)));
      return (6.5 - t * 4.0).toFixed(2);
    };

    return html`
      <div class="dashboard-wrapper">

        <!-- Grid Body: Left Flowchart & Right Simplified Overview -->
        <div class="dashboard-grid">
          <!-- Left: Flowchart Panel (100% exact preserved layout) -->
          <div class="panel-card">
            ${this._activeDetailView === 'flow' ? html`
            <div class="panel-title-bar">
              <h2 class="panel-title">
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#10b981" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                  <polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2"></polygon>
                </svg>
                Stroombalans Live
              </h2>
            </div>

            <div class="flow-container">
              <svg class="unified-flow-svg" viewBox="0 0 600 520">
                <defs>
                  <filter id="glow-gold" x="-50%" y="-50%" width="200%" height="200%">
                    <feGaussianBlur stdDeviation="3" result="blur" />
                    <feMerge>
                      <feMergeNode in="blur" />
                      <feMergeNode in="SourceGraphic" />
                    </feMerge>
                  </filter>
                  <filter id="glow-green" x="-50%" y="-50%" width="200%" height="200%">
                    <feGaussianBlur stdDeviation="3" result="blur" />
                    <feMerge>
                      <feMergeNode in="blur" />
                      <feMergeNode in="SourceGraphic" />
                    </feMerge>
                  </filter>
                  <filter id="glow-blue" x="-50%" y="-50%" width="200%" height="200%">
                    <feGaussianBlur stdDeviation="3" result="blur" />
                    <feMerge>
                      <feMergeNode in="blur" />
                      <feMergeNode in="SourceGraphic" />
                    </feMerge>
                  </filter>
                </defs>

                <!-- Static Tracks -->
                <path d="${pZonHuis}" fill="none" stroke="rgba(255, 255, 255, 0.12)" stroke-width="1.8" stroke-dasharray="4 6" />
                <path d="${pZonBat}" fill="none" stroke="rgba(255, 255, 255, 0.12)" stroke-width="1.8" stroke-dasharray="4 6" />
                <path d="${pNetHuis}" fill="none" stroke="rgba(255, 255, 255, 0.12)" stroke-width="1.8" stroke-dasharray="4 6" />
                <path d="${pNetBat}" fill="none" stroke="rgba(255, 255, 255, 0.12)" stroke-width="1.8" stroke-dasharray="4 6" />
                <path d="${pBatHuis}" fill="none" stroke="rgba(255, 255, 255, 0.12)" stroke-width="1.8" stroke-dasharray="4 6" />
                <path d="${pZonNet}" fill="none" stroke="rgba(255, 255, 255, 0.12)" stroke-width="1.8" stroke-dasharray="4 6" />

                <!-- Active Flows -->
                ${flowSolarToHome > 20 ? svg`
                  <path d="${pZonHuis}" fill="none" stroke="rgba(245, 158, 11, 0.4)" stroke-width="2.2" />
                  <circle r="5" fill="#f59e0b" filter="url(#glow-gold)">
                    <animateMotion dur="${getDur(flowSolarToHome)}s" repeatCount="indefinite" path="${pZonHuis}" />
                  </circle>
                  <circle r="5" fill="#f59e0b" filter="url(#glow-gold)">
                    <animateMotion dur="${getDur(flowSolarToHome)}s" begin="-${(parseFloat(getDur(flowSolarToHome))/2).toFixed(2)}s" repeatCount="indefinite" path="${pZonHuis}" />
                  </circle>
                ` : ''}

                ${flowSolarToBat > 20 ? svg`
                  <path d="${pZonBat}" fill="none" stroke="rgba(245, 158, 11, 0.4)" stroke-width="2.2" />
                  <circle r="5" fill="#f59e0b" filter="url(#glow-gold)">
                    <animateMotion dur="${getDur(flowSolarToBat)}s" repeatCount="indefinite" path="${pZonBat}" />
                  </circle>
                  <circle r="5" fill="#f59e0b" filter="url(#glow-gold)">
                    <animateMotion dur="${getDur(flowSolarToBat)}s" begin="-${(parseFloat(getDur(flowSolarToBat))/2).toFixed(2)}s" repeatCount="indefinite" path="${pZonBat}" />
                  </circle>
                ` : ''}

                ${flowSolarToGrid > 20 ? svg`
                  <path d="${pZonNet}" fill="none" stroke="rgba(245, 158, 11, 0.4)" stroke-width="2.2" />
                  <circle r="5" fill="#f59e0b" filter="url(#glow-gold)">
                    <animateMotion dur="${getDur(flowSolarToGrid)}s" repeatCount="indefinite" path="${pZonNet}" />
                  </circle>
                  <circle r="5" fill="#f59e0b" filter="url(#glow-gold)">
                    <animateMotion dur="${getDur(flowSolarToGrid)}s" begin="-${(parseFloat(getDur(flowSolarToGrid))/2).toFixed(2)}s" repeatCount="indefinite" path="${pZonNet}" />
                  </circle>
                ` : ''}

                ${flowGridToHome > 20 ? svg`
                  <path d="${pNetHuis}" fill="none" stroke="rgba(56, 189, 248, 0.4)" stroke-width="2.2" />
                  <circle r="5" fill="#38bdf8" filter="url(#glow-blue)">
                    <animateMotion dur="${getDur(flowGridToHome)}s" repeatCount="indefinite" path="${pNetHuis}" />
                  </circle>
                  <circle r="5" fill="#38bdf8" filter="url(#glow-blue)">
                    <animateMotion dur="${getDur(flowGridToHome)}s" begin="-${(parseFloat(getDur(flowGridToHome))/2).toFixed(2)}s" repeatCount="indefinite" path="${pNetHuis}" />
                  </circle>
                ` : ''}

                ${flowGridToBat > 20 ? svg`
                  <path d="${pNetBat}" fill="none" stroke="rgba(56, 189, 248, 0.4)" stroke-width="2.2" />
                  <circle r="5" fill="#38bdf8" filter="url(#glow-blue)">
                    <animateMotion dur="${getDur(flowGridToBat)}s" repeatCount="indefinite" path="${pNetBat}" />
                  </circle>
                  <circle r="5" fill="#38bdf8" filter="url(#glow-blue)">
                    <animateMotion dur="${getDur(flowGridToBat)}s" begin="-${(parseFloat(getDur(flowGridToBat))/2).toFixed(2)}s" repeatCount="indefinite" path="${pNetBat}" />
                  </circle>
                ` : ''}

                ${flowBatToHome > 20 ? svg`
                  <path d="${pBatHuis}" fill="none" stroke="rgba(16, 185, 129, 0.4)" stroke-width="2.2" />
                  <circle r="5" fill="#10b981" filter="url(#glow-green)">
                    <animateMotion dur="${getDur(flowBatToHome)}s" repeatCount="indefinite" path="${pBatHuis}" />
                  </circle>
                  <circle r="5" fill="#10b981" filter="url(#glow-green)">
                    <animateMotion dur="${getDur(flowBatToHome)}s" begin="-${(parseFloat(getDur(flowBatToHome))/2).toFixed(2)}s" repeatCount="indefinite" path="${pBatHuis}" />
                  </circle>
                ` : ''}

                ${flowBatToGrid > 20 ? svg`
                  <path d="${pBatNet}" fill="none" stroke="rgba(16, 185, 129, 0.4)" stroke-width="2.2" />
                  <circle r="5" fill="#10b981" filter="url(#glow-green)">
                    <animateMotion dur="${getDur(flowBatToGrid)}s" repeatCount="indefinite" path="${pBatNet}" />
                  </circle>
                  <circle r="5" fill="#10b981" filter="url(#glow-green)">
                    <animateMotion dur="${getDur(flowBatToGrid)}s" begin="-${(parseFloat(getDur(flowBatToGrid))/2).toFixed(2)}s" repeatCount="indefinite" path="${pBatNet}" />
                  </circle>
                ` : ''}

                <!-- Nodes -->
                <g transform="translate(${xL}, ${yT})" class="circle-interactive" title="Klik voor Zonne-energie grafiek" @click="${() => this._openDetailView('solar')}">
                  <text x="0" y="${-R - 12}" class="node-outer-label">Zon</text>
                  <circle cx="0" cy="0" r="${R}" fill="none" stroke="rgba(255, 255, 255, 0.08)" stroke-width="9" />
                  <circle cx="0" cy="0" r="${R}" fill="none" stroke="#f59e0b" stroke-width="9"
                    stroke-dasharray="${circ}" stroke-dashoffset="0"
                    transform="rotate(-90)" stroke-linecap="round" />
                  <circle cx="0" cy="0" r="${rDisc}" fill="#141821" stroke="rgba(255, 255, 255, 0.08)" stroke-width="1" />
                  
                  <foreignObject x="${-rDisc}" y="${-rDisc}" width="${rDisc * 2}" height="${rDisc * 2}">
                    <div class="node-disc-content">
                      <span class="node-today-total">${this._formatEnergy(solarToday)}</span>
                      <div class="node-icon-box" style="color: #f59e0b;">
                        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
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
                      <div class="node-val">
                        ${this._formatPower(solarW).value}
                        <span class="unit">${this._formatPower(solarW).unit}</span>
                      </div>
                      <span class="node-status-pill ${solarW > 20 ? 'pill-amber' : 'pill-gray'}">
                        ${solarW > 20 ? 'Opwekking' : 'Standby'}
                      </span>
                    </div>
                  </foreignObject>
                </g>

                <g transform="translate(${xR}, ${yT})" class="circle-interactive" title="Klik voor Huisverbruik grafiek" @click="${() => this._openDetailView('home')}">
                  <text x="0" y="${-R - 12}" class="node-outer-label">Thuis</text>
                  <circle cx="0" cy="0" r="${R}" fill="none" stroke="rgba(255, 255, 255, 0.12)" stroke-width="9" />
                  ${lenSolar > 0 ? svg`
                    <circle cx="0" cy="0" r="${R}" fill="none" stroke="#f59e0b" stroke-width="9"
                      stroke-dasharray="${lenSolar} ${circ}" stroke-dashoffset="${offsetSolar}" transform="rotate(-90)" />
                  ` : ''}
                  ${lenBat > 0 ? svg`
                    <circle cx="0" cy="0" r="${R}" fill="none" stroke="#10b981" stroke-width="9"
                      stroke-dasharray="${lenBat} ${circ}" stroke-dashoffset="${offsetBat}" transform="rotate(-90)" />
                  ` : ''}
                  ${lenGrid > 0 ? svg`
                    <circle cx="0" cy="0" r="${R}" fill="none" stroke="#38bdf8" stroke-width="9"
                      stroke-dasharray="${lenGrid} ${circ}" stroke-dashoffset="${offsetGrid}" transform="rotate(-90)" />
                  ` : ''}

                  <circle cx="0" cy="0" r="${rDisc}" fill="#141821" stroke="rgba(255, 255, 255, 0.08)" stroke-width="1" />
                  
                  <foreignObject x="${-rDisc}" y="${-rDisc}" width="${rDisc * 2}" height="${rDisc * 2}">
                    <div class="node-disc-content">
                      <span class="node-today-total">${this._formatEnergy(homeToday)}</span>
                      <div class="node-icon-box" style="color: #f1f5f9;">
                        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                          <path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"></path>
                          <polyline points="9 22 9 12 15 12 15 22"></polyline>
                        </svg>
                      </div>
                      <div class="node-val">
                        ${this._formatPower(homeRawW).value}
                        <span class="unit">${this._formatPower(homeRawW).unit}</span>
                      </div>
                      <span class="node-status-pill ${flowSolarToHome > 20 && flowGridToHome <= 20 ? 'pill-amber' : flowGridToHome > 20 ? 'pill-blue' : 'pill-green'}">
                        ${flowSolarToHome > 20 && flowGridToHome <= 20 ? '100% Zon' : flowGridToHome > 20 && flowSolarToHome <= 20 ? 'Netverbruik' : 'Zon + Net'}
                      </span>
                    </div>
                  </foreignObject>
                </g>

                <g transform="translate(${xL}, ${yB})" class="circle-interactive" title="Klik voor Thuisbatterij grafiek" @click="${() => this._openDetailView('battery')}">
                  <text x="0" y="${R + 24}" class="node-outer-label">Batterij</text>
                  <circle cx="0" cy="0" r="${R}" fill="none" stroke="rgba(255, 255, 255, 0.08)" stroke-width="9" />
                  <circle cx="0" cy="0" r="${R}" fill="none" stroke="#10b981" stroke-width="9"
                    stroke-dasharray="${circ}" stroke-dashoffset="${batOffset}"
                    transform="rotate(-90)" stroke-linecap="round" />
                  <circle cx="0" cy="0" r="${rDisc}" fill="#141821" stroke="rgba(255, 255, 255, 0.08)" stroke-width="1" />
                  <foreignObject x="${-rDisc}" y="${-rDisc}" width="${rDisc * 2}" height="${rDisc * 2}">
                    <div class="node-disc-content">
                      <span class="node-today-total" style="color: #10b981;">${batSoC.toFixed(0)} %</span>
                      <div class="node-icon-box" style="color: #10b981;">
                        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                          <rect x="2" y="7" width="16" height="10" rx="2" ry="2"></rect>
                          <line x1="22" y1="11" x2="22" y2="13"></line>
                          <polygon points="10 9 7 13 11 13 8 16 13 12 9 12 10 9" fill="#10b981" stroke="none"></polygon>
                        </svg>
                      </div>
                      <div class="node-val">
                        ${this._formatPower(batRawW).value}
                        <span class="unit">${this._formatPower(batRawW).unit}</span>
                      </div>
                      <span class="node-status-pill ${isBatCharging ? 'pill-green' : isBatDischarging ? 'pill-amber' : 'pill-gray'}">
                        ${isBatCharging ? `Laden ${this._formatPower(batChargeW).value} ${this._formatPower(batChargeW).unit}` : isBatDischarging ? `Ontladen ${this._formatPower(batDischargeW).value} ${this._formatPower(batDischargeW).unit}` : 'Standby'}
                      </span>
                    </div>
                  </foreignObject>
                </g>

                <g transform="translate(${xR}, ${yB})" class="circle-interactive" title="Klik voor Netstroom grafiek" @click="${() => this._openDetailView('grid')}">
                  <text x="0" y="${R + 24}" class="node-outer-label">Net</text>
                  <circle cx="0" cy="0" r="${R}" fill="none" stroke="rgba(255, 255, 255, 0.08)" stroke-width="9" />
                  <circle cx="0" cy="0" r="${R}" fill="none" stroke="${isGridImport ? '#38bdf8' : '#10b981'}" stroke-width="9"
                    stroke-dasharray="${circ}" stroke-dashoffset="0"
                    transform="rotate(-90)" stroke-linecap="round" />
                  <circle cx="0" cy="0" r="${rDisc}" fill="#141821" stroke="rgba(255, 255, 255, 0.08)" stroke-width="1" />
                  <foreignObject x="${-rDisc}" y="${-rDisc}" width="${rDisc * 2}" height="${rDisc * 2}">
                    <div class="node-disc-content">
                      <span class="node-today-total" style="font-size: 11.5px; white-space: nowrap;">
                        ↓${gridImportToday.toFixed(1)} ↑${gridExportToday.toFixed(1)}
                      </span>
                      <div class="node-icon-box" style="color: ${isGridImport ? '#38bdf8' : '#10b981'};">
                        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                          <path d="M4 22h16"></path>
                          <path d="M7 22l5-19 5 19"></path>
                          <path d="M6 13h12"></path>
                          <path d="M8 8h8"></path>
                        </svg>
                      </div>
                      <div class="node-val" style="color: ${isGridImport ? '#f8fafc' : '#10b981'};">
                        ${this._formatPower(gridW).value}
                        <span class="unit">${this._formatPower(gridW).unit}</span>
                      </div>
                      <span class="node-status-pill ${isGridImport ? 'pill-blue' : 'pill-green'}">
                        ${isGridImport ? 'Afname' : 'Teruglevering'}
                      </span>
                    </div>
                  </foreignObject>
                  <circle cx="0" cy="0" r="${R + 8}" fill="transparent" style="cursor: pointer;" @click="${() => this._openDetailView('grid')}" />
                </g>
              </svg>
            </div>
          ` : this._renderDetailView()}
          </div>

          <!-- Right: Simplified 2-Card Layout (Prices Chart on Top, Single Overview Below) -->
          <div class="panel-card">
            <div class="panel-title-bar">
              <h2 class="panel-title">
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#10b981" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                  <line x1="12" y1="1" x2="12" y2="23"></line>
                  <path d="M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6"></path>
                </svg>
                Tarieven & Financiën
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

            <div class="right-stack">
              <!-- Top Card: Dynamic Energy Prices Chart (Zonneplan 24 Hours) -->
              <div class="right-card">
                <div class="card-header-line">
                  <span class="card-title-text">
                    <svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="#38bdf8" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                      <polyline points="22 12 18 12 15 21 9 3 6 12 2 12"></polyline>
                    </svg>
                    Dynamische Stroomprijzen Vandaag
                  </span>
                  ${this._hoveredHour !== null ? (() => {
    const hObj = todayHours.find(h => h.hour === this._hoveredHour);
    const pStr = hObj ? hObj.price.toFixed(3) : currentTariff.toFixed(3);
    return html`
      <span class="node-status-pill pill-amber" style="font-weight: 700; box-shadow: 0 0 10px rgba(245, 158, 11, 0.4);">
        ${this._hoveredHour}:00 - € ${pStr} / kWh
      </span>
    `;
  })() : html`
    <span class="node-status-pill pill-blue">
      Nu: € ${currentTariff.toFixed(3)} / kWh
    </span>
  `}
                </div>

                <!-- 24-Hour SVG Bar Chart -->
                <div class="tariff-chart-box">
                  <svg class="tariff-svg" viewBox="0 0 460 140">
                    <!-- Subtle guide lines -->
                    <line x1="30" y1="30" x2="450" y2="30" stroke="rgba(255, 255, 255, 0.08)" stroke-dasharray="3 4" />
                    <text x="24" y="34" fill="#64748b" font-size="9" text-anchor="end">€ 0.40</text>

                    <line x1="30" y1="75" x2="450" y2="75" stroke="rgba(255, 255, 255, 0.08)" stroke-dasharray="3 4" />
                    <text x="24" y="79" fill="#64748b" font-size="9" text-anchor="end">€ 0.20</text>

                    <line x1="30" y1="120" x2="450" y2="120" stroke="rgba(255, 255, 255, 0.12)" />
                    <text x="24" y="124" fill="#64748b" font-size="9" text-anchor="end">€ 0.00</text>

                    <!-- 1. Layer of 24 Hourly Bars -->
                    ${todayHours.map((th, idx) => {
                      const barW = 12.5;
                      const x = 32 + idx * 17.2;
                      const maxScale = 0.45;
                      const barH = Math.max(5, (th.price / maxScale) * 90);
                      const y = 120 - barH;
                      const isNow = th.hour === currentHour;
                      const isPeak = th.hour === maxHour;
                      const isHovered = this._hoveredHour === th.hour;
                      
                      const fillColor = isNow ? '#38bdf8' : th.price > 0.35 ? '#ef4444' : th.price > 0.22 ? '#f59e0b' : '#10b981';

                      return svg`
                        <g style="cursor: pointer;"
                          @mouseenter="${() => { this._hoveredHour = th.hour; }}"
                          @mouseleave="${() => { this._hoveredHour = null; }}">
                          
                          <!-- Invisible wide hit area -->
                          <rect x="${x - 2.5}" y="15" width="17.2" height="110" fill="transparent" />

                          <!-- Actual Bar -->
                          <rect x="${x}" y="${y}" width="${barW}" height="${barH}" rx="2.5"
                            fill="${fillColor}" opacity="${isHovered ? 1 : isNow ? 1 : 0.82}"
                            stroke="${isHovered ? '#ffffff' : 'none'}" stroke-width="${isHovered ? 1.5 : 0}" />
                          
                          ${isNow && !isHovered ? svg`
                            <rect x="${x - 2}" y="${y - 2}" width="${barW + 4}" height="${barH + 4}" rx="4"
                              fill="none" stroke="#38bdf8" stroke-width="1.5" />
                            <text x="${x + barW / 2}" y="${y - 6}" fill="#38bdf8" font-size="9" font-weight="700" text-anchor="middle">NU</text>
                          ` : ''}

                          ${isPeak && !isNow && !isHovered ? svg`
                            <text x="${x + barW / 2}" y="${y - 4}" fill="#ef4444" font-size="8" font-weight="600" text-anchor="middle">Top</text>
                          ` : ''}

                          ${(idx % 4 === 0 || idx === 23) ? svg`
                            <text x="${x + barW / 2}" y="134" fill="${isHovered ? '#f1f5f9' : '#64748b'}" font-size="9" font-weight="${isHovered ? '700' : '400'}" text-anchor="middle">
                              ${th.hour.toString().padStart(2, '0')}
                            </text>
                          ` : ''}
                        </g>
                      `;
                    })}

                    <!-- 2. Tooltip Layer (Rendered AFTER all bars, so it is strictly IN FRONT of all bars!) -->
                    ${this._hoveredHour !== null ? (() => {
                      const th = todayHours.find(h => h.hour === this._hoveredHour);
                      if (!th) return '';
                      const idx = todayHours.indexOf(th);
                      const barW = 12.5;
                      const x = 32 + idx * 17.2;
                      const maxScale = 0.45;
                      const barH = Math.max(5, (th.price / maxScale) * 90);
                      const y = 120 - barH;
                      const tooltipX = Math.max(50, Math.min(410, x + barW / 2));
                      const tooltipY = Math.max(22, y - 8);

                      return svg`
                        <g transform="translate(${tooltipX}, ${tooltipY})" pointer-events="none">
                          <rect x="-44" y="-20" width="88" height="20" rx="5"
                            fill="#0b0f19" stroke="#38bdf8" stroke-width="1.5"
                            filter="drop-shadow(0 4px 12px rgba(0,0,0,0.85))" />
                          <text x="0" y="-6" fill="#f8fafc" font-size="10" font-weight="700" text-anchor="middle">
                            ${th.hour.toString().padStart(2, '0')}:00  € ${th.price.toFixed(3)}
                          </text>
                        </g>
                      `;
                    })() : ''}
                  </svg>
                </div>

                <div class="price-legend-row">
                  <span>🟢 Dal: <strong>€ ${minP.toFixed(3)}</strong> (${minHour}:00)</span>
                  <span>🔴 Piek: <strong>€ ${maxP.toFixed(3)}</strong> (${maxHour}:00)</span>
                  <span>⚡ Huidig: <strong>€ ${currentTariff.toFixed(3)}</strong></span>
                </div>
              </div>

              <!-- Bottom Card: Wat is er vandaag gebeurd en verdiend -->
              <div class="right-card">
                <div class="card-header-line">
                  <span class="card-title-text">
                    <svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="#10b981" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                      <line x1="12" y1="1" x2="12" y2="23"></line>
                      <path d="M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6"></path>
                    </svg>
                    Winst & Rendement Vandaag
                  </span>
                  <span class="node-status-pill pill-green">
                    Netto Winst: + € ${(-netInvoiceToday).toFixed(2)}
                  </span>
                </div>

                <div class="overview-vertical-list">
                  <!-- Blok 1: Stroomhandel op het Net -->
                  <div class="overview-block">
                    <div class="block-header">
                      <div class="block-title" style="color: #38bdf8;">
                        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M13 2L3 14h9l-1 8 10-12h-9l1-8z"/></svg>
                        <span>Stroomhandel op het Net (P1)</span>
                      </div>
                      <span class="node-status-pill pill-blue">Zonneplan</span>
                    </div>

                    <div class="mini-row-list">
                      <div class="mini-row">
                        <span>Ingekochte stroom (goedkoop/dal):</span>
                        <strong>€ ${gridImportCostToday.toFixed(2)} <span class="sub-dim">(${gridImportToday.toFixed(1)} kWh)</span></strong>
                      </div>
                      <div class="mini-row">
                        <span>Verkochte stroom (piekuren):</span>
                        <strong style="color: #10b981;">- € ${gridExportRevToday.toFixed(2)} <span class="sub-dim">(${gridExportToday.toFixed(1)} kWh)</span></strong>
                      </div>
                      <div class="mini-row">
                        <span>Powerplay onbalansbonus:</span>
                        <strong style="color: #10b981;">- € ${powerplayToday.toFixed(2)}</strong>
                      </div>
                      <div class="total-row">
                        <span>Netto verdiend op het net (vandaag):</span>
                        <strong style="color: #10b981; font-size: 15px;">
                          + € ${(-netInvoiceToday).toFixed(2)}
                        </strong>
                      </div>
                    </div>
                  </div>

                  <!-- Blok 2: Thuisbatterij Activiteit -->
                  <div class="overview-block">
                    <div class="block-header">
                      <div class="block-title" style="color: #10b981;">
                        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><rect x="2" y="7" width="16" height="10" rx="2" ry="2"></rect><line x1="22" y1="11" x2="22" y2="13"></line></svg>
                        <span>Thuisbatterij Activiteit & Winst</span>
                      </div>
                      <span class="node-status-pill pill-green" style="cursor: pointer;" title="Klik 3x voor Terugverdientijd" @click="${() => this._handleRendementClick()}">Rendement</span>
                    </div>

                    <div class="mini-row-list">
                      <div class="mini-row">
                        <span>Directe Powerplay bonus:</span>
                        <strong style="color: #10b981;">€ ${powerplayToday.toFixed(2)}</strong>
                      </div>
                      <div class="mini-row">
                        <span>Bespaard op eigen huisverbruik:</span>
                        <strong>€ ${batHomeSavingsToday.toFixed(2)} <span class="sub-dim">(vermeden piek)</span></strong>
                      </div>
                      <div class="mini-row">
                        <span>Batterij doorvoer vandaag:</span>
                        <strong style="color: #cbd5e1;">${batChargedToday.toFixed(1)} in / ${batDischargedToday.toFixed(1)} uit kWh</strong>
                      </div>
                      <div class="total-row">
                        <span>Extra batterij bonus (onbalans + piek):</span>
                        <strong style="color: #10b981; font-size: 15px;">+ € ${batTotalValueToday.toFixed(2)}</strong>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              ${this._showRoi ? html`
                <!-- Geheime Terugverdientijd & Investering Section -->
                <div class="roi-section" title="Klik om de aanschafprijs aan te passen" @click="${() => this._openMoreInfo('input_number.thuisbatterij_aanschafprijs')}">
                  <div class="roi-header">
                    <div class="roi-title">
                      <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#10b981" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                        <line x1="12" y1="1" x2="12" y2="23"></line>
                        <path d="M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6"></path>
                      </svg>
                      <span>Terugverdientijd Thuisbatterij</span>
                    </div>
                    <div style="display: flex; align-items: center; gap: 8px;">
                      <div class="roi-badge">
                        € ${batLifetimeSaved.toFixed(2)} / € ${batPurchasePrice.toLocaleString('nl-NL', { maximumFractionDigits: 0 })} (${batPaybackPct.toFixed(1)}%)
                      </div>
                      <span style="font-size: 11px; color: #64748b; cursor: pointer; padding: 0 4px;" title="Sluiten" @click="${(e: Event) => { e.stopPropagation(); this._showRoi = false; }}">✕</span>
                    </div>
                  </div>

                  <div class="roi-progress-track">
                    <div class="roi-progress-fill" style="width: ${Math.min(100, Math.max(1.5, batPaybackPct))}%;"></div>
                  </div>

                  <div class="roi-stats-row">
                    <span>Reeds terug: <strong style="color: #10b981;">€ ${batLifetimeSaved.toFixed(2)}</strong></span>
                    <span>Nog te gaan: <strong style="color: #f8fafc;">€ ${batRemaining.toLocaleString('nl-NL', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</strong></span>
                    <span>Verwacht: <strong style="color: #38bdf8;">ca. ${batYearsRemaining.toFixed(1)} jaar</strong> <span style="color: #64748b; font-size: 10px;">(€ ${batDailyAvg.toFixed(2)}/d)</span></span>
                  </div>
                </div>
                ` : ''}

                
              </div>
            </div>
          </div>
        </div>
      </div>
    `;
  }

      private _aggregateHistory5Min(entityId: string, startTime: number, endTime: number): { time: number; mean: number; min: number; max: number }[] {
    const raw = (this._historyData && this._historyData[entityId]) || [];
    if (raw.length === 0) return [];

    const parsed = raw.map((p: any) => {
      const state = parseFloat(p.s !== undefined ? p.s : p.state);
      const time = (p.lu !== undefined ? p.lu * 1000 : (p.t !== undefined ? p.t * 1000 : new Date(p.last_changed || p.last_updated).getTime()));
      return { state: isNaN(state) ? 0 : state, time };
    }).filter(p => p.time >= startTime && p.time <= endTime)
      .sort((a, b) => a.time - b.time);

    if (parsed.length === 0) return [];

    const bucketMs = 5 * 60 * 1000;
    const buckets: Record<number, number[]> = {};
    parsed.forEach(p => {
      const bTime = Math.floor(p.time / bucketMs) * bucketMs;
      if (!buckets[bTime]) buckets[bTime] = [];
      buckets[bTime].push(p.state);
    });

    const times = Object.keys(buckets).map(Number).sort((a, b) => a - b);
    return times.map(t => {
      const vals = buckets[t];
      const min = Math.min(...vals);
      const max = Math.max(...vals);
      const mean = vals.reduce((sum, v) => sum + v, 0) / vals.length;
      return { time: t, mean, min, max };
    });
  }

  private _openDetailView(view: 'solar' | 'home' | 'battery' | 'grid'): void {
    this._activeDetailView = view;
    if (!this._historyData || Object.keys(this._historyData).length === 0 || (Date.now() - this._lastFetchTime > 30000)) {
      this._fetchHistoricalData();
    }
  }

  private _renderDetailView(): TemplateResult {
    const now = new Date();
    const startTime = new Date(now.getFullYear(), now.getMonth(), now.getDate(), 0, 0, 0).getTime();
    const endTime = new Date(now.getFullYear(), now.getMonth(), now.getDate(), 23, 59, 59).getTime();

    // Chart dimensions inside SVG viewBox 0 0 600 480 (Full container fill)
    const cL = 55;
    const cR = 545;
    const cW = cR - cL;
    const cT = 20;
    const cH = 410;
    const cB = cT + cH; // 430

    const timeToX = (t: number) => cL + ((t - startTime) / (endTime - startTime)) * cW;

    // Retrieve active component details
    let viewColor = '#f59e0b';
    let viewTitle = '';
    let kpiBadge = '';

    const solarToday = this._getNumber('sensor.totale_opwek_vandaag_2');
    const solarW = Math.max(0, this._getNumber('sensor.totale_live_zonnestroom'));
    const homeToday = this._getNumber('sensor.echt_huisverbruik_vandaag');
    const homeW = Math.max(0, this._getNumber('sensor.live_huisverbruik'));
    const gridW = this._getNumber('sensor.p1_meter_power');
    const gridImpToday = this._getNumber('sensor.p1_netstroom_afname_vandaag');
    const batW = this._getNumber('sensor.thuisbatterij_vermogen');
    const batSoC = Math.min(100, Math.max(0, this._getNumber('sensor.thuisbatterij_percentage', 100)));
    const batCapacity = this._getNumber('input_number.thuisbatterij_capaciteit', 35);
    const batKwhNow = (batSoC / 100) * batCapacity;

    let viewIcon: TemplateResult = html``;

    if (this._activeDetailView === 'solar') {
      viewColor = '#f59e0b';
      viewTitle = 'Zonne-energie (24-uur)';
      viewIcon = html`
        <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="#f59e0b" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" style="flex-shrink: 0;">
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
      `;
      kpiBadge = `Nu: ${solarW} W | Vandaag: ${solarToday.toFixed(1)} kWh`;
    } else if (this._activeDetailView === 'home') {
      viewColor = '#f1f5f9';
      viewTitle = 'Huisverbruik (24-uur)';
      viewIcon = html`
        <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="#f1f5f9" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" style="flex-shrink: 0;">
          <path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"></path>
          <polyline points="9 22 9 12 15 12 15 22"></polyline>
        </svg>
      `;
      kpiBadge = `Nu: ${homeW} W | Vandaag: ${homeToday.toFixed(1)} kWh`;
    } else if (this._activeDetailView === 'battery') {
      viewColor = '#10b981';
      viewTitle = 'Thuisbatterij (24-uur)';
      viewIcon = html`
        <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="#10b981" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" style="flex-shrink: 0;">
          <rect x="2" y="7" width="16" height="10" rx="2" ry="2"></rect>
          <line x1="22" y1="11" x2="22" y2="13"></line>
          <polygon points="10 9 7 13 11 13 8 16 13 12 9 12 10 9" fill="#10b981" stroke="none"></polygon>
        </svg>
      `;
      kpiBadge = `${batKwhNow.toFixed(1)} / ${batCapacity} kWh (${batSoC.toFixed(0)}%) | ${Math.abs(batW)} W`;
    } else if (this._activeDetailView === 'grid') {
      viewColor = '#38bdf8';
      viewTitle = 'Netstroom (24-uur)';
      viewIcon = html`
        <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="#38bdf8" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" style="flex-shrink: 0;">
          <path d="M4 22h16"></path>
          <path d="M7 22l5-19 5 19"></path>
          <path d="M6 13h12"></path>
          <path d="M8 8h8"></path>
        </svg>
      `;
      kpiBadge = `Nu: ${gridW >= 0 ? '+' : ''}${gridW} W | Afname: ${gridImpToday.toFixed(1)} kWh`;
    }

    return html`
      <div class="detail-view-container">
        <!-- Top Dedicated Header Bar with single back button -->
        <div class="detail-header-bar">
          <button class="back-btn" @click="${() => { this._activeDetailView = 'flow'; }}">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5">
              <polyline points="15 18 9 12 15 6"></polyline>
            </svg>
            <span>Terug naar schema</span>
          </button>

          <h2 class="panel-title" style="color: ${viewColor}; margin: 0; font-size: 16px; font-weight: 600; display: flex; align-items: center; gap: 8px;">
            ${viewIcon}
            <span>${viewTitle}</span>
          </h2>

          <span class="node-status-pill" style="border-color: ${viewColor}; color: ${viewColor}; font-weight: 600; font-size: 12px; padding: 5px 12px;">
            ${kpiBadge}
          </span>
        </div>

        <!-- Optional Battery Subtabs (Option B: Full Height Toggle) -->
        ${this._activeDetailView === 'battery' ? html`
          <div class="subtabs-bar">
            <button class="subtab-pill ${this._batteryChartMode === 'kwh' ? 'active' : ''}" @click="${() => { this._batteryChartMode = 'kwh'; }}" style="display: flex; align-items: center; gap: 6px;">
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                <rect x="2" y="7" width="16" height="10" rx="2" ry="2"></rect>
                <line x1="22" y1="11" x2="22" y2="13"></line>
                <polygon points="10 9 7 13 11 13 8 16 13 12 9 12 10 9" fill="currentColor" stroke="none"></polygon>
              </svg>
              <span>Accu-inhoud (kWh & %)</span>
            </button>
            <button class="subtab-pill ${this._batteryChartMode === 'power' ? 'active' : ''}" @click="${() => { this._batteryChartMode = 'power'; }}" style="display: flex; align-items: center; gap: 6px;">
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                <polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2"></polygon>
              </svg>
              <span>Vermogen Laden / Ontladen (Watt)</span>
            </button>
          </div>
        ` : ''}

        <!-- 24-Hour Interactive High-Res SVG Chart filling container -->
        <div class="detail-chart-wrapper">
          <svg class="detail-chart-svg" viewBox="0 0 600 480"
            @mousemove="${(e: MouseEvent) => this._handleChartMouseMove(e, cL, cR, cT, cB, startTime, endTime)}"
            @mouseleave="${() => { this._hoverChartPoint = null; }}">
            
            <defs>
              <linearGradient id="solar-chart-grad" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stop-color="#f59e0b" stop-opacity="0.45" />
                <stop offset="100%" stop-color="#f59e0b" stop-opacity="0.02" />
              </linearGradient>
              <linearGradient id="home-chart-grad" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stop-color="#ffffff" stop-opacity="0.35" />
                <stop offset="100%" stop-color="#ffffff" stop-opacity="0.02" />
              </linearGradient>
              <linearGradient id="bat-kwh-grad" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stop-color="#10b981" stop-opacity="0.45" />
                <stop offset="100%" stop-color="#10b981" stop-opacity="0.03" />
              </linearGradient>
            </defs>

            <!-- Grid Guidelines & X-Axis Time Markers -->
            ${[0, 4, 8, 12, 16, 20, 24].map(h => {
              const x = cL + (h / 24) * cW;
              return svg`
                <line x1="${x}" y1="${cT}" x2="${x}" y2="${cB}" stroke="rgba(255, 255, 255, 0.07)" stroke-dasharray="3 4" />
                <text x="${x}" y="${cB + 22}" fill="#94a3b8" font-size="11" font-weight="500" text-anchor="middle">
                  ${String(h).padStart(2, '0')}:00
                </text>
              `;
            })}

            <!-- Component-Specific Chart Paths -->
            ${(() => {
              if (this._activeDetailView === 'solar') {
                const data = this._aggregateHistory5Min('sensor.totale_live_zonnestroom', startTime, endTime);
                const maxVal = Math.max(1000, ...data.map(d => d.max));
                const pts = data.map(d => ({
                  x: timeToX(d.time),
                  y: cB - (Math.max(0, d.mean) / maxVal) * cH,
                  val: d.mean,
                  time: d.time
                }));

                const linePath = pts.length > 0 ? `M ${pts[0].x.toFixed(1)} ${pts[0].y.toFixed(1)} ` + pts.slice(1).map(p => `L ${p.x.toFixed(1)} ${p.y.toFixed(1)}`).join(' ') : '';
                const areaPath = pts.length > 0 ? `M ${pts[0].x.toFixed(1)} ${cB} ` + pts.map(p => `L ${p.x.toFixed(1)} ${p.y.toFixed(1)}`).join(' ') + ` L ${pts[pts.length-1].x.toFixed(1)} ${cB} Z` : '';

                return svg`
                  <!-- Y-Axis Guides (Horizontal lines with y2!) -->
                  ${[0, 0.25, 0.5, 0.75, 1.0].map(pct => {
                    const y = cB - pct * cH;
                    const val = Math.round(pct * maxVal);
                    return svg`
                      <line x1="${cL}" y1="${y}" x2="${cR}" y2="${y}" stroke="rgba(255, 255, 255, ${pct === 0 ? '0.15' : '0.05'})" stroke-dasharray="${pct === 0 ? 'none' : '3 4'}" />
                      <text x="${cL - 8}" y="${y + 4}" fill="#94a3b8" font-size="10" text-anchor="end">${val >= 1000 ? (val/1000).toFixed(1) + ' kW' : val + ' W'}</text>
                    `;
                  })}

                  ${areaPath ? svg`<path d="${areaPath}" fill="url(#solar-chart-grad)" />` : ''}
                  ${linePath ? svg`<path d="${linePath}" fill="none" stroke="#f59e0b" stroke-width="2.5" stroke-linecap="round" filter="drop-shadow(0 0 6px rgba(245, 158, 11, 0.4))" />` : ''}
                `;
              }

              if (this._activeDetailView === 'home') {
                const data = this._aggregateHistory5Min('sensor.live_huisverbruik', startTime, endTime);
                const maxVal = Math.max(1000, ...data.map(d => d.max));
                const pts = data.map(d => ({
                  x: timeToX(d.time),
                  y: cB - (Math.max(0, d.mean) / maxVal) * cH,
                  val: d.mean,
                  time: d.time
                }));

                const linePath = pts.length > 0 ? `M ${pts[0].x.toFixed(1)} ${pts[0].y.toFixed(1)} ` + pts.slice(1).map(p => `L ${p.x.toFixed(1)} ${p.y.toFixed(1)}`).join(' ') : '';
                const areaPath = pts.length > 0 ? `M ${pts[0].x.toFixed(1)} ${cB} ` + pts.map(p => `L ${p.x.toFixed(1)} ${p.y.toFixed(1)}`).join(' ') + ` L ${pts[pts.length-1].x.toFixed(1)} ${cB} Z` : '';

                return svg`
                  <!-- Y-Axis Guides (Horizontal lines with y2!) -->
                  ${[0, 0.25, 0.5, 0.75, 1.0].map(pct => {
                    const y = cB - pct * cH;
                    const val = Math.round(pct * maxVal);
                    return svg`
                      <line x1="${cL}" y1="${y}" x2="${cR}" y2="${y}" stroke="rgba(255, 255, 255, ${pct === 0 ? '0.15' : '0.05'})" stroke-dasharray="${pct === 0 ? 'none' : '3 4'}" />
                      <text x="${cL - 8}" y="${y + 4}" fill="#94a3b8" font-size="10" text-anchor="end">${val >= 1000 ? (val/1000).toFixed(1) + ' kW' : val + ' W'}</text>
                    `;
                  })}

                  ${areaPath ? svg`<path d="${areaPath}" fill="url(#home-chart-grad)" />` : ''}
                  ${linePath ? svg`<path d="${linePath}" fill="none" stroke="#f1f5f9" stroke-width="2.2" stroke-linecap="round" />` : ''}
                `;
              }

              if (this._activeDetailView === 'battery') {
                if (this._batteryChartMode === 'kwh') {
                  const data = this._aggregateHistory5Min('sensor.thuisbatterij_percentage', startTime, endTime);
                  const pts = data.map(d => ({
                    x: timeToX(d.time),
                    y: cB - (Math.min(100, Math.max(0, d.mean)) / 100) * cH,
                    pct: d.mean,
                    kwh: (d.mean / 100) * batCapacity,
                    time: d.time
                  }));

                  const linePath = pts.length > 0 ? `M ${pts[0].x.toFixed(1)} ${pts[0].y.toFixed(1)} ` + pts.slice(1).map(p => `L ${p.x.toFixed(1)} ${p.y.toFixed(1)}`).join(' ') : '';
                  const areaPath = pts.length > 0 ? `M ${pts[0].x.toFixed(1)} ${cB} ` + pts.map(p => `L ${p.x.toFixed(1)} ${p.y.toFixed(1)}`).join(' ') + ` L ${pts[pts.length-1].x.toFixed(1)} ${cB} Z` : '';

                  return svg`
                    <!-- Dual Y-Axis Guides: Left = kWh, Right = % (Horizontal lines with y2!) -->
                    ${[0, 0.25, 0.5, 0.75, 1.0].map(pct => {
                      const y = cB - pct * cH;
                      const kwhVal = (pct * batCapacity).toFixed(0);
                      const pctVal = Math.round(pct * 100);
                      return svg`
                        <line x1="${cL}" y1="${y}" x2="${cR}" y2="${y}" stroke="rgba(255, 255, 255, ${pct === 0 ? '0.15' : '0.05'})" stroke-dasharray="${pct === 0 ? 'none' : '3 4'}" />
                        <text x="${cL - 8}" y="${y + 4}" fill="#10b981" font-size="10" font-weight="600" text-anchor="end">${kwhVal} kWh</text>
                        <text x="${cR + 8}" y="${y + 4}" fill="#94a3b8" font-size="10" text-anchor="start">${pctVal} %</text>
                      `;
                    })}

                    ${areaPath ? svg`<path d="${areaPath}" fill="url(#bat-kwh-grad)" />` : ''}
                    ${linePath ? svg`<path d="${linePath}" fill="none" stroke="#10b981" stroke-width="2.5" stroke-linecap="round" filter="drop-shadow(0 0 8px rgba(16, 185, 129, 0.5))" />` : ''}
                    
                    ${pts.length > 0 ? svg`
                      <circle cx="${pts[pts.length-1].x}" cy="${pts[pts.length-1].y}" r="4.5" fill="#10b981" stroke="#ffffff" stroke-width="1.5" />
                    ` : ''}
                  `;
                } else {
                  const data = this._aggregateHistory5Min('sensor.thuisbatterij_vermogen', startTime, endTime);
                  const maxAbs = Math.max(1000, ...data.map(d => Math.max(Math.abs(d.max), Math.abs(d.min))));
                  const yZero = cT + cH / 2;

                  const pts = data.map(d => ({
                    x: timeToX(d.time),
                    y: yZero - (d.mean / maxAbs) * (cH / 2),
                    val: d.mean,
                    time: d.time
                  }));

                  const linePath = pts.length > 0 ? `M ${pts[0].x.toFixed(1)} ${pts[0].y.toFixed(1)} ` + pts.slice(1).map(p => `L ${p.x.toFixed(1)} ${p.y.toFixed(1)}`).join(' ') : '';
                  const areaPath = pts.length > 0 ? `M ${pts[0].x.toFixed(1)} ${yZero} ` + pts.map(p => `L ${p.x.toFixed(1)} ${p.y.toFixed(1)}`).join(' ') + ` L ${pts[pts.length-1].x.toFixed(1)} ${yZero} Z` : '';

                  return svg`
                    <!-- Zero line with y2 -->
                    <line x1="${cL}" y1="${yZero}" x2="${cR}" y2="${yZero}" stroke="rgba(255, 255, 255, 0.2)" stroke-dasharray="4 4" />
                    <text x="${cL - 8}" y="${yZero + 4}" fill="#64748b" font-size="10" text-anchor="end">0 W</text>

                    <text x="${cL - 8}" y="${cT + 12}" fill="#10b981" font-size="10" font-weight="600" text-anchor="end">+${(maxAbs/1000).toFixed(1)} kW (Laden)</text>
                    <text x="${cL - 8}" y="${cB - 4}" fill="#38bdf8" font-size="10" font-weight="600" text-anchor="end">-${(maxAbs/1000).toFixed(1)} kW (Ontladen)</text>

                    ${areaPath ? svg`<path d="${areaPath}" fill="rgba(16, 185, 129, 0.18)" />` : ''}
                    ${linePath ? svg`<path d="${linePath}" fill="none" stroke="#10b981" stroke-width="2.2" stroke-linecap="round" />` : ''}
                  `;
                }
              }

              if (this._activeDetailView === 'grid') {
                const data = this._aggregateHistory5Min('sensor.p1_meter_power', startTime, endTime);
                const maxAbs = Math.max(1000, ...data.map(d => Math.max(Math.abs(d.max), Math.abs(d.min))));
                const yZero = cT + cH / 2;

                const pts = data.map(d => ({
                  x: timeToX(d.time),
                  y: yZero - (d.mean / maxAbs) * (cH / 2),
                  val: d.mean,
                  time: d.time
                }));

                const linePath = pts.length > 0 ? `M ${pts[0].x.toFixed(1)} ${pts[0].y.toFixed(1)} ` + pts.slice(1).map(p => `L ${p.x.toFixed(1)} ${p.y.toFixed(1)}`).join(' ') : '';
                const areaPath = pts.length > 0 ? `M ${pts[0].x.toFixed(1)} ${yZero} ` + pts.map(p => `L ${p.x.toFixed(1)} ${p.y.toFixed(1)}`).join(' ') + ` L ${pts[pts.length-1].x.toFixed(1)} ${yZero} Z` : '';

                return svg`
                  <!-- Zero line with y2 -->
                  <line x1="${cL}" y1="${yZero}" x2="${cR}" y2="${yZero}" stroke="rgba(255, 255, 255, 0.2)" stroke-dasharray="4 4" />
                  <text x="${cL - 8}" y="${yZero + 4}" fill="#64748b" font-size="10" text-anchor="end">0 W</text>

                  <text x="${cL - 8}" y="${cT + 12}" fill="#38bdf8" font-size="10" font-weight="600" text-anchor="end">+${(maxAbs/1000).toFixed(1)} kW (Afname)</text>
                  <text x="${cL - 8}" y="${cB - 4}" fill="#10b981" font-size="10" font-weight="600" text-anchor="end">-${(maxAbs/1000).toFixed(1)} kW (Teruglevering)</text>

                  ${areaPath ? svg`<path d="${areaPath}" fill="rgba(56, 189, 248, 0.18)" />` : ''}
                  ${linePath ? svg`<path d="${linePath}" fill="none" stroke="#38bdf8" stroke-width="2.2" stroke-linecap="round" />` : ''}
                `;
              }

              return '';
            })()}

            <!-- Interactive Crosshair Tooltip -->
            ${this._hoverChartPoint ? svg`
              <line x1="${this._hoverChartPoint.x}" y1="${cT}" x2="${this._hoverChartPoint.x}" y2="${cB}" stroke="#ffffff" stroke-width="1.2" stroke-dasharray="2 3" pointer-events="none" />
              <circle cx="${this._hoverChartPoint.x}" cy="${this._hoverChartPoint.y}" r="4" fill="#ffffff" filter="drop-shadow(0 0 6px rgba(255,255,255,0.8))" pointer-events="none" />
              
              <g transform="translate(${Math.max(80, Math.min(500, this._hoverChartPoint.x))}, ${Math.max(45, this._hoverChartPoint.y - 30)})" pointer-events="none">
                <rect x="-60" y="-24" width="120" height="36" rx="6" fill="#0b0f19" stroke="rgba(255,255,255,0.18)" stroke-width="1.5" filter="drop-shadow(0 6px 16px rgba(0,0,0,0.9))" />
                <text x="0" y="-10" fill="#94a3b8" font-size="9.5" font-weight="500" text-anchor="middle">${this._hoverChartPoint.title}</text>
                <text x="0" y="4" fill="#f8fafc" font-size="11" font-weight="700" text-anchor="middle">${this._hoverChartPoint.val1}</text>
              </g>
            ` : ''}

          </svg>
        </div>
      </div>
    `;
  }

    private _handleChartMouseMove(e: MouseEvent, cL: number, cR: number, cT: number, cB: number, startTime: number, endTime: number): void {
    const svgEl = e.currentTarget as SVGSVGElement;
    const rect = svgEl.getBoundingClientRect();
    const svgX = ((e.clientX - rect.left) / rect.width) * 600;
    const clampedX = Math.max(cL, Math.min(cR, svgX));

    const t = startTime + ((clampedX - cL) / (cR - cL)) * (endTime - startTime);
    const d = new Date(t);
    const timeStr = `${d.getHours().toString().padStart(2, '0')}:${d.getMinutes().toString().padStart(2, '0')}`;

    const batCapacity = this._getNumber('input_number.thuisbatterij_capaciteit', 35);

    if (this._activeDetailView === 'solar') {
      const data = this._aggregateHistory5Min('sensor.totale_live_zonnestroom', startTime, endTime);
      if (data.length > 0) {
        const closest = data.reduce((prev, curr) => Math.abs(curr.time - t) < Math.abs(prev.time - t) ? curr : prev, data[0]);
        const maxVal = Math.max(1000, ...data.map(d => d.max));
        const y = cB - (Math.max(0, closest.mean) / maxVal) * (cB - cT);
        this._hoverChartPoint = {
          time: t,
          x: clampedX,
          y: y,
          title: `Tijd: ${timeStr}`,
          val1: `Opwek: ${Math.round(closest.mean)} W`
        };
      }
    } else if (this._activeDetailView === 'home') {
      const data = this._aggregateHistory5Min('sensor.live_huisverbruik', startTime, endTime);
      if (data.length > 0) {
        const closest = data.reduce((prev, curr) => Math.abs(curr.time - t) < Math.abs(prev.time - t) ? curr : prev, data[0]);
        const maxVal = Math.max(1000, ...data.map(d => d.max));
        const y = cB - (Math.max(0, closest.mean) / maxVal) * (cB - cT);
        this._hoverChartPoint = {
          time: t,
          x: clampedX,
          y: y,
          title: `Tijd: ${timeStr}`,
          val1: `Verbruik: ${Math.round(closest.mean)} W`
        };
      }
    } else if (this._activeDetailView === 'battery') {
      if (this._batteryChartMode === 'kwh') {
        const data = this._aggregateHistory5Min('sensor.thuisbatterij_percentage', startTime, endTime);
        if (data.length > 0) {
          const closest = data.reduce((prev, curr) => Math.abs(curr.time - t) < Math.abs(prev.time - t) ? curr : prev, data[0]);
          const y = cB - (Math.min(100, Math.max(0, closest.mean)) / 100) * (cB - cT);
          const kwh = ((closest.mean / 100) * batCapacity).toFixed(1);
          this._hoverChartPoint = {
            time: t,
            x: clampedX,
            y: y,
            title: `Tijd: ${timeStr}`,
            val1: `${kwh} kWh (${Math.round(closest.mean)}%)`
          };
        }
      } else {
        const data = this._aggregateHistory5Min('sensor.thuisbatterij_vermogen', startTime, endTime);
        if (data.length > 0) {
          const closest = data.reduce((prev, curr) => Math.abs(curr.time - t) < Math.abs(prev.time - t) ? curr : prev, data[0]);
          const maxAbs = Math.max(1000, ...data.map(d => Math.max(Math.abs(d.max), Math.abs(d.min))));
          const yZero = cT + (cB - cT) / 2;
          const y = yZero - (closest.mean / maxAbs) * ((cB - cT) / 2);
          this._hoverChartPoint = {
            time: t,
            x: clampedX,
            y: y,
            title: `Tijd: ${timeStr}`,
            val1: closest.mean >= 0 ? `Laden: +${Math.round(closest.mean)} W` : `Ontladen: -${Math.round(Math.abs(closest.mean))} W`
          };
        }
      }
    } else if (this._activeDetailView === 'grid') {
      const data = this._aggregateHistory5Min('sensor.p1_meter_power', startTime, endTime);
      if (data.length > 0) {
        const closest = data.reduce((prev, curr) => Math.abs(curr.time - t) < Math.abs(prev.time - t) ? curr : prev, data[0]);
        const maxAbs = Math.max(1000, ...data.map(d => Math.max(Math.abs(d.max), Math.abs(d.min))));
        const yZero = cT + (cB - cT) / 2;
        const y = yZero - (closest.mean / maxAbs) * ((cB - cT) / 2);
        this._hoverChartPoint = {
          time: t,
          x: clampedX,
          y: y,
          title: `Tijd: ${timeStr}`,
          val1: closest.mean >= 0 ? `Afname: +${Math.round(closest.mean)} W` : `Terug: -${Math.round(Math.abs(closest.mean))} W`
        };
      }
    }
  }


  private _openMoreInfo(entityId: string): void {
    const event = new CustomEvent('hass-more-info', {
      bubbles: true,
      composed: true,
      detail: { entityId }
    });
    this.dispatchEvent(event);
  }

  public getCardSize(): number {
    return 8;
  }
}

if (!customElements.get('energy-dashboard-card')) {
  customElements.define('energy-dashboard-card', EnergyDashboardCard);
}
