/* Contador de visitas: pede o total ao contador.php e mostra no rodapé (fica oculto se o PHP não responder) */
(function () {
  var el = document.getElementById('contadorVisitas');
  var num = document.getElementById('contadorNum');
  if (!el || !num || !window.fetch) { return; }
  fetch('contador.php', { method: 'POST', credentials: 'same-origin', cache: 'no-store' })
    .then(function (r) { return r.ok ? r.json() : null; })
    .then(function (d) {
      if (!d || !d.ok) { return; }
      num.textContent = String(d.total).replace(/\B(?=(\d{3})+(?!\d))/g, '.');
      el.hidden = false;
    })
    .catch(function () {});
})();
