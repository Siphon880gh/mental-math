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
}
