<?php

namespace App\Http\Middleware;

use Closure;
use Illuminate\Http\Request;
use Symfony\Component\HttpFoundation\Response;

class TwoFactorMiddleware
{
    protected array $except = [
        'password.*',
        'verification.*',
        'two-factor.*',
        'register',
        'login',
    ];

    public function handle(Request $request, Closure $next): Response
    {
        $user = auth()->user();

        if (!$user) {
            return $next($request);
        }

        foreach ($this->except as $route) {
            if ($request->routeIs($route)) {
                return $next($request);
            }
        }

        if (!session('two_factor_verified')) {
            return redirect()->route('two-factor.index');
        }

        return $next($request);
    }
}