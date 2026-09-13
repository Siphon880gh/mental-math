<?php

declare(strict_types=1);

namespace Reflex\Catalog;

final class Drills
{
    public const PATH_GROUP_IDS = ['anchors', 'magnitude', 'percents', 'conversions', 'break-even'];

    public const BEGINNER_GROUP_MILESTONE = [
        'anchors' => 'E4.M1',
        'magnitude' => 'E4.M1',
        'percents' => 'E4.M2',
        'conversions' => 'E4.M3',
        'break-even' => 'E4.M3',
    ];

    /** @return array{groups: list<array<string, mixed>>, items: list<array<string, mixed>>, pathGroupIds: list<string>} */
    private static function data(): array
    {
        /** @var array{groups: list<array<string, mixed>>, items: list<array<string, mixed>>, pathGroupIds: list<string>} */
        return Json::load('drills.json');
    }

    /** @return list<array{id: string, title: string, summary: string, pathGroup: bool}> */
    public static function groups(): array
    {
        return self::data()['groups'];
    }

    /** @return list<array<string, mixed>> */
    public static function items(): array
    {
        return self::data()['items'];
    }

    /** @return ?array{id: string, title: string, summary: string, pathGroup: bool} */
    public static function group(string $id): ?array
    {
        foreach (self::groups() as $group) {
            if ($group['id'] === $id) {
                return $group;
            }
        }

        return null;
    }

    /** @return list<array<string, mixed>> */
    public static function itemsForGroup(string $groupId): array
    {
        return array_values(array_filter(self::items(), static fn (array $item) => $item['groupId'] === $groupId));
    }
}
