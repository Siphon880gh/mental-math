<?php

declare(strict_types=1);

namespace Reflex\Http;

final class Response
{
    /** @param array<string, string> $headers */
    public $body;
    public $status;
    public $headers;

    public function __construct(string $body, int $status = 200, array $headers = ['Content-Type' => 'text/html; charset=UTF-8'])
    {
        $this->body = $body;
        $this->status = $status;
        $this->headers = $headers;
    }

    public static function html(string $body, int $status = 200): self
    {
        return new self($body, $status, ['Content-Type' => 'text/html; charset=UTF-8']);
    }

    public static function redirect(string $to, int $status = 302): self
    {
        return new self('', $status, ['Location' => $to]);
    }

    public function send(): void
    {
        http_response_code($this->status);
        foreach ($this->headers as $name => $value) {
            header($name . ': ' . $value);
        }
        echo $this->body;
    }
}
