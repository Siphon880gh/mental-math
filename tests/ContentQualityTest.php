<?php

declare(strict_types=1);

use PHPUnit\Framework\TestCase;
use Reflex\Catalog\Cases;
use Reflex\Catalog\Drills;
use Reflex\Catalog\Guides;
use Reflex\Catalog\Scenarios;
use Reflex\Catalog\Tracks;

/**
 * Guards against thin or copied practice: every family needs drills beyond the
 * numbers its guide already works, cases must not reuse a drill, and every pack
 * and family needs real practice surfaces.
 */
final class ContentQualityTest extends TestCase
{
    private const OPERATOR_AND_CFO_GUIDES = [
        'stacked-founder', 'cfo-feasibility', 'cfo-unit-econ', 'cfo-runway', 'cfo-growth',
        'concurrency', 'capacity-split', 'box-contribution', 'utilization', 'estimate-pad', 'funnel-bands',
    ];

    /** @return list<string> */
    private static function numbers(string $text): array
    {
        preg_match_all('/\d[\d,]*(?:\.\d+)?/u', $text, $m);

        return array_map(static function (string $n): string {
            $n = str_replace(',', '', $n);
            if (str_contains($n, '.')) {
                $n = rtrim(rtrim($n, '0'), '.');
            }

            return $n;
        }, $m[0]);
    }

    /** @param int|float|string $answer */
    private static function answer($answer): string
    {
        return self::numbers((string) (0 + $answer))[0] ?? (string) $answer;
    }

    /** @param array<string, mixed> $row */
    private static function key(array $row): string
    {
        $nums = self::numbers((string) $row['prompt']);
        sort($nums, SORT_STRING);

        return implode('|', $nums) . '=' . self::answer($row['expectedAnswer']);
    }

    public function testPromptsSaySample(): void
    {
        foreach ([...Drills::items(), ...Cases::all(), ...Scenarios::all()] as $row) {
            $this->assertStringStartsWith('SAMPLE: ', (string) $row['prompt'], (string) $row['id']);
        }
    }

    public function testDrillsDoNotRepeatEachOtherWithinAFamily(): void
    {
        $seen = [];
        foreach (Drills::items() as $drill) {
            $key = $drill['familyId'] . ' ' . self::key($drill);
            $this->assertArrayNotHasKey($key, $seen, $drill['id'] . ' repeats ' . ($seen[$key] ?? ''));
            $seen[$key] = $drill['id'];
        }
    }

    public function testCasesDoNotCopyADrillOrEachOther(): void
    {
        $drills = [];
        foreach (Drills::items() as $drill) {
            $drills[self::key($drill)] = $drill['id'];
        }
        $cases = [];
        foreach (Cases::all() as $case) {
            $key = self::key($case);
            $this->assertArrayNotHasKey($key, $drills, $case['id'] . ' copies drill ' . ($drills[$key] ?? ''));
            $this->assertArrayNotHasKey($key, $cases, $case['id'] . ' repeats ' . ($cases[$key] ?? ''));
            $cases[$key] = $case['id'];
        }
    }

    public function testEveryFamilyPracticesBeyondItsGuideExamples(): void
    {
        foreach (Tracks::allCurriculumFamilyIds() as $familyId) {
            $guideNumbers = array_fill_keys(self::numbers(Guides::forFamilyOne($familyId)['body']), true);
            $fresh = 0;
            foreach (Drills::items() as $drill) {
                if ($drill['familyId'] !== $familyId) {
                    continue;
                }
                $all = [...self::numbers((string) $drill['prompt']), self::answer($drill['expectedAnswer'])];
                foreach ($all as $n) {
                    if (!isset($guideNumbers[$n])) {
                        $fresh++;
                        break;
                    }
                }
            }
            $this->assertGreaterThanOrEqual(2, $fresh, $familyId . ' drills only repeat the guide');
        }
    }

    public function testEveryPackHasAnAdvancedCase(): void
    {
        foreach (Cases::packs() as $pack) {
            $advanced = array_filter(Cases::forPack($pack['id']), static fn (array $c) => $c['difficulty'] === 'advanced');
            $this->assertNotSame([], $advanced, $pack['id']);
        }
    }

    public function testEveryFamilyHasACaseAndAScenario(): void
    {
        $caseFamilies = array_fill_keys(array_column(Cases::all(), 'familyId'), true);
        $scenarioFamilies = [];
        foreach (Scenarios::all() as $scenario) {
            foreach ($scenario['skillIds'] as $id) {
                $scenarioFamilies[$id] = true;
            }
        }
        foreach (Tracks::allCurriculumFamilyIds() as $familyId) {
            $this->assertArrayHasKey($familyId, $caseFamilies, $familyId . ' has no case');
            $this->assertArrayHasKey($familyId, $scenarioFamilies, $familyId . ' has no scenario');
        }
    }

    public function testScenarioChoicesAreDistinct(): void
    {
        foreach (Scenarios::all() as $scenario) {
            $labels = array_column($scenario['choices'], 'label');
            $this->assertSame(count($labels), count(array_unique($labels)), $scenario['id']);
            $this->assertGreaterThanOrEqual(4, count($labels), $scenario['id']);
        }
    }

    public function testOperatorAndCfoGuidesTeachAWorkedExample(): void
    {
        foreach (self::OPERATOR_AND_CFO_GUIDES as $slug) {
            $body = Guides::get($slug)['body'];
            $this->assertStringContainsString('## Worked example', $body, $slug);
            $this->assertMatchesRegularExpression('/^## (Why|Where it goes wrong)/m', $body, $slug);
            $this->assertGreaterThanOrEqual(170, preg_match_all('/\S+/u', $body), $slug);
        }
    }
}
