document.querySelectorAll('form[data-ajax]').forEach(function (form) {
  var status = form.querySelector('.form-status');
  var botao  = form.querySelector('[type="submit"]');
  var ehInput = botao.tagName === 'INPUT';
  var escuro = !!form.closest('#register') && !form.closest('.ficha');

  form.addEventListener('submit', function (e) {
    e.preventDefault();
    if (!form.checkValidity()) { form.reportValidity(); return; }

    var valorOriginal = ehInput ? botao.value : botao.innerHTML;
    botao.disabled = true;
    if (ehInput) { botao.value = 'ENVIANDO...'; } else { botao.textContent = 'ENVIANDO...'; }
    status.textContent = '';

    fetch(form.action, { method: 'POST', body: new FormData(form) })
    .then(function (res) {
      if (!res.ok) { throw new Error('erro'); }
      form.reset();
      status.style.color = escuro ? '#a5d6a7' : '#2e7d32';
      status.textContent = 'Mensagem enviada com sucesso! Em breve entraremos em contato.';
    })
    .catch(function () {
      status.style.color = escuro ? '#ffcdd2' : '#c62828';
      status.textContent = 'Não foi possível enviar agora. Fale conosco pelo WhatsApp: (11) 92718-4871.';
    })
    .finally(function () {
      botao.disabled = false;
      if (ehInput) { botao.value = valorOriginal; } else { botao.innerHTML = valorOriginal; }
    });
  });
});
