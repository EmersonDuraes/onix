/* Depoimentos: palco com foto grande, nome em destaque e faixa de miniaturas */
(function () {
  var card = document.getElementById('depCard');
  if (!card) { return; }
  document.documentElement.classList.add('js-dep');
  var thumbs = [].slice.call(card.querySelectorAll('.dep-t'));
  var foto = document.getElementById('depFoto'), img = document.getElementById('depImg');
  var bgs = [document.getElementById('depBgA'), document.getElementById('depBgB')], bgAtivo = 0;
  var by = document.getElementById('depBy'), nome = document.getElementById('depNome');
  var num = document.getElementById('depNum');
  var tot = document.getElementById('depTotal'); if (tot) { tot.textContent = ('0' + thumbs.length).slice(-2); }
  var video = document.getElementById('depVideo');
  var modal = document.getElementById('onixModal');
  var atual = 0, trocando = false, pendente = null, timer = 0, pausado = false, visivel = false;
  var reduz = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  var TROCA_MS = 7000;

  /* pré-carrega as fotos para a troca ser instantânea */
  thumbs.forEach(function (t) { var im = new Image(); im.src = t.getAttribute('data-img'); });

  function aplica(i) {
    var t = thumbs[i], src = t.getAttribute('data-img');
    img.src = src;
    img.alt = 'Depoimento 0' + (i + 1);
    /* fundo desfocado: troca com fade entre duas camadas */
    var prox = 1 - bgAtivo;
    bgs[prox].src = src;
    bgs[prox].classList.add('on');
    bgs[bgAtivo].classList.remove('on');
    bgAtivo = prox;
    by.textContent = 'Depoimento 0' + (i + 1);
    nome.textContent = (t.getAttribute('data-nome') || 'Cliente Onix').replace('|', ' ');
    num.textContent = '0' + (i + 1);
    video.setAttribute('data-video', t.getAttribute('data-v'));
    video.setAttribute('data-capa', t.getAttribute('data-c'));
    thumbs.forEach(function (x, k) {
      x.classList.toggle('ativo', k === i);
      if (k === i) { x.setAttribute('aria-current', 'true'); } else { x.removeAttribute('aria-current'); }
    });
  }

  function vai(i) {
    i = (i + thumbs.length) % thumbs.length;
    if (trocando) { pendente = i; return; }
    if (i === atual) { return; }
    atual = i;
    if (reduz) { aplica(i); return; }
    trocando = true;
    [foto, by, nome].forEach(function (e) { e.classList.add('dep-sai'); });
    setTimeout(function () {
      aplica(i);
      [foto, by, nome].forEach(function (e) { e.classList.remove('dep-sai'); });
      setTimeout(function () {
        trocando = false;
        if (pendente !== null) { var p = pendente; pendente = null; vai(p); }
      }, 320);
    }, 300);
    reinicia();
  }

  /* rotação automática (pausa com mouse/foco/toque, vídeo aberto ou seção fora da tela) */
  function passo() {
    var aberto = modal && modal.classList.contains('aberto');
    if (!pausado && visivel && !aberto && !document.hidden) { vai(atual + 1); }
  }
  function reinicia() {
    clearInterval(timer);
    if (!reduz) { timer = setInterval(passo, TROCA_MS); }
  }

  thumbs.forEach(function (t, i) { t.addEventListener('click', function () { vai(i); }); });
  document.getElementById('depAnt').addEventListener('click', function () { vai(atual - 1); });
  document.getElementById('depProx').addEventListener('click', function () { vai(atual + 1); });

  card.addEventListener('mouseenter', function () { pausado = true; });
  card.addEventListener('mouseleave', function () { pausado = false; });
  card.addEventListener('focusin', function () { pausado = true; });
  card.addEventListener('focusout', function () { pausado = false; });
  card.addEventListener('keydown', function (e) {
    if (e.key === 'ArrowLeft' || e.key === 'ArrowUp') { e.preventDefault(); vai(atual - 1); }
    else if (e.key === 'ArrowRight' || e.key === 'ArrowDown') { e.preventDefault(); vai(atual + 1); }
  });

  /* deslizar o dedo troca de depoimento */
  var x0 = null, y0 = null;
  card.addEventListener('touchstart', function (e) { x0 = e.touches[0].clientX; y0 = e.touches[0].clientY; pausado = true; }, { passive: true });
  card.addEventListener('touchend', function (e) {
    pausado = false;
    if (x0 === null) { return; }
    var dx = e.changedTouches[0].clientX - x0, dy = e.changedTouches[0].clientY - y0;
    if (Math.abs(dx) > 45 && Math.abs(dx) > Math.abs(dy) * 1.2) { vai(atual + (dx < 0 ? 1 : -1)); }
    x0 = y0 = null;
  }, { passive: true });

  /* entrada suave quando a seção aparece */
  if ('IntersectionObserver' in window) {
    new IntersectionObserver(function (es) {
      es.forEach(function (e) {
        visivel = e.isIntersecting;
        if (e.isIntersecting) { card.classList.add('dep-in'); }
      });
    }, { threshold: 0.25 }).observe(card);
  } else { card.classList.add('dep-in'); visivel = true; }

  reinicia();
})();
