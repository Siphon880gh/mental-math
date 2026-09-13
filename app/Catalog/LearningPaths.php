<?php

declare(strict_types=1);

namespace Reflex\Catalog;

use Reflex\Progress;

final class LearningPaths
{
    public const BEGINNER = [
        'id' => Progress::BEGINNER_PATH_ID,
        'title' => 'Beginner Reflex Path',
        'description' => 'Five-minute Track A fluency, then stacked founder cases. SAMPLE numbers only.',
        'milestones' => [
            [
                'id' => 'E4.M1',
                'title' => 'Anchors and magnitude',
                'contentRefs' => ['drill:anchors', 'drill:magnitude', 'guide:anchors'],
                'unlockFrom' => [],
                'coachTip' => 'Open /drills/anchors, then /drills/magnitude. Track A guides live under /guides.',
            ],
            [
                'id' => 'E4.M2',
                'title' => 'Percent shortcuts',
                'contentRefs' => ['drill:percents', 'coach:percent-shift'],
                'unlockFrom' => ['E4.M1'],
                'coachTip' => 'Open /drills/percents. The step-by-step tree is /coach/percent-shift.',
            ],
            [
                'id' => 'E4.M3',
                'title' => 'Conversions and break-even',
                'contentRefs' => ['drill:conversions', 'drill:break-even', 'guide:hour-month'],
                'unlockFrom' => ['E4.M2'],
                'coachTip' => 'Open /drills/conversions then /drills/break-even. Track A ×720 is /guides/hour-month.',
            ],
            [
                'id' => 'E4.M0',
                'title' => 'Timed fluency gate',
                'contentRefs' => ['drill:percents', 'drill:conversions'],
                'unlockFrom' => ['E4.M3'],
                'coachTip' => 'Pass percents (≤5s median) and conversions (≤6s median) at ≥80% on /drills/percents and /drills/conversions. Cases stay locked until both.',
            ],
            [
                'id' => 'E5.M2',
                'title' => 'Stacked founder cases',
                'contentRefs' => ['cases:stacked-founder'],
                'unlockFrom' => ['E4.M0'],
                'coachTip' => 'Open /cases after the gate. Start with the stacked-founder pack.',
            ],
        ],
    ];

    public const OPERATOR = [
        'id' => Progress::OPERATOR_PATH_ID,
        'title' => 'Operator CFO Path',
        'description' => 'Stakeholder smell tests. Does not replace Beginner unlocks. Graded cases still need the fluency gate.',
        'milestones' => [
            [
                'id' => 'op-feasibility',
                'title' => 'Feasibility ceiling',
                'contentRefs' => ['drill:cfo-feasibility', 'cases:cfo-feasibility', 'guide:cfo-feasibility'],
                'unlockFrom' => [],
                'coachTip' => 'Open /drills/cfo-feasibility and /cases for the feasibility pack. Track B guide: /guides/cfo-feasibility.',
            ],
            [
                'id' => 'op-unit-econ',
                'title' => 'LTV / CAC',
                'contentRefs' => ['drill:cfo-unit-econ', 'cases:cfo-unit-econ'],
                'unlockFrom' => ['op-feasibility'],
                'coachTip' => 'Open /drills/cfo-unit-econ then the unit-econ cases.',
            ],
            [
                'id' => 'op-runway',
                'title' => 'Runway',
                'contentRefs' => ['drill:cfo-runway', 'cases:cfo-runway'],
                'unlockFrom' => ['op-unit-econ'],
                'coachTip' => 'Open /drills/cfo-runway. Home only names this pack on the Operator path.',
            ],
            [
                'id' => 'op-growth',
                'title' => 'Growth claims',
                'contentRefs' => ['drill:cfo-growth', 'cases:cfo-growth', 'coach:cfo-growth'],
                'unlockFrom' => ['op-runway'],
                'coachTip' => 'Open /drills/cfo-growth. The 20%/mo table is /coach/cfo-growth. 100 users cannot become 50k in a year.',
            ],
        ],
    ];

    /** @return array{id: string, title: string, description: string, milestones: list<array<string, mixed>>} */
    public static function get(string $pathId): array
    {
        return $pathId === Progress::OPERATOR_PATH_ID ? self::OPERATOR : self::BEGINNER;
    }

    public static function hrefForRef(string $ref): string
    {
        [$kind, $slug] = array_pad(explode(':', $ref, 2), 2, '');
        return url(match ($kind) {
            'drill' => '/drills/' . $slug,
            'guide' => '/guides/' . $slug,
            'coach' => '/coach/' . $slug,
            'cases' => '/cases?pack=' . $slug,
            'game' => '/games/' . $slug,
            default => '/track-a',
        });
    }

    /**
     * @param array<string, string> $milestones
     * @return ?array<string, mixed>
     */
    public static function nextMilestone(array $path, array $milestones): ?array
    {
        foreach ($path['milestones'] as $node) {
            if (($milestones[$node['id']] ?? '') !== 'complete') {
                return $node;
            }
        }

        return null;
    }
}
