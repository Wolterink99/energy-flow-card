const WebSocket = require('ws');

const token = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiI0NWIyYTA4MzhjOWQ0NjI2Yjc5NTY5NGU1Mzk0ZmU2ZCIsImlhdCI6MTc4MDIyODEwMiwiZXhwIjoyMDk1NTg4MTAyfQ.c-gOuNc3AezEImPkxMvuBeTPVbfpx8CzWqcixCpflM4";
const url = "wss://84wgzzzm8ai8igpemwargw2qsuihp9ww.ui.nabu.casa/api/websocket";

const ws = new WebSocket(url);

const newConfig = {
  kiosk_mode: {
    kiosk: true,
    hide_sidebar: true,
    hide_header: true,
    admin_settings: {
      kiosk: true,
      hide_sidebar: true,
      hide_header: true
    },
    non_admin_settings: {
      kiosk: true,
      hide_sidebar: true,
      hide_header: true
    }
  },
  views: [
    {
      title: "screensaver",
      path: "default_view",
      cards: [
        {
          type: "custom:energy-flow-card",
          screensaver: true,
          house_style: "classic-jaren30",
          show_solar: true,
          show_battery: false,
          show_ev: false,
          tap_action: {
            action: "navigate",
            navigation_path: "/lovelace/0"
          },
          entities: {
            weather: "weather.forecast_home",
            solar_power: "sensor.totale_actuele_zonneproductie",
            solar_today: "sensor.totale_opwek_vandaag_2",
            home_power: "sensor.actueel_huisverbruik",
            home_today: "sensor.totaalverbruik_vandaag",
            grid_power: "sensor.p1_meter_power",
            grid_import_today: "sensor.p1_netstroom_afname_vandaag",
            grid_export_today: "sensor.p1_teruglevering_vandaag"
          },
          home_tap_action: {
            action: "navigate",
            navigation_path: "#huisverbruik"
          },
          solar_tap_action: {
            action: "navigate",
            navigation_path: "#zonnepanelen"
          },
          grid_tap_action: {
            action: "navigate",
            navigation_path: "#stroomnet"
          }
        },
        {
          type: "vertical-stack",
          cards: [
            {
              type: "custom:bubble-card",
              card_type: "pop-up",
              hash: "huisverbruik",
              name: "Huisverbruik",
              icon: "mdi:home-lightning-bolt",
              back_button: true
            },
            {
              type: "custom:mushroom-template-card",
              primary: "Actueel Huisverbruik",
              secondary: "{{ states('sensor.actueel_huisverbruik') | round(0) }} W",
              icon: "mdi:home-lightning-bolt",
              icon_color: "deep-purple",
              layout: "horizontal"
            },
            {
              type: "grid",
              columns: 2,
              square: false,
              cards: [
                {
                  type: "custom:mushroom-entity-card",
                  entity: "sensor.totaalverbruik_vandaag",
                  name: "Vandaag verbruikt",
                  icon: "mdi:calendar-today",
                  icon_color: "deep-purple"
                },
                {
                  type: "custom:mushroom-entity-card",
                  entity: "sensor.actueel_huisverbruik",
                  name: "Live vermogen",
                  icon: "mdi:pulse",
                  icon_color: "deep-purple"
                }
              ]
            },
            {
              type: "history-graph",
              entities: [
                "sensor.actueel_huisverbruik"
              ],
              hours_to_show: 24,
              refresh_interval: 0
            }
          ]
        },
        {
          type: "vertical-stack",
          cards: [
            {
              type: "custom:bubble-card",
              card_type: "pop-up",
              hash: "zonnepanelen",
              name: "Zonnepanelen",
              icon: "mdi:solar-power-variant",
              back_button: true
            },
            {
              type: "custom:mushroom-template-card",
              primary: "Actuele Productie",
              secondary: "{{ states('sensor.totale_actuele_zonneproductie') | round(0) }} W",
              icon: "mdi:solar-power-variant",
              icon_color: "amber",
              layout: "horizontal"
            },
            {
              type: "grid",
              columns: 2,
              square: false,
              cards: [
                {
                  type: "custom:mushroom-entity-card",
                  entity: "sensor.totale_opwek_vandaag_2",
                  name: "Vandaag opgewekt",
                  icon: "mdi:solar-panel-large",
                  icon_color: "amber"
                },
                {
                  type: "custom:mushroom-entity-card",
                  entity: "sensor.totale_actuele_zonneproductie",
                  name: "Actueel vermogen",
                  icon: "mdi:sun-wireless",
                  icon_color: "amber"
                }
              ]
            },
            {
              type: "history-graph",
              entities: [
                "sensor.totale_actuele_zonneproductie"
              ],
              hours_to_show: 24,
              refresh_interval: 0
            }
          ]
        },
        {
          type: "vertical-stack",
          cards: [
            {
              type: "custom:bubble-card",
              card_type: "pop-up",
              hash: "stroomnet",
              name: "Stroomnet",
              icon: "mdi:transmission-tower",
              back_button: true
            },
            {
              type: "custom:mushroom-template-card",
              primary: "Netbelasting",
              secondary: "{{ states('sensor.p1_meter_power') | round(0) }} W",
              icon: "mdi:transmission-tower",
              icon_color: "blue",
              layout: "horizontal"
            },
            {
              type: "grid",
              columns: 2,
              square: false,
              cards: [
                {
                  type: "custom:mushroom-entity-card",
                  entity: "sensor.p1_netstroom_afname_vandaag",
                  name: "Import vandaag",
                  icon: "mdi:export",
                  icon_color: "red"
                },
                {
                  type: "custom:mushroom-entity-card",
                  entity: "sensor.p1_teruglevering_vandaag",
                  name: "Export vandaag",
                  icon: "mdi:import",
                  icon_color: "green"
                }
              ]
            },
            {
              type: "history-graph",
              entities: [
                "sensor.p1_meter_power"
              ],
              hours_to_show: 24,
              refresh_interval: 0
            }
          ]
        }
      ]
    }
  ]
};

ws.on('open', () => {
  console.log('Connected to WebSocket');
});

ws.on('message', (data) => {
  const msg = JSON.parse(data);
  if (msg.type === 'auth_required') {
    ws.send(JSON.stringify({
      type: 'auth',
      access_token: token
    }));
  } else if (msg.type === 'auth_ok') {
    console.log('Auth OK, saving configuration...');
    ws.send(JSON.stringify({
      id: 1,
      type: 'lovelace/config/save',
      url_path: 'dashboard-screensaver',
      config: newConfig
    }));
  } else if (msg.type === 'result') {
    console.log('Save result:', JSON.stringify(msg, null, 2));
    ws.close();
  }
});

ws.on('error', (err) => {
  console.error('WS Error:', err);
});
