<?php

namespace App\Http\Controllers\Auth;

use App\Http\Controllers\Controller;
use App\Http\Requests\Auth\LoginRequest;
use App\Mail\TwoFactorOtpMail;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Mail;
use Illuminate\Support\Facades\Route;
use Inertia\Inertia;
use Inertia\Response;

class AuthenticatedSessionController extends Controller
{
    public function create(): Response
    {
        return Inertia::render('Auth/Login', [
            'canResetPassword' => Route::has('password.request'),
            'status' => session('status'),
        ]);
    }

    public function store(LoginRequest $request): RedirectResponse
    {
        $request->authenticate();
        $request->session()->regenerate();

        $user = Auth::user();

        // I-check muna kung verified na yung email
        if (!$user->hasVerifiedEmail()) {
            return redirect()->route('verification.notice');
        }

        // Reset 2FA session para mag-require ulit ng OTP
        session()->forget('two_factor_verified');

        // Generate at send OTP — after email verification check
        $user->generateTwoFactorCode();
        Mail::to($user->email)->send(new TwoFactorOtpMail(
            $user->two_factor_code,
            $user->name
        ));

        // Redirect sa 2FA page
        return redirect()->route('two-factor.index');
    }

    public function destroy(Request $request): RedirectResponse
    {
        Auth::guard('web')->logout();

        // Clear 2FA session on logout
        $request->session()->forget('two_factor_verified');
        $request->session()->invalidate();
        $request->session()->regenerateToken();

        return redirect('/');
    }
}