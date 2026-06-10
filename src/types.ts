export interface EnergyFlowCardConfig {
  type: string;
  title?: string;
  house_style?: 'modern-villa' | 'classic-jaren30' | 'barnhouse' | 'cubist-bungalow' | 'townhouse';
  car_type?: 'hatchback' | 'sedan' | 'suv';
  entities: {
    solar?: string | string[];
    solar_energy_today?: string;   // Optional: kWh produced today
    load?: string | string[];
    battery_power?: string | string[];
    battery_soc?: string | string[];
    charger?: string | string[];
    grid?: string | string[];
    weather?: string;
    grid_import_today?: string;    // Optional: grid import today (kWh)
    grid_export_today?: string;    // Optional: grid export today (kWh)
    home_today?: string;           // Optional: home consumption today (kWh)
    battery_charge_today?: string; // Optional: battery charge today (kWh)
    battery_discharge_today?: string; // Optional: battery discharge today (kWh)
    ev_today?: string;             // Optional: EV charger energy today (kWh)
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
