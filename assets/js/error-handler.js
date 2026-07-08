// Handle third-party cookie warnings
if (window.chrome) {
  console.warn = (function(originalWarn) {
    return function(msg) {
      if (!msg.includes('third-party cookies')) {
        originalWarn.apply(console, arguments);
      }
    };
  })(console.warn);
}

// Handle content-all.js errors
window.addEventListener('error', function(e) {
  if (e.message.includes('Cannot find menu item')) {
    e.preventDefault();
    return false;
  }
});

// Handle GameAnalytics warnings
if (window.GameAnalytics) {
  const originalConsoleWarn = console.warn;
  console.warn = function() {
    if (arguments[0] && !arguments[0].includes('GameAnalytics')) {
      originalConsoleWarn.apply(console, arguments);
    }
  };
}

// Handle blocked resources
window.addEventListener('error', function(e) {
  if (e.target.tagName === 'IMG' || e.target.tagName === 'SCRIPT') {
    e.preventDefault();
    return false;
  }
}, true);

// Handle AudioContext
document.addEventListener('DOMContentLoaded', function() {
  window.addEventListener('click', function() {
    if (typeof AudioContext !== 'undefined') {
      const audioContext = new AudioContext();
      if (audioContext.state === 'suspended') {
        audioContext.resume();
      }
    }
  }, { once: true });
}); 