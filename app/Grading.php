<?php

declare(strict_types=1);

namespace Reflex;

final class Grading
{
    public const FLUENCY_GATE = [
        'percents' => ['minAccuracy' => 0.8, 'medianLatencyMs' => 5000],
        'conversions' => ['minAccuracy' => 0.8, 'medianLatencyMs' => 6000],
    ];

    private const MONEY_UNITS = ['usd', 'dollar', 'dollars', '$'];

    public static function gradeAnswer(float|int $expected, float|int $given, ?string $unit = null): string
    {
        if (!is_finite((float) $given) || !is_finite((float) $expected)) {
            return 'incorrect';
        }
        if ((float) $given === (float) $expected) {
            return 'correct';
        }
        $money = $unit !== null && in_array(strtolower($unit), self::MONEY_UNITS, true);
        if ($money && abs((float) $given - (float) $expected) < 1) {
            return 'close';
        }

        return 'incorrect';
    }

    /** @param list<float|int> $values */
    public static function median(array $values): float
    {
        if ($values === []) {
            return 0.0;
        }
        $sorted = array_values($values);
        sort($sorted, SORT_NUMERIC);
        $mid = (int) floor(count($sorted) / 2);
        if (count($sorted) % 2 === 0) {
            return ($sorted[$mid - 1] + $sorted[$mid]) / 2;
        }

        return (float) $sorted[$mid];
    }

    public static function fluencyPassed(
        float $accuracy,
        float $medianLatencyMs,
        float $maxMedianMs,
        float $minAccuracy,
    ): bool {
        return $accuracy >= $minAccuracy && $medianLatencyMs <= $maxMedianMs;
    }
}
