/* search.js — live product search used on search.html and the shop filter bar. */
function runSearch(term) {
  term = (term || '').toLowerCase().trim();
  if (!term) return [];
  return PRODUCTS.filter(function (p) {
    return p.name.toLowerCase().includes(term) || p.cat.toLowerCase().includes(term) || p.short.toLowerCase().includes(term);
  });
}
function renderSearchPage() {
  const input = document.getElementById('searchInput');
  const results = document.getElementById('searchResults');
  const recentKey = 'flybuy_recent_searches';
  function getRecent() { try { return JSON.parse(localStorage.getItem(recentKey)) || []; } catch (e) { return []; } }
  function pushRecent(term) {
    let list = getRecent().filter(function (t) { return t !== term; });
    list.unshift(term); list = list.slice(0, 6);
    try { localStorage.setItem(recentKey, JSON.stringify(list)); } catch (e) {}
  }
  function paint(term) {
    const list = runSearch(term);
    if (!term) {
      const recent = getRecent();
      results.innerHTML = (recent.length ? '<p class="eyebrow">Recent searches</p><div class="tabs" style="margin-bottom:30px">'
        + recent.map(function (t) { return '<button class="tab" onclick="document.getElementById(\'searchInput\').value=\'' + t + '\';renderSearchPage.paint(\'' + t + '\')">' + t + '</button>'; }).join('') + '</div>' : '')
        + '<p class="eyebrow">Popular</p><div class="tabs">' + ['Headphones', 'Earbuds', 'Desk', 'Travel'].map(function (t) {
          return '<button class="tab" onclick="document.getElementById(\'searchInput\').value=\'' + t + '\';renderSearchPage.paint(\'' + t + '\')">' + t + '</button>';
        }).join('') + '</div>';
      return;
    }
    pushRecent(term);
    results.innerHTML = list.length
      ? '<p class="result-count">' + list.length + ' results for "' + term + '"</p><div class="prod-grid">' + list.map(productCard).join('') + '</div>'
      : '<div class="empty-state"><div class="display">Nothing matched that search.</div><button class="btn btn-outline" style="width:auto;margin-top:14px" onclick="document.getElementById(\'searchInput\').value=\'\';renderSearchPage.paint(\'\')">CLEAR SEARCH</button></div>';
  }
  renderSearchPage.paint = paint;
  input.addEventListener('input', function () { paint(input.value); });
  input.addEventListener('keydown', function (e) { if (e.key === 'Escape') { input.value = ''; paint(''); input.blur(); } });
  paint(qs('q', ''));
  input.focus();
}
