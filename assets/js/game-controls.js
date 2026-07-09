// Game controls — share, fullscreen; optional click-to-play for legacy pages
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

  if (!gameContainer) return;

  var wgSrc =
    (gameFrame && (gameFrame.getAttribute('src') || gameFrame.getAttribute('data-src'))) || '';
  var isWgEmbed = wgSrc.indexOf('play.wgplayground.com/ifr/') !== -1;

  // Legacy click-to-play (native games with poster)
  if (playButton && gameFrame && thumbnail) {
    playButton.addEventListener('click', function () {
      thumbnail.style.display = 'none';
      if (loadingOverlay) loadingOverlay.style.display = 'flex';

      const gameUrl = gameFrame.getAttribute('data-src') || gameFrame.src;
      if (gameUrl && !gameFrame.src) gameFrame.src = gameUrl;

      gameFrame.onload = function () {
        if (loadingOverlay) loadingOverlay.style.display = 'none';
        gameFrame.style.display = 'block';
      };
    });
  }

  // Direct-load (no play button): load the game immediately — skip for WG embeds
  // (mm-player-recovery.js owns WG iframe launch / consent).
  if (gameFrame && !playButton && !isWgEmbed) {
    const dataSrc = gameFrame.getAttribute('data-src');
    if (dataSrc && !gameFrame.src) {
      // We trigger the load, so show the spinner until the frame is ready.
      if (loadingOverlay) {
        loadingOverlay.style.display = 'flex';
        gameFrame.addEventListener('load', function () {
          loadingOverlay.style.display = 'none';
        });
      }
      gameFrame.src = dataSrc;
      gameFrame.style.display = 'block';
    }
    // Otherwise the iframe already has a native src and shows WG's own
    // loading/play screen, so no extra overlay is needed.
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
    copyLinkBtn.addEventListener('click', function () {
      navigator.clipboard.writeText(window.location.href);
      alert('Link copied to clipboard!');
    });
  }
  if (facebookBtn) {
    facebookBtn.addEventListener('click', function () {
      window.open(
        'https://www.facebook.com/sharer/sharer.php?u=' +
          encodeURIComponent(window.location.href),
        '_blank'
      );
    });
  }
  if (twitterBtn) {
    twitterBtn.addEventListener('click', function () {
      window.open(
        'https://twitter.com/intent/tweet?url=' +
          encodeURIComponent(window.location.href),
        '_blank'
      );
    });
  }
  if (pinterestBtn) {
    pinterestBtn.addEventListener('click', function () {
      window.open(
        'https://pinterest.com/pin/create/button/?url=' +
          encodeURIComponent(window.location.href),
        '_blank'
      );
    });
  }

  if (!fullscreenButton) return;

  fullscreenButton.addEventListener('click', function () {
    if (!document.fullscreenElement) {
      const el = gameContainer;
      if (el.requestFullscreen) el.requestFullscreen();
      else if (el.webkitRequestFullscreen) el.webkitRequestFullscreen();
      else if (el.msRequestFullscreen) el.msRequestFullscreen();
      fullscreenButton.innerHTML = '<i class="fas fa-compress"></i>';
    } else {
      if (document.exitFullscreen) document.exitFullscreen();
      else if (document.webkitExitFullscreen) document.webkitExitFullscreen();
      else if (document.msExitFullscreen) document.msExitFullscreen();
      fullscreenButton.innerHTML = '<i class="fas fa-expand"></i>';
    }
  });

  document.addEventListener('fullscreenchange', function () {
    if (!document.fullscreenElement) {
      fullscreenButton.innerHTML = '<i class="fas fa-expand"></i>';
    }
  });
});
