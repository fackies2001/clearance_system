<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\Appointment;
use App\Models\Clearance;
use Inertia\Inertia;

class AppointmentController extends Controller
{
    const TIME_SLOTS = [
        '08:00 AM - 09:00 AM',
        '09:00 AM - 10:00 AM',
        '10:00 AM - 11:00 AM',
        '11:00 AM - 12:00 PM',
        '01:00 PM - 02:00 PM',
        '02:00 PM - 03:00 PM',
        '03:00 PM - 04:00 PM',
        '04:00 PM - 05:00 PM',
    ];

    const MAX_PER_SLOT = 10;

    /**
     * Show user's appointment page (booking form or existing appointment).
     */
    public function index()
    {
        // Fetch the active appointment for the logged-in user
        $myAppointment = Appointment::with('clearance')->where('user_id', auth()->id())
            ->whereIn('status', ['pending', 'confirmed'])
            ->latest()
            ->first();

        // FIX: Added missing database lookup query for paid clearance records
        $paidClearance = Clearance::where('user_id', auth()->id())
            ->where('payment_status', 'paid')
            ->whereNotIn('workflow_status', ['released', 'rejected'])
            ->first();

        // Fetch the latest successfully released clearance certificate if any
        $releasedClearance = Clearance::where('user_id', auth()->id())
            ->where('workflow_status', 'released')
            ->latest()
            ->first();

        return Inertia::render('Appointment/Index', [
            'myAppointment'     => $myAppointment,
            'paidClearance'     => $paidClearance,
            'releasedClearance' => $releasedClearance,
            'timeSlots'         => self::TIME_SLOTS,
        ]);
    }   

    /**
     * JSON endpoint — returns available slot counts for a given date.
     */
    public function getSlots(Request $request)
    {
        $date = $request->validate(['date' => 'required|date'])['date'];

        $slots = collect(self::TIME_SLOTS)->map(function ($slot) use ($date) {
            $booked = Appointment::where('appointment_date', $date)
                ->where('time_slot', $slot)
                ->whereNotIn('status', ['cancelled'])
                ->count();

            return [
                'slot'      => $slot,
                'available' => max(0, self::MAX_PER_SLOT - $booked),
                'total'     => self::MAX_PER_SLOT,
            ];
        });

        return response()->json($slots);
    }

    /**
     * Book a new appointment.
     */
    public function store(Request $request)
    {
        $paidClearance = Clearance::where('user_id', auth()->id())
            ->where('payment_status', 'paid')
            ->whereNotIn('workflow_status', ['released', 'rejected'])
            ->first();

        if (!$paidClearance) {
            return back()->withErrors(['appointment' => 'You must have a paid clearance application to book an appointment.']);
        }

        // Enforcement constraint: One active appointment at a time
        $hasExisting = Appointment::where('user_id', auth()->id())
            ->whereIn('status', ['pending', 'confirmed'])
            ->exists();

        if ($hasExisting) {
            return back()->withErrors(['appointment' => 'You already have an active appointment. Please cancel it first before booking a new one.']);
        }

        $request->validate([
            'appointment_date' => 'required|date|after:today',
            'time_slot'        => 'required|string|in:' . implode(',', self::TIME_SLOTS),
            'type'             => 'required|in:scheduled,walk_in',
            'notes'            => 'nullable|string|max:500',
        ]);

        // Validate concurrent slot booking capacity thresholds
        $booked = Appointment::where('appointment_date', $request->appointment_date)
            ->where('time_slot', $request->time_slot)
            ->whereNotIn('status', ['cancelled'])
            ->count();

        if ($booked >= self::MAX_PER_SLOT) {
            return back()->withErrors(['time_slot' => 'This time slot is already full. Please choose another.']);
        }

        // Generate systematic sequential queue identifier format: Q-{YYYYMMDD}-{001}
        $dateStr       = date('Ymd', strtotime($request->appointment_date));
        $queueSequence = Appointment::whereDate('appointment_date', $request->appointment_date)
            ->whereNotIn('status', ['cancelled'])
            ->count() + 1;
        $queueNumber   = 'Q-' . $dateStr . '-' . str_pad($queueSequence, 3, '0', STR_PAD_LEFT);

        Appointment::create([
            'user_id'          => auth()->id(),
            'tracking_no'      => $paidClearance->tracking_no,
            'appointment_date' => $request->appointment_date,
            'time_slot'        => $request->time_slot,
            'type'             => $request->type,
            'queue_number'     => $queueNumber,
            'status'           => 'pending',
            'notes'            => $request->notes,
        ]);

        return back()->with('success', 'Your appointment has been booked successfully! 🎉');
    }

    /**
     * Cancel a user's own appointment.
     */
    public function cancel(Appointment $appointment)
    {
        // Structural authorization defense layer
        if ($appointment->user_id !== auth()->id()) {
            abort(403);
        }

        $appointment->update(['status' => 'cancelled']);

        return back()->with('success', 'Your appointment has been cancelled.');
    }
}