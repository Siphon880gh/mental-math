<?php

declare(strict_types=1);

use PHPUnit\Framework\TestCase;
use Reflex\Grading;

final class GradingTest extends TestCase
{
    public function testExactIntegerProducts(): void
    {
        $this->assertSame('correct', Grading::gradeAnswer(2000, 2000));
        $this->assertSame('correct', Grading::gradeAnswer(200, 200));
        $this->assertSame('incorrect', Grading::gradeAnswer(2000, 200));
    }

    public function testNearestDollarCloseOnMoney(): void
    {
        $this->assertSame('close', Grading::gradeAnswer(8.46, 8, 'usd'));
        $this->assertSame('correct', Grading::gradeAnswer(8.46, 8.46, '$'));
        $this->assertSame('incorrect', Grading::gradeAnswer(8.46, 20, 'usd'));
    }

    public function testFluencyFailsSlowMedians(): void
    {
        $this->assertFalse(Grading::fluencyPassed(
            1,
            Grading::FLUENCY_GATE['percents']['medianLatencyMs'] + 1,
            (float) Grading::FLUENCY_GATE['percents']['medianLatencyMs'],
            (float) Grading::FLUENCY_GATE['percents']['minAccuracy'],
        ));
        $this->assertTrue(Grading::fluencyPassed(
            0.8,
            4000,
            (float) Grading::FLUENCY_GATE['percents']['medianLatencyMs'],
            (float) Grading::FLUENCY_GATE['percents']['minAccuracy'],
        ));
    }

    public function testMedian(): void
    {
        $this->assertSame(3000.0, Grading::median([5000, 1000, 3000]));
    }
}
