<?php

namespace Database\Seeders;

use App\Models\User;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\Hash;

class AdminSeeder extends Seeder
{
    /**
     * Seed the default admin account for NBI System.
     */
    public function run(): void
    {
        // Create default admin account if it doesn't exist yet
        User::firstOrCreate(
            ['email' => 'admin@nbi.gov.ph'],
            [
                'name' => 'NBI Admin',
                'email' => 'admin@nbi.gov.ph',
                'password' => Hash::make('Admin@12345'),
                'role' => 'admin',
            ]
        );
    }
}
