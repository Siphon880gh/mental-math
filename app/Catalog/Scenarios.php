<?php

declare(strict_types=1);

namespace Reflex\Catalog;

final class Scenarios
{
    /** @return list<array<string, mixed>> */
    public static function all(): array
    {
        /** @var list<array<string, mixed>> */
        return Json::load('scenarios.json');
    }

    /** @return list<array<string, mixed>> */
    public static function forTrack(string $track): array
    {
        return array_values(array_filter(self::all(), static fn (array $row) => $row['track'] === $track));
    }

    /** @return ?array<string, mixed> */
    public static function get(string $id): ?array
    {
        foreach (self::all() as $row) {
            if ($row['id'] === $id) {
                return $row;
            }
        }

        return null;
    }
}
