<?php

namespace App\Http\Middleware;

use Closure;
use Illuminate\Http\Request;
use Symfony\Component\HttpFoundation\Response;

class TwoFactorMiddleware
{
    // Routes na hindi kailangan ng 2FA
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

        // Skip kung hindi naka-login
        if (!$user) {
            return $next($request);
        }

        // Skip kung nasa exempted routes
        foreach ($this->except as $route) {
            if ($request->routeIs($route)) {
                return $next($request);
            }
        }

        // Kung hindi pa nag-2FA, i-redirect sa OTP page
        if (!session('two_factor_verified')) {
            return redirect()->route('two-factor.index');
        }

        return $next($request);
    }
}