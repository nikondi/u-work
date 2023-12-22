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
     * @param string $role
     * @return mixed
     */
    public function handle(Request $request, Closure $next, string $role): mixed
    {
        if(auth()->user()->hasRole('admin'))
            return $next($request);

        if(!auth()->user()->hasRole($role))
            abort(403);

        return $next($request);
    }
}
