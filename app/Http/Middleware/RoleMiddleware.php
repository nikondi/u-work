<?php

namespace App\Http\Middleware;

use Closure;
use Illuminate\Http\Request;
use Symfony\Component\HttpFoundation\Response;

class RoleMiddleware
{
    /**
     * Handle an incoming request.
     * @param Request $request
     * @param Closure $next
     * @param string[] $roles
     * @return mixed
     */
    public function handle(Request $request, Closure $next, ...$roles): mixed
    {
        if(auth()->user()->hasRole('admin'))
            return $next($request);

        if(!auth()->user()->hasRole(...$roles))
            abort(403);

        return $next($request);
    }
}
