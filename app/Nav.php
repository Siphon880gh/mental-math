<?php

declare(strict_types=1);

namespace Reflex;

use Reflex\Catalog\Guides;
use Reflex\Catalog\Scenarios;
use Reflex\Catalog\Tracks;

final class Nav
{
    public static function activeTrack(string $path): ?string
    {
        if ($path === '/track-a' || str_starts_with($path, '/track-a/')) {
            return 'quick';
        }
        if ($path === '/track-b' || str_starts_with($path, '/track-b/')) {
            return 'stakeholder';
        }
        if (preg_match('#^/guides/([^/]+)$#', $path, $m)) {
            return Guides::get($m[1])['track'] ?? null;
        }
        if (preg_match('#^/coach/([^/]+)$#', $path, $m)) {
            $slug = $m[1];
            if (in_array($slug, Tracks::trackBFamilyIds(), true)) {
                return 'stakeholder';
            }
            if (in_array($slug, Tracks::trackAFamilyIds(), true)) {
                return 'quick';
            }

            return null;
        }
        if (preg_match('#^/scenarios/([^/]+)$#', $path, $m)) {
            return Scenarios::get($m[1])['track'] ?? null;
        }

        return null;
    }
}
