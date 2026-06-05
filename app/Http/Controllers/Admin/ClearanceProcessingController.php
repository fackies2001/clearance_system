<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\Clearance;
use Illuminate\Http\Request;
use Inertia\Inertia;
use App\Helpers\AuditLogger;

class ClearanceProcessingController extends Controller
{
    // ── Valid workflow transitions ──────────────────────────────────────────
    // Defines what statuses are ALLOWED to transition to what.
    // Admin cannot skip steps (e.g., pending → released directly).
    const ALLOWED_TRANSITIONS = [
        'pending'             => ['under_review', 'rejected'],
        'under_review'        => ['biometrics_captured', 'rejected', 'hit'],
        'biometrics_captured' => ['approved', 'rejected', 'hit'],
        'approved'            => ['released'],
        'hit'                 => ['under_review', 'rejected'], // Admin can re-open a HIT
        'released'            => [],                           // Terminal state
        'rejected'            => [],                           // Terminal state
    ];

    /**
     * Display the Clearance Processing page.
     * Passes all clearances with their biometric data to the frontend.
     */
    /**
     * Display the Clearance Processing page.
     * Passes all clearances with their biometric data to the frontend.
     */
    public function index(Request $request)
    {
        // Capture dynamic filter parameters from the frontend layout state pipeline
        $search    = $request->input('search');
        $status    = $request->input('status');
        $perPage   = (int) $request->input('per_page', 10);
        $sortField = $request->input('sort_field', 'created_at');
        $sortOrder = $request->input('sort_order', 'desc');
        $range     = $request->input('range', 'today');

        // Establish baseline Carbon datetime tracking boundaries localized to Asia/Manila timezone
        $startOfPeriod = \Carbon\Carbon::now('Asia/Manila')->startOfDay();
        $endOfPeriod   = \Carbon\Carbon::now('Asia/Manila')->endOfDay();
        $isSingleDate  = true;

        // Dynamically compute database range constraints based on dropdown keyword selection with timezone safety
        switch ($range) {
            case 'yesterday':
                $startOfPeriod = \Carbon\Carbon::yesterday('Asia/Manila')->startOfDay();
                $endOfPeriod   = \Carbon\Carbon::yesterday('Asia/Manila')->endOfDay();
                break;
            case 'last_7_days':
                $startOfPeriod = \Carbon\Carbon::now('Asia/Manila')->subDays(7)->startOfDay();
                $endOfPeriod   = \Carbon\Carbon::now('Asia/Manila')->endOfDay();
                $isSingleDate  = false;
                break;
            case 'last_month':
                $startOfPeriod = \Carbon\Carbon::now('Asia/Manila')->subMonth()->startOfMonth();
                $endOfPeriod   = \Carbon\Carbon::now('Asia/Manila')->subMonth()->endOfMonth();
                $isSingleDate  = false;
                break;
            case 'last_year':
                $startOfPeriod = \Carbon\Carbon::now('Asia/Manila')->subYear()->startOfMonth();
                $endOfPeriod   = \Carbon\Carbon::now('Asia/Manila')->subYear()->endOfMonth();
                $isSingleDate  = false;
                break;
            case 'all_time':
                $startOfPeriod = \Carbon\Carbon::parse('1970-01-01 00:00:00');
                $endOfPeriod   = \Carbon\Carbon::now('Asia/Manila')->endOfDay();
                $isSingleDate  = false;
                break;
            case 'today':
            default:
                break;
        }

        if ($range !== 'today' && $isSingleDate && !in_array($range, ['yesterday'])) {
            try {
                $customDateObj = \Carbon\Carbon::parse($range);
                $startOfPeriod  = $customDateObj->copy()->startOfDay();
                $endOfPeriod    = $customDateObj->copy()->endOfDay();
            } catch (\Exception $e) {
                $range = 'today';
                $startOfPeriod = \Carbon\Carbon::today()->startOfDay();
                $endOfPeriod   = \Carbon\Carbon::today()->endOfDay();
            }
        }

        // Base model query initialization adhering to baseline restrictions
        $baseQuery = Clearance::whereNotIn('workflow_status', ['pending'])
            ->whereIn('payment_status', ['paid'])
            ->whereBetween('created_at', [$startOfPeriod->toDateTimeString(), $endOfPeriod->toDateTimeString()]);

        // Build stats metrics strictly within active timeframe boundaries
        $stats = [
            'pending'             => Clearance::whereNotIn('workflow_status', ['pending'])->whereIn('payment_status', ['paid'])->where('workflow_status', 'pending')->whereBetween('created_at', [$startOfPeriod->toDateTimeString(), $endOfPeriod->toDateTimeString()])->count(),
            'under_review'        => Clearance::whereNotIn('workflow_status', ['pending'])->whereIn('payment_status', ['paid'])->where('workflow_status', 'under_review')->whereBetween('created_at', [$startOfPeriod->toDateTimeString(), $endOfPeriod->toDateTimeString()])->count(),
            'biometrics_captured' => Clearance::whereNotIn('workflow_status', ['pending'])->whereIn('payment_status', ['paid'])->where('workflow_status', 'biometrics_captured')->whereBetween('created_at', [$startOfPeriod->toDateTimeString(), $endOfPeriod->toDateTimeString()])->count(),
            'approved'            => Clearance::whereNotIn('workflow_status', ['pending'])->whereIn('payment_status', ['paid'])->where('workflow_status', 'approved')->whereBetween('created_at', [$startOfPeriod->toDateTimeString(), $endOfPeriod->toDateTimeString()])->count(),
            'released'            => Clearance::whereNotIn('workflow_status', ['pending'])->whereIn('payment_status', ['paid'])->where('workflow_status', 'released')->whereBetween('created_at', [$startOfPeriod->toDateTimeString(), $endOfPeriod->toDateTimeString()])->count(),
            'rejected'            => Clearance::whereNotIn('workflow_status', ['pending'])->whereIn('payment_status', ['paid'])->where('workflow_status', 'rejected')->whereBetween('created_at', [$startOfPeriod->toDateTimeString(), $endOfPeriod->toDateTimeString()])->count(),
            'hit'                 => Clearance::whereNotIn('workflow_status', ['pending'])->whereIn('payment_status', ['paid'])->where('workflow_status', 'hit')->whereBetween('created_at', [$startOfPeriod->toDateTimeString(), $endOfPeriod->toDateTimeString()])->count(),
            'total'               => $baseQuery->count(),
        ];

        // Process conditional filtration pipelines
        $clearancesQuery = Clearance::with(['biometric', 'reviewer'])
            ->whereNotIn('workflow_status', ['pending'])
            ->whereIn('payment_status', ['paid'])
            ->whereBetween('created_at', [$startOfPeriod->toDateTimeString(), $endOfPeriod->toDateTimeString()])
            ->when($status, function ($query) use ($status) {
                return $query->where('workflow_status', $status);
            })
            ->when($search, function ($query) use ($search) {
                return $query->where(function ($q) use ($search) {
                    $q->where('tracking_no', 'like', "%{$search}%")
                      ->orWhere('purpose', 'like', "%{$search}%")
                      ->orWhere('first_name', 'like', "%{$search}%")
                      ->orWhere('last_name', 'like', "%{$search}%");
                });
            });

        // Whitelisted dynamic sorting constraints execution
        if (in_array($sortField, ['tracking_no', 'first_name', 'last_name', 'purpose', 'workflow_status', 'created_at'])) {
            if ($sortField === 'first_name' || $sortField === 'last_name') {
                $clearancesQuery->orderBy('last_name', $sortOrder)->orderBy('first_name', $sortOrder);
            } else {
                $clearancesQuery->orderBy($sortField, $sortOrder);
            }
        } else {
            $clearancesQuery->orderBy('created_at', 'desc');
        }

        // Finalize dataset preparation via Inertia integration wrappers
        $clearancesPaginated = $clearancesQuery->paginate($perPage)->withQueryString();

        return Inertia::render('Admin/ClearanceProcessing', [
            'clearances' => $clearancesPaginated,
            'stats'      => $stats,
            'filters'    => [
                'search'     => $search,
                'status'     => $status,
                'per_page'   => $perPage,
                'sort_field' => $sortField,
                'sort_order' => $sortOrder,
                'range'      => $range,
            ]
        ]);
    }

    /**
     * Update the workflow status of a clearance application.
     */
    public function updateStatus(Request $request, $id)
    {
        $clearance = Clearance::findOrFail($id);

        $request->validate([
            'workflow_status' => 'required|string|in:pending,under_review,biometrics_captured,approved,released,rejected,hit',
            'admin_remarks'   => 'nullable|string|max:1000',
            'hit_resolution'  => 'nullable|string|in:confirmed,overridden',
            'hit_notes'       => 'nullable|string|max:1000',
        ]);

        $currentStatus = $clearance->workflow_status ?? 'pending';
        $newStatus     = $request->workflow_status;

        $allowedNext = self::ALLOWED_TRANSITIONS[$currentStatus] ?? [];
        if (!in_array($newStatus, $allowedNext)) {
            return back()->withErrors([
                'workflow_status' => "Invalid transition: cannot move from '{$currentStatus}' to '{$newStatus}'."
            ]);
        }

        $updateData = [
            'workflow_status' => $newStatus,
            'reviewed_by'     => auth()->id(),
            'reviewed_at'     => now(),
        ];

        if ($request->filled('admin_remarks')) {
            $updateData['admin_remarks'] = $request->admin_remarks;
        }

        if ($newStatus === 'hit') {
            $updateData['hit_resolution'] = $request->hit_resolution ?? 'confirmed';
            $updateData['status']         = 'HIT';
            if ($request->filled('hit_notes')) {
                $updateData['hit_notes'] = $request->hit_notes;
            }
        }

        if ($request->hit_resolution === 'overridden') {
            $updateData['hit_resolution'] = 'overridden';
            $updateData['status']         = 'pending';
        }

        if ($newStatus === 'released') {
            $updateData['status'] = 'CLEARED';
            $updateData['released_at'] = now();
            // Generate clearance number if not exists
            if (!$clearance->clearance_number) {
                // Format: NBI-CLR-2026-0001
                $year = date('Y');
                $count = Clearance::whereYear('released_at', $year)->count() + 1;
                $updateData['clearance_number'] = "NBI-CLR-{$year}-" . str_pad($count, 6, '0', STR_PAD_LEFT);
            }

            // Send Email Notification
            try {
                \Illuminate\Support\Facades\Mail::to($clearance->email_address)
                    ->send(new \App\Mail\ClearanceReadyMail($clearance));
                $updateData['email_notified_at'] = now();
            } catch (\Exception $e) {
                // Log error but don't stop the release
                \Illuminate\Support\Facades\Log::error("Failed to send release email to {$clearance->email_address}: " . $e->getMessage());
            }
        }

        $clearance->update($updateData);

        AuditLogger::log(
            action: 'status_changed',
            description: "Changed status of {$clearance->tracking_no} from '{$currentStatus}' to '{$newStatus}'.",
            subject: $clearance,
            oldValues: ['workflow_status' => $currentStatus],
            newValues: ['workflow_status' => $newStatus],
        );

        return back()->with('success', "Application {$clearance->tracking_no} moved to '{$newStatus}' successfully.");
    }

    /**
     * Mark a clearance as paid (for walk-in payments).
     */
    public function markAsPaid($id)
    {
        $clearance = Clearance::findOrFail($id);
        
        $clearance->update([
            'payment_status' => 'paid',
            'paid_at' => now(),
            'payment_method' => $clearance->payment_method ?? 'walkin',
        ]);

        AuditLogger::log(
            action: 'payment_confirmed',
            description: "Manually confirmed payment for {$clearance->tracking_no}",
            subject: $clearance,
            newValues: ['payment_status' => 'paid'],
        );

        return back()->with('success', "Payment for {$clearance->tracking_no} has been confirmed.");
    }
}
