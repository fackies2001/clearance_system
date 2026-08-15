<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <title>NBI Clearance - {{ $clearance->clearance_number }}</title>
    <style>
        @page { size: A4 portrait; margin: 12mm 16mm; }
        * { margin: 0; padding: 0; box-sizing: border-box; }
        body { background: #fff; color: #000; font-family: Arial, sans-serif; font-size: 8px; }

        .copy { width: 100%; padding: 10px 0; position: relative; }
        .sep { border: none; border-top: 1.5px dashed #aaa; margin: 4px 0; }

        /* Header */
        .hdr { width: 100%; border-collapse: collapse; }
        .hdr-line { height: 2.5px; background: #1a3a6b; margin-bottom: 3px; }
        .lgo { width: 34px; vertical-align: middle; text-align: center; }
        .lgo-box { width: 30px; height: 30px; border: 1px solid #bbb; font-size: 4px; color: #999; line-height: 1.1; padding-top: 7px; font-weight: 700; text-align: center; }
        .nbi-box { width: 30px; height: 30px; border: 1.5px solid #1a3a6b; font-size: 9px; color: #1a3a6b; font-weight: 900; line-height: 28px; text-align: center; }
        .hdr-mid { text-align: center; vertical-align: middle; padding: 0 6px; }
        .cert { font-size: 5px; text-align: center; color: #666; font-style: italic; margin-bottom: 4px; }

        /* Fields */
        .l { font-size: 5px; font-weight: 700; text-transform: uppercase; color: #666; margin-bottom: 0; }
        .v { font-size: 8px; font-weight: 700; text-transform: uppercase; color: #000; border-bottom: 0.5px solid #bbb; padding-bottom: 1px; margin-bottom: 3px; }
        .v-lg { font-size: 10px; font-weight: 900; }
        .v-id { font-size: 8px; font-weight: 700; }

        /* Remarks */
        .rmk { border: 1px solid #000; padding: 2px 5px; margin-top: 1px; margin-bottom: 3px; }
        .rmk-v { font-size: 9px; font-weight: 900; text-transform: uppercase; }

        /* Body layout */
        .bd { width: 100%; border-collapse: collapse; table-layout: fixed; }
        .bd-l { vertical-align: top; padding-right: 5px; }
        .bd-r { width: 75px; vertical-align: top; text-align: center; }

        /* Right col */
        .bdg { background: #1a3a6b; color: #fff; font-size: 5.5px; font-weight: 900; padding: 1.5px 2px; letter-spacing: 0.5px; text-align: center; margin-bottom: 2px; }
        .ph { width: 65px; height: 78px; border: 1px solid #666; background: #f0f0f0; overflow: hidden; text-align: center; margin: 0 auto 2px auto; }
        .ph img { width: 65px; height: 78px; }
        .sg { width: 65px; height: 16px; border: 0.5px solid #aaa; text-align: center; font-size: 4.5px; color: #aaa; line-height: 16px; text-transform: uppercase; margin: 0 auto 2px auto; }
        .qr { text-align: center; margin: 1px auto 1px auto; }
        .qr img { width: 50px; height: 50px; }

        /* Transaction */
        .tx { width: 100%; border-collapse: collapse; font-size: 4.5px; }
        .tx td { padding: 0.5px 2px; border: 0.5px solid #ccc; }
        .tx-l { color: #555; font-weight: 700; text-transform: uppercase; white-space: nowrap; }

        /* Stamp */
        .stamp { position: absolute; top: 30%; left: 18%; font-size: 20px; font-weight: 900; color: rgba(200,30,30,0.13); border: 2.5px solid rgba(200,30,30,0.13); padding: 2px 8px; text-transform: uppercase; letter-spacing: 2px; transform: rotate(-22deg); }
    </style>
</head>
<body>

@php
    $validUntil = $clearance->released_at
        ? \Carbon\Carbon::parse($clearance->released_at)->addYear()->format('F d, Y')
        : 'N/A';
    $dob = $clearance->date_of_birth
        ? strtoupper(\Carbon\Carbon::parse($clearance->date_of_birth)->format('F d, Y'))
        : 'N/A';
    $dateIssued = $clearance->released_at
        ? \Carbon\Carbon::parse($clearance->released_at)->format('F d, Y')
        : 'N/A';
    $addr = strtoupper(implode(', ', array_filter([
        $clearance->present_street,
        'BRGY ' . $clearance->present_barangay,
        $clearance->present_city,
        $clearance->present_province,
    ])));
    $rmk = $clearance->status === 'CLEARED' ? 'NO DEROGATORY RECORD' : 'WITH DEROGATORY RECORD';
    $bid = 'A--' . substr($clearance->clearance_number, -6);
@endphp

{{-- ORIGINAL --}}
<div class="copy">

    <table class="hdr"><tr>
        <td class="lgo"><div class="lgo-box">BAGONG<br>PILIPINAS</div></td>
        <td class="hdr-mid">
            <div style="font-size:4.5px;font-weight:700;color:#1a3a6b;letter-spacing:1.5px;text-transform:uppercase;">BAGONG PILIPINAS</div>
            <div style="font-size:9px;font-weight:900;text-transform:uppercase;">REPUBLIC OF THE PHILIPPINES</div>
            <div style="font-size:7px;font-weight:700;text-transform:uppercase;color:#333;">DEPARTMENT OF JUSTICE</div>
            <div style="font-size:11px;font-weight:900;text-transform:uppercase;color:#1a3a6b;letter-spacing:0.8px;font-style:italic;">NATIONAL BUREAU OF INVESTIGATION</div>
        </td>
        <td class="lgo"><div class="nbi-box">NBI</div></td>
    </tr></table>
    <div class="hdr-line"></div>

    <div class="cert">This is to certify that the person whose name, picture, signature and thumbprint appearing herein applied for NBI Clearance and the results is as follows:</div>

    <table class="bd"><tr>
        <td class="bd-l">
            <table style="width:100%;border-collapse:collapse;"><tr>
                <td style="width:50%;padding-right:3px;"><div class="l">NBI ID No.</div><div class="v v-id">{{ $clearance->clearance_number }}</div></td>
                <td style="width:50%;"><div class="l">Valid Until</div><div class="v v-id">{{ strtoupper($validUntil) }}</div></td>
            </tr></table>
            <table style="width:100%;border-collapse:collapse;"><tr>
                <td style="width:33%;padding-right:3px;"><div class="l">Family Name</div><div class="v v-lg">{{ strtoupper($clearance->last_name) }}</div></td>
                <td style="width:33%;padding-right:3px;"><div class="l">First Name</div><div class="v v-lg">{{ strtoupper($clearance->first_name) }}</div></td>
                <td style="width:34%;"><div class="l">Middle Name</div><div class="v v-lg">{{ strtoupper($clearance->middle_name ?? 'N/A') }}</div></td>
            </tr></table>
            <div class="l">Address</div><div class="v" style="font-size:7.5px;">{{ $addr }}</div>
            <table style="width:100%;border-collapse:collapse;"><tr>
                <td style="width:50%;padding-right:3px;"><div class="l">Date of Birth</div><div class="v">{{ $dob }}</div></td>
                <td style="width:50%;"><div class="l">Place of Birth</div><div class="v">{{ strtoupper($clearance->place_of_birth) }}</div></td>
            </tr></table>
            <table style="width:100%;border-collapse:collapse;"><tr>
                <td style="width:33%;padding-right:3px;"><div class="l">Citizenship</div><div class="v">{{ strtoupper($clearance->nationality) }}</div></td>
                <td style="width:33%;padding-right:3px;"><div class="l">Civil Status</div><div class="v">{{ strtoupper($clearance->civil_status) }}</div></td>
                <td style="width:34%;"><div class="l">Gender</div><div class="v">{{ strtoupper($clearance->sex) }}</div></td>
            </tr></table>
            <div class="l">Purpose</div><div class="v">{{ strtoupper($clearance->purpose) }}</div>
            <div class="rmk"><div class="l">Remarks</div><div class="rmk-v">{{ $rmk }}</div></div>
            {{-- Bottom: barcode text left, director right --}}
            <table style="width:100%;border-collapse:collapse;margin-top:6px;"><tr>
                <td style="width:50%;vertical-align:bottom;">
                    @if(isset($barcodeBase64) && $barcodeBase64)
                        <img src="{{ $barcodeBase64 }}" style="width:100%;height:20px;" />
                    @endif
                    <div style="font-size:5px;font-family:monospace;margin-top:1px;">{{ $clearance->clearance_number }}</div>
                </td>
                <td style="width:50%;text-align:right;vertical-align:bottom;">
                    <div style="border-top:0.5px solid #000;width:80px;margin:0 0 1px auto;"></div>
                    <div style="font-size:5.5px;font-weight:900;text-transform:uppercase;">ATTY. NBI DIRECTOR</div>
                    <div style="font-size:4.5px;color:#555;text-transform:uppercase;">Director</div>
                </td>
            </tr></table>
        </td>
        <td class="bd-r">
            <div class="bdg">{{ $bid }}</div>
            <div class="ph">@if(isset($photoBase64) && $photoBase64)<img src="{{ $photoBase64 }}" />@else<div style="font-size:5px;color:#aaa;padding-top:30px;">NO PHOTO</div>@endif</div>
            <div class="sg">SIGNATURE</div>
            <div class="qr">@if(isset($qrCodeBase64) && $qrCodeBase64)<img src="{{ $qrCodeBase64 }}" />@endif</div>
            <table class="tx">
                <tr><td class="tx-l">Date</td><td>{{ $dateIssued }}</td></tr>
                <tr><td class="tx-l">Agency</td><td>NBI</td></tr>
                <tr><td class="tx-l">O.R. No.</td><td>{{ $clearance->payment_reference ?? 'N/A' }}</td></tr>
                <tr><td class="tx-l">DST PAID</td><td>{{ $clearance->payment_amount ? 'Php '.$clearance->payment_amount : 'N/A' }}</td></tr>
            </table>
        </td>
    </tr></table>
</div>

<hr class="sep" />

{{-- PERSONAL COPY --}}
<div class="copy">
    <div class="stamp">PERSONAL COPY</div>

    <table class="hdr"><tr>
        <td class="lgo"><div class="lgo-box">BAGONG<br>PILIPINAS</div></td>
        <td class="hdr-mid">
            <div style="font-size:4.5px;font-weight:700;color:#1a3a6b;letter-spacing:1.5px;text-transform:uppercase;">BAGONG PILIPINAS</div>
            <div style="font-size:9px;font-weight:900;text-transform:uppercase;">REPUBLIC OF THE PHILIPPINES</div>
            <div style="font-size:7px;font-weight:700;text-transform:uppercase;color:#333;">DEPARTMENT OF JUSTICE</div>
            <div style="font-size:11px;font-weight:900;text-transform:uppercase;color:#1a3a6b;letter-spacing:0.8px;font-style:italic;">NATIONAL BUREAU OF INVESTIGATION</div>
        </td>
        <td class="lgo"><div class="nbi-box">NBI</div></td>
    </tr></table>
    <div class="hdr-line"></div>

    <div class="cert">This is to certify that the person whose name, picture, signature and thumbprint appearing herein applied for NBI Clearance and the results is as follows:</div>

    <table class="bd"><tr>
        <td class="bd-l">
            <table style="width:100%;border-collapse:collapse;"><tr>
                <td style="width:50%;padding-right:3px;"><div class="l">NBI ID No.</div><div class="v v-id">{{ $clearance->clearance_number }}</div></td>
                <td style="width:50%;"><div class="l">Valid Until</div><div class="v v-id">{{ strtoupper($validUntil) }}</div></td>
            </tr></table>
            <table style="width:100%;border-collapse:collapse;"><tr>
                <td style="width:33%;padding-right:3px;"><div class="l">Family Name</div><div class="v v-lg">{{ strtoupper($clearance->last_name) }}</div></td>
                <td style="width:33%;padding-right:3px;"><div class="l">First Name</div><div class="v v-lg">{{ strtoupper($clearance->first_name) }}</div></td>
                <td style="width:34%;"><div class="l">Middle Name</div><div class="v v-lg">{{ strtoupper($clearance->middle_name ?? 'N/A') }}</div></td>
            </tr></table>
            <div class="l">Address</div><div class="v" style="font-size:7.5px;">{{ $addr }}</div>
            <table style="width:100%;border-collapse:collapse;"><tr>
                <td style="width:50%;padding-right:3px;"><div class="l">Date of Birth</div><div class="v">{{ $dob }}</div></td>
                <td style="width:50%;"><div class="l">Place of Birth</div><div class="v">{{ strtoupper($clearance->place_of_birth) }}</div></td>
            </tr></table>
            <table style="width:100%;border-collapse:collapse;"><tr>
                <td style="width:33%;padding-right:3px;"><div class="l">Citizenship</div><div class="v">{{ strtoupper($clearance->nationality) }}</div></td>
                <td style="width:33%;padding-right:3px;"><div class="l">Civil Status</div><div class="v">{{ strtoupper($clearance->civil_status) }}</div></td>
                <td style="width:34%;"><div class="l">Gender</div><div class="v">{{ strtoupper($clearance->sex) }}</div></td>
            </tr></table>
            <div class="l">Purpose</div><div class="v">{{ strtoupper($clearance->purpose) }}</div>
            <div class="rmk"><div class="l">Remarks</div><div class="rmk-v">{{ $rmk }}</div></div>
            <table style="width:100%;border-collapse:collapse;margin-top:6px;"><tr>
                <td style="width:50%;vertical-align:bottom;">
                    @if(isset($barcodeBase64) && $barcodeBase64)
                        <img src="{{ $barcodeBase64 }}" style="width:100%;height:20px;" />
                    @endif
                    <div style="font-size:5px;font-family:monospace;margin-top:1px;">{{ $clearance->clearance_number }}</div>
                </td>
                <td style="width:50%;text-align:right;vertical-align:bottom;">
                    <div style="border-top:0.5px solid #000;width:80px;margin:0 0 1px auto;"></div>
                    <div style="font-size:5.5px;font-weight:900;text-transform:uppercase;">ATTY. NBI DIRECTOR</div>
                    <div style="font-size:4.5px;color:#555;text-transform:uppercase;">Director</div>
                </td>
            </tr></table>
        </td>
        <td class="bd-r">
            <div class="bdg">{{ $bid }}</div>
            <div class="ph">@if(isset($photoBase64) && $photoBase64)<img src="{{ $photoBase64 }}" />@else<div style="font-size:5px;color:#aaa;padding-top:30px;">NO PHOTO</div>@endif</div>
            <div class="sg">SIGNATURE</div>
            <div class="qr">@if(isset($qrCodeBase64) && $qrCodeBase64)<img src="{{ $qrCodeBase64 }}" />@endif</div>
            <table class="tx">
                <tr><td class="tx-l">Date</td><td>{{ $dateIssued }}</td></tr>
                <tr><td class="tx-l">Agency</td><td>NBI</td></tr>
                <tr><td class="tx-l">O.R. No.</td><td>{{ $clearance->payment_reference ?? 'N/A' }}</td></tr>
                <tr><td class="tx-l">DST PAID</td><td>{{ $clearance->payment_amount ? 'Php '.$clearance->payment_amount : 'N/A' }}</td></tr>
            </table>
        </td>
    </tr></table>
</div>

</body>
</html>