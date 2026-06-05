<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Notification extends Model
{
    protected $fillable = [
        'user_id',
        'type',
        'title',
        'message',
        'link',
        'read_at',
    ];

    protected $casts = [
        'read_at' => 'datetime',
    ];

    /**
     * Create a notification for all admin users.
     */
    public static function notifyAdmins($type, $title, $message, $link = null)
    {
        return self::create([
            'type' => $type,
            'title' => $title,
            'message' => $message,
            'link' => $link,
            'user_id' => null, // null means all admins
        ]);
    }
}
