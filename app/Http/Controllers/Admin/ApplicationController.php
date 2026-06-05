<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\Clearance;
use App\Models\Biometric;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Storage;
use Illuminate\Support\Str;

class ApplicationController extends Controller
{
    /**
     * Store biometric data into its separate table and update clearance status.
     */
    public function storeBiometrics(Request $request, $id)
    {
        $request->validate([
            'photo' => 'required|string',
            'fingerprint_status' => 'required|string|in:CAPTURED'
        ]);

        // Find the main clearance record
        $clearance = Clearance::findOrFail($id);
        $storagePath = null;

        // Process webcam base64 string stream
        $photoData = $request->input('photo');
        if (preg_match('/^data:image\/(\w+);base64,/', $photoData, $type)) {
            $photoData = substr($photoData, strpos($photoData, ',') + 1);
            $fileExtension = strtolower($type[1]);
            $decodedImage = base64_decode($photoData);

            if ($decodedImage !== false) {
                $trackingSlug = Str::slug($clearance->tracking_number ?? $id);
                $filename = 'biometric_' . $trackingSlug . '_' . time() . '.' . $fileExtension;
                $storagePath = 'biometrics/' . $filename;

                Storage::disk('public')->put($storagePath, $decodedImage);
            }
        }

        // Use Eloquent updateOrCreate to insert or update the dedicated biometrics table record
        $clearance->biometric()->updateOrCreate(
            ['clearance_id' => $clearance->id],
            [
                'photo_path' => $storagePath,
                'fingerprint_status' => $request->input('fingerprint_status'),
                'verified_by_admin' => auth()->user()->name ?? 'John Vincent Fabay'
            ]
        );

        // Update the main clearance tracking state status to CLEARED
        $clearance->update([
            'status' => 'CLEARED'
        ]);

        return redirect()->back()->with('success', 'Biometric logs isolated and cleared successfully.');
    }
}
