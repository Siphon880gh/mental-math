<?php

declare(strict_types=1);

namespace Reflex;

final class View
{
    /** @param array<string, mixed> $data */
    public static function render(string $template, array $data = []): string
    {
        extract($data, EXTR_SKIP);
        ob_start();
        require ROOT . '/app/views/' . $template . '.php';

        return (string) ob_get_clean();
    }

    /** @param array<string, mixed> $data */
    public static function page(string $template, array $data = []): string
    {
        $data['content'] = self::render('pages/' . $template, $data);

        return self::render('layout', $data);
    }
}
