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
  console.log(e.requet.url);
  e.respondWith(
    caches.match(e.request).then((response) => response || fetch(e.request)),
  );
});
