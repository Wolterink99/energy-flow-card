import { LitElement, html, TemplateResult } from 'lit';
import { property, state } from 'lit/decorators.js';
import { HomeAssistant, EnergyFlowCardConfig } from './types';
import { styles } from './styles';
import { renderHouseSvg, getSkyState } from './components/house-svg';

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

  private async fetchHistory(entityId: string): Promise<{ day: string; value: number }[]> {
    if (!this.hass) return [];
    try {
      const now = new Date();
      const startTime = new Date(now.getTime() - 8 * 24 * 60 * 60 * 1000).toISOString();
      const res = await (this.hass as any).callWS({
        type: 'history/history_during_period',
        start_time: startTime,
        entity_ids: [entityId],
        significant_changes_only: false,
        no_attributes: true
      });
      const entityHistory = res[entityId] || [];
      return this.processHistory(entityHistory);
    } catch (e) {
      console.warn('[energy-flow-card] Failed to fetch history via WS:', e);
      return [];
    }
  }

  private processHistory(historyItems: any[]): { day: string; value: number }[] {
    const dailyMax: Record<string, { weekday: string; maxValue: number }> = {};
    const sorted = [...historyItems].sort((a, b) => a.lu - b.lu);
    
    sorted.forEach(item => {
      const val = parseFloat(item.s);
      if (isNaN(val)) return;
      
      const date = new Date(item.lu * 1000);
      const dateKey = date.toISOString().split('T')[0];
      const weekday = date.toLocaleDateString('nl-NL', { weekday: 'short' });
      
      if (!dailyMax[dateKey] || val > dailyMax[dateKey].maxValue) {
        dailyMax[dateKey] = { weekday, maxValue: val };
      }
    });
    
    return Object.keys(dailyMax)
      .sort()
      .slice(-7)
      .map(key => ({
        day: dailyMax[key].weekday,
        value: dailyMax[key].maxValue
      }));
  }

  private closePopup(): void {
    this.activePopup = null;
    this.activePopupHistory = [];
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
    
    if (nodeId === 'solar') {
      this.activePopup = 'solar';
      const entity = this.config?.entities.solar_energy_today || (this.config?.entities as any).solar_today;
      if (entity) {
        this.isLoadingHistory = true;
        this.activePopupHistory = [];
        this.activePopupHistory = await this.fetchHistory(entity);
        this.isLoadingHistory = false;
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
    
    // Map node id to entity key, with smart fallbacks
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

    // Helper to parse daily energy sensor states
    const parseEntityFloat = (entId?: string): number | null => {
      if (!entId) return null;
      const entity = this.hass?.states[entId];
      if (!entity) return null;
      const v = parseFloat(entity.state);
      return isNaN(v) ? null : v;
    };

    const solarToday = parseEntityFloat(entities.solar_energy_today || (entities as any).solar_today);
    const gridImportToday = parseEntityFloat(entities.grid_import_today);
    const gridExportToday = parseEntityFloat(entities.grid_export_today);
    const homeToday = parseEntityFloat(entities.home_today);
    const batteryChargeToday = parseEntityFloat(entities.battery_charge_today);
    const batteryDischargeToday = parseEntityFloat(entities.battery_discharge_today);
    const evToday = parseEntityFloat(entities.ev_today);

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

    if (this.config.weather_override) {
      weatherState = this.config.weather_override;
    } else if (weatherEntityId && this.hass?.states[weatherEntityId]) {
      weatherState = this.hass.states[weatherEntityId].state;
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
              onNodeClick: (node) => this.handleNodeClick(node)
            })}
          </div>

          <!-- Glassmorphism Custom Popup Overlay -->
          ${this.activePopup === 'solar' ? html`
            <div class="glass-popup-overlay" @click=${this.closePopup}>
              <div class="glass-popup-card" @click=${(e: Event) => e.stopPropagation()}>
                <button class="glass-popup-close" @click=${this.closePopup}>&times;</button>
                
                <div class="glass-popup-header">
                  <div class="glass-popup-title">Zonnepanelen</div>
                  <div class="glass-popup-subtitle">Live Opbrengst & Historie</div>
                </div>

                <div class="glass-popup-stats">
                  <div class="glass-popup-stat">
                    <span class="stat-label">Huidig vermogen</span>
                    <span class="stat-value" style="color: #10b981;">
                      ${solar >= 20 ? (solar >= 1000 ? `${(solar / 1000).toFixed(1)} kW` : `${Math.round(solar)} W`) : '0 W'}
                    </span>
                  </div>
                  <div class="glass-popup-stat">
                    <span class="stat-label">Vandaag opgewekt</span>
                    <span class="stat-value">
                      ${solarToday !== null ? `${solarToday.toFixed(1)} kWh` : '0 kWh'}
                    </span>
                  </div>
                </div>

                <div class="glass-popup-chart-container">
                  <div class="chart-title">Opbrengst afgelopen 7 dagen (kWh)</div>
                  ${this.isLoadingHistory ? html`
                    <div class="chart-loading">Gegevens laden...</div>
                  ` : html`
                    ${this.activePopupHistory.length === 0 ? html`
                      <div class="chart-no-data">Geen historische gegevens beschikbaar.</div>
                    ` : html`
                      <div class="glass-bar-chart">
                        ${this.activePopupHistory.map(item => {
                          const maxVal = Math.max(...this.activePopupHistory.map(i => i.value)) || 1;
                          const percent = (item.value / maxVal) * 80; // Scale to max 80% height
                          return html`
                            <div class="chart-column">
                              <div class="chart-bar-wrapper">
                                <div class="chart-bar" style="height: ${Math.max(5, percent)}%;">
                                  <span class="bar-value">${item.value.toFixed(1)}</span>
                                </div>
                              </div>
                              <span class="chart-label">${item.day}</span>
                            </div>
                          `;
                        })}
                      </div>
                    `}
                  `}
                </div>
              </div>
            </div>
          ` : ''}
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
