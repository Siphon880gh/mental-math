<?php

declare(strict_types=1);

namespace Reflex\Catalog;

final class Scenarios
{
    /** @return list<array<string, mixed>> */
    public static function all(): array
    {
        /** @var list<array<string, mixed>> $rows */
        $rows = Json::load('scenarios.json');

        return array_map([self::class, 'mixChoices'], $rows);
    }

    /**
     * The data file usually lists the right answer first. Put choices in a
     * stable order keyed on the scenario and choice ids so position is not a
     * tell, while every page load shows the same order.
     *
     * @param array<string, mixed> $row
     * @return array<string, mixed>
     */
    private static function mixChoices(array $row): array
    {
        $choices = $row['choices'] ?? [];
        if (is_array($choices) && count($choices) > 1) {
            $id = (string) ($row['id'] ?? '');
            usort($choices, static fn (array $a, array $b): int => crc32($id . ':' . ($a['id'] ?? '')) <=> crc32($id . ':' . ($b['id'] ?? '')));
            $row['choices'] = $choices;
        }

        return $row;
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
