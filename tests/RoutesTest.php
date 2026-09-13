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
        $this->assertStringContainsString('href="/drills/anchors">Continue', $html);
        $this->assertStringContainsString('href="/track-a"', $html);
        $this->assertStringContainsString('href="/track-b"', $html);
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
        $this->assertSame('/weng/app/math/track-a', url('/track-a'));
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
        $this->assertSame('/track-a', url('/track-a'));
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
        $this->assertSame('/track-a', $res->headers['Location']);
        $guides = App::handle(Request::get('/guides'));
        $this->assertSame(302, $guides->status);
        $this->assertSame('/track-a', $guides->headers['Location']);
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

    public function testNavActiveOnGuide(): void
    {
        $html = $this->html('/guides/anchors');
        $this->assertMatchesRegularExpression('/href="\/track-a"[^>]*class="is-current"/', $html);
        $this->assertStringContainsString('A. Quick math for business and everyday life', $html);
    }
}
