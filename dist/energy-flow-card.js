function t(t,e,i,r){var o,s=arguments.length,l=s<3?e:null===r?r=Object.getOwnPropertyDescriptor(e,i):r;if("object"==typeof Reflect&&"function"==typeof Reflect.decorate)l=Reflect.decorate(t,e,i,r);else for(var n=t.length-1;n>=0;n--)(o=t[n])&&(l=(s<3?o(l):s>3?o(e,i,l):o(e,i))||l);return s>3&&l&&Object.defineProperty(e,i,l),l}"function"==typeof SuppressedError&&SuppressedError;const e=globalThis,i=e.ShadowRoot&&(void 0===e.ShadyCSS||e.ShadyCSS.nativeShadow)&&"adoptedStyleSheets"in Document.prototype&&"replace"in CSSStyleSheet.prototype,r=Symbol(),o=new WeakMap;let s=class{constructor(t,e,i){if(this._$cssResult$=!0,i!==r)throw Error("CSSResult is not constructable. Use `unsafeCSS` or `css` instead.");this.cssText=t,this.t=e}get styleSheet(){let t=this.o;const e=this.t;if(i&&void 0===t){const i=void 0!==e&&1===e.length;i&&(t=o.get(e)),void 0===t&&((this.o=t=new CSSStyleSheet).replaceSync(this.cssText),i&&o.set(e,t))}return t}toString(){return this.cssText}};const l=i?t=>t:t=>t instanceof CSSStyleSheet?(t=>{let e="";for(const i of t.cssRules)e+=i.cssText;return(t=>new s("string"==typeof t?t:t+"",void 0,r))(e)})(t):t,{is:n,defineProperty:a,getOwnPropertyDescriptor:h,getOwnPropertyNames:c,getOwnPropertySymbols:d,getPrototypeOf:f}=Object,y=globalThis,p=y.trustedTypes,g=p?p.emptyScript:"",x=y.reactiveElementPolyfillSupport,u=(t,e)=>t,k={toAttribute(t,e){switch(e){case Boolean:t=t?g:null;break;case Object:case Array:t=null==t?t:JSON.stringify(t)}return t},fromAttribute(t,e){let i=t;switch(e){case Boolean:i=null!==t;break;case Number:i=null===t?null:Number(t);break;case Object:case Array:try{i=JSON.parse(t)}catch(t){i=null}}return i}},w=(t,e)=>!n(t,e),$={attribute:!0,type:String,converter:k,reflect:!1,useDefault:!1,hasChanged:w};Symbol.metadata??=Symbol("metadata"),y.litPropertyMetadata??=new WeakMap;let b=class extends HTMLElement{static addInitializer(t){this._$Ei(),(this.l??=[]).push(t)}static get observedAttributes(){return this.finalize(),this._$Eh&&[...this._$Eh.keys()]}static createProperty(t,e=$){if(e.state&&(e.attribute=!1),this._$Ei(),this.prototype.hasOwnProperty(t)&&((e=Object.create(e)).wrapped=!0),this.elementProperties.set(t,e),!e.noAccessor){const i=Symbol(),r=this.getPropertyDescriptor(t,i,e);void 0!==r&&a(this.prototype,t,r)}}static getPropertyDescriptor(t,e,i){const{get:r,set:o}=h(this.prototype,t)??{get(){return this[e]},set(t){this[e]=t}};return{get:r,set(e){const s=r?.call(this);o?.call(this,e),this.requestUpdate(t,s,i)},configurable:!0,enumerable:!0}}static getPropertyOptions(t){return this.elementProperties.get(t)??$}static _$Ei(){if(this.hasOwnProperty(u("elementProperties")))return;const t=f(this);t.finalize(),void 0!==t.l&&(this.l=[...t.l]),this.elementProperties=new Map(t.elementProperties)}static finalize(){if(this.hasOwnProperty(u("finalized")))return;if(this.finalized=!0,this._$Ei(),this.hasOwnProperty(u("properties"))){const t=this.properties,e=[...c(t),...d(t)];for(const i of e)this.createProperty(i,t[i])}const t=this[Symbol.metadata];if(null!==t){const e=litPropertyMetadata.get(t);if(void 0!==e)for(const[t,i]of e)this.elementProperties.set(t,i)}this._$Eh=new Map;for(const[t,e]of this.elementProperties){const i=this._$Eu(t,e);void 0!==i&&this._$Eh.set(i,t)}this.elementStyles=this.finalizeStyles(this.styles)}static finalizeStyles(t){const e=[];if(Array.isArray(t)){const i=new Set(t.flat(1/0).reverse());for(const t of i)e.unshift(l(t))}else void 0!==t&&e.push(l(t));return e}static _$Eu(t,e){const i=e.attribute;return!1===i?void 0:"string"==typeof i?i:"string"==typeof t?t.toLowerCase():void 0}constructor(){super(),this._$Ep=void 0,this.isUpdatePending=!1,this.hasUpdated=!1,this._$Em=null,this._$Ev()}_$Ev(){this._$ES=new Promise(t=>this.enableUpdating=t),this._$AL=new Map,this._$E_(),this.requestUpdate(),this.constructor.l?.forEach(t=>t(this))}addController(t){(this._$EO??=new Set).add(t),void 0!==this.renderRoot&&this.isConnected&&t.hostConnected?.()}removeController(t){this._$EO?.delete(t)}_$E_(){const t=new Map,e=this.constructor.elementProperties;for(const i of e.keys())this.hasOwnProperty(i)&&(t.set(i,this[i]),delete this[i]);t.size>0&&(this._$Ep=t)}createRenderRoot(){const t=this.shadowRoot??this.attachShadow(this.constructor.shadowRootOptions);return((t,r)=>{if(i)t.adoptedStyleSheets=r.map(t=>t instanceof CSSStyleSheet?t:t.styleSheet);else for(const i of r){const r=document.createElement("style"),o=e.litNonce;void 0!==o&&r.setAttribute("nonce",o),r.textContent=i.cssText,t.appendChild(r)}})(t,this.constructor.elementStyles),t}connectedCallback(){this.renderRoot??=this.createRenderRoot(),this.enableUpdating(!0),this._$EO?.forEach(t=>t.hostConnected?.())}enableUpdating(t){}disconnectedCallback(){this._$EO?.forEach(t=>t.hostDisconnected?.())}attributeChangedCallback(t,e,i){this._$AK(t,i)}_$ET(t,e){const i=this.constructor.elementProperties.get(t),r=this.constructor._$Eu(t,i);if(void 0!==r&&!0===i.reflect){const o=(void 0!==i.converter?.toAttribute?i.converter:k).toAttribute(e,i.type);this._$Em=t,null==o?this.removeAttribute(r):this.setAttribute(r,o),this._$Em=null}}_$AK(t,e){const i=this.constructor,r=i._$Eh.get(t);if(void 0!==r&&this._$Em!==r){const t=i.getPropertyOptions(r),o="function"==typeof t.converter?{fromAttribute:t.converter}:void 0!==t.converter?.fromAttribute?t.converter:k;this._$Em=r;const s=o.fromAttribute(e,t.type);this[r]=s??this._$Ej?.get(r)??s,this._$Em=null}}requestUpdate(t,e,i,r=!1,o){if(void 0!==t){const s=this.constructor;if(!1===r&&(o=this[t]),i??=s.getPropertyOptions(t),!((i.hasChanged??w)(o,e)||i.useDefault&&i.reflect&&o===this._$Ej?.get(t)&&!this.hasAttribute(s._$Eu(t,i))))return;this.C(t,e,i)}!1===this.isUpdatePending&&(this._$ES=this._$EP())}C(t,e,{useDefault:i,reflect:r,wrapped:o},s){i&&!(this._$Ej??=new Map).has(t)&&(this._$Ej.set(t,s??e??this[t]),!0!==o||void 0!==s)||(this._$AL.has(t)||(this.hasUpdated||i||(e=void 0),this._$AL.set(t,e)),!0===r&&this._$Em!==t&&(this._$Eq??=new Set).add(t))}async _$EP(){this.isUpdatePending=!0;try{await this._$ES}catch(t){Promise.reject(t)}const t=this.scheduleUpdate();return null!=t&&await t,!this.isUpdatePending}scheduleUpdate(){return this.performUpdate()}performUpdate(){if(!this.isUpdatePending)return;if(!this.hasUpdated){if(this.renderRoot??=this.createRenderRoot(),this._$Ep){for(const[t,e]of this._$Ep)this[t]=e;this._$Ep=void 0}const t=this.constructor.elementProperties;if(t.size>0)for(const[e,i]of t){const{wrapped:t}=i,r=this[e];!0!==t||this._$AL.has(e)||void 0===r||this.C(e,void 0,i,r)}}let t=!1;const e=this._$AL;try{t=this.shouldUpdate(e),t?(this.willUpdate(e),this._$EO?.forEach(t=>t.hostUpdate?.()),this.update(e)):this._$EM()}catch(e){throw t=!1,this._$EM(),e}t&&this._$AE(e)}willUpdate(t){}_$AE(t){this._$EO?.forEach(t=>t.hostUpdated?.()),this.hasUpdated||(this.hasUpdated=!0,this.firstUpdated(t)),this.updated(t)}_$EM(){this._$AL=new Map,this.isUpdatePending=!1}get updateComplete(){return this.getUpdateComplete()}getUpdateComplete(){return this._$ES}shouldUpdate(t){return!0}update(t){this._$Eq&&=this._$Eq.forEach(t=>this._$ET(t,this[t])),this._$EM()}updated(t){}firstUpdated(t){}};b.elementStyles=[],b.shadowRootOptions={mode:"open"},b[u("elementProperties")]=new Map,b[u("finalized")]=new Map,x?.({ReactiveElement:b}),(y.reactiveElementVersions??=[]).push("2.1.2");const m=globalThis,v=t=>t,_=m.trustedTypes,A=_?_.createPolicy("lit-html",{createHTML:t=>t}):void 0,E="$lit$",M=`lit$${Math.random().toFixed(9).slice(2)}$`,S="?"+M,C=`<${S}>`,L=document,P=()=>L.createComment(""),T=t=>null===t||"object"!=typeof t&&"function"!=typeof t,O=Array.isArray,R="[ \t\n\f\r]",U=/<(?:(!--|\/[^a-zA-Z])|(\/?[a-zA-Z][^>\s]*)|(\/?$))/g,H=/-->/g,N=/>/g,G=RegExp(`>|${R}(?:([^\\s"'>=/]+)(${R}*=${R}*(?:[^ \t\n\f\r"'\`<>=]|("|')|))|$)`,"g"),D=/'/g,I=/"/g,z=/^(?:script|style|textarea|title)$/i,F=t=>(e,...i)=>({_$litType$:t,strings:e,values:i}),W=F(1),j=F(2),B=Symbol.for("lit-noChange"),V=Symbol.for("lit-nothing"),Z=new WeakMap,Q=L.createTreeWalker(L,129);function X(t,e){if(!O(t)||!t.hasOwnProperty("raw"))throw Error("invalid template strings array");return void 0!==A?A.createHTML(e):e}const Y=(t,e)=>{const i=t.length-1,r=[];let o,s=2===e?"<svg>":3===e?"<math>":"",l=U;for(let e=0;e<i;e++){const i=t[e];let n,a,h=-1,c=0;for(;c<i.length&&(l.lastIndex=c,a=l.exec(i),null!==a);)c=l.lastIndex,l===U?"!--"===a[1]?l=H:void 0!==a[1]?l=N:void 0!==a[2]?(z.test(a[2])&&(o=RegExp("</"+a[2],"g")),l=G):void 0!==a[3]&&(l=G):l===G?">"===a[0]?(l=o??U,h=-1):void 0===a[1]?h=-2:(h=l.lastIndex-a[2].length,n=a[1],l=void 0===a[3]?G:'"'===a[3]?I:D):l===I||l===D?l=G:l===H||l===N?l=U:(l=G,o=void 0);const d=l===G&&t[e+1].startsWith("/>")?" ":"";s+=l===U?i+C:h>=0?(r.push(n),i.slice(0,h)+E+i.slice(h)+M+d):i+M+(-2===h?e:d)}return[X(t,s+(t[i]||"<?>")+(2===e?"</svg>":3===e?"</math>":"")),r]};class q{constructor({strings:t,_$litType$:e},i){let r;this.parts=[];let o=0,s=0;const l=t.length-1,n=this.parts,[a,h]=Y(t,e);if(this.el=q.createElement(a,i),Q.currentNode=this.el.content,2===e||3===e){const t=this.el.content.firstChild;t.replaceWith(...t.childNodes)}for(;null!==(r=Q.nextNode())&&n.length<l;){if(1===r.nodeType){if(r.hasAttributes())for(const t of r.getAttributeNames())if(t.endsWith(E)){const e=h[s++],i=r.getAttribute(t).split(M),l=/([.?@])?(.*)/.exec(e);n.push({type:1,index:o,name:l[2],strings:i,ctor:"."===l[1]?it:"?"===l[1]?rt:"@"===l[1]?ot:et}),r.removeAttribute(t)}else t.startsWith(M)&&(n.push({type:6,index:o}),r.removeAttribute(t));if(z.test(r.tagName)){const t=r.textContent.split(M),e=t.length-1;if(e>0){r.textContent=_?_.emptyScript:"";for(let i=0;i<e;i++)r.append(t[i],P()),Q.nextNode(),n.push({type:2,index:++o});r.append(t[e],P())}}}else if(8===r.nodeType)if(r.data===S)n.push({type:2,index:o});else{let t=-1;for(;-1!==(t=r.data.indexOf(M,t+1));)n.push({type:7,index:o}),t+=M.length-1}o++}}static createElement(t,e){const i=L.createElement("template");return i.innerHTML=t,i}}function J(t,e,i=t,r){if(e===B)return e;let o=void 0!==r?i._$Co?.[r]:i._$Cl;const s=T(e)?void 0:e._$litDirective$;return o?.constructor!==s&&(o?._$AO?.(!1),void 0===s?o=void 0:(o=new s(t),o._$AT(t,i,r)),void 0!==r?(i._$Co??=[])[r]=o:i._$Cl=o),void 0!==o&&(e=J(t,o._$AS(t,e.values),o,r)),e}class K{constructor(t,e){this._$AV=[],this._$AN=void 0,this._$AD=t,this._$AM=e}get parentNode(){return this._$AM.parentNode}get _$AU(){return this._$AM._$AU}u(t){const{el:{content:e},parts:i}=this._$AD,r=(t?.creationScope??L).importNode(e,!0);Q.currentNode=r;let o=Q.nextNode(),s=0,l=0,n=i[0];for(;void 0!==n;){if(s===n.index){let e;2===n.type?e=new tt(o,o.nextSibling,this,t):1===n.type?e=new n.ctor(o,n.name,n.strings,this,t):6===n.type&&(e=new st(o,this,t)),this._$AV.push(e),n=i[++l]}s!==n?.index&&(o=Q.nextNode(),s++)}return Q.currentNode=L,r}p(t){let e=0;for(const i of this._$AV)void 0!==i&&(void 0!==i.strings?(i._$AI(t,i,e),e+=i.strings.length-2):i._$AI(t[e])),e++}}class tt{get _$AU(){return this._$AM?._$AU??this._$Cv}constructor(t,e,i,r){this.type=2,this._$AH=V,this._$AN=void 0,this._$AA=t,this._$AB=e,this._$AM=i,this.options=r,this._$Cv=r?.isConnected??!0}get parentNode(){let t=this._$AA.parentNode;const e=this._$AM;return void 0!==e&&11===t?.nodeType&&(t=e.parentNode),t}get startNode(){return this._$AA}get endNode(){return this._$AB}_$AI(t,e=this){t=J(this,t,e),T(t)?t===V||null==t||""===t?(this._$AH!==V&&this._$AR(),this._$AH=V):t!==this._$AH&&t!==B&&this._(t):void 0!==t._$litType$?this.$(t):void 0!==t.nodeType?this.T(t):(t=>O(t)||"function"==typeof t?.[Symbol.iterator])(t)?this.k(t):this._(t)}O(t){return this._$AA.parentNode.insertBefore(t,this._$AB)}T(t){this._$AH!==t&&(this._$AR(),this._$AH=this.O(t))}_(t){this._$AH!==V&&T(this._$AH)?this._$AA.nextSibling.data=t:this.T(L.createTextNode(t)),this._$AH=t}$(t){const{values:e,_$litType$:i}=t,r="number"==typeof i?this._$AC(t):(void 0===i.el&&(i.el=q.createElement(X(i.h,i.h[0]),this.options)),i);if(this._$AH?._$AD===r)this._$AH.p(e);else{const t=new K(r,this),i=t.u(this.options);t.p(e),this.T(i),this._$AH=t}}_$AC(t){let e=Z.get(t.strings);return void 0===e&&Z.set(t.strings,e=new q(t)),e}k(t){O(this._$AH)||(this._$AH=[],this._$AR());const e=this._$AH;let i,r=0;for(const o of t)r===e.length?e.push(i=new tt(this.O(P()),this.O(P()),this,this.options)):i=e[r],i._$AI(o),r++;r<e.length&&(this._$AR(i&&i._$AB.nextSibling,r),e.length=r)}_$AR(t=this._$AA.nextSibling,e){for(this._$AP?.(!1,!0,e);t!==this._$AB;){const e=v(t).nextSibling;v(t).remove(),t=e}}setConnected(t){void 0===this._$AM&&(this._$Cv=t,this._$AP?.(t))}}class et{get tagName(){return this.element.tagName}get _$AU(){return this._$AM._$AU}constructor(t,e,i,r,o){this.type=1,this._$AH=V,this._$AN=void 0,this.element=t,this.name=e,this._$AM=r,this.options=o,i.length>2||""!==i[0]||""!==i[1]?(this._$AH=Array(i.length-1).fill(new String),this.strings=i):this._$AH=V}_$AI(t,e=this,i,r){const o=this.strings;let s=!1;if(void 0===o)t=J(this,t,e,0),s=!T(t)||t!==this._$AH&&t!==B,s&&(this._$AH=t);else{const r=t;let l,n;for(t=o[0],l=0;l<o.length-1;l++)n=J(this,r[i+l],e,l),n===B&&(n=this._$AH[l]),s||=!T(n)||n!==this._$AH[l],n===V?t=V:t!==V&&(t+=(n??"")+o[l+1]),this._$AH[l]=n}s&&!r&&this.j(t)}j(t){t===V?this.element.removeAttribute(this.name):this.element.setAttribute(this.name,t??"")}}class it extends et{constructor(){super(...arguments),this.type=3}j(t){this.element[this.name]=t===V?void 0:t}}class rt extends et{constructor(){super(...arguments),this.type=4}j(t){this.element.toggleAttribute(this.name,!!t&&t!==V)}}class ot extends et{constructor(t,e,i,r,o){super(t,e,i,r,o),this.type=5}_$AI(t,e=this){if((t=J(this,t,e,0)??V)===B)return;const i=this._$AH,r=t===V&&i!==V||t.capture!==i.capture||t.once!==i.once||t.passive!==i.passive,o=t!==V&&(i===V||r);r&&this.element.removeEventListener(this.name,this,i),o&&this.element.addEventListener(this.name,this,t),this._$AH=t}handleEvent(t){"function"==typeof this._$AH?this._$AH.call(this.options?.host??this.element,t):this._$AH.handleEvent(t)}}class st{constructor(t,e,i){this.element=t,this.type=6,this._$AN=void 0,this._$AM=e,this.options=i}get _$AU(){return this._$AM._$AU}_$AI(t){J(this,t)}}const lt=m.litHtmlPolyfillSupport;lt?.(q,tt),(m.litHtmlVersions??=[]).push("3.3.3");const nt=globalThis;class at extends b{constructor(){super(...arguments),this.renderOptions={host:this},this._$Do=void 0}createRenderRoot(){const t=super.createRenderRoot();return this.renderOptions.renderBefore??=t.firstChild,t}update(t){const e=this.render();this.hasUpdated||(this.renderOptions.isConnected=this.isConnected),super.update(t),this._$Do=((t,e,i)=>{const r=i?.renderBefore??e;let o=r._$litPart$;if(void 0===o){const t=i?.renderBefore??null;r._$litPart$=o=new tt(e.insertBefore(P(),t),t,void 0,i??{})}return o._$AI(t),o})(e,this.renderRoot,this.renderOptions)}connectedCallback(){super.connectedCallback(),this._$Do?.setConnected(!0)}disconnectedCallback(){super.disconnectedCallback(),this._$Do?.setConnected(!1)}render(){return B}}at._$litElement$=!0,at.finalized=!0,nt.litElementHydrateSupport?.({LitElement:at});const ht=nt.litElementPolyfillSupport;ht?.({LitElement:at}),(nt.litElementVersions??=[]).push("4.2.2");const ct={attribute:!0,type:String,converter:k,reflect:!1,hasChanged:w},dt=(t=ct,e,i)=>{const{kind:r,metadata:o}=i;let s=globalThis.litPropertyMetadata.get(o);if(void 0===s&&globalThis.litPropertyMetadata.set(o,s=new Map),"setter"===r&&((t=Object.create(t)).wrapped=!0),s.set(i.name,t),"accessor"===r){const{name:r}=i;return{set(i){const o=e.get.call(this);e.set.call(this,i),this.requestUpdate(r,o,t,!0,i)},init(e){return void 0!==e&&this.C(r,void 0,t,e),e}}}if("setter"===r){const{name:r}=i;return function(i){const o=this[r];e.call(this,i),this.requestUpdate(r,o,t,!0,i)}}throw Error("Unsupported decorator location: "+r)};function ft(t){return(e,i)=>"object"==typeof i?dt(t,e,i):((t,e,i)=>{const r=e.hasOwnProperty(i);return e.constructor.createProperty(i,t),r?Object.getOwnPropertyDescriptor(e,i):void 0})(t,e,i)}function yt(t){return ft({...t,state:!0,attribute:!1})}const pt=((t,...e)=>{const i=1===t.length?t[0]:e.reduce((e,i,r)=>e+(t=>{if(!0===t._$cssResult$)return t.cssText;if("number"==typeof t)return t;throw Error("Value passed to 'css' function must be a 'css' function result: "+t+". Use 'unsafeCSS' to pass non-literal values, but take care to ensure page security.")})(i)+t[r+1],t[0]);return new s(i,t,r)})`
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
`,gt={solar:{stroke:"#10b981",glow:"rgba(16,185,129,0.5)"},battery:{stroke:"#10b981",glow:"rgba(16,185,129,0.5)"},batteryD:{stroke:"#ef4444",glow:"rgba(239,68,68,0.5)"},gridI:{stroke:"#06b6d4",glow:"rgba(6,182,212,0.5)"},gridE:{stroke:"#22c55e",glow:"rgba(34,197,94,0.5)"},ev:{stroke:"#a855f7",glow:"rgba(168,85,247,0.5)"},home:{stroke:"#e2e8f0"}},xt=[{hour:0,top:"#020617",horizon:"#0f172a",stars:.8,lights:1,clouds:"rgba(255, 255, 255, 0.08)"},{hour:4.5,top:"#020617",horizon:"#0f172a",stars:.8,lights:1,clouds:"rgba(255, 255, 255, 0.08)"},{hour:6,top:"#1e1b4b",horizon:"#fdba74",stars:.2,lights:.3,clouds:"rgba(255, 255, 255, 0.35)"},{hour:8,top:"#0ea5e9",horizon:"#bae6fd",stars:0,lights:0,clouds:"rgba(255, 255, 255, 0.65)"},{hour:17,top:"#0284c7",horizon:"#bae6fd",stars:0,lights:0,clouds:"rgba(255, 255, 255, 0.65)"},{hour:19.5,top:"#3b0764",horizon:"#f97316",stars:0,lights:.5,clouds:"rgba(255, 255, 255, 0.45)"},{hour:21,top:"#18113c",horizon:"#ea580c",stars:.1,lights:1,clouds:"rgba(255, 255, 255, 0.18)"},{hour:22.5,top:"#020617",horizon:"#1e293b",stars:.6,lights:1,clouds:"rgba(255, 255, 255, 0.08)"},{hour:24,top:"#020617",horizon:"#0f172a",stars:.8,lights:1,clouds:"rgba(255, 255, 255, 0.08)"}];function ut(t){const e=t.replace("#","");return{r:parseInt(e.substring(0,2),16),g:parseInt(e.substring(2,4),16),b:parseInt(e.substring(4,6),16)}}function kt(t,e,i){if(t.startsWith("rgba")||e.startsWith("rgba")){const r=t=>{const e=t.match(/[\d.]+\)$/);return e?parseFloat(e[0]):1},o=r(t);return`rgba(255, 255, 255, ${o+(r(e)-o)*i})`}const r=ut(t),o=ut(e);return function(t,e,i){const r=t=>{const e=Math.max(0,Math.min(255,Math.round(t))).toString(16);return 1===e.length?"0"+e:e};return`#${r(t)}${r(e)}${r(i)}`}(r.r+(o.r-r.r)*i,r.g+(o.g-r.g)*i,r.b+(o.b-r.b)*i)}function wt(t){let e=xt[0],i=xt[xt.length-1];for(let r=0;r<xt.length-1;r++)if(t>=xt[r].hour&&t<=xt[r+1].hour){e=xt[r],i=xt[r+1];break}const r=i.hour-e.hour,o=0===r?0:(t-e.hour)/r;return{top:kt(e.top,i.top,o),horizon:kt(e.horizon,i.horizon,o),stars:e.stars+(i.stars-e.stars)*o,lights:e.lights+(i.lights-e.lights)*o,clouds:kt(e.clouds,i.clouds,o)}}function $t(t){const e=Math.abs(t);return e<20?0:e<1e3?16:6}function bt(t){const e=Math.abs(t);return e>=1e3?`${(e/1e3).toFixed(1)} kW`:`${Math.round(e)} W`}function mt(t,e,i,r=1,o="#ffffff",s=.9){return j`
    <g transform="translate(${e}, ${i}) scale(${r})" opacity="${s}" style="transition: opacity 1.5s ease;">
      <g class="${t}">
        <path d="M 20,40 Q 10,25 25,15 Q 40,5 60,15 Q 80,0 100,15 Q 120,5 130,25 Q 140,40 120,45 Q 100,50 60,45 Q 20,50 20,40 Z" fill="rgba(15, 23, 42, 0.15)" transform="translate(0, 4) scale(1.02)" />
        <path d="M 20,40 Q 10,25 25,15 Q 40,5 60,15 Q 80,0 100,15 Q 120,5 130,25 Q 140,40 120,45 Q 100,50 60,45 Q 20,50 20,40 Z" fill="${o}" style="transition: fill 1.5s ease;" />
      </g>
    </g>
  `}function vt({houseStyle:t="classic-jaren30",carType:e="hatchback",timeHour:i,timeOfDay:r,solar:o,solarToday:s,load:l,batteryPower:n,soc:a,charger:h,grid:c,showSolar:d,showBattery:f,showEV:y,weather:p="sunny",sunriseHour:g=6,sunsetHour:x=21,gridImportToday:u=null,gridExportToday:k=null,homeToday:w=null,batteryChargeToday:$=null,batteryDischargeToday:b=null,evToday:m=null,onNodeClick:v}){let _=i;_=i>=g&&i<=x?6+(i-g)/(x-g)*15:i>x?21+(i-x)/(24-x)*3:i/g*6;const A=n>.05,E=n<-.05,M=c>.05,S=c<-.05,C=h>.1,L=o>20,P=l>20,T=A||E&&S?gt.battery:gt.batteryD,O=M?gt.gridI:gt.gridE,R=wt(_),U=R.lights>.05||"rainy"===p||"lightning"===p;let H=R.top,N=R.horizon,G=R.clouds,D="night"===r?.18:.48;"cloudy"===p?(H=kt(R.top,"#475569",.5),N=kt(R.horizon,"#94a3b8",.5),G="rgba(241, 245, 249, 0.55)",D=.65):"rainy"===p||"lightning"===p?(H=kt(R.top,"#1e293b",.75),N=kt(R.horizon,"#475569",.75),G="rgba(100, 116, 139, 0.5)",D=.65):"snowy"===p?(H=kt(R.top,"#cbd5e1",.4),N=kt(R.horizon,"#f1f5f9",.4),G="rgba(255, 255, 255, 0.6)",D=.7):"foggy"===p&&(H=kt(R.top,"#94a3b8",.6),N=kt(R.horizon,"#cbd5e1",.6),G="rgba(226, 232, 240, 0.4)",D=.5);const I={cx:480,cy:600};let z=0,F="#fef08a",W="rgba(254, 240, 138, 0.65)";if(_>=6&&_<=21&&"rainy"!==p&&"lightning"!==p&&"cloudy"!==p){const t=(_-6)/15;I.cx=1080*t-60,I.cy=576-528*Math.sin(t*Math.PI),z=Math.max(0,Math.min(1,1.5*Math.sin(t*Math.PI)));const e=Math.sin(t*Math.PI);F=kt("#ea580c","#fef08a",e),W=kt("rgba(234, 88, 12, 0.65)","rgba(254, 240, 138, 0.75)",e)}const B={cx:480,cy:600};let V=0;if((_>21||_<6)&&"rainy"!==p&&"lightning"!==p&&"cloudy"!==p){const t=_>21?(_-21)/9:(_+3)/9;B.cx=1080*t-60,B.cy=576-480*Math.sin(t*Math.PI),V=Math.max(0,Math.min(.9,1.8*Math.sin(t*Math.PI)))}const Z=_>=8&&_<=18,Q=Z?"url(#window-day)":U?"url(#window-night)":"url(#window-dark)",X=Z?"none":U?"drop-shadow(0 0 6px rgba(251, 191, 36, 0.45))":"none",Y=t=>450+1.15*(t-450),q=t=>480+1.15*(t-480),J=Math.round(Y(345)),K=Math.round(q(420)),tt=Math.round(Y(380)),et=Math.round(q(300));let it=S?"↑ Teruglevering":M?"↓ Import":"Standby";null!==u&&null!==k?it=`↓${u.toFixed(1)} ↑${k.toFixed(1)} kWh`:null!==u?it=`Import: ${u.toFixed(1)} kWh`:null!==k&&(it=`Terug: ${k.toFixed(1)} kWh`);const rt=null!==w?`Vandaag: ${w.toFixed(1)} kWh`:P?"Actief":"Standby";let ot=`SoC: ${a}%`;null!==$&&null!==b?ot=`SoC: ${a}% (↓${$.toFixed(1)} ↑${b.toFixed(1)})`:null!==$&&(ot=`SoC: ${a}% (↓${$.toFixed(1)})`);const st=null!==m?`Vandaag: ${m.toFixed(1)} kWh`:C?"Bezig met laden":"Standby",lt=[{id:"grid",title:"Stroomnet",value:bt(c),sub:it,color:O.stroke,active:M||S},{id:"home",title:"Huisverbruik",value:bt(l),sub:rt,color:gt.home.stroke,active:P}];f&&lt.push({id:"battery",title:"Thuisaccu",value:bt(n),sub:ot,color:T.stroke,active:A||E}),y&&lt.push({id:"ev",title:"Laadpaal (EV)",value:bt(h),sub:st,color:gt.ev.stroke,active:C});const nt=(960-170*lt.length)/(lt.length+1),at=(t,e,i,r,o,s=!1)=>j`
      <path d="${t}" class="flowCable" />
      <path d="${t}" fill="none" stroke="${r}" stroke-width="3" stroke-linecap="round"
        opacity="${e?.25:0}"
        style="filter: ${e?"blur(3.5px)":"none"}; transition: stroke 0.6s ease, opacity 0.6s ease;" />
      <path d="${t}" fill="none" stroke="${r}" stroke-width="1.2" stroke-linecap="round"
        opacity="${e?.55:0}"
        style="transition: stroke 0.6s ease, opacity 0.6s ease;" />
      ${((t,e,i,r,o,s=!1)=>e&&0!==i?j`
      ${Array.from({length:3}).map((e,l)=>j`
        <circle r="3.5" fill="${r}"
          style="
            offset-path: path('${t}');
            animation: moveParticle ${i}s linear infinite;
            animation-play-state: running;
            animation-delay: ${-l/3*i}s;
            animation-direction: ${s?"reverse":"normal"};
            filter: drop-shadow(0 0 5px ${o}) drop-shadow(0 0 2px ${r});
          " />
      `)}
    `:j``)(t,e,i,r,o,s)}
    `;return j`
    <svg viewBox="0 0 960 590" xmlns="http://www.w3.org/2000/svg">
      <defs>
        <!-- Sky gradient -->
        <linearGradient id="sky-grad" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stop-color="${H}" />
          <stop offset="100%" stop-color="${N}" />
        </linearGradient>

        <linearGradient id="garden-grad" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stop-color="#0f3f26" />
          <stop offset="100%" stop-color="#0a2919" />
        </linearGradient>

        <linearGradient id="driveway-grad" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stop-color="#334155" />
          <stop offset="100%" stop-color="#1e293b" />
        </linearGradient>

        <!-- Solar panel gradient -->
        <linearGradient id="solar-panel-grad" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stop-color="#1e1b4b" />
          <stop offset="100%" stop-color="#312e81" />
        </linearGradient>

        <linearGradient id="car-body-grad" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stop-color="#38bdf8" />
          <stop offset="100%" stop-color="#0284c7" />
        </linearGradient>

        <linearGradient id="lamp-light-grad" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stop-color="#fde047" stop-opacity="0.75" />
          <stop offset="100%" stop-color="#fde047" stop-opacity="0" />
        </linearGradient>

        <pattern id="soldier-course" width="8" height="10" patternUnits="userSpaceOnUse">
          <rect x="0" y="0" width="4" height="10" fill="#fcd34d" />
          <rect x="4" y="0" width="4" height="10" fill="#b91c1c" />
          <line x1="0" y1="0" x2="0" y2="10" stroke="#7f1d1d" stroke-width="0.5" />
          <line x1="4" y1="0" x2="4" y2="10" stroke="#7f1d1d" stroke-width="0.5" />
        </pattern>

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

        <!-- Jaren 30 brick texture pattern -->
        <pattern id="jaren30-brick-pat" width="60" height="40" patternUnits="userSpaceOnUse">
          <image href="/hacsfiles/energy-flow-card/brick_texture_v3.png" width="60" height="40" preserveAspectRatio="none" />
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
        ${R.stars>.05&&"rainy"!==p&&"lightning"!==p&&"cloudy"!==p?j`
          <g opacity="${R.stars}" style="pointer-events: none;">
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
        ${z>0?j`
          <g style="pointer-events: none;">
            <circle cx="${I.cx}" cy="${I.cy}" r="54" fill="${F}" opacity="${.15*z}" style="filter: blur(8px);" />
            <circle cx="${I.cx}" cy="${I.cy}" r="26" fill="${F}" opacity="${z}" style="filter: drop-shadow(0 0 14px ${W});" />
          </g>
        `:""}

        <!-- Dynamic Moon -->
        ${V>0?j`
          <g style="pointer-events: none;" opacity="${V}">
            <circle cx="${B.cx}" cy="${B.cy}" r="30" fill="#e2e8f0" opacity="0.15" style="filter: blur(4px);" />
            <circle cx="${B.cx}" cy="${B.cy}" r="17" fill="#f1f5f9" />
            <circle cx="${B.cx+6}" cy="${B.cy-4}" r="16" fill="url(#sky-grad)" />
          </g>
        `:""}

        <!-- Cloud layers -->
        ${mt("cloud1",72,36,.65,G,.75*D)}
        ${mt("cloud2",432,84,.85,G,.85*D)}
        ${mt("cloud3",744,132,1,G,D)}
        ${"cloudy"===p||"rainy"===p||"lightning"===p?j`
          ${mt("cloud2",240,60,.75,G,.8*D)}
          ${mt("cloud1",588,108,.9,G,.8*D)}
        `:""}

        <!-- Lightning bolt -->
        ${"lightning"===p?j`
          <path d="M 504,72 L 468,180 L 516,180 L 444,312 L 480,312 L 420,456" class="lightningBolt" />
        `:""}

        <!-- Falling precipitation -->
        ${"rainy"===p?j`
    <g style="pointer-events: none;">
      ${Array.from({length:18}).map((t,e)=>j`
        <line x1="${25+55*e}" y1="0" x2="${8+55*e}" y2="40"
          class="rainDrop"
          style="animation-delay: ${e%5*.12}s; animation-duration: ${.6+e%3*.1}s;" />
      `)}
    </g>
  `:""}
        ${"snowy"===p?j`
    <g style="pointer-events: none;">
      ${Array.from({length:22}).map((t,e)=>j`
        <circle cx="${25+45*e}" cy="0" r="${1.8+e%3*.6}"
          class="snowFlake"
          style="animation-delay: ${e%6*.5}s; animation-duration: ${4.5+e%4*.7}s;" />
      `)}
    </g>
  `:""}

        <!-- Fog overlay -->
        ${"foggy"===p?j`
          <rect width="960" height="590" fill="rgba(226, 232, 240, 0.22)" style="filter: blur(5px); pointer-events: none;" />
        `:""}

        <!-- ════════════════════════════════════════════════════════════════ -->
        <!-- GROUND & ELECTRICITY MAST: Outside scaled group                 -->
        <!-- ════════════════════════════════════════════════════════════════ -->
        <!-- Ground (full width) -->
        <rect x="0" y="480" width="630" height="110" fill="url(#garden-grad)" />
        <!-- Driveway -->
        <rect x="630" y="480" width="330" height="110" fill="url(#driveway-grad)" />
        <line x1="0" y1="480" x2="960" y2="480" class="horizonLine" />

        <!-- High-Voltage Electricity Mast (Resting on ground) -->
        <g id="electricity-mast" class="interactiveGroup gridGroup" @click=${()=>v("grid")}>
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
            <line x1="50" y1="160" x2="50" y2="175" stroke="#94a3b8" stroke-width="2.5" />
            <circle cx="50" cy="178" r="2" fill="#94a3b8" />
            <line x1="85" y1="160" x2="85" y2="175" stroke="#94a3b8" stroke-width="2.5" />
            <circle cx="85" cy="178" r="2" fill="#94a3b8" />
            <line x1="155" y1="160" x2="155" y2="175" stroke="#94a3b8" stroke-width="2.5" />
            <circle cx="155" cy="178" r="2" fill="#94a3b8" />
            <line x1="190" y1="160" x2="190" y2="175" stroke="#94a3b8" stroke-width="2.5" />
            <circle cx="190" cy="178" r="2" fill="#94a3b8" />
          </g>
        </g>

        <!-- Transformer/Distribution Box -->
        <g id="grid-transformer-box">
          <rect x="180" y="442" width="24" height="38" fill="#334155" stroke="#1e293b" stroke-width="1.5" rx="2" />
          <line x1="192" y1="442" x2="192" y2="480" stroke="#1e293b" stroke-width="0.8" />
          <circle cx="188" cy="462" r="1.5" fill="#1e293b" />
          <rect x="182" y="448" width="20" height="12" fill="#fef08a" stroke="#ca8a04" stroke-width="0.8" rx="1" />
          <polygon points="191,449 195,449 192,453 196,453 190,457 193,453 190,453" fill="#ca8a04" />
        </g>

        <!-- ════════════════════════════════════════════════════════════════ -->
        <!-- HOUSE & APPLIANCES: Scaled around center of base (450, 480)      -->
        <!-- ════════════════════════════════════════════════════════════════ -->
        <g transform="translate(450, 480) scale(1.15) translate(-450, -480)">

          <!-- ── HOUSE DESIGNS ── -->
          <g id="house-structure" class="interactiveGroup homeGroup" @click=${()=>v("home")}>
            ${"modern-villa"===t?j`
              <!-- Plinth / Foundation Base -->
              <rect x="290" y="455" width="20" height="25" fill="#2d3748" stroke="#1a202c" stroke-width="0.8" />
              <rect x="345" y="455" width="245" height="25" fill="#2d3748" stroke="#1a202c" stroke-width="0.8" />
              <line x1="290" y1="467" x2="310" y2="467" stroke="#1a202c" stroke-width="0.5" opacity="0.4" />
              <line x1="345" y1="467" x2="590" y2="467" stroke="#1a202c" stroke-width="0.5" opacity="0.4" />

              <!-- Left Gevel Wall (Textured Cedar planks) -->
              <rect x="290" y="300" width="90" height="155" fill="#c2410c" stroke="#78350f" stroke-width="0.8" />
              ${Array.from({length:8}).map((t,e)=>j`
                <line x1="${300+10*e}" y1="300" x2="${300+10*e}" y2="455" stroke="#451a03" stroke-width="0.8" opacity="0.35" />
              `)}

              <!-- Right Gevel Wall (White Stucco) -->
              <rect x="380" y="300" width="210" height="155" fill="#f8fafc" stroke="#cbd5e1" stroke-width="0.8" />
              <line x1="380" y1="330" x2="590" y2="330" stroke="#cbd5e1" stroke-width="0.5" opacity="0.4" />
              <line x1="380" y1="360" x2="590" y2="360" stroke="#cbd5e1" stroke-width="0.5" opacity="0.4" />
              <line x1="380" y1="390" x2="590" y2="390" stroke="#cbd5e1" stroke-width="0.5" opacity="0.4" />
              <line x1="380" y1="420" x2="590" y2="420" stroke="#cbd5e1" stroke-width="0.5" opacity="0.4" />

              <!-- Entrance Plant Pot & Monstera -->
              <g id="entrance-plant">
                <polygon points="294,455 304,455 302,446 296,446" fill="#1e293b" />
                <path d="M 298,446 Q 289,435 292,430 Q 297,430 298,440" fill="#22c55e" />
                <path d="M 298,446 Q 305,432 302,427 Q 297,427 298,440" fill="#16a34a" />
                <path d="M 298,446 Q 293,437 296,436" stroke="#15803d" stroke-width="2.0" fill="none" stroke-linecap="round" />
              </g>

              <!-- Voordeur (Front Door - Starts on ground, y=480) -->
              <g id="house-door">
                <rect x="310" y="380" width="35" height="100" fill="#78350f" stroke="#451a03" stroke-width="1.5" rx="1.5" />
                <line x1="337" y1="410" x2="337" y2="435" stroke="#cbd5e1" stroke-width="1.8" stroke-linecap="round" />
                <rect x="317" y="390" width="6" height="70" fill="${U?"#fde047":"#1e293b"}" stroke="#451a03" stroke-width="0.8" style="fill: ${U?`rgba(253, 224, 71, ${R.lights})`:"#1e293b"}; filter: ${U?`drop-shadow(0 0 4px rgba(253, 224, 71, ${R.lights}))`:"none"}; transition: fill 0.5s ease;" />
                <rect x="305" y="375" width="45" height="5" fill="#334155" stroke="#1e293b" stroke-width="0.8" rx="1" />
              </g>

              <!-- Roof Structure -->
              <polygon points="270,300 440,200 610,300" fill="#1e293b" stroke="#0f172a" stroke-width="1.5" />
              <line x1="270" y1="300" x2="440" y2="200" stroke="#0f172a" stroke-width="3.5" />
              <line x1="610" y1="300" x2="440" y2="200" stroke="#0f172a" stroke-width="3.5" />
              <rect x="265" y="297" width="350" height="6" fill="#64748b" rx="2" />
              <path d="M 610,303 L 610,455 L 613,458" stroke="#64748b" stroke-width="2.5" fill="none" stroke-linecap="round" stroke-linejoin="round" />

              <!-- Solar Panel Array -->
              <g transform="translate(440, 200) rotate(30.5)">
                <rect x="15" y="-12" width="130" height="10" fill="url(#solar-panel-grad)" stroke="#1e1b4b" stroke-width="1.5" rx="2" />
                <line x1="45" y1="-12" x2="45" y2="-2" stroke="#3b82f6" stroke-width="0.5" opacity="0.3" />
                <line x1="85" y1="-12" x2="85" y2="-2" stroke="#3b82f6" stroke-width="0.5" opacity="0.3" />
                <line x1="15" y1="-7" x2="145" y2="-7" stroke="#3b82f6" stroke-width="0.5" opacity="0.3" />
              </g>

              <!-- Windows -->
              <rect x="395" y="380" width="130" height="70" fill="${Q}" stroke="#334155" stroke-width="2.5" style="filter: ${X}; transition: fill 0.5s ease, filter 0.5s ease;" rx="3" />
              <g opacity="${R.lights}">
                <line x1="460" y1="380" x2="460" y2="400" stroke="#334155" stroke-width="1" />
                <path d="M 450,405 L 470,405 L 460,400 Z" fill="#334155" />
                <circle cx="460" cy="406" r="4.5" fill="#ffffff" style="filter: drop-shadow(0 0 8px #fde047);" />
                <polygon points="505,415 485,450 525,450" fill="url(#lamp-light-grad)" opacity="0.35" />
                <line x1="505" y1="450" x2="505" y2="415" stroke="#334155" stroke-width="1" />
                <polygon points="498,415 512,415 509,409 501,409" fill="#475569" />
              </g>
              <g opacity="${1-R.lights}">
                <polygon points="395,415 420,380 435,380 395,435" fill="rgba(255,255,255,0.06)" style="pointer-events: none;" />
                <polygon points="445,450 495,380 510,380 460,450" fill="rgba(255,255,255,0.06)" style="pointer-events: none;" />
              </g>
              <line x1="460" y1="380" x2="460" y2="450" stroke="#0f172a" stroke-width="1.5" />
              <line x1="395" y1="415" x2="525" y2="415" stroke="#0f172a" stroke-width="1.2" />

              <rect x="405" y="310" width="30" height="45" fill="${Q}" stroke="#334155" stroke-width="2.0" style="filter: ${X};" rx="1.5" />
              <line x1="420" y1="310" x2="420" y2="355" stroke="#0f172a" stroke-width="1.2" />
              
              <rect x="485" y="310" width="30" height="45" fill="${Q}" stroke="#334155" stroke-width="2.0" style="filter: ${X};" rx="1.5" />
              <line x1="500" y1="310" x2="500" y2="355" stroke="#0f172a" stroke-width="1.2" />

              <circle cx="440" cy="255" r="13" fill="${Q}" stroke="#334155" stroke-width="2.0" style="filter: ${X};" />
              <line x1="440" y1="242" x2="440" y2="268" stroke="#0f172a" stroke-width="1" />
            `:""}

            ${"classic-jaren30"===t?j`
              <!-- Plinth (Bottom dark brick) -->
              <rect x="290" y="450" width="300" height="10" fill="#2d2524" stroke="#1b0000" stroke-width="0.8" />
              <!-- Main Wall (Red brick pentagon) -->
              <!-- Main Wall (Red brick pentagon) -->
              <polygon points="290,450 290,370 440,150 590,370 590,450" fill="url(#jaren30-brick-pat)" stroke="#7f1d1d" stroke-width="0.8" />

              <!-- Left Side Entrance Extension -->
              <rect x="260" y="450" width="30" height="10" fill="#2d2524" stroke="#1b0000" stroke-width="0.8" />
              <rect x="260" y="370" width="30" height="80" fill="url(#jaren30-brick-pat)" stroke="#7f1d1d" stroke-width="0.8" />
              <polygon points="255,370 290,355 290,370" fill="#1e293b" stroke="#0f172a" stroke-width="0.8" />
              <line x1="255" y1="370" x2="290" y2="355" stroke="#f8fafc" stroke-width="2.5" />
              <rect x="264" y="380" width="22" height="65" fill="#1e293b" stroke="#0f172a" stroke-width="1" rx="1" />
              <rect x="272" y="385" width="6" height="30" fill="${U?"#fde047":"#0f172a"}" opacity="0.8" style="fill: ${U?`rgba(253, 224, 71, ${R.lights})`:"#0f172a"}; transition: fill 0.5s ease;" />

              <!-- Soldier Course Accent Bands -->
              <rect x="290" y="362" width="300" height="10" fill="url(#soldier-course)" stroke="#7f1d1d" stroke-width="0.8" />
              <rect x="300" y="359" width="280" height="8" fill="url(#soldier-course)" stroke="#7f1d1d" stroke-width="0.8" />

              <!-- Windows -->
              <rect x="305" y="375" width="35" height="75" fill="${Q}" stroke="#0f172a" stroke-width="2.5" style="filter: ${X}; transition: fill 0.5s ease;" rx="1" />
              <rect x="307" y="377" width="31" height="22" fill="#cbd5e1" opacity="0.9" rx="0.5" />
              <line x1="305" y1="412.5" x2="340" y2="412.5" stroke="#0f172a" stroke-width="1.5" />

              <rect x="375" y="375" width="130" height="75" fill="${Q}" stroke="#0f172a" stroke-width="3.0" style="filter: ${X}; transition: fill 0.5s ease;" rx="1" />
              <rect x="377" y="377" width="126" height="22" fill="#cbd5e1" opacity="0.9" rx="0.5" />
              <line x1="375" y1="412.5" x2="505" y2="412.5" stroke="#0f172a" stroke-width="2.0" />

              <rect x="540" y="375" width="35" height="75" fill="${Q}" stroke="#0f172a" stroke-width="2.5" style="filter: ${X}; transition: fill 0.5s ease;" rx="1" />
              <rect x="542" y="377" width="31" height="22" fill="#cbd5e1" opacity="0.9" rx="0.5" />
              <line x1="540" y1="412.5" x2="575" y2="412.5" stroke="#0f172a" stroke-width="1.5" />

              <rect x="355" y="312" width="45" height="46" fill="${Q}" stroke="#0f172a" stroke-width="2.5" style="filter: ${X}; transition: fill 0.5s ease;" rx="1" />
              <line x1="377.5" y1="312" x2="377.5" y2="358" stroke="#0f172a" stroke-width="1.8" />
              <rect x="355" y="302" width="45" height="10" fill="url(#soldier-course)" stroke="#7f1d1d" stroke-width="0.8" />

              <rect x="480" y="312" width="45" height="46" fill="${Q}" stroke="#0f172a" stroke-width="2.5" style="filter: ${X}; transition: fill 0.5s ease;" rx="1" />
              <line x1="502.5" y1="312" x2="502.5" y2="358" stroke="#0f172a" stroke-width="1.8" />
              <rect x="480" y="302" width="45" height="10" fill="url(#soldier-course)" stroke="#7f1d1d" stroke-width="0.8" />

              <!-- Roof Framing -->
              <rect x="280" y="367" width="320" height="6" fill="#f8fafc" rx="1" />
              <line x1="290" y1="370" x2="440" y2="150" stroke="#f8fafc" stroke-width="5.0" stroke-linecap="round" />
              <line x1="590" y1="370" x2="440" y2="150" stroke="#f8fafc" stroke-width="5.0" stroke-linecap="round" />

              <polygon points="361.5,265 440,150 518.5,265" fill="#1e293b" stroke="#0f172a" stroke-width="1.2" />
              ${Array.from({length:20}).map((t,e)=>{const i=150+6*e;if(i>265)return"";const r=78.5/115*(i-150);return j`<line x1="${440-r}" y1="${i}" x2="${440+r}" y2="${i}" stroke="#0f172a" stroke-width="0.8" opacity="0.45" />`})}

              <!-- Chimney -->
              <rect x="445" y="115" width="16" height="36" fill="#4a5568" stroke="#1a202c" stroke-width="1" />
              <rect x="442" y="110" width="22" height="6" fill="#1a202c" rx="0.5" />

              <!-- Solar Panels on steep roof -->
              <g transform="translate(440, 150) rotate(55.7)">
                <rect x="15" y="-12" width="140" height="10" fill="url(#solar-panel-grad)" stroke="#1e1b4b" stroke-width="1.5" rx="2" />
                <line x1="45" y1="-12" x2="45" y2="-2" stroke="#3b82f6" stroke-width="0.5" opacity="0.3" />
                <line x1="85" y1="-12" x2="85" y2="-2" stroke="#3b82f6" stroke-width="0.5" opacity="0.3" />
                <line x1="15" y1="-7" x2="155" y2="-7" stroke="#3b82f6" stroke-width="0.5" opacity="0.3" />
              </g>

              <!-- Front tree -->
              <g id="front-garden-tree" style="pointer-events: none;">
                <rect x="437" y="320" width="6" height="135" fill="#5c4033" rx="1" />
                <line x1="440" y1="360" x2="432" y2="340" stroke="#5c4033" stroke-width="2" />
                <line x1="440" y1="340" x2="447" y2="320" stroke="#5c4033" stroke-width="1.8" />
                <ellipse cx="440" cy="270" rx="22" ry="75" fill="#15803d" opacity="0.92" />
                <ellipse cx="440" cy="230" rx="16" ry="60" fill="#16a34a" opacity="0.94" />
                <ellipse cx="440" cy="180" rx="10" ry="40" fill="#22c55e" opacity="0.95" />
              </g>

              <!-- Hydrangea bushes -->
              <g id="front-garden-hydrangeas" style="pointer-events: none;">
                <circle cx="538" cy="450" r="10" fill="#15803d" />
                <circle cx="550" cy="448" r="12" fill="#16a34a" />
                <circle cx="565" cy="450" r="10" fill="#15803d" />
                <circle cx="536" cy="443" r="5" fill="#fef08a" opacity="0.9" />
                <circle cx="548" cy="439" r="7" fill="#ffffff" opacity="0.9" />
                <circle cx="560" cy="442" r="6" fill="#fef08a" opacity="0.9" />
                <circle cx="566" cy="445" r="4" fill="#ffffff" opacity="0.9" />
              </g>
            `:""}

            ${"barnhouse"===t?j`
              <rect x="290" y="455" width="300" height="25" fill="#1e293b" stroke="#0f172a" stroke-width="0.8" />
              <rect x="290" y="280" width="300" height="175" fill="#172554" stroke="#0f172a" stroke-width="1" />
              ${Array.from({length:26}).map((t,e)=>j`
                <line x1="${300+11*e}" y1="280" x2="${300+11*e}" y2="455" stroke="#020617" stroke-width="0.8" opacity="0.45" />
              `)}
              <!-- Door -->
              <g id="house-door">
                <rect x="310" y="380" width="35" height="75" fill="#451a03" stroke="#020617" stroke-width="1.5" />
                <line x1="317" y1="395" x2="317" y2="435" stroke="#1e293b" stroke-width="2.5" stroke-linecap="round" />
              </g>
              <!-- Roof -->
              <polygon points="260,280 440,150 620,280" fill="#0f172a" stroke="#020617" stroke-width="2" />
              <line x1="260" y1="280" x2="440" y2="150" stroke="#334155" stroke-width="2.5" />
              <line x1="620" y1="280" x2="440" y2="150" stroke="#334155" stroke-width="2.5" />
              <!-- Solar panels -->
              <g transform="translate(440, 150) rotate(37.5)">
                <rect x="15" y="-12" width="135" height="10" fill="url(#solar-panel-grad)" stroke="#1e1b4b" stroke-width="1.5" rx="2" />
              </g>
              <!-- Tall window -->
              <rect x="395" y="270" width="120" height="180" fill="${Q}" stroke="#0f172a" stroke-width="3.0" style="filter: ${X}; transition: fill 0.5s ease;" rx="2" />
              <polygon points="395,270 440,220 485,270" fill="${Q}" stroke="#0f172a" stroke-width="2.0" style="filter: ${X};" />
              <line x1="440" y1="220" x2="440" y2="450" stroke="#0f172a" stroke-width="2" />
              <line x1="395" y1="330" x2="515" y2="330" stroke="#0f172a" stroke-width="1.5" />
              <line x1="395" y1="390" x2="515" y2="390" stroke="#0f172a" stroke-width="1.5" />
            `:""}

            ${"cubist-bungalow"===t?j`
              <rect x="290" y="455" width="300" height="25" fill="#1e293b" stroke="#0f172a" stroke-width="0.8" />
              <rect x="290" y="320" width="90" height="135" fill="#64748b" stroke="#475569" stroke-width="1" />
              <line x1="290" y1="380" x2="380" y2="380" stroke="#475569" stroke-width="0.8" opacity="0.5" />
              <rect x="380" y="270" width="210" height="185" fill="#f8fafc" stroke="#cbd5e1" stroke-width="1" />
              <rect x="285" y="315" width="100" height="6" fill="#334155" rx="1.5" />
              <rect x="375" y="265" width="220" height="6" fill="#1e293b" rx="1.5" />
              <!-- Door -->
              <g id="house-door">
                <rect x="310" y="380" width="35" height="75" fill="#3b2314" stroke="#1c1009" stroke-width="1.5" />
                <line x1="337" y1="410" x2="337" y2="430" stroke="#cbd5e1" stroke-width="1.8" stroke-linecap="round" />
              </g>
              <!-- Solar panels -->
              <g id="cubist-solar-mounting">
                <line x1="445" y1="270" x2="545" y2="270" stroke="#334155" stroke-width="2.5" stroke-linecap="round" />
                <line x1="535" y1="270" x2="535" y2="242" stroke="#475569" stroke-width="2.0" />
                <line x1="455" y1="270" x2="455" y2="263" stroke="#475569" stroke-width="2.0" />
                <g transform="translate(440, 268) rotate(-15)">
                  <rect x="0" y="-10" width="110" height="10" fill="url(#solar-panel-grad)" stroke="#1e1b4b" stroke-width="1.5" rx="1" />
                  <line x1="27.5" y1="-10" x2="27.5" y2="0" stroke="#3b82f6" stroke-width="0.5" opacity="0.3" />
                  <line x1="55" y1="-10" x2="55" y2="0" stroke="#3b82f6" stroke-width="0.5" opacity="0.3" />
                  <line x1="82.5" y1="-10" x2="82.5" y2="0" stroke="#3b82f6" stroke-width="0.5" opacity="0.3" />
                  <line x1="0" y1="-5" x2="110" y2="-5" stroke="#3b82f6" stroke-width="0.5" opacity="0.3" />
                </g>
              </g>
              <!-- Windows -->
              <rect x="395" y="360" width="120" height="80" fill="${Q}" stroke="#0f172a" stroke-width="2.5" style="filter: ${X}; transition: fill 0.5s ease;" rx="1" />
              <line x1="435" y1="360" x2="435" y2="440" stroke="#0f172a" stroke-width="1.5" />
              <line x1="475" y1="360" x2="475" y2="440" stroke="#0f172a" stroke-width="1.5" />
              <rect x="395" y="290" width="120" height="50" fill="${Q}" stroke="#0f172a" stroke-width="2.0" style="filter: ${X}; transition: fill 0.5s ease;" rx="1" />
              <line x1="455" y1="290" x2="455" y2="340" stroke="#0f172a" stroke-width="1.5" />
            `:""}

            ${"townhouse"===t?j`
              <rect x="290" y="455" width="300" height="25" fill="#292524" stroke="#1c1917" stroke-width="0.8" />
              <polygon points="290,230 440,150 590,230" fill="#292524" stroke="#1c1917" stroke-width="1.2" opacity="0.8" />
              <polygon points="290,230 320,230 320,200 350,200 350,170 380,170 380,140 500,140 500,170 530,170 530,200 560,200 560,230 590,230" fill="#44403c" stroke="#1c1917" stroke-width="1" />
              <rect x="290" y="230" width="300" height="225" fill="#44403c" stroke="#1c1917" stroke-width="1" />
              ${Array.from({length:32}).map((t,e)=>j`
                <line x1="290" y1="${230+7*e}" x2="590" y2="${230+7*e}" stroke="#292524" stroke-width="0.5" opacity="0.35" />
              `)}
              <!-- Door -->
              <g id="house-door">
                <rect x="310" y="380" width="35" height="75" fill="#7c2d12" stroke="#431407" stroke-width="1.8" rx="1" />
                <line x1="337" y1="410" x2="337" y2="430" stroke="#cbd5e1" stroke-width="1.8" stroke-linecap="round" />
              </g>
              <!-- Solar panels -->
              <g transform="translate(440, 150) rotate(29.6)">
                <rect x="15" y="-12" width="120" height="10" fill="url(#solar-panel-grad)" stroke="#1e1b4b" stroke-width="1.5" rx="2" />
              </g>
              <!-- Windows -->
              <rect x="395" y="375" width="130" height="80" fill="${Q}" stroke="#f8fafc" stroke-width="2.5" style="filter: ${X}; transition: fill 0.5s ease;" rx="1" />
              <line x1="460" y1="375" x2="460" y2="455" stroke="#f8fafc" stroke-width="1.8" />
              <line x1="395" y1="415" x2="525" y2="415" stroke="#f8fafc" stroke-width="1.2" />
              ${[335,420,505].map(t=>j`
                <rect x="${t}" y="290" width="35" height="60" fill="${Q}" stroke="#f8fafc" stroke-width="2.0" style="filter: ${X}; transition: fill 0.5s ease;" rx="1" />
                <line x1="${t+17.5}" y1="290" x2="${t+17.5}" y2="350" stroke="#f8fafc" stroke-width="1.2" />
              `)}
              ${[370,460].map(t=>j`
                <rect x="${t}" y="210" width="30" height="45" fill="${Q}" stroke="#f8fafc" stroke-width="1.8" style="filter: ${X}; transition: fill 0.5s ease;" rx="1" />
                <line x1="${t+15}" y1="210" x2="${t+15}" y2="255" stroke="#f8fafc" stroke-width="1" />
              `)}
            `:""}

            <!-- Fallback Default Brick House (for backward compatibility if no/invalid houseStyle) -->
            ${"modern-villa"!==t&&"classic-jaren30"!==t&&"barnhouse"!==t&&"cubist-bungalow"!==t&&"townhouse"!==t?j`
              <!-- LEFT WING -->
              <g id="left-wing">
                <rect x="180" y="370" width="140" height="110" fill="url(#brick-pat)" stroke="#0f172a" stroke-width="2" />
                <polygon points="175,370 205,330 320,330 320,370" fill="url(#tiles-pat)" stroke="#0f172a" stroke-width="2" />
                <line x1="172" y1="373" x2="205" y2="328" stroke="#0f172a" stroke-width="12" stroke-linecap="round" />
                <line x1="172" y1="373" x2="205" y2="328" stroke="#1e293b" stroke-width="8"  stroke-linecap="round" />
                <line x1="205" y1="330" x2="320" y2="330" stroke="#0f172a" stroke-width="8" />
                <line x1="205" y1="330" x2="320" y2="330" stroke="#1e293b" stroke-width="4" />
                <rect x="230" y="390" width="40" height="45" fill="${Q}" stroke="#0f172a" stroke-width="2" style="filter: ${X}; transition: fill 0.5s ease, filter 0.5s ease;" />
                <line x1="250" y1="390" x2="250" y2="435" stroke="#0f172a" stroke-width="1.2" />
                <line x1="230" y1="412.5" x2="270" y2="412.5" stroke="#0f172a" stroke-width="1.2" />
              </g>

              <!-- RIGHT WING -->
              <g id="right-wing">
                <polygon points="380,480 380,270 500,130 680,340 680,480" fill="url(#brick-pat)" stroke="#0f172a" stroke-width="2" />
                <line x1="380" y1="270" x2="500" y2="130" stroke="#0f172a" stroke-width="12" stroke-linecap="round" />
                <line x1="380" y1="270" x2="500" y2="130" stroke="#1e293b" stroke-width="8"  stroke-linecap="round" />
                <line x1="692" y1="354" x2="500" y2="130" stroke="#0f172a" stroke-width="12" stroke-linecap="round" />
                <line x1="692" y1="354" x2="500" y2="130" stroke="#1e293b" stroke-width="8"  stroke-linecap="round" />
                <rect x="465" y="385" width="40" height="45" fill="${Q}" stroke="#0f172a" stroke-width="2" style="filter: ${X}; transition: fill 0.5s ease, filter 0.5s ease;" />
                <line x1="485" y1="385" x2="485" y2="430" stroke="#0f172a" stroke-width="1.2" />
                <line x1="465" y1="407.5" x2="505" y2="407.5" stroke="#0f172a" stroke-width="1.2" />
                <rect x="555" y="385" width="40" height="45" fill="${Q}" stroke="#0f172a" stroke-width="2" style="filter: ${X}; transition: fill 0.5s ease, filter 0.5s ease;" />
                <line x1="575" y1="385" x2="575" y2="430" stroke="#0f172a" stroke-width="1.2" />
                <line x1="555" y1="407.5" x2="595" y2="407.5" stroke="#0f172a" stroke-width="1.2" />
                <rect x="480" y="280" width="40" height="40" fill="${Q}" stroke="#0f172a" stroke-width="2" style="filter: ${X}; transition: fill 0.5s ease, filter 0.5s ease;" />
                <line x1="500" y1="280" x2="500" y2="320" stroke="#0f172a" stroke-width="1.2" />
                <line x1="480" y1="300" x2="520" y2="300" stroke="#0f172a" stroke-width="1.2" />
              </g>

              <!-- CENTER ENTRANCE GABLE -->
              <g id="center-portal">
                <polygon points="320,480 320,340 380,270 440,340 440,480" fill="url(#brick-pat)" stroke="#0f172a" stroke-width="2" />
                <line x1="308" y1="354" x2="380" y2="270" stroke="#0f172a" stroke-width="12" stroke-linecap="round" />
                <line x1="308" y1="354" x2="380" y2="270" stroke="#1e293b" stroke-width="8"  stroke-linecap="round" />
                <line x1="452" y1="354" x2="380" y2="270" stroke="#0f172a" stroke-width="12" stroke-linecap="round" />
                <line x1="452" y1="354" x2="380" y2="270" stroke="#1e293b" stroke-width="8"  stroke-linecap="round" />
                <rect x="360" y="395" width="40" height="85" fill="#052e16" stroke="#021b0d" stroke-width="2" />
                <circle cx="390" cy="435" r="2" fill="#fbbf24" />
              </g>
            `:""}
          </g>

          <!-- ── SOLAR PANELS (conditional) ── -->
          ${d?j`
            <g id="solar-panels" class="interactiveGroup solarGroup" @click=${t=>{t.stopPropagation(),v("solar")}}>
              <!-- Only render solar panels if it is the default wing house, since the custom styles have solar panels integrated on their roofs -->
              ${"modern-villa"!==t&&"classic-jaren30"!==t&&"barnhouse"!==t&&"cubist-bungalow"!==t&&"townhouse"!==t?j`
                <g transform="translate(320, 340) rotate(-49.4)">
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
                  <rect x="10" y="-13" width="235" height="6" fill="url(#solar-panel-grad)" stroke="#1e40af" stroke-width="1.2" rx="1.5" />
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
              `:""}
            </g>
          `:""}

          <!-- ── INVERTER (Omvormer) ── -->
          <g id="inverter">
            <rect x="373" y="295" width="14" height="18" fill="#1e293b" stroke="#475569" stroke-width="1" rx="1.5" />
            <rect x="376" y="306" width="8" height="4" fill="#0f172a" rx="0.5" />
            <circle cx="380" cy="301" r="1.5" fill="#f59e0b" />
          </g>

          <!-- ── METERKAST (fuse box) ── -->
          <rect x="340" y="410" width="10" height="20" fill="#1e293b" rx="1" />
          <circle cx="345" cy="420" r="2.5" fill="#10b981" />

          <!-- ── BATTERY (conditional) ── -->
          ${f?j`
            <g id="house-battery" class="interactiveGroup batteryGroup" @click=${t=>{t.stopPropagation(),v("battery")}}>
              <!-- Render battery in Jaren 30 or other custom styles at x=320, or let it adapt -->
              <rect x="320" y="410" width="30" height="70" fill="#f8fafc" stroke="#cbd5e1" stroke-width="1.5" rx="3" />
              <rect x="325" y="418" width="20" height="10" fill="#000" rx="1.5" />
              <text x="335" y="426" fill="${a<20?"#ef4444":A?"#10b981":"#f97316"}" font-size="8" font-weight="bold" text-anchor="middle">${a}%</text>
              <!-- SoC bar track -->
              <rect x="334" y="435" width="2" height="40" fill="rgba(0,0,0,0.15)" rx="0.5" />
              <!-- SoC bar fill -->
              <rect x="334" y="${475-a/100*40}" width="2" height="${a/100*40}" fill="${a<20?"#ef4444":A?"#10b981":"#f97316"}" rx="0.5" />
            </g>
          `:""}

          <!-- ── EV CHARGER (conditional) ── -->
          ${y?j`
            <g id="ev-charger" class="interactiveGroup evGroup" @click=${t=>{t.stopPropagation(),v("ev")}}>
              <rect x="448" y="425" width="14" height="55" fill="#1e293b" rx="2" />
              <rect x="443" y="415" width="24" height="20" fill="#334155" stroke="#1e293b" stroke-width="1" rx="3" />
              <circle cx="455" cy="425" r="4"
                fill="${C?"#a855f7":"#10b981"}"
                style="filter: ${C?"drop-shadow(0 0 6px #a855f7)":"none"}; transition: fill 0.5s ease;" />
              <!-- Charging cable -->
              <path d="M 455,440 C 460,460 475,470 495,465" fill="none" stroke="#a855f7" stroke-width="2.5" stroke-dasharray="4,3" />
            </g>

            <!-- EV Car -->
            <g id="ev-car" class="interactiveGroup evGroup" opacity="${C?1:.4}" style="transition: opacity 0.6s ease;" @click=${t=>{t.stopPropagation(),v("ev")}}>
              ${"hatchback"===e?j`
                <g transform="translate(490, 430)">
                  <ellipse cx="90" cy="55" rx="90" ry="6" fill="rgba(0,0,0,0.4)" />
                  <path d="M 0,44 C 0,44 4,28 18,28 C 32,28 50,8 75,6 C 100,4 118,16 132,28 C 148,40 158,44 160,44 L 158,52 L 2,52 Z"
                    fill="#475569" stroke="rgba(255,255,255,0.2)" stroke-width="1" />
                  <path d="M 32,28 C 44,14 68,10 86,10 C 102,10 114,22 120,27 L 116,37 L 28,37 Z" fill="#0f172a" opacity="0.85" />
                  <path d="M 38,29 L 68,29 L 68,36 L 34,36 Z" fill="rgba(255,255,255,0.12)" />
                  <path d="M 72,29 L 106,29 L 112,36 L 72,36 Z" fill="rgba(255,255,255,0.12)" />
                  <path d="M 0,44 C 4,44 7,46 9,48 L 0,50 Z" fill="#e0f2fe" style="filter: drop-shadow(0 0 5px #00f5ff);" />
                  <path d="M 160,44 C 157,44 156,46 155,48 L 160,50 Z" fill="#ef4444" style="filter: drop-shadow(0 0 3px #ef4444);" />
                  <circle cx="32" cy="50" r="16" fill="#090d16" />
                  <circle cx="32" cy="50" r="10" fill="#475569" stroke="#cbd5e1" stroke-width="1.5" />
                  ${Array.from({length:6}).map((t,e)=>{const i=e*Math.PI/3;return j`<line x1="32" y1="50" x2="${32+10*Math.cos(i)}" y2="${50+10*Math.sin(i)}" stroke="#cbd5e1" stroke-width="1.2" />`})}
                  <circle cx="118" cy="50" r="16" fill="#090d16" />
                  <circle cx="118" cy="50" r="10" fill="#475569" stroke="#cbd5e1" stroke-width="1.5" />
                  ${Array.from({length:6}).map((t,e)=>{const i=e*Math.PI/3;return j`<line x1="118" y1="50" x2="${118+10*Math.cos(i)}" y2="${50+10*Math.sin(i)}" stroke="#cbd5e1" stroke-width="1.2" />`})}
                </g>
              `:""}
              ${"sedan"===e?j`
                <g transform="translate(500, 432)">
                  <ellipse cx="70" cy="48" rx="74" ry="4.5" fill="rgba(0,0,0,0.45)" />
                  <path
                    d="M 0,38 C 0,38 8,24 22,24 C 36,24 50,4 75,3 C 100,2 115,16 125,24 L 138,28 C 140,32 140,38 138,42 L 136,46 L 2,46 Z"
                    fill="url(#car-body-grad)"
                    stroke="rgba(255,255,255,0.2)"
                    stroke-width="1"
                  />
                  <path d="M 32,23 C 44,10 68,6 84,6 C 96,6 108,14 116,21 L 112,31 L 28,31 Z" fill="#0f172a" opacity="0.85" />
                  <path d="M 38,24 L 66,24 L 66,29 L 34,29 Z" fill="rgba(255,255,255,0.15)" />
                  <path d="M 70,24 L 102,24 L 108,29 L 70,29 Z" fill="rgba(255,255,255,0.15)" />
                  <path d="M 0,38 C 4,38 6,40 8,42 L 0,44 Z" fill="#e0f2fe" style="filter: drop-shadow(0 0 5px #00f5ff);" />
                  <path d="M 138,36 C 136,36 135,38 134,40 L 138,42 Z" fill="#ef4444" style="filter: drop-shadow(0 0 3px #ef4444);" />
                  <rect x="55" y="34" width="8" height="2" rx="1" fill="#1e293b" opacity="0.6" />
                  <rect x="85" y="34" width="8" height="2" rx="1" fill="#1e293b" opacity="0.6" />
                  <path d="M 28,32 C 24,32 23,30 25,30 Z" fill="url(#car-body-grad)" />
                  <circle cx="30" cy="44" r="13.5" fill="#090d16" />
                  <circle cx="30" cy="44" r="8.5" fill="#475569" stroke="#cbd5e1" stroke-width="1.5" />
                  ${Array.from({length:7}).map((t,e)=>{const i=2*e*Math.PI/7;return j`<line x1="30" y1="44" x2="${30+8.5*Math.cos(i)}" y2="${44+8.5*Math.sin(i)}" stroke="#cbd5e1" stroke-width="1.2" />`})}
                  <circle cx="103" cy="44" r="13.5" fill="#090d16" />
                  <circle cx="103" cy="44" r="8.5" fill="#475569" stroke="#cbd5e1" stroke-width="1.5" />
                  ${Array.from({length:7}).map((t,e)=>{const i=2*e*Math.PI/7;return j`<line x1="103" y1="44" x2="${103+8.5*Math.cos(i)}" y2="${44+8.5*Math.sin(i)}" stroke="#cbd5e1" stroke-width="1.2" />`})}
                </g>
              `:""}
              ${"suv"===e?j`
                <g transform="translate(500, 422)">
                  <ellipse cx="70" cy="58" rx="74" ry="5.5" fill="rgba(0,0,0,0.45)" />
                  <path d="M 15,56 A 17,17 0 0,1 47,56" fill="none" stroke="#1f2937" stroke-width="3" />
                  <path d="M 88,56 A 17,17 0 0,1 120,56" fill="none" stroke="#1f2937" stroke-width="3" />
                  <path
                    d="M 0,48 C 0,48 4,30 18,30 C 32,30 45,6 70,4 C 95,2 112,18 122,28 L 138,32 C 140,36 140,46 138,50 L 136,56 L 2,56 Z"
                    fill="url(#car-body-grad)"
                    stroke="rgba(255,255,255,0.2)"
                    stroke-width="1"
                  />
                  <path d="M 32,29 C 44,12 68,8 84,8 C 98,8 108,18 116,27 L 112,38 L 28,38 Z" fill="#0f172a" opacity="0.85" />
                  <path d="M 38,30 L 66,30 L 66,36 L 34,36 Z" fill="rgba(255,255,255,0.15)" />
                  <path d="M 70,30 L 102,30 L 108,36 L 70,36 Z" fill="rgba(255,255,255,0.15)" />
                  <path d="M 0,48 C 4,48 6,50 8,52 L 0,54 Z" fill="#e0f2fe" style="filter: drop-shadow(0 0 5px #00f5ff);" />
                  <path d="M 138,44 C 136,44 135,46 134,48 L 138,50 Z" fill="#ef4444" style="filter: drop-shadow(0 0 3px #ef4444);" />
                  <rect x="55" y="42" width="8" height="2" rx="1" fill="#1e293b" opacity="0.6" />
                  <rect x="85" y="42" width="8" height="2" rx="1" fill="#1e293b" opacity="0.6" />
                  <path d="M 28,32 C 24,32 23,30 25,30 Z" fill="url(#car-body-grad)" />
                  <circle cx="31" cy="54" r="15.5" fill="#090d16" />
                  <circle cx="31" cy="54" r="10" fill="#475569" stroke="#cbd5e1" stroke-width="1.5" />
                  ${Array.from({length:5}).map((t,e)=>{const i=2*e*Math.PI/5;return j`<line x1="31" y1="54" x2="${31+10*Math.cos(i)}" y2="${54+10*Math.sin(i)}" stroke="#cbd5e1" stroke-width="1.5" />`})}
                  <circle cx="104" cy="54" r="15.5" fill="#090d16" />
                  <circle cx="104" cy="54" r="10" fill="#475569" stroke="#cbd5e1" stroke-width="1.5" />
                  ${Array.from({length:5}).map((t,e)=>{const i=2*e*Math.PI/5;return j`<line x1="104" y1="54" x2="${104+10*Math.cos(i)}" y2="${54+10*Math.sin(i)}" stroke="#cbd5e1" stroke-width="1.5" />`})}
                </g>
              `:""}
            </g>
          `:""}

        </g>
        <!-- End of scaled group -->

        <!-- ════════════════════════════════════════════════════════════════ -->
        <!-- FLOW CABLES: Drawn outside the scaled group using scaled coords -->
        <!-- ════════════════════════════════════════════════════════════════ -->
        ${d?at(`M ${tt},${et} L ${tt},${q(408)} L ${J},${q(408)} L ${J},${K}`,L,$t(o),gt.solar.stroke,gt.solar.glow):""}

        ${at(`M 192,455 L 192,493 L ${J},493 L ${J},${K}`,M||S,$t(c),O.stroke,O.glow,S)}

        ${f?at(`M ${Y(310)},${q(420)} L ${J},${K}`,A||E,$t(n),T.stroke,T.glow,A):""}

        ${y?at(`M ${J},${K} L ${J},503 L 664,503 L 664,415`,C,$t(h),gt.ev.stroke,gt.ev.glow):""}

        <!-- ════════════════════════════════════════════════════════════════ -->
        <!-- SOLAR HUD card (top right sky area)                            -->
        <!-- ════════════════════════════════════════════════════════════════ -->
        ${d?j`
          <g class="interactiveGroup solarGroup" @click=${()=>v("solar")}>
            <g transform="translate(696, 90)">
              <rect x="0" y="0" width="200" height="65"
                class="hudCard ${L?"hudCardActive":""}"
                rx="8" ry="8"
                style="${L?`color: ${gt.solar.stroke}`:""}" />
              <text x="12" y="20" class="hudTitle">Zonnepanelen</text>
              <text x="12" y="39" class="hudValue ${L?"hudActiveText":""}"
                style="${L?`color: ${gt.solar.stroke}`:""}">
                ${L?bt(o):"—"}
              </text>
              <text x="12" y="53" class="hudSub">
                ${null!==s?`Vandaag: ${s.toFixed(1)} kWh`:L?"Opwek actief":"Geen opwek"}
              </text>
            </g>
          </g>
        `:""}

        <!-- ════════════════════════════════════════════════════════════════ -->
        <!-- BOTTOM HUD CARDS (grid, home, battery, ev)                     -->
        <!-- ════════════════════════════════════════════════════════════════ -->
        ${lt.map((t,e)=>j`
            <g class="interactiveGroup" @click=${()=>v(t.id)}>
              <g transform="translate(${nt+e*(170+nt)}, 510)">
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
  `}class _t extends at{constructor(){super(...arguments),this.selectedNode=null}static getStubConfig(){return{title:"Energieverloop",entities:{}}}setConfig(t){if(!t)throw new Error("Ongeldige configuratie");this.config=t}getEntityValue(t){if(!t||!this.hass)return 0;const e=t=>{const e=this.hass?.states[t];if(!e)return 0;const i=parseFloat(e.state);return isNaN(i)?0:i};return Array.isArray(t)?t.reduce((t,i)=>t+e(i),0):e(t)}handleNodeClick(t){console.info(`[energy-flow-card] Click registered on node: ${t}`),this.selectedNode=this.selectedNode===t?null:t;let e=t;"battery"===t?e=this.config?.entities.battery_power?"battery_power":"battery_soc":"home"===t?e="load":"ev"===t?e="charger":"grid"===t?e=this.config?.entities.grid?"grid":"solar":"solar"===t&&(e=this.config?.entities.solar_energy_today?"solar_energy_today":"solar");const i=this.config?.entities?this.config.entities[e]:void 0,r=Array.isArray(i)?i[0]:i;if(console.info(`[energy-flow-card] Node '${t}' mapped to key '${e}', resolved entity ID: '${r}'`),r){console.info(`[energy-flow-card] Dispatching 'hass-more-info' event for entity: ${r}`);const t=new CustomEvent("hass-more-info",{detail:{entityId:r},bubbles:!0,composed:!0});this.dispatchEvent(t)}else console.warn(`[energy-flow-card] Could not dispatch popup: No entity configured for node '${t}'`)}render(){if(!this.config||!this.hass)return W`<p style="color: red; padding: 16px;">Wachten op Home Assistant...</p>`;const{entities:t}=this.config,e=new Date,i=e.getHours()+e.getMinutes()/60;let r="afternoon";r=i>=5&&i<9?"morning":i>=9&&i<18?"afternoon":i>=18&&i<22?"evening":"night";const o=this.getEntityValue(t.solar),s=this.getEntityValue(t.load),l=this.getEntityValue(t.battery_power),n=t.battery_soc?this.getEntityValue(t.battery_soc):0,a=this.getEntityValue(t.charger);let h=0;t.grid&&(h=this.getEntityValue(t.grid));let c=l;if(void 0!==this.config.battery_invert){c=!0===this.config.battery_invert?l:-l}else if(t.grid){const t=o+h-s-a;c=Math.abs(l)>.05&&Math.abs(t)>.15?t*l<0?-l:l:-l}else c=-l;const d=t=>{if(!t)return null;const e=this.hass?.states[t];if(!e)return null;const i=parseFloat(e.state);return isNaN(i)?null:i},f=d(t.solar_energy_today),y=d(t.grid_import_today),p=d(t.grid_export_today),g=d(t.home_today),x=d(t.battery_charge_today),u=d(t.battery_discharge_today),k=d(t.ev_today);let w="sunny";t.weather&&this.hass?.states[t.weather]&&(w=this.hass.states[t.weather].state);let $=6,b=21;const m=this.hass?.states["sun.sun"];if(m)try{const t=new Date(m.attributes.next_rising),e=new Date(m.attributes.next_setting);$=t.getHours()+t.getMinutes()/60,b=e.getHours()+e.getMinutes()/60}catch(t){console.warn("[energy-flow-card] Fout bij parsen van sun.sun tijden:",t)}t.grid||(h=s+a-o-c);const v=!!t.solar,_=!!t.battery_power,A=!!t.charger,E=wt(i),M=`background: linear-gradient(to bottom, ${E.top} 0%, ${E.horizon} 81%, #0a2919 81.1%, #05160d 100%);`;return W`
      <ha-card style="${M}">
        <div class="card-container">
          ${this.config.title?W`
            <div class="card-header">
              <div class="card-title">${this.config.title}</div>
            </div>
          `:""}

          <div class="sceneWrapper">
            ${vt({timeHour:i,timeOfDay:r,solar:o,solarToday:f,load:s,batteryPower:c,soc:n,charger:a,grid:h,showSolar:v,showBattery:_,showEV:A,weather:w,sunriseHour:$,sunsetHour:b,gridImportToday:y,gridExportToday:p,homeToday:g,batteryChargeToday:x,batteryDischargeToday:u,evToday:k,houseStyle:this.config?.house_style,carType:this.config?.car_type,onNodeClick:t=>this.handleNodeClick(t)})}
          </div>
        </div>
      </ha-card>
    `}getCardSize(){return 6}}_t.styles=pt,t([ft({attribute:!1})],_t.prototype,"hass",void 0),t([yt()],_t.prototype,"config",void 0),t([yt()],_t.prototype,"selectedNode",void 0),customElements.get("energy-flow-card")||(customElements.define("energy-flow-card",_t),console.info("%c  ENERGY-FLOW-CARD  %c Version 2.0.0 ","color: white; background: #10b981; font-weight: 700;","color: #10b981; background: #0f172a; font-weight: 700;"));export{_t as EnergyFlowCard};
