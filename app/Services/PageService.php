<?php

namespace App\Services;

use App\Helpers\Breadcrumbs;
use BadMethodCallException;
use Illuminate\Contracts\Support\Arrayable;
use Inertia\Inertia;
use Inertia\Response;

/**
 * @property Breadcrumbs $breadcrumbs
 * @property string $title
 * @property string $h1
 *
 * @method PageService title(string $title)
 *
 * */
class PageService implements Arrayable
{
    private array $data = [
        'breadcrumbs' => null,
        'title' => null,
        'h1' => null
    ];

    public function __construct() {}

    public function __get(string $name)
    {
        if(isset($this->data[$name])) {
            return $this->data[$name];
        }

        return null;
    }

    public function set($name, $value): void
    {
        $this->data[$name] = $value;
    }

    public function toArray(): array
    {
        return $this->data;
    }

    public function __call(string $name, array $arguments)
    {
        if($name == 'title') {
            $this->set($name, $arguments[0]);
            return $this;
        }
        throw new BadMethodCallException();
    }

    public function h1($h1 = null): static
    {
        $this->set('h1', $h1 ?? $this->title);
        return $this;
    }

    public function breadcrumbs(Breadcrumbs|array|null $breadcrumbs = null): PageService
    {
        if(is_null($breadcrumbs)) {
            $breadcrumbs = Breadcrumbs::text($this->title ?? '');
        } elseif(is_array($breadcrumbs)) {
            $breadcrumbs = new Breadcrumbs($breadcrumbs);
        }
        $this->set('breadcrumbs', $breadcrumbs);

        return $this;
    }

    public function render(...$args): Response
    {
        Inertia::share($this->data);

        return Inertia::render(...$args);
    }
}
