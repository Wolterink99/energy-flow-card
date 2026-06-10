import { LitElement, html, TemplateResult } from 'lit';
import { property, state } from 'lit/decorators.js';
import { HomeAssistant, EnergyFlowCardConfig } from './types';
import { styles } from './styles';
import { renderHouseSvg } from './components/house-svg';

export class EnergyFlowCard extends LitElement {
  @property({ attribute: false }) public hass?: HomeAssistant;
  @state() private config?: EnergyFlowCardConfig;
  @state() private selectedNode: string | null = null;

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

  private handleNodeClick(nodeId: string): void {
    console.info(`[energy-flow-card] Click registered on node: ${nodeId}`);
    this.selectedNode = this.selectedNode === nodeId ? null : nodeId;
    
    // Map node id to entity key, with smart fallbacks
    let entityKey = nodeId;
    if (nodeId === 'battery') {
      entityKey = this.config?.entities.battery_power ? 'battery_power' : 'battery_soc';
    } else if (nodeId === 'home') {
      entityKey = 'load';
    } else if (nodeId === 'ev') {
      entityKey = 'charger';
    } else if (nodeId === 'grid') {
      // If no dedicated grid entity, fall back to solar entity for popup
      entityKey = this.config?.entities.grid ? 'grid' : 'solar';
    } else if (nodeId === 'solar') {
      entityKey = this.config?.entities.solar_energy_today ? 'solar_energy_today' : 'solar';
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

  protected render(): TemplateResult {
    if (!this.config || !this.hass) {
      return html`<p style="color: red; padding: 16px;">Wachten op Home Assistant...</p>`;
    }

    const { entities } = this.config;

    // Get current browser time decimal representation (0.0 to 24.0)
    const now = new Date();
    const decimalHour = now.getHours() + now.getMinutes() / 60;

    // Determine time of day label
    let timeOfDay = 'afternoon';
    if (decimalHour >= 5 && decimalHour < 9) timeOfDay = 'morning';
    else if (decimalHour >= 9 && decimalHour < 18) timeOfDay = 'afternoon';
    else if (decimalHour >= 18 && decimalHour < 22) timeOfDay = 'evening';
    else timeOfDay = 'night';

    // Parse states
    const solar = this.getEntityValue(entities.solar);
    const load = this.getEntityValue(entities.load);
    const rawBatteryPower = this.getEntityValue(entities.battery_power);
    const soc = entities.battery_soc ? this.getEntityValue(entities.battery_soc) : 0;
    const charger = this.getEntityValue(entities.charger);

    // Normalize battery sign convention:
    // battery_invert: true  (default) → sensor positief = laden  (SolarEdge, Huawei, GoodWe)
    // battery_invert: false           → sensor negatief = laden  (Victron, sommige SMA)
    // Na normalisatie: batteryPower > 0 = laden, batteryPower < 0 = ontladen
    const batteryInvert = this.config.battery_invert !== false; // default true
    const batteryPower = batteryInvert ? rawBatteryPower : -rawBatteryPower;

    // Helper to parse daily energy sensor states
    const parseEntityFloat = (entId?: string): number | null => {
      if (!entId) return null;
      const entity = this.hass?.states[entId];
      if (!entity) return null;
      const v = parseFloat(entity.state);
      return isNaN(v) ? null : v;
    };

    const solarToday = parseEntityFloat(entities.solar_energy_today);
    const gridImportToday = parseEntityFloat(entities.grid_import_today);
    const gridExportToday = parseEntityFloat(entities.grid_export_today);
    const homeToday = parseEntityFloat(entities.home_today);
    const batteryChargeToday = parseEntityFloat(entities.battery_charge_today);
    const batteryDischargeToday = parseEntityFloat(entities.battery_discharge_today);
    const evToday = parseEntityFloat(entities.ev_today);

    // Weather state from Home Assistant
    let weatherState = 'sunny';
    if (entities.weather && this.hass?.states[entities.weather]) {
      weatherState = this.hass.states[entities.weather].state;
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

    // Grid import/export: gebruik sensor als geconfigureerd, anders berekend.
    // Na normalisatie: batteryPower > 0 = laden, < 0 = ontladen
    // grid > 0 = import (afname), grid < 0 = export (teruglevering)
    let grid = 0;
    if (entities.grid) {
      grid = this.getEntityValue(entities.grid);
    } else {
      // grid = huisverbruik + laadpaal - opwek - acculaden + accuontladen
      grid = load + charger - solar - batteryPower;
    }

    // Check configuration flags for layout
    const showSolar = !!entities.solar;
    const showBattery = !!entities.battery_power;
    const showEV = !!entities.charger;

    return html`
      <div class="card-container">
        ${this.config.title ? html`
          <div class="card-header">
            <div class="card-title">${this.config.title}</div>
          </div>
        ` : ''}

        <div class="sceneWrapper">
          ${renderHouseSvg({
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
            sunriseHour,
            sunsetHour,
            gridImportToday,
            gridExportToday,
            homeToday,
            batteryChargeToday,
            batteryDischargeToday,
            evToday,
            onNodeClick: (node) => this.handleNodeClick(node)
          })}
        </div>
      </div>
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
    `%c  ENERGY-FLOW-CARD  %c Version 2.0.0 `,
    'color: white; background: #10b981; font-weight: 700;',
    'color: #10b981; background: #0f172a; font-weight: 700;'
  );
}
