<?php

declare(strict_types=1);

use PHPUnit\Framework\TestCase;
use Reflex\Catalog\Tracks;
use Reflex\Coaching\Navigate;
use Reflex\Coaching\Sessions;
use Reflex\Coaching\Validate;
use Reflex\Catalog\Guides;

final class CoachingTest extends TestCase
{
    public function testPercentShiftSample(): void
    {
        $loaded = Sessions::load('percent-shift');
        $this->assertTrue($loaded['ok']);
        $r = Validate::session($loaded['session']);
        $this->assertTrue($r['ok']);
        $nodes = $loaded['session']['tree']['nodes'];
        $wrongs = array_filter($nodes, static fn (array $n) => ($n['outcome'] ?? '') === 'wrong');
        $successes = array_filter($nodes, static fn (array $n) => ($n['outcome'] ?? '') === 'success');
        $this->assertGreaterThanOrEqual(2, count($wrongs));
        $this->assertGreaterThanOrEqual(1, count($successes));
    }

    public function testRejectsBadGraph(): void
    {
        $bad = [
            'meta' => [
                'slug' => 'bad',
                'title' => 'Bad',
                'summary' => 'Bad',
                'familyId' => 'bad',
                'tags' => ['beginner'],
            ],
            'tree' => [
                'start' => 'start',
                'nodes' => [
                    'start' => [
                        'message' => 'Go',
                        'outcome' => 'continue',
                        'choices' => [['id' => 'x', 'label' => 'x', 'next' => 'missing']],
                    ],
                    'wrong' => [
                        'message' => 'oops',
                        'outcome' => 'wrong',
                        'choices' => [],
                    ],
                    'success' => [
                        'message' => 'done',
                        'outcome' => 'success',
                        'choices' => [['id' => 'nope', 'label' => 'leave', 'next' => 'start']],
                    ],
                ],
            ],
        ];
        $r = Validate::session($bad);
        $this->assertFalse($r['ok']);
        $codes = array_column($r['issues'], 'code');
        $this->assertContains('bad_next', $codes);
        $this->assertContains('missing_rewind', $codes);
        $this->assertContains('terminal_choices', $codes);
    }

    public function testMissingStart(): void
    {
        $r = Validate::graph([
            'start' => 'nope',
            'nodes' => [
                'start' => ['message' => 'x', 'outcome' => 'success', 'choices' => []],
            ],
        ]);
        $this->assertFalse($r['ok']);
        $this->assertTrue(in_array('missing_start', array_column($r['issues'], 'code'), true));
    }

    public function testOneSessionPerFamily(): void
    {
        $slugs = array_map(static fn (array $m) => $m['slug'], Sessions::listValidMeta());
        sort($slugs);
        $expected = Tracks::allCurriculumFamilyIds();
        sort($expected);
        $this->assertSame($expected, $slugs);
        foreach (Guides::all() as $guide) {
            $loaded = Sessions::load($guide['relatedCoachSlug']);
            $this->assertTrue($loaded['ok'], $guide['slug']);
            if (!$loaded['ok']) {
                continue;
            }
            $this->assertSame($guide['familyId'], $loaded['session']['meta']['familyId']);
            $this->assertSame($guide['slug'], $loaded['session']['meta']['slug']);
        }
    }

    public function testDedicatedStepsForThinTechniques(): void
    {
        $expected = [
            'easy-division' => ['partial', 'missing', 'buildup'],
            'round-compensate' => ['add998', 'compatible'],
            'difference-squares' => ['near'],
            'magnitude' => ['decimal'],
            'cast-nines' => ['sum'],
            'divisibility' => ['seven', 'composite'],
            'double-half' => ['peasant', 'egypt'],
            'criss-cross' => ['three'],
            'fixed-multipliers' => ['trach12', 'trach12b', 'trach6'],
        ];
        foreach ($expected as $slug => $nodeIds) {
            $loaded = Sessions::load($slug);
            $this->assertTrue($loaded['ok'], $slug);
            $nodes = $loaded['session']['tree']['nodes'];
            foreach ($nodeIds as $id) {
                $this->assertArrayHasKey($id, $nodes, $slug . ' ' . $id);
                $this->assertSame('continue', $nodes[$id]['outcome']);
                $wrongs = array_filter($nodes[$id]['choices'], static fn (array $c) => ($nodes[$c['next']]['outcome'] ?? '') === 'wrong');
                $this->assertGreaterThanOrEqual(2, count($wrongs), $slug . ' ' . $id);
            }
        }
    }

    public function testNavKeyPrefix(): void
    {
        $this->assertSame('reflex_core_coaching_nav_v1:', Navigate::NAV_KEY_PREFIX);
    }

    public function testChooseAndRewind(): void
    {
        $loaded = Sessions::load('percent-shift');
        $this->assertTrue($loaded['ok']);
        $session = $loaded['session'];
        $start = Navigate::initial($session['tree']);
        $startNode = $session['tree']['nodes'][$start['currentNodeId']];
        $correct = null;
        foreach ($startNode['choices'] as $choice) {
            if ($choice['id'] === 'two') {
                $correct = $choice;
            }
        }
        $this->assertNotNull($correct);
        $next = Navigate::choose($session, $start['currentNodeId'], $correct['id'], $start['history']);
        $this->assertTrue($next['ok']);
        $this->assertSame('apply', $next['state']['currentNodeId']);
        $this->assertSame(['start'], $next['state']['history']);

        $apply = $session['tree']['nodes']['apply'];
        $wrongChoice = null;
        foreach ($apply['choices'] as $choice) {
            if (str_starts_with((string) $choice['next'], 'wrong_')) {
                $wrongChoice = $choice;
                break;
            }
        }
        $this->assertNotNull($wrongChoice);
        $landed = Navigate::choose($session, $next['state']['currentNodeId'], $wrongChoice['id'], $next['state']['history']);
        $this->assertTrue($landed['ok']);
        $this->assertSame('wrong', $session['tree']['nodes'][$landed['state']['currentNodeId']]['outcome']);
        $back = Navigate::stepBack($session['tree'], $landed['state']);
        $this->assertTrue($back['ok']);
        $this->assertSame('apply', $back['state']['currentNodeId']);
        $targeted = Navigate::rewindTo($session['tree'], $landed['state'], 'apply');
        $this->assertTrue($targeted['ok']);
        $this->assertSame('apply', $targeted['state']['currentNodeId']);
    }

    public function testInvalidChoice(): void
    {
        $loaded = Sessions::load('anchors');
        $this->assertTrue($loaded['ok']);
        $r = Navigate::choose($loaded['session'], 'start', 'nope', []);
        $this->assertFalse($r['ok']);
        $this->assertSame('invalid_choice', $r['error']);
    }

    public function testTheRightMoveIsNotAlwaysTheFirstButton(): void
    {
        $steps = 0;
        $rightFirst = 0;
        foreach (Sessions::all() as $slug => $session) {
            $raw = json_decode((string) file_get_contents(ROOT . '/data/coaching/' . $slug . '.json'), true);
            foreach ($session['tree']['nodes'] as $id => $node) {
                if ($node['outcome'] !== 'continue') {
                    continue;
                }
                $this->assertEqualsCanonicalizing(array_column($raw['tree']['nodes'][$id]['choices'], 'id'), array_column($node['choices'], 'id'), $slug . ' ' . $id);
                $steps++;
                $first = $session['tree']['nodes'][$node['choices'][0]['next']];
                if ($first['outcome'] !== 'wrong') {
                    $rightFirst++;
                }
            }
        }
        $this->assertGreaterThan(50, $steps);
        $this->assertLessThan(0.5, $rightFirst / $steps, "right move first in {$rightFirst} of {$steps} steps");
        $this->assertSame(Sessions::load('near-base')['session'], Sessions::load('near-base')['session']);
    }
}
