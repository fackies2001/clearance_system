<x-mail::message>
# Appointment Confirmed!

Hello {{ $appointment->user->name }},

Your NBI Clearance appointment has been confirmed. Please see the details below:

**Queue Number:** {{ $appointment->queue_number }}
**Date:** {{ \Carbon\Carbon::parse($appointment->appointment_date)->format('F d, Y') }}
**Time Slot:** {{ $appointment->time_slot }}

**Important Reminders:**
- Please arrive at least 15 minutes before your scheduled time.
- Bring a valid government-issued ID.
- Present your Tracking Number: **{{ $appointment->tracking_no }}**

You can check your status anytime on your dashboard.

<x-mail::button :url="route('dashboard')">
View Dashboard
</x-mail::button>

Thanks,<br>
{{ config('app.name') }} Team
</x-mail::message>