/**
 * WGPlayground embed helper — postMessage launch, ad consent, black-screen recovery.
 * Ported from the working MonkeyMart WG portal (playerIframe → game-frame).
 */
(function () {
  'use strict';

  var iframe =
    document.getElementById('game-frame') || document.getElementById('playerIframe');
  var frame =
    document.getElementById('mm-player') ||
    document.getElementById('playerFrame') ||
    document.querySelector('.wg-player-wrap');
  if (!iframe || !frame) return;

  var src = iframe.getAttribute('src') || iframe.getAttribute('data-src') || '';
  if (src.indexOf('play.wgplayground.com/ifr/') === -1) return;

  var PLAYER_ORIGIN = 'https://play.wgplayground.com';
  document.body.classList.add('mm-wg-game');

  function grantAdConsent() {
    if (typeof window.gtag !== 'function') return;
    try {
      window.gtag('consent', 'update', {
        ad_storage: 'granted',
        ad_user_data: 'granted',
        ad_personalization: 'granted',
      });
    } catch (e) {}
  }

  function postLaunch() {
    if (!iframe.contentWindow) return;
    try {
      iframe.contentWindow.postMessage({ type: 'wgp-launch' }, PLAYER_ORIGIN);
    } catch (e) {}
  }

  function focusPlayer() {
    try {
      iframe.focus({ preventScroll: true });
    } catch (e) {
      try {
        iframe.focus();
      } catch (e2) {}
    }
  }

  var launched = false;
  var interacted = false;
  var recoveryTimer = null;
  var recoveryEl = null;

  window.addEventListener('message', function (e) {
    if (e.source !== iframe.contentWindow) return;
    if (!e.data || e.data.type !== 'wgp-launched') return;
    launched = true;
    hideRecovery();
  });

  function showRecovery() {
    if (launched || recoveryEl) return;
    recoveryEl = document.createElement('div');
    recoveryEl.className = 'mm-player-recovery';
    recoveryEl.setAttribute('role', 'status');
    recoveryEl.innerHTML =
      '<p class="mm-player-recovery__text">Game stuck on a black screen?</p>' +
      '<button type="button" class="mm-player-recovery__btn">Reload game</button>';
    frame.appendChild(recoveryEl);
    recoveryEl.querySelector('button').addEventListener('click', function () {
      launched = false;
      hideRecovery();
      var base = (iframe.getAttribute('src') || src).split('#')[0];
      iframe.src = base + (base.indexOf('?') === -1 ? '?' : '&') + 'mmr=' + Date.now();
      scheduleRecoveryCheck();
    });
  }

  function hideRecovery() {
    if (!recoveryEl) return;
    recoveryEl.remove();
    recoveryEl = null;
  }

  function scheduleRecoveryCheck() {
    if (recoveryTimer) clearTimeout(recoveryTimer);
    recoveryTimer = setTimeout(function () {
      if (!launched && interacted) showRecovery();
    }, 22000);
  }

  function onInteract() {
    if (!interacted) {
      interacted = true;
      grantAdConsent();
    }
    postLaunch();
    focusPlayer();
    scheduleRecoveryCheck();
  }

  frame.addEventListener('pointerdown', onInteract, { passive: true });
  iframe.addEventListener('load', function () {
    if (interacted) postLaunch();
  });

  // Help WG shell start when parent page is ready.
  iframe.addEventListener('load', function () {
    setTimeout(postLaunch, 400);
  });
})();
