(function () {
  'use strict';

  var API = '';
  var catalog = [];
  var classicCatalog = [];
  var catalogById = {};
  var catalogFilter = '';
  var catalogSource = 'all';
  var catalogLimit = 80;
  var CATALOG_PAGE = 80;
  var catalogSearchTimer = null;
  var hiddenIds = {};
  var featured = { trending: [], new: [], topRated: [], picks: [] };
  var featuredSizes = { trending: {}, new: {}, topRated: {}, picks: {} };
  var activeKey = 'trending';
  var activeMode = 'slots';
  var dragId = null;
  var toastTimer = null;
  var wgSearchTimer = null;
  var pendingSearchTimer = null;
  var pendingGames = [];
  var pendingFiltered = [];
  var pendingSelected = {};
  var reviewFilter = 'pending';
  var lastScanData = null;

  var META = {
    trending: {
      title: 'Trending now',
      desc: 'Homepage HOT. Chọn Size cạnh mỗi game: 1× / 2× ngang / 4× lớn (2×2).',
    },
    new: {
      title: 'New games',
      desc: 'Homepage NEW. Size dropdown để làm tile to hơn trên homepage.',
    },
    topRated: {
      title: 'Top rated',
      desc: 'Homepage TOP — pin + Size nếu muốn nổi bật.',
    },
    picks: {
      title: 'Popular picks',
      desc: 'Side rail Casual picks (trái). Size áp dụng khi rail là grid 2 hàng.',
    },
  };

  function $(sel) {
    return document.querySelector(sel);
  }

  function toast(msg, ok) {
    var el = $('#adm-toast');
    if (!el) return;
    el.textContent = msg;
    el.hidden = false;
    el.className = 'adm-toast ' + (ok ? 'is-ok' : 'is-err');
    clearTimeout(toastTimer);
    toastTimer = setTimeout(function () {
      el.hidden = true;
    }, 4500);
  }

  function setBusy(busy) {
    ['#btn-save', '#btn-sync', '#btn-import', '#btn-wg-scan', '#btn-wg-import-batch'].forEach(function (sel) {
      var btn = $(sel);
      if (btn) btn.disabled = busy;
    });
  }

  function api(path, opts) {
    opts = opts || {};
    return fetch(API + path, opts).then(function (res) {
      return res
        .json()
        .catch(function () {
          throw new Error(res.status + ' ' + path + ' (không phải JSON — sai cổng hoặc server chưa chạy)');
        })
        .then(function (data) {
          if (!res.ok || data.ok === false) {
            throw new Error(data.error || res.status + ' ' + path);
          }
          return data;
        });
    });
  }

  function updateStatus(text) {
    var el = $('#adm-status');
    if (el) el.textContent = text;
  }

  function updateCounts() {
    Object.keys(featured).forEach(function (key) {
      var el = document.querySelector('[data-count="' + key + '"]');
      if (el) el.textContent = String((featured[key] || []).length);
    });
  }

  function inActiveList(id) {
    return (featured[activeKey] || []).indexOf(id) !== -1;
  }

  function rebuildCatalogIndex() {
    catalogById = {};
    catalog.concat(classicCatalog).forEach(function (g) {
      if (g && g.id) catalogById[g.id] = g;
    });
  }

  function activeCatalogPool() {
    if (catalogSource === 'wg') return catalog;
    if (catalogSource === 'classic') return classicCatalog;
    if (catalogSource === 'hidden') {
      return catalog.concat(classicCatalog).filter(function (g) {
        return hiddenIds[g.id] || g.hidden;
      });
    }
    // all: WG first, then classic not already in WG
    var seen = {};
    var out = [];
    catalog.forEach(function (g) {
      seen[g.id] = true;
      out.push(g);
    });
    classicCatalog.forEach(function (g) {
      if (!seen[g.id]) out.push(g);
    });
    return out;
  }

  function filteredCatalog(filter) {
    filter = (filter || '').trim().toLowerCase();
    var list = activeCatalogPool();
    if (catalogSource !== 'hidden') {
      list = list.filter(function (g) {
        return !(hiddenIds[g.id] || g.hidden);
      });
    }
    if (!filter) return list;
    return list.filter(function (g) {
      var hay = (g.name + ' ' + g.id + ' ' + (g.by || '') + ' ' + (g.cats || []).join(' ') + ' ' + (g.source || '')).toLowerCase();
      return hay.indexOf(filter) !== -1;
    });
  }

  function renderCatalog(filter, opts) {
    var box = $('#adm-catalog');
    if (!box) return;
    opts = opts || {};
    if (typeof filter === 'string') catalogFilter = filter;
    if (opts.reset) catalogLimit = CATALOG_PAGE;

    var list = filteredCatalog(catalogFilter);
    if (!list.length) {
      box.innerHTML = '<div class="adm-empty">Không tìm thấy game.</div>';
      return;
    }

    var shown = list.slice(0, catalogLimit);
    var more = Math.max(0, list.length - shown.length);
    var html = shown
      .map(function (g) {
        var thumb = g.image ? "background-image:url('" + g.image.replace(/'/g, '%27') + "')" : '';
        var inList = inActiveList(g.id) ? ' is-in-list' : '';
        var isHidden = !!(hiddenIds[g.id] || g.hidden);
        var src = g.source === 'classic' ? 'classic' : 'wg';
        var hideBtn = isHidden
          ? '<button type="button" class="adm-cat-hide" data-unhide="' + g.id + '" title="Unhide">👁</button>'
          : '<button type="button" class="adm-cat-hide" data-hide="' + g.id + '" title="Hide game">🚫</button>';
        return (
          '<div class="adm-cat-item' +
          inList +
          (isHidden ? ' is-hidden-game' : '') +
          '" data-id="' +
          g.id +
          '" title="Thêm vào ' +
          META[activeKey].title +
          '">' +
          '<div class="adm-cat-thumb" style="' +
          thumb +
          '"></div>' +
          '<div class="adm-cat-meta"><strong>' +
          esc(g.name) +
          '</strong><span>' +
          esc(g.by || g.id) +
          ' · ' +
          src +
          '</span></div>' +
          hideBtn +
          '<i class="fas fa-plus adm-cat-add" style="color:var(--adm-accent);opacity:0.8"></i>' +
          '</div>'
        );
      })
      .join('');

    html =
      '<div class="adm-catalog-meta">Hiển thị <strong>' +
      shown.length +
      '</strong> / ' +
      list.length +
      (catalogFilter ? ' (đã lọc)' : '') +
      '</div>' +
      html;

    if (more > 0) {
      html +=
        '<button type="button" class="adm-btn adm-btn--ghost adm-btn--sm adm-catalog-more" id="btn-catalog-more">' +
        '<i class="fas fa-chevron-down"></i> Xem thêm ' +
        Math.min(more, CATALOG_PAGE) +
        ' game (' +
        more +
        ' còn lại)</button>';
    }
    box.innerHTML = html;
  }

  function getSize(key, id) {
    return ((featuredSizes[key] || {})[id]) || '';
  }

  function setSize(key, id, size) {
    if (!featuredSizes[key]) featuredSizes[key] = {};
    if (!size) delete featuredSizes[key][id];
    else featuredSizes[key][id] = size;
  }

  function sizeSelectHtml(id) {
    var cur = getSize(activeKey, id);
    return (
      '<label class="adm-slot-size-wrap" title="Kích thước tile trên homepage">' +
      '<span class="adm-slot-size-label">Size</span>' +
      '<select class="adm-slot-size" data-size-id="' +
      esc(id) +
      '">' +
      '<option value=""' +
      (!cur ? ' selected' : '') +
      '>1× thường</option>' +
      '<option value="wide"' +
      (cur === 'wide' ? ' selected' : '') +
      '>2× ngang</option>' +
      '<option value="xl"' +
      (cur === 'xl' ? ' selected' : '') +
      '>4× lớn (2×2)</option>' +
      '</select></label>'
    );
  }

  function renderSlots() {
    var ul = $('#adm-slots');
    if (!ul) return;
    ul.dataset.key = activeKey;
    var ids = featured[activeKey] || [];
    if (!ids.length) {
      ul.innerHTML =
        '<li class="adm-empty">Chưa chọn game — để trống = auto-fill từ catalog. Thêm game = chỉ hiện đúng list anh chọn. Dùng <strong>Size</strong> để làm tile to hơn trên homepage.</li>';
      updateCounts();
      renderCatalog(catalogFilter);
      return;
    }
    ul.innerHTML = ids
      .map(function (id, i) {
        var g = catalogById[id];
        var size = getSize(activeKey, id);
        var sizeClass = size ? ' is-size-' + size : '';
        if (!g) {
          return (
            '<li class="adm-slot' +
            sizeClass +
            '" draggable="true" data-id="' +
            id +
            '">' +
            '<span class="adm-slot-handle"><i class="fas fa-grip-vertical"></i></span>' +
            '<span class="adm-slot-num">' +
            (i + 1) +
            '</span>' +
            '<div class="adm-slot-info"><strong>⚠ ID không tồn tại</strong><code>' +
            esc(id) +
            '</code></div>' +
            sizeSelectHtml(id) +
            '<button type="button" class="adm-slot-remove" data-remove="' +
            id +
            '"><i class="fas fa-times"></i></button>' +
            '</li>'
          );
        }
        var thumb = g.image ? "background-image:url('" + g.image.replace(/'/g, '%27') + "')" : '';
        return (
          '<li class="adm-slot' +
          sizeClass +
          '" draggable="true" data-id="' +
          g.id +
          '">' +
          '<span class="adm-slot-handle"><i class="fas fa-grip-vertical"></i></span>' +
          '<span class="adm-slot-num">' +
          (i + 1) +
          '</span>' +
          '<div class="adm-slot-thumb" style="' +
          thumb +
          '"></div>' +
          '<div class="adm-slot-info"><strong>' +
          esc(g.name) +
          '</strong><code>' +
          esc(g.id) +
          '</code></div>' +
          sizeSelectHtml(g.id) +
          '<button type="button" class="adm-slot-remove" data-remove="' +
          g.id +
          '"><i class="fas fa-times"></i></button>' +
          '</li>'
        );
      })
      .join('');
    updateCounts();
    renderCatalog(catalogFilter);
  }

  function esc(s) {
    var d = document.createElement('div');
    d.textContent = s || '';
    return d.innerHTML;
  }

  function setActiveTab(key) {
    activeKey = key;
    document.querySelectorAll('.adm-tab').forEach(function (tab) {
      tab.classList.toggle('is-active', tab.dataset.key === key);
    });
    var meta = META[key];
    $('#adm-panel-title').textContent = meta.title;
    $('#adm-panel-desc').textContent = meta.desc;
    renderSlots();
  }

  function addToList(id) {
    if (!id || !catalogById[id]) {
      toast('Game không có trong catalog', false);
      return;
    }
    var list = featured[activeKey] || [];
    if (list.indexOf(id) !== -1) {
      toast('Game đã có trong list này', false);
      return;
    }
    featured[activeKey] = list.concat(id);
    renderSlots();
    toast('Đã thêm: ' + (catalogById[id].name || id), true);
  }

  function removeFromList(id) {
    featured[activeKey] = (featured[activeKey] || []).filter(function (x) {
      return x !== id;
    });
    setSize(activeKey, id, '');
    renderSlots();
  }

  function reorderList(fromId, toId) {
    var list = (featured[activeKey] || []).slice();
    var fromIdx = list.indexOf(fromId);
    var toIdx = list.indexOf(toId);
    if (fromIdx === -1 || toIdx === -1 || fromIdx === toIdx) return;
    list.splice(fromIdx, 1);
    list.splice(toIdx, 0, fromId);
    featured[activeKey] = list;
    renderSlots();
  }

  function bindDragDrop() {
    var ul = $('#adm-slots');
    if (!ul) return;

    ul.addEventListener('dragstart', function (e) {
      var li = e.target.closest('.adm-slot');
      if (!li) return;
      dragId = li.dataset.id;
      li.classList.add('is-dragging');
      e.dataTransfer.effectAllowed = 'move';
    });

    ul.addEventListener('dragend', function (e) {
      var li = e.target.closest('.adm-slot');
      if (li) li.classList.remove('is-dragging');
      ul.classList.remove('is-drag-over');
      dragId = null;
    });

    ul.addEventListener('dragover', function (e) {
      e.preventDefault();
      ul.classList.add('is-drag-over');
    });

    ul.addEventListener('dragleave', function () {
      ul.classList.remove('is-drag-over');
    });

    ul.addEventListener('drop', function (e) {
      e.preventDefault();
      ul.classList.remove('is-drag-over');
      var target = e.target.closest('.adm-slot');
      if (!target || !dragId) return;
      reorderList(dragId, target.dataset.id);
    });
  }

  function setMode(mode) {
    activeMode = mode;
    document.querySelectorAll('.adm-mode').forEach(function (btn) {
      btn.classList.toggle('is-active', btn.dataset.mode === mode);
    });
    $('#adm-view-slots').hidden = mode !== 'slots';
    $('#adm-view-add').hidden = mode !== 'add';
    $('#adm-view-review').hidden = mode !== 'review';
    var blogView = $('#adm-view-blog');
    if (blogView) blogView.hidden = mode !== 'blog';
    if (mode === 'add') loadWgSearch($('#adm-wg-search').value);
    if (mode === 'review' && !pendingGames.length) loadPendingList('');
  }

  function renderWgResults(games) {
    var box = $('#adm-wg-results');
    if (!box) return;
    if (!games.length) {
      box.innerHTML =
        '<div class="adm-empty">WG catalog trống hoặc không tìm thấy — dùng form thủ công bên dưới (cần WG embed URL/hash).</div>';
      return;
    }
    box.innerHTML = games
      .map(function (g) {
        var inCls = g.inProject ? ' is-in' : '';
        var badge = g.inProject
          ? '<span class="adm-wg-badge adm-wg-badge--in">Đã có</span>'
          : '<button type="button" class="adm-btn adm-btn--primary adm-btn--sm" data-add-slug="' +
            esc(g.slug) +
            '"><i class="fas fa-plus"></i> Thêm</button>';
        return (
          '<div class="adm-wg-row' +
          inCls +
          '">' +
          '<div class="adm-wg-row-meta"><strong>' +
          esc(g.name) +
          '</strong><span>' +
          esc(g.by || g.slug) +
          (g.cats && g.cats.length ? ' · ' + esc(g.cats.slice(0, 2).join(', ')) : '') +
          '</span></div>' +
          badge +
          '</div>'
        );
      })
      .join('');
  }

  function loadWgSearch(q) {
    api('/api/admin/wg-search?q=' + encodeURIComponent(q || ''))
      .then(function (data) {
        renderWgResults(data.games || []);
      })
      .catch(function (err) {
        toast(err.message, false);
      });
  }

  function addGameToProject(slug) {
    setBusy(true);
    api('/api/admin/add-game', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ slug: slug }),
    })
      .then(function (data) {
        toast('Đã thêm: ' + data.game.name, true);
        return loadAll().then(function () {
          loadWgSearch($('#adm-wg-search').value);
        });
      })
      .catch(function (err) {
        toast(err.message, false);
      })
      .finally(function () {
        setBusy(false);
      });
  }

  function updatePendingStats(data) {
    var el = $('#adm-wg-stats');
    if (!el || !data) return;
    el.textContent =
      'Clone: ' +
      (data.htmlTotal || '?') +
      ' HTML · WG embed: ' +
      (data.wgTotal || 0) +
      ' · Dự án: ' +
      data.localTotal +
      ' · Chưa import: ' +
      data.pendingCount;
    var fp = $('#adm-filter-pending');
    var fi = $('#adm-filter-in');
    var fa = $('#adm-filter-all');
    if (fp) fp.textContent = String(data.pendingCount || 0);
    if (fi) fi.textContent = String(data.inProjectCount || data.inProject || 0);
    if (fa) fa.textContent = String(data.wgTotal || 0);
  }

  function renderScanSummary(data) {
    var box = $('#adm-scan-summary');
    var filters = $('#adm-review-filters');
    if (!box || !data) return;
    lastScanData = data;
    box.hidden = false;
    if (filters) filters.hidden = false;

    var pending = data.pendingCount || 0;
    var icon = pending ? 'fa-circle-info' : 'fa-circle-check';
    var tone = pending ? 'is-warn' : 'is-ok';

    box.className = 'adm-scan-summary ' + tone;
    box.innerHTML =
      '<div class="adm-scan-summary__head"><i class="fas ' +
      icon +
      '"></i><strong>' +
      (pending
        ? 'Có ' + pending + ' game mới — tick rồi Import đã chọn'
        : 'Quét xong — không có game mới') +
      '</strong></div>' +
      '<ul class="adm-scan-summary__list">' +
      '<li><b>' +
      (data.htmlTotal || 0) +
      '</b> trang HTML trong clone WG</li>' +
      '<li><b>' +
      (data.embedPages || data.wgTotal || 0) +
      '</b> trang có WG embed (import được)</li>' +
      '<li><b>' +
      (data.inProject || data.inProjectCount || 0) +
      '</b> đã có trong dự án · <b>' +
      pending +
      '</b> chưa import</li>' +
      (data.noEmbedPages
        ? '<li><b>' +
          data.noEmbedPages +
          '</b> trang không có embed (' +
          (data.mmNativePages || 0) +
          ' game native mm-* — không import tự động)</li>'
        : '') +
      (data.git && data.git !== 'skipped'
        ? '<li>Git: <code>' + esc(String(data.git).slice(-120)) + '</code></li>'
        : '') +
      '</ul>' +
      (pending
        ? ''
        : '<p class="adm-scan-summary__hint">Muốn thấy game mới: tick <strong>Git pull clone</strong> rồi quét lại. Hoặc chuyển tab <strong>Đã có / Tất cả WG</strong> để xem catalog.</p>');
  }

  function updatePendingSelectionUi() {
    var count = Object.keys(pendingSelected).length;
    var selEl = $('#adm-pending-selected');
    var btn = $('#btn-wg-import-batch');
    if (selEl) selEl.textContent = String(count);
    if (btn) btn.disabled = count === 0;
    var allBox = $('#adm-pending-all');
    if (allBox && pendingFiltered.length) {
      allBox.checked = pendingFiltered.every(function (g) {
        return pendingSelected[g.slug];
      });
      allBox.indeterminate =
        count > 0 &&
        !pendingFiltered.every(function (g) {
          return pendingSelected[g.slug];
        });
    }
  }

  function renderPendingList(games, data) {
    pendingFiltered = games || [];
    var box = $('#adm-pending-list');
    if (!box) return;
    var importBar = $('.adm-review-actions');
    var isPendingMode = reviewFilter === 'pending';

    if (importBar) importBar.style.display = isPendingMode ? '' : 'none';

    if (!pendingFiltered.length) {
      var msg =
        reviewFilter === 'pending'
          ? '<div class="adm-empty adm-empty--scan">' +
            '<i class="fas fa-check-circle"></i>' +
            '<strong>0 game mới</strong>' +
            '<p>Tất cả <b>' +
            (data && data.wgTotal ? data.wgTotal : '500') +
            '</b> game WG có embed đã nằm trong dự án (' +
            (data && data.localTotal ? data.localTotal : '501') +
            ' game).</p>' +
            '<p>Bấm tab <b>Đã có</b> hoặc <b>Tất cả WG</b> phía trên để xem catalog. Game mới chỉ xuất hiện sau khi WG clone được cập nhật (git pull).</p>' +
            '</div>'
          : '<div class="adm-empty">Không tìm thấy game với bộ lọc hiện tại.</div>';
      box.innerHTML = msg;
      updatePendingSelectionUi();
      return;
    }

    if (!isPendingMode) {
      box.innerHTML = pendingFiltered
        .map(function (g) {
          var badge = g.inProject
            ? '<span class="adm-wg-badge adm-wg-badge--in">Đã có</span>'
            : '<span class="adm-wg-badge adm-wg-badge--new">Chưa import</span>';
          return (
            '<div class="adm-wg-row is-in">' +
            '<div class="adm-wg-row-meta"><strong>' +
            esc(g.name) +
            '</strong><span>' +
            esc(g.by || g.slug) +
            (g.cats && g.cats.length ? ' · ' + esc(g.cats.slice(0, 2).join(', ')) : '') +
            '</span></div>' +
            badge +
            '</div>'
          );
        })
        .join('');
      updatePendingSelectionUi();
      return;
    }

    box.innerHTML = pendingFiltered
      .map(function (g) {
        var checked = pendingSelected[g.slug] ? ' checked' : '';
        return (
          '<label class="adm-wg-row adm-wg-row--check">' +
          '<input type="checkbox" class="adm-pending-cb" data-slug="' +
          esc(g.slug) +
          '"' +
          checked +
          ' />' +
          '<div class="adm-wg-row-meta"><strong>' +
          esc(g.name) +
          '</strong><span>' +
          esc(g.by || g.slug) +
          (g.cats && g.cats.length ? ' · ' + esc(g.cats.slice(0, 2).join(', ')) : '') +
          '</span></div>' +
          '</label>'
        );
      })
      .join('');
    updatePendingSelectionUi();
  }

  function loadPendingList(q) {
    var query = q != null ? q : ($('#adm-pending-search') && $('#adm-pending-search').value) || '';
    return api(
      '/api/admin/wg-pending?q=' +
        encodeURIComponent(query) +
        '&filter=' +
        encodeURIComponent(reviewFilter)
    )
      .then(function (data) {
        pendingGames = data.games || [];
        updatePendingStats(data);
        renderPendingList(pendingGames, data);
      })
      .catch(function (err) {
        toast(err.message, false);
      });
  }

  function setReviewFilter(filter) {
    reviewFilter = filter || 'pending';
    document.querySelectorAll('.adm-filter').forEach(function (btn) {
      btn.classList.toggle('is-active', btn.dataset.filter === reviewFilter);
    });
    pendingSelected = {};
    return loadPendingList($('#adm-pending-search') && $('#adm-pending-search').value);
  }

  function scanWgCatalog() {
    setBusy(true);
    toast('Đang quét WG clone…', true);
    api('/api/admin/wg-scan', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ pull: $('#adm-wg-pull') && $('#adm-wg-pull').checked }),
    })
      .then(function (data) {
        pendingSelected = {};
        updatePendingStats(data);
        renderScanSummary(data);
        if (!data.pendingCount) {
          reviewFilter = 'in';
          document.querySelectorAll('.adm-filter').forEach(function (btn) {
            btn.classList.toggle('is-active', btn.dataset.filter === 'in');
          });
          return loadPendingList('').then(function () {
            toast(
              'Quét xong — 0 game mới (đã sync ' + (data.inProject || data.wgTotal) + ' game WG)',
              true
            );
          });
        }
        reviewFilter = 'pending';
        document.querySelectorAll('.adm-filter').forEach(function (btn) {
          btn.classList.toggle('is-active', btn.dataset.filter === 'pending');
        });
        pendingGames = data.pending || [];
        renderPendingList(pendingGames, data);
        toast(
          'Quét xong — ' + data.pendingCount + ' game mới · ' + data.inProject + ' đã có',
          true
        );
      })
      .catch(function (err) {
        toast(err.message, false);
      })
      .finally(function () {
        setBusy(false);
      });
  }

  function importPendingBatch() {
    var slugs = Object.keys(pendingSelected);
    if (!slugs.length) return;
    if (!confirm('Import ' + slugs.length + ' game vào dự án?')) return;
    setBusy(true);
    toast('Đang import ' + slugs.length + ' game…', true);
    api('/api/admin/wg-import-batch', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ slugs: slugs }),
    })
      .then(function (data) {
        var ok = (data.imported || []).length;
        var bad = (data.errors || []).length;
        pendingSelected = {};
        toast('Import xong: ' + ok + ' thành công' + (bad ? ', ' + bad + ' lỗi' : ''), ok > 0);
        return loadAll().then(function () {
          return scanWgCatalog();
        });
      })
      .catch(function (err) {
        toast(err.message, false);
      })
      .finally(function () {
        setBusy(false);
      });
  }

  function bindEvents() {
    document.querySelectorAll('.adm-mode').forEach(function (btn) {
      btn.addEventListener('click', function () {
        setMode(btn.dataset.mode);
      });
    });

    document.querySelectorAll('.adm-tab').forEach(function (tab) {
      tab.addEventListener('click', function () {
        setActiveTab(tab.dataset.key);
      });
    });

    $('#adm-search').addEventListener('input', function (e) {
      clearTimeout(catalogSearchTimer);
      var q = e.target.value;
      catalogSearchTimer = setTimeout(function () {
        renderCatalog(q, { reset: true });
      }, 180);
    });

    $('#adm-wg-search').addEventListener('input', function (e) {
      clearTimeout(wgSearchTimer);
      var q = e.target.value;
      wgSearchTimer = setTimeout(function () {
        loadWgSearch(q);
      }, 280);
    });

    $('#adm-wg-results').addEventListener('click', function (e) {
      var btn = e.target.closest('[data-add-slug]');
      if (!btn) return;
      addGameToProject(btn.dataset.addSlug);
    });

    $('#btn-wg-scan').addEventListener('click', scanWgCatalog);

    document.querySelectorAll('.adm-filter').forEach(function (btn) {
      btn.addEventListener('click', function () {
        setReviewFilter(btn.dataset.filter);
      });
    });

    $('#adm-pending-search').addEventListener('input', function (e) {
      clearTimeout(pendingSearchTimer);
      var q = e.target.value;
      pendingSearchTimer = setTimeout(function () {
        loadPendingList(q);
      }, 280);
    });

    $('#adm-pending-all').addEventListener('change', function (e) {
      if (e.target.checked) {
        pendingFiltered.forEach(function (g) {
          pendingSelected[g.slug] = true;
        });
      } else {
        pendingFiltered.forEach(function (g) {
          delete pendingSelected[g.slug];
        });
      }
      renderPendingList(pendingFiltered);
    });

    $('#adm-pending-list').addEventListener('change', function (e) {
      var cb = e.target.closest('.adm-pending-cb');
      if (!cb) return;
      if (cb.checked) pendingSelected[cb.dataset.slug] = true;
      else delete pendingSelected[cb.dataset.slug];
      updatePendingSelectionUi();
    });

    $('#btn-wg-import-batch').addEventListener('click', importPendingBatch);

    $('#adm-manual-form').addEventListener('submit', function (e) {
      e.preventDefault();
      var fd = new FormData(e.target);
      var payload = {};
      fd.forEach(function (val, key) {
        payload[key] = val;
      });
      setBusy(true);
      api('/api/admin/add-game-manual', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      })
        .then(function (data) {
          toast('Đã tạo: ' + data.game.name, true);
          e.target.reset();
          return loadAll();
        })
        .catch(function (err) {
          toast(err.message, false);
        })
        .finally(function () {
          setBusy(false);
        });
    });

    $('#adm-catalog').addEventListener('click', function (e) {
      var more = e.target.closest('#btn-catalog-more');
      if (more) {
        catalogLimit += CATALOG_PAGE;
        renderCatalog(catalogFilter);
        return;
      }
      var item = e.target.closest('.adm-cat-item');
      if (!item) return;
      addToList(item.dataset.id);
    });

    $('#adm-slots').addEventListener('click', function (e) {
      var btn = e.target.closest('[data-remove]');
      if (!btn) return;
      removeFromList(btn.dataset.remove);
    });

    $('#adm-slots').addEventListener('change', function (e) {
      var sel = e.target.closest('select.adm-slot-size');
      if (!sel) return;
      var id = sel.getAttribute('data-size-id');
      setSize(activeKey, id, sel.value || '');
      var li = sel.closest('.adm-slot');
      if (li) {
        li.classList.remove('is-size-wide', 'is-size-xl');
        if (sel.value) li.classList.add('is-size-' + sel.value);
      }
      toast(
        sel.value === 'xl'
          ? '4× lớn (2×2) — nhớ Lưu & publish'
          : sel.value === 'wide'
            ? '2× ngang — nhớ Lưu & publish'
            : '1× thường — nhớ Lưu & publish',
        true
      );
    });

    $('#btn-clear').addEventListener('click', function () {
      if (!confirm('Xóa hết game trong tab "' + META[activeKey].title + '"?')) return;
      (featured[activeKey] || []).forEach(function (id) {
        setSize(activeKey, id, '');
      });
      featured[activeKey] = [];
      renderSlots();
    });

    $('#btn-save').addEventListener('click', function () {
      setBusy(true);
      api('/api/admin/save', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          trending: featured.trending || [],
          new: featured.new || [],
          topRated: featured.topRated || [],
          picks: featured.picks || [],
          sizes: featuredSizes,
        }),
      })
        .then(function (data) {
          var g = data.grids;
          toast(
            'Đã lưu! Homepage & trang game cập nhật — mở tab homepage và Ctrl+Shift+R. HOT ' +
              g.trending +
              ' · NEW ' +
              g.new +
              ' · TOP ' +
              g.topRated,
            true
          );
          return refreshStatus().then(renderPreview);
        })
        .catch(function (err) {
          toast(err.message, false);
        })
        .finally(function () {
          setBusy(false);
        });
    });

    $('#btn-sync').addEventListener('click', function () {
      setBusy(true);
      api('/api/admin/sync-grids', { method: 'POST' })
        .then(function (data) {
          var g = data.grids;
          toast('Sync xong: ' + g.trending + ' / ' + g.new + ' / ' + g.topRated, true);
        })
        .catch(function (err) {
          toast(err.message, false);
        })
        .finally(function () {
          setBusy(false);
        });
    });

    $('#btn-import').addEventListener('click', function () {
      if (
        !confirm(
          'Import toàn bộ catalog từ WG clone? Có thể mất vài phút.'
        )
      ) {
        return;
      }
      setBusy(true);
      toast('Đang import WG…', true);
      api('/api/admin/import-wg', { method: 'POST' })
        .then(function (data) {
          toast('Import xong — ' + data.catalog + ' games', true);
          return loadAll();
        })
        .catch(function (err) {
          toast(err.message, false);
        })
        .finally(function () {
          setBusy(false);
        });
    });

    bindDragDrop();
  }

  function applyStatus(st) {
    if (!st) return;
    updateStatus(
      st.catalog +
        ' games · Featured T' +
        st.featured.trending +
        ' N' +
        st.featured.new +
        ' Top' +
        st.featured.topRated +
        ' P' +
        st.featured.picks
    );
  }

  function applyPreview(data) {
    var box = $('#adm-preview');
    if (!box || !data || !data.sections) return;
    box.innerHTML = Object.keys(data.sections)
      .map(function (key) {
        var s = data.sections[key];
        var games = (s.games || [])
          .slice(0, 4)
          .map(function (n) {
            return '<li>' + esc(n) + '</li>';
          })
          .join('');
        return (
          '<div class="adm-map-card"><strong>' +
          esc(s.label) +
          '</strong><span>' +
          s.count +
          ' game</span><ul>' +
          games +
          '</ul></div>'
        );
      })
      .join('');
  }

  function refreshStatus() {
    return api('/api/admin/status').then(applyStatus);
  }

  function renderPreview() {
    return api('/api/admin/preview').then(applyPreview);
  }

  function setOfflineVisible(visible, err) {
    var box = $('#adm-offline');
    if (!box) return;
    box.classList.toggle('is-visible', !!visible);
    box.hidden = !visible;
    if (!visible) return;

    var origin = (window.location && window.location.href) || '';
    var detail = box.querySelector('.adm-offline-detail');
    if (!detail) {
      detail = document.createElement('div');
      detail.className = 'adm-offline-detail';
      box.appendChild(detail);
    }
    var bits = [];
    bits.push('Đang mở: <code>' + esc(origin) + '</code>');
    if (window.location.port && window.location.port !== '8767') {
      bits.push(
        '→ Sai cổng. Hãy mở <a href="http://127.0.0.1:8767/admin/"><strong>http://127.0.0.1:8767/admin/</strong></a>'
      );
    }
    if (err && err.message) {
      bits.push('Lỗi API: <code>' + esc(err.message) + '</code>');
    }
    detail.innerHTML = bits.join('<br/>');
    updateStatus('Offline — cần admin-server.py trên cổng 8767');
  }

  function loadAllLegacy() {
    return Promise.all([
      api('/api/admin/catalog'),
      api('/api/admin/featured'),
      api('/api/admin/status'),
    ]).then(function (results) {
      catalog = results[0].games || [];
      catalogById = {};
      catalog.forEach(function (g) {
        catalogById[g.id] = g;
      });
      featured = results[1].featured || featured;
      featuredSizes = Object.assign(
        { trending: {}, new: {}, topRated: {}, picks: {} },
        results[1].sizes || {}
      );
      applyStatus(results[2]);
      setOfflineVisible(false);
      catalogLimit = CATALOG_PAGE;
      setActiveTab(activeKey);
      // Preview is optional — don't fail boot if it errors.
      return api('/api/admin/preview')
        .then(applyPreview)
        .catch(function () {});
    });
  }

  function loadAll() {
    return api('/api/admin/bootstrap')
      .then(function (data) {
        catalog = data.games || [];
        catalogById = {};
        catalog.forEach(function (g) {
          catalogById[g.id] = g;
        });
        featured = data.featured || featured;
        featuredSizes = Object.assign(
          { trending: {}, new: {}, topRated: {}, picks: {} },
          data.sizes || {}
        );
        applyStatus(data.status);
        applyPreview(data.preview);
        setOfflineVisible(false);
        catalogLimit = CATALOG_PAGE;
        try {
          setActiveTab(activeKey);
        } catch (e) {
          console.error(e);
        }
      })
      .catch(function (err) {
        return loadAllLegacy().catch(function (err2) {
          setOfflineVisible(true, err2 || err);
        });
      });
  }

  function init() {
    bindEvents();
    setMode('slots');
    loadAll();
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }
})();
