/* Logo do menu: some na abertura (só o logo animado grande aparece) e surge ao sair da primeira página */
(function () {
  var nav = document.querySelector('.custom-navbar');
  var intro = document.getElementById('inicio');
  if (!nav || !intro) { return; }

  var svg = nav.querySelector('.nav-logo');
  var visivel = null;
  var agendado = false;
  var introFim = false, pose = false;

  document.documentElement.classList.add('js-logo');

  function reiniciaAnimacao() {
    if (!svg) { return; }
    svg.style.animation = 'none';
    svg.querySelectorAll('.nl-d, .nl-txt').forEach(function (el) { el.style.animation = 'none'; });
    void svg.getBoundingClientRect();
    svg.style.animation = '';
    svg.querySelectorAll('.nl-d, .nl-txt').forEach(function (el) { el.style.animation = ''; });
  }

  // logo que pousou vindo da abertura: começa já montado (sem refazer a animação de entrada)
  function poseFinal() {
    if (!svg) { return; }
    svg.querySelectorAll('.nl-d, .nl-txt').forEach(function (el) { el.style.animationDelay = '-2.5s'; });
  }
  document.addEventListener('onix:logo-chegando', function () { introFim = true; pose = true; pede(); });

  function atualiza() {
    agendado = false;
    var passou = introFim || intro.getBoundingClientRect().bottom <= nav.offsetHeight + 8;
    if (passou === visivel) { return; }
    visivel = passou;
    nav.classList.toggle('logo-on', passou);
    if (passou) { if (pose) { pose = false; reiniciaAnimacao(); poseFinal(); } else { reiniciaAnimacao(); } }
  }

  function pede() {
    if (!agendado) { agendado = true; window.requestAnimationFrame(atualiza); }
  }

  window.addEventListener('scroll', pede, { passive: true });
  window.addEventListener('resize', pede);
  window.addEventListener('load', pede);
  atualiza();
})();
