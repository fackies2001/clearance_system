<?php

namespace App\Http\Middleware;

use Closure;
use Illuminate\Http\Request;
use Symfony\Component\HttpFoundation\Response;
use Illuminate\Support\Facades\Log;

class AppointmentConfirmerMiddleware
{
    public function handle(Request $request, Closure $next): Response
    {
        $user = auth()->user();

        if (!$user || (!$user->isAdmin() && !$user->isAppointmentConfirmer())) {

            Log::warning('Unauthorized appointment confirmer access attempt', [
                'user_id'    => auth()->id() ?? 'guest',
                'ip'         => $request->ip(),
                'url'        => $request->fullUrl(),
                'timestamp'  => now(),
            ]);

            abort(403, 'Unauthorized.');
        }

        return $next($request);
    }
}