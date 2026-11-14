/* Contador de visitas: pede os números ao contador.php e mostra no rodapé (fica oculto se o PHP não responder) */
(function () {
  var box = document.getElementById('contadorVisitas');
  var t = document.getElementById('contadorTotal');
  var h = document.getElementById('contadorHoje');
  if (!box || !t || !h || !window.fetch) { return; }
  function fmt(n) { return String(n).replace(/\B(?=(\d{3})+(?!\d))/g, '.'); }
  fetch('contador.php', { method: 'POST', credentials: 'same-origin', cache: 'no-store' })
    .then(function (r) { return r.ok ? r.json() : null; })
    .then(function (d) {
      if (!d || !d.ok) { return; }
      t.textContent = fmt(d.total);
      h.textContent = fmt(d.hoje);
      box.hidden = false;
    })
    .catch(function () {});
})();
