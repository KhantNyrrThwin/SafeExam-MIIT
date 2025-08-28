<?php
declare(strict_types=1);

require_once __DIR__ . '/../../../config/cors.php';
require_once __DIR__ . '/../../../config/config.php';
require_once __DIR__ . '/../../../lib/db.php';

handle_cors();
require_method('GET');
require_role(['teacher','admin','student']);

try {
    $pdo = get_pdo();
    if (($_SESSION['role'] ?? '') === 'teacher') {
        $stmt = $pdo->prepare('SELECT paper_id, filename, upload_date FROM exam_papers WHERE teacher_id = ? ORDER BY upload_date DESC');
        $stmt->execute([(int)$_SESSION['user_id']]);
    } elseif (($_SESSION['role'] ?? '') === 'admin') {
        $stmt = $pdo->query('SELECT paper_id, filename, upload_date FROM exam_papers ORDER BY upload_date DESC');
    } else { // student
        $stmt = $pdo->query('SELECT paper_id, filename, upload_date FROM exam_papers ORDER BY upload_date DESC');
    }
    $rows = $stmt->fetchAll();
    send_json(['papers' => $rows]);
} catch (Throwable $e) {
    send_json(['error' => 'Server error'], 500);
}

