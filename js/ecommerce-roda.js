/* E-commerce: roda de cartas. A seção fica fixa e a rolagem da página gira a roda (sem depender de recursos novos do navegador) */
(function () {
  var sec = document.getElementById("marketplace");
  if (!sec) { return; }
  var track = sec.querySelector(".ecx-track");
  var wheel = sec.querySelector(".ecx-wheel");
  var cards = Array.prototype.slice.call(sec.querySelectorAll(".ecx-card"));
  var texts = Array.prototype.slice.call(sec.querySelectorAll(".ecx-text"));
  var dots = Array.prototype.slice.call(sec.querySelectorAll(".ecx-dot"));
  var n = cards.length;
  var atual = -1;
  var ticking = false;

  function mostrar(i) {
    if (i === atual) { return; }
    atual = i;
    wheel.style.setProperty("--a", i);
    cards.forEach(function (c, k) {
      var d = Math.abs(k - i);
      c.classList.toggle("is-active", d === 0);
      c.classList.toggle("is-near", d === 1);
    });
    texts.forEach(function (t, k) { t.classList.toggle("is-active", k === i); if (k === i) { t.scrollTop = 0; } });
    dots.forEach(function (b, k) { b.classList.toggle("is-active", k === i); b.setAttribute("aria-selected", k === i ? "true" : "false"); });
  }

  function medir() {
    var r = track.getBoundingClientRect();
    var total = track.offsetHeight - window.innerHeight;
    var p = total > 0 ? Math.min(1, Math.max(0, -r.top / total)) : 0;
    sec.classList.toggle("is-started", p > 0.02);
    mostrar(Math.round(p * (n - 1)));
    ticking = false;
  }
  function onScroll() { if (!ticking) { ticking = true; window.requestAnimationFrame(medir); } }

  window.addEventListener("scroll", onScroll, { passive: true });
  window.addEventListener("resize", onScroll);

  /* bolinhas: levam direto para a carta escolhida */
  dots.forEach(function (b) {
    b.addEventListener("click", function () {
      var i = parseInt(b.getAttribute("data-i"), 10);
      var total = track.offsetHeight - window.innerHeight;
      var topo = track.getBoundingClientRect().top + window.pageYOffset;
      window.scrollTo({ top: topo + (n > 1 ? (i / (n - 1)) * total : 0) + (i === 0 ? 0 : 1), behavior: "smooth" });
    });
  });

  mostrar(0);
  medir();
})();
