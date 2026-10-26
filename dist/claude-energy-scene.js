const WARMTEPOMP_DASHBOARD_HTML = "<title>Warmtepomp SPRSUN</title>\n<meta name=\"claude:viewport-fit-sides\" content=\"cover\">\n<link rel=\"preconnect\" href=\"https://fonts.googleapis.com\">\n<link rel=\"preconnect\" href=\"https://fonts.gstatic.com\" crossorigin>\n<link rel=\"stylesheet\" href=\"https://fonts.googleapis.com/css2?family=Figtree:wght@400;500;600;700;800&family=Outfit:wght@300;400;700&display=swap\">\n<style>\n/* Layout: alleen de popup van de warmtepomp (wandtablet). Links het installatieschema met de kast\n   (ventilator links over de volle hoogte, onderdelen rechts), de leidingen naar het boilervat en een\n   plat gelegde vloerverwarming. Rechts tabbladen met overzicht, instellingen, tijdschema en waarden.\n   Bewust één donker thema, passend bij het huisdashboard. */\n:root{\n  color-scheme:dark;\n  --backdrop:#07080c;\n  --panel:#12151c; --panel-2:#181c26; --panel-3:#20252f; --line:#272c38; --line-2:#323949;\n  --fg:#e9ebf1; --muted:#8a92a3; --dim:#5d6575;\n  --accent:#ff8d4d; --accent-soft:rgba(255,141,77,.16); --accent-ink:#1d0f06;\n  --ok:#4ade80; --warn:#fbbf24; --cold:#60a5fa; --hot:#f87171; --ice:#7dd3fc;\n  --f-display:\"Outfit\",\"Figtree\",system-ui,sans-serif;\n  --f-ui:\"Figtree\",system-ui,-apple-system,\"Segoe UI\",Roboto,sans-serif;\n  --r:14px;\n}\n*{box-sizing:border-box}\n[hidden]{display:none!important}\nhtml,body{height:100%}\nbody{background:#0e1117;margin:0;padding:0;color:var(--fg);font-family:var(--f-ui);font-size:14px;overflow:hidden;-webkit-tap-highlight-color:transparent;touch-action:manipulation;-webkit-user-select:none;user-select:none}\nbutton{font:inherit;color:inherit;background:none;border:0;cursor:pointer;touch-action:manipulation}\nbutton:focus-visible,input:focus-visible{outline:2px solid var(--accent);outline-offset:2px}\n.i{width:18px;height:18px;fill:none;stroke:currentColor;stroke-width:1.8;stroke-linecap:round;stroke-linejoin:round;flex:none}\n.num{font-variant-numeric:tabular-nums}\n.hit{cursor:pointer}\n.chip{display:inline-flex;align-items:center;gap:8px;min-height:40px;padding:0 14px;border-radius:12px;background:var(--panel-2);border:1px solid var(--line);font-size:13px;font-weight:500}\n.chip .dot{width:8px;height:8px;border-radius:50%;background:var(--accent);box-shadow:0 0 0 4px var(--accent-soft)}\n.badge{font-size:10.5px;font-weight:600;padding:3px 7px;border-radius:6px;background:var(--panel-3);color:var(--muted);white-space:nowrap}\n.badge.heat{background:rgba(251,146,60,.16);color:#fdba74}\n.badge.dhw{background:rgba(251,191,36,.15);color:#fcd34d}\n.badge.cool{background:rgba(96,165,250,.16);color:#93c5fd}\n.badge.defrost{background:rgba(125,211,252,.16);color:#bae6fd}\n.badge.off{background:rgba(248,113,113,.16);color:#fca5a5}\n.reopen{position:fixed;left:50%;top:50%;transform:translate(-50%,-50%);min-height:56px;padding:0 22px;border-radius:14px;background:var(--accent);color:var(--accent-ink);font-weight:700;display:inline-flex;gap:10px;align-items:center}\n\n/* ---------- popup ---------- */\n.modal{position:fixed;left:0;top:0;width:100%;height:100%;transform:none;border-radius:20px;display:grid;grid-template-rows:auto minmax(0,1fr);background:var(--panel);border:1px solid var(--line-2);border-radius:22px;box-shadow:0 40px 100px rgba(0,0,0,.6);overflow:hidden}\n.m-head{display:flex;align-items:center;gap:14px;padding:14px 16px 14px 20px;border-bottom:1px solid var(--line);flex-wrap:wrap}\n.m-title{display:flex;align-items:center;gap:12px;min-width:0;flex:1}\n.m-title .ico{width:44px;height:44px;border-radius:12px;background:var(--accent-soft);color:var(--accent)}\n.m-title h2{margin:0;font-family:var(--f-display);font-weight:400;font-size:24px;line-height:1.1}\n.m-title p{margin:2px 0 0;color:var(--muted);font-size:12.5px;white-space:nowrap;overflow:hidden;text-overflow:ellipsis}\n.m-title .badge{font-size:12px;padding:5px 9px}\n.m-actions{display:flex;gap:8px;align-items:center;position:relative}\n.icon-btn{width:48px;height:48px;border-radius:12px;display:grid;place-items:center;background:var(--panel-2);border:1px solid var(--line)}\n.power-btn{display:inline-flex;align-items:center;gap:8px;height:48px;padding:0 16px 0 12px;border-radius:12px;background:var(--panel-2);border:1px solid var(--line);font-weight:600}\n.power-btn .i{width:22px;height:22px;stroke-width:2.2}\n.power-btn[aria-checked=\"true\"]{background:rgba(74,222,128,.12);border-color:rgba(74,222,128,.45);color:#bbf7d0}\n.power-btn[aria-checked=\"true\"] .i{color:var(--ok)}\n.power-btn[aria-checked=\"false\"] .i{color:var(--hot)}\n.sim{min-height:48px}\n.confirm{position:absolute;right:56px;top:56px;z-index:5;width:320px;display:grid;gap:12px;padding:14px;border-radius:14px;background:#1d222c;border:1px solid rgba(248,113,113,.45);box-shadow:0 20px 50px rgba(0,0,0,.5)}\n.confirm div{display:flex;gap:8px;justify-content:flex-end}\n.sim-menu{position:absolute;top:56px;right:0;z-index:6;min-width:270px;background:var(--panel);border:1px solid var(--line);border-radius:14px;padding:6px;box-shadow:0 20px 50px rgba(0,0,0,.5)}\n.sim-menu button{display:flex;width:100%;min-height:46px;padding:6px 12px;border-radius:10px;text-align:left;line-height:1.3}\n.sim-menu button:hover{background:var(--panel-2)}\n.sim-menu button[aria-checked=\"true\"]{background:var(--accent-soft);color:#ffd2b8}\n.sim-menu small{color:var(--muted);font-size:11.5px}\n.sim-menu .sep{height:1px;background:var(--line);margin:6px 4px}\n.btn{min-height:44px;padding:0 16px;border-radius:11px;background:var(--panel-3);border:1px solid var(--line);font-weight:600}\n.btn.danger{background:rgba(248,113,113,.18);border-color:rgba(248,113,113,.45);color:#fecaca}\n\n.m-body{display:grid;grid-template-columns:minmax(0,1.6fr) minmax(380px,1fr);min-height:0}\n.m-schema{display:grid;grid-template-rows:minmax(0,1fr) auto;min-height:0;background:radial-gradient(120% 90% at 30% 20%,#161b25 0%,#0e1117 70%);border-right:1px solid var(--line)}\n.m-schema svg{width:100%;height:100%;display:block;min-height:0}\n.lamps{display:flex;flex-wrap:wrap;gap:8px;padding:12px 16px 14px;border-top:1px solid var(--line);align-items:center}\n#lampRow{display:contents}\n.lamp{display:inline-flex;align-items:center;gap:8px;min-height:36px;padding:0 12px;border-radius:10px;background:var(--panel-2);border:1px solid var(--line);font-size:12.5px;color:var(--muted)}\n.lamp i{width:9px;height:9px;border-radius:50%;background:var(--dim)}\n.lamp.on{color:var(--fg)}\n.lamp.on i{background:var(--ok);box-shadow:0 0 0 4px rgba(74,222,128,.15)}\n.lamp.on.ice i{background:var(--ice);box-shadow:0 0 0 4px rgba(125,211,252,.18)}\n.lamp.status{margin-left:auto;color:var(--fg);background:transparent;border-color:transparent;padding-right:0}\n\n.m-side{display:grid;grid-template-rows:auto minmax(0,1fr);min-height:0}\n.tabs{display:flex;gap:6px;overflow-x:auto;padding:12px 16px;scrollbar-width:none;border-bottom:1px solid var(--line)}\n.tabs::-webkit-scrollbar{display:none}\n.tab{display:inline-flex;align-items:center;gap:7px;min-height:44px;padding:0 14px;border-radius:11px;white-space:nowrap;color:var(--muted);font-weight:500;background:var(--panel-2);border:1px solid transparent}\n.tab[aria-selected=\"true\"]{color:var(--fg);border-color:rgba(255,141,77,.45);background:var(--accent-soft)}\n.m-panel{overflow-y:auto;overscroll-behavior:contain;padding:16px 16px 28px}\n.panel{display:grid;gap:20px}\n.sec{display:grid;gap:10px}\n.sec-h{font-size:11.5px;font-weight:600;letter-spacing:.09em;text-transform:uppercase;color:var(--muted);display:flex;align-items:center;gap:8px}\n.sec-h em{font-style:normal;text-transform:none;letter-spacing:0;font-weight:400;color:var(--dim);margin-left:auto}\n.box{background:var(--panel-2);border:1px solid var(--line);border-radius:var(--r)}\n.row{display:grid;gap:10px;padding:14px 16px}\n.row + .row{border-top:1px solid var(--line)}\n.row-line{display:flex;align-items:center;gap:12px;min-width:0}\n.ico{width:38px;height:38px;border-radius:10px;display:grid;place-items:center;background:var(--panel-3);color:#c8ced9;flex:none}\n.row-text{flex:1;min-width:0}\n.row-title{font-weight:600;font-size:15px}\n.row-sub{color:var(--muted);font-size:12px;margin-top:2px}\n\n.statusbox{padding:16px;display:grid;gap:4px}\n.statusbox b{font-size:17px;font-weight:600}\n.statusbox span{color:var(--muted);font-size:12.5px}\n.tiles{display:grid;grid-template-columns:repeat(3,minmax(0,1fr));gap:8px}\n.tile{padding:12px;border-radius:12px;background:var(--panel-2);border:1px solid var(--line);display:grid;gap:4px;min-width:0;text-align:left}\n.tile span{font-size:11.5px;color:var(--muted);white-space:nowrap;overflow:hidden;text-overflow:ellipsis}\n.tile b{font-size:20px;font-weight:500;white-space:nowrap}\n.tile b small{font-size:11.5px;color:var(--muted);font-weight:400;margin-left:2px}\n.tile em{font-style:normal;font-size:11px;color:var(--dim);white-space:nowrap;overflow:hidden;text-overflow:ellipsis}\n.tile .sw{display:inline-block;width:8px;height:8px;border-radius:50%;margin-right:6px}\n\n.seg{display:grid;grid-template-columns:repeat(auto-fit,minmax(130px,1fr));gap:8px}\n.seg button{min-height:52px;padding:8px 12px;border-radius:12px;background:var(--panel-3);border:1px solid var(--line);text-align:left;display:flex;align-items:center;gap:10px;font-weight:500;font-size:13.5px;line-height:1.2}\n.seg button .i{color:var(--muted)}\n.seg button[aria-pressed=\"true\"]{background:var(--accent-soft);border-color:rgba(255,141,77,.6);color:#ffe1cf}\n.seg button[aria-pressed=\"true\"] .i{color:var(--accent)}\n.seg.compact button{min-height:46px;justify-content:center;text-align:center}\n.confirmed{font-size:12.5px;color:var(--muted);display:flex;gap:8px;align-items:center}\n.confirmed b{color:var(--fg);font-weight:600}\n.confirmed .dot{width:7px;height:7px;border-radius:50%;background:var(--ok)}\n.step-ctrl{display:flex;align-items:center;gap:6px;flex:none}\n.step{width:48px;height:48px;border-radius:12px;background:var(--panel-3);border:1px solid var(--line);font-size:24px;line-height:1;font-weight:300;display:grid;place-items:center}\n.step:active{background:var(--accent-soft);border-color:rgba(255,141,77,.5)}\n.step-val{min-width:80px;text-align:center;font-size:22px;font-weight:500}\n.step-val small{font-size:12px;color:var(--muted);margin-left:2px;font-weight:400}\ninput[type=range]{-webkit-appearance:none;appearance:none;width:100%;height:30px;background:transparent;margin:0}\ninput[type=range]::-webkit-slider-runnable-track{height:6px;border-radius:3px;background:linear-gradient(90deg,var(--trk,var(--accent)) var(--p,50%),var(--panel-3) var(--p,50%))}\ninput[type=range]::-moz-range-track{height:6px;border-radius:3px;background:linear-gradient(90deg,var(--trk,var(--accent)) var(--p,50%),var(--panel-3) var(--p,50%))}\ninput[type=range]::-webkit-slider-thumb{-webkit-appearance:none;width:26px;height:26px;border-radius:50%;background:#f4f5f8;border:4px solid var(--trk,var(--accent));margin-top:-10px;box-shadow:0 2px 8px rgba(0,0,0,.4)}\ninput[type=range]::-moz-range-thumb{width:18px;height:18px;border-radius:50%;background:#f4f5f8;border:4px solid var(--trk,var(--accent))}\n.range-ends{display:flex;justify-content:space-between;font-size:11px;color:var(--dim);margin-top:-6px}\n.switch{width:60px;height:36px;border-radius:18px;background:var(--panel-3);border:1px solid var(--line);position:relative;flex:none;transition:background .2s}\n.switch::after{content:\"\";position:absolute;top:4px;left:4px;width:26px;height:26px;border-radius:50%;background:#9aa2b2;transition:transform .22s,background .22s}\n.switch[aria-checked=\"true\"]{background:rgba(255,141,77,.35);border-color:rgba(255,141,77,.6)}\n.switch[aria-checked=\"true\"]::after{transform:translateX(24px);background:#fff}\n\n.list .li{display:flex;align-items:center;gap:12px;padding:11px 16px;min-height:48px}\n.list .li + .li{border-top:1px solid var(--line)}\n.li .sw{width:9px;height:9px;border-radius:3px;flex:none;background:var(--dim)}\n.li .lt{flex:1;min-width:0}\n.li .lt small{display:block;color:var(--dim);font-size:11px}\n.li b{font-weight:600;white-space:nowrap}\n\n.chart-wrap{padding:12px 10px 8px}\n.chart-wrap svg{width:100%;height:auto;display:block}\n.chart-wrap text{font:11px var(--f-ui);fill:var(--muted)}\n.legend{display:flex;flex-wrap:wrap;gap:6px;padding:4px 6px}\n.legend button{display:inline-flex;align-items:center;gap:7px;min-height:36px;padding:0 11px;border-radius:9px;background:var(--panel-3);border:1px solid var(--line);font-size:12.5px}\n.legend button i{width:10px;height:10px;border-radius:50%}\n.legend button[aria-pressed=\"false\"]{opacity:.45}\n\n.week{padding:14px 12px 12px;display:grid;gap:6px}\n.week-hours,.week-row{display:grid;grid-template-columns:30px minmax(0,1fr);align-items:center;gap:8px}\n.week-hours div{display:flex;justify-content:space-between;font-size:10.5px;color:var(--dim)}\n.week-row > b{font-size:12.5px;font-weight:600;color:#c9cfda}\n.cells{display:grid;grid-template-columns:repeat(24,minmax(0,1fr));gap:2px;touch-action:none}\n.cells span{height:34px;border-radius:4px;background:var(--panel-3)}\n.cells span.on{background:linear-gradient(180deg,#ffa36e,#f07b3c)}\n.week-foot{display:flex;flex-wrap:wrap;gap:8px;align-items:center;justify-content:space-between;padding-top:6px}\n.key{display:flex;gap:14px;font-size:12px;color:var(--muted)}\n.key i{display:inline-block;width:10px;height:10px;border-radius:3px;margin-right:6px;vertical-align:-1px}\n\n/* tekst en kast in het schema */\n.tag-l{font:500 12px var(--f-ui);fill:#8a92a3;letter-spacing:.02em}\n.tag-v{font:600 16px var(--f-ui);fill:#f1f3f7}\n.cap{font:700 10.5px var(--f-ui);fill:#6b7385;letter-spacing:.14em}\n.big-t{font:700 30px var(--f-ui);fill:#fff}\n#schema .hit:hover > rect:first-child{stroke:#4a5366}\n#schema .front{transition:opacity .5s;cursor:pointer}\n#schema{background:linear-gradient(180deg,#0b1020,#1a2542 55%,#141a24 85%)}\n#schema .bub circle{transform-box:fill-box;animation:rise 4.5s ease-in infinite}\n#schema .wave path{animation:waft 3.2s ease-out infinite}\n#warmG{transition:transform 1.8s cubic-bezier(.4,0,.2,1)}\n#waveG{animation:wv 2.6s linear infinite}\n@keyframes wv{to{transform:translateX(-40px)}}\n.think{padding:14px 16px;display:grid;gap:12px}\n.th-top{display:flex;align-items:center;justify-content:space-between;gap:8px}\n.th-more{font-size:12.5px;font-weight:600;color:var(--accent);min-height:36px;padding:0 10px;border-radius:9px;background:var(--accent-soft)}\n.th-sub{color:var(--muted);font-size:13px;margin-top:-6px}\n.th-steps{display:grid;gap:12px;padding-top:6px;border-top:1px solid var(--line)}\n.th-sum{font-weight:600;font-size:21px;line-height:1.25}\n.th-step{display:flex;gap:12px;align-items:flex-start}\n.th-step i{flex:none;width:26px;height:26px;border-radius:50%;background:var(--accent-soft);color:var(--accent);display:grid;place-items:center;font-style:normal;font-weight:700;font-size:13px}\n.th-step b{display:block;font-size:13px;margin-bottom:2px}\n.th-step span{color:var(--muted);font-size:12.5px;line-height:1.45}\n.row.dim{opacity:.45;pointer-events:none}\n#fc svg{width:100%;height:auto;display:block}\n#fc svg text{fill:#8a92a3;font:500 10px var(--f-ui)}\n.batt{padding:16px;display:grid;gap:12px}\n.batt-top{display:flex;align-items:center;justify-content:space-between}\n.batt-top b{font-size:34px;font-weight:500}\n.batt-top small{font-size:15px;color:var(--muted);margin-left:2px}\n.chip-s{font-size:12px;font-weight:600;padding:5px 10px;border-radius:8px;background:var(--panel-3);color:var(--muted)}\n.chip-s.on{background:rgba(74,222,128,.15);color:#86efac}\n.batt-bar{height:12px;border-radius:6px;background:var(--panel-3);overflow:hidden}\n.batt-bar i{display:block;height:100%;border-radius:6px;background:linear-gradient(90deg,#60a5fa,#4ade80)}\n.batt-sub{display:flex;justify-content:space-between;font-size:12.5px;color:var(--muted)}\n@keyframes rise{0%{transform:translateY(0);opacity:0}15%{opacity:.85}100%{transform:translateY(-260px);opacity:0}}\n@keyframes waft{0%{transform:translateY(0);opacity:0}25%{opacity:.7}100%{transform:translateY(-34px);opacity:0}}\n@media (prefers-reduced-motion:reduce){#schema .bub,#schema .wave{display:none}}\n#schema .inner{opacity:0;pointer-events:none;transition:opacity .5s}\n#schema.open .front{opacity:0;pointer-events:none}\n#schema.open .inner{opacity:1;pointer-events:auto}\n\n.toast{position:fixed;left:50%;bottom:calc(40px + env(safe-area-inset-bottom,0px));transform:translate(-50%,20px);opacity:0;z-index:40;background:#1d222c;border:1px solid #333a49;border-radius:12px;padding:12px 16px;font-size:13.5px;display:flex;gap:10px;align-items:center;transition:.25s;pointer-events:none;max-width:calc(100% - 32px)}\n.toast.show{opacity:1;transform:translate(-50%,0)}\n.toast .i{color:var(--ok)}\n\n@media (max-width:1500px){\n  .tab .i{display:none}\n  .tab{padding:0 12px}\n}\n@media (max-width:1100px){\n  .m-body{grid-template-columns:minmax(0,1.25fr) minmax(330px,1fr)}\n  .tiles{grid-template-columns:repeat(2,minmax(0,1fr))}\n}\n@media (max-width:860px){\n  body{overflow:auto}\n  .modal{position:relative;left:0;top:0;transform:none;width:100%;height:auto;min-height:100%;border-radius:0;border:0}\n  .m-body{grid-template-columns:1fr}\n  .m-schema{border-right:0;border-bottom:1px solid var(--line)}\n  .m-schema svg{height:auto;aspect-ratio:1160/560}\n  .m-side{grid-template-rows:auto auto}\n  .m-panel{overflow:visible}\n  .m-title{flex-basis:100%}\n  .m-actions{margin-left:auto}\n  .row-line{flex-wrap:wrap}\n  .step-ctrl{margin-left:auto}\n  .m-head{padding-left:max(16px,env(safe-area-inset-left,0px));padding-right:max(16px,env(safe-area-inset-right,0px))}\n  .confirm{right:0;width:min(320px,calc(100vw - 32px))}\n  .sim span:last-child{display:none}\n}\n</style>\n\n<div class=\"modal\" id=\"modal\" role=\"dialog\" aria-modal=\"true\" aria-labelledby=\"mTitle\">\n  <header class=\"m-head\">\n    <div class=\"m-title\">\n      <span class=\"ico\"><svg class=\"i\" viewBox=\"0 0 24 24\" style=\"width:24px;height:24px\"><rect x=\"3\" y=\"5\" width=\"18\" height=\"14\" rx=\"2\"/><circle cx=\"10\" cy=\"12\" r=\"4\"/><path d=\"M17 8v8\"/></svg></span>\n      <div style=\"min-width:0\"><h2 id=\"mTitle\">Warmtepomp</h2><p id=\"mSub\">SPRSUN warmtepomp · Carel-regelaar</p></div>\n      <b class=\"badge\" id=\"mBadge\">Stand-by</b>\n    </div>\n    <div class=\"m-actions\">\n      <button class=\"icon-btn\" id=\"mClose\" aria-label=\"Sluiten\"><svg class=\"i\" viewBox=\"0 0 24 24\"><path d=\"M6 6l12 12M18 6L6 18\"/></svg></button>\n    </div>\n  </header>\n  <div class=\"m-body\">\n    <section class=\"m-schema\">\n      <svg id=\"schema\" viewBox=\"170 90 990 560\" preserveAspectRatio=\"xMidYMid meet\" role=\"img\" aria-label=\"Installatieschema warmtepomp, buffervat en vloerverwarming\">\n        <defs>\n          <linearGradient id=\"tankShine\" x1=\"0\" y1=\"0\" x2=\"1\" y2=\"0\"><stop offset=\"0\" stop-color=\"#000\" stop-opacity=\".35\"/><stop offset=\".22\" stop-color=\"#fff\" stop-opacity=\".22\"/><stop offset=\".45\" stop-color=\"#fff\" stop-opacity=\"0\"/><stop offset=\"1\" stop-color=\"#000\" stop-opacity=\".4\"/></linearGradient>\n          <linearGradient id=\"coldGrad\" x1=\"0\" y1=\"0\" x2=\"0\" y2=\"1\"><stop offset=\"0\" stop-color=\"#3b82f6\"/><stop offset=\"1\" stop-color=\"#1e3a8a\"/></linearGradient>\n          <linearGradient id=\"warmGrad\" x1=\"0\" y1=\"0\" x2=\"0\" y2=\"1\"><stop id=\"tankTop\" offset=\"0\" stop-color=\"#ef4444\"/><stop id=\"tankBot\" offset=\"1\" stop-color=\"#b91c1c\"/></linearGradient>\n          <linearGradient id=\"floorGlowGrad\" x1=\"0\" y1=\"1\" x2=\"0\" y2=\"0\"><stop id=\"floorGlowStop\" offset=\"0\" stop-color=\"#fb923c\" stop-opacity=\".34\"/><stop offset=\"1\" stop-color=\"#fb923c\" stop-opacity=\"0\"/></linearGradient>\n          <linearGradient id=\"roomGrad\" x1=\"0\" y1=\"0\" x2=\"0\" y2=\"1\"><stop offset=\"0\" stop-color=\"#1b2235\"/><stop offset=\"1\" stop-color=\"#2a2f44\"/></linearGradient>\n          <linearGradient id=\"glassGrad\" x1=\"0\" y1=\"0\" x2=\"0\" y2=\"1\"><stop offset=\"0\" stop-color=\"#0f1730\"/><stop offset=\"1\" stop-color=\"#27345c\"/></linearGradient>\n          <linearGradient id=\"casing\" x1=\"0\" y1=\"0\" x2=\"0\" y2=\"1\"><stop offset=\"0\" stop-color=\"#eef1f5\"/><stop offset=\"1\" stop-color=\"#d5dae2\"/></linearGradient>\n          <pattern id=\"fins\" width=\"6\" height=\"26\" patternUnits=\"userSpaceOnUse\"><rect width=\"6\" height=\"26\" fill=\"#1b2a38\"/><path d=\"M3 0V26\" stroke=\"#3d6a8c\" stroke-width=\"1.4\"/></pattern>\n          <pattern id=\"screed\" width=\"14\" height=\"14\" patternUnits=\"userSpaceOnUse\"><rect width=\"14\" height=\"14\" fill=\"#25211f\"/><circle cx=\"4\" cy=\"4\" r=\".9\" fill=\"#34302d\"/><circle cx=\"10\" cy=\"11\" r=\".8\" fill=\"#34302d\"/></pattern>\n          <pattern id=\"plates\" width=\"50\" height=\"8\" patternUnits=\"userSpaceOnUse\"><rect width=\"50\" height=\"8\" fill=\"#2a303b\"/><path d=\"M0 4H50\" stroke=\"#46505f\" stroke-width=\"2\"/></pattern>\n          <pattern id=\"bricks\" width=\"22\" height=\"11\" patternUnits=\"userSpaceOnUse\"><rect width=\"22\" height=\"11\" fill=\"#4a2a24\"/><path d=\"M0 .5H22M0 5.5H22M11 .5V5.5M.5 5.5V11M21.5 5.5V11\" stroke=\"#37201b\" stroke-width=\"1\"/></pattern>\n          <clipPath id=\"tankClip\"><rect x=\"870\" y=\"270\" width=\"80\" height=\"278\" rx=\"24\"/></clipPath>\n          <mask id=\"grilleHole\" maskUnits=\"userSpaceOnUse\" x=\"0\" y=\"200\" width=\"800\" height=\"360\"><rect x=\"0\" y=\"200\" width=\"800\" height=\"360\" fill=\"#fff\"/><circle cx=\"174\" cy=\"380\" r=\"128\" fill=\"#000\"/></mask>\n        </defs>\n\n        <!-- lucht -->\n        <g fill=\"#fff\"><circle cx=\"60\" cy=\"130\" r=\"1.6\" opacity=\".7\"/><circle cx=\"170\" cy=\"180\" r=\"1.2\" opacity=\".5\"/><circle cx=\"300\" cy=\"120\" r=\"1.8\" opacity=\".8\"/><circle cx=\"430\" cy=\"170\" r=\"1.2\" opacity=\".5\"/><circle cx=\"560\" cy=\"130\" r=\"1.5\" opacity=\".7\"/><circle cx=\"660\" cy=\"190\" r=\"1.2\" opacity=\".5\"/><circle cx=\"760\" cy=\"110\" r=\"1.4\" opacity=\".6\"/><circle cx=\"1130\" cy=\"120\" r=\"1.2\" opacity=\".5\"/></g>\n        <circle cx=\"610\" cy=\"120\" r=\"18\" fill=\"#f3efd8\" opacity=\".92\"/><circle cx=\"618\" cy=\"115\" r=\"16\" fill=\"#0f1730\" opacity=\".55\"/>\n\n        <!-- buiten: tegelvloer en struikjes -->\n        <ellipse cx=\"712\" cy=\"552\" rx=\"34\" ry=\"22\" fill=\"#1f4d3a\"/><ellipse cx=\"692\" cy=\"556\" rx=\"24\" ry=\"16\" fill=\"#27614a\"/><ellipse cx=\"722\" cy=\"544\" rx=\"18\" ry=\"12\" fill=\"#2f7458\" opacity=\".9\"/>\n        <rect x=\"0\" y=\"560\" width=\"740\" height=\"100\" fill=\"#141a24\"/><path d=\"M0 590H740M0 622H740M120 560V660M260 560V660M400 560V660M540 560V660M680 560V660\" stroke=\"#1d2431\" stroke-width=\"2\"/>\n        <rect x=\"0\" y=\"548\" width=\"740\" height=\"12\" fill=\"#2b3039\"/>\n        <ellipse cx=\"381\" cy=\"551\" rx=\"200\" ry=\"7\" fill=\"#000\" opacity=\".4\"/>\n\n        <!-- huis: doorsnede van de woonkamer met vloer -->\n        <rect x=\"740\" y=\"150\" width=\"14\" height=\"510\" fill=\"url(#bricks)\"/>\n        <rect id=\"floorGlow\" x=\"760\" y=\"400\" width=\"390\" height=\"148\" fill=\"url(#floorGlowGrad)\" opacity=\"0\" style=\"transition:opacity 1s\"/>\n        <rect x=\"754\" y=\"548\" width=\"406\" height=\"8\" fill=\"#6b4a32\"/>\n        <rect x=\"754\" y=\"556\" width=\"406\" height=\"50\" fill=\"url(#screed)\"/>\n        <rect x=\"754\" y=\"606\" width=\"406\" height=\"20\" fill=\"#26332a\"/>\n        <rect x=\"754\" y=\"626\" width=\"406\" height=\"34\" fill=\"#2f3138\"/>\n        <text x=\"973\" y=\"646\" text-anchor=\"middle\" class=\"cap\">VLOERVERWARMING</text>\n        <rect x=\"736\" y=\"381\" width=\"22\" height=\"22\" rx=\"4\" fill=\"#3a404c\" stroke=\"#6b7485\" stroke-width=\"1.5\"/>\n        <rect x=\"736\" y=\"405\" width=\"22\" height=\"22\" rx=\"4\" fill=\"#3a404c\" stroke=\"#6b7485\" stroke-width=\"1.5\"/>\n        <rect x=\"868\" y=\"538\" width=\"84\" height=\"10\" rx=\"3\" fill=\"#3a404c\"/>\n\n        <!-- buitenunit (verkleind, zodat hij in verhouding staat met vat en huis) -->\n        <g id=\"unit\" transform=\"translate(185 247) scale(.55)\">\n          <rect x=\"64\" y=\"536\" width=\"38\" height=\"12\" rx=\"2\" fill=\"#5d6575\"/><rect x=\"610\" y=\"536\" width=\"38\" height=\"12\" rx=\"2\" fill=\"#5d6575\"/>\n          <g class=\"inner\">\n            <rect x=\"12\" y=\"224\" width=\"688\" height=\"312\" rx=\"18\" fill=\"#141922\" stroke=\"#2b3242\" stroke-width=\"1.5\"/>\n            <rect x=\"24\" y=\"236\" width=\"300\" height=\"288\" rx=\"10\" fill=\"url(#fins)\" stroke=\"#2f4a61\"/>\n            <rect id=\"frostFins\" x=\"24\" y=\"236\" width=\"300\" height=\"288\" rx=\"10\" fill=\"#e0f2fe\" opacity=\"0\" style=\"transition:opacity .8s\"/>\n          </g>\n          <g class=\"hit\" id=\"fanGroup\" transform=\"translate(174 380)\">\n            <circle r=\"142\" fill=\"#0f1319\" stroke=\"#2b3242\"/>\n            <g id=\"fanRot\" fill=\"#4d5664\"><path d=\"M0 -8 C 16 -16 28 -40 10 -50 C -4 -37 -8 -21 0 -8Z\" transform=\"scale(2.4)\"/><path d=\"M0 -8 C 16 -16 28 -40 10 -50 C -4 -37 -8 -21 0 -8Z\" transform=\"rotate(72) scale(2.4)\"/><path d=\"M0 -8 C 16 -16 28 -40 10 -50 C -4 -37 -8 -21 0 -8Z\" transform=\"rotate(144) scale(2.4)\"/><path d=\"M0 -8 C 16 -16 28 -40 10 -50 C -4 -37 -8 -21 0 -8Z\" transform=\"rotate(216) scale(2.4)\"/><path d=\"M0 -8 C 16 -16 28 -40 10 -50 C -4 -37 -8 -21 0 -8Z\" transform=\"rotate(288) scale(2.4)\"/></g>\n            <circle r=\"16\" fill=\"#7b838f\"/><circle r=\"6\" fill=\"#4d5664\"/>\n            <circle id=\"frostFan\" r=\"142\" fill=\"#e0f2fe\" opacity=\"0\" style=\"transition:opacity .8s\"/>\n          </g>\n          <g class=\"inner\">\n            <g id=\"refPipes\"></g>\n            <rect x=\"584\" y=\"240\" width=\"80\" height=\"90\" rx=\"6\" fill=\"url(#plates)\" stroke=\"#46505f\"/>\n            <circle cx=\"664\" cy=\"264\" r=\"5\" fill=\"#8b939f\"/><circle cx=\"664\" cy=\"306\" r=\"5\" fill=\"#8b939f\"/>\n            <g class=\"hit\" data-tab=\"waarden\">\n              <rect x=\"584\" y=\"432\" width=\"80\" height=\"80\" rx=\"36\" fill=\"#2a303b\" stroke=\"#566070\" stroke-width=\"2\"/>\n              <circle cx=\"624\" cy=\"472\" r=\"22\" fill=\"#1b2029\" stroke=\"#46505f\" stroke-width=\"2\"/>\n              <circle id=\"compLed\" cx=\"624\" cy=\"472\" r=\"9\" fill=\"#5d6575\"/>\n            </g>\n            <g transform=\"translate(500 380)\"><path d=\"M-12 -13 L12 -13 L-12 13 L12 13Z\" fill=\"#2a303b\" stroke=\"#8b939f\" stroke-width=\"1.6\"/><path d=\"M0 0 V-18 M-7 -18 H7\" stroke=\"#8b939f\" stroke-width=\"1.6\"/></g>\n            <circle cx=\"700\" cy=\"264\" r=\"9\" fill=\"#7d8694\" stroke=\"#5d6575\" stroke-width=\"2\"/><circle cx=\"700\" cy=\"306\" r=\"9\" fill=\"#7d8694\" stroke=\"#5d6575\" stroke-width=\"2\"/>\n          </g>\n          <g id=\"hpFront\" class=\"front\">\n            <rect x=\"12\" y=\"224\" width=\"688\" height=\"312\" rx=\"18\" fill=\"url(#casing)\" stroke=\"#9aa3b0\" stroke-width=\"2\" mask=\"url(#grilleHole)\"/>\n            <circle cx=\"174\" cy=\"380\" r=\"131\" fill=\"none\" stroke=\"#aab2bd\" stroke-width=\"6\"/>\n            <g fill=\"none\" stroke=\"#b3bbc6\" stroke-width=\"2.4\"><circle cx=\"174\" cy=\"380\" r=\"100\"/><circle cx=\"174\" cy=\"380\" r=\"72\"/><circle cx=\"174\" cy=\"380\" r=\"42\"/><path d=\"M174 252V508M46 380H302M83.5 289.5L264.5 470.5M264.5 289.5L83.5 470.5\"/></g>\n            <circle cx=\"174\" cy=\"380\" r=\"24\" fill=\"#c4cad3\" stroke=\"#aab2bd\" stroke-width=\"2\"/>\n            <text x=\"512\" y=\"392\" text-anchor=\"middle\" font-family=\"Outfit, Figtree, sans-serif\" font-style=\"italic\" font-weight=\"700\" font-size=\"50\" letter-spacing=\"2\" fill=\"#5d6675\">SPRSUN</text>\n            <circle cx=\"700\" cy=\"264\" r=\"9\" fill=\"#7d8694\" stroke=\"#5d6575\" stroke-width=\"2\"/><circle cx=\"700\" cy=\"306\" r=\"9\" fill=\"#7d8694\" stroke=\"#5d6575\" stroke-width=\"2\"/>\n          </g>\n        </g>\n\n        <!-- meetpunten: genummerde speldjes op de unit + overzicht erboven (alleen bij geopende kast) -->\n        <g class=\"inner\" id=\"pins\"></g>\n        <g class=\"inner hit\" id=\"refPanel\" data-tab=\"waarden\" transform=\"translate(192 166)\"></g>\n\n        <!-- watercircuit (JS) -->\n        <g id=\"waterPipes\"></g>\n\n        <!-- kaartjes onder de unit -->\n        <g class=\"hit\" data-tab=\"overzicht\">\n          <rect x=\"192\" y=\"574\" width=\"181\" height=\"68\" rx=\"14\" fill=\"rgba(12,15,21,.94)\" stroke=\"#2e3443\"/>\n          <g transform=\"translate(206 590)\" fill=\"none\" stroke=\"#fbbf24\" stroke-width=\"2.2\" stroke-linecap=\"round\" stroke-linejoin=\"round\"><path d=\"M10 0L2 12H9L7 24L16 10H9Z\"/></g>\n          <text x=\"236\" y=\"596\" class=\"cap\" style=\"font-size:9.5px\">VERMOGEN</text>\n          <text id=\"pwVal\" x=\"236\" y=\"620\" class=\"big-t\" style=\"font-size:22px\">0 W</text>\n          <rect x=\"236\" y=\"628\" width=\"123\" height=\"6\" rx=\"3\" fill=\"#252b37\"/><rect id=\"pwBar\" x=\"236\" y=\"628\" width=\"0\" height=\"6\" rx=\"3\" fill=\"#fbbf24\"/>\n        </g>\n        <g class=\"hit\" data-tab=\"overzicht\">\n          <rect x=\"389\" y=\"574\" width=\"181\" height=\"68\" rx=\"14\" fill=\"rgba(12,15,21,.94)\" stroke=\"#2e3443\"/>\n          <g transform=\"translate(403 590)\" fill=\"none\" stroke=\"#a78bfa\" stroke-width=\"2.2\" stroke-linecap=\"round\" stroke-linejoin=\"round\"><path d=\"M5 3a3.5 3.5 0 0 1 7 0V14a6 6 0 1 1-7 0Z\"/><path d=\"M8.5 9V16\"/></g>\n          <text x=\"433\" y=\"596\" class=\"cap\" style=\"font-size:9.5px\">BUITEN</text>\n          <text id=\"outVal\" x=\"433\" y=\"624\" class=\"big-t\" style=\"font-size:22px\">0 °C</text>\n        </g>\n\n        <!-- buffervat: altijd vol, de kleur en het warme niveau tonen hoe warm het water is -->\n        <g class=\"hit\" data-tab=\"instellingen\" data-focus=\"hyst\">\n          <text x=\"910\" y=\"258\" text-anchor=\"middle\" class=\"cap\">BUFFERVAT</text>\n          <g clip-path=\"url(#tankClip)\">\n            <rect x=\"870\" y=\"270\" width=\"80\" height=\"278\" fill=\"url(#coldGrad)\"/>\n            <g id=\"warmG\" style=\"transform:translateY(540px)\"><g id=\"waveG\"><path d=\"M850 0 q10 -7 20 0 t20 0 t20 0 t20 0 t20 0 t20 0 t20 0 t20 0 V300 H850Z\" fill=\"url(#warmGrad)\"/></g></g>\n            <rect id=\"band\" x=\"870\" y=\"331\" width=\"80\" height=\"62\" fill=\"#fff\" opacity=\".09\"/>\n            <rect x=\"880\" y=\"286\" width=\"7\" height=\"236\" rx=\"3.5\" fill=\"#fff\" opacity=\".22\"/>\n            <g class=\"bub\" id=\"bubbles\" fill=\"#fff\" fill-opacity=\".55\"><circle cx=\"890\" cy=\"530\" r=\"3.5\" style=\"animation-delay:0s\"/><circle cx=\"910\" cy=\"540\" r=\"5\" style=\"animation-delay:1.1s;animation-duration:5.2s\"/><circle cx=\"928\" cy=\"525\" r=\"3\" style=\"animation-delay:2.2s;animation-duration:4s\"/><circle cx=\"900\" cy=\"545\" r=\"4\" style=\"animation-delay:3.1s;animation-duration:5.6s\"/><circle cx=\"920\" cy=\"535\" r=\"2.5\" style=\"animation-delay:.6s;animation-duration:3.8s\"/></g>\n          </g>\n          <rect x=\"870\" y=\"270\" width=\"80\" height=\"278\" rx=\"24\" fill=\"url(#tankShine)\"/>\n          <rect x=\"870\" y=\"270\" width=\"80\" height=\"278\" rx=\"24\" fill=\"none\" stroke=\"#c3c9d2\" stroke-width=\"2.5\"/>\n          <rect x=\"888\" y=\"260\" width=\"44\" height=\"14\" rx=\"7\" fill=\"#b9c0cb\" stroke=\"#8b939f\"/>\n          <line id=\"stMark\" x1=\"862\" x2=\"958\" y1=\"393\" y2=\"393\" stroke=\"#7dd3fc\" stroke-width=\"1.6\" stroke-dasharray=\"5 4\"/>\n          <text id=\"stMarkT\" x=\"964\" y=\"397\" class=\"tag-l\" style=\"fill:#7dd3fc\">start 36°</text>\n          <line id=\"spMark\" x1=\"862\" x2=\"958\" y1=\"331\" y2=\"331\" stroke=\"#fff\" stroke-width=\"1.6\" stroke-dasharray=\"5 4\" opacity=\".9\"/>\n          <text id=\"spMarkT\" x=\"964\" y=\"335\" class=\"tag-l\" style=\"fill:#fff\">doel 40°</text>\n          <path id=\"tankCoil\" d=\"M870,392 H902 Q912,392 912,397.5 Q912,403 902,403 H886 Q878,403 878,409 Q878,415 886,415 H870\" fill=\"none\" stroke=\"#fb923c\" stroke-width=\"3.5\" stroke-linecap=\"round\" stroke-linejoin=\"round\" opacity=\".55\"/>\n          <g fill=\"#8b939f\" stroke=\"#5d6575\"><rect x=\"860\" y=\"385\" width=\"12\" height=\"14\" rx=\"3\"/><rect x=\"860\" y=\"408\" width=\"12\" height=\"14\" rx=\"3\"/><rect x=\"860\" y=\"503\" width=\"12\" height=\"14\" rx=\"3\"/><rect x=\"948\" y=\"463\" width=\"12\" height=\"14\" rx=\"3\"/></g>\n          <text id=\"tankTemp\" x=\"910\" y=\"502\" text-anchor=\"middle\" class=\"big-t\" style=\"paint-order:stroke;font-size:26px\" stroke=\"rgba(0,0,0,.35)\" stroke-width=\"4\">36,4°</text>\n          <text x=\"910\" y=\"522\" text-anchor=\"middle\" class=\"tag-l\" style=\"fill:rgba(255,255,255,.85)\">Reg 195</text>\n        </g>\n        <!-- circulatiepomp -->\n        <g transform=\"translate(800 392)\"><circle r=\"14\" fill=\"#262b34\" stroke=\"#8b939f\" stroke-width=\"2\"/><g id=\"pumpRot\"><path d=\"M0 -9 L3.2 0 L0 9 L-3.2 0Z\" fill=\"#c3c9d2\"/><path d=\"M-9 0 L0 -3.2 L9 0 L0 3.2Z\" fill=\"#c3c9d2\" opacity=\".7\"/></g></g>\n        <!-- vloerverwarming: plat in de dekvloer -->\n        <g id=\"floorPipes\"></g>\n        <g class=\"wave\" id=\"waves\" fill=\"none\" stroke=\"#fb923c\" stroke-width=\"3\" stroke-linecap=\"round\"><path d=\"M980 540q6-8 12 0t12 0t12 0\" style=\"animation-delay:0s\"/><path d=\"M1030 540q6-8 12 0t12 0t12 0\" style=\"animation-delay:1s\"/><path d=\"M1080 540q6-8 12 0t12 0t12 0\" style=\"animation-delay:2s\"/><path d=\"M1000 540q6-8 12 0t12 0t12 0\" style=\"animation-delay:1.6s\"/></g>\n        <g id=\"waterTags\"></g>\n      </svg>\n\n      <div class=\"lamps\"><div id=\"lampRow\"></div></div>\n    </section>\n    <section class=\"m-side\">\n      <nav class=\"tabs\" id=\"tabs\" role=\"tablist\"></nav>\n      <div class=\"m-panel\" id=\"mPanel\"></div>\n    </section>\n  </div>\n</div>\n<button class=\"reopen\" id=\"reopen\" hidden><svg class=\"i\" viewBox=\"0 0 24 24\"><rect x=\"3\" y=\"5\" width=\"18\" height=\"14\" rx=\"2\"/><circle cx=\"10\" cy=\"12\" r=\"4\"/><path d=\"M17 8v8\"/></svg>Popup openen</button>\n<div class=\"toast\" id=\"toast\" role=\"status\"><svg class=\"i\" viewBox=\"0 0 24 24\"><path d=\"M5 12l5 5 9-10\"/></svg><span id=\"toastText\"></span></div>\n\n<script>\n/* =====================================================================\n   SPRSUN warmtepomp – popup voor het huisdashboard (wandtablet)\n   ---------------------------------------------------------------------\n   Plaats #modal in je huisdashboard en open hem bij een klik op de\n   warmtepomp naast het huis (openModal() / closeModal()).\n   Alles op het scherm komt uit `state`.\n   Koppelen aan Home Assistant:\n     1. Vul in ENTITIES je eigen entity_id's in (nu placeholders).\n     2. Roep bij elke hass-update `fromHass(hass)` aan  -> vult state + render().\n     3. Zet HA_BRIDGE.callService = (domain, service, data) => hass.callService(domain, service, data)\n     4. Zet SIM.active = null: dan verdwijnen de voorbeeldwaarden en gebruikt de popup alleen jouw HA-waarden.\n   Stilstand: draait de circulatiepomp niet (circ_pump en compressor uit), dan staat het water\n   stil. De aanvoersensor zakt dan terug naar kamertemperatuur; dat wordt als \"stil\" getoond en\n   alle animaties staan uit.\n   ===================================================================== */\n\nconst ENTITIES = {\n  // --- hoofdbediening & slimme aansturing (schrijfbaar) ---\n  smart_active: { id: 'input_boolean.wp_slimme_regeling_actief', type: 'bool' },\n  comfort:      { id: 'input_number.wp_comfort_verschuiving', type: 'number' },     // -5 .. +5, de 1-knops hoofdregelaar\n  sp_boiler:    { id: 'input_number.wp_setpoint_warmwater', type: 'number' },       // handmatig doel buffervat\n  // --- instellingen (popup) ---\n  curve_on:     { id: 'input_boolean.wp_slim_stooklijn_actief', type: 'bool' },\n  curve_15:     { id: 'input_number.wp_stooklijn_temp_bij_15c', type: 'number' },\n  curve_0:      { id: 'input_number.wp_stooklijn_temp_bij_0c', type: 'number' },\n  zp_on:        { id: 'input_boolean.wp_slim_zonneplan_actief', type: 'bool' },\n  boost_cheap:  { id: 'input_number.wp_slim_boost_goedkoop', type: 'number' },\n  reduce_peak:  { id: 'input_number.wp_slim_verlaging_duur', type: 'number' },\n  hyst:         { id: 'input_number.wp_hysterese_warmwater', type: 'number' },\n  slot_on:      { id: 'input_boolean.wp_slim_tijdvak_boost_actief', type: 'bool' },\n  slot_start:   { id: 'input_number.wp_slim_tijdvak_start_uur', type: 'number' },\n  slot_end:     { id: 'input_number.wp_slim_tijdvak_eind_uur', type: 'number' },\n  slot_boost:   { id: 'input_number.wp_slim_tijdvak_verhoging', type: 'number' },\n  fan_mode:     { id: 'input_select.wp_ventilatormodus_select', type: 'select' },\n  mode:         { id: 'input_select.wp_werkmodus_select', type: 'select' },\n  pump_mode:    { id: 'input_select.wp_pompmodus_select', type: 'select' },\n  // --- gedachtegang van de slimme regeling (alleen lezen) ---\n  smart_target: { id: 'sensor.wp_slimme_doeltemperatuur_berekend', type: 'number' },\n  thought:      { id: 'sensor.wp_slimme_regeling_gedachtegang', type: 'text' },\n  thought1:     { id: 'sensor.wp_slimme_regeling_gedachtegang', attr: 'stap_1_stooklijn' },\n  thought2:     { id: 'sensor.wp_slimme_regeling_gedachtegang', attr: 'stap_2_zonneplan' },\n  thought3:     { id: 'sensor.wp_slimme_regeling_gedachtegang', attr: 'stap_3_tijdvak' },\n  // --- installatie (alleen lezen) ---\n  status:       { id: 'sensor.wp_status_samenvatting', type: 'text' },\n  compressor:   { id: 'binary_sensor.wp_compressor_actief', type: 'bool' },\n  t_boiler:     { id: 'sensor.wp_boiler_temperatuur', type: 'number' },             // buffervat, Reg 195\n  sp_boiler_reg:{ id: 'sensor.wp_setpoint_warmwatervat', type: 'number' },          // doel dat de warmtepomp nu gebruikt\n  hyst_reg:     { id: 'sensor.wp_hysterese_warmwater_start_delta_t', type: 'number' },\n  t_outdoor:    { id: 'sensor.wp_buitentemperatuur', type: 'number' },\n  t_supply:     { id: 'sensor.wp_aanvoertemperatuur', type: 'number' },\n  t_return:     { id: 'sensor.wp_retourtemperatuur', type: 'number' },\n  dt_water:     { id: 'sensor.wp_water_delta_t_aanvoer_retour', type: 'number' },\n  comp_hz:      { id: 'sensor.wp_compressor_frequentie', type: 'number' },\n  comp_current: { id: 'sensor.wp_compressor_stroom', type: 'number' },\n  fan1_rpm:     { id: 'sensor.wp_ventilator_1_toerental', type: 'number' },\n  fan2_rpm:     { id: 'sensor.wp_ventilator_2_toerental', type: 'number' },\n  pump_drive:   { id: 'sensor.wp_circulatiepomp_aansturing', type: 'number' },\n  circ_pump:    { id: 'binary_sensor.wp_circulatiepomp_actief', type: 'bool' },\n  defrost:      { id: 'binary_sensor.wp_ontdooicyclus_defrost', type: 'bool' },\n  t_discharge:  { id: 'sensor.wp_persgastemperatuur', type: 'number' },\n  t_suction:    { id: 'sensor.wp_zuiggastemperatuur', type: 'number' },\n  t_condenser:  { id: 'sensor.wp_condensor_spoeltemperatuur', type: 'number' },\n  p_high:       { id: 'sensor.wp_persdruk_hogedruk', type: 'number' },\n  p_low:        { id: 'sensor.wp_zuigdruk_lagedruk', type: 'number' },\n  eev:          { id: 'sensor.wp_expansieventiel_eev_opening', type: 'number' },\n  superheat:    { id: 'sensor.wp_oververhitting_superheat', type: 'number' },\n  // --- energie, Zonneplan & thuisbatterij (alleen lezen) ---\n  power_w:      { id: 'sensor.kwh_meter_3_phase_power', type: 'number' },\n  price:        { id: 'sensor.zonneplan_current_electricity_tariff', type: 'number' },\n  forecast:     { id: 'sensor.zonneplan_current_electricity_tariff', attr: 'forecast', type: 'forecast' }, // uurtarieven\n  zp_tip:       { id: 'sensor.zonneplan_status_tip', type: 'text' },\n  batt_pct:     { id: 'sensor.thuisbatterij_percentage', type: 'number' },\n  batt_w:       { id: 'sensor.kwh_meter_3_phase_thuisbatterij_35_kw_vermogen', type: 'number' },\n  batt_status:  { id: 'sensor.thuisbatterij_batterijstatus', type: 'text' },\n  boiler_w:     { id: 'sensor.energy_socket_power', type: 'number' },               // losse tapwaterboiler\n  // --- virtuele vloer-flow (afgeleid van het afkoelen van het vat, zie HA package) ---\n  cool_rate:    { id: 'sensor.wp_buffervat_afkoelsnelheid', type: 'number' },        // °C/uur dat het vat daalt (positief = koelt af)\n  floor_demand: { id: 'binary_sensor.wp_vloerverwarming_vraagt_warmte', type: 'bool' }, // aan = vloer neemt warmte af\n};\nconst HA_BRIDGE = { callService: (d, s, data) => { if (window.parent && window.parent !== window) window.parent.postMessage({ type: \"ha-call-service\", domain: d, service: s, data: data }, \"*\"); } }; // (domain, service, data) => Promise\n\n// Opties van de select-entities; maak ze exact gelijk aan de opties in HA.\nconst OPTIONS = {\n  mode: [\n    { v: 'Warmwater (Boiler)', icon: 'tank' },\n    { v: 'Verwarmen', icon: 'floor' },\n    { v: 'Koelen', icon: 'snow' },\n  ],\n  fan_mode: ['Dagmodus (Normaal)', 'Nachtmodus (Stil)', 'Eco Modus', 'Drukregeling'],\n  pump_mode: ['Continu (Normaal)', 'Op Aanvraag (Demand)', 'Interval'],\n};\n\n// Mock-waarden (alleen voor het ontwerp)\nconst state = {\n  power: true,\n  smart_active: true, comfort: 0.5, sp_boiler: 40.5, smart_target: 40.5,\n  curve_on: true, curve_15: 38, curve_0: 46, zp_on: true, boost_cheap: 3, reduce_peak: -2,\n  hyst: 5, slot_on: false, slot_start: 12, slot_end: 15, slot_boost: 2,\n  fan_mode: 'Dagmodus (Normaal)', mode: 'Warmwater (Boiler)', pump_mode: 'Op Aanvraag (Demand)',\n  thought: 'Normaal tarief: doel 40,5 °C',\n  thought1: 'Buiten 11,4 °C → stooklijn 40,0 °C, comfort +0,5 °C = 40,5 °C',\n  thought2: 'Avondpiek 17–21u (4 uur) · batterij 64 % → de 3 duurste uren worden verlaagd. Goedkoopste uren: 02–04u en 12–14u.',\n  thought3: 'Normaal 40,5 °C · Middag-buffer 45,0 °C · Avondpiek 38,5 °C',\n  status: 'Rust - Buffervat op temperatuur',\n  compressor: false, circ_pump: false, defrost: false,\n  t_boiler: 40.3, sp_boiler_reg: 40.5, hyst_reg: 5, t_outdoor: 11.4, t_supply: 17.4, t_return: 21.4, dt_water: -4.0,\n  comp_hz: 0, comp_current: 0, fan1_rpm: 0, fan2_rpm: 0, pump_drive: 0,\n  t_discharge: 19.7, t_suction: 14.8, t_condenser: 10.9, p_high: 10.1, p_low: 10.0, eev: 0, superheat: 4.4,\n  power_w: 7, boiler_w: 2, cool_rate: 0.4, floor_demand: false,\n  price: 0.214, zp_tip: 'Laden bij lage prijs, ontladen in de avondpiek',\n  batt_pct: 64, batt_w: 0, batt_status: 'Stand-by',\n  forecast: null, // [{ h: uur 0-23, p: prijs }]\n};\nstate.forecast = [.19,.18,.17,.17,.18,.2,.24,.29,.27,.22,.17,.13,.11,.1,.11,.14,.21,.3,.36,.38,.35,.31,.26,.22].map((p, h) => ({ h, p }));\n\n/* ---------------- Simulatie (alleen voor het ontwerp) ---------------- */\nconst BASE = { ...state };\nconst HEATING = { compressor: true, circ_pump: true, defrost: false, comp_hz: 70, comp_current: 6.8, fan1_rpm: 640, fan2_rpm: 620, pump_drive: 70,\n  t_supply: 47.2, t_return: 41.8, dt_water: 5.4, t_discharge: 78.4, t_suction: 5.1, t_condenser: 44.9, p_high: 25.4, p_low: 7.9, eev: 220, superheat: 4.9 };\nconst SCENARIOS = {\n  rest:      { label: 'Rust', sub: 'Vat op temperatuur, water staat stil', patch: {} },\n  verwarmen: { label: 'Vat opwarmen', sub: 'Onder de startlijn, warmtepomp bijverwarmen tot het doel', patch: { ...HEATING,\n    status: 'Verwarmen in bedrijf (70 Hz · 3900 W)', t_boiler: 34.6, power_w: 3900, floor_demand: true } },\n  boost:     { label: 'Goedkoop uur', sub: 'Middag-buffer: doel +4,5 °C', patch: { ...HEATING, comp_hz: 64, comp_current: 6.2,\n    status: 'Verwarmen in bedrijf (64 Hz · 3500 W)', t_boiler: 40.1, sp_boiler_reg: 45, smart_target: 45, power_w: 3500, floor_demand: true, price: 0.092, batt_pct: 71, batt_w: 3200, batt_status: 'Laden',\n    thought: 'Goedkoop tarief: doel +4,5 °C → 45,0 °C',\n    thought2: 'Nu 13:00 is een van de 3 goedkoopste middaguren (+4,5 °C), de avondpiek duurt 4 uur.' } },\n  piek:      { label: 'Avondpiek', sub: 'Doel verlaagd, batterij levert', patch: {\n    status: 'Rust - Avondpiek, doel verlaagd', cool_rate: 2.3, floor_demand: true, sp_boiler_reg: 38.5, smart_target: 38.5, t_boiler: 39.6, price: 0.362, batt_pct: 58, batt_w: -4100, batt_status: 'Ontladen',\n    thought: 'Dure avondpiek: doel −2,0 °C → 38,5 °C',\n    thought2: 'Piek 17–21u · batterij 58 % → de 3 duurste uren (18–21u) worden verlaagd.' } },\n  vloer:     { label: 'Vloer vraagt warmte', sub: 'Pomp stil, vat koelt snel af', patch: { cool_rate: 2.1, floor_demand: true, t_boiler: 38.4, status: 'Rust - Vloerverwarming haalt warmte uit het vat' } },\n  defrost:   { label: 'Ontdooicyclus', sub: 'IJs van de verdamper', patch: {\n    status: 'Ontdooien - verdamper vrijmaken', compressor: true, circ_pump: true, defrost: true, comp_hz: 52, comp_current: 6.1, fan1_rpm: 0, fan2_rpm: 0, pump_drive: 70,\n    t_supply: 24.6, t_return: 28.3, dt_water: -3.7, t_boiler: 38.2, t_outdoor: 1.8, power_w: 2400,\n    t_discharge: 64.0, t_suction: -4.2, t_condenser: 12.5, p_high: 18.2, p_low: 4.9, eev: 300, superheat: 2.1 } },\n};\nconst SIM = { active: null };\nlet userSettings = {};\nfunction applyScenario(key) {\n  SIM.active = key;\n  if (key) Object.assign(state, BASE, SCENARIOS[key].patch, userSettings);\n  render();\n}\n\n/* ---------------- Home Assistant koppeling ---------------- */\nfunction fromHass(hass) {\n  if (!hass || !hass.states) return;\n  for (const [key, ent] of Object.entries(ENTITIES)) {\n    const s = hass.states[ent.id];\n    if (!s) continue;\n    if (ent.attr) { const v = s.attributes && s.attributes[ent.attr]; if (v == null) continue;\n      state[key] = ent.type === 'forecast' ? v.map(x => { let p = Number(x.electricity_price ?? x.tariff ?? x.price ?? 0); if (Math.abs(p) > 50) p /= 1e7; return { h: new Date(x.datetime).getHours(), p }; }) : v; continue; }\n    if (s.state === 'unavailable' || s.state === 'unknown') continue;\n    if (ent.type === 'bool') state[key] = s.state === 'on';\n    else if (ent.type === 'number') { const n = parseFloat(s.state); if (!isNaN(n)) state[key] = key === 'reduce_peak' ? -Math.abs(n) : n; }\n    else state[key] = s.state;\n  }\n  render();\n}\nfunction sendToHA(key, value) {\n  const ent = ENTITIES[key];\n  if (!ent) return;\n  const [domain] = ent.id.split('.');\n  let service, data = { entity_id: ent.id };\n  if (domain === 'number' || domain === 'input_number') { service = 'set_value'; data.value = key === 'reduce_peak' ? Math.abs(value) : value; }\n  else if (domain === 'select' || domain === 'input_select') { service = 'select_option'; data.option = value; }\n  else if (domain === 'switch' || domain === 'input_boolean') { service = value ? 'turn_on' : 'turn_off'; }\n  else return;\n  if (HA_BRIDGE.callService) HA_BRIDGE.callService(domain, service, data);\n  else console.info('[HA]', domain + '.' + service, data);\n}\n\n/* ---------------- helpers ---------------- */\nconst $ = (s, r = document) => r.querySelector(s);\nconst $$ = (s, r = document) => [...r.querySelectorAll(s)];\nconst NS = 'http://www.w3.org/2000/svg';\nfunction svgEl(tag, attrs = {}, parent) { const e = document.createElementNS(NS, tag); for (const k in attrs) e.setAttribute(k, attrs[k]); if (parent) parent.appendChild(e); return e; }\nconst fmt = (n, d = 1) => (n == null || isNaN(n)) ? '–' : Number(n).toLocaleString('nl-NL', { minimumFractionDigits: d, maximumFractionDigits: d });\nconst clamp = (v, a, b) => Math.min(b, Math.max(a, v));\nconst RM = matchMedia('(prefers-reduced-motion: reduce)').matches;\nconst TSTOPS = [[8,[59,130,246]],[18,[34,195,230]],[27,[52,211,153]],[35,[250,204,21]],[45,[251,146,60]],[55,[239,68,68]]];\nfunction tempRGB(t) {\n  if (t <= TSTOPS[0][0]) return TSTOPS[0][1];\n  for (let i = 1; i < TSTOPS.length; i++) {\n    const [t1, c1] = TSTOPS[i];\n    if (t <= t1) { const [t0, c0] = TSTOPS[i - 1]; const f = (t - t0) / (t1 - t0); return c0.map((v, j) => Math.round(v + (c1[j] - v) * f)); }\n  }\n  return TSTOPS[TSTOPS.length - 1][1];\n}\nconst tempColor = (t, a = 1) => { const c = tempRGB(t); return `rgba(${c[0]},${c[1]},${c[2]},${a})`; };\nconst ICONS = {\n  bolt: '<path d=\"M13 3L5 13h6l-1 8 8-10h-6z\"/>',\n  battery: '<rect x=\"3\" y=\"8\" width=\"16\" height=\"9\" rx=\"2\"/><path d=\"M21 11v3M7 12h4\"/>',\n  tank: '<rect x=\"7\" y=\"3\" width=\"10\" height=\"18\" rx=\"4\"/><path d=\"M7 12h10\"/>',\n  floor: '<path d=\"M3 20h18\"/><path d=\"M6 16c0-2 2-2 2-4s-2-2-2-4M12 16c0-2 2-2 2-4s-2-2-2-4M18 16c0-2 2-2 2-4s-2-2-2-4\"/>',\n  snow: '<path d=\"M12 3v18M4.2 7.5l15.6 9M4.2 16.5l15.6-9\"/>',\n  combo: '<rect x=\"3\" y=\"4\" width=\"7\" height=\"16\" rx=\"3\"/><path d=\"M14 20h7M15 16c0-2 2-2 2-4s-2-2-2-4M19 16c0-2 2-2 2-4\"/>',\n  clock: '<circle cx=\"12\" cy=\"12\" r=\"9\"/><path d=\"M12 7v5l3 2\"/>',\n  thermo: '<path d=\"M10 4a2 2 0 0 1 4 0v10a4 4 0 1 1-4 0z\"/><path d=\"M12 9v7\"/>',\n  sliders: '<path d=\"M4 7h10M18 7h2M4 17h4M12 17h8\"/><circle cx=\"16\" cy=\"7\" r=\"2\"/><circle cx=\"10\" cy=\"17\" r=\"2\"/>',\n  calendar: '<rect x=\"4\" y=\"5\" width=\"16\" height=\"15\" rx=\"2\"/><path d=\"M4 10h16M9 3v4M15 3v4\"/>',\n  heater: '<path d=\"M6 20V9a2 2 0 0 1 4 0v11M14 20V9a2 2 0 0 1 4 0v11M4 20h16\"/>',\n  delta: '<path d=\"M12 4l8 15H4z\"/>',\n  list: '<path d=\"M9 6h11M9 12h11M9 18h11M4 6h.01M4 12h.01M4 18h.01\"/>',\n  grid: '<rect x=\"4\" y=\"4\" width=\"7\" height=\"7\" rx=\"1.5\"/><rect x=\"13\" y=\"4\" width=\"7\" height=\"7\" rx=\"1.5\"/><rect x=\"4\" y=\"13\" width=\"7\" height=\"7\" rx=\"1.5\"/><rect x=\"13\" y=\"13\" width=\"7\" height=\"7\" rx=\"1.5\"/>',\n};\nconst ico = (n) => `<svg class=\"i\" viewBox=\"0 0 24 24\" aria-hidden=\"true\">${ICONS[n] || ''}</svg>`;\n\nfunction hpState() {\n  const s = state;\n  if (s.defrost) return { key: 'defrost', label: 'Ontdooien' };\n  if (s.compressor) return { key: 'heat', label: 'Verwarmt vat' };\n  return { key: 'standby', label: 'Rust' };\n}\n// De kleppen van de vloerverwarming zitten niet in HA. Daarom meten we het via het afkoelen van het vat:\n// staat de warmtepomp stil en koelt het vat sneller af dan het normale verval (1,5 °C/u aan, onder 1,0 °C/u uit),\n// dan neemt de vloer warmte af. Eerst de virtuele binary_sensor uit HA, anders berekend uit cool_rate.\nlet floorMem = false;\nfunction floorDemand() {\n  const s = state;\n  if (typeof s.floor_demand === 'boolean' && ENTITIES.floor_demand) return s.floor_demand;\n  if (s.compressor || s.circ_pump) return floorMem;\n  if (s.cool_rate >= 1.5) floorMem = true; else if (s.cool_rate <= 1.0) floorMem = false;\n  return floorMem;\n}\n// Wat beweegt er? hp: water door de condensor naar het buffervat, floor: water door de vloer,\n// ref: koudemiddel. Staat alles stil (rust), dan is alles 0 en staan alle animaties uit.\nfunction flows() {\n  const s = state;\n  const hp = (s.circ_pump || s.compressor) ? Math.max(s.pump_drive || 0, 35) / 100 : 0;\n  const ref = s.compressor ? clamp(s.comp_hz / 60, .3, 1.4) : 0;\n  return { hp, floor: floorDemand() ? .7 : 0, ref };\n}\n// Kleur van het vat: koud = blauw, op doel = donker rood\nfunction tankColor(t, l = 0) {\n  const sp = state.sp_boiler_reg, hy = state.hyst_reg ?? state.hyst;\n  // koud = blauw, rond de startlijn oranje, op doel donkerrood\n  const st = [[sp - hy - 7, 215], [sp - hy - 4, 160], [sp - hy - 1.5, 60], [sp - hy, 32], [sp, 2]];\n  const tc = clamp(t, st[0][0], sp);\n  let h = 2;\n  for (let i = 1; i < st.length; i++) if (tc <= st[i][0]) { const [t0, h0] = st[i - 1], [t1, h1] = st[i]; h = h0 + (h1 - h0) * (tc - t0) / (t1 - t0); break; }\n  const f = clamp((t - (sp - hy - 7)) / (hy + 7), 0, 1);\n  return `hsl(${h.toFixed(0)} 78% ${(54 - 12 * f + l).toFixed(0)}%)`;\n}\n\n/* ---------------- schema opbouw ---------------- */\nconst pipes = {};\nfunction makePipe(parent, name, d, w = 6) {\n  const g = svgEl('g', {}, parent);\n  svgEl('path', { d, fill: 'none', stroke: '#07090c', 'stroke-width': w + 5, 'stroke-linecap': 'round', 'stroke-linejoin': 'round' }, g);\n  const core = svgEl('path', { d, fill: 'none', stroke: '#888', 'stroke-width': w, 'stroke-linecap': 'round', 'stroke-linejoin': 'round' }, g);\n  svgEl('path', { d, fill: 'none', stroke: '#fff', 'stroke-opacity': .28, 'stroke-width': Math.max(1.4, w * .26), 'stroke-linecap': 'round', 'stroke-linejoin': 'round', transform: `translate(${-w * .14} ${-w * .14})` }, g);\n  const flow = svgEl('path', { d, fill: 'none', stroke: '#fff', 'stroke-width': Math.max(2.4, w * .55), 'stroke-linecap': 'round', 'stroke-dasharray': '0.1 14', opacity: 0 }, g);\n  pipes[name] = { core, flow, offset: 0 };\n}\n// koudemiddel (in de verkleinde unit): compressor → condensor → expansieventiel → verdamper → compressor\nconst REF = $('#refPipes');\nmakePipe(REF, 'discharge', 'M624,432 V330', 7);\nmakePipe(REF, 'liquid', 'M584,300 H500 V366', 7);\nmakePipe(REF, 'expansion', 'M488,380 H324', 7);\nmakePipe(REF, 'suction', 'M324,508 H584', 7);\n// water: unit → pomp → buffervat, en buffervat → vloer → buffervat\nconst WATER = $('#waterPipes');\nmakePipe(WATER, 'hpSup', 'M570,392 H786 M814,392 H862', 8);\nmakePipe(WATER, 'hpRet', 'M862,415 H570', 8);\nconst FLOOR_X = [834, 878, 922, 966, 1010, 1054, 1112];\nconst floorSegs = [];\nconst NOFLOW = { setAttribute() {}, style: {} };\n(function buildFloor() {\n  // één doorlopende leiding: vat → vloer → vat, met één donkere rand eronder zodat er geen naden zijn\n  const g = svgEl('g', {}, $('#floorPipes'));\n  const sup = 'M862,510 H834 Q826,510 826,518 V573 Q826,581 834,581';\n  const ret = 'M1112,581 Q1120,581 1120,573 V478 Q1120,470 1112,470 H958';\n  const all = 'M862,510 H834 Q826,510 826,518 V573 Q826,581 834,581 H1112 Q1120,581 1120,573 V478 Q1120,470 1112,470 H958';\n  const st = { fill: 'none', 'stroke-linecap': 'round', 'stroke-linejoin': 'round' };\n  svgEl('path', { d: all, ...st, stroke: '#07090c', 'stroke-width': 12 }, g);\n  const flSup = svgEl('path', { d: sup, ...st, stroke: '#888', 'stroke-width': 7 }, g);\n  for (let i = 0; i < FLOOR_X.length - 1; i++) floorSegs.push(svgEl('path', { d: `M${FLOOR_X[i]},581 H${FLOOR_X[i + 1]}`, ...st, stroke: '#888', 'stroke-width': 7 }, g));\n  const flRet = svgEl('path', { d: ret, ...st, stroke: '#888', 'stroke-width': 7 }, g);\n  svgEl('path', { d: all, ...st, stroke: '#fff', 'stroke-opacity': .25, 'stroke-width': 1.8, transform: 'translate(-1 -1.4)' }, g);\n  FLOOR_X.slice(1, -1).forEach(x => svgEl('rect', { x: x - 4, y: 573, width: 8, height: 16, rx: 3, fill: '#3a404c', stroke: '#6b7485' }, g));\n  const flow = svgEl('path', { d: all, ...st, stroke: '#fff', 'stroke-width': 3.6, 'stroke-dasharray': '0.1 14', opacity: 0 }, g);\n  pipes.flSup = { core: flSup, flow: NOFLOW, offset: 0 };\n  pipes.flRet = { core: flRet, flow: NOFLOW, offset: 0 };\n  pipes.floor = { core: null, flow, offset: 0 };\n})();\n\n// waardelabels bij de leidingen en de vloer\nconst tags = {};\nfunction makeTag(parent, name, x, y, w, label, tab) {\n  const g = svgEl('g', { class: 'hit', 'data-tab': tab }, parent);\n  g.setAttribute('transform', `translate(${x} ${y})`);\n  svgEl('rect', { width: w, height: 52, rx: 16, fill: 'rgba(22,28,41,.95)', stroke: '#3a4458', 'stroke-width': 1.5 }, g);\n  const ring = svgEl('circle', { cx: 16, cy: 19, r: 8, fill: '#5d6575', opacity: .22 }, g);\n  const dot = svgEl('circle', { cx: 16, cy: 19, r: 4.5, fill: '#5d6575' }, g);\n  const lab = svgEl('text', { x: 30, y: 23, class: 'tag-l' }, g); lab.textContent = label;\n  const v = svgEl('text', { x: 13, y: 42, class: 'tag-v' }, g);\n  tags[name] = { v, dot, ring, lab };\n}\nconst WT = $('#waterTags');\nmakeTag(WT, 'sup', 592, 322, 140, 'Aanvoer', 'overzicht');\nmakeTag(WT, 'ret', 592, 433, 140, 'Retour', 'overzicht');\nmakeTag(WT, 'floor', 1012, 400, 140, 'Vloerverwarming', 'overzicht');\n\n// meetpunten van de unit: één overzicht boven de unit en genummerde speldjes op de onderdelen\nconst UX = (x) => 185 + .55 * x, UY = (y) => 247 + .55 * y;\nconst CELLS = [\n  ['fan', 'Ventilator', '#a9cce6', 174, 380],\n  ['suction', 'Zuiggas · lagedruk', '#60a5fa', 450, 508],\n  ['eev', 'EEV · oververhitting', '#a78bfa', 500, 380],\n  ['cond', 'Condensor spoel', '#f59e0b', 624, 285],\n  ['discharge', 'Persgas · hogedruk', '#ef4444', 624, 381],\n  ['comp', 'Compressor', '#4ade80', 624, 472],\n];\n(function buildPanelCells() {\n  const P = $('#refPanel'), PIN = $('#pins');\n  svgEl('rect', { width: 520, height: 112, rx: 20, fill: 'rgba(22,28,41,.95)', stroke: '#3a4458', 'stroke-width': 1.5 }, P);\n  CELLS.forEach(([name, label, color, px, py], i) => {\n    const g = svgEl('g', { transform: `translate(${10 + (i % 3) * 170} ${10 + Math.floor(i / 3) * 50})` }, P);\n    const dot = svgEl('circle', { cx: 15, cy: 20, r: 11, fill: color }, g);\n    const n = svgEl('text', { x: 15, y: 24.5, 'text-anchor': 'middle', style: 'font:700 12px var(--f-ui);fill:#0c0f15' }, g); n.textContent = i + 1;\n    const lab = svgEl('text', { x: 36, y: 17, class: 'tag-l' }, g); lab.textContent = label;\n    const v = svgEl('text', { x: 36, y: 37, class: 'tag-v' }, g);\n    tags[name] = { v, dot, ring: null, lab };\n    const pg = svgEl('g', { transform: `translate(${UX(px)} ${UY(py)})` }, PIN);\n    svgEl('circle', { r: 10, fill: color, stroke: '#0c0f15', 'stroke-width': 2 }, pg);\n    const pn = svgEl('text', { y: 4, 'text-anchor': 'middle', style: 'font:700 11px var(--f-ui);fill:#0c0f15' }, pg); pn.textContent = i + 1;\n  });\n})();\n\n/* ---------------- render ---------------- */\nfunction setPipe(name, color, active) {\n  const p = pipes[name];\n  if (p.core) { p.core.setAttribute('stroke', color); p.core.setAttribute('opacity', active ? 1 : .5); }\n  p.flow.setAttribute('opacity', active ? .75 : 0);\n}\nfunction setTag(name, value, color, label) {\n  const t = tags[name];\n  t.v.textContent = value; t.dot.setAttribute('fill', color || '#5d6575');\n  if (t.ring) t.ring.setAttribute('fill', color || '#5d6575');\n  if (label !== undefined) t.lab.textContent = label;\n}\n\nlet lampCache = '';\nconst f0 = (v) => fmt(v, v % 1 ? 1 : 0);\nfunction renderSchema() {\n  const s = state, f = flows();\n  const sup = s.t_supply, ret = s.t_return, supC = tankColor(sup), retC = tankColor(ret);\n  const on = f.ref > 0, flowing = f.hp > 0;\n  setPipe('discharge', s.defrost ? '#fca5a5' : '#ef4444', on);\n  setPipe('liquid', '#f59e0b', on);\n  setPipe('expansion', '#38bdf8', on);\n  setPipe('suction', '#60a5fa', on);\n  setPipe('hpSup', supC, flowing);\n  setPipe('hpRet', retC, flowing);\n  // vloerwater komt uit het vat en komt zo'n 5 °C koeler terug\n  const fSup = s.t_boiler, fRet = s.t_boiler - 5, fSupC = tankColor(fSup), fRetC = tankColor(fRet);\n  setPipe('flSup', f.floor ? fSupC : '#3b6b82', f.floor > 0);\n  setPipe('flRet', f.floor ? fRetC : '#3b6b82', f.floor > 0);\n  floorSegs.forEach((p, i) => {\n    p.setAttribute('stroke', f.floor ? tankColor(fSup + (fRet - fSup) * i / (floorSegs.length - 1)) : '#3b6b82');\n    p.setAttribute('opacity', f.floor ? 1 : .5);\n  });\n  pipes.floor.flow.setAttribute('opacity', f.floor ? .55 : 0);\n  $('#floorGlowStop').setAttribute('stop-color', fSupC);\n  $('#floorGlow').setAttribute('opacity', f.floor ? 1 : 0);\n  // buffervat: altijd vol; het warme niveau stijgt naar het doel, een tweede lijn toont wanneer hij weer bijverwarmt\n  const sp = s.sp_boiler_reg, hy = s.hyst_reg ?? s.hyst, lo = sp - hy - 12, hi = sp + 4;\n  const Y = (t) => 540 - clamp((t - lo) / (hi - lo), 0, 1) * 258;\n  const yT = Y(sp), yS = Y(sp - hy);\n  $('#warmG').style.transform = `translateY(${Y(s.t_boiler).toFixed(1)}px)`;\n  $('#waveG').style.animationPlayState = flowing ? 'running' : 'paused';\n  $('#tankTop').setAttribute('stop-color', tankColor(s.t_boiler));\n  $('#tankBot').setAttribute('stop-color', tankColor(s.t_boiler - 3, -6));\n  $('#tankTemp').textContent = fmt(s.t_boiler) + '°';\n  $('#spMark').setAttribute('y1', yT); $('#spMark').setAttribute('y2', yT);\n  $('#spMarkT').setAttribute('y', yT + 4); $('#spMarkT').textContent = `doel ${f0(sp)}°`;\n  $('#stMark').setAttribute('y1', yS); $('#stMark').setAttribute('y2', yS);\n  $('#stMarkT').setAttribute('y', yS + 4); $('#stMarkT').textContent = `start ${f0(sp - hy)}°`;\n  $('#band').setAttribute('y', yT); $('#band').setAttribute('height', Math.max(0, yS - yT));\n  $('#bubbles').setAttribute('display', flowing && !RM ? 'inline' : 'none');\n  $('#waves').setAttribute('display', f.floor && !RM ? 'inline' : 'none'); $('#waves').setAttribute('stroke', fSupC);\n  $('#tankCoil').setAttribute('stroke', supC); $('#tankCoil').setAttribute('opacity', flowing ? .75 : .3);\n  // unit\n  $('#compLed').setAttribute('fill', s.compressor ? '#4ade80' : '#5d6575');\n  $('#frostFins').setAttribute('opacity', s.defrost ? .3 : 0);\n  $('#frostFan').setAttribute('opacity', s.defrost ? .2 : 0);\n  setTag('fan', `${s.fan1_rpm} RPM`, '#a9cce6');\n  setTag('suction', `${fmt(s.t_suction)}° · ${fmt(s.p_low)} bar`, '#60a5fa');\n  setTag('eev', `${s.eev} st · ${fmt(s.superheat)} K`, '#a78bfa');\n  setTag('cond', `${fmt(s.t_condenser)} °C`, '#f59e0b');\n  setTag('discharge', `${fmt(s.t_discharge)}° · ${fmt(s.p_high)} bar`, '#ef4444');\n  setTag('comp', `${fmt(s.comp_hz, 0)} Hz · ${fmt(s.comp_current)} A`, '#4ade80');\n  // water: staat het water stil, dan is dat een sensorwaarde die terugzakt, geen terugstroming\n  const dT = sup - ret;\n  setTag('sup', `${fmt(sup)} °C`, flowing ? supC : '#5d6575', flowing ? 'Aanvoer · 189' : 'Aanvoer · stil');\n  setTag('ret', `${fmt(ret)} °C`, flowing ? retC : '#5d6575', flowing ? 'Retour · 188' : 'Retour · stil');\n  setTag('floor', f.floor ? 'vraagt warmte' : 'In rust', f.floor ? fSupC : '#5d6575', f.floor ? `Vloer · ${fmt(s.cool_rate)} °/u` : 'Vloerverwarming');\n  $('#pwVal').textContent = `${Math.round(s.power_w)} W`;\n  $('#pwBar').setAttribute('width', 123 * clamp(s.power_w / 5000, 0, 1));\n  $('#outVal').textContent = `${fmt(s.t_outdoor)} °C`;\n  const L = [['floor_on', 'Vloer vraagt warmte'], ['compressor', 'Compressor'], ['circ_pump', 'Circulatiepomp' + (s.circ_pump ? ` · ${fmt(s.pump_drive, 0)}%` : '')], ['defrost', 'Ontdooien']];\n  s.floor_on = floorDemand();\n  const lampHTML = L.map(([k, l]) => `<span class=\"lamp ${s[k] ? 'on' : ''} ${k === 'defrost' ? 'ice' : ''}\"><i></i>${l}</span>`).join('')\n    + `<span class=\"lamp status\">${s.status}</span>`;\n  if (lampHTML !== lampCache) { lampCache = lampHTML; $('#lampRow').innerHTML = lampHTML; }\n}\n\nfunction renderHead() {\n  const s = state, hs = hpState();\n  $('#mBadge').textContent = hs.label; $('#mBadge').className = 'badge ' + hs.key;\n  $('#mSub').textContent = `SPRSUN · Carel · ${s.smart_active ? 'slimme regeling aan' : 'handmatig doel'}`;\n}\n\n/* ---------------- tabbladen ---------------- */\nconst TABS = [\n  { id: 'overzicht', label: 'Overzicht', icon: 'grid' },\n  { id: 'energie', label: 'Energie', icon: 'bolt' },\n  { id: 'instellingen', label: 'Instellingen', icon: 'sliders' },\n  { id: 'waarden', label: 'Waarden', icon: 'list' },\n];\nlet currentTab = 'overzicht', thOpen = false;\nconst STEP = {\n  comfort: { label: 'Comfort-verschuiving', sub: 'Te koud of te warm? Eén knop: stooklijn, boosts en verlagingen schuiven mee', icon: 'thermo', min: -5, max: 5, step: .5, signed: true },\n  sp_boiler: { label: 'Doel buffervat (handmatig)', sub: 'Alleen te kiezen als de slimme regeling uit staat', icon: 'tank', min: 25, max: 55, step: .5 },\n  hyst: { label: 'Inschakelverschil (Delta T)', sub: 'Zakt het vat zoveel onder het doel, dan gaat de warmtepomp weer bijverwarmen', icon: 'delta', min: 1, max: 10, step: .5 },\n  curve_15: { label: 'Stooklijn bij 15 °C buiten', sub: 'Basis-doel bij zacht weer', icon: 'thermo', min: 28, max: 46, step: .5 },\n  curve_0: { label: 'Stooklijn bij 0 °C buiten', sub: 'Basis-doel bij vorst', icon: 'snow', min: 34, max: 55, step: .5 },\n  boost_cheap: { label: 'Boost goedkope uren', sub: 'Extra doel in de goedkoopste uren', icon: 'bolt', min: 0, max: 6, step: .5, signed: true },\n  reduce_peak: { label: 'Verlaging dure avondpiek', sub: 'Lager doel, zodat de batterij de piek overneemt', icon: 'battery', min: -6, max: 0, step: .5, signed: true },\n  slot_start: { label: 'Startuur', sub: 'Vast tijdvak', icon: 'clock', min: 0, max: 23, step: 1, unit: 'u', d: 0 },\n  slot_end: { label: 'Einduur', sub: 'Vast tijdvak', icon: 'clock', min: 0, max: 23, step: 1, unit: 'u', d: 0 },\n  slot_boost: { label: 'Extra verhoging in het tijdvak', sub: 'Komt bovenop het doel', icon: 'bolt', min: 0, max: 6, step: .5, signed: true },\n};\nObject.entries(STEP).forEach(([k, c]) => { c.key = k; c.unit = c.unit || '°C'; });\nconst ALL_STEPPERS = Object.values(STEP);\nconst stepperHTML = (c) => `<div class=\"row\" data-stepper=\"${c.key}\">\n    <div class=\"row-line\"><span class=\"ico\">${ico(c.icon)}</span>\n      <div class=\"row-text\"><div class=\"row-title\">${c.label}</div><div class=\"row-sub\">${c.sub}</div></div>\n      <div class=\"step-ctrl\"><button class=\"step\" data-step=\"-1\" aria-label=\"${c.label} lager\">−</button><div class=\"step-val num\"><span data-val></span><small>${c.unit}</small></div><button class=\"step\" data-step=\"1\" aria-label=\"${c.label} hoger\">+</button></div>\n    </div>\n    <input type=\"range\" id=\"rng-${c.key}\" min=\"${c.min}\" max=\"${c.max}\" step=\"${c.step}\" aria-label=\"${c.label}\">\n    <div class=\"range-ends num\"><span>${c.min}</span><span>${c.max}</span></div></div>`;\nconst segHTML = (key, opts, compact) => `<div class=\"seg ${compact ? 'compact' : ''}\" data-seg=\"${key}\">${opts.map(o => { const v = typeof o === 'string' ? o : o.v; return `<button data-val=\"${v}\" aria-pressed=\"false\">${o.icon ? ico(o.icon) : ''}<span>${v}</span></button>`; }).join('')}</div>`;\nconst switchRow = (key, title, sub, icon) => `<div class=\"row\"><div class=\"row-line\"><span class=\"ico\">${ico(icon)}</span><div class=\"row-text\"><div class=\"row-title\">${title}</div><div class=\"row-sub\">${sub}</div></div><button class=\"switch\" role=\"switch\" data-switch=\"${key}\" aria-checked=\"false\" aria-label=\"${title}\"></button></div></div>`;\n\nconst ALL_VALUES = [\n  { title: 'Slimme regeling', items: [\n    ['smart_target', 'Berekende doeltemperatuur', 'nu', '°C', 1, true], ['sp_boiler_reg', 'Doel in de warmtepomp', 'Reg 3', '°C', 1, true],\n    ['hyst_reg', 'Inschakelverschil (Delta T)', 'start onder doel', '°C', 1], ['comfort', 'Comfort-verschuiving', '', '°C', 1],\n    ['cool_rate', 'Afkoelsnelheid buffervat', 'meet de vloer-flow', '°C/u', 1]] },\n  { title: 'Temperaturen', items: [\n    ['t_boiler', 'Buffervat vloerverwarming', 'Reg 195', '°C', 1, true],\n    ['t_supply', 'Aanvoer vanuit warmtepomp', 'Reg 189', '°C', 1, true], ['t_return', 'Retour naar warmtepomp', 'Reg 188', '°C', 1, true],\n    ['delta', 'Delta T water (aanvoer − retour)', 'berekend', '°C', 1], ['t_outdoor', 'Buitentemperatuur', 'Reg 190', '°C', 1, true]] },\n  { title: 'Compressor, ventilatoren & pomp', items: [\n    ['comp_hz', 'Compressor frequentie', '', 'Hz', 1], ['comp_current', 'Compressor stroom', '', 'A', 1],\n    ['fan1_rpm', 'Ventilator 1 toerental', '', 'RPM', 0], ['fan2_rpm', 'Ventilator 2 toerental', '', 'RPM', 0], ['pump_drive', 'Circulatiepomp aansturing', '', '%', 1]] },\n  { title: 'Koelkreis', items: [\n    ['t_discharge', 'Persgastemperatuur', 'heetgas', '°C', 1], ['t_suction', 'Zuiggastemperatuur', '', '°C', 1], ['t_condenser', 'Condensor spoeltemperatuur', '', '°C', 1],\n    ['p_high', 'Persdruk / hogedruk', '', 'bar', 1], ['p_low', 'Zuigdruk / lagedruk', '', 'bar', 1], ['eev', 'Expansieventiel (EEV) opening', '', 'stappen', 0], ['superheat', 'Oververhitting', 'superheat', 'K', 1]] },\n  { title: 'Energie & thuisbatterij', items: [\n    ['power_w', 'Warmtepomp actueel vermogen', '3-fase', 'W', 0], ['boiler_w', 'Tapwaterboiler actueel vermogen', '', 'W', 0],\n    ['price', 'Zonneplan stroomprijs', '', '€/kWh', 3], ['batt_pct', 'Thuisbatterij', '35 kWh', '%', 0], ['batt_w', 'Thuisbatterij vermogen', '', 'W', 0]] },\n];\n\nconst PANELS = {\n  overzicht: () => `<div class=\"panel\">\n    <div class=\"box think\" id=\"think\">\n      <div class=\"th-top\"><span class=\"chip-s\" id=\"thChip\"></span><button class=\"th-more\" id=\"thMore\" hidden>Waarom?</button></div>\n      <div class=\"th-sum\" id=\"thSum\"></div>\n      <div class=\"th-sub\" id=\"thSub\"></div>\n      <div class=\"th-steps\" id=\"thSteps\" hidden></div>\n    </div>\n    <div class=\"tiles\" id=\"ovTiles\"></div>\n    <div class=\"sec\"><div class=\"sec-h\">Temperatuurverloop <em>24 uur</em></div><div class=\"box chart-wrap\"><div id=\"chart\"></div><div class=\"legend\" id=\"legend\"></div></div></div>\n  </div>`,\n  energie: () => `<div class=\"panel\">\n    <div class=\"box statusbox\"><span>Stroomprijs nu (Zonneplan)</span><b id=\"enPrice\"></b><span id=\"enTip\"></span></div>\n    <div class=\"sec\"><div class=\"sec-h\">Prijs per uur <em>groen goedkoop · rood duur</em></div><div class=\"box chart-wrap\"><div id=\"fc\"></div></div></div>\n    <div class=\"sec\"><div class=\"sec-h\">Thuisbatterij <em>35 kWh</em></div><div class=\"box batt\" id=\"batt\"></div></div>\n  </div>`,\n  instellingen: () => `<div class=\"panel\">\n    <div class=\"sec\"><div class=\"sec-h\">Hoofdregeling</div><div class=\"box\">${stepperHTML(STEP.comfort)}${switchRow('smart_active', 'Slimme regeling', 'Het doel volgt stooklijn, stroomprijs en batterij', 'bolt')}</div></div>\n    <div class=\"sec\"><div class=\"sec-h\">Doel buffervat</div><div class=\"box\">${stepperHTML(STEP.sp_boiler)}${stepperHTML(STEP.hyst)}</div></div>\n    <div class=\"sec\"><div class=\"sec-h\">Weersafhankelijke stooklijn</div><div class=\"box\">${switchRow('curve_on', 'Stooklijn gebruiken', 'Het doel schuift mee met de buitentemperatuur', 'thermo')}${stepperHTML(STEP.curve_15)}${stepperHTML(STEP.curve_0)}</div></div>\n    <div class=\"sec\"><div class=\"sec-h\">Zonneplan &amp; batterij</div><div class=\"box\">${switchRow('zp_on', 'Prijs- en batterij-optimalisatie', 'Goedkope uren bufferen, dure avondpiek overslaan', 'bolt')}${stepperHTML(STEP.boost_cheap)}${stepperHTML(STEP.reduce_peak)}</div></div>\n    <div class=\"sec\"><div class=\"sec-h\">Vast tijdvak</div><div class=\"box\">${switchRow('slot_on', 'Extra tijdvak-boost', 'Vast schema bovenop de slimme regeling', 'clock')}${stepperHTML(STEP.slot_start)}${stepperHTML(STEP.slot_end)}${stepperHTML(STEP.slot_boost)}</div></div>\n    <div class=\"sec\"><div class=\"sec-h\">Werkmodus</div>${segHTML('mode', OPTIONS.mode)}</div>\n    <div class=\"sec\"><div class=\"sec-h\">Geluidsmodus buitenunit</div>${segHTML('fan_mode', OPTIONS.fan_mode, true)}</div>\n    <div class=\"sec\"><div class=\"sec-h\">Circulatiepomp modus</div>${segHTML('pump_mode', OPTIONS.pump_mode, true)}</div>\n  </div>`,\n  waarden: () => `<div class=\"panel\">${ALL_VALUES.map(g => `<div class=\"sec\"><div class=\"sec-h\">${g.title}</div><div class=\"box list\" data-group=\"${g.title}\"></div></div>`).join('')}</div>`,\n};\n\nfunction buildPanel() {\n  $('#tabs').innerHTML = TABS.map(t => `<button class=\"tab\" role=\"tab\" data-tab=\"${t.id}\" aria-selected=\"${t.id === currentTab}\">${ico(t.icon)}${t.label}</button>`).join('');\n  $('#mPanel').innerHTML = PANELS[currentTab]();\n  $('#mPanel').scrollTop = 0;\n  if (currentTab === 'overzicht') buildChart();\n  renderPanel();\n}\nfunction buildForecast() {\n  const fc = state.forecast || [], W = 520, H = 150, L = 8, B = 22, n = fc.length || 1, bw = (W - L * 2) / n;\n  const max = Math.max(...fc.map(x => x.p), .01), byP = [...fc].sort((a, b) => a.p - b.p);\n  const cheap = new Set(byP.slice(0, 3).map(x => x.h)), dear = new Set(byP.slice(-4).map(x => x.h)), nowH = new Date().getHours();\n  let g = '';\n  fc.forEach((x, i) => {\n    const h = (H - B - 14) * x.p / max, c = cheap.has(x.h) ? '#4ade80' : dear.has(x.h) ? '#f87171' : '#475569';\n    g += `<rect x=\"${L + i * bw + 2}\" y=\"${H - B - h}\" width=\"${bw - 4}\" height=\"${h}\" rx=\"3\" fill=\"${c}\" ${x.h === nowH ? 'stroke=\"#fff\" stroke-width=\"2\"' : ''}/>`;\n    if (x.h % 6 === 0) g += `<text x=\"${L + i * bw + bw / 2}\" y=\"${H - 6}\" text-anchor=\"middle\">${String(x.h).padStart(2, '0')}u</text>`;\n  });\n  $('#fc').innerHTML = `<svg viewBox=\"0 0 ${W} ${H}\" role=\"img\" aria-label=\"Stroomprijs per uur\">${g}</svg>`;\n}\nfunction renderPanel() {\n  const s = state, body = $('#mPanel'), flowing = flows().hp > 0;\n  $$('[data-stepper]', body).forEach(row => {\n    const key = row.dataset.stepper, c = STEP[key];\n    row.querySelector('[data-val]').textContent = (c.signed && s[key] > 0 ? '+' : '') + fmt(s[key], c.d ?? 1);\n    const r = row.querySelector('input');\n    if (document.activeElement !== r) r.value = s[key];\n    r.style.setProperty('--p', ((s[key] - c.min) / (c.max - c.min) * 100) + '%');\n    if (key === 'sp_boiler') r.style.setProperty('--trk', tempColor(s[key]));\n    if (key === 'comfort') r.style.setProperty('--trk', s[key] < 0 ? '#60a5fa' : '#fb923c');\n    if (key === 'sp_boiler') row.classList.toggle('dim', !!s.smart_active);\n  });\n  $$('[data-seg]', body).forEach(seg => $$('button', seg).forEach(b => b.setAttribute('aria-pressed', String(b.dataset.val === s[seg.dataset.seg]))));\n  $$('[data-switch]', body).forEach(b => b.setAttribute('aria-checked', String(!!s[b.dataset.switch])));\n  if ($('#think')) {\n    const hy = s.hyst_reg ?? s.hyst, on = !!s.smart_active;\n    $('#thChip').textContent = on ? 'Slimme regeling aan' : 'Slimme regeling uit'; $('#thChip').classList.toggle('on', on);\n    $('#thSum').textContent = on ? s.thought : 'Handmatig doel';\n    $('#thSub').textContent = `Doel ${fmt(s.sp_boiler_reg)} °C · bijverwarmen onder ${fmt(s.sp_boiler_reg - hy)} °C · comfort ${s.comfort > 0 ? '+' : ''}${fmt(s.comfort)} °C`;\n    $('#thMore').hidden = !on;\n    $('#thSteps').hidden = !on || !thOpen;\n    $('#thMore').textContent = thOpen ? 'Sluiten' : 'Waarom?';\n    $('#thSteps').innerHTML = [['1', 'Stooklijn', s.thought1], ['2', 'Zonneplan & batterij', s.thought2], ['3', 'Tijdvak', s.thought3]].map(([n, t, x]) => `<div class=\"th-step\"><i>${n}</i><div><b>${t}</b><span>${x}</span></div></div>`).join('');\n  }\n  if ($('#ovTiles')) {\n    const hy = s.hyst_reg ?? s.hyst;\n    const t = [\n      ['Buffervat', s.t_boiler, '°C', `start ${f0(s.sp_boiler_reg - hy)}° · doel ${f0(s.sp_boiler_reg)}°`, 'instellingen', tankColor(s.t_boiler)],\n      ['Aanvoer', s.t_supply, '°C', flowing ? 'Reg 189' : 'water staat stil', '', flowing ? tankColor(s.t_supply) : '#5d6575'],\n      ['Retour', s.t_return, '°C', flowing ? 'Reg 188' : 'water staat stil', '', flowing ? tankColor(s.t_return) : '#5d6575'],\n      ['Vermogen', s.power_w, 'W', `tapwaterboiler ${fmt(s.boiler_w, 0)} W`, 'energie', '#fbbf24', 0],\n      ['Stroomprijs', s.price, '€/kWh', 'Zonneplan', 'energie', '#4ade80', 3],\n      ['Thuisbatterij', s.batt_pct, '%', s.batt_status, 'energie', '#60a5fa', 0],\n    ];\n    $('#ovTiles').innerHTML = t.map(([l, v, u, sub, tab, c, d]) => `<button class=\"tile\" ${tab ? `data-tab=\"${tab}\"` : 'tabindex=\"-1\"'}><span><i class=\"sw\" style=\"background:${c}\"></i>${l}</span><b class=\"num\">${fmt(v, d ?? 1)}<small>${u}</small></b><em>${sub}</em></button>`).join('');\n  }\n  if ($('#enPrice')) {\n    $('#enPrice').textContent = `€ ${fmt(s.price, 3)} per kWh`; $('#enTip').textContent = s.zp_tip;\n    buildForecast();\n    const w = s.batt_w, wtxt = w > 0 ? `laden · ${w.toLocaleString('nl-NL')} W` : w < 0 ? `ontladen · ${Math.abs(w).toLocaleString('nl-NL')} W` : 'geen vermogen';\n    $('#batt').innerHTML = `<div class=\"batt-top\"><b class=\"num\">${fmt(s.batt_pct, 0)}<small>%</small></b></div>\n      <div class=\"batt-bar\"><i style=\"width:${clamp(s.batt_pct, 0, 100)}%\"></i></div><div class=\"batt-sub\"><span>${s.batt_status}</span><span>${wtxt}</span></div>`;\n  }\n  $$('[data-group]', body).forEach(box => {\n    const g = ALL_VALUES.find(x => x.title === box.dataset.group);\n    box.innerHTML = g.items.map(([k, label, sub, unit, d, isTemp]) => {\n      let v = k === 'delta' ? s.t_supply - s.t_return : s[k], txt = `${fmt(v, d)} ${unit}`, sw = isTemp ? (k === 'sp_boiler_reg' || k === 'smart_target' || k === 't_outdoor' ? tempColor(v) : tankColor(v)) : '';\n      if (!flowing && (k === 't_supply' || k === 't_return' || k === 'delta')) { sub = (k === 'delta' ? '' : sub + ' · ') + 'water staat stil'; sw = '#5d6575'; if (k === 'delta') txt = '–'; }\n      return `<div class=\"li\"><span class=\"sw\" style=\"${sw ? `background:${sw}` : ''}\"></span><div class=\"lt\">${label}${sub ? `<small>${sub}</small>` : ''}</div><b class=\"num\">${txt}</b></div>`;\n    }).join('');\n  });\n}\n\n/* 24-uurs grafiek (mock-historie; in HA te vervangen door de history-API) */\nconst SERIES = [\n  { key: 'boiler', label: 'Boiler', color: '#3b82f6', on: true },\n  { key: 'setpoint', label: 'Setpoint', color: '#fbbf24', on: true },\n  { key: 'aanvoer', label: 'Aanvoer', color: '#f87171', on: true },\n  { key: 'retour', label: 'Retour', color: '#34d399', on: true },\n  { key: 'buiten', label: 'Buiten', color: '#a78bfa', on: true },\n];\nconst HISTORY = (() => {\n  const out = { boiler: [], setpoint: [], aanvoer: [], retour: [], buiten: [] };\n  let b = 38, heating = false, sup = 22, seed = 3;\n  const rnd = () => (seed = (seed * 9301 + 49297) % 233280) / 233280 - .5;\n  for (let i = 0; i < 97; i++) {\n    if (b < 35.5) heating = true;\n    if (b >= 40.5) heating = false;\n    b += heating ? 1.1 : -0.22;\n    sup += ((heating ? 46 : 19) - sup) * 0.45;\n    out.boiler.push(b); out.setpoint.push(40.5);\n    out.aanvoer.push(sup + rnd()); out.retour.push(sup + (heating ? -5 : 3.5) + rnd());\n    out.buiten.push(9.5 + 2.6 * Math.sin((i / 4 - 9) / 24 * Math.PI * 2) + rnd() * .6);\n  }\n  return out;\n})();\nfunction buildChart() {\n  const W = 520, H = 220, L = 30, R = 10, T = 10, B = 26;\n  const x = (i) => L + (W - L - R) * i / 96, y = (v) => T + (H - T - B) * (1 - (v - 5) / 50);\n  const startH = (new Date().getHours() + 1) % 24;\n  let g = '';\n  for (let v = 10; v <= 50; v += 10) g += `<line x1=\"${L}\" x2=\"${W - R}\" y1=\"${y(v)}\" y2=\"${y(v)}\" stroke=\"#232834\"/><text x=\"${L - 6}\" y=\"${y(v) + 4}\" text-anchor=\"end\">${v}</text>`;\n  for (let k = 0; k <= 4; k++) { const i = k * 24; g += `<text x=\"${x(i)}\" y=\"${H - 8}\" text-anchor=\"${k === 0 ? 'start' : k === 4 ? 'end' : 'middle'}\">${k === 4 ? 'nu' : String((startH + k * 6) % 24).padStart(2, '0') + ':00'}</text>`; }\n  SERIES.forEach(s => {\n    if (!s.on) return;\n    const d = HISTORY[s.key].map((v, i) => `${i ? 'L' : 'M'}${x(i).toFixed(1)},${y(v).toFixed(1)}`).join('');\n    g += `<path d=\"${d}\" fill=\"none\" stroke=\"${s.color}\" stroke-width=\"${s.key === 'setpoint' ? 1.5 : 2}\" ${s.key === 'setpoint' ? 'stroke-dasharray=\"5 4\"' : ''} stroke-linejoin=\"round\"/><circle cx=\"${x(96)}\" cy=\"${y(HISTORY[s.key][96])}\" r=\"3.5\" fill=\"${s.color}\" stroke=\"#181c26\" stroke-width=\"2\"/>`;\n  });\n  $('#chart').innerHTML = `<svg viewBox=\"0 0 ${W} ${H}\" role=\"img\" aria-label=\"Temperatuurverloop afgelopen 24 uur\">${g}</svg>`;\n  $('#legend').innerHTML = SERIES.map(s => `<button data-series=\"${s.key}\" aria-pressed=\"${s.on}\"><i style=\"background:${s.color}\"></i>${s.label}</button>`).join('');\n}\n\n/* ---------------- kast: voorkant weg, binnenkant zichtbaar ---------------- */\nlet hpTaps = 0, hpTapT;\nfunction hpSet(open) {\n  $('#schema').classList.toggle('open', open);\n  hpTaps = 0;\n}\nfunction hpTap() {\n  hpTaps++;\n  clearTimeout(hpTapT);\n  hpTapT = setTimeout(() => { hpTaps = 0; }, 1500);\n  if (hpTaps >= 3) hpSet(!$('#schema').classList.contains('open'));\n}\n\n/* ---------------- popup openen / sluiten ---------------- */\nfunction openModal(tab) { if (tab) currentTab = tab; $('#modal').hidden = false; $('#reopen').hidden = true; buildPanel(); hpSet(false); kick(); }\nfunction closeModal() { if (window.parent && window.parent !== window) { window.parent.postMessage({ type: 'close-heatpump-popup' }, '*'); return; } $('#modal').hidden = true; $('#reopen').hidden = false; }\n\n/* ---------------- interactie ---------------- */\nfunction setValue(key, value, send = true) {\n  state[key] = value; userSettings[key] = value;\n  if (key === 'hyst') state.hyst_reg = value;\n  if (key === 'sp_boiler' && !state.smart_active) state.sp_boiler_reg = value;\n  render();\n  if (send) sendToHA(key, value);\n}\nlet toastTimer;\nfunction toast(msg) { $('#toastText').textContent = msg; $('#toast').classList.add('show'); clearTimeout(toastTimer); toastTimer = setTimeout(() => $('#toast').classList.remove('show'), 1800); }\n\ndocument.addEventListener('click', (e) => {\n  const t = e.target;\n  if (t.closest('#reopen')) { openModal(); return; }\n  if (t.closest('#hpFront') || t.closest('#fanGroup')) { hpTap(); return; }\n  if (t.closest('#mClose')) { closeModal(); return; }\n  const tab = t.closest('[data-tab]');\n  if (tab && tab.dataset.tab) {\n    currentTab = tab.dataset.tab; buildPanel();\n    const focus = tab.getAttribute('data-focus');\n    if (focus) { const r = $(`[data-stepper=\"${focus}\"]`); if (r) r.scrollIntoView({ block: 'center' }); }\n    return;\n  }\n  if (t.closest('#thMore')) { thOpen = !thOpen; renderPanel(); return; }\n  const segb = t.closest('[data-seg] button');\n  if (segb) { const key = segb.closest('[data-seg]').dataset.seg; setValue(key, segb.dataset.val); if (key === 'mode' && SIM.active) setTimeout(() => { state.mode_confirmed = state.mode; render(); }, 900); toast(`${segb.dataset.val} ingesteld`); return; }\n  const sw = t.closest('[data-switch]');\n  if (sw) { const k = sw.dataset.switch; setValue(k, !state[k]); toast(`${sw.getAttribute('aria-label')} ${state[k] ? 'aan' : 'uit'}`); return; }\n  const ser = t.closest('[data-series]');\n  if (ser) { const s = SERIES.find(x => x.key === ser.dataset.series); s.on = !s.on; buildChart(); return; }\n});\ndocument.addEventListener('keydown', (e) => { if (e.key === 'Escape') closeModal(); });\n\n// stepper met vasthouden-om-te-herhalen\nlet holdT, holdI, pendingKey = null;\nfunction stepOnce(btn) {\n  const key = btn.closest('[data-stepper]').dataset.stepper, c = STEP[key];\n  setValue(key, clamp(Math.round((state[key] + c.step * +btn.dataset.step) / c.step) * c.step, c.min, c.max), false);\n  return key;\n}\ndocument.addEventListener('pointerdown', (e) => {\n  const btn = e.target.closest('.step'); if (!btn) return;\n  e.preventDefault();\n  pendingKey = stepOnce(btn);\n  holdT = setTimeout(() => { holdI = setInterval(() => stepOnce(btn), 110); }, 420);\n});\nfunction endHold() {\n  clearTimeout(holdT); clearInterval(holdI);\n  if (pendingKey) { const c = STEP[pendingKey]; sendToHA(pendingKey, state[pendingKey]); toast(`${c.label}: ${fmt(state[pendingKey], c.d ?? 1)} ${c.unit}`); pendingKey = null; }\n}\n['pointerup', 'pointercancel'].forEach(ev => document.addEventListener(ev, endHold));\ndocument.addEventListener('input', (e) => { const r = e.target.closest('[data-stepper] input'); if (r) setValue(r.closest('[data-stepper]').dataset.stepper, +r.value, false); });\ndocument.addEventListener('change', (e) => {\n  const r = e.target.closest('[data-stepper] input');\n  if (r) { const key = r.closest('[data-stepper]').dataset.stepper, c = STEP[key]; sendToHA(key, state[key]); toast(`${c.label}: ${fmt(state[key], c.d ?? 1)} ${c.unit}`); }\n});\n\n/* ---------------- animatie ----------------\n   Zuinig voor een wandtablet: maximaal 20 beelden per seconde, de lus stopt volledig zodra er niets\n   beweegt (stand-by) en ook als de popup dicht is of het scherm verborgen is. */\nlet fanA = 0, pumpA = 0, last = performance.now(), lastDraw = 0, rafId = 0;\nconst FRAME_MS = 1000 / 20;\nfunction animating() {\n  if (RM || document.hidden || $('#modal').hidden) return false;\n  const f = flows();\n  return f.ref > 0 || f.hp > 0 || f.floor > 0 || (state.power && !state.defrost && state.fan1_rpm > 0);\n}\nfunction kick() { if (!rafId && animating()) { last = performance.now(); rafId = requestAnimationFrame(frame); } }\nfunction frame(now) {\n  rafId = 0;\n  if (!animating()) return;\n  if (now - lastDraw >= FRAME_MS) {\n    const dt = Math.min(.1, (now - last) / 1000); last = now; lastDraw = now;\n    const s = state, f = flows();\n    // De ventilator draait ook achter het rooster van de dichte kast.\n    const spin = s.power && !s.defrost;\n    fanA += (spin ? s.fan1_rpm : 0) / 60 * 360 * dt * .16;\n    $('#fanRot').setAttribute('transform', `rotate(${(fanA % 360).toFixed(1)})`);\n    pumpA += f.hp * 720 * dt;\n    $('#pumpRot').setAttribute('transform', `rotate(${(pumpA % 360).toFixed(1)})`);\n    const move = (keys, speed) => keys.forEach(k => { pipes[k].offset -= speed * dt; pipes[k].flow.style.strokeDashoffset = pipes[k].offset; });\n    move(['discharge', 'liquid', 'expansion', 'suction'], f.ref * 50);\n    move(['hpSup', 'hpRet'], f.hp * 46);\n    move(['flSup', 'floor', 'flRet'], f.floor * 40);\n  }\n  rafId = requestAnimationFrame(frame);\n}\ndocument.addEventListener('visibilitychange', kick);\n\n/* ---------------- simulatie-ruis, wake lock ---------------- */\nsetInterval(() => {\n  if (document.hidden || $('#modal').hidden || !SIM.active || !state.compressor || !state.power) return;\n  const j = (v, a) => +(v + (Math.random() - .5) * a).toFixed(1);\n  state.comp_hz = j(state.comp_hz, 1.2);\n  state.t_supply = j(state.t_supply, .2);\n  state.t_return = j(state.t_return, .2);\n  state.t_discharge = j(state.t_discharge, .6);\n  state.power_w = Math.round(state.power_w + (Math.random() - .5) * 40);\n  if (SIM.active === 'verwarmen' || SIM.active === 'boost') {\n    // het vat loopt vol naar het doel; is het bereikt, dan gaat de warmtepomp in rust\n    state.t_boiler = +Math.min(state.sp_boiler_reg, state.t_boiler + .5).toFixed(1);\n    if (state.t_boiler >= state.sp_boiler_reg) {\n      const tb = state.t_boiler, sp = state.sp_boiler_reg;\n      Object.assign(state, BASE, SCENARIOS.rest.patch, userSettings, { t_boiler: tb, sp_boiler_reg: sp, smart_target: sp }); SIM.active = 'rest'; render(); return;\n    }\n  }\n  renderHead(); renderSchema();\n  if (currentTab !== 'instellingen') renderPanel();\n}, 2500);\n(async () => { try { if ('wakeLock' in navigator) await navigator.wakeLock.request('screen'); } catch (e) {} })();\n\nfunction render() { renderHead(); renderSchema(); renderPanel(); kick(); }\n\nopenModal('overzicht');\nkick();\n\nwindow.addEventListener('message', (ev) => {\n  if (ev.data && ev.data.type === 'hass-update' && ev.data.hass) {\n    fromHass(ev.data.hass);\n  }\n});\nif (window.parent && window.parent !== window) {\n  window.parent.postMessage({ type: 'heatpump-ready' }, '*');\n}\n\n</script>\n";
/* claude-energy-scene v3 — energie-screensaver en -dashboard voor Home Assistant.
 * Geen dependencies. Minimale config:
 *   type: custom:claude-energy-scene
 *   screensaver: true            # tik op achtergrond -> tap_action / navigatie
 *   battery_invert: true         # negatief batterijvermogen = ontladen
 *   tap_action: { action: navigate, navigation_path: /lovelace/0 }
 *   entities: { load, home_today, solar, solar_today, grid, grid_import_today, grid_export_today,
 *               grid_price, battery_power, battery_soc, battery_charge_today, battery_discharge_today,
 *               weather, sun }
 * Optioneel:
 *   statistics: { grid_import, grid_export, grid_import_cost, grid_export_compensation, solar,
 *                 battery_charge, battery_discharge }   (standaard uit het Energie-dashboard)
 *   powerplay: { today, month, prev_month, year }      (Zonneplan; standaard automatisch gevonden)
 */
const VERSION = '3.0.0';
const FONT_URL = 'https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600&display=swap';

/* ---------- opmaak ---------- */
const NL = 'nl-NL';
const NF = [0, 1, 2, 3].map((d) => new Intl.NumberFormat(NL, { minimumFractionDigits: d, maximumFractionDigits: d }));
const num = (v, d = 1) => NF[d].format(v);
const fmtPower = (w) => {
  const a = Math.abs(w || 0);
  return a < 1000 ? { v: num(a, 0), u: 'W' } : { v: num(a / 1000, a < 10000 ? 2 : 1), u: 'kW' };
};
const fmtKwh = (v, d = 1) => (v == null || !isFinite(v) ? '–' : `${num(v, d)} kWh`);
const fmtEur = (v, d = 2) => (v == null || !isFinite(v) ? '–' : `${v < 0 ? '− ' : ''}€ ${num(Math.abs(v), d)}`);
const fmtEurS = (v) => (v == null || !isFinite(v) ? '–' : `${v < 0 ? '−' : '+'} € ${num(Math.abs(v), 2)}`);
const fmtHM = (t) => new Date(t).toLocaleTimeString(NL, { hour: '2-digit', minute: '2-digit' });
const fmtPct = (v) => (v == null || !isFinite(v) ? '–' : `${num(v, 0)}%`);
const DAYS = ['zondag', 'maandag', 'dinsdag', 'woensdag', 'donderdag', 'vrijdag', 'zaterdag'];
const MONTHS = ['januari', 'februari', 'maart', 'april', 'mei', 'juni', 'juli', 'augustus', 'september', 'oktober', 'november', 'december'];
const cap = (s) => s.charAt(0).toUpperCase() + s.slice(1);
const ymd = (d) => `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`;

const clamp = (v, a, b) => Math.min(b, Math.max(a, v));
const hex = (h) => [1, 3, 5].map((i) => parseInt(h.slice(i, i + 2), 16));
const mixRGB = (a, b, t) => a.map((v, i) => Math.round(v + (b[i] - v) * t));
const rgb = (a) => `rgb(${a[0]},${a[1]},${a[2]})`;
const mix = (h1, h2, t) => rgb(mixRGB(hex(h1), hex(h2), t));
const toMs = (v) => (typeof v === 'number' ? (v < 1e12 ? v * 1000 : v) : new Date(v).getTime());
const sum = (a) => a.reduce((s, v) => s + (v || 0), 0);
let seed = 11;
const rand = () => ((seed = (seed * 16807) % 2147483647) / 2147483647);

/* ---------- kleuren ---------- */
const C = {
  solar: '#F2B33D', import: '#E8705F', export: '#46B98A', battery: '#5B9DF5', batteryOut: '#A889F0',
  home: '#C9CED6', soc: '#E9ECF1', low: '#46B98A', normal: '#8C95A3', high: '#E8705F', idle: '#7C8594',
  ev: '#3CC4D6', socLow: '#E8705F', socMid: '#F2A33D', socHigh: '#46B98A',
};
// laadniveau-kleur: bijna leeg rood, daarna oranje, daarna groen
const socColor = (soc) => (soc == null ? C.idle : soc < 20 ? C.socLow : soc < 50 ? C.socMid : C.socHigh);
const CONDITIONS = ['sunny', 'clear-night', 'partlycloudy', 'cloudy', 'fog', 'windy', 'windy-variant', 'rainy', 'pouring', 'lightning', 'lightning-rainy', 'hail', 'snowy', 'snowy-rainy', 'exceptional'];
// scènekleuren: [nacht, dag]
const PAL = {
  wall: ['#3C2119', '#97452F'], 'wall-side': ['#2C1812', '#7A3725'], 'wall-line': ['#251410', '#6E2F20'],
  plinth: ['#26140F', '#5E2A1E'], band: ['#5C4024', '#D9A15C'], board: ['#3A3D42', '#F1F1EC'],
  clad: ['#1A1D23', '#4B525C'], 'clad-line': ['#121418', '#3A4048'],
  roof: ['#14171C', '#33373E'], 'roof-line': ['#0D0F13', '#26292F'], ridge: ['#0B0D10', '#202328'],
  frame: ['#2E3036', '#EDEEEA'], sill: ['#33363C', '#D6D7D2'], glass: ['#101826', '#8FB0CC'],
  door: ['#20242A', '#5A6068'], 'door-line': ['#171A1F', '#474C53'], dframe: ['#121418', '#262A31'],
  panel: ['#0D1422', '#1E2B44'], 'panel-line': ['#2A374F', '#8193AE'],
  grass: ['#0F1D14', '#557F49'], 'grass-front': ['#0C1810', '#46703D'], soil: ['#0A0E0C', '#1B231D'], lane: ['#18201B', '#2B362E'],
  'hill-far': ['#0B111C', '#8BA3BA'], 'hill-near': ['#0B1512', '#6C8D69'],
  pylon: ['#2A3244', '#7D8795'], tree: ['#0D1812', '#41643B'], shrub: ['#0C1610', '#4A6E3F'],
  cab: ['#1A202A', '#E3E6EA'], 'cab-edge': ['#2C3443', '#B5BBC3'], 'cab-screen': ['#0A0E15', '#1E232B'],
  cloud: ['#1B2131', '#EEF1F5'],
  pave: ['#26150F', '#8C4A38'], 'pave-line': ['#1C0F0B', '#74392A'], bed: ['#110E0B', '#3F3228'],
  flower: ['#4F5449', '#EEF0E2'], 'shrub-lt': ['#151F12', '#A4A957'], hedge: ['#0B140E', '#3B5E34'], fence: ['#14110E', '#6B5747'],
  'fence-line': ['#0E0C0A', '#54433A'], post: ['#0B0C0E', '#2A2C30'],
  'board-side': ['#2E3135', '#D6D7D1'], insul: ['#3A4256', '#9AA6B8'],
  car: ['#1C2028', '#8E96A0'], 'car-side': ['#14171D', '#6E7782'], 'car-top': ['#232832', '#AAB2BB'], charger: ['#2B2F36', '#B7BABF'],
};
const SKY = { night: ['#04070E', '#0C1322'], twilight: ['#1A2238', '#7E5A4E'], day: ['#4E7CB2', '#AAC3DB'] };

const WEATHER_NL = {
  'clear-night': 'Helder', cloudy: 'Bewolkt', fog: 'Mist', hail: 'Hagel', lightning: 'Onweer',
  'lightning-rainy': 'Onweersbuien', partlycloudy: 'Half bewolkt', pouring: 'Zware regen', rainy: 'Regen',
  snowy: 'Sneeuw', 'snowy-rainy': 'Natte sneeuw', sunny: 'Zonnig', windy: 'Winderig', 'windy-variant': 'Winderig',
  exceptional: 'Uitzonderlijk',
};

/* ---------- iconen (24x24, lijn) ---------- */
const I = (p) => `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.75" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">${p}</svg>`;
const CLOUD = 'M7.5 18h9a4 4 0 0 0 .6-7.95A5.5 5.5 0 0 0 6.6 11.2 3.4 3.4 0 0 0 7.5 18z';
const CLOUD_UP = 'M7.5 15h9a4 4 0 0 0 .6-7.95A5.5 5.5 0 0 0 6.6 8.2 3.4 3.4 0 0 0 7.5 15z';
const ICON = {
  solar: I('<path d="M4.5 5h15l-1.6 10H6.1z"/><path d="M5.3 10h13.4M9.8 5l-.6 10M14.2 5l.6 10M12 15v4M8 19h8"/>'),
  grid: I('<path d="M8 21l4-17 4 17"/><path d="M5 8h14M6.5 12.5h11M9.6 12.5l4.8 6M14.4 12.5l-4.8 6M12 4V2.5"/>'),
  battery: I('<rect x="3" y="7" width="16" height="10" rx="2"/><path d="M21.5 10.5v3M7 10v4M10.5 10v4"/>'),
  home: I('<path d="M3.5 11 12 4l8.5 7"/><path d="M5.5 9.5V20h13V9.5"/><path d="M10 20v-5.5h4V20"/>'),
  price: I('<path d="M17.5 6.6A7 7 0 1 0 17.5 17.4"/><path d="M4 10.4h9M4 13.6h9"/>'),
  total: I('<path d="M4 20h16"/><path d="M6.5 16.5v-5M11 16.5V7.5M15.5 16.5v-7M20 16.5V4.5"/>'),
  plug: I('<path d="M9 3v5M15 3v5"/><path d="M6.5 8h11v3a5.5 5.5 0 0 1-11 0z"/><path d="M12 16.5V21"/>'),
  sliders: I('<path d="M4 7h10M18 7h2M4 17h4M12 17h8"/><circle cx="16" cy="7" r="2"/><circle cx="10" cy="17" r="2"/>'),
  close: I('<path d="M6 6l12 12M18 6 6 18"/>'),
  prev: I('<path d="M15 5l-7 7 7 7"/>'),
  next: I('<path d="M9 5l7 7-7 7"/>'),
  sun: I('<circle cx="12" cy="12" r="4"/><path d="M12 2.5v2M12 19.5v2M4.6 4.6 6 6M18 18l1.4 1.4M2.5 12h2M19.5 12h2M4.6 19.4 6 18M18 6l1.4-1.4"/>'),
  moon: I('<path d="M19.5 14.6A8 8 0 1 1 9.4 4.5a6.4 6.4 0 0 0 10.1 10.1z"/>'),
  cloud: I(`<path d="${CLOUD}"/>`),
  partly: I(`<path d="M8.5 5.2V3.8M4.3 7 3.3 6M3.5 11H2M12.7 7l1-1"/><path d="M5.6 12.6A3.6 3.6 0 0 1 11.8 9"/><path d="M9.5 20h7.5a3.5 3.5 0 0 0 .5-6.96A4.8 4.8 0 0 0 8.6 14a3 3 0 0 0 .9 6z"/>`),
  rain: I(`<path d="${CLOUD_UP}"/><path d="M8.5 18l-1 2.5M12.5 18l-1 2.5M16.5 18l-1 2.5"/>`),
  pouring: I(`<path d="${CLOUD_UP}"/><path d="M8 17.5l-1.5 4M12 17.5l-1.5 4M16 17.5l-1.5 4"/>`),
  snow: I(`<path d="${CLOUD_UP}"/><path d="M8.5 19h.01M12 20.5h.01M15.5 19h.01"/>`),
  fog: I('<path d="M4 9h16M6 13h12M4 17h16"/>'),
  storm: I(`<path d="${CLOUD_UP}"/><path d="M12.5 15.5 10.5 19h3l-2 3.5"/>`),
  wind: I('<path d="M3 8.5h10.5a2.75 2.75 0 1 0-2.7-3.2M3 15.5h14.5a2.75 2.75 0 1 1-2.7 3.2M3 12h8"/>'),
};
const WEATHER_ICON = {
  'clear-night': 'moon', cloudy: 'cloud', fog: 'fog', hail: 'snow', lightning: 'storm', 'lightning-rainy': 'storm',
  partlycloudy: 'partly', pouring: 'pouring', rainy: 'rain', snowy: 'snow', 'snowy-rainy': 'snow', sunny: 'sun',
  windy: 'wind', 'windy-variant': 'wind', exceptional: 'cloud',
};

/* =====================================================================
 * Scène. Tekenvlak 1600 breed, maaiveld (voorkant) y=560.
 * De woning staat in schuine parallelprojectie: de voorgevel op ware grootte,
 * de diepte loopt langs vector D naar links-achter. Alles wat "naar achter" ligt
 * gebruikt dezelfde D, zodat dakvlak, zijgevel, panelen en grasvlak op elkaar aansluiten.
 * ===================================================================== */
const FULL_UNIT = 390;         // ware lengte-eenheden per diepte-eenheid (woning ~10 m)
const GROUND = 560;           // straatrand (voorkant van het terrein)
const VB = { y: 100, h: 470 }; // eindigt vlak onder de grasrand: de onderbalk sluit direct aan
const D = [-130, -48];         // dieptevector: 1 = diepte van de woning (~10 m)
const VF = 0.6;                // gevel staat zoveel diepte achter de straatrand (ruimte voor oprit en tuin)
const HX = 70, HY = VF * D[1]; // verschuiving van de woning op het scherm
// schaal: een deur van 2,1 m is 82 eenheden hoog -> 1 m ≈ 39 eenheden
const add = (p, q, k = 1) => [p[0] + q[0] * k, p[1] + q[1] * k];
const sh = (p) => [p[0] + HX, p[1] + HY];
const pt = (p) => `${p[0].toFixed(1)},${p[1].toFixed(1)}`;
const poly = (ps) => ps.map(pt).join(' ');
// Woning in eigen coördinaten (gevelvoet op y=GROUND); de linker zijgevel loopt in de diepte onder het dakvlak.
const H = { l: 652, r: 948, apex: [800, 236], eaveL: [636, 440], eaveR: [964, 440] };
H.slopeL = (H.eaveL[1] - H.apex[1]) / (H.apex[0] - H.eaveL[0]);
H.slopeR = (H.eaveR[1] - H.apex[1]) / (H.eaveR[0] - H.apex[0]);
const boardY = (x) => H.apex[1] + (x < H.apex[0] ? (H.apex[0] - x) * H.slopeL : (x - H.apex[0]) * H.slopeR);
// linker dakvlak: u = goot->nok, v = diepte (0 voor, 1 achter)
const roofPt = (u, v) => add(add(H.eaveL, [H.apex[0] - H.eaveL[0], H.apex[1] - H.eaveL[1]], u), D, v);
// hoogte van het dakvlak op scherm-x, op diepte v
const roofY = (x, v) => { const u = (x - H.eaveL[0] - v * D[0]) / (H.apex[0] - H.eaveL[0]); return H.eaveL[1] + u * (H.apex[1] - H.eaveL[1]) + v * D[1]; };
// punt op het maaiveld rond de woning; dv = diepte t.o.v. de gevel (negatief = ervoor)
const gl = (x, dv, h = 0) => [x + dv * D[0], GROUND + dv * D[1] - h];
// punt op de linker zijgevel: v = diepte (0..1), h = hoogte boven maaiveld
const sw = (v, h = 0) => add([H.l, GROUND - h], D, v);
const DOOR = { v0: 0.45, v1: 0.57, h: 84 };                      // voordeur in de zijgevel; daarachter zit de meterkast
const WIN = { v0: 0.045, v1: 0.3, h0: 26, h1: 84 };            // zijraam (met kamerlicht)
const BAT = { x0: 626, x1: H.l, v0: 0.85, v1: 0.89, h: 46 };    // thuisbatterij (~1,2 m) tegen de achterhoek
const GATE = { x0: 470, x1: H.l, v: 1.0, h: 74 };               // poort (~1,9 m), twee vlakken, sluit aan op het huis
const DRIVE = { x0: 470, x1: H.l - 2 };
const CAR = { x0: 606, x1: 676, v0: -0.4, len: 0.45 };          // auto op de oprit, naast de tuin
const EVC = { x: 660, v: -0.4, h: 66 };                         // laadpaal aan de rand van de tuin

// pad met afgeronde hoeken door een reeks punten
function roundedPath(pts, r = 10) {
  let d = `M${pts[0][0].toFixed(1)} ${pts[0][1].toFixed(1)}`;
  for (let i = 1; i < pts.length - 1; i++) {
    const [x0, y0] = pts[i - 1], [x1, y1] = pts[i], [x2, y2] = pts[i + 1];
    const l1 = Math.hypot(x1 - x0, y1 - y0), l2 = Math.hypot(x2 - x1, y2 - y1);
    const rr = Math.min(r, l1 / 2, l2 / 2);
    const ax = x1 - ((x1 - x0) / l1) * rr, ay = y1 - ((y1 - y0) / l1) * rr;
    const bx = x1 + ((x2 - x1) / l2) * rr, by = y1 + ((y2 - y1) / l2) * rr;
    d += ` L${ax.toFixed(1)} ${ay.toFixed(1)} Q${x1.toFixed(1)} ${y1.toFixed(1)} ${bx.toFixed(1)} ${by.toFixed(1)}`;
  }
  const [lx, ly] = pts[pts.length - 1];
  return `${d} L${lx.toFixed(1)} ${ly.toFixed(1)}`;
}

/* --- hoogspanningsmast: vakwerk met taps toelopende poten, twee traversen, isolatorkettingen --- */
const PL = { legB: 42, legT: 11, top: 262, peak: 306, armL: [-222, 72], armU: [-262, 56], ins: 22 };
const legX = (y) => PL.legB - (-y / PL.top) * (PL.legB - PL.legT);
function pylonSVG(x, b, s) {
  const lv = [0, -48, -92, -132, -168, -200, -230, -262];
  let brace = '';
  for (let i = 0; i < lv.length - 1; i++) {
    const a = legX(lv[i]), c = legX(lv[i + 1]);
    brace += `M${-c} ${lv[i + 1]}H${c}M${-a} ${lv[i]}L${c} ${lv[i + 1]}M${a} ${lv[i]}L${-c} ${lv[i + 1]}`;
  }
  const [yl, wl] = PL.armL, [yu, wu] = PL.armU;
  const arms = `M${-wl} ${yl}H${wl}M${-wl} ${yl}L${-legX(yl - 22)} ${yl - 22}M${wl} ${yl}L${legX(yl - 22)} ${yl - 22}
    M${-wl * 0.62} ${yl}L${-wl * 0.4} ${yl - 14}M${wl * 0.62} ${yl}L${wl * 0.4} ${yl - 14}
    M${-wu} ${yu}H${wu}M${-wu} ${yu}L-5 ${yu - 22}M${wu} ${yu}L5 ${yu - 22}M${-wu * 0.6} ${yu}L${-wu * 0.38} ${yu - 9}M${wu * 0.6} ${yu}L${wu * 0.38} ${yu - 9}
    M-16 ${-PL.peak + 6}H16`;
  const ins = (ix, iy) => `<path d="M${ix} ${iy}V${iy + PL.ins}" stroke-width="1"/>` +
    [4, 9, 14, 19].map((d) => `<ellipse cx="${ix}" cy="${iy + d}" rx="3.2" ry="1.3" fill="var(--insul)" stroke="none"/>`).join('');
  return `<g transform="translate(${x} ${b}) scale(${s})" class="pylon">
    <rect x="${-PL.legB - 7}" y="-3" width="14" height="5" fill="var(--pylon)" stroke="none"/><rect x="${PL.legB - 7}" y="-3" width="14" height="5" fill="var(--pylon)" stroke="none"/>
    <path d="M${-PL.legB} 0L${-PL.legT} ${-PL.top}L0 ${-PL.peak}L${PL.legT} ${-PL.top}L${PL.legB} 0" stroke-width="2.4"/>
    <path d="${brace}" stroke-width="1"/>
    <path d="${arms}" stroke-width="1.6"/>
    ${ins(-wl, yl)}${ins(wl, yl)}${ins(-wu, yu)}${ins(wu, yu)}</g>`;
}
// masten lopen in de diepte weg langs D (zelfde perspectief als de woning)
const PYLONS = [0, 1, 2, 3].map((k) => [230 + k * D[0], GROUND + k * D[1], [1, 0.66, 0.46, 0.32][k]]);
const pylonPts = ([x, b, s]) => {
  const [yl, wl] = PL.armL, [yu, wu] = PL.armU, i = PL.ins;
  return [[x - wl * s, b + (yl + i) * s], [x + wl * s, b + (yl + i) * s], [x - wu * s, b + (yu + i) * s], [x + wu * s, b + (yu + i) * s], [x, b - PL.peak * s]];
};
const LAWN_BACK = GROUND + 3.2 * D[1];

function hillPath(y0, amp, ph, f1, f2) {
  let d = `M-2400 ${GROUND} L-2400 ${y0}`;
  for (let x = -2400; x <= 4000; x += 20) {
    const y = y0 - amp * (0.5 + 0.5 * Math.sin(x / f1 + ph)) - amp * 0.3 * Math.sin(x / f2 + ph * 2);
    d += ` L${x} ${y.toFixed(1)}`;
  }
  return `${d} L4000 ${GROUND} Z`;
}

// vensterbank van donkere baksteen (rollaag)
const brickSill = (x, w, y) => `<rect x="${x - 4}" y="${y}" width="${w + 8}" height="5" fill="var(--plinth)"/>
  <rect x="${x - 4}" y="${y}" width="${w + 8}" height="1.2" fill="var(--wall-line)"/>`;
// bovenraam: smalle crèmewitte lijst, donker kozijn met twee draaiende delen
function upperWin(x, y, w, h) {
  const m = x + w / 2, pw = w / 2 - 8;
  return `<rect x="${x}" y="${y}" width="${w}" height="${h}" fill="var(--frame)"/>
    <rect x="${x + 2.5}" y="${y + 2.5}" width="${w - 5}" height="${h - 5}" fill="var(--dframe)"/>
    <rect class="glass" x="${x + 5.5}" y="${y + 5.5}" width="${pw}" height="${h - 11}"/>
    <rect class="glass" x="${m + 2.5}" y="${y + 5.5}" width="${pw}" height="${h - 11}"/>
    ${brickSill(x, w, y + h)}`;
}
// benedenraam: breed wit kozijn; optioneel bovenlicht met donker kozijntje.
// Met `key` licht het glas op volgens de verlichting van die kamer (config window_lights).
function groundWin(x, y, w, h, transom = 0, key = '') {
  const pane = (px, py, pw, ph) => `<rect class="glass" x="${px}" y="${py}" width="${pw}" height="${ph}"${key ? ` data-win="${key}"` : ''}/>` +
    (key ? `<rect data-wg="${key}" x="${px}" y="${py}" width="${pw}" height="${ph}" fill="#F3C67E" opacity="0"/>` : '');
  let s = `<rect x="${x}" y="${y}" width="${w}" height="${h}" fill="var(--frame)"/>`;
  if (transom) {
    s += `<rect x="${x + 5}" y="${y + 5}" width="${w - 10}" height="${transom}" fill="var(--dframe)"/>
      ${pane(x + 7.5, y + 7.5, w - 15, transom - 5)}${pane(x + 5, y + 9 + transom, w - 10, h - 14 - transom)}`;
  } else s += pane(x + 5, y + 5, w - 10, h - 10);
  return `${s}${brickSill(x, w, y + h)}`;
}
// stroombanen (schermcoördinaten): alle kabels lopen naar de voordeur, daarachter zit de meterkast
const DV = (DOOR.v0 + DOOR.v1) / 2;
const DOOR_FOOT = sh(sw(DV));
const BAT_TOP = sh(gl((BAT.x0 + BAT.x1) / 2, BAT.v0, BAT.h));
const BAT_FOOT = sh(gl((BAT.x0 + BAT.x1) / 2, BAT.v0));
const EV_FOOT = sh(gl(EVC.x, EVC.v));
const EV_TOP = sh(gl(EVC.x, EVC.v, EVC.h));
// knooppunt voor de deur, op de grond net buiten de goot (x=636): hier komen alle kabels samen
const JG = 636;
const J = sh(gl(JG, DV));
const gp = (x, v) => sh(gl(x, v));
// paneelkabel: recht het dakvlak af naar de goot boven de deur, dan langs de gevel omlaag naar de deur
const SOLAR_CABLE = [roofPt(0.3, DV), roofPt(0, DV), [roofPt(0, DV)[0], GROUND + DV * D[1]]];
const PY = pylonPts(PYLONS[0]);
// padrichting = richting van "vooruit": net -> huis, zon -> huis, huis -> batterij (laden), huis -> laadpaal
const FLOWS = {
  grid: [[PY[1][0] + 28, J[1]], J],                                   // horizontaal uit het trafohuisje naar het knooppunt voor de voordeur
  battery: [J, gp(JG, 0.84), BAT_FOOT],                               // langs de zijmuur naar achteren, naar de batterij
  solar: SOLAR_CABLE.map(sh),                                         // recht over het dak, via de goot naar de voordeur
};
// labels: dev = ankerpunt op het apparaat, pos = ankerpunt van het kaartje, al = uitlijning
const TX = PY[1][0], TF = J[1] + 24;  // trafohuisje naast de mast
const LABELS = {
  solar: { dev: sh(roofPt(0.55, 0.5)), pos: [540, 192], al: 'bc' },   // zweeft in de lucht
  grid: { dev: [TX, TF + 1], row: true },                              // onder de netpaal
  battery: { dev: BAT_FOOT, row: true },                               // links naast de laadpaal
  ev: { dev: EV_FOOT, row: true },                                     // onder de laadpaal
  home: { dev: sh([800, GROUND - 8]), row: true },                     // rechts naast de laadpaal
};
const ROW_ORDER = ['grid', 'battery', 'ev', 'home', 'price', 'overview'];
// vermogenslabels in de scène, direct bij het apparaat
const SOLAR_TAG = sh(roofPt(0.5, 1));   // midden van de linker dakrand
const TAGS = { grid: [TX, TF - 74], battery: [BAT_TOP[0], BAT_TOP[1] - 6], solar: [SOLAR_TAG[0] - 10, SOLAR_TAG[1], 'l'] };
function sceneSVG() {
  seed = 11;
  const stars = Array.from({ length: 90 }, () => {
    const x = (rand() * 2400 - 400).toFixed(0), y = (rand() * 1000 - 600).toFixed(0);
    const r = (0.5 + rand() * 0.9).toFixed(2), o = (0.35 + rand() * 0.65).toFixed(2);
    const tw = rand() < 0.3 ? ` class="tw" style="animation-delay:-${(rand() * 4).toFixed(1)}s"` : '';
    return `<circle cx="${x}" cy="${y}" r="${r}" opacity="${o}"${tw}/>`;
  }).join('');
  const cloudDefs = [[160, 110, 1.25], [560, 50, 0.9], [980, 130, 1.4], [1380, 70, 1.05], [-180, 180, 1.1], [1780, 160, 1.2], [760, 200, 0.8], [1180, 20, 0.85]];
  const clouds = cloudDefs.map(([x, y, s], i) => `<g class="cloud" data-i="${i}" style="animation-duration:${140 + i * 23}s;animation-delay:-${i * 31}s">
      <g transform="translate(${x} ${y}) scale(${s})"><ellipse cx="0" cy="0" rx="110" ry="20"/><ellipse cx="-38" cy="-10" rx="52" ry="22"/>
      <ellipse cx="22" cy="-18" rx="60" ry="26"/><ellipse cx="74" cy="-5" rx="42" ry="17"/></g></g>`).join('');
  const drops = Array.from({ length: 120 }, () => {
    const x = (rand() * 2400 - 400).toFixed(0), len = (14 + rand() * 10).toFixed(0);
    return `<line x1="${x}" y1="0" x2="${x}" y2="${len}" style="animation-duration:${(0.7 + rand() * 0.45).toFixed(2)}s;animation-delay:-${(rand() * 2).toFixed(2)}s"/>`;
  }).join('');
  const flakes = Array.from({ length: 90 }, () => {
    const x = (rand() * 2400 - 400).toFixed(0);
    return `<circle cx="${x}" cy="0" r="${(1.2 + rand() * 1.6).toFixed(1)}" style="animation-duration:${(9 + rand() * 8).toFixed(1)}s;animation-delay:-${(rand() * 16).toFixed(1)}s"/>`;
  }).join('');
  const hail = Array.from({ length: 70 }, () => {
    const x = (rand() * 2400 - 400).toFixed(0);
    return `<circle cx="${x}" cy="0" r="${(1.3 + rand() * 1.2).toFixed(1)}" style="animation-duration:${(0.45 + rand() * 0.3).toFixed(2)}s;animation-delay:-${(rand() * 1.5).toFixed(2)}s"/>`;
  }).join('');
  const rays = Array.from({ length: 12 }, (_, i) => { const a = (i / 12) * Math.PI * 2; return `M${(Math.cos(a) * 32).toFixed(1)} ${(Math.sin(a) * 32).toFixed(1)}L${(Math.cos(a) * 50).toFixed(1)} ${(Math.sin(a) * 50).toFixed(1)}`; }).join('');

  const pylons = PYLONS.slice().reverse().map(([x, b, s]) => pylonSVG(x, b, s)).join('');
  let wires = '';
  for (let i = 0; i < PYLONS.length - 1; i++) {
    const a = pylonPts(PYLONS[i]), b = pylonPts(PYLONS[i + 1]);
    for (let k = 0; k < 5; k++) {
      const [x1, y1] = a[k], [x2, y2] = b[k];
      wires += `<path d="M${x1.toFixed(1)} ${y1.toFixed(1)} Q${((x1 + x2) / 2).toFixed(1)} ${(Math.max(y1, y2) + 14 * PYLONS[i][2]).toFixed(1)} ${x2.toFixed(1)} ${y2.toFixed(1)}"${k === 4 ? ' stroke-width=".6"' : ''}/>`;
    }
  }

  /* --- woning (eigen coördinaten) --- */
  const A = H.apex, A2 = add(A, D), EL = H.eaveL, EL2 = add(EL, D);
  const W0 = [H.l, GROUND], W1 = [H.l, 432];
  const side = poly([W0, W1, add(W1, D), add(W0, D)]);
  // zijraam: wit kozijn, glas dat 's avonds oplicht zoals de andere ramen
  const w = WIN;
  // alles ligt in het vlak van de zijgevel (verticale zijden, horizontale zijden langs de dieptevector), dus nooit scheef
  const wq = (a, b, h0, h1) => poly([sw(a, h0), sw(b, h0), sw(b, h1), sw(a, h1)]);
  const wm = 0.014, hm = 4.5;
  const sideWin = `<polygon points="${wq(w.v0 - wm, w.v1 + wm, w.h0 - hm, w.h1 + hm)}" fill="var(--frame)"/>
    <polygon class="glass" points="${wq(w.v0, w.v1, w.h0, w.h1)}"/>
    <polygon points="${wq(w.v0 - 0.035, w.v1 + 0.035, w.h0 - hm - 5, w.h0 - hm)}" fill="var(--plinth)"/>
    <polygon points="${wq(w.v0 - 0.035, w.v1 + 0.035, w.h0 - hm - 1.4, w.h0 - hm)}" fill="var(--wall-line)"/>`;
  const roof = poly([EL, A, A2, EL2]);
  let roofLines = '';
  for (let u = 0.05; u < 1; u += 0.05) roofLines += `M${pt(roofPt(u, 0))} L${pt(roofPt(u, 1))}`;
  let panels = '';
  const rows = [[0.3, 0.55], [0.58, 0.83]], cols = 5, v0 = 0.1, v1 = 0.9, gap = 0.012;
  rows.forEach(([ua, ub]) => {
    for (let c = 0; c < cols; c++) {
      const va = v0 + ((v1 - v0) / cols) * c + gap / 2, vb = v0 + ((v1 - v0) / cols) * (c + 1) - gap / 2;
      const q = [roofPt(ua, va), roofPt(ub, va), roofPt(ub, vb), roofPt(ua, vb)];
      const um = (ua + ub) / 2, vm = (va + vb) / 2;
      panels += `<polygon points="${poly(q)}" fill="var(--panel)" stroke="var(--panel-line)" stroke-width="1" stroke-linejoin="round"/>
        <path d="M${pt(roofPt(um, va))}L${pt(roofPt(um, vb))}M${pt(roofPt(ua, vm))}L${pt(roofPt(ub, vm))}" stroke="var(--panel-line)" stroke-width=".6" opacity=".6"/>`;
    }
  });
  // schoorsteen: staande koker op het dakvlak bij de nok; de voet volgt de dakhelling
  const cv = 0.14, cdep = 0.05, cc = roofPt(0.9, cv)[0], cx0 = cc - 9, cx1 = cc + 9;
  const cyt = roofY(cx1, cv) - 30, cdv = [D[0] * cdep, D[1] * cdep];
  const chimney = `
    <polygon points="${poly([[cx0, cyt], add([cx0, cyt], cdv), add([cx0, roofY(cx0, cv)], cdv), [cx0, roofY(cx0, cv)]])}" fill="var(--wall-side)"/>
    <polygon points="${poly([[cx0, cyt], [cx1, cyt], [cx1, roofY(cx1, cv)], [cx0, roofY(cx0, cv)]])}" fill="var(--wall)"/>
    <polygon points="${poly([[cx0 - 2, cyt], [cx1 + 2, cyt], add([cx1 + 2, cyt], cdv), add([cx0 - 2, cyt], cdv)])}" fill="var(--ridge)"/>
    <rect x="${(cx0 - 2).toFixed(1)}" y="${(cyt).toFixed(1)}" width="22" height="4" fill="var(--ridge)"/>`;
  const facade = poly([[H.l, GROUND], [H.l, boardY(H.l)], A, [H.r, boardY(H.r)], [H.r, GROUND]]);
  // siermetselwerk: twee rijen lichte koppen; boven de ramen trapt de band een laag op
  const band = (y, x1 = H.l, x2 = H.r) => `<line x1="${x1}" x2="${x2}" y1="${y}" y2="${y}" stroke="var(--band)" stroke-width="3" stroke-dasharray="5 5"/>
    <line x1="${x1}" x2="${x2}" y1="${y + 3.5}" y2="${y + 3.5}" stroke="var(--band)" stroke-width="3" stroke-dasharray="5 5" stroke-dashoffset="5"/>`;
  const bands = band(343) + band(334, 727, 791) + band(334, 809, 873) + band(448) + band(439, 663, 721) + band(439, 879, 939);
  const cladY = 300, cladL = (cladY - A[1]) / H.slopeL, cladR = (cladY - A[1]) / H.slopeR;
  let cladLines = '';
  for (let x = A[0] - cladL + 7; x < A[0] + cladR; x += 7) cladLines += `M${x.toFixed(1)} ${A[1]}V${cladY}`;

  // gewone voordeur in de zijgevel: wit kozijn, donkere deur met glaspaneel, stoep
  const d = DOOR;
  const door = `
    <polygon points="${poly([sw(d.v0 - 0.012, 0), sw(d.v0 - 0.012, d.h + 5), sw(d.v1 + 0.012, d.h + 5), sw(d.v1 + 0.012, 0)])}" fill="var(--frame)"/>
    <polygon points="${poly([sw(d.v0, 0), sw(d.v0, d.h), sw(d.v1, d.h), sw(d.v1, 0)])}" fill="var(--door)"/>
    <polygon points="${poly([sw(d.v0 + 0.022, d.h - 34), sw(d.v0 + 0.022, d.h - 8), sw(d.v1 - 0.022, d.h - 8), sw(d.v1 - 0.022, d.h - 34)])}" class="glass"/>
    <path d="M${pt(sw(d.v1 - 0.02, 40))}L${pt(sw(d.v1 - 0.034, 40))}" stroke="var(--sill)" stroke-width="2" stroke-linecap="round"/>
    <polygon points="${poly([add(sw(d.v0 - 0.025, 0), [-8, 0]), add(sw(d.v1 + 0.025, 0), [-8, 0]), add(sw(d.v1 + 0.025, 0), [-8, 4]), add(sw(d.v0 - 0.025, 0), [-8, 4])])}" fill="var(--sill)"/>`;

  // poort van twee vlakken met houten latten, sluit aan op de achterhoek van het huis
  const g = GATE, gL = gl(g.x0, g.v), gR = gl(g.x1, g.v), gM = [(gL[0] + gR[0]) / 2, gL[1]];
  let slats = '';
  for (let y = 6; y < g.h - 2; y += 6) slats += `M${gL[0].toFixed(1)} ${(gL[1] - y).toFixed(1)}H${gR[0].toFixed(1)}`;
  const gate = `<rect x="${gL[0].toFixed(1)}" y="${(gL[1] - g.h).toFixed(1)}" width="${(gR[0] - gL[0]).toFixed(1)}" height="${g.h}" fill="var(--fence)"/>
    <path d="${slats}" stroke="var(--fence-line)" stroke-width="1.2"/>
    ${[gL[0], gM[0] - 2, gR[0] - 4].map((x) => `<rect x="${x.toFixed(1)}" y="${(gL[1] - g.h - 3).toFixed(1)}" width="4" height="${g.h + 3}" fill="var(--post)"/>`).join('')}`;

  // thuisbatterij tegen de achterhoek: voorvlak + linkerzijvlak + bovenvlak, ledbalk met laadniveau
  const B = BAT, bd = B.v1 - B.v0, bFL = gl(B.x0, B.v0), bFR = gl(B.x1, B.v0), bh = B.h, bw = bFR[0] - bFL[0];
  const battery = `
    <polygon points="${poly([bFL, [bFL[0], bFL[1] - bh], add([bFL[0], bFL[1] - bh], D, bd), add(bFL, D, bd)])}" fill="var(--cab-edge)"/>
    <polygon points="${poly([[bFL[0], bFL[1] - bh], [bFR[0], bFR[1] - bh], add([bFR[0], bFR[1] - bh], D, bd), add([bFL[0], bFL[1] - bh], D, bd)])}" fill="var(--cab-edge)" opacity=".8"/>
    <rect x="${bFL[0].toFixed(1)}" y="${(bFL[1] - bh).toFixed(1)}" width="${bw.toFixed(1)}" height="${bh}" rx="2" fill="var(--cab)" stroke="var(--cab-edge)" stroke-width="1"/>
    <rect x="${(bFL[0] + bw / 2 - 4).toFixed(1)}" y="${(bFL[1] - bh + 9).toFixed(1)}" width="8" height="${bh - 16}" rx="2" fill="var(--cab-screen)"/>
    <g id="soc-seg">${[0, 1, 2, 3, 4].map((k) => `<rect x="${(bFL[0] + bw / 2 - 2.5).toFixed(1)}" y="${(bFL[1] - 12 - k * 5.6).toFixed(1)}" width="5" height="4" rx=".8"/>`).join('')}</g>
    <circle id="bat-led" cx="${(bFL[0] + bw / 2).toFixed(1)}" cy="${(bFL[1] - bh + 5).toFixed(1)}" r="1.6"/>`;

  // oprit: van de straat langs de zijgevel tot aan de poort
  const dr = DRIVE;
  const drive = poly([gl(dr.x0, g.v), gl(dr.x1, g.v), gl(dr.x1, -VF), gl(dr.x0, -VF)]);
  let driveLines = '';
  for (let x = dr.x0 + 12; x < dr.x1; x += 12) driveLines += `M${pt(gl(x, g.v))}L${pt(gl(x, -VF))}`;
  for (let v = g.v - 0.05; v > -VF; v -= 0.05) driveLines += `M${pt(gl(dr.x0, v))}L${pt(gl(dr.x1, v))}`;
  // voortuin: van de gevel tot de straatrand, met een smalle hoge boom in het midden
  const bed = poly([gl(H.l + 2, 0), gl(H.r, 0), gl(H.r, -VF), gl(H.l + 2, -VF)]); // even breed als het huis
  seed = 29;
  let plants = '';
  for (let i = 0; i < 46; i++) {
    const x = H.l + 12 + rand() * (H.r - H.l - 24), v = -0.04 - rand() * (VF - 0.06), [px, py] = gl(x, v);
    const kind = rand(), r = 5 + rand() * 7;
    const fill = kind < 0.32 ? 'var(--flower)' : kind < 0.58 ? 'var(--shrub-lt)' : 'var(--shrub)';
    plants += `<ellipse cx="${px.toFixed(1)}" cy="${(py - r * 0.6).toFixed(1)}" rx="${(r * 1.3).toFixed(1)}" ry="${r.toFixed(1)}" fill="${fill}"/>`;
  }
  const tree = gl(860, -0.3);

  // auto: simpele hatchback in zijaanzicht, in het vlak van de oprit (loopt mee met de diepterichting)
  const c = CAR, F0 = gl(c.x0, c.v0), CW = c.x1 - c.x0, CLEN = 164, CDEP = CLEN / FULL_UNIT;
  const cL = [D[0] * CDEP, D[1] * CDEP];
  const cp = (d, h) => [F0[0] + cL[0] * d, F0[1] - h + cL[1] * d];    // d = 0 (neus, naar de straat) .. 1 (achterkant)
  const fp = (x, h) => [F0[0] + x, F0[1] - h];
  const cpath = (items) => items.map((it) => (it === 'Z' ? 'Z' : `${it[0]}${it.slice(1).map((q) => pt(cp(q[0], q[1]))).join(' ')}`)).join('');
  const wheelPts = (d, rr) => Array.from({ length: 28 }, (_, i) => { const a = (i / 28) * Math.PI * 2; return cp(d + (Math.cos(a) * rr) / CLEN, 12 + Math.sin(a) * rr); });
  const wheel = (d) => `<polygon points="${poly(wheelPts(d, 12.5))}" fill="#101216"/><polygon points="${poly(wheelPts(d, 7.5))}" fill="#C9CFD7"/><polygon points="${poly(wheelPts(d, 2.4))}" fill="#4A515B"/>`;
  const shadowC = [F0[0] + cL[0] * 0.5, F0[1] + cL[1] * 0.5 + 2];
  const car = `
    <ellipse cx="${shadowC[0].toFixed(1)}" cy="${shadowC[1].toFixed(1)}" rx="${(Math.hypot(cL[0], cL[1]) / 2 + 8).toFixed(1)}" ry="6" fill="#000" opacity=".28" transform="rotate(${(Math.atan2(D[1], D[0]) * 180 / Math.PI + 180).toFixed(1)} ${shadowC[0].toFixed(1)} ${shadowC[1].toFixed(1)})"/>
    <path d="${cpath([['M', [0, 10]], ['L', [0, 27]], ['Q', [0, 33], [0.07, 35]], ['L', [0.26, 38]], ['C', [0.31, 46], [0.37, 54], [0.45, 56]], ['C', [0.56, 57.5], [0.68, 57.2], [0.76, 55.5]],
      ['C', [0.85, 53], [0.92, 46], [0.95, 40]], ['Q', [1, 38], [1, 32]], ['L', [1, 10]], 'Z'])}" fill="var(--car)" stroke="var(--car-side)" stroke-width="1"/>
    <path d="${cpath([['M', [0.33, 40]], ['L', [0.42, 54]], ['L', [0.55, 55.4]], ['L', [0.55, 40]], 'Z'])}" class="carglass"/>
    <path d="${cpath([['M', [0.58, 40]], ['L', [0.58, 55.4]], ['L', [0.72, 55]], ['L', [0.87, 44.5]], ['L', [0.86, 40]], 'Z'])}" class="carglass"/>
    <path d="M${pt(cp(0.565, 12))}L${pt(cp(0.565, 56))}" stroke="#000" stroke-opacity=".3" stroke-width="1"/>
    <path d="${cpath([['M', [0.08, 34]], ['L', [0.98, 34]]])}" stroke="#fff" stroke-opacity=".3" stroke-width="1"/>
    <polygon points="${poly([cp(0, 24), cp(0.025, 24), cp(0.045, 31), cp(0, 31)])}" fill="#F2F5F8"/>
    <polygon points="${poly([cp(0.975, 26), cp(1, 26), cp(1, 34), cp(0.97, 34)])}" fill="#D2443A"/>
    <polygon points="${poly([cp(0.12, 10), cp(0.88, 10), cp(0.88, 14), cp(0.12, 14)])}" fill="#1A1D22"/>
    ${wheel(0.2)}${wheel(0.8)}`;

  // laadpaal: slanke zuil, voorkant (display + ledring) naar links gericht, naar de auto en de oprit
  const xl = EVC.x - 6, xr = EVC.x + 6, vA = EVC.v - 0.037, vB = EVC.v + 0.037;
  const fc = (f, h, x = xl) => gl(x, vA + f * (vB - vA), h);     // punt op het linker (voor)vlak: f = 0..1 langs de diepte
  const circ = (f, h, r) => Array.from({ length: 22 }, (_, i) => { const a = (i / 22) * Math.PI * 2; return fc(f + (Math.cos(a) * r) / (FULL_UNIT * (vB - vA)), h + Math.sin(a) * r); });
  const hol = fc(0.5, 30);                                       // plugvak onder het display
  const portPt = cp(0.015, 28);                                 // laadaansluiting rechtsvoor op de auto
  const cableD = `M${pt(hol)}Q${pt([(hol[0] + portPt[0]) / 2, Math.max(hol[1], portPt[1]) + 11])} ${pt(portPt)}`;  // hangt rustig door, raakt de grond niet
  const evPath = cableD;                                                                                          // stroom loopt alleen van het plugvak naar de auto
  const charger = `
    <polygon points="${poly([fc(0.34, 0), fc(0.66, 0), fc(0.66, 28), fc(0.34, 28)])}" fill="var(--post)"/>
    <polygon points="${poly([fc(0.66, 0, xr), fc(0.66, 0), fc(0.66, 28), fc(0.66, 28, xr)])}" fill="var(--post)" opacity=".7"/>
    <polygon points="${poly([fc(0, 24, xl), fc(0, 24, xr), fc(0, 66, xr), fc(0, 66, xl)])}" fill="var(--cab-edge)"/>
    <polygon points="${poly([fc(0, 66), fc(0, 66, xr), fc(1, 66, xr), fc(1, 66)])}" fill="var(--charger)" opacity=".85"/>
    <polygon points="${poly([fc(0.06, 24), fc(0.94, 24), fc(1, 30), fc(1, 60), fc(0.94, 66), fc(0.06, 66), fc(0, 60), fc(0, 30)])}" fill="var(--charger)" stroke="var(--cab-edge)" stroke-width=".8"/>
    <polygon points="${poly([fc(0.17, 61), fc(0.83, 61), fc(0.9, 55), fc(0.9, 43), fc(0.83, 38), fc(0.17, 38), fc(0.1, 43), fc(0.1, 55)])}" fill="#08090C"/>
    <polygon id="ev-led" points="${poly(circ(0.5, 49.5, 6.2))}" fill="#4A5263"/>
    <polygon points="${poly(circ(0.5, 49.5, 2.4))}" fill="#08090C"/>
    <polygon points="${poly([fc(0.3, 26), fc(0.7, 26), fc(0.7, 34), fc(0.3, 34)])}" fill="#15181D"/>
    <path d="${cableD}" fill="none" stroke="#15181D" stroke-width="2.6" stroke-linecap="round"/>
    <path id="fp-ev2" class="lane-on" d="${evPath}" fill="none"/><g id="fd-ev2" class="dots"></g>`;

  // trafohuisje naast de mast: staat verhoogd zodat de kabel vanaf het huis op halve hoogte binnenkomt
  const TX = PY[1][0], TF = J[1] + 24, TH = 56, TW = 22, TT = TF - TH;
  const trafo = `
    <path d="M${TX.toFixed(1)} ${PY[1][1].toFixed(1)}V${(TT - 9).toFixed(1)}" stroke="var(--pylon)" stroke-width="1.2" fill="none"/>
    <rect x="${TX - TW - 3}" y="${TF - 3}" width="${(TW + 3) * 2}" height="3" fill="var(--cab-edge)"/>
    <rect x="${TX - TW}" y="${TT}" width="${TW * 2}" height="${TH - 3}" fill="var(--cab)" stroke="var(--cab-edge)" stroke-width="1.5"/>
    <polygon points="${poly([[TX - TW - 4, TT], [TX + TW + 4, TT], [TX + TW - 5, TT - 9], [TX - TW + 5, TT - 9]])}" fill="var(--roof)" stroke="var(--cab-edge)" stroke-width="1"/>
    <path d="M${TX} ${TT + 3}V${TF - 6}" stroke="var(--cab-edge)" stroke-width="1.2"/>
    <path d="M${TX - 16} ${TT + 8}h11M${TX - 16} ${TT + 12}h11M${TX - 16} ${TT + 16}h11M${TX + 5} ${TT + 8}h11M${TX + 5} ${TT + 12}h11M${TX + 5} ${TT + 16}h11" stroke="var(--cab-edge)" stroke-width="1"/>
    <path d="M${TX - 4} ${TT + 31}l4 -7l4 7z" fill="#F2B33D"/><path d="M${TX + 0.5} ${TT + 26.5}l-1.6 2.6h1.5l-.5 2.4l1.8 -2.8h-1.5z" fill="#1A1D23"/>
    <rect x="${TX + TW}" y="${J[1] - 2.5}" width="6" height="5" rx="1" fill="var(--cab-edge)"/>`;

  const lanes = Object.entries(FLOWS).map(([k, pts]) => {
    const d = roundedPath(pts, 10);
    return `<g class="flow-${k}"><path class="lane" d="${d}"/><path id="fp-${k}" class="lane-on" d="${d}"/><g id="fd-${k}" class="dots"></g></g>`;
  }).join('');

  return `<svg viewBox="0 ${VB.y} 1600 ${VB.h}" preserveAspectRatio="xMidYMax meet" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink">
  <defs>
    <pattern id="brick" width="22" height="9" patternUnits="userSpaceOnUse">
      <path d="M0 .5H22M0 5H22M5.5 .5V5M16.5 5V9.5" stroke="var(--wall-line)" stroke-width=".7" fill="none"/></pattern>
    <clipPath id="facadeClip"><polygon points="${facade}"/></clipPath>
    <clipPath id="roofClip"><polygon points="${roof}"/></clipPath>
    <clipPath id="skyClip"><rect x="-2400" y="-1400" width="6400" height="${1400 + GROUND}"/></clipPath>
    <radialGradient id="sunHalo"><stop offset="0" stop-color="#FFE9B0" stop-opacity=".55"/><stop offset="1" stop-color="#FFE9B0" stop-opacity="0"/></radialGradient>
    <mask id="moonMask"><rect x="-30" y="-30" width="60" height="60" fill="#fff"/><circle cx="7" cy="-5" r="14" fill="#000"/></mask>
    <linearGradient id="carG" x1="0" y1="0" x2="0" y2="1"><stop offset="0" style="stop-color:var(--car-top)"/><stop offset=".55" style="stop-color:var(--car)"/><stop offset="1" style="stop-color:var(--car-side)"/></linearGradient>
    <filter id="soft" x="-20%" y="-50%" width="140%" height="200%"><feGaussianBlur stdDeviation="5"/></filter>
    <filter id="fogblur" x="-10%" y="-100%" width="120%" height="300%"><feGaussianBlur stdDeviation="9"/></filter>
  </defs>
  <g id="stars" fill="#fff">${stars}</g>
  <g id="orb"><circle id="sun-halo" r="140" fill="url(#sunHalo)"/><g id="rays"><path d="${rays}" stroke="#FFE7A8" stroke-width="2" stroke-linecap="round" opacity=".55"/></g>
    <circle id="sun" r="22" fill="#FFE7A8"/><circle id="moon" r="16" fill="#E6EAF2" mask="url(#moonMask)"/></g>
  <g id="clouds" filter="url(#soft)">${clouds}</g>
  <path d="${hillPath(LAWN_BACK - 6, 24, 0.6, 310, 97)}" fill="var(--hill-far)"/>
  <path d="${hillPath(LAWN_BACK + 4, 10, 2.1, 230, 71)}" fill="var(--hill-near)"/>
  <rect x="-2400" y="${LAWN_BACK}" width="6400" height="${GROUND - LAWN_BACK}" fill="var(--grass)"/>
  <rect id="snow-lawn" x="-2400" y="${LAWN_BACK}" width="6400" height="${GROUND - LAWN_BACK}" fill="#EEF2F7" opacity="0"/>
  <rect x="-2400" y="${GROUND}" width="6400" height="5" fill="var(--grass-front)"/>
  <rect x="-2400" y="${GROUND + 5}" width="6400" height="2000" fill="var(--soil)"/>

  <!-- hoogspanning (achterste masten eerst) -->
  <g fill="none" stroke="var(--pylon)" stroke-width="1" opacity=".85">${wires}</g>
  <g fill="none" stroke="var(--pylon)" stroke-linejoin="round">${pylons}</g>

  <!-- bomen achter -->
  <g fill="var(--tree)">
    <g class="sway" style="--sd:1"><rect x="1307" y="${LAWN_BACK + 46}" width="6" height="40"/><ellipse cx="1310" cy="${LAWN_BACK + 12}" rx="36" ry="52"/></g>
    <g class="sway" style="--sd:1.3"><rect x="1414" y="${LAWN_BACK + 60}" width="5" height="34"/><ellipse cx="1416.5" cy="${LAWN_BACK + 36}" rx="25" ry="36"/></g></g>

  <g transform="translate(${HX} ${HY})">
    <polygon points="${drive}" fill="var(--pave)"/>
    <path d="${driveLines}" stroke="var(--pave-line)" stroke-width=".8"/>
    <g>${gate}</g>
    <!-- woning -->
    <g data-pop="home" class="hit">
      <polygon points="${side}" fill="var(--wall-side)"/>
      <polygon points="${poly([[H.l, GROUND - 20], [H.l, GROUND], add([H.l, GROUND], D), add([H.l, GROUND - 20], D)])}" fill="var(--plinth)" opacity=".8"/>
      ${sideWin}
    </g>
    <g data-pop="solar" class="hit">
      <polygon points="${roof}" fill="var(--roof)"/>
      <path d="${roofLines}" stroke="var(--roof-line)" stroke-width="1" clip-path="url(#roofClip)"/>
      <polygon id="snow-roof" points="${roof}" fill="#F1F4F8" opacity="0"/>
      <g id="panels">${panels}</g>
      <path d="M${pt(A)}L${pt(A2)}" stroke="var(--ridge)" stroke-width="5" stroke-linecap="round"/>
      ${chimney}
      <path d="M${pt(EL)}L${pt(EL2)}" stroke="var(--board)" stroke-width="5"/>
    </g>
    <g data-pop="battery" class="hit">${battery}</g>
    <g data-pop="overview" class="hit">${door}</g>
    <!-- paneelkabel: recht over het dak naar de goot, langs de gevel naar de voordeur -->
    <path d="M${SOLAR_CABLE.map(pt).join('L')}" stroke="var(--ridge)" stroke-width="2.5" fill="none" stroke-linejoin="round"/>
    <g data-pop="home" class="hit">
      <polygon points="${facade}" fill="var(--wall)"/>
      <polygon points="${facade}" fill="url(#brick)"/>
      <g clip-path="url(#facadeClip)">
        <polygon points="${poly([A, [A[0] - cladL, cladY], [A[0] + cladR, cladY]])}" fill="var(--clad)"/>
        <path d="${cladLines}" stroke="var(--clad-line)" stroke-width="1.2"/>
        <rect x="${A[0] - cladL}" y="${cladY}" width="${cladL + cladR}" height="3" fill="var(--board)"/>
        ${bands}
        <rect x="${H.l}" y="${GROUND - 20}" width="${H.r - H.l}" height="20" fill="var(--plinth)"/>
      </g>
      <line x1="${H.l}" x2="${H.l}" y1="${boardY(H.l)}" y2="${GROUND}" stroke="var(--wall-line)" stroke-width="1.5"/>
      ${upperWin(735, 350, 48, 64)}${upperWin(817, 350, 48, 64)}
      ${groundWin(670, 456, 44, 78, 20)}${groundWin(738, 460, 128, 74, 0, 'living')}${groundWin(886, 456, 44, 78, 20)}
      <path d="M${pt(H.eaveL)}L${pt(A)}L${pt(H.eaveR)}" fill="none" stroke="var(--board)" stroke-width="13" stroke-linejoin="miter"/>
      <path d="M${pt(H.eaveR)}l9 0" stroke="var(--board)" stroke-width="6"/>
    <!-- warmtepomp buitenunit rechts naast de zijgevel -->
    <g data-pop="heatpump" class="hit" style="cursor:pointer">
      <title>Warmtepomp</title>
      <rect x="946" y="516" width="24" height="46" fill="transparent"/>
      <rect x="948" y="556" width="14" height="3" rx="1" fill="#1e2430"/>
      <rect x="949" y="526" width="12" height="30" rx="2" fill="#3a4252" stroke="#252b37" stroke-width="1"/>
    </g>

    </g>
    <!-- voortuin -->
    <polygon points="${bed}" fill="var(--bed)"/>
    ${plants}

    <g class="sway" style="--sd:.8"><rect x="${(tree[0] - 2.5).toFixed(1)}" y="${(tree[1] - 46).toFixed(1)}" width="5" height="46" fill="var(--tree)"/>
      <ellipse cx="${tree[0].toFixed(1)}" cy="${(tree[1] - 122).toFixed(1)}" rx="16" ry="84" fill="var(--hedge)"/></g>
  </g>

  <!-- hoofdmast: trafohuisje (verhoogd, kabel komt op halve hoogte binnen) -->
  <g data-pop="grid" class="hit">${trafo}
    <rect x="156" y="250" width="160" height="310" fill="transparent"/></g>

  <!-- stroombanen; alles komt samen bij de voordeur (meterkast) -->
  <g id="flows">${lanes}<circle cx="${J[0].toFixed(1)}" cy="${J[1].toFixed(1)}" r="4.5" fill="var(--cab-screen)" stroke="var(--cab-edge)" stroke-width="1.5"/></g>

  <!-- auto en laadpaal staan voor de kabels -->
  <g transform="translate(${HX} ${HY})">

    <g id="ev" style="display:none"><g data-pop="ev-car">${car}</g>${charger}</g>
  </g>

  <!-- weer -->
  <g id="fog" opacity="0" filter="url(#fogblur)" fill="#C9D1DC">
    <rect class="fogband" x="-2400" y="${LAWN_BACK - 30}" width="6400" height="46" opacity=".45" style="animation-duration:70s"/>
    <rect class="fogband" x="-2400" y="${LAWN_BACK + 30}" width="6400" height="40" opacity=".55" style="animation-duration:50s;animation-delay:-20s"/>
    <rect class="fogband" x="-2400" y="${GROUND - 46}" width="6400" height="36" opacity=".5" style="animation-duration:60s;animation-delay:-35s"/></g>
  <g clip-path="url(#skyClip)">
    <g id="rain" stroke="#B8C6DA" stroke-width="1" stroke-linecap="round" opacity="0">${drops}</g>
    <g id="hail" fill="#E8EDF3" opacity="0">${hail}</g>
    <g id="snow" fill="#F2F5FA" opacity="0">${flakes}</g>
  </g>
  <path id="bolt" d="M1120 40 L1098 150 L1124 150 L1090 290 L1140 132 L1112 132 L1136 40 Z" fill="#F4F6FF" opacity="0"/>
  <rect id="flash" x="-2400" y="-1400" width="6400" height="${1400 + GROUND + 200}" fill="#E6ECFF" opacity="0" pointer-events="none"/>
</svg>`;
}

/* ---------- grafieken ---------- */
function niceTicks(min, max, count = 4) {
  if (!(max > min)) { max = min + 1; }
  const raw = (max - min) / count, mag = Math.pow(10, Math.floor(Math.log10(raw))), e = raw / mag;
  const step = (e >= 7.5 ? 10 : e >= 3.5 ? 5 : e >= 1.5 ? 2 : 1) * mag;
  const lo = Math.floor(min / step) * step, hi = Math.ceil(max / step) * step, ticks = [];
  for (let v = lo; v <= hi + step / 2; v += step) ticks.push(+v.toFixed(10));
  return { lo, hi, ticks };
}
let chartUid = 0;

/* ---------- CSS ---------- */
const CSS = `
:host { display:block; position:fixed !important; top:0 !important; left:0 !important; width:100vw !important; height:100vh !important; z-index:999 !important; margin:0 !important; padding:0 !important; --text:#EEF0F3; --text2:#A4ACB9; --text3:#6C7584; --line:rgba(255,255,255,.08);
  --surface:rgba(12,16,22,.80); --c-battery:${C.battery};
  font-family:Inter,'Segoe UI Variable Text','Segoe UI',system-ui,-apple-system,Roboto,sans-serif; font-feature-settings:'tnum' 1,'cv11' 1;
  -webkit-font-smoothing:antialiased; -webkit-tap-highlight-color:transparent; }
* { box-sizing:border-box; }
button { font:inherit; color:inherit; }
.root { position:relative; height:var(--h,100vh); overflow:hidden; background:var(--soil,#0A0E0C); color:var(--text); user-select:none; -webkit-user-select:none; }
.sky { position:absolute; left:0; right:0; top:0; height:var(--horizon,70%); transition:background 6s linear; }
.stage { position:relative; height:100%; display:grid; grid-template-rows:auto minmax(0,1fr) auto; transition:transform 3s ease; }
header { display:grid; grid-template-columns:1fr auto 1fr; align-items:start; gap:24px; padding:clamp(16px,3.2vh,40px) clamp(16px,3vw,48px) 0; position:relative; z-index:2; }
.clock { text-align:center; grid-column:2; }
.hright { grid-column:3; justify-self:end; }
@media (max-width:900px) { header { display:flex; justify-content:space-between; } .clock { text-align:left; } }
.time { font-size:clamp(48px,6.4vw,108px); font-weight:300; letter-spacing:-.04em; line-height:.92; }
.date { margin-top:clamp(6px,1vh,12px); font-size:clamp(13px,1.2vw,19px); color:var(--text2); }
.hright { display:flex; flex-direction:column; align-items:flex-end; gap:clamp(10px,1.6vh,18px); }
.weather { display:flex; align-items:center; gap:clamp(10px,1vw,16px); padding:8px 12px; margin:-8px -12px; border-radius:14px; cursor:pointer; background:none; border:0; text-align:right; }
.weather:hover { background:rgba(255,255,255,.05); }
.weather .ic { width:clamp(30px,2.8vw,44px); height:clamp(30px,2.8vw,44px); color:var(--text); }
.w-temp { font-size:clamp(26px,2.6vw,42px); font-weight:300; letter-spacing:-.03em; line-height:1; }
.w-sub { margin-top:6px; font-size:clamp(12px,.95vw,14px); color:var(--text2); white-space:nowrap; }
.chips { display:flex; gap:8px; flex-wrap:wrap; justify-content:flex-end; }
.ch-b { position:absolute; right:clamp(12px,1.6vw,24px); bottom:clamp(10px,1.6vh,18px); z-index:4; flex-wrap:nowrap; }
.ch-h { display:none; }
.root.compact .ch-h { display:flex; }
.root.compact .ch-b { display:none; }
.chip { display:inline-flex; align-items:center; gap:10px; padding:8px 14px 8px 10px; border-radius:12px; background:var(--surface); border:1px solid var(--line);
  -webkit-backdrop-filter:blur(14px); backdrop-filter:blur(14px); cursor:pointer; text-align:left; transition:border-color .2s; }
.chip:hover { border-color:rgba(255,255,255,.18); }
.chip .ci { width:30px; height:30px; border-radius:9px; display:grid; place-items:center; color:var(--c); background:rgba(255,255,255,.06); flex:none; }
.chip .ci svg { width:18px; height:18px; }
.chip .cl { font-size:11px; color:var(--text2); line-height:1.2; }
.chip .cv { font-size:15px; font-weight:500; letter-spacing:-.01em; line-height:1.3; white-space:nowrap; }
.chip .cv small { font-size:11px; color:var(--text2); font-weight:500; margin-left:3px; }
.scene { position:relative; min-height:0; }
.scene > svg { position:absolute; inset:0; width:100%; height:100%; overflow:visible; }
.hit { cursor:pointer; }
.lane { fill:none; stroke:var(--lane); stroke-width:2.5; }
.lane-on { fill:none; stroke-width:2.5; opacity:0; transition:opacity .6s, stroke .6s; }
#fog, #rain, #snow, #hail, #bolt, #flash, #clouds, #stars, #orb { pointer-events:none; }
.cloud { animation:drift linear infinite alternate; }
@keyframes drift { from { transform:translateX(-70px); } to { transform:translateX(90px); } }
#rain line { animation:fall linear infinite; }
@keyframes fall { from { transform:translate(0,-80px) skewX(var(--skew,-12deg)); } to { transform:translate(var(--drift,-110px),${GROUND + 80}px) skewX(var(--skew,-12deg)); } }
#snow circle { animation:snowfall linear infinite; }
@keyframes snowfall { from { transform:translate(0,-40px); } to { transform:translate(60px,${GROUND + 40}px); } }
.tw { animation:tw 4s ease-in-out infinite alternate; }
@keyframes tw { from { opacity:.2; } to { opacity:.9; } }
#bat-led.pulse, #ev-led.pulse { animation:pulse 2s ease-in-out infinite; }
/* weer */
#rain.light line:nth-child(3n), #rain.light line:nth-child(3n+1) { display:none; }
#rain.pour line { animation-duration:.42s !important; }
#hail circle { animation:fall linear infinite; }
#clouds.windy .cloud { animation-duration:38s !important; }
#clouds.storm .cloud { animation-duration:60s !important; }
.sway { transform-box:fill-box; transform-origin:50% 100%; animation:sway calc(var(--sway-dur,7s) * var(--sd,1)) ease-in-out infinite alternate; }
@keyframes sway { from { transform:rotate(calc(var(--sway,.4deg) * -1)); } to { transform:rotate(var(--sway,.4deg)); } }
.fogband { animation:fogdrift linear infinite alternate; }
@keyframes fogdrift { from { transform:translateX(-160px); } to { transform:translateX(160px); } }
#rays { animation:spin 80s linear infinite; }
@keyframes spin { to { transform:rotate(360deg); } }
#flash.on { animation:flash 7s infinite; }
#bolt.on { animation:bolt 7s infinite; }
@keyframes flash { 0%, 86% { opacity:0; } 87% { opacity:.55; } 88% { opacity:.05; } 89% { opacity:.4; } 91%, 100% { opacity:0; } }
@keyframes bolt { 0%, 86% { opacity:0; } 87%, 89% { opacity:.95; } 88% { opacity:.3; } 90%, 100% { opacity:0; } }
.carglass { fill:var(--glass); opacity:.85; }
@keyframes pulse { 50% { opacity:.3; } }

/* labels bij de apparaten */
.leaders { position:absolute; left:0; top:0; width:100%; height:100%; pointer-events:none; overflow:visible; }
.labels { position:absolute; inset:0; pointer-events:none; }
.tag { position:absolute; left:0; top:0; transform-origin:50% 100%; pointer-events:auto; cursor:pointer; display:flex; align-items:baseline; gap:6px; padding:5px 10px; border-radius:10px; background:var(--surface); border:1px solid var(--line);
  -webkit-backdrop-filter:blur(12px); backdrop-filter:blur(12px); white-space:nowrap; font-size:11px; color:var(--text2); }
.tag b { font-size:14px; font-weight:600; letter-spacing:-.01em; color:var(--tc,var(--text)); font-variant-numeric:tabular-nums; }
.card { position:absolute; left:0; top:0; width:214px; pointer-events:auto; cursor:pointer; text-align:left; background:var(--surface); border:1px solid var(--line);
  border-radius:14px; padding:11px 13px 12px; -webkit-backdrop-filter:blur(14px); backdrop-filter:blur(14px); transition:border-color .2s; }
.card:hover { border-color:rgba(255,255,255,.18); }
.c-head { display:flex; align-items:center; gap:7px; font-size:12px; font-weight:500; color:var(--text2); min-height:20px; }
.c-head svg { width:15px; height:15px; color:var(--c); flex:none; }
.c-head > span:not(.pill) { min-width:0; overflow:hidden; text-overflow:ellipsis; white-space:nowrap; }
.pill { margin-left:auto; flex:none; font-size:10.5px; font-weight:500; padding:2px 7px; border-radius:999px; color:var(--pc,var(--text2)); background:rgba(255,255,255,.06); white-space:nowrap; }
@supports (color: color-mix(in srgb, red 50%, blue)) { .pill { background:color-mix(in srgb, var(--pc,#fff) 15%, transparent); }
  .chip .ci, .sh-icon { background:color-mix(in srgb, var(--c) 15%, transparent); } }
.pill:empty { display:none; }
.c-val { margin-top:7px; font-size:28px; font-weight:400; letter-spacing:-.03em; line-height:1; white-space:nowrap; }
.c-val small { font-size:12px; font-weight:500; letter-spacing:0; color:var(--text2); margin-left:4px; }
.c-sub { margin-top:7px; font-size:11.5px; color:var(--text2); white-space:nowrap; overflow:hidden; text-overflow:ellipsis; }
.socbar { display:flex; gap:3px; margin-top:9px; }
.socbar i { flex:1; height:4px; border-radius:2px; background:rgba(255,255,255,.09); }
.socbar i.on { background:var(--soc-c, var(--c-battery)); }
/* onderbalk: één rij, alle kaartjes even groot en precies zo hoog als de kaartjes zelf */
.dock { display:grid; grid-auto-flow:column; grid-auto-columns:minmax(0,1fr); align-items:stretch; gap:10px; padding:10px clamp(12px,1.6vw,24px) clamp(10px,1.4vh,16px); position:relative; z-index:1; }
.dock .card { position:relative; left:auto; top:auto; width:auto; display:flex; flex-direction:column; }
.dock .c-sub { margin-top:auto; padding-top:7px; }

@media (max-width:1100px) { .dock { grid-auto-flow:row; grid-template-columns:repeat(3,minmax(0,1fr)); } }
.root.compact .dock { grid-auto-flow:row; grid-template-columns:repeat(2,minmax(0,1fr)); gap:8px; padding:10px 16px 16px; }
.root.compact .labels, .root.compact .leaders { display:none; }
.leaders { z-index:1; }
.root.compact .chips .chip .cl { display:none; }

/* modals */
.modal { position:fixed; inset:0; z-index:20; display:flex; align-items:center; justify-content:center; padding:clamp(8px,3vw,32px);
  background:rgba(3,5,9,.62); -webkit-backdrop-filter:blur(6px); backdrop-filter:blur(6px); opacity:0; pointer-events:none; transition:opacity .18s ease; }
.modal.open { opacity:1; pointer-events:auto; }
.sheet { width:min(980px,100%); max-height:100%; overflow:auto; background:#0F131A; border:1px solid var(--line); border-radius:20px;
  box-shadow:0 30px 80px rgba(0,0,0,.55); transform:translateY(10px); transition:transform .22s ease; color:var(--text); }
.sheet.wide { width:min(1240px,100%); }
.modal.open .sheet { transform:none; }
.sh-head { display:flex; align-items:center; gap:14px; padding:20px 20px 18px 24px; border-bottom:1px solid var(--line); flex-wrap:wrap; }
.sh-icon { width:40px; height:40px; flex:none; border-radius:12px; display:grid; place-items:center; color:var(--c); background:rgba(255,255,255,.06); }
.sh-icon svg { width:22px; height:22px; }
.sh-title { min-width:0; }
.sh-title h2 { margin:0; font-size:18px; font-weight:600; letter-spacing:-.01em; }
.sh-sub { margin-top:3px; font-size:13px; color:var(--text2); }
.sh-live { margin-left:auto; font-size:clamp(24px,3vw,32px); font-weight:400; letter-spacing:-.03em; white-space:nowrap; }
.sh-live small { font-size:14px; font-weight:500; letter-spacing:0; color:var(--text2); margin-left:4px; }
.sh-tools { margin-left:auto; display:flex; align-items:center; gap:8px; flex-wrap:wrap; }
.iconbtn, .close { flex:none; width:38px; height:38px; border-radius:10px; border:1px solid var(--line); background:transparent; color:var(--text2); display:grid; place-items:center; cursor:pointer; }
.iconbtn:hover, .close:hover { color:var(--text); background:rgba(255,255,255,.05); }
.iconbtn:disabled { opacity:.35; cursor:default; }
.iconbtn svg, .close svg { width:18px; height:18px; }
.close { margin-left:8px; }
.kpis { display:grid; grid-template-columns:repeat(auto-fit,minmax(160px,1fr)); border-bottom:1px solid var(--line); }
.kpi { padding:16px 24px; border-right:1px solid var(--line); }
.kpi:last-child { border-right:0; }
.kpi .l { font-size:12px; color:var(--text2); }
.kpi .v { margin-top:6px; font-size:20px; font-weight:500; letter-spacing:-.015em; white-space:nowrap; }
.kpi .h { margin-top:3px; font-size:12px; color:var(--text3); white-space:nowrap; }
.sh-bar { display:flex; align-items:center; justify-content:space-between; gap:12px 20px; flex-wrap:wrap; padding:16px 24px 6px; }
.seg { display:inline-flex; padding:3px; gap:2px; border-radius:10px; background:rgba(255,255,255,.04); border:1px solid var(--line); }
.seg button { border:0; background:transparent; color:var(--text2); font-size:13px; font-weight:500; padding:6px 12px; border-radius:7px; cursor:pointer; white-space:nowrap; }
.seg button:hover { color:var(--text); }
.seg button[aria-pressed="true"] { background:rgba(255,255,255,.1); color:var(--text); }
.legend { display:flex; flex-wrap:wrap; gap:6px 16px; font-size:12px; color:var(--text2); }
.legend span { display:inline-flex; align-items:center; gap:6px; }
.legend i { width:10px; height:3px; border-radius:2px; background:var(--c); }
.chart { position:relative; height:clamp(220px,34vh,300px); margin:6px 12px 0 8px; }
.chart svg { display:block; width:100%; height:100%; }
.chart .msg, .ov-msg { position:absolute; inset:0; display:grid; place-items:center; color:var(--text3); font-size:13px; }
.chart .ax { fill:var(--text3); font-size:11px; font-family:inherit; }
.tip { position:absolute; top:0; left:0; pointer-events:none; background:#1A1F28; border:1px solid rgba(255,255,255,.12); border-radius:10px;
  padding:9px 11px; font-size:12px; min-width:170px; box-shadow:0 10px 30px rgba(0,0,0,.45); opacity:0; transition:opacity .12s; z-index:2; }
.tip b { display:block; font-weight:600; margin-bottom:6px; color:var(--text); }
.tip .r { display:flex; align-items:center; gap:8px; color:var(--text2); margin-top:3px; }
.tip .r i { width:8px; height:8px; border-radius:2px; background:var(--c); flex:none; }
.tip .r span { margin-left:auto; padding-left:12px; color:var(--text); font-weight:500; }
.tip .r.sum { border-top:1px solid rgba(255,255,255,.1); margin-top:6px; padding-top:6px; color:var(--text); }
.foot { padding:12px 24px 18px; font-size:12px; color:var(--text3); line-height:1.5; }

/* energieoverzicht */
.ov-body { position:relative; display:grid; grid-template-columns:minmax(0,1fr) minmax(0,1.15fr); min-height:420px; }
.ov-col { padding:20px 24px; min-width:0; }
.ov-col + .ov-col { border-left:1px solid var(--line); }
.ov-col h3 { margin:0 0 12px; font-size:13px; font-weight:600; color:var(--text2); letter-spacing:.01em; }
.hero { padding-bottom:18px; margin-bottom:18px; border-bottom:1px solid var(--line); }
.hero .l { font-size:13px; color:var(--text2); }
.hero .big { margin-top:6px; font-size:clamp(34px,4vw,48px); font-weight:400; letter-spacing:-.035em; line-height:1; }
.hero .h { margin-top:8px; font-size:13px; color:var(--text2); }
.hero .h b { color:var(--text); font-weight:500; }
.wf-row { display:grid; grid-template-columns:minmax(120px,1.1fr) minmax(80px,1.4fr) auto; align-items:center; gap:14px; padding:9px 0; }
.wf-row .n { font-size:13px; font-weight:500; }
.wf-row .n small { display:block; margin-top:2px; font-size:11.5px; font-weight:400; color:var(--text3); }
.wf-row .tr { position:relative; height:10px; border-radius:3px; background:rgba(255,255,255,.04); }
.wf-row .tr i { position:absolute; top:0; bottom:0; border-radius:3px; background:var(--c); }
.wf-row .a { font-size:14px; font-weight:500; text-align:right; white-space:nowrap; min-width:84px; }
.wf-row.total { border-top:1px solid var(--line); margin-top:4px; padding-top:13px; }
.wf-row.total .n, .wf-row.total .a { font-weight:600; }
.wf-row.muted .n, .wf-row.muted .a { color:var(--text2); }
.note { margin-top:10px; font-size:12px; color:var(--text3); line-height:1.5; }
.bal { margin-bottom:20px; }
.bal .bt { display:flex; justify-content:space-between; font-size:12px; color:var(--text2); margin-bottom:7px; }
.bal .bt b { color:var(--text); font-weight:500; }
.bal .bar { display:flex; height:12px; border-radius:4px; overflow:hidden; gap:2px; background:rgba(255,255,255,.04); }
.bal .bar i { display:block; height:100%; background:var(--c); }
.bal .lg { display:flex; flex-wrap:wrap; gap:6px 16px; margin-top:8px; font-size:12px; color:var(--text2); }
.bal .lg span { display:inline-flex; align-items:center; gap:6px; }
.bal .lg i { width:8px; height:8px; border-radius:2px; background:var(--c); }
.bal .lg b { color:var(--text); font-weight:500; }
.ov-chart { position:relative; height:240px; margin:0 -6px; }
.ov-chart svg { display:block; width:100%; height:100%; }
.ov-chart .ax { fill:var(--text3); font-size:11px; font-family:inherit; }

.ovt { grid-column:1/-1; display:grid; grid-template-columns:repeat(4,minmax(0,1fr)); border-bottom:1px solid var(--line); }
.ovt .t { padding:18px 24px; border-right:1px solid var(--line); min-width:0; }
.ovt .t:last-child { border-right:0; }
.ovt .l { display:flex; align-items:center; gap:8px; font-size:12.5px; color:var(--text2); }
.ovt .l i { width:8px; height:8px; border-radius:2px; background:var(--c); flex:none; }
.ovt .v { margin-top:8px; font-size:clamp(26px,2.8vw,38px); font-weight:400; letter-spacing:-.03em; line-height:1; white-space:nowrap; }
.ovt .v small { font-size:.42em; font-weight:500; letter-spacing:0; color:var(--text2); }
.ovt .v .cur { font-size:.6em; color:var(--text2); margin-right:2px; }
.ovt .h { margin-top:9px; font-size:12.5px; color:var(--text2); line-height:1.4; }
.ov-wide { grid-column:1/-1; border-left:0 !important; border-top:1px solid var(--line); }
.stack { display:flex; height:14px; border-radius:5px; overflow:hidden; gap:2px; background:rgba(255,255,255,.04); margin-bottom:12px; }
.stack i { display:block; height:100%; background:var(--c); }
.src-head, .src-row { display:grid; grid-template-columns:14px minmax(0,1fr) 84px 52px 76px; align-items:center; gap:8px; }
.src-head { font-size:11.5px; color:var(--text3); padding:2px 0 4px; }
.src-row { padding:10px 0; border-top:1px solid var(--line); }
.src-row > i { width:10px; height:10px; border-radius:3px; background:var(--c); }
.src-row .n { font-size:13.5px; font-weight:500; min-width:0; }
.src-row .n small, .cost-row .n small { display:block; margin-top:2px; font-size:11.5px; font-weight:400; color:var(--text3); }
.src-row .k, .src-row .p, .src-row .e, .src-head .k, .src-head .p, .src-head .e { text-align:right; font-variant-numeric:tabular-nums; white-space:nowrap; }
.src-row .k { font-size:14px; font-weight:500; } .src-row .k small { font-size:11px; color:var(--text2); font-weight:400; }
.src-row .p { font-size:12.5px; color:var(--text2); } .src-row .e { font-size:14px; font-weight:500; }
.src-row.total { border-top:1px solid rgba(255,255,255,.16); } .src-row.total .n, .src-row.total .k, .src-row.total .e { font-weight:600; }
.src-row.total > i { visibility:hidden; }
.cost-row { display:flex; justify-content:space-between; align-items:baseline; gap:16px; padding:11px 0; border-top:1px solid var(--line); }
.cost-row:first-of-type { border-top:0; padding-top:2px; }
.cost-row .n { font-size:13.5px; font-weight:500; } .cost-row .a { font-size:15px; font-weight:500; white-space:nowrap; font-variant-numeric:tabular-nums; }
.cost-row.total { border-top:1px solid rgba(255,255,255,.16); } .cost-row.total .n, .cost-row.total .a { font-weight:600; }
.cost-row.total .a { font-size:20px; letter-spacing:-.02em; }
.cost-row.muted .n, .cost-row.muted .a { color:var(--text2); }
@media (max-width:900px) { .ovt { grid-template-columns:repeat(2,minmax(0,1fr)); } .ovt .t:nth-child(2) { border-right:0; } .ovt .t:nth-child(-n+2) { border-bottom:1px solid var(--line); } }
@media (max-width:640px) { .ovt .t { padding:14px 16px; } .src-head, .src-row { grid-template-columns:12px minmax(0,1fr) 68px 40px 66px; gap:6px; } }.card:focus-visible, .chip:focus-visible, .seg button:focus-visible, .close:focus-visible, .iconbtn:focus-visible, .weather:focus-visible { outline:2px solid #8FB4FF; outline-offset:2px; }
@media (max-width:900px) { .ov-body { grid-template-columns:1fr; } .ov-col + .ov-col { border-left:0; border-top:1px solid var(--line); } }
@media (max-width:640px) { .kpi { padding:12px 16px; } .sh-head { padding:16px; } .sh-bar { padding:12px 16px 4px; } .ov-col { padding:16px; }
  .seg button { padding:6px 9px; font-size:12px; } .kpi .v { font-size:18px; } .sh-tools { margin-left:0; width:100%; } }
@media (prefers-reduced-motion: reduce) { .cloud, #rain line, #snow circle, #hail circle, .tw, .sway, .fogband, #rays, #bat-led.pulse, #ev-led.pulse { animation:none !important; } }

/* tijdelijk simulatiepaneel */
.simbtn { position:absolute; left:clamp(12px,1.6vw,24px); top:clamp(12px,1.6vh,20px); z-index:6; display:inline-flex; align-items:center; gap:8px;
  padding:7px 12px; border-radius:10px; background:var(--surface); border:1px solid var(--line); color:var(--text2); font-size:12px; font-weight:500; cursor:pointer;
  -webkit-backdrop-filter:blur(12px); backdrop-filter:blur(12px); }
.simbtn:hover { color:var(--text); }
.simbtn.on { color:#F2A33D; border-color:rgba(242,163,61,.45); }
.sim { position:absolute; left:clamp(12px,1.6vw,24px); top:calc(clamp(12px,1.6vh,20px) + 44px); z-index:7; width:320px; max-height:calc(100% - 140px); overflow:auto;
  background:rgba(15,19,26,.94); border:1px solid var(--line); border-radius:16px; padding:14px 16px 12px; box-shadow:0 20px 50px rgba(0,0,0,.5);
  -webkit-backdrop-filter:blur(16px); backdrop-filter:blur(16px); display:none; user-select:none; }
.sim.open { display:block; }
.sim h4 { margin:0 0 2px; font-size:14px; font-weight:600; }
.sim .hint { font-size:11.5px; color:var(--text3); margin-bottom:10px; }
.sim .row { padding:8px 0; border-top:1px solid var(--line); }
.sim .rh { display:flex; align-items:center; gap:8px; font-size:12.5px; color:var(--text2); }
.sim .rh label { display:flex; align-items:center; gap:8px; cursor:pointer; }
.sim .rh .val { margin-left:auto; color:var(--text); font-weight:500; font-variant-numeric:tabular-nums; }
.sim input[type=checkbox] { accent-color:#F2A33D; width:14px; height:14px; margin:0; }
.sim input[type=range] { width:100%; margin:8px 0 0; accent-color:#F2A33D; }
.sim select { width:100%; margin-top:8px; background:#1A1F28; color:var(--text); border:1px solid var(--line); border-radius:8px; padding:6px 8px; font:inherit; font-size:12.5px; }
.sim .row.off input[type=range], .sim .row.off select { opacity:.4; }
.sim .acts { display:flex; gap:8px; margin-top:10px; }
.sim .acts button { flex:1; padding:7px 10px; border-radius:8px; border:1px solid var(--line); background:rgba(255,255,255,.05); color:var(--text); font-size:12px; cursor:pointer; }
`;

/* ===================================================================== */
class ClaudeEnergyScene extends HTMLElement {
  constructor() {
    super();
    this.attachShadow({ mode: 'open' });
    this._cfg = {};
    this._hass = null;
    this._built = false;
    this._cache = {};
    this._flowKey = {};
    this._pop = null;
    this._ov = null;
    this._reduced = window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  }

  static getStubConfig() { return { screensaver: false, battery_invert: false, entities: {} }; }

  setConfig(config) {
    if (!config || !config.entities) throw new Error('claude-energy-scene: "entities" ontbreekt');
    this._cfg = config;
    if (this._built) this._update();
  }

  set hass(hass) {
    this._hass = hass;
    if (!this._built) this._build();
    this._update();
  }

  getCardSize() { return 12; }

  connectedCallback() {
    if (!document.querySelector(`link[href="${FONT_URL}"]`)) {
      const l = document.createElement('link'); l.rel = 'stylesheet'; l.href = FONT_URL; document.head.appendChild(l);
    }
    this._timers = [
      setInterval(() => this._clock(), 1000),
      setInterval(() => this._built && this._scene(), 60000),
      setInterval(() => this._shift(), 240000),
      setInterval(() => this._todayChip(), 600000),
    ];
    if (this._built) this._observe();
    this._locHandler = () => this._handleLocationChanged();
    window.addEventListener('location-changed', this._locHandler);
    window.addEventListener('popstate', this._locHandler);
    this._onHpMsg = (ev) => {
      if (!ev || !ev.data) return;
      if (ev.data.type === 'close-heatpump-popup') {
        this._closeAll();
      } else if (ev.data.type === 'ha-call-service' && this._hass) {
        this._hass.callService(ev.data.domain, ev.data.service, ev.data.data);
      } else if (ev.data.type === 'heatpump-ready' && this._hass) {
        const iframe = this.$('#hp-iframe');
        if (iframe && iframe.contentWindow) {
          iframe.contentWindow.postMessage({ type: 'hass-update', hass: { states: this._hass.states } }, '*');
        }
      }
    };
    window.addEventListener('message', this._onHpMsg);
    if (this._cfg && this._cfg.screensaver) {
      this._hideSidebarAndHeader();
      setTimeout(() => this._hideSidebarAndHeader(), 100);
      setTimeout(() => this._hideSidebarAndHeader(), 500);
    }
  }

  disconnectedCallback() {
    (this._timers || []).forEach(clearInterval);
    if (this._ro) this._ro.disconnect();
    clearTimeout(this._popTimer);
    window.removeEventListener('keydown', this._onKey);
    if (this._locHandler) {
      window.removeEventListener('location-changed', this._locHandler);
      window.removeEventListener('popstate', this._locHandler);
    }
    if (this._onHpMsg) window.removeEventListener('message', this._onHpMsg);
    this._restoreSidebarAndHeader();
  }

  _handleLocationChanged() {
    this._restoreSidebarAndHeader();
    setTimeout(() => this._restoreSidebarAndHeader(), 100);
    setTimeout(() => this._restoreSidebarAndHeader(), 500);
  }

  _hideSidebarAndHeader() {
    if (!this._cfg || !this._cfg.screensaver) return;
    try {
      const doc = document;
      const homeAssistant = doc.querySelector('home-assistant');
      if (!homeAssistant) return;
      const main = homeAssistant.shadowRoot && homeAssistant.shadowRoot.querySelector('home-assistant-main');
      if (!main || !main.shadowRoot) return;
      const mainShadow = main.shadowRoot;

      const sidebar = mainShadow.querySelector('ha-sidebar');
      if (sidebar) {
        sidebar.style.width = '0px';
        sidebar.style.display = 'none';
      }

      const contentContainer = mainShadow.querySelector('.content');
      if (contentContainer) {
        contentContainer.style.paddingLeft = '0px';
        contentContainer.style.marginLeft = '0px';
      }

      const partialResolver = mainShadow.querySelector('partial-panel-resolver');
      const lovelace = partialResolver && partialResolver.querySelector('ha-panel-lovelace');
      const huiRoot = lovelace && lovelace.shadowRoot && lovelace.shadowRoot.querySelector('hui-root');
      if (huiRoot && huiRoot.shadowRoot) {
        const header = huiRoot.shadowRoot.querySelector('.header') || huiRoot.shadowRoot.querySelector('app-header');
        if (header) {
          header.style.display = 'none';
          header.style.height = '0px';
        }
        const mainContainer = huiRoot.shadowRoot.querySelector('#view');
        if (mainContainer) {
          mainContainer.style.paddingTop = '0px';
          mainContainer.style.marginTop = '0px';
        }
      }
    } catch (e) {
      console.warn('[claude-energy-scene] Failed to hide sidebar/header via JS:', e);
    }
  }

  _restoreSidebarAndHeader() {
    try {
      const doc = document;
      const homeAssistant = doc.querySelector('home-assistant');
      if (!homeAssistant) return;
      const main = homeAssistant.shadowRoot && homeAssistant.shadowRoot.querySelector('home-assistant-main');
      if (!main || !main.shadowRoot) return;
      const mainShadow = main.shadowRoot;

      const sidebar = mainShadow.querySelector('ha-sidebar');
      if (sidebar) {
        sidebar.style.width = '';
        sidebar.style.display = '';
      }

      const contentContainer = mainShadow.querySelector('.content');
      if (contentContainer) {
        contentContainer.style.paddingLeft = '';
        contentContainer.style.marginLeft = '';
      }

      const partialResolver = mainShadow.querySelector('partial-panel-resolver');
      const lovelace = partialResolver && partialResolver.querySelector('ha-panel-lovelace');
      const huiRoot = lovelace && lovelace.shadowRoot && lovelace.shadowRoot.querySelector('hui-root');
      if (huiRoot && huiRoot.shadowRoot) {
        const header = huiRoot.shadowRoot.querySelector('.header') || huiRoot.shadowRoot.querySelector('app-header');
        if (header) {
          header.style.display = '';
          header.style.height = '';
        }
        const mainContainer = huiRoot.shadowRoot.querySelector('#view');
        if (mainContainer) {
          mainContainer.style.paddingTop = '';
          mainContainer.style.marginTop = '';
        }
      }
    } catch (e) {
      console.warn('[claude-energy-scene] Failed to restore sidebar/header via JS:', e);
    }
  }

  /* ----- helpers ----- */
  _ent(key) { return this._cfg.entities && this._cfg.entities[key]; }
  _st(key) { const id = this._ent(key); return (id && this._hass && this._hass.states[id]) || null; }
  _num(key) { const s = this._st(key); if (!s) return null; const v = parseFloat(s.state); return isFinite(v) ? v : null; }
  _numId(id) { const s = id && this._hass && this._hass.states[id]; if (!s) return null; const v = parseFloat(s.state); return isFinite(v) ? v : null; }
  _scale(key) { const s = this._st(key); const u = s && s.attributes.unit_of_measurement; return u === 'kW' ? 1000 : u === 'MW' ? 1e6 : 1; }
  _watts(key) { const v = this._num(key); return v == null ? 0 : v * this._scale(key); }
  _discharge(raw) { return this._cfg.battery_invert ? -raw : raw; }
  $(s) { return this.shadowRoot.querySelector(s); }
  $$(s) { return this.shadowRoot.querySelectorAll(s); }
  _setF(f, v) { this.$$(`[data-f="${f}"]`).forEach((el) => { if (el.textContent !== v) el.textContent = v; }); }

  // live waarden; het simulatiepaneel kan ze overschrijven (dan wordt het net uit de balans berekend)
  _live() {
    const S = this._sim || {};
    let grid = this._watts('grid');
    const solar = S.solar != null ? S.solar : Math.max(0, this._watts('solar'));
    const load = S.load != null ? S.load : Math.max(0, this._watts('load'));
    let dis = S.bat != null ? -S.bat : this._discharge(this._watts('battery_power'));
    // standby-verbruik van de omvormer (tot ~65 W) is geen laden of ontladen: tonen we als 0
    if (Math.abs(dis) <= (this._cfg.battery_standby_w != null ? +this._cfg.battery_standby_w : 65)) dis = 0;
    const soc = S.soc != null ? S.soc : this._num('battery_soc');
    const evOn = S.ev != null ? S.ev : !!this._ent('ev_power');
    const ev = !evOn ? 0 : S.evp != null ? S.evp : Math.max(0, this._watts('ev_power'));
    if (['solar', 'load', 'bat', 'evp', 'ev'].some((k) => S[k] != null)) grid = load + ev - solar - dis;
    return { grid, solar, load, dis, soc, ev, evOn };
  }

  /* ----- opbouw ----- */
  _cardHTML(k, label, icon, color, extra = '') {
    return `<button class="card" data-pop="${k}" data-card="${k}" style="--c:${color}">
      <div class="c-head">${icon}<span>${label}</span><span class="pill" data-f="${k}-pill"></span></div>
      <div class="c-val"><span data-f="${k}-v">–</span><small data-f="${k}-u"></small></div>${extra}
      <div class="c-sub" data-f="${k}-s"></div></button>`;
  }

  _build() {
    this._built = true;
    const soc = `<div class="socbar">${'<i></i>'.repeat(10)}</div>`;
    const hasPrice = !!this._ent('grid_price');
    const labelCards = () => ['solar', 'grid', 'battery'].map((k) => `<div class="tag" data-tag="${k}" data-pop="${k}"><b data-f="${k}-tag"></b><span data-f="${k}-tagl"></span></div>`).join('');
    // onderbalk: één rij, alle kaartjes even groot
    const dockCards = () => [
      this._cardHTML('grid', 'Stroomnet', ICON.grid, C.import),
      this._cardHTML('battery', 'Thuisbatterij', ICON.battery, C.battery, soc),
      this._cardHTML('solar', 'Zonnepanelen', ICON.solar, C.solar),
      this._cardHTML('ev', 'Laadpaal', ICON.plug, C.ev),
      this._cardHTML('home', 'Huisverbruik', ICON.home, C.home),
      hasPrice ? this._cardHTML('price', 'Stroomprijs', ICON.price, C.normal) : '',
      this._cardHTML('overview', 'Energieoverzicht', ICON.total, C.home),
    ].join('');
    this.shadowRoot.innerHTML = `<style>${CSS}</style>
    <div class="root" id="root">
      <div class="sky" id="sky"></div>
      <div class="stage" id="stage">
        <header>
          <div class="clock"><div class="time" id="time">--:--</div><div class="date" id="date"></div></div>
          <div class="hright">
            <button class="weather" id="weather" aria-label="Weer"><div><div class="w-temp" id="w-temp">–</div><div class="w-sub" id="w-sub"></div></div><span class="ic" id="w-icon"></span></button>
          </div>
        </header>
        <div class="scene" id="scene">${sceneSVG()}<div class="labels" id="labels">${labelCards()}</div></div>

        <div class="dock" id="dock">${dockCards()}</div>
      </div>
      ${this._cfg.simulator === false ? '' : `<button class="simbtn" id="simbtn">${ICON.sliders.replace('<svg ', '<svg width="15" height="15" ')}Simulatie</button>
      <div class="sim" id="sim"></div>`}
    </div>
    <div class="modal" id="modal" aria-hidden="true">
      <div class="sheet" role="dialog" aria-modal="true" aria-labelledby="sh-h">
        <div class="sh-head"><div class="sh-icon" id="sh-icon"></div>
          <div class="sh-title"><h2 id="sh-h"></h2><div class="sh-sub" id="sh-sub"></div></div>
          <div class="sh-live" id="sh-live"></div>
          <button class="close" data-close aria-label="Sluiten">${ICON.close}</button></div>
        <div class="kpis" id="kpis"></div>
        <div class="sh-bar"><div class="seg" id="seg"></div><div class="legend" id="legend"></div></div>
        <div class="chart" id="chart"></div>
        <div class="foot" id="foot"></div>
      </div>
    </div>
    
    <div id="hpm" aria-hidden="true" style="z-index:9000;display:none;position:fixed;inset:0;background:rgba(0,0,0,0.85);backdrop-filter:blur(10px);align-items:center;justify-content:center;padding:12px;">
      <div style="width:min(1440px,96vw);height:min(900px,94vh);max-height:94vh;border-radius:22px;overflow:hidden;border:1px solid rgba(255,255,255,0.15);box-shadow:0 40px 100px rgba(0,0,0,0.85);background:#0e1117;position:relative;">
        <iframe id="hp-iframe" style="width:100%;height:100%;border:none;display:block;background:#0e1117;"></iframe>
      </div>
    </div>
    <div class="modal" id="ovm" aria-hidden="true">
      <div class="sheet wide" role="dialog" aria-modal="true" aria-labelledby="ov-h">
        <div class="sh-head"><div class="sh-icon" style="--c:${C.home}">${ICON.total}</div>
          <div class="sh-title"><h2 id="ov-h">Energieoverzicht</h2><div class="sh-sub" id="ov-sub"></div></div>
          <div class="sh-tools">
            <div class="seg" id="ov-seg">${[['day', 'Dag'], ['week', 'Week'], ['month', 'Maand'], ['year', 'Jaar']].map(([k, l]) => `<button data-k="${k}">${l}</button>`).join('')}</div>
            <button class="iconbtn" id="ov-prev" aria-label="Vorige periode">${ICON.prev}</button>
            <button class="iconbtn" id="ov-next" aria-label="Volgende periode">${ICON.next}</button>
          </div>
          <button class="close" data-close aria-label="Sluiten">${ICON.close}</button></div>
        <div class="ov-body" id="ov-body"></div>
      </div>
    </div>`;

    if (this._cfg.height) this.$('#root').style.setProperty('--h', this._cfg.height);
    this._svg = this.$('#scene > svg');
    this._flows = {};
    [...Object.keys(FLOWS), 'ev2'].forEach((k) => {
      const p = this.$(`#fp-${k}`);
      let len = 80;
      try { len = p.getTotalLength() || 80; } catch (e) { /* nog niet zichtbaar */ }
      this._flows[k] = { path: p, dots: this.$(`#fd-${k}`), len };
    });

    this.$('#root').addEventListener('click', (e) => this._onClick(e));
    ['#modal', '#ovm'].forEach((id) => {
      const m = this.$(id);
      m.addEventListener('click', (e) => { if (e.target === m || e.target.closest('[data-close]')) this._closeAll(); });
      m.addEventListener('pointermove', () => this._armPopTimer());
    });
    const hpm = this.$('#hpm');
    if (hpm) hpm.addEventListener('click', (e) => { if (e.target === hpm) this._closeAll(); });
    this.$$('#ov-seg button').forEach((b) => b.addEventListener('click', () => { this._ov.kind = b.dataset.k; this._ov.off = 0; this._loadOverview(); }));
    this.$('#ov-prev').addEventListener('click', () => { this._ov.off--; this._loadOverview(); });
    this.$('#ov-next').addEventListener('click', () => { if (this._ov.off < 0) { this._ov.off++; this._loadOverview(); } });
    this._onKey = (e) => { if (e.key === 'Escape') this._closeAll(); };
    window.addEventListener('keydown', this._onKey);
    if (this.$('#simbtn')) this._buildSim();
    this._observe();
    this._clock();
    this._setF('overview-v', '–'); this._setF('overview-s', 'Kosten vandaag · tik voor details');
    setTimeout(() => this._todayChip(), 1500);
  }

  /* ----- tijdelijk simulatiepaneel: overschrijft tijd, weer en vermogens ----- */
  _buildSim() {
    this._sim = {};
    const fmtW = (v) => { const p = fmtPower(v); return `${v < 0 ? '−' : ''}${p.v} ${p.u}`; };
    const hm = (v) => `${String(Math.floor(v)).padStart(2, '0')}:${String(Math.round((v % 1) * 60)).padStart(2, '0')}`;
    this._simRows = [
      ['time', 'Tijd van de dag', 0, 24, 0.25, hm],
      ['cond', 'Weer'],
      ['cover', 'Bewolking', 0, 100, 1, (v) => `${v}%`],
      ['wind', 'Wind', 0, 100, 1, (v) => `${v} km/u`],
      ['temp', 'Temperatuur', -10, 35, 0.5, (v) => `${num(v, 1)}°`],
      ['solar', 'Zonnepanelen', 0, 8000, 50, fmtW],
      ['load', 'Huisverbruik', 0, 12000, 50, fmtW],
      ['soc', 'Laadniveau batterij', 0, 100, 1, (v) => `${v}%`],
      ['bat', 'Batterij (+ laden / − ontladen)', -11000, 11000, 100, fmtW],
      ['ev', 'Laadpaal met auto'],
      ['evp', 'Laadvermogen auto', 0, 11000, 100, fmtW],
    ];
    const el = this.$('#sim');
    el.innerHTML = `<h4>Simulatie</h4><div class="hint">Tijdelijk testpaneel. Vink een regel aan om de live waarde te overschrijven; het net volgt dan uit de balans.</div>
      ${this._simRows.map(([k, label, mn, mx, st]) => `<div class="row off" data-k="${k}"><div class="rh"><label><input type="checkbox" data-en>${label}</label><span class="val"></span></div>
        ${k === 'cond' ? `<select>${CONDITIONS.map((c) => `<option value="${c}">${WEATHER_NL[c] || c}</option>`).join('')}</select>`
          : k === 'ev' ? '' : `<input type="range" min="${mn}" max="${mx}" step="${st}">`}</div>`).join('')}
      <div class="acts"><button data-act="reset">Alles live</button><button data-act="close">Sluiten</button></div>`;
    const apply = () => {
      this.$('#simbtn').classList.toggle('on', Object.keys(this._sim).length > 0);
      this._flowKey = {};
      this._update(); this._scene(); this._simLabels();
    };
    el.querySelectorAll('.row').forEach((row) => {
      const k = row.dataset.k, en = row.querySelector('[data-en]'), ctl = row.querySelector('input[type=range], select');
      const read = () => (k === 'cond' ? ctl.value : k === 'ev' ? true : +ctl.value);
      en.addEventListener('change', () => { if (en.checked) this._sim[k] = read(); else delete this._sim[k]; row.classList.toggle('off', !en.checked); apply(); });
      if (ctl) ctl.addEventListener('input', () => { en.checked = true; row.classList.remove('off'); this._sim[k] = read(); apply(); });
    });
    el.querySelector('[data-act=reset]').addEventListener('click', () => {
      this._sim = {}; el.querySelectorAll('[data-en]').forEach((c) => { c.checked = false; }); el.querySelectorAll('.row').forEach((r) => r.classList.add('off'));
      this._simSeed(); apply();
    });
    el.querySelector('[data-act=close]').addEventListener('click', () => el.classList.remove('open'));
    this.$('#simbtn').addEventListener('click', (e) => { e.stopPropagation(); if (!el.classList.contains('open')) this._simSeed(); el.classList.toggle('open'); });
    ['click', 'pointerdown'].forEach((t) => el.addEventListener(t, (e) => e.stopPropagation()));
  }

  // regels die niet overschreven zijn tonen de huidige live waarde als startpunt
  _simSeed() {
    if (!this._hass) return;
    const w = this._st('weather'), wa = (w && w.attributes) || {}, d = new Date(), L = this._live();
    const live = { time: d.getHours() + Math.round(d.getMinutes() / 15) / 4, cond: w ? w.state : 'cloudy', cover: Math.round(+wa.cloud_coverage || 0),
      wind: Math.round(+wa.wind_speed || 0), temp: +wa.temperature || 10, solar: Math.round(L.solar), load: Math.round(L.load),
      soc: Math.round(L.soc || 0), bat: Math.round(-L.dis), evp: 7400 };
    this.$$('#sim .row').forEach((row) => {
      const k = row.dataset.k, ctl = row.querySelector('input[type=range], select');
      if (ctl && this._sim[k] == null && live[k] != null) ctl.value = live[k];
    });
    this._simLabels();
  }

  _simLabels() {
    this.$$('#sim .row').forEach((row) => {
      const k = row.dataset.k, def = this._simRows.find((r) => r[0] === k), ctl = row.querySelector('input[type=range], select'), val = row.querySelector('.val');
      if (k === 'cond') val.textContent = WEATHER_NL[ctl.value] || ctl.value;
      else if (k === 'ev') val.textContent = this._sim.ev ? 'aan' : 'live';
      else val.textContent = def[5](+ctl.value);
    });
  }

  _observe() {
    if (this._ro) this._ro.disconnect();
    this._ro = new ResizeObserver(() => {
      this._layout();
      if (this._pop && this._pop.draw) this._pop.draw();
      if (this._ov && this._ov.draw) this._ov.draw();
    });
    ['#root', '#chart', '#ov-body'].forEach((s) => this._ro.observe(this.$(s)));
  }

  // schaal en positie van de scène; lucht, labels en lijnen sluiten daarop aan
  _layout() {
    const svg = this._svg, root = this.$('#root');
    if (!svg) return;
    const r = svg.getBoundingClientRect(), rr = root.getBoundingClientRect();
    if (!r.width || !r.height) return;
    const vbW = Math.round(clamp((r.width / r.height) * VB.h, 1300, 1600)), vx = 800 - vbW / 2;
    if (vbW !== this._vbW) { this._vbW = vbW; svg.setAttribute('viewBox', `${vx} ${VB.y} ${vbW} ${VB.h}`); }
    const s = Math.min(r.width / vbW, r.height / VB.h);
    const ox = (r.width - vbW * s) / 2, oy = r.height - VB.h * s;
    const P = ([x, y]) => [ox + (x - vx) * s, oy + (y - VB.y) * s];
    root.style.setProperty('--horizon', `${Math.round(r.top - rr.top + P([0, GROUND])[1])}px`);

    const compact = s < 0.62 || rr.width < 700;
    root.classList.toggle('compact', compact);
    if (compact) return;
    const k = clamp(s, 0.72, 1.3);
    Object.entries(TAGS).forEach(([key, q]) => {
      const el = this.$(`#labels [data-tag="${key}"]`); if (!el) return;
      const [tx, ty] = P(q), left = q[2] === 'l';   // 'l': label staat links van het punt, op halve hoogte
      el.style.transformOrigin = left ? '100% 50%' : '50% 100%';
      el.style.transform = `translate(${tx.toFixed(1)}px,${ty.toFixed(1)}px) translate(${left ? '-100%,-50%' : '-50%,-100%'}) scale(${k.toFixed(3)})`;
    });
  }

  _shift() {
    const st = this.$('#stage'); if (!st) return;
    st.style.transform = `translate(${Math.round(rand() * 6 - 3)}px, ${Math.round(rand() * 6 - 3)}px)`;
  }

  /* ----- interactie ----- */
  _onClick(e) {
    const path = e.composedPath();
    const pop = path.find((n) => n.dataset && n.dataset.pop);
    if (pop) {
      if (pop.dataset.pop === 'heatpump') { this._openHeatpump(); return; }
      pop.dataset.pop === 'overview' ? this._openOverview() : this._openPopup(pop.dataset.pop);
      return;
    }
    if (path.find((n) => n.id === 'weather')) {
      const id = this._ent('weather');
      if (id) this.dispatchEvent(new CustomEvent('hass-more-info', { detail: { entityId: id }, bubbles: true, composed: true }));
      return;
    }
    const a = this._cfg.tap_action || (this._cfg.screensaver ? { action: 'navigate', navigation_path: '/lovelace/0' } : null);
    if (a && a.action === 'navigate' && a.navigation_path) {
      history.pushState(null, '', a.navigation_path);
      window.dispatchEvent(new CustomEvent('location-changed', { detail: { replace: false } }));
    }
  }

  _clock() {
    if (!this._built) return;
    const d = new Date();
    this.$('#time').textContent = d.toLocaleTimeString(NL, { hour: '2-digit', minute: '2-digit' });
    this.$('#date').textContent = `${cap(DAYS[d.getDay()])} ${d.getDate()} ${MONTHS[d.getMonth()]}`;
  }

  /* ----- live data ----- */
  _update() {
    if (!this._built || !this._hass) return;
    if (this._cfg && this._cfg.screensaver) this._hideSidebarAndHeader();
    const L = this._live();
    const pill = (k, text, color) => this.$$(`[data-f="${k}-pill"]`).forEach((el) => { el.textContent = text || ''; el.style.setProperty('--pc', color); });
    const setP = (k, w) => { const p = fmtPower(w); this._setF(`${k}-v`, p.v); this._setF(`${k}-u`, p.u); };

    setP('solar', L.solar);
    pill('solar', L.solar > 25 ? 'Actief' : '', C.solar);
    this._setF('solar-s', `Vandaag ${fmtKwh(this._num('solar_today'))}`);

    setP('grid', L.grid);
    const gImp = L.grid > 25, gExp = L.grid < -25;
    pill('grid', gImp ? 'Afname' : gExp ? 'Teruglevering' : 'Stand-by', gImp ? C.import : gExp ? C.export : C.idle);
    this.$$('[data-card="grid"]').forEach((el) => el.style.setProperty('--c', gExp ? C.export : C.import));
    this._setF('grid-s', `↓ ${fmtKwh(this._num('grid_import_today'))}  ↑ ${fmtKwh(this._num('grid_export_today'))}`);

    setP('battery', L.dis);
    const bOut = L.dis > 25, bIn = L.dis < -25;
    pill('battery', bOut ? 'Ontladen' : bIn ? 'Laden' : 'Stand-by', bOut || bIn ? C.battery : C.idle);
    const lit = Math.round((L.soc || 0) / 10);
    this.$$('.socbar').forEach((b) => b.querySelectorAll('i').forEach((s, i) => s.classList.toggle('on', i < lit)));
    this._setF('battery-s', `${fmtPct(L.soc)} · ↓ ${fmtKwh(this._num('battery_charge_today'))}  ↑ ${fmtKwh(this._num('battery_discharge_today'))}`);

    // vermogen direct bij het apparaat in de scène
    const ts = fmtPower(L.solar);
    this._setF('solar-tag', `${ts.v} ${ts.u}`); this._setF('solar-tagl', L.solar > 25 ? 'opwek' : 'geen opwek');
    const st = this.$('[data-tag="solar"]'); if (st) st.style.setProperty('--tc', L.solar > 25 ? C.solar : 'var(--text)');
    const tg = fmtPower(L.grid), tb = fmtPower(L.dis);
    this._setF('grid-tag', `${tg.v} ${tg.u}`); this._setF('grid-tagl', gImp ? 'afname' : gExp ? 'teruglevering' : 'stand-by');
    this._setF('battery-tag', `${tb.v} ${tb.u}`); this._setF('battery-tagl', bOut ? 'ontladen' : bIn ? 'laden' : 'stand-by');
    const gt = this.$('[data-tag="grid"]'), bt = this.$('[data-tag="battery"]');
    if (gt) gt.style.setProperty('--tc', gImp ? C.import : gExp ? C.export : 'var(--text)');
    if (bt) bt.style.setProperty('--tc', bOut || bIn ? C.battery : 'var(--text)');

    setP('home', L.load);
    this._setF('home-s', `Vandaag ${fmtKwh(this._num('home_today'))}`);

    if (this._ent('grid_price')) {
      const price = this._num('grid_price');
      this._setF('price-v', price == null ? '–' : num(price, 2)); this._setF('price-u', '€/kWh');
      const fc = this._prices(), lvl = this._level(this._curPrice(fc), fc);
      this.$$('[data-f="price-pill"]').forEach((pp) => { pp.textContent = lvl.label; pp.style.setProperty('--pc', lvl.color); });
      const nowT = Date.now(), fut = fc.filter((x) => x.t + 3600e3 > nowT && x.t < nowT + 24 * 3600e3);
      const low = fut.reduce((m, x) => (!m || x.v < m.v ? x : m), null);
      this._setF('price-s', low ? `Laagst ${fmtHM(low.t)} · ${fmtEur(low.v)}` : '');
    }

    // laadpaal
    const evChg = L.ev > 25;
    if (this._evShown !== L.evOn) {
      this._evShown = L.evOn;
      this.$('#ev').style.display = L.evOn ? '' : 'none';
      this.$$('[data-card="ev"]').forEach((el) => { el.style.display = L.evOn ? '' : 'none'; });
      this.$$('.flow-ev').forEach((el) => { el.style.display = L.evOn ? '' : 'none'; });
      requestAnimationFrame(() => this._layout());
    }
    setP('ev', L.ev);
    pill('ev', evChg ? 'Laden' : 'Verbonden', evChg ? C.ev : C.idle);
    this._setF('ev-s', evChg ? 'Auto wordt geladen' : 'Auto aangesloten');
    const evLed = this.$('#ev-led');
    evLed.setAttribute('fill', evChg ? C.ev : '#4A5263'); evLed.classList.toggle('pulse', evChg);

    this._setFlow('grid', L.grid, L.grid > 0, L.grid > 0 ? C.import : C.export);
    this._setFlow('battery', L.dis, L.dis < 0, C.battery);
    this._setFlow('solar', L.solar, true, C.solar);
    this._setFlow('ev', L.evOn ? L.ev : 0, true, C.ev);   // huis -> laadpaal
    this._setFlow('ev2', L.evOn ? L.ev : 0, true, C.ev);  // laadpaal -> kabel -> auto
    // batterij: ledbalk kleurt rood (bijna leeg), oranje, groen (vol)
    const sc = socColor(L.soc);
    this.$('#root').style.setProperty('--soc-c', sc);
    const segOn = Math.ceil(clamp(L.soc || 0, 0, 100) / 20);
    this.$$('#soc-seg rect').forEach((r, k) => r.setAttribute('fill', k < segOn ? sc : 'rgba(255,255,255,.1)'));
    const led = this.$('#bat-led');
    led.setAttribute('fill', bOut || bIn ? sc : '#4A5263');
    led.classList.toggle('pulse', bOut || bIn);
    this.$('#panels').style.filter = L.solar > 50 ? `brightness(${(1 + clamp(L.solar / 8000, 0, 0.5)).toFixed(2)})` : '';

    if (!this._sceneDone) { this._sceneDone = true; this._scene(); requestAnimationFrame(() => this._layout()); }
    this._windows();
    if (this._pop) this._popupLive();
    const hpm = this.$('#hpm');
    if (hpm && hpm.style.display === 'flex' && this._hass) {
      const iframe = this.$('#hp-iframe');
      if (iframe && iframe.contentWindow) {
        iframe.contentWindow.postMessage({ type: 'hass-update', hass: { states: this._hass.states } }, '*');
      }
    }
  }

  _setFlow(k, watts, forward, color) {
    const f = this._flows[k]; if (!f) return;
    const a = Math.abs(watts), on = a >= 25;
    f.path.style.opacity = on ? '.5' : '0';
    f.path.style.stroke = color;
    f.dots.setAttribute('fill', color);
    if (!on || this._reduced) { f.dots.innerHTML = ''; this._flowKey[k] = null; return; }
    // snelheid in eenheden per seconde: rustig bij weinig vermogen (onder ~800 W langzaam), vlot maar vloeiend bij veel
    const speed = 9 + 61 * Math.sqrt(clamp(a / 10000, 0, 1));
    const cur = this._flowKey[k];
    if (cur && cur.fwd === forward && Math.abs(speed / cur.speed - 1) < 0.18) return;
    // fase van de stippen behouden bij een snelheidswissel, zodat ze niet terugspringen
    const T = this._svg.getCurrentTime ? this._svg.getCurrentTime() : 0;
    let len = f.len;
    try { len = f.path.getTotalLength() || f.len; } catch (e) { /* element nog niet zichtbaar */ }
    const dur = len / speed, n = Math.max(2, Math.round(len / 70));
    let p0 = 0;
    if (cur && cur.fwd === forward) p0 = (((cur.p0 + (T - cur.t0) / cur.dur) % 1) + 1) % 1;
    this._flowKey[k] = { fwd: forward, speed, dur, t0: T, p0 };
    f.dots.innerHTML = Array.from({ length: n }, (_, i) => {
      const ph = (p0 + i / n) % 1;
      return `<circle r="3.4"><animateMotion dur="${dur.toFixed(2)}s" begin="${(T - ph * dur).toFixed(3)}s" repeatCount="indefinite" calcMode="linear" keyTimes="0;1" keyPoints="${forward ? '0;1' : '1;0'}"><mpath href="#fp-${k}" xlink:href="#fp-${k}"/></animateMotion></circle>`;
    }).join('');
  }

  /* ----- prijzen ----- */
  _prices() {
    const s = this._st('grid_price'); if (!s) return [];
    const a = s.attributes || {};
    let arr = a.forecast || a.prices || a.data || [];
    if (a.raw_today) arr = [...a.raw_today, ...(a.raw_tomorrow || [])];
    return arr.map((x) => {
      let v = x.electricity_price ?? x.price ?? x.value ?? x.total;
      if (v == null) return null;
      v = +v; if (Math.abs(v) > 50) v /= 1e7; // Zonneplan levert prijzen x 10^7
      const t = toMs(x.datetime || x.start || x.from || x.startsAt);
      return isFinite(t) ? { t, v, g: x.tariff_group } : null;
    }).filter(Boolean).sort((a, b) => a.t - b.t);
  }
  _curPrice(fc) { const now = Date.now(); return fc.find((x) => x.t <= now && x.t + 3600e3 > now) || null; }
  _level(x, list) {
    const map = { low: ['Laag', C.low], normal: ['Normaal', C.normal], high: ['Hoog', C.high] };
    if (x && x.g && map[x.g]) return { label: map[x.g][0], color: map[x.g][1] };
    if (!x || !list.length) return { label: '', color: C.normal };
    const vs = list.map((y) => y.v).sort((a, b) => a - b), q1 = vs[Math.floor(vs.length / 3)], q2 = vs[Math.floor((vs.length * 2) / 3)];
    return x.v <= q1 ? { label: 'Laag', color: C.low } : x.v >= q2 ? { label: 'Hoog', color: C.high } : { label: 'Normaal', color: C.normal };
  }

  // Ramen volgen de verlichting. Config window_lights:
  //   [ids]                    alle ramen branden zodra minstens één lamp aan is, anders zijn ze donker (ook 's avonds)
  //   { sleutel: [ids], ... }  per raam (zie groundWin), bv. { living: [...] }; helderheid van de dimmer bepaalt de gloed
  _windows() {
    const lw = this._cfg.window_lights; if (!lw) return;
    const level = (ids) => {
      let b = 0;
      [].concat(ids).forEach((id) => {
        const s = this._hass && this._hass.states[id];
        if (!s || s.state !== 'on') return;
        const br = s.attributes && s.attributes.brightness;
        b = Math.max(b, br != null ? clamp(br / 255, 0.2, 1) : 1);
      });
      return b;
    };
    const ids = Array.isArray(lw) ? lw : lw.huis;
    if (ids) {
      const b = level(ids);
      const fill = b > 0 ? mix('#5A4630', '#F3C67E', 0.45 + 0.55 * b) : 'var(--glass)';
      this.$$('.glass').forEach((g) => g.setAttribute('fill', fill));
      return;
    }
    Object.keys(lw).forEach((key) => {
      const b = level(lw[key]);
      this.$$(`[data-wg="${key}"]`).forEach((g) => g.setAttribute('opacity', (b * 0.97).toFixed(2)));
    });
  }
  /* ----- lucht, licht en weer ----- */
  _scene() {
    if (!this._hass) return;
    const sun = this._hass.states[this._ent('sun') || 'sun.sun'];
    const S = this._sim || {};
    const w = this._st('weather');
    const cond = S.cond != null ? S.cond : w ? w.state : 'cloudy';
    const wa = (w && w.attributes) || {};
    const hourSun = (hr) => [Math.sin(((hr - 7) / 11) * Math.PI) * 35, 90 + ((hr - 7) / 11) * 180];
    let elev, az;
    if (S.time != null) [elev, az] = hourSun(S.time);
    else if (this._cfg.time_override != null && this._cfg.time_override !== '') [elev, az] = hourSun(+this._cfg.time_override);
    else if (sun && sun.attributes.elevation != null) { elev = +sun.attributes.elevation; az = +sun.attributes.azimuth; }
    else { const d = new Date(); [elev, az] = hourSun(d.getHours() + d.getMinutes() / 60); }

    const coverDef = { sunny: 5, 'clear-night': 5, partlycloudy: 45, windy: 30, 'windy-variant': 50, cloudy: 90, fog: 80, rainy: 100, pouring: 100, lightning: 95, 'lightning-rainy': 100, snowy: 95, 'snowy-rainy': 100, hail: 100, exceptional: 70 };
    const coverPct = S.cover != null ? S.cover : S.cond == null && wa.cloud_coverage != null ? +wa.cloud_coverage : coverDef[cond] ?? 40;
    const cover = clamp(coverPct / 100, 0, 1);
    const windKmh = S.wind != null ? S.wind : +wa.wind_speed || 0;
    const temp = S.temp != null ? S.temp : wa.temperature;
    const rainy = ['rainy', 'pouring', 'lightning-rainy', 'hail', 'snowy-rainy'].includes(cond);
    const snowy = ['snowy', 'snowy-rainy'].includes(cond);
    const storm = ['lightning', 'lightning-rainy'].includes(cond);
    const windy = ['windy', 'windy-variant'].includes(cond) || windKmh > 35;

    const nt = SKY.night, tw = SKY.twilight, dy = SKY.day;
    let top, bot;
    if (elev < 0) { const k = clamp((elev + 10) / 10, 0, 1); top = mixRGB(hex(nt[0]), hex(tw[0]), k); bot = mixRGB(hex(nt[1]), hex(tw[1]), k); }
    else { const k = clamp(elev / 15, 0, 1); top = mixRGB(hex(tw[0]), hex(dy[0]), k); bot = mixRGB(hex(tw[1]), hex(dy[1]), k); }
    const desat = (a, t) => { const l = a[0] * 0.3 + a[1] * 0.59 + a[2] * 0.11; return a.map((v) => Math.round((v + (l - v) * t) * (1 - 0.28 * t))); };
    top = desat(top, cover * 0.75); bot = desat(bot, cover * 0.75);
    this.$('#sky').style.background = `linear-gradient(180deg, ${rgb(top)} 0%, ${rgb(bot)} 100%)`;

    const day = clamp((elev + 4) / 16, 0, 1) * (1 - 0.3 * cover);
    const root = this.$('#root');
    for (const [k, [n, d]] of Object.entries(PAL)) root.style.setProperty(`--${k}`, mix(n, d, day));
    const lit = elev < 3;
    const lw = this._cfg.window_lights, allLinked = Array.isArray(lw) || (lw && lw.huis);
    const linked = (lw && !Array.isArray(lw)) ? lw : {};
    this.$$('.glass').forEach((g) => g.setAttribute('fill', allLinked || (g.dataset.win && linked[g.dataset.win]) ? 'var(--glass)' : lit ? '#EFC27A' : 'var(--glass)'));
    this._windows();

    const up = elev > -2;
    const x = clamp(800 + ((az - 180) / 90) * 560, 120, 1480), y = clamp(GROUND - 40 - elev * 8, 60, GROUND - 30);
    this.$('#orb').setAttribute('transform', up ? `translate(${x.toFixed(0)} ${y.toFixed(0)})` : 'translate(1230 120)');
    const vis = 1 - cover * 0.85;
    this.$('#sun').setAttribute('opacity', up ? vis.toFixed(2) : '0');
    this.$('#sun-halo').setAttribute('opacity', up ? (vis * clamp(elev / 10, 0.3, 1)).toFixed(2) : '0');
    this.$('#moon').setAttribute('opacity', up ? '0' : (1 - cover * 0.8).toFixed(2));
    this.$('#stars').setAttribute('opacity', (clamp(-elev / 10, 0, 1) * (1 - cover)).toFixed(2));

    const nClouds = Math.round(cover * 8);
    this.$$('.cloud').forEach((c) => c.setAttribute('opacity', +c.dataset.i < nClouds ? '1' : '0'));
    const cl = this.$('#clouds');
    cl.setAttribute('fill', rainy || snowy ? mix('#141925', '#8D96A4', day) : 'var(--cloud)');
    cl.setAttribute('opacity', (0.45 + 0.4 * cover).toFixed(2));

    // wind: regen helt mee, bomen bewegen, wolken drijven sneller
    const wind = clamp(windKmh / 60, 0, 1);
    const sc = this.$('#scene');
    sc.style.setProperty('--skew', `${(-6 - wind * 16).toFixed(1)}deg`);
    sc.style.setProperty('--drift', `${(-40 - wind * 160).toFixed(0)}px`);
    sc.style.setProperty('--sway', `${(0.3 + wind * 3.2).toFixed(2)}deg`);
    sc.style.setProperty('--sway-dur', `${(7 - wind * 4.8).toFixed(2)}s`);
    cl.classList.toggle('windy', windy && !storm);
    cl.classList.toggle('storm', storm);
    // neerslag
    const heavy = ['pouring', 'lightning-rainy'].includes(cond);
    const rain = this.$('#rain');
    rain.classList.toggle('pour', heavy);
    rain.classList.toggle('light', ['rainy', 'snowy-rainy', 'hail'].includes(cond));
    rain.setAttribute('opacity', rainy ? (heavy ? '.6' : '.4') : '0');
    this.$('#hail').setAttribute('opacity', cond === 'hail' ? '.9' : '0');
    this.$('#snow').setAttribute('opacity', snowy ? '.85' : '0');
    // sneeuw blijft liggen op dak en gras
    this.$('#snow-roof').setAttribute('opacity', cond === 'snowy' ? '.82' : cond === 'snowy-rainy' ? '.35' : '0');
    this.$('#snow-lawn').setAttribute('opacity', cond === 'snowy' ? '.72' : cond === 'snowy-rainy' ? '.25' : '0');
    this.$('#fog').setAttribute('opacity', cond === 'fog' ? '1' : cond === 'exceptional' ? '.4' : '0');
    // onweer: bliksemflits en schicht
    this.$('#flash').classList.toggle('on', storm && !this._reduced);
    this.$('#bolt').classList.toggle('on', storm && !this._reduced);
    // zon: stralen bij helder weer
    this.$('#rays').setAttribute('opacity', up && ['sunny', 'partlycloudy', 'windy'].includes(cond) ? (vis * clamp(elev / 12, 0, 1)).toFixed(2) : '0');

    if (w || S.cond != null) {
      this.$('#w-temp').textContent = temp != null ? `${num(+temp, 1)}°` : '–';
      const sub = [WEATHER_NL[cond] || cond];
      if (windKmh != null) sub.push(`${num(+windKmh, 0)} km/u`);
      if (wa.humidity != null) sub.push(`${num(+wa.humidity, 0)}%`);
      this.$('#w-sub').textContent = sub.join(' · ');
      const ic = ICON[(cond === 'sunny' || cond === 'partlycloudy') && !up ? (cond === 'sunny' ? 'moon' : 'cloud') : WEATHER_ICON[cond] || 'cloud'];
      if (this._wIcon !== ic) { this._wIcon = ic; this.$('#w-icon').innerHTML = ic; }
    }
  }

  /* ===================== popups per apparaat ===================== */
  _openPopup(kind) {
    const meta = {
      solar: ['Zonnepanelen', ICON.solar, C.solar], grid: ['Stroomnet', ICON.grid, C.import],
      battery: ['Thuisbatterij', ICON.battery, C.battery], home: ['Huisverbruik', ICON.home, C.home],
      price: ['Stroomprijs', ICON.price, C.normal],
    }[kind];
    if (!meta) return;
    this._closeAll();
    this._pop = { kind, range: kind === 'price' ? 'forecast' : '24h', derived: {} };
    this.$('#sh-h').textContent = meta[0];
    this.$('#sh-icon').innerHTML = meta[1];
    this.$('#sh-icon').style.setProperty('--c', meta[2]);
    const ranges = kind === 'price' ? [] : [['24h', '24 uur'], ['7d', '7 dagen'], ['30d', '30 dagen'], ['12m', '12 maanden']];
    const seg = this.$('#seg');
    seg.style.display = ranges.length ? '' : 'none';
    seg.innerHTML = ranges.map(([k, l]) => `<button data-r="${k}" aria-pressed="${k === this._pop.range}">${l}</button>`).join('');
    seg.querySelectorAll('button').forEach((b) => b.addEventListener('click', () => {
      this._pop.range = b.dataset.r;
      seg.querySelectorAll('button').forEach((x) => x.setAttribute('aria-pressed', x === b));
      this._loadChart();
    }));
    this._popupLive();
    const m = this.$('#modal'); m.classList.add('open'); m.setAttribute('aria-hidden', 'false');
    this._armPopTimer();
    this._loadChart();
    if (kind !== 'price') this._loadWeekKpi();
  }

  _closeAll() {
    ['#modal', '#ovm'].forEach((id) => { const m = this.$(id); if (m) { m.classList.remove('open'); m.setAttribute('aria-hidden', 'true'); } });
    const hpm = this.$('#hpm');
    if (hpm) { hpm.style.display = 'none'; hpm.setAttribute('aria-hidden', 'true'); }
    this._pop = null; if (this._ov) this._ov.open = false;
    clearTimeout(this._popTimer);
  }

  _armPopTimer() {
    clearTimeout(this._popTimer);
    this._popTimer = setTimeout(() => this._closeAll(), (this._cfg.popup_timeout || 120) * 1000);
  }

  _popupLive() {
    const P = this._pop; if (!P) return;
    const L = this._live(), d = P.derived;
    let status = '', live = null, kpis = [];
    const pw = (w) => { const p = fmtPower(w); return `${p.v}<small>${p.u}</small>`; };
    const kImp = this._num('grid_import_today'), kExp = this._num('grid_export_today'), kHome = this._num('home_today');
    if (P.kind === 'solar') {
      status = L.solar > 25 ? 'Produceert nu' : 'Geen opwek';
      live = pw(L.solar);
      kpis = [['Vandaag', fmtKwh(this._num('solar_today'))], ['Piek (24 uur)', d.peak != null ? `${fmtPower(d.peak).v} ${fmtPower(d.peak).u}` : '–', d.peakT ? `om ${fmtHM(d.peakT)}` : ''],
        ['Gemiddeld per dag', fmtKwh(d.avg7), 'afgelopen 7 dagen']];
    } else if (P.kind === 'grid') {
      status = L.grid > 25 ? 'Afname van het net' : L.grid < -25 ? 'Teruglevering aan het net' : 'Stand-by';
      live = pw(L.grid);
      const net = kImp != null && kExp != null ? kImp - kExp : null;
      kpis = [['Afname vandaag', fmtKwh(kImp)], ['Teruglevering vandaag', fmtKwh(kExp)], ['Netto vandaag', fmtKwh(net), net != null ? (net >= 0 ? 'afname' : 'teruglevering') : ''],
        ['Prijs nu', this._num('grid_price') != null ? fmtEur(this._num('grid_price')) : '–', 'per kWh']];
    } else if (P.kind === 'battery') {
      status = L.dis > 25 ? 'Ontladen' : L.dis < -25 ? 'Laden' : 'Stand-by';
      live = pw(L.dis);
      kpis = [['Laadniveau', fmtPct(L.soc)], ['Geladen vandaag', fmtKwh(this._num('battery_charge_today'))], ['Ontladen vandaag', fmtKwh(this._num('battery_discharge_today'))],
        ['Gemiddeld per dag', fmtKwh(d.avg7), 'geladen, afgelopen 7 dagen']];
    } else if (P.kind === 'home') {
      status = 'Actueel verbruik';
      live = pw(L.load);
      kpis = [['Vandaag', fmtKwh(kHome)], ['Gemiddeld vermogen', d.mean != null ? `${fmtPower(d.mean).v} ${fmtPower(d.mean).u}` : '–', 'afgelopen 24 uur'],
        ['Gemiddeld per dag', fmtKwh(d.avg7), 'afgelopen 7 dagen']];
    } else if (P.kind === 'price') {
      const fc = this._prices(), cur = this._curPrice(fc), lvl = this._level(cur, fc);
      const t0 = new Date(); t0.setHours(0, 0, 0, 0);
      const today = fc.filter((x) => x.t >= +t0 && x.t < +t0 + 86400e3);
      const mn = today.reduce((m, x) => (!m || x.v < m.v ? x : m), null), mx = today.reduce((m, x) => (!m || x.v > m.v ? x : m), null);
      const avg = today.length ? today.reduce((s, x) => s + x.v, 0) / today.length : null;
      const next = fc.filter((x) => x.t > Date.now()).reduce((m, x) => (!m || x.v < m.v ? x : m), null);
      status = lvl.label ? `Tarief ${lvl.label.toLowerCase()}` : 'Dynamisch tarief';
      live = this._num('grid_price') != null ? `${fmtEur(this._num('grid_price'), 3)}<small>/kWh</small>` : '–';
      kpis = [['Gemiddeld vandaag', fmtEur(avg, 3)], ['Laagste vandaag', mn ? fmtEur(mn.v, 3) : '–', mn ? `${fmtHM(mn.t)} – ${fmtHM(mn.t + 3600e3)}` : ''],
        ['Hoogste vandaag', mx ? fmtEur(mx.v, 3) : '–', mx ? `${fmtHM(mx.t)} – ${fmtHM(mx.t + 3600e3)}` : ''],
        ['Goedkoopst vanaf nu', next ? fmtEur(next.v, 3) : '–', next ? `${new Date(next.t).getDate() !== new Date().getDate() ? 'morgen ' : ''}${fmtHM(next.t)}` : '']];
    }
    this.$('#sh-sub').textContent = status;
    this.$('#sh-live').innerHTML = live || '';
    this.$('#kpis').innerHTML = kpis.map(([l, v, h]) => `<div class="kpi"><div class="l">${l}</div><div class="v">${v}</div>${h ? `<div class="h">${h}</div>` : ''}</div>`).join('');
  }

  /* ----- statistiek ----- */
  async _ws(msg, ttl = 120e3) {
    const key = JSON.stringify(msg);
    const c = this._cache[key];
    if (c && Date.now() - c.t < ttl) return c.d;
    const d = await this._hass.callWS(msg);
    this._cache[key] = { t: Date.now(), d };
    return d;
  }

  async _stats(ids, start, end, period, types) {
    if (!ids.length) return {};
    const msg = { type: 'recorder/statistics_during_period', start_time: new Date(start).toISOString(), period, statistic_ids: ids, types };
    if (end) msg.end_time = new Date(end).toISOString();
    return this._ws(msg);
  }

  async _statIds() {
    if (this._ids) return this._ids;
    const o = this._cfg.statistics || {};
    let prefs = null;
    try { prefs = await this._ws({ type: 'energy/get_prefs' }, 3600e3); } catch (e) { /* geen energie-config */ }
    const ids = { grid_import: [], grid_export: [], grid_import_cost: [], grid_export_compensation: [], solar: [], battery_charge: [], battery_discharge: [] };
    (prefs && prefs.energy_sources || []).forEach((s) => {
      if (s.type === 'grid') {
        (s.flow_from || []).forEach((f) => { if (f.stat_energy_from) { ids.grid_import.push(f.stat_energy_from); ids.grid_import_cost.push(f.stat_cost || `${f.stat_energy_from}_cost`); } });
        (s.flow_to || []).forEach((f) => { if (f.stat_energy_to) { ids.grid_export.push(f.stat_energy_to); ids.grid_export_compensation.push(f.stat_compensation || `${f.stat_energy_to}_compensation`); } });
      } else if (s.type === 'solar' && s.stat_energy_from) ids.solar.push(s.stat_energy_from);
      else if (s.type === 'battery') {
        if (s.stat_energy_to) ids.battery_charge.push(s.stat_energy_to);
        if (s.stat_energy_from) ids.battery_discharge.push(s.stat_energy_from);
      }
    });
    Object.keys(ids).forEach((k) => { if (o[k]) ids[k] = [].concat(o[k]); });
    this._ids = ids;
    return ids;
  }

  _rangeBounds(range) {
    const now = new Date(), s = new Date(now);
    if (range === '24h') return { start: new Date(+now - 24 * 3600e3), period: '5minute' };
    s.setHours(0, 0, 0, 0);
    if (range === '7d') { s.setDate(s.getDate() - 6); return { start: s, period: 'day', n: 7 }; }
    if (range === '30d') { s.setDate(s.getDate() - 29); return { start: s, period: 'day', n: 30 }; }
    s.setDate(1); s.setMonth(s.getMonth() - 11); return { start: s, period: 'month', n: 12 };
  }

  async _energy(range) {
    const ids = await this._statIds();
    const { start, period, n } = this._rangeBounds(range);
    const keys = ['grid_import', 'grid_export', 'solar', 'battery_charge', 'battery_discharge'];
    const all = [...new Set(keys.flatMap((k) => ids[k]))];
    const res = await this._stats(all, start, null, period, ['change']);
    const buckets = [];
    const d = new Date(start);
    for (let i = 0; i < n; i++) { buckets.push(+d); if (period === 'day') d.setDate(d.getDate() + 1); else d.setMonth(d.getMonth() + 1); }
    const idx = (t) => { for (let i = buckets.length - 1; i >= 0; i--) if (t >= buckets[i] - 3600e3) return i; return -1; };
    const e = { t: buckets, period };
    keys.forEach((k) => {
      const out = new Array(n).fill(null);
      ids[k].forEach((id) => (res[id] || []).forEach((r) => { const i = idx(toMs(r.start)); if (i >= 0 && r.change != null) out[i] = (out[i] || 0) + r.change; }));
      e[k] = out;
    });
    e.home = buckets.map((_, i) => {
      const v = [e.grid_import[i], e.solar[i], e.battery_discharge[i], e.grid_export[i], e.battery_charge[i]];
      if (v.every((x) => x == null)) return null;
      return Math.max(0, (v[0] || 0) + (v[1] || 0) + (v[2] || 0) - (v[3] || 0) - (v[4] || 0));
    });
    return e;
  }

  async _loadWeekKpi() {
    const P = this._pop;
    try {
      const e = await this._energy('7d');
      if (P !== this._pop) return;
      const key = { solar: 'solar', battery: 'battery_charge', home: 'home', grid: 'grid_import' }[P.kind];
      const vals = (e[key] || []).slice(0, -1).filter((v) => v != null);
      P.derived.avg7 = vals.length ? vals.reduce((a, b) => a + b, 0) / vals.length : null;
      this._popupLive();
    } catch (err) { /* KPI blijft leeg */ }
  }

  async _loadChart() {
    const P = this._pop; if (!P) return;
    const el = this.$('#chart'), range = P.range, kind = P.kind;
    P.draw = null;
    el.innerHTML = '<div class="msg">Gegevens laden…</div>';
    this.$('#legend').innerHTML = '';
    try {
      let cfg;
      if (kind === 'price') cfg = this._priceChart();
      else if (range === '24h') cfg = await this._powerChart(kind);
      else cfg = await this._energyChart(kind, range);
      if (P !== this._pop || range !== P.range) return;
      this.$('#legend').innerHTML = cfg.legend.map(([n, c]) => `<span style="--c:${c}"><i></i>${n}</span>`).join('');
      this.$('#foot').textContent = cfg.foot;
      P.draw = () => (cfg.type === 'bars' ? this._drawBars(el, cfg) : this._drawLines(el, cfg));
      P.draw();
    } catch (err) {
      if (P === this._pop) el.innerHTML = `<div class="msg">Geen gegevens beschikbaar${err && err.message ? ` (${err.message})` : ''}</div>`;
    }
  }

  async _powerChart(kind) {
    const { start } = this._rangeBounds('24h');
    const map = { solar: ['solar'], grid: ['grid'], battery: ['battery_power', 'battery_soc'], home: ['load'] }[kind];
    const ids = map.map((k) => this._ent(k)).filter(Boolean);
    const res = await this._stats(ids, start, null, '5minute', ['mean']);
    const series = (k, f = (v) => v) => {
      const id = this._ent(k), sc = this._scale(k);
      return (res[id] || []).filter((r) => r.mean != null).map((r) => [toMs(r.start) + 150e3, f(r.mean * sc)]);
    };
    const now = Date.now(), x0 = +start, L = this._live();
    let cfg;
    if (kind === 'solar') {
      const s = series('solar', (v) => Math.max(0, v)); s.push([now, L.solar]);
      const pk = s.reduce((m, p) => (p[1] > m[1] ? p : m), [0, 0]);
      this._pop.derived.peak = pk[1]; this._pop.derived.peakT = pk[0] || null;
      cfg = { series: [{ name: 'Opwek', color: C.solar, data: s }], legend: [['Opwek', C.solar]] };
    } else if (kind === 'grid') {
      const s = series('grid'); s.push([now, L.grid]);
      cfg = { series: [{ name: 'Net', color: C.import, neg: C.export, data: s, pos: 'Afname', negName: 'Teruglevering' }], legend: [['Afname', C.import], ['Teruglevering', C.export]] };
    } else if (kind === 'battery') {
      const s = series('battery_power', (v) => -this._discharge(v)); s.push([now, -L.dis]);
      const soc = series('battery_soc'); if (L.soc != null) soc.push([now, L.soc]);
      cfg = { series: [{ name: 'Batterij', color: C.battery, neg: C.batteryOut, data: s, pos: 'Laden', negName: 'Ontladen' },
        { name: 'Laadniveau', color: C.soc, data: soc, axis: 'y2', line: true }],
      y2: { min: 0, max: 100, fmt: (v) => `${v}%` }, legend: [['Laden', C.battery], ['Ontladen', C.batteryOut], ['Laadniveau', C.soc]] };
    } else {
      const s = series('load', (v) => Math.max(0, v)); s.push([now, L.load]);
      this._pop.derived.mean = s.length ? s.reduce((a, p) => a + p[1], 0) / s.length : null;
      cfg = { series: [{ name: 'Verbruik', color: C.home, data: s }], legend: [['Verbruik', C.home]] };
    }
    this._popupLive();
    return Object.assign(cfg, { type: 'lines', x0, x1: now, foot: 'Bron: Home Assistant-statistiek, gemiddelden per 5 minuten.' });
  }

  async _energyChart(kind, range) {
    const e = await this._energy(range);
    const lab = e.t.map((t) => {
      const d = new Date(t);
      if (e.period === 'month') return { s: MONTHS[d.getMonth()].slice(0, 3), l: `${cap(MONTHS[d.getMonth()])} ${d.getFullYear()}` };
      return { s: e.t.length <= 7 ? `${DAYS[d.getDay()].slice(0, 2)} ${d.getDate()}` : `${d.getDate()}`, l: `${cap(DAYS[d.getDay()])} ${d.getDate()} ${MONTHS[d.getMonth()]}` };
    });
    let series, legend;
    if (kind === 'solar') { series = [{ name: 'Opwek', color: C.solar, values: e.solar }]; legend = [['Opwek', C.solar]]; }
    else if (kind === 'grid') {
      series = [{ name: 'Afname', color: C.import, values: e.grid_import }, { name: 'Teruglevering', color: C.export, values: e.grid_export, neg: true }];
      legend = [['Afname', C.import], ['Teruglevering', C.export]];
    } else if (kind === 'battery') {
      series = [{ name: 'Geladen', color: C.battery, values: e.battery_charge }, { name: 'Ontladen', color: C.batteryOut, values: e.battery_discharge, neg: true }];
      legend = [['Geladen', C.battery], ['Ontladen', C.batteryOut]];
    } else { series = [{ name: 'Verbruik', color: C.home, values: e.home }]; legend = [['Verbruik', C.home]]; }
    return { type: 'bars', cats: lab, series, legend, highlight: lab.length - 1, unit: 'kWh', fmt: (v) => fmtKwh(v),
      foot: kind === 'home' ? 'Berekend uit het Energie-dashboard van Home Assistant: afname + opwek + ontladen − teruglevering − laden.' : 'Bron: Energie-dashboard van Home Assistant. De laatste staaf loopt nog.' };
  }

  _priceChart() {
    const fc = this._prices();
    const t0 = new Date(); t0.setHours(0, 0, 0, 0);
    const list = fc.filter((x) => x.t >= +t0);
    if (!list.length) throw new Error('geen prijsvoorspelling');
    const cur = this._curPrice(fc), curIdx = list.findIndex((x) => cur && x.t === cur.t);
    const avg = list.reduce((s, x) => s + x.v, 0) / list.length;
    return {
      type: 'bars', unit: '€/kWh', fmt: (v) => fmtEur(v, 3),
      cats: list.map((x) => { const d = new Date(x.t); const tomorrow = d.getDate() !== t0.getDate(); return { s: `${String(d.getHours()).padStart(2, '0')}`, l: `${tomorrow ? 'Morgen' : 'Vandaag'} ${fmtHM(x.t)} – ${fmtHM(x.t + 3600e3)}`, day: tomorrow ? 'morgen' : 'vandaag' }; }),
      series: [{ name: 'Prijs', values: list.map((x) => x.v), colors: list.map((x) => this._level(x, list).color) }],
      highlight: curIdx, dimBefore: curIdx, avg, axisFmt: (v) => num(v, 2), hourly: true,
      legend: [['Laag', C.low], ['Normaal', C.normal], ['Hoog', C.high]],
      foot: `Uurprijzen inclusief belastingen. Stippellijn: gemiddelde (${fmtEur(avg, 3)}).`,
    };
  }

  
  /* ===================== warmtepomp popup ===================== */
  _openHeatpump() {
    this._closeAll();
    const m = this.$('#hpm');
    if (!m) return;
    const iframe = this.$('#hp-iframe');
    if (iframe && !iframe.srcdoc) {
      iframe.srcdoc = WARMTEPOMP_DASHBOARD_HTML;
    }
    m.style.display = 'flex';
    m.setAttribute('aria-hidden', 'false');
    if (iframe?.contentWindow && this._hass) {
      iframe.contentWindow.postMessage({ type: 'hass-update', hass: { states: this._hass.states } }, '*');
    }
  }

  /* ===================== energieoverzicht ===================== */
  _openOverview() {
    this._closeAll();
    this._ov = this._ov || { kind: 'day', off: 0 };
    this._ov.open = true;
    const m = this.$('#ovm'); m.classList.add('open'); m.setAttribute('aria-hidden', 'false');
    this._armPopTimer();
    this._loadOverview();
  }

  _ovPeriod(kind, off) {
    const s = new Date(); s.setHours(0, 0, 0, 0);
    let e, n, label, bucket;
    if (kind === 'day') {
      s.setDate(s.getDate() + off); e = new Date(s); e.setDate(e.getDate() + 1); n = 24; bucket = 'hour';
      label = off === 0 ? 'Vandaag' : off === -1 ? 'Gisteren' : `${cap(DAYS[s.getDay()])} ${s.getDate()} ${MONTHS[s.getMonth()]}`;
    } else if (kind === 'week') {
      s.setDate(s.getDate() - ((s.getDay() + 6) % 7) + off * 7); e = new Date(s); e.setDate(e.getDate() + 7); n = 7; bucket = 'day';
      const l = new Date(e); l.setDate(l.getDate() - 1);
      const th = new Date(s); th.setDate(th.getDate() + 3); const y0 = new Date(th.getFullYear(), 0, 1);
      const wk = 1 + Math.round(((th - y0) / 864e5 - 3 + ((y0.getDay() + 6) % 7)) / 7);
      label = `Week ${wk} · ${s.getDate()} ${MONTHS[s.getMonth()].slice(0, 3)} – ${l.getDate()} ${MONTHS[l.getMonth()].slice(0, 3)}`;
    } else if (kind === 'month') {
      s.setDate(1); s.setMonth(s.getMonth() + off); e = new Date(s); e.setMonth(e.getMonth() + 1); n = Math.round((e - s) / 864e5); bucket = 'day';
      label = `${cap(MONTHS[s.getMonth()])} ${s.getFullYear()}`;
    } else {
      s.setMonth(0, 1); s.setFullYear(s.getFullYear() + off); e = new Date(s); e.setFullYear(e.getFullYear() + 1); n = 12; bucket = 'month';
      label = `${s.getFullYear()}`;
    }
    return { s, e, n, bucket, label };
  }

  _bucketStarts(p) {
    const out = [], d = new Date(p.s);
    for (let i = 0; i < p.n; i++) {
      out.push(+d);
      if (p.bucket === 'hour') d.setHours(d.getHours() + 1); else if (p.bucket === 'day') d.setDate(d.getDate() + 1); else d.setMonth(d.getMonth() + 1);
    }
    return out;
  }

  // Alle energie- en kostencijfers voor een periode, per uur berekend.
  async _overviewData(kind, off) {
    const p = this._ovPeriod(kind, off);
    const ids = await this._statIds();
    const now = Date.now();
    const end = Math.min(+p.e, now);
    const keys = ['grid_import', 'grid_export', 'grid_import_cost', 'grid_export_compensation', 'solar', 'battery_charge', 'battery_discharge'];
    const all = [...new Set(keys.flatMap((k) => ids[k]))];
    const priceId = this._ent('grid_price');
    const hours = new Map();
    const add = (res, t0) => keys.forEach((k) => ids[k].forEach((id) => (res[id] || []).forEach((r) => {
      if (r.change == null) return;
      const t = t0 != null ? t0 : toMs(r.start);
      const h = hours.get(t) || {}; h[k] = (h[k] || 0) + r.change; hours.set(t, h);
    })));
    if (end > +p.s) {
      const [res, pr] = await Promise.all([
        this._stats(all, p.s, end, 'hour', ['change']),
        priceId ? this._stats([priceId], p.s, end, 'hour', ['mean']) : Promise.resolve({}),
      ]);
      add(res);
      (pr[priceId] || []).forEach((r) => { if (r.mean == null) return; const t = toMs(r.start); const h = hours.get(t) || {}; h.price = r.mean; hours.set(t, h); });
      // lopend uur: uit de 5-minutenstatistiek
      const hs = new Date(now); hs.setMinutes(0, 0, 0);
      if (+hs >= +p.s && +hs < +p.e) {
        const r5 = await this._stats(all, +hs, null, '5minute', ['change']);
        add(r5, +hs);
        const h = hours.get(+hs); if (h && h.price == null && this._num('grid_price') != null) h.price = this._num('grid_price');
      }
    }
    // prijs per uur; ontbreekt die, dan afleiden uit de kostensensor (zelfde prijs die HA gebruikte)
    let lastP = null;
    const T = { imp: 0, exp: 0, sol: 0, chg: 0, dis: 0, home: 0, impC: 0, expC: 0, solV: 0, batV: 0, gaps: 0, g2h: 0, s2h: 0, b2h: 0, g2hV: 0, s2hV: 0, b2hV: 0, g2b: 0 };
    const starts = this._bucketStarts(p);
    const B = starts.map(() => ({ imp: 0, exp: 0, impC: 0, expC: 0, solV: 0, batV: 0, sol: 0, home: 0 }));
    const bIdx = (t) => { for (let i = starts.length - 1; i >= 0; i--) if (t >= starts[i]) return i; return -1; };
    [...hours.keys()].sort((a, b) => a - b).forEach((t) => {
      const h = hours.get(t);
      const imp = h.grid_import || 0, exp = h.grid_export || 0, sol = h.solar || 0, chg = h.battery_charge || 0, dis = h.battery_discharge || 0;
      let pr = h.price;
      if (pr == null && imp > 0.05 && h.grid_import_cost != null) pr = h.grid_import_cost / imp;
      if (pr == null && exp > 0.05 && h.grid_export_compensation != null) pr = h.grid_export_compensation / exp;
      if (pr == null) pr = lastP;
      if (pr != null) lastP = pr;
      const impC = h.grid_import_cost != null ? h.grid_import_cost : imp * (pr || 0);
      const expC = h.grid_export_compensation != null ? h.grid_export_compensation : exp * (pr || 0);
      const home = imp + sol + dis - exp - chg; // niet afkappen: dan blijft de energiebalans exact
      if (home < -0.3) T.gaps++;
      const solV = sol * (pr || 0), batV = (dis - chg) * (pr || 0);
      // waar kwam het huisverbruik van dit uur vandaan? eerst eigen zon, dan batterij, de rest van het net
      const hp = Math.max(home, 0), s2h = Math.min(hp, sol), b2h = Math.min(dis, hp - s2h), g2h = hp - s2h - b2h;
      const g2b = Math.max(0, chg - Math.max(0, sol - s2h)); // deel van het laden dat niet uit overtollige zon kwam
      const P = pr || 0;
      Object.entries({ imp, exp, sol, chg, dis, home, impC, expC, solV, batV, s2h, b2h, g2h, g2b, s2hV: s2h * P, b2hV: b2h * P, g2hV: g2h * P }).forEach(([k, v]) => (T[k] += v));
      const i = bIdx(t); if (i >= 0) { const b = B[i]; b.imp += imp; b.exp += exp; b.impC += impC; b.expC += expC; b.solV += solV; b.batV += batV; b.sol += sol; b.home += home; }
    });
    T.net = T.impC - T.expC;
    T.homeC = T.net + T.solV + T.batV; // sluit exact: netto = huis − zon − batterij
    T.pp = this._powerplay(kind, off, p);
    return { p, T, B, starts, has: hours.size > 0 };
  }

  // Zonneplan Powerplay-resultaat voor de periode (ter informatie)
  _powerplay(kind, off, p) {
    const pp = this._cfg.powerplay || {};
    const st = this._hass.states;
    const id = (k, def) => pp[k] || (st[def] ? def : null);
    const today = id('today', 'sensor.thuisbatterij_vandaag'), month = id('month', 'sensor.thuisbatterij_opbrengst_deze_maand');
    const prev = id('prev_month', 'sensor.thuisbatterij_opbrengst_vorige_maand'), year = id('year', 'sensor.thuisbatterij_opbrengst_dit_jaar');
    if (!today && !month && !year) return null;
    const days = {};
    [prev, month].forEach((m) => { const d = m && st[m] && st[m].attributes.days; if (d) Object.assign(days, d); });
    const todayKey = ymd(new Date());
    const dayVal = (key) => (key === todayKey && today ? this._numId(today) : days[key] && typeof days[key].result === 'number' ? days[key].result : null);
    if (kind === 'day') return dayVal(ymd(p.s));
    if (kind === 'week') {
      let t = 0, any = false; const d = new Date(p.s);
      for (let i = 0; i < 7; i++) { const v = dayVal(ymd(d)); if (v != null) { t += v; any = true; } d.setDate(d.getDate() + 1); }
      return any ? t : null;
    }
    if (kind === 'month') return off === 0 && month ? this._numId(month) : off === -1 && prev ? this._numId(prev) : null;
    if (kind === 'year') {
      if (off !== 0 || !year) return null;
      return this._numId(year);
    }
    return null;
  }

  async _todayChip() {
    if (!this._hass || !this._hass.callWS) return;
    try {
      const { T, has } = await this._overviewData('day', 0);
      if (!has) return;
      const tot = T.net - (T.pp || 0); // zelfde totaal als in het overzicht: na Powerplay
      this._setF('overview-v', fmtEur(Math.abs(tot)));
      this.$$('[data-f="overview-v"]').forEach((el) => { el.style.color = Math.abs(tot) < 0.005 ? '' : tot > 0 ? C.import : C.export; }); // kosten rood, winst groen
      this._setF('overview-s', `${tot >= 0 ? 'Kosten' : 'Opbrengst'} vandaag · tik voor details`);
    } catch (e) { /* chip blijft neutraal */ }
  }

  async _loadOverview() {
    const O = this._ov; if (!O) return;
    const { kind, off } = O;
    this.$$('#ov-seg button').forEach((b) => b.setAttribute('aria-pressed', b.dataset.k === kind));
    this.$('#ov-next').disabled = off >= 0;
    const p = this._ovPeriod(kind, off);
    this.$('#ov-sub').textContent = p.label;
    const body = this.$('#ov-body');
    body.innerHTML = `<div class="ov-msg">Gegevens laden…${kind === 'year' ? ' (een jaar per uur kan even duren)' : ''}</div>`;
    O.draw = null;
    let data;
    try { data = await this._overviewData(kind, off); } catch (e) { body.innerHTML = `<div class="ov-msg">Geen gegevens beschikbaar (${e.message || e})</div>`; return; }
    if (O.kind !== kind || O.off !== off || !O.open) return;
    if (!data.has) { body.innerHTML = '<div class="ov-msg">Geen gegevens voor deze periode</div>'; return; }
    const { T, B, starts } = data;

    const unit = kind === 'day' ? 'uur' : kind === 'year' ? 'maand' : 'dag';
    const own = T.s2h + T.b2h, ownV = T.s2hV + T.b2hV, tot = T.g2h + own || 1;
    const pct = (v) => `${num((v / tot) * 100, 0)}%`;
    const stored = T.chg - T.dis;
    const final = T.pp != null ? T.net - T.pp : T.net;
    const tile = (label, color, value, unitTxt, hint) => `<div class="t" style="--c:${color}"><div class="l"><i></i>${label}</div>
      <div class="v">${value}<small>${unitTxt}</small></div><div class="h">${hint}</div></div>`;
    const srcRow = (name, color, kwh, eur, hint = '', eurColor = '') => `<div class="src-row" style="--c:${color}"><i></i><span class="n">${name}${hint ? `<small>${hint}</small>` : ''}</span>
      <span class="k">${num(kwh, 1)}<small> kWh</small></span><span class="p">${pct(kwh)}</span><span class="e"${eurColor ? ` style="color:${eurColor}"` : ''}>${fmtEur(eur)}</span></div>`;
    const costRow = (name, hint, amount, cls = '', color = '') => `<div class="cost-row ${cls}"><span class="n">${name}${hint ? `<small>${hint}</small>` : ''}</span><span class="a"${color ? ` style="color:${color}"` : ''}>${amount}</span></div>`;
    const money = (v) => (Math.abs(v) < 0.005 ? 'var(--text)' : v > 0 ? C.import : C.export); // kosten rood, winst groen
    const notes = [];
    if (Math.abs(stored) > 1) notes.push(stored > 0 ? `De batterij heeft in deze periode ${fmtKwh(stored)} meer geladen dan ontladen. Die energie zit nog in de batterij en levert pas later iets op.` : `De batterij heeft ${fmtKwh(-stored)} meer ontladen dan geladen; dat kwam uit een eerdere lading.`);
    if (T.gaps > 2) notes.push(`In ${T.gaps} uur ontbreken metingen, dus de verdeling over net, zon en batterij is in die uren onzeker. De netto kosten blijven exact.`);
    if (T.pp != null) notes.push('Powerplay is Zonneplans eigen berekening van de batterijhandel. Of dit bovenop je P1-rekening wordt uitbetaald, hangt af van je contract.');

    body.innerHTML = `
      <div class="ovt">
        ${tile('Verbruik huis', C.home, num(T.home, 1), ' kWh', `Totaal ${p.label.toLowerCase()}`)}
        ${tile('Van het net', C.import, num(T.g2h, 1), ' kWh', `${pct(T.g2h)} van het verbruik · <span style="color:${C.import}">${fmtEur(T.g2hV)}</span>`)}
        ${tile('Eigen stroom', C.solar, num(own, 1), ' kWh', `${pct(own)} van het verbruik · <span style="color:${C.export}">${fmtEur(ownV)} bespaard</span>`)}
        ${tile('Netto kosten', final >= 0 ? C.import : C.export, `<span style="color:${money(final)}">${fmtEur(final).replace('€ ', '<span class="cur">€</span> ')}</span>`, '', T.pp != null ? `${final >= 0 ? 'betaald' : 'verdiend'} na Powerplay · P1-meter ${fmtEur(T.net)}` : `${final >= 0 ? 'betaald' : 'verdiend'} aan het net`)}
      </div>
      <div class="ov-col">
        <h3>Waar kwam het verbruik vandaan?</h3>
        <div class="stack">${[[T.g2h, C.import], [T.s2h, C.solar], [T.b2h, C.battery]].map(([v, c]) => (v > 0 ? `<i style="--c:${c};flex:${v}"></i>` : '')).join('')}</div>
        <div class="src-head"><span></span><span></span><span class="k">Energie</span><span class="p">Aandeel</span><span class="e">Waarde</span></div>
        ${srcRow('Van het net', C.import, T.g2h, T.g2hV, '', C.import)}
        ${srcRow('Zonnepanelen', C.solar, T.s2h, T.s2hV, `direct verbruikt van ${fmtKwh(T.sol)} opgewekt`, C.export)}
        ${srcRow('Thuisbatterij', C.battery, T.b2h, T.b2hV, `${fmtKwh(T.chg)} geladen · ${fmtKwh(T.dis)} ontladen`, C.export)}
        <div class="src-row total"><i></i><span class="n">Totaal verbruik</span><span class="k">${num(T.g2h + own, 1)}<small> kWh</small></span><span class="p">100%</span><span class="e">${fmtEur(T.g2hV + ownV)}</span></div>

      </div>
      <div class="ov-col">
        <h3>Kosten</h3>
        ${costRow('Ingekocht van het net', `${fmtKwh(T.imp)}${T.g2b > 0.5 ? ` · waarvan ${fmtKwh(T.g2b)} voor de batterij` : ''}`, fmtEur(T.impC), '', C.import)}
        ${costRow('Teruggeleverd aan het net', fmtKwh(T.exp), fmtEurS(-T.expC), '', C.export)}
        ${costRow('Netto stroomkosten', 'volgens je P1-meter', fmtEur(T.net), 'total', money(T.net))}
        ${T.pp != null ? costRow('Powerplay (Zonneplan)', 'resultaat batterijhandel', fmtEurS(-T.pp), '', T.pp >= 0 ? C.export : C.import) + costRow('Totaal na Powerplay', '', fmtEur(final), 'total', money(final)) : ''}

      </div>
      <div class="ov-col ov-wide"><h3>Netto kosten per ${unit}</h3><div class="ov-chart" id="ov-chart"></div></div>`;

    const cats = starts.map((t) => {
      const d = new Date(t);
      if (kind === 'day') return { s: String(d.getHours()).padStart(2, '0'), l: `${fmtHM(t)} – ${fmtHM(t + 3600e3)}` };
      if (kind === 'year') return { s: MONTHS[d.getMonth()].slice(0, 3), l: `${cap(MONTHS[d.getMonth()])} ${d.getFullYear()}` };
      return { s: kind === 'week' ? `${DAYS[d.getDay()].slice(0, 2)} ${d.getDate()}` : `${d.getDate()}`, l: `${cap(DAYS[d.getDay()])} ${d.getDate()} ${MONTHS[d.getMonth()]}` };
    });
    const net = B.map((b, i) => (starts[i] > Date.now() || (b.imp === 0 && b.exp === 0) ? null : b.impC - b.expC));
    const cfg = {
      type: 'bars', unit: '€', cats, axisFmt: (v) => num(v, Math.abs(v) < 10 && v % 1 ? 1 : 0), hourly: false,
      series: [{ name: 'Netto', values: net, colors: net.map((v) => (v != null && v < 0 ? C.export : C.import)) }],
      tip: (i) => {
        const b = B[i]; if (net[i] == null) return '<div class="r">Geen gegevens</div>';
        return `<div class="r" style="--c:${C.import}"><i></i>Afname ${fmtKwh(b.imp)}<span>${fmtEur(b.impC)}</span></div>
          <div class="r" style="--c:${C.export}"><i></i>Teruglevering ${fmtKwh(b.exp)}<span>${fmtEurS(-b.expC)}</span></div>
          <div class="r" style="--c:${C.solar}"><i></i>Zon (toegerekend)<span>${fmtEurS(-b.solV)}</span></div>
          <div class="r" style="--c:${C.battery}"><i></i>Batterij (toegerekend)<span>${fmtEurS(-b.batV)}</span></div>
          <div class="r sum">Netto<span>${fmtEur(net[i])}</span></div>`;
      },
    };
    O.draw = () => this._drawBars(this.$('#ov-chart'), cfg);
    O.draw();
  }

  /* ----- tekenen: lijn/vlak ----- */
  _drawLines(el, cfg) {
    const W = el.clientWidth, H = el.clientHeight; if (!W || !H) return;
    const uid = `c${++chartUid}`, hasY2 = !!cfg.y2;
    const pad = { l: 56, r: hasY2 ? 46 : 14, t: 12, b: 28 };
    const iw = W - pad.l - pad.r, ih = H - pad.t - pad.b;
    const ys = cfg.series.filter((s) => s.axis !== 'y2');
    let mn = 0, mx = 0;
    ys.forEach((s) => s.data.forEach(([, v]) => { mn = Math.min(mn, v); mx = Math.max(mx, v); }));
    if (mx - mn < 100) mx = mn + 100;
    const kw = Math.max(Math.abs(mn), Math.abs(mx)) >= 1000;
    const tk = niceTicks(mn, mx, 4);
    const X = (t) => pad.l + ((t - cfg.x0) / (cfg.x1 - cfg.x0)) * iw;
    const Y = (v) => pad.t + (1 - (v - tk.lo) / (tk.hi - tk.lo)) * ih;
    const Y2 = (v) => pad.t + (1 - (v - cfg.y2.min) / (cfg.y2.max - cfg.y2.min)) * ih;
    const fmtAx = (v) => { v = Math.abs(v); return kw ? `${num(v / 1000, Math.abs(tk.ticks[1] - tk.ticks[0]) < 1000 ? 1 : 0)} kW` : `${num(v, 0)} W`; };
    let g = '';
    tk.ticks.forEach((v) => {
      g += `<line x1="${pad.l}" x2="${W - pad.r}" y1="${Y(v)}" y2="${Y(v)}" stroke="rgba(255,255,255,${v === 0 ? 0.22 : 0.06})"/>`;
      g += `<text class="ax" x="${pad.l - 10}" y="${Y(v) + 4}" text-anchor="end">${fmtAx(v)}</text>`;
    });
    if (hasY2) [0, 50, 100].forEach((v) => (g += `<text class="ax" x="${W - pad.r + 10}" y="${Y2(v) + 4}">${cfg.y2.fmt(v)}</text>`));
    const h0 = new Date(cfg.x0); h0.setMinutes(0, 0, 0);
    for (let t = +h0 + 3600e3; t < cfg.x1; t += 3600e3) {
      const d = new Date(t); if (d.getHours() % (iw < 520 ? 6 : 3)) continue;
      g += `<line x1="${X(t)}" x2="${X(t)}" y1="${pad.t}" y2="${pad.t + ih}" stroke="rgba(255,255,255,.04)"/>`;
      g += `<text class="ax" x="${X(t)}" y="${H - 8}" text-anchor="middle">${String(d.getHours()).padStart(2, '0')}:00</text>`;
    }
    const y0 = Y(0);
    let defs = `<clipPath id="${uid}p"><rect x="0" y="0" width="${W}" height="${y0}"/></clipPath><clipPath id="${uid}n"><rect x="0" y="${y0}" width="${W}" height="${H}"/></clipPath>`;
    let body = '';
    cfg.series.forEach((s, si) => {
      if (!s.data.length) return;
      const yf = s.axis === 'y2' ? Y2 : Y;
      const line = s.data.map(([t, v], i) => `${i ? 'L' : 'M'}${X(t).toFixed(1)} ${yf(v).toFixed(1)}`).join('');
      if (s.line) { body += `<path d="${line}" fill="none" stroke="${s.color}" stroke-width="1.5" stroke-dasharray="4 3" opacity=".85"/>`; return; }
      const area = `${line}L${X(s.data[s.data.length - 1][0]).toFixed(1)} ${y0}L${X(s.data[0][0]).toFixed(1)} ${y0}Z`;
      const parts = s.neg ? [[s.color, `${uid}p`], [s.neg, `${uid}n`]] : [[s.color, null]];
      parts.forEach(([col, clip], pi) => {
        const gid = `${uid}g${si}${pi}`, upw = pi === 0;
        defs += `<linearGradient id="${gid}" x1="0" y1="${upw ? 0 : 1}" x2="0" y2="${upw ? 1 : 0}"><stop offset="0" stop-color="${col}" stop-opacity=".32"/><stop offset="1" stop-color="${col}" stop-opacity=".02"/></linearGradient>`;
        const cp = clip ? ` clip-path="url(#${clip})"` : '';
        body += `<path d="${area}" fill="url(#${gid})"${cp}/><path d="${line}" fill="none" stroke="${col}" stroke-width="1.75" stroke-linejoin="round"${cp}/>`;
      });
    });
    el.innerHTML = `<svg viewBox="0 0 ${W} ${H}"><defs>${defs}</defs>${g}${body}
      <line class="xh" x1="0" x2="0" y1="${pad.t}" y2="${pad.t + ih}" stroke="rgba(255,255,255,.35)" opacity="0"/><g class="dots"></g>
      <rect class="ov" x="${pad.l}" y="${pad.t}" width="${iw}" height="${ih}" fill="transparent"/></svg><div class="tip"></div>`;
    const tip = el.querySelector('.tip'), xh = el.querySelector('.xh'), dots = el.querySelector('.dots');
    const near = (data, t) => { let lo = 0, hi = data.length - 1; while (hi - lo > 1) { const m = (lo + hi) >> 1; if (data[m][0] < t) lo = m; else hi = m; } return Math.abs(data[lo][0] - t) < Math.abs(data[hi][0] - t) ? data[lo] : data[hi]; };
    const move = (ev) => {
      const r = el.getBoundingClientRect(), px = clamp(ev.clientX - r.left, pad.l, pad.l + iw);
      const t = cfg.x0 + ((px - pad.l) / iw) * (cfg.x1 - cfg.x0);
      let rows = '', dd = '', tt = null;
      cfg.series.forEach((s) => {
        if (!s.data.length) return;
        const pnt = near(s.data, t); tt = tt || pnt[0];
        const yf = s.axis === 'y2' ? Y2 : Y, neg = s.neg && pnt[1] < 0, col = neg ? s.neg : s.color;
        const name = s.pos ? (Math.abs(pnt[1]) < 25 ? 'Stand-by' : neg ? s.negName : s.pos) : s.name;
        const val = s.axis === 'y2' ? fmtPct(pnt[1]) : (() => { const f = fmtPower(pnt[1]); return `${f.v} ${f.u}`; })();
        rows += `<div class="r" style="--c:${col}"><i></i>${name}<span>${val}</span></div>`;
        dd += `<circle cx="${X(pnt[0])}" cy="${yf(pnt[1])}" r="3.5" fill="${col}" stroke="#0F131A" stroke-width="2"/>`;
      });
      xh.setAttribute('x1', X(tt)); xh.setAttribute('x2', X(tt)); xh.setAttribute('opacity', '1');
      dots.innerHTML = dd;
      tip.innerHTML = `<b>${fmtHM(tt)}</b>${rows}`;
      const tw = tip.offsetWidth, left = X(tt) + 14 + tw > W ? X(tt) - 14 - tw : X(tt) + 14;
      tip.style.transform = `translate(${left}px, ${pad.t + 6}px)`; tip.style.opacity = '1';
    };
    const leave = () => { tip.style.opacity = '0'; xh.setAttribute('opacity', '0'); dots.innerHTML = ''; };
    const ov = el.querySelector('.ov');
    ov.addEventListener('pointermove', move); ov.addEventListener('pointerdown', move); ov.addEventListener('pointerleave', leave);
  }

  /* ----- tekenen: staven ----- */
  _drawBars(el, cfg) {
    if (!el) return;
    const W = el.clientWidth, H = el.clientHeight; if (!W || !H) return;
    const n = cfg.cats.length;
    const pad = { l: 52, r: 10, t: 24, b: cfg.hourly ? 40 : 28 };
    const iw = W - pad.l - pad.r, ih = H - pad.t - pad.b;
    let mx = 0, mn = 0;
    for (let i = 0; i < n; i++) {
      let up = 0, dn = 0;
      cfg.series.forEach((s) => { const v = s.values[i] || 0; if (s.neg) dn -= v; else if (v >= 0) up += v; else dn += v; });
      mx = Math.max(mx, up); mn = Math.min(mn, dn);
    }
    if (mx - mn <= 0) mx = 1;
    const tk = niceTicks(mn, mx, 4);
    const Y = (v) => pad.t + (1 - (v - tk.lo) / (tk.hi - tk.lo)) * ih;
    const band = iw / n, bw = Math.min(32, band * (n > 40 ? 0.7 : 0.62));
    const axf = cfg.axisFmt || ((v) => num(Math.abs(v), Math.abs(tk.ticks[1] - tk.ticks[0]) < 1 ? 1 : 0));
    let g = '';
    tk.ticks.forEach((v) => {
      g += `<line x1="${pad.l}" x2="${W - pad.r}" y1="${Y(v)}" y2="${Y(v)}" stroke="rgba(255,255,255,${v === 0 ? 0.22 : 0.06})"/>`;
      g += `<text class="ax" x="${pad.l - 10}" y="${Y(v) + 4}" text-anchor="end">${axf(v)}</text>`;
    });
    g += `<text class="ax" x="${pad.l - 10}" y="11" text-anchor="end">${cfg.unit}</text>`;
    const every = n > 24 ? (cfg.hourly ? 3 : 5) : n > 14 ? 2 : 1;
    let body = '';
    for (let i = 0; i < n; i++) {
      const cx = pad.l + band * (i + 0.5);
      let up = 0, dn = 0;
      const dim = cfg.dimBefore != null && cfg.dimBefore >= 0 && i < cfg.dimBefore;
      cfg.series.forEach((s) => {
        const raw = s.values[i]; if (raw == null) return;
        const v = s.neg ? -raw : raw, col = s.colors ? s.colors[i] : s.color;
        const a = v >= 0 ? up : dn, b = a + v;
        if (v >= 0) up = b; else dn = b;
        const y1 = Y(Math.max(a, b)), y2 = Y(Math.min(a, b)), h = Math.max(1, y2 - y1);
        body += `<rect x="${(cx - bw / 2).toFixed(1)}" y="${y1.toFixed(1)}" width="${bw.toFixed(1)}" height="${h.toFixed(1)}" rx="${Math.min(3, bw / 4).toFixed(1)}" fill="${col}" opacity="${dim ? 0.35 : i === cfg.highlight || cfg.highlight == null ? 1 : 0.82}"/>`;
      });
      if (i % every === 0) g += `<text class="ax" x="${cx}" y="${pad.t + ih + 16}" text-anchor="middle">${cfg.cats[i].s}</text>`;
      if (cfg.hourly && (i === 0 || cfg.cats[i].day !== cfg.cats[i - 1].day)) {
        g += `<text class="ax" x="${cx - band / 2 + 2}" y="${pad.t + ih + 32}" style="font-weight:600">${cfg.cats[i].day}</text>`;
        if (i) g += `<line x1="${cx - band / 2}" x2="${cx - band / 2}" y1="${pad.t}" y2="${pad.t + ih + 22}" stroke="rgba(255,255,255,.12)"/>`;
      }
    }
    if (cfg.highlight != null && cfg.highlight >= 0 && cfg.hourly) {
      const cx = pad.l + band * (cfg.highlight + 0.5);
      body += `<text class="ax" x="${cx}" y="${pad.t - 6}" text-anchor="middle" style="fill:var(--text);font-weight:600">nu</text>`;
    }
    if (cfg.avg != null) body += `<line x1="${pad.l}" x2="${W - pad.r}" y1="${Y(cfg.avg)}" y2="${Y(cfg.avg)}" stroke="rgba(255,255,255,.45)" stroke-dasharray="4 4"/>`;
    el.innerHTML = `<svg viewBox="0 0 ${W} ${H}">${g}<rect class="hl" x="0" y="${pad.t}" width="${band}" height="${ih}" fill="rgba(255,255,255,.05)" opacity="0"/>${body}
      <rect class="ov" x="${pad.l}" y="${pad.t}" width="${iw}" height="${ih}" fill="transparent"/></svg><div class="tip"></div>`;
    const tip = el.querySelector('.tip'), hl = el.querySelector('.hl');
    const move = (ev) => {
      const r = el.getBoundingClientRect(), i = clamp(Math.floor((ev.clientX - r.left - pad.l) / band), 0, n - 1);
      hl.setAttribute('x', pad.l + band * i); hl.setAttribute('opacity', '1');
      const rows = cfg.tip ? cfg.tip(i) : cfg.series.map((s) => `<div class="r" style="--c:${s.colors ? s.colors[i] : s.color}"><i></i>${s.name}<span>${s.values[i] == null ? '–' : cfg.fmt(s.values[i])}</span></div>`).join('');
      tip.innerHTML = `<b>${cfg.cats[i].l}</b>${rows}`;
      const cx = pad.l + band * (i + 0.5), tw = tip.offsetWidth, left = cx + band / 2 + 8 + tw > W ? cx - band / 2 - 8 - tw : cx + band / 2 + 8;
      tip.style.transform = `translate(${Math.max(0, left)}px, ${pad.t + 6}px)`; tip.style.opacity = '1';
    };
    const leave = () => { tip.style.opacity = '0'; hl.setAttribute('opacity', '0'); };
    const ov = el.querySelector('.ov');
    ov.addEventListener('pointermove', move); ov.addEventListener('pointerdown', move); ov.addEventListener('pointerleave', leave);
  }
}

if (!customElements.get('claude-energy-scene')) customElements.define('claude-energy-scene', ClaudeEnergyScene);
window.customCards = window.customCards || [];
if (!window.customCards.find((c) => c.type === 'claude-energy-scene')) {
  window.customCards.push({ type: 'claude-energy-scene', name: 'Claude Energy Scene', description: 'Energie-screensaver met live scène, popups en energieoverzicht' });
}
console.info(`%c CLAUDE-ENERGY-SCENE %c ${VERSION} `, 'background:#5B9DF5;color:#fff;border-radius:3px 0 0 3px', 'background:#1A1F28;color:#fff;border-radius:0 3px 3px 0');
