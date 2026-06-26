<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use App\Models\Appointment;
use Inertia\Inertia;
use App\Mail\AppointmentConfirmed;
use Illuminate\Support\Facades\Mail;
use Carbon\Carbon;

class AppointmentController extends Controller
{
    public function index(Request $request)
    {
        $search    = $request->input('search');
        $status    = $request->input('status');
        $perPage   = (int) $request->input('per_page', 100);
        $sortField = $request->input('sort_field', 'time_slot');
        $sortOrder = $request->input('sort_order', 'asc');
        $range = $request->input('range', 'all_time');

        // ── Range → Date Boundary Resolution ──────────────────────────
        $dateFrom = null;
        $dateTo   = null;
        $isRange  = false;

        switch ($range) {
            case 'today':
                $dateFrom = Carbon::today()->toDateString();
                $dateTo   = $dateFrom;
                break;
            case 'yesterday':
                $dateFrom = Carbon::yesterday()->toDateString();
                $dateTo   = $dateFrom;
                break;
            case 'last_7_days':
                $dateFrom = Carbon::today()->subDays(6)->toDateString();
                $dateTo   = Carbon::today()->toDateString();
                $isRange  = true;
                break;
            case 'last_month':
                $dateFrom = Carbon::today()->subMonth()->startOfMonth()->toDateString();
                $dateTo   = Carbon::today()->subMonth()->endOfMonth()->toDateString();
                $isRange  = true;
                break;
            case 'last_year':
                $dateFrom = Carbon::today()->subYear()->startOfYear()->toDateString();
                $dateTo   = Carbon::today()->subYear()->endOfYear()->toDateString();
                $isRange  = true;
                break;
            case 'all_time':
                $dateFrom = null;
                $dateTo   = null;
                break;
            default:
                // Custom single date (e.g. "2025-06-01")
                if (preg_match('/^\d{4}-\d{2}-\d{2}$/', $range)) {
                    $dateFrom = $range;
                    $dateTo   = $range;
                } else {
                    $dateFrom = Carbon::today()->toDateString();
                    $dateTo   = $dateFrom;
                }
                break;
        }

        // ── Stats — scoped to the selected date range (by submission date) ──
        $statsQuery = fn() => Appointment::query()
            ->when($dateFrom && $dateTo && $isRange, fn($q) =>
                $q->whereBetween('created_at', [
                    Carbon::parse($dateFrom)->startOfDay(),
                    Carbon::parse($dateTo)->endOfDay(),
                ])
            )
            ->when($dateFrom && $dateTo && !$isRange && $range !== 'all_time', fn($q) =>
                $q->whereDate('created_at', $dateFrom)
            );

        $stats = [
            'total'     => $statsQuery()->count(),
            'pending'   => $statsQuery()->where('status', 'pending')->count(),
            'confirmed' => $statsQuery()->where('status', 'confirmed')->count(),
            'completed' => $statsQuery()->where('status', 'completed')->count(),
            'cancelled' => $statsQuery()->where('status', 'cancelled')->count(),
        ];

        // ── Main Query (filter by submission date, not appointment date) ──
        $appointmentsQuery = Appointment::with(['user', 'clearance'])
            ->when($dateFrom && $dateTo && $isRange, fn($q) =>
                $q->whereBetween('created_at', [
                    Carbon::parse($dateFrom)->startOfDay(),
                    Carbon::parse($dateTo)->endOfDay(),
                ])
            )
            ->when($dateFrom && $dateTo && !$isRange && $range !== 'all_time', fn($q) =>
                $q->whereDate('created_at', $dateFrom)
            )
                ->when($status, fn($q) => $q->where('status', $status))
            ->when($search, fn($q) =>
                $q->where(function ($inner) use ($search) {
                    $inner->where('queue_number', 'like', "%{$search}%")
                          ->orWhere('time_slot', 'like', "%{$search}%")
                          ->orWhereHas('user', fn($u) =>
                              $u->where('name', 'like', "%{$search}%")
                                ->orWhere('email', 'like', "%{$search}%")
                          );
                })
            );

        $allowed = ['queue_number', 'appointment_date', 'time_slot', 'status', 'user_id', 'type'];
        $appointmentsQuery->orderBy(
            in_array($sortField, $allowed) ? $sortField : 'time_slot',
            $sortOrder
        );

        $appointments = $appointmentsQuery->paginate($perPage)->withQueryString();

        return Inertia::render('Admin/Appointments', [
            'appointments' => $appointments,
            'stats'        => $stats,
            'filters'      => [
                'search'     => $search,
                'status'     => $status,
                'per_page'   => $perPage,
                'sort_field' => $sortField,
                'sort_order' => $sortOrder,
                'range'      => $range,
            ],
        ]);
    }

    public function updateStatus(Request $request, Appointment $appointment)
    {
        $request->validate([
            'status' => 'required|in:pending,confirmed,cancelled,completed',
        ]);

        $updateData = ['status' => $request->status];

        if ($request->status === 'confirmed' && $appointment->status !== 'confirmed') {
            $updateData['confirmed_by'] = auth()->id();
            $updateData['confirmed_at'] = now();
            Mail::to($appointment->user->email)->send(new AppointmentConfirmed($appointment));
        }

        $appointment->update($updateData);

        return back()->with('success', "Appointment {$appointment->queue_number} status updated to {$request->status}.");
    }
}