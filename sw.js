const contentToCache=[
  '/BicycleSpeed/',
  '/BicycleSpeed/index2.html',
  '/BicycleSpeed/image/bicyclemove.gif',
  '/BicycleSpeed/image/bicyclestatic.png',
  '/BicycleSpeed/image/bicyclestatic2.png',
  '/BicycleSpeed/scripts/main.js',
  '/BicycleSpeed/styles/style.css'
]
self.addEventListener('install', (e) => {
  e.waitUntil(
    caches.open('test-store').then((cache) => cache.addAll(contentToCache)),
  );
});
self.addEventListener('fetch', (e) => {
  console.log(e.request.url);
  e.respondWith(
    caches.match(e.request.url).then((response) => response || fetch(e.request)),
  );
});
