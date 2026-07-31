/**
 * WGPlayground embed helper — postMessage launch, ad consent, black-screen recovery.
 * Supports click-to-play: iframe may start with data-src only until Play is pressed.
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
  var DEV_REFERRER = 'monkeymart.one';
  document.body.classList.add('mm-wg-game');

  var booted = false;
  var lastLaunchAt = 0;
  var launched = false;
  var interacted = false;
  var recoveryTimer = null;
  var recoveryEl = null;
  var bootLaunchDone = false;

  /** WG reads parent hostname for ?r= on the game URL; localhost is not whitelisted. */
  function patchDevReferrer() {
    var host = location.hostname;
    if (host !== 'localhost' && host !== '127.0.0.1' && host !== '0.0.0.0') return;
    var current = iframe.getAttribute('src') || src;
    if (!current || current.indexOf('play.wgplayground.com/ifr/') === -1) return;
    if (current.indexOf('r=') !== -1) return;
    var sep = current.indexOf('?') === -1 ? '?' : '&';
    var next = current + sep + 'r=' + encodeURIComponent(DEV_REFERRER);
    iframe.setAttribute('src', next);
    src = next;
  }

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
    var now = Date.now();
    if (now - lastLaunchAt < 1200) return;
    lastLaunchAt = now;
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

  function showRecovery() {
    if (launched || recoveryEl) return;
    recoveryEl = document.createElement('div');
    recoveryEl.className = 'mm-player-recovery';
    recoveryEl.setAttribute('role', 'status');
    recoveryEl.innerHTML =
      '<p class="mm-player-recovery__text">Still preparing the game?</p>' +
      '<button type="button" class="mm-player-recovery__btn">Reload game</button>';
    frame.appendChild(recoveryEl);
    recoveryEl.querySelector('button').addEventListener('click', function () {
      launched = false;
      bootLaunchDone = false;
      lastLaunchAt = 0;
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

  function onIframeLoad() {
    if (interacted) postLaunch();
    if (bootLaunchDone) return;
    bootLaunchDone = true;
    setTimeout(postLaunch, 400);
  }

  function boot() {
    if (booted) return;
    src = iframe.getAttribute('src') || iframe.getAttribute('data-src') || src;
    if (!src || src.indexOf('play.wgplayground.com/ifr/') === -1) return;
    if (!iframe.getAttribute('src')) return;
    booted = true;
    patchDevReferrer();
    iframe.addEventListener('load', onIframeLoad);
    // If already loaded (cached), kick launch once.
    try {
      if (iframe.contentWindow) setTimeout(postLaunch, 400);
    } catch (e) {}
  }

  window.addEventListener('message', function (e) {
    if (e.source !== iframe.contentWindow) return;
    if (!e.data || e.data.type !== 'wgp-launched') return;
    launched = true;
    hideRecovery();
  });

  frame.addEventListener('pointerdown', onInteract, { passive: true });

  window.MM_WG_ON_PLAY = function () {
    boot();
    interacted = true;
    grantAdConsent();
    scheduleRecoveryCheck();
  };

  // Eager iframe (legacy) — boot immediately. Click-to-play waits for Play.
  if (iframe.getAttribute('src')) {
    boot();
  }
})();
