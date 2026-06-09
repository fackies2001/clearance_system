<?php

namespace App\Http\Middleware;

use Closure;
use Illuminate\Http\Request;
use Symfony\Component\HttpFoundation\Response;

class SecurityHeadersMiddleware
{
    public function handle(Request $request, Closure $next): Response
    {
        $response = $next($request);

        // Prevents clickjacking attacks
        $response->headers->set('X-Frame-Options', 'SAMEORIGIN');

        // Prevents MIME type sniffing
        $response->headers->set('X-Content-Type-Options', 'nosniff');

        // Controls referrer info sent to other sites
        $response->headers->set('Referrer-Policy', 'strict-origin-when-cross-origin');

        // Disables browser features na hindi kailangan
        $response->headers->set('Permissions-Policy', 'camera=*, microphone=*, geolocation=()');

        // CSP — updated para sa Vite dev server + bunny fonts
        $csp = app()->environment('local')
            ? "default-src 'self' localhost:* 127.0.0.1:*; " .
              "script-src 'self' 'unsafe-inline' 'unsafe-eval' localhost:* 127.0.0.1:*; " .
              "style-src 'self' 'unsafe-inline' https://fonts.bunny.net; " .
              "font-src 'self' https://fonts.bunny.net; " .
              "img-src 'self' data: blob: https:; " .
              "connect-src 'self' http://localhost:* https://localhost:* http://127.0.0.1:* https://127.0.0.1:* ws://localhost:* wss://localhost:* ws://127.0.0.1:* wss://127.0.0.1:*; " .
              "frame-ancestors 'self';"
            : "default-src 'self'; " .
              "script-src 'self' 'unsafe-inline' 'unsafe-eval'; " .
              "style-src 'self' 'unsafe-inline' https://fonts.bunny.net; " .
              "font-src 'self' https://fonts.bunny.net; " .
              "img-src 'self' data: blob: https:; " .
              "connect-src 'self'; " .
              "frame-ancestors 'self';";

        $response->headers->set('Content-Security-Policy', $csp);

        return $response;
    }
}