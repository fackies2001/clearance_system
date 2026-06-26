<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\Clearance;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Illuminate\Support\Facades\Storage;
use Illuminate\Support\Str;
use App\Helpers\AuditLogger;

class BiometricsCaptureController extends Controller
{
   public function index()
{
    $applicant = null;
    $search = request('tracking_no') ?? request('search');

    if ($search) {
        $clearance = Clearance::where('tracking_no', $search)->first();

        if ($clearance && $clearance->payment_status === 'paid') {
            $applicant = $clearance;
        }
    }

    // PALITAN NG:
    return Inertia::render('Admin/Workflow/BiometricsCapture', [
        'applicant'   => $applicant,
        'search'      => $search,
        'showCapture' => request()->boolean('showCapture'),  
    ]);
}

   public function search(Request $request)
{
    $request->validate(['tracking_no' => 'required|string']);

    $clearance = Clearance::where('tracking_no', $request->tracking_no)->first();

    if (!$clearance) {
        return back()->withErrors(['tracking_no' => 'No application found with that tracking number.']);
    }

    if ($clearance->payment_status !== 'paid') {
        return back()->withErrors(['tracking_no' => 'Applicant has not paid yet. Please confirm payment first.']);
    }

    // Redirect to GET index with search param — avoids MethodNotAllowed on refresh
    return redirect()->route('admin.biometrics.index', ['search' => $request->tracking_no]);
}

   public function store(Request $request, Clearance $clearance)
{
    $request->validate([
        'photo_base64'       => 'required|string',
        'fingerprint_status' => 'required|in:COMPLETED,FAILED',
    ]);

    $image = $request->photo_base64;
    $image = str_replace('data:image/png;base64,', '', $image);
    $image = str_replace(' ', '+', $image);
    $imageName = 'clearance_' . $clearance->tracking_no . '_' . Str::random(10) . '.png';
    Storage::disk('public')->put('clearances/' . $imageName, base64_decode($image));

    $previousStatus = $clearance->workflow_status; // capture before update

    $clearance->update([
        'photo_path'         => 'clearances/' . $imageName,
        'fingerprint_status' => $request->fingerprint_status,
        'workflow_status'    => 'biometrics_captured',
    ]);

    // ── Audit log the biometrics capture ────────────────────────────────
    AuditLogger::log(
        action: 'status_changed',
        description: "Biometrics captured for {$clearance->tracking_no} — moved to processing.",
        subject: $clearance,
        oldValues: ['workflow_status' => $previousStatus],
        newValues: ['workflow_status' => 'biometrics_captured'],
    );

    \App\Models\Notification::create([
        'user_id' => $clearance->user_id,
        'type'    => 'biometrics_captured',
        'title'   => 'Biometrics Captured',
        'message' => 'Your biometrics have been successfully captured. Your application is now being processed.',
        'link'    => route('application.status'),
    ]);

    return back()->with('success', "Biometrics for {$clearance->first_name} confirmed! Application is now in processing.");
}


    public function update(Request $request, Clearance $clearance)
{
    $request->validate([
        'first_name'         => 'required|string',
        'middle_name'        => 'nullable|string',
        'last_name'          => 'required|string',
        'suffix'             => 'nullable|string',
        'date_of_birth'      => 'required|date',
        'place_of_birth'     => 'required|string',
        'sex'                => 'required|string',
        'civil_status'       => 'required|string',
        'nationality'        => 'required|string',
        'present_street'     => 'required|string',
        'present_barangay'   => 'required|string',
        'present_city'       => 'required|string',
        'present_province'   => 'required|string',
        'present_zip'        => 'required|string',
        'permanent_street'   => 'required|string',
        'permanent_barangay' => 'required|string',
        'permanent_city'     => 'required|string',
        'permanent_province' => 'required|string',
        'permanent_zip'      => 'required|string',
        'mobile_number'      => 'required|string',
        'email_address'      => 'required|email',
        'purpose'            => 'required|string',
    ]);

    $clearance->update($request->only([
        'first_name', 'middle_name', 'last_name', 'suffix',
        'date_of_birth', 'place_of_birth', 'sex', 'civil_status', 'nationality',
        'present_street', 'present_barangay', 'present_city', 'present_province', 'present_zip',
        'permanent_street', 'permanent_barangay', 'permanent_city', 'permanent_province', 'permanent_zip',
        'mobile_number', 'email_address', 'purpose',
    ]));

       return back()->with('showCapture', true);
    }
}
