<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\User;
use Illuminate\Http\Request;
use Inertia\Inertia;
use App\Helpers\AuditLogger;


class UserController extends Controller
{
    /**
     * Display the list of all registered users.
     */
    public function index()
    {
        $users = User::orderBy('created_at', 'desc')
            ->get()
            ->map(fn($user) => [
                'id' => $user->id,
                'name' => $user->name,
                'email' => $user->email,
                'role' => $user->role,
                'created_at' => $user->created_at,
            ]);

        return Inertia::render('Admin/UserManagement', [
            'users' => $users,
        ]);
    }

    /**
     * Update the role of a specific user.
     */
    public function updateRole(Request $request, User $user)
    {
        $request->validate([
            'role' => 'required|string|in:admin,user',
        ]);

        // Prevent admin from changing their own role
        if ($user->id === auth()->id()) {
            return back()->with('error', 'You cannot change your own role.');
        }

        $user->update(['role' => $request->role]);

        AuditLogger::log(
            action: 'role_updated',
            description: "Changed role of {$user->name} to '{$request->role}'.",
            subject: $user,
            oldValues: ['role' => $user->getOriginal('role')],
            newValues: ['role' => $request->role],
        );

        return back()->with('success', "Role of {$user->name} updated to {$request->role} successfully.");
    }

     /**
     * Remove the specified user from storage permanently.
     */
    public function destroy(User $user)
    {
        // PROTECTION 1: Prevent deletion of the Pioneer Admin account (ID: 1)
        if ($user->id === 1) {
            return back()->with('error', 'The Pioneer Admin account cannot be deleted. This account is strictly system-protected.');
        }

        // PROTECTION 2: Prevent the currently authenticated admin from deleting their own account
        if ($user->id === auth()->id()) {
            return back()->with('error', 'You cannot delete your own account while you are logged in.');
        }

        // Execute permanent account deletion if all validations pass
        $user->delete();

        // Log the deletion activity into the audit trailing system
        AuditLogger::log(
            action: 'user_deleted',
            description: "Permanently deleted user account: {$user->name} ({$user->email}).",
            subject: $user,
            oldValues: ['name' => $user->name, 'email' => $user->email, 'role' => $user->role],
            newValues: [],
        );

        return back()->with('success', "Successfully deleted the account of {$user->name}.");
    }
}
