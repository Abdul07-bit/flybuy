FLYBUY — static HTML/CSS/JS frontend (DEMO_MODE)

HOW TO RUN
Open frontend/index.html directly in a browser. No install, no server, no build step.
(A local server like `npx serve frontend` also works and is closer to production routing, but is not required.)

WHAT'S REAL
- 15 pages: home, shop, products (full catalog), collections, product detail, about,
  cart drawer, checkout, order confirmation, account (profile/orders/wishlist/
  addresses/settings), order tracking, search, contact, FAQ, 404, and admin.
- Cart, wishlist and orders persist in localStorage.
- Product grid supports search, category filter, sort.
- Custom cursor + magnetic buttons on desktop (auto-disabled on touch, respects
  prefers-reduced-motion).
- Horizontal hero product rail reacts to pointer + scroll.
- US/UK region toggle switches displayed currency (USD/GBP).
- Live animated background: your uploaded mesh SVG (assets/mesh.svg) sits behind every
  storefront page as a slow-rotating, breathing layer with a shifting gradient glow —
  loaded as an <img>, not inlined, so its thousands of line nodes never touch the page's
  own DOM or slow anything down. Admin stays mesh-free by design (dense, not cinematic).
- 3D tilt on product/category cards and the hero rail, driven by real pointer position
  (desktop only — skipped on touch, and respects prefers-reduced-motion).
- Tactile touch/click ripple on every button.

ADMIN DEMO ACCESS
admin.html has a password gate — this is a CLIENT-SIDE DEMO ONLY, not real security.
Email: admin@flybuy.demo   Password: flybuy-demo   (placeholders — edit DEMO_ADMIN_EMAIL / DEMO_ADMIN_PASSWORD in js/admin.js)
A production build must authenticate this server-side; the comment in js/admin.js
says so explicitly.

WHAT'S SIMULATED (can't run without a server)
- "Place order" at checkout writes a local order record — no Shopify cart is created,
  no payment is charged. In production, swap submitOrder() in js/checkout.js for a
  real call to Shopify's Storefront API (cartCreate / cartLinesAdd) and redirect to
  the returned checkoutUrl.
- Login/account are a demo session only — no real customer authentication.
- products.js is structured so its fields map directly onto Shopify product/collection
  nodes (id, handle→id, title→name, price, images→icon, variants) for an easy swap.

FILE STRUCTURE
frontend/
  index.html, shop.html, product.html, about.html, checkout.html,
  order-confirmation.html, account.html, order-tracking.html, search.html,
  contact.html, faq.html, 404.html
  css/ variables.css reset.css global.css components.css animations.css responsive.css
  js/  utils.js products.js cart.js components.js cursor.js motion.js
       pages.js search.js account.js checkout.js app.js

ADDED IN THIS UPDATE
- Fonts: Bricolage Grotesque (headings/display) + Manrope (body), all pages.
- Shopify READ: set SHOPIFY.domain and SHOPIFY.token (public Storefront token) at the bottom of js/products.js
  to load live products. Falls back to the demo catalog if unset or failing.
- Admin > Add Product / Add Category with image upload (downscaled, saved to localStorage, merged into
  home, shop, search, product pages, cart). LOCAL DEMO ONLY: writing to Shopify needs a server-side Admin token.
