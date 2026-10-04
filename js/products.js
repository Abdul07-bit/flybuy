/* products.js — DEMO_MODE catalog. Structured to be swapped 1:1 for Shopify Storefront API
   product/collection nodes later (id, handle, title, price, images, variants, tags). */
const DEMO_MODE = true;

const ICONS = {
  headphones:'<svg viewBox="0 0 100 100" fill="none" stroke="currentColor" stroke-width="4"><path d="M20 55a30 30 0 0 1 60 0" stroke-linecap="round"/><rect x="14" y="50" width="18" height="32" rx="8" fill="var(--color-white)"/><rect x="68" y="50" width="18" height="32" rx="8" fill="var(--color-white)"/></svg>',
  earbuds:'<svg viewBox="0 0 100 100" fill="none" stroke="currentColor" stroke-width="4"><circle cx="35" cy="45" r="14" fill="var(--color-white)"/><path d="M35 59v14a6 6 0 0 0 12 0" stroke-linecap="round"/><circle cx="65" cy="45" r="14" fill="var(--color-white)"/><path d="M65 59v14a6 6 0 0 1-12 0" stroke-linecap="round"/></svg>',
  flask:'<svg viewBox="0 0 100 100" fill="none" stroke="currentColor" stroke-width="4"><rect x="30" y="20" width="18" height="10" rx="3" fill="var(--color-white)"/><path d="M28 30h22l4 55a8 8 0 0 1-8 8H32a8 8 0 0 1-8-8z" fill="var(--color-white)"/></svg>',
  dock:'<svg viewBox="0 0 100 100" fill="none" stroke="currentColor" stroke-width="4"><rect x="15" y="55" width="70" height="14" rx="6" fill="var(--color-white)"/><rect x="25" y="30" width="18" height="26" rx="3" fill="var(--color-white)"/><rect x="50" y="20" width="18" height="36" rx="3" fill="var(--color-white)"/></svg>',
  watch:'<svg viewBox="0 0 100 100" fill="none" stroke="currentColor" stroke-width="4"><rect x="30" y="28" width="40" height="44" rx="10" fill="var(--color-white)"/><path d="M40 18h20M40 82h20" stroke-linecap="round"/></svg>',
  speaker:'<svg viewBox="0 0 100 100" fill="none" stroke="currentColor" stroke-width="4"><rect x="25" y="15" width="50" height="70" rx="12" fill="var(--color-white)"/><circle cx="50" cy="40" r="9"/><circle cx="50" cy="65" r="13"/></svg>',
  hub:'<svg viewBox="0 0 100 100" fill="none" stroke="currentColor" stroke-width="4"><rect x="20" y="35" width="60" height="30" rx="8" fill="var(--color-white)"/><path d="M35 65v10M50 65v10M65 65v10" stroke-linecap="round"/></svg>',
  bag:'<svg viewBox="0 0 100 100" fill="none" stroke="currentColor" stroke-width="4"><path d="M30 40a20 20 0 0 1 40 0" stroke-linecap="round"/><rect x="20" y="40" width="60" height="45" rx="8" fill="var(--color-white)"/></svg>',
  lamp:'<svg viewBox="0 0 100 100" fill="none" stroke="currentColor" stroke-width="4"><path d="M20 25h35l-10 25H35z" fill="var(--color-white)"/><path d="M42 50v20M28 85h28" stroke-linecap="round"/></svg>',
  mount:'<svg viewBox="0 0 100 100" fill="none" stroke="currentColor" stroke-width="4"><rect x="30" y="15" width="40" height="60" rx="8" fill="var(--color-white)"/><path d="M30 25 L15 40 L15 55 L30 65" stroke-linecap="round"/></svg>',
  stand:'<svg viewBox="0 0 100 100" fill="none" stroke="currentColor" stroke-width="4"><path d="M20 70 L50 25 L80 70Z" fill="var(--color-white)"/><path d="M30 85h40" stroke-linecap="round"/></svg>',
  organizer:'<svg viewBox="0 0 100 100" fill="none" stroke="currentColor" stroke-width="4"><rect x="18" y="30" width="64" height="45" rx="8" fill="var(--color-white)"/><path d="M18 45h64"/></svg>',
};
function icon(k){ return ICONS[k] || ICONS.headphones; }

const PRODUCTS = [
  {id:'aurawave-headphones',name:'AuraWave Headphones',cat:'Electronics',icon:'headphones',price:69.00,compare:89.00,rating:4.8,reviews:312,stock:14,featured:true,tags:['trending','new'],
   short:'Active noise cancellation with a 40-hour battery and a balanced, detailed sound.',
   features:['Active noise cancellation','40h battery life','Memory-foam ear cushions','Bluetooth 5.3'],
   overview:'AuraWave pairs adaptive noise cancellation with a warm, detailed sound signature built for long listening sessions — commute, flight, or full workday.',
   specs:{Driver:'40mm dynamic',Battery:'40 hours (ANC off)',Weight:'250g',Connectivity:'Bluetooth 5.3'}},
  {id:'pulsebud-pro',name:'PulseBud Pro Earbuds',cat:'Mobile Accessories',icon:'earbuds',price:42.00,compare:52.00,rating:4.6,reviews:204,stock:22,featured:false,tags:['trending'],
   short:'True wireless earbuds with transparency mode and IPX5 sweat resistance.',
   features:['Transparency mode','IPX5 water resistant','24h total battery','Touch controls'],
   overview:'Compact, secure-fit earbuds tuned for daily wear, with a charging case that adds three extra charges on the go.',
   specs:{Driver:'11mm dynamic',Battery:'6h + 18h case',Weight:'5.4g per bud',Connectivity:'Bluetooth 5.2'}},
  {id:'driftflask',name:'DriftFlask Thermal Bottle',cat:'Travel',icon:'flask',price:25.00,compare:null,rating:4.7,reviews:156,stock:40,featured:false,tags:['new'],
   short:'Double-wall stainless steel — keeps drinks cold 24h or hot 12h.',
   features:['24h cold / 12h hot','Leak-proof lid','BPA-free','600ml capacity'],
   overview:'Vacuum-insulated stainless steel built for daily carry — desk, gym bag, or trail pack.',
   specs:{Capacity:'600ml',Material:'18/8 stainless steel',Weight:'320g',Lid:'Leak-proof flip'}},
  {id:'triocharge-dock',name:'TrioCharge Dock',cat:'Desk Gadgets',icon:'dock',price:42.00,compare:54.00,rating:4.5,reviews:98,stock:3,featured:false,tags:['deal'],
   short:'Charge phone, watch and earbuds together with 15W fast charging.',
   features:['15W fast charging','3 devices at once','Foldable travel design','LED charge indicator'],
   overview:'One compact dock for your nightstand — phone, watch and earbuds charge in parallel without a tangle of cables.',
   specs:{Output:'15W max',Ports:'USB-C in',Weight:'180g',Compatibility:'Qi-enabled devices'}},
  {id:'orbitfit-watch',name:'OrbitFit Smart Watch',cat:'Smart Home',icon:'watch',price:99.00,compare:115.00,rating:4.4,reviews:87,stock:9,featured:false,tags:['trending'],
   short:'Heart-rate, sleep and workout tracking with a 10-day battery.',
   features:['Heart-rate & SpO2','Sleep tracking','10-day battery','50m water resistant'],
   overview:'A fitness-first smart watch that stays out of the way — long battery life and a light aluminium case.',
   specs:{Display:'1.4" AMOLED',Battery:'10 days typical',Weight:'38g','Water rating':'5ATM'}},
  {id:'commuter-tech-bag',name:'Commuter Tech Bag',cat:'Travel',icon:'bag',price:62.00,compare:null,rating:4.6,reviews:64,stock:17,featured:false,tags:[],
   short:'Water-resistant daily carry with a padded 15" laptop sleeve.',
   features:['Fits 15" laptop','Water-resistant shell','Hidden zip pocket','Padded straps'],
   overview:'Built for commuting with a laptop and a change of clothes, without feeling bulky.',
   specs:{Capacity:'22L',Material:'Ripstop nylon',Weight:'620g',Laptop:'Up to 15"'}},
  {id:'halo-desk-lamp',name:'Halo Desk Lamp',cat:'Desk Gadgets',icon:'lamp',price:36.00,compare:45.00,rating:4.5,reviews:73,stock:0,featured:false,tags:['deal'],
   short:'Warm-to-cool dimmable LED with a wireless charging base.',
   features:['Stepless dimming','3200K-6500K range','Wireless charge base','Touch control'],
   overview:'A desk lamp that doubles as a charging pad, with light temperature that adjusts from warm evenings to focused daylight.',
   specs:{Output:'800 lumens max',Charging:'10W wireless',Weight:'750g',Power:'USB-C'}},
  {id:'gripmount-car',name:'GripMount Car Mount',cat:'Mobile Accessories',icon:'mount',price:19.00,compare:null,rating:4.3,reviews:41,stock:31,featured:false,tags:[],
   short:'One-hand magnetic mount for dashboard or windshield.',
   features:['Magnetic quick-release','360° rotation','Dashboard & vent mount','One-hand operation'],
   overview:'A minimal, strong-hold mount that keeps your phone secure over potholes without fiddly clamps.',
   specs:{Mount:'Magnetic + suction',Weight:'110g',Compatibility:'MagSafe & standard cases'}},
  {id:'risestand-laptop',name:'RiseStand Laptop Stand',cat:'Desk Gadgets',icon:'stand',price:29.00,compare:36.00,rating:4.7,reviews:112,stock:19,featured:false,tags:['new'],
   short:'Adjustable aluminium stand that folds flat for travel.',
   features:['6 height positions','Foldable & portable','Aluminium build','Ventilated design'],
   overview:'Raises your laptop to eye level for better posture at a desk, and folds down to slip into a bag pocket.',
   specs:{Material:'Aluminium alloy',Weight:'480g','Max load':'5kg'}},
  {id:'voyage-organizer',name:'Voyage Cable Organizer',cat:'Travel',icon:'organizer',price:21.00,compare:null,rating:4.5,reviews:38,stock:26,featured:false,tags:[],
   short:'Compact cable and accessory organizer with mesh pockets.',
   features:['5 mesh pockets','Water-resistant zip','Compact fold','Fits cables & chargers'],
   overview:'Keeps every cable, dongle and charger sorted in one zip pouch instead of a tangled bag bottom.',
   specs:{Size:'20 x 14cm',Material:'Ripstop nylon',Weight:'90g'}},
  {id:'echo-mini-speaker',name:'Echo Mini Speaker',cat:'Electronics',icon:'speaker',price:32.00,compare:39.00,rating:4.4,reviews:59,stock:8,featured:false,tags:['deal'],
   short:'Pocket-sized speaker with 12-hour battery and IPX6 rating.',
   features:['360° sound','IPX6 waterproof','12h battery','Pair two for stereo'],
   overview:'Small enough for a backpack side-pocket, loud enough for a backyard afternoon.',
   specs:{Battery:'12 hours',Output:'10W',Weight:'320g','Water rating':'IPX6'}},
  {id:'nexus-usbc-hub',name:'Nexus USB-C Hub',cat:'Smart Home',icon:'hub',price:38.00,compare:null,rating:4.6,reviews:47,stock:12,featured:false,tags:['new'],
   short:'7-in-1 hub with HDMI, USB-A, SD card and 100W pass-through.',
   features:['4K HDMI output','100W power delivery','SD/microSD reader','3x USB-A 3.0'],
   overview:'Turns one USB-C port into a full desk setup — display, storage, and fast charging for your laptop at once.',
   specs:{Ports:'7-in-1',Output:'4K@30Hz HDMI',Power:'100W passthrough',Weight:'85g'}},
];

const DEMO_REVIEWS = {
  'aurawave-headphones':[
    {name:'J. Carter',date:'2 weeks ago',rating:5,verified:true,body:'Noise cancellation is genuinely good on flights. Comfortable for hours.'},
    {name:'M. Reyes',date:'1 month ago',rating:4,verified:true,body:'Great sound, bass is a touch strong for my taste but adjustable.'},
    {name:'Demo Reviewer',date:'—',rating:5,verified:false,body:'Seeded demo review for preview purposes.',demo:true},
  ],
  'pulsebud-pro':[
    {name:'A. Whitfield',date:'3 weeks ago',rating:5,verified:true,body:'Fit stays secure even running. Case battery lasts my whole week.'},
    {name:'Demo Reviewer',date:'—',rating:4,verified:false,body:'Seeded demo review for preview purposes.',demo:true},
  ],
};

const CATEGORIES = [
  ['Electronics','headphones'],['Mobile Accessories','earbuds'],['Desk Gadgets','dock'],
  ['Smart Home','hub'],['Travel','bag'],['Trending Products','watch'],
];

const FAQS = [
  ['Shipping','How long does delivery take?','Standard delivery is 4–7 business days in the US and UK; express options show at checkout.'],
  ['Shipping','Do you ship outside the US and UK?','Not yet — FLYBUY currently ships within the United States and United Kingdom only.'],
  ['Returns','What is your return policy?','Unused items in original packaging can be returned within 30 days of delivery for a full refund.'],
  ['Returns','How do I start a return?','Go to Account → Orders → View Details → Start a return, or contact support with your order number.'],
  ['Payment','What payment methods are accepted?','Cards and other methods available at checkout — FLYBUY never stores your card details; payment is handled by the checkout provider.'],
  ['Orders','Can I change my order after placing it?','Contact support within 1 hour of placing an order and we will do our best to update it before it ships.'],
  ['Products','Do products come with a warranty?','Electronics carry a 1-year limited warranty; details are listed on each product page.'],
  ['Account','How do I reset my password?','Use "Forgot password" on the login screen — this demo simulates the email verification step locally.'],
];

function findProduct(id){ return PRODUCTS.find(p => p.id === id); }


/* ---- Custom catalog (admin-added) — DEMO ONLY: stored in this browser's localStorage. ----
   Writing to Shopify needs a private Admin API token, which must live on a server, never here. */
const CUSTOM_KEY = 'flybuy_custom_v1';
function loadCustom(){ try { return JSON.parse(localStorage.getItem(CUSTOM_KEY)) || {products:[],categories:[]}; } catch(e){ return {products:[],categories:[]}; } }
function saveCustom(c){ try { localStorage.setItem(CUSTOM_KEY, JSON.stringify(c)); return true; } catch(e){ return false; } }
(function mergeCustom(){
  const c = loadCustom();
  c.products.forEach(function(p){ PRODUCTS.unshift(p); });
  c.categories.forEach(function(n){ if(!CATEGORIES.some(function(x){return x[0]===n;})) CATEGORIES.push([n,'bag']); });
})();
function categoryNames(){
  return Array.from(new Set(CATEGORIES.map(function(c){return c[0];}).concat(PRODUCTS.map(function(p){return p.cat;})))).filter(function(n){return n!=='Trending Products';});
}
/* uploaded/remote image if present, else the built-in icon */
function media(p){
  return p.image ? '<img class="media-img" loading="lazy" src="' + p.image + '" alt="' + String(p.name).replace(/"/g,'&quot;') + '">' : icon(p.icon);
}

/* ---- Shopify Storefront API (live READ). Fill in both values to pull real products. ----
   The Storefront token is designed to be public. Never put an Admin API token here. */
const SHOPIFY = { domain: '', token: '', apiVersion: '2025-01' }; // e.g. domain:'your-store.myshopify.com'
async function loadShopifyProducts(){
  if(!SHOPIFY.domain || !SHOPIFY.token) return false;
  const q = '{products(first:50){edges{node{handle title description productType tags availableForSale featuredImage{url} priceRange{minVariantPrice{amount}} compareAtPriceRange{minVariantPrice{amount}}}}}}';
  try {
    const r = await fetch('https://' + SHOPIFY.domain + '/api/' + SHOPIFY.apiVersion + '/graphql.json', {
      method:'POST', headers:{'Content-Type':'application/json','X-Shopify-Storefront-Access-Token':SHOPIFY.token}, body:JSON.stringify({query:q})});
    const j = await r.json();
    const edges = (j.data && j.data.products.edges) || [];
    if(!edges.length) return false;
    const live = edges.map(function(e){ const n=e.node, price=parseFloat(n.priceRange.minVariantPrice.amount), cmp=parseFloat(n.compareAtPriceRange.minVariantPrice.amount);
      return {id:n.handle,name:n.title,cat:n.productType||'General',icon:'headphones',image:n.featuredImage?n.featuredImage.url:'',price:price,compare:cmp>price?cmp:null,
        rating:4.5,reviews:0,stock:n.availableForSale?10:0,featured:false,tags:n.tags||[],short:(n.description||'').slice(0,120),features:[],overview:n.description||'',specs:{}}; });
    live[0].featured = true;
    const custom = PRODUCTS.filter(function(p){return p.custom;});
    PRODUCTS.length = 0; live.concat(custom).forEach(function(p){PRODUCTS.push(p);});
    live.forEach(function(p){ if(!CATEGORIES.some(function(c){return c[0]===p.cat;})) CATEGORIES.push([p.cat,'bag']); });
    return true;
  } catch(e){ console.warn('Shopify fetch failed, using demo catalog', e); return false; }
}
