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
                if ($blocks !== [] && $blocks[count($blocks) - 1][0] === 'table') {
                    $blocks[] = ['gap', 0, ''];
                }
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
            } elseif (preg_match('/^\|.+\|$/', $line)) {
                $cells = self::cells($line);
                if (self::isDivider($cells)) {
                    continue;
                }
                $last = count($blocks) - 1;
                if ($last >= 0 && $blocks[$last][0] === 'table') {
                    $blocks[$last][2][] = $cells;
                } else {
                    $blocks[] = ['table', 0, [$cells]];
                }
            } elseif (preg_match('/^[-| :]+$/', $line)) {
                continue;
            } else {
                $blocks[] = ['p', 0, $line];
            }
        }

        $html = '<div class="md">';
        foreach ($blocks as $block) {
            [$type, $level, $text] = $block;
            if ($type === 'gap') {
                continue;
            }
            if ($type === 'table') {
                $html .= self::table($text);
                continue;
            }
            $inner = self::inline((string) $text);
            if ($type === 'h') {
                $html .= $level === 1 ? "<h1>{$inner}</h1>" : ($level === 2 ? "<h2>{$inner}</h2>" : "<h3>{$inner}</h3>");
            } elseif ($type === 'quote') {
                $html .= "<blockquote>{$inner}</blockquote>";
            } elseif ($type === 'li') {
                $html .= "<li>{$inner}</li>";
            } else {
                $html .= "<p>{$inner}</p>";
            }
        }

        return $html . '</div>';
    }

    /** @return list<string> */
    private static function cells(string $line): array
    {
        return array_map('trim', explode('|', trim(trim($line), '|')));
    }

    /** @param list<string> $cells */
    private static function isDivider(array $cells): bool
    {
        foreach ($cells as $cell) {
            if (preg_match('/^:?-{3,}:?$/', $cell) !== 1) {
                return false;
            }
        }

        return true;
    }

    /** @param list<list<string>> $rows */
    private static function table(array $rows): string
    {
        $head = array_shift($rows) ?? [];
        $html = '<div class="md-table"><table><thead><tr>';
        foreach ($head as $cell) {
            $html .= '<th scope="col">' . self::inline($cell) . '</th>';
        }
        $html .= '</tr></thead><tbody>';
        foreach ($rows as $row) {
            $html .= '<tr>';
            foreach ($row as $cell) {
                $html .= '<td>' . self::inline($cell) . '</td>';
            }
            $html .= '</tr>';
        }

        return $html . '</tbody></table></div>';
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
