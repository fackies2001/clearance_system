<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Appointment extends Model
{
    protected $fillable = [
        'user_id',
        'tracking_no',
        'appointment_date',
        'time_slot',
        'type',
        'queue_number',
        'status',
        'notes',
        'confirmed_by',
        'confirmed_at',
    ];

        protected $casts = [
        'appointment_date' => 'date:Y-m-d',
        'confirmed_at' => 'datetime',
    ];

    public function user()
    {
        return $this->belongsTo(User::class);
    }

    public function confirmedBy()
    {
        return $this->belongsTo(User::class, 'confirmed_by');
    }

    public function clearance()
    {
        return $this->belongsTo(Clearance::class, 'tracking_no', 'tracking_no');
    }
}
