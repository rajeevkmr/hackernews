var CACHE_NAME = 'my-cache';
var urlsToCache = [
    '/style.css',
    '/style.css.gz',
    '/bundle.js',
    '/bundle.js.gz',
    '/favicon.ico'
];
self.addEventListener('install', function(event) {
    event.waitUntil(
        caches.open(CACHE_NAME)
            .then(function(cache) {
                cache.add('https://stackpath.bootstrapcdn.com/bootstrap/4.1.3/css/bootstrap.min.css')
                cache.add('https://cdnjs.cloudflare.com/ajax/libs/slick-carousel/1.6.0/slick.min.css')
                cache.add('https://unpkg.com/react@16.10.2/umd/react.production.min.js')
                cache.add('https://unpkg.com/react-dom@16.10.2/umd/react-dom.production.min.js')
                return cache.addAll(urlsToCache);
            })
    );
});
