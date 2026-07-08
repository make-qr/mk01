(function () {
  'use strict';

  var PLAY_MS = 90000;
  var SHOWN_KEY = 'mm_suggest_shown';
  var GRID_ROWS = 2;

  function isCompact() {
    return !!document.querySelector('.wg-compact');
  }

  function gridMin() {
    return isCompact() ? 104 : 150;
  }

  function gridGap() {
    return isCompact() ? 10 : 14;
  }

  function sideRowHeight() {
    return isCompact() ? 72 : 118;
  }

  function sideCols() {
    return isCompact() ? 2 : 1;
  }

  function esc(s) {
    var d = document.createElement('div');
    d.textContent = s || '';
    return d.innerHTML;
  }

  function allGames() {
    return window.WG_GAMES || [];
  }

  function current() {
    return window.MM_CURRENT_GAME || null;
  }

  function isHomePage() {
    return !!window.MM_HOME_PAGE || !!document.querySelector('[data-mm-home]');
  }

  function grids() {
    return window.__WG_GRIDS_HOME__ || {};
  }

  function classicPool() {
    return window.MM_CLASSIC_GAMES || [];
  }

  function dedupeGames(list) {
    var seen = {};
    var out = [];
    (list || []).forEach(function (g) {
      var key = g.id || g.url;
      if (seen[key]) return;
      seen[key] = true;
      out.push(g);
    });
    return out;
  }

  function gridList(key) {
    var data = grids();
    return data[key] || [];
  }

  function sameCategory(a, b) {
    if (!a || !b) return false;
    var ac = a.wgCategories || a.categories || [];
    var bc = b.wgCategories || b.categories || [];
    for (var i = 0; i < ac.length; i++) {
      if (bc.indexOf(ac[i]) !== -1) return true;
    }
    return false;
  }

  function excludeCurrent(list) {
    var cur = current();
    if (!cur) return list;
    return list.filter(function (g) {
      return g.id !== cur.id && g.url !== cur.url;
    });
  }

  function normalizeHref(url) {
    var href = url || '';
    if (isHomePage()) {
      if (href.indexOf('/') === 0) return href;
      if (href.indexOf('game/') === 0) return '/' + href;
      return href;
    }
    if (href.indexOf('/') === 0) href = '..' + href;
    else if (href.indexOf('game/') === 0) href = '../' + href;
    return href;
  }

  function normalizeImg(img) {
    if (!img) return '';
    if (isHomePage()) {
      if (img.indexOf('/') === 0) return img;
      return img;
    }
    if (img.indexOf('/') === 0) return '..' + img;
    return img;
  }

  function relatedPool() {
    var cur = current();
    if (!cur) return [];
    var pool = allGames();
    var related = pool.filter(function (g) {
      return sameCategory(cur, g);
    });
    pool.forEach(function (g) {
      if (g.id === cur.id) return;
      if (related.some(function (r) { return r.id === g.id; })) return;
      related.push(g);
    });
    return excludeCurrent(related);
  }

  function trendingPool() {
    var data = grids();
    var list = (data.trending || []).concat(data.new || []).concat(data.topRated || []);
    var seen = {};
    var out = [];
    list.forEach(function (g) {
      var key = g.id || g.url;
      if (seen[key]) return;
      seen[key] = true;
      out.push(g);
    });
    if (out.length < 12) {
      allGames().forEach(function (g) {
        if (out.length >= 24) return;
        if (out.some(function (x) { return x.id === g.id; })) return;
        out.push(g);
      });
    }
    return excludeCurrent(out);
  }

  function gridColumns(trackEl) {
    if (!trackEl || !trackEl.clientWidth) return 4;
    var min = gridMin();
    var gap = gridGap();
    return Math.max(2, Math.floor((trackEl.clientWidth + gap) / (min + gap)));
  }

  function railCard(g) {
    var href = normalizeHref(g.url);
    var img = normalizeImg(g.image);
    return (
      '<a class="mm-card" href="' +
      esc(href) +
      '" style="' +
      (g.c ? '--c:' + g.c : '') +
      '">' +
      '<div class="mm-card-art" style="background-image:url(\'' +
      img.replace(/'/g, '%27') +
      '\')"></div>' +
      '<div class="mm-card-body"><h3>' +
      esc(g.name) +
      '</h3>' +
      (g.by ? '<div class="mm-card-by">' + esc(g.by) + '</div>' : '') +
      '</div>' +
      '</a>'
    );
  }

  function sideCard(g) {
    var href = normalizeHref(g.url);
    var img = normalizeImg(g.image);
    return (
      '<a class="wg-side-card" href="' +
      esc(href) +
      '"><img src="' +
      esc(img) +
      '" alt="' +
      esc(g.name) +
      '" loading="lazy"/><span>' +
      esc(g.name) +
      '</span></a>'
    );
  }

  function pickCard(g) {
    var href = normalizeHref(g.url);
    var img = normalizeImg(g.image);
    return (
      '<a class="game-item" href="' +
      esc(href) +
      '"><img loading="lazy" alt="' +
      esc(g.name) +
      '" src="' +
      esc(img) +
      '"/><span>' +
      esc(g.name) +
      '</span></a>'
    );
  }

  function picksPool() {
    var data = grids();
    var list = (data.topRated || [])
      .concat(data.trending || [])
      .concat(data.new || []);
    var seen = {};
    var out = [];
    list.forEach(function (g) {
      var key = g.id || g.url;
      if (seen[key]) return;
      seen[key] = true;
      out.push(g);
    });
    if (out.length < 8) {
      allGames().forEach(function (g) {
        if (out.length >= 8) return;
        if (out.some(function (x) { return x.id === g.id; })) return;
        out.push(g);
      });
    }
    return excludeCurrent(out);
  }

  function renderPicksGrid() {
    var el = document.getElementById('mm-picks-grid');
    if (!el) return;
    el.innerHTML = picksPool().slice(0, 8).map(pickCard).join('');
  }

  function suggestCard(g) {
    var href = normalizeHref(g.url);
    var img = normalizeImg(g.image);
    return (
      '<a class="mm-suggest-card" href="' +
      esc(href) +
      '"><img src="' +
      esc(img) +
      '" alt="' +
      esc(g.name) +
      '" loading="lazy"/><span>' +
      esc(g.name) +
      '</span></a>'
    );
  }

  function renderTwoRowGrid(el, items) {
    if (!el) return;
    var cols = gridColumns(el);
    var count = cols * GRID_ROWS;
    var list = items.slice(0, count);
    el.style.gridTemplateColumns = 'repeat(' + cols + ', 1fr)';
    el.innerHTML = list.map(railCard).join('');
  }

  function sideRailCount() {
    var player = document.getElementById('mm-player');
    if (!player) return 4;
    var h = player.offsetHeight;
    var titleH = isCompact() ? 24 : 30;
    var rows = Math.max(1, Math.floor((h - titleH) / sideRowHeight()));
    return rows * sideCols();
  }

  function renderSideRails() {
    var leftEl = document.getElementById('mm-side-left');
    var rightEl = document.getElementById('mm-side-right');
    var player = document.getElementById('mm-player');
    if (!leftEl || !rightEl || !player) return;

    var count = sideRailCount();
    var leftRail = document.querySelector('.wg-side-rail--left');
    var rightRail = document.querySelector('.wg-side-rail--right');
    var h = player.offsetHeight + 'px';

    if (leftRail) leftRail.style.height = h;
    if (rightRail) rightRail.style.height = h;

    var leftPool = isHomePage()
      ? dedupeGames(gridList('trending').concat(relatedPool()))
      : relatedPool();
    leftEl.innerHTML = leftPool.slice(0, count).map(sideCard).join('');
    rightEl.innerHTML = trendingPool().slice(0, count).map(sideCard).join('');
  }

  function renderRailEl(el, items) {
    if (!el) return;
    var list = excludeCurrent(items || []);
    if (el.classList.contains('mm-rail-track--grid2')) {
      renderTwoRowGrid(el, list);
    } else {
      el.innerHTML = list.slice(0, 8).map(railCard).join('');
    }
  }

  function renderRails() {
    var railMap = [
      { id: 'mm-related-rail', items: relatedPool() },
      { id: 'mm-trending-rail', items: trendingPool() },
      { id: 'mm-rail-trending', items: gridList('trending') },
      { id: 'mm-rail-new', items: gridList('new') },
      { id: 'mm-rail-top', items: gridList('topRated') },
      { id: 'mm-rail-classic', items: classicPool() }
    ];

    railMap.forEach(function (entry) {
      renderRailEl(document.getElementById(entry.id), entry.items);
    });

    renderSideRails();
    renderPicksGrid();
  }

  function bindResize() {
    var observeEl =
      document.getElementById('mm-related-rail') ||
      document.getElementById('mm-rail-trending') ||
      document.querySelector('.mm-rail-track--grid2');
    if (!observeEl || typeof ResizeObserver === 'undefined') {
      window.addEventListener('resize', function () {
        renderRails();
      });
      return;
    }
    var ro = new ResizeObserver(function () {
      renderRails();
    });
    ro.observe(observeEl);
    var player = document.getElementById('mm-player');
    if (player) ro.observe(player);
  }

  function showSuggestModal() {
    var modal = document.getElementById('mm-suggest-modal');
    var grid = document.getElementById('mm-suggest-grid');
    if (!modal || !grid) return;
    if (sessionStorage.getItem(SHOWN_KEY)) return;

    var picks = relatedPool().slice(0, 6);
    if (!picks.length) picks = trendingPool().slice(0, 6);
    if (!picks.length) return;

    grid.innerHTML = picks.map(suggestCard).join('');
    modal.hidden = false;
    modal.setAttribute('aria-hidden', 'false');
    sessionStorage.setItem(SHOWN_KEY, '1');
  }

  function hideSuggestModal() {
    var modal = document.getElementById('mm-suggest-modal');
    if (!modal) return;
    modal.hidden = true;
    modal.setAttribute('aria-hidden', 'true');
  }

  function bindModal() {
    document.querySelectorAll('[data-mm-close]').forEach(function (el) {
      el.addEventListener('click', hideSuggestModal);
    });
    document.addEventListener('keydown', function (e) {
      if (e.key === 'Escape') hideSuggestModal();
    });
  }

  function bindExitIntent() {
    var fired = false;
    document.addEventListener('mouseout', function (e) {
      if (fired) return;
      if (!e.relatedTarget && e.clientY <= 0) {
        fired = true;
        showSuggestModal();
      }
    });
  }

  function bindPlayTimer() {
    var playBtn = document.getElementById('playGameButton');
    if (playBtn) {
      playBtn.addEventListener('click', function () {
        setTimeout(showSuggestModal, PLAY_MS);
      });
      return;
    }
    setTimeout(showSuggestModal, PLAY_MS);
  }

  function bindVisibility() {
    var hiddenAt = 0;
    document.addEventListener('visibilitychange', function () {
      if (document.hidden) {
        hiddenAt = Date.now();
      } else if (hiddenAt && Date.now() - hiddenAt > 15000) {
        showSuggestModal();
      }
    });
  }

  function init() {
    if (!current() && !isHomePage()) return;
    renderRails();
    bindResize();
    bindModal();
    bindExitIntent();
    bindPlayTimer();
    bindVisibility();
    window.addEventListener('load', renderRails);
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }
})();
