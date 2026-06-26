<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\Clearance;
use App\Models\Appointment;
use App\Models\User;
use Inertia\Inertia;
use Illuminate\Support\Facades\DB;
use Carbon\Carbon;

class DashboardController extends Controller
{
 public function index(\Illuminate\Http\Request $request)
{
    // 1. Fetch the range parameter from the request dropdown selection. Default to 'today'.
    $range = $request->input('range', 'today');
    
    // 2. Establish fallback base boundaries (Defaulting to Manila Time Today)
    $startOfPeriod = \Carbon\Carbon::today()->startOfDay();
    $endOfPeriod = \Carbon\Carbon::today()->endOfDay();
    
    // 3. This specific field is explicitly reserved to filter the physical appointment calendar rows
    $appointmentTargetDate = \Carbon\Carbon::today()->toDateString();

    // 4. Dynamically compute range boundaries based on the admin dropdown selection
    switch ($range) {
            case 'yesterday':
                $startOfPeriod = \Carbon\Carbon::yesterday()->startOfDay();
                $endOfPeriod = \Carbon\Carbon::yesterday()->endOfDay();
                $appointmentTargetDate = \Carbon\Carbon::yesterday()->toDateString();
                break;

            case 'last_7_days':
                $startOfPeriod = \Carbon\Carbon::now()->subDays(7)->startOfDay();
                $endOfPeriod = \Carbon\Carbon::now()->endOfDay();
                $appointmentTargetDate = null;
                break;

            case 'last_month':
                $startOfPeriod = \Carbon\Carbon::now()->subMonth()->startOfMonth();
                $endOfPeriod = \Carbon\Carbon::now()->subMonth()->endOfMonth();
                $appointmentTargetDate = null;
                break;

            case 'last_year':
                $startOfPeriod = \Carbon\Carbon::now()->subYear()->startOfMonth();
                $endOfPeriod = \Carbon\Carbon::now()->subYear()->endOfMonth();
                $appointmentTargetDate = null;
                break;

            case 'all_time':
                // Establish wide unbound dates to fetch historical lifecycle logs safely
                $startOfPeriod = \Carbon\Carbon::parse('1970-01-01 00:00:00');
                $endOfPeriod = \Carbon\Carbon::now()->endOfDay();
                $appointmentTargetDate = null;
                break;
                
            case 'today':
    default:
                $startOfPeriod = \Carbon\Carbon::today()->startOfDay();
                $endOfPeriod = \Carbon\Carbon::today()->endOfDay();
                $appointmentTargetDate = \Carbon\Carbon::today()->toDateString();
                break;
        }

    // ── Summary Stats ────────────────────────────────────────────────
    $stats = [
        'all_time_applications' => Clearance::count(),
        'total_users'           => User::where('role', 'user')->count(),
        'all_time_appointments' => Appointment::count(),

        'current_applications'  => Clearance::whereBetween('created_at', [$startOfPeriod, $endOfPeriod])->count(),
        'released'              => Clearance::where('workflow_status', 'released')->whereBetween('created_at', [$startOfPeriod, $endOfPeriod])->count(),
        'hit_cases'             => Clearance::where('workflow_status', 'hit')->whereBetween('created_at', [$startOfPeriod, $endOfPeriod])->count(),
        
        'pending_applications'  => Clearance::where('workflow_status', 'pending')->whereBetween('created_at', [$startOfPeriod, $endOfPeriod])->count(),
        'pending_payment'       => Clearance::where('payment_status', 'pending')->whereBetween('created_at', [$startOfPeriod, $endOfPeriod])->count(),
        'paid_applications'     => Clearance::where('payment_status', 'paid')->whereBetween('created_at', [$startOfPeriod, $endOfPeriod])->count(),
        
        'appointments_count'    => Appointment::when($appointmentTargetDate, fn($q) => $q->where('appointment_date', $appointmentTargetDate))->count(),
        'pending_appointments'  => Appointment::where('status', 'pending')->when($appointmentTargetDate, fn($q) => $q->where('appointment_date', $appointmentTargetDate))->count(),
        
        'active_range'          => $range, 
    ];

        // ── Monthly Applications (Trend Visualization) ────────────────────────
        // Guarantee at least 6 to 12 data points so the area chart can always draw a line,
        // even if the database only has data for a single month.
        $monthsToGenerate = in_array($range, ['last_year', 'all_time']) ? 12 : 6;
        
        $chartStart = \Carbon\Carbon::now()->subMonths($monthsToGenerate - 1)->startOfMonth();
        $chartEnd   = \Carbon\Carbon::now()->endOfMonth();

        $rawMonthlyData = Clearance::select(
            DB::raw('COUNT(*) as total'),
            DB::raw("DATE_FORMAT(created_at, '%Y-%m') as month_key")
        )
        ->whereBetween('created_at', [$chartStart, $chartEnd])
        ->groupBy('month_key')
        ->pluck('total', 'month_key');

        $monthlyApplications = collect();
        for ($i = $monthsToGenerate - 1; $i >= 0; $i--) {
            $date = \Carbon\Carbon::now()->subMonths($i);
            $key = $date->format('Y-m');
            $label = $date->format('M Y'); // e.g. "Jun 2026"
            
            $monthlyApplications->push([
                'month' => $label,
                'total' => $rawMonthlyData->get($key, 0)
            ]);
        }

        // ── Workflow Status Breakdown ────────────────────────────────────
     $statusBreakdown = Clearance::select(
            'workflow_status as status',
            DB::raw('COUNT(*) as total')
        )
        ->whereBetween('created_at', [$startOfPeriod, $endOfPeriod]) // Filters the distribution matrix metrics
        ->groupBy('workflow_status')
        ->get();

        // ── Payment Method Distribution ─────────────────────────────────
       $paymentMethods = Clearance::where('payment_status', 'paid')
            ->whereBetween('created_at', [$startOfPeriod, $endOfPeriod]) // Constrains collection rows output scope
            ->select('payment_method', DB::raw('COUNT(*) as total'))
            ->groupBy('payment_method')
            ->get();

        // ── Recent Applications ─────────────────────────────────────────
        $recentApplications = Clearance::orderBy('created_at', 'desc')
            ->limit(8)
            ->get(['id', 'tracking_no', 'first_name', 'last_name', 'workflow_status', 'payment_status', 'payment_method', 'created_at']);

        // ── Today's Appointments ─────────────────────────────────────────
       $todayAppointments = Appointment::with('user')
        ->when($appointmentTargetDate, function($query) use ($appointmentTargetDate) {
            return $query->where('appointment_date', $appointmentTargetDate);
        }, function($query) use ($startOfPeriod, $endOfPeriod) {
            return $query->whereBetween('created_at', [$startOfPeriod, $endOfPeriod]);
        })
        ->orderBy('time_slot')
        ->get();

        return Inertia::render('Admin/Dashboard', [
            'stats'               => $stats,
            'monthlyApplications' => $monthlyApplications,
            'statusBreakdown'     => $statusBreakdown,
            'paymentMethods'      => $paymentMethods,
            'recentApplications'  => $recentApplications,
            'todayAppointments'   => $todayAppointments,
        ]);
    }
} 
    
