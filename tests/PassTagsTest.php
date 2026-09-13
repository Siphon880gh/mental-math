<?php

declare(strict_types=1);

use PHPUnit\Framework\TestCase;
use Reflex\Catalog\PassTags;

final class PassTagsTest extends TestCase
{
    public function testPresets(): void
    {
        $first = PassTags::tagsInGroup('first-pass');
        $second = PassTags::tagsInGroup('second-pass');
        $this->assertCount(4, $first);
        $this->assertSame('Ready to transition', $first[array_key_last($first)]['label']);
        $this->assertCount(4, $second);
    }

    public function testOrMatch(): void
    {
        $applied = ['guide:anchors' => ['pass']];
        $this->assertTrue(PassTags::resourceMatchesFilters('guide:anchors', 'track-a', $applied, []));
        $this->assertFalse(PassTags::resourceMatchesFilters('guide:anchors', 'track-a', $applied, ['track-a' => ['extreme']]));
        $this->assertTrue(PassTags::resourceMatchesFilters('guide:anchors', 'track-a', $applied, ['track-a' => ['extreme', 'pass']]));
        $this->assertTrue(PassTags::resourceMatchesFilters('guide:anchors', 'track-a', $applied, []));
    }
}
