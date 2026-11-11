/* Serviços: slider timeline (exemplo adaptado para o Swiper 11) */
window.addEventListener('load', function () {
  if (!window.Swiper) { return; }
  var slides = document.querySelectorAll('.timeline .swiper-slide');
  new Swiper('.timeline .swiper-container', {
    direction: 'vertical',
    loop: false,
    speed: 1600,
    touchReleaseOnEdges: true,
    pagination: {
      el: '.timeline .swiper-pagination',
      clickable: true,
      renderBullet: function (index, className) {
        var year = slides[index].getAttribute('data-year');
        return '<span class="' + className + '">' + year + '</span>';
      }
    },
    navigation: {
      nextEl: '.timeline .swiper-button-next',
      prevEl: '.timeline .swiper-button-prev'
    },
    breakpoints: {
      768: {
        direction: 'horizontal'
      }
    }
  });
});
