<?php

namespace App\Http\Controllers;

use App\Http\Requests\ProfileUpdateRequest;
use Illuminate\Contracts\Auth\MustVerifyEmail;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Redirect;
use Inertia\Inertia;
use Inertia\Response;
use Illuminate\Support\Facades\Storage;

class ProfileController extends Controller
{
    /**
     * Display the user's profile form.
     */
    public function edit(Request $request): Response
    {
        return Inertia::render('Profile/Edit', [
            'mustVerifyEmail' => $request->user() instanceof MustVerifyEmail,
            'status' => session('status'),
        ]);
    }

    /**
     * Update the user's profile information.
     */
        public function update(ProfileUpdateRequest $request): RedirectResponse
    {
        $request->user()->fill($request->validated());

        if ($request->user()->isDirty('email')) {
            $request->user()->email_verified_at = null;
        }

        // Handle avatar upload
        if ($request->hasFile('avatar')) {
            $request->validate([
                'avatar' => 'image|mimes:jpg,jpeg,png|max:2048',
            ]);

            // Delete old avatar if exists
            if ($request->user()->avatar) {
                Storage::disk('public')->delete($request->user()->avatar);
            }

            $path = $request->file('avatar')->store('avatars', 'public');
            $request->user()->avatar = $path;
        }

        $request->user()->save();

        // Sync with active clearances
        \App\Models\Clearance::where('user_id', $request->user()->id)
            ->whereNotIn('workflow_status', ['released', 'rejected'])
            ->update([
                'email_address' => $request->user()->email,
            ]);

        return Redirect::route('profile.edit');
    }
}
