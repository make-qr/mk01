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
    var classic = window.MM_CLASSIC_GAMES || [];
    if (classic.length) {
      pool = dedupeGames(pool.concat(classic));
    }
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

  function scrubStoredList(key) {
    var list = loadJson(key, []);
    var clean = (list || []).filter(function (g) {
      return g && g.id && !isHiddenGame(g);
    });
    if (clean.length !== (list || []).length) saveJson(key, clean);
    return clean;
  }

  function getRecent() {
    return scrubStoredList(RECENT_KEY);
  }

  function getFavorites() {
    return scrubStoredList(FAV_KEY);
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
    updateLikeCount(liked);
  }

  function hashSeed(str) {
    var h = 2166136261;
    var s = String(str || '');
    for (var i = 0; i < s.length; i++) {
      h ^= s.charCodeAt(i);
      h = Math.imul(h, 16777619);
    }
    return Math.abs(h >>> 0);
  }

  function likeCountKey(id) {
    return 'mm_like_count_' + id;
  }

  function baseLikeCount(id) {
    return 120 + (hashSeed(id) % 4800);
  }

  function readLikeCount(id) {
    if (!id) return 0;
    var stored = loadJson(likeCountKey(id), null);
    if (stored && typeof stored.n === 'number') return stored.n;
    return baseLikeCount(id);
  }

  function writeLikeCount(id, n) {
    saveJson(likeCountKey(id), { n: n });
  }

  function formatCount(n) {
    if (n >= 1000000) return (n / 1000000).toFixed(1).replace(/\.0$/, '') + 'M';
    if (n >= 1000) return (n / 1000).toFixed(1).replace(/\.0$/, '') + 'K';
    return String(n);
  }

  function updateLikeCount(liked) {
    var el = document.getElementById('mm-like-count');
    var cur = current();
    if (!el || !cur || !cur.id) return;
    var n = readLikeCount(cur.id);
    var marked = loadJson(likeCountKey(cur.id) + '_liked', false);
    if (liked && !marked) {
      n += 1;
      writeLikeCount(cur.id, n);
      saveJson(likeCountKey(cur.id) + '_liked', true);
    } else if (!liked && marked) {
      n = Math.max(baseLikeCount(cur.id), n - 1);
      writeLikeCount(cur.id, n);
      saveJson(likeCountKey(cur.id) + '_liked', false);
    }
    el.textContent = formatCount(n);
  }

  function publisherPool() {
    var cur = current();
    if (!cur || !cur.by) return [];
    var by = String(cur.by).toLowerCase();
    return excludeCurrent(
      allGames().filter(function (g) {
        return g && g.by && String(g.by).toLowerCase() === by;
      })
    );
  }

  function deviceHintLabel() {
    var w = window.innerWidth || 0;
    if (w <= 768) return 'Phone';
    if (w <= 1100) return 'Tablet';
    return 'Desktop';
  }

  function fillDeviceHint() {
    var el = document.getElementById('mm-device-hint');
    if (!el) return;
    el.textContent = 'Best on ' + deviceHintLabel();
  }

  function bindDeviceHintResize() {
    if (!document.getElementById('mm-device-hint')) return;
    var t;
    window.addEventListener('resize', function () {
      clearTimeout(t);
      t = setTimeout(fillDeviceHint, 150);
    });
  }

  function controlsBlurbFor(cur) {
    var cats = ((cur && (cur.wgCategories || cur.categories)) || [])
      .join(' ')
      .toLowerCase();
    if (/racing|cars|motorbike|bike/.test(cats)) {
      return 'Steer with A/D or arrow keys. On mobile, drag or use on-screen controls to stay on track.';
    }
    if (/shoot|action|war|military|fps/.test(cats)) {
      return 'Move with WASD or arrows; aim and shoot with the mouse or tap. Fullscreen helps on desktop.';
    }
    if (/puzzle|board|card|mahjong|match/.test(cats)) {
      return 'Tap or click tiles to match and clear the board. Take your time — most levels have no timer pressure.';
    }
    if (/sport|soccer|basket|football/.test(cats)) {
      return 'Use arrows or WASD to move; tap/click or space to shoot or pass. Local multiplayer often shares one keyboard.';
    }
    if (/horror|adventure|rpg|platform/.test(cats)) {
      return 'Move with arrows or WASD. Interact or jump with click/tap or space. Sound on for the full atmosphere.';
    }
    if (/quiz|trivia|educational/.test(cats)) {
      return 'Read the question, then tap the answer. Play again to beat your best streak.';
    }
    return 'Click or tap Play now to load the game. Use fullscreen on desktop; touch controls work on phone and tablet.';
  }

  function fillControlsBlurb() {
    var el = document.getElementById('mm-controls-blurb');
    var cur = current();
    if (!el || !cur) return;
    el.innerHTML =
      '<h3>Controls</h3><p>' + esc(controlsBlurbFor(cur)) + '</p>';
  }

  function fillGameFacts() {
    var el = document.getElementById('mm-game-facts');
    var cur = current();
    if (!el || !cur) return;
    var genre =
      (cur.wgCategories && cur.wgCategories[0]) ||
      (cur.categories && cur.categories[0]) ||
      'Browser game';
    var parts = [genre, 'Free to play', 'No download'];
    if (cur.by) parts.push('by ' + cur.by);
    el.textContent = parts.join(' · ');
  }

  function fillSelectiveFaq() {
    var desc = document.querySelector('.game-description');
    var cur = current();
    if (!desc || !cur || !cur.id) return;
    if (document.getElementById('mm-game-faq')) return;
    var featured = window.MM_FEATURED || {};
    var topIds = []
      .concat(featured.trending || [])
      .concat(featured.picks || [])
      .concat(featured.topRated || []);
    var isTop = topIds.indexOf(cur.id) !== -1;
    if (!isTop) return;
    var box = document.createElement('div');
    box.className = 'mm-game-faq';
    box.id = 'mm-game-faq';
    box.innerHTML =
      '<h3>FAQ</h3>' +
      '<details open><summary>Is ' +
      esc(cur.name) +
      ' free?</summary><p>Yes — play instantly in your browser on MonkeyMart.one with no download or account required.</p></details>' +
      '<details><summary>Does it work on mobile?</summary><p>Yes on modern phones and tablets. Use Play now, then rotate to landscape if the game feels tight.</p></details>' +
      '<details><summary>Why is there a short wait?</summary><p>A brief ad or prepare step may run before the game starts. If the screen stays black, use Reload game.</p></details>';
    desc.appendChild(box);
  }

  function enhanceGamePageCopy() {
    if (!isGamePage()) return;
    fillDeviceHint();
    fillGameFacts();
    fillControlsBlurb();
    fillSelectiveFaq();
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
    var size = extra.size || g.size || (extra.big || g.big ? 'xl' : '');
    var item = {
      id: g.id,
      name: g.name,
      by: g.by,
      image: g.image,
      url: g.url || '/game/' + g.id + '.html',
      c: g.c,
      pip: pip || g.pip || '',
      cats: g.wgCategories || g.cats || g.categories || [],
      preview: g.preview || '',
      size: size,
      big: size === 'xl',
    };
    // #region agent log
    if (/crazy-racer|2048-snake/i.test(item.id)) {
      fetch('http://127.0.0.1:7313/ingest/fc4ed4b3-6b55-49bf-b6a0-f56cb25e6690',{method:'POST',headers:{'Content-Type':'application/json','X-Debug-Session-Id':'d87627'},body:JSON.stringify({sessionId:'d87627',runId:'size-wide',hypothesisId:'H1',location:'mm-engage.js:gridItemFromGame',message:'Sized grid item built',data:{id:item.id,size:item.size,big:item.big},timestamp:Date.now()})}).catch(function(){});
    }
    // #endregion
    return item;
  }

  function featuredSizeMap(key) {
    var out = {};
    var sizes = ((window.MM_FEATURED_SIZE || {})[key]) || {};
    Object.keys(sizes).forEach(function (id) {
      var s = sizes[id];
      if (id && (s === 'xl' || s === 'wide')) out[id] = s;
    });
    // Back-compat: MM_FEATURED_BIG arrays → xl
    var bigList = ((window.MM_FEATURED_BIG || {})[key]) || [];
    for (var i = 0; i < bigList.length; i++) {
      if (bigList[i] && !out[bigList[i]]) out[bigList[i]] = 'xl';
    }
    return out;
  }

  function tileSizeOf(g) {
    if (!g) return '';
    if (g.size === 'xl' || g.size === 'wide') return g.size;
    if (g.big) return 'xl';
    return '';
  }

  function tileCellCost(g) {
    var s = tileSizeOf(g);
    if (s === 'xl') return 4;
    if (s === 'wide') return 2;
    return 1;
  }

  function featuredGridList(key, pip) {
    if (!hasFeatured(key)) return null;
    var sizeMap = featuredSizeMap(key);
    var out = [];
    featuredIds(key).forEach(function (id) {
      var g = gameById(id);
      var size = sizeMap[id] || '';
      var item = gridItemFromGame(g, pip, { size: size, big: size === 'xl' });
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
      var needle = String(ac[i] || '').toLowerCase();
      if (!needle) continue;
      for (var j = 0; j < bc.length; j++) {
        if (String(bc[j] || '').toLowerCase() === needle) return true;
      }
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
    // Poki-style game pages keep Related + More-by-publisher only (no New/Top inject).
    return;
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
    var size = tileSizeOf(g);
    var sizeClass = size === 'xl' ? ' mm-card--big' : size === 'wide' ? ' mm-card--wide' : '';
    var style = g.c ? '--c:' + g.c : '';
    // #region agent log
    if (g && /crazy-racer|2048-snake/i.test(String(g.id || ''))) {
      fetch('http://127.0.0.1:7313/ingest/fc4ed4b3-6b55-49bf-b6a0-f56cb25e6690',{method:'POST',headers:{'Content-Type':'application/json','X-Debug-Session-Id':'d87627'},body:JSON.stringify({sessionId:'d87627',runId:'size-wide',hypothesisId:'H1',location:'mm-engage.js:railCard',message:'Sized card flags',data:{id:g.id,size:size,sizeClass:sizeClass},timestamp:Date.now()})}).catch(function(){});
    }
    // #endregion

    if (overlay) {
      return (
        '<a class="mm-card mm-card--overlay' +
        sizeClass +
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
      '<a class="mm-card' +
      sizeClass +
      '" href="' +
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
    var gap = gridGap();
    var cellBudget = cols * GRID_ROWS;
    // Home rails stay 2 rows even when curated; big tiles cost 4 cells.
    var enforceBudget = !opts.showAll || isHomePage();
    var list = [];
    var cellsUsed = 0;
    (items || []).forEach(function (g) {
      if (!g) return;
      var cost = tileCellCost(g);
      if (enforceBudget && cellsUsed + cost > cellBudget) return;
      list.push(g);
      cellsUsed += cost;
    });
    el.style.gridTemplateColumns = 'repeat(' + cols + ', 1fr)';
    var cellW = Math.max(1, (el.clientWidth - gap * (cols - 1)) / cols);
    el.style.gridAutoRows = Math.round(cellW) + 'px';
    el.style.gridTemplateRows = '';
    // #region agent log
    if (el.id === 'mm-rail-trending' || el.id === 'mm-rail-new') {
      var hero = list.filter(function (g) { return tileSizeOf(g); }).map(function (g) {
        return { id: g.id, size: tileSizeOf(g), cost: tileCellCost(g) };
      });
      fetch('http://127.0.0.1:7313/ingest/fc4ed4b3-6b55-49bf-b6a0-f56cb25e6690',{method:'POST',headers:{'Content-Type':'application/json','X-Debug-Session-Id':'d87627'},body:JSON.stringify({sessionId:'d87627',runId:'size-wide',hypothesisId:'H3',location:'mm-engage.js:renderTwoRowGrid',message:'Rail grid budget',data:{elId:el.id,cols:cols,cellBudget:cellBudget,itemCount:list.length,cellsUsed:cellsUsed,cellW:Math.round(cellW),heroes:hero,first:list[0]&&list[0].name},timestamp:Date.now()})}).catch(function(){});
    }
    // #endregion
    el.innerHTML = list
      .map(function (g) {
        return railCard(g, { overlay: true, badge: badge });
      })
      .join('');
    // #region agent log
    if (el.id === 'mm-rail-trending' || el.id === 'mm-rail-new') {
      var sized = el.querySelector('.mm-card--big, .mm-card--wide');
      var normal = el.querySelector('.mm-card:not(.mm-card--big):not(.mm-card--wide)');
      var sr = sized ? sized.getBoundingClientRect() : null;
      var nr = normal ? normal.getBoundingClientRect() : null;
      fetch('http://127.0.0.1:7313/ingest/fc4ed4b3-6b55-49bf-b6a0-f56cb25e6690',{method:'POST',headers:{'Content-Type':'application/json','X-Debug-Session-Id':'d87627'},body:JSON.stringify({sessionId:'d87627',runId:'size-wide',hypothesisId:'H2',location:'mm-engage.js:renderTwoRowGrid:after',message:'Rail sized DOM',data:{elId:el.id,sizedHref:sized?sized.getAttribute('href'):null,sizedClass:sized?sized.className:null,gridColumn:sized?getComputedStyle(sized).gridColumn:null,gridRow:sized?getComputedStyle(sized).gridRow:null,sizedW:sr?Math.round(sr.width):null,sizedH:sr?Math.round(sr.height):null,normW:nr?Math.round(nr.width):null,normH:nr?Math.round(nr.height):null,areaRatio:sr&&nr?(Math.round((sr.width*sr.height)/(nr.width*nr.height)*10)/10):null,cardCount:el.querySelectorAll('.mm-card').length},timestamp:Date.now()})}).catch(function(){});
    }
    // #endregion
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
    var pubPool = isGamePage() ? publisherPool() : [];
    var railMap = [
      { id: 'mm-related-rail', pool: relatedPool(), auto: true },
      {
        id: 'mm-publisher-rail',
        pool: pubPool,
        section: 'mm-publisher-section',
        auto: true,
      },
      { id: 'mm-recent-rail', pool: getRecent(), section: 'mm-recent-section', personal: true },
      { id: 'mm-favorites-rail', pool: getFavorites(), section: 'mm-favorites-section', personal: true },
    ];

    if (isGamePage()) {
      // Classic/ubg98 templates use this id instead of mm-related-rail
      railMap.splice(1, 0, {
        id: 'mm-rail-classic',
        pool: relatedPool(),
        auto: true,
      });
    } else {
      // Home / catalog discovery rails
      railMap = railMap.concat([
        { id: 'mm-trending-rail', key: 'trending', badge: 'hot' },
        { id: 'mm-rail-trending', key: 'trending', badge: 'hot' },
        { id: 'mm-rail-new', key: 'new', badge: 'new' },
        { id: 'mm-rail-top', key: 'topRated', badge: 'top' },
        { id: 'mm-rail-classic', pool: classicPool(), auto: true },
      ]);
    }

    if (isGamePage() && pubPool.length) {
      var heading = document.getElementById('mm-publisher-heading');
      var cur = current();
      if (heading && cur && cur.by) {
        heading.innerHTML =
          '<i class="fas fa-user"></i> More by ' + esc(cur.by);
      }
    }

    railMap.forEach(function (entry) {
      var el = document.getElementById(entry.id);
      if (!el) return;
      var pool = entry.key ? curatedList(entry.key) : entry.pool || [];
      pool = excludeCurrent(pool);
      var curated = entry.key && hasFeatured(entry.key);
      var list;
      // Publisher rail is intentional overlap with related — don't dedupe via shown.
      var useShown = entry.id === 'mm-publisher-rail' ? {} : shown;
      if (entry.personal || curated) {
        list = pool;
      } else if (entry.auto) {
        list = pickFromPool(pool, useShown, 999);
      } else {
        list = pickFromPool(pool, useShown, 999);
      }
      if (entry.section) toggleSection(entry.section, list.length > 0);
      renderRailEl(el, list, entry.badge, { showAll: curated || entry.id === 'mm-publisher-rail' });
    });

    var picksEl = document.getElementById('mm-picks-grid');
    if (picksEl && !isGamePage()) {
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
    // Drop deleted/hidden ids from older visits so they never reappear in rails.
    scrubStoredList(RECENT_KEY);
    scrubStoredList(FAV_KEY);
    trackRecent();
    enhanceGamePageCopy();
    bindDeviceHintResize();
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
