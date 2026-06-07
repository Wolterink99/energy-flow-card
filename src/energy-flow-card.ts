import { LitElement, html, PropertyValues, TemplateResult } from 'lit';
import { property, state } from 'lit/decorators.js';
import { HomeAssistant, EnergyFlowCardConfig } from './types';
import { styles } from './styles';
import { renderHouseSvg } from './components/house-svg';

export class EnergyFlowCard extends LitElement {
  @property({ attribute: false }) public hass?: HomeAssistant;
  @state() private config?: EnergyFlowCardConfig;
  @state() private selectedNode: string | null = null;
  @state() private currentHouseStyle: string = 'modern-villa';

  static styles = styles;

  // Make the card customizable in the Lovelace card picker
  public static getStubConfig(): Partial<EnergyFlowCardConfig> {
    return {
      title: 'Energieverloop',
      house_style: 'modern-villa',
      entities: {}
    };
  }

  public setConfig(config: EnergyFlowCardConfig): void {
    if (!config) {
      throw new Error('Ongeldige configuratie');
    }
    this.config = config;
    if (config.house_style) {
      this.currentHouseStyle = config.house_style;
    }
  }

  protected updated(changedProperties: PropertyValues): void {
    super.updated(changedProperties);
    if (changedProperties.has('config') && this.config?.house_style) {
      this.currentHouseStyle = this.config.house_style;
    }
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
    this.selectedNode = this.selectedNode === nodeId ? null : nodeId;
    // Dispatch an event to show more info inside Home Assistant if clicked
    const entityKey = nodeId === 'battery' ? 'battery_power' : nodeId;
    const entityConfig = this.config?.entities[entityKey as keyof typeof this.config.entities];
    
    const singleEntity = Array.isArray(entityConfig) ? entityConfig[0] : entityConfig;
    if (singleEntity) {
      const event = new CustomEvent('hass-more-info', {
        detail: { entityId: singleEntity },
        bubbles: true,
        composed: true,
      });
      this.dispatchEvent(event);
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
    const batteryPower = this.getEntityValue(entities.battery_power);
    const soc = entities.battery_soc ? this.getEntityValue(entities.battery_soc) : 0;
    const charger = this.getEntityValue(entities.charger);

    // Grid import/export: if custom entity provided use it, otherwise compute
    let grid = 0;
    if (entities.grid) {
      grid = this.getEntityValue(entities.grid);
    } else {
      // Grid = Load + Charger - Solar - BatteryPower (discharging is negative batteryPower)
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
            houseStyle: this.currentHouseStyle,
            timeHour: decimalHour,
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
    `%c  ENERGY-FLOW-CARD  %c Version 1.0.0 `,
    'color: white; background: #10b981; font-weight: 700;',
    'color: #10b981; background: #0f172a; font-weight: 700;'
  );
}
