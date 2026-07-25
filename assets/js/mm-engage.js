(function () {
  'use strict';

  var SHOWN_KEY = 'mm_suggest_shown';
  var RECENT_KEY = 'mm_recent';
  var FAV_KEY = 'mm_favorites';
  var RECENT_MAX = 12;
  var GRID_ROWS = 2;
  var PERSONAL_ROWS = 4;

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

  function hiddenIds() {
    var list = window.MM_HIDDEN || [];
    var map = {};
    for (var i = 0; i < list.length; i++) map[list[i]] = true;
    return map;
  }

  function isHiddenGame(g) {
    if (!g) return true;
    var hid = hiddenIds();
    return !!(hid[g.id] || hid[gameKey(g)]);
  }

  function allGames() {
    // Home + WG game pages use slim WG_GAMES_HOME; category pages load full WG_GAMES.
    var pool = window.WG_GAMES || window.WG_GAMES_HOME || [];
    var hid = hiddenIds();
    if (!Object.keys(hid).length) return pool;
    return pool.filter(function (g) {
      return g && g.id && !hid[g.id];
    });
  }

  function current() {
    return window.MM_CURRENT_GAME || null;
  }

  function isHomePage() {
    return !!window.MM_HOME_PAGE || !!document.querySelector('[data-mm-home]');
  }

  function isGamePage() {
    return !!current() && !isHomePage();
  }

  function isCatalogPage() {
    return !!window.MM_CATALOG_PAGE || !!document.querySelector('[data-mm-catalog]');
  }

  function grids() {
    return window.__WG_GRIDS_HOME__ || {};
  }

  function classicPool() {
    return (window.MM_CLASSIC_GAMES || []).filter(function (g) {
      return g && g.id && !isHiddenGame(g);
    });
  }

  function gameKey(g) {
    return (g && (g.id || g.url)) || '';
  }

  function loadJson(key, fallback) {
    try {
      var raw = localStorage.getItem(key);
      return raw ? JSON.parse(raw) : fallback;
    } catch (e) {
      return fallback;
    }
  }

  function saveJson(key, val) {
    try {
      localStorage.setItem(key, JSON.stringify(val));
    } catch (e) {}
  }

  function trackRecent() {
    var cur = current();
    if (!cur || !cur.id || isHomePage()) return;
    if (isHiddenGame(cur)) return;
    var list = loadJson(RECENT_KEY, []);
    var entry = {
      id: cur.id,
      name: cur.name,
      image: cur.image,
      url: cur.url || '/game/' + cur.id + '.html',
      by: cur.by,
      c: cur.c,
    };
    list = list.filter(function (g) {
      return g.id !== cur.id && !isHiddenGame(g);
    });
    list.unshift(entry);
    saveJson(RECENT_KEY, list.slice(0, RECENT_MAX));
  }

  function getRecent() {
    return loadJson(RECENT_KEY, []).filter(function (g) {
      return g && g.id && !isHiddenGame(g);
    });
  }

  function getFavorites() {
    return loadJson(FAV_KEY, []).filter(function (g) {
      return g && g.id && !isHiddenGame(g);
    });
  }

  function isFavorite(id) {
    return getFavorites().some(function (g) {
      return g.id === id;
    });
  }

  function toggleFavorite() {
    var cur = current();
    if (!cur || !cur.id) return;
    var list = getFavorites();
    var idx = list.findIndex(function (g) {
      return g.id === cur.id;
    });
    if (idx >= 0) {
      list.splice(idx, 1);
    } else {
      list.unshift({
        id: cur.id,
        name: cur.name,
        image: cur.image,
        url: cur.url || '/game/' + cur.id + '.html',
        by: cur.by,
        c: cur.c,
      });
    }
    saveJson(FAV_KEY, list);
    updateLikeButton();
    renderRails();
  }

  function updateLikeButton() {
    var btn = document.getElementById('mm-like-btn');
    if (!btn) return;
    var cur = current();
    var liked = !!(cur && isFavorite(cur.id));
    btn.classList.toggle('mm-like-btn--active', liked);
    btn.setAttribute('aria-pressed', liked ? 'true' : 'false');
    btn.title = liked ? 'Remove from favorites' : 'Add to favorites';
  }

  function dedupeGames(list) {
    var seen = {};
    var out = [];
    (list || []).forEach(function (g) {
      var key = gameKey(g);
      if (!key || seen[key]) return;
      seen[key] = true;
      out.push(g);
    });
    return out;
  }

  function featuredIds(key) {
    var f = window.MM_FEATURED || {};
    var hid = hiddenIds();
    return (f[key] || []).filter(function (id) {
      return id && !hid[id];
    });
  }

  function hasFeatured(key) {
    return featuredIds(key).length > 0;
  }

  function gridItemFromGame(g, pip, extra) {
    if (!g || !g.id) return null;
    extra = extra || {};
    return {
      id: g.id,
      name: g.name,
      by: g.by,
      image: g.image,
      url: g.url || '/game/' + g.id + '.html',
      c: g.c,
      pip: pip || g.pip || '',
      cats: g.wgCategories || g.cats || g.categories || [],
      preview: g.preview || '',
      big: !!extra.big,
    };
  }

  function featuredGridList(key, pip) {
    if (!hasFeatured(key)) return null;
    var out = [];
    featuredIds(key).forEach(function (id) {
      var g = gameById(id);
      var item = gridItemFromGame(g, pip);
      if (item) out.push(item);
    });
    return out;
  }

  function gridList(key) {
    var pipMap = { trending: 'hot', new: 'new', topRated: 'top' };
    var strict = featuredGridList(key, pipMap[key] || '');
    if (strict && strict.length) return strict.filter(function (g) {
      return !isHiddenGame(g);
    });
    var data = grids();
    return (data[key] || []).filter(function (g) {
      return !isHiddenGame(g);
    });
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
    if (!cur) return list || [];
    return (list || []).filter(function (g) {
      return g.id !== cur.id && g.url !== cur.url;
    });
  }

  function pickFromPool(pool, shown, count) {
    var out = [];
    (pool || []).forEach(function (g) {
      if (out.length >= count) return;
      var key = gameKey(g);
      if (!key || shown[key]) return;
      shown[key] = true;
      out.push(g);
    });
    return out;
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
      if (related.some(function (r) {
        return r.id === g.id;
      })) return;
      related.push(g);
    });
    return excludeCurrent(related);
  }

  function gameById(id) {
    if (!id) return null;
    var pool = allGames();
    for (var i = 0; i < pool.length; i++) {
      if (pool[i].id === id) return pool[i];
    }
    return null;
  }

  function featuredGames(key) {
    var f = window.MM_FEATURED || {};
    var ids = f[key] || [];
    var out = [];
    ids.forEach(function (id) {
      var g = gameById(id);
      if (g) out.push(g);
    });
    return out;
  }

  function curatedList(key) {
    return gridList(key);
  }

  function picksList() {
    if (hasFeatured('picks')) {
      var out = [];
      featuredIds('picks').forEach(function (id) {
        var g = gameById(id);
        if (g) out.push(g);
      });
      return out;
    }
    var data = grids();
    return dedupeGames(
      (data.topRated || []).concat(data.trending || []).concat(data.new || [])
    );
  }

  function trendingPool() {
    return excludeCurrent(curatedList('trending'));
  }

  function picksPool() {
    return excludeCurrent(picksList());
  }

  function injectGamePageRails() {
    if (!isGamePage() || document.getElementById('mm-rail-new')) return;
    var anchor =
      document.getElementById('mm-trending-rail') ||
      document.getElementById('mm-rail-trending');
    if (!anchor) return;
    var refSection = anchor.closest('.mm-rail-section');
    if (!refSection || !refSection.parentNode) return;

    var blocks = [
      {
        id: 'mm-rail-new',
        icon: 'fa-sparkles',
        title: 'New games',
        badge: 'new',
      },
      {
        id: 'mm-rail-top',
        icon: 'fa-trophy',
        title: 'Top rated',
        badge: 'top',
      },
    ];

    var insertAfter = refSection;
    blocks.forEach(function (block) {
      var sec = document.createElement('section');
      sec.className = 'mm-rail-section mm-rail-section--grid2';
      sec.innerHTML =
        '<div class="mm-rail-head">' +
        '<h2 class="mm-rail-heading"><i class="fas ' +
        block.icon +
        '"></i> ' +
        esc(block.title) +
        '</h2>' +
        '<a class="mm-rail-see-all" href="../category/game.html">See all →</a>' +
        '</div>' +
        '<div class="mm-rail-track mm-rail-track--grid2" id="' +
        block.id +
        '"></div>';
      insertAfter.parentNode.insertBefore(sec, insertAfter.nextSibling);
      insertAfter = sec;
    });
  }

  function gridColumns(trackEl) {
    if (!trackEl || !trackEl.clientWidth) return 4;
    var min = gridMin();
    var gap = gridGap();
    return Math.max(2, Math.floor((trackEl.clientWidth + gap) / (min + gap)));
  }

  function pipHtml(g, fallback) {
    var pip = g.pip || fallback || '';
    if (pip === 'hot') return '<span class="mm-pip hot">HOT</span>';
    if (pip === 'new') return '<span class="mm-pip new">NEW</span>';
    if (pip === 'top') return '<span class="mm-pip top">TOP</span>';
    return '';
  }

  function railCard(g, opts) {
    opts = opts || {};
    var overlay = !!opts.overlay;
    var href = normalizeHref(g.url);
    var img = normalizeImg(g.image);
    var pip = pipHtml(g, opts.badge);
    var bigClass = g.big ? ' mm-card--big' : '';
    var style = g.c ? '--c:' + g.c : '';

    if (overlay) {
      return (
        '<a class="mm-card mm-card--overlay' +
        bigClass +
        '" href="' +
        esc(href) +
        '" style="' +
        style +
        '">' +
        pip +
        '<div class="mm-card-art" style="background-image:url(\'' +
        img.replace(/'/g, '%27') +
        '\')">' +
        '<span class="mm-card-title">' +
        esc(g.name) +
        '</span></div></a>'
      );
    }

    return (
      '<a class="mm-card" href="' +
      esc(href) +
      '" style="' +
      style +
      '">' +
      pip +
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

  function sideCard(g, badge) {
    var href = normalizeHref(g.url);
    var img = normalizeImg(g.image);
    var pip = pipHtml(g, badge);
    return (
      '<a class="wg-side-card wg-side-card--overlay" href="' +
      esc(href) +
      '">' +
      pip +
      '<div class="wg-side-card-art" style="background-image:url(\'' +
      img.replace(/'/g, '%27') +
      '\')" role="img" aria-label="' +
      esc(g.name) +
      '"></div>' +
      '<span class="wg-side-card-title">' +
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

  function renderTwoRowGrid(el, items, badge, opts) {
    if (!el) return;
    opts = opts || {};
    var cols = gridColumns(el);
    var maxDefault = cols * GRID_ROWS;
    var count = opts.showAll ? items.length : Math.min(items.length, maxDefault);
    if (opts.showAll && items.length > maxDefault) {
      var rows = Math.ceil(items.length / cols);
      el.style.gridTemplateRows = 'repeat(' + rows + ', auto)';
    } else {
      el.style.gridTemplateRows = '';
    }
    var list = items.slice(0, count);
    el.style.gridTemplateColumns = 'repeat(' + cols + ', 1fr)';
    el.innerHTML = list
      .map(function (g) {
        return railCard(g, { overlay: true, badge: badge });
      })
      .join('');
  }

  function trimToFullRows(count, cols) {
    if (count <= 0) return 0;
    var full = Math.floor(count / cols) * cols;
    if (full < 1) return Math.min(count, cols);
    return full;
  }

  function renderPersonalGrid(el, items) {
    if (!el) return;
    var cols = gridColumns(el);
    var max = Math.min(items.length, RECENT_MAX);
    var target = Math.min(max, cols * PERSONAL_ROWS);
    var count = trimToFullRows(target, cols);
    el.style.gridTemplateColumns = 'repeat(' + cols + ', 1fr)';
    el.innerHTML = items
      .slice(0, count)
      .map(function (g) {
        return railCard(g, { overlay: true });
      })
      .join('');
  }

  function renderRailEl(el, items, badge, opts) {
    if (!el) return;
    opts = opts || {};
    if (el.classList.contains('mm-rail-track--personal')) {
      renderPersonalGrid(el, items);
    } else if (el.classList.contains('mm-rail-track--grid2')) {
      renderTwoRowGrid(el, items, badge, opts);
    } else {
      el.innerHTML = items
        .slice(0, 8)
        .map(function (g) {
          return railCard(g, { overlay: true, badge: badge });
        })
        .join('');
    }
  }

  function toggleSection(sectionId, visible) {
    var sec = document.getElementById(sectionId);
    if (sec) sec.hidden = !visible;
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

    var leftPool = isHomePage() ? picksPool() : relatedPool();
    var rightPool = trendingPool();
    var leftList = excludeCurrent(leftPool).slice(0, count);
    var rightList = excludeCurrent(rightPool).slice(0, count);

    leftEl.innerHTML = leftList
      .map(function (g) {
        return sideCard(g);
      })
      .join('');
    rightEl.innerHTML = rightList
      .map(function (g) {
        return sideCard(g, 'hot');
      })
      .join('');
  }

  function renderRails() {
    injectGamePageRails();
    renderSideRails();

    var shown = {};
    var railMap = [
      { id: 'mm-related-rail', pool: relatedPool(), auto: true },
      { id: 'mm-trending-rail', key: 'trending', badge: 'hot' },
      { id: 'mm-rail-trending', key: 'trending', badge: 'hot' },
      { id: 'mm-rail-new', key: 'new', badge: 'new' },
      { id: 'mm-rail-top', key: 'topRated', badge: 'top' },
      { id: 'mm-rail-classic', pool: classicPool(), auto: true },
      { id: 'mm-recent-rail', pool: getRecent(), section: 'mm-recent-section', personal: true },
      { id: 'mm-favorites-rail', pool: getFavorites(), section: 'mm-favorites-section', personal: true },
    ];

    railMap.forEach(function (entry) {
      var el = document.getElementById(entry.id);
      if (!el) return;
      var pool = entry.key ? curatedList(entry.key) : entry.pool || [];
      pool = excludeCurrent(pool);
      var curated = entry.key && hasFeatured(entry.key);
      var list;
      if (entry.personal || curated) {
        list = pool;
      } else if (entry.auto) {
        list = pickFromPool(pool, shown, 999);
      } else {
        list = pickFromPool(pool, shown, 999);
      }
      if (entry.section) toggleSection(entry.section, list.length > 0);
      renderRailEl(el, list, entry.badge, { showAll: curated });
    });

    var picksEl = document.getElementById('mm-picks-grid');
    if (picksEl) {
      var picksCurated = hasFeatured('picks');
      var picks = picksCurated
        ? excludeCurrent(picksPool())
        : pickFromPool(picksPool(), shown, 8);
      picksEl.innerHTML = picks.map(pickCard).join('');
    }
  }

  function surprisePool(categoryFilter) {
    var pool = dedupeGames(
      curatedList('trending')
        .concat(curatedList('new'))
        .concat(curatedList('topRated'))
    );
    if (pool.length < 20) pool = dedupeGames(pool.concat(allGames()));

    var excludeIds = {};
    var cur = current();
    if (cur && cur.id) excludeIds[cur.id] = true;
    getRecent()
      .slice(0, 5)
      .forEach(function (g) {
        excludeIds[g.id] = true;
      });

    var filtered = pool.filter(function (g) {
      if (excludeIds[g.id]) return false;
      if (!categoryFilter) return true;
      var cats = g.wgCategories || g.cats || [];
      return cats.some(function (c) {
        return c.toLowerCase() === categoryFilter.toLowerCase();
      });
    });
    if (!filtered.length) {
      filtered = pool.filter(function (g) {
        return !excludeIds[g.id];
      });
    }
    return filtered.length ? filtered : pool;
  }

  function resolveSurpriseHref(url) {
    var href = url || '/';
    var path = window.location.pathname || '';
    if (href.indexOf('/') === 0 && path.indexOf('/category/') !== -1) return '..' + href;
    if (href.indexOf('/') === 0 && path.indexOf('/game/') !== -1) return '..' + href;
    return href;
  }

  function surpriseMe(categoryFilter) {
    var pool = surprisePool(categoryFilter);
    if (!pool.length) return;
    var pick = pool[Math.floor(Math.random() * pool.length)];
    window.location.href = resolveSurpriseHref(pick.url || '/game/' + pick.id + '.html');
  }

  function bindSurprise() {
    document.querySelectorAll('[data-mm-surprise]').forEach(function (el) {
      el.addEventListener('click', function (e) {
        e.preventDefault();
        var cat = el.getAttribute('data-mm-surprise-cat') || '';
        surpriseMe(cat || null);
      });
    });
  }

  function bindLike() {
    var btn = document.getElementById('mm-like-btn');
    if (!btn) return;
    btn.addEventListener('click', toggleFavorite);
    updateLikeButton();
  }

  var railsRaf = 0;

  function scheduleRenderRails() {
    if (railsRaf) cancelAnimationFrame(railsRaf);
    railsRaf = requestAnimationFrame(function () {
      railsRaf = 0;
      renderRails();
    });
  }

  function bindResize() {
    var observeEl =
      document.getElementById('mm-related-rail') ||
      document.getElementById('mm-recent-rail') ||
      document.getElementById('mm-rail-trending') ||
      document.querySelector('.mm-rail-track--grid2');
    if (!observeEl || typeof ResizeObserver === 'undefined') {
      window.addEventListener('resize', scheduleRenderRails);
      return;
    }
    var ro = new ResizeObserver(scheduleRenderRails);
    ro.observe(observeEl);
    // Sync side-rail height once after player paints; avoid observing #mm-player
    // (ResizeObserver during WG ad flow caused layout thrash / black screen on desktop).
    if (isGamePage()) {
      setTimeout(scheduleRenderRails, 400);
      setTimeout(scheduleRenderRails, 1500);
    }
    window.addEventListener('resize', scheduleRenderRails);
  }

  function showSuggestModal() {
    var modal = document.getElementById('mm-suggest-modal');
    var grid = document.getElementById('mm-suggest-grid');
    if (!modal || !grid || !isGamePage()) return;
    if (sessionStorage.getItem(SHOWN_KEY)) return;

    var shown = {};
    var picks = pickFromPool(relatedPool(), shown, 6);
    if (!picks.length) picks = pickFromPool(trendingPool(), shown, 6);
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
    if (!isGamePage()) return;
    var fired = false;
    document.addEventListener('mouseout', function (e) {
      if (fired) return;
      if (!e.relatedTarget && e.clientY <= 0) {
        fired = true;
        showSuggestModal();
      }
    });
  }

  function init() {
    if (!current() && !isHomePage() && !isCatalogPage()) return;
    trackRecent();
    renderRails();
    bindResize();
    bindModal();
    bindExitIntent();
    bindLike();
    bindSurprise();
    window.addEventListener('load', renderRails);
  }

  window.MM_SURPRISE_ME = surpriseMe;

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }
})();
