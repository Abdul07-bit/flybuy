/* motion.js — scroll reveals, hero stage parallax, scroll-linked story lines, image parallax,
   dark/light tone switching, membership spotlight. IntersectionObserver + one rAF each, transforms only. */
const REDUCED = matchMedia('(prefers-reduced-motion: reduce)').matches;
const FINE = matchMedia('(hover:hover) and (pointer:fine)').matches;

function initReveal() {
  const els = document.querySelectorAll('.reveal:not(.in),.reveal-mask:not(.in),.ln-group:not(.in)');
  if (REDUCED || !('IntersectionObserver' in window)) { els.forEach(function (e) { e.classList.add('in'); }); return; }
  const io = new IntersectionObserver(function (es) {
    es.forEach(function (e) { if (e.isIntersecting) { e.target.classList.add('in'); io.unobserve(e.target); } });
  }, { threshold: .12, rootMargin: '0px 0px -6% 0px' });
  els.forEach(function (e) { io.observe(e); });
}

/* hero: layers drift at different depths with pointer + scroll; rAF runs only while values are settling */
function initHeroStage() {
  const st = document.getElementById('heroStage');
  if (!st || REDUCED || st.dataset.bound) return;
  st.dataset.bound = 1;
  let tx = 0, ty = 0, cx = 0, cy = 0, sy = 0, tsy = 0, on = false, vis = true;
  function f() {
    cx += (tx - cx) * .06; cy += (ty - cy) * .06; sy += (tsy - sy) * .09;
    st.style.setProperty('--mx', cx.toFixed(3)); st.style.setProperty('--my', cy.toFixed(3)); st.style.setProperty('--sy', sy.toFixed(1));
    on = Math.abs(tx - cx) + Math.abs(ty - cy) + Math.abs(tsy - sy) > .02;
    if (on && vis) requestAnimationFrame(f);
  }
  function kick() { if (!on && vis) { on = true; requestAnimationFrame(f); } }
  if (FINE) addEventListener('pointermove', function (e) { tx = e.clientX / innerWidth - .5; ty = e.clientY / innerHeight - .5; kick(); }, { passive: true });
  addEventListener('scroll', function () { tsy = Math.min(scrollY, innerHeight * 1.2); kick(); }, { passive: true });
  new IntersectionObserver(function (e) { vis = e[0].isIntersecting; st.classList.toggle('paused', !vis); if (vis) kick(); }).observe(st);
}

/* [data-scrollp] sets --p (0→1) as the element crosses the viewport; [data-par] translates by scroll */
const SL = { vis: new Set(), io: null, bound: false };
function initScrollLinked() {
  if (REDUCED) return;
  if (!SL.io) SL.io = new IntersectionObserver(function (es) { es.forEach(function (e) { e.isIntersecting ? SL.vis.add(e.target) : SL.vis.delete(e.target); }); }, { rootMargin: '20% 0px' });
  document.querySelectorAll('[data-scrollp],[data-par]').forEach(function (e) { if (!e._o) { e._o = 1; SL.io.observe(e); } });
  if (SL.bound) return; SL.bound = true;
  let q = false;
  function run() {
    q = false; const vh = innerHeight;
    SL.vis.forEach(function (el) {
      const r = el.getBoundingClientRect();
      if (el.hasAttribute('data-scrollp')) el.style.setProperty('--p', Math.max(0, Math.min(1, (vh - r.top) / (vh + r.height))).toFixed(4));
      else if (innerWidth >= 700) el.style.transform = 'translate3d(0,' + ((r.top + r.height / 2 - vh / 2) * -parseFloat(el.dataset.par)).toFixed(1) + 'px,0)';
    });
  }
  addEventListener('scroll', function () { if (!q) { q = true; requestAnimationFrame(run); } }, { passive: true });
  addEventListener('resize', run);
  run();
}

/* body.on-dark while a [data-tone=dark] section sits under the header → header, cursor, bg adapt */
function initTone() {
  const dark = document.querySelectorAll('[data-tone="dark"]'), h = document.getElementById('siteHeader');
  if (!dark.length || initTone.done) return; initTone.done = 1;
  const on = new Set();
  const io = new IntersectionObserver(function (es) {
    es.forEach(function (e) { e.isIntersecting ? on.add(e.target) : on.delete(e.target); });
    const d = on.size > 0; document.body.classList.toggle('on-dark', d); if (h) h.classList.toggle('on-dark', d);
  }, { rootMargin: '-40% 0px -55% 0px' });
  dark.forEach(function (e) { io.observe(e); });
}

function initSpotlight() {
  if (REDUCED || !FINE) return;
  document.querySelectorAll('[data-spot]:not([data-sb])').forEach(function (el) {
    el.dataset.sb = 1;
    el.addEventListener('pointermove', function (e) {
      const r = el.getBoundingClientRect();
      el.style.setProperty('--sx', (e.clientX - r.left).toFixed(0) + 'px'); el.style.setProperty('--sy2', (e.clientY - r.top).toFixed(0) + 'px');
    }, { passive: true });
  });
}

function initMotion() { initReveal(); initHeroStage(); initScrollLinked(); initTone(); initSpotlight(); }
document.addEventListener('DOMContentLoaded', function () { setTimeout(initMotion, 60); });
