<?php

namespace App\Http\Controllers\Auth;

use App\Http\Controllers\Controller;
use App\Mail\TwoFactorOtpMail;
use App\Models\User;
use Illuminate\Auth\Events\Registered;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Facades\Mail;
use Illuminate\Validation\Rules;
use Illuminate\Validation\ValidationException;
use Inertia\Inertia;
use Inertia\Response;

class RegisteredUserController extends Controller
{
    public function create(): Response
    {
        return Inertia::render('Auth/Register');
    }

            public function store(Request $request): RedirectResponse
    {
        $request->validate([
            'first_name'    => 'required|string|max:255',
            'last_name'     => 'required|string|max:255',
            'middle_name'   => 'nullable|string|max:255',
            'gender'        => 'required|in:Male,Female',
            'civil_status'  => 'required|in:Single,Married,Widowed,Separated',
            'birth_year'    => 'required|digits:4|integer|min:1900|max:' . date('Y'),
            'birth_month'   => 'required|string',
            'birth_day'     => 'required|string',
            'mobile_number' => 'required|string|size:11|regex:/^09[0-9]{9}$/',
            'email'         => 'required|string|lowercase|email|max:255|unique:' . User::class,
            'password'      => ['required', 'confirmed', Rules\Password::defaults()],
        ]);

        // Build full name from parts
        $fullName = trim(implode(' ', array_filter([
            $request->first_name,
            $request->middle_name,
            $request->last_name,
        ])));

        $user = User::create([
            'name'     => $fullName,
            'email'    => $request->email,
            'password' => Hash::make($request->password),
        ]);

        event(new Registered($user));
        Auth::login($user);

        session()->forget('two_factor_verified');

        return redirect()->route('verification.notice');
    }
}