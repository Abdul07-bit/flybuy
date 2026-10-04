/* hscroll.js — pinned gallery: vertical scroll drives horizontal travel. Each panel gets depth
   (scale / opacity / rotateY / parallax) from its distance to the viewport centre, and the
   counter, progress bar and ghost title follow the same scroll value.
   Native snap-swipe on touch, narrow screens and prefers-reduced-motion. Idempotent: safe to re-render. */
const HS = { n: 0, cards: [], max: 0, cur: 0, target: 0, raf: 0, bound: false, idx: -1, list: [] };

function renderHScroll(list) {
  const track = document.getElementById('hsTrack'); if (!track) return;
  HS.list = list; HS.n = list.length;
  track.innerHTML = list.map(function (p, i) {
    return '<a class="hs-card" href="product.html?id=' + p.id + '" data-cursor="VIEW" aria-label="' + p.name + '">'
      + '<span class="hs-num">' + String(i + 1).padStart(2, '0') + '</span>'
      + '<div class="hs-img"><div class="hs-media">' + media(p) + '</div></div>'
      + '<div class="hs-info"><span class="hs-name">' + p.name + '</span>'
      + '<span class="hs-sub"><span>' + p.cat + ' / FLYBUY</span><b>' + fmtPrice(p.price) + '</b></span></div></a>';
  }).join('');
  HS.cards = [].slice.call(track.children);
  HS.idx = -1;
  initHScroll();
}

function initHScroll() {
  const sec = document.getElementById('hScroll'), track = document.getElementById('hsTrack'); if (!sec || !track) return;
  const vp = track.parentElement, bar = document.getElementById('hsBar'), count = document.getElementById('hsCount'), ghost = document.getElementById('hsGhost');
  const mq = matchMedia('(min-width:901px) and (hover:hover) and (prefers-reduced-motion:no-preference)');
  let centers = [], w = 0, left = 0;

  function measure() {
    if (!mq.matches) {
      sec.classList.add('hs-native'); sec.style.height = ''; track.style.transform = '';
      HS.cards.forEach(function (c) { c.children[0].style.cssText = ''; c.children[1].style.cssText = ''; c.children[1].firstElementChild.style.cssText = ''; });
      return;
    }
    sec.classList.remove('hs-native');
    w = innerWidth; left = parseFloat(getComputedStyle(vp).paddingLeft) || 0;
    HS.max = Math.max(0, track.scrollWidth - vp.clientWidth + 48);
    centers = HS.cards.map(function (c) { return c.offsetLeft + c.offsetWidth / 2; });
    sec.style.height = (innerHeight + HS.max * 1.05) + 'px';
    update();
  }
  function update() {
    if (!mq.matches) return;
    const r = sec.getBoundingClientRect();
    HS.target = Math.min(1, Math.max(0, -r.top / Math.max(1, sec.offsetHeight - innerHeight)));
    if (!HS.raf) HS.raf = requestAnimationFrame(tick);
  }
  function tick() {
    HS.cur += (HS.target - HS.cur) * .1;
    if (Math.abs(HS.target - HS.cur) < .0004) HS.cur = HS.target;
    const x = -HS.cur * HS.max;
    track.style.transform = 'translate3d(' + x.toFixed(1) + 'px,0,0)';
    bar.style.transform = 'scaleX(' + HS.cur.toFixed(4) + ')';
    let best = 0, bd = 9;
    for (let i = 0; i < HS.cards.length; i++) {
      const o = (centers[i] + x + left - w / 2) / w, a = Math.min(1, Math.abs(o));   // −1…1 from centre
      if (a < bd) { bd = a; best = i; }
      const img = HS.cards[i].children[1];
      img.style.transform = 'translate3d(0,' + (a * a * 46).toFixed(1) + 'px,0) rotateY(' + (-o * 14).toFixed(2) + 'deg) scale(' + (1 - a * .12).toFixed(3) + ')';
      img.style.opacity = (1 - a * .55).toFixed(2);
      img.firstElementChild.style.transform = 'translate3d(' + (o * -38).toFixed(1) + 'px,0,0) scale(1.12)';   // inner parallax
      HS.cards[i].firstElementChild.style.transform = 'translate3d(' + (o * 60).toFixed(1) + 'px,0,0)';   // number drifts faster
    }
    if (best !== HS.idx) {
      HS.idx = best;
      count.textContent = String(best + 1).padStart(2, '0') + ' / ' + String(HS.n).padStart(2, '0');
      if (ghost) { ghost.classList.remove('swap'); void ghost.offsetWidth; ghost.textContent = HS.list[best].name.split(' ')[0]; ghost.classList.add('swap'); }
      HS.cards.forEach(function (c, i) { c.classList.toggle('is-active', i === best); });
    }
    HS.raf = HS.cur === HS.target ? 0 : requestAnimationFrame(tick);
  }
  // hover: the product leans toward the cursor (applies to the inner media layer, separate from scroll depth)
  if (!HS.bound) {
    HS.bound = true;
    track.addEventListener('pointermove', function (e) {
      const c = e.target.closest('.hs-card'); if (!c || !mq.matches) return;
      const r = c.querySelector('.hs-img').getBoundingClientRect(), m = c.querySelector('.hs-media');
      const px = (e.clientX - r.left) / r.width - .5, py = (e.clientY - r.top) / r.height - .5;
      c.style.setProperty('--hx', (px * 22).toFixed(1) + 'px'); c.style.setProperty('--hy', (py * 18).toFixed(1) + 'px'); c.style.setProperty('--hr', (px * 3).toFixed(2) + 'deg');
    }, { passive: true });
    track.addEventListener('pointerout', function (e) { const c = e.target.closest('.hs-card'); if (c) { c.style.removeProperty('--hx'); c.style.removeProperty('--hy'); c.style.removeProperty('--hr'); } });
    addEventListener('scroll', function () { HS.update(); }, { passive: true });
    addEventListener('resize', function () { clearTimeout(HS.t); HS.t = setTimeout(function () { HS.measure(); }, 120); });
    mq.addEventListener && mq.addEventListener('change', function () { HS.measure(); });
    addEventListener('load', function () { HS.measure(); });
  }
  HS.measure = measure; HS.update = update;
  measure();
}
