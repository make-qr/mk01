// Google Analytics Event Tracking
function trackEvent(category, action, label = null, value = null) {
  if (typeof gtag !== 'undefined') {
    const eventParams = {
      event_category: category,
      event_action: action
    };
    
    if (label) eventParams.event_label = label;
    if (value) eventParams.value = value;
    
    gtag('event', action, eventParams);
  }
}

// Track page views
function trackPageView(path, title) {
  if (typeof gtag !== 'undefined') {
    gtag('config', 'G-54L5E2NJ3K', {
      page_path: path,
      page_title: title
    });
  }
}

// Track game interactions
function trackGameInteraction(gameId, action) {
  trackEvent('Game', action, gameId);
}

// Track social shares
function trackSocialShare(platform, gameId) {
  trackEvent('Social', 'Share', platform, gameId);
}

// Initialize tracking on page load
document.addEventListener('DOMContentLoaded', function() {
  // Track initial page view
  trackPageView(window.location.pathname, document.title);
  
  // Track game frame interactions
  const gameFrame = document.getElementById('game-frame');
  if (gameFrame) {
    const gameId = gameFrame.getAttribute('data-game-id') || 'monkey-mart';
    trackGameInteraction(gameId, 'Load');
    
    // Track fullscreen
    const fullscreenBtn = document.getElementById('fullscreen-btn');
    if (fullscreenBtn) {
      fullscreenBtn.addEventListener('click', () => {
        trackGameInteraction(gameId, 'Fullscreen');
      });
    }
    
    // Track sharing
    const shareBtn = document.getElementById('share-btn');
    if (shareBtn) {
      shareBtn.addEventListener('click', () => {
        trackGameInteraction(gameId, 'Share Menu Open');
      });
    }
  }
});