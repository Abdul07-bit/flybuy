/* app.js — thin per-page bootstrapper. Each HTML page sets window.PAGE before loading
   this script; this file calls the matching render function once the shell has mounted. */
document.addEventListener('DOMContentLoaded', async function () {
  await loadShopifyProducts();
  // runs after components.js's own DOMContentLoaded only if listed later in body — see each page's script order.
  setTimeout(function () {
    if (window.PAGE === 'home') renderHome();
    if (window.PAGE === 'shop') renderShop();
    if (window.PAGE === 'product') renderProduct();
    if (window.PAGE === 'checkout') renderCheckoutSummary();
    if (window.PAGE === 'account') renderAccountPage();
    if (window.PAGE === 'tracking') renderTracking();
    if (window.PAGE === 'search') renderSearchPage();
    initReveal();
  }, 0);
});
