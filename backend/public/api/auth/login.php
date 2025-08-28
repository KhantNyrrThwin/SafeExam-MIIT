<?php
declare(strict_types=1);

require_once __DIR__ . '/../../../config/cors.php';
require_once __DIR__ . '/../../../config/config.php';
require_once __DIR__ . '/../../../lib/db.php';

handle_cors();
require_method('POST');

$input = [];
if (($_SERVER['CONTENT_TYPE'] ?? '') === 'application/json') {
    $raw = file_get_contents('php://input');
    $input = json_decode($raw ?: '[]', true) ?: [];
} else {
    $input = $_POST;
}

$username = trim((string)($input['username'] ?? ''));
$password = (string)($input['password'] ?? '');

if ($username === '' || $password === '') {
    send_json(['error' => 'Username and password are required'], 400);
}

try {
    $pdo = get_pdo();
    $stmt = $pdo->prepare('SELECT user_id, username, password, role FROM users WHERE username = ? LIMIT 1');
    $stmt->execute([$username]);
    $user = $stmt->fetch();

    if (!$user || !password_verify($password, $user['password'])) {
        send_json(['error' => 'Invalid credentials'], 401);
    }

    $_SESSION['user_id'] = (int)$user['user_id'];
    $_SESSION['username'] = $user['username'];
    $_SESSION['role'] = $user['role'];

    send_json(['user' => ['user_id' => (int)$user['user_id'], 'username' => $user['username'], 'role' => $user['role']]]);
} catch (Throwable $e) {
    send_json(['error' => 'Server error'], 500);
}

