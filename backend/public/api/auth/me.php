<?php
declare(strict_types=1);

require_once __DIR__ . '/../../../config/cors.php';
require_once __DIR__ . '/../../../config/config.php';

handle_cors();

$userId = $_SESSION['user_id'] ?? null;
if (!$userId) {
    send_json(['user' => null]);
}

send_json(['user' => [
    'user_id' => (int)$_SESSION['user_id'],
    'username' => (string)$_SESSION['username'],
    'role' => (string)$_SESSION['role'],
]]);

