function t(t,e,i,r){var s,o=arguments.length,n=o<3?e:null===r?r=Object.getOwnPropertyDescriptor(e,i):r;if("object"==typeof Reflect&&"function"==typeof Reflect.decorate)n=Reflect.decorate(t,e,i,r);else for(var a=t.length-1;a>=0;a--)(s=t[a])&&(n=(o<3?s(n):o>3?s(e,i,n):s(e,i))||n);return o>3&&n&&Object.defineProperty(e,i,n),n}"function"==typeof SuppressedError&&SuppressedError;const e=globalThis,i=e.ShadowRoot&&(void 0===e.ShadyCSS||e.ShadyCSS.nativeShadow)&&"adoptedStyleSheets"in Document.prototype&&"replace"in CSSStyleSheet.prototype,r=Symbol(),s=new WeakMap;let o=class{constructor(t,e,i){if(this._$cssResult$=!0,i!==r)throw Error("CSSResult is not constructable. Use `unsafeCSS` or `css` instead.");this.cssText=t,this.t=e}get styleSheet(){let t=this.o;const e=this.t;if(i&&void 0===t){const i=void 0!==e&&1===e.length;i&&(t=s.get(e)),void 0===t&&((this.o=t=new CSSStyleSheet).replaceSync(this.cssText),i&&s.set(e,t))}return t}toString(){return this.cssText}};const n=i?t=>t:t=>t instanceof CSSStyleSheet?(t=>{let e="";for(const i of t.cssRules)e+=i.cssText;return(t=>new o("string"==typeof t?t:t+"",void 0,r))(e)})(t):t,{is:a,defineProperty:l,getOwnPropertyDescriptor:c,getOwnPropertyNames:h,getOwnPropertySymbols:d,getPrototypeOf:f}=Object,p=globalThis,y=p.trustedTypes,u=y?y.emptyScript:"",g=p.reactiveElementPolyfillSupport,x=(t,e)=>t,$={toAttribute(t,e){switch(e){case Boolean:t=t?u:null;break;case Object:case Array:t=null==t?t:JSON.stringify(t)}return t},fromAttribute(t,e){let i=t;switch(e){case Boolean:i=null!==t;break;case Number:i=null===t?null:Number(t);break;case Object:case Array:try{i=JSON.parse(t)}catch(t){i=null}}return i}},k=(t,e)=>!a(t,e),w={attribute:!0,type:String,converter:$,reflect:!1,useDefault:!1,hasChanged:k};Symbol.metadata??=Symbol("metadata"),p.litPropertyMetadata??=new WeakMap;let b=class extends HTMLElement{static addInitializer(t){this._$Ei(),(this.l??=[]).push(t)}static get observedAttributes(){return this.finalize(),this._$Eh&&[...this._$Eh.keys()]}static createProperty(t,e=w){if(e.state&&(e.attribute=!1),this._$Ei(),this.prototype.hasOwnProperty(t)&&((e=Object.create(e)).wrapped=!0),this.elementProperties.set(t,e),!e.noAccessor){const i=Symbol(),r=this.getPropertyDescriptor(t,i,e);void 0!==r&&l(this.prototype,t,r)}}static getPropertyDescriptor(t,e,i){const{get:r,set:s}=c(this.prototype,t)??{get(){return this[e]},set(t){this[e]=t}};return{get:r,set(e){const o=r?.call(this);s?.call(this,e),this.requestUpdate(t,o,i)},configurable:!0,enumerable:!0}}static getPropertyOptions(t){return this.elementProperties.get(t)??w}static _$Ei(){if(this.hasOwnProperty(x("elementProperties")))return;const t=f(this);t.finalize(),void 0!==t.l&&(this.l=[...t.l]),this.elementProperties=new Map(t.elementProperties)}static finalize(){if(this.hasOwnProperty(x("finalized")))return;if(this.finalized=!0,this._$Ei(),this.hasOwnProperty(x("properties"))){const t=this.properties,e=[...h(t),...d(t)];for(const i of e)this.createProperty(i,t[i])}const t=this[Symbol.metadata];if(null!==t){const e=litPropertyMetadata.get(t);if(void 0!==e)for(const[t,i]of e)this.elementProperties.set(t,i)}this._$Eh=new Map;for(const[t,e]of this.elementProperties){const i=this._$Eu(t,e);void 0!==i&&this._$Eh.set(i,t)}this.elementStyles=this.finalizeStyles(this.styles)}static finalizeStyles(t){const e=[];if(Array.isArray(t)){const i=new Set(t.flat(1/0).reverse());for(const t of i)e.unshift(n(t))}else void 0!==t&&e.push(n(t));return e}static _$Eu(t,e){const i=e.attribute;return!1===i?void 0:"string"==typeof i?i:"string"==typeof t?t.toLowerCase():void 0}constructor(){super(),this._$Ep=void 0,this.isUpdatePending=!1,this.hasUpdated=!1,this._$Em=null,this._$Ev()}_$Ev(){this._$ES=new Promise(t=>this.enableUpdating=t),this._$AL=new Map,this._$E_(),this.requestUpdate(),this.constructor.l?.forEach(t=>t(this))}addController(t){(this._$EO??=new Set).add(t),void 0!==this.renderRoot&&this.isConnected&&t.hostConnected?.()}removeController(t){this._$EO?.delete(t)}_$E_(){const t=new Map,e=this.constructor.elementProperties;for(const i of e.keys())this.hasOwnProperty(i)&&(t.set(i,this[i]),delete this[i]);t.size>0&&(this._$Ep=t)}createRenderRoot(){const t=this.shadowRoot??this.attachShadow(this.constructor.shadowRootOptions);return((t,r)=>{if(i)t.adoptedStyleSheets=r.map(t=>t instanceof CSSStyleSheet?t:t.styleSheet);else for(const i of r){const r=document.createElement("style"),s=e.litNonce;void 0!==s&&r.setAttribute("nonce",s),r.textContent=i.cssText,t.appendChild(r)}})(t,this.constructor.elementStyles),t}connectedCallback(){this.renderRoot??=this.createRenderRoot(),this.enableUpdating(!0),this._$EO?.forEach(t=>t.hostConnected?.())}enableUpdating(t){}disconnectedCallback(){this._$EO?.forEach(t=>t.hostDisconnected?.())}attributeChangedCallback(t,e,i){this._$AK(t,i)}_$ET(t,e){const i=this.constructor.elementProperties.get(t),r=this.constructor._$Eu(t,i);if(void 0!==r&&!0===i.reflect){const s=(void 0!==i.converter?.toAttribute?i.converter:$).toAttribute(e,i.type);this._$Em=t,null==s?this.removeAttribute(r):this.setAttribute(r,s),this._$Em=null}}_$AK(t,e){const i=this.constructor,r=i._$Eh.get(t);if(void 0!==r&&this._$Em!==r){const t=i.getPropertyOptions(r),s="function"==typeof t.converter?{fromAttribute:t.converter}:void 0!==t.converter?.fromAttribute?t.converter:$;this._$Em=r;const o=s.fromAttribute(e,t.type);this[r]=o??this._$Ej?.get(r)??o,this._$Em=null}}requestUpdate(t,e,i,r=!1,s){if(void 0!==t){const o=this.constructor;if(!1===r&&(s=this[t]),i??=o.getPropertyOptions(t),!((i.hasChanged??k)(s,e)||i.useDefault&&i.reflect&&s===this._$Ej?.get(t)&&!this.hasAttribute(o._$Eu(t,i))))return;this.C(t,e,i)}!1===this.isUpdatePending&&(this._$ES=this._$EP())}C(t,e,{useDefault:i,reflect:r,wrapped:s},o){i&&!(this._$Ej??=new Map).has(t)&&(this._$Ej.set(t,o??e??this[t]),!0!==s||void 0!==o)||(this._$AL.has(t)||(this.hasUpdated||i||(e=void 0),this._$AL.set(t,e)),!0===r&&this._$Em!==t&&(this._$Eq??=new Set).add(t))}async _$EP(){this.isUpdatePending=!0;try{await this._$ES}catch(t){Promise.reject(t)}const t=this.scheduleUpdate();return null!=t&&await t,!this.isUpdatePending}scheduleUpdate(){return this.performUpdate()}performUpdate(){if(!this.isUpdatePending)return;if(!this.hasUpdated){if(this.renderRoot??=this.createRenderRoot(),this._$Ep){for(const[t,e]of this._$Ep)this[t]=e;this._$Ep=void 0}const t=this.constructor.elementProperties;if(t.size>0)for(const[e,i]of t){const{wrapped:t}=i,r=this[e];!0!==t||this._$AL.has(e)||void 0===r||this.C(e,void 0,i,r)}}let t=!1;const e=this._$AL;try{t=this.shouldUpdate(e),t?(this.willUpdate(e),this._$EO?.forEach(t=>t.hostUpdate?.()),this.update(e)):this._$EM()}catch(e){throw t=!1,this._$EM(),e}t&&this._$AE(e)}willUpdate(t){}_$AE(t){this._$EO?.forEach(t=>t.hostUpdated?.()),this.hasUpdated||(this.hasUpdated=!0,this.firstUpdated(t)),this.updated(t)}_$EM(){this._$AL=new Map,this.isUpdatePending=!1}get updateComplete(){return this.getUpdateComplete()}getUpdateComplete(){return this._$ES}shouldUpdate(t){return!0}update(t){this._$Eq&&=this._$Eq.forEach(t=>this._$ET(t,this[t])),this._$EM()}updated(t){}firstUpdated(t){}};b.elementStyles=[],b.shadowRootOptions={mode:"open"},b[x("elementProperties")]=new Map,b[x("finalized")]=new Map,g?.({ReactiveElement:b}),(p.reactiveElementVersions??=[]).push("2.1.2");const m=globalThis,v=t=>t,_=m.trustedTypes,A=_?_.createPolicy("lit-html",{createHTML:t=>t}):void 0,E="$lit$",S=`lit$${Math.random().toFixed(9).slice(2)}$`,C="?"+S,M=`<${C}>`,P=document,T=()=>P.createComment(""),L=t=>null===t||"object"!=typeof t&&"function"!=typeof t,O=Array.isArray,R="[ \t\n\f\r]",H=/<(?:(!--|\/[^a-zA-Z])|(\/?[a-zA-Z][^>\s]*)|(\/?$))/g,N=/-->/g,U=/>/g,G=RegExp(`>|${R}(?:([^\\s"'>=/]+)(${R}*=${R}*(?:[^ \t\n\f\r"'\`<>=]|("|')|))|$)`,"g"),D=/'/g,z=/"/g,I=/^(?:script|style|textarea|title)$/i,F=t=>(e,...i)=>({_$litType$:t,strings:e,values:i}),V=F(1),W=F(2),B=Symbol.for("lit-noChange"),j=Symbol.for("lit-nothing"),Q=new WeakMap,Z=P.createTreeWalker(P,129);function X(t,e){if(!O(t)||!t.hasOwnProperty("raw"))throw Error("invalid template strings array");return void 0!==A?A.createHTML(e):e}const q=(t,e)=>{const i=t.length-1,r=[];let s,o=2===e?"<svg>":3===e?"<math>":"",n=H;for(let e=0;e<i;e++){const i=t[e];let a,l,c=-1,h=0;for(;h<i.length&&(n.lastIndex=h,l=n.exec(i),null!==l);)h=n.lastIndex,n===H?"!--"===l[1]?n=N:void 0!==l[1]?n=U:void 0!==l[2]?(I.test(l[2])&&(s=RegExp("</"+l[2],"g")),n=G):void 0!==l[3]&&(n=G):n===G?">"===l[0]?(n=s??H,c=-1):void 0===l[1]?c=-2:(c=n.lastIndex-l[2].length,a=l[1],n=void 0===l[3]?G:'"'===l[3]?z:D):n===z||n===D?n=G:n===N||n===U?n=H:(n=G,s=void 0);const d=n===G&&t[e+1].startsWith("/>")?" ":"";o+=n===H?i+M:c>=0?(r.push(a),i.slice(0,c)+E+i.slice(c)+S+d):i+S+(-2===c?e:d)}return[X(t,o+(t[i]||"<?>")+(2===e?"</svg>":3===e?"</math>":"")),r]};class Y{constructor({strings:t,_$litType$:e},i){let r;this.parts=[];let s=0,o=0;const n=t.length-1,a=this.parts,[l,c]=q(t,e);if(this.el=Y.createElement(l,i),Z.currentNode=this.el.content,2===e||3===e){const t=this.el.content.firstChild;t.replaceWith(...t.childNodes)}for(;null!==(r=Z.nextNode())&&a.length<n;){if(1===r.nodeType){if(r.hasAttributes())for(const t of r.getAttributeNames())if(t.endsWith(E)){const e=c[o++],i=r.getAttribute(t).split(S),n=/([.?@])?(.*)/.exec(e);a.push({type:1,index:s,name:n[2],strings:i,ctor:"."===n[1]?it:"?"===n[1]?rt:"@"===n[1]?st:et}),r.removeAttribute(t)}else t.startsWith(S)&&(a.push({type:6,index:s}),r.removeAttribute(t));if(I.test(r.tagName)){const t=r.textContent.split(S),e=t.length-1;if(e>0){r.textContent=_?_.emptyScript:"";for(let i=0;i<e;i++)r.append(t[i],T()),Z.nextNode(),a.push({type:2,index:++s});r.append(t[e],T())}}}else if(8===r.nodeType)if(r.data===C)a.push({type:2,index:s});else{let t=-1;for(;-1!==(t=r.data.indexOf(S,t+1));)a.push({type:7,index:s}),t+=S.length-1}s++}}static createElement(t,e){const i=P.createElement("template");return i.innerHTML=t,i}}function K(t,e,i=t,r){if(e===B)return e;let s=void 0!==r?i._$Co?.[r]:i._$Cl;const o=L(e)?void 0:e._$litDirective$;return s?.constructor!==o&&(s?._$AO?.(!1),void 0===o?s=void 0:(s=new o(t),s._$AT(t,i,r)),void 0!==r?(i._$Co??=[])[r]=s:i._$Cl=s),void 0!==s&&(e=K(t,s._$AS(t,e.values),s,r)),e}class J{constructor(t,e){this._$AV=[],this._$AN=void 0,this._$AD=t,this._$AM=e}get parentNode(){return this._$AM.parentNode}get _$AU(){return this._$AM._$AU}u(t){const{el:{content:e},parts:i}=this._$AD,r=(t?.creationScope??P).importNode(e,!0);Z.currentNode=r;let s=Z.nextNode(),o=0,n=0,a=i[0];for(;void 0!==a;){if(o===a.index){let e;2===a.type?e=new tt(s,s.nextSibling,this,t):1===a.type?e=new a.ctor(s,a.name,a.strings,this,t):6===a.type&&(e=new ot(s,this,t)),this._$AV.push(e),a=i[++n]}o!==a?.index&&(s=Z.nextNode(),o++)}return Z.currentNode=P,r}p(t){let e=0;for(const i of this._$AV)void 0!==i&&(void 0!==i.strings?(i._$AI(t,i,e),e+=i.strings.length-2):i._$AI(t[e])),e++}}class tt{get _$AU(){return this._$AM?._$AU??this._$Cv}constructor(t,e,i,r){this.type=2,this._$AH=j,this._$AN=void 0,this._$AA=t,this._$AB=e,this._$AM=i,this.options=r,this._$Cv=r?.isConnected??!0}get parentNode(){let t=this._$AA.parentNode;const e=this._$AM;return void 0!==e&&11===t?.nodeType&&(t=e.parentNode),t}get startNode(){return this._$AA}get endNode(){return this._$AB}_$AI(t,e=this){t=K(this,t,e),L(t)?t===j||null==t||""===t?(this._$AH!==j&&this._$AR(),this._$AH=j):t!==this._$AH&&t!==B&&this._(t):void 0!==t._$litType$?this.$(t):void 0!==t.nodeType?this.T(t):(t=>O(t)||"function"==typeof t?.[Symbol.iterator])(t)?this.k(t):this._(t)}O(t){return this._$AA.parentNode.insertBefore(t,this._$AB)}T(t){this._$AH!==t&&(this._$AR(),this._$AH=this.O(t))}_(t){this._$AH!==j&&L(this._$AH)?this._$AA.nextSibling.data=t:this.T(P.createTextNode(t)),this._$AH=t}$(t){const{values:e,_$litType$:i}=t,r="number"==typeof i?this._$AC(t):(void 0===i.el&&(i.el=Y.createElement(X(i.h,i.h[0]),this.options)),i);if(this._$AH?._$AD===r)this._$AH.p(e);else{const t=new J(r,this),i=t.u(this.options);t.p(e),this.T(i),this._$AH=t}}_$AC(t){let e=Q.get(t.strings);return void 0===e&&Q.set(t.strings,e=new Y(t)),e}k(t){O(this._$AH)||(this._$AH=[],this._$AR());const e=this._$AH;let i,r=0;for(const s of t)r===e.length?e.push(i=new tt(this.O(T()),this.O(T()),this,this.options)):i=e[r],i._$AI(s),r++;r<e.length&&(this._$AR(i&&i._$AB.nextSibling,r),e.length=r)}_$AR(t=this._$AA.nextSibling,e){for(this._$AP?.(!1,!0,e);t!==this._$AB;){const e=v(t).nextSibling;v(t).remove(),t=e}}setConnected(t){void 0===this._$AM&&(this._$Cv=t,this._$AP?.(t))}}class et{get tagName(){return this.element.tagName}get _$AU(){return this._$AM._$AU}constructor(t,e,i,r,s){this.type=1,this._$AH=j,this._$AN=void 0,this.element=t,this.name=e,this._$AM=r,this.options=s,i.length>2||""!==i[0]||""!==i[1]?(this._$AH=Array(i.length-1).fill(new String),this.strings=i):this._$AH=j}_$AI(t,e=this,i,r){const s=this.strings;let o=!1;if(void 0===s)t=K(this,t,e,0),o=!L(t)||t!==this._$AH&&t!==B,o&&(this._$AH=t);else{const r=t;let n,a;for(t=s[0],n=0;n<s.length-1;n++)a=K(this,r[i+n],e,n),a===B&&(a=this._$AH[n]),o||=!L(a)||a!==this._$AH[n],a===j?t=j:t!==j&&(t+=(a??"")+s[n+1]),this._$AH[n]=a}o&&!r&&this.j(t)}j(t){t===j?this.element.removeAttribute(this.name):this.element.setAttribute(this.name,t??"")}}class it extends et{constructor(){super(...arguments),this.type=3}j(t){this.element[this.name]=t===j?void 0:t}}class rt extends et{constructor(){super(...arguments),this.type=4}j(t){this.element.toggleAttribute(this.name,!!t&&t!==j)}}class st extends et{constructor(t,e,i,r,s){super(t,e,i,r,s),this.type=5}_$AI(t,e=this){if((t=K(this,t,e,0)??j)===B)return;const i=this._$AH,r=t===j&&i!==j||t.capture!==i.capture||t.once!==i.once||t.passive!==i.passive,s=t!==j&&(i===j||r);r&&this.element.removeEventListener(this.name,this,i),s&&this.element.addEventListener(this.name,this,t),this._$AH=t}handleEvent(t){"function"==typeof this._$AH?this._$AH.call(this.options?.host??this.element,t):this._$AH.handleEvent(t)}}class ot{constructor(t,e,i){this.element=t,this.type=6,this._$AN=void 0,this._$AM=e,this.options=i}get _$AU(){return this._$AM._$AU}_$AI(t){K(this,t)}}const nt=m.litHtmlPolyfillSupport;nt?.(Y,tt),(m.litHtmlVersions??=[]).push("3.3.3");const at=globalThis;class lt extends b{constructor(){super(...arguments),this.renderOptions={host:this},this._$Do=void 0}createRenderRoot(){const t=super.createRenderRoot();return this.renderOptions.renderBefore??=t.firstChild,t}update(t){const e=this.render();this.hasUpdated||(this.renderOptions.isConnected=this.isConnected),super.update(t),this._$Do=((t,e,i)=>{const r=i?.renderBefore??e;let s=r._$litPart$;if(void 0===s){const t=i?.renderBefore??null;r._$litPart$=s=new tt(e.insertBefore(T(),t),t,void 0,i??{})}return s._$AI(t),s})(e,this.renderRoot,this.renderOptions)}connectedCallback(){super.connectedCallback(),this._$Do?.setConnected(!0)}disconnectedCallback(){super.disconnectedCallback(),this._$Do?.setConnected(!1)}render(){return B}}lt._$litElement$=!0,lt.finalized=!0,at.litElementHydrateSupport?.({LitElement:lt});const ct=at.litElementPolyfillSupport;ct?.({LitElement:lt}),(at.litElementVersions??=[]).push("4.2.2");const ht={attribute:!0,type:String,converter:$,reflect:!1,hasChanged:k},dt=(t=ht,e,i)=>{const{kind:r,metadata:s}=i;let o=globalThis.litPropertyMetadata.get(s);if(void 0===o&&globalThis.litPropertyMetadata.set(s,o=new Map),"setter"===r&&((t=Object.create(t)).wrapped=!0),o.set(i.name,t),"accessor"===r){const{name:r}=i;return{set(i){const s=e.get.call(this);e.set.call(this,i),this.requestUpdate(r,s,t,!0,i)},init(e){return void 0!==e&&this.C(r,void 0,t,e),e}}}if("setter"===r){const{name:r}=i;return function(i){const s=this[r];e.call(this,i),this.requestUpdate(r,s,t,!0,i)}}throw Error("Unsupported decorator location: "+r)};function ft(t){return(e,i)=>"object"==typeof i?dt(t,e,i):((t,e,i)=>{const r=e.hasOwnProperty(i);return e.constructor.createProperty(i,t),r?Object.getOwnPropertyDescriptor(e,i):void 0})(t,e,i)}function pt(t){return ft({...t,state:!0,attribute:!1})}const yt=((t,...e)=>{const i=1===t.length?t[0]:e.reduce((e,i,r)=>e+(t=>{if(!0===t._$cssResult$)return t.cssText;if("number"==typeof t)return t;throw Error("Value passed to 'css' function must be a 'css' function result: "+t+". Use 'unsafeCSS' to pass non-literal values, but take care to ensure page security.")})(i)+t[r+1],t[0]);return new o(i,t,r)})`
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
    padding: 0;
    font-family: var(--paper-font-body1_-_font-family, 'Inter', system-ui, -apple-system, sans-serif);
    overflow: hidden;
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
    display: block;
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
    transform-origin: 395px 432.5px;
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
`,ut={solar:{stroke:"#10b981",glow:"rgba(16,185,129,0.5)"},battery:{stroke:"#10b981",glow:"rgba(16,185,129,0.5)"},batteryD:{stroke:"#ef4444",glow:"rgba(239,68,68,0.5)"},gridI:{stroke:"#06b6d4",glow:"rgba(6,182,212,0.5)"},gridE:{stroke:"#22c55e",glow:"rgba(34,197,94,0.5)"},ev:{stroke:"#a855f7",glow:"rgba(168,85,247,0.5)"},home:{stroke:"#e2e8f0"}},gt=[{hour:0,top:"#020617",horizon:"#0f172a",stars:.8,lights:1,clouds:"rgba(255, 255, 255, 0.08)"},{hour:4.5,top:"#020617",horizon:"#0f172a",stars:.8,lights:1,clouds:"rgba(255, 255, 255, 0.08)"},{hour:6,top:"#1e1b4b",horizon:"#fdba74",stars:.2,lights:.3,clouds:"rgba(255, 255, 255, 0.35)"},{hour:8,top:"#0ea5e9",horizon:"#bae6fd",stars:0,lights:0,clouds:"rgba(255, 255, 255, 0.65)"},{hour:17,top:"#0284c7",horizon:"#bae6fd",stars:0,lights:0,clouds:"rgba(255, 255, 255, 0.65)"},{hour:19.5,top:"#3b0764",horizon:"#f97316",stars:0,lights:.5,clouds:"rgba(255, 255, 255, 0.45)"},{hour:21,top:"#18113c",horizon:"#ea580c",stars:.1,lights:1,clouds:"rgba(255, 255, 255, 0.18)"},{hour:22.5,top:"#020617",horizon:"#1e293b",stars:.6,lights:1,clouds:"rgba(255, 255, 255, 0.08)"},{hour:24,top:"#020617",horizon:"#0f172a",stars:.8,lights:1,clouds:"rgba(255, 255, 255, 0.08)"}];function xt(t){const e=t.replace("#","");return{r:parseInt(e.substring(0,2),16),g:parseInt(e.substring(2,4),16),b:parseInt(e.substring(4,6),16)}}function $t(t,e,i){if(t.startsWith("rgba")||e.startsWith("rgba")){const r=t=>{const e=t.match(/[\d.]+\)$/);return e?parseFloat(e[0]):1},s=r(t);return`rgba(255, 255, 255, ${s+(r(e)-s)*i})`}const r=xt(t),s=xt(e);return function(t,e,i){const r=t=>{const e=Math.max(0,Math.min(255,Math.round(t))).toString(16);return 1===e.length?"0"+e:e};return`#${r(t)}${r(e)}${r(i)}`}(r.r+(s.r-r.r)*i,r.g+(s.g-r.g)*i,r.b+(s.b-r.b)*i)}function kt(t){const e=Math.abs(t);return e<20?0:e<1e3?16:6}function wt(t){const e=Math.abs(t);return e>=1e3?`${(e/1e3).toFixed(1)} kW`:`${Math.round(e)} W`}function bt(t,e,i,r=1,s="#ffffff",o=.9){return W`
    <g transform="translate(${e}, ${i}) scale(${r})" opacity="${o}" style="transition: opacity 1.5s ease;">
      <g class="${t}">
        <path d="M 20,40 Q 10,25 25,15 Q 40,5 60,15 Q 80,0 100,15 Q 120,5 130,25 Q 140,40 120,45 Q 100,50 60,45 Q 20,50 20,40 Z" fill="rgba(15, 23, 42, 0.15)" transform="translate(0, 4) scale(1.02)" />
        <path d="M 20,40 Q 10,25 25,15 Q 40,5 60,15 Q 80,0 100,15 Q 120,5 130,25 Q 140,40 120,45 Q 100,50 60,45 Q 20,50 20,40 Z" fill="${s}" style="transition: fill 1.5s ease;" />
      </g>
    </g>
  `}function mt({timeHour:t,timeOfDay:e,solar:i,solarToday:r,load:s,batteryPower:o,soc:n,charger:a,grid:l,showSolar:c,showBattery:h,showEV:d,weather:f="sunny",sunriseHour:p=6,sunsetHour:y=21,gridImportToday:u=null,gridExportToday:g=null,homeToday:x=null,batteryChargeToday:$=null,batteryDischargeToday:k=null,evToday:w=null,onNodeClick:b}){let m=t;m=t>=p&&t<=y?6+(t-p)/(y-p)*15:t>y?21+(t-y)/(24-y)*3:t/p*6;const v=o<-.05,_=o>.05,A=l>.05,E=l<-.05,S=a>.1,C=i>20,M=s>20,P=v||_&&E?ut.battery:ut.batteryD,T=A?ut.gridI:ut.gridE,L=function(t){let e=gt[0],i=gt[gt.length-1];for(let r=0;r<gt.length-1;r++)if(t>=gt[r].hour&&t<=gt[r+1].hour){e=gt[r],i=gt[r+1];break}const r=i.hour-e.hour,s=0===r?0:(t-e.hour)/r;return{top:$t(e.top,i.top,s),horizon:$t(e.horizon,i.horizon,s),stars:e.stars+(i.stars-e.stars)*s,lights:e.lights+(i.lights-e.lights)*s,clouds:$t(e.clouds,i.clouds,s)}}(m),O=L.lights>.05||"rainy"===f||"lightning"===f;let R=L.top,H=L.horizon,N=L.clouds,U="night"===e?.18:.48;"cloudy"===f?(R=$t(L.top,"#475569",.5),H=$t(L.horizon,"#94a3b8",.5),N="rgba(241, 245, 249, 0.55)",U=.65):"rainy"===f||"lightning"===f?(R=$t(L.top,"#1e293b",.75),H=$t(L.horizon,"#475569",.75),N="rgba(100, 116, 139, 0.5)",U=.65):"snowy"===f?(R=$t(L.top,"#cbd5e1",.4),H=$t(L.horizon,"#f1f5f9",.4),N="rgba(255, 255, 255, 0.6)",U=.7):"foggy"===f&&(R=$t(L.top,"#94a3b8",.6),H=$t(L.horizon,"#cbd5e1",.6),N="rgba(226, 232, 240, 0.4)",U=.5);const G={cx:480,cy:600};let D=0,z="#fef08a",I="rgba(254, 240, 138, 0.65)";if(m>=6&&m<=21&&"rainy"!==f&&"lightning"!==f&&"cloudy"!==f){const t=(m-6)/15;G.cx=1080*t-60,G.cy=576-528*Math.sin(t*Math.PI),D=Math.max(0,Math.min(1,1.5*Math.sin(t*Math.PI)));const e=Math.sin(t*Math.PI);z=$t("#ea580c","#fef08a",e),I=$t("rgba(234, 88, 12, 0.65)","rgba(254, 240, 138, 0.75)",e)}const F={cx:480,cy:600};let V=0;if((m>21||m<6)&&"rainy"!==f&&"lightning"!==f&&"cloudy"!==f){const t=m>21?(m-21)/9:(m+3)/9;F.cx=1080*t-60,F.cy=576-480*Math.sin(t*Math.PI),V=Math.max(0,Math.min(.9,1.8*Math.sin(t*Math.PI)))}const B=m>=8&&m<=18,j=B?"url(#window-day)":O?"url(#window-night)":"url(#window-dark)",Q=B?"none":O?"drop-shadow(0 0 6px rgba(251, 191, 36, 0.45))":"none",Z=345,X=420;let q=E?"↑ Teruglevering":A?"↓ Import":"Standby";null!==u&&null!==g?q=`↓${u.toFixed(1)} ↑${g.toFixed(1)} kWh`:null!==u?q=`Import: ${u.toFixed(1)} kWh`:null!==g&&(q=`Terug: ${g.toFixed(1)} kWh`);const Y=null!==x?`Vandaag: ${x.toFixed(1)} kWh`:M?"Actief":"Standby";let K=`SoC: ${n}%`;null!==$&&null!==k?K=`SoC: ${n}% (↓${$.toFixed(1)} ↑${k.toFixed(1)})`:null!==$&&(K=`SoC: ${n}% (↓${$.toFixed(1)})`);const J=null!==w?`Vandaag: ${w.toFixed(1)} kWh`:S?"Bezig met laden":"Standby",tt=[{id:"grid",title:"Stroomnet",value:wt(l),sub:q,color:T.stroke,active:A||E},{id:"home",title:"Huisverbruik",value:wt(s),sub:Y,color:ut.home.stroke,active:M}];h&&tt.push({id:"battery",title:"Thuisaccu",value:wt(o),sub:K,color:P.stroke,active:v||_}),d&&tt.push({id:"ev",title:"Laadpaal (EV)",value:wt(a),sub:J,color:ut.ev.stroke,active:S});const et=(960-170*tt.length)/(tt.length+1),it=(t,e,i,r,s,o=!1)=>W`
      <path d="${t}" class="flowCable" />
      <path d="${t}" fill="none" stroke="${r}" stroke-width="3" stroke-linecap="round"
        opacity="${e?.25:0}"
        style="filter: ${e?"blur(3.5px)":"none"}; transition: stroke 0.6s ease, opacity 0.6s ease;" />
      <path d="${t}" fill="none" stroke="${r}" stroke-width="1.2" stroke-linecap="round"
        opacity="${e?.55:0}"
        style="transition: stroke 0.6s ease, opacity 0.6s ease;" />
      ${((t,e,i,r,s,o=!1)=>e&&0!==i?W`
      ${Array.from({length:3}).map((e,n)=>W`
        <circle r="3.5" fill="${r}"
          style="
            offset-path: path('${t}');
            animation: moveParticle ${i}s linear infinite;
            animation-play-state: running;
            animation-delay: ${-n/3*i}s;
            animation-direction: ${o?"reverse":"normal"};
            filter: drop-shadow(0 0 5px ${s}) drop-shadow(0 0 2px ${r});
          " />
      `)}
    `:W``)(t,e,i,r,s,o)}
    `,rt=405-n/100*40;return W`
    <svg viewBox="0 0 960 590" xmlns="http://www.w3.org/2000/svg">
      <defs>
        <!-- Sky gradient -->
        <linearGradient id="sky-grad" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stop-color="${R}" />
          <stop offset="100%" stop-color="${H}" />
        </linearGradient>

        <!-- Solar panel gradient -->
        <linearGradient id="solar-panel-grad" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stop-color="#1e1b4b" />
          <stop offset="100%" stop-color="#312e81" />
        </linearGradient>

        <!-- Reflective daytime window gradient -->
        <linearGradient id="window-day" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0%" stop-color="#94a3b8" />
          <stop offset="35%" stop-color="#cbd5e1" />
          <stop offset="40%" stop-color="#f8fafc" />
          <stop offset="45%" stop-color="#cbd5e1" />
          <stop offset="80%" stop-color="#64748b" />
          <stop offset="100%" stop-color="#475569" />
        </linearGradient>

        <!-- Warm amber night window -->
        <linearGradient id="window-night" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stop-color="#fef3c7" />
          <stop offset="100%" stop-color="#fcd34d" />
        </linearGradient>

        <!-- Dark window -->
        <linearGradient id="window-dark" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stop-color="#1e293b" />
          <stop offset="100%" stop-color="#0f172a" />
        </linearGradient>

        <!-- Brick texture pattern -->
        <pattern id="brick-pat" width="60" height="40" patternUnits="userSpaceOnUse">
          <!-- Layer 1: full orange-brown field -->
          <rect width="60" height="40" fill="#8b4513" />
          <!-- Brick row 1 (offset 0) -->
          <rect x="0"  y="1"  width="27" height="17" fill="#c1440e" rx="0.5" />
          <rect x="31" y="1"  width="29" height="17" fill="#b33a0a" rx="0.5" />
          <!-- Brick row 2 (offset half) -->
          <rect x="0"  y="22" width="13" height="17" fill="#bf3e0c" rx="0.5" />
          <rect x="16" y="22" width="28" height="17" fill="#c64812" rx="0.5" />
          <rect x="48" y="22" width="12" height="17" fill="#b83c0c" rx="0.5" />
          <!-- Mortar lines -->
          <line x1="0"  y1="19" x2="60" y2="19" stroke="#5a3214" stroke-width="1.5" />
          <line x1="0"  y1="20" x2="60" y2="20" stroke="#5a3214" stroke-width="0.5" opacity="0.4" />
          <line x1="0"  y1="40" x2="60" y2="40" stroke="#5a3214" stroke-width="1.5" />
          <line x1="29" y1="1"  x2="29" y2="19" stroke="#5a3214" stroke-width="1.5" />
          <line x1="14" y1="22" x2="14" y2="39" stroke="#5a3214" stroke-width="1.5" />
          <line x1="46" y1="22" x2="46" y2="39" stroke="#5a3214" stroke-width="1.5" />
        </pattern>

        <!-- Roof tile pattern -->
        <pattern id="tiles-pat" width="12" height="12" patternUnits="userSpaceOnUse">
          <rect width="12" height="12" fill="#1e293b" />
          <path d="M 0,12 Q 6,0 12,12" fill="none" stroke="#0f172a" stroke-width="1.2" />
        </pattern>

        <!-- Clip path for the whole scene -->
        <clipPath id="scene-clip">
          <rect width="960" height="590" rx="12" ry="12" />
        </clipPath>
      </defs>

      <g clip-path="url(#scene-clip)">
        <!-- Sky background -->
        <rect width="960" height="590" fill="url(#sky-grad)" />

        <!-- Stars -->
        ${L.stars>.05&&"rainy"!==f&&"lightning"!==f&&"cloudy"!==f?W`
          <g opacity="${L.stars}" style="pointer-events: none;">
            <circle cx="96"  cy="60"  r="1.2" class="starFast" fill="#ffffff" />
            <circle cx="216" cy="114" r="1.5" fill="#ffffff" />
            <circle cx="408" cy="48"  r="1.0" class="starFast" fill="#ffffff" />
            <circle cx="576" cy="132" r="1.8" fill="#ffffff" />
            <circle cx="744" cy="78"  r="1.2" class="starFast" fill="#ffffff" />
            <circle cx="876" cy="144" r="1.0" fill="#ffffff" />
            <circle cx="312" cy="90"  r="1.4" class="starMed"  fill="#ffffff" />
            <circle cx="660" cy="55"  r="1.1" class="starSlow" fill="#ffffff" />
          </g>
        `:""}

        <!-- Dynamic Sun -->
        ${D>0?W`
          <g style="pointer-events: none;">
            <circle cx="${G.cx}" cy="${G.cy}" r="54" fill="${z}" opacity="${.15*D}" style="filter: blur(8px);" />
            <circle cx="${G.cx}" cy="${G.cy}" r="26" fill="${z}" opacity="${D}" style="filter: drop-shadow(0 0 14px ${I});" />
          </g>
        `:""}

        <!-- Dynamic Moon -->
        ${V>0?W`
          <g style="pointer-events: none;" opacity="${V}">
            <circle cx="${F.cx}" cy="${F.cy}" r="30" fill="#e2e8f0" opacity="0.15" style="filter: blur(4px);" />
            <circle cx="${F.cx}" cy="${F.cy}" r="17" fill="#f1f5f9" />
            <circle cx="${F.cx+6}" cy="${F.cy-4}" r="16" fill="url(#sky-grad)" />
          </g>
        `:""}

        <!-- Cloud layers -->
        ${bt("cloud1",72,36,.65,N,.75*U)}
        ${bt("cloud2",432,84,.85,N,.85*U)}
        ${bt("cloud3",744,132,1,N,U)}
        ${"cloudy"===f||"rainy"===f||"lightning"===f?W`
          ${bt("cloud2",240,60,.75,N,.8*U)}
          ${bt("cloud1",588,108,.9,N,.8*U)}
        `:""}

        <!-- Lightning bolt -->
        ${"lightning"===f?W`
          <path d="M 504,72 L 468,180 L 516,180 L 444,312 L 480,312 L 420,456" class="lightningBolt" />
        `:""}

        <!-- Falling precipitation -->
        ${"rainy"===f?W`
    <g style="pointer-events: none;">
      ${Array.from({length:18}).map((t,e)=>W`
        <line x1="${25+55*e}" y1="0" x2="${8+55*e}" y2="40"
          class="rainDrop"
          style="animation-delay: ${e%5*.12}s; animation-duration: ${.6+e%3*.1}s;" />
      `)}
    </g>
  `:""}
        ${"snowy"===f?W`
    <g style="pointer-events: none;">
      ${Array.from({length:22}).map((t,e)=>W`
        <circle cx="${25+45*e}" cy="0" r="${1.8+e%3*.6}"
          class="snowFlake"
          style="animation-delay: ${e%6*.5}s; animation-duration: ${4.5+e%4*.7}s;" />
      `)}
    </g>
  `:""}

        <!-- Fog overlay -->
        ${"foggy"===f?W`
          <rect width="960" height="590" fill="rgba(226, 232, 240, 0.22)" style="filter: blur(5px); pointer-events: none;" />
        `:""}

        <!-- ════════════════════════════════════════════════════════════════ -->
        <!-- SCENE: Ground, Mast, House, Battery, Charger, EV               -->
        <!-- All Card-2 coordinates scaled ×1.2 via SVG transform group     -->
        <!-- ════════════════════════════════════════════════════════════════ -->
        <g transform="scale(1.2)">

          <!-- Ground (full width) -->
          <rect x="0" y="480" width="800" height="120" fill="#0f3f26" />
          <!-- Driveway -->
          <rect x="490" y="480" width="310" height="20" fill="#334155" />

          <!-- High-Voltage Electricity Mast -->
          <g id="electricity-mast" transform="translate(-15, -22) scale(0.9)" class="interactiveGroup gridGroup" @click=${()=>b("grid")}>
            <rect x="63" y="474" width="14" height="8" fill="#64748b" stroke="#475569" stroke-width="1.2" rx="1" />
            <rect x="163" y="474" width="14" height="8" fill="#64748b" stroke="#475569" stroke-width="1.2" rx="1" />

            <!-- Sagging HV transmission lines -->
            <path d="M -80,210 Q -15,230 50,250" fill="none" stroke="#334155" stroke-width="1.8" opacity="0.65" />
            <path d="M -80,215 Q 0,235 85,250" fill="none" stroke="#334155" stroke-width="1.8" opacity="0.65" />
            <path d="M -80,210 Q 30,230 155,250" fill="none" stroke="#334155" stroke-width="1.8" opacity="0.65" />
            <path d="M -80,215 Q 50,235 190,250" fill="none" stroke="#334155" stroke-width="1.8" opacity="0.65" />
            <path d="M -80,130 Q 20,150 120,170" fill="none" stroke="#475569" stroke-width="1.0" opacity="0.5" />

            <g stroke="#475569" stroke-width="2.8" fill="none" stroke-linecap="round" stroke-linejoin="round">
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

              <!-- Insulator strings -->
              <path d="M 50,160 L 50,180" stroke="#64748b" stroke-width="1.5" />
              <ellipse cx="50" cy="166" rx="6" ry="2.5" fill="#a5f3fc" stroke="#3b82f6" stroke-width="0.5" opacity="0.85" />
              <ellipse cx="50" cy="171" rx="6" ry="2.5" fill="#a5f3fc" stroke="#3b82f6" stroke-width="0.5" opacity="0.85" />
              <ellipse cx="50" cy="176" rx="6" ry="2.5" fill="#a5f3fc" stroke="#3b82f6" stroke-width="0.5" opacity="0.85" />

              <path d="M 85,160 L 85,180" stroke="#64748b" stroke-width="1.5" />
              <ellipse cx="85" cy="166" rx="6" ry="2.5" fill="#a5f3fc" stroke="#3b82f6" stroke-width="0.5" opacity="0.85" />
              <ellipse cx="85" cy="171" rx="6" ry="2.5" fill="#a5f3fc" stroke="#3b82f6" stroke-width="0.5" opacity="0.85" />
              <ellipse cx="85" cy="176" rx="6" ry="2.5" fill="#a5f3fc" stroke="#3b82f6" stroke-width="0.5" opacity="0.85" />

              <path d="M 155,160 L 155,180" stroke="#64748b" stroke-width="1.5" />
              <ellipse cx="155" cy="166" rx="6" ry="2.5" fill="#a5f3fc" stroke="#3b82f6" stroke-width="0.5" opacity="0.85" />
              <ellipse cx="155" cy="171" rx="6" ry="2.5" fill="#a5f3fc" stroke="#3b82f6" stroke-width="0.5" opacity="0.85" />
              <ellipse cx="155" cy="176" rx="6" ry="2.5" fill="#a5f3fc" stroke="#3b82f6" stroke-width="0.5" opacity="0.85" />

              <path d="M 190,160 L 190,180" stroke="#64748b" stroke-width="1.5" />
              <ellipse cx="190" cy="166" rx="6" ry="2.5" fill="#a5f3fc" stroke="#3b82f6" stroke-width="0.5" opacity="0.85" />
              <ellipse cx="190" cy="171" rx="6" ry="2.5" fill="#a5f3fc" stroke="#3b82f6" stroke-width="0.5" opacity="0.85" />
              <ellipse cx="190" cy="176" rx="6" ry="2.5" fill="#a5f3fc" stroke="#3b82f6" stroke-width="0.5" opacity="0.85" />
            </g>
          </g>

          <!-- Transformer/Distribution Box -->
          <g id="grid-transformer-box">
            <rect x="77" y="435" width="32" height="45" fill="#334155" stroke="#1e293b" stroke-width="1.8" rx="3" />
            <line x1="93" y1="435" x2="93" y2="480" stroke="#1e293b" stroke-width="1" />
            <circle cx="85" cy="460" r="1.5" fill="#1e293b" />
            <rect x="83" y="445" width="20" height="12" fill="#fef08a" stroke="#ca8a04" stroke-width="0.8" rx="1" />
            <polygon points="92,447 96,447 93,451 97,451 91,455 94,451 91,451" fill="#ca8a04" />
          </g>

          <!-- ── LEFT WING ── -->
          <g id="left-wing" class="interactiveGroup homeGroup" @click=${()=>b("home")}>
            <rect x="180" y="370" width="140" height="110" fill="url(#brick-pat)" stroke="#0f172a" stroke-width="2" />
            <polygon points="175,370 205,330 320,330 320,370" fill="url(#tiles-pat)" stroke="#0f172a" stroke-width="2" />
            <!-- Roof trim left edge -->
            <line x1="172" y1="373" x2="205" y2="328" stroke="#0f172a" stroke-width="12" stroke-linecap="round" />
            <line x1="172" y1="373" x2="205" y2="328" stroke="#1e293b" stroke-width="8"  stroke-linecap="round" />
            <!-- Roof trim top edge -->
            <line x1="205" y1="330" x2="320" y2="330" stroke="#0f172a" stroke-width="8" />
            <line x1="205" y1="330" x2="320" y2="330" stroke="#1e293b" stroke-width="4" />
            <!-- Window -->
            <rect x="230" y="390" width="40" height="45"
              fill="${j}" stroke="#0f172a" stroke-width="2"
              style="filter: ${Q}; transition: fill 0.5s ease, filter 0.5s ease;" />
            <line x1="250" y1="390" x2="250" y2="435" stroke="#0f172a" stroke-width="1.2" />
            <line x1="230" y1="412.5" x2="270" y2="412.5" stroke="#0f172a" stroke-width="1.2" />
          </g>

          <!-- ── RIGHT WING ── -->
          <g id="right-wing" class="interactiveGroup homeGroup" @click=${()=>b("home")}>
            <polygon points="380,480 380,270 500,130 680,340 680,480" fill="url(#brick-pat)" stroke="#0f172a" stroke-width="2" />
            <!-- Roof trim left slope -->
            <line x1="380" y1="270" x2="500" y2="130" stroke="#0f172a" stroke-width="12" stroke-linecap="round" />
            <line x1="380" y1="270" x2="500" y2="130" stroke="#1e293b" stroke-width="8"  stroke-linecap="round" />
            <!-- Roof trim right slope -->
            <line x1="692" y1="354" x2="500" y2="130" stroke="#0f172a" stroke-width="12" stroke-linecap="round" />
            <line x1="692" y1="354" x2="500" y2="130" stroke="#1e293b" stroke-width="8"  stroke-linecap="round" />
            <!-- Downstairs windows (2) -->
            <rect x="465" y="385" width="40" height="45"
              fill="${j}" stroke="#0f172a" stroke-width="2"
              style="filter: ${Q}; transition: fill 0.5s ease, filter 0.5s ease;" />
            <line x1="485" y1="385" x2="485" y2="430" stroke="#0f172a" stroke-width="1.2" />
            <line x1="465" y1="407.5" x2="505" y2="407.5" stroke="#0f172a" stroke-width="1.2" />

            <rect x="555" y="385" width="40" height="45"
              fill="${j}" stroke="#0f172a" stroke-width="2"
              style="filter: ${Q}; transition: fill 0.5s ease, filter 0.5s ease;" />
            <line x1="575" y1="385" x2="575" y2="430" stroke="#0f172a" stroke-width="1.2" />
            <line x1="555" y1="407.5" x2="595" y2="407.5" stroke="#0f172a" stroke-width="1.2" />

            <!-- Upstairs window -->
            <rect x="480" y="280" width="40" height="40"
              fill="${j}" stroke="#0f172a" stroke-width="2"
              style="filter: ${Q}; transition: fill 0.5s ease, filter 0.5s ease;" />
            <line x1="500" y1="280" x2="500" y2="320" stroke="#0f172a" stroke-width="1.2" />
            <line x1="480" y1="300" x2="520" y2="300" stroke="#0f172a" stroke-width="1.2" />
          </g>

          <!-- ── CENTER ENTRANCE GABLE ── -->
          <g id="center-portal" class="interactiveGroup homeGroup" @click=${()=>b("home")}>
            <polygon points="320,480 320,340 380,270 440,340 440,480" fill="url(#brick-pat)" stroke="#0f172a" stroke-width="2" />
            <!-- Roof trim -->
            <line x1="308" y1="354" x2="380" y2="270" stroke="#0f172a" stroke-width="12" stroke-linecap="round" />
            <line x1="308" y1="354" x2="380" y2="270" stroke="#1e293b" stroke-width="8"  stroke-linecap="round" />
            <line x1="452" y1="354" x2="380" y2="270" stroke="#0f172a" stroke-width="12" stroke-linecap="round" />
            <line x1="452" y1="354" x2="380" y2="270" stroke="#1e293b" stroke-width="8"  stroke-linecap="round" />
            <!-- Front door – very dark green -->
            <rect x="360" y="395" width="40" height="85" fill="#052e16" stroke="#021b0d" stroke-width="2" />
            <circle cx="390" cy="435" r="2" fill="#fbbf24" />
          </g>

          <!-- ── SOLAR PANELS (conditional) ── -->
          ${c?W`
            <g id="solar-panels" class="interactiveGroup solarGroup" @click=${t=>{t.stopPropagation(),b("solar")}}>
              <g transform="translate(320, 340) rotate(-49.4)">
                <!-- Mounting rods -->
                <line x1="25"  y1="-7" x2="25"  y2="0" stroke="#0f172a" stroke-width="2" />
                <line x1="25"  y1="-7" x2="25"  y2="0" stroke="#475569" stroke-width="1.2" />
                <line x1="75"  y1="-7" x2="75"  y2="0" stroke="#0f172a" stroke-width="2" />
                <line x1="75"  y1="-7" x2="75"  y2="0" stroke="#475569" stroke-width="1.2" />
                <line x1="125" y1="-7" x2="125" y2="0" stroke="#0f172a" stroke-width="2" />
                <line x1="125" y1="-7" x2="125" y2="0" stroke="#475569" stroke-width="1.2" />
                <line x1="175" y1="-7" x2="175" y2="0" stroke="#0f172a" stroke-width="2" />
                <line x1="175" y1="-7" x2="175" y2="0" stroke="#475569" stroke-width="1.2" />
                <line x1="225" y1="-7" x2="225" y2="0" stroke="#0f172a" stroke-width="2" />
                <line x1="225" y1="-7" x2="225" y2="0" stroke="#475569" stroke-width="1.2" />
                <!-- Panel body -->
                <rect x="10" y="-13" width="235" height="6" fill="url(#solar-panel-grad)" stroke="#1e40af" stroke-width="1.2" rx="1.5" />
                <!-- Grid lines -->
                <line x1="10"    y1="-10" x2="245"   y2="-10" stroke="#3b82f6" stroke-width="0.6" opacity="0.4" />
                <line x1="33.5"  y1="-13" x2="33.5"  y2="-7"  stroke="#3b82f6" stroke-width="0.6" opacity="0.4" />
                <line x1="57"    y1="-13" x2="57"    y2="-7"  stroke="#3b82f6" stroke-width="0.6" opacity="0.4" />
                <line x1="80.5"  y1="-13" x2="80.5"  y2="-7"  stroke="#3b82f6" stroke-width="0.6" opacity="0.4" />
                <line x1="104"   y1="-13" x2="104"   y2="-7"  stroke="#3b82f6" stroke-width="0.6" opacity="0.4" />
                <line x1="127.5" y1="-13" x2="127.5" y2="-7"  stroke="#3b82f6" stroke-width="0.6" opacity="0.4" />
                <line x1="151"   y1="-13" x2="151"   y2="-7"  stroke="#3b82f6" stroke-width="0.6" opacity="0.4" />
                <line x1="174.5" y1="-13" x2="174.5" y2="-7"  stroke="#3b82f6" stroke-width="0.6" opacity="0.4" />
                <line x1="198"   y1="-13" x2="198"   y2="-7"  stroke="#3b82f6" stroke-width="0.6" opacity="0.4" />
                <line x1="221.5" y1="-13" x2="221.5" y2="-7"  stroke="#3b82f6" stroke-width="0.6" opacity="0.4" />
              </g>
            </g>
          `:""}

          <!-- ── INVERTER (Omvormer) ── -->
          <g id="inverter">
            <rect x="373" y="295" width="14" height="18" fill="#1e293b" stroke="#475569" stroke-width="1" rx="1.5" />
            <rect x="376" y="306" width="8" height="4" fill="#0f172a" rx="0.5" />
            <circle cx="380" cy="301" r="1.5" fill="#f59e0b" />
          </g>

          <!-- ── METERKAST (fuse box) ── -->
          <rect x="${340}" y="${410}" width="10" height="20" fill="#1e293b" rx="1" />
          <circle cx="${Z}" cy="${X}" r="2.5" fill="#10b981" />

          <!-- ── BATTERY (conditional) ── -->
          ${h?W`
            <g id="house-battery" class="interactiveGroup batteryGroup" @click=${t=>{t.stopPropagation(),b("battery")}}>
              <rect x="280" y="410" width="30" height="70" fill="#f8fafc" stroke="#cbd5e1" stroke-width="1.5" rx="3" />
              <rect x="285" y="418" width="20" height="10" fill="#000" rx="1.5" />
              <text x="295" y="426" fill="#10b981" font-size="8" font-weight="bold" text-anchor="middle">${n}%</text>
              <!-- SoC bar track -->
              <rect x="294" y="435" width="2" height="40" fill="rgba(0,0,0,0.15)" rx="0.5" />
              <!-- SoC bar fill -->
              <rect x="294" y="${rt}" width="2" height="${475-rt}" fill="${n<20?"#ef4444":v?"#10b981":"#ef4444"}" rx="0.5" />
            </g>
          `:""}

          <!-- ── EV CHARGER (conditional) ── -->
          ${d?W`
            <g id="ev-charger" class="interactiveGroup evGroup" @click=${t=>{t.stopPropagation(),b("ev")}}>
              <!-- Charging post – slightly thicker than Card-2 (width 14 instead of 10) -->
              <rect x="448" y="425" width="14" height="55" fill="#1e293b" rx="2" />
              <rect x="443" y="415" width="24" height="20" fill="#334155" stroke="#1e293b" stroke-width="1" rx="3" />
              <circle cx="455" cy="425" r="4"
                fill="${S?"#a855f7":"#10b981"}"
                style="filter: ${S?"drop-shadow(0 0 6px #a855f7)":"none"}; transition: fill 0.5s ease;" />
              <!-- Charging cable -->
              <path d="M 455,440 C 460,460 475,470 495,465" fill="none" stroke="#a855f7" stroke-width="2.5" stroke-dasharray="4,3" />
            </g>

            <!-- EV Car (drawn SVG to avoid image dependency) -->
            <g id="ev-car" class="interactiveGroup evGroup" opacity="${S?1:.4}" style="transition: opacity 0.6s ease;" @click=${t=>{t.stopPropagation(),b("ev")}}>
              <g transform="translate(490, 430)">
                <!-- Car shadow -->
                <ellipse cx="90" cy="55" rx="90" ry="6" fill="rgba(0,0,0,0.4)" />
                <!-- Car body -->
                <path d="M 0,44 C 0,44 4,28 18,28 C 32,28 50,8 75,6 C 100,4 118,16 132,28 C 148,40 158,44 160,44 L 158,52 L 2,52 Z"
                  fill="#475569" stroke="rgba(255,255,255,0.2)" stroke-width="1" />
                <!-- Windows -->
                <path d="M 32,28 C 44,14 68,10 86,10 C 102,10 114,22 120,27 L 116,37 L 28,37 Z" fill="#0f172a" opacity="0.85" />
                <path d="M 38,29 L 68,29 L 68,36 L 34,36 Z" fill="rgba(255,255,255,0.12)" />
                <path d="M 72,29 L 106,29 L 112,36 L 72,36 Z" fill="rgba(255,255,255,0.12)" />
                <!-- Headlight -->
                <path d="M 0,44 C 4,44 7,46 9,48 L 0,50 Z" fill="#e0f2fe" style="filter: drop-shadow(0 0 5px #00f5ff);" />
                <!-- Taillight -->
                <path d="M 160,44 C 157,44 156,46 155,48 L 160,50 Z" fill="#ef4444" style="filter: drop-shadow(0 0 3px #ef4444);" />
                <!-- Front wheel -->
                <circle cx="32" cy="50" r="16" fill="#090d16" />
                <circle cx="32" cy="50" r="10" fill="#475569" stroke="#cbd5e1" stroke-width="1.5" />
                ${Array.from({length:6}).map((t,e)=>{const i=e*Math.PI/3;return W`<line x1="32" y1="50" x2="${32+10*Math.cos(i)}" y2="${50+10*Math.sin(i)}" stroke="#cbd5e1" stroke-width="1.2" />`})}
                <!-- Rear wheel -->
                <circle cx="118" cy="50" r="16" fill="#090d16" />
                <circle cx="118" cy="50" r="10" fill="#475569" stroke="#cbd5e1" stroke-width="1.5" />
                ${Array.from({length:6}).map((t,e)=>{const i=e*Math.PI/3;return W`<line x1="118" y1="50" x2="${118+10*Math.cos(i)}" y2="${50+10*Math.sin(i)}" stroke="#cbd5e1" stroke-width="1.2" />`})}
              </g>
            </g>
          `:""}

        </g>
        <!-- End of scale(1.2) group -->

        <!-- ════════════════════════════════════════════════════════════════ -->
        <!-- FLOW CABLES: drawn at full 960px scale using scaled coordinates -->
        <!-- Multiply Card-2 cable coords by 1.2 to match scaled scene      -->
        <!-- ════════════════════════════════════════════════════════════════ -->
        ${c?it("M 456,360 L 456,408 L 414,408 L 414,504",C,kt(i),ut.solar.stroke,ut.solar.glow):""}

        ${it("M 134.4,561.6 L 134.4,636 L 414,636 L 414,504",A||E,kt(l),T.stroke,T.glow,E)}

        ${h?it("M 372,504 L 414,504",v||_,kt(o),P.stroke,P.glow,v):""}

        ${d?it(`M 414,504 L 414,636 L ${546*1.2},636 L ${546*1.2},570`,S,kt(a),ut.ev.stroke,ut.ev.glow):""}

        <!-- ════════════════════════════════════════════════════════════════ -->
        <!-- SOLAR HUD card (top right sky area)                            -->
        <!-- ════════════════════════════════════════════════════════════════ -->
        ${c?W`
          <g class="interactiveGroup solarGroup" @click=${()=>b("solar")}>
            <g transform="translate(696, 90)">
              <rect x="0" y="0" width="200" height="65"
                class="hudCard ${C?"hudCardActive":""}"
                rx="8" ry="8"
                style="${C?`color: ${ut.solar.stroke}`:""}" />
              <text x="12" y="20" class="hudTitle">Zonnepanelen</text>
              <text x="12" y="39" class="hudValue ${C?"hudActiveText":""}"
                style="${C?`color: ${ut.solar.stroke}`:""}">
                ${C?wt(i):"—"}
              </text>
              <text x="12" y="53" class="hudSub">
                ${null!==r?`Vandaag: ${r.toFixed(1)} kWh`:C?"Opwek actief":"Geen opwek"}
              </text>
            </g>
          </g>
        `:""}

        <!-- ════════════════════════════════════════════════════════════════ -->
        <!-- BOTTOM HUD CARDS (grid, home, battery, ev)                     -->
        <!-- ════════════════════════════════════════════════════════════════ -->
        ${tt.map((t,e)=>W`
            <g class="interactiveGroup" @click=${()=>b(t.id)}>
              <g transform="translate(${et+e*(170+et)}, 510)">
                <rect x="0" y="0" width="170" height="65"
                  class="hudCard ${t.active?"hudCardActive":""}"
                  rx="8" ry="8"
                  style="${t.active?`color: ${t.color}`:""}" />
                <text x="12" y="20" class="hudTitle">${t.title}</text>
                <text x="12" y="39" class="hudValue ${t.active?"hudActiveText":""}"
                  style="${t.active?`color: ${t.color}`:""}">
                  ${t.active?t.value:"—"}
                </text>
                <text x="12" y="53" class="hudSub">${t.sub}</text>
              </g>
            </g>
          `)}
      </g>
    </svg>
  `}class vt extends lt{constructor(){super(...arguments),this.selectedNode=null}static getStubConfig(){return{title:"Energieverloop",entities:{}}}setConfig(t){if(!t)throw new Error("Ongeldige configuratie");this.config=t}getEntityValue(t){if(!t||!this.hass)return 0;const e=t=>{const e=this.hass?.states[t];if(!e)return 0;const i=parseFloat(e.state);return isNaN(i)?0:i};return Array.isArray(t)?t.reduce((t,i)=>t+e(i),0):e(t)}handleNodeClick(t){console.info(`[energy-flow-card] Click registered on node: ${t}`),this.selectedNode=this.selectedNode===t?null:t;let e=t;"battery"===t?e=this.config?.entities.battery_power?"battery_power":"battery_soc":"home"===t?e="load":"ev"===t?e="charger":"grid"===t?e=this.config?.entities.grid?"grid":"solar":"solar"===t&&(e=this.config?.entities.solar_energy_today?"solar_energy_today":"solar");const i=this.config?.entities?this.config.entities[e]:void 0,r=Array.isArray(i)?i[0]:i;if(console.info(`[energy-flow-card] Node '${t}' mapped to key '${e}', resolved entity ID: '${r}'`),r){console.info(`[energy-flow-card] Dispatching 'hass-more-info' event for entity: ${r}`);const t=new CustomEvent("hass-more-info",{detail:{entityId:r},bubbles:!0,composed:!0});this.dispatchEvent(t)}else console.warn(`[energy-flow-card] Could not dispatch popup: No entity configured for node '${t}'`)}render(){if(!this.config||!this.hass)return V`<p style="color: red; padding: 16px;">Wachten op Home Assistant...</p>`;const{entities:t}=this.config,e=new Date,i=e.getHours()+e.getMinutes()/60;let r="afternoon";r=i>=5&&i<9?"morning":i>=9&&i<18?"afternoon":i>=18&&i<22?"evening":"night";const s=this.getEntityValue(t.solar),o=this.getEntityValue(t.load),n=this.getEntityValue(t.battery_power),a=t.battery_soc?this.getEntityValue(t.battery_soc):0,l=this.getEntityValue(t.charger),c=t=>{if(!t)return null;const e=this.hass?.states[t];if(!e)return null;const i=parseFloat(e.state);return isNaN(i)?null:i},h=c(t.solar_energy_today),d=c(t.grid_import_today),f=c(t.grid_export_today),p=c(t.home_today),y=c(t.battery_charge_today),u=c(t.battery_discharge_today),g=c(t.ev_today);let x="sunny";t.weather&&this.hass?.states[t.weather]&&(x=this.hass.states[t.weather].state);let $=6,k=21;const w=this.hass?.states["sun.sun"];if(w)try{const t=new Date(w.attributes.next_rising),e=new Date(w.attributes.next_setting);$=t.getHours()+t.getMinutes()/60,k=e.getHours()+e.getMinutes()/60}catch(t){console.warn("[energy-flow-card] Fout bij parsen van sun.sun tijden:",t)}let b=0;b=t.grid?this.getEntityValue(t.grid):o+l-s-n;const m=!!t.solar,v=!!t.battery_power,_=!!t.charger;return V`
      <div class="card-container">
        ${this.config.title?V`
          <div class="card-header">
            <div class="card-title">${this.config.title}</div>
          </div>
        `:""}

        <div class="sceneWrapper">
          ${mt({houseStyle:this.config.house_style,carType:this.config.car_type||"hatchback",timeHour:i,timeOfDay:r,solar:s,solarToday:h,load:o,batteryPower:n,soc:a,charger:l,grid:b,showSolar:m,showBattery:v,showEV:_,weather:x,sunriseHour:$,sunsetHour:k,gridImportToday:d,gridExportToday:f,homeToday:p,batteryChargeToday:y,batteryDischargeToday:u,evToday:g,onNodeClick:t=>this.handleNodeClick(t)})}
        </div>
      </div>
    `}getCardSize(){return 6}}vt.styles=yt,t([ft({attribute:!1})],vt.prototype,"hass",void 0),t([pt()],vt.prototype,"config",void 0),t([pt()],vt.prototype,"selectedNode",void 0),customElements.get("energy-flow-card")||(customElements.define("energy-flow-card",vt),console.info("%c  ENERGY-FLOW-CARD  %c Version 2.0.0 ","color: white; background: #10b981; font-weight: 700;","color: #10b981; background: #0f172a; font-weight: 700;"));export{vt as EnergyFlowCard};
