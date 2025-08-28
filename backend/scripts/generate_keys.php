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

$config = [
    'private_key_bits' => 2048,
    'private_key_type' => OPENSSL_KEYTYPE_RSA,
];

$res = openssl_pkey_new($config);
if ($res === false) {
    fwrite(STDERR, "Failed to generate key pair" . PHP_EOL);
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

