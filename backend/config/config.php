<?php
declare(strict_types=1);

// Basic app configuration for DB, sessions, paths, and CORS

// Allow overriding via environment variables when deployed
$env = getenv();

define('APP_ENV', $env['APP_ENV'] ?? 'development');
define('DB_HOST', $env['DB_HOST'] ?? '127.0.0.1');
define('DB_PORT', (int)($env['DB_PORT'] ?? 3306));
define('DB_NAME', $env['DB_NAME'] ?? 'safe_exam_miit');
define('DB_USER', $env['DB_USER'] ?? 'root');
define('DB_PASS', $env['DB_PASS'] ?? '');

// Paths
define('BASE_PATH', realpath(__DIR__ . '/..'));
define('KEYS_DIR', BASE_PATH . '/keys');

// CORS
define('CORS_ALLOWED_ORIGINS', $env['CORS_ALLOWED_ORIGINS'] ?? 'http://localhost:5173,http://127.0.0.1:5173');
define('CORS_ALLOW_CREDENTIALS', true);

// Sessions
if (session_status() === PHP_SESSION_NONE) {
    $secure = false; // set true when using HTTPS
    session_set_cookie_params([
        'lifetime' => 60 * 60 * 8,
        'path' => '/',
        'domain' => '',
        'secure' => $secure,
        'httponly' => true,
        'samesite' => 'Lax',
    ]);
    session_start();
}

// JSON helpers
function send_json($data, int $status = 200): void {
    http_response_code($status);
    header('Content-Type: application/json');
    echo json_encode($data);
    exit;
}

function require_method(string $method): void {
    if (strtoupper($_SERVER['REQUEST_METHOD'] ?? '') !== strtoupper($method)) {
        send_json(['error' => 'Method Not Allowed'], 405);
    }
}

function require_role(array $allowedRoles): void {
    $role = $_SESSION['role'] ?? null;
    if (!$role || !in_array($role, $allowedRoles, true)) {
        send_json(['error' => 'Forbidden'], 403);
    }
}

