<script>
document.querySelectorAll('form[data-ajax]').forEach(function (form) {
  var status = form.querySelector('.form-status');
  var botao  = form.querySelector('input[type="submit"]');

  form.addEventListener('submit', function (e) {
    e.preventDefault();
    if (!form.checkValidity()) { form.reportValidity(); return; }

    var valorOriginal = botao.value;
    botao.disabled = true;
    botao.value = 'ENVIANDO...';
    status.textContent = '';

    fetch(form.action, {
      method: 'POST',
      body: new FormData(form),
      headers: { 'Accept': 'application/json' }
    })
    .then(function (res) {
      if (!res.ok) { throw new Error('erro'); }
      form.reset();
      status.style.color = '#2e7d32';
      status.textContent = 'Mensagem enviada com sucesso! Em breve entraremos em contato.';
    })
    .catch(function () {
      status.style.color = '#c62828';
      status.textContent = 'Não foi possível enviar agora. Fale conosco pelo WhatsApp: (11) 98122-8030.';
    })
    .finally(function () {
      botao.disabled = false;
      botao.value = valorOriginal;
    });
  });
});
</script>
