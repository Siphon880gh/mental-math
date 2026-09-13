<?php

declare(strict_types=1);

if (PHP_VERSION_ID < 80200) {
    http_response_code(500);
    header('Content-Type: text/plain; charset=UTF-8');
    echo "Mental Math Trainer needs PHP 8.2 or newer.\n";
    echo 'This request is using PHP ' . PHP_VERSION . ".\n\n";
    echo "MAMP: Preferences → PHP → 8.2.0, then restart Apache.\n";
    echo "Or from this folder: composer serve  (http://localhost:8080)\n";
    exit(1);
}

const ROOT = __DIR__ . '/..';

$autoload = ROOT . '/vendor/autoload.php';
if (!is_file($autoload)) {
    fwrite(STDERR, "Run composer install first.\n");
    exit(1);
}

require $autoload;
