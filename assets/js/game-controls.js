// Game controls — share, fullscreen, click-to-play, copy toast
document.addEventListener('DOMContentLoaded', function () {
  const gameContainer =
    document.querySelector('.wg-player-wrap') ||
    document.querySelector('.game-frame-container');
  const gameFrame = document.getElementById('game-frame');
  const playButton = document.getElementById('playGameButton');
  const thumbnail = document.querySelector('.game-thumbnail');
  const shareButton = document.getElementById('share-btn');
  const shareMenu = document.getElementById('share-menu');
  const fullscreenButton = document.getElementById('fullscreen-btn');
  const loadingOverlay = document.querySelector('.loading-overlay');
  const actionBar =
    document.querySelector('.mm-player-chrome .mm-action-bar') ||
    document.querySelector('.mm-action-bar');

  if (!gameContainer) return;

  var wgSrc =
    (gameFrame && (gameFrame.getAttribute('src') || gameFrame.getAttribute('data-src'))) || '';
  var isWgEmbed = wgSrc.indexOf('play.wgplayground.com/ifr/') !== -1;

  function frameAttrSrc() {
    return (gameFrame && gameFrame.getAttribute('src')) || '';
  }

  function resolvePlayUrl() {
    if (!gameFrame) return '';
    return gameFrame.getAttribute('data-src') || frameAttrSrc() || '';
  }

  function showShareToast(message) {
    if (!actionBar) return;
    var toast = actionBar.querySelector('.mm-share-toast');
    if (!toast) {
      toast = document.createElement('div');
      toast.className = 'mm-share-toast';
      toast.setAttribute('role', 'status');
      actionBar.appendChild(toast);
    }
    toast.textContent = message || 'Link copied';
    toast.classList.add('is-visible');
    clearTimeout(showShareToast._timer);
    showShareToast._timer = setTimeout(function () {
      toast.classList.remove('is-visible');
    }, 1800);
  }

  function startGameFromPoster() {
    if (!gameFrame || !thumbnail) return;
    thumbnail.style.display = 'none';
    if (loadingOverlay) loadingOverlay.style.display = 'flex';

    var gameUrl = resolvePlayUrl();
    if (gameUrl) {
      gameFrame.setAttribute('src', gameUrl);
      gameFrame.src = gameUrl;
    }
    gameFrame.style.display = 'block';

    var settled = false;
    function settle() {
      if (settled) return;
      settled = true;
      if (loadingOverlay) loadingOverlay.style.display = 'none';
    }
    gameFrame.addEventListener('load', settle);
    setTimeout(settle, isWgEmbed ? 2500 : 8000);

    if (typeof window.MM_WG_ON_PLAY === 'function') {
      try {
        window.MM_WG_ON_PLAY();
      } catch (e) {}
    }
  }

  if (playButton && gameFrame && thumbnail) {
    playButton.addEventListener('click', startGameFromPoster);
  }

  if (gameFrame && !playButton && !isWgEmbed) {
    const dataSrc = gameFrame.getAttribute('data-src');
    if (dataSrc && !frameAttrSrc()) {
      if (loadingOverlay) {
        loadingOverlay.style.display = 'flex';
        gameFrame.addEventListener('load', function () {
          loadingOverlay.style.display = 'none';
        });
      }
      gameFrame.src = dataSrc;
      gameFrame.style.display = 'block';
    }
  }

  if (shareButton && shareMenu) {
    shareButton.addEventListener('click', function (e) {
      e.stopPropagation();
      shareMenu.classList.toggle('active');
    });

    document.addEventListener('click', function (e) {
      if (!shareMenu.contains(e.target) && !shareButton.contains(e.target)) {
        shareMenu.classList.remove('active');
      }
    });
  }

  const copyLinkBtn = document.getElementById('copy-link-btn');
  const facebookBtn = document.getElementById('facebook-btn');
  const twitterBtn = document.getElementById('twitter-btn');
  const pinterestBtn = document.getElementById('pinterest-btn');

  if (copyLinkBtn) {
    copyLinkBtn.addEventListener('click', function (e) {
      e.preventDefault();
      e.stopPropagation();
      var href = window.location.href;
      function done() {
        showShareToast('Link copied');
        if (shareMenu) shareMenu.classList.remove('active');
      }
      if (navigator.clipboard && navigator.clipboard.writeText) {
        navigator.clipboard.writeText(href).then(done).catch(done);
      } else {
        try {
          var ta = document.createElement('textarea');
          ta.value = href;
          ta.setAttribute('readonly', '');
          ta.style.position = 'fixed';
          ta.style.left = '-9999px';
          document.body.appendChild(ta);
          ta.select();
          document.execCommand('copy');
          document.body.removeChild(ta);
        } catch (err) {}
        done();
      }
    });
  }
  if (facebookBtn) {
    facebookBtn.addEventListener('click', function () {
      window.open(
        'https://www.facebook.com/sharer/sharer.php?u=' +
          encodeURIComponent(window.location.href),
        '_blank',
        'width=600,height=400'
      );
    });
  }
  if (twitterBtn) {
    twitterBtn.addEventListener('click', function () {
      window.open(
        'https://twitter.com/intent/tweet?url=' +
          encodeURIComponent(window.location.href) +
          '&text=' +
          encodeURIComponent(document.title),
        '_blank',
        'width=600,height=400'
      );
    });
  }
  if (pinterestBtn) {
    pinterestBtn.addEventListener('click', function () {
      window.open(
        'https://pinterest.com/pin/create/button/?url=' +
          encodeURIComponent(window.location.href),
        '_blank',
        'width=600,height=400'
      );
    });
  }

  function setFullscreenLabel(active) {
    if (!fullscreenButton) return;
    fullscreenButton.innerHTML = active
      ? '<i class="fas fa-compress"></i> Exit'
      : '<i class="fas fa-expand"></i> Fullscreen';
  }

  if (fullscreenButton) {
    fullscreenButton.addEventListener('click', function () {
      if (!document.fullscreenElement) {
        const el = gameContainer;
        if (el.requestFullscreen) el.requestFullscreen();
        else if (el.webkitRequestFullscreen) el.webkitRequestFullscreen();
        else if (el.msRequestFullscreen) el.msRequestFullscreen();
        setFullscreenLabel(true);
      } else {
        if (document.exitFullscreen) document.exitFullscreen();
        else if (document.webkitExitFullscreen) document.webkitExitFullscreen();
        else if (document.msExitFullscreen) document.msExitFullscreen();
        setFullscreenLabel(false);
      }
    });

    document.addEventListener('fullscreenchange', function () {
      setFullscreenLabel(!!document.fullscreenElement);
    });
  }
});
