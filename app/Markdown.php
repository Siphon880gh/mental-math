<?php

declare(strict_types=1);

namespace Reflex;

final class Markdown
{
    public static function render(string $source): string
    {
        $blocks = [];
        foreach (explode("\n", str_replace("\r\n", "\n", $source)) as $raw) {
            $line = rtrim($raw);
            if (trim($line) === '') {
                continue;
            }
            if (str_starts_with($line, '### ')) {
                $blocks[] = ['h', 3, substr($line, 4)];
            } elseif (str_starts_with($line, '## ')) {
                $blocks[] = ['h', 2, substr($line, 3)];
            } elseif (str_starts_with($line, '# ')) {
                $blocks[] = ['h', 1, substr($line, 2)];
            } elseif (str_starts_with($line, '> ')) {
                $blocks[] = ['quote', 0, substr($line, 2)];
            } elseif (str_starts_with($line, '- ')) {
                $blocks[] = ['li', 0, substr($line, 2)];
            } elseif (preg_match('/^\|.+\|$/', $line) || preg_match('/^[-| :]+$/', $line)) {
                continue;
            } else {
                $blocks[] = ['p', 0, $line];
            }
        }

        $html = '<div class="md">';
        foreach ($blocks as $block) {
            [$type, $level, $text] = $block;
            $inner = self::inline((string) $text);
            $html .= match ($type) {
                'h' => $level === 1 ? "<h1>{$inner}</h1>" : ($level === 2 ? "<h2>{$inner}</h2>" : "<h3>{$inner}</h3>"),
                'quote' => "<blockquote>{$inner}</blockquote>",
                'li' => "<li>{$inner}</li>",
                default => "<p>{$inner}</p>",
            };
        }

        return $html . '</div>';
    }

    private static function inline(string $text): string
    {
        $out = '';
        $last = 0;
        if (preg_match_all('/\*\*(.+?)\*\*/', $text, $matches, PREG_OFFSET_CAPTURE)) {
            foreach ($matches[0] as $i => $full) {
                $start = (int) $full[1];
                if ($start > $last) {
                    $out .= '<span>' . e(substr($text, $last, $start - $last)) . '</span>';
                }
                $out .= '<strong>' . e($matches[1][$i][0]) . '</strong>';
                $last = $start + strlen($full[0]);
            }
        }
        if ($last < strlen($text)) {
            $out .= '<span>' . e(substr($text, $last)) . '</span>';
        }

        return $out;
    }
}
