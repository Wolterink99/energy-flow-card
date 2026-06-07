export interface EnergyFlowCardConfig {
  type: string;
  title?: string;
  house_style?: 'modern-villa' | 'classic-jaren30' | 'barnhouse' | 'cubist-bungalow' | 'townhouse';
  entities: {
    solar?: string | string[];
    load?: string | string[];
    battery_power?: string | string[];
    battery_soc?: string | string[];
    charger?: string | string[];
    grid?: string | string[];
  };
}

// Minimal Home Assistant interface declarations
export interface LovelaceCardHeaderGold {
  title?: string;
}

export interface HomeAssistantEntity {
  entity_id: string;
  state: string;
  attributes: {
    unit_of_measurement?: string;
    friendly_name?: string;
    [key: string]: any;
  };
  last_changed: string;
  last_updated: string;
}

export interface HomeAssistant {
  states: {
    [key: string]: HomeAssistantEntity;
  };
}
