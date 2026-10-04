/* checkout.js — collects shipping/contact info, then creates a local order record.
   In production this calls cartCreate/cartLinesAdd against the Storefront API and
   redirects to the returned Shopify checkoutUrl instead of simulating an order here. */
function renderCheckoutSummary() {
  const t = cartTotals();
  const summary = document.getElementById('coSummary');
  summary.innerHTML = STATE.cart.map(function (l) {
    const p = findProduct(l.id);
    return '<div class="co-line"><span>' + p.name + ' × ' + l.qty + '</span><span>' + fmtPrice(p.price * l.qty) + '</span></div>';
  }).join('')
    + '<div class="co-line"><span>Subtotal</span><span>' + fmtPrice(t.subtotal) + '</span></div>'
    + '<div class="co-line"><span>Shipping</span><span>' + (t.shipping === 0 ? 'Free' : fmtPrice(t.shipping)) + '</span></div>'
    + '<div class="co-line total"><span>Total</span><span>' + fmtPrice(t.total) + '</span></div>';
  document.getElementById('coTotalBtn').textContent = 'PLACE ORDER · ' + fmtPrice(t.total);
}
function submitOrder(e) {
  e.preventDefault();
  const fd = new FormData(e.target);
  const t = cartTotals();
  const order = {
    id: 'FLY-' + Date.now().toString().slice(-7),
    date: new Date().toISOString(),
    items: STATE.cart.map(function (l) { const p = findProduct(l.id); return { id: l.id, name: p.name, qty: l.qty, price: p.price }; }),
    customer: fd.get('first') + ' ' + fd.get('last'), email: fd.get('email'),
    address: fd.get('addr') + ', ' + fd.get('city') + ' ' + fd.get('zip'),
    totals: t, status: 'Order placed', paymentStatus: 'Pending',
  };
  STATE.orders.unshift(order); STATE.cart = []; saveState();
  location.href = 'order-confirmation.html?order=' + order.id;
  return false;
}
