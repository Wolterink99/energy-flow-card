import { css } from 'lit';

export const styles = css`
  :host {
    display: block;
    background: transparent;
  }

  ha-card {
    display: flex;
    flex-direction: column;
    height: 100%;
    min-height: 100%;
    overflow: hidden;
    box-sizing: border-box;
  }

  .card-container {
    color: var(--primary-text-color, #ffffff);
    padding: 0;
    font-family: var(--paper-font-body1_-_font-family, 'Inter', system-ui, -apple-system, sans-serif);
    overflow: hidden;
    display: flex;
    flex-direction: column;
    height: 100%;
    min-height: 100%;
    background: transparent;
  }

  .card-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: 12px 16px 8px 16px;
  }

  .card-title {
    font-size: 20px;
    font-weight: 500;
    line-height: 24px;
    letter-spacing: -0.01em;
    color: var(--primary-text-color);
  }

  .sceneWrapper {
    width: 100%;
    position: relative;
    background: transparent;
    display: flex;
    align-items: center;
    justify-content: center;
    flex: 1;
    line-height: 0;
  }

  svg {
    display: block;
    overflow: hidden;
    user-select: none;
    width: 100%;
    height: auto;
    border-radius: var(--ha-card-border-radius, 12px);
  }

  /* Animations & Keyframes */
  @keyframes moveParticle {
    0% {
      offset-distance: 0%;
    }
    100% {
      offset-distance: 100%;
    }
  }

  @keyframes driftSlow {
    0%   { transform: translateX(-250px); }
    100% { transform: translateX(1300px); }
  }

  @keyframes driftMedium {
    0%   { transform: translateX(-300px); }
    100% { transform: translateX(1300px); }
  }

  @keyframes driftFast {
    0%   { transform: translateX(-350px); }
    100% { transform: translateX(1300px); }
  }

  @keyframes driftCustom {
    0% {
      transform: translateX(-400px);
      opacity: 0;
    }
    12% {
      opacity: 1;
    }
    88% {
      opacity: 1;
    }
    100% {
      transform: translateX(1200px);
      opacity: 0;
    }
  }

  .customDriftCloud {
    animation-name: driftCustom;
    animation-iteration-count: infinite;
    animation-timing-function: linear;
  }

  @keyframes twinkle {
    0%, 100% { opacity: 0.25; }
    50% { opacity: 1; }
  }

  @keyframes pulseInverterRing {
    0% {
      r: 2px;
      opacity: 0.8;
      stroke-width: 1px;
    }
    100% {
      r: 22px;
      opacity: 0;
      stroke-width: 0.5px;
    }
  }

  @keyframes chargingDash {
    to {
      stroke-dashoffset: -20;
    }
  }

  @keyframes rainFall {
    0%   { transform: translateY(-40px); opacity: 0; }
    10%  { opacity: 0.75; }
    90%  { opacity: 0.75; }
    100% { transform: translateY(640px); opacity: 0; }
  }

  @keyframes snowFall {
    0%   { transform: translateY(-20px) translateX(0px); opacity: 0; }
    10%  { opacity: 0.85; }
    50%  { transform: translateY(300px) translateX(12px); }
    90%  { opacity: 0.85; }
    100% { transform: translateY(640px) translateX(-8px); opacity: 0; }
  }

  @keyframes lightningFlash {
    0%   { opacity: 0; }
    8%   { opacity: 1; }
    12%  { opacity: 0; }
    18%  { opacity: 0.8; }
    24%  { opacity: 0; }
    100% { opacity: 0; }
  }

  .cloud1 { animation: driftSlow 110s infinite linear; }
  .cloud2 { animation: driftMedium 80s infinite linear; }
  .cloud3 { animation: driftFast 55s infinite linear; }

  .starFast { animation: twinkle 2.5s infinite ease-in-out; animation-delay: 0.2s; }
  .starMed { animation: twinkle 4s infinite ease-in-out; animation-delay: 1.1s; }
  .starSlow { animation: twinkle 6s infinite ease-in-out; animation-delay: 2.3s; }

  .inverterRing {
    transform-origin: 345px 420px;
    animation: pulseInverterRing 3s infinite cubic-bezier(0.2, 0.8, 0.2, 1);
  }

  .chargingPulse {
    animation: chargingDash 1.2s infinite linear;
  }

  .rainDrop {
    stroke: #93c5fd;
    stroke-width: 1.5;
    stroke-linecap: round;
    animation: rainFall 0.7s infinite linear;
  }

  .snowFlake {
    fill: #e2e8f0;
    opacity: 0.85;
    animation: snowFall 5s infinite ease-in-out;
  }

  .lightningBolt {
    fill: none;
    stroke: #fde047;
    stroke-width: 3;
    stroke-linecap: round;
    filter: drop-shadow(0 0 8px #fde047);
    animation: lightningFlash 4s infinite;
  }

  /* CSS Classes for Elements */
  .groundBackground {
    transition: fill 0.6s ease;
  }

  .horizonLine {
    stroke: rgba(255, 255, 255, 0.15);
    stroke-width: 1;
  }

  .gridLine {
    stroke: rgba(255, 255, 255, 0.025);
    stroke-width: 0.8;
  }

  .flowCable {
    fill: none;
    stroke: rgba(255, 255, 255, 0.045);
    stroke-width: 1.5;
    stroke-linecap: round;
    stroke-linejoin: round;
  }

  .houseWindow {
    fill: #0f172a;
    stroke: rgba(255, 255, 255, 0.12);
    stroke-width: 1.2;
    transition: fill 1.2s ease, stroke 1.2s ease, filter 1.2s ease;
  }

  .interactiveGroup {
    cursor: pointer;
    pointer-events: all;
    transition: filter 0.35s cubic-bezier(0.4, 0, 0.2, 1), transform 0.35s cubic-bezier(0.4, 0, 0.2, 1);
  }

  .interactiveGroup:hover {
    transform: translateY(-2px);
  }

  .solarGroup:hover { filter: drop-shadow(0 0 12px rgba(245, 158, 11, 0.5)); }
  .batteryGroup:hover { filter: drop-shadow(0 0 12px rgba(16, 185, 129, 0.5)); }
  .evGroup:hover { filter: drop-shadow(0 0 12px rgba(168, 85, 247, 0.5)); }
  .homeGroup:hover { filter: drop-shadow(0 0 12px rgba(255, 255, 255, 0.35)); }
  .gridGroup:hover { filter: drop-shadow(0 0 12px rgba(6, 182, 212, 0.5)); }

  /* HUD Overlays */
  .hudCard {
    fill: rgba(10, 14, 22, 0.72);
    stroke: rgba(255, 255, 255, 0.06);
    stroke-width: 1;
    rx: 8px;
    ry: 8px;
    transition: stroke 0.6s ease, fill 0.6s ease;
  }

  .hudCardActive {
    stroke: currentColor;
    fill: rgba(10, 14, 22, 0.86);
  }

  .hudTitle {
    font-size: 12px;
    font-weight: 700;
    letter-spacing: 0.08em;
    text-transform: uppercase;
    fill: rgba(255, 255, 255, 0.38);
    pointer-events: none;
    transition: fill 0.6s ease;
  }

  .hudCardActive .hudTitle {
    fill: rgba(255, 255, 255, 0.72);
  }

  .hudValue {
    font-family: monospace;
    font-size: 18px;
    font-weight: 700;
    letter-spacing: -0.01em;
    fill: rgba(255, 255, 255, 0.85);
    pointer-events: none;
  }

  .hudActiveText {
    fill: currentColor;
  }

  .hudSub {
    font-size: 10px;
    font-weight: 500;
    fill: rgba(255, 255, 255, 0.32);
    pointer-events: none;
  }
`;
