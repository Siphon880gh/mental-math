<?php

declare(strict_types=1);

use PHPUnit\Framework\TestCase;
use Reflex\Progress;

final class ProgressTest extends TestCase
{
    public function testDefaults(): void
    {
        $state = Progress::defaultProgress();
        $this->assertContains('E4.M0', Progress::BEGINNER_MILESTONE_IDS);
        $this->assertSame('active', $state['milestones']['E4.M1']);
        $this->assertSame('locked', $state['milestones']['E4.M0']);
        $this->assertSame('locked', $state['milestones']['E5.M2']);
        $this->assertSame(1, $state['version']);
    }

    public function testParseRoundTrip(): void
    {
        $state = Progress::defaultProgress();
        $state['streaks']['current'] = 3;
        $parsed = Progress::parseStored(json_encode($state, JSON_THROW_ON_ERROR));
        $this->assertFalse($parsed['recovered']);
        $this->assertSame(3, $parsed['state']['streaks']['current']);
        $this->assertSame('beginner-reflex', $parsed['state']['pathId']);
    }

    public function testCorruptJsonRecovers(): void
    {
        $parsed = Progress::parseStored('{not-json');
        $this->assertTrue($parsed['recovered']);
        $this->assertSame('active', $parsed['state']['milestones']['E4.M1']);
    }

    public function testSlowMediansDoNotCompleteGate(): void
    {
        $state = Progress::defaultProgress();
        $state['drillScores'] = [
            'anchors' => ['correct' => 16, 'total' => 16, 'medianLatencyMs' => 1000],
            'magnitude' => ['correct' => 16, 'total' => 16, 'medianLatencyMs' => 1000],
            'percents' => ['correct' => 16, 'total' => 16, 'medianLatencyMs' => 9000],
            'conversions' => ['correct' => 16, 'total' => 16, 'medianLatencyMs' => 1000],
            'break-even' => ['correct' => 16, 'total' => 16, 'medianLatencyMs' => 1000],
        ];
        $next = Progress::refreshUnlocks($state);
        $this->assertSame('complete', $next['milestones']['E4.M3']);
        $this->assertSame('active', $next['milestones']['E4.M0']);
        $this->assertTrue(Progress::areCasesLocked($next));
    }
}
