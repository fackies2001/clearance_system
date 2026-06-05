<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\Clearance;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Carbon\Carbon;

class TransactionController extends Controller
{
    public function index(Request $request)
    {
        $dateFilter = $request->input('date_filter', 'today');

        $query = Clearance::whereNotNull('paid_at');

        // Apply date filter — no .utc() since DB stores Manila time directly
        if ($dateFilter === 'today') {
            $start = Carbon::now('Asia/Manila')->startOfDay();
            $end   = Carbon::now('Asia/Manila')->endOfDay();
            $query->whereBetween('paid_at', [$start, $end]);

        } elseif ($dateFilter === 'yesterday') {
            $start = Carbon::yesterday('Asia/Manila')->startOfDay();
            $end   = Carbon::yesterday('Asia/Manila')->endOfDay();
            $query->whereBetween('paid_at', [$start, $end]);

        } elseif ($dateFilter === '7_days_ago') {
            $start = Carbon::now('Asia/Manila')->subDays(7)->startOfDay();
            $end   = Carbon::now('Asia/Manila')->endOfDay();
            $query->whereBetween('paid_at', [$start, $end]);

        } elseif ($dateFilter === 'last_month') {
            $target = Carbon::now('Asia/Manila')->subMonth();
            $start  = $target->copy()->startOfMonth();
            $end    = $target->copy()->endOfMonth();
            $query->whereBetween('paid_at', [$start, $end]);

        } elseif ($dateFilter === 'last_year') {
            $start = Carbon::now('Asia/Manila')->subYear()->startOfYear();
            $end   = Carbon::now('Asia/Manila')->subYear()->endOfYear();
            $query->whereBetween('paid_at', [$start, $end]);
        }
        // all_time — walang filter, fetch lahat

        $transactions = $query->orderBy('paid_at', 'desc')
            ->get()
            ->map(function ($c) {
                return [
                    'id'             => $c->id,
                    'tracking_no'    => $c->tracking_no,
                    'applicant_name' => $c->first_name . ' ' . $c->last_name,
                    'amount'         => $c->payment_amount ?? 130.00,
                    'method'         => $c->payment_method,
                    'reference'      => $c->payment_reference,
                    'paid_at'        => $c->paid_at,
                    'status'         => $c->payment_status,
                ];
            });

        return Inertia::render('Admin/Transactions', [
            'transactions'  => $transactions,
            'currentFilter' => $dateFilter,
        ]);
    }
}