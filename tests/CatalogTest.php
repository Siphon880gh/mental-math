<?php

declare(strict_types=1);

use PHPUnit\Framework\TestCase;
use Reflex\Catalog\Cases;
use Reflex\Catalog\Drills;
use Reflex\Catalog\Games;
use Reflex\Catalog\LearningPaths;
use Reflex\Catalog\Scenarios;
use Reflex\Catalog\ThinkingModeTips;
use Reflex\Catalog\Tracks;
use Reflex\Catalog\Tricks;
use Reflex\Progress;

final class CatalogTest extends TestCase
{
    public function testTracksSplit(): void
    {
        $all = Tracks::allCurriculumFamilyIds();
        $this->assertSame(count($all), count(array_unique($all)));
        $this->assertSame(count(Tracks::trackAFamilyIds()) + count(Tracks::trackBFamilyIds()), count($all));
        foreach (Tracks::trackAFamilyIds() as $id) {
            $this->assertSame('quick', Tracks::trackForFamily($id));
        }
        foreach (Tracks::trackBFamilyIds() as $id) {
            $this->assertSame('stakeholder', Tracks::trackForFamily($id));
        }
        $this->assertSame('/track-a', Tracks::hrefForTrack('quick'));
        $this->assertSame('/track-b', Tracks::hrefForTrack('stakeholder'));
    }

    public function testTricks(): void
    {
        $ids = array_column(Tricks::all(), 'id');
        $this->assertSame(count($ids), count(array_unique($ids)));
        foreach (Tracks::P0_FAMILY_IDS as $familyId) {
            $this->assertNotSame([], Tricks::forFamily($familyId));
        }
        foreach (Tracks::extraFamilyIds() as $familyId) {
            $this->assertNotSame([], Tricks::forFamily($familyId), $familyId);
        }
        foreach (Tracks::allCurriculumFamilyIds() as $familyId) {
            $this->assertNotSame([], Tricks::forFamily($familyId), $familyId);
        }
        $first = Tricks::all()[0];
        $this->assertSame($first, Tricks::get($first['id']));
        $this->assertNull(Tricks::get('missing'));
    }

    public function testDrills(): void
    {
        $ids = array_column(Drills::items(), 'id');
        $this->assertSame(count($ids), count(array_unique($ids)));
        foreach (Drills::PATH_GROUP_IDS as $id) {
            $this->assertGreaterThanOrEqual(16, count(Drills::itemsForGroup($id)));
        }
        foreach (['cfo-feasibility', 'cfo-unit-econ', 'cfo-runway', 'cfo-growth', 'foundations', 'startup', 'stacked-founder', 'operator'] as $id) {
            $this->assertGreaterThanOrEqual(8, count(Drills::itemsForGroup($id)));
        }
        $this->assertSame(
            Drills::PATH_GROUP_IDS,
            array_column(array_values(array_filter(Drills::groups(), static fn (array $g) => !empty($g['pathGroup']))), 'id'),
        );
        $percents = array_column(Drills::itemsForGroup('percents'), 'familyId');
        foreach (['percent-shift', 'percent-reversible', 'percent-tens', 'percent-chunks', 'percent-tip'] as $id) {
            $this->assertContains($id, $percents);
        }
        foreach (Tracks::allCurriculumFamilyIds() as $familyId) {
            $n = count(array_filter(Drills::items(), static fn (array $item) => $item['familyId'] === $familyId));
            $this->assertGreaterThanOrEqual(3, $n, $familyId);
        }
    }

    public function testCases(): void
    {
        $ids = array_column(Cases::all(), 'id');
        $this->assertSame(count($ids), count(array_unique($ids)));
        foreach (Cases::all() as $row) {
            $this->assertNotSame([], $row['thoughtChain']);
            $this->assertGreaterThan(10, strlen((string) $row['prompt']));
        }
        $stacked = Cases::forPack('stacked-founder');
        $this->assertGreaterThanOrEqual(8, count(array_filter($stacked, static fn (array $c) => $c['difficulty'] === 'beginner')));
        $this->assertGreaterThanOrEqual(4, count(array_filter($stacked, static fn (array $c) => $c['difficulty'] === 'intermediate')));
        $modes = array_column($stacked, 'thinkingMode');
        foreach (['infra_chain', 'break_even', 'conversion_funnel', 'markup_read'] as $mode) {
            $this->assertContains($mode, $modes);
        }
        foreach (['cfo-feasibility' => 'smell_test', 'cfo-unit-econ' => 'ltv_cac', 'cfo-runway' => 'runway', 'cfo-growth' => 'growth_claim'] as $pack => $mode) {
            $rows = Cases::forPack($pack);
            $this->assertGreaterThanOrEqual(6, count(array_filter($rows, static fn (array $c) => $c['difficulty'] === 'beginner')));
            $this->assertGreaterThanOrEqual(3, count(array_filter($rows, static fn (array $c) => $c['difficulty'] === 'intermediate')));
            $this->assertContains($mode, array_column($rows, 'thinkingMode'));
        }
        $this->assertTrue((bool) array_filter(Cases::forPack('cfo-growth'), static fn (array $c) => $c['id'] === 'gr-impossible'));
        foreach (array_unique(array_column(Cases::all(), 'thinkingMode')) as $mode) {
            $this->assertGreaterThan(10, strlen(ThinkingModeTips::ALL[$mode]));
        }
    }

    public function testScenarios(): void
    {
        $ids = array_column(Scenarios::all(), 'id');
        $this->assertSame(count($ids), count(array_unique($ids)));
        $this->assertGreaterThanOrEqual(12, count(Scenarios::forTrack('quick')));
        $this->assertGreaterThanOrEqual(12, count(Scenarios::forTrack('stakeholder')));
        foreach (Scenarios::all() as $row) {
            $this->assertGreaterThanOrEqual(2, count($row['skillIds']));
            $this->assertNotSame([], $row['hints']);
            $this->assertCount(1, array_filter($row['choices'], static fn (array $c) => !empty($c['correct'])));
            $this->assertGreaterThan(20, strlen((string) $row['cheat']));
        }
        $this->assertSame('quick', Scenarios::get('box-cover')['track']);
        $this->assertNull(Scenarios::get('missing'));
    }

    public function testGamesAndPaths(): void
    {
        $this->assertSame(['decimal-shift', 'percent-swap', 'percent-chips'], array_column(Games::all(), 'slug'));
        $this->assertSame('percent-shift', Games::get('decimal-shift')['familyId']);
        $this->assertNotSame([], array_filter(Games::skips(), static fn (array $s) => $s['familyId'] === 'anchors' && $s['reason'] === 'no_mechanic'));
        $this->assertNull(Games::get('missing'));
        $this->assertSame([], LearningPaths::BEGINNER['milestones'][0]['unlockFrom']);
        $this->assertSame(
            ['E4.M1', 'E4.M2', 'E4.M3', 'E4.M0', 'E5.M2'],
            array_column(LearningPaths::BEGINNER['milestones'], 'id'),
        );
        foreach ([...LearningPaths::BEGINNER['milestones'], ...LearningPaths::OPERATOR['milestones']] as $node) {
            $this->assertMatchesRegularExpression('#/(drills|guides|cases|coach)#', $node['coachTip']);
            $this->assertDoesNotMatchRegularExpression('#/archive#', $node['coachTip']);
        }
        $this->assertSame('op-feasibility', LearningPaths::OPERATOR['milestones'][0]['id']);
        $this->assertSame([], array_filter(LearningPaths::BEGINNER['milestones'], static fn (array $m) => str_starts_with($m['id'], 'op-')));
        $this->assertSame(Progress::BEGINNER_PATH_ID, LearningPaths::BEGINNER['id']);
    }
}
