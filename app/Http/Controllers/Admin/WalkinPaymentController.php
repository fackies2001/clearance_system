<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\Clearance;
use Illuminate\Http\Request;
use Inertia\Inertia;

class WalkinPaymentController extends Controller
{
    public function index()
    {
        $pendingApplicants = Clearance::where('payment_status', 'pending_walkin')
            ->orderBy('created_at', 'desc')
            ->get();

        return Inertia::render('Admin/Workflow/WalkinPayment', [
            'pendingApplicants' => $pendingApplicants,
            'initialSearch'     => request('search'),
        ]);
    }

    public function search(Request $request)
    {
    $request->validate(['tracking_no' => 'required|string|max:50']);

        $clearance = Clearance::where('tracking_no', $request->tracking_no)->first();

            if (!$clearance) {
            return Inertia::render('Admin/Workflow/WalkinPayment', [
            'error' => 'No application found with that tracking number.',
            'search' => $request->tracking_no,
        ]);
    }   

        return Inertia::render('Admin/Workflow/WalkinPayment', [
            'applicant' => $clearance,
            'search'    => $request->tracking_no,
        ]);
    }

    public function markAsPaid(Clearance $clearance)
    {
        if ($clearance->payment_status === 'paid') {
            return back()->with('error', 'This application is already marked as paid.');
        }

         $clearance->update([
        'payment_status'  => 'paid',
        'payment_method'  => 'walkin',
        'paid_at'         => now(),
        'workflow_status' => 'pending',
    ]);

        // Notify user or log
        \App\Models\Notification::create([
            'user_id' => $clearance->user_id,
            'type'    => 'payment_confirmed',
            'title'   => 'Walk-in Payment Confirmed',
            'message' => 'Your walk-in payment has been confirmed. You may now proceed to Biometrics Capture.',
            'link'    => route('application.status'),
        ]);

        return back()->with('success', "Payment for {$clearance->first_name} {$clearance->last_name} confirmed successfully! 🎉");
    }
}
