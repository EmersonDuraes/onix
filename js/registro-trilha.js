(function () {
  var t = document.getElementById('regTrilha');
  if (!t) { return; }
  if (!('IntersectionObserver' in window)) { t.classList.add('on'); return; }
  new IntersectionObserver(function (e, o) {
    if (e[0].isIntersecting) { t.classList.add('on'); o.disconnect(); }
  }, { threshold: 0.25 }).observe(t);
})();
