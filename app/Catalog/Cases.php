<?php

declare(strict_types=1);

namespace Reflex\Catalog;

final class Cases
{
    /** @return array{packs: list<array{id: string, title: string, summary: string}>, cases: list<array<string, mixed>>} */
    private static function data(): array
    {
        /** @var array{packs: list<array{id: string, title: string, summary: string}>, cases: list<array<string, mixed>>} */
        return Json::load('cases.json');
    }

    /** @return list<array{id: string, title: string, summary: string}> */
    public static function packs(): array
    {
        return self::data()['packs'];
    }

    /** @return list<array<string, mixed>> */
    public static function all(): array
    {
        return self::data()['cases'];
    }

    /** @return ?array{id: string, title: string, summary: string} */
    public static function pack(string $id): ?array
    {
        foreach (self::packs() as $pack) {
            if ($pack['id'] === $id) {
                return $pack;
            }
        }

        return null;
    }

    /** @return list<array<string, mixed>> */
    public static function forPack(string $packId): array
    {
        return array_values(array_filter(self::all(), static fn (array $row) => $row['packId'] === $packId));
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
