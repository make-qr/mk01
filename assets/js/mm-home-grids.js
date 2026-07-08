(function () {
  'use strict';

  function esc(s) {
    var d = document.createElement('div');
    d.textContent = s || '';
    return d.innerHTML;
  }

  function grids() {
    return window.__WG_GRIDS_HOME__ || { trending: [], new: [], topRated: [] };
  }

  function card(g) {
    var pip = '';
    if (g.pip === 'hot') pip = '<span class="mm-pip hot">HOT</span>';
    else if (g.pip === 'new') pip = '<span class="mm-pip new">NEW</span>';
    else if (g.pip === 'top') pip = '<span class="mm-pip top">TOP</span>';

    var img = g.image || '';
    var artStyle = img
      ? "background-image:url('" + img.replace(/'/g, '%27') + "')"
      : (g.c ? 'background-color:' + g.c : '');

    return (
      '<a class="mm-card" href="' +
      esc(g.url) +
      '" style="' +
      (g.c ? '--c:' + g.c + ';' : '') +
      '">' +
      pip +
      '<div class="mm-card-art" style="' +
      artStyle +
      '"></div>' +
      '<div class="mm-card-body"><h3>' +
      esc(g.name) +
      '</h3>' +
      (g.by ? '<div class="mm-card-by">' + esc(g.by) + '</div>' : '') +
      '</div>' +
      '<span class="mm-card-play"><i class="fas fa-play"></i></span>' +
      '</a>'
    );
  }

  function renderRail(id, items) {
    var el = document.getElementById(id);
    if (!el || !items || !items.length) return;
    el.innerHTML = items.map(card).join('');
  }

  function init() {
    var data = grids();
    renderRail('mm-rail-trending', data.trending);
    renderRail('mm-rail-new', data.new);
    renderRail('mm-rail-top', data.topRated);
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }
})();
