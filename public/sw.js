var cacheName = 'restaurant-app-v002';

self.addEventListener('install', event => {
  event.waitUntil(
    caches.open(cacheName).then(cache => {
      return cache.addAll([
        '/',
        '/src/index.js',
        '/src/index.css',
        '/src/App.css',
        '/src/App.js',
        '/src/Components/Map.js',
        '/src/Components/Restaurants.js',
        '/src/Components/RestaurantList.js',
        '/src/Components/Sidebar.js',
        '/src/API/FoursquareApi.js',
      ])
      .catch(error => {
        console.log('Caches open failed: ' + error);
      });
    })
  );
});

self.addEventListener('fetch', event => {
  var requestUrl = new URL(event.request.url);

  if (requestUrl.origin === location.origin) {
    if(requestUrl.pathname ==='/') {
    event.respondWith(caches.match(event.request).then(response => {
        return response || fetch(event.request);
      }));
  }
}});
