const CACHE_NAME = "soccer_maniacs";
const STATIC = [
  "/",
  "/index.html",
  "/manifest.json",
  "/pages/competitions.html",
  "/pages/fav-teams.html",
  "/pages/schedule.html",
  "/pages/about.html",
  "/pages/contact.html",
  "/css/materialize.min.css",
  "/css/styles.css",
  "/js/materialize.min.js",
  "/js/script.js",
  "/js/idb.js",
  "/js/idbapi.js",
  "/js/fetchapi.js",
  "/js/utils.js",
  "/assets/icon.png"
];


self.addEventListener("install", event => {
    event.waitUntil(
      caches.open(CACHE_NAME).then( cache => {
        return cache.addAll(STATIC);
      })
    );
});


self.addEventListener("fetch", function(event) {
    event.respondWith(
        caches
        .match(event.request, { cacheName: CACHE_NAME })
        .then(function(response) {
            if (response) {
                return response;
            }

            const fetchrequest = event.request.clone();
            return fetch(fetchrequest).then( response => {
                if(!response || response.status !== 200) {
                    return response;
                }
                const resCache = response.clone();
                caches.open(CACHE_NAME)
                .then(function(cache) {
                    cache.put(event.request, resCache);
                });
                return response;
            });
        })
    );
});