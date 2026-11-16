/* Livro (#overview): garante a virada de página mesmo se outro script do site bloquear o clique no label */
(function(){
  window.addEventListener('click',function(e){
    var l=e.target&&e.target.closest?e.target.closest('#overview label[for^="cat-"]'):null;
    if(!l)return;
    var r=document.getElementById(l.getAttribute('for'));
    if(!r)return;
    e.preventDefault();
    if(!r.checked){r.checked=true;r.dispatchEvent(new Event('change',{bubbles:true}));}
  },true);
})();
