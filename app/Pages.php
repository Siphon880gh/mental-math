<?php

declare(strict_types=1);

namespace Reflex;

use Reflex\Catalog\Cases;
use Reflex\Catalog\Drills;
use Reflex\Catalog\Games;
use Reflex\Catalog\Guides;
use Reflex\Catalog\LearningPaths;
use Reflex\Catalog\Scenarios;
use Reflex\Catalog\ThinkingModeTips;
use Reflex\Catalog\Tracks;
use Reflex\Catalog\Tricks;
use Reflex\Coaching\Navigate;
use Reflex\Coaching\Sessions;
use Reflex\Http\Request;

final class Pages
{
    public static function home(Request $request): string
    {
        $progress = Progress::defaultProgress();
        $path = LearningPaths::get($progress['pathId']);
        $next = LearningPaths::nextMilestone($path, $progress['milestones']);
        $ctaHref = $next ? LearningPaths::hrefForRef($next['contentRefs'][0]) : url('/track-a');

        return View::page('home', self::layout($request, [
            'page' => 'home',
            'path' => $path,
            'operatorPath' => LearningPaths::OPERATOR,
            'progress' => $progress,
            'next' => $next,
            'ctaHref' => $ctaHref,
            'tips' => ThinkingModeTips::ALL,
        ]));
    }

    public static function track(Request $request, string $track): string
    {
        return View::page('track', self::layout($request, [
            'page' => 'track',
            'section' => $track === 'quick' ? 'track-a' : 'track-b',
            'track' => $track,
            'guides' => Guides::forTrack($track),
        ]));
    }

    public static function guide(Request $request, string $slug): string
    {
        $guide = Guides::get($slug);
        if ($guide === null) {
            return View::page('missing-guide', self::layout($request, ['page' => 'guide']));
        }

        return View::page('guide', self::layout($request, [
            'page' => 'guide',
            'section' => $guide['track'] === 'quick' ? 'track-a' : 'track-b',
            'guide' => $guide,
            'shortcuts' => Tricks::forFamily($guide['familyId']),
            'coachReady' => Sessions::has($guide['relatedCoachSlug']),
            'bodyHtml' => Markdown::render($guide['body']),
        ]));
    }

    public static function coach(Request $request, string $slug): string
    {
        $guide = Guides::get($slug);
        $loaded = Sessions::load($slug);
        if ($loaded['ok'] !== true) {
            return View::page('coach-missing', self::layout($request, [
                'page' => 'coach',
                'section' => $guide ? ($guide['track'] === 'quick' ? 'track-a' : 'track-b') : null,
                'slug' => $slug,
                'guide' => $guide,
            ]));
        }
        $session = $loaded['session'];
        $state = Navigate::initial($session['tree']);
        $node = $session['tree']['nodes'][$state['currentNodeId']];

        return View::page('coach', self::layout($request, [
            'page' => 'coach',
            'section' => $guide ? ($guide['track'] === 'quick' ? 'track-a' : 'track-b') : null,
            'slug' => $slug,
            'guide' => $guide,
            'session' => $session,
            'state' => $state,
            'node' => $node,
        ]));
    }

    public static function drills(Request $request): string
    {
        return View::page('drills', self::layout($request, [
            'page' => 'drills',
            'section' => 'drills',
            'groups' => Drills::groups(),
            'progress' => Progress::defaultProgress(),
        ]));
    }

    public static function drill(Request $request, string $groupId): string
    {
        $group = Drills::group($groupId);
        if ($group === null) {
            return View::page('missing-drill', self::layout($request, ['page' => 'drill']));
        }
        $items = Drills::itemsForGroup($groupId);
        $progress = Progress::defaultProgress();
        $gated = Progress::isPathDrillLocked($groupId, $progress);

        return View::page('drill', self::layout($request, [
            'page' => 'drill',
            'section' => 'drills',
            'group' => $group,
            'groupId' => $groupId,
            'items' => $items,
            'gated' => $gated,
            'milestone' => Drills::BEGINNER_GROUP_MILESTONE[$groupId] ?? null,
        ]));
    }

    public static function cases(Request $request): string
    {
        $packFilter = $request->query('pack');
        $packs = Cases::packs();
        if ($packFilter) {
            $packs = array_values(array_filter($packs, static fn (array $p) => $p['id'] === $packFilter));
        }

        return View::page('cases', self::layout($request, [
            'page' => 'cases',
            'section' => 'cases',
            'packs' => $packs,
        ]));
    }

    public static function caseStudy(Request $request, string $caseId): string
    {
        $study = Cases::get($caseId);
        if ($study === null) {
            return View::page('missing-case', self::layout($request, ['page' => 'case']));
        }

        return View::page('case', self::layout($request, [
            'page' => 'case',
            'section' => 'cases',
            'study' => $study,
            'tip' => ThinkingModeTips::ALL[$study['thinkingMode']] ?? '',
        ]));
    }

    public static function scenarios(Request $request): string
    {
        return View::page('scenarios', self::layout($request, [
            'page' => 'scenarios',
            'section' => 'scenarios',
            'quick' => Scenarios::forTrack('quick'),
            'stakeholder' => Scenarios::forTrack('stakeholder'),
        ]));
    }

    public static function scenario(Request $request, string $scenarioId): string
    {
        $study = Scenarios::get($scenarioId);
        if ($study === null) {
            return View::page('missing-scenario', self::layout($request, ['page' => 'scenario']));
        }

        return View::page('scenario', self::layout($request, [
            'page' => 'scenario',
            'section' => 'scenarios',
            'study' => $study,
        ]));
    }

    public static function games(Request $request): string
    {
        return View::page('games', self::layout($request, [
            'page' => 'games',
            'section' => 'games',
            'games' => Games::all(),
        ]));
    }

    public static function game(Request $request, string $slug): string
    {
        $meta = Games::get($slug);
        $known = ['decimal-shift', 'percent-swap', 'percent-chips'];
        if ($meta === null || !in_array($slug, $known, true)) {
            return View::page('missing-game', self::layout($request, [
                'page' => 'game',
                'slug' => $slug,
            ]));
        }

        return View::page('game-' . $slug, self::layout($request, [
            'page' => 'game',
            'section' => 'games',
            'meta' => $meta,
            'slug' => $slug,
        ]));
    }

    public static function notFound(Request $request): string
    {
        return View::page('not-found', self::layout($request, ['page' => 'missing']));
    }

    /** @param array<string, mixed> $data @return array<string, mixed> */
    private static function layout(Request $request, array $data): array
    {
        $data['request'] = $request;
        $data['activeTrack'] = Nav::activeTrack($request->path);
        $data['trackNav'] = Tracks::NAV;
        $data['trackLabel'] = Tracks::LABEL;

        return $data;
    }
}
