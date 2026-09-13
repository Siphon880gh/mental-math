<?php

declare(strict_types=1);

namespace Reflex\Coaching;

final class Validate
{
    /**
     * @param array{start: string, nodes: array<string, array<string, mixed>>} $tree
     * @return array{ok: bool, issues: list<array{code: string, message: string, nodeId?: string}>}
     */
    public static function graph(array $tree, bool $requireWrong = false): array
    {
        $issues = [];
        $nodeIds = array_keys($tree['nodes'] ?? []);
        $known = array_fill_keys($nodeIds, true);

        if (($tree['start'] ?? '') === '' || !isset($tree['nodes'][$tree['start']])) {
            $issues[] = [
                'code' => 'missing_start',
                'message' => 'start "' . ($tree['start'] ?? '') . '" does not reference an existing node',
            ];
        }

        $successCount = 0;
        $wrongCount = 0;
        $continueCount = 0;

        foreach ($tree['nodes'] ?? [] as $id => $node) {
            if (trim((string) ($node['message'] ?? '')) === '') {
                $issues[] = ['code' => 'empty_message', 'message' => 'Node message must be non-empty', 'nodeId' => (string) $id];
            }
            $outcome = $node['outcome'] ?? '';
            if (!in_array($outcome, ['continue', 'wrong', 'success'], true)) {
                $issues[] = ['code' => 'bad_outcome', 'message' => 'Unknown outcome "' . (string) $outcome . '"', 'nodeId' => (string) $id];
                continue;
            }
            $choices = $node['choices'] ?? [];
            if ($outcome === 'success') {
                $successCount++;
                if ($choices !== []) {
                    $issues[] = ['code' => 'terminal_choices', 'message' => 'success nodes must not expose choices', 'nodeId' => (string) $id];
                }
            }
            if ($outcome === 'wrong') {
                $wrongCount++;
                if ($choices !== []) {
                    $issues[] = ['code' => 'terminal_choices', 'message' => 'wrong nodes must not expose choices', 'nodeId' => (string) $id];
                }
                $rewind = $node['rewind_to'] ?? null;
                if (!$rewind) {
                    $issues[] = ['code' => 'missing_rewind', 'message' => 'wrong nodes require rewind_to', 'nodeId' => (string) $id];
                } elseif (!isset($known[$rewind])) {
                    $issues[] = [
                        'code' => 'bad_rewind',
                        'message' => 'rewind_to "' . $rewind . '" does not reference an existing node',
                        'nodeId' => (string) $id,
                    ];
                }
            }
            if ($outcome === 'continue') {
                $continueCount++;
                if ($choices === []) {
                    $issues[] = [
                        'code' => 'continue_no_choices',
                        'message' => 'continue nodes should have at least one choice',
                        'nodeId' => (string) $id,
                    ];
                }
                $ids = [];
                foreach ($choices as $choice) {
                    $cid = (string) ($choice['id'] ?? '');
                    if (trim($cid) === '') {
                        $issues[] = ['code' => 'empty_choice_id', 'message' => 'Choice ids must be non-empty', 'nodeId' => (string) $id];
                    } elseif (isset($ids[$cid])) {
                        $issues[] = ['code' => 'duplicate_choice_id', 'message' => 'Duplicate choice id "' . $cid . '"', 'nodeId' => (string) $id];
                    } else {
                        $ids[$cid] = true;
                    }
                    if (trim((string) ($choice['label'] ?? '')) === '') {
                        $issues[] = ['code' => 'empty_label', 'message' => 'Choice labels must be non-empty', 'nodeId' => (string) $id];
                    }
                    $next = $choice['next'] ?? null;
                    if (!$next || !isset($known[$next])) {
                        $issues[] = [
                            'code' => 'bad_next',
                            'message' => 'choices[].next "' . (string) $next . '" does not reference an existing node',
                            'nodeId' => (string) $id,
                        ];
                    }
                }
            }
        }

        if ($successCount < 1) {
            $issues[] = ['code' => 'no_success', 'message' => 'Graph must include at least one success node'];
        }
        if ($requireWrong && $wrongCount < 2) {
            $issues[] = ['code' => 'no_wrong', 'message' => 'Session must include at least two wrong nodes'];
        }
        if ($requireWrong && $continueCount < 3) {
            $issues[] = [
                'code' => 'thin_continue',
                'message' => 'Session must include start plus at least two continue layers',
            ];
        }

        return ['ok' => $issues === [], 'issues' => $issues];
    }

    /**
     * @param array{meta: array<string, mixed>, tree: array{start: string, nodes: array<string, array<string, mixed>>}} $session
     * @return array{ok: bool, issues: list<array{code: string, message: string, nodeId?: string}>}
     */
    public static function session(array $session): array
    {
        $issues = [];
        $m = $session['meta'] ?? [];
        if (trim((string) ($m['slug'] ?? '')) === '') {
            $issues[] = ['code' => 'meta_slug', 'message' => 'meta.slug is required'];
        }
        if (trim((string) ($m['title'] ?? '')) === '') {
            $issues[] = ['code' => 'meta_title', 'message' => 'meta.title is required'];
        }
        if (trim((string) ($m['summary'] ?? '')) === '') {
            $issues[] = ['code' => 'meta_summary', 'message' => 'meta.summary is required'];
        }
        if (trim((string) ($m['familyId'] ?? '')) === '') {
            $issues[] = ['code' => 'meta_family', 'message' => 'meta.familyId is required'];
        }
        if (($m['slug'] ?? '') && ($m['familyId'] ?? '') && $m['slug'] !== $m['familyId']) {
            $issues[] = ['code' => 'slug_family', 'message' => 'meta.slug must equal meta.familyId'];
        }
        $tags = $m['tags'] ?? null;
        if (!is_array($tags)) {
            $issues[] = ['code' => 'meta_tags', 'message' => 'meta.tags must be an array'];
        } elseif (!in_array('beginner', $tags, true) && !in_array('intermediate', $tags, true)) {
            $issues[] = ['code' => 'meta_tags', 'message' => 'meta.tags must include beginner or intermediate'];
        }

        $graph = self::graph($session['tree'] ?? ['start' => '', 'nodes' => []], true);
        $all = [...$issues, ...$graph['issues']];

        return ['ok' => $all === [], 'issues' => $all];
    }
}
