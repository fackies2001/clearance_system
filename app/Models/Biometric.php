<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Biometric extends Model
{
    use HasFactory;

    protected $fillable = [
        'clearance_id',
        'photo_path',
        'fingerprint_status',
        'verified_by_admin'
    ];

    /**
     * Get the clearance application that owns this biometric record.
     */
    public function clearance()
    {
        return $this->belongsTo(Clearance::class);
    }
}
