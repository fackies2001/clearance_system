<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Mail;
use App\Mail\TwoFactorOtpMail;

class TwoFactorController extends Controller
{
    // Show OTP input page
    public function index()
    {
        if (session('two_factor_verified')) {
            return redirect()->route('dashboard');
        }

        return inertia('Auth/TwoFactor');
    }

    // Verify OTP
    public function verify(Request $request)
    {
        $request->validate([
            'code' => 'required|string|size:6',
        ]);

        $user = auth()->user();

        // Check kung expired na
        if ($user->isTwoFactorExpired()) {
            return back()->withErrors([
                'code' => 'Your OTP has expired. Please request a new one.'
            ]);
        }

        // Check kung tama yung code
        if ($request->code !== $user->two_factor_code) {
            return back()->withErrors([
                'code' => 'Invalid OTP code. Please try again.'
            ]);
        }

        // OTP correct — i-clear at i-set session
        $user->resetTwoFactorCode();
        session(['two_factor_verified' => true]);

        // Redirect based sa role
        if ($user->isAdmin()) {
            return redirect()->route('admin.dashboard');
        }

        return redirect()->route('application.status');
    }

    // Resend OTP
    public function resend()
    {
        $user = auth()->user();

        $user->generateTwoFactorCode();

        Mail::to($user->email)
            ->send(new TwoFactorOtpMail(
                $user->two_factor_code,
                $user->name
            ));

        return back()->with('status', 'A new OTP has been sent to your email.');
    }
}