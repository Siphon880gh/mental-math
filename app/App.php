<?php

declare(strict_types=1);

namespace Reflex;

use Reflex\Http\Request;
use Reflex\Http\Response;

final class App
{
    public static function fromGlobals(): Response
    {
        return self::handle(Request::fromGlobals());
    }

    public static function handle(Request $request): Response
    {
        $path = $request->path;
        if ($path === '/archive' || $path === '/guides') {
            return Response::redirect(url('/track-a'));
        }

        $html = match (true) {
            $path === '/' => Pages::home($request),
            $path === '/track-a' => Pages::track($request, 'quick'),
            $path === '/track-b' => Pages::track($request, 'stakeholder'),
            (bool) preg_match('#^/guides/([^/]+)$#', $path, $m) => Pages::guide($request, $m[1]),
            (bool) preg_match('#^/coach/([^/]+)$#', $path, $m) => Pages::coach($request, $m[1]),
            $path === '/drills' => Pages::drills($request),
            (bool) preg_match('#^/drills/([^/]+)$#', $path, $m) => Pages::drill($request, $m[1]),
            $path === '/cases' => Pages::cases($request),
            (bool) preg_match('#^/cases/([^/]+)$#', $path, $m) => Pages::caseStudy($request, $m[1]),
            $path === '/scenarios' => Pages::scenarios($request),
            (bool) preg_match('#^/scenarios/([^/]+)$#', $path, $m) => Pages::scenario($request, $m[1]),
            $path === '/games' => Pages::games($request),
            (bool) preg_match('#^/games/([^/]+)$#', $path, $m) => Pages::game($request, $m[1]),
            default => null,
        };

        if ($html === null) {
            return Response::html(Pages::notFound($request), 404);
        }

        return Response::html($html);
    }
}
