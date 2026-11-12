/* Logo da abertura em 3D: a profundidade (lateral do logo) e a inclinação seguem o mouse; sem mouse, balança suavemente */
(function () {
  var box = document.getElementById('ol3d');
  var sec = document.getElementById('inicio');
  if (!box || !sec) { return; }
  if (window.matchMedia && matchMedia('(prefers-reduced-motion: reduce)').matches) { return; }
  var tx = 0, ty = 0, x = 0, y = 0, ult = 0, vis = true, rodando = false;

  function aplica() {
    box.style.setProperty('--ux', (0.55 + x * 0.85).toFixed(3));
    box.style.setProperty('--uy', (0.75 + y * 0.85).toFixed(3));
    box.style.setProperty('--ry', (x * 9).toFixed(2) + 'deg');
    box.style.setProperty('--rx', (-y * 7).toFixed(2) + 'deg');
  }
  function quadro(t) {
    rodando = false;
    if (!vis) { return; }
    if (t - ult > 2500) { /* sem mouse: balanço automático */
      tx = Math.sin(t / 1900) * 0.75;
      ty = Math.cos(t / 2700) * 0.45;
    }
    x += (tx - x) * 0.08;
    y += (ty - y) * 0.08;
    aplica();
    inicia();
  }
  function inicia() { if (!rodando && vis) { rodando = true; requestAnimationFrame(quadro); } }

  sec.addEventListener('pointermove', function (e) {
    var r = sec.getBoundingClientRect();
    tx = Math.max(-1, Math.min(1, ((e.clientX - r.left) / r.width - 0.5) * 2));
    ty = Math.max(-1, Math.min(1, ((e.clientY - r.top) / r.height - 0.5) * 2));
    ult = performance.now();
  }, { passive: true });
  sec.addEventListener('pointerleave', function () { ult = 0; });

  if ('IntersectionObserver' in window) {
    new IntersectionObserver(function (en) { vis = en[0].isIntersecting; if (vis) { inicia(); } }, { threshold: 0.05 }).observe(sec);
  }
  document.addEventListener('visibilitychange', function () { vis = !document.hidden; if (vis) { inicia(); } });
  box.classList.add('ol-3d-on');
  inicia();
})();
