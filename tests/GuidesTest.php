<?php

declare(strict_types=1);

use PHPUnit\Framework\TestCase;
use Reflex\Catalog\Guides;
use Reflex\Catalog\Tracks;

final class GuidesTest extends TestCase
{
    public function testEveryFamilyHasAGuide(): void
    {
        $this->assertSame([], Guides::familyIdsMissingGuides());
        $this->assertSame([], Guides::extraFamilyIdsMissingGuides());
        $this->assertSame(Tracks::allCurriculumFamilyIds(), array_column(Guides::all(), 'familyId'));
    }

    public function testTrackLabels(): void
    {
        foreach (Guides::forTrack('quick') as $guide) {
            $this->assertSame('quick', $guide['track']);
        }
        foreach (Guides::forTrack('stakeholder') as $guide) {
            $this->assertSame('stakeholder', $guide['track']);
        }
        $this->assertSame('quick', Guides::get('anchors')['track']);
        $this->assertSame('stakeholder', Guides::get('dilution')['track']);
        $this->assertSame('anchors', Guides::get('anchors')['relatedCoachSlug']);
        $this->assertSame('/index.php?route=%2Fguides%2Fpercent-chunks', Guides::hrefForFamilyGuide('percent-chunks'));
        $this->assertSame('/index.php?route=%2Fguides%2Fmonth-year', Guides::hrefForFamilyGuide('month-year'));
    }

    public function testBodies(): void
    {
        $guide = Guides::get('rule-of-72');
        $this->assertSame('rule-of-72', $guide['familyId']);
        $this->assertMatchesRegularExpression('/72 ÷/i', $guide['body']);
        $this->assertNull(Guides::get('missing'));
        $month = Guides::get('month-year')['body'];
        $this->assertStringContainsString('Multiply by 10 for $300/year', $month);
        $this->assertStringContainsString('$100/mo → $1,200/year', $month);
        $this->assertStringContainsString('$2,400/year → $200/mo', $month);
        $this->assertStringContainsString('## Same idea, new numbers', $month);
        $this->assertStringNotContainsString('$1/hr', $month);
        foreach (Guides::all() as $row) {
            $this->assertStringContainsString('## Same idea, new numbers', $row['body'], $row['slug']);
        }
    }

    public function testMoreTricksCoverageInGuideBodies(): void
    {
        $div = Guides::get('divisibility')['body'];
        foreach (['203 → 20 − 6 = 14', '286 → 28 + 24 = 52', '221 → 22 − 5 = 17', '133 → 13 + 6 = 19', '31,168', '**14** = 2 and 7', '**24** = 3 and 8', '| 125 |'] as $needle) {
            $this->assertStringContainsString($needle, $div);
        }
        $this->assertStringContainsString('Bharati Krishna Tirtha’s 1965 book', Guides::get('criss-cross')['body']);
        $this->assertStringContainsString('Bharati Krishna Tirtha’s 1965 book', Guides::get('near-base')['body']);
        $this->assertStringContainsString('no well-established Japanese origin', Guides::get('area-grid')['body']);
        $this->assertStringContainsString('23 × 83', Guides::get('square-identities')['body']);
        $this->assertStringContainsString('38 × 1,001 = 38,038', Guides::get('fixed-multipliers')['body']);
        $this->assertStringContainsString('997 × 1,003', Guides::get('difference-squares')['body']);
        $this->assertStringContainsString('| 1/6 | 0.1666… |', Guides::get('fraction-percent')['body']);
        $this->assertStringContainsString('| 0.5% | half of 1% |', Guides::get('percent-chunks')['body']);
        $this->assertStringContainsString('| 7 | 343 |', Guides::get('number-facts')['body']);
        $this->assertStringContainsString('Complement to five', Guides::get('mental-abacus')['body']);
    }
}
