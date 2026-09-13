<?php

declare(strict_types=1);

namespace Reflex\Coaching;

final class Navigate
{
    public const NAV_KEY_PREFIX = 'reflex_core_coaching_nav_v1:';

    /**
     * @param array{start: string, nodes: array<string, array<string, mixed>>} $tree
     * @return array{currentNodeId: string, history: list<string>}
     */
    public static function initial(array $tree): array
    {
        $start = isset($tree['nodes'][$tree['start'] ?? ''])
            ? $tree['start']
            : (array_key_first($tree['nodes'] ?? []) ?? 'start');

        return ['currentNodeId' => (string) $start, 'history' => []];
    }

    /**
     * @param array{start: string, nodes: array<string, array<string, mixed>>} $tree
     * @param array{currentNodeId: string, history: list<string>} $state
     * @return array{currentNodeId: string, history: list<string>}
     */
    public static function ensureKnown(array $tree, array $state): array
    {
        if (isset($tree['nodes'][$state['currentNodeId']])) {
            return $state;
        }

        return self::initial($tree);
    }

    /**
     * @param array{meta: array<string, mixed>, tree: array{start: string, nodes: array<string, array<string, mixed>>}} $session
     * @param list<string> $history
     * @return array{ok: bool, error?: string, state: array{currentNodeId: string, history: list<string>}}
     */
    public static function choose(array $session, string $nodeId, string $choiceId, array $history = []): array
    {
        $tree = $session['tree'];
        $s = self::ensureKnown($tree, ['currentNodeId' => $nodeId, 'history' => $history]);
        $node = $tree['nodes'][$s['currentNodeId']] ?? null;
        if ($node === null) {
            return ['ok' => false, 'error' => 'unknown_node', 'state' => self::initial($tree)];
        }
        if (($node['outcome'] ?? '') !== 'continue') {
            return ['ok' => false, 'error' => 'terminal_node', 'state' => $s];
        }
        $match = null;
        foreach ($node['choices'] ?? [] as $choice) {
            if (($choice['id'] ?? '') === $choiceId) {
                $match = $choice;
                break;
            }
        }
        if ($match === null) {
            return ['ok' => false, 'error' => 'invalid_choice', 'state' => $s];
        }
        if (!isset($tree['nodes'][$match['next']])) {
            return ['ok' => false, 'error' => 'bad_next', 'state' => $s];
        }

        return [
            'ok' => true,
            'state' => [
                'currentNodeId' => $match['next'],
                'history' => [...$s['history'], $s['currentNodeId']],
            ],
        ];
    }

    /**
     * @param array{start: string, nodes: array<string, array<string, mixed>>} $tree
     * @param array{currentNodeId: string, history: list<string>} $state
     * @return array{ok: bool, error?: string, state: array{currentNodeId: string, history: list<string>}}
     */
    public static function stepBack(array $tree, array $state): array
    {
        $s = self::ensureKnown($tree, $state);
        $node = $tree['nodes'][$s['currentNodeId']] ?? null;
        if ($node === null) {
            return ['ok' => false, 'error' => 'unknown_node', 'state' => self::initial($tree)];
        }
        if (($node['outcome'] ?? '') === 'wrong' && !empty($node['rewind_to'])) {
            return self::rewindTo($tree, $s, (string) $node['rewind_to']);
        }
        if ($s['history'] === []) {
            return ['ok' => false, 'error' => 'no_history', 'state' => $s];
        }
        $history = array_slice($s['history'], 0, -1);
        $currentNodeId = $s['history'][count($s['history']) - 1];
        if (!isset($tree['nodes'][$currentNodeId])) {
            return ['ok' => true, 'state' => self::initial($tree)];
        }

        return ['ok' => true, 'state' => ['currentNodeId' => $currentNodeId, 'history' => $history]];
    }

    /**
     * @param array{start: string, nodes: array<string, array<string, mixed>>} $tree
     * @param array{currentNodeId: string, history: list<string>} $state
     * @return array{ok: bool, error?: string, state: array{currentNodeId: string, history: list<string>}}
     */
    public static function rewindTo(array $tree, array $state, string $nodeId): array
    {
        if (!isset($tree['nodes'][$nodeId])) {
            return ['ok' => false, 'error' => 'bad_rewind_target', 'state' => self::ensureKnown($tree, $state)];
        }
        $idx = array_search($nodeId, $state['history'], true);
        if ($idx === false) {
            return ['ok' => true, 'state' => ['currentNodeId' => $nodeId, 'history' => []]];
        }

        return [
            'ok' => true,
            'state' => [
                'currentNodeId' => $nodeId,
                'history' => array_slice($state['history'], 0, (int) $idx),
            ],
        ];
    }

    /**
     * @param array{start: string, nodes: array<string, array<string, mixed>>} $tree
     * @param array{currentNodeId: string, history: list<string>} $state
     */
    public static function canStepBack(array $tree, array $state): bool
    {
        $s = self::ensureKnown($tree, $state);
        $node = $tree['nodes'][$s['currentNodeId']] ?? null;
        if ($node === null) {
            return false;
        }
        if (($node['outcome'] ?? '') === 'wrong' && !empty($node['rewind_to'])) {
            return true;
        }

        return $s['history'] !== [];
    }
}
