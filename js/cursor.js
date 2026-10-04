/* cursor.js — context-aware cursor (desktop pointer only) + magnetic buttons/nav.
   Normal: small dot+ring. Product/category: ring grows into a filled VIEW/EXPLORE disc.
   CTA/links: ring scales. Nav/icon/buttons: magnetic pull. Off on touch + reduced motion. */
(function () {
  if (matchMedia('(hover:none), (pointer:coarse), (prefers-reduced-motion: reduce)').matches) return;
  document.body.classList.add('has-custom-cursor');
  const dot = document.createElement('div'); dot.className = 'cursor-dot';
  const ring = document.createElement('div'); ring.className = 'cursor-ring'; ring.innerHTML = '<i></i><span></span>';
  document.body.append(dot, ring);
  const txt = ring.querySelector('span');
  let mx = -100, my = -100, rx = -100, ry = -100, mag = null, last = '';
  addEventListener('pointermove', function (e) {
    mx = e.clientX; my = e.clientY;
    const t = e.target.closest ? e.target : document.body;
    const lab = t.closest('[data-cursor]');
    let label = lab ? lab.dataset.cursor : t.closest('.prod-media,.prod-name') ? 'VIEW' : t.closest('.cat-card') ? 'EXPLORE' : '';
    if (t.closest('input,textarea,select')) label = '';
    if (label !== last) { last = label; txt.textContent = label; ring.classList.toggle('label', !!label); }
    ring.classList.toggle('cta', !label && !!t.closest('a,button,.magnetic'));
    dot.classList.toggle('hide', !!label);
    document.body.classList.toggle('cursor-dark', !!t.closest('[data-tone="dark"]'));
    const m = t.closest('.magnetic,.mainnav a,.icon-btn');
    if (mag && mag !== m) mag.style.transform = '';
    mag = m;
    if (m) {
      const r = m.getBoundingClientRect(), k = m.classList.contains('btn') ? .22 : .35;
      m.style.transform = 'translate3d(' + Math.max(-10, Math.min(10, (mx - r.left - r.width / 2) * k)).toFixed(1) + 'px,' + Math.max(-8, Math.min(8, (my - r.top - r.height / 2) * k)).toFixed(1) + 'px,0)';
    }
  }, { passive: true });
  document.addEventListener('pointerleave', function () { if (mag) mag.style.transform = ''; }, true);
  (function raf() {
    rx += (mx - rx) * .18; ry += (my - ry) * .18;
    dot.style.transform = 'translate3d(' + mx + 'px,' + my + 'px,0)';
    ring.style.transform = 'translate3d(' + rx.toFixed(1) + 'px,' + ry.toFixed(1) + 'px,0)';
    requestAnimationFrame(raf);
  })();
})();
