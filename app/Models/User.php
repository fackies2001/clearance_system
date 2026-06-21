<?php

namespace App\Models;

use Database\Factories\UserFactory;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Foundation\Auth\User as Authenticatable;
use Illuminate\Notifications\Notifiable;
use Illuminate\Support\Facades\Mail;
use Illuminate\Support\Str;

class User extends Authenticatable implements \Illuminate\Contracts\Auth\MustVerifyEmail
{
    use HasFactory, Notifiable;

        protected $fillable = [
        'name',
        'email',
        'password',
        'role',
        'avatar',
        'two_factor_code',
        'two_factor_expires_at',
        'two_factor_enabled',
    ];

    protected $appends = ['avatar_url'];

    protected $hidden = [
        'password',
        'remember_token',
        'two_factor_code',
    ];

    protected function casts(): array
    {
        return [
            'email_verified_at'      => 'datetime',
            'password'               => 'hashed',
            'two_factor_expires_at'  => 'datetime',
            'two_factor_enabled'     => 'boolean',
        ];
    }

    // Helper methods para sa role checking
    public function isAdmin(): bool
    {
        return $this->role === 'admin';
    }

    public function isUser(): bool
    {
        return $this->role === 'user';
    }

    public function isAppointmentConfirmer(): bool
    {
        return $this->role === 'appointment_confirmer';
    }

    // Generate at send ng OTP sa email
    public function generateTwoFactorCode(): void
    {
        $this->update([
            'two_factor_code'       => str_pad(random_int(0, 999999), 6, '0', STR_PAD_LEFT),
            'two_factor_expires_at' => now()->addMinutes(10),
        ]);
    }

    // Reset OTP after verified
    public function resetTwoFactorCode(): void
    {
        $this->update([
            'two_factor_code'       => null,
            'two_factor_expires_at' => null,
        ]);
    }

    // Check kung expired na yung OTP
    public function isTwoFactorExpired(): bool
    {
        return $this->two_factor_expires_at
            && now()->isAfter($this->two_factor_expires_at);
    }

    public function appointment()
    {
        return $this->hasMany(Appointment::class);
    }

        public function getAvatarUrlAttribute(): ?string
    {
        return $this->avatar
            ? \Illuminate\Support\Facades\Storage::url($this->avatar)
            : null;
    }

}