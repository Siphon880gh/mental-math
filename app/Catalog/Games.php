<?php

declare(strict_types=1);

namespace Reflex\Catalog;

final class Games
{
    /** @return array{games: list<array<string, mixed>>, skips: list<array{familyId: string, reason: string}>} */
    private static function data(): array
    {
        /** @var array{games: list<array<string, mixed>>, skips: list<array{familyId: string, reason: string}>} */
        return Json::load('games.json');
    }

    /** @return list<array{slug: string, title: string, summary: string, familyId: string, relatedGuide?: string}> */
    public static function all(): array
    {
        return self::data()['games'];
    }

    /** @return list<array{familyId: string, reason: string}> */
    public static function skips(): array
    {
        return self::data()['skips'];
    }

    /** @return ?array{slug: string, title: string, summary: string, familyId: string, relatedGuide?: string} */
    public static function get(string $slug): ?array
    {
        foreach (self::all() as $game) {
            if ($game['slug'] === $slug) {
                return $game;
            }
        }

        return null;
    }
}
