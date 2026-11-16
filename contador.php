<?php
// Contador de visitas — Onix Gestão Contábil
// Conta 1 visita por navegador a cada 24 h (cookie). Guarda o total e as visitas do dia em contador-dados.txt
header('Content-Type: application/json; charset=utf-8');
header('Cache-Control: no-store');
date_default_timezone_set('America/Sao_Paulo');

$arq = __DIR__ . '/contador-dados.txt';
$cookie = 'onix_visita';

$fp = @fopen($arq, 'c+');
if ($fp === false) {
    http_response_code(500);
    echo json_encode(['ok' => false]);
    exit;
}
flock($fp, LOCK_EX);
$bruto = trim((string) stream_get_contents($fp));
$d = json_decode($bruto, true);
if (!is_array($d)) {                       // arquivo antigo (só o número) ou vazio
    $d = ['total' => (int) $bruto, 'dia' => '', 'hoje' => 0];
}
$total = (int) ($d['total'] ?? 0);
$hoje  = (int) ($d['hoje'] ?? 0);
$dia   = (string) ($d['dia'] ?? '');
$agora = date('Y-m-d');
if ($dia !== $agora) { $dia = $agora; $hoje = 0; }

$ehBot = isset($_SERVER['HTTP_USER_AGENT']) && preg_match('/bot|crawl|spider|slurp|facebookexternalhit|preview/i', $_SERVER['HTTP_USER_AGENT']);
if (!$ehBot && $_SERVER['REQUEST_METHOD'] === 'POST' && empty($_COOKIE[$cookie])) {
    $total++;
    $hoje++;
    setcookie($cookie, '1', time() + 86400, '/', '', !empty($_SERVER['HTTPS']), true);
}
ftruncate($fp, 0);
rewind($fp);
fwrite($fp, json_encode(['total' => $total, 'dia' => $dia, 'hoje' => $hoje]));
flock($fp, LOCK_UN);
fclose($fp);

echo json_encode(['ok' => true, 'total' => $total, 'hoje' => $hoje]);
