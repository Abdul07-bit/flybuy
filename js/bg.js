/* bg.js — mounts the layered live background, drives it with ONE rAF loop that only writes
   CSS variables on the layer (no layout work), plus card tilt and button ripple. */
function mountMeshBackground() {
  if (document.body.classList.contains('admin-page')) return;
  const layer = document.createElement('div');
  layer.className = 'mesh-bg-layer'; layer.setAttribute('aria-hidden', 'true');
  layer.innerHTML = '<div class="bg-field"></div><div class="mesh-par"><img class="mesh-img" src="assets/mesh.svg" alt="" decoding="async"></div>'
    + '<i class="bg-orb o1"></i><i class="bg-orb o2"></i><i class="bg-orb o3"></i><div class="bg-light"></div><div class="bg-grain"></div>';
  document.body.prepend(layer);
  if (matchMedia('(prefers-reduced-motion: reduce)').matches) return;
  const fine = matchMedia('(hover:hover) and (pointer:fine)').matches;
  let tx = 0, ty = 0, cx = 0, cy = 0, lx = innerWidth / 2, ly = innerHeight * .3, tlx = lx, tly = ly, sy = 0, tsy = 0, run = false;
  function frame() {
    cx += (tx - cx) * .05; cy += (ty - cy) * .05; sy += (tsy - sy) * .08; lx += (tlx - lx) * .06; ly += (tly - ly) * .06;
    layer.style.setProperty('--mx', cx.toFixed(3)); layer.style.setProperty('--my', cy.toFixed(3));
    layer.style.setProperty('--sy', sy.toFixed(1));
    layer.style.setProperty('--lx', lx.toFixed(1) + 'px'); layer.style.setProperty('--ly', ly.toFixed(1) + 'px');
    run = Math.abs(tx - cx) + Math.abs(ty - cy) + Math.abs(tsy - sy) + Math.abs(tlx - lx) + Math.abs(tly - ly) > .02;
    if (run) requestAnimationFrame(frame);
  }
  function kick() { if (!run) { run = true; requestAnimationFrame(frame); } }
  addEventListener('scroll', function () { tsy = scrollY; kick(); }, { passive: true });
  if (fine) {
    addEventListener('pointermove', function (e) { tx = e.clientX / innerWidth - .5; ty = e.clientY / innerHeight - .5; tlx = e.clientX; tly = e.clientY; kick(); }, { passive: true });
    document.addEventListener('pointerover', function (e) { layer.classList.toggle('hot', !!e.target.closest('[data-cursor],.prod-card,.cat-card')); });
  }
}
function init3DTilt() {
  if (matchMedia('(hover:none), (pointer:coarse), (prefers-reduced-motion: reduce)').matches) return;
  const sel = '.prod-card, .pdp-media';
  document.body.addEventListener('pointermove', function (e) {
    const card = e.target.closest(sel); if (!card) return;
    card.classList.add('tilt-3d');
    const r = card.getBoundingClientRect();
    card.style.transform = 'perspective(900px) rotateX(' + ((.5 - (e.clientY - r.top) / r.height) * 5).toFixed(2) + 'deg) rotateY(' + (((e.clientX - r.left) / r.width - .5) * 5).toFixed(2) + 'deg) translateY(-3px)';
  });
  document.body.addEventListener('pointerleave', function (e) { const c = e.target.closest && e.target.closest(sel); if (c) c.style.transform = ''; }, true);
}
function initRipple() {
  document.body.addEventListener('pointerdown', function (e) {
    const btn = e.target.closest('.btn'); if (!btn) return;
    const r = btn.getBoundingClientRect(), s = Math.max(r.width, r.height), span = document.createElement('span');
    span.className = 'ripple'; span.style.cssText = 'width:' + s + 'px;height:' + s + 'px;left:' + (e.clientX - r.left - s / 2) + 'px;top:' + (e.clientY - r.top - s / 2) + 'px';
    btn.appendChild(span); setTimeout(function () { span.remove(); }, 600);
  });
}
document.addEventListener('DOMContentLoaded', function () { mountMeshBackground(); init3DTilt(); initRipple(); });
