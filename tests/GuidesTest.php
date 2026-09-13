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
        $this->assertSame('/guides/percent-chunks', Guides::hrefForFamilyGuide('percent-chunks'));
        $this->assertSame('/guides/month-year', Guides::hrefForFamilyGuide('month-year'));
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
}
