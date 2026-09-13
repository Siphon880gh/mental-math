<?php

declare(strict_types=1);

namespace Reflex\Coaching;

final class BuildMethodTree
{
    /**
     * @param array{
     *   slug: string,
     *   title: string,
     *   summary: string,
     *   tags: list<string>,
     *   layers: list<array<string, mixed>>,
     *   success: string
     * } $spec
     * @return array{meta: array<string, mixed>, tree: array{start: string, nodes: array<string, array<string, mixed>>}}
     */
    public static function fromSpec(array $spec): array
    {
        $nodes = [
            'success' => [
                'message' => $spec['success'],
                'outcome' => 'success',
                'choices' => [],
            ],
        ];
        foreach ($spec['layers'] as $layer) {
            $choices = [
                [
                    'id' => $layer['correct']['id'],
                    'label' => $layer['correct']['label'],
                    'next' => $layer['correct']['next'],
                ],
            ];
            foreach ($layer['wrongs'] as $wrong) {
                $choices[] = [
                    'id' => $wrong['id'],
                    'label' => $wrong['label'],
                    'next' => 'wrong_' . $layer['id'] . '_' . $wrong['id'],
                ];
            }
            $nodes[$layer['id']] = [
                'message' => $layer['message'],
                'outcome' => 'continue',
                'choices' => $choices,
            ];
            foreach ($layer['wrongs'] as $wrong) {
                $nodes['wrong_' . $layer['id'] . '_' . $wrong['id']] = [
                    'message' => $wrong['explain'],
                    'outcome' => 'wrong',
                    'choices' => [],
                    'rewind_to' => $layer['id'],
                ];
            }
        }

        return [
            'meta' => [
                'slug' => $spec['slug'],
                'title' => $spec['title'],
                'summary' => $spec['summary'],
                'familyId' => $spec['slug'],
                'tags' => $spec['tags'],
            ],
            'tree' => [
                'start' => $spec['layers'][0]['id'],
                'nodes' => $nodes,
            ],
        ];
    }
}
