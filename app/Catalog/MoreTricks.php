<?php

declare(strict_types=1);

namespace Reflex\Catalog;

final class MoreTricks
{
    /** @return list<array<string, mixed>> */
    public static function coverage(): array
    {
        /** @var list<array<string, mixed>> */
        return Json::load('more-tricks.json');
    }

    /** @return list<string> */
    public static function sectionIds(): array
    {
        return array_map(static fn (int $i) => (string) $i, range(1, 42));
    }

    /** @return list<string> */
    public static function masterIds(): array
    {
        return array_map(static fn (int $i) => 'master-' . $i, range(1, 12));
    }
}
