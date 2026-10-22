<?php

declare(strict_types=1);

use PHPUnit\Framework\TestCase;
use Reflex\Catalog\Cases;
use Reflex\Catalog\Drills;
use Reflex\Catalog\Guides;
use Reflex\Catalog\Scenarios;
use Reflex\Catalog\Tracks;
use Reflex\Catalog\Tricks;

/**
 * Guards against thin or copied practice: every family needs drills beyond the
 * numbers its guide already works, cases must not reuse a drill, and every pack
 * and family needs real practice surfaces.
 */
final class ContentQualityTest extends TestCase
{
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
            $total = 0;
            foreach (Drills::items() as $drill) {
                if ($drill['familyId'] !== $familyId) {
                    continue;
                }
                $total++;
                $all = [...self::numbers((string) $drill['prompt']), self::answer($drill['expectedAnswer'])];
                foreach ($all as $n) {
                    if (!isset($guideNumbers[$n])) {
                        $fresh++;
                        break;
                    }
                }
            }
            $this->assertGreaterThanOrEqual(3, $fresh, $familyId . ' drills only repeat the guide');
            $this->assertLessThanOrEqual(0.6, ($total - $fresh) / $total, $familyId . ': most drills only repeat the guide');
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

    public function testTrackBGuidesTeachAWorkedExampleTheWhyAndTheSlip(): void
    {
        foreach (Tracks::trackBFamilyIds() as $familyId) {
            $body = Guides::forFamilyOne($familyId)['body'];
            $this->assertStringContainsString('## Worked example', $body, $familyId);
            $this->assertMatchesRegularExpression('/^## Why/m', $body, $familyId);
            $this->assertMatchesRegularExpression('/^## Where it goes wrong/m', $body, $familyId);
            $this->assertGreaterThanOrEqual(180, preg_match_all('/\S+/u', $body), $familyId);
        }
    }

    public function testEveryFamilyHasTrickCardsAndTrackBHasThree(): void
    {
        $ids = array_column(Tricks::all(), 'id');
        $this->assertSame(count($ids), count(array_unique($ids)));
        foreach (Tracks::trackAFamilyIds() as $familyId) {
            $this->assertNotSame([], Tricks::forFamily($familyId), $familyId);
        }
        foreach (Tracks::trackBFamilyIds() as $familyId) {
            $this->assertGreaterThanOrEqual(3, count(Tricks::forFamily($familyId)), $familyId);
        }
    }

    /**
     * One-move conversions with no chain worth calling advanced. Their harder
     * use shows up inside other families' advanced cases.
     */
    private const NO_ADVANCED_CASE = ['percent-shift', 'percent-tens', 'div-by-5', 'month-day'];

    public function testEveryFamilyWithAChainHasAnAdvancedCase(): void
    {
        $advanced = [];
        foreach (Cases::all() as $case) {
            if ($case['difficulty'] === 'advanced') {
                $advanced[$case['familyId']] = true;
            }
        }
        foreach (Tracks::trackAFamilyIds() as $familyId) {
            if (in_array($familyId, self::NO_ADVANCED_CASE, true)) {
                $this->assertArrayNotHasKey($familyId, $advanced, $familyId . ' now has an advanced case; drop it from the skip list');
                continue;
            }
            $this->assertArrayHasKey($familyId, $advanced, $familyId . ' has no advanced case');
        }
    }
}
