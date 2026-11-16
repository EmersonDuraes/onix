/* Serviços: troca de slides com as animações do demo (wipe + imagens deslizando), movida pela rolagem da página */
(function () {
  var pista = document.getElementById('srvPista');
  if (!pista) { return; }
  var slides = [].slice.call(pista.querySelectorAll('.srv-slide'));
  var oimgs = [].slice.call(pista.querySelectorAll('.srv-oimg'));
  var n = slides.length, cur = 0, ativas = [], tCount = 0, tFim = 0;
  var contador = document.getElementById('srvCount'), num = document.getElementById('srvNum');
  var reduz = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  var canAnim = !!(slides[0] && slides[0].animate);
  var DUR = 1250, EASE = 'cubic-bezier(.87,0,.13,1)';
  function q(el, s) { return el.querySelector(s); }
  function pad(i) { return ('0' + (i + 1)).slice(-2); }
  function limpa() { ativas.forEach(function (a) { try { a.cancel(); } catch (e) {} }); ativas = []; }
  function anim(el, de, para, fill) {
    if (!el || !canAnim) { return; }
    ativas.push(el.animate([de, para], { duration: DUR, easing: EASE, fill: fill || 'none' }));
  }
  function vis(el, z) { el.style.visibility = 'visible'; el.style.zIndex = z; }
  function oculta(el) { el.style.visibility = 'hidden'; el.style.zIndex = 0; }

  function vai(i) {
    if (i === cur) { return; }
    var dir = i > cur ? 1 : -1, ant = cur;
    clearTimeout(tCount); clearTimeout(tFim); limpa();
    slides.forEach(oculta); oimgs.forEach(oculta);
    cur = i;
    vis(slides[ant], 1); vis(oimgs[i], 1);
    vis(slides[i], 2); vis(oimgs[ant], 2);
    num.textContent = pad(i);
    if (reduz || !canAnim) { oculta(slides[ant]); oculta(oimgs[ant]); contador.textContent = pad(i); return; }
    anim(q(slides[i], '.srv-outer'), { transform: 'translateX(' + 100 * dir + '%)' }, { transform: 'translateX(0)' });
    anim(q(slides[i], '.srv-inner'), { transform: 'translateX(' + -100 * dir + '%)' }, { transform: 'translateX(0)' });
    anim(q(slides[ant], '.srv-heading'), { transform: 'translateX(0)', letterSpacing: '-.01em' }, { transform: 'translateX(' + 30 * dir + '%)', letterSpacing: '.12em' }, 'forwards');
    anim(q(slides[i], '.srv-heading'), { transform: 'translateX(' + -30 * dir + '%)', letterSpacing: '.12em' }, { transform: 'translateX(0)', letterSpacing: '-.01em' });
    anim(oimgs[i], { transform: 'translateX(' + 125 * dir + '%) scale(1.5,1.3)' }, { transform: 'translateX(0) scale(1,1)' });
    anim(oimgs[ant], { transform: 'translateX(0) scale(1,1)' }, { transform: 'translateX(' + -125 * dir + '%) scale(1.5,1.3)' }, 'forwards');
    anim(q(slides[i], '.srv-img'), { transform: 'scale(2)' }, { transform: 'scale(1)' });
    tCount = setTimeout(function () { contador.textContent = pad(i); }, 400);
    tFim = setTimeout(function () { oculta(slides[ant]); oculta(oimgs[ant]); limpa(); }, DUR + 60);
    /* pré-carrega vizinhas */
    [i - 1, i + 1].forEach(function (k) { if (slides[k]) { var im = q(slides[k], '.srv-img'); if (im) { im.loading = 'eager'; oimgs[k].loading = 'eager'; } } });
  }

  function indice() {
    var r = pista.getBoundingClientRect(), total = r.height - window.innerHeight;
    if (total <= 0) { return 0; }
    var p = Math.min(1, Math.max(0, -r.top / total));
    return Math.min(n - 1, Math.floor(p * n));
  }
  var rodando = false;
  function onScroll() {
    if (rodando) { return; }
    rodando = true;
    requestAnimationFrame(function () { rodando = false; vai(indice()); });
  }
  window.addEventListener('scroll', onScroll, { passive: true });
  window.addEventListener('resize', onScroll);

  function paraSlide(i) {
    i = Math.max(0, Math.min(n - 1, i));
    var r = pista.getBoundingClientRect(), total = r.height - window.innerHeight;
    var topo = r.top + window.pageYOffset;
    window.scrollTo({ top: topo + ((i + 0.5) / n) * total, behavior: reduz ? 'auto' : 'smooth' });
  }
  document.getElementById('srvPrev').addEventListener('click', function () { paraSlide(cur - 1); });
  document.getElementById('srvNext').addEventListener('click', function () { paraSlide(cur + 1); });
  vai(indice());
})();
