/* Planos: alterna entre Serviço e Comércio */
(function () {
  var abas = document.querySelectorAll('.pl-aba');
  if (!abas.length) { return; }
  document.documentElement.classList.add('js-pl');
  function abre(alvo) {
    Array.prototype.forEach.call(abas, function (a) {
      var on = a.getAttribute('data-alvo') === alvo;
      a.classList.toggle('ativo', on);
      a.setAttribute('aria-selected', on ? 'true' : 'false');
      a.tabIndex = on ? 0 : -1;
    });
    Array.prototype.forEach.call(document.querySelectorAll('.pl-painel'), function (p) {
      p.classList.toggle('ativo', p.id === alvo);
    });
  }
  Array.prototype.forEach.call(abas, function (a, i) {
    a.addEventListener('click', function () { abre(a.getAttribute('data-alvo')); });
    a.addEventListener('keydown', function (e) {
      if (e.key === 'ArrowRight' || e.key === 'ArrowLeft') {
        var n = abas[(i + (e.key === 'ArrowRight' ? 1 : abas.length - 1)) % abas.length];
        abre(n.getAttribute('data-alvo')); n.focus();
      }
    });
  });
})();
