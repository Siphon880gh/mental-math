<?php

declare(strict_types=1);

use Reflex\Catalog\Guides;
use Reflex\Catalog\PassTags;

function e(?string $value): string
{
    return htmlspecialchars($value ?? '', ENT_QUOTES | ENT_SUBSTITUTE, 'UTF-8');
}

function app_base(): string
{
    $script = str_replace('\\', '/', (string) ($_SERVER['SCRIPT_NAME'] ?? ''));
    if (preg_match('#^(.*)/index\.php$#', $script, $m) !== 1) {
        return '';
    }
    $base = rtrim($m[1], '/');

    return $base === '/' ? '' : $base;
}

function url(string $path): string
{
    if ($path === '' || $path[0] !== '/') {
        $path = '/' . ltrim($path, '/');
    }

    return app_base() . $path;
}

function json_script(string $id, mixed $data): string
{
    $json = json_encode($data, JSON_THROW_ON_ERROR | JSON_UNESCAPED_SLASHES | JSON_UNESCAPED_UNICODE);
    $json = str_replace('</', '<\\/', $json);

    return '<script type="application/json" id="' . e($id) . '">' . $json . '</script>';
}

function lesson_link(string $familyId, ?string $children = null): string
{
    $href = Guides::hrefForFamilyGuide($familyId);
    $guide = Guides::forFamilyOne($familyId);
    $label = $children ?? $familyId;
    if ($href === null) {
        return e($label);
    }
    $title = $guide
        ? 'Open “' . $guide['title'] . '” in a new window'
        : 'Open ' . $label . ' in a new window';

    return '<a href="' . e($href) . '" target="_blank" rel="noopener noreferrer" class="lesson-link" title="'
        . e($title) . '" aria-label="' . e($label) . ', opens in a new window">'
        . e($label)
        . '<span class="lesson-link__ext" aria-hidden="true">↗</span></a>';
}

function skill_links(array $ids, ?string $label = 'Skills in play'): string
{
    if ($ids === []) {
        return '';
    }
    $parts = [];
    foreach ($ids as $i => $id) {
        $parts[] = ($i > 0 ? '<span aria-hidden="true"> · </span>' : '') . lesson_link((string) $id);
    }
    $prefix = $label !== null && $label !== ''
        ? '<span class="skill-line__label">' . e($label) . ': </span>'
        : '';

    return '<span class="skill-line">' . $prefix . implode('', $parts) . '</span>';
}

function resource_tagger(string $resourceKey, bool $page = false): string
{
    $rowClass = $page ? 'tags-row tags-row--page js-tagger' : 'tags-row js-tagger';
    $popClass = $page ? 'pop pop--tags pop--tags-start' : 'pop pop--tags';
    $panel = tag_groups_html();

    return '<div class="' . $rowClass . '" data-resource-key="' . e($resourceKey) . '">'
        . '<div class="js-tag-chips"></div>'
        . '<div class="' . $popClass . '">'
        . '<button type="button" class="tag-add js-tag-add" aria-expanded="false" aria-haspopup="dialog">+ Tag</button>'
        . '<div class="pop__panel pop__panel--tags" hidden role="dialog" aria-label="Add tag">' . $panel . '</div>'
        . '</div></div>';
}

function pass_filter_bar(): string
{
    return '<div class="pop pop--filter js-filter">'
        . '<button type="button" class="pop__btn js-filter-btn" aria-expanded="false" aria-haspopup="dialog">'
        . '<span class="pop__caret" aria-hidden="true">⌄</span> Filter'
        . '<span class="pop__count js-filter-count" hidden></span>'
        . '</button>'
        . '<div class="pop__panel" hidden role="dialog" aria-label="Filter by tag">'
        . tag_groups_html()
        . '<div class="pop__foot"><button type="button" class="tag-clear js-filter-clear" disabled>Clear tags</button></div>'
        . '</div></div>';
}

function tag_groups_html(): string
{
    $html = '';
    $icons = ['first-pass' => '①', 'second-pass' => '②'];
    foreach (PassTags::GROUPS as $group) {
        $html .= '<section class="tag-group"><p class="tag-group__label">'
            . '<span aria-hidden="true">' . ($icons[$group['id']] ?? '') . '</span> ' . e($group['label'])
            . '</p><ul class="tag-list">';
        foreach (PassTags::tagsInGroup($group['id']) as $tag) {
            $html .= '<li><button type="button" class="tag-row js-tag-row" data-tag-id="' . e($tag['id']) . '" aria-pressed="false">'
                . '<span class="tag-swatch" aria-hidden="true" style="--tag: ' . e($tag['color']) . '"></span>'
                . '<span class="tag-row__label">' . e($tag['label']) . '</span>'
                . '<span class="tag-row__mark" aria-hidden="true" hidden>✓</span>'
                . '</button></li>';
        }
        $html .= '</ul></section>';
    }

    return $html;
}

function peek_banner(string $surface, bool $showGateLinks = false): string
{
    $copy = [
        'cases' => [
            'locked' => 'Cases make more sense after the timed fluency gate on percents and conversions. Want to look around first? You can open every pack for this browser session only.',
            'enable' => 'Browse this session',
        ],
        'case' => [
            'locked' => 'This case is clearer after percents and conversions on a timer. You can still open it for this browser session only — that peek is temporary and does not save as path progress.',
            'enable' => 'Open this case this session',
        ],
        'drills' => [
            'locked' => 'Later path groups stay locked until the previous milestone is complete. You can open them for this browser session only.',
            'enable' => 'Browse this session',
        ],
        'drill' => [
            'locked' => 'This path group is locked until the previous milestone is complete. You can still open it for this browser session only.',
            'enable' => 'Open this drill this session',
        ],
    ][$surface] ?? null;
    if ($copy === null) {
        return '';
    }
    $tip = 'Temporary — clears when you close the tab. Does not save as path progress.';
    $gates = $showGateLinks
        ? '<a href="' . e(url('/drills/percents')) . '">Percents drill</a><a href="' . e(url('/drills/conversions')) . '">Conversions drill</a>'
        : '';

    return '<div class="js-peek-off coach-panel">'
        . '<p>' . e($copy['locked']) . '</p>'
        . '<p class="example">' . e($tip) . '</p>'
        . '<p class="coach-controls">' . $gates
        . '<button type="button" data-peek="on">' . e($copy['enable']) . '</button>'
        . '</p></div>'
        . '<div class="js-peek-on coach-panel">'
        . '<p>Temporary session peek is on — path progress is not saved.</p>'
        . '<p class="example">' . e($tip) . '</p>'
        . '<p class="coach-controls"><button type="button" data-peek="off">Turn off temporary peek</button></p>'
        . '</div>';
}
