<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\AuditLog;
use Illuminate\Http\Request;
use Carbon\Carbon;
use Inertia\Inertia;

class AuditLogController extends Controller
{
    public function index(Request $request)
    {
        // 1. Capture the targeted date filter param input from Inertia query context
        $dateFilter = $request->input('date_filter', 'today');

        // 2. Formulate separate query builders to decouple the main listing from global stat counters
        $query = AuditLog::with('user');
        $statsQuery = AuditLog::query();

        // app/Http/Controllers/Admin/AuditLogController.php

        if ($dateFilter === 'today') {
            $start = Carbon::now('Asia/Manila')->startOfDay();
            $end   = Carbon::now('Asia/Manila')->endOfDay();
            $query->whereBetween('created_at', [$start, $end]);
            $statsQuery->whereBetween('created_at', [$start, $end]);

        } elseif ($dateFilter === 'yesterday') {
            $start = Carbon::yesterday('Asia/Manila')->startOfDay();
            $end   = Carbon::yesterday('Asia/Manila')->endOfDay();
            $query->whereBetween('created_at', [$start, $end]);
            $statsQuery->whereBetween('created_at', [$start, $end]);

        } elseif ($dateFilter === '7_days_ago') {
            $start = Carbon::now('Asia/Manila')->subDays(7)->startOfDay();
            $end   = Carbon::now('Asia/Manila')->endOfDay();
            $query->whereBetween('created_at', [$start, $end]);
            $statsQuery->whereBetween('created_at', [$start, $end]);

        } elseif ($dateFilter === 'last_month') {
            $target = Carbon::now('Asia/Manila')->subMonth();
            $start  = $target->copy()->startOfMonth();
            $end    = $target->copy()->endOfMonth();
            $query->whereBetween('created_at', [$start, $end]);
            $statsQuery->whereBetween('created_at', [$start, $end]);

        } elseif ($dateFilter === 'last_year') {
            $start = Carbon::now('Asia/Manila')->subYear()->startOfYear();
            $end   = Carbon::now('Asia/Manila')->subYear()->endOfYear();
            $query->whereBetween('created_at', [$start, $end]);
            $statsQuery->whereBetween('created_at', [$start, $end]);
        }

            // today_logs stat — same fix
            $stats = [
                'total_logs'     => (clone $statsQuery)->count(),
                'status_changes' => (clone $statsQuery)->where('action', 'status_changed')->count(),
                'role_updates'   => (clone $statsQuery)->where('action', 'role_updated')->count(),
                'today_logs'     => AuditLog::whereBetween('created_at', [
                                        Carbon::now('Asia/Manila')->startOfDay(),
                                        Carbon::now('Asia/Manila')->endOfDay(),
                                    ])->count(),
            ];
    
        // 5. Fetch and structuralize the paginated listing dataset payload
        $logs = $query->orderBy('created_at', 'desc')
            ->get()
            ->map(fn($log) => [
                'id'            => $log->id,
                'admin'         => $log->user?->name ?? 'System',
                'action'        => $log->action,
                'subject_type'  => $log->subject_type,
                'subject_label' => $log->subject_label,
                'old_values'    => $log->old_values,
                'new_values'    => $log->new_values,
                'description'   => $log->description,
                'ip_address'    => $log->ip_address,
                'created_at'    => $log->created_at,
            ]);

        // 6. Return standard log arrays, calculated metric objects, and selection sync indicators down to the React layer
        return Inertia::render('Admin/AuditLogs', [
            'logs'          => $logs,
            'stats'         => $stats,
            'currentFilter' => $dateFilter,
        ]);
    }
}