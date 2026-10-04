/* utils.js — shared helpers used across every page */
const LS_KEY = 'flybuy_state_v2';

function loadState(){
  try { return JSON.parse(localStorage.getItem(LS_KEY)) || { cart: [], wishlist: [], orders: [], region: 'US' }; }
  catch (e) { return { cart: [], wishlist: [], orders: [], region: 'US' }; }
}
let STATE = loadState();
function saveState(){ try { localStorage.setItem(LS_KEY, JSON.stringify(STATE)); } catch (e) {} }

/* US/UK only, per brief — currency comes from the selected market, never a fabricated FX feed in production */
const FX = { US: { symbol: '$', rate: 1 }, UK: { symbol: '£', rate: 0.79 } };
function fmtPrice(usd) {
  const m = FX[STATE.region] || FX.US;
  return m.symbol + (usd * m.rate).toFixed(2);
}

function toast(msg) {
  const host = document.getElementById('toastHost');
  if (!host) return;
  const el = document.createElement('div');
  el.className = 'toast';
  el.textContent = msg;
  host.appendChild(el);
  setTimeout(() => el.remove(), 3200);
}

function qs(name, fallback) {
  const p = new URLSearchParams(location.search);
  return p.has(name) ? p.get(name) : fallback;
}

function stars(r) { const full = Math.round(r); return '★'.repeat(full) + '☆'.repeat(5 - full); }

function setActiveNav() {
  const file = location.pathname.split('/').pop() || 'index.html';
  document.querySelectorAll('nav.mainnav a').forEach(a => {
    a.classList.toggle('active', a.getAttribute('href') === file);
  });
}
