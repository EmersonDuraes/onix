(function(){
  var modal = document.getElementById('onixModal');
  var player = document.getElementById('onixPlayer');
  var fechar = document.getElementById('onixFechar');
  var ultimo = null;

  function abrir(btn){
    ultimo = btn;
    player.poster = btn.getAttribute('data-capa') || '';
    player.src = btn.getAttribute('data-video');
    modal.classList.add('aberto');
    document.body.style.overflow = 'hidden';
    var p = player.play();
    if (p && p.catch) { p.catch(function(){ /* se o navegador bloquear, o usuário usa o botão play */ }); }
    fechar.focus();
  }
  function fecharModal(){
    player.pause();
    player.removeAttribute('src');
    player.load();
    modal.classList.remove('aberto');
    document.body.style.overflow = '';
    if (ultimo) { ultimo.focus(); }
  }

  /* escuta o clique ANTES do Swiper (fase de captura), para o cubo nunca bloquear o play */
  document.addEventListener('click', function(e){
    var t = e.target;
    var b = t.closest ? t.closest('.onix-videos [data-video]') : null;
    if (!b && t.closest) {
      var cubo = t.closest('.dep-swiper');
      var pb = cubo ? cubo.querySelector('.swiper-slide-active .dep-play') : null;
      if (pb) {
        var r = pb.getBoundingClientRect();
        if (e.clientX >= r.left && e.clientX <= r.right && e.clientY >= r.top && e.clientY <= r.bottom) { b = pb; }
      }
    }
    if (!b) { return; }
    e.preventDefault();
    e.stopPropagation();
    abrir(b);
  }, true);
  fechar.addEventListener('click', fecharModal);
  modal.addEventListener('click', function(e){ if (e.target === modal) { fecharModal(); } });
  document.addEventListener('keydown', function(e){
    if (e.key === 'Escape' && modal.classList.contains('aberto')) { fecharModal(); }
  });
})();
