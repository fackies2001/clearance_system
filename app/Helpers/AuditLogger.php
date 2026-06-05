<?php

namespace App\Helpers;

use App\Models\AuditLog;

class AuditLogger
{
    public static function log(
        string $action,
        string $description,
        $subject = null,
        array $oldValues = [],
        array $newValues = []
    ): void {
        AuditLog::create([
            'user_id'       => auth()->id(),
            'action'        => $action,
            'subject_type'  => $subject ? class_basename($subject) : null,
            'subject_id'    => $subject?->id,
            'subject_label' => $subject?->tracking_no ?? $subject?->name ?? null,
            'old_values'    => $oldValues ?: null,
            'new_values'    => $newValues ?: null,
            'ip_address'    => request()->ip(),
            'description'   => $description,
        ]);
    }
}
