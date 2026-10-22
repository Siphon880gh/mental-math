<?php

declare(strict_types=1);

$uri = parse_url($_SERVER['REQUEST_URI'] ?? '/', PHP_URL_PATH) ?: '/';
$uri = rawurldecode($uri);

// asset_url() links /public/assets/... when the project root is the document
// root (as with this router) and /assets/... when public/ is; serve both.
if (preg_match('#^(?:/public)?/assets(/.*)$#', $uri, $m) === 1) {
    $assetRoot = realpath(__DIR__ . '/public/assets');
    $file = realpath(__DIR__ . '/public/assets' . $m[1]);
    if ($assetRoot !== false && $file !== false && strpos($file, $assetRoot . DIRECTORY_SEPARATOR) === 0 && is_file($file)) {
        $ext = strtolower(pathinfo($file, PATHINFO_EXTENSION));
        $types = [
            'css' => 'text/css; charset=UTF-8',
            'js' => 'text/javascript; charset=UTF-8',
            'map' => 'application/json',
            'svg' => 'image/svg+xml',
            'png' => 'image/png',
            'jpg' => 'image/jpeg',
            'jpeg' => 'image/jpeg',
            'gif' => 'image/gif',
            'webp' => 'image/webp',
            'ico' => 'image/x-icon',
            'woff' => 'font/woff',
            'woff2' => 'font/woff2',
        ];
        header('Content-Type: ' . ($types[$ext] ?? 'application/octet-stream'));
        header('Content-Length: ' . (string) filesize($file));
        readfile($file);

        return true;
    }
}

require __DIR__ . '/index.php';
