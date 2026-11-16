/* Abertura: o logo grande faz a apresentação (uma vez) e depois voa até o canto superior esquerdo, onde fica o logo do menu */
(function () {
  var root = document.documentElement;
  var intro = document.getElementById('inicio');
  var flip = document.getElementById('onixFlip');
  var ol = document.getElementById('ol3d');
  if (!intro || !flip || !ol || !root.classList.contains('js-intro')) { return; }
  var reduz = window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  var ESPERA = 4800;      // tempo do logo montado na tela antes de seguir para o canto
  var VOO = 1300;
  var terminou = false;

  function alvo() {
    var img = document.querySelector('.nav-logo-img'), svg = document.querySelector('.nav-logo');
    return (img && getComputedStyle(img).display !== 'none') ? img : svg;
  }
  function chegou() {
    if (terminou) { return; }
    terminou = true;
    root.classList.remove('intro-voo');
    root.classList.add('intro-fim');
  }
  function mostraLogoMenu() {
    try { document.dispatchEvent(new CustomEvent('onix:logo-chegando')); } catch (e) {}
  }
  function voar() {
    var nav = document.querySelector('.custom-navbar');
    var jaRolou = intro.getBoundingClientRect().bottom <= (nav ? nav.offsetHeight : 60) + 8;
    var el = alvo();
    if (jaRolou || reduz || !ol.animate || !el) { mostraLogoMenu(); chegou(); return; }

    root.classList.add('intro-voo');                       // o logo passa por cima do menu durante o voo
    var logo = ol.querySelector('.onix-logo');
    var a = el.getBoundingClientRect();
    var escondido = !(nav && nav.classList.contains('logo-on'));
    var ay = a.top + (escondido ? 8 : 0);                  // o logo do menu espera 8px acima antes de aparecer
    var g = logo.getBoundingClientRect(), o = ol.getBoundingClientRect();
    if (!a.width || !g.width) { mostraLogoMenu(); chegou(); return; }
    var dx = (a.left + a.width / 2) - (g.left + g.width / 2);
    var dy = (ay + a.height / 2) - (g.top + g.height / 2);
    var s = Math.min(a.width / g.width, a.height / g.height);
    ol.style.transformOrigin = (g.left + g.width / 2 - o.left) + 'px ' + (g.top + g.height / 2 - o.top) + 'px';

    var sub = ol.querySelector('.ol-sub');
    if (sub) { sub.animate([{ opacity: 1 }, { opacity: 0 }], { duration: 420, fill: 'forwards' }); }
    var voo = ol.animate(
      [{ transform: 'translate(0,0) scale(1)' }, { transform: 'translate(' + dx + 'px,' + dy + 'px) scale(' + s + ')' }],
      { duration: VOO, easing: 'cubic-bezier(.65,0,.25,1)', fill: 'forwards' }
    );
    voo.onfinish = function () {
      mostraLogoMenu();                                    // logo do menu surge no mesmo lugar...
      var some = flip.animate([{ opacity: 1 }, { opacity: 0 }], { duration: 350, fill: 'forwards' });
      some.onfinish = chegou;                              // ...e o grande some
      setTimeout(chegou, 900);
    };
  }
  function inicia() {
    root.classList.add('intro-roda');
    setTimeout(voar, reduz ? 2500 : ESPERA);
  }
  var promo = document.getElementById('promo');
  if (promo && !promo.hidden) { document.addEventListener('onix:promo-fim', inicia, { once: true }); }
  else { inicia(); }
})();
