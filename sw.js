self.addEventListener("install", e => {
    e.waitUntil(
        caches.open("static").then(cache => {
            return cache.addAll([
                './', 
                './styles/css/main-styles.css', 
                './styles/css/button.css', 
                './styles/css/constants.css',
                './styles/css/footer.css', 
                './styles/css/popup-menu.css', 
                './styles/css/preloader.css',
                './assets/favicon_io/apple-touch-icon.png', 
                './assets/favicon_io/favicon-16x16.png']);
        })
    )
})

self.addEventListener("fetch", e => {
    e.respondWith(
        caches.match(e.request).then(response => {
            return response || fetch(e.request)
        })
    )
})