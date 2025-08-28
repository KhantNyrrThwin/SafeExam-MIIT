<?php
declare(strict_types=1);

require_once __DIR__ . '/config.php';

function handle_cors(): void {
    $origin = $_SERVER['HTTP_ORIGIN'] ?? '';
    $allowedOrigins = array_map('trim', explode(',', CORS_ALLOWED_ORIGINS));

    if ($origin && in_array($origin, $allowedOrigins, true)) {
        header('Access-Control-Allow-Origin: ' . $origin);
        if (CORS_ALLOW_CREDENTIALS) {
            header('Access-Control-Allow-Credentials: true');
        }
    }

    header('Access-Control-Allow-Headers: Content-Type, Authorization');
    header('Access-Control-Allow-Methods: GET, POST, OPTIONS');

    if (strtoupper($_SERVER['REQUEST_METHOD'] ?? '') === 'OPTIONS') {
        http_response_code(204);
        exit;
    }
}

