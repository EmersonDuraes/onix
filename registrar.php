<?php
// Aceita apenas envio pelo formulário
if ($_SERVER['REQUEST_METHOD'] !== 'POST') { header('Location: /'); exit; }

// Campo escondido: se vier preenchido, é robô
if (!empty($_POST['_honey'])) { exit('ok'); }

// Limpa os dados (evita injeção de cabeçalho)
function limpa($v) { return trim(str_replace(["\r", "\n"], ' ', strip_tags($v ?? ''))); }

$nome     = limpa($_POST['nome'] ?? '');
$empresa  = limpa($_POST['empresa'] ?? '');
$telefone = limpa($_POST['telefone'] ?? '');
$email    = filter_var($_POST['email'] ?? '', FILTER_VALIDATE_EMAIL);

if ($nome === '' || !$email || $telefone === '') {
    http_response_code(400);
    exit('Preencha todos os campos corretamente.');
}

$para      = 'duraes10duraes@gmail.com';
$remetente = 'contato@onixgestaocontabil.com.br'; // e-mail criado no seu domínio
$assunto   = 'Novo registro de empresa pelo site - Onix Gestão Contábil';

$corpo  = "Nome: $nome\n";
$corpo .= "Empresa: $empresa\n";
$corpo .= "Telefone: $telefone\n";
$corpo .= "E-mail: $email\n";

$headers  = "From: Site Onix <$remetente>\r\n";
$headers .= "Reply-To: $nome <$email>\r\n";
$headers .= "Content-Type: text/plain; charset=UTF-8\r\n";

$assunto_codificado = '=?UTF-8?B?' . base64_encode($assunto) . '?=';

if (mail($para, $assunto_codificado, $corpo, $headers, '-f' . $remetente)) {
    echo 'ok';
} else {
    http_response_code(500);
    echo 'erro';
}
exit;