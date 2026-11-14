/* Onix – service worker: página sempre atualizada quando há internet; abre mesmo sem sinal. */
var V = 'onix-v2';
var BASICO = ['./', 'index.html', 'manifest.webmanifest', 'css/onix.css', 'css/responsive-fix.css', 'css/style.css',
  'js/custom.js', 'js/pwa.js', 'images/logo.png', 'images/android-chrome-192x192.png'];

self.addEventListener('install', function (e) {
  e.waitUntil(caches.open(V).then(function (c) {
    return Promise.all(BASICO.map(function (u) { return c.add(u).catch(function () {}); }));
  }).then(function () { return self.skipWaiting(); }));
});
self.addEventListener('activate', function (e) {
  e.waitUntil(caches.keys().then(function (ks) {
    return Promise.all(ks.filter(function (k) { return k !== V; }).map(function (k) { return caches.delete(k); }));
  }).then(function () { return self.clients.claim(); }));
});
self.addEventListener('fetch', function (e) {
  var r = e.request, u = new URL(r.url);
  if (r.method !== 'GET' || u.origin !== location.origin) { return; }
  if (/\.(mp4|webm)$/i.test(u.pathname) || r.headers.has('range') || /\.php$/i.test(u.pathname)) { return; }
  var pagina = r.mode === 'navigate' || /\.(html|css|js)$/i.test(u.pathname);
  if (pagina) {
    /* rede primeiro; se falhar, usa o que estiver guardado */
    e.respondWith(fetch(r).then(function (res) {
      var cp = res.clone(); caches.open(V).then(function (c) { c.put(r, cp); }); return res;
    }).catch(function () {
      return caches.match(r, { ignoreSearch: true }).then(function (m) { return m || caches.match('index.html'); });
    }));
  } else {
    /* imagens e fontes: guardado primeiro */
    e.respondWith(caches.match(r).then(function (m) {
      return m || fetch(r).then(function (res) {
        if (res.ok) { var cp = res.clone(); caches.open(V).then(function (c) { c.put(r, cp); }); }
        return res;
      });
    }));
  }
});
