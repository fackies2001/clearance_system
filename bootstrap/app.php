<?php

use Illuminate\Foundation\Application;
use Illuminate\Foundation\Configuration\Exceptions;
use Illuminate\Foundation\Configuration\Middleware;

return Application::configure(basePath: dirname(__DIR__))
    ->withRouting(
        web: __DIR__ . '/../routes/web.php',
        commands: __DIR__ . '/../routes/console.php',
        health: '/up',
    )
    ->withMiddleware(function (Middleware $middleware): void {
        $middleware->web(append: [
            \App\Http\Middleware\HandleInertiaRequests::class,
            \Illuminate\Http\Middleware\AddLinkHeadersForPreloadedAssets::class,
            \App\Http\Middleware\SecurityHeadersMiddleware::class,
        ]);

        // Global rate limit — 60 requests per minute per IP, no Redis needed
        $middleware->web(prepend: [
        \Illuminate\Routing\Middleware\ThrottleRequests::class.':60,1',
        ]);

        $middleware->alias([
        'admin'                 => \App\Http\Middleware\AdminMiddleware::class,
        'appointment.confirmer' => \App\Http\Middleware\AppointmentConfirmerMiddleware::class,
        'two-factor'            => \App\Http\Middleware\TwoFactorMiddleware::class,
    ]);
    
    })
    ->withExceptions(function (Exceptions $exceptions): void {
        //
    })->create();