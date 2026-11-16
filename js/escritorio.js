/* Escritório — Nossa História: ao rolar, ~100 barras escuras deslizam em sequência (esquerda→direita, depois direita→esquerda),
   girando 45° e voltando, e revelam um capítulo por vez. Mesma matemática do demo GSAP (stagger 1, power1.inOut, rotação 0→45→0),
   com suavização, sem biblioteca. */
(function () {
  var pista = document.getElementById('ebPista');
  var cont = document.getElementById('ebBarras');
  if (!pista || !cont) { return; }
  var N = 100, bars = [], i;
  for (i = 0; i < N; i++) { var b = document.createElement('div'); b.className = 'eb-bar'; cont.appendChild(b); bars.push(b); }
  var caps = [].slice.call(pista.querySelectorAll('.eb-cap'));
  var SW = caps.length - 1;            // varreduras (uma entre cada par de capítulos)
  var PRE = 0.35, FATIA = 0.55;        // pausa inicial e parte de cada trecho gasta na varredura (o resto é leitura)
  var TOTAL = PRE + SW;
  var reduz = window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  var alvo = 0, atual = 0, rodando = false, ultimo = -1;

  function clamp(v) { return v < 0 ? 0 : (v > 1 ? 1 : v); }
  function inOut(t) { return t < 0.5 ? 2 * t * t : -1 + (4 - 2 * t) * t; }   // power1.inOut
  function out(t) { return 1 - (1 - t) * (1 - t); }                            // power1.out
  function inn(t) { return t * t; }                                            // power1.in

  function pinta(f) {
    var x = f * TOTAL, j, sw;
    if (x <= PRE) { j = 0; sw = 0; }
    else {
      var y = x - PRE; j = Math.min(SW - 1, Math.floor(y)); sw = clamp((y - j) / FATIA);
    }
    if (reduz) { sw = sw >= 0.5 ? 1 : 0; }
    var tau = sw * 2, rot = reduz ? 0 : (tau <= 1 ? 45 * out(tau) : 45 * (1 - inn(tau - 1)));
    var A = (j % 2 === 0) ? 0 : 100, B = 100 - A, k, r = rot.toFixed(2);
    for (k = 0; k < N; k++) {
      var local = clamp(tau - k / (N - 1));
      var xp = A + (B - A) * inOut(local);
      bars[k].style.transform = 'translate3d(' + xp.toFixed(2) + '%,0,0) rotate(' + r + 'deg)';
    }
    // capítulos: o antigo some na 1ª metade da varredura, o novo surge na 2ª
    var oA = reduz ? (sw >= 1 ? 0 : 1) : 1 - clamp(sw / 0.5), oB = reduz ? (sw >= 1 ? 1 : 0) : clamp((sw - 0.5) / 0.5);
    caps.forEach(function (cp, idx) {
      var o = 0;
      if (idx === j) { o = oA; } else if (idx === j + 1) { o = oB; }
      if (j === SW - 1 && idx === SW && sw >= 1) { o = 1; }
      cp.style.opacity = o.toFixed(3);
      cp.style.visibility = o > 0.001 ? 'visible' : 'hidden';
      cp.setAttribute('aria-hidden', o > 0.5 ? 'false' : 'true');
    });
  }
  function leAlvo() {
    var r = pista.getBoundingClientRect(), total = r.height - window.innerHeight;
    alvo = total > 0 ? clamp(-r.top / total) : 0;
  }
  function passo() {
    var d = alvo - atual;
    if (Math.abs(d) < 0.00015) { atual = alvo; } else { atual += d * 0.16; }   // suavização (como scrub: .5)
    if (atual !== ultimo) { ultimo = atual; pinta(atual); }
    if (atual !== alvo) { requestAnimationFrame(passo); } else { rodando = false; }
  }
  function pede() { leAlvo(); if (!rodando) { rodando = true; requestAnimationFrame(passo); } }
  window.addEventListener('scroll', pede, { passive: true });
  window.addEventListener('resize', pede);
  leAlvo(); atual = alvo; pinta(atual);
})();
