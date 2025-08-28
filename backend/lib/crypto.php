<?php
declare(strict_types=1);

require_once __DIR__ . '/../config/config.php';

function ensure_keys_exist(): void {
    if (!is_dir(KEYS_DIR)) {
        mkdir(KEYS_DIR, 0700, true);
    }
}

function get_public_key_resource() {
    ensure_keys_exist();
    $pubPath = KEYS_DIR . '/public.pem';
    if (!file_exists($pubPath)) {
        throw new RuntimeException('Public key not found at ' . $pubPath);
    }
    $pem = file_get_contents($pubPath);
    if ($pem === false) {
        throw new RuntimeException('Failed to read public key');
    }
    $key = openssl_pkey_get_public($pem);
    if ($key === false) {
        throw new RuntimeException('Invalid public key');
    }
    return $key;
}

function get_private_key_resource() {
    ensure_keys_exist();
    $privPath = KEYS_DIR . '/private.pem';
    if (!file_exists($privPath)) {
        throw new RuntimeException('Private key not found at ' . $privPath);
    }
    $pem = file_get_contents($privPath);
    if ($pem === false) {
        throw new RuntimeException('Failed to read private key');
    }
    $key = openssl_pkey_get_private($pem);
    if ($key === false) {
        throw new RuntimeException('Invalid private key');
    }
    return $key;
}

/**
 * Hybrid encryption: AES-256-GCM + RSA-OAEP for key wrapping
 *
 * @return array{ciphertext:string, encrypted_key:string, iv:string, tag:string}
 */
function hybrid_encrypt_bytes(string $plaintext): array {
    $publicKey = get_public_key_resource();

    $symmetricKey = random_bytes(32); // 256-bit AES key
    $iv = random_bytes(12); // 96-bit IV for GCM

    $tag = '';
    $ciphertext = openssl_encrypt(
        $plaintext,
        'aes-256-gcm',
        $symmetricKey,
        OPENSSL_RAW_DATA,
        $iv,
        $tag
    );

    if ($ciphertext === false) {
        throw new RuntimeException('AES-GCM encryption failed');
    }

    $encryptedKey = '';
    $ok = openssl_public_encrypt($symmetricKey, $encryptedKey, $publicKey, OPENSSL_PKCS1_OAEP_PADDING);
    if (!$ok) {
        throw new RuntimeException('RSA public key encryption failed');
    }

    return [
        'ciphertext' => $ciphertext,
        'encrypted_key' => $encryptedKey,
        'iv' => $iv,
        'tag' => $tag,
    ];
}

/**
 * @param string $encryptedKey RSA-wrapped AES key
 * @param string $iv GCM IV
 * @param string $tag GCM tag
 * @param string $ciphertext Ciphertext bytes
 */
function hybrid_decrypt_bytes(string $encryptedKey, string $iv, string $tag, string $ciphertext): string {
    $privateKey = get_private_key_resource();

    $symmetricKey = '';
    $ok = openssl_private_decrypt($encryptedKey, $symmetricKey, $privateKey, OPENSSL_PKCS1_OAEP_PADDING);
    if (!$ok) {
        throw new RuntimeException('RSA private key decryption failed');
    }

    $plaintext = openssl_decrypt(
        $ciphertext,
        'aes-256-gcm',
        $symmetricKey,
        OPENSSL_RAW_DATA,
        $iv,
        $tag
    );

    if ($plaintext === false) {
        throw new RuntimeException('AES-GCM decryption failed');
    }

    return $plaintext;
}

