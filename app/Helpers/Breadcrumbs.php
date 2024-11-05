<?php

namespace App\Helpers;

use BadMethodCallException;
use Illuminate\Contracts\Support\Arrayable;

/**
 * @method static Breadcrumbs link(string $url, string $text)
 * @method Breadcrumbs link(string $url, string $text)
 * @method static Breadcrumbs text(string $text)
 * @method Breadcrumbs text(string $text)
 * */
class Breadcrumbs implements Arrayable
{
    private array $breadcrumbs;

    private const ALLOWED_METHODS = ['link', 'text'];

    public function __construct($breadcrumbs = [])
    {
        $this->breadcrumbs = $breadcrumbs;
    }

    private function __clone() {}

    public static function __callStatic($method, $arguments)
    {
        if (in_array($method, static::ALLOWED_METHODS)) {
            return (new Breadcrumbs)->{'_'.$method}(...$arguments);
        }

        throw new BadMethodCallException;
    }

    public function __call($method, $arguments)
    {
        if (in_array($method, static::ALLOWED_METHODS)) {
            return $this->{'_'.$method}(...$arguments);
        }

        throw new BadMethodCallException;
    }

    private function _link($url, $text): Breadcrumbs
    {
        $this->breadcrumbs[] = ['link' => $url, 'text' => $text];

        return $this;
    }

    private function _text($text): Breadcrumbs
    {
        $this->breadcrumbs[] = ['text' => $text];

        return $this;
    }

    public function append(Breadcrumbs|array $breadcrumbs): static
    {
        if ($breadcrumbs instanceof Breadcrumbs) {
            $breadcrumbs = $breadcrumbs->toArray();
        }
        $this->breadcrumbs = [...$this->breadcrumbs, ...$breadcrumbs];

        return $this;
    }

    public function toArray(): array
    {
        return $this->breadcrumbs;
    }
}
