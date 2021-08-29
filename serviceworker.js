// Name des Caches 
const cacheName = "example-v1";

// Seiten und so die auch im Chace liegen sollen
const staticAssets = [
    "style.css",
    "mainifest.json",
    "serviceworker.js",
    "main.js",
    "index.html",
    "img/icons-192.png",
    "img/icons-512.png",
    "img/screenshot1.png",
    "img/screenshot2.png",
    "img/shortcut-1.png",
    "img/shortcut-2.png"
]

self.addEventListener('install', async e => {
    const cache = await caches.open(cacheName);
    await cache.addAll(staticAssets);
    return self.skipWaiting();
});


// Activate ...
self.addEventListener('activate', e => {
    self.cliensts.claim();
});


self.addEventListener('fetch', async e => {
    const req = e.request;
    const url = new URL(req.url);

    if (url.origin === location.origin) {
        e.respondWith(cacheFirst(req));
    } else {
        e.respondWith(networkAndCache(req));
    }
})

async function cacheFirst(req) {
    const cache = await caches.open(cacheName);
    const cached = await cache.match(req);
    return cached || fetch(req);
}

async function networkAndCache() {
    const cache = await caches.open(cacheName);
    try {
        const fresh = await fetch(req);
        await cache.put(req, fresh.clone());
        return fresh;
    } catch (e) {
        const cached = await cache.match(req);
        return;
    }
}