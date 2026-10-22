<?php

declare(strict_types=1);

use PHPUnit\Framework\TestCase;
use Reflex\App;
use Reflex\Http\Request;

final class RoutesTest extends TestCase
{
    private function html(string $path, array $query = []): string
    {
        $raw = App::handle(Request::get($path, $query))->body;

        return (string) preg_replace('#<script\b[^>]*>.*?</script>#si', '', $raw);
    }

    public function testHomeTitleAndContinue(): void
    {
        $html = $this->html('/');
        $this->assertMatchesRegularExpression('/<h1>Mental Math Trainer<\/h1>/', $html);
        $this->assertStringContainsString('five minutes of reflex training, no calculator', $html);
        $this->assertStringContainsString('href="/index.php?route=%2Fdrills%2Fanchors">Continue', $html);
        $this->assertStringContainsString('href="/index.php?route=%2Ftrack-a"', $html);
        $this->assertStringContainsString('href="/index.php?route=%2Ftrack-b"', $html);
        $this->assertStringNotContainsString('>Home<', $html);
        $this->assertStringNotContainsString('>Archive<', $html);
        $this->assertStringNotContainsString('>Guides<', $html);
    }

    public function testSubdirectoryBasePath(): void
    {
        $prevScript = $_SERVER['SCRIPT_NAME'] ?? null;
        $prevUri = $_SERVER['REQUEST_URI'] ?? null;
        $prevMethod = $_SERVER['REQUEST_METHOD'] ?? null;
        $_SERVER['SCRIPT_NAME'] = '/weng/app/math/index.php';
        $_SERVER['REQUEST_URI'] = '/weng/app/math/track-a';
        $_SERVER['REQUEST_METHOD'] = 'GET';
        $req = Request::fromGlobals();
        $this->assertSame('/track-a', $req->path);
        $this->assertSame('/weng/app/math/index.php?route=%2Ftrack-a', url('/track-a'));
        if ($prevScript === null) {
            unset($_SERVER['SCRIPT_NAME']);
        } else {
            $_SERVER['SCRIPT_NAME'] = $prevScript;
        }
        if ($prevUri === null) {
            unset($_SERVER['REQUEST_URI']);
        } else {
            $_SERVER['REQUEST_URI'] = $prevUri;
        }
        if ($prevMethod === null) {
            unset($_SERVER['REQUEST_METHOD']);
        } else {
            $_SERVER['REQUEST_METHOD'] = $prevMethod;
        }
        $this->assertSame('/index.php?route=%2Ftrack-a', url('/track-a'));
    }

    public function testAssetUrlsUseTheFilesAvailableFromEitherDocumentRoot(): void
    {
        $previousDocumentRoot = $_SERVER['DOCUMENT_ROOT'] ?? null;
        $_SERVER['DOCUMENT_ROOT'] = dirname(__DIR__);
        $this->assertSame('/public/assets/css/app.css', asset_url('/css/app.css'));

        $_SERVER['DOCUMENT_ROOT'] = dirname(__DIR__) . '/public';
        $this->assertSame('/assets/css/app.css', asset_url('/css/app.css'));

        if ($previousDocumentRoot === null) {
            unset($_SERVER['DOCUMENT_ROOT']);
        } else {
            $_SERVER['DOCUMENT_ROOT'] = $previousDocumentRoot;
        }
    }

    public function testNginxUsesQueryRoutesInsteadOfRequiringRewrites(): void
    {
        $previousSoftware = $_SERVER['SERVER_SOFTWARE'] ?? null;
        $previousScript = $_SERVER['SCRIPT_NAME'] ?? null;
        $previousUri = $_SERVER['REQUEST_URI'] ?? null;
        $previousMethod = $_SERVER['REQUEST_METHOD'] ?? null;
        $_SERVER['SERVER_SOFTWARE'] = 'nginx/1.26';
        $_SERVER['SCRIPT_NAME'] = '/mental-math/index.php';

        $this->assertSame('/mental-math/index.php?route=%2Fscenarios', url('/scenarios'));
        $this->assertSame('/mental-math/index.php', url('/'));
        $this->assertSame('/mental-math/public/assets/css/app.css', asset_url('/css/app.css'));
        $this->assertSame('/mental-math/index.php', route_base());

        $_SERVER['REQUEST_URI'] = '/mental-math/index.php?route=%2Fscenarios';
        $_SERVER['REQUEST_METHOD'] = 'GET';
        $this->assertSame('/scenarios', Request::fromGlobals()->path);

        if ($previousSoftware === null) {
            unset($_SERVER['SERVER_SOFTWARE']);
        } else {
            $_SERVER['SERVER_SOFTWARE'] = $previousSoftware;
        }
        if ($previousScript === null) {
            unset($_SERVER['SCRIPT_NAME']);
        } else {
            $_SERVER['SCRIPT_NAME'] = $previousScript;
        }
        if ($previousUri === null) {
            unset($_SERVER['REQUEST_URI']);
        } else {
            $_SERVER['REQUEST_URI'] = $previousUri;
        }
        if ($previousMethod === null) {
            unset($_SERVER['REQUEST_METHOD']);
        } else {
            $_SERVER['REQUEST_METHOD'] = $previousMethod;
        }
    }

    public function testIndexPhpIsHome(): void
    {
        $html = $this->html('/index.php');
        $this->assertStringContainsString('five minutes of reflex training, no calculator', $html);
        $viaPathInfo = $this->html('/index.php/track-a');
        $this->assertStringContainsString('A. Quick math for business and everyday life', $viaPathInfo);
    }

    public function testArchiveRedirects(): void
    {
        $res = App::handle(Request::get('/archive'));
        $this->assertSame(302, $res->status);
        $this->assertSame('/index.php?route=%2Ftrack-a', $res->headers['Location']);
        $guides = App::handle(Request::get('/guides'));
        $this->assertSame(302, $guides->status);
        $this->assertSame('/index.php?route=%2Ftrack-a', $guides->headers['Location']);
    }

    public function testUnknownSlugsReturn404(): void
    {
        $paths = [
            '/guides/not-a-guide',
            '/coach/not-a-family',
            '/drills/not-a-group',
            '/cases/ar-nope',
            '/scenarios/not-a-scenario',
            '/games/not-a-game',
            '/no-such-page',
        ];
        foreach ($paths as $path) {
            $res = App::handle(Request::get($path));
            $this->assertSame(404, $res->status, $path);
            $this->assertStringContainsString('<html', $res->body, $path);
        }
        $this->assertStringContainsString('Unknown case.', App::handle(Request::get('/cases/ar-nope'))->body);
        $pack = App::handle(Request::get('/cases', ['pack' => 'not-a-pack']));
        $this->assertSame(404, $pack->status);
        $this->assertStringContainsString('Unknown case pack: not-a-pack.', $pack->body);
        $this->assertSame(200, App::handle(Request::get('/cases', ['pack' => 'arithmetic-in-the-room']))->status);
    }

    public function testKnownSlugsReturn200AfterA404(): void
    {
        $this->assertSame(404, App::handle(Request::get('/cases/ar-nope'))->status);
        foreach (['/guides/dilution', '/coach/anchors', '/drills/foundations', '/cases/ar-seats-19', '/scenarios/seats-nineteen-year', '/games/eleven-neighbors', '/toolbox'] as $path) {
            $this->assertSame(200, App::handle(Request::get($path))->status, $path);
        }
    }

    public function testTrackAAndB(): void
    {
        $a = $this->html('/track-a');
        $this->assertStringContainsString('A. Quick math for business and everyday life', $a);
        $this->assertStringContainsString('Number anchors', $a);
        $this->assertStringNotContainsString('Fully loaded headcount', $a);
        $this->assertStringContainsString('First-Pass Tag', $a);
        $this->assertStringContainsString('Ready to transition', $a);
        $b = $this->html('/track-b');
        $this->assertStringContainsString('B. Business and entrepreneurship stakeholder discussion and planning math', $b);
        $this->assertStringContainsString('Dilution and post-money', $b);
    }

    public function testGuideAndCoach(): void
    {
        $guide = $this->html('/guides/dilution');
        $this->assertMatchesRegularExpression('/percent sold ≈ cash \/ post-money/i', $guide);
        $this->assertStringContainsString('Open coach: dilution', $guide);
        $anchors = $this->html('/coach/anchors');
        $this->assertMatchesRegularExpression('/hear the chord, then scale zeros/i', $anchors);
        $this->assertMatchesRegularExpression('/hear 5 × 4 = 20/i', $anchors);
        $missing = $this->html('/coach/not-a-family');
        $this->assertStringContainsString('not authored yet', $missing);
        $this->assertStringContainsString('Track A', $missing);
    }

    public function testCasesLockedCopyHidesChains(): void
    {
        $html = $this->html('/cases');
        $this->assertStringContainsString('Graded cases stay locked until the timed fluency gate', $html);
        $this->assertStringContainsString('percents + conversions timed gate', $html);
        $this->assertStringNotContainsString('Hourly ×720', $html);
        $this->assertStringContainsString('Browse this session', $html);
    }

    public function testUnlockedCasePromptHidesChain(): void
    {
        $html = $this->html('/cases/sf-gpu-18');
        $this->assertMatchesRegularExpression('/GPU is \$1\/hr and we charge \$40\/mo/i', $html);
        $this->assertStringNotContainsString('Hourly ×720 → $720/mo', $html);
        $this->assertStringContainsString('Your number', $html);
    }

    public function testUnknownGameAndLists(): void
    {
        $html = $this->html('/games/not-a-game');
        $this->assertStringContainsString('Game not found', $html);
        $drills = $this->html('/drills');
        $this->assertStringContainsString('Filter', $drills);
        $this->assertStringContainsString('+ Tag', $drills);
        $games = $this->html('/games');
        $this->assertStringContainsString('Decimal shifter', $games);
        $scenarios = $this->html('/scenarios');
        $this->assertStringContainsString('One GPU, one price', $scenarios);
        $this->assertStringContainsString('A. Quick math for business and everyday life', $scenarios);
        $this->assertStringContainsString('B. Business and entrepreneurship stakeholder discussion and planning math', $scenarios);
        $play = $this->html('/scenarios/box-cover');
        $this->assertMatchesRegularExpression('/GPU is \$1\/hr/i', $play);
        $this->assertStringNotContainsString('Users = 720 ÷ 40 = 18', $play);
        $this->assertStringContainsString('>Hint<', $play);
        $drill = $this->html('/drills/percents');
        $this->assertStringContainsString('Open this drill this session', $drill);
        $this->assertStringContainsString('1% of 8,500', $drill);
    }

    public function testToolboxPage(): void
    {
        $html = $this->html('/toolbox');
        $this->assertStringContainsString('Twelve master techniques', $html);
        $this->assertStringContainsString('Suggested progression', $html);
        $this->assertStringContainsString('Bharati Krishna Tirtha', $html);
        $this->assertStringContainsString('href="/index.php?route=%2Fguides%2Fnear-base"', $html);
        $this->assertMatchesRegularExpression('/href="\/index\.php\?route=%2Ftoolbox" class="is-current">Toolbox</', $html);
        $home = $this->html('/');
        $this->assertStringContainsString('>Toolbox<', $home);
    }

    public function testGuideTablesRender(): void
    {
        $html = $this->html('/guides/fixed-multipliers');
        $this->assertStringContainsString('<table>', $html);
        $this->assertStringContainsString('<td><span>1001</span></td>', $html);
        $this->assertStringContainsString('Open coach: fixed-multipliers', $html);
        $coach = $this->html('/coach/near-base');
        $this->assertStringContainsString('97 × 94', $coach);
    }

    public function testNewGamesRender(): void
    {
        $this->assertStringContainsString('js-pair-tiles', $this->html('/games/pair-hundred'));
        $eleven = $this->html('/games/eleven-neighbors');
        $this->assertStringContainsString('js-eleven-choices', $eleven);
        $this->assertStringContainsString('2- or 3-digit number × 11', $eleven);
        $nearBase = $this->html('/games/near-base-gaps');
        $this->assertStringContainsString('js-nb-choices', $nearBase);
        $this->assertStringContainsString('near 100 or 1,000', $nearBase);
        $this->assertStringContainsString('Near-base gaps', $this->html('/games'));
        $soroban = $this->html('/games/soroban-rod');
        $this->assertStringContainsString('js-soroban-choices', $soroban);
        $this->assertStringContainsString('aria-label="Soroban showing 47"', $soroban);
        $this->assertStringContainsString('Soroban rod', $this->html('/games'));
        $guide = $this->html('/guides/mental-abacus');
        $this->assertSame(9, substr_count($guide, 'class="soroban"'));
        $this->assertStringContainsString('aria-label="Soroban showing 46"', $guide);
        $this->assertStringContainsString('aria-label="Soroban showing 55"', $guide);
    }

    public function testNavActiveOnGuide(): void
    {
        $html = $this->html('/guides/anchors');
        $this->assertMatchesRegularExpression('/href="\/index\.php\?route=%2Ftrack-a"[^>]*class="is-current"/', $html);
        $this->assertStringContainsString('A. Quick math for business and everyday life', $html);
    }
}
