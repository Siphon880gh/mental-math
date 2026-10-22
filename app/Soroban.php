<?php

declare(strict_types=1);

namespace Reflex;

/**
 * Static soroban bead diagram. Each rod is one place: one upper bead worth 5,
 * four lower beads worth 1. Beads counted in are pushed against the beam.
 * public/assets/js/soroban.js builds the same markup for the game.
 */
final class Soroban
{
    public static function html(string $digits, string $caption = ''): string
    {
        $digits = ltrim($digits, '0') === '' ? '0' : ltrim($digits, '0');
        $label = 'Soroban showing ' . number_format((int) $digits);
        $html = '<figure class="soroban"><div class="soroban__frame" role="img" aria-label="' . e($label) . '">';
        foreach (str_split($digits) as $char) {
            $html .= self::rod((int) $char);
        }
        $html .= '</div>';
        if ($caption !== '') {
            $html .= '<figcaption>' . e($caption) . '</figcaption>';
        }

        return $html . '</figure>';
    }

    private static function rod(int $digit): string
    {
        $five = $digit >= 5;
        $ones = $digit % 5;
        $bead = static fn (bool $on, string $extra = ''): string => '<span class="soroban__bead' . $extra . ($on ? ' is-on' : '') . '"></span>';
        $gap = '<span class="soroban__gap"></span>';
        $html = '<div class="soroban__rod" data-digit="' . $digit . '"><div class="soroban__upper">';
        $html .= $five ? $gap . $bead(true, ' soroban__bead--five') : $bead(false, ' soroban__bead--five') . $gap;
        $html .= '</div><div class="soroban__beam"></div><div class="soroban__lower">';
        for ($i = 0; $i < $ones; $i++) {
            $html .= $bead(true);
        }
        $html .= $gap;
        for ($i = $ones; $i < 4; $i++) {
            $html .= $bead(false);
        }

        return $html . '</div><span class="soroban__digit">' . $digit . '</span></div>';
    }
}
