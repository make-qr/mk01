const CACHE_NAME = 'cookie-clicker-cache-v1';
const urlsToCache = [
  './',
  './index.html',
  './style.css',
  './main.js',
  './showads.js',
  './base64.js',
  './img/favicon.ico',
  './snd/tick.mp3'
];

// Install the service worker and cache assets
self.addEventListener('install', event => {
  // Force service worker activation
  self.skipWaiting();
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then(cache => {
        console.log('Opened cache');
        return cache.addAll(urlsToCache);
      })
  );
});

// Activate immediately
self.addEventListener('activate', event => {
  event.waitUntil(self.clients.claim());
  
  // Update caches
  const cacheWhitelist = [CACHE_NAME];
  event.waitUntil(
    caches.keys().then(cacheNames => {
      return Promise.all(
        cacheNames.map(cacheName => {
          if (cacheWhitelist.indexOf(cacheName) === -1) {
            return caches.delete(cacheName);
          }
        })
      );
    })
  );
});

// Serve cached content when offline
self.addEventListener('fetch', event => {
  // Don't cache API requests or external resources
  if (event.request.url.includes('/api/') || 
      !event.request.url.startsWith(self.location.origin)) {
    return;
  }

  event.respondWith(
    caches.match(event.request)
      .then(response => {
        // Cache hit - return response
        if (response) {
          return response;
        }
        
        // Clone the request
        const fetchRequest = event.request.clone();
        
        return fetch(fetchRequest).then(
          response => {
            // Check if we received a valid response
            if(!response || response.status !== 200 || response.type !== 'basic') {
              return response;
            }

            // Clone the response
            const responseToCache = response.clone();

            caches.open(CACHE_NAME)
              .then(cache => {
                cache.put(event.request, responseToCache);
              });

            return response;
          }
        ).catch(() => {
          // If fetch fails, try to return the cached version of index.html for navigation requests
          if (event.request.mode === 'navigate') {
            return caches.match('./index.html');
          }
          return null;
        });
      })
    );
});

// Handle localStorage backup
self.addEventListener('message', event => {
  if (event.data && event.data.action === 'backupSave') {
    // Store the backup in the cache for extra redundancy
    caches.open('cookie-save-backup').then(cache => {
      const blob = new Blob([event.data.saveData], {type: 'text/plain'});
      const response = new Response(blob);
      cache.put(`save-${Date.now()}`, response);
    });
    
    // Echo the save data back to the client
    self.clients.matchAll().then(clients => {
      clients.forEach(client => {
        client.postMessage({
          action: 'saveBackup',
          data: event.data.saveData
        });
      });
    });
  }
}); 