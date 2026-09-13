<?php

declare(strict_types=1);

namespace Reflex;

use Reflex\Catalog\Drills;

final class Progress
{
    public const KEY = 'reflex_core_progress_v1';
    public const BEGINNER_PATH_ID = 'beginner-reflex';
    public const OPERATOR_PATH_ID = 'operator-cfo';

    public const BEGINNER_MILESTONE_IDS = ['E4.M1', 'E4.M2', 'E4.M3', 'E4.M0', 'E5.M2'];
    public const OPERATOR_MILESTONE_IDS = ['op-feasibility', 'op-unit-econ', 'op-runway', 'op-growth'];

    public const PATH_GROUPS = [
        'E4.M1' => ['anchors', 'magnitude'],
        'E4.M2' => ['percents'],
        'E4.M3' => ['conversions', 'break-even'],
    ];

    /** @return array<string, mixed> */
    public static function defaultProgress(): array
    {
        $milestones = [];
        foreach (self::BEGINNER_MILESTONE_IDS as $id) {
            $milestones[$id] = $id === 'E4.M1' ? 'active' : 'locked';
        }
        foreach (self::OPERATOR_MILESTONE_IDS as $id) {
            $milestones[$id] = $id === 'op-feasibility' ? 'active' : 'locked';
        }

        return [
            'version' => 1,
            'pathId' => self::BEGINNER_PATH_ID,
            'milestones' => $milestones,
            'drillScores' => [],
            'streaks' => ['current' => 0],
        ];
    }

    /**
     * @param array<string, mixed> $state
     * @param list<string> $groupIds
     */
    public static function groupsComplete(array $state, array $groupIds): bool
    {
        foreach ($groupIds as $id) {
            $score = $state['drillScores'][$id] ?? null;
            if (!$score || empty($score['total'])) {
                return false;
            }
        }

        return true;
    }

    /** @param array<string, mixed> $state */
    public static function isFluencyMet(array $state): bool
    {
        $percents = $state['drillScores']['percents'] ?? null;
        $conversions = $state['drillScores']['conversions'] ?? null;
        if (!$percents || !$conversions) {
            return false;
        }
        $pOk = Grading::fluencyPassed(
            $percents['correct'] / $percents['total'],
            (float) $percents['medianLatencyMs'],
            (float) Grading::FLUENCY_GATE['percents']['medianLatencyMs'],
            (float) Grading::FLUENCY_GATE['percents']['minAccuracy'],
        );
        $cOk = Grading::fluencyPassed(
            $conversions['correct'] / $conversions['total'],
            (float) $conversions['medianLatencyMs'],
            (float) Grading::FLUENCY_GATE['conversions']['medianLatencyMs'],
            (float) Grading::FLUENCY_GATE['conversions']['minAccuracy'],
        );

        return $pOk && $cOk;
    }

    /** @param array<string, mixed> $state @return array<string, mixed> */
    public static function refreshUnlocks(array $state): array
    {
        $m = $state['milestones'];
        if (self::groupsComplete($state, self::PATH_GROUPS['E4.M1'])) {
            $m['E4.M1'] = 'complete';
        }
        if ($m['E4.M1'] === 'complete') {
            $m['E4.M2'] = self::groupsComplete($state, self::PATH_GROUPS['E4.M2']) ? 'complete' : 'active';
        }
        if ($m['E4.M2'] === 'complete') {
            $m['E4.M3'] = self::groupsComplete($state, self::PATH_GROUPS['E4.M3']) ? 'complete' : 'active';
        }
        if ($m['E4.M3'] === 'complete') {
            $m['E4.M0'] = self::isFluencyMet($state) ? 'complete' : 'active';
        }
        if ($m['E4.M0'] === 'complete') {
            if ($m['E5.M2'] !== 'complete') {
                $m['E5.M2'] = 'active';
            }
        } else {
            $m['E5.M2'] = 'locked';
        }

        $ops = self::OPERATOR_MILESTONE_IDS;
        for ($i = 0; $i < count($ops); $i++) {
            $id = $ops[$i];
            if ($i === 0 && $m[$id] !== 'complete') {
                $m[$id] = 'active';
            }
            if ($m[$id] === 'complete' && isset($ops[$i + 1]) && $m[$ops[$i + 1]] !== 'complete') {
                $m[$ops[$i + 1]] = 'active';
            }
        }
        $state['milestones'] = $m;

        return $state;
    }

    /** @param array<string, mixed> $state */
    public static function areCasesLocked(array $state): bool
    {
        return ($state['milestones']['E4.M0'] ?? '') !== 'complete';
    }

    /** @param array<string, mixed> $state */
    public static function isPathDrillLocked(string $groupId, array $state): bool
    {
        $milestone = Drills::BEGINNER_GROUP_MILESTONE[$groupId] ?? null;
        if ($milestone === null) {
            return false;
        }

        return ($state['milestones'][$milestone] ?? '') === 'locked';
    }

    /**
     * Parse a stored JSON blob the way the browser would. Used by tests.
     * @return array{state: array<string, mixed>, recovered: bool}
     */
    public static function parseStored(?string $raw): array
    {
        $recovered = false;
        if ($raw === null || $raw === '') {
            return ['state' => self::defaultProgress(), 'recovered' => false];
        }
        try {
            $parsed = json_decode($raw, true, 512, JSON_THROW_ON_ERROR);
        } catch (\JsonException) {
            return ['state' => self::defaultProgress(), 'recovered' => true];
        }
        if (!is_array($parsed) || ($parsed['version'] ?? null) !== 1 || !self::knownPath((string) ($parsed['pathId'] ?? ''))) {
            return ['state' => self::defaultProgress(), 'recovered' => true];
        }
        $next = self::defaultProgress();
        $next['pathId'] = $parsed['pathId'];
        $next['drillScores'] = is_array($parsed['drillScores'] ?? null) ? $parsed['drillScores'] : [];
        $next['streaks'] = is_array($parsed['streaks'] ?? null) ? $parsed['streaks'] : ['current' => 0];
        foreach ([...self::BEGINNER_MILESTONE_IDS, ...self::OPERATOR_MILESTONE_IDS] as $id) {
            if (!empty($parsed['milestones'][$id])) {
                $next['milestones'][$id] = $parsed['milestones'][$id];
            } else {
                $recovered = true;
            }
        }
        if ($recovered && empty($parsed['milestones'])) {
            return ['state' => self::defaultProgress(), 'recovered' => true];
        }

        return ['state' => $next, 'recovered' => $recovered];
    }

    private static function knownPath(string $pathId): bool
    {
        return $pathId === self::BEGINNER_PATH_ID || $pathId === self::OPERATOR_PATH_ID;
    }
}
