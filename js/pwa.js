/* Onix – modo app: registro do service worker, convite para instalar e barra de abas (só no app instalado) */
(function () {
  var doc = document.documentElement;
  var standalone = (window.matchMedia && matchMedia('(display-mode: standalone)').matches) || navigator.standalone === true;
  if (standalone) { doc.classList.add('is-app'); }

  if ('serviceWorker' in navigator && (location.protocol === 'https:' || location.hostname === 'localhost')) {
    window.addEventListener('load', function () { navigator.serviceWorker.register('sw.js').catch(function () {}); });
  }

  /* ---- barra de abas ---- */
  var abas = document.querySelectorAll('.app-tabs a[data-alvo]');
  var alvos = [];
  Array.prototype.forEach.call(abas, function (a) {
    var s = document.getElementById(a.getAttribute('data-alvo'));
    if (s) { alvos.push({ a: a, s: s }); }
    a.addEventListener('click', function (ev) {
      if (!s) { return; }
      ev.preventDefault();
      s.scrollIntoView({ behavior: 'smooth', block: 'start' });
    });
  });
  var tick = false;
  function marca() {
    tick = false;
    var meio = window.innerHeight * 0.45, ativo = null;
    alvos.forEach(function (o) { if (o.s.getBoundingClientRect().top <= meio) { ativo = o; } });
    alvos.forEach(function (o) {
      var on = o === ativo;
      o.a.classList.toggle('on', on);
      if (on) { o.a.setAttribute('aria-current', 'true'); } else { o.a.removeAttribute('aria-current'); }
    });
  }
  function agenda() { if (!tick) { tick = true; requestAnimationFrame(marca); } }
  if (alvos.length) {
    window.addEventListener('scroll', agenda, { passive: true });
    window.addEventListener('resize', agenda);
    window.addEventListener('load', marca);
    marca();
  }

  /* ---- convite para instalar (só no navegador, uma vez por aparelho) ---- */
  var caixa = document.getElementById('appInstalar');
  if (!caixa || standalone) { return; }
  var guardado = false;
  try { guardado = localStorage.getItem('onix-instalar') === '1'; } catch (e) {}
  var texto = caixa.querySelector('[data-txt]'), ok = caixa.querySelector('[data-ok]'), fecha = caixa.querySelector('[data-fecha]');
  var evt = null;
  function mostra() {
    if (guardado) { return; }
    setTimeout(function () { caixa.classList.add('on'); }, 6000);
  }
  function esconde() {
    caixa.classList.remove('on');
    try { localStorage.setItem('onix-instalar', '1'); } catch (e) {}
  }
  fecha.addEventListener('click', esconde);
  window.addEventListener('beforeinstallprompt', function (e) {
    e.preventDefault(); evt = e;
    texto.textContent = 'Instale o app da Onix no seu celular.';
    ok.textContent = 'Instalar'; ok.hidden = false;
    mostra();
  });
  ok.addEventListener('click', function () {
    if (!evt) { return; }
    evt.prompt();
    evt.userChoice.then(function () { evt = null; esconde(); });
  });
  window.addEventListener('appinstalled', esconde);
  var ios = /iphone|ipad|ipod/i.test(navigator.userAgent) && !window.MSStream;
  if (ios) {
    texto.innerHTML = 'Para instalar: toque em <b>Compartilhar</b> e depois em <b>Adicionar à Tela de Início</b>.';
    ok.hidden = true;
    mostra();
  }
})();
