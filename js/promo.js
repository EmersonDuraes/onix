/* Vídeo promocional na abertura: toca uma vez por visita, com "Pular" e controle de som */
(function () {
  var box = document.getElementById('promo');
  if (!box) { return; }
  var KEY = 'onix_promo_visto';
  var JANELA = 30 * 60 * 1000;            // não repete o vídeo se ele já foi visto nos últimos 30 minutos
  function jaViu() {
    try { var t = parseInt(localStorage.getItem(KEY), 10); if (t && Date.now() - t < JANELA) { return true; } } catch (e) {}
    try { if (sessionStorage.getItem(KEY)) { return true; } } catch (e) {}
    return false;
  }
  if (jaViu()) { return; }
  var v = document.getElementById('promoVideo');
  var skip = document.getElementById('promoPular');
  var som = document.getElementById('promoSom');
  var barra = document.getElementById('promoBarra');
  var quadro = box.querySelector('.promo-quadro');
  var intro = document.querySelector('.intro-video');
  var fechado = false, ultimoFoco = null, tentouDesktop = false;

  var curto = window.matchMedia && window.matchMedia('(max-width:767px)').matches;
  v.src = curto ? 'images/promo-m.mp4' : 'images/promo.mp4';

  // botão "Toque para assistir": aparece quando o celular bloqueia o início automático
  var st = document.createElement('style');
  st.textContent = '.promo-play{position:absolute;left:50%;top:50%;transform:translate(-50%,-50%);z-index:3;display:flex;flex-direction:column;align-items:center;gap:10px;padding:0;border:0;background:none;color:#fff;font:600 15px/1.2 Poppins,Arial,sans-serif;cursor:pointer;text-shadow:0 2px 8px rgba(0,0,0,.6)}.promo-play[hidden]{display:none}.promo-play span{display:flex;align-items:center;justify-content:center;width:84px;height:84px;border-radius:50%;background:rgba(49,156,209,.92);box-shadow:0 8px 28px rgba(0,0,0,.45);font-size:34px;padding-left:6px}';
  document.head.appendChild(st);
  var play = document.createElement('button');
  play.type = 'button'; play.className = 'promo-play'; play.hidden = true;
  play.setAttribute('aria-label', 'Assistir ao vídeo');
  play.innerHTML = '<span><i class="fa fa-play" aria-hidden="true"></i></span>Toque para assistir';
  quadro.appendChild(play);

  function marcarVisto() {
    try { localStorage.setItem(KEY, String(Date.now())); } catch (e) {}
    try { sessionStorage.setItem(KEY, '1'); } catch (e) {}
  }
  function rotuloSom() {
    som.setAttribute('aria-pressed', v.muted ? 'false' : 'true');
    som.querySelector('span').textContent = v.muted ? 'Ativar som' : 'Som ligado';
    som.querySelector('i').className = 'fa ' + (v.muted ? 'fa-volume-off' : 'fa-volume-up');
  }
  function fechar() {
    if (fechado) { return; }
    fechado = true;
    marcarVisto();
    try { v.pause(); } catch (e) {}
    box.classList.add('promo-saindo');
    document.documentElement.classList.remove('promo-aberto');
    if (intro) { try { intro.play(); } catch (e) {} }
    setTimeout(function () {
      box.hidden = true;
      v.removeAttribute('src'); v.load();
      if (ultimoFoco && ultimoFoco.focus) { try { ultimoFoco.focus(); } catch (e) {} }
    }, 450);
  }
  function iniciar() {
    v.muted = false;
    var p = v.play();
    if (p && p.catch) {
      p.catch(function () {            // som bloqueado: tenta mudo
        v.muted = true; rotuloSom();
        var q = v.play();
        if (q && q.catch) { q.catch(function () { play.hidden = false; }); }   // nem mudo: pede um toque
      });
    }
    rotuloSom();
  }
  function abrir() {
    ultimoFoco = document.activeElement;
    box.hidden = false;
    document.documentElement.classList.add('promo-aberto');
    if (intro) { try { intro.pause(); } catch (e) {} }
    iniciar();
    skip.focus();
  }

  v.addEventListener('playing', function () { play.hidden = true; marcarVisto(); });
  play.addEventListener('click', function () { play.hidden = true; v.muted = false; rotuloSom(); var p = v.play(); if (p && p.catch) { p.catch(function () { v.muted = true; rotuloSom(); v.play(); }); } });
  som.addEventListener('click', function () { v.muted = !v.muted; if (!v.muted && v.paused) { v.play(); } rotuloSom(); });
  skip.addEventListener('click', fechar);
  v.addEventListener('ended', fechar);
  v.addEventListener('error', function () {
    if (curto && !tentouDesktop) { tentouDesktop = true; v.src = 'images/promo.mp4'; iniciar(); return; }  // versão leve ausente: usa a normal
    fechar();
  });
  v.addEventListener('timeupdate', function () { if (v.duration) { barra.style.width = (v.currentTime / v.duration * 100) + '%'; } });
  v.addEventListener('click', function () { if (v.paused) { v.play(); } else { v.pause(); } });
  document.addEventListener('keydown', function (e) {
    if (box.hidden || fechado) { return; }
    if (e.key === 'Escape') { fechar(); }
    else if (e.key === 'Tab') {
      var a = [skip, som], i = a.indexOf(document.activeElement);
      e.preventDefault(); a[(i + (e.shiftKey ? -1 : 1) + 2) % 2].focus();
    }
  });
  // carregamento lento: mostra o botão para o visitante tocar em vez de ficar parado
  setTimeout(function () { if (!fechado && v.paused) { play.hidden = false; } }, 4000);
  abrir();
})();
