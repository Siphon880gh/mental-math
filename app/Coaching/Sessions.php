<?php

declare(strict_types=1);

namespace Reflex\Coaching;

use Reflex\Catalog\Json;

final class Sessions
{
    /** @var array<string, array<string, mixed>>|null */
    private static ?array $all = null;

    /** @return array<string, array{meta: array<string, mixed>, tree: array{start: string, nodes: array<string, array<string, mixed>>}}> */
    public static function all(): array
    {
        if (self::$all !== null) {
            return self::$all;
        }
        $out = [];
        foreach (glob(ROOT . '/data/coaching/*.json') ?: [] as $file) {
            $slug = basename($file, '.json');
            $session = Json::load('coaching/' . $slug . '.json');
            $out[$slug] = $session;
        }
        ksort($out);
        self::$all = $out;

        return $out;
    }

    /** @return list<array<string, mixed>> */
    public static function listValidMeta(): array
    {
        $metas = [];
        foreach (self::all() as $session) {
            if (Validate::session($session)['ok']) {
                $metas[] = $session['meta'];
            }
        }
        usort($metas, static fn (array $a, array $b) => strcmp((string) $a['slug'], (string) $b['slug']));

        return $metas;
    }

    /**
     * @return array{ok: true, session: array<string, mixed>}|array{ok: false, error: string, issues?: list<array<string, mixed>>}
     */
    public static function load(string $slug): array
    {
        $all = self::all();
        if (!isset($all[$slug])) {
            return ['ok' => false, 'error' => 'not_found'];
        }
        $validation = Validate::session($all[$slug]);
        if (!$validation['ok']) {
            return ['ok' => false, 'error' => 'invalid', 'issues' => $validation['issues']];
        }

        return ['ok' => true, 'session' => $all[$slug]];
    }

    public static function has(string $slug): bool
    {
        return self::load($slug)['ok'] === true;
    }
}
