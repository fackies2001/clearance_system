<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\Clearance;
use Illuminate\Support\Facades\DB;
use Inertia\Inertia;

class ReportsController extends Controller
{
   public function index(\Illuminate\Http\Request $request)
    {
        // 1. Read the date filter param from request URL, defaulting to 'today'
        $filter = $request->input('filter', 'today');

        // Helper function to dynamically append the date scope constraints based on filter type
        $applyDateFilter = function ($query, $column = 'created_at') use ($filter) {
            if ($filter === 'today') {
                return $query->whereDate($column, \Carbon\Carbon::today());
            } elseif ($filter === 'yesterday') {
                return $query->whereDate($column, \Carbon\Carbon::yesterday());
            } elseif ($filter === '7_days_ago') {
                return $query->where($column, '>=', \Carbon\Carbon::now()->subDays(7));
            } elseif ($filter === 'last_month') {
                return $query->whereMonth($column, \Carbon\Carbon::now()->subMonth()->month)
                             ->whereYear($column, \Carbon\Carbon::now()->subMonth()->year);
            } elseif ($filter === 'last_year') {
                return $query->whereYear($column, \Carbon\Carbon::now()->subYear()->year);
            }
            // 'all_time' returns all historical metrics without conditional constraint closures
            return $query;
        };

        // ── 1. Monthly Applications (last 12 months) ─────────────────────
        $monthlyApplicationsQuery = Clearance::selectRaw(
            "DATE_FORMAT(created_at, '%Y-%m') as month, COUNT(*) as total"
        );
        $monthlyApplications = $applyDateFilter($monthlyApplicationsQuery, 'created_at')
            ->where('created_at', '>=', now()->subMonths(12)->startOfMonth())
            ->groupBy('month')
            ->orderBy('month', 'asc')
            ->get()
            ->map(fn($row) => [
                'month' => $row->month,
                'total' => $row->total,
            ]);

        // ── 2. Applications per Workflow Status ───────────────────────────
        $statusBreakdownQuery = Clearance::selectRaw('workflow_status, COUNT(*) as total');
        $statusBreakdown = $applyDateFilter($statusBreakdownQuery, 'created_at')
            ->groupBy('workflow_status')
            ->get()
            ->map(fn($row) => [
                'status' => $row->workflow_status ?? 'pending',
                'total'  => $row->total,
            ]);

        // ── 3. HIT vs Cleared vs Pending (Donut) ─────────────────────────
        $hitVsClearedVsPending = [
            'hit'     => $applyDateFilter(Clearance::where('workflow_status', 'hit'), 'created_at')->count(),
            'cleared' => $applyDateFilter(Clearance::where('workflow_status', 'released'), 'created_at')->count(),
            'pending' => $applyDateFilter(Clearance::whereIn('workflow_status', [
                'pending', 'under_review', 'biometrics_captured', 'approved'
            ]), 'created_at')->count(),
            'rejected' => $applyDateFilter(Clearance::where('workflow_status', 'rejected'), 'created_at')->count(),
        ];

        // ── 4. Peak Processing Days (Mon–Sun) ─────────────────────────────
        $peakDaysQuery = Clearance::selectRaw(
            "DAYNAME(reviewed_at) as day_name, DAYOFWEEK(reviewed_at) as day_num, COUNT(*) as total"
        )->whereNotNull('reviewed_at');
        
        $peakDays = $applyDateFilter($peakDaysQuery, 'reviewed_at')
            ->groupBy('day_name', 'day_num')
            ->orderBy('day_num', 'asc')
            ->get()
            ->map(fn($row) => [
                'day'   => $row->day_name,
                'total' => $row->total,
            ]);

        // ── 5. Monthly Released Clearances (last 12 months) ──────────────
        $monthlyReleasedQuery = Clearance::selectRaw(
            "DATE_FORMAT(reviewed_at, '%Y-%m') as month, COUNT(*) as total"
        )->where('workflow_status', 'released');
        
        $monthlyReleased = $applyDateFilter($monthlyReleasedQuery, 'reviewed_at')
            ->where('reviewed_at', '>=', now()->subMonths(12)->startOfMonth())
            ->groupBy('month')
            ->orderBy('month', 'asc')
            ->get()
            ->map(fn($row) => [
                'month' => $row->month,
                'total' => $row->total,
            ]);

        // ── 6. Summary Stat Cards ─────────────────────────────────────────
        $totalApplications  = $applyDateFilter(Clearance::query(), 'created_at')->count();
        $totalReleased      = $applyDateFilter(Clearance::where('workflow_status', 'released'), 'reviewed_at')->count();
        $totalHits          = $applyDateFilter(Clearance::where('workflow_status', 'hit'), 'created_at')->count();
        $totalRejected      = $applyDateFilter(Clearance::where('workflow_status', 'rejected'), 'reviewed_at')->count();
        $totalPending       = $applyDateFilter(Clearance::where('workflow_status', 'pending'), 'created_at')->count();

        // Target current Month/Year counts
        $thisMonthApps      = Clearance::whereMonth('created_at', now()->month)
            ->whereYear('created_at', now()->year)
            ->count();
        $thisMonthReleased  = Clearance::where('workflow_status', 'released')
            ->whereMonth('reviewed_at', now()->month)
            ->whereYear('reviewed_at', now()->year)
            ->count();

        // Average processing duration aggregation
        $avgProcessingQuery = Clearance::whereNotNull('reviewed_at')
            ->whereIn('workflow_status', ['released', 'rejected']);
            
        $avgProcessingDays  = $applyDateFilter($avgProcessingQuery, 'reviewed_at')
            ->selectRaw('AVG(DATEDIFF(reviewed_at, created_at)) as avg_days')
            ->value('avg_days');

        return Inertia::render('Admin/Reports', [
            'monthlyApplications'   => $monthlyApplications,
            'statusBreakdown'       => $statusBreakdown,
            'hitVsClearedVsPending' => $hitVsClearedVsPending,
            'peakDays'              => $peakDays,
            'monthlyReleased'       => $monthlyReleased,
            'currentFilter'         => $filter, // Sends current state down to the React component
            'summary' => [
                'total_applications'  => $totalApplications,
                'total_released'      => $totalReleased,
                'total_hits'          => $totalHits,
                'total_rejected'      => $totalRejected,
                'total_pending'       => $totalPending,
                'this_month_apps'     => $thisMonthApps,
                'this_month_released' => $thisMonthReleased,
                'avg_processing_days' => $avgProcessingDays ? round($avgProcessingDays, 1) : 0,
            ],
        ]);
    }
}
