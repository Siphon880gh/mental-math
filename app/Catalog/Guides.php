<?php

declare(strict_types=1);

namespace Reflex\Catalog;

use RecursiveDirectoryIterator;
use RecursiveIteratorIterator;
use RuntimeException;
use SplFileInfo;

final class Guides
{
    /** @var list<array<string, string>>|null */
    private static ?array $guides = null;

    /** @return list<array{slug: string, familyId: string, title: string, summary: string, body: string, track: string, source: string, relatedCoachSlug: string}> */
    public static function all(): array
    {
        if (self::$guides !== null) {
            return self::$guides;
        }

        $bySlug = [];
        $inline = Json::load('inline-guides.json');
        foreach ($inline['bodies'] as $slug => $body) {
            $bySlug[$slug] = self::withTrack([
                'slug' => $slug,
                'familyId' => $slug,
                'title' => self::titleFromBody($body, $slug),
                'summary' => $inline['summaries'][$slug] ?? $slug,
                'body' => $body,
                'source' => 'inline',
            ]);
        }

        /** @var list<array{slug: string, familyId: string, file: string, summary: string}> $specs */
        $specs = Json::load('guide-specs.json');
        foreach ($specs as $spec) {
            $body = self::bodyFor($spec['file']);
            $bySlug[$spec['slug']] = self::withTrack([
                'slug' => $spec['slug'],
                'familyId' => $spec['familyId'],
                'title' => self::titleFromBody($body, $spec['slug']),
                'summary' => $spec['summary'],
                'body' => $body,
                'source' => 'docs-more',
            ]);
        }

        $guides = [];
        foreach (Tracks::allCurriculumFamilyIds() as $familyId) {
            if (!isset($bySlug[$familyId])) {
                throw new RuntimeException('Missing guide for family ' . $familyId);
            }
            $guides[] = $bySlug[$familyId];
        }
        self::$guides = $guides;

        return $guides;
    }

    /** @return ?array{slug: string, familyId: string, title: string, summary: string, body: string, track: string, source: string, relatedCoachSlug: string} */
    public static function get(string $slug): ?array
    {
        foreach (self::all() as $guide) {
            if ($guide['slug'] === $slug) {
                return $guide;
            }
        }

        return null;
    }

    /** @return list<array{slug: string, familyId: string, title: string, summary: string, body: string, track: string, source: string, relatedCoachSlug: string}> */
    public static function forFamily(string $familyId): array
    {
        return array_values(array_filter(self::all(), static fn (array $g) => $g['familyId'] === $familyId));
    }

    /** @return ?array{slug: string, familyId: string, title: string, summary: string, body: string, track: string, source: string, relatedCoachSlug: string} */
    public static function forFamilyOne(string $familyId): ?array
    {
        return self::get($familyId) ?? (self::forFamily($familyId)[0] ?? null);
    }

    public static function hrefForFamilyGuide(string $familyId): ?string
    {
        $guide = self::forFamilyOne($familyId);
        if ($guide === null) {
            return null;
        }

        return url('/guides/' . $guide['slug']);
    }

    /** @return list<array{slug: string, familyId: string, title: string, summary: string, body: string, track: string, source: string, relatedCoachSlug: string}> */
    public static function forTrack(string $track): array
    {
        return array_values(array_filter(self::all(), static fn (array $g) => $g['track'] === $track));
    }

    /** @return list<string> */
    public static function extraFamilyIdsMissingGuides(): array
    {
        return array_values(array_filter(
            Tracks::extraFamilyIds(),
            static fn (string $id) => self::forFamily($id) === [],
        ));
    }

    /** @return list<string> */
    public static function familyIdsMissingGuides(): array
    {
        return array_values(array_filter(
            Tracks::allCurriculumFamilyIds(),
            static fn (string $id) => self::forFamily($id) === [],
        ));
    }

    /** @param array{slug: string, familyId: string, title: string, summary: string, body: string, source: string} $guide */
    private static function withTrack(array $guide): array
    {
        $guide['track'] = Tracks::trackForFamily($guide['familyId']);
        $guide['relatedCoachSlug'] = $guide['familyId'];

        return $guide;
    }

    private static function titleFromBody(string $body, string $fallback): string
    {
        foreach (explode("\n", $body) as $row) {
            if (str_starts_with($row, '# ')) {
                return trim(substr($row, 2));
            }
        }

        return $fallback;
    }

    private static function bodyFor(string $file): string
    {
        $dir = ROOT . '/context/docs-more';
        $iterator = new RecursiveIteratorIterator(new RecursiveDirectoryIterator($dir));
        /** @var SplFileInfo $path */
        foreach ($iterator as $path) {
            if ($path->isFile() && $path->getFilename() === $file) {
                $contents = file_get_contents($path->getPathname());
                if ($contents === false) {
                    break;
                }

                return $contents;
            }
        }
        throw new RuntimeException('Missing docs-more lesson: ' . $file);
    }
}
