<?php

declare(strict_types=1);

namespace Reflex\Catalog;

final class Tracks
{
    public const LABEL = [
        'quick' => 'A. Quick math for business and everyday life',
        'stakeholder' => 'B. Business and entrepreneurship stakeholder discussion and planning math',
    ];

    public const BLURB = [
        'quick' => 'Shortcuts you run in your head: percents, zeros, complements, divisibility, 80/20, invert revenue.',
        'stakeholder' => 'Numbers you use in a planning discussion: runway, NRR, dilution, TAM, stacked infra, concurrency, capacity.',
    ];

    public const NAV = [
        'quick' => ['href' => '/track-a', 'label' => 'Track A'],
        'stakeholder' => ['href' => '/track-b', 'label' => 'Track B'],
    ];

    public const P0_FAMILY_IDS = [
        'anchors',
        'magnitude',
        'percent-shift',
        'percent-reversible',
        'percent-tens',
        'percent-chunks',
        'percent-tip',
        'div-by-5',
        'hour-month',
        'month-day',
        'month-year',
        'break-even',
        'markup',
    ];

    public const EXTRA_MENTAL_FAMILY_IDS = [
        'left-to-right',
        'round-compensate',
        'double-half',
        'multiply-near',
        'fraction-percent',
        'rule-of-72',
        'pareto',
        'revenue-triangle',
        'divisibility',
        'criss-cross',
        'difference-squares',
        'easy-division',
        'complements',
        'equal-adjust',
        'cross-cancel',
        'cast-nines',
        'approx-sqrt',
        'regroup-factors',
    ];

    public const EXTRA_STARTUP_FAMILY_IDS = [
        'mrr-arr',
        'churn',
        'nrr',
        'rule-of-40',
        'burn-multiple',
        'cac-payback',
        'take-rate',
        'processing-fees',
        'fully-loaded',
        'dilution',
        'tam-fermi',
    ];

    public const EXTRA_OPERATOR_FAMILY_IDS = [
        'concurrency',
        'capacity-split',
        'box-contribution',
        'utilization',
        'estimate-pad',
        'funnel-bands',
    ];

    /** @return list<string> */
    public static function extraFamilyIds(): array
    {
        return [
            ...self::EXTRA_MENTAL_FAMILY_IDS,
            ...self::EXTRA_STARTUP_FAMILY_IDS,
            ...self::EXTRA_OPERATOR_FAMILY_IDS,
        ];
    }

    /** @return list<string> */
    public static function trackAFamilyIds(): array
    {
        return [...self::P0_FAMILY_IDS, ...self::EXTRA_MENTAL_FAMILY_IDS];
    }

    /** @return list<string> */
    public static function trackBFamilyIds(): array
    {
        return [
            'stacked-founder',
            'cfo-feasibility',
            'cfo-unit-econ',
            'cfo-runway',
            'cfo-growth',
            ...self::EXTRA_STARTUP_FAMILY_IDS,
            ...self::EXTRA_OPERATOR_FAMILY_IDS,
        ];
    }

    /** @return list<string> */
    public static function allCurriculumFamilyIds(): array
    {
        return [...self::trackAFamilyIds(), ...self::trackBFamilyIds()];
    }

    public static function trackForFamily(string $familyId): string
    {
        return in_array($familyId, self::trackBFamilyIds(), true) ? 'stakeholder' : 'quick';
    }

    public static function hrefForTrack(string $track): string
    {
        return url(self::NAV[$track]['href'] ?? '/track-a');
    }
}
