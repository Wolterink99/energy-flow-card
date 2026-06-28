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
  @state() private activeTab: 'today' | 'prices' | 'month' | 'year' = 'today';
  @state() private showPowerValue: boolean = false;
  @state() private hourlyHistoryData: Record<string, any[]> = {};
  @state() private isFetchingHistory: boolean = false;
  @state() private statsData: Record<string, any[]> = {};
  @state() private hourlyStatsData: Record<string, any[]> = {};
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

  private async fetchHighResolutionHistory(): Promise<void> {
    if (!this.hass) return;
    
    const solarEnt = this.config?.entities.solar || (this.config?.entities as any).solar_power;
    const homeEnt = this.config?.entities.load || (this.config?.entities as any).home_power;
    console.info('[energy-flow-card] Configured entities for history:', { solarEnt, homeEnt });
    if (!solarEnt && !homeEnt) return;

    this.isFetchingHistory = true;
    try {
      const now = new Date();
      const start = new Date(now.getFullYear(), now.getMonth(), now.getDate(), 0, 0, 0).toISOString();

      const entityIds = [];
      if (solarEnt) entityIds.push(solarEnt);
      if (homeEnt) entityIds.push(homeEnt);

      console.info('[energy-flow-card] Fetching history from REST API for:', entityIds);
      
      const token = (this.hass as any).auth?.accessToken;
      const headers: Record<string, string> = {
        'Content-Type': 'application/json'
      };
      if (token) {
        headers['Authorization'] = `Bearer ${token}`;
      }

      const response = await fetch(
        `/api/history/period/${start}?filter_entity_id=${entityIds.join(',')}&minimal_response&no_attributes`,
        { headers }
      );
      const res = await response.json();

      console.info('[energy-flow-card] History response received, length:', res ? res.length : 0);

      const historyMap: Record<string, any[]> = {};
      if (Array.isArray(res)) {
        res.forEach((entityHistory: any[]) => {
          if (entityHistory && entityHistory.length > 0) {
            const entId = entityHistory[0].entity_id;
            if (entId) {
              historyMap[entId] = entityHistory;
              console.info(`[energy-flow-card] Stored history for ${entId}, points: ${entityHistory.length}`);
            }
          }
        });
      }
      this.hourlyHistoryData = historyMap;
    } catch (e) {
      console.error('[energy-flow-card] Failed to fetch history:', e);
    } finally {
      this.isFetchingHistory = false;
    }
  }

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

      const hourlyStartTime = new Date(now.getTime() - 30 * 60 * 60 * 1000).toISOString();
      const hourlyRes = await (this.hass as any).callWS({
        type: 'recorder/statistics_during_period',
        start_time: hourlyStartTime,
        statistic_ids: entityIds,
        period: 'hour'
      });
      this.hourlyStatsData = hourlyRes || {};
    } catch (e) {
      console.warn('[energy-flow-card] Failed to fetch stats via WS:', e);
      this.statsData = {};
      this.hourlyStatsData = {};
    } finally {
      this.isLoadingHistory = false;
    }
  }

  private getStatPointValue(point: any, entityId: string): number {
    if (!point) return 0;
    
    let val: any = 0;
    if (point.mean !== undefined && point.mean !== null) {
      val = point.mean;
    } else if (point.change !== undefined && point.change !== null) {
      val = point.change;
    } else {
      val = point.state !== undefined ? point.state : 0;
    }
    
    const parsed = typeof val === 'number' ? val : parseFloat(val);
    return isNaN(parsed) ? 0 : parsed;
  }

  private getProcessedSingleData(entityId: string): { label: string; value: number }[] {
    const raw = this.statsData[entityId] || [];
    const now = new Date();
    const currentYear = now.getFullYear();
    const currentMonth = now.getMonth();

    if (this.activeTab === 'month') {
      const dailyPoints = raw.filter(point => {
        const date = new Date(point.start);
        return date.getFullYear() === currentYear && date.getMonth() === currentMonth;
      });
      return dailyPoints.map(point => {
        const date = new Date(point.start);
        return {
          label: date.toLocaleDateString('nl-NL', { day: 'numeric', month: 'short' }),
          value: this.getStatPointValue(point, entityId)
        };
      });
    } else if (this.activeTab === 'year') {
      const monthlyGroups: Record<string, { label: string; sum: number }> = {};
      raw.forEach(point => {
        const date = new Date(point.start);
        if (date.getFullYear() !== currentYear) return;
        const month = date.getMonth();
        const monthKey = `${currentYear}-${month.toString().padStart(2, '0')}`;
        const monthLabel = date.toLocaleDateString('nl-NL', { month: 'short' });
        if (!monthlyGroups[monthKey]) {
          monthlyGroups[monthKey] = { label: monthLabel, sum: 0 };
        }
        monthlyGroups[monthKey].sum += this.getStatPointValue(point, entityId);
      });
      return Object.keys(monthlyGroups)
        .sort()
        .map(key => ({
          label: monthlyGroups[key].label,
          value: monthlyGroups[key].sum
        }));
    } else {
      return [];
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
    const now = new Date();
    const currentYear = now.getFullYear();
    const currentMonth = now.getMonth();

    if (this.activeTab === 'month') {
      const currentMonthStarts = sortedStarts.filter(startStr => {
        const date = new Date(startStr);
        return date.getFullYear() === currentYear && date.getMonth() === currentMonth;
      });

      return currentMonthStarts.map(startStr => {
        const date = new Date(startStr);
        const dateKey = date.toDateString();
        return {
          label: date.toLocaleDateString('nl-NL', { day: 'numeric', month: 'short' }),
          importValue: importMap.get(dateKey) || 0,
          exportValue: exportMap.get(dateKey) || 0
        };
      });
    } else {
      // activeTab === 'year'
      const monthlyGroups: Record<string, { label: string; importSum: number; exportSum: number }> = {};
      sortedStarts.forEach(startStr => {
        const date = new Date(startStr);
        if (date.getFullYear() !== currentYear) return;
        const month = date.getMonth();
        const monthKey = `${currentYear}-${month.toString().padStart(2, '0')}`;
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
        .map(key => ({
          label: monthlyGroups[key].label,
          importValue: monthlyGroups[key].importSum,
          exportValue: monthlyGroups[key].exportSum
        }));
    }
  }

  private getProcessedHourlySingleData(entityId: string): { label: string; value: number }[] {
    const raw = this.hourlyStatsData[entityId] || [];
    const now = new Date();
    const currentYear = now.getFullYear();
    const currentMonth = now.getMonth();
    const currentDate = now.getDate();

    const data = [];
    const pointsMap = new Map<number, number>();

    raw.forEach(point => {
      const date = new Date(point.start);
      if (date.getFullYear() === currentYear && date.getMonth() === currentMonth && date.getDate() === currentDate) {
        pointsMap.set(date.getHours(), this.getStatPointValue(point, entityId));
      }
    });

    for (let hour = 0; hour < 24; hour++) {
      const hourStr = `${hour.toString().padStart(2, '0')}:00`;
      data.push({
        label: hourStr,
        value: pointsMap.get(hour) || 0
      });
    }
    return data;
  }

  private getProcessedHourlyGridData(importEntity: string, exportEntity: string): { label: string; importValue: number; exportValue: number; price: number; timeLabel: string }[] {
    const importRaw = this.hourlyStatsData[importEntity] || [];
    const exportRaw = this.hourlyStatsData[exportEntity] || [];

    const importMap = new Map<number, number>();
    const exportMap = new Map<number, number>();

    const now = new Date();
    const currentYear = now.getFullYear();
    const currentMonth = now.getMonth();
    const currentDate = now.getDate();

    importRaw.forEach(p => {
      const d = new Date(p.start);
      if (d.getFullYear() === currentYear && d.getMonth() === currentMonth && d.getDate() === currentDate) {
        importMap.set(d.getHours(), this.getStatPointValue(p, importEntity));
      }
    });
    exportRaw.forEach(p => {
      const d = new Date(p.start);
      if (d.getFullYear() === currentYear && d.getMonth() === currentMonth && d.getDate() === currentDate) {
        exportMap.set(d.getHours(), this.getStatPointValue(p, exportEntity));
      }
    });

    const gridPriceState = this.config?.entities.grid_price ? this.hass?.states[this.config.entities.grid_price] : null;
    const forecast = gridPriceState?.attributes?.forecast || [];

    const data = [];
    for (let hour = 0; hour < 24; hour++) {
      const forecastEntry = forecast.find((entry: any) => {
        const d = new Date(entry.datetime);
        return d.getFullYear() === currentYear && d.getMonth() === currentMonth && d.getDate() === currentDate && d.getHours() === hour;
      });

      const price = forecastEntry ? parseFloat(forecastEntry.electricity_price) / 10000000 : 0;
      const hourStr = `${hour.toString().padStart(2, '0')}:00`;
      
      const importValue = importMap.get(hour) || 0;
      const exportValue = exportMap.get(hour) || 0;

      data.push({
        label: hourStr,
        importValue,
        exportValue,
        price,
        timeLabel: hourStr
      });
    }

    return data;
  }

  private renderUnifiedLineChart(solarEntity: string, homeEntity: string): TemplateResult {
    const now = new Date();
    const currentYear = now.getFullYear();
    const currentMonth = now.getMonth();
    const currentDate = now.getDate();

    const startTime = new Date(currentYear, currentMonth, currentDate, 0, 0, 0).getTime();
    const endTime = new Date(currentYear, currentMonth, currentDate, 23, 59, 59).getTime();

    // 1. Fetch today's price forecast
    const gridPriceState = this.config?.entities.grid_price ? this.hass?.states[this.config.entities.grid_price] : null;
    const forecast = gridPriceState?.attributes?.forecast || [];
    
    const prices: number[] = [];
    const pricePoints = [];
    for (let hour = 0; hour < 24; hour++) {
      const forecastEntry = forecast.find((entry: any) => {
        const d = new Date(entry.datetime);
        return d.getFullYear() === currentYear && d.getMonth() === currentMonth && d.getDate() === currentDate && d.getHours() === hour;
      });
      const price = forecastEntry ? parseFloat(forecastEntry.electricity_price) / 10000000 : 0;
      prices.push(price);
      pricePoints.push({ hour, price });
    }

    const maxPrice = Math.max(...prices, 0.40);
    const minPrice = Math.min(...prices, 0.0);
    const priceRange = maxPrice - minPrice;

    const parseHistory = (entId: string) => {
      const raw = this.hourlyHistoryData[entId] || [];
      const parsed = raw.map((p: any) => {
        const state = parseFloat(p.s !== undefined ? p.s : p.state);
        const time = (p.t !== undefined ? p.t * 1000 : new Date(p.last_changed || p.last_updated).getTime());
        return { state: isNaN(state) ? 0 : state, time };
      }).sort((a, b) => a.time - b.time);

      if (parsed.length > 300) {
        const factor = Math.ceil(parsed.length / 300);
        const downsampled = [];
        for (let i = 0; i < parsed.length; i += factor) {
          downsampled.push(parsed[i]);
        }
        if (downsampled[downsampled.length - 1] !== parsed[parsed.length - 1]) {
          downsampled.push(parsed[parsed.length - 1]);
        }
        return downsampled;
      }
      return parsed;
    };

    const solarPowerEnt = this.config?.entities.solar || (this.config?.entities as any).solar_power || '';
    const homePowerEnt = this.config?.entities.load || (this.config?.entities as any).home_power || '';

    const solarHistory = parseHistory(solarPowerEnt);
    const homeHistory = parseHistory(homePowerEnt);

    console.info(`[energy-flow-card] solarHistory count: ${solarHistory.length}, first: ${solarHistory.length > 0 ? JSON.stringify(solarHistory[0]) : 'none'}, last: ${solarHistory.length > 0 ? JSON.stringify(solarHistory[solarHistory.length - 1]) : 'none'}`);
    console.info(`[energy-flow-card] homeHistory count: ${homeHistory.length}, first: ${homeHistory.length > 0 ? JSON.stringify(homeHistory[0]) : 'none'}, last: ${homeHistory.length > 0 ? JSON.stringify(homeHistory[homeHistory.length - 1]) : 'none'}`);

    console.info('[energy-flow-card] rendering unified line chart:', {
      solarPowerEnt,
      homePowerEnt,
      solarHistoryLen: solarHistory.length,
      homeHistoryLen: homeHistory.length,
      maxPower: Math.max(...[...solarHistory.map(p => p.state), ...homeHistory.map(p => p.state)], 1000),
      isFetchingHistory: this.isFetchingHistory
    });

    // Get max power for Y scaling
    const allPowerValues = [...solarHistory.map(p => p.state), ...homeHistory.map(p => p.state)];
    const maxPower = Math.max(...allPowerValues, 1000);

    // SVG Layout
    const chartLeft = 45;
    const chartRight = 450;
    const chartWidth = chartRight - chartLeft;
    const chartTop = 20;
    const chartHeight = 120;
    const chartBottom = chartTop + chartHeight;

    // Helper to map time & power value to SVG coordinates
    const getCoords = (time: number, value: number) => {
      const x = chartLeft + ((time - startTime) / (endTime - startTime)) * chartWidth;
      const y = chartBottom - (Math.max(0, value) / maxPower) * chartHeight;
      return { x: Math.min(chartRight, Math.max(chartLeft, x)), y: Math.min(chartBottom, Math.max(chartTop, y)) };
    };

    // Helper to map time & price value to SVG coordinates
    const getPriceCoords = (time: number, price: number) => {
      const x = chartLeft + ((time - startTime) / (endTime - startTime)) * chartWidth;
      const y = chartBottom - ((price - minPrice) / (priceRange || 1)) * chartHeight;
      return { x: Math.min(chartRight, Math.max(chartLeft, x)), y: Math.min(chartBottom, Math.max(chartTop, y)) };
    };

    // Build Solar Line & Area Paths
    let solarLinePath = '';
    let solarAreaPath = '';
    if (solarHistory.length > 0) {
      const pts = solarHistory.map(p => getCoords(p.time, p.state));
      solarLinePath = `M ${pts[0].x} ${pts[0].y} ` + pts.slice(1).map(p => `L ${p.x} ${p.y}`).join(' ');
      solarAreaPath = `M ${pts[0].x} ${chartBottom} ` + pts.map(p => `L ${p.x} ${p.y}`).join(' ') + ` L ${pts[pts.length-1].x} ${chartBottom} Z`;
    }

    // Build Home Line & Area Paths
    let homeLinePath = '';
    let homeAreaPath = '';
    if (homeHistory.length > 0) {
      const pts = homeHistory.map(p => getCoords(p.time, p.state));
      homeLinePath = `M ${pts[0].x} ${pts[0].y} ` + pts.slice(1).map(p => `L ${p.x} ${p.y}`).join(' ');
      homeAreaPath = `M ${pts[0].x} ${chartBottom} ` + pts.map(p => `L ${p.x} ${p.y}`).join(' ') + ` L ${pts[pts.length-1].x} ${chartBottom} Z`;
    }

    // Build Price stepped path (spanning full 24h)
    let priceLinePath = '';
    let priceAreaPath = '';
    if (pricePoints.length > 0) {
      const pts: {x: number, y: number}[] = [];
      pricePoints.forEach((p, idx) => {
        const hourStart = startTime + p.hour * 60 * 60 * 1000;
        const hourEnd = hourStart + 60 * 60 * 1000;
        
        const startCoords = getPriceCoords(hourStart, p.price);
        const endCoords = getPriceCoords(hourEnd, p.price);
        
        if (idx === 0) {
          pts.push(startCoords);
        }
        pts.push(endCoords);
      });
      priceLinePath = `M ${pts[0].x} ${pts[0].y} ` + pts.slice(1).map(p => `L ${p.x} ${p.y}`).join(' ');
      priceAreaPath = `M ${pts[0].x} ${chartBottom} ` + pts.map(p => `L ${p.x} ${p.y}`).join(' ') + ` L ${pts[pts.length-1].x} ${chartBottom} Z`;
    }

    // Y Gridlines
    const gridLines = [];
    const gridCount = 4;
    for (let i = 0; i <= gridCount; i++) {
      const powerVal = (maxPower * i) / gridCount;
      const y = chartBottom - (powerVal / maxPower) * chartHeight;
      gridLines.push({ powerVal, y });
    }

    // Price Labels
    const priceLabels = [];
    for (let i = 0; i <= gridCount; i++) {
      const priceVal = minPrice + (priceRange * i) / gridCount;
      const y = chartBottom - ((priceVal - minPrice) / (priceRange || 1)) * chartHeight;
      priceLabels.push({ priceVal, y });
    }

    console.info(`[energy-flow-card] solarLinePath: ${solarLinePath}`);
    console.info(`[energy-flow-card] homeLinePath: ${homeLinePath}`);

    const solarLive = this.getEntityValue(this.config?.entities.solar || (this.config?.entities as any).solar_power);
    const homeLive = this.getEntityValue(this.config?.entities.load || (this.config?.entities as any).home_power);
    const priceLive = gridPriceState ? parseFloat(gridPriceState.state) : 0;
    const homeTodayVal = this.parseEntityFloat(this.config?.entities.home_today) || 0;
    const solarTodayVal = this.parseEntityFloat(this.config?.entities.solar_energy_today || (this.config?.entities as any).solar_today) || 0;

    return html`
      <div style="display: grid; grid-template-columns: repeat(5, 1fr); gap: 6px; margin-bottom: 12px; padding: 0 4px; box-sizing: border-box; text-align: center;">
        <div style="background: rgba(255,255,255,0.02); border: 1px solid rgba(255,255,255,0.05); border-radius: 8px; padding: 6px 2px;">
          <div style="font-size: 13px; font-weight: bold; color: #fbbf24; white-space: nowrap;">${solarLive >= 1000 ? `${(solarLive / 1000).toFixed(1)} kW` : `${Math.round(solarLive)} W`}</div>
          <div style="font-size: 8px; color: rgba(255,255,255,0.45); margin-top: 2px; text-transform: uppercase; font-weight: bold; white-space: nowrap;">Solar (Live)</div>
        </div>
        <div style="background: rgba(255,255,255,0.02); border: 1px solid rgba(255,255,255,0.05); border-radius: 8px; padding: 6px 2px;">
          <div style="font-size: 13px; font-weight: bold; color: #a78bfa; white-space: nowrap;">${homeLive >= 1000 ? `${(homeLive / 1000).toFixed(1)} kW` : `${Math.round(homeLive)} W`}</div>
          <div style="font-size: 8px; color: rgba(255,255,255,0.45); margin-top: 2px; text-transform: uppercase; font-weight: bold; white-space: nowrap;">Huis (Live)</div>
        </div>
        <div style="background: rgba(255,255,255,0.02); border: 1px solid rgba(255,255,255,0.05); border-radius: 8px; padding: 6px 2px;">
          <div style="font-size: 13px; font-weight: bold; color: #f59e0b; white-space: nowrap;">€${priceLive.toFixed(2).replace('.', ',')}</div>
          <div style="font-size: 8px; color: rgba(255,255,255,0.45); margin-top: 2px; text-transform: uppercase; font-weight: bold; white-space: nowrap;">Tarief</div>
        </div>
        <div style="background: rgba(255,255,255,0.02); border: 1px solid rgba(255,255,255,0.05); border-radius: 8px; padding: 6px 2px;">
          <div style="font-size: 13px; font-weight: bold; color: #60a5fa; white-space: nowrap;">${homeTodayVal.toFixed(1)} kWh</div>
          <div style="font-size: 8px; color: rgba(255,255,255,0.45); margin-top: 2px; text-transform: uppercase; font-weight: bold; white-space: nowrap;">Verbruik</div>
        </div>
        <div style="background: rgba(255,255,255,0.02); border: 1px solid rgba(255,255,255,0.05); border-radius: 8px; padding: 6px 2px;">
          <div style="font-size: 13px; font-weight: bold; color: #10b981; white-space: nowrap;">${solarTodayVal.toFixed(1)} kWh</div>
          <div style="font-size: 8px; color: rgba(255,255,255,0.45); margin-top: 2px; text-transform: uppercase; font-weight: bold; white-space: nowrap;">Opwek</div>
        </div>
      </div>

      <div style="display: block !important; width: 100% !important; height: 170px !important; position: relative !important; margin: 0 !important; padding: 0 !important; overflow: hidden !important;">
        ${this.isFetchingHistory && solarHistory.length === 0 ? html`<div class="chart-loading" style="position: absolute; inset: 0; display: flex; align-items: center; justify-content: center; background: rgba(15,23,42,0.4); z-index: 10;">Geschiedenis laden...</div>` : ''}
        <svg viewBox="0 0 500 190" style="display: block !important; width: 100% !important; height: 155px !important; margin: 0 !important; padding: 0 !important; background: rgba(255,255,255,0.03) !important;">
          <defs>
            <linearGradient id="solar-area-grad" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stop-color="#fbbf24" stop-opacity="0.2" />
              <stop offset="100%" stop-color="#fbbf24" stop-opacity="0.0" />
            </linearGradient>
            <linearGradient id="home-area-grad" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stop-color="#a78bfa" stop-opacity="0.2" />
              <stop offset="100%" stop-color="#a78bfa" stop-opacity="0.0" />
            </linearGradient>
            <linearGradient id="price-area-grad" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stop-color="#ffffff" stop-opacity="0.04" />
              <stop offset="100%" stop-color="#ffffff" stop-opacity="0.0" />
            </linearGradient>
          </defs>

          <!-- Gridlines & Left Y-Axis labels (Power) -->
          ${gridLines.map(g => svg`
            <line x1="${chartLeft}" y1="${g.y}" x2="${chartRight}" y2="${g.y}" stroke="rgba(255,255,255,0.12)" stroke-width="1" stroke-dasharray="2,2" />
            <text x="${chartLeft - 6}" y="${g.y + 3}" text-anchor="end" fill="rgba(255,255,255,0.6)" font-size="8.5px" font-family="sans-serif">
              ${g.powerVal >= 1000 ? `${(g.powerVal / 1000).toFixed(1)} kW` : `${Math.round(g.powerVal)} W`}
            </text>
          `)}

          <!-- Right Y-Axis labels (Price) -->
          ${priceLabels.map(p => svg`
            <text x="${chartRight + 6}" y="${p.y + 3}" text-anchor="start" fill="rgba(255,255,255,0.6)" font-size="8.5px" font-family="sans-serif">
              €${p.priceVal.toFixed(2).replace('.', ',')}
            </text>
          `)}

          <!-- Price Forecast Area & Line (Subtle background) -->
          ${priceLinePath ? svg`
            <path d="${priceAreaPath}" fill="url(#price-area-grad)" />
            <path d="${priceLinePath}" fill="none" stroke="rgba(255,255,255,0.3)" stroke-width="1.5" stroke-dasharray="3,3" />
          ` : ''}

          <!-- Solar Area & Line -->
          ${solarLinePath ? svg`
            <path d="${solarAreaPath}" fill="url(#solar-area-grad)" />
            <path d="${solarLinePath}" fill="none" stroke="#fbbf24" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round" />
          ` : ''}

          <!-- Home Area & Line -->
          ${homeLinePath ? svg`
            <path d="${homeAreaPath}" fill="url(#home-area-grad)" />
            <path d="${homeLinePath}" fill="none" stroke="#a78bfa" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round" />
          ` : ''}

          <!-- X Axis Labels (every 4 hours) -->
          ${Array.from({length: 7}).map((_, i) => {
            const hour = i * 4;
            const hourStr = `${hour.toString().padStart(2, '0')}:00`;
            const x = chartLeft + (hour / 24) * chartWidth;
            return svg`
              <text x="${x}" y="${chartBottom + 16}" text-anchor="middle" fill="rgba(255,255,255,0.45)" font-size="9px" font-family="sans-serif">
                ${hourStr}
              </text>
            `;
          })}
        </svg>
      </div>
    `;
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
    
    if (this.activePopup === 'unified_chart') {
      const solarPowerEnt = this.config?.entities.solar || (this.config?.entities as any).solar_power || '';
      const homePowerEnt = this.config?.entities.load || (this.config?.entities as any).home_power || '';

      return html`
        <div class="glass-popup-overlay" @click=${this.closePopup}>
          <div class="glass-popup-card" style="height: auto; width: 550px; max-width: 95vw; padding: 20px;" @click=${(e: Event) => e.stopPropagation()}>
            <button class="glass-popup-close" @click=${this.closePopup}>&times;</button>
            
            <div class="glass-popup-header" style="margin-bottom: 16px;">
              <div class="glass-popup-title">Prestaties & Tarieven Vandaag</div>
              <div class="glass-popup-subtitle">Live vermogen en prijsverloop</div>
            </div>

            <div class="glass-popup-chart-container" style="background: transparent; border: none; padding: 0; display: block; height: 180px; width: 100%;">
              ${this.renderUnifiedLineChart(solarPowerEnt, homePowerEnt)}
            </div>
          </div>
        </div>
      `;
    }

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
      if (this.activeTab === 'today') {
        if (this.isLoadingHistory) {
          chartHtml = html`<div class="chart-loading">Gegevens laden...</div>`;
        } else if (!entityId || !this.hourlyStatsData[entityId] || this.hourlyStatsData[entityId].length === 0) {
          chartHtml = html`<div class="chart-no-data">Geen uurlijkse gegevens beschikbaar voor vandaag.</div>`;
        } else {
          const homeEnt = entities.home_today || '';
          if (this.showPowerValue && homeEnt) {
            chartHtml = this.renderUnifiedLineChart(entityId, homeEnt);
          } else {
            const currentHour = new Date().getHours();
            const processed = this.getProcessedHourlySingleData(entityId).filter((_, idx) => idx <= currentHour);
            const maxVal = Math.max(...processed.map(i => i.value)) || 1;
            chartHtml = html`
              <div class="scrollable-chart-container">
                <div class="glass-bar-chart">
                  ${processed.map(item => {
                    const percent = (item.value / maxVal) * 80;
                    return html`
                      <div class="chart-column">
                        <div class="chart-bar-wrapper">
                          <div class="chart-bar solar-bar" style="height: ${Math.max(4, percent)}%;">
                            <span class="bar-value">${item.value.toFixed(1)}</span>
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
      } else {
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
                          <span class="bar-value">${item.value.toFixed(this.activeTab === 'month' ? 1 : 0)}</span>
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
      if (this.activeTab === 'today') {
        if (this.isLoadingHistory) {
          chartHtml = html`<div class="chart-loading">Gegevens laden...</div>`;
        } else if (!entityId || !this.hourlyStatsData[entityId] || this.hourlyStatsData[entityId].length === 0) {
          chartHtml = html`<div class="chart-no-data">Geen uurlijkse gegevens beschikbaar voor vandaag.</div>`;
        } else {
          const solarEnt = entities.solar_energy_today || (entities as any).solar_today || '';
          if (this.showPowerValue && solarEnt) {
            chartHtml = this.renderUnifiedLineChart(solarEnt, entityId);
          } else {
            const currentHour = new Date().getHours();
            const processed = this.getProcessedHourlySingleData(entityId).filter((_, idx) => idx <= currentHour);
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
                            <span class="bar-value">${item.value.toFixed(1)}</span>
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
      } else {
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
                          <span class="bar-value">${item.value.toFixed(this.activeTab === 'month' ? 1 : 0)}</span>
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

      // Calculate today's costs from statistics (change value for today),
      // NOT from raw sensor state (which is cumulative and may not reset at same time as kWh)
      const todayDateStr = new Date().toDateString();
      const getTodayCostFromStats = (entityId: string): number | null => {
        const pts = this.statsData[entityId];
        if (!pts || pts.length === 0) return null;
        const todayPt = pts.find((p: any) => new Date(p.start).toDateString() === todayDateStr);
        if (!todayPt) return null;
        // Use 'change' if available (cumulative sensor), otherwise 'state'
        const val = todayPt.change !== undefined && todayPt.change !== null ? todayPt.change : todayPt.state;
        return typeof val === 'number' ? val : parseFloat(val);
      };

      if (impCostEntity) {
        const fromStats = getTodayCostFromStats(impCostEntity);
        // Only use stats value; if no today entry yet (e.g. just after midnight), show 0
        costTodayImport = (fromStats !== null && !isNaN(fromStats)) ? fromStats : 0;
      }
      if (expCostEntity) {
        const fromStats = getTodayCostFromStats(expCostEntity);
        costTodayExport = (fromStats !== null && !isNaN(fromStats)) ? fromStats : 0;
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
      } else if (this.activeTab === 'today') {
        if (this.isLoadingHistory) {
          chartHtml = html`<div class="chart-loading">Gegevens laden...</div>`;
        } else {
          const targetImp = impEntity || '';
          const targetExp = expEntity || '';

          if (!targetImp || !targetExp || (!this.hourlyStatsData[targetImp] && !this.hourlyStatsData[targetExp])) {
            chartHtml = html`<div class="chart-no-data">Geen uurlijkse gegevens beschikbaar voor vandaag.</div>`;
          } else {
            const solarEnt = entities.solar_energy_today || (entities as any).solar_today || '';
            const homeEnt = entities.home_today || '';
            if (this.showPowerValue && solarEnt && homeEnt) {
              chartHtml = this.renderUnifiedLineChart(solarEnt, homeEnt);
            } else {
              const currentHour = new Date().getHours();
              const processed = this.getProcessedHourlyGridData(targetImp, targetExp).filter((_, idx) => idx <= currentHour);
              // Chronological order (no price sorting)
              const maxVal = Math.max(...processed.map(i => Math.max(i.importValue, i.exportValue))) || 1;
              chartHtml = html`
                <div class="scrollable-chart-container">
                  <div class="glass-bar-chart">
                    ${processed.map(item => {
                      const importPercent = (item.importValue / maxVal) * 80;
                      const exportPercent = (item.exportValue / maxVal) * 80;
                      return html`
                        <div class="chart-column" style="min-width: 60px;">
                          <div class="chart-values-stacked">
                            <span class="stacked-val import-color">
                              ${item.importValue > 0 ? item.importValue.toFixed(1) : ''}
                            </span>
                            <span class="stacked-val export-color">
                              ${item.exportValue > 0 ? item.exportValue.toFixed(1) : ''}
                            </span>
                          </div>
      
                          <div class="grid-double-bar-wrapper">
                            <div class="grid-import-bar-wrapper">
                              <div class="grid-import-bar" style="height: ${Math.max(4, importPercent)}%;"></div>
                            </div>
                            <div class="grid-export-bar-wrapper">
                              <div class="grid-export-bar" style="height: ${Math.max(4, exportPercent)}%;"></div>
                            </div>
                          </div>
                          <span class="chart-label" style="font-size: 10px; margin-top: 4px; font-weight: bold; color: #ffffff;">${item.timeLabel}</span>
                          <span style="font-size: 9px; color: rgba(255,255,255,0.45); font-weight: normal; margin-top: 2px;">€ ${item.price.toFixed(2).replace('.', ',')}</span>
                        </div>
                      `;
                    })}
                  </div>
                </div>
              `;
            }
          }
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
                            ${item.importValue.toFixed(this.activeTab === 'month' ? 1 : 0)}
                          </span>
                          <span class="stacked-val export-color">
                            ${item.exportValue.toFixed(this.activeTab === 'month' ? 1 : 0)}
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
          <div class="popup-tabs" style="display: flex; justify-content: space-between; align-items: center;">
            <div style="display: flex; gap: 8px;">
              ${this.activePopup === 'grid' ? html`
                <button class="popup-tab-btn ${this.activeTab === 'today' ? 'active' : ''}" @click=${() => this.switchTab('today')}>Vandaag</button>
                <button class="popup-tab-btn ${this.activeTab === 'prices' ? 'active' : ''}" @click=${() => this.switchTab('prices')}>Prijs</button>
                <button class="popup-tab-btn ${this.activeTab === 'month' ? 'active' : ''}" @click=${() => this.switchTab('month')}>Maand</button>
                <button class="popup-tab-btn ${this.activeTab === 'year' ? 'active' : ''}" @click=${() => this.switchTab('year')}>Jaar</button>
              ` : html`
                <button class="popup-tab-btn ${this.activeTab === 'today' ? 'active' : ''}" @click=${() => this.switchTab('today')}>Vandaag</button>
                <button class="popup-tab-btn ${this.activeTab === 'month' ? 'active' : ''}" @click=${() => this.switchTab('month')}>Maand</button>
                <button class="popup-tab-btn ${this.activeTab === 'year' ? 'active' : ''}" @click=${() => this.switchTab('year')}>Jaar</button>
              `}
            </div>

            ${this.activeTab === 'today' ? html`
              <button class="popup-tab-btn" style="background: rgba(255,255,255,0.06); border: 1px solid rgba(255,255,255,0.1); padding: 4px 10px; font-size: 11px; text-transform: uppercase; font-weight: bold; border-radius: 6px; letter-spacing: 0.02em;" @click=${this.togglePowerUnit}>
                ${this.showPowerValue ? 'Toon kWh' : 'Toon kW'}
              </button>
            ` : ''}
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
                : `${this.activeTab === 'month' ? 'Afgelopen maand' : (this.activeTab === 'today' ? 'Vandaag' : 'Jaaroverzicht')} (${this.showPowerValue && this.activeTab === 'today' ? 'kW' : 'kWh'})`}
            </div>
            ${chartHtml}
          </div>
        </div>
      </div>
    `;
  }

  private switchTab(tab: 'today' | 'prices' | 'month' | 'year'): void {
    this.activeTab = tab;
    if (tab === 'today' && this.showPowerValue) {
      this.fetchHighResolutionHistory();
    }
    setTimeout(() => {
      const container = this.shadowRoot?.querySelector('.scrollable-chart-container');
      if (container) {
        container.scrollLeft = container.scrollWidth;
      }
    }, 100);
  }

  private openUnifiedChartPopup(): void {
    this.activePopup = 'unified_chart';
    this.activeTab = 'today';
    this.showPowerValue = true;
    this.fetchHighResolutionHistory();
  }

  private togglePowerUnit(e: Event): void {
    e.stopPropagation();
    this.showPowerValue = !this.showPowerValue;
    if (this.showPowerValue && this.activeTab === 'today') {
      this.fetchHighResolutionHistory();
    }
    console.info(`[energy-flow-card] Toggled showPowerValue to: ${this.showPowerValue}`);
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
      this.activeTab = 'today';
      this.statsData = {};
      this.hourlyStatsData = {};
      
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
          <!-- Floating Grafiek Button (Top Right) -->
          <div style="position: absolute; right: 16px; top: 16px; z-index: 100;" @click=${(e: Event) => e.stopPropagation()}>
            <button @click=${(e: Event) => { e.stopPropagation(); this.openUnifiedChartPopup(); }} style="background: rgba(15, 23, 42, 0.75); backdrop-filter: blur(8px); border: 1px solid rgba(255,255,255,0.18); color: #fff; padding: 6px 12px; border-radius: 20px; font-size: 11px; cursor: pointer; display: flex; align-items: center; gap: 6px; font-weight: 600; box-shadow: 0 4px 12px rgba(0,0,0,0.3); transition: background 0.2s ease;">
              <ha-icon icon="mdi:chart-line" style="--mdc-icon-size: 14px; width: 14px; height: 14px; color: #10b981;"></ha-icon>
              Prestaties Grafiek
            </button>
          </div>

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
