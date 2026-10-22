<?php

declare(strict_types=1);

use PHPUnit\Framework\TestCase;
use Reflex\Catalog\Cases;
use Reflex\Catalog\Drills;
use Reflex\Catalog\Games;
use Reflex\Catalog\Guides;
use Reflex\Catalog\MoreTricks;
use Reflex\Catalog\Scenarios;
use Reflex\Catalog\Toolbox;
use Reflex\Catalog\Tracks;
use Reflex\Catalog\Tricks;
use Reflex\Coaching\Sessions;

final class MoreTricksTest extends TestCase
{
    public function testSectionAndMasterIds(): void
    {
        $ids = array_column(MoreTricks::coverage(), 'id');
        $this->assertSame(count($ids), count(array_unique($ids)));
        $numeric = array_values(array_filter($ids, static fn (string $id) => ctype_digit($id)));
        sort($numeric, SORT_NUMERIC);
        $this->assertSame(MoreTricks::sectionIds(), $numeric);
        $this->assertSame(
            MoreTricks::masterIds(),
            array_values(array_filter($ids, static fn (string $id) => str_starts_with($id, 'master-'))),
        );
    }

    public function testShippedRowsMapToLiveFamilies(): void
    {
        $families = array_fill_keys(Tracks::allCurriculumFamilyIds(), true);
        $trickIds = array_fill_keys(array_column(Tricks::all(), 'id'), true);
        foreach (MoreTricks::coverage() as $row) {
            $this->assertTrue($row['status'] === 'shipped' || $row['status'] === 'skip', $row['id']);
            foreach ($row['familyIds'] as $familyId) {
                $this->assertArrayHasKey($familyId, $families, $row['id'] . ' ' . $familyId);
            }
            foreach ($row['trickIds'] ?? [] as $trickId) {
                $this->assertArrayHasKey($trickId, $trickIds, $row['id'] . ' ' . $trickId);
            }
            if ($row['status'] === 'skip') {
                $this->assertMatchesRegularExpression('/\S/', (string) $row['skipReason']);
            }
        }
    }

    public function testTrickIdsBelongToTheRowFamilies(): void
    {
        $trickFamily = array_column(Tricks::all(), 'familyId', 'id');
        foreach (MoreTricks::coverage() as $row) {
            foreach ($row['trickIds'] ?? [] as $trickId) {
                $this->assertContains($trickFamily[$trickId], $row['familyIds'], $row['id'] . ' ' . $trickId);
            }
        }
    }

    public function testClaimedSurfacesExist(): void
    {
        $drillFamilies = array_fill_keys(array_column(Drills::items(), 'familyId'), true);
        $gameFamilies = array_fill_keys(array_column(Games::all(), 'familyId'), true);
        $caseFamilies = array_fill_keys(array_column(Cases::all(), 'familyId'), true);
        $scenarioFamilies = [];
        foreach (Scenarios::all() as $scenario) {
            foreach ($scenario['skillIds'] as $id) {
                $scenarioFamilies[$id] = true;
            }
        }
        $toolboxFamilies = array_fill_keys(Toolbox::referencedFamilyIds(), true);
        foreach (MoreTricks::coverage() as $row) {
            if ($row['status'] !== 'shipped') {
                continue;
            }
            $this->assertNotEmpty($row['surfaces'] ?? [], $row['id']);
            $any = static function (array $set) use ($row): bool {
                foreach ($row['familyIds'] as $familyId) {
                    if (isset($set[$familyId])) {
                        return true;
                    }
                }

                return false;
            };
            foreach ($row['surfaces'] as $surface) {
                $ok = match ($surface) {
                    'guide' => $row['familyIds'] !== [] && array_filter($row['familyIds'], static fn (string $id) => Guides::get($id) !== null) !== [],
                    'trick' => ($row['trickIds'] ?? []) !== [],
                    'coach' => array_filter($row['familyIds'], static fn (string $id) => Sessions::has($id)) !== [],
                    'drill' => $any($drillFamilies),
                    'game' => $any($gameFamilies),
                    'case' => $any($caseFamilies),
                    'scenario' => $any($scenarioFamilies),
                    'toolbox' => $any($toolboxFamilies),
                    default => false,
                };
                $this->assertTrue((bool) $ok, $row['id'] . ' claims ' . $surface);
            }
        }
    }

    public function testToolboxLinksLiveFamilies(): void
    {
        $families = array_fill_keys(Tracks::allCurriculumFamilyIds(), true);
        foreach (Toolbox::referencedFamilyIds() as $id) {
            $this->assertArrayHasKey($id, $families, $id);
        }
        $data = Toolbox::data();
        $this->assertCount(12, $data['masters']);
        $this->assertSame(range(1, 10), array_column($data['progression'], 'step'));
        $notes = implode(' ', array_column($data['notes'], 'body'));
        $this->assertStringContainsString('Bharati Krishna Tirtha', $notes);
        $this->assertStringContainsString('1965', $notes);
        $this->assertStringContainsString('no well-established Japanese origin', $notes);
    }

    public function testTrachtenbergRowPointsAtRealPractice(): void
    {
        $row = array_values(array_filter(MoreTricks::coverage(), static fn (array $r) => $r['id'] === 'trachtenberg'))[0];
        $named = static fn (array $items, string $field) => array_values(array_filter(
            $items,
            static fn (array $item) => str_contains((string) $item[$field], 'Trachtenberg'),
        ));
        if (in_array('case', $row['surfaces'], true)) {
            $cases = $named(Cases::all(), 'prompt');
            $this->assertNotEmpty($cases);
            foreach ($cases as $case) {
                $this->assertSame('fixed-multipliers', $case['familyId']);
            }
        }
        if (in_array('scenario', $row['surfaces'], true)) {
            $scenarios = $named(Scenarios::all(), 'prompt');
            $this->assertNotEmpty($scenarios);
            foreach ($scenarios as $scenario) {
                $this->assertContains('fixed-multipliers', $scenario['skillIds']);
            }
        }
        $this->assertNotEmpty($named(Drills::items(), 'prompt'));
    }
}
