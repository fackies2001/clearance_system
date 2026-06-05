<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\Clearance;
use App\Models\CriminalRecord;
use Illuminate\Http\Request;
use Inertia\Inertia;

class HitVerificationController extends Controller
{
    /**
     * Display all clearances that are flagged as HIT,
     * with their matched criminal record for side-by-side comparison.
     */
    public function index()
    {
        // Get all clearances with workflow_status = 'hit'
        $hitClearances = Clearance::with(['biometric', 'reviewer'])
            ->where('workflow_status', 'hit')
            ->orderBy('updated_at', 'desc')
            ->get()
            ->map(function ($clearance) {

                // Match against criminal_records by first_name + last_name (case-insensitive)
                $matchedRecord = CriminalRecord::whereRaw('LOWER(first_name) = ?', [strtolower($clearance->first_name)])
                    ->whereRaw('LOWER(last_name) = ?', [strtolower($clearance->last_name)])
                    ->first();

                return [
                    'id'               => $clearance->id,
                    'tracking_no'      => $clearance->tracking_no,
                    'first_name'       => $clearance->first_name,
                    'middle_name'      => $clearance->middle_name,
                    'last_name'        => $clearance->last_name,
                    'purpose'          => $clearance->purpose,
                    'status'           => $clearance->status,
                    'workflow_status'  => $clearance->workflow_status,
                    'hit_resolution'   => $clearance->hit_resolution,
                    'hit_notes'        => $clearance->hit_notes,
                    'admin_remarks'    => $clearance->admin_remarks,
                    'reviewed_by_name' => $clearance->reviewer?->name,
                    'reviewed_at'      => $clearance->reviewed_at,
                    'created_at'       => $clearance->created_at,

                    // Matched criminal record (null if no match found)
                    'matched_record'   => $matchedRecord ? [
                        'id'            => $matchedRecord->id,
                        'first_name'    => $matchedRecord->first_name,
                        'last_name'     => $matchedRecord->last_name,
                        'crime_details' => $matchedRecord->crime_details,
                    ] : null,
                ];
            });

        $stats = [
            'total_hits'        => $hitClearances->count(),
            'with_match'        => $hitClearances->whereNotNull('matched_record')->count(),
            'without_match'     => $hitClearances->whereNull('matched_record')->count(),
            'confirmed'         => $hitClearances->where('hit_resolution', 'confirmed')->count(),
            'for_investigation' => $hitClearances->where('hit_resolution', 'for_investigation')->count(),
        ];

        return Inertia::render('Admin/HitVerification', [
            'hitClearances' => $hitClearances,
            'stats'         => $stats,
        ]);
    }

    /**
     * Admin resolves a HIT case.
     * 
     * resolution = 'cleared'            → false positive, send back to under_review
     * resolution = 'for_investigation'  → confirmed hit, lock the case
     */
    public function resolve(Request $request, $id)
    {
        $clearance = Clearance::findOrFail($id);

        $request->validate([
            'resolution' => 'required|string|in:cleared,for_investigation',
            'notes'      => 'nullable|string|max:1000',
        ]);

        if ($request->resolution === 'cleared') {
            // False positive — override the HIT, send back to workflow
            $clearance->update([
                'workflow_status' => 'under_review',
                'hit_resolution'  => 'overridden',
                'status'          => 'pending',
                'hit_notes'       => $request->notes,
                'reviewed_by'     => auth()->id(),
                'reviewed_at'     => now(),
            ]);

            return back()->with('success', "Application {$clearance->tracking_no} cleared — returned to Under Review.");
        }

        if ($request->resolution === 'for_investigation') {
            // Confirmed hit — lock the case
            $clearance->update([
                'workflow_status' => 'hit',
                'hit_resolution'  => 'for_investigation',
                'status'          => 'HIT',
                'hit_notes'       => $request->notes,
                'reviewed_by'     => auth()->id(),
                'reviewed_at'     => now(),
            ]);

            return back()->with('success', "Application {$clearance->tracking_no} marked For Investigation.");
        }
    }
}
