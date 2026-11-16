/* Depoimentos: 6 cubos (efeito "cube" do Swiper). Computador: gira ao passar o mouse. Celular/tablet: gira ao tocar. */
(function () {
  if (!window.Swiper) { return; }
  var cubos = document.querySelectorAll('.dep-swiper');
  if (!cubos.length) { return; }
  var comMouse = window.matchMedia('(hover: hover) and (pointer: fine)').matches;

  cubos.forEach(function (el) {
    var sw = new Swiper(el, {
      effect: 'cube',
      grabCursor: true,
      speed: 700,
      cubeEffect: { shadow: false, slideShadows: true }
    });
    if (comMouse) {
      el.addEventListener('mouseenter', function () { sw.slideTo(1); });
      el.addEventListener('mouseleave', function () { sw.slideTo(0); });
    } else {
      el.addEventListener('click', function (e) {
        if (e.target.closest('.dep-play')) { return; }
        sw.slideTo(sw.activeIndex === 0 ? 1 : 0);
      });
    }
    /* teclado: ao focar o botão de play, o cubo mostra o cartão */
    el.addEventListener('focusin', function () { sw.slideTo(1); });
  });
})();
