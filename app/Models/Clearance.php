<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Clearance extends Model
{
    protected $fillable = [
        // Basic (existing)
        'user_id',
        'tracking_no',
        'clearance_number',
        'status',
        'photo_path',
        'pdf_path',

        // Personal Information
        'first_name',
        'middle_name',
        'last_name',
        'suffix',
        'date_of_birth',
        'place_of_birth',
        'sex',
        'civil_status',
        'nationality',

        // Present Address
        'present_street',
        'present_barangay',
        'present_city',
        'present_province',
        'present_zip',

        // Permanent Address
        'permanent_street',
        'permanent_barangay',
        'permanent_city',
        'permanent_province',
        'permanent_zip',

        // Contact Information
        'mobile_number',
        'email_address',

        // Purpose
        'purpose',

        'fingerprint_status',
        'workflow_status',
        'hit_resolution',
        'hit_notes',
        'reviewed_by',
        'reviewed_at',
        'admin_remarks',

        // Payment Sessions
        'payment_status',
        'payment_method',
        'payment_reference',
        'payment_amount',
        'paid_at',
        'released_at',
        'email_notified_at',
    ];

    /**
     * Get the applicant's full name.
     */
    public function getFullNameAttribute(): string
    {
        return trim(
            $this->first_name . ' ' .
                ($this->middle_name ? $this->middle_name . ' ' : '') .
                $this->last_name .
                ($this->suffix ? ', ' . $this->suffix : '')
        );
    }

    /**
     * Get the formatted present address.
     */
    public function getPresentAddressAttribute(): string
    {
        return implode(', ', array_filter([
            $this->present_street,
            $this->present_barangay,
            $this->present_city,
            $this->present_province,
            $this->present_zip,
        ]));
    }

    /**
     * Get the formatted permanent address.
     */
    public function getPermanentAddressAttribute(): string
    {
        return implode(', ', array_filter([
            $this->permanent_street,
            $this->permanent_barangay,
            $this->permanent_city,
            $this->permanent_province,
            $this->permanent_zip,
        ]));
    }

    /**
     * The admin user who reviewed this clearance.
     */
    public function reviewer(): \Illuminate\Database\Eloquent\Relations\BelongsTo
    {
        return $this->belongsTo(\App\Models\User::class, 'reviewed_by');
    }

    /**
     * The biometric record for this clearance.
     */
    public function biometric(): \Illuminate\Database\Eloquent\Relations\HasOne
    {
        return $this->hasOne(\App\Models\Biometric::class);
    }

    /**
     * The user who submitted this clearance.
     */
    public function user(): \Illuminate\Database\Eloquent\Relations\BelongsTo
    {
        return $this->belongsTo(\App\Models\User::class);
    }
}
