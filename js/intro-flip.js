/* Abertura: a marca troca de layout (final > plain > columns > grid) com GSAP Flip */
(function () {
  var container = document.getElementById('onixFlip');
  if (!container || !window.gsap || !window.Flip) { return; }          /* sem GSAP, fica o layout final estático */
  if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) { return; }
  gsap.registerPlugin(Flip);

  var layouts = ['is-final', 'is-plain', 'is-columns', 'is-grid'];
  var atual = 0;

  function proximo() {
    var estado = Flip.getState('.on-letter, .on-sub', { props: 'color,backgroundColor', simple: true });

    container.classList.remove(layouts[atual]);
    atual = (atual + 1) % layouts.length;
    container.classList.add(layouts[atual]);

    Flip.from(estado, {
      absolute: true,
      stagger: 0.07,
      duration: 0.7,
      ease: 'power2.inOut',
      spin: atual === 0,
      simple: true,
      onEnter: function (els, anim) { return gsap.fromTo(els, { opacity: 0 }, { opacity: 1, delay: anim.duration() - 0.1 }); },
      onLeave: function (els) { return gsap.to(els, { opacity: 0 }); }
    });

    gsap.delayedCall(atual === 0 ? 3.5 : 1.5, proximo);
  }

  gsap.delayedCall(1, proximo);
})();
