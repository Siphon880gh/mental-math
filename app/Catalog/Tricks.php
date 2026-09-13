<?php

declare(strict_types=1);

namespace Reflex\Catalog;

final class Tricks
{
    /** @return list<array{id: string, familyId: string, title: string, rule: string, example: string, category: string}> */
    public static function all(): array
    {
        /** @var list<array{id: string, familyId: string, title: string, rule: string, example: string, category: string}> */
        return Json::load('tricks.json');
    }

    /** @return ?array{id: string, familyId: string, title: string, rule: string, example: string, category: string} */
    public static function get(string $id): ?array
    {
        foreach (self::all() as $trick) {
            if ($trick['id'] === $id) {
                return $trick;
            }
        }

        return null;
    }

    /** @return list<array{id: string, familyId: string, title: string, rule: string, example: string, category: string}> */
    public static function forFamily(string $familyId): array
    {
        return array_values(array_filter(self::all(), static fn (array $t) => $t['familyId'] === $familyId));
    }
}
