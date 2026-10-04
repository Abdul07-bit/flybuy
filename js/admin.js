/* admin.js — demo-only admin dashboard. Client-side password gate for preview purposes
   ONLY: this is not real security. A production build must authenticate server-side
   against a real session, never trust a password typed into the browser. */
const ADMIN_LS_KEY = 'flybuy_admin_demo_session';
const DEMO_ADMIN_EMAIL = 'admin@flybuy.demo';   // demo-only placeholder: change to your credentials
const DEMO_ADMIN_PASSWORD = 'flybuy-demo';      // demo-only, never do this in production

function isAdminSignedIn() { try { return sessionStorage.getItem(ADMIN_LS_KEY) === '1'; } catch (e) { return false; } }
function adminLogin(e) {
  e.preventDefault();
  const email = document.getElementById('adminEmail').value.trim().toLowerCase();
  const pass = document.getElementById('adminPass').value;
  if (email === DEMO_ADMIN_EMAIL.toLowerCase() && pass === DEMO_ADMIN_PASSWORD) {
    try { sessionStorage.setItem(ADMIN_LS_KEY, '1'); } catch (err) {}
    renderAdmin();
  } else {
    document.getElementById('adminErr').textContent = 'Incorrect email or password.';
  }
  return false;
}
function adminLogout() { try { sessionStorage.removeItem(ADMIN_LS_KEY); } catch (e) {} renderAdmin(); }

function adminStats() {
  const orders = STATE.orders;
  const revenue = orders.reduce(function (s, o) { return s + o.totals.total; }, 0);
  const lowStock = PRODUCTS.filter(function (p) { return p.stock > 0 && p.stock <= 5; }).length;
  const pending = orders.filter(function (o) { return o.status !== 'Delivered'; }).length;
  return { revenue: revenue, orders: orders.length, products: PRODUCTS.length, lowStock: lowStock, pending: pending };
}
function renderAdminTab(tab) {
  const main = document.getElementById('adminMain');
  document.querySelectorAll('.admin-side button[data-tab]').forEach(function (b) { b.classList.toggle('active', b.dataset.tab === tab); });
  if (tab === 'dashboard') {
    const s = adminStats();
    main.innerHTML = '<h1 class="display" style="font-size:1.8rem;margin-bottom:26px">Dashboard</h1>'
      + '<div class="stat-cards">'
      + '<div class="stat-card"><div class="num">' + fmtPrice(s.revenue) + '</div><div class="lbl">Revenue (demo)</div></div>'
      + '<div class="stat-card"><div class="num">' + s.orders + '</div><div class="lbl">Orders</div></div>'
      + '<div class="stat-card"><div class="num">' + s.products + '</div><div class="lbl">Products</div></div>'
      + '<div class="stat-card"><div class="num">' + s.lowStock + '</div><div class="lbl">Low stock</div></div>'
      + '</div>'
      + '<h3 style="margin-bottom:12px">Recent orders</h3>' + ordersTable(STATE.orders.slice(0, 5));
  } else if (tab === 'products') {
    main.innerHTML = '<h1 class="display" style="font-size:1.8rem;margin-bottom:26px">Products</h1>' + productsTable();
  } else if (tab === 'add-product') {
    main.innerHTML = addProductForm();
  } else if (tab === 'add-category') {
    main.innerHTML = addCategoryForm();
  } else if (tab === 'orders') {
    main.innerHTML = '<h1 class="display" style="font-size:1.8rem;margin-bottom:26px">Orders</h1>'
      + (STATE.orders.length ? ordersTable(STATE.orders) : '<p class="muted">No orders placed yet in this browser\'s demo session.</p>');
  } else if (tab === 'customers') {
    main.innerHTML = '<h1 class="display" style="font-size:1.8rem;margin-bottom:26px">Customers</h1><p class="muted">Customer data is sourced from Shopify in production. This demo has no mock customer list.</p>';
  }
}
function productsTable() {
  return '<table class="admin-table"><thead><tr><th>Product</th><th>Category</th><th>Price</th><th>Stock</th><th>Status</th></tr></thead><tbody>'
    + PRODUCTS.map(function (p) {
      return '<tr><td style="display:flex;align-items:center;gap:10px"><span class="admin-thumb">' + media(p) + '</span>' + p.name + (p.custom ? ' <span class="muted" style="font-size:11px">(local demo)</span>' : '') + '</td><td>' + p.cat + '</td><td>' + fmtPrice(p.price) + '</td><td>' + p.stock + '</td>'
        + '<td><span class="status-chip ' + (p.stock === 0 ? 'pending' : 'paid') + '">' + (p.stock === 0 ? 'Out of stock' : 'Active') + '</span></td></tr>';
    }).join('') + '</tbody></table>';
}
function ordersTable(orders) {
  if (!orders.length) return '<p class="muted">No orders yet.</p>';
  return '<table class="admin-table"><thead><tr><th>Order</th><th>Customer</th><th>Items</th><th>Total</th><th>Status</th></tr></thead><tbody>'
    + orders.map(function (o) {
      return '<tr><td>' + o.id + '</td><td>' + o.customer + '</td><td>' + o.items.length + '</td><td>' + fmtPrice(o.totals.total) + '</td>'
        + '<td><span class="status-chip ' + (o.status === 'Delivered' ? 'paid' : 'pending') + '">' + o.status + '</span></td></tr>';
    }).join('') + '</tbody></table>';
}
function renderAdmin() {
  const gate = document.getElementById('adminGate'), shell = document.getElementById('adminShell');
  if (!isAdminSignedIn()) { gate.classList.remove('hide'); shell.classList.add('hide'); return; }
  gate.classList.add('hide'); shell.classList.remove('hide');
  renderAdminTab(qs('tab', 'dashboard'));
}

const LOCAL_NOTE = '<p class="demo-note">Saved to this browser only (local demo storage). Syncing to Shopify requires a server-side Admin API call.</p>';
function addProductForm() {
  const cats = categoryNames().map(function (c) { return '<option>' + c + '</option>'; }).join('');
  return '<h1 class="display" style="font-size:1.8rem;margin-bottom:26px">Add Product</h1>' + LOCAL_NOTE
    + '<form class="admin-form" onsubmit="return submitProduct(event)">'
    + '<div class="field"><label>Name</label><input required id="npName"></div>'
    + '<div class="field-row"><div class="field"><label>Category</label><select id="npCat">' + cats + '</select></div>'
    + '<div class="field"><label>Stock</label><input required id="npStock" type="number" min="0" value="10"></div></div>'
    + '<div class="field-row"><div class="field"><label>Price (USD)</label><input required id="npPrice" type="number" min="0" step="0.01"></div>'
    + '<div class="field"><label>Compare-at price (optional)</label><input id="npCompare" type="number" min="0" step="0.01"></div></div>'
    + '<div class="field"><label>Short description</label><input required id="npShort"></div>'
    + '<div class="field"><label>Overview</label><textarea id="npOverview" rows="3"></textarea></div>'
    + '<div class="field"><label>Image</label><input id="npImage" type="file" accept="image/*" onchange="previewImage(this)"><img class="preview" id="npPreview" alt="Preview"></div>'
    + '<button class="btn btn-primary" type="submit">ADD PRODUCT</button></form>';
}
function addCategoryForm() {
  return '<h1 class="display" style="font-size:1.8rem;margin-bottom:26px">Add Category</h1>' + LOCAL_NOTE
    + '<form class="admin-form" onsubmit="return submitCategory(event)">'
    + '<div class="field"><label>Category name</label><input required id="ncName" maxlength="40"></div>'
    + '<button class="btn btn-primary" type="submit">ADD CATEGORY</button></form>'
    + '<h3 style="margin:30px 0 10px">Existing categories</h3><p class="muted">' + categoryNames().join(' · ') + '</p>';
}
/* downscale to <=700px JPEG so it fits localStorage */
function readImage(file) {
  return new Promise(function (resolve, reject) {
    const fr = new FileReader();
    fr.onerror = reject;
    fr.onload = function () {
      const img = new Image();
      img.onerror = reject;
      img.onload = function () {
        const k = Math.min(1, 700 / Math.max(img.width, img.height)), c = document.createElement('canvas');
        c.width = Math.round(img.width * k); c.height = Math.round(img.height * k);
        c.getContext('2d').drawImage(img, 0, 0, c.width, c.height);
        resolve(c.toDataURL('image/jpeg', 0.82));
      };
      img.src = fr.result;
    };
    fr.readAsDataURL(file);
  });
}
function previewImage(input) {
  const f = input.files[0], el = document.getElementById('npPreview');
  if (!f) { el.style.display = 'none'; return; }
  readImage(f).then(function (d) { el.src = d; el.style.display = 'block'; }).catch(function () { toast('Could not read that image.'); });
}
async function submitProduct(e) {
  e.preventDefault();
  const v = function (id) { return document.getElementById(id).value.trim(); };
  const f = document.getElementById('npImage').files[0];
  let image = '';
  if (f) { try { image = await readImage(f); } catch (err) { toast('Could not read that image.'); return false; } }
  const price = parseFloat(v('npPrice')), cmp = parseFloat(v('npCompare'));
  const id = 'custom-' + v('npName').toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '') + '-' + Date.now().toString(36);
  const p = { id: id, custom: true, name: v('npName'), cat: v('npCat'), icon: 'headphones', image: image, price: price, compare: cmp > price ? cmp : null,
    rating: 0, reviews: 0, stock: parseInt(v('npStock'), 10) || 0, featured: false, tags: ['new'], short: v('npShort'), features: [], overview: v('npOverview') || v('npShort'), specs: {} };
  const c = loadCustom(); c.products.unshift(p);
  if (!saveCustom(c)) { toast('Storage full — try a smaller image.'); return false; }
  PRODUCTS.unshift(p);
  toast('Product added (local demo).');
  location.href = 'admin.html?tab=products';
  return false;
}
function submitCategory(e) {
  e.preventDefault();
  const name = document.getElementById('ncName').value.trim();
  if (categoryNames().some(function (n) { return n.toLowerCase() === name.toLowerCase(); })) { toast('That category already exists.'); return false; }
  const c = loadCustom(); c.categories.push(name); saveCustom(c);
  CATEGORIES.push([name, 'bag']);
  toast('Category added (local demo).');
  renderAdminTab('add-category');
  return false;
}
