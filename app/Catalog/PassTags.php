<?php

declare(strict_types=1);

namespace Reflex\Catalog;

final class PassTags
{
    public const KEY = 'reflex_core_pass_tags_v1';
    public const FILTERS_KEY = 'reflex_core_pass_filters_v1';

    public const GROUPS = [
        ['id' => 'first-pass', 'label' => 'First-Pass Tag'],
        ['id' => 'second-pass', 'label' => 'Second-Pass Tag'],
    ];

    public const TAGS = [
        ['id' => 'first-no-stick', 'group' => 'first-pass', 'label' => 'Might not have stick for the most part', 'color' => '#9a3412'],
        ['id' => 'first-maybe-stick', 'group' => 'first-pass', 'label' => 'Might not have stick or might have stick', 'color' => '#1d4ed8'],
        ['id' => 'first-attention', 'group' => 'first-pass', 'label' => "Couldn't keep attention on it", 'color' => '#57534e'],
        ['id' => 'first-ready', 'group' => 'first-pass', 'label' => 'Ready to transition', 'color' => '#0f766e'],
        ['id' => 'extreme', 'group' => 'second-pass', 'label' => 'Need extreme review', 'color' => '#c23a2b'],
        ['id' => 'much', 'group' => 'second-pass', 'label' => 'Need much review', 'color' => '#d97706'],
        ['id' => 'unsure', 'group' => 'second-pass', 'label' => 'Unsure if need review or that it sticks', 'color' => '#7c3aed'],
        ['id' => 'pass', 'group' => 'second-pass', 'label' => 'Confident Pass', 'color' => '#166534'],
    ];

    /** @return ?array{id: string, group: string, label: string, color: string} */
    public static function get(string $id): ?array
    {
        foreach (self::TAGS as $tag) {
            if ($tag['id'] === $id) {
                return $tag;
            }
        }

        return null;
    }

    /** @return list<array{id: string, group: string, label: string, color: string}> */
    public static function tagsInGroup(string $group): array
    {
        return array_values(array_filter(self::TAGS, static fn (array $tag) => $tag['group'] === $group));
    }

    /**
     * @param array<string, list<string>> $applied
     * @param array<string, list<string>> $filters
     */
    public static function resourceMatchesFilters(
        string $key,
        string $section,
        array $applied = [],
        array $filters = [],
    ): bool {
        $selected = $filters[$section] ?? [];
        if ($selected === []) {
            return true;
        }
        $tags = $applied[$key] ?? [];
        foreach ($selected as $id) {
            if (in_array($id, $tags, true)) {
                return true;
            }
        }

        return false;
    }
}
