<?php
declare(strict_types=1);

require_once __DIR__ . '/../../../config/cors.php';
require_once __DIR__ . '/../../../config/config.php';
require_once __DIR__ . '/../../../lib/db.php';
require_once __DIR__ . '/../../../lib/crypto.php';

handle_cors();
require_method('GET');
require_role(['admin']);

$paperId = isset($_GET['paper_id']) ? (int)$_GET['paper_id'] : 0;
if ($paperId <= 0) {
    send_json(['error' => 'paper_id required'], 400);
}

try {
    $pdo = get_pdo();
    $stmt = $pdo->prepare('SELECT filename, encrypted_key, iv, tag, encrypted_data FROM exam_papers WHERE paper_id = ? LIMIT 1');
    $stmt->execute([$paperId]);
    $row = $stmt->fetch();
    if (!$row) {
        send_json(['error' => 'Not found'], 404);
    }

    $plaintext = hybrid_decrypt_bytes($row['encrypted_key'], $row['iv'], $row['tag'], $row['encrypted_data']);

    header('Content-Type: application/octet-stream');
    header('Content-Disposition: attachment; filename="' . $row['filename'] . '"');
    header('Content-Length: ' . strlen($plaintext));
    echo $plaintext;
    exit;
} catch (Throwable $e) {
    send_json(['error' => 'Decryption failed'], 500);
}

