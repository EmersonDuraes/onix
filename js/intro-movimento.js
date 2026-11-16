/* Abertura: respeita quem prefere menos movimento (vídeo parado no primeiro quadro) */
(function () {
  var v = document.querySelector('#inicio .intro-video');
  if (v && window.matchMedia('(prefers-reduced-motion: reduce)').matches) { v.removeAttribute('autoplay'); v.pause(); }
})();
