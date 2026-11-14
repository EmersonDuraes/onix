/* Depoimentos: os 6 cartões entram voando numa fita 3D que ondula pela tela e pousam numa grade.
   A animação toca quando a seção aparece e repete se a pessoa sair e voltar. */
(function () {
  var sec = document.getElementById('videos');
  if (!sec) { return; }
  var cards = [].slice.call(sec.querySelectorAll('.dep-card'));
  var intro = sec.querySelector('.dep-intro');
  var palA = intro && intro.querySelector('.dep-intro__a');
  var palB = intro && intro.querySelector('.dep-intro__b');
  if (!cards.length || !palA || !palB || !('IntersectionObserver' in window) ||
      window.matchMedia('(prefers-reduced-motion: reduce)').matches) { return; }

  /* tempos (segundos) */
  var T0 = 1.0, STAG = 0.17, PASSA = 2.8, POUSO = 1.1;
  var TEXTO_ENTRA = 1.1, TEXTO_SAI = 2.6, TEXTO_SAI_DUR = 0.9, TITULO = 3.7;
  var FIM = T0 + STAG * (cards.length - 1) + PASSA + 0.1 + POUSO + 0.1;

  var estado = 'parado';   /* parado | tocando | feito */
  var raf = 0, inicio = 0, medidas = [];

  document.documentElement.classList.add('js-dep');

  function lim(v) { return v < 0 ? 0 : (v > 1 ? 1 : v); }
  function saiSuave(u) { return 1 - Math.pow(1 - u, 3); }
  function entraSuave(u) { return u * u * u; }
  function vaiVem(u) { return 0.5 - 0.5 * Math.cos(Math.PI * u); }
  function persp(rz, ry, rx, sc) {
    return ' perspective(1000px) rotateZ(' + rz.toFixed(2) + 'deg) rotateY(' + ry.toFixed(2) + 'deg) rotateX(' + rx.toFixed(2) + 'deg) scale(' + sc.toFixed(3) + ')';
  }

  function mede() {
    var s = sec.getBoundingClientRect();
    medidas = cards.map(function (c) {
      var r = c.getBoundingClientRect();
      return { cx: r.left - s.left + r.width / 2, cy: r.top - s.top + r.height / 2, w: r.width, h: r.height };
    });
  }

  function desenha(t) {
    var W = sec.clientWidth, H = window.innerHeight;
    var top = sec.getBoundingClientRect().top;   /* a fita acompanha a tela, não a página */

    /* palavras grandes */
    var a = saiSuave(lim(t / TEXTO_ENTRA));
    var b = saiSuave(lim((t - 0.15) / TEXTO_ENTRA));
    var sai = entraSuave(lim((t - TEXTO_SAI) / TEXTO_SAI_DUR));
    palA.style.transform = 'translate3d(' + (-100 * (1 - a) - 100 * sai).toFixed(2) + 'vw,0,0)';
    palB.style.transform = 'translate3d(' + (100 * (1 - b) + 100 * sai).toFixed(2) + 'vw,0,0)';
    intro.style.visibility = (t > TEXTO_SAI + TEXTO_SAI_DUR) ? 'hidden' : 'visible';

    if (t >= TITULO) { sec.classList.add('dep-topo-on'); }

    cards.forEach(function (c, i) {
      var m = medidas[i];
      var ini = T0 + i * STAG;
      var q = (t - ini) / PASSA;
      var tx, ty, op, tr;

      if (q < 0) {                         /* ainda não entrou */
        c.style.opacity = 0; return;
      }
      if (q <= 1) {                        /* voando na fita */
        var s = vaiVem(q) * 0.35 + q * 0.65;
        var X = -0.28 * W + s * 1.56 * W;
        var tw = s * Math.PI * 2.4;
        var Y = H * (0.66 - 0.52 * s) + Math.sin(tw + 0.6) * H * 0.13;
        tx = X - m.cx;
        ty = Y - top - m.cy;
        var ry = 68 * Math.sin(tw + 1.0);
        var rx = 20 * Math.cos(tw);
        var rz = -16 + 6 * Math.sin(tw);
        var sc = 0.85 + 0.3 * Math.cos(tw + 0.4);
        op = Math.min(1, q / 0.05, (1 - q) / 0.05);
        c.style.opacity = op.toFixed(3);
        c.style.transform = 'translate3d(' + tx.toFixed(1) + 'px,' + ty.toFixed(1) + 'px,0)' + persp(rz, ry, rx, sc);
        return;
      }
      /* pousando na grade */
      var L = ini + PASSA + 0.1;
      var u = saiSuave(lim((t - L) / POUSO));
      if (t < L) { c.style.opacity = 0; return; }
      var cyView = top + m.cy;
      var emCima = cyView < H / 2;
      var dy0 = emCima ? -(cyView + m.h) : (H - cyView + m.h);
      var dx0 = ((i % 3) - 1) * 0.35 * m.w;
      var k = 1 - u;
      c.style.opacity = lim(u * 5).toFixed(3);
      c.style.transform = 'translate3d(' + (dx0 * k).toFixed(1) + 'px,' + (dy0 * k).toFixed(1) + 'px,0)' +
        persp(((i % 3) - 1) * 14 * k, (i % 2 ? -28 : 28) * k, (emCima ? 30 : -30) * k, 1 + 0.12 * k);
    });
  }

  function limpa() {
    cards.forEach(function (c) { c.style.opacity = ''; c.style.transform = ''; c.style.willChange = ''; });
    palA.style.transform = ''; palB.style.transform = ''; intro.style.visibility = '';
  }

  function quadro(agora) {
    var t = (agora - inicio) / 1000;
    if (t >= FIM) { termina(); return; }
    desenha(t);
    raf = window.requestAnimationFrame(quadro);
  }

  function termina() {
    window.cancelAnimationFrame(raf);
    limpa();
    sec.classList.add('dep-topo-on', 'dep-done');
    estado = 'feito';
  }

  function toca() {
    if (estado !== 'parado') { return; }
    estado = 'tocando';
    mede();
    cards.forEach(function (c) { c.style.willChange = 'transform, opacity'; });
    inicio = performance.now();
    desenha(0);
    raf = window.requestAnimationFrame(quadro);
  }

  function reinicia() {
    window.cancelAnimationFrame(raf);
    limpa();
    sec.classList.remove('dep-done', 'dep-topo-on');
    estado = 'parado';
  }

  new IntersectionObserver(function (entradas) {
    var e = entradas[entradas.length - 1];
    if (e.intersectionRatio >= 0.3) { toca(); }
    else if (e.intersectionRatio === 0 && estado !== 'parado') { reinicia(); }
  }, { threshold: [0, 0.3] }).observe(sec);
})();
