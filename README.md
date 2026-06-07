# EnergyFlow Card for Home Assistant

Een interactieve, modern vormgegeven energievisualisatie voor Home Assistant. De kaart toont de energiestromen (opwek, verbruik, accu, laadpaal) in een prachtige SVG-huisschets, compleet met een dynamische lucht die zich aanpast aan het tijdstip van de dag.

![EnergyFlow Preview](hacs_preview.png)

## Kenmerken
- **Vijf Huizenstijlen:** Kies uit `modern-villa`, `classic-jaren30`, `barnhouse`, `cubist-bungalow`, of `townhouse`.
- **Dynamische Hemel:** De stand van de zon/maan en de kleur van de lucht veranderen mee met het actuele uur van de dag.
- **Optionele Entiteiten:** Heb je geen zonnepanelen, thuisaccu of laadpaal? Laat ze simpelweg weg uit de configuratie; de kaart verbergt deze elementen en stroomlijnen automatisch, en lijnt de overgebleven kaarten netjes uit.
- **Optel-ondersteuning (Multi-Entity):** Voer per onderdeel een enkele entiteit in óf een lijst van entiteiten; de kaart telt ze automatisch in real-time bij elkaar op (handig bij meerdere omvormers).

---

## Installatie

### Optie 1: Via HACS (Aanbevolen)
1. Open HACS in Home Assistant.
2. Klik rechtsboven op de drie puntjes en kies **Aangepaste repositories (Custom repositories)**.
3. Plak de URL van jouw GitHub repository waar je deze code host.
4. Kies categorie **Lovelace (Plugin)** en klik op **Toevoegen**.
5. Installeer de "EnergyFlow Card".

### Optie 2: Handmatige Installatie
1. Download [energy-flow-card.js](dist/energy-flow-card.js).
2. Kopieer het bestand naar de `/config/www/` map van je Home Assistant-installatie.
3. Voeg de resource toe aan je dashboard:
   - Ga in Home Assistant naar **Instellingen** -> **Dashboards** -> Drie puntjes rechtsboven -> **Bronnen**.
   - Klik op **Bron toevoegen**.
   - Voer `/local/energy-flow-card.js` in als URL en selecteer **JavaScript-module** als type.

---

## Lovelace Dashboard Configuratie

Voeg de kaart toe aan je dashboard met de volgende YAML-code:

```yaml
type: custom:energy-flow-card
title: "Mijn Energie"
house_style: "classic-jaren30"     # Opties: modern-villa, classic-jaren30, barnhouse, cubist-bungalow, townhouse
entities:
  # Zonnepanelen (Optioneel: accepteert een enkele sensor of een lijst)
  solar:
    - sensor.omvormer_dak_voor
    - sensor.omvormer_dak_achter
    
  # Huisverbruik (Optioneel)
  load: sensor.smart_meter_power_consumption
  
  # Thuisaccu (Optioneel)
  battery_power: sensor.battery_power
  battery_soc: sensor.battery_state_of_charge
  
  # Laadpaal (Optioneel)
  charger: sensor.ev_charger_power
  
  # Stroomnet (Optioneel. Indien weggelaten, berekent de kaart dit als: load + charger - solar - battery_power)
  grid: sensor.smart_meter_grid_power
```
