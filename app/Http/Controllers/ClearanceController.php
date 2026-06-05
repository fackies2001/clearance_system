<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\Clearance;
use App\Models\CriminalRecord;
use Illuminate\Support\Facades\Storage;
use Illuminate\Support\Str;
use Illuminate\Support\Facades\Auth;
use Inertia\Inertia;

class ClearanceController extends Controller
{
    public function store(Request $request)
    {
        // One per user rule
        $existing = Clearance::where('user_id', Auth::id())
    ->whereNotIn('workflow_status', ['released', 'rejected'])
    ->where(function($query) {
        $query->where('payment_status', 'paid')
              ->orWhere(function($q) {
                  $q->where('payment_status', 'unpaid')
                    ->whereNotNull('payment_method')
                    ->where('payment_method', '!=', 'walkin');
              });
        })
        ->exists();

        if ($existing) {
            return back()->withErrors(['error' => 'You already have an active application. Please wait for it to be processed or released.']);
        }

        $request->validate([
            'first_name' => 'required|string|max:255',
            'last_name' => 'required|string|max:255',
            'date_of_birth' => 'required|date',
            'place_of_birth' => 'required|string|max:255',
            'sex' => 'required|string|max:10',
            'civil_status' => 'required|string|max:20',
            'nationality' => 'required|string|max:50',
            'present_street' => 'required|string|max:255',
            'present_barangay' => 'required|string|max:255',
            'present_city' => 'required|string|max:255',
            'present_province' => 'required|string|max:255',
            'present_zip' => 'required|string|max:10',
            'mobile_number' => 'required|string|max:20',
            'email_address' => 'required|email|max:255',
            'purpose' => 'required|string',
        ]);

        $trackingNo = 'NBI-' . date('Ymd') . '-' . strtoupper(Str::random(6));

        // HIT check
        $hasHit = CriminalRecord::where('first_name', $request->first_name)
            ->where('last_name', $request->last_name)
            ->exists();
        
        // Initial workflow status is pending
        $workflowStatus = 'pending';
        // If has hit, we flag it internally but user sees "Under Verification" later
        $finalStatus = $hasHit ? 'HIT' : 'CLEARED';

        $clearance = Clearance::create([
            'user_id' => Auth::id(),
            'tracking_no' => $trackingNo,
            'first_name' => $request->first_name,
            'middle_name' => $request->middle_name,
            'last_name' => $request->last_name,
            'suffix' => $request->suffix,
            'date_of_birth' => $request->date_of_birth,
            'place_of_birth' => $request->place_of_birth,
            'sex' => $request->sex,
            'civil_status' => $request->civil_status,
            'nationality' => $request->nationality,
            'present_street' => $request->present_street,
            'present_barangay' => $request->present_barangay,
            'present_city' => $request->present_city,
            'present_province' => $request->present_province,
            'present_zip' => $request->present_zip,
            'permanent_street' => $request->permanent_street,
            'permanent_barangay' => $request->permanent_barangay,
            'permanent_city' => $request->permanent_city,
            'permanent_province' => $request->permanent_province,
            'permanent_zip' => $request->permanent_zip,
            'mobile_number' => $request->mobile_number,
            'email_address' => $request->email_address,
            'purpose' => $request->purpose,
            'photo_path' => null,
            'status' => $finalStatus,
            'fingerprint_status' => 'PENDING',
            'workflow_status' => $workflowStatus,
        ]);

        // Notify Admins
        \App\Models\Notification::notifyAdmins(
            'new_application',
            'New Application Submitted',
            "New application received from {$clearance->first_name} {$clearance->last_name} ({$clearance->tracking_no})",
            route('admin.clearance.index')
        );

        return back()->with('clearance', $clearance);
    }

    public function viewClearance($tracking_no)
    {
        $clearance = Clearance::where('tracking_no', $tracking_no)
            ->where('user_id', Auth::id())
            ->firstOrFail();

        if ($clearance->workflow_status !== 'released') {
            return redirect()->route('application.status')->with('error', 'Clearance not yet released.');
        }

        return Inertia::render('Application/ClearanceViewer', [
            'clearance' => $clearance
        ]);
    }

    public function downloadClearance($tracking_no)
    {
        $clearance = Clearance::where('tracking_no', $tracking_no)
            ->where('user_id', Auth::id())
            ->firstOrFail();

        if ($clearance->workflow_status !== 'released') {
            abort(403, 'Clearance not yet released.');
        }

        $pdf = \Barryvdh\DomPDF\Facade\Pdf::loadView('pdf.clearance', [
            'clearance' => $clearance
        ]);

        return $pdf->download("NBI_Clearance_{$clearance->clearance_number}.pdf");
    }
}
