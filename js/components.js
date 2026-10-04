/* components.js — injects the shared header, mobile nav, cart drawer and footer into every
   page from one place so they never drift out of sync between the 10 HTML files. */

function headerHTML() {
  return '<div class="header-wrap">'
    + '<a href="index.html" class="logo-mark nav-in">'
      + '<img src="assets/logo.png" alt="FLYBUY" class="logo-img" onerror="this.style.display=\'none\';this.nextElementSibling.style.display=\'flex\'">'
      + '<span class="logo-fallback"><span>FLYBUY</span><span class="dot"></span></span>'
    + '</a>'
    + '<nav class="mainnav nav-in">'
      + '<a href="shop.html">Shop</a><a href="collections.html">Collections</a><a href="about.html">About</a>'
    + '</nav>'
    + '<div class="header-icons nav-in">'
      + '<button class="region-pill" id="regionBtn">' + (STATE.region === 'US' ? '🇺🇸 US · USD' : '🇬🇧 UK · GBP') + '</button>'
      + '<button class="icon-btn" id="searchBtn" aria-label="Search"><svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="11" cy="11" r="7"/><path d="m21 21-4.3-4.3"/></svg></button>'
      + '<a class="icon-btn" href="account.html" aria-label="Account"><svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="8" r="4"/><path d="M4 21c0-4 4-6 8-6s8 2 8 6"/></svg></a>'
      + '<a class="icon-btn" href="account.html?tab=wishlist" aria-label="Wishlist"><svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M20.8 4.6a5.5 5.5 0 0 0-7.8 0L12 5.6l-1-1a5.5 5.5 0 0 0-7.8 7.8l1 1L12 21l7.8-7.6 1-1a5.5 5.5 0 0 0 0-7.8Z"/></svg><span class="icon-badge hide" id="wishBadge">0</span></a>'
      + '<button class="icon-btn" id="cartBtn" aria-label="Open cart"><svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M6 6h15l-1.5 9h-12z"/><path d="M6 6 5 2H2"/><circle cx="9" cy="20" r="1"/><circle cx="18" cy="20" r="1"/></svg><span class="icon-badge hide" id="cartBadge">0</span></button>'
      + '<button class="icon-btn menu-btn" id="menuBtn" aria-label="Open menu"><svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M4 7h16M4 12h16M4 17h16"/></svg></button>'
    + '</div></div>';
}
function mobileNavHTML() {
  return '<a href="shop.html">Shop</a><a href="shop.html?sort=new">New</a><a href="collections.html">Collections</a><a href="about.html">About</a>'
    + '<a href="account.html">Account</a><a href="contact.html">Contact</a><a href="faq.html">FAQ</a>';
}
function footerHTML() {
  return '<div class="container"><div class="foot-grid">'
    + '<div class="foot-col"><a href="index.html" class="logo-mark">'
      + '<img src="assets/logo.png" alt="FLYBUY" class="logo-img" onerror="this.style.display=\'none\';this.nextElementSibling.style.display=\'flex\'">'
      + '<span class="logo-fallback"><span>FLYBUY</span><span class="dot"></span></span>'
    + '</a>'
      + '<p class="foot-lead">Smart products, made to move with you.</p></div>'
    + '<div class="foot-col"><h4>Shop</h4><a href="products.html">All products</a><a href="collections.html">Collections</a><a href="shop.html?discount=1">Deals</a></div>'
    + '<div class="foot-col"><h4>Customer care</h4><a href="faq.html">FAQ</a><a href="faq.html">Shipping</a><a href="faq.html">Returns</a><a href="order-tracking.html">Track order</a></div>'
    + '<div class="foot-col"><h4>Account</h4><a href="account.html?tab=profile">Profile</a><a href="account.html?tab=orders">Orders</a><a href="account.html?tab=wishlist">Wishlist</a></div>'
    + '<div class="foot-col"><h4>Company</h4><a href="about.html">About</a><a href="contact.html">Contact</a><a href="admin.html">Admin</a><a href="faq.html">Privacy</a></div>'
  + '</div><div class="foot-bottom"><span>© 2026 FLYBUY. Demo storefront — DEMO_MODE, no real payments are processed.</span><span id="footRegion">' + (STATE.region === 'US' ? '🇺🇸 United States · USD' : '🇬🇧 United Kingdom · GBP') + '</span></div></div>';
}
function cartDrawerHTML() {
  return '<div class="drawer-head"><h3>Your cart</h3><button class="icon-btn" id="closeCart" aria-label="Close cart">✕</button></div>'
    + '<div class="drawer-body" id="cartBody"></div><div class="drawer-foot" id="cartFoot"></div>';
}
function chatHTML() {
  return '<div class="chat-head"><b>FLYBUY Assist</b><span>How can we help?</span></div>'
    + '<div class="chat-body" id="chatBody"></div><div class="chat-options" id="chatOptions"></div>';
}

const CHAT_INTENTS = {
  'Track my order': 'Use the Track Order page in the footer with your order number.',
  'Product help': 'Tell me a product name or category, or browse Shop for the full range.',
  'Shipping': 'Standard delivery is 4–7 business days in the US and UK; express options show at checkout.',
  'Returns': 'Unused items in original packaging can be returned within 30 days of delivery.',
  'Payment': 'Payment is processed securely at checkout — FLYBUY never stores your card details.',
  'Account': 'Manage orders, addresses and your profile from the Account page.',
};
function initChat() {
  const body = document.getElementById('chatBody'), opts = document.getElementById('chatOptions');
  if (!body) return;
  body.innerHTML = '<div class="chat-msg bot">Hi — I\'m FLYBUY Assist. Pick a topic or ask a question.</div>';
  opts.innerHTML = Object.keys(CHAT_INTENTS).map(function (k) {
    return '<button onclick="chatSelect(\'' + k.replace(/'/g, "\\'") + '\')">' + k + '</button>';
  }).join('');
}
function chatSelect(key) {
  const body = document.getElementById('chatBody');
  body.insertAdjacentHTML('beforeend', '<div class="chat-msg user">' + key + '</div><div class="chat-msg bot">' + CHAT_INTENTS[key] + '</div>');
  body.scrollTop = body.scrollHeight;
}

function mountShell() {
  if (!document.getElementById('siteHeader')) return; // pages like admin.html don't use the storefront shell
  document.getElementById('siteHeader').innerHTML = headerHTML();
  document.getElementById('mobileNav').innerHTML = mobileNavHTML();
  document.getElementById('siteFooter').innerHTML = footerHTML();
  document.getElementById('cartDrawer').innerHTML = cartDrawerHTML();
  document.getElementById('chatPanel').innerHTML = chatHTML();

  setActiveNav();
  updateBadges();
  renderCartDrawer();
  initChat();

  const header = document.getElementById('siteHeader');
  addEventListener('scroll', function () { header.classList.toggle('scrolled', scrollY > 24); }, { passive: true });

  document.getElementById('cartBtn').onclick = openCart;
  document.getElementById('closeCart').onclick = closeCartDrawer;
  document.getElementById('overlay').onclick = function () { closeCartDrawer(); document.getElementById('mobileNav').classList.remove('open'); };
  document.getElementById('menuBtn').onclick = function () { document.getElementById('mobileNav').classList.toggle('open'); };
  document.getElementById('chatFab').onclick = function () { document.getElementById('chatPanel').classList.toggle('open'); };
  document.getElementById('searchBtn').onclick = function () { location.href = 'search.html'; };
  document.getElementById('regionBtn').onclick = function () {
    STATE.region = STATE.region === 'US' ? 'UK' : 'US'; saveState();
    document.getElementById('regionBtn').textContent = STATE.region === 'US' ? '🇺🇸 US · USD' : '🇬🇧 UK · GBP';
    document.getElementById('footRegion').textContent = STATE.region === 'US' ? '🇺🇸 United States · USD' : '🇬🇧 United Kingdom · GBP';
    toast('Region set to ' + (STATE.region === 'US' ? 'United States (USD)' : 'United Kingdom (GBP)'));
    renderCartDrawer();
    if (typeof onRegionChange === 'function') onRegionChange();
  };
  document.querySelectorAll('#mobileNav a').forEach(function (a) { a.onclick = function () { document.getElementById('mobileNav').classList.remove('open'); }; });
}
document.addEventListener('DOMContentLoaded', mountShell);
