<?php
declare(strict_types=1);

require_once __DIR__ . '/../../../config/cors.php';
require_once __DIR__ . '/../../../config/config.php';
require_once __DIR__ . '/../../../lib/db.php';
require_once __DIR__ . '/../../../lib/crypto.php';

handle_cors();
require_method('POST');
require_role(['teacher']);

if (!isset($_FILES['file']) || !is_uploaded_file($_FILES['file']['tmp_name'])) {
    send_json(['error' => 'No file uploaded'], 400);
}

$file = $_FILES['file'];
$filename = basename($file['name']);
$bytes = file_get_contents($file['tmp_name']);
if ($bytes === false) {
    send_json(['error' => 'Failed to read uploaded file'], 500);
}

try {
    $encrypted = hybrid_encrypt_bytes($bytes);
    $pdo = get_pdo();
    $stmt = $pdo->prepare('INSERT INTO exam_papers (teacher_id, filename, encrypted_key, iv, tag, encrypted_data) VALUES (?, ?, ?, ?, ?, ?)');
    $stmt->bindValue(1, (int)$_SESSION['user_id'], PDO::PARAM_INT);
    $stmt->bindValue(2, $filename, PDO::PARAM_STR);
    $stmt->bindValue(3, $encrypted['encrypted_key'], PDO::PARAM_LOB);
    $stmt->bindValue(4, $encrypted['iv'], PDO::PARAM_LOB);
    $stmt->bindValue(5, $encrypted['tag'], PDO::PARAM_LOB);
    $stmt->bindValue(6, $encrypted['ciphertext'], PDO::PARAM_LOB);
    $stmt->execute();

    send_json(['ok' => true, 'paper_id' => (int)$pdo->lastInsertId()]);
} catch (Throwable $e) {
    send_json(['error' => 'Encryption or save failed'], 500);
}

