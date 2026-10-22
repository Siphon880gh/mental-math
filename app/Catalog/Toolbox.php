<?php

declare(strict_types=1);

namespace Reflex\Catalog;

final class Toolbox
{
    /** @return array{intro: string, masters: list<array{id: string, title: string, rule: string, familyIds: list<string>}>, progression: list<array{step: int, title: string, familyIds: list<string>}>, notes: list<array{title: string, body: string}>} */
    public static function data(): array
    {
        /** @var array{intro: string, masters: list<array{id: string, title: string, rule: string, familyIds: list<string>}>, progression: list<array{step: int, title: string, familyIds: list<string>}>, notes: list<array{title: string, body: string}>} */
        return Json::load('toolbox.json');
    }

    /** @return list<string> */
    public static function referencedFamilyIds(): array
    {
        $data = self::data();
        $ids = [];
        foreach ([...$data['masters'], ...$data['progression']] as $row) {
            foreach ($row['familyIds'] as $id) {
                $ids[$id] = true;
            }
        }

        return array_keys($ids);
    }
}
