<x-mail::message>
# NBI Clearance Ready for Release

Dear {{ $clearance->first_name }} {{ $clearance->last_name }},

Good news! Your NBI Clearance application has been processed and is now ready for release.

**Clearance Details:**
- **Clearance Number:** {{ $clearance->clearance_number }}
- **Tracking Number:** {{ $clearance->tracking_no }}
- **Date Released:** {{ \Carbon\Carbon::parse($clearance->released_at)->format('F d, Y') }}

You can now view and download your digital clearance certificate by clicking the button below.

<x-mail::button :url="route('clearance.view', $clearance->tracking_no)">
View My Clearance
</x-mail::button>

If you prefer to print it directly, you may also do so from your dashboard.

Thanks,<br>
{{ config('app.name') }}
</x-mail::message>
