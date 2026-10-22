<?php

declare(strict_types=1);

namespace Reflex;

use Reflex\Catalog\CaseRedirects;
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
        if (preg_match('#^/cases/([^/]+)$#', $path, $m) === 1) {
            $moved = CaseRedirects::target($m[1]);
            if ($moved !== null) {
                return Response::redirect(url('/cases/' . $moved), 301);
            }
        }

        Pages::takeStatus();
        $html = null;
        if ($path === '/') {
            $html = Pages::home($request);
        } elseif ($path === '/track-a') {
            $html = Pages::track($request, 'quick');
        } elseif ($path === '/track-b') {
            $html = Pages::track($request, 'stakeholder');
        } elseif (preg_match('#^/guides/([^/]+)$#', $path, $m)) {
            $html = Pages::guide($request, $m[1]);
        } elseif (preg_match('#^/coach/([^/]+)$#', $path, $m)) {
            $html = Pages::coach($request, $m[1]);
        } elseif ($path === '/toolbox') {
            $html = Pages::toolbox($request);
        } elseif ($path === '/drills') {
            $html = Pages::drills($request);
        } elseif (preg_match('#^/drills/([^/]+)$#', $path, $m)) {
            $html = Pages::drill($request, $m[1]);
        } elseif ($path === '/cases') {
            $html = Pages::cases($request);
        } elseif (preg_match('#^/cases/([^/]+)$#', $path, $m)) {
            $html = Pages::caseStudy($request, $m[1]);
        } elseif ($path === '/scenarios') {
            $html = Pages::scenarios($request);
        } elseif (preg_match('#^/scenarios/([^/]+)$#', $path, $m)) {
            $html = Pages::scenario($request, $m[1]);
        } elseif ($path === '/games') {
            $html = Pages::games($request);
        } elseif (preg_match('#^/games/([^/]+)$#', $path, $m)) {
            $html = Pages::game($request, $m[1]);
        }

        if ($html === null) {
            return Response::html(Pages::notFound($request), 404);
        }

        return Response::html($html, Pages::takeStatus());
    }
}
