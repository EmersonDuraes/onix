/* Contador de visitas: pede os números ao contador.php e mostra no rodapé (fica oculto se o PHP não responder) */
(function () {
  var box = document.getElementById('contadorVisitas');
  var t = document.getElementById('contadorTotal');
  var h = document.getElementById('contadorHoje');
  var nv = document.getElementById('navVisitas'), nt = document.getElementById('navTotal'), nh = document.getElementById('navHoje');
  if (!(box && t && h) && !nv) { return; }
  if (!window.fetch) { return; }
  function fmt(n) { return String(n).replace(/\B(?=(\d{3})+(?!\d))/g, '.'); }
  fetch('contador.php', { method: 'POST', credentials: 'same-origin', cache: 'no-store' })
    .then(function (r) { return r.ok ? r.json() : null; })
    .then(function (d) {
      if (!d || !d.ok) { return; }
      if (t) { t.textContent = fmt(d.total); }
      if (h) { h.textContent = fmt(d.hoje); }
      if (box) { box.hidden = false; }
      if (nv && nt && nh) {
        nt.textContent = fmt(d.total); nh.textContent = fmt(d.hoje);
        nv.title = 'Total de visitas: ' + fmt(d.total) + ' · Hoje: ' + fmt(d.hoje);
        nv.hidden = false; document.documentElement.className += ' tem-visitas';
      }
    })
    .catch(function () {});
})();
