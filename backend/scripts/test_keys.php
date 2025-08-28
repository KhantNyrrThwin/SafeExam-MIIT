<?php
$keysDir = __DIR__ . '/../keys';
if (!is_dir($keysDir)) mkdir($keysDir, 0777, true);

$config = [
    "private_key_bits" => 2048,
    "private_key_type" => OPENSSL_KEYTYPE_RSA,
];

$res = openssl_pkey_new($config);

if ($res === false) {
    die("Failed: " . openssl_error_string());
}

// Extract private key
openssl_pkey_export($res, $privKey);
file_put_contents("$keysDir/private_key.pem", $privKey);

// Extract public key
$pubKey = openssl_pkey_get_details($res)['key'];
file_put_contents("$keysDir/public_key.pem", $pubKey);

echo "Keys generated successfully!";
?>
