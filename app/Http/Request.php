<?php

declare(strict_types=1);

namespace Reflex\Http;

final class Request
{
    /** @param array<string, string> $query */
    public $method;
    public $path;
    public $query;

    public function __construct(string $method, string $path, array $query = [])
    {
        $this->method = $method;
        $this->path = $path;
        $this->query = $query;
    }

    public static function fromGlobals(): self
    {
        $uri = $_SERVER['REQUEST_URI'] ?? '/';
        $parts = parse_url($uri) ?: [];
        $query = [];
        parse_str($parts['query'] ?? '', $query);
        $query = array_map(static fn ($v) => is_array($v) ? '' : (string) $v, $query);
        $path = $query['route'] ?? ($parts['path'] ?? '/');
        unset($query['route']);

        return new self(
            strtoupper($_SERVER['REQUEST_METHOD'] ?? 'GET'),
            self::normalizePath(self::stripAppBase($path)),
            $query,
        );
    }

    /** @param array<string, string> $query */
    public static function get(string $path, array $query = []): self
    {
        return new self('GET', self::normalizePath($path), $query);
    }

    public static function normalizePath(string $path): string
    {
        if ($path === '' || $path === '/') {
            return '/';
        }
        if (preg_match('#^/index\.php(/.*)?$#', $path, $m) === 1) {
            $path = $m[1] ?? '/';
            if ($path === '') {
                $path = '/';
            }
        }
        if ($path !== '/') {
            $path = rtrim($path, '/') ?: '/';
        }

        return $path === '' ? '/' : $path;
    }

    public static function stripAppBase(string $path): string
    {
        $base = app_base();
        if ($base === '') {
            return $path;
        }
        if ($path === $base) {
            return '/';
        }
        if (str_starts_with($path, $base . '/')) {
            $rest = substr($path, strlen($base));

            return $rest === '' ? '/' : $rest;
        }

        return $path;
    }

    public function query(string $key): ?string
    {
        return $this->query[$key] ?? null;
    }
}
