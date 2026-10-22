<?php

declare(strict_types=1);

namespace Reflex\Catalog;

/**
 * Old case ids that bookmarks may still use, mapped to the closest current
 * case (data/case-redirects.json). Only ids that no longer exist redirect.
 */
final class CaseRedirects
{
    /** @return array<string, string> */
    public static function all(): array
    {
        /** @var array{cases: array<string, string>} $data */
        $data = Json::load('case-redirects.json');

        return $data['cases'];
    }

    public static function target(string $caseId): ?string
    {
        if (Cases::get($caseId) !== null) {
            return null;
        }
        $target = self::all()[$caseId] ?? null;

        return $target !== null && Cases::get($target) !== null ? $target : null;
    }
}
