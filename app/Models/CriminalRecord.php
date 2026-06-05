<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class CriminalRecord extends Model
{
    // Allow mass assignment for these fields
    protected $fillable = [
        'first_name',
        'last_name',
        'crime_details',
        'birthday',
        'case_no',
        'offense',
        'status',
    ];
}
