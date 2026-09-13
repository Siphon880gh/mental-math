<?php

declare(strict_types=1);

namespace Reflex\Catalog;

use RuntimeException;

final class Json
{
    /** @var array<string, mixed> */
    private static array $cache = [];

    public static function load(string $relative): mixed
    {
        if (!array_key_exists($relative, self::$cache)) {
            $path = ROOT . '/data/' . $relative;
            $raw = @file_get_contents($path);
            if ($raw === false) {
                throw new RuntimeException('Missing data file: ' . $relative);
            }
            self::$cache[$relative] = json_decode($raw, true, 512, JSON_THROW_ON_ERROR);
        }

        return self::$cache[$relative];
    }
}
