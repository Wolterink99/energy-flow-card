import { LitElement, html, TemplateResult } from 'lit';
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
        <svg width="${size}" height="${size}" viewBox="0 0 24 24" style="width: ${size}px; height: ${size}px; flex-shrink: 0; display: block; margin: 0 auto;">
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
        <svg width="${size}" height="${size}" viewBox="0 0 24 24" style="width: ${size}px; height: ${size}px; flex-shrink: 0; display: block; margin: 0 auto;">
          <path d="M12 3a9 9 0 1 0 9 9 9.75 9.75 0 0 1-9-9Z" fill="#fbbf24" stroke="#d97706" stroke-width="0.5" />
          <path d="M18 4v2m-1-1h2" stroke="#ffffff" stroke-width="0.8" stroke-linecap="round" />
        </svg>
      `;
    case 'cloudy':
      return html`
        <svg width="${size}" height="${size}" viewBox="0 0 24 24" style="width: ${size}px; height: ${size}px; flex-shrink: 0; display: block; margin: 0 auto;">
          <path d="M6 18a4 4 0 0 1-1-7.87 6 6 0 0 1 11.75-1.68 4.5 4.5 0 0 1 3.25 8.55Z" fill="#64748b" />
          <path d="M4 19a3 3 0 0 1-.75-5.9 4.5 4.5 0 0 1 8.81-1.26 3.38 3.38 0 0 1 2.44 6.41Z" fill="#94a3b8" opacity="0.85" transform="translate(-2, 1)" />
        </svg>
      `;
    case 'partlycloudy':
      if (isNight) {
        return html`
          <svg width="${size}" height="${size}" viewBox="0 0 24 24" style="width: ${size}px; height: ${size}px; flex-shrink: 0; display: block; margin: 0 auto;">
            <g transform="translate(1, -2)">
              <path d="M11 4a7 7 0 1 0 7 7 7.6 7.6 0 0 1-7-7Z" fill="#fbbf24" opacity="0.8" />
            </g>
            <path d="M6 18a3.5 3.5 0 0 1-.87-6.88 5 5 0 0 1 9.8-1.4 3.75 3.75 0 0 1 2.7 7.13Z" fill="#64748b" />
          </svg>
        `;
      }
      return html`
        <svg width="${size}" height="${size}" viewBox="0 0 24 24" style="width: ${size}px; height: ${size}px; flex-shrink: 0; display: block; margin: 0 auto;">
          <g transform="translate(-2, -2)">
            <circle cx="11" cy="11" r="4.5" fill="#fbbf24" />
            <g stroke="#fbbf24" stroke-width="1.5" stroke-linecap="round">
              <line x1="11" y1="3" x2="11" y2="4.5" />
              <line x1="11" y1="17.5" x2="11" y2="19" />
              <line x1="3" y1="11" x2="4.5" y2="11" />
              <line x1="17.5" y1="11" x2="19" y2="11" />
            </g>
          </g>
          <path d="M8 18a3.5 3.5 0 0 1-.87-6.88 5 5 0 0 1 9.8-1.4 3.75 3.75 0 0 1 2.7 7.13Z" fill="#e2e8f0" stroke="#cbd5e1" stroke-width="0.5" />
        </svg>
      `;
    case 'rainy':
    case 'pouring':
      if (isNight) {
        return html`
          <svg width="${size}" height="${size}" viewBox="0 0 24 24" style="width: ${size}px; height: ${size}px; flex-shrink: 0; display: block; margin: 0 auto;">
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
        <svg width="${size}" height="${size}" viewBox="0 0 24 24" style="width: ${size}px; height: ${size}px; flex-shrink: 0; display: block; margin: 0 auto;">
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
          <svg width="${size}" height="${size}" viewBox="0 0 24 24" style="width: ${size}px; height: ${size}px; flex-shrink: 0; display: block; margin: 0 auto;">
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
        <svg width="${size}" height="${size}" viewBox="0 0 24 24" style="width: ${size}px; height: ${size}px; flex-shrink: 0; display: block; margin: 0 auto;">
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
          <svg width="${size}" height="${size}" viewBox="0 0 24 24" style="width: ${size}px; height: ${size}px; flex-shrink: 0; display: block; margin: 0 auto;">
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
        <svg width="${size}" height="${size}" viewBox="0 0 24 24" style="width: ${size}px; height: ${size}px; flex-shrink: 0; display: block; margin: 0 auto;">
          <path d="M8 15a3.5 3.5 0 0 1-.87-6.88 5 5 0 0 1 9.8-1.4 3.75 3.75 0 0 1 2.7 7.13Z" fill="#64748b" />
          <circle cx="8" cy="18" r="1.2" fill="#ffffff" />
          <circle cx="12" cy="19" r="1.2" fill="#ffffff" />
          <circle cx="16" cy="18" r="1.2" fill="#ffffff" />
        </svg>
      `;
    case 'windy':
    case 'windy-variant':
      return html`
        <svg width="${size}" height="${size}" viewBox="0 0 24 24" style="width: ${size}px; height: ${size}px; flex-shrink: 0; display: block; margin: 0 auto;">
          <g stroke="#cbd5e1" stroke-width="2" stroke-linecap="round" fill="none">
            <path d="M4 8h12a2 2 0 1 0-2-2" />
            <path d="M2 12h17a2.5 2.5 0 1 1-2.5 2.5" />
            <path d="M6 16h8a1.5 1.5 0 1 0-1.5-1.5" />
          </g>
        </svg>
      `;
    case 'fog':
      return html`
        <svg width="${size}" height="${size}" viewBox="0 0 24 24" style="width: ${size}px; height: ${size}px; flex-shrink: 0; display: block; margin: 0 auto;">
          <path d="M8 13a3.5 3.5 0 0 1-.87-6.88 5 5 0 0 1 9.8-1.4 3.75 3.75 0 0 1 2.7 7.13Z" fill="#94a3b8" opacity="0.7" />
          <g stroke="#cbd5e1" stroke-width="1.8" stroke-linecap="round">
            <line x1="4" y1="16" x2="20" y2="16" />
            <line x1="6" y1="19" x2="18" y2="19" />
          </g>
        </svg>
      `;
    default:
      return html`
        <svg width="${size}" height="${size}" viewBox="0 0 24 24" style="width: ${size}px; height: ${size}px; flex-shrink: 0; display: block; margin: 0 auto;">
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
  @state() private hasActiveHash: boolean = false;
  @state() private activePopup: string | null = null;
  @state() private activePopupHistory: { day: string; value: number }[] = [];
  @state() private isLoadingHistory: boolean = false;
  @state() private activeTab: 'day' | 'month' | 'year' = 'day';
  @state() private statsData: Record<string, any[]> = {};
  @state() private weatherForecast: any[] = [];

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

  private closePopup(): void {
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
      const pressure = weatherEntity.attributes.pressure;
      const friendlyName = weatherEntity.attributes.friendly_name || 'Weer';
      const condTranslated = WEATHER_TRANSLATIONS[state] || state;
      
      return html`
        <div class="glass-popup-overlay" @click=${this.closePopup}>
          <div class="glass-popup-card" @click=${(e: Event) => e.stopPropagation()}>
            <button class="glass-popup-close" @click=${this.closePopup}>&times;</button>
            
            <div class="glass-popup-header" style="margin-bottom: 24px;">
              <div class="glass-popup-title">${friendlyName}</div>
              <div class="glass-popup-subtitle">Actuele weersinformatie voor jouw locatie</div>
            </div>

            <div class="glass-popup-stats" style="grid-template-columns: 1fr 1fr; gap: 16px; margin-bottom: 24px;">
              <div class="glass-popup-stat" style="grid-column: span 2; display: flex; flex-direction: row; align-items: center; justify-content: space-between; padding: 20px;">
                <div>
                  <span class="stat-label">Conditie</span>
                  <span class="stat-value" style="font-size: 24px; color: #fbbf24; text-transform: capitalize;">${condTranslated}</span>
                </div>
                <div style="text-align: right;">
                  <span class="stat-label">Temperatuur</span>
                  <span class="stat-value" style="font-size: 32px; color: #ffffff;">${temp !== undefined ? `${temp} °C` : '—'}</span>
                </div>
              </div>

              <div class="glass-popup-stat">
                <span class="stat-label">Gevoelstemperatuur</span>
                <span class="stat-value" style="font-size: 18px; color: #cbd5e1;">${apparentTemp !== undefined ? `${apparentTemp} °C` : '—'}</span>
              </div>

              <div class="glass-popup-stat">
                <span class="stat-label">Windsnelheid</span>
                <span class="stat-value" style="font-size: 18px; color: #cbd5e1;">${windSpeed !== undefined ? `${windSpeed} km/h` : '—'}</span>
              </div>

              <div class="glass-popup-stat">
                <span class="stat-label">Luchtvochtigheid</span>
                <span class="stat-value" style="font-size: 18px; color: #cbd5e1;">${humidity !== undefined ? `${humidity}%` : '—'}</span>
              </div>

              <div class="glass-popup-stat">
                <span class="stat-label">Luchtdruk</span>
                <span class="stat-value" style="font-size: 18px; color: #cbd5e1;">${pressure !== undefined ? `${pressure} hPa` : '—'}</span>
              </div>
            </div>

            <div class="glass-popup-forecast-section" style="margin-top: auto; padding: 12px; background: rgba(255,255,255,0.02); border-radius: 12px; border: 1px solid rgba(255,255,255,0.04); box-sizing: border-box;">
              <div class="chart-title" style="margin-bottom: 8px; font-size: 11px; font-weight: bold; color: rgba(255,255,255,0.6); text-transform: uppercase;">Weersverwachting</div>
              <div style="display: flex; justify-content: space-between; gap: 6px;">
                ${this.weatherForecast && this.weatherForecast.length > 0 ? this.weatherForecast.slice(0, 5).map(day => {
                  const date = new Date(day.datetime);
                  const dayLabel = date.toLocaleDateString('nl-NL', { weekday: 'short' });
                  const precip = day.precipitation !== undefined ? day.precipitation : 0;
                  
                  return html`
                    <div style="flex: 1; background: rgba(255,255,255,0.03); border: 1px solid rgba(255,255,255,0.05); border-radius: 8px; padding: 6px 2px; text-align: center; display: flex; flex-direction: column; align-items: center; min-width: 0; gap: 4px;">
                      <span style="font-size: 11px; font-weight: bold; text-transform: uppercase; color: rgba(255,255,255,0.5);">${dayLabel}</span>
                      
                      <!-- Dag (Overdag High) -->
                      <div style="display: flex; flex-direction: column; align-items: center; gap: 1px;">
                        ${getWeatherIconSvg(day.condition, false, 16)}
                        <span style="font-size: 13px; font-weight: bold; color: #ffffff;">${day.temperature}°</span>
                      </div>
 
                      <!-- Nacht (Nacht Low) -->
                      <div style="display: flex; flex-direction: column; align-items: center; gap: 1px;">
                        ${getWeatherIconSvg(day.condition, true, 16)}
                        <span style="font-size: 11px; color: rgba(255,255,255,0.4);">${day.templow !== undefined ? `${day.templow}°` : '—'}</span>
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

      if (this.isLoadingHistory) {
        chartHtml = html`<div class="chart-loading">Gegevens laden...</div>`;
      } else if (!impEntity || !expEntity || (!this.statsData[impEntity] && !this.statsData[expEntity])) {
        chartHtml = html`<div class="chart-no-data">Geen historische gegevens beschikbaar.</div>`;
      } else {
        const processed = this.getProcessedGridData(impEntity, expEntity);
        const maxVal = Math.max(...processed.map(i => Math.max(i.importValue, i.exportValue))) || 1;
        chartHtml = html`
          <div class="scrollable-chart-container">
            <div class="glass-bar-chart">
              ${processed.map(item => {
                const importPercent = (item.importValue / maxVal) * 80;
                const exportPercent = (item.exportValue / maxVal) * 80;
                return html`
                  <div class="chart-column" style="min-width: 60px;">
                    <!-- Stacked values at the top of the column -->
                    <div class="chart-values-stacked">
                      <span class="stacked-val import-color">${item.importValue > 0 ? item.importValue.toFixed(this.activeTab === 'day' ? 1 : 0) : '0'}</span>
                      <span class="stacked-val export-color">${item.exportValue > 0 ? item.exportValue.toFixed(this.activeTab === 'day' ? 1 : 0) : '0'}</span>
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
            <button class="popup-tab-btn ${this.activeTab === 'day' ? 'active' : ''}" @click=${() => this.switchTab('day')}>Dag</button>
            <button class="popup-tab-btn ${this.activeTab === 'month' ? 'active' : ''}" @click=${() => this.switchTab('month')}>Maand</button>
            <button class="popup-tab-btn ${this.activeTab === 'year' ? 'active' : ''}" @click=${() => this.switchTab('year')}>Jaar</button>
          </div>

          <div class="glass-popup-stats">
            ${this.activePopup === 'grid' ? html`
              <div class="glass-popup-stat" style="grid-column: span 2;">
                <span class="stat-label">${grid >= 0 ? 'Netto Import (Live)' : 'Netto Export (Live)'}</span>
                <span class="stat-value" style="color: ${grid >= 0 ? '#ef4444' : '#10b981'}; display: flex; align-items: center; gap: 6px;">
                  <ha-icon icon="${grid >= 0 ? 'mdi:transmission-tower-export' : 'mdi:transmission-tower-import'}"></ha-icon>
                  ${Math.abs(grid) >= 1000 ? `${(Math.abs(grid) / 1000).toFixed(1)} kW` : `${Math.round(Math.abs(grid))} W`}
                </span>
              </div>
              <div class="glass-popup-stat">
                <span class="stat-label">Import vandaag</span>
                <span class="stat-value" style="color: #ef4444; display: flex; align-items: center; gap: 6px;">
                  <ha-icon icon="mdi:arrow-down-bold"></ha-icon>
                  ${gridImportToday !== null ? `${gridImportToday.toFixed(1)} kWh` : '0 kWh'}
                </span>
              </div>
              <div class="glass-popup-stat">
                <span class="stat-label">Export vandaag</span>
                <span class="stat-value" style="color: #10b981; display: flex; align-items: center; gap: 6px;">
                  <ha-icon icon="mdi:arrow-up-bold"></ha-icon>
                  ${gridExportToday !== null ? `${gridExportToday.toFixed(1)} kWh` : '0 kWh'}
                </span>
              </div>
            ` : html`
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
              ${this.activeTab === 'day' ? 'Afgelopen 30 dagen' : (this.activeTab === 'month' ? 'Afgelopen 12 maanden' : 'Jaaroverzicht')} (kWh)
            </div>
            ${chartHtml}
          </div>
        </div>
      </div>
    `;
  }

  private switchTab(tab: 'day' | 'month' | 'year'): void {
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
    const count = isOvercast ? 80 : 3;
    const list = [];
    for (let i = 0; i < count; i++) {
      const scale = isOvercast ? (2.0 + Math.random() * 1.2) : (0.5 + Math.random() * 0.5);
      const speed = 90 + Math.random() * 120;
      const delay = -Math.random() * speed;
      const yFactor = Math.random();
      const opacityMultiplier = isOvercast ? (0.96 + Math.random() * 0.04) : (0.6 + Math.random() * 0.4);
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
      this.activeTab = 'day';
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
    if (this.config.time_override !== undefined) {
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
    const rawBatteryPower = this.getEntityValue(entities.battery_power);
    const soc = entities.battery_soc ? this.getEntityValue(entities.battery_soc) : 0;
    const charger = this.getEntityValue(entities.charger);

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
    if (this.config.weather_override) {
      weatherState = this.config.weather_override;
    } else if (weatherEntity) {
      weatherState = weatherEntity.state;
    }

    const windSpeed = weatherEntity?.attributes?.wind_speed !== undefined ? parseFloat(weatherEntity.attributes.wind_speed) : 10;
    const temperature = weatherEntity?.attributes?.temperature !== undefined ? parseFloat(weatherEntity.attributes.temperature) : null;
    let rainIntensity: 'light' | 'normal' | 'heavy' = 'normal';
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

    if (!entities.grid && !(entities as any).grid_power) {
      // grid = huisverbruik + laadpaal - opwek - acculaden + accuontladen
      grid = load + charger - solar - batteryPower;
    }

    // Check configuration flags for layout
    const showSolar = !!entities.solar || !!(entities as any).solar_power;
    const showBattery = !!entities.battery_power;
    const showEV = !!entities.charger;

    const skyState = getSkyState(decimalHour);
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

    return html`
      ${screensaverStyles}
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
              onNodeClick: (node) => this.handleNodeClick(node)
            })}
          </div>

          <!-- Glassmorphism Custom Popup Overlay -->
          ${this.renderPopup()}
        </div>
      </ha-card>
    `;
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
