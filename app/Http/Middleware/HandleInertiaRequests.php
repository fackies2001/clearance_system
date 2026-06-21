<?php

namespace App\Http\Middleware;

use Illuminate\Http\Request;
use Inertia\Middleware;

class HandleInertiaRequests extends Middleware
{
    /**
     * The root template that is loaded on the first page visit.
     *
     * @var string
     */
    protected $rootView = 'app';

    /**
     * Determine the current asset version.
     */
    public function version(Request $request): ?string
    {
        return parent::version($request);
    }

    /**
     * Define the props that are shared by default.
     *
     * @return array<string, mixed>
     */
    public function share(Request $request): array
    {
        return [
            ...parent::share($request),
            'auth' => [
               'user' => $request->user() ? [
                'id' => $request->user()->id,
                'name' => $request->user()->name,
                'email' => $request->user()->email,
                'role' => $request->user()->role,
                'avatar' => $request->user()->avatar,
                'avatar_url' => $request->user()->avatar_url,
            ] : null,
            
                'notifications' => $request->user() ? \App\Models\Notification::where('user_id', $request->user()->id)->latest()->take(10)->get() : [],
                'unreadCount'   => $request->user() ? \App\Models\Notification::where('user_id', $request->user()->id)->whereNull('read_at')->count() : 0,
            ],
            // Add this flash section so React can read our success messages
            'flash' => [
                'success' => $request->session()->get('success'),
                'clearance' => $request->session()->get('clearance'),
            ],
        ];
    }
}
