<?php
declare(strict_types=1);

require_once __DIR__ . '/../../config/cors.php';
require_once __DIR__ . '/../../config/config.php';

handle_cors();

send_json(['status' => 'ok', 'env' => APP_ENV]);

