<?php

declare(strict_types=1);

use PHPUnit\Framework\TestCase;
use Reflex\Catalog\MoreTricks;
use Reflex\Catalog\Tracks;
use Reflex\Catalog\Tricks;

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
}
