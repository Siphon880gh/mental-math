<?php

declare(strict_types=1);

use PHPUnit\Framework\TestCase;
use Reflex\Markdown;

final class MarkdownTest extends TestCase
{
    public function testRendersTables(): void
    {
        $html = Markdown::render("| ÷ | Test |\n|---|------|\n| **7** | trim |\n| 13 | add 4× |\n\nAfter.");
        $this->assertStringContainsString('<th scope="col"><span>÷</span></th>', $html);
        $this->assertStringContainsString('<td><strong>7</strong></td>', $html);
        $this->assertSame(2, substr_count($html, '<tr><td>'));
        $this->assertStringContainsString('<p><span>After.</span></p>', $html);
        $this->assertStringNotContainsString('---', $html);
    }

    public function testBlankLineSplitsTables(): void
    {
        $html = Markdown::render("| a |\n|---|\n| 1 |\n\n| b |\n|---|\n| 2 |");
        $this->assertSame(2, substr_count($html, '<table>'));
    }

    public function testSorobanDirectiveDrawsBeads(): void
    {
        $html = Markdown::render("::soroban 47 | Before: 47.\n::soroban 0\n::soroban x");
        $this->assertSame(2, substr_count($html, '<figure class="soroban"'));
        $this->assertStringContainsString('aria-label="Soroban showing 47"', $html);
        $this->assertStringContainsString('<figcaption>Before: 47.</figcaption>', $html);
        // 4 = four ones, five bead off; 7 = five bead on plus two ones.
        $this->assertStringContainsString('data-digit="4"><div class="soroban__upper"><span class="soroban__bead soroban__bead--five"></span>', $html);
        $this->assertStringContainsString('data-digit="7"><div class="soroban__upper"><span class="soroban__gap"></span><span class="soroban__bead soroban__bead--five is-on">', $html);
        $this->assertSame(4 + 2, substr_count($html, 'soroban__bead is-on'));
        $this->assertStringContainsString('aria-label="Soroban showing 0"', $html);
        $this->assertStringContainsString('<p><span>::soroban x</span></p>', $html);
    }
}
