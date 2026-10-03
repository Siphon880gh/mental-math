<?php

declare(strict_types=1);

if (PHP_VERSION_ID < 70400) {
    http_response_code(500);
    header('Content-Type: text/plain; charset=UTF-8');
    echo "Mental Math Trainer needs PHP 7.4 or newer.\n";
    echo 'This request is using PHP ' . PHP_VERSION . ".\n\n";
    echo "MAMP: Preferences → PHP → 7.4.33 or newer, then restart Apache.\n";
    exit(1);
}

const ROOT = __DIR__ . '/..';

$autoload = ROOT . '/vendor/autoload.php';
// This repository's development dependencies (PHPUnit 11) need PHP 8.2.
// On PHP 7.4, bypass their Composer platform check and use the small app
// autoloader below instead.
if (PHP_VERSION_ID >= 80200 && is_file($autoload)) {
    require $autoload;

    return;
}

// The running app has no production packages. Keep Composer optional so a
// normal PHP/Apache install can serve this folder immediately. Composer is
// still useful for PHPUnit and development tooling.
require ROOT . '/app/helpers.php';
spl_autoload_register(static function (string $class): void {
    $prefix = 'Reflex\\';
    if (!str_starts_with($class, $prefix)) {
        return;
    }

    $relative = substr($class, strlen($prefix));
    $file = ROOT . '/app/' . str_replace('\\', '/', $relative) . '.php';
    if (is_file($file)) {
        require $file;
    }
});
