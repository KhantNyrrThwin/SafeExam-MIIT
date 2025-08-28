<?php
declare(strict_types=1);

require_once __DIR__ . '/../config/config.php';

ensure_keys_dir:
if (!is_dir(KEYS_DIR)) {
    if (!mkdir(KEYS_DIR, 0700, true) && !is_dir(KEYS_DIR)) {
        fwrite(STDERR, "Failed to create keys directory: " . KEYS_DIR . PHP_EOL);
        exit(1);
    }
}

$requestedBits = (int)($_ENV['RSA_KEY_BITS'] ?? getenv('RSA_KEY_BITS') ?: 0);
if ($requestedBits <= 0) {
    $requestedBits = 2048;
}

$isWindows = strtoupper(substr(PHP_OS_FAMILY, 0, 3)) === 'WIN';

// Try requested/2048 first
$config = [
    'private_key_bits' => $requestedBits,
    'private_key_type' => OPENSSL_KEYTYPE_RSA,
];

$res = openssl_pkey_new($config);

// On some Windows OpenSSL builds, 2048 may fail with cryptic system errors.
// Fallback to 1024 if generation fails and we're on Windows (or when explicitly requested fails).
if ($res === false && ($isWindows || $requestedBits > 1024)) {
    fwrite(STDERR, "Primary key generation failed for {$requestedBits} bits. Trying 1024..." . PHP_EOL);
    $config['private_key_bits'] = 1024;
    $res = openssl_pkey_new($config);
}

if ($res === false) {
    $err = function_exists('openssl_error_string') ? (openssl_error_string() ?: 'unknown error') : 'unknown error';
    fwrite(STDERR, "Failed to generate key pair: {$err}" . PHP_EOL);
    fwrite(STDERR, "Hints: On Windows, try running from an elevated shell or set RSA_KEY_BITS=1024" . PHP_EOL);
    exit(1);
}

openssl_pkey_export($res, $privPem);
$pubDetails = openssl_pkey_get_details($res);
$pubPem = $pubDetails['key'] ?? '';

file_put_contents(KEYS_DIR . '/private.pem', $privPem);
chmod(KEYS_DIR . '/private.pem', 0600);
file_put_contents(KEYS_DIR . '/public.pem', $pubPem);
chmod(KEYS_DIR . '/public.pem', 0644);

echo "Keys generated in: " . KEYS_DIR . PHP_EOL;