self.addEventListener('install', (event) => {
    console.log('Service Worker: Installed');
    self.skipWaiting();
});

self.addEventListener('activate', (event) => {
    console.log('Service Worker: Activated');
    event.waitUntil(self.clients.claim());
});

self.addEventListener('fetch', (event) => {
    // Cache strategy can be added here if needed
});

self.addEventListener('message', (event) => {
    if (event.data && event.data.type === 'KEEP_ALIVE') {
        console.log('Service Worker: Received keep-alive message');
        // Notify clients to resume playback
        self.clients.matchAll().then(clients => {
            clients.forEach(client => {
                client.postMessage({ type: 'RESUME_PLAYBACK' });
            });
        });
    }
});

// Periodic keep-alive to maintain playback
setInterval(() => {
    self.clients.matchAll().then(clients => {
        clients.forEach(client => {
            client.postMessage({ type: 'RESUME_PLAYBACK' });
        });
    });
}, 30000); // Every 30 seconds