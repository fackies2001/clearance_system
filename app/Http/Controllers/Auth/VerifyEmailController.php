<?php

namespace App\Http\Controllers\Auth;

use App\Http\Controllers\Controller;
use App\Mail\TwoFactorOtpMail;
use Illuminate\Auth\Events\Verified;
use Illuminate\Foundation\Auth\EmailVerificationRequest;
use Illuminate\Http\RedirectResponse;
use Illuminate\Support\Facades\Mail;

class VerifyEmailController extends Controller
{
    public function __invoke(EmailVerificationRequest $request): RedirectResponse
    {
        $user = $request->user();   

        if (!$user->hasVerifiedEmail()) {
            $user->markEmailAsVerified();
            event(new Verified($user));
        }

        // Reset 2FA session
        session()->forget('two_factor_verified');

        // Generate at send OTP after email verification
        $user->generateTwoFactorCode();
        Mail::to($user->email)->send(new TwoFactorOtpMail(
            $user->two_factor_code,
            $user->name
        ));

        // Redirect sa OTP page
        return redirect()->route('two-factor.index');
    }
}