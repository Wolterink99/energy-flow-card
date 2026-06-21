export interface EnergyFlowCardConfig {
  type: string;
  title?: string;
  // battery_invert: true  → positief = laden, negatief = ontladen (bijv. SolarEdge, Huawei)
  // battery_invert: false → negatief = laden, positief = ontladen (bijv. Victron, sommige SMA)
  // Standaard: true (positief = laden)
  battery_invert?: boolean;
  house_style?: string;
  car_type?: string;
  entities: {
    solar?: string | string[];
    solar_energy_today?: string;      // kWh opgewekt vandaag
    load?: string | string[];
    battery_power?: string | string[];
    battery_soc?: string | string[];
    charger?: string | string[];
    grid?: string | string[];
    weather?: string;
    grid_import_today?: string;       // kWh afgenomen vandaag
    grid_export_today?: string;       // kWh teruggeleverd vandaag
    home_today?: string;              // kWh huisverbruik vandaag
    battery_charge_today?: string;    // kWh geladen vandaag
    battery_discharge_today?: string; // kWh ontladen vandaag
    ev_today?: string;                // kWh laadpaal vandaag
    light?: string | string[];        // Light entity or list of light entities
    grid_price?: string;              // Huidige energieprijs sensor
  };
  tap_action?: {
    action: string;
    navigation_path?: string;
    [key: string]: any;
  };
  screensaver?: boolean;
  weather_override?: string;
  time_override?: number;
  weather_test?: boolean;
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
