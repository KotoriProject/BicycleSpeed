const contentToCache=[
  '/BicycleSpeed/',
  '/BicycleSpeed/index3.html',
  '/BicycleSpeed/image/bicyclemove.gif',
  '/BicycleSpeed/image/bicyclestatic.png',
  '/BicycleSpeed/image/bicyclestatic2.png',
  '/BicycleSpeed/scripts/main3.js',
  '/BicycleSpeed/styles/style.css'
  '/BicycleSpeed/1.mp3'
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
