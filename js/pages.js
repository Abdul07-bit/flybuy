/* pages.js — render functions for pages whose content depends on the product catalog
   (home, shop, product detail, tracking). Kept separate from app.js's routing stub. */

function categoryCard(name, ic) {
  const n = PRODUCTS.filter(function (p) { return p.cat === name; }).length;
  return '<a class="cat-card" href="shop.html?cat=' + encodeURIComponent(name) + '">'
    + '<div class="cat-art" data-par="0.06">' + icon(ic) + '</div>'
    + '<span class="cat-name">' + name + '</span><span class="cat-meta">' + (n ? n + (n > 1 ? ' products' : ' product') : 'Explore') + '</span></a>';
}

function heroStage() {
  const a = PRODUCTS[0], b = PRODUCTS[3] || PRODUCTS[1], c = PRODUCTS[1];
  const L = function (d, cls, inner) { return '<div class="hl ' + cls + '" style="--d:' + d + '"><div class="fl">' + inner + '</div></div>'; };
  document.getElementById('heroStage').innerHTML =
    L(-6, 'hl-num', '<span>01</span>')
    + L(14, 'hl-b', '<div class="obj">' + media(b) + '</div>')
    + L(30, 'hl-a', '<div class="obj">' + media(a) + '</div>')
    + L(44, 'hl-c', '<div class="obj">' + media(c) + '</div>')
    + L(52, 'hl-tag', '<span>' + a.name + '<b>' + fmtPrice(a.price) + '</b></span>')
    + L(22, 'hl-cat', '<span>' + a.cat + ' / FLYBUY</span>');
}

function renderHome() {
  const trending = PRODUCTS.filter(function (p) { return p.tags.includes('trending'); });
  const seen = {}, list = trending.concat(PRODUCTS).filter(function (p) { return seen[p.id] ? false : (seen[p.id] = 1); }).slice(0, 8);
  renderHScroll(list);
  document.getElementById('catGrid').innerHTML = CATEGORIES.slice(0, 6).map(function (c) { return categoryCard(c[0], c[1]); }).join('');
  heroStage();

  const f = PRODUCTS.find(function (p) { return p.featured; }) || PRODUCTS[0];
  document.getElementById('featuredSection').innerHTML =
    '<div class="feat-grid"><a class="feat-media reveal-mask" href="product.html?id=' + f.id + '" data-cursor="VIEW"><div data-par="0.05">' + media(f) + '</div></a>'
    + '<div class="feat-copy"><p class="eyebrow reveal">Featured</p>'
    + '<h2 class="display reveal" style="--d:.1s">' + f.name + '</h2>'
    + '<p class="feat-desc reveal" style="--d:.2s">' + f.overview + '</p>'
    + '<div class="feat-price reveal" style="--d:.3s"><span>' + fmtPrice(f.price) + '</span>' + (f.compare ? '<s>' + fmtPrice(f.compare) + '</s>' : '') + '</div>'
    + '<div class="cta-row reveal" style="--d:.4s"><button class="btn btn-primary magnetic" onclick="addToCart(\'' + f.id + '\',1)">Add to cart</button>'
    + '<a class="link-quiet" href="product.html?id=' + f.id + '">View details</a></div></div></div>';
  if (typeof initMotion === 'function') initMotion();
}

function renderShop() {
  const cat = qs('cat', 'All');
  const q = (qs('q', '') || '').toLowerCase();
  const sort = qs('sort', '');
  const discountOnly = qs('discount', '') === '1';
  let list = PRODUCTS.filter(function (p) {
    if (cat !== 'All' && p.cat !== cat) return false;
    if (q && !(p.name.toLowerCase().includes(q) || p.cat.toLowerCase().includes(q))) return false;
    if (discountOnly && !p.compare) return false;
    return true;
  });
  if (sort === 'new') list = list.filter(function (p) { return p.tags.includes('new'); }).concat(list);
  if (sort === 'trending' || sort === 'best-selling') list = list.filter(function (p) { return p.tags.includes('trending'); }).concat(list);
  if (sort === 'price-asc') list = list.slice().sort(function (a, b) { return a.price - b.price; });
  if (sort === 'price-desc') list = list.slice().sort(function (a, b) { return b.price - a.price; });
  list = Array.from(new Map(list.map(function (p) { return [p.id, p]; })).values());

  const cats = ['All'].concat(categoryNames());
  document.getElementById('shopTabs').innerHTML = cats.map(function (c) {
    return '<button class="tab ' + (c === cat ? 'active' : '') + '" onclick="location.href=\'shop.html?cat=' + encodeURIComponent(c) + (sort ? '&sort=' + sort : '') + '\'">' + c + '</button>';
  }).join('');
  document.getElementById('shopSearch').value = qs('q', '') || '';
  document.getElementById('shopSort').value = sort;
  document.getElementById('resultCount').textContent = list.length + ' products';
  document.getElementById('shopGrid').innerHTML = list.length
    ? list.map(productCard).join('')
    : '<div class="empty-state"><div class="display">Nothing matched that search.</div><a class="btn btn-outline" style="width:auto;margin-top:14px" href="shop.html">CLEAR FILTERS</a></div>';
}
function shopSearchInput(v) {
  const p = new URLSearchParams(location.search);
  if (v) p.set('q', v); else p.delete('q');
  history.replaceState(null, '', 'shop.html?' + p.toString());
  renderShop();
}
function shopSortChange(v) {
  const p = new URLSearchParams(location.search);
  if (v) p.set('sort', v); else p.delete('sort');
  location.href = 'shop.html?' + p.toString();
}

function accordionSection(p) {
  const rows = [
    ['Overview', p.overview],
    ['Specifications', Object.entries(p.specs).map(function (kv) { return '<div style="display:flex;justify-content:space-between;padding:4px 0"><span>' + kv[0] + '</span><span>' + kv[1] + '</span></div>'; }).join('')],
    ["What's included", p.name + ', quick-start guide, USB-C cable, 1-year warranty card'],
    ['Shipping & returns', 'Ships in 1-2 business days to the US and UK. Free shipping over ' + fmtPrice(FREE_SHIP_AT) + '. 30-day returns on unused items.'],
    ['FAQ', 'Q: Does it come with a warranty? A: Yes, 1 year from purchase. Q: Can I return it? A: Yes, within 30 days unused.'],
  ];
  return rows.map(function (r) {
    return '<div class="accordion-item"><button class="accordion-head" onclick="this.parentElement.classList.toggle(\'open\')">' + r[0]
      + '<svg class="chev" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="m6 9 6 6 6-6"/></svg></button>'
      + '<div class="accordion-body">' + r[1] + '</div></div>';
  }).join('');
}
function reviewSummary(p, reviews) {
  return '<div class="review-summary"><div class="review-score">' + p.rating + '</div>'
    + '<div><div class="rating" style="font-size:16px">' + stars(p.rating) + '</div><div class="muted" style="font-size:13px">Based on ' + p.reviews + ' ratings</div></div></div>'
    + (reviews.length ? reviews.map(function (r) {
      return '<div class="review-card"><span class="rname">' + r.name + '</span><span class="rdate">' + r.date + '</span>'
        + (r.verified ? '<span class="verified">✓ Verified purchase</span>' : '') + (r.demo ? '<span class="demo-tag"> · demo data</span>' : '')
        + '<div class="rating">' + stars(r.rating) + '</div><p class="muted" style="font-size:14px">' + r.body + '</p></div>';
    }).join('') : '<p class="muted">No reviews yet for this product.</p>');
}
function pdpQty(d) {
  window.__pdpQty = Math.max(1, (window.__pdpQty || 1) + d);
  document.getElementById('pdpQtyVal').textContent = window.__pdpQty;
}
function renderProduct() {
  const id = qs('id');
  const p = findProduct(id);
  const root = document.getElementById('pdpRoot');
  if (!p) { root.innerHTML = '<h1 class="display">Product not found.</h1><a class="btn btn-primary" style="width:auto" href="shop.html">Back to shop</a>'; return; }
  document.title = p.name + ' | FLYBUY';
  const related = PRODUCTS.filter(function (x) { return x.cat === p.cat && x.id !== p.id; }).slice(0, 4);
  const reviews = DEMO_REVIEWS[p.id] || [];
  const discount = p.compare ? Math.round((1 - p.price / p.compare) * 100) : 0;
  const wished = STATE.wishlist.includes(p.id);
  root.innerHTML =
    '<div class="muted" style="font-size:12px;margin-bottom:26px"><a href="index.html">Home</a> / <a href="shop.html">Shop</a> / <a href="shop.html?cat=' + encodeURIComponent(p.cat) + '">' + p.cat + '</a> / ' + p.name + '</div>'
    + '<div class="pdp-grid"><div><div class="pdp-media">' + media(p) + '</div>'
      + '<div class="pdp-thumbs"><div>' + media(p) + '</div><div>' + media(p) + '</div><div>' + media(p) + '</div></div></div>'
    + '<div class="pdp-info"><p class="pdp-brand">FLYBUY · ' + p.cat + '</p><h1>' + p.name + '</h1>'
      + '<div class="rating">' + stars(p.rating) + ' ' + p.rating + ' · ' + p.reviews + ' reviews</div>'
      + '<div class="pdp-price-row"><span class="pdp-price">' + fmtPrice(p.price) + '</span>'
        + (p.compare ? '<span class="compare">' + fmtPrice(p.compare) + '</span><span class="discount-tag">-' + discount + '%</span>' : '') + '</div>'
      + (p.stock > 0 ? '<div class="avail ' + (p.stock <= 5 ? 'low' : 'in') + '">● ' + (p.stock <= 5 ? 'Low stock — ' + p.stock + ' left' : 'In stock') + '</div>' : '<div class="avail out">● Currently unavailable</div>')
      + '<p class="muted">' + p.short + '</p>'
      + '<div class="feature-pills">' + p.features.map(function (x) { return '<span class="pill">' + x + '</span>'; }).join('') + '</div>'
      + '<div class="qty-select"><span class="muted" style="font-size:13px">Qty</span><button class="qty-btn" onclick="pdpQty(-1)">−</button><span id="pdpQtyVal">1</span><button class="qty-btn" onclick="pdpQty(1)">+</button></div>'
      + '<div class="pdp-actions"><button class="btn btn-primary magnetic" ' + (p.stock === 0 ? 'disabled' : '') + ' onclick="addToCart(\'' + p.id + '\', window.__pdpQty||1)">ADD TO CART</button>'
      + '<a class="btn btn-outline magnetic" ' + (p.stock === 0 ? 'style="pointer-events:none;opacity:.4"' : '') + ' href="checkout.html" onclick="addToCart(\'' + p.id + '\', window.__pdpQty||1)">BUY NOW</a></div>'
      + '<button class="btn btn-outline btn-block" style="margin-bottom:10px" onclick="toggleWishlist(\'' + p.id + '\')">' + (wished ? '♥ SAVED TO WISHLIST' : '♡ ADD TO WISHLIST') + '</button>'
      + '<div class="trust-mini"><span>Free shipping over ' + fmtPrice(FREE_SHIP_AT) + '</span><span>30-day returns</span><span>Secure checkout</span></div>'
      + accordionSection(p)
    + '</div></div>'
    + '<div style="margin-top:70px"><h2 class="display" style="font-size:1.7rem;margin-bottom:24px">Customer reviews</h2>' + reviewSummary(p, reviews) + '</div>'
    + (related.length ? '<div style="margin-top:70px"><h2 class="display" style="font-size:1.7rem;margin-bottom:24px">You may also like</h2><div class="prod-grid">' + related.map(productCard).join('') + '</div></div>' : '');
}

function renderTracking() {
  const id = qs('order');
  const result = document.getElementById('trackResult');
  if (!id) return;
  document.getElementById('trackId').value = id;
  const o = STATE.orders.find(function (x) { return x.id === id; });
  if (!o) { result.innerHTML = '<p class="muted">No order found with that number in this browser\'s demo history.</p>'; return; }
  const stageIdx = ORDER_STAGES.indexOf(o.status);
  result.innerHTML = '<div class="timeline">' + ORDER_STAGES.map(function (s, i) {
    return '<div class="tl-step ' + (i < stageIdx ? 'done' : i === stageIdx ? 'active' : '') + '"><div class="tl-dot"></div><span>' + s + '</span></div>';
  }).join('') + '</div>'
  + '<div class="order-box">' + o.items.map(function (i) { return '<div class="co-line"><span>' + i.name + ' × ' + i.qty + '</span><span>' + fmtPrice(i.price * i.qty) + '</span></div>'; }).join('')
  + '<div class="co-line total"><span>Total</span><span>' + fmtPrice(o.totals.total) + '</span></div></div>'
  + '<p class="muted" style="font-size:13px">Shipping to: ' + o.address + '</p>';
}
function doTrack(e) { e.preventDefault(); location.href = 'order-tracking.html?order=' + document.getElementById('trackId').value.trim(); return false; }
function onRegionChange() {
  if (window.PAGE === 'home') renderHome();
  if (window.PAGE === 'shop') renderShop();
  if (window.PAGE === 'product') renderProduct();
  if (window.PAGE === 'checkout') renderCheckoutSummary();
}
