# EnergyFlow Card for Home Assistant

Een interactieve, modern vormgegeven energievisualisatie voor Home Assistant. De kaart toont de energiestromen (opwek, verbruik, accu, laadpaal) in een realistische SVG-gevel van een bakstenen woning, compleet met een dynamische lucht die zich aanpast aan het tijdstip van de dag.

## Kenmerken

- **Realistische bakstenen gevel:** Drievleugelige woning met linker-vleugel (zonnepanelen op dak), centrale entree en rechter-vleugel (laadpaal & auto).
- **Dynamische hemel:** Zon en maan draaien om het huis. Luchtkleur, sterren en wolken passen zich aan het uur van de dag aan.
- **Weerstypes:** Zonnig, bewolkt, regen, sneeuw, onweer en mist — inclusief animaties.
- **Dag/nacht ramen:** Overdag grijzig-reflecterend, 's avonds warm gloeiend amber.
- **Accu-kleuren:** Groene bolletjes bij laden, rode bolletjes bij ontladen.
- **Optionele entiteiten:** Geen zonnepanelen, accu of laadpaal? Laat ze weg uit de configuratie — de kaart verbergt die elementen en stroomlijnen automatisch.
- **Optel-ondersteuning (Multi-Entity):** Per onderdeel een enkele entiteit óf een lijst; de kaart telt automatisch op (handig bij meerdere omvormers).

---

## Installatie

### Optie 1: Via HACS (Aanbevolen)
1. Open HACS in Home Assistant.
2. Klik rechtsboven op de drie puntjes → **Aangepaste repositories**.
3. Plak de URL van jouw GitHub repository.
4. Kies categorie **Lovelace (Plugin)** en klik op **Toevoegen**.
5. Installeer de **EnergyFlow Card**.

### Optie 2: Handmatige Installatie
1. Download [energy-flow-card.js](dist/energy-flow-card.js).
2. Kopieer het bestand naar `/config/www/` op je Home Assistant-installatie.
3. Voeg de resource toe:
   - **Instellingen** → **Dashboards** → ⋮ rechtsboven → **Bronnen** → **Bron toevoegen**
   - URL: `/local/energy-flow-card.js` — type: **JavaScript-module**
4. Ververs de browser hard (`Ctrl+Shift+R`) na het toevoegen.

---

## Lovelace Dashboard Configuratie

```yaml
type: custom:energy-flow-card
title: "Mijn Energie"   # Optioneel — weglaten = geen titelbalk
entities:
  # Zonnepanelen (Optioneel — accepteert een enkele sensor of een lijst)
  solar:
    - sensor.omvormer_dak_voor
    - sensor.omvormer_dak_achter

  # Huisverbruik (Optioneel)
  load: sensor.smart_meter_power_consumption

  # Thuisaccu (Optioneel)
  # Conventie: negatief = laden, positief = ontladen
  battery_power: sensor.battery_power
  battery_soc: sensor.battery_state_of_charge

  # Laadpaal (Optioneel)
  charger: sensor.ev_charger_power

  # Stroomnet (Optioneel — indien weggelaten berekent de kaart: load + charger - solar - battery_power)
  grid: sensor.smart_meter_grid_power

  # Dagelijks totalen (Optioneel — tonen in de onderste kaartjes)
  solar_energy_today: sensor.solar_energy_today
  grid_import_today: sensor.grid_import_today
  grid_export_today: sensor.grid_export_today
  home_today: sensor.home_energy_today
  battery_charge_today: sensor.battery_charged_today
  battery_discharge_today: sensor.battery_discharged_today
  ev_today: sensor.ev_charged_today

  # Weer (Optioneel — voor het weerpictogram en animaties)
  weather: weather.home

  # Zon opkomst/ondergang (Optioneel — automatisch via sun.sun als aanwezig)
  # sun.sun wordt automatisch gelezen, geen configuratie nodig
```

---

## Update naar nieuwe versie

Als je de kaart via HACS hebt geïnstalleerd:
1. **HACS** → **Frontend** → zoek **EnergyFlow Card**
2. Klik ⋮ → **Update** — of klik rechtsboven op **Controleer op updates**
3. Na de update: browser hard-refresh (`Ctrl+Shift+R`) of cache wissen via **Instellingen → Dashboards → ⋮ → Cache wissen**
