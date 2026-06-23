import { LitElement, html, svg, TemplateResult } from 'lit';
import { property, state } from 'lit/decorators.js';
import { HomeAssistant, EnergyFlowCardConfig } from './types';
import { styles } from './styles';
import { renderHouseSvg, getSkyState } from './components/house-svg';

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

function getWeatherIconSvg(condition: string, isNight: boolean = false, size: number = 20): TemplateResult {
  let cond = condition;
  if (isNight && condition === 'sunny') {
    cond = 'clear-night';
  }

  switch (cond) {
    case 'sunny':
      return html`
        <svg class="weather-icon" width="${size}" height="${size}" viewBox="0 0 24 24" style="width: ${size}px !important; height: ${size}px !important; flex-shrink: 0; display: block; margin: 0 auto;">
          <circle cx="12" cy="12" r="5" fill="#f59e0b" />
          <g stroke="#f59e0b" stroke-width="2" stroke-linecap="round">
            <line x1="12" y1="3" x2="12" y2="5" />
            <line x1="12" y1="19" x2="12" y2="21" />
            <line x1="3" y1="12" x2="5" y2="12" />
            <line x1="19" y1="12" x2="21" y2="12" />
            <line x1="5.6" y1="5.6" x2="7" y2="7" />
            <line x1="17" y1="17" x2="18.4" y2="18.4" />
            <line x1="5.6" y1="18.4" x2="7" y2="17" />
            <line x1="17" y1="7" x2="18.4" y2="5.6" />
          </g>
        </svg>
      `;
    case 'clear-night':
      return html`
        <svg class="weather-icon" width="${size}" height="${size}" viewBox="0 0 24 24" style="width: ${size}px !important; height: ${size}px !important; flex-shrink: 0; display: block; margin: 0 auto;">
          <path d="M12 3a9 9 0 1 0 9 9 9.75 9.75 0 0 1-9-9Z" fill="#fbbf24" stroke="#d97706" stroke-width="0.5" />
          <path d="M18 4v2m-1-1h2" stroke="#ffffff" stroke-width="0.8" stroke-linecap="round" />
        </svg>
      `;
    case 'cloudy':
      return html`
        <svg class="weather-icon" width="${size}" height="${size}" viewBox="0 0 24 24" style="width: ${size}px !important; height: ${size}px !important; flex-shrink: 0; display: block; margin: 0 auto;">
          <path d="M6 18a4 4 0 0 1-1-7.87 6 6 0 0 1 11.75-1.68 4.5 4.5 0 0 1 3.25 8.55Z" fill="#64748b" />
          <path d="M4 19a3 3 0 0 1-.75-5.9 4.5 4.5 0 0 1 8.81-1.26 3.38 3.38 0 0 1 2.44 6.41Z" fill="#94a3b8" opacity="0.85" transform="translate(-2, 1)" />
        </svg>
      `;
    case 'partlycloudy':
      if (isNight) {
        return html`
          <svg class="weather-icon" width="${size}" height="${size}" viewBox="0 0 24 24" style="width: ${size}px !important; height: ${size}px !important; flex-shrink: 0; display: block; margin: 0 auto;">
            <g transform="translate(1, -2)">
              <path d="M11 4a7 7 0 1 0 7 7 7.6 7.6 0 0 1-7-7Z" fill="#fbbf24" opacity="0.8" />
            </g>
            <path d="M6 18a3.5 3.5 0 0 1-.87-6.88 5 5 0 0 1 9.8-1.4 3.75 3.75 0 0 1 2.7 7.13Z" fill="#64748b" />
          </svg>
        `;
      }
      return html`
        <svg class="weather-icon" width="${size}" height="${size}" viewBox="0 0 24 24" style="width: ${size}px !important; height: ${size}px !important; flex-shrink: 0; display: block; margin: 0 auto;">
          <g transform="translate(-2, -2)">
            <circle cx="11" cy="11" r="4.5" fill="#fbbf24" />
            <g stroke="#fbbf24" stroke-width="1.5" stroke-linecap="round">
              <line x1="11" y1="3" x2="11" y2="4.5" />
              <line x1="11" y1="17.5" x2="11" y2="19" />
              <line x1="3" y1="11" x2="4.5" y2="11" />
              <line x1="17.5" y1="11" x2="19" y2="11" />
            </g>
          </g>
          <path d="M8 18a3.5 3.5 0 0 1-.87-6.88 5 5 0 0 1 9.8-1.4 3.75 3.75 0 0 1 2.7 7.13Z" fill="#cbd5e1" stroke="#cbd5e1" stroke-width="0.5" />
        </svg>
      `;
    case 'rainy':
    case 'pouring':
      if (isNight) {
        return html`
          <svg class="weather-icon" width="${size}" height="${size}" viewBox="0 0 24 24" style="width: ${size}px !important; height: ${size}px !important; flex-shrink: 0; display: block; margin: 0 auto;">
            <g transform="translate(1, -2)">
              <path d="M11 4a7 7 0 1 0 7 7 7.6 7.6 0 0 1-7-7Z" fill="#fbbf24" opacity="0.6" />
            </g>
            <path d="M6 15a3.5 3.5 0 0 1-.87-6.88 5 5 0 0 1 9.8-1.4 3.75 3.75 0 0 1 2.7 7.13Z" fill="#334155" />
            <g stroke="#60a5fa" stroke-width="1.8" stroke-linecap="round">
              <line x1="6" y1="17" x2="5" y2="20" />
              <line x1="10" y1="18" x2="9" y2="21" />
              <line x1="14" y1="17" x2="13" y2="20" />
            </g>
          </svg>
        `;
      }
      return html`
        <svg class="weather-icon" width="${size}" height="${size}" viewBox="0 0 24 24" style="width: ${size}px !important; height: ${size}px !important; flex-shrink: 0; display: block; margin: 0 auto;">
          <path d="M8 15a3.5 3.5 0 0 1-.87-6.88 5 5 0 0 1 9.8-1.4 3.75 3.75 0 0 1 2.7 7.13Z" fill="#475569" />
          <g stroke="#60a5fa" stroke-width="1.8" stroke-linecap="round">
            <line x1="8" y1="17" x2="7" y2="20" />
            <line x1="12" y1="18" x2="11" y2="21" />
            <line x1="16" y1="17" x2="15" y2="20" />
          </g>
        </svg>
      `;
    case 'lightning':
    case 'lightning-rainy':
      if (isNight) {
        return html`
          <svg class="weather-icon" width="${size}" height="${size}" viewBox="0 0 24 24" style="width: ${size}px !important; height: ${size}px !important; flex-shrink: 0; display: block; margin: 0 auto;">
            <g transform="translate(1, -2)">
              <path d="M11 4a7 7 0 1 0 7 7 7.6 7.6 0 0 1-7-7Z" fill="#fbbf24" opacity="0.5" />
            </g>
            <path d="M6 15a3.5 3.5 0 0 1-.87-6.88 5 5 0 0 1 9.8-1.4 3.75 3.75 0 0 1 2.7 7.13Z" fill="#1e293b" />
            <polygon points="10,14 7,18 9.5,18 8,22 13,17 10.5,17" fill="#fbbf24" stroke="#d97706" stroke-width="0.5" />
            <g stroke="#60a5fa" stroke-width="1.5" stroke-linecap="round">
              <line x1="5" y1="16" x2="4" y2="19" />
              <line x1="15" y1="16" x2="14" y2="19" />
            </g>
          </svg>
        `;
      }
      return html`
        <svg class="weather-icon" width="${size}" height="${size}" viewBox="0 0 24 24" style="width: ${size}px !important; height: ${size}px !important; flex-shrink: 0; display: block; margin: 0 auto;">
          <path d="M8 15a3.5 3.5 0 0 1-.87-6.88 5 5 0 0 1 9.8-1.4 3.75 3.75 0 0 1 2.7 7.13Z" fill="#334155" />
          <polygon points="12,14 9,18 11.5,18 10,22 15,17 12.5,17" fill="#fbbf24" stroke="#d97706" stroke-width="0.5" />
          <g stroke="#60a5fa" stroke-width="1.5" stroke-linecap="round">
            <line x1="7" y1="16" x2="6" y2="19" />
            <line x1="17" y1="16" x2="16" y2="19" />
          </g>
        </svg>
      `;
    case 'snowy':
    case 'snowy-rainy':
    case 'hail':
      if (isNight) {
        return html`
          <svg class="weather-icon" width="${size}" height="${size}" viewBox="0 0 24 24" style="width: ${size}px !important; height: ${size}px !important; flex-shrink: 0; display: block; margin: 0 auto;">
            <g transform="translate(1, -2)">
              <path d="M11 4a7 7 0 1 0 7 7 7.6 7.6 0 0 1-7-7Z" fill="#fbbf24" opacity="0.5" />
            </g>
            <path d="M6 15a3.5 3.5 0 0 1-.87-6.88 5 5 0 0 1 9.8-1.4 3.75 3.75 0 0 1 2.7 7.13Z" fill="#334155" />
            <circle cx="6" cy="18" r="1.2" fill="#ffffff" />
            <circle cx="10" cy="19" r="1.2" fill="#ffffff" />
            <circle cx="14" cy="18" r="1.2" fill="#ffffff" />
          </svg>
        `;
      }
      return html`
        <svg class="weather-icon" width="${size}" height="${size}" viewBox="0 0 24 24" style="width: ${size}px !important; height: ${size}px !important; flex-shrink: 0; display: block; margin: 0 auto;">
          <path d="M8 15a3.5 3.5 0 0 1-.87-6.88 5 5 0 0 1 9.8-1.4 3.75 3.75 0 0 1 2.7 7.13Z" fill="#64748b" />
          <circle cx="8" cy="18" r="1.2" fill="#ffffff" />
          <circle cx="12" cy="19" r="1.2" fill="#ffffff" />
          <circle cx="16" cy="18" r="1.2" fill="#ffffff" />
        </svg>
      `;
    case 'windy':
    case 'windy-variant':
      return html`
        <svg class="weather-icon" width="${size}" height="${size}" viewBox="0 0 24 24" style="width: ${size}px !important; height: ${size}px !important; flex-shrink: 0; display: block; margin: 0 auto;">
          <g stroke="#cbd5e1" stroke-width="2" stroke-linecap="round" fill="none">
            <path d="M4 8h12a2 2 0 1 0-2-2" />
            <path d="M2 12h17a2.5 2.5 0 1 1-2.5 2.5" />
            <path d="M6 16h8a1.5 1.5 0 1 0-1.5-1.5" />
          </g>
        </svg>
      `;
    case 'fog':
      return html`
        <svg class="weather-icon" width="${size}" height="${size}" viewBox="0 0 24 24" style="width: ${size}px !important; height: ${size}px !important; flex-shrink: 0; display: block; margin: 0 auto;">
          <path d="M8 13a3.5 3.5 0 0 1-.87-6.88 5 5 0 0 1 9.8-1.4 3.75 3.75 0 0 1 2.7 7.13Z" fill="#94a3b8" opacity="0.7" />
          <g stroke="#cbd5e1" stroke-width="1.8" stroke-linecap="round">
            <line x1="4" y1="16" x2="20" y2="16" />
            <line x1="6" y1="19" x2="18" y2="19" />
          </g>
        </svg>
      `;
    default:
      return html`
        <svg class="weather-icon" width="${size}" height="${size}" viewBox="0 0 24 24" style="width: ${size}px !important; height: ${size}px !important; flex-shrink: 0; display: block; margin: 0 auto;">
          <circle cx="12" cy="12" r="8" fill="#fbbf24" />
        </svg>
      `;
  }
}

export class EnergyFlowCard extends LitElement {
  @property({ attribute: false }) public hass?: HomeAssistant;
  @state() private config?: EnergyFlowCardConfig;
  @state() private selectedNode: string | null = null;
  @state() private cardWidth: number = 800;
  @state() private cardHeight: number = 600;
  @state() protected hasActiveHash: boolean = false;
  @state() private activePopup: string | null = null;
  @state() protected activePopupHistory: { day: string; value: number }[] = [];
  @state() private isLoadingHistory: boolean = false;
  @state() private activeTab: 'prices' | 'day' | 'month' | 'year' = 'day';
  @state() private statsData: Record<string, any[]> = {};
  @state() private weatherForecast: any[] = [];
  @state() private hoveredPoint: any = null;
  @state() private debugWeatherState: string | null = null;
  @state() private debugTimeHour: number | null = null;
  @state() private debugWindSpeed: number | null = null;
  @state() private debugRainIntensity: 'light' | 'normal' | 'heavy' | null = null;
  @state() private debugTemperature: number | null = null;
  @state() private debugBatteryPower: number | null = null;
  @state() private debugBatterySoc: number | null = null;
  @state() private debugEVPower: number | null = null;
  @state() private debugShowBattery: boolean | null = null;
  @state() private debugShowEV: boolean | null = null;
  @state() private debugPoolPumpActive: boolean | null = null;
  @state() private _weatherTestPanelOpen: boolean = false;

  private resizeObserver?: ResizeObserver;
  private clouds: any[] = [];
  private lastWeather: string = '';

  public connectedCallback(): void {
    super.connectedCallback();
    this.resizeObserver = new ResizeObserver((entries) => {
      for (const entry of entries) {
        const { width, height } = entry.contentRect;
        this.cardWidth = width || 800;
        this.cardHeight = height || 600;
      }
    });
    this.resizeObserver.observe(this);
    window.addEventListener('hashchange', this.handleHashChange);
    this.handleHashChange();
  }

  public disconnectedCallback(): void {
    if (this.resizeObserver) {
      this.resizeObserver.disconnect();
    }
    window.removeEventListener('hashchange', this.handleHashChange);
    this.restoreSidebarAndHeader();
    super.disconnectedCallback();
  }

  protected updated(changedProperties: Map<string | number | symbol, unknown>): void {
    super.updated(changedProperties);
    this.hideSidebarAndHeader();
  }

  private hideSidebarAndHeader(): void {
    if (!this.config?.screensaver) return;
    try {
      const doc = document;
      const homeAssistant = doc.querySelector('home-assistant');
      if (!homeAssistant) return;
      const main = homeAssistant.shadowRoot?.querySelector('home-assistant-main');
      if (!main) return;
      const mainShadow = main.shadowRoot;
      if (!mainShadow) return;

      const sidebar = mainShadow.querySelector('ha-sidebar');
      if (sidebar) {
        (sidebar as HTMLElement).style.width = '0px';
        (sidebar as HTMLElement).style.display = 'none';
      }

      const contentContainer = mainShadow.querySelector('.content');
      if (contentContainer) {
        (contentContainer as HTMLElement).style.paddingLeft = '0px';
        (contentContainer as HTMLElement).style.marginLeft = '0px';
      }

      const partialResolver = mainShadow.querySelector('partial-panel-resolver');
      const lovelace = partialResolver?.querySelector('ha-panel-lovelace');
      const huiRoot = lovelace?.shadowRoot?.querySelector('hui-root');
      if (huiRoot) {
        const header = huiRoot.shadowRoot?.querySelector('.header') || huiRoot.shadowRoot?.querySelector('app-header');
        if (header) {
          (header as HTMLElement).style.display = 'none';
          (header as HTMLElement).style.height = '0px';
        }
        const mainContainer = huiRoot.shadowRoot?.querySelector('#view');
        if (mainContainer) {
          (mainContainer as HTMLElement).style.paddingTop = '0px';
          (mainContainer as HTMLElement).style.marginTop = '0px';
        }
      }
    } catch (e) {
      console.warn('[energy-flow-card] Failed to hide sidebar/header via JS:', e);
    }
  }

  private restoreSidebarAndHeader(): void {
    try {
      const doc = document;
      const homeAssistant = doc.querySelector('home-assistant');
      if (!homeAssistant) return;
      const main = homeAssistant.shadowRoot?.querySelector('home-assistant-main');
      if (!main) return;
      const mainShadow = main.shadowRoot;
      if (!mainShadow) return;

      const sidebar = mainShadow.querySelector('ha-sidebar');
      if (sidebar) {
        (sidebar as HTMLElement).style.width = '';
        (sidebar as HTMLElement).style.display = '';
      }

      const contentContainer = mainShadow.querySelector('.content');
      if (contentContainer) {
        (contentContainer as HTMLElement).style.paddingLeft = '';
        (contentContainer as HTMLElement).style.marginLeft = '';
      }

      const partialResolver = mainShadow.querySelector('partial-panel-resolver');
      const lovelace = partialResolver?.querySelector('ha-panel-lovelace');
      const huiRoot = lovelace?.shadowRoot?.querySelector('hui-root');
      if (huiRoot) {
        const header = huiRoot.shadowRoot?.querySelector('.header') || huiRoot.shadowRoot?.querySelector('app-header');
        if (header) {
          (header as HTMLElement).style.display = '';
          (header as HTMLElement).style.height = '';
        }
        const mainContainer = huiRoot.shadowRoot?.querySelector('#view');
        if (mainContainer) {
          (mainContainer as HTMLElement).style.paddingTop = '';
          (mainContainer as HTMLElement).style.marginTop = '';
        }
      }
    } catch (e) {
      console.warn('[energy-flow-card] Failed to restore sidebar/header via JS:', e);
    }
  }

  private handleHashChange = () => {
    const hash = window.location.hash;
    this.hasActiveHash = hash !== '' && hash !== '#';
  };

  private async fetchStatsData(entityIds: string[]): Promise<void> {
    if (!this.hass) return;
    this.isLoadingHistory = true;
    try {
      const now = new Date();
      const startTime = new Date(now.getTime() - 365 * 24 * 60 * 60 * 1000).toISOString();
      const res = await (this.hass as any).callWS({
        type: 'recorder/statistics_during_period',
        start_time: startTime,
        statistic_ids: entityIds,
        period: 'day'
      });
      this.statsData = res || {};
    } catch (e) {
      console.warn('[energy-flow-card] Failed to fetch stats via WS:', e);
      this.statsData = {};
    } finally {
      this.isLoadingHistory = false;
    }
  }

  private getStatPointValue(point: any, entityId: string): number {
    if (!point) return 0;
    const isCumulative = !entityId.includes('vandaag') && !entityId.includes('today');
    if (isCumulative && point.change !== undefined && point.change !== null) {
      return point.change;
    }
    return point.state || 0;
  }

  private getProcessedSingleData(entityId: string): { label: string; value: number }[] {
    const raw = this.statsData[entityId] || [];
    if (this.activeTab === 'day') {
      return raw.slice(-30).map(point => {
        const date = new Date(point.start);
        return {
          label: date.toLocaleDateString('nl-NL', { day: 'numeric', month: 'short' }),
          value: this.getStatPointValue(point, entityId)
        };
      });
    } else if (this.activeTab === 'month') {
      const monthlyGroups: Record<string, { label: string; sum: number }> = {};
      raw.forEach(point => {
        const date = new Date(point.start);
        const year = date.getFullYear();
        const month = date.getMonth();
        const monthKey = `${year}-${month.toString().padStart(2, '0')}`;
        const monthLabel = date.toLocaleDateString('nl-NL', { month: 'short' });
        if (!monthlyGroups[monthKey]) {
          monthlyGroups[monthKey] = { label: monthLabel, sum: 0 };
        }
        monthlyGroups[monthKey].sum += this.getStatPointValue(point, entityId);
      });
      return Object.keys(monthlyGroups)
        .sort()
        .slice(-12)
        .map(key => ({
          label: monthlyGroups[key].label,
          value: monthlyGroups[key].sum
        }));
    } else {
      const yearlyGroups: Record<string, number> = {};
      raw.forEach(point => {
        const date = new Date(point.start);
        const year = date.getFullYear().toString();
        if (!yearlyGroups[year]) {
          yearlyGroups[year] = 0;
        }
        yearlyGroups[year] += this.getStatPointValue(point, entityId);
      });
      return Object.keys(yearlyGroups)
        .sort()
        .map(year => ({
          label: year,
          value: yearlyGroups[year]
        }));
    }
  }

  private getProcessedGridData(importEntity: string, exportEntity: string): { label: string; importValue: number; exportValue: number }[] {
    const importRaw = this.statsData[importEntity] || [];
    const exportRaw = this.statsData[exportEntity] || [];

    const importMap = new Map<string, number>();
    const exportMap = new Map<string, number>();

    importRaw.forEach(p => {
      importMap.set(new Date(p.start).toDateString(), this.getStatPointValue(p, importEntity));
    });
    exportRaw.forEach(p => {
      exportMap.set(new Date(p.start).toDateString(), this.getStatPointValue(p, exportEntity));
    });

    const allStarts = new Set<string>();
    importRaw.forEach(p => allStarts.add(p.start));
    exportRaw.forEach(p => allStarts.add(p.start));

    const sortedStarts = Array.from(allStarts).sort((a, b) => new Date(a).getTime() - new Date(b).getTime());

    if (this.activeTab === 'day') {
      return sortedStarts.slice(-30).map(startStr => {
        const date = new Date(startStr);
        const dateKey = date.toDateString();
        return {
          label: date.toLocaleDateString('nl-NL', { day: 'numeric', month: 'short' }),
          importValue: importMap.get(dateKey) || 0,
          exportValue: exportMap.get(dateKey) || 0
        };
      });
    } else if (this.activeTab === 'month') {
      const monthlyGroups: Record<string, { label: string; importSum: number; exportSum: number }> = {};
      sortedStarts.forEach(startStr => {
        const date = new Date(startStr);
        const year = date.getFullYear();
        const month = date.getMonth();
        const monthKey = `${year}-${month.toString().padStart(2, '0')}`;
        const monthLabel = date.toLocaleDateString('nl-NL', { month: 'short' });
        const dateKey = date.toDateString();
        
        if (!monthlyGroups[monthKey]) {
          monthlyGroups[monthKey] = { label: monthLabel, importSum: 0, exportSum: 0 };
        }
        monthlyGroups[monthKey].importSum += importMap.get(dateKey) || 0;
        monthlyGroups[monthKey].exportSum += exportMap.get(dateKey) || 0;
      });

      return Object.keys(monthlyGroups)
        .sort()
        .slice(-12)
        .map(key => ({
          label: monthlyGroups[key].label,
          importValue: monthlyGroups[key].importSum,
          exportValue: monthlyGroups[key].exportSum
        }));
    } else {
      const yearlyGroups: Record<string, { importSum: number; exportSum: number }> = {};
      sortedStarts.forEach(startStr => {
        const date = new Date(startStr);
        const year = date.getFullYear().toString();
        const dateKey = date.toDateString();

        if (!yearlyGroups[year]) {
          yearlyGroups[year] = { importSum: 0, exportSum: 0 };
        }
        yearlyGroups[year].importSum += importMap.get(dateKey) || 0;
        yearlyGroups[year].exportSum += exportMap.get(dateKey) || 0;
      });

      return Object.keys(yearlyGroups)
        .sort()
        .map(year => ({
          label: year,
          importValue: yearlyGroups[year].importSum,
          exportValue: yearlyGroups[year].exportSum
        }));
    }
  }

  private parseEntityFloat(entId?: string): number | null {
    if (!entId || !this.hass) return null;
    const entity = this.hass.states[entId];
    if (!entity) return null;
    const v = parseFloat(entity.state);
    return isNaN(v) ? null : v;
  }

  private closePopup(e?: Event): void {
    if (e) {
      e.stopPropagation();
    }
    this.activePopup = null;
    this.activePopupHistory = [];
    this.statsData = {};
  }

  private renderPopup(): TemplateResult | string {
    if (!this.activePopup) return '';
    
    let title = '';
    let subtitle = '';
    let stat1Label = '';
    let stat1Val = '';
    let stat2Label = '';
    let stat2Val = '';
    let hasSecondStat = false;
    let chartHtml: TemplateResult | string = '';
    let canShowCost = false;
    let totalImport = 0;
    let totalExport = 0;
    let totalImportCost = 0;
    let totalExportCost = 0;
    let costTodayImport: number | null = null;
    let costTodayExport: number | null = null;

    const entities = this.config?.entities;
    if (!entities) return '';

    if (this.activePopup === 'weather') {
      const weatherEntity = entities.weather ? this.hass?.states[entities.weather] : null;
      if (!weatherEntity) return '';
      
      const state = weatherEntity.state;
      const temp = weatherEntity.attributes.temperature;
      const apparentTemp = weatherEntity.attributes.apparent_temperature;
      const windSpeed = weatherEntity.attributes.wind_speed;
      const humidity = weatherEntity.attributes.humidity;
      
      // Fallback pressure detection
      let pressure = weatherEntity.attributes.pressure;
      if (pressure === undefined || pressure === null) {
        const fallbackEntity = Object.values(this.hass?.states || {}).find(
          ent => ent.entity_id.startsWith('weather.') && ent.attributes.pressure !== undefined && ent.attributes.pressure !== null
        );
        if (fallbackEntity) {
          pressure = fallbackEntity.attributes.pressure;
        }
      }
      
      const friendlyName = weatherEntity.attributes.friendly_name || 'Weer';
      const condTranslated = WEATHER_TRANSLATIONS[state] || state;
      
      return html`
        <div class="glass-popup-overlay" @click=${this.closePopup}>
          <div class="glass-popup-card" style="height: auto;" @click=${(e: Event) => e.stopPropagation()}>
            <button class="glass-popup-close" @click=${this.closePopup}>&times;</button>
            
            <div class="glass-popup-header" style="margin-bottom: 20px;">
              <div class="glass-popup-title">${friendlyName}</div>
              <div class="glass-popup-subtitle">Actuele weersinformatie voor jouw locatie</div>
            </div>
 
            <div class="glass-popup-stats" style="grid-template-columns: 1fr 1fr; gap: 12px; margin-bottom: 20px;">
              <div class="glass-popup-stat" style="grid-column: span 2; display: flex; flex-direction: row; align-items: center; justify-content: space-between; padding: 16px 20px; background: rgba(255,255,255,0.03); border: 1px solid rgba(255,255,255,0.06);">
                <div style="display: flex; align-items: center; gap: 14px;">
                  <div style="background: rgba(255,255,255,0.05); border-radius: 50%; padding: 6px; display: flex; align-items: center; justify-content: center;">
                    ${getWeatherIconSvg(state, false, 36)}
                  </div>
                  <div style="display: flex; flex-direction: column; align-items: flex-start;">
                    <span class="stat-label" style="font-size: 11px; margin-bottom: 2px; color: rgba(255,255,255,0.5);">Conditie</span>
                    <span class="stat-value" style="font-size: 18px; color: #fbbf24; text-transform: capitalize; font-weight: 600; line-height: 1.2;">${condTranslated}</span>
                  </div>
                </div>
                <div style="display: flex; align-items: center; gap: 14px;">
                  <div style="display: flex; flex-direction: column; align-items: flex-end;">
                    <span class="stat-label" style="font-size: 11px; margin-bottom: 2px; color: rgba(255,255,255,0.5);">Temperatuur</span>
                    <span class="stat-value" style="font-size: 24px; color: #ffffff; font-weight: 600; line-height: 1.2;">${temp !== undefined ? `${temp} °C` : '—'}</span>
                  </div>
                  <div style="background: rgba(255,50,50,0.1); border-radius: 50%; padding: 8px; display: flex; align-items: center; justify-content: center;">
                    <ha-icon icon="mdi:thermometer" style="--mdc-icon-size: 30px; width: 30px; height: 30px; color: #ff5252;"></ha-icon>
                  </div>
                </div>
              </div>
 
              <div class="glass-popup-stat" style="display: flex; align-items: center; gap: 12px; padding: 12px; background: rgba(255,255,255,0.02); border: 1px solid rgba(255,255,255,0.04);">
                <div style="background: rgba(255,255,255,0.04); border-radius: 8px; padding: 6px; display: flex; align-items: center; justify-content: center;">
                  <ha-icon icon="mdi:thermometer" style="--mdc-icon-size: 20px; width: 20px; height: 20px; color: #ff9f43;"></ha-icon>
                </div>
                <div style="display: flex; flex-direction: column; align-items: flex-start;">
                  <span class="stat-label" style="font-size: 11px; margin-bottom: 2px;">Gevoelstemp.</span>
                  <span class="stat-value" style="font-size: 15px; color: #cbd5e1; font-weight: 500;">${apparentTemp !== undefined ? `${apparentTemp} °C` : '—'}</span>
                </div>
              </div>
 
              <div class="glass-popup-stat" style="display: flex; align-items: center; gap: 12px; padding: 12px; background: rgba(255,255,255,0.02); border: 1px solid rgba(255,255,255,0.04);">
                <div style="background: rgba(255,255,255,0.04); border-radius: 8px; padding: 6px; display: flex; align-items: center; justify-content: center;">
                  <ha-icon icon="mdi:weather-windy" style="--mdc-icon-size: 20px; width: 20px; height: 20px; color: #60a5fa;"></ha-icon>
                </div>
                <div style="display: flex; flex-direction: column; align-items: flex-start;">
                  <span class="stat-label" style="font-size: 11px; margin-bottom: 2px;">Windsnelheid</span>
                  <span class="stat-value" style="font-size: 15px; color: #cbd5e1; font-weight: 500;">${windSpeed !== undefined ? `${windSpeed} km/h` : '—'}</span>
                </div>
              </div>
 
              <div class="glass-popup-stat" style="display: flex; align-items: center; gap: 12px; padding: 12px; background: rgba(255,255,255,0.02); border: 1px solid rgba(255,255,255,0.04);">
                <div style="background: rgba(255,255,255,0.04); border-radius: 8px; padding: 6px; display: flex; align-items: center; justify-content: center;">
                  <ha-icon icon="mdi:water-percent" style="--mdc-icon-size: 20px; width: 20px; height: 20px; color: #26c6da;"></ha-icon>
                </div>
                <div style="display: flex; flex-direction: column; align-items: flex-start;">
                  <span class="stat-label" style="font-size: 11px; margin-bottom: 2px;">Vochtigheid</span>
                  <span class="stat-value" style="font-size: 15px; color: #cbd5e1; font-weight: 500;">${humidity !== undefined ? `${humidity}%` : '—'}</span>
                </div>
              </div>
 
              <div class="glass-popup-stat" style="display: flex; align-items: center; gap: 12px; padding: 12px; background: rgba(255,255,255,0.02); border: 1px solid rgba(255,255,255,0.04);">
                <div style="background: rgba(255,255,255,0.04); border-radius: 8px; padding: 6px; display: flex; align-items: center; justify-content: center;">
                  <ha-icon icon="mdi:gauge" style="--mdc-icon-size: 20px; width: 20px; height: 20px; color: #26a69a;"></ha-icon>
                </div>
                <div style="display: flex; flex-direction: column; align-items: flex-start;">
                  <span class="stat-label" style="font-size: 11px; margin-bottom: 2px;">Luchtdruk</span>
                  <span class="stat-value" style="font-size: 15px; color: #cbd5e1; font-weight: 500;">${pressure !== undefined ? `${pressure} hPa` : '—'}</span>
                </div>
              </div>
            </div>

            <div class="glass-popup-forecast-section" style="margin-top: 16px; padding: 12px; background: rgba(255,255,255,0.02); border-radius: 12px; border: 1px solid rgba(255,255,255,0.04); box-sizing: border-box;">
              <div class="chart-title" style="margin-bottom: 8px; font-size: 11px; font-weight: bold; color: rgba(255,255,255,0.6); text-transform: uppercase;">Weersverwachting</div>
              <div style="display: flex; justify-content: space-between; gap: 6px;">
                ${this.weatherForecast && this.weatherForecast.length > 0 ? this.weatherForecast.slice(0, 5).map(day => {
                  const date = new Date(day.datetime);
                  const dayLabel = date.toLocaleDateString('nl-NL', { weekday: 'short' });
                  const precip = day.precipitation !== undefined ? day.precipitation : 0;
                  
                  return html`
                    <div style="flex: 1; background: rgba(255,255,255,0.03); border: 1px solid rgba(255,255,255,0.05); border-radius: 8px; padding: 6px 2px; text-align: center; display: flex; flex-direction: column; align-items: center; min-width: 0; gap: 4px;">
                      <span style="font-size: 11px; font-weight: bold; text-transform: uppercase; color: rgba(255,255,255,0.5);">${dayLabel}</span>
                      
                      <!-- Iconen (Dag & Nacht naast elkaar) -->
                      <div style="display: flex; justify-content: center; gap: 4px; align-items: center; width: 100%;">
                        ${getWeatherIconSvg(day.condition, false, 14)}
                        ${getWeatherIconSvg(day.condition, true, 14)}
                      </div>
 
                      <!-- Temperaturen (Max & Min daaronder) -->
                      <div style="display: flex; justify-content: center; gap: 3px; align-items: baseline; font-size: 12px;">
                        <span style="font-weight: bold; color: #ffffff;">${day.temperature}°</span>
                        <span style="color: rgba(255,255,255,0.3); font-size: 11px;">/</span>
                        <span style="color: rgba(255,255,255,0.5); font-size: 11px;">${day.templow !== undefined ? `${day.templow}°` : '—'}</span>
                      </div>
 
                      <!-- Regen -->
                      ${precip > 0 ? html`
                        <span style="font-size: 9px; color: #60a5fa; display: flex; align-items: center; gap: 2px; justify-content: center; width: 100%;">
                          <ha-icon icon="mdi:water" style="--mdc-icon-size: 10px; width: 10px; height: 10px; flex-shrink: 0; color: #60a5fa;"></ha-icon>
                          <span style="white-space: nowrap;">${precip} mm</span>
                        </span>
                      ` : html`<div style="height: 8px;"></div>`}
                    </div>
                  `;
                }) : html`
                  <div style="flex: 1; text-align: center; color: rgba(255,255,255,0.4); font-size: 13px; padding: 12px 0;">
                    Geen weersverwachting beschikbaar.
                  </div>
                `}
              </div>
            </div>

          </div>
        </div>
      `;
    }

    const grid = this.getEntityValue(entities.grid || (entities as any).grid_power);
    const gridImportToday = this.parseEntityFloat(entities.grid_import_today);
    const gridExportToday = this.parseEntityFloat(entities.grid_export_today);

    // Values to display
    if (this.activePopup === 'solar') {
      title = 'Zonnepanelen';
      subtitle = 'Productie & Historie';
      const solar = this.getEntityValue(entities.solar || (entities as any).solar_power);
      const solarToday = this.parseEntityFloat(entities.solar_energy_today || (entities as any).solar_today);
      
      stat1Label = 'Huidig vermogen';
      stat1Val = solar >= 20 ? (solar >= 1000 ? `${(solar / 1000).toFixed(1)} kW` : `${Math.round(solar)} W`) : '0 W';
      stat2Label = 'Vandaag opgewekt';
      stat2Val = solarToday !== null ? `${solarToday.toFixed(1)} kWh` : '0 kWh';
      hasSecondStat = true;

      const entityId = entities.solar_energy_today || (entities as any).solar_today;
      if (this.isLoadingHistory) {
        chartHtml = html`<div class="chart-loading">Gegevens laden...</div>`;
      } else if (!entityId || !this.statsData[entityId] || this.statsData[entityId].length === 0) {
        chartHtml = html`<div class="chart-no-data">Geen historische gegevens beschikbaar.</div>`;
      } else {
        const processed = this.getProcessedSingleData(entityId);
        const maxVal = Math.max(...processed.map(i => i.value)) || 1;
        chartHtml = html`
          <div class="scrollable-chart-container">
            <div class="glass-bar-chart">
              ${processed.map(item => {
                const percent = (item.value / maxVal) * 80; // max 80% height
                return html`
                  <div class="chart-column">
                    <div class="chart-bar-wrapper">
                      <div class="chart-bar solar-bar" style="height: ${Math.max(4, percent)}%;">
                        <span class="bar-value">${item.value.toFixed(this.activeTab === 'day' ? 1 : 0)}</span>
                      </div>
                    </div>
                    <span class="chart-label">${item.label}</span>
                  </div>
                `;
              })}
            </div>
          </div>
        `;
      }
    } else if (this.activePopup === 'home') {
      title = 'Huisverbruik';
      subtitle = 'Verbruik & Historie';
      const load = this.getEntityValue(entities.load || (entities as any).home_power);
      const homeToday = this.parseEntityFloat(entities.home_today);
      
      stat1Label = 'Huidig verbruik';
      stat1Val = load >= 1000 ? `${(load / 1000).toFixed(1)} kW` : `${Math.round(load)} W`;
      stat2Label = 'Vandaag verbruikt';
      stat2Val = homeToday !== null ? `${homeToday.toFixed(1)} kWh` : '0 kWh';
      hasSecondStat = true;

      const entityId = entities.home_today;
      if (this.isLoadingHistory) {
        chartHtml = html`<div class="chart-loading">Gegevens laden...</div>`;
      } else if (!entityId || !this.statsData[entityId] || this.statsData[entityId].length === 0) {
        chartHtml = html`<div class="chart-no-data">Geen historische gegevens beschikbaar.</div>`;
      } else {
        const processed = this.getProcessedSingleData(entityId);
        const maxVal = Math.max(...processed.map(i => i.value)) || 1;
        chartHtml = html`
          <div class="scrollable-chart-container">
            <div class="glass-bar-chart">
              ${processed.map(item => {
                const percent = (item.value / maxVal) * 80;
                return html`
                  <div class="chart-column">
                    <div class="chart-bar-wrapper">
                      <div class="chart-bar home-bar" style="height: ${Math.max(4, percent)}%;">
                        <span class="bar-value">${item.value.toFixed(this.activeTab === 'day' ? 1 : 0)}</span>
                      </div>
                    </div>
                    <span class="chart-label">${item.label}</span>
                  </div>
                `;
              })}
            </div>
          </div>
        `;
      }
    } else if (this.activePopup === 'grid') {
      title = 'Stroomnet';
      subtitle = 'Netbelasting & Historie';
      const grid = this.getEntityValue(entities.grid || (entities as any).grid_power);
      const gridImportToday = this.parseEntityFloat(entities.grid_import_today);
      const gridExportToday = this.parseEntityFloat(entities.grid_export_today);

      stat1Label = grid >= 0 ? 'Netto Import (Live)' : 'Netto Export (Live)';
      stat1Val = Math.abs(grid) >= 1000 ? `${(Math.abs(grid) / 1000).toFixed(1)} kW` : `${Math.round(Math.abs(grid))} W`;
      
      stat2Label = 'Import / Export Vandaag';
      stat2Val = `${gridImportToday !== null ? gridImportToday.toFixed(1) : '0'} / ${gridExportToday !== null ? gridExportToday.toFixed(1) : '0'} kWh`;
      hasSecondStat = true;

      let impEntity = entities.grid_import_today;
      let expEntity = entities.grid_export_today;
      if (this.hass?.states['sensor.p1_meter_energy_import'] && this.hass?.states['sensor.p1_meter_energy_export']) {
        impEntity = 'sensor.p1_meter_energy_import';
        expEntity = 'sensor.p1_meter_energy_export';
      }

      let impCostEntity = entities.grid_import_cost;
      let expCostEntity = entities.grid_export_cost;
      if (!impCostEntity && this.hass?.states['sensor.p1_meter_energy_import_cost']) {
        impCostEntity = 'sensor.p1_meter_energy_import_cost';
      }
      if (!expCostEntity && this.hass?.states['sensor.p1_meter_energy_export_compensation']) {
        expCostEntity = 'sensor.p1_meter_energy_export_compensation';
      }
      canShowCost = !!impCostEntity || !!expCostEntity;
      totalImport = 0;
      totalExport = 0;

      if (impCostEntity && this.hass?.states[impCostEntity]) {
        costTodayImport = parseFloat(this.hass.states[impCostEntity].state);
      }
      if (expCostEntity && this.hass?.states[expCostEntity]) {
        costTodayExport = parseFloat(this.hass.states[expCostEntity].state);
      }

      if (this.activeTab === 'prices') {
        const gridPriceState = entities.grid_price ? this.hass?.states[entities.grid_price] : null;
        const forecast = gridPriceState?.attributes?.forecast || [];
        
        if (forecast.length === 0) {
          chartHtml = html`<div class="chart-no-data">Geen prijsinformatie beschikbaar.</div>`;
        } else {
          const nowTime = Date.now();
          let closestIdx = 0;
          let minDiff = Infinity;
          forecast.forEach((entry: any, idx: number) => {
            const diff = Math.abs(new Date(entry.datetime).getTime() - nowTime);
            if (diff < minDiff) {
              minDiff = diff;
              closestIdx = idx;
            }
          });

          const startIndex = Math.max(0, closestIdx - 2);
          const filtered = forecast.slice(startIndex);
          
          const currentHourStart = new Date(forecast[closestIdx].datetime);

          // Calculate Y bounds
          const pricesOnly = filtered.map((entry: any) => parseFloat(entry.electricity_price) / 10000000);
          const maxPriceVal = Math.max(...pricesOnly, 0.40);
          const minPriceVal = Math.min(...pricesOnly, 0.0);
          
          // Next multiples of 0.20
          const maxY = Math.max(0.40, Math.ceil(maxPriceVal * 5) / 5);
          const minY = minPriceVal < 0 ? Math.floor(minPriceVal * 5) / 5 : 0.0;
          const priceRange = maxY - minY;

          // Chart area within 500x190 viewBox
          const chartLeft = 50;
          const chartRight = 485;
          const chartWidth = chartRight - chartLeft;
          const chartTop = 35;
          const chartHeight = 110;
          const chartBottom = chartTop + chartHeight;
          const zeroY = chartBottom - ((0.0 - minY) / priceRange) * chartHeight;

          const step = chartWidth / filtered.length;
          const barWidth = Math.max(4, step - 6);

          // Map points
          const points = filtered.map((entry: any, idx: number) => {
            const date = new Date(entry.datetime);
            const hourLabel = date.toLocaleTimeString('nl-NL', { hour: '2-digit', minute: '2-digit' });
            const priceEur = parseFloat(entry.electricity_price) / 10000000;
            const x = chartLeft + idx * step + step / 2;
            const y = chartBottom - ((priceEur - minY) / priceRange) * chartHeight;
            const isCurrent = date.getTime() === currentHourStart.getTime();

            return {
              x,
              y,
              price: priceEur,
              label: hourLabel,
              isCurrent,
              isNeg: priceEur < 0,
                      datetime: entry.datetime
            };
          });

          const currentPt = points.find((p: any) => p.isCurrent);

          // Large Price Header (Zonneplan 0,54 €/kWh) - Updates dynamically when hovering/touching
          const headerPrice = this.hoveredPoint ? this.hoveredPoint.price : (currentPt ? currentPt.price : (gridPriceState ? parseFloat(gridPriceState.state) : 0));
          const headerPriceFormatted = headerPrice.toFixed(2).replace('.', ',');
          const headerTime = this.hoveredPoint ? `Om ${this.hoveredPoint.label}:` : 'Actueel tarief:';

          // Peak and low elements
          const maxPt = points.reduce((max: any, p: any) => p.price > max.price ? p : max, points[0]);
          const minPt = points.reduce((min: any, p: any) => p.price < min.price ? p : min, points[0]);

          // Grid lines
          const gridLines = [];
          for (let val = minY; val <= maxY + 0.001; val += 0.20) {
            const yLine = chartBottom - ((val - minY) / priceRange) * chartHeight;
            gridLines.push({ val, y: yLine });
          }

          chartHtml = html`
            <div class="zonneplan-header" style="margin-top: 5px; margin-bottom: 5px; padding: 0 10px; display: flex; align-items: baseline; gap: 6px;">
              <span style="font-size: 13px; color: rgba(255,255,255,0.45); font-weight: normal; font-family: sans-serif;">
                ${headerTime}
              </span>
              <span style="font-size: 22px; font-weight: bold; color: #ffffff;">
                ${headerPriceFormatted} <span style="font-size: 13px; font-weight: normal; color: rgba(255,255,255,0.5); vertical-align: middle; margin-left: 2px;">€/kWh</span>
              </span>
            </div>

            <div class="scrollable-chart-container" style="display: block !important; padding-top: 5px; height: 165px; overflow-y: hidden; overflow-x: hidden; position: relative;">
              <svg viewBox="0 0 500 190" style="display: block; width: 100%; height: 155px !important;">
                <defs>
                  <linearGradient id="bar-red" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stop-color="#ef4444" />
                    <stop offset="100%" stop-color="#991b1b" />
                  </linearGradient>
                  <linearGradient id="bar-green" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stop-color="#10b981" />
                    <stop offset="100%" stop-color="#065f46" />
                  </linearGradient>
                  <linearGradient id="bar-yellow" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stop-color="#fbbf24" />
                    <stop offset="100%" stop-color="#b45309" />
                  </linearGradient>
                </defs>

                <!-- Gridlines -->
                ${gridLines.map(g => svg`
                  <line x1="${chartLeft}" y1="${g.y}" x2="${chartRight}" y2="${g.y}" stroke="rgba(255,255,255,0.08)" stroke-width="1" stroke-dasharray="${g.val === 0.0 ? '0' : '2,2'}" />
                  <text x="${chartLeft - 8}" y="${g.y + 3}" text-anchor="end" fill="rgba(255,255,255,0.35)" font-size="9px" font-family="sans-serif">
                    € ${g.val.toFixed(2)}
                  </text>
                `)}

                <!-- Current Time Marker Line -->
                ${currentPt ? svg`
                  <line x1="${currentPt.x}" y1="${chartTop}" x2="${currentPt.x}" y2="${chartBottom}" stroke="rgba(239,68,68,0.4)" stroke-width="1.5" stroke-dasharray="2,2" />
                ` : ''}

                <!-- Bars -->
                ${points.map((p: any) => {
                  const isRed = p.price > 0.30;
                  const isGreen = p.price > 0 && p.price <= 0.30;
                  const gradId = isRed ? 'bar-red' : (isGreen ? 'bar-green' : 'bar-yellow');
                  
                  const isPos = p.price >= 0;
                  const yStart = isPos ? p.y : zeroY;
                  const h = isPos ? Math.max(1.5, zeroY - p.y) : Math.max(1.5, p.y - zeroY);

                  return svg`
                    <g class="chart-point-group">
                      <!-- Bar -->
                      <rect x="${p.x - barWidth / 2}" y="${yStart}" width="${barWidth}" height="${h}" 
                            fill="url(#${gradId})" rx="1.5" ry="1.5"
                            style="opacity: ${p.isCurrent ? 1.0 : 0.82};" />
                      
                      <!-- Native hover title -->
                      <title>${p.label} - € ${p.price.toFixed(3)}/kWh</title>
                    </g>
                  `;
                })}

                <!-- Peak Marker Bubble -->
                ${maxPt && (!this.hoveredPoint || this.hoveredPoint !== maxPt) ? svg`
                  <circle cx="${maxPt.x}" cy="${maxPt.y}" r="5.5" fill="#ef4444" stroke="#ffffff" stroke-width="1.5" />
                  <g>
                    <!-- White background pill -->
                    <rect x="${maxPt.x - 17}" y="${maxPt.y - 23}" width="34" height="13" rx="3.5" ry="3.5" fill="#ffffff" />
                    <!-- Value text -->
                    <text x="${maxPt.x}" y="${maxPt.y - 13}" text-anchor="middle" fill="#0f172a" font-size="8.5px" font-weight="bold" font-family="sans-serif">
                      ${maxPt.price.toFixed(2).replace('.', ',')}
                    </text>
                  </g>
                ` : ''}

                <!-- Dal (Lowest) Marker Bubble -->
                ${minPt && minPt !== maxPt && (!this.hoveredPoint || this.hoveredPoint !== minPt) ? svg`
                  <circle cx="${minPt.x}" cy="${minPt.y}" r="5.5" fill="${minPt.price <= 0.30 ? '#10b981' : '#ef4444'}" stroke="#ffffff" stroke-width="1.5" />
                  <g>
                    <!-- White background pill -->
                    <rect x="${minPt.x - 17}" y="${minPt.price < 0 ? minPt.y + 10 : minPt.y - 23}" width="34" height="13" rx="3.5" ry="3.5" fill="#ffffff" />
                    <!-- Value text -->
                    <text x="${minPt.x}" y="${minPt.price < 0 ? minPt.y + 20 : minPt.y - 13}" text-anchor="middle" fill="#0f172a" font-size="8.5px" font-weight="bold" font-family="sans-serif">
                      ${minPt.price.toFixed(2).replace('.', ',')}
                    </text>
                  </g>
                ` : ''}

                <!-- X Axis Labels (every 4 hours to avoid overlap) -->
                ${points.map((p: any) => {
                  const date = new Date(p.datetime);
                  const showLabel = date.getHours() % 4 === 0;

                  if (!showLabel) return '';
                  return svg`
                    <text x="${p.x}" y="${chartBottom + 16}" text-anchor="middle" 
                          fill="${p.isCurrent ? '#ef4444' : 'rgba(255,255,255,0.45)'}" 
                          font-size="9px" font-weight="${p.isCurrent ? 'bold' : 'normal'}" font-family="sans-serif">
                      ${p.label}
                    </text>
                  `;
                })}

                <!-- Interactive Guide Line and Bubble (Active on Hover/Touch) -->
                ${this.hoveredPoint ? svg`
                  <line x1="${this.hoveredPoint.x}" y1="${chartTop - 10}" x2="${this.hoveredPoint.x}" y2="${chartBottom}" stroke="rgba(255,255,255,0.35)" stroke-width="1.2" stroke-dasharray="3,3" />
                  <circle cx="${this.hoveredPoint.x}" cy="${this.hoveredPoint.y}" r="6" fill="#ffffff" stroke="${this.hoveredPoint.price > 0.30 ? '#ef4444' : (this.hoveredPoint.price > 0 ? '#10b981' : '#fbbf24')}" stroke-width="2" />
                  <g>
                    <!-- Hover Price Bubble -->
                    <rect x="${this.hoveredPoint.x - 22}" y="${this.hoveredPoint.price < 0 ? this.hoveredPoint.y + 10 : this.hoveredPoint.y - 25}" width="44" height="15" rx="3.5" ry="3.5" fill="#ffffff" stroke="rgba(0,0,0,0.15)" stroke-width="0.5" style="filter: drop-shadow(0 2px 5px rgba(0,0,0,0.25));" />
                    <text x="${this.hoveredPoint.x}" y="${this.hoveredPoint.price < 0 ? this.hoveredPoint.y + 21 : this.hoveredPoint.y - 14}" text-anchor="middle" fill="#0f172a" font-size="8.5px" font-weight="bold" font-family="monospace">
                      €${this.hoveredPoint.price.toFixed(2).replace('.', ',')}
                    </text>
                  </g>
                ` : ''}

                <!-- Transparent Interactive Hover Zones (Catch area) -->
                ${points.map((p: any) => {
                  return svg`
                    <rect x="${p.x - step / 2}" y="${chartTop - 15}" width="${step}" height="${chartHeight + 35}" 
                          fill="transparent" style="cursor: pointer; pointer-events: all; -webkit-tap-highlight-color: transparent;"
                          @mouseenter=${() => this.hoveredPoint = p}
                          @mouseleave=${() => this.hoveredPoint = null}
                          @touchstart=${(e: TouchEvent) => { e.preventDefault(); this.hoveredPoint = p; }}
                          @touchmove=${(e: TouchEvent) => {
                            e.preventDefault();
                            const touch = e.touches[0];
                            const svgEl = (e.currentTarget as any)?.ownerSVGElement;
                            if (svgEl) {
                              const rect = svgEl.getBoundingClientRect();
                              const relativeX = ((touch.clientX - rect.left) / rect.width) * 500;
                              let closest = points[0];
                              let minD = Infinity;
                              points.forEach((pt: any) => {
                                const d = Math.abs(pt.x - relativeX);
                                if (d < minD) {
                                  minD = d;
                                  closest = pt;
                                }
                              });
                              this.hoveredPoint = closest;
                            }
                          }}
                          @touchend=${() => this.hoveredPoint = null} />
                  `;
                })}
              </svg>
            </div>
          `;
        }
      } else {
        if (this.isLoadingHistory) {
        } else {
          const targetImp = impEntity || '';
          const targetExp = expEntity || '';

          if (!targetImp || !targetExp || (!this.statsData[targetImp] && !this.statsData[targetExp])) {
            chartHtml = html`<div class="chart-no-data">Geen historische gegevens beschikbaar.</div>`;
          } else {
            const processed = this.getProcessedGridData(targetImp, targetExp);
            totalImport = processed.reduce((sum, item) => sum + item.importValue, 0);
            totalExport = processed.reduce((sum, item) => sum + item.exportValue, 0);

            if (canShowCost) {
              const processedCost = this.getProcessedGridData(impCostEntity || '', expCostEntity || '');
              totalImportCost = processedCost.reduce((sum, item) => sum + item.importValue, 0);
              totalExportCost = processedCost.reduce((sum, item) => sum + item.exportValue, 0);
            }

            const maxVal = Math.max(...processed.map(i => Math.max(i.importValue, i.exportValue))) || 1;
            chartHtml = html`
              <div class="scrollable-chart-container">
                <div class="glass-bar-chart">
                  ${processed.map(item => {
                    const importPercent = (item.importValue / maxVal) * 80;
                    const exportPercent = (item.exportValue / maxVal) * 80;
                    return html`
                      <div class="chart-column" style="min-width: 60px;">
                        <!-- Stacked values at the top of the column (always in kWh) -->
                        <div class="chart-values-stacked">
                          <span class="stacked-val import-color">
                            ${item.importValue.toFixed(this.activeTab === 'day' ? 1 : 0)}
                          </span>
                          <span class="stacked-val export-color">
                            ${item.exportValue.toFixed(this.activeTab === 'day' ? 1 : 0)}
                          </span>
                        </div>
    
                        <div class="grid-double-bar-wrapper">
                          <!-- Import bar -->
                          <div class="grid-import-bar-wrapper">
                            <div class="grid-import-bar" style="height: ${Math.max(4, importPercent)}%;"></div>
                          </div>
                          <!-- Export bar -->
                          <div class="grid-export-bar-wrapper">
                            <div class="grid-export-bar" style="height: ${Math.max(4, exportPercent)}%;"></div>
                          </div>
                        </div>
                        <span class="chart-label">${item.label}</span>
                      </div>
                    `;
                  })}
                </div>
              </div>
            `;
          }
        }
      }
    }

    return html`
      <div class="glass-popup-overlay" @click=${this.closePopup}>
        <div class="glass-popup-card" @click=${(e: Event) => e.stopPropagation()}>
          <button class="glass-popup-close" @click=${this.closePopup}>&times;</button>
          
          <div class="glass-popup-header">
            <div class="glass-popup-title">${title}</div>
            <div class="glass-popup-subtitle">${subtitle}</div>
          </div>

          <!-- Tab switcher -->
          <div class="popup-tabs">
            ${this.activePopup === 'grid' ? html`
              <button class="popup-tab-btn ${this.activeTab === 'prices' ? 'active' : ''}" @click=${() => this.switchTab('prices')}>Vandaag</button>
              <button class="popup-tab-btn ${this.activeTab === 'day' ? 'active' : ''}" @click=${() => this.switchTab('day')}>30 Dagen</button>
              <button class="popup-tab-btn ${this.activeTab === 'month' ? 'active' : ''}" @click=${() => this.switchTab('month')}>Maand</button>
              <button class="popup-tab-btn ${this.activeTab === 'year' ? 'active' : ''}" @click=${() => this.switchTab('year')}>Jaar</button>
            ` : html`
              <button class="popup-tab-btn ${this.activeTab === 'day' ? 'active' : ''}" @click=${() => this.switchTab('day')}>Dag</button>
              <button class="popup-tab-btn ${this.activeTab === 'month' ? 'active' : ''}" @click=${() => this.switchTab('month')}>Maand</button>
              <button class="popup-tab-btn ${this.activeTab === 'year' ? 'active' : ''}" @click=${() => this.switchTab('year')}>Jaar</button>
            `}
          </div>

          <div class="glass-popup-stats">
            ${this.activePopup === 'grid' ? (
              this.activeTab === 'prices' ? html`
                <div class="glass-popup-stat" style="grid-column: span 2; display: flex; flex-direction: column; gap: 8px; padding: 12px 16px; background: rgba(255,255,255,0.03); border-radius: 12px; border: 1px solid rgba(255,255,255,0.08); width: 100%; box-sizing: border-box;">
                  <!-- Live power row -->
                  <div style="display: flex; justify-content: space-between; align-items: center; font-size: 13px;">
                    <span style="color: rgba(255,255,255,0.5); display: flex; align-items: center; gap: 6px;">
                      <ha-icon icon="${grid >= 0 ? 'mdi:transmission-tower-export' : 'mdi:transmission-tower-import'}" style="color: ${grid >= 0 ? '#ef4444' : '#10b981'}; --mdc-icon-size: 16px;"></ha-icon>
                      Actueel netto:
                    </span>
                    <span style="font-weight: bold; color: ${grid >= 0 ? '#ef4444' : '#10b981'};">
                      ${grid >= 0 ? 'Import' : 'Export'}: ${Math.abs(grid) >= 1000 ? `${(Math.abs(grid) / 1000).toFixed(1)} kW` : `${Math.round(Math.abs(grid))} W`}
                    </span>
                  </div>

                  <div style="height: 1px; background: rgba(255,255,255,0.08); margin: 2px 0;"></div>

                  <!-- Import Vandaag -->
                  <div style="display: flex; justify-content: space-between; align-items: center; font-size: 13px;">
                    <span style="color: rgba(255,255,255,0.5); display: flex; align-items: center; gap: 6px;">
                      <ha-icon icon="mdi:arrow-down-bold" style="color: #ef4444; --mdc-icon-size: 16px;"></ha-icon>
                      Import Vandaag:
                    </span>
                    <span style="font-weight: bold; color: #ffffff;">
                      ${gridImportToday !== null ? gridImportToday.toFixed(1) : '0'} kWh 
                      ${canShowCost && costTodayImport !== null ? html`<span style="color: #ef4444; font-weight: bold; margin-left: 6px;">(€ ${costTodayImport.toFixed(2).replace('.', ',')})</span>` : ''}
                    </span>
                  </div>

                  <!-- Export Vandaag -->
                  <div style="display: flex; justify-content: space-between; align-items: center; font-size: 13px;">
                    <span style="color: rgba(255,255,255,0.5); display: flex; align-items: center; gap: 6px;">
                      <ha-icon icon="mdi:arrow-up-bold" style="color: #10b981; --mdc-icon-size: 16px;"></ha-icon>
                      Export Vandaag:
                    </span>
                    <span style="font-weight: bold; color: #ffffff;">
                      ${gridExportToday !== null ? gridExportToday.toFixed(1) : '0'} kWh 
                      ${canShowCost && costTodayExport !== null ? html`<span style="color: #10b981; font-weight: bold; margin-left: 6px;">(€ ${costTodayExport.toFixed(2).replace('.', ',')})</span>` : ''}
                    </span>
                  </div>

                  <div style="height: 1px; background: rgba(255,255,255,0.1); margin: 2px 0;"></div>

                  <!-- Netto Balans Vandaag -->
                  <div style="display: flex; justify-content: space-between; align-items: center; font-size: 13px; font-weight: bold;">
                    <span style="color: rgba(255,255,255,0.7); display: flex; align-items: center; gap: 6px;">
                      <ha-icon icon="mdi:scale-balance" style="color: #3b82f6; --mdc-icon-size: 16px;"></ha-icon>
                      Netto balans:
                    </span>
                    <span style="color: ${(gridImportToday || 0) >= (gridExportToday || 0) ? '#ef4444' : '#10b981'};">
                      ${(gridImportToday || 0) >= (gridExportToday || 0) ? `${((gridImportToday || 0) - (gridExportToday || 0)).toFixed(1)} kWh` : `${((gridExportToday || 0) - (gridImportToday || 0)).toFixed(1)} kWh`}
                      ${canShowCost && costTodayImport !== null && costTodayExport !== null ? html`
                        <span style="font-weight: bold; margin-left: 6px; color: ${costTodayImport >= costTodayExport ? '#ef4444' : '#10b981'};">
                          (${costTodayImport >= costTodayExport ? `Kosten: € ${(costTodayImport - costTodayExport).toFixed(2).replace('.', ',')}` : `Opbrengst: € ${(costTodayExport - costTodayImport).toFixed(2).replace('.', ',')}`})
                        </span>
                      ` : ''}
                    </span>
                  </div>
                </div>
              ` : html`
                <div class="glass-popup-stat" style="grid-column: span 2; display: flex; flex-direction: column; gap: 8px; padding: 12px 16px; background: rgba(255,255,255,0.03); border-radius: 12px; border: 1px solid rgba(255,255,255,0.08); width: 100%; box-sizing: border-box;">
                  <div style="display: flex; justify-content: space-between; align-items: center; font-size: 13px;">
                    <span style="color: rgba(255,255,255,0.5); display: flex; align-items: center; gap: 6px;">
                      <ha-icon icon="mdi:arrow-down-bold" style="color: #ef4444; --mdc-icon-size: 16px;"></ha-icon>
                      Totaal Import:
                    </span>
                    <span style="font-weight: bold; color: #ffffff;">
                      ${totalImport.toFixed(1)} kWh ${canShowCost ? html`<span style="color: #ef4444; font-weight: bold; margin-left: 6px;">(€ ${totalImportCost.toFixed(2).replace('.', ',')})</span>` : ''}
                    </span>
                  </div>

                  <div style="display: flex; justify-content: space-between; align-items: center; font-size: 13px;">
                    <span style="color: rgba(255,255,255,0.5); display: flex; align-items: center; gap: 6px;">
                      <ha-icon icon="mdi:arrow-up-bold" style="color: #10b981; --mdc-icon-size: 16px;"></ha-icon>
                      Totaal Export:
                    </span>
                    <span style="font-weight: bold; color: #ffffff;">
                      ${totalExport.toFixed(1)} kWh ${canShowCost ? html`<span style="color: #10b981; font-weight: bold; margin-left: 6px;">(€ ${totalExportCost.toFixed(2).replace('.', ',')})</span>` : ''}
                    </span>
                  </div>

                  <div style="height: 1px; background: rgba(255,255,255,0.1); margin: 2px 0;"></div>

                  <div style="display: flex; justify-content: space-between; align-items: center; font-size: 13px; font-weight: bold;">
                    <span style="color: rgba(255,255,255,0.7); display: flex; align-items: center; gap: 6px;">
                      <ha-icon icon="mdi:scale-balance" style="color: #3b82f6; --mdc-icon-size: 16px;"></ha-icon>
                      Netto balans:
                    </span>
                    <span style="color: ${totalImport >= totalExport ? '#ef4444' : '#10b981'};">
                      ${totalImport >= totalExport ? `${(totalImport - totalExport).toFixed(1)} kWh` : `${(totalExport - totalImport).toFixed(1)} kWh`}
                      ${canShowCost ? html`
                        <span style="font-weight: bold; margin-left: 6px; color: ${totalImportCost >= totalExportCost ? '#ef4444' : '#10b981'};">
                          (${totalImportCost >= totalExportCost ? `Kosten: € ${(totalImportCost - totalExportCost).toFixed(2).replace('.', ',')}` : `Opbrengst: € ${(totalExportCost - totalImportCost).toFixed(2).replace('.', ',')}`})
                        </span>
                      ` : ''}
                    </span>
                  </div>
                </div>
              `
            ) : html`
              <div class="glass-popup-stat">
                <span class="stat-label">${stat1Label}</span>
                <span class="stat-value" style="color: #10b981;">${stat1Val}</span>
              </div>
              ${hasSecondStat ? html`
                <div class="glass-popup-stat">
                  <span class="stat-label">${stat2Label}</span>
                  <span class="stat-value">${stat2Val}</span>
                </div>
              ` : ''}
            `}
          </div>

          <div class="glass-popup-chart-container">
            <div class="chart-title">
              ${this.activePopup === 'grid' && this.activeTab === 'prices'
                ? 'Zonneplan Uurprijzen (€/kWh)'
                : `${this.activeTab === 'day' ? 'Afgelopen 30 dagen' : (this.activeTab === 'month' ? 'Afgelopen 12 maanden' : 'Jaaroverzicht')} (kWh)`}
            </div>
            ${chartHtml}
          </div>
        </div>
      </div>
    `;
  }

  private switchTab(tab: 'prices' | 'day' | 'month' | 'year'): void {
    this.activeTab = tab;
    setTimeout(() => {
      const container = this.shadowRoot?.querySelector('.scrollable-chart-container');
      if (container) {
        container.scrollLeft = container.scrollWidth;
      }
    }, 100);
  }

  private getClouds(weather: string): any[] {
    if (this.clouds.length > 0 && this.lastWeather === weather) {
      return this.clouds;
    }
    const isOvercast = (weather === 'cloudy' || weather === 'rainy' || weather === 'lightning' || weather === 'snowy');
    const count = isOvercast ? 24 : 3;
    const list = [];
    for (let i = 0; i < count; i++) {
      const scale = isOvercast ? (1.8 + Math.random() * 1.2) : (1.2 + Math.random() * 0.8);
      const speed = isOvercast ? (100 + Math.random() * 140) : (80 + Math.random() * 100);
      const delay = -Math.random() * speed;
      const yFactor = Math.random();
      const opacityMultiplier = isOvercast ? (0.85 + Math.random() * 0.15) : (0.6 + Math.random() * 0.3);
      list.push({
        yFactor,
        scale,
        speed,
        delay,
        opacityMultiplier
      });
    }
    this.clouds = list;
    this.lastWeather = weather;
    return this.clouds;
  }

  static styles = styles;

  // Make the card customizable in the Lovelace card picker
  public static getStubConfig(): Partial<EnergyFlowCardConfig> {
    return {
      title: 'Energieverloop',
      entities: {}
    };
  }

  public setConfig(config: EnergyFlowCardConfig): void {
    if (!config) {
      throw new Error('Ongeldige configuratie');
    }
    this.config = config;
  }

  // Helper function to resolve entity states and sum arrays if necessary
  private getEntityValue(entityInput: string | string[] | undefined): number {
    if (!entityInput || !this.hass) return 0;
    
    const resolveValue = (entId: string): number => {
      const entity = this.hass?.states[entId];
      if (!entity) return 0;
      const val = parseFloat(entity.state);
      return isNaN(val) ? 0 : val;
    };

    if (Array.isArray(entityInput)) {
      return entityInput.reduce((acc, entId) => acc + resolveValue(entId), 0);
    }
    return resolveValue(entityInput);
  }

  private async handleNodeClick(nodeId: string): Promise<void> {
    console.info(`[energy-flow-card] Click registered on node: ${nodeId}`);
    
    if (nodeId === 'solar' || nodeId === 'home' || nodeId === 'grid' || nodeId === 'weather') {
      this.activePopup = nodeId;
      this.activeTab = nodeId === 'grid' ? 'prices' : 'day';
      this.statsData = {};
      
      const entitiesToFetch: string[] = [];
      if (nodeId === 'solar') {
        const ent = this.config?.entities.solar_energy_today || (this.config?.entities as any).solar_today;
        if (ent) entitiesToFetch.push(ent);
      } else if (nodeId === 'home') {
        const ent = this.config?.entities.home_today;
        if (ent) entitiesToFetch.push(ent);
      } else if (nodeId === 'grid') {
        let imp = this.config?.entities.grid_import_today;
        let exp = this.config?.entities.grid_export_today;
        if (this.hass?.states['sensor.p1_meter_energy_import'] && this.hass?.states['sensor.p1_meter_energy_export']) {
          imp = 'sensor.p1_meter_energy_import';
          exp = 'sensor.p1_meter_energy_export';
        }
        if (imp) entitiesToFetch.push(imp);
        if (exp) entitiesToFetch.push(exp);

        let impCost = this.config?.entities.grid_import_cost;
        let expCost = this.config?.entities.grid_export_cost;
        if (!impCost && this.hass?.states['sensor.p1_meter_energy_import_cost']) {
          impCost = 'sensor.p1_meter_energy_import_cost';
        }
        if (!expCost && this.hass?.states['sensor.p1_meter_energy_export_compensation']) {
          expCost = 'sensor.p1_meter_energy_export_compensation';
        }
        if (impCost) entitiesToFetch.push(impCost);
        if (expCost) entitiesToFetch.push(expCost);
      }
      
      if (entitiesToFetch.length > 0) {
        await this.fetchStatsData(entitiesToFetch);
        setTimeout(() => {
          const container = this.shadowRoot?.querySelector('.scrollable-chart-container');
          if (container) {
            container.scrollLeft = container.scrollWidth;
          }
        }, 100);
      }
      
      if (nodeId === 'weather') {
        this.weatherForecast = [];
        const weatherEntityId = this.config?.entities.weather;
        if (weatherEntityId) {
          try {
            this.isLoadingHistory = true;
            const res = await (this.hass as any).callWS({
              type: 'call_service',
              domain: 'weather',
              service: 'get_forecasts',
              service_data: {
                entity_id: weatherEntityId,
                type: 'daily'
              },
              return_response: true
            });
            this.weatherForecast = res?.response?.[weatherEntityId]?.forecast || [];
          } catch (e) {
            console.warn('[energy-flow-card] Failed to fetch weather forecast:', e);
            this.weatherForecast = [];
          } finally {
            this.isLoadingHistory = false;
          }
        }
      }
      
      return;
    }

    const actionKey = `${nodeId}_tap_action`;
    const customAction = (this.config as any)[actionKey];
    if (customAction) {
      console.log(`[energy-flow-card] Executing custom action for node '${nodeId}':`, customAction);
      
      if (customAction.action === 'navigate' && customAction.navigation_path) {
        const path = customAction.navigation_path;
        if (path.startsWith('#')) {
          window.location.hash = path;
          return;
        } else {
          window.history.pushState(null, '', path);
          const ev = new CustomEvent('location-changed', {
            detail: { replace: false },
            bubbles: true,
            composed: true
          });
          this.dispatchEvent(ev);
          return;
        }
      }

      const event = new CustomEvent('hass-action', {
        detail: {
          config: {
            tap_action: customAction
          },
          action: 'tap',
          action_config: customAction
        },
        bubbles: true,
        composed: true
      });
      this.dispatchEvent(event);
      return;
    }

    this.selectedNode = this.selectedNode === nodeId ? null : nodeId;
    
    let entityKey = nodeId;
    if (nodeId === 'battery') {
      entityKey = this.config?.entities.battery_power ? 'battery_power' : 'battery_soc';
    } else if (nodeId === 'home') {
      entityKey = this.config?.entities.load ? 'load' : 'home_power';
    } else if (nodeId === 'ev') {
      entityKey = 'charger';
    } else if (nodeId === 'grid') {
      entityKey = this.config?.entities.grid ? 'grid' : ((this.config?.entities as any).grid_power ? 'grid_power' : 'solar');
    } else if (nodeId === 'solar') {
      entityKey = this.config?.entities.solar ? 'solar' : ((this.config?.entities as any).solar_power ? 'solar_power' : 'solar_energy_today');
    }

    const entityConfig = this.config?.entities ? this.config.entities[entityKey as keyof typeof this.config.entities] : undefined;
    const singleEntity = Array.isArray(entityConfig) ? entityConfig[0] : entityConfig as string | undefined;
    
    console.info(`[energy-flow-card] Node '${nodeId}' mapped to key '${entityKey}', resolved entity ID: '${singleEntity}'`);

    if (singleEntity) {
      console.info(`[energy-flow-card] Dispatching 'hass-more-info' event for entity: ${singleEntity}`);
      const event = new CustomEvent('hass-more-info', {
        detail: { entityId: singleEntity },
        bubbles: true,
        composed: true,
      });
      this.dispatchEvent(event);
    } else {
      console.warn(`[energy-flow-card] Could not dispatch popup: No entity configured for node '${nodeId}'`);
    }
  }

  private handleCardClick(e: Event): void {
    if (this.activePopup) {
      return;
    }

    const path = e.composedPath();
    const isInteractive = path.some(el => {
      if (el instanceof Element) {
        return el.classList.contains('interactiveGroup') || el.closest?.('.interactiveGroup');
      }
      return false;
    });

    if (isInteractive) {
      return;
    }

    if (this.config?.tap_action) {
      const action = this.config.tap_action;
      if (action.action === 'navigate' && action.navigation_path) {
        this.restoreSidebarAndHeader();
        window.history.pushState(null, '', action.navigation_path);
        const event = new CustomEvent('location-changed', {
          detail: { replace: false },
          bubbles: true,
          composed: true
        });
        this.dispatchEvent(event);
      }
    }
  }

  protected render(): TemplateResult {
    if (!this.config || !this.hass) {
      return html`<p style="color: red; padding: 16px;">Wachten op Home Assistant...</p>`;
    }

    const { entities } = this.config;

    // Get current browser time decimal representation (0.0 to 24.0)
    const now = new Date();
    let decimalHour = now.getHours() + now.getMinutes() / 60;
    if (this.debugTimeHour !== null) {
      decimalHour = this.debugTimeHour;
    } else if (this.config.time_override !== undefined) {
      decimalHour = this.config.time_override;
    }

    // Determine time of day label
    let timeOfDay = 'afternoon';
    if (decimalHour >= 5 && decimalHour < 9) timeOfDay = 'morning';
    else if (decimalHour >= 9 && decimalHour < 18) timeOfDay = 'afternoon';
    else if (decimalHour >= 18 && decimalHour < 22) timeOfDay = 'evening';
    else timeOfDay = 'night';

    // Parse states
    const solar = this.getEntityValue(entities.solar || (entities as any).solar_power);
    const load = this.getEntityValue(entities.load || (entities as any).home_power);
    const rawBatteryPower = this.debugBatteryPower !== null ? this.debugBatteryPower : this.getEntityValue(entities.battery_power);
    const soc = this.debugBatterySoc !== null ? this.debugBatterySoc : (entities.battery_soc ? this.getEntityValue(entities.battery_soc) : 0);
    const charger = this.debugEVPower !== null ? this.debugEVPower : this.getEntityValue(entities.charger);

    // Parse grid early for battery polarity auto-detection (it will be finalized later if not configured)
    let grid = 0;
    if (entities.grid || (entities as any).grid_power) {
      grid = this.getEntityValue(entities.grid || (entities as any).grid_power);
    }

    // Normalize battery sign convention:
    // - battery_invert: true  -> sensor positief = laden (SolarEdge, Huawei)
    // - battery_invert: false -> sensor negatief = laden (Victron, SMA)
    // - Not defined: auto-detect if grid sensor is configured, otherwise default to negatief = laden (standard Home Assistant convention)
    let batteryPower = rawBatteryPower;
    if (this.config.battery_invert !== undefined) {
      const batteryInvert = this.config.battery_invert === true;
      batteryPower = batteryInvert ? rawBatteryPower : -rawBatteryPower;
    } else if (entities.grid) {
      // Auto-detect by calculating expected battery flow: expected = solar + grid - load - charger
      // (grid > 0 is import, grid < 0 is export)
      const expected = solar + grid - load - charger;
      if (Math.abs(rawBatteryPower) > 0.05 && Math.abs(expected) > 0.15) {
        if (expected * rawBatteryPower < 0) {
          batteryPower = -rawBatteryPower;
        } else {
          batteryPower = rawBatteryPower;
        }
      } else {
        batteryPower = -rawBatteryPower;
      }
    } else {
      batteryPower = -rawBatteryPower;
    }

    const solarToday = this.parseEntityFloat(entities.solar_energy_today || (entities as any).solar_today);
    const gridImportToday = this.parseEntityFloat(entities.grid_import_today);
    const gridExportToday = this.parseEntityFloat(entities.grid_export_today);
    const homeToday = this.parseEntityFloat(entities.home_today);
    const batteryChargeToday = this.parseEntityFloat(entities.battery_charge_today);
    const batteryDischargeToday = this.parseEntityFloat(entities.battery_discharge_today);
    const evToday = this.parseEntityFloat(entities.ev_today);

    // Parse grid price
    const gridPriceState = entities.grid_price ? this.hass?.states[entities.grid_price] : null;
    const gridPrice = gridPriceState ? parseFloat(gridPriceState.state) : null;
    const gridPriceUnit = gridPriceState ? (gridPriceState.attributes.unit_of_measurement || '€/kWh') : '€/kWh';

    // Weather state from Home Assistant
    let weatherState = 'sunny';
    let weatherEntityId = entities.weather;
    if (!weatherEntityId && this.hass) {
      const detected = Object.keys(this.hass.states).find(id => id.startsWith('weather.'));
      if (detected) {
        weatherEntityId = detected;
        console.info(`[energy-flow-card] Auto-detected weather entity: ${weatherEntityId}`);
      }
    }

    let weatherEntity = (weatherEntityId && this.hass?.states[weatherEntityId]) ? this.hass.states[weatherEntityId] : null;
    if (this.debugWeatherState !== null) {
      weatherState = this.debugWeatherState;
    } else if (this.config.weather_override) {
      weatherState = this.config.weather_override;
    } else if (weatherEntity) {
      weatherState = weatherEntity.state;
    }

    const windSpeed = this.debugWindSpeed !== null ? this.debugWindSpeed : (weatherEntity?.attributes?.wind_speed !== undefined ? parseFloat(weatherEntity.attributes.wind_speed) : 10);
    let temperature = this.debugTemperature !== null ? this.debugTemperature : null;
    if (temperature === null) {
      if (entities.temperature) {
        temperature = this.parseEntityFloat(entities.temperature);
      } else if (weatherEntity?.attributes?.temperature !== undefined) {
        temperature = parseFloat(weatherEntity.attributes.temperature);
      }
    }
    let rainIntensity: 'light' | 'normal' | 'heavy' = 'normal';
    if (this.debugRainIntensity !== null) {
      rainIntensity = this.debugRainIntensity;
    } else {
      if (weatherEntity?.attributes?.precipitation !== undefined) {
        const precip = parseFloat(weatherEntity.attributes.precipitation);
        if (precip > 0) {
          if (precip < 1.0) rainIntensity = 'light';
          else if (precip >= 4.0) rainIntensity = 'heavy';
        }
      }
      if (weatherState === 'pouring' || weatherState === 'lightning-rainy') {
        rainIntensity = 'heavy';
      }
    }

    // Sunrise/sunset from Home Assistant sun.sun
    let sunriseHour = 6.0;
    let sunsetHour = 21.0;
    const sunEntity = this.hass?.states['sun.sun'];
    if (sunEntity) {
      try {
        const nextRising = new Date(sunEntity.attributes.next_rising);
        const nextSetting = new Date(sunEntity.attributes.next_setting);
        sunriseHour = nextRising.getHours() + nextRising.getMinutes() / 60;
        sunsetHour = nextSetting.getHours() + nextSetting.getMinutes() / 60;
      } catch (e) {
        console.warn('[energy-flow-card] Fout bij parsen van sun.sun tijden:', e);
      }
    }

    let poolPumpActive = false;
    if (this.debugPoolPumpActive !== null) {
      poolPumpActive = this.debugPoolPumpActive;
    } else {
      let poolPumpEntityId = entities.pool_pump;
      if (!poolPumpEntityId && this.hass) {
        const detected = Object.keys(this.hass.states).find(id => id.includes('zwembadpomp') || id.includes('pool_pump'));
        if (detected) {
          poolPumpEntityId = detected;
        }
      }
      if (poolPumpEntityId && this.hass?.states[poolPumpEntityId]) {
        const stateStr = this.hass.states[poolPumpEntityId].state;
        poolPumpActive = stateStr === 'on' || stateStr === 'active' || stateStr === 'true';
      }
    }

    if (!entities.grid && !(entities as any).grid_power) {
      // grid = huisverbruik + laadpaal - opwek - acculaden + accuontladen
      grid = load + charger - solar - batteryPower;
    }

    // Check configuration flags for layout
    const showSolar = !!entities.solar || !!(entities as any).solar_power;
    const showBattery = this.debugShowBattery !== null ? this.debugShowBattery : !!entities.battery_power;
    const showEV = this.debugShowEV !== null ? this.debugShowEV : (charger > 0);

    const skyState = getSkyState(decimalHour, sunriseHour, sunsetHour);
    const dynamicBackground = `background: linear-gradient(to bottom, ${skyState.top} 0%, ${skyState.horizon} 81%, #0a2919 81.1%, #05160d 100%);`;

    // Calculate if we should show window lights
    let resolvedShowLights: boolean | undefined = undefined;
    let lightConfig = entities.light;
    
    if (!lightConfig && this.hass) {
      const links = 'light.woonkamer_dimmerlinks_ecodim_dimmer_switch_zb3_0_licht';
      const rechts = 'light.woonkamer_dimmerrechts_ecodim_dimmer_switch_zb3_0_licht';
      if (this.hass.states[links] || this.hass.states[rechts]) {
        lightConfig = [links, rechts];
      }
    }

    if (lightConfig) {
      const checkLightOn = (id: string): boolean => {
        const entity = this.hass?.states[id];
        return entity?.state === 'on';
      };
      
      if (Array.isArray(lightConfig)) {
        resolvedShowLights = lightConfig.some(id => checkLightOn(id));
      } else {
        resolvedShowLights = checkLightOn(lightConfig);
      }
    }

    const screensaverStyles = this.config.screensaver
      ? html`
          <style>
            :host {
              position: fixed !important;
              top: 0 !important;
              left: 0 !important;
              height: 100vh !important;
              width: 100vw !important;
              margin-left: 0 !important;
              z-index: 50 !important;
            }
            ha-card {
              height: 100% !important;
              width: 100% !important;
              border-radius: 0 !important;
              border: none !important;
              box-shadow: none !important;
            }
            svg {
              height: 100% !important;
              width: 100% !important;
            }
          </style>
        `
      : '';

    const dynamicAnimations = html`
      <style>
        @keyframes rainFall {
          0%   { transform: translateY(-40px); opacity: 0; }
          10%  { opacity: 0.75; }
          90%  { opacity: 0.75; }
          100% { transform: translateY(${this.cardHeight + 40}px); opacity: 0; }
        }

        @keyframes snowFall {
          0%   { transform: translateY(-20px) translateX(0px); opacity: 0; }
          10%  { opacity: 0.85; }
          50%  { transform: translateY(${(this.cardHeight) / 2}px) translateX(12px); }
          90%  { opacity: 0.85; }
          100% { transform: translateY(${this.cardHeight + 20}px) translateX(-8px); opacity: 0; }
        }
      </style>
    `;

    return html`
      ${screensaverStyles}
      ${dynamicAnimations}
      <ha-card style="${dynamicBackground}" @click=${this.handleCardClick}>
        <div class="card-container">
          ${this.config.title ? html`
            <div class="card-header">
              <div class="card-title">${this.config.title}</div>
            </div>
          ` : ''}

          <div class="sceneWrapper">
            ${renderHouseSvg({
              containerWidth: this.cardWidth,
              containerHeight: this.cardHeight,
              timeHour: decimalHour,
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
              weather: weatherState,
              clouds: this.getClouds(weatherState),
              sunriseHour,
              sunsetHour,
              gridImportToday,
              gridExportToday,
              homeToday,
              batteryChargeToday,
              batteryDischargeToday,
              evToday,
              houseStyle: this.config?.house_style,
              carType: this.config?.car_type,
              showLights: resolvedShowLights,
              gridPrice,
              gridPriceUnit,
              rainIntensity,
              windSpeed,
              temperature,
              poolPumpActive,
              onNodeClick: (node) => this.handleNodeClick(node)
            })}
          </div>

          <!-- Glassmorphism Custom Popup Overlay -->
          ${this.renderPopup()}

          <!-- Weather Test Panel Overlay/Drawer -->
          ${this.config?.weather_test ? html`
            <!-- Floating Toggle Button -->
            <div style="position: absolute; left: 16px; top: 16px; z-index: 100;" @click=${(e: Event) => e.stopPropagation()}>
              <button @click=${(e: Event) => { e.stopPropagation(); this._toggleWeatherTestPanel(); }} style="background: rgba(15, 23, 42, 0.7); backdrop-filter: blur(8px); border: 1px solid rgba(255,255,255,0.15); color: #fff; padding: 6px 12px; border-radius: 20px; font-size: 11px; cursor: pointer; display: flex; align-items: center; gap: 6px; font-weight: 600; box-shadow: 0 4px 12px rgba(0,0,0,0.3); transition: background 0.3s ease;">
                <ha-icon icon="mdi:cog" style="--mdc-icon-size: 14px; width: 14px; height: 14px;"></ha-icon>
                Simulatiepaneel
              </button>
            </div>

            <!-- Panel Content -->
            ${this._weatherTestPanelOpen ? html`
              <div @click=${(e: Event) => e.stopPropagation()} style="position: absolute; left: 16px; top: 52px; z-index: 99; background: rgba(15, 23, 42, 0.9); backdrop-filter: blur(12px); border: 1px solid rgba(255,255,255,0.15); width: 280px; max-height: 75vh; overflow-y: auto; border-radius: 12px; padding: 16px; color: #fff; font-family: system-ui, sans-serif; box-shadow: 0 8px 32px rgba(0,0,0,0.4); display: flex; flex-direction: column; gap: 12px; box-sizing: border-box;">
                <div style="display: flex; justify-content: space-between; align-items: center; border-bottom: 1px solid rgba(255,255,255,0.1); padding-bottom: 8px;">
                  <span style="font-weight: bold; font-size: 13px; color: #10b981; text-transform: uppercase;">Weer & Apparaten Simulator</span>
                  <button @click=${(e: Event) => { e.stopPropagation(); this._toggleWeatherTestPanel(); }} style="background: none; border: none; color: rgba(255,255,255,0.6); font-size: 18px; cursor: pointer; line-height: 1; padding: 0;">&times;</button>
                </div>

                <!-- Weather Selector -->
                <div style="display: flex; flex-direction: column; gap: 4px;">
                  <span style="font-size: 10px; color: rgba(255,255,255,0.5); font-weight: bold; text-transform: uppercase;">Weertype</span>
                  <select @change=${(e: any) => this.debugWeatherState = e.target.value || null} style="background: rgba(0,0,0,0.3); border: 1px solid rgba(255,255,255,0.15); color: #fff; padding: 6px; border-radius: 6px; font-size: 12px; outline: none; cursor: pointer; width: 100%;">
                    <option value="" ?selected=${this.debugWeatherState === null}>Standaard (HA)</option>
                    <option value="sunny" ?selected=${this.debugWeatherState === 'sunny'}>Zonnig</option>
                    <option value="partlycloudy" ?selected=${this.debugWeatherState === 'partlycloudy'}>Licht bewolkt</option>
                    <option value="cloudy" ?selected=${this.debugWeatherState === 'cloudy'}>Bewolkt</option>
                    <option value="rainy" ?selected=${this.debugWeatherState === 'rainy'}>Regen</option>
                    <option value="pouring" ?selected=${this.debugWeatherState === 'pouring'}>Stortregen</option>
                    <option value="lightning" ?selected=${this.debugWeatherState === 'lightning'}>Onweer</option>
                    <option value="snowy" ?selected=${this.debugWeatherState === 'snowy'}>Sneeuw</option>
                    <option value="fog" ?selected=${this.debugWeatherState === 'fog'}>Mist</option>
                  </select>
                </div>

                <!-- Time Slider -->
                <div style="display: flex; flex-direction: column; gap: 4px;">
                  <div style="display: flex; justify-content: space-between; font-size: 10px; color: rgba(255,255,255,0.5); font-weight: bold;">
                    <span>TIJDSTIP (UUR)</span>
                    <span style="color: #10b981;">${this.debugTimeHour !== null ? `${Math.floor(this.debugTimeHour)}:${String(Math.floor((this.debugTimeHour % 1) * 60)).padStart(2, '0')}` : 'Standaard'}</span>
                  </div>
                  <div style="display: flex; gap: 8px; align-items: center;">
                    <input type="range" min="0" max="23.9" step="0.1" .value=${this.debugTimeHour !== null ? this.debugTimeHour : decimalHour} @input=${(e: any) => this.debugTimeHour = parseFloat(e.target.value)} style="flex: 1; cursor: pointer; accent-color: #10b981;" />
                    ${this.debugTimeHour !== null ? html`<button @click=${() => this.debugTimeHour = null} style="background: rgba(255,255,255,0.1); border: none; color: #fff; padding: 2px 6px; border-radius: 4px; font-size: 10px; cursor: pointer;">Reset</button>` : ''}
                  </div>
                </div>

                <!-- Wind Speed -->
                <div style="display: flex; flex-direction: column; gap: 4px;">
                  <div style="display: flex; justify-content: space-between; font-size: 10px; color: rgba(255,255,255,0.5); font-weight: bold;">
                    <span>WINDSNELHEID (KM/H)</span>
                    <span style="color: #10b981;">${this.debugWindSpeed !== null ? `${this.debugWindSpeed} km/h` : 'Standaard'}</span>
                  </div>
                  <div style="display: flex; gap: 8px; align-items: center;">
                    <input type="range" min="0" max="120" step="1" .value=${this.debugWindSpeed !== null ? this.debugWindSpeed : windSpeed} @input=${(e: any) => this.debugWindSpeed = parseInt(e.target.value)} style="flex: 1; cursor: pointer; accent-color: #10b981;" />
                    ${this.debugWindSpeed !== null ? html`<button @click=${() => this.debugWindSpeed = null} style="background: rgba(255,255,255,0.1); border: none; color: #fff; padding: 2px 6px; border-radius: 4px; font-size: 10px; cursor: pointer;">Reset</button>` : ''}
                  </div>
                </div>

                <!-- Rain Intensity -->
                <div style="display: flex; flex-direction: column; gap: 4px;">
                  <span style="font-size: 10px; color: rgba(255,255,255,0.5); font-weight: bold; text-transform: uppercase;">Regen Intensiteit</span>
                  <div style="display: flex; gap: 4px;">
                    ${['light', 'normal', 'heavy'].map(mode => html`
                      <button @click=${() => this.debugRainIntensity = this.debugRainIntensity === mode ? null : mode as any} style="flex: 1; padding: 4px; font-size: 10px; border-radius: 4px; cursor: pointer; border: 1px solid rgba(255,255,255,0.15); background: ${this.debugRainIntensity === mode ? '#10b981' : 'rgba(0,0,0,0.2)'}; color: #fff; font-weight: 600;">
                        ${mode === 'light' ? 'Licht' : mode === 'normal' ? 'Normaal' : 'Zwaar'}
                      </button>
                    `)}
                  </div>
                </div>

                <!-- Temperature -->
                <div style="display: flex; flex-direction: column; gap: 4px;">
                  <div style="display: flex; justify-content: space-between; font-size: 10px; color: rgba(255,255,255,0.5); font-weight: bold;">
                    <span>TEMPERATUUR (°C)</span>
                    <span style="color: #10b981;">${this.debugTemperature !== null ? `${this.debugTemperature} °C` : 'Standaard'}</span>
                  </div>
                  <div style="display: flex; gap: 8px; align-items: center;">
                    <input type="range" min="-15" max="40" step="0.5" .value=${this.debugTemperature !== null ? this.debugTemperature : (temperature !== null ? temperature : 15)} @input=${(e: any) => this.debugTemperature = parseFloat(e.target.value)} style="flex: 1; cursor: pointer; accent-color: #10b981;" />
                    ${this.debugTemperature !== null ? html`<button @click=${() => this.debugTemperature = null} style="background: rgba(255,255,255,0.1); border: none; color: #fff; padding: 2px 6px; border-radius: 4px; font-size: 10px; cursor: pointer;">Reset</button>` : ''}
                  </div>
                </div>

                <!-- Battery Toggle -->
                <div style="display: flex; flex-direction: column; gap: 4px; border-top: 1px solid rgba(255,255,255,0.15); padding-top: 8px;">
                  <span style="font-size: 10px; color: rgba(255,255,255,0.5); font-weight: bold; text-transform: uppercase;">Thuisbatterij</span>
                  <div style="display: flex; gap: 4px;">
                    <button @click=${() => this.debugShowBattery = null} style="flex: 1; padding: 4px; font-size: 10px; border-radius: 4px; cursor: pointer; border: 1px solid rgba(255,255,255,0.15); background: ${this.debugShowBattery === null ? '#10b981' : 'rgba(0,0,0,0.2)'}; color: #fff; font-weight: 600;">
                      Auto (HA)
                    </button>
                    <button @click=${() => { this.debugShowBattery = true; if (this.debugBatteryPower === null) this.debugBatteryPower = 1500; if (this.debugBatterySoc === null) this.debugBatterySoc = 50; }} style="flex: 1; padding: 4px; font-size: 10px; border-radius: 4px; cursor: pointer; border: 1px solid rgba(255,255,255,0.15); background: ${this.debugShowBattery === true ? '#10b981' : 'rgba(0,0,0,0.2)'}; color: #fff; font-weight: 600;">
                      Altijd AAN
                    </button>
                    <button @click=${() => this.debugShowBattery = false} style="flex: 1; padding: 4px; font-size: 10px; border-radius: 4px; cursor: pointer; border: 1px solid rgba(255,255,255,0.15); background: ${this.debugShowBattery === false ? '#10b981' : 'rgba(0,0,0,0.2)'}; color: #fff; font-weight: 600;">
                      Altijd UIT
                    </button>
                  </div>
                </div>

                <!-- Battery Power Slider -->
                ${showBattery ? html`
                  <div style="display: flex; flex-direction: column; gap: 4px;">
                    <div style="display: flex; justify-content: space-between; font-size: 10px; color: rgba(255,255,255,0.5); font-weight: bold;">
                      <span>BATTERIJ VERMOGEN (W)</span>
                      <span style="color: #10b981;">${this.debugBatteryPower !== null ? `${this.debugBatteryPower} W` : 'Standaard'}</span>
                    </div>
                    <div style="display: flex; gap: 8px; align-items: center;">
                      <input type="range" min="-5000" max="5000" step="50" .value=${this.debugBatteryPower !== null ? this.debugBatteryPower : 0} @input=${(e: any) => this.debugBatteryPower = parseInt(e.target.value)} style="flex: 1; cursor: pointer; accent-color: #10b981;" />
                      ${this.debugBatteryPower !== null ? html`<button @click=${() => this.debugBatteryPower = null} style="background: rgba(255,255,255,0.1); border: none; color: #fff; padding: 2px 6px; border-radius: 4px; font-size: 10px; cursor: pointer;">Reset</button>` : ''}
                    </div>
                  </div>

                  <!-- Battery SoC Slider -->
                  <div style="display: flex; flex-direction: column; gap: 4px;">
                    <div style="display: flex; justify-content: space-between; font-size: 10px; color: rgba(255,255,255,0.5); font-weight: bold;">
                      <span>BATTERIJ LADING (%)</span>
                      <span style="color: #10b981;">${this.debugBatterySoc !== null ? `${this.debugBatterySoc} %` : 'Standaard'}</span>
                    </div>
                    <div style="display: flex; gap: 8px; align-items: center;">
                      <input type="range" min="0" max="100" step="1" .value=${this.debugBatterySoc !== null ? this.debugBatterySoc : 50} @input=${(e: any) => this.debugBatterySoc = parseInt(e.target.value)} style="flex: 1; cursor: pointer; accent-color: #10b981;" />
                      ${this.debugBatterySoc !== null ? html`<button @click=${() => this.debugBatterySoc = null} style="background: rgba(255,255,255,0.1); border: none; color: #fff; padding: 2px 6px; border-radius: 4px; font-size: 10px; cursor: pointer;">Reset</button>` : ''}
                    </div>
                  </div>
                ` : ''}

                <!-- EV Charger Toggle -->
                <div style="display: flex; flex-direction: column; gap: 4px; border-top: 1px solid rgba(255,255,255,0.15); padding-top: 8px;">
                  <span style="font-size: 10px; color: rgba(255,255,255,0.5); font-weight: bold; text-transform: uppercase;">Laadpaal</span>
                  <div style="display: flex; gap: 4px;">
                    <button @click=${() => this.debugShowEV = null} style="flex: 1; padding: 4px; font-size: 10px; border-radius: 4px; cursor: pointer; border: 1px solid rgba(255,255,255,0.15); background: ${this.debugShowEV === null ? '#10b981' : 'rgba(0,0,0,0.2)'}; color: #fff; font-weight: 600;">
                      Auto (HA)
                    </button>
                    <button @click=${() => { this.debugShowEV = true; if (this.debugEVPower === null) this.debugEVPower = 3600; }} style="flex: 1; padding: 4px; font-size: 10px; border-radius: 4px; cursor: pointer; border: 1px solid rgba(255,255,255,0.15); background: ${this.debugShowEV === true ? '#10b981' : 'rgba(0,0,0,0.2)'}; color: #fff; font-weight: 600;">
                      Altijd AAN
                    </button>
                    <button @click=${() => this.debugShowEV = false} style="flex: 1; padding: 4px; font-size: 10px; border-radius: 4px; cursor: pointer; border: 1px solid rgba(255,255,255,0.15); background: ${this.debugShowEV === false ? '#10b981' : 'rgba(0,0,0,0.2)'}; color: #fff; font-weight: 600;">
                      Altijd UIT
                    </button>
                  </div>
                </div>

                <!-- EV Charger Power Slider -->
                ${showEV ? html`
                  <div style="display: flex; flex-direction: column; gap: 4px; margin-bottom: 8px;">
                    <div style="display: flex; justify-content: space-between; font-size: 10px; color: rgba(255,255,255,0.5); font-weight: bold;">
                      <span>LAADPAAL VERMOGEN (W)</span>
                      <span style="color: #10b981;">${this.debugEVPower !== null ? `${this.debugEVPower} W` : 'Standaard'}</span>
                    </div>
                    <div style="display: flex; gap: 8px; align-items: center;">
                      <input type="range" min="0" max="11000" step="100" .value=${this.debugEVPower !== null ? this.debugEVPower : 0} @input=${(e: any) => this.debugEVPower = parseInt(e.target.value)} style="flex: 1; cursor: pointer; accent-color: #10b981;" />
                      ${this.debugEVPower !== null ? html`<button @click=${() => this.debugEVPower = null} style="background: rgba(255,255,255,0.1); border: none; color: #fff; padding: 2px 6px; border-radius: 4px; font-size: 10px; cursor: pointer;">Reset</button>` : ''}
                    </div>
                  </div>
                ` : ''}

                <!-- Pool Pump Toggle -->
                <div style="display: flex; flex-direction: column; gap: 4px; border-top: 1px solid rgba(255,255,255,0.15); padding-top: 8px;">
                  <span style="font-size: 10px; color: rgba(255,255,255,0.5); font-weight: bold; text-transform: uppercase;">Zwembadpomp (Simulatie)</span>
                  <div style="display: flex; gap: 4px;">
                    <button @click=${() => this.debugPoolPumpActive = null} style="flex: 1; padding: 4px; font-size: 10px; border-radius: 4px; cursor: pointer; border: 1px solid rgba(255,255,255,0.15); background: ${this.debugPoolPumpActive === null ? '#10b981' : 'rgba(0,0,0,0.2)'}; color: #fff; font-weight: 600;">
                      Auto (HA)
                    </button>
                    <button @click=${() => this.debugPoolPumpActive = true} style="flex: 1; padding: 4px; font-size: 10px; border-radius: 4px; cursor: pointer; border: 1px solid rgba(255,255,255,0.15); background: ${this.debugPoolPumpActive === true ? '#10b981' : 'rgba(0,0,0,0.2)'}; color: #fff; font-weight: 600;">
                      Altijd AAN
                    </button>
                    <button @click=${() => this.debugPoolPumpActive = false} style="flex: 1; padding: 4px; font-size: 10px; border-radius: 4px; cursor: pointer; border: 1px solid rgba(255,255,255,0.15); background: ${this.debugPoolPumpActive === false ? '#10b981' : 'rgba(0,0,0,0.2)'}; color: #fff; font-weight: 600;">
                      Altijd UIT
                    </button>
                  </div>
                </div>

                <!-- Reset Simulator -->
                <button @click=${this._resetAllDebugOverrides} style="background: rgba(239, 68, 68, 0.2); border: 1px solid rgba(239, 68, 68, 0.4); color: #f87171; padding: 6px; border-radius: 6px; font-size: 11px; font-weight: bold; cursor: pointer; transition: background 0.3s ease; text-transform: uppercase; margin-top: 8px;">
                  Reset simulator
                </button>
              </div>
            ` : ''}
          ` : ''}
        </div>
      </ha-card>
    `;
  }

  private _toggleWeatherTestPanel(): void {
    this._weatherTestPanelOpen = !this._weatherTestPanelOpen;
  }

  private _resetAllDebugOverrides(): void {
    this.debugWeatherState = null;
    this.debugTimeHour = null;
    this.debugWindSpeed = null;
    this.debugRainIntensity = null;
    this.debugTemperature = null;
    this.debugBatteryPower = null;
    this.debugBatterySoc = null;
    this.debugEVPower = null;
    this.debugShowBattery = null;
    this.debugShowEV = null;
    this.debugPoolPumpActive = null;
  }

  // Lovelace requirement: custom card size representation
  public getCardSize(): number {
    return 6;
  }
}

// Register the custom element
if (!customElements.get('energy-flow-card')) {
  customElements.define('energy-flow-card', EnergyFlowCard);
  
  // Log message to HA browser console to confirm loading
  console.info(
    `%c  ENERGY-FLOW-CARD  %c Version 2.3.3 `,
    'color: white; background: #10b981; font-weight: 700;',
    'color: #10b981; background: #0f172a; font-weight: 700;'
  );
}
