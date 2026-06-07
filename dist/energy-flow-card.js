function t(t,e,i,s){var r,o=arguments.length,n=o<3?e:null===s?s=Object.getOwnPropertyDescriptor(e,i):s;if("object"==typeof Reflect&&"function"==typeof Reflect.decorate)n=Reflect.decorate(t,e,i,s);else for(var a=t.length-1;a>=0;a--)(r=t[a])&&(n=(o<3?r(n):o>3?r(e,i,n):r(e,i))||n);return o>3&&n&&Object.defineProperty(e,i,n),n}"function"==typeof SuppressedError&&SuppressedError;const e=globalThis,i=e.ShadowRoot&&(void 0===e.ShadyCSS||e.ShadyCSS.nativeShadow)&&"adoptedStyleSheets"in Document.prototype&&"replace"in CSSStyleSheet.prototype,s=Symbol(),r=new WeakMap;let o=class{constructor(t,e,i){if(this._$cssResult$=!0,i!==s)throw Error("CSSResult is not constructable. Use `unsafeCSS` or `css` instead.");this.cssText=t,this.t=e}get styleSheet(){let t=this.o;const e=this.t;if(i&&void 0===t){const i=void 0!==e&&1===e.length;i&&(t=r.get(e)),void 0===t&&((this.o=t=new CSSStyleSheet).replaceSync(this.cssText),i&&r.set(e,t))}return t}toString(){return this.cssText}};const n=i?t=>t:t=>t instanceof CSSStyleSheet?(t=>{let e="";for(const i of t.cssRules)e+=i.cssText;return(t=>new o("string"==typeof t?t:t+"",void 0,s))(e)})(t):t,{is:a,defineProperty:l,getOwnPropertyDescriptor:h,getOwnPropertyNames:c,getOwnPropertySymbols:d,getPrototypeOf:f}=Object,y=globalThis,p=y.trustedTypes,u=p?p.emptyScript:"",g=y.reactiveElementPolyfillSupport,x=(t,e)=>t,k={toAttribute(t,e){switch(e){case Boolean:t=t?u:null;break;case Object:case Array:t=null==t?t:JSON.stringify(t)}return t},fromAttribute(t,e){let i=t;switch(e){case Boolean:i=null!==t;break;case Number:i=null===t?null:Number(t);break;case Object:case Array:try{i=JSON.parse(t)}catch(t){i=null}}return i}},$=(t,e)=>!a(t,e),w={attribute:!0,type:String,converter:k,reflect:!1,useDefault:!1,hasChanged:$};Symbol.metadata??=Symbol("metadata"),y.litPropertyMetadata??=new WeakMap;let b=class extends HTMLElement{static addInitializer(t){this._$Ei(),(this.l??=[]).push(t)}static get observedAttributes(){return this.finalize(),this._$Eh&&[...this._$Eh.keys()]}static createProperty(t,e=w){if(e.state&&(e.attribute=!1),this._$Ei(),this.prototype.hasOwnProperty(t)&&((e=Object.create(e)).wrapped=!0),this.elementProperties.set(t,e),!e.noAccessor){const i=Symbol(),s=this.getPropertyDescriptor(t,i,e);void 0!==s&&l(this.prototype,t,s)}}static getPropertyDescriptor(t,e,i){const{get:s,set:r}=h(this.prototype,t)??{get(){return this[e]},set(t){this[e]=t}};return{get:s,set(e){const o=s?.call(this);r?.call(this,e),this.requestUpdate(t,o,i)},configurable:!0,enumerable:!0}}static getPropertyOptions(t){return this.elementProperties.get(t)??w}static _$Ei(){if(this.hasOwnProperty(x("elementProperties")))return;const t=f(this);t.finalize(),void 0!==t.l&&(this.l=[...t.l]),this.elementProperties=new Map(t.elementProperties)}static finalize(){if(this.hasOwnProperty(x("finalized")))return;if(this.finalized=!0,this._$Ei(),this.hasOwnProperty(x("properties"))){const t=this.properties,e=[...c(t),...d(t)];for(const i of e)this.createProperty(i,t[i])}const t=this[Symbol.metadata];if(null!==t){const e=litPropertyMetadata.get(t);if(void 0!==e)for(const[t,i]of e)this.elementProperties.set(t,i)}this._$Eh=new Map;for(const[t,e]of this.elementProperties){const i=this._$Eu(t,e);void 0!==i&&this._$Eh.set(i,t)}this.elementStyles=this.finalizeStyles(this.styles)}static finalizeStyles(t){const e=[];if(Array.isArray(t)){const i=new Set(t.flat(1/0).reverse());for(const t of i)e.unshift(n(t))}else void 0!==t&&e.push(n(t));return e}static _$Eu(t,e){const i=e.attribute;return!1===i?void 0:"string"==typeof i?i:"string"==typeof t?t.toLowerCase():void 0}constructor(){super(),this._$Ep=void 0,this.isUpdatePending=!1,this.hasUpdated=!1,this._$Em=null,this._$Ev()}_$Ev(){this._$ES=new Promise(t=>this.enableUpdating=t),this._$AL=new Map,this._$E_(),this.requestUpdate(),this.constructor.l?.forEach(t=>t(this))}addController(t){(this._$EO??=new Set).add(t),void 0!==this.renderRoot&&this.isConnected&&t.hostConnected?.()}removeController(t){this._$EO?.delete(t)}_$E_(){const t=new Map,e=this.constructor.elementProperties;for(const i of e.keys())this.hasOwnProperty(i)&&(t.set(i,this[i]),delete this[i]);t.size>0&&(this._$Ep=t)}createRenderRoot(){const t=this.shadowRoot??this.attachShadow(this.constructor.shadowRootOptions);return((t,s)=>{if(i)t.adoptedStyleSheets=s.map(t=>t instanceof CSSStyleSheet?t:t.styleSheet);else for(const i of s){const s=document.createElement("style"),r=e.litNonce;void 0!==r&&s.setAttribute("nonce",r),s.textContent=i.cssText,t.appendChild(s)}})(t,this.constructor.elementStyles),t}connectedCallback(){this.renderRoot??=this.createRenderRoot(),this.enableUpdating(!0),this._$EO?.forEach(t=>t.hostConnected?.())}enableUpdating(t){}disconnectedCallback(){this._$EO?.forEach(t=>t.hostDisconnected?.())}attributeChangedCallback(t,e,i){this._$AK(t,i)}_$ET(t,e){const i=this.constructor.elementProperties.get(t),s=this.constructor._$Eu(t,i);if(void 0!==s&&!0===i.reflect){const r=(void 0!==i.converter?.toAttribute?i.converter:k).toAttribute(e,i.type);this._$Em=t,null==r?this.removeAttribute(s):this.setAttribute(s,r),this._$Em=null}}_$AK(t,e){const i=this.constructor,s=i._$Eh.get(t);if(void 0!==s&&this._$Em!==s){const t=i.getPropertyOptions(s),r="function"==typeof t.converter?{fromAttribute:t.converter}:void 0!==t.converter?.fromAttribute?t.converter:k;this._$Em=s;const o=r.fromAttribute(e,t.type);this[s]=o??this._$Ej?.get(s)??o,this._$Em=null}}requestUpdate(t,e,i,s=!1,r){if(void 0!==t){const o=this.constructor;if(!1===s&&(r=this[t]),i??=o.getPropertyOptions(t),!((i.hasChanged??$)(r,e)||i.useDefault&&i.reflect&&r===this._$Ej?.get(t)&&!this.hasAttribute(o._$Eu(t,i))))return;this.C(t,e,i)}!1===this.isUpdatePending&&(this._$ES=this._$EP())}C(t,e,{useDefault:i,reflect:s,wrapped:r},o){i&&!(this._$Ej??=new Map).has(t)&&(this._$Ej.set(t,o??e??this[t]),!0!==r||void 0!==o)||(this._$AL.has(t)||(this.hasUpdated||i||(e=void 0),this._$AL.set(t,e)),!0===s&&this._$Em!==t&&(this._$Eq??=new Set).add(t))}async _$EP(){this.isUpdatePending=!0;try{await this._$ES}catch(t){Promise.reject(t)}const t=this.scheduleUpdate();return null!=t&&await t,!this.isUpdatePending}scheduleUpdate(){return this.performUpdate()}performUpdate(){if(!this.isUpdatePending)return;if(!this.hasUpdated){if(this.renderRoot??=this.createRenderRoot(),this._$Ep){for(const[t,e]of this._$Ep)this[t]=e;this._$Ep=void 0}const t=this.constructor.elementProperties;if(t.size>0)for(const[e,i]of t){const{wrapped:t}=i,s=this[e];!0!==t||this._$AL.has(e)||void 0===s||this.C(e,void 0,i,s)}}let t=!1;const e=this._$AL;try{t=this.shouldUpdate(e),t?(this.willUpdate(e),this._$EO?.forEach(t=>t.hostUpdate?.()),this.update(e)):this._$EM()}catch(e){throw t=!1,this._$EM(),e}t&&this._$AE(e)}willUpdate(t){}_$AE(t){this._$EO?.forEach(t=>t.hostUpdated?.()),this.hasUpdated||(this.hasUpdated=!0,this.firstUpdated(t)),this.updated(t)}_$EM(){this._$AL=new Map,this.isUpdatePending=!1}get updateComplete(){return this.getUpdateComplete()}getUpdateComplete(){return this._$ES}shouldUpdate(t){return!0}update(t){this._$Eq&&=this._$Eq.forEach(t=>this._$ET(t,this[t])),this._$EM()}updated(t){}firstUpdated(t){}};b.elementStyles=[],b.shadowRootOptions={mode:"open"},b[x("elementProperties")]=new Map,b[x("finalized")]=new Map,g?.({ReactiveElement:b}),(y.reactiveElementVersions??=[]).push("2.1.2");const m=globalThis,v=t=>t,_=m.trustedTypes,A=_?_.createPolicy("lit-html",{createHTML:t=>t}):void 0,S="$lit$",E=`lit$${Math.random().toFixed(9).slice(2)}$`,C="?"+E,M=`<${C}>`,P=document,L=()=>P.createComment(""),T=t=>null===t||"object"!=typeof t&&"function"!=typeof t,O=Array.isArray,H="[ \t\n\f\r]",N=/<(?:(!--|\/[^a-zA-Z])|(\/?[a-zA-Z][^>\s]*)|(\/?$))/g,U=/-->/g,R=/>/g,z=RegExp(`>|${H}(?:([^\\s"'>=/]+)(${H}*=${H}*(?:[^ \t\n\f\r"'\`<>=]|("|')|))|$)`,"g"),D=/'/g,W=/"/g,G=/^(?:script|style|textarea|title)$/i,I=t=>(e,...i)=>({_$litType$:t,strings:e,values:i}),V=I(1),j=I(2),B=Symbol.for("lit-noChange"),F=Symbol.for("lit-nothing"),X=new WeakMap,Z=P.createTreeWalker(P,129);function q(t,e){if(!O(t)||!t.hasOwnProperty("raw"))throw Error("invalid template strings array");return void 0!==A?A.createHTML(e):e}const J=(t,e)=>{const i=t.length-1,s=[];let r,o=2===e?"<svg>":3===e?"<math>":"",n=N;for(let e=0;e<i;e++){const i=t[e];let a,l,h=-1,c=0;for(;c<i.length&&(n.lastIndex=c,l=n.exec(i),null!==l);)c=n.lastIndex,n===N?"!--"===l[1]?n=U:void 0!==l[1]?n=R:void 0!==l[2]?(G.test(l[2])&&(r=RegExp("</"+l[2],"g")),n=z):void 0!==l[3]&&(n=z):n===z?">"===l[0]?(n=r??N,h=-1):void 0===l[1]?h=-2:(h=n.lastIndex-l[2].length,a=l[1],n=void 0===l[3]?z:'"'===l[3]?W:D):n===W||n===D?n=z:n===U||n===R?n=N:(n=z,r=void 0);const d=n===z&&t[e+1].startsWith("/>")?" ":"";o+=n===N?i+M:h>=0?(s.push(a),i.slice(0,h)+S+i.slice(h)+E+d):i+E+(-2===h?e:d)}return[q(t,o+(t[i]||"<?>")+(2===e?"</svg>":3===e?"</math>":"")),s]};class K{constructor({strings:t,_$litType$:e},i){let s;this.parts=[];let r=0,o=0;const n=t.length-1,a=this.parts,[l,h]=J(t,e);if(this.el=K.createElement(l,i),Z.currentNode=this.el.content,2===e||3===e){const t=this.el.content.firstChild;t.replaceWith(...t.childNodes)}for(;null!==(s=Z.nextNode())&&a.length<n;){if(1===s.nodeType){if(s.hasAttributes())for(const t of s.getAttributeNames())if(t.endsWith(S)){const e=h[o++],i=s.getAttribute(t).split(E),n=/([.?@])?(.*)/.exec(e);a.push({type:1,index:r,name:n[2],strings:i,ctor:"."===n[1]?it:"?"===n[1]?st:"@"===n[1]?rt:et}),s.removeAttribute(t)}else t.startsWith(E)&&(a.push({type:6,index:r}),s.removeAttribute(t));if(G.test(s.tagName)){const t=s.textContent.split(E),e=t.length-1;if(e>0){s.textContent=_?_.emptyScript:"";for(let i=0;i<e;i++)s.append(t[i],L()),Z.nextNode(),a.push({type:2,index:++r});s.append(t[e],L())}}}else if(8===s.nodeType)if(s.data===C)a.push({type:2,index:r});else{let t=-1;for(;-1!==(t=s.data.indexOf(E,t+1));)a.push({type:7,index:r}),t+=E.length-1}r++}}static createElement(t,e){const i=P.createElement("template");return i.innerHTML=t,i}}function Q(t,e,i=t,s){if(e===B)return e;let r=void 0!==s?i._$Co?.[s]:i._$Cl;const o=T(e)?void 0:e._$litDirective$;return r?.constructor!==o&&(r?._$AO?.(!1),void 0===o?r=void 0:(r=new o(t),r._$AT(t,i,s)),void 0!==s?(i._$Co??=[])[s]=r:i._$Cl=r),void 0!==r&&(e=Q(t,r._$AS(t,e.values),r,s)),e}class Y{constructor(t,e){this._$AV=[],this._$AN=void 0,this._$AD=t,this._$AM=e}get parentNode(){return this._$AM.parentNode}get _$AU(){return this._$AM._$AU}u(t){const{el:{content:e},parts:i}=this._$AD,s=(t?.creationScope??P).importNode(e,!0);Z.currentNode=s;let r=Z.nextNode(),o=0,n=0,a=i[0];for(;void 0!==a;){if(o===a.index){let e;2===a.type?e=new tt(r,r.nextSibling,this,t):1===a.type?e=new a.ctor(r,a.name,a.strings,this,t):6===a.type&&(e=new ot(r,this,t)),this._$AV.push(e),a=i[++n]}o!==a?.index&&(r=Z.nextNode(),o++)}return Z.currentNode=P,s}p(t){let e=0;for(const i of this._$AV)void 0!==i&&(void 0!==i.strings?(i._$AI(t,i,e),e+=i.strings.length-2):i._$AI(t[e])),e++}}class tt{get _$AU(){return this._$AM?._$AU??this._$Cv}constructor(t,e,i,s){this.type=2,this._$AH=F,this._$AN=void 0,this._$AA=t,this._$AB=e,this._$AM=i,this.options=s,this._$Cv=s?.isConnected??!0}get parentNode(){let t=this._$AA.parentNode;const e=this._$AM;return void 0!==e&&11===t?.nodeType&&(t=e.parentNode),t}get startNode(){return this._$AA}get endNode(){return this._$AB}_$AI(t,e=this){t=Q(this,t,e),T(t)?t===F||null==t||""===t?(this._$AH!==F&&this._$AR(),this._$AH=F):t!==this._$AH&&t!==B&&this._(t):void 0!==t._$litType$?this.$(t):void 0!==t.nodeType?this.T(t):(t=>O(t)||"function"==typeof t?.[Symbol.iterator])(t)?this.k(t):this._(t)}O(t){return this._$AA.parentNode.insertBefore(t,this._$AB)}T(t){this._$AH!==t&&(this._$AR(),this._$AH=this.O(t))}_(t){this._$AH!==F&&T(this._$AH)?this._$AA.nextSibling.data=t:this.T(P.createTextNode(t)),this._$AH=t}$(t){const{values:e,_$litType$:i}=t,s="number"==typeof i?this._$AC(t):(void 0===i.el&&(i.el=K.createElement(q(i.h,i.h[0]),this.options)),i);if(this._$AH?._$AD===s)this._$AH.p(e);else{const t=new Y(s,this),i=t.u(this.options);t.p(e),this.T(i),this._$AH=t}}_$AC(t){let e=X.get(t.strings);return void 0===e&&X.set(t.strings,e=new K(t)),e}k(t){O(this._$AH)||(this._$AH=[],this._$AR());const e=this._$AH;let i,s=0;for(const r of t)s===e.length?e.push(i=new tt(this.O(L()),this.O(L()),this,this.options)):i=e[s],i._$AI(r),s++;s<e.length&&(this._$AR(i&&i._$AB.nextSibling,s),e.length=s)}_$AR(t=this._$AA.nextSibling,e){for(this._$AP?.(!1,!0,e);t!==this._$AB;){const e=v(t).nextSibling;v(t).remove(),t=e}}setConnected(t){void 0===this._$AM&&(this._$Cv=t,this._$AP?.(t))}}class et{get tagName(){return this.element.tagName}get _$AU(){return this._$AM._$AU}constructor(t,e,i,s,r){this.type=1,this._$AH=F,this._$AN=void 0,this.element=t,this.name=e,this._$AM=s,this.options=r,i.length>2||""!==i[0]||""!==i[1]?(this._$AH=Array(i.length-1).fill(new String),this.strings=i):this._$AH=F}_$AI(t,e=this,i,s){const r=this.strings;let o=!1;if(void 0===r)t=Q(this,t,e,0),o=!T(t)||t!==this._$AH&&t!==B,o&&(this._$AH=t);else{const s=t;let n,a;for(t=r[0],n=0;n<r.length-1;n++)a=Q(this,s[i+n],e,n),a===B&&(a=this._$AH[n]),o||=!T(a)||a!==this._$AH[n],a===F?t=F:t!==F&&(t+=(a??"")+r[n+1]),this._$AH[n]=a}o&&!s&&this.j(t)}j(t){t===F?this.element.removeAttribute(this.name):this.element.setAttribute(this.name,t??"")}}class it extends et{constructor(){super(...arguments),this.type=3}j(t){this.element[this.name]=t===F?void 0:t}}class st extends et{constructor(){super(...arguments),this.type=4}j(t){this.element.toggleAttribute(this.name,!!t&&t!==F)}}class rt extends et{constructor(t,e,i,s,r){super(t,e,i,s,r),this.type=5}_$AI(t,e=this){if((t=Q(this,t,e,0)??F)===B)return;const i=this._$AH,s=t===F&&i!==F||t.capture!==i.capture||t.once!==i.once||t.passive!==i.passive,r=t!==F&&(i===F||s);s&&this.element.removeEventListener(this.name,this,i),r&&this.element.addEventListener(this.name,this,t),this._$AH=t}handleEvent(t){"function"==typeof this._$AH?this._$AH.call(this.options?.host??this.element,t):this._$AH.handleEvent(t)}}class ot{constructor(t,e,i){this.element=t,this.type=6,this._$AN=void 0,this._$AM=e,this.options=i}get _$AU(){return this._$AM._$AU}_$AI(t){Q(this,t)}}const nt=m.litHtmlPolyfillSupport;nt?.(K,tt),(m.litHtmlVersions??=[]).push("3.3.3");const at=globalThis;class lt extends b{constructor(){super(...arguments),this.renderOptions={host:this},this._$Do=void 0}createRenderRoot(){const t=super.createRenderRoot();return this.renderOptions.renderBefore??=t.firstChild,t}update(t){const e=this.render();this.hasUpdated||(this.renderOptions.isConnected=this.isConnected),super.update(t),this._$Do=((t,e,i)=>{const s=i?.renderBefore??e;let r=s._$litPart$;if(void 0===r){const t=i?.renderBefore??null;s._$litPart$=r=new tt(e.insertBefore(L(),t),t,void 0,i??{})}return r._$AI(t),r})(e,this.renderRoot,this.renderOptions)}connectedCallback(){super.connectedCallback(),this._$Do?.setConnected(!0)}disconnectedCallback(){super.disconnectedCallback(),this._$Do?.setConnected(!1)}render(){return B}}lt._$litElement$=!0,lt.finalized=!0,at.litElementHydrateSupport?.({LitElement:lt});const ht=at.litElementPolyfillSupport;ht?.({LitElement:lt}),(at.litElementVersions??=[]).push("4.2.2");const ct={attribute:!0,type:String,converter:k,reflect:!1,hasChanged:$},dt=(t=ct,e,i)=>{const{kind:s,metadata:r}=i;let o=globalThis.litPropertyMetadata.get(r);if(void 0===o&&globalThis.litPropertyMetadata.set(r,o=new Map),"setter"===s&&((t=Object.create(t)).wrapped=!0),o.set(i.name,t),"accessor"===s){const{name:s}=i;return{set(i){const r=e.get.call(this);e.set.call(this,i),this.requestUpdate(s,r,t,!0,i)},init(e){return void 0!==e&&this.C(s,void 0,t,e),e}}}if("setter"===s){const{name:s}=i;return function(i){const r=this[s];e.call(this,i),this.requestUpdate(s,r,t,!0,i)}}throw Error("Unsupported decorator location: "+s)};function ft(t){return(e,i)=>"object"==typeof i?dt(t,e,i):((t,e,i)=>{const s=e.hasOwnProperty(i);return e.constructor.createProperty(i,t),s?Object.getOwnPropertyDescriptor(e,i):void 0})(t,e,i)}function yt(t){return ft({...t,state:!0,attribute:!1})}const pt=((t,...e)=>{const i=1===t.length?t[0]:e.reduce((e,i,s)=>e+(t=>{if(!0===t._$cssResult$)return t.cssText;if("number"==typeof t)return t;throw Error("Value passed to 'css' function must be a 'css' function result: "+t+". Use 'unsafeCSS' to pass non-literal values, but take care to ensure page security.")})(i)+t[s+1],t[0]);return new o(i,t,s)})`
  :host {
    display: block;
    background: transparent;
  }

  .card-container {
    background: var(--ha-card-background, var(--card-background-color, #0f172a));
    border-radius: var(--ha-card-border-radius, 12px);
    border: var(--ha-card-border-width, 1px) solid var(--ha-card-border-color, var(--divider-color, #1e293b));
    box-shadow: var(--ha-card-box-shadow, none);
    color: var(--primary-text-color, #ffffff);
    padding: 16px;
    font-family: var(--paper-font-body1_-_font-family, 'Inter', system-ui, -apple-system, sans-serif);
    overflow: hidden;
  }

  .card-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: 16px;
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
  }

  svg {
    display: block;
    overflow: visible;
    user-select: none;
    width: 100%;
    height: auto;
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
    100% { transform: translateX(1100px); }
  }

  @keyframes driftMedium {
    0%   { transform: translateX(-300px); }
    100% { transform: translateX(1100px); }
  }

  @keyframes driftFast {
    0%   { transform: translateX(-350px); }
    100% { transform: translateX(1100px); }
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

  .cloud1 { animation: driftSlow 65s infinite linear; }
  .cloud2 { animation: driftMedium 45s infinite linear; }
  .cloud3 { animation: driftFast 32s infinite linear; }

  .starFast { animation: twinkle 2.5s infinite ease-in-out; animation-delay: 0.2s; }
  .starMed { animation: twinkle 4s infinite ease-in-out; animation-delay: 1.1s; }
  .starSlow { animation: twinkle 6s infinite ease-in-out; animation-delay: 2.3s; }

  .inverterRing {
    transform-origin: 320px 432.5px;
    animation: pulseInverterRing 3s infinite cubic-bezier(0.2, 0.8, 0.2, 1);
  }

  .chargingPulse {
    animation: chargingDash 1.2s infinite linear;
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
    font-size: 10px;
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
    font-size: 13px;
    font-weight: 600;
    letter-spacing: -0.01em;
    fill: rgba(255, 255, 255, 0.85);
    pointer-events: none;
  }

  .hudActiveText {
    fill: currentColor;
  }

  .hudSub {
    font-size: 9px;
    font-weight: 500;
    fill: rgba(255, 255, 255, 0.32);
    pointer-events: none;
  }
`,ut={solar:{stroke:"#f59e0b"},battery:{stroke:"#10b981"},batteryD:{stroke:"#f97316"},gridI:{stroke:"#06b6d4"},gridE:{stroke:"#22c55e"},ev:{stroke:"#a855f7"},home:{stroke:"#e2e8f0"}},gt=[{hour:0,top:"#020617",horizon:"#0f172a",stars:.8,lights:1,clouds:"rgba(255, 255, 255, 0.08)"},{hour:4.5,top:"#020617",horizon:"#0f172a",stars:.8,lights:1,clouds:"rgba(255, 255, 255, 0.08)"},{hour:6,top:"#1e1b4b",horizon:"#fdba74",stars:.2,lights:.3,clouds:"rgba(255, 255, 255, 0.35)"},{hour:8,top:"#0ea5e9",horizon:"#bae6fd",stars:0,lights:0,clouds:"rgba(255, 255, 255, 0.92)"},{hour:17,top:"#0284c7",horizon:"#bae6fd",stars:0,lights:0,clouds:"rgba(255, 255, 255, 0.92)"},{hour:19.5,top:"#3b0764",horizon:"#f97316",stars:0,lights:.5,clouds:"rgba(255, 255, 255, 0.45)"},{hour:21,top:"#18113c",horizon:"#ea580c",stars:.1,lights:1,clouds:"rgba(255, 255, 255, 0.18)"},{hour:22.5,top:"#020617",horizon:"#1e293b",stars:.6,lights:1,clouds:"rgba(255, 255, 255, 0.08)"},{hour:24,top:"#020617",horizon:"#0f172a",stars:.8,lights:1,clouds:"rgba(255, 255, 255, 0.08)"}];function xt(t){const e=t.replace("#","");return{r:parseInt(e.substring(0,2),16),g:parseInt(e.substring(2,4),16),b:parseInt(e.substring(4,6),16)}}function kt(t,e,i){if(t.startsWith("rgba")||e.startsWith("rgba")){const s=t=>{const e=t.match(/[\d.]+\)$/);return e?parseFloat(e[0]):1},r=s(t);return`rgba(255, 255, 255, ${r+(s(e)-r)*i})`}const s=xt(t),r=xt(e);return function(t,e,i){const s=t=>{const e=Math.max(0,Math.min(255,Math.round(t))).toString(16);return 1===e.length?"0"+e:e};return`#${s(t)}${s(e)}${s(i)}`}(s.r+(r.r-s.r)*i,s.g+(r.g-s.g)*i,s.b+(r.b-s.b)*i)}function $t(t){const e=Math.abs(t);return e<20?0:e<1e3?16:6}function wt(t){const e=Math.abs(t);return e>=1e3?`${(e/1e3).toFixed(1)} kW`:`${Math.round(e)} W`}function bt({houseStyle:t,timeHour:e,timeOfDay:i,solar:s,load:r,batteryPower:o,soc:n,charger:a,grid:l,showSolar:h,showBattery:c,showEV:d,onNodeClick:f}){const y=480,p=o>0,u=o<0,g=l>0,x=l<0,k=a>0,$=s>20,w=r>20,b=p?ut.battery:ut.batteryD,m=g?ut.gridI:ut.gridE,v=function(t){let e=gt[0],i=gt[gt.length-1];for(let s=0;s<gt.length-1;s++)if(t>=gt[s].hour&&t<=gt[s+1].hour){e=gt[s],i=gt[s+1];break}const s=i.hour-e.hour,r=0===s?0:(t-e.hour)/s;return{top:kt(e.top,i.top,r),horizon:kt(e.horizon,i.horizon,r),stars:e.stars+(i.stars-e.stars)*r,lights:e.lights+(i.lights-e.lights)*r,clouds:kt(e.clouds,i.clouds,r)}}(e),_=Math.floor(e),A=Math.floor(e%1*60),S=`${_.toString().padStart(2,"0")}:${A.toString().padStart(2,"0")}`,E={morning:"Ochtend",afternoon:"Middag",evening:"Avond",night:"Nacht"}[i]||"Middag",C={cx:450,cy:600};let M=0,P="#fef08a",L="rgba(254, 240, 138, 0.65)";if(e>=6&&e<=21){const t=(e-6)/15;C.cx=120+720*t,C.cy=430-350*Math.sin(t*Math.PI),M=Math.max(0,Math.min(1,1.5*Math.sin(t*Math.PI)));const i=Math.sin(t*Math.PI);P=kt("#ea580c","#fef08a",i),L=kt("rgba(234, 88, 12, 0.65)","rgba(254, 240, 138, 0.75)",i)}const T={cx:450,cy:600};let O=0;if(e>21||e<6){const t=e>=21?(e-21)/9:(e+3)/9;T.cx=120+720*t,T.cy=430-350*Math.sin(t*Math.PI),O=Math.max(0,Math.min(1,1.5*Math.sin(t*Math.PI)))}const H="#10b981",N=n<20?"#ef4444":u?"#f97316":"#10b981",U=472-n/100*36,R=h&&$||c&&(p||u)||g||x||d&&k,z=R?"#10b981":"#ef4444",D=v.lights>.05,W=(t,e,i,s=!1)=>j`
      <path d="${t}" class="flowCable" />
      <path
        d="${t}"
        fill="none"
        stroke="${H}"
        stroke-width="3"
        stroke-linecap="round"
        opacity="${e?.25:0}"
        style="filter: ${e?"blur(3.5px)":"none"}; transition: stroke 0.6s ease, opacity 0.6s ease;"
      />
      <path
        d="${t}"
        fill="none"
        stroke="${H}"
        stroke-width="1.2"
        stroke-linecap="round"
        opacity="${e?.55:0}"
        style="transition: stroke 0.6s ease, opacity 0.6s ease;"
      />
      ${((t,e,i,s=!1)=>e&&0!==i?j`
      ${Array.from({length:3}).map((e,r)=>j`
        <circle
          r="3.5"
          fill="${H}"
          style="
            offset-path: path('${t}');
            animation: moveParticle ${i}s linear infinite;
            animation-play-state: running;
            animation-delay: ${-r/3*i}s;
            animation-direction: ${s?"reverse":"normal"};
            filter: drop-shadow(0 0 5px ${"rgba(16, 185, 129, 0.45)"}) drop-shadow(0 0 2px ${H});
          "
        />
      `)}
    `:j``)(t,e,i,s)}
    `,G=[],I=[];for(let t=0;t<=960;t+=80)G.push(j`<line x1="${t}" y1="${y}" x2="${t}" y2="620" class="gridLine" />`);for(let t=500;t<620;t+=20)I.push(j`<line x1="0" y1="${t}" x2="960" y2="${t}" class="gridLine" />`);const V=[{id:"grid",title:"Stroomnet",value:wt(l),sub:x?"↑ Teruglevering":g?"↓ Import":"Standby",color:m.stroke,stroke:m.stroke,active:g||x,line:"M {{X_CENTER}} 550 L 120 195"},{id:"home",title:"Huisverbruik",value:wt(r),sub:w?"Actief":"Standby",color:ut.home.stroke,stroke:ut.home.stroke,active:w,line:"M {{X_CENTER}} 550 L 320 430"}];c&&V.push({id:"battery",title:"Thuisaccu",value:wt(o),sub:`SoC: ${n}%`,color:b.stroke,stroke:b.stroke,active:p||u,line:"M {{X_CENTER}} 550 L 547.5 445"}),d&&V.push({id:"ev",title:"Laadpaal (EV)",value:wt(a),sub:k?"Bezig met laden":"Standby",color:ut.ev.stroke,stroke:ut.ev.stroke,active:k,line:"M {{X_CENTER}} 550 L 664 415"});const B=(960-150*V.length)/(V.length+1);return j`
    <svg viewBox="0 0 960 620" xmlns="http://www.w3.org/2000/svg">
      <defs>
        <linearGradient id="sky-grad" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stop-color="${v.top}" />
          <stop offset="100%" stop-color="${v.horizon}" />
        </linearGradient>

        <linearGradient id="garden-grad" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stop-color="#0f3f26" />
          <stop offset="100%" stop-color="#0a2919" />
        </linearGradient>

        <linearGradient id="driveway-grad" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stop-color="#334155" />
          <stop offset="100%" stop-color="#1e293b" />
        </linearGradient>

        <linearGradient id="solar-panel-grad" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stop-color="#1e1b4b" />
          <stop offset="100%" stop-color="#312e81" />
        </linearGradient>

        <linearGradient id="battery-body-grad" x1="0%" y1="0%" x2="0%" y2="100%">
          <stop offset="0%" stop-color="#f8fafc" />
          <stop offset="100%" stop-color="#cbd5e1" />
        </linearGradient>

        <linearGradient id="car-body-grad" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stop-color="#38bdf8" />
          <stop offset="100%" stop-color="#0284c7" />
        </linearGradient>

        <linearGradient id="lamp-light-grad" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stop-color="#fde047" stop-opacity="0.75" />
          <stop offset="100%" stop-color="#fde047" stop-opacity="0" />
        </linearGradient>

        <filter id="cloud-blur" x="-20%" y="-20%" width="140%" height="140%">
          <feGaussianBlur stdDeviation="8" />
        </filter>
      </defs>

      <!-- Sky -->
      <rect width="960" height="620" fill="url(#sky-grad)" />

      <!-- Stars -->
      ${v.stars>.05?j`
        <g opacity="${v.stars}">
          <circle cx="100" cy="60" r="1.2" class="starFast" fill="#ffffff" />
          <circle cx="180" cy="100" r="1.5" class="starSlow" fill="#ffffff" />
          <circle cx="250" cy="45" r="1.0" class="starMed" fill="#ffffff" />
          <circle cx="320" cy="85" r="1.8" class="starFast" fill="#ffffff" />
          <circle cx="410" cy="70" r="1.2" class="starSlow" fill="#ffffff" />
          <circle cx="530" cy="95" r="1.6" class="starMed" fill="#ffffff" />
          <circle cx="590" cy="50" r="1.3" class="starFast" fill="#ffffff" />
          <circle cx="680" cy="80" r="1.5" class="starSlow" fill="#ffffff" />
          <circle cx="750" cy="40" r="1.1" class="starMed" fill="#ffffff" />
          <circle cx="820" cy="110" r="1.7" class="starFast" fill="#ffffff" />
          <circle cx="890" cy="65" r="1.3" class="starSlow" fill="#ffffff" />
        </g>
      `:""}

      <!-- Sun -->
      ${M>0?j`
        <g>
          <circle cx="${C.cx}" cy="${C.cy}" r="55" fill="${P}" opacity="${.15*M}" style="filter: blur(8px);" />
          <circle cx="${C.cx}" cy="${C.cy}" r="28" fill="${P}" opacity="${M}" style="filter: drop-shadow(0 0 16px ${L});" />
        </g>
      `:""}

      <!-- Moon -->
      ${O>0?j`
        <circle cx="${T.cx}" cy="${T.cy}" r="22" fill="#fffef0" opacity="${O}" style="filter: drop-shadow(0 0 12px rgba(254, 243, 199, 0.6)) drop-shadow(0 0 4px rgba(255, 255, 255, 0.8));" />
      `:""}

      <!-- Clouds -->
      <g opacity="${"night"===i?.35:.85}">
        <path class="cloud1" d="M 120,100 A 20,20 0 0,1 150,85 A 30,30 0 0,1 200,80 A 20,20 0 0,1 230,100 Z" fill="${v.clouds}" filter="url(#cloud-blur)" />
        <path class="cloud2" d="M 450,110 A 16,16 0 0,1 475,98 A 24,24 0 0,1 515,94 A 16,16 0 0,1 539,110 Z" fill="${v.clouds}" filter="url(#cloud-blur)" />
        <path class="cloud3" d="M 700,95 A 18,18 0 0,1 727,82 A 26,26 0 0,1 770,78 A 18,18 0 0,1 797,95 Z" fill="${v.clouds}" filter="url(#cloud-blur)" />
      </g>

      <!-- SVG Sky Clock -->
      <g transform="translate(480, 50)" text-anchor="middle" style="pointer-events: none;">
        <text x="0" y="0" fill="#ffffff" font-size="26px" font-weight="700" font-family="monospace" opacity="0.9" style="filter: drop-shadow(0 0 8px rgba(255,255,255,0.45)); letter-spacing: 1px;">
          ${S}
        </text>
        <text x="0" y="18" fill="rgba(255,255,255,0.5)" font-size="10px" font-weight="600" style="letter-spacing: 0.12em;">
          ${E.toUpperCase()}
        </text>
      </g>

      <!-- Ground & Grid -->
      <rect x="0" y="${y}" width="630" height="140" class="groundBackground" fill="url(#garden-grad)" />
      <rect x="630" y="${y}" width="330" height="140" class="groundBackground" fill="url(#driveway-grad)" />
      <line x1="630" y1="${y}" x2="630" y2="${620}" stroke="#1e293b" stroke-width="2" opacity="0.6" />
      <line x1="0" y1="${y}" x2="960" y2="${y}" class="horizonLine" />
      ${G}
      ${I}

      <!-- Grid Tower -->
      <g stroke="#475569" stroke-width="1.8" fill="none" stroke-linecap="round" stroke-linejoin="round">
        <path d="M 70,480 L 105,290 L 85,160 L 95,120" />
        <path d="M 170,480 L 135,290 L 155,160 L 145,120" />
        <line x1="79" y1="380" x2="161" y2="380" />
        <line x1="105" y1="290" x2="135" y2="290" />
        <line x1="95" y1="220" x2="145" y2="220" />
        <line x1="85" y1="160" x2="155" y2="160" />
        <line x1="95" y1="120" x2="145" y2="120" />
        <line x1="105" y1="100" x2="135" y2="100" />
        <line x1="70" y1="480" x2="161" y2="380" />
        <line x1="170" y1="480" x2="79" y2="380" />
        <line x1="79" y1="380" x2="135" y2="290" />
        <line x1="161" y1="380" x2="105" y2="290" />
        <line x1="105" y1="290" x2="145" y2="220" />
        <line x1="135" y1="290" x2="95" y2="220" />
        <line x1="95" y1="220" x2="155" y2="160" />
        <line x1="145" y1="220" x2="85" y2="160" />
        <line x1="85" y1="160" x2="145" y2="120" />
        <line x1="155" y1="160" x2="95" y2="120" />
        <line x1="95" y1="120" x2="135" y2="100" />
        <line x1="145" y1="120" x2="105" y2="100" />
        <line x1="40" y1="160" x2="200" y2="160" />
        <line x1="40" y1="160" x2="95" y2="220" />
        <line x1="200" y1="160" x2="145" y2="220" />
        <line x1="80" y1="100" x2="160" y2="100" />
        <line x1="80" y1="100" x2="95" y2="120" />
        <line x1="160" y1="100" x2="145" y2="120" />
        <line x1="50" y1="160" x2="50" y2="175" stroke="#94a3b8" stroke-width="2.5" />
        <circle cx="50" cy="178" r="2" fill="#94a3b8" />
        <line x1="85" y1="160" x2="85" y2="175" stroke="#94a3b8" stroke-width="2.5" />
        <circle cx="85" cy="178" r="2" fill="#94a3b8" />
        <line x1="155" y1="160" x2="155" y2="175" stroke="#94a3b8" stroke-width="2.5" />
        <circle cx="155" cy="178" r="2" fill="#94a3b8" />
        <line x1="190" y1="160" x2="190" y2="175" stroke="#94a3b8" stroke-width="2.5" />
        <circle cx="190" cy="178" r="2" fill="#94a3b8" />
      </g>
      <path d="M 50,178 Q 20,185 -10,188" stroke="#475569" stroke-width="1.2" fill="none" opacity="0.6" />
      <path d="M 190,178 Q 220,185 240,188" stroke="#475569" stroke-width="1.2" fill="none" opacity="0.4" />

      <!-- EV (Conditional) -->
      ${d?j`
        <g id="garage-ev-car" opacity="${k?1:.35}" style="transition: opacity 0.6s ease;">
          <ellipse cx="755" cy="${478}" rx="70" ry="6" fill="rgba(0,0,0,0.5)" opacity="0.8" />
          <path
            d="M 690,470 L 690,452 L 715,452 L 735,422 L 785,422 L 805,445 L 825,445 L 830,452 L 830,470 Z"
            fill="url(#car-body-grad)"
            stroke="rgba(255,255,255,0.2)"
            stroke-width="1"
          />
          <polygon points="740,425 762,425 762,442 735,442" fill="#0f172a" opacity="0.8" />
          <polygon points="766,425 782,425 800,442 766,442" fill="#0f172a" opacity="0.8" />
          <circle cx="720" cy="465" r="15" fill="#111827" stroke="#4b5563" stroke-width="2.5" />
          <circle cx="790" cy="465" r="15" fill="#111827" stroke="#4b5563" stroke-width="2.5" />
          <circle cx="828" cy="455" r="2.5" fill="${k?"#00f5ff":"#64748b"}" style="filter: ${k?"drop-shadow(0 0 3px #00f5ff)":"none"}; transition: fill 0.5s ease;" />
          <rect x="690" y="455" width="4" height="6" fill="${k?"#ef4444":"#475569"}" style="transition: fill 0.5s ease;" />
        </g>

        <g id="module-charger">
          <rect x="660" y="420" width="8" height="60" fill="#1e293b" stroke="#0f172a" stroke-width="0.8" />
          <line x1="664" y1="420" x2="664" y2="480" stroke="rgba(255,255,255,0.1)" stroke-width="0.8" />
          <rect x="655" y="405" width="18" height="20" fill="#334155" stroke="#1e293b" stroke-width="1" rx="3" />
          <circle
            cx="664"
            cy="415"
            r="3"
            fill="${k?"#a855f7":"#10b981"}"
            style="filter: ${k?"drop-shadow(0 0 5px #a855f7)":"none"}; transition: fill 0.5s ease;"
          />
          <path
            d="M 664,420 C 664,445 675,452 690,452"
            fill="none"
            stroke="#0f172a"
            stroke-width="2.5"
            stroke-linecap="round"
          />
          ${k?j`
            <path
              d="M 664,420 C 664,445 675,452 690,452"
              fill="none"
              stroke="#c084fc"
              stroke-width="1.2"
              stroke-dasharray="4,4"
              stroke-linecap="round"
              class="chargingPulse"
            />
          `:""}
        </g>
      `:""}

      <!-- Dynamic House Component based on selected style -->
      <g id="house-structure">
        ${"modern-villa"===t?j`
          <!-- Villa -->
          <rect x="320" y="455" width="260" height="25" fill="#2d3748" stroke="#1a202c" stroke-width="0.8" />
          <line x1="320" y1="467" x2="580" y2="467" stroke="#1a202c" stroke-width="0.5" opacity="0.4" />
          <rect x="320" y="300" width="80" height="155" fill="#c2410c" stroke="#78350f" stroke-width="0.8" />
          ${Array.from({length:7}).map((t,e)=>j`<line x1="${330+10*e}" y1="300" x2="${330+10*e}" y2="455" stroke="#451a03" stroke-width="0.8" opacity="0.35" />`)}
          <rect x="400" y="300" width="180" height="155" fill="#f8fafc" stroke="#cbd5e1" stroke-width="0.8" />
          ${[330,360,390,420].map(t=>j`<line x1="400" y1="${t}" x2="580" y2="${t}" stroke="#cbd5e1" stroke-width="0.5" opacity="0.4" />`)}

          <!-- Door -->
          <g id="house-door">
            <rect x="345" y="380" width="35" height="75" fill="#78350f" stroke="#451a03" stroke-width="1.5" rx="1.5" />
            <line x1="372" y1="410" x2="372" y2="430" stroke="#cbd5e1" stroke-width="1.8" stroke-linecap="round" />
            <rect x="352" y="390" width="6" height="55" fill="${D?"#fde047":"#1e293b"}" stroke="#451a03" stroke-width="0.8" style="fill: ${D?`rgba(253, 224, 71, ${v.lights})`:"#1e293b"}; filter: ${D?`drop-shadow(0 0 4px rgba(253, 224, 71, ${v.lights}))`:"none"}; transition: fill 0.5s ease;" />
            <rect x="340" y="375" width="45" height="5" fill="#334155" stroke="#1e293b" stroke-width="0.8" rx="1" />
          </g>

          <!-- Roof -->
          <polygon points="300,300 450,200 600,300" fill="#1e293b" stroke="#0f172a" stroke-width="1.5" />
          <line x1="300" y1="300" x2="450" y2="200" stroke="#0f172a" stroke-width="3.5" />
          <line x1="600" y1="300" x2="450" y2="200" stroke="#0f172a" stroke-width="3.5" />
          <rect x="295" y="297" width="310" height="6" fill="#64748b" rx="2" />
          <path d="M 595,303 L 595,455 L 598,458" stroke="#64748b" stroke-width="2.5" fill="none" stroke-linecap="round" />

          <!-- Solar Panels (Conditional) -->
          ${h?j`
            <g transform="translate(450, 200) rotate(33.7)">
              <rect x="15" y="-12" width="130" height="10" fill="url(#solar-panel-grad)" stroke="#1e1b4b" stroke-width="1.5" rx="2" />
              <line x1="45" y1="-12" x2="45" y2="-2" stroke="#3b82f6" stroke-width="0.5" opacity="0.3" />
              <line x1="85" y1="-12" x2="85" y2="-2" stroke="#3b82f6" stroke-width="0.5" opacity="0.3" />
              <line x1="15" y1="-7" x2="145" y2="-7" stroke="#3b82f6" stroke-width="0.5" opacity="0.3" />
            </g>
          `:""}

          <!-- Windows -->
          <rect x="410" y="380" width="130" height="70" class="houseWindow" style="fill: ${D?kt("#0f172a","#fef08a",v.lights):"#0f172a"}; stroke: #334155; stroke-width: 2.5; filter: ${D?`drop-shadow(0 0 ${16*v.lights}px rgba(253, 224, 71, ${.6*v.lights}))`:"none"};" rx="3" />
          <line x1="475" y1="380" x2="475" y2="450" stroke="#0f172a" stroke-width="1.5" />
          <line x1="410" y1="415" x2="540" y2="415" stroke="#0f172a" stroke-width="1.2" />
          <rect x="440" y="310" width="70" height="45" class="houseWindow" style="fill: ${D?kt("#0f172a","#fef08a",v.lights):"#0f172a"}; stroke: #334155; stroke-width: 2.0;" rx="2" />
          <line x1="475" y1="310" x2="475" y2="355" stroke="#0f172a" stroke-width="1.2" />
          <line x1="440" y1="332.5" x2="510" y2="332.5" stroke="#0f172a" stroke-width="1" />
          <circle cx="450" cy="255" r="13" class="houseWindow" style="fill: ${D?kt("#0f172a","#fef08a",v.lights):"#0f172a"}; stroke: #334155; stroke-width: 2.0;" />
          <line x1="450" y1="242" x2="450" y2="268" stroke="#0f172a" stroke-width="1" />
          <line x1="437" y1="255" x2="463" y2="255" stroke="#0f172a" stroke-width="1" />
        `:""}

        ${"classic-jaren30"===t?j`
          <!-- Jaren 30 -->
          <rect x="320" y="455" width="260" height="25" fill="#3e2723" stroke="#1b0000" stroke-width="0.8" />
          <rect x="320" y="300" width="260" height="155" fill="#c2410c" stroke="#7c2d12" stroke-width="0.8" />
          <rect x="320" y="362" width="260" height="6" fill="#f8fafc" stroke="#cbd5e1" stroke-width="0.5" />
          ${Array.from({length:22}).map((t,e)=>j`<line x1="320" y1="${300+7*e}" x2="580" y2="${300+7*e}" stroke="#7c2d12" stroke-width="0.5" opacity="0.3" />`)}

          <!-- Door -->
          <g id="house-door">
            <path d="M 345,455 L 345,395 A 17.5,17.5 0 0,1 380,395 L 380,455 Z" fill="#064e3b" stroke="#022c22" stroke-width="2" />
            <circle cx="373" cy="425" r="2.2" fill="#fbbf24" />
            <path d="M 345,395 A 17.5,17.5 0 0,1 380,395 Z" fill="${D?"rgba(253, 224, 71, 0.75)":"#1e293b"}" stroke="#f8fafc" stroke-width="1" />
          </g>

          <!-- Roof -->
          <polygon points="295,300 450,150 605,300" fill="#991b1b" stroke="#450a0a" stroke-width="1.5" />
          <line x1="295" y1="300" x2="450" y2="150" stroke="#f8fafc" stroke-width="3.5" />
          <line x1="605" y1="300" x2="450" y2="150" stroke="#f8fafc" stroke-width="3.5" />
          <rect x="290" y="297" width="320" height="7" fill="#f8fafc" rx="2" stroke="#cbd5e1" stroke-width="0.8" />
          <path d="M 605,304 L 605,455 L 608,458" stroke="#cbd5e1" stroke-width="2.5" fill="none" stroke-linecap="round" />

          <!-- Solar Panels (Conditional) -->
          ${h?j`
            <g transform="translate(450, 150) rotate(44.0)">
              <rect x="15" y="-12" width="140" height="10" fill="url(#solar-panel-grad)" stroke="#1e1b4b" stroke-width="1.5" rx="2" />
              <line x1="45" y1="-12" x2="45" y2="-2" stroke="#3b82f6" stroke-width="0.5" opacity="0.3" />
              <line x1="85" y1="-12" x2="85" y2="-2" stroke="#3b82f6" stroke-width="0.5" opacity="0.3" />
              <line x1="15" y1="-7" x2="145" y2="-7" stroke="#3b82f6" stroke-width="0.5" opacity="0.3" />
            </g>
          `:""}

          <!-- Windows -->
          <rect x="420" y="375" width="110" height="75" class="houseWindow" style="fill: ${D?kt("#0f172a","#fef08a",v.lights):"#0f172a"}; stroke: #f8fafc; stroke-width: 3.0;" rx="1" />
          <line x1="475" y1="375" x2="475" y2="450" stroke="#f8fafc" stroke-width="2" />
          <line x1="420" y1="412.5" x2="530" y2="412.5" stroke="#f8fafc" stroke-width="1.5" />
          <rect x="415" y="310" width="45" height="45" class="houseWindow" style="fill: ${D?kt("#0f172a","#fef08a",v.lights):"#0f172a"}; stroke: #f8fafc; stroke-width: 2.5;" rx="1" />
          <line x1="437.5" y1="310" x2="437.5" y2="355" stroke="#f8fafc" stroke-width="1.5" />
          <line x1="415" y1="332.5" x2="460" y2="332.5" stroke="#f8fafc" stroke-width="1.5" />
          <rect x="495" y="310" width="45" height="45" class="houseWindow" style="fill: ${D?kt("#0f172a","#fef08a",v.lights):"#0f172a"}; stroke: #f8fafc; stroke-width: 2.5;" rx="1" />
          <line x1="517.5" y1="310" x2="517.5" y2="355" stroke="#f8fafc" stroke-width="1.5" />
          <line x1="495" y1="332.5" x2="540" y2="332.5" stroke="#f8fafc" stroke-width="1.5" />
          <path d="M 437,270 L 437,252 A 13,13 0 0,1 463,252 L 463,270 Z" class="houseWindow" style="fill: ${D?kt("#0f172a","#fef08a",v.lights):"#0f172a"}; stroke: #f8fafc; stroke-width: 2.0;" />
          <line x1="450" y1="239" x2="450" y2="270" stroke="#f8fafc" stroke-width="1.2" />
        `:""}

        ${"barnhouse"===t?j`
          <!-- Barnhouse -->
          <rect x="320" y="455" width="260" height="25" fill="#1e293b" stroke="#0f172a" stroke-width="0.8" />
          <rect x="320" y="280" width="260" height="175" fill="#172554" stroke="#0f172a" stroke-width="1" />
          ${Array.from({length:22}).map((t,e)=>j`<line x1="${326+11*e}" y1="280" x2="${326+11*e}" y2="455" stroke="#020617" stroke-width="0.8" opacity="0.45" />`)}

          <!-- Door -->
          <g id="house-door">
            <rect x="345" y="380" width="35" height="75" fill="#451a03" stroke="#020617" stroke-width="1.5" />
            <line x1="352" y1="395" x2="352" y2="435" stroke="#1e293b" stroke-width="2.5" stroke-linecap="round" />
          </g>

          <!-- Roof -->
          <polygon points="290,280 450,150 610,280" fill="#0f172a" stroke="#020617" stroke-width="2" />
          <line x1="290" y1="280" x2="450" y2="150" stroke="#334155" stroke-width="2.5" />
          <line x1="610" y1="280" x2="450" y2="150" stroke="#334155" stroke-width="2.5" />

          <!-- Solar Panels (Conditional) -->
          ${h?j`
            <g transform="translate(450, 150) rotate(39.0)">
              <rect x="15" y="-12" width="135" height="10" fill="url(#solar-panel-grad)" stroke="#1e1b4b" stroke-width="1.5" rx="2" />
              <line x1="45" y1="-12" x2="45" y2="-2" stroke="#3b82f6" stroke-width="0.5" opacity="0.3" />
              <line x1="85" y1="-12" x2="85" y2="-2" stroke="#3b82f6" stroke-width="0.5" opacity="0.3" />
              <line x1="15" y1="-7" x2="145" y2="-7" stroke="#3b82f6" stroke-width="0.5" opacity="0.3" />
            </g>
          `:""}

          <!-- Window Facade -->
          <rect x="420" y="270" width="120" height="180" class="houseWindow" style="fill: ${D?kt("#0f172a","#fef08a",v.lights):"#0f172a"}; stroke: #0f172a; stroke-width: 3.0;" rx="2" />
          <polygon points="420,270 450,220 480,270" class="houseWindow" style="fill: ${D?kt("#0f172a","#fef08a",v.lights):"#0f172a"}; stroke: #0f172a; stroke-width: 2.0;" />
          <line x1="450" y1="220" x2="450" y2="450" stroke="#0f172a" stroke-width="2" />
          <line x1="420" y1="330" x2="540" y2="330" stroke="#0f172a" stroke-width="1.5" />
          <line x1="420" y1="390" x2="540" y2="390" stroke="#0f172a" stroke-width="1.5" />
        `:""}

        ${"cubist-bungalow"===t?j`
          <!-- Cubist Bungalow -->
          <rect x="320" y="455" width="260" height="25" fill="#1e293b" stroke="#0f172a" stroke-width="0.8" />
          <rect x="320" y="320" width="100" height="135" fill="#64748b" stroke="#475569" stroke-width="1" />
          <line x1="320" y1="380" x2="420" y2="380" stroke="#475569" stroke-width="0.8" opacity="0.5" />
          <rect x="420" y="270" width="160" height="185" fill="#f8fafc" stroke="#cbd5e1" stroke-width="1" />
          <rect x="315" y="315" width="110" height="6" fill="#334155" rx="1.5" />
          <rect x="415" y="265" width="170" height="6" fill="#1e293b" rx="1.5" />

          <!-- Door -->
          <g id="house-door">
            <rect x="345" y="380" width="35" height="75" fill="#3b2314" stroke="#1c1009" stroke-width="1.5" />
            <line x1="372" y1="410" x2="372" y2="430" stroke="#cbd5e1" stroke-width="1.8" stroke-linecap="round" />
          </g>

          <!-- Solar Panels (Conditional) -->
          ${h?j`
            <g transform="translate(440, 250)">
              <rect x="0" y="0" width="120" height="8" fill="url(#solar-panel-grad)" stroke="#1e1b4b" stroke-width="1.2" rx="1" transform="skewX(-15)" />
              <line x1="30" y1="0" x2="30" y2="8" stroke="#3b82f6" stroke-width="0.5" opacity="0.3" />
              <line x1="60" y1="0" x2="60" y2="8" stroke="#3b82f6" stroke-width="0.5" opacity="0.3" />
              <line x1="90" y1="0" x2="90" y2="8" stroke="#3b82f6" stroke-width="0.5" opacity="0.3" />
            </g>
          `:""}

          <!-- Windows -->
          <rect x="440" y="360" width="120" height="80" class="houseWindow" style="fill: ${D?kt("#0f172a","#fef08a",v.lights):"#0f172a"}; stroke: #0f172a; stroke-width: 2.5;" rx="1" />
          <line x1="480" y1="360" x2="480" y2="440" stroke="#0f172a" stroke-width="1.5" />
          <line x1="520" y1="360" x2="520" y2="440" stroke="#0f172a" stroke-width="1.5" />
          <rect x="440" y="290" width="120" height="50" class="houseWindow" style="fill: ${D?kt("#0f172a","#fef08a",v.lights):"#0f172a"}; stroke: #0f172a; stroke-width: 2.0;" rx="1" />
          <line x1="500" y1="290" x2="500" y2="340" stroke="#0f172a" stroke-width="1.5" />
        `:""}

        ${"townhouse"===t?j`
          <!-- Townhouse -->
          <rect x="320" y="455" width="260" height="25" fill="#292524" stroke="#1c1917" stroke-width="0.8" />
          <polygon points="320,230 450,150 580,230" fill="#292524" stroke="#1c1917" stroke-width="1.2" opacity="0.8" />
          <polygon points="320,230 350,230 350,200 380,200 380,170 410,170 410,140 490,140 490,170 520,170 520,200 550,200 550,230 580,230" fill="#44403c" stroke="#1c1917" stroke-width="1" />
          <rect x="320" y="230" width="260" height="225" fill="#44403c" stroke="#1c1917" stroke-width="1" />
          ${Array.from({length:32}).map((t,e)=>j`<line x1="320" y1="${230+7*e}" x2="580" y2="${230+7*e}" stroke="#292524" stroke-width="0.5" opacity="0.35" />`)}

          <!-- Door -->
          <g id="house-door">
            <rect x="345" y="380" width="35" height="75" fill="#7c2d12" stroke="#431407" stroke-width="1.8" rx="1" />
            <line x1="372" y1="410" x2="372" y2="430" stroke="#cbd5e1" stroke-width="1.8" stroke-linecap="round" />
          </g>

          <!-- Solar Panels (Conditional) -->
          ${h?j`
            <g transform="translate(450, 150) rotate(31.6)">
              <rect x="15" y="-12" width="120" height="10" fill="url(#solar-panel-grad)" stroke="#1e1b4b" stroke-width="1.5" rx="2" />
              <line x1="45" y1="-12" x2="45" y2="-2" stroke="#3b82f6" stroke-width="0.5" opacity="0.3" />
              <line x1="85" y1="-12" x2="85" y2="-2" stroke="#3b82f6" stroke-width="0.5" opacity="0.3" />
              <line x1="15" y1="-7" x2="145" y2="-7" stroke="#3b82f6" stroke-width="0.5" opacity="0.3" />
            </g>
          `:""}

          <!-- Windows -->
          <rect x="410" y="375" width="130" height="80" class="houseWindow" style="fill: ${D?kt("#0f172a","#fef08a",v.lights):"#0f172a"}; stroke: #f8fafc; stroke-width: 2.5;" rx="1" />
          <line x1="475" y1="375" x2="475" y2="455" stroke="#f8fafc" stroke-width="1.8" />
          <line x1="410" y1="415" x2="540" y2="415" stroke="#f8fafc" stroke-width="1.2" />

          ${[345,430,515].map(t=>j`
            <rect x="${t}" y="290" width="35" height="60" class="houseWindow" style="fill: ${D?kt("#0f172a","#fef08a",v.lights):"#0f172a"}; stroke: #f8fafc; stroke-width: 2.0;" rx="1" />
            <line x1="${t+17.5}" y1="290" x2="${t+17.5}" y2="350" stroke="#f8fafc" stroke-width="1.2" />
            <line x1="${t}" y1="320" x2="${t+35}" y2="320" stroke="#f8fafc" stroke-width="1" />
          `)}

          ${[390,480].map(t=>j`
            <rect x="${t}" y="210" width="30" height="45" class="houseWindow" style="fill: ${D?kt("#0f172a","#fef08a",v.lights):"#0f172a"}; stroke: #f8fafc; stroke-width: 1.8;" rx="1" />
            <line x1="${t+15}" y1="210" x2="${t+15}" y2="255" stroke="#f8fafc" stroke-width="1" />
          `)}
        `:""}
      </g>

      <!-- Inverter / Meterkast -->
      <g id="house-inverter">
        <rect x="315" y="420" width="10" height="25" fill="#1e293b" stroke="rgba(255,255,255,0.1)" stroke-width="0.8" rx="1" />
        <circle cx="320" cy="432.5" r="2.5" fill="${z}" style="transition: fill 0.6s ease;" />
        ${R?j`<circle cx="320" cy="432.5" r="2.5" fill="none" stroke="${z}" stroke-width="1.5" class="inverterRing" />`:""}
      </g>

      <!-- Tesla Powerwall Battery Cabinet (Conditional) -->
      ${c?j`
        <g id="house-battery">
          <rect x="530" y="410" width="35" height="70" fill="url(#battery-body-grad)" stroke="#cbd5e1" stroke-width="1" rx="4" />
          <rect x="530" y="410" width="35" height="70" fill="none" stroke="rgba(255,255,255,0.25)" stroke-width="0.8" rx="4" />
          <rect x="535" y="418" width="25" height="12" fill="rgba(0,0,0,0.72)" rx="1.5" />
          <text x="547.5" y="427" text-anchor="middle" fill="${N}" font-size="8.5px" font-family="monospace" font-weight="bold" style="transition: fill 0.6s ease;">
            ${n}%
          </text>
          <rect x="546.5" y="436" width="2" height="36" fill="rgba(0,0,0,0.4)" rx="0.5" />
          <rect x="546.5" y="${U}" width="2" height="${472-U}" fill="${N}" opacity="0.95" style="transition: y 0.8s ease, height 0.8s ease, fill 0.6s ease;" rx="0.5" />
        </g>
      `:""}

      <!-- Flow Lines Cables (Conditional) -->
      ${h?W("M 490,235 L 580,295 L 580,510 L 320,510 L 320,430",$,$t(s)):""}
      ${W("M 85,178 L 120,195 L 120,510 L 320,510 L 320,430",g||x,$t(l),x)}
      ${c?W("M 320,430 L 320,510 L 540,510 L 540,450",p||u,$t(o),u):""}
      ${d?W("M 320,430 L 320,510 L 660,510 L 660,420 C 664,445 675,452 690,452",k,$t(a)):""}

      <!-- Dynamic Bottom HUD Cards & Indicator lines -->
      ${V.map((t,e)=>{const i=B+e*(150+B),s=i+75,r=t.line.replace("{{X_CENTER}}",s.toString());return j`
          <g class="interactiveGroup" @click=${()=>f(t.id)}>
            <path
              d="${r}"
              fill="none"
              stroke="${t.active?t.stroke:"rgba(255,255,255,0.12)"}"
              stroke-width="1"
              stroke-dasharray="3,3"
              style="transition: stroke 0.6s ease;"
            />
            <g transform="translate(${i}, 550)">
              <rect x="0" y="0" width="150" height="55" class="hudCard ${t.active?"hudCardActive":""}" style="${t.active?`color: ${t.color}`:""}" />
              <text x="12" y="18" class="hudTitle">${t.title}</text>
              <text x="12" y="35" class="hudValue ${t.active?"hudActiveText":""}" style="${t.active?`color: ${t.color}`:""}">
                ${t.active?t.value:"—"}
              </text>
              <text x="12" y="47" class="hudSub">${t.sub}</text>
            </g>
          </g>
        `})}

      <!-- Solar HUD card on roof slope (Conditional) -->
      ${h?j`
        <g class="interactiveGroup" @click=${()=>f("solar")}>
          <polygon points="450,200 600,300 560,330 430,220" fill="transparent" />
          <path
            d="M 580 167 L 490 235"
            fill="none"
            stroke="${$?ut.solar.stroke:"rgba(255,255,255,0.12)"}"
            stroke-width="1"
            stroke-dasharray="3,3"
            style="transition: stroke 0.6s ease;"
          />
          <g transform="translate(580, 140)">
            <rect x="0" y="0" width="150" height="55" class="hudCard ${$?"hudCardActive":""}" style="${$?`color: ${ut.solar.stroke}`:""}" />
            <text x="12" y="18" class="hudTitle">Zonnepanelen</text>
            <text x="12" y="35" class="hudValue ${$?"hudActiveText":""}" style="${$?`color: ${ut.solar.stroke}`:""}">
              ${$?wt(s):"—"}
            </text>
            <text x="12" y="47" class="hudSub">Vandaag: 14.2 kWh</text>
          </g>
        </g>
      `:""}
    </svg>
  `}class mt extends lt{constructor(){super(...arguments),this.selectedNode=null,this.currentHouseStyle="modern-villa"}static getStubConfig(){return{title:"Energieverloop",house_style:"modern-villa",entities:{}}}setConfig(t){if(!t)throw new Error("Ongeldige configuratie");this.config=t,t.house_style&&(this.currentHouseStyle=t.house_style)}updated(t){super.updated(t),t.has("config")&&this.config?.house_style&&(this.currentHouseStyle=this.config.house_style)}getEntityValue(t){if(!t||!this.hass)return 0;const e=t=>{const e=this.hass?.states[t];if(!e)return 0;const i=parseFloat(e.state);return isNaN(i)?0:i};return Array.isArray(t)?t.reduce((t,i)=>t+e(i),0):e(t)}handleNodeClick(t){this.selectedNode=this.selectedNode===t?null:t;const e="battery"===t?"battery_power":t,i=this.config?.entities[e],s=Array.isArray(i)?i[0]:i;if(s){const t=new CustomEvent("hass-more-info",{detail:{entityId:s},bubbles:!0,composed:!0});this.dispatchEvent(t)}}render(){if(!this.config||!this.hass)return V`<p style="color: red; padding: 16px;">Wachten op Home Assistant...</p>`;const{entities:t}=this.config,e=new Date,i=e.getHours()+e.getMinutes()/60;let s="afternoon";s=i>=5&&i<9?"morning":i>=9&&i<18?"afternoon":i>=18&&i<22?"evening":"night";const r=this.getEntityValue(t.solar),o=this.getEntityValue(t.load),n=this.getEntityValue(t.battery_power),a=t.battery_soc?this.getEntityValue(t.battery_soc):0,l=this.getEntityValue(t.charger);let h=0;h=t.grid?this.getEntityValue(t.grid):o+l-r-n;const c=!!t.solar,d=!!t.battery_power,f=!!t.charger;return V`
      <div class="card-container">
        ${this.config.title?V`
          <div class="card-header">
            <div class="card-title">${this.config.title}</div>
          </div>
        `:""}

        <div class="sceneWrapper">
          ${bt({houseStyle:this.currentHouseStyle,timeHour:i,timeOfDay:s,solar:r,load:o,batteryPower:n,soc:a,charger:l,grid:h,showSolar:c,showBattery:d,showEV:f,onNodeClick:t=>this.handleNodeClick(t)})}
        </div>
      </div>
    `}getCardSize(){return 6}}mt.styles=pt,t([ft({attribute:!1})],mt.prototype,"hass",void 0),t([yt()],mt.prototype,"config",void 0),t([yt()],mt.prototype,"selectedNode",void 0),t([yt()],mt.prototype,"currentHouseStyle",void 0),customElements.get("energy-flow-card")||(customElements.define("energy-flow-card",mt),console.info("%c  ENERGY-FLOW-CARD  %c Version 1.0.0 ","color: white; background: #10b981; font-weight: 700;","color: #10b981; background: #0f172a; font-weight: 700;"));export{mt as EnergyFlowCard};
