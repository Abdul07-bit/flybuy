/* cart.js — cart + wishlist state, persisted locally (DEMO_MODE). In production this
   maps 1:1 onto Shopify's cart mutations (cartLinesAdd/Update/Remove, cartCreate). */

function addToCart(id, qty) {
  qty = qty || 1;
  const p = findProduct(id);
  if (!p || p.stock < 1) return;
  const line = STATE.cart.find(l => l.id === id);
  if (line) line.qty = Math.min(line.qty + qty, p.stock);
  else STATE.cart.push({ id: id, qty: Math.min(qty, p.stock) });
  saveState(); renderCartDrawer(); updateBadges();
  toast(p.name + ' added to cart');
}
function setQty(id, qty) {
  const p = findProduct(id), line = STATE.cart.find(l => l.id === id);
  if (!line) return;
  if (qty < 1) STATE.cart = STATE.cart.filter(l => l.id !== id);
  else line.qty = Math.min(qty, p.stock);
  saveState(); renderCartDrawer(); updateBadges();
}
function removeFromCart(id) {
  STATE.cart = STATE.cart.filter(l => l.id !== id);
  saveState(); renderCartDrawer(); updateBadges();
}
const FREE_SHIP_AT = 29.00;
function cartTotals() {
  const subtotal = STATE.cart.reduce((s, l) => { const p = findProduct(l.id); return s + (p ? p.price * l.qty : 0); }, 0);
  const shipping = subtotal === 0 || subtotal >= FREE_SHIP_AT ? 0 : 4.99;
  const tax = Math.round(subtotal * 0.0 * 100) / 100; // tax collected at checkout provider in production; shown as 0 placeholder here
  const total = subtotal + shipping + tax;
  return { subtotal: subtotal, shipping: shipping, tax: tax, total: total, remaining: Math.max(0, FREE_SHIP_AT - subtotal) };
}
function toggleWishlist(id) {
  const i = STATE.wishlist.indexOf(id);
  if (i > -1) STATE.wishlist.splice(i, 1); else STATE.wishlist.push(id);
  saveState(); updateBadges();
  document.querySelectorAll('.wish[data-id="' + id + '"]').forEach(b => b.classList.toggle('active', STATE.wishlist.includes(id)));
  toast(i > -1 ? 'Removed from wishlist' : 'Saved to wishlist');
}
function updateBadges() {
  const cn = STATE.cart.reduce((s, l) => s + l.qty, 0);
  const wb = document.getElementById('wishBadge'), cb = document.getElementById('cartBadge');
  if (wb) { wb.textContent = STATE.wishlist.length; wb.classList.toggle('hide', STATE.wishlist.length === 0); }
  if (cb) { cb.textContent = cn; cb.classList.toggle('hide', cn === 0); }
}
function renderCartDrawer() {
  const body = document.getElementById('cartBody'), foot = document.getElementById('cartFoot');
  if (!body) return;
  if (STATE.cart.length === 0) {
    body.innerHTML = '<div class="empty-state"><div class="display">Nothing here yet.</div><p class="muted">Looks like your cart is waiting for something useful.</p></div>';
    foot.innerHTML = '';
    return;
  }
  const t = cartTotals();
  body.innerHTML = (t.remaining > 0
    ? '<div class="freeship">' + fmtPrice(t.remaining) + ' away from <b>free shipping</b></div>'
    : '<div class="freeship"><b>You\'ve unlocked free shipping</b></div>'
  ) + STATE.cart.map(function (l) {
    const p = findProduct(l.id); if (!p) return '';
    return '<div class="cart-line">'
      + '<div class="cart-thumb">' + media(p) + '</div>'
      + '<div class="cart-info"><p class="name">' + p.name + '</p><div class="meta">' + p.cat + '</div>'
      + '<div class="qty-row">'
        + '<button class="qty-btn" onclick="setQty(\'' + l.id + '\',' + (l.qty - 1) + ')">−</button>'
        + '<span>' + l.qty + '</span>'
        + '<button class="qty-btn" onclick="setQty(\'' + l.id + '\',' + (l.qty + 1) + ')">+</button>'
        + '<button class="remove-btn" onclick="removeFromCart(\'' + l.id + '\')">Remove</button>'
      + '</div></div>'
      + '<div class="line-price">' + fmtPrice(p.price * l.qty) + '</div>'
    + '</div>';
  }).join('');
  foot.innerHTML = '<div class="sub-row"><span>Subtotal</span><span>' + fmtPrice(t.subtotal) + '</span></div>'
    + '<div class="sub-row"><span>Shipping</span><span>' + (t.shipping === 0 ? 'Free' : fmtPrice(t.shipping)) + '</span></div>'
    + '<div class="sub-row total"><span>Total</span><span>' + fmtPrice(t.total) + '</span></div>'
    + '<a class="btn btn-primary btn-block" style="margin-top:14px" href="checkout.html">CHECKOUT</a>';
}
function openCart() { document.getElementById('cartDrawer').classList.add('open'); document.getElementById('overlay').classList.add('open'); }
function closeCartDrawer() { document.getElementById('cartDrawer').classList.remove('open'); document.getElementById('overlay').classList.remove('open'); }

function stockBadge(p) {
  if (p.stock === 0) return '<span class="stock-badge">SOLD OUT</span>';
  if (p.stock <= 5) return '<span class="stock-badge low">LOW STOCK</span>';
  return '';
}
function productCard(p) {
  const wished = STATE.wishlist.includes(p.id);
  const discount = p.compare ? Math.round((1 - p.price / p.compare) * 100) : 0;
  return '<div class="prod-card">'
    + '<div class="prod-media">'
      + '<a href="product.html?id=' + p.id + '" aria-label="View ' + p.name + '">' + media(p) + '</a>' + stockBadge(p)
      + '<button class="wish ' + (wished ? 'active' : '') + '" data-id="' + p.id + '" onclick="toggleWishlist(\'' + p.id + '\')" aria-label="Toggle wishlist">'
        + '<svg width="16" height="16" viewBox="0 0 24 24" fill="' + (wished ? 'currentColor' : 'none') + '" stroke="currentColor" stroke-width="2"><path d="M20.8 4.6a5.5 5.5 0 0 0-7.8 0L12 5.6l-1-1a5.5 5.5 0 0 0-7.8 7.8l1 1L12 21l7.8-7.6 1-1a5.5 5.5 0 0 0 0-7.8Z"/></svg></button>'
    + '</div>'
    + '<div class="prod-cat">' + p.cat + '</div>'
    + '<a class="prod-name" href="product.html?id=' + p.id + '">' + p.name + '</a>'
    + '<div class="rating">' + stars(p.rating) + ' ' + p.rating + ' (' + p.reviews + ')</div>'
    + '<div class="price-row"><span class="price">' + fmtPrice(p.price) + '</span>'
      + (p.compare ? '<span class="compare">' + fmtPrice(p.compare) + '</span><span class="discount-tag">-' + discount + '%</span>' : '') + '</div>'
    + '<button class="btn btn-outline btn-sm add-btn" ' + (p.stock === 0 ? 'disabled' : '') + ' onclick="addToCart(\'' + p.id + '\',1)">'
      + (p.stock === 0 ? 'SOLD OUT' : 'ADD TO CART') + '</button>'
  + '</div>';
}
