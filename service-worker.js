self.addEventListener("install", function (e) {
  e.waitUntil(
    caches.open("codecloud-cache").then(function (cache) {
      return cache.addAll([
        "./",
        "./index.html",
        "./assets/css/creative-design.css",
        "./assets/js/creative-design.js",
        "./assets/js/chatbot.js",
        "./assets/vendors/jquery/jquery-3.4.1.js",
        "./assets/vendors/bootstrap/bootstrap.bundle.js",
        "./assets/vendors/bootstrap/bootstrap.affix.js",
        "./assets/imgs/icon-192.png",
        "./assets/imgs/icon-512.png"
      ]);
    })
  );
});

self.addEventListener("fetch", function (e) {
  e.respondWith(
    caches.match(e.request).then(function (response) {
      return response || fetch(e.request);
    })
  );
});
