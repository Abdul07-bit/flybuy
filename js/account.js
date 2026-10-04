/* account.js — account dashboard tabs (profile/orders/addresses/settings), demo-session only. */
const ORDER_STAGES = ['Order placed', 'Processing', 'Shipped', 'Out for delivery', 'Delivered'];

function renderAccountPage() {
  const tab = qs('tab', 'orders');
  document.querySelectorAll('.acct-nav button').forEach(function (b) { b.classList.toggle('active', b.dataset.tab === tab); });
  const panel = document.getElementById('acctPanel');
  document.getElementById('acctTitle').textContent = tab.charAt(0).toUpperCase() + tab.slice(1);

  if (tab === 'orders') {
    panel.innerHTML = STATE.orders.length ? STATE.orders.map(function (o) {
      return '<div class="order-row"><div><b>' + o.id + '</b><div class="muted" style="font-size:12px">' + new Date(o.date).toLocaleDateString() + ' · ' + o.items.length + ' item(s)</div></div>'
        + '<span class="status-chip ' + (o.status === 'Delivered' ? 'paid' : 'pending') + '">' + o.status + '</span>'
        + '<div><b>' + fmtPrice(o.totals.total) + '</b></div>'
        + '<a class="btn btn-outline btn-sm" href="order-tracking.html?order=' + o.id + '">Track order</a></div>';
    }).join('') : '<div class="empty-state"><div class="display">Your journey starts here.</div><a class="btn btn-primary" style="width:auto;margin-top:14px" href="shop.html">Start shopping</a></div>';
  } else if (tab === 'wishlist') {
    const items = PRODUCTS.filter(function (p) { return STATE.wishlist.includes(p.id); });
    panel.innerHTML = items.length ? '<div class="prod-grid cols3">' + items.map(productCard).join('') + '</div>' : '<p class="muted">No saved items yet.</p>';
  } else if (tab === 'addresses') {
    panel.innerHTML = '<p class="muted" style="margin-bottom:16px">Addresses you use at checkout will appear here.</p>'
      + '<button class="btn btn-outline" style="width:auto" onclick="toast(\'Add-address form would open here\')">+ Add new address</button>';
  } else if (tab === 'profile' || tab === 'settings') {
    panel.innerHTML = '<div class="field"><label>Name</label><input placeholder="Your name"></div>'
      + '<div class="field"><label>Email</label><input placeholder="you@email.com"></div>'
      + '<div class="field"><label>Phone</label><input placeholder="+1"></div>'
      + '<button class="btn btn-primary" style="width:auto" onclick="toast(\'Saved (demo)\')">SAVE CHANGES</button>';
  }
}
function logout() { toast('Signed out (demo)'); location.href = 'index.html'; }
