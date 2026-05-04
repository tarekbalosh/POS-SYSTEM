// Custom Offline Logic for Restaurant POS

self.addEventListener('fetch', (event) => {
  const url = new URL(event.request.url);
  
  // Intercept POST /api/orders when offline
  if (!navigator.onLine && event.request.method === 'POST' && url.pathname.includes('/orders')) {
    event.respondWith(
      (async () => {
        // Return a fake 201 response so the UI thinks it succeeded
        // The offlineAwareRequest in the frontend already handled saving to IndexedDB
        return new Response(JSON.stringify({ 
          id: 'temp-' + Date.now(), 
          status: 'OFFLINE_PENDING',
          offline: true 
        }), {
          status: 201,
          headers: { 'Content-Type': 'application/json' }
        });
      })()
    );
  }
});

// Background Sync Listener
self.addEventListener('sync', (event) => {
  if (event.tag === 'pos-sync') {
    console.log('[SW] Background sync triggered: pos-sync');
    // Note: We can't directly import from lib/offline/sync here easily
    // In a real app, you'd bundle this or use postMessage to the client
  }
});
