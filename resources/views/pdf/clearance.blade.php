{{-- resources/views/pdf/clearance.blade.php --}}
{{-- Scaled down to fit 2 copies on A4 @ 72dpi with proper margins --}}
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <title>NBI Clearance - {{ $clearance->clearance_number }}</title>
    <style>
        /* A4 = 595pt x 842pt at 72dpi. Generous margins. */
        @page { size: A4 portrait; margin: 15mm 15mm; }
        * { margin: 0; padding: 0; box-sizing: border-box; }
        body { background: #fff; color: #000; font-family: Arial, sans-serif; font-size: 8px; }

        /* ─── Card ─── */
        .card {
            width: 100%;
            border: 1.5px solid #1a3a6b;
            padding: 8px 12px;
            position: relative;
            overflow: hidden;
        }

        /* ─── Separator ─── */
        .sep {
            border: none;
            border-top: 1.5px dashed #888;
            margin: 6px 0;
        }

        /* ─── Header ─── */
        .hdr { width: 100%; border-collapse: collapse; border-bottom: 2px solid #1a3a6b; padding-bottom: 3px; margin-bottom: 3px; }
        .hdr-logo { width: 36px; text-align: center; vertical-align: middle; padding: 2px; }
        .hdr-center { text-align: center; vertical-align: middle; padding: 0 6px; }
        .logo-box { width: 32px; height: 32px; border: 1px solid #ccc; font-size: 4.5px; color: #888; line-height: 1.1; padding-top: 7px; font-weight: 700; text-align: center; }
        .nbi-box { width: 32px; height: 32px; border: 1.5px solid #1a3a6b; font-size: 9px; color: #1a3a6b; font-weight: 900; line-height: 30px; text-align: center; }

        .cert { font-size: 5.5px; text-align: center; color: #555; font-style: italic; margin-bottom: 4px; }

        /* ─── Field labels & values ─── */
        .lbl { font-size: 5.5px; font-weight: 700; text-transform: uppercase; color: #555; letter-spacing: 0.3px; margin-bottom: 0; }
        .val { font-size: 8.5px; font-weight: 700; text-transform: uppercase; color: #000; border-bottom: 0.5px solid #aaa; padding-bottom: 1px; margin-bottom: 3px; }
        .val-sm { font-size: 8px; }
        .val-lg { font-size: 11px; font-weight: 900; }

        /* ─── Remarks ─── */
        .rmk { border: 1.5px solid #000; padding: 2px 6px; margin-top: 2px; margin-bottom: 4px; }
        .rmk-val { font-size: 9px; font-weight: 900; text-transform: uppercase; }

        /* ─── Right column ─── */
        .badge { background: #1a3a6b; color: #fff; font-size: 6px; font-weight: 900; padding: 2px 4px; letter-spacing: 0.8px; text-align: center; margin-bottom: 3px; }
        .photo { width: 68px; height: 82px; border: 1.5px solid #555; background: #eee; overflow: hidden; text-align: center; margin: 0 auto 3px auto; }
        .photo img { width: 68px; height: 82px; }
        .sig { width: 68px; height: 18px; border: 0.5px solid #999; text-align: center; font-size: 5px; color: #999; line-height: 18px; text-transform: uppercase; margin: 0 auto 3px auto; }

        /* ─── Transaction ─── */
        .tx { width: 100%; border-collapse: collapse; font-size: 5px; margin-top: 1px; }
        .tx td { padding: 1px 2px; border: 0.5px solid #ccc; }
        .tx-l { color: #555; font-weight: 700; text-transform: uppercase; white-space: nowrap; }

        /* ─── Personal Copy stamp ─── */
        .stamp { position: absolute; top: 30%; left: 22%; font-size: 22px; font-weight: 900; color: rgba(200,30,30,0.12); border: 3px solid rgba(200,30,30,0.12); padding: 3px 10px; text-transform: uppercase; letter-spacing: 2px; transform: rotate(-20deg); z-index: 5; }
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
    $address = strtoupper(implode(', ', array_filter([
        $clearance->present_street,
        'BRGY ' . $clearance->present_barangay,
        $clearance->present_city,
        $clearance->present_province,
    ])));
    $remarks = $clearance->status === 'CLEARED' ? 'NO DEROGATORY RECORD' : 'WITH DEROGATORY RECORD';
    $badgeId = 'A-' . substr($clearance->clearance_number, -7);
@endphp

{{-- ═══════════ ORIGINAL COPY ═══════════ --}}
<div class="card">

    <table class="hdr">
        <tr>
            <td class="hdr-logo"><div class="logo-box">BAGONG<br>PILIPINAS</div></td>
            <td class="hdr-center">
                <div style="font-size:5px;font-weight:700;color:#1a3a6b;letter-spacing:1.5px;text-transform:uppercase;">BAGONG PILIPINAS</div>
                <div style="font-size:10px;font-weight:900;text-transform:uppercase;">REPUBLIC OF THE PHILIPPINES</div>
                <div style="font-size:7.5px;font-weight:700;text-transform:uppercase;color:#333;">DEPARTMENT OF JUSTICE</div>
                <div style="font-size:12px;font-weight:900;text-transform:uppercase;color:#1a3a6b;letter-spacing:1px;">NATIONAL BUREAU OF INVESTIGATION</div>
            </td>
            <td class="hdr-logo"><div class="nbi-box">NBI</div></td>
        </tr>
    </table>

    <div class="cert">This is to certify that the person whose name, picture, signature and thumbprint appearing herein applied for NBI Clearance and the results is as follows:</div>

    <table style="width:100%;border-collapse:collapse;">
        <tr>
            <td style="vertical-align:top;padding-right:8px;">

                <table style="width:100%;border-collapse:collapse;"><tr>
                    <td style="width:50%;padding-right:4px;"><div class="lbl">NBI ID No.</div><div class="val val-sm">{{ $clearance->clearance_number }}</div></td>
                    <td style="width:50%;"><div class="lbl">Valid Until</div><div class="val val-sm">{{ strtoupper($validUntil) }}</div></td>
                </tr></table>

                <table style="width:100%;border-collapse:collapse;"><tr>
                    <td style="width:33%;padding-right:4px;"><div class="lbl">Family Name</div><div class="val val-lg">{{ strtoupper($clearance->last_name) }}</div></td>
                    <td style="width:33%;padding-right:4px;"><div class="lbl">First Name</div><div class="val val-lg">{{ strtoupper($clearance->first_name) }}</div></td>
                    <td style="width:34%;"><div class="lbl">Middle Name</div><div class="val val-lg">{{ strtoupper($clearance->middle_name ?? 'N/A') }}</div></td>
                </tr></table>

                <div class="lbl">Address</div>
                <div class="val val-sm">{{ $address }}</div>

                <table style="width:100%;border-collapse:collapse;"><tr>
                    <td style="width:50%;padding-right:4px;"><div class="lbl">Date of Birth</div><div class="val">{{ $dob }}</div></td>
                    <td style="width:50%;"><div class="lbl">Place of Birth</div><div class="val">{{ strtoupper($clearance->place_of_birth) }}</div></td>
                </tr></table>

                <table style="width:100%;border-collapse:collapse;"><tr>
                    <td style="width:33%;padding-right:4px;"><div class="lbl">Citizenship</div><div class="val">{{ strtoupper($clearance->nationality) }}</div></td>
                    <td style="width:33%;padding-right:4px;"><div class="lbl">Civil Status</div><div class="val">{{ strtoupper($clearance->civil_status) }}</div></td>
                    <td style="width:34%;"><div class="lbl">Gender</div><div class="val">{{ strtoupper($clearance->sex) }}</div></td>
                </tr></table>

                <div class="lbl">Purpose</div>
                <div class="val">{{ strtoupper($clearance->purpose) }}</div>

                <div class="rmk">
                    <div class="lbl">Remarks</div>
                    <div class="rmk-val">{{ $remarks }}</div>
                </div>

                <table style="width:100%;border-collapse:collapse;"><tr>
                    <td style="width:55%;vertical-align:bottom;">
                        @if(isset($barcodeBase64) && $barcodeBase64)
                            <img src="{{ $barcodeBase64 }}" style="width:150px;height:22px;" />
                        @endif
                        <div style="font-size:5.5px;font-family:monospace;text-align:center;margin-top:1px;">{{ $clearance->clearance_number }}</div>
                    </td>
                    <td style="width:45%;text-align:center;vertical-align:bottom;">
                        <div style="border-top:1px solid #000;width:85px;margin:0 auto 1px auto;"></div>
                        <div style="font-size:6px;font-weight:900;text-transform:uppercase;">ATTY. NBI DIRECTOR</div>
                        <div style="font-size:5px;color:#555;text-transform:uppercase;">Director</div>
                    </td>
                </tr></table>

            </td>

            <td style="width:78px;vertical-align:top;text-align:center;">
                <div class="badge">{{ $badgeId }}</div>
                <div class="photo">
                    @if(isset($photoBase64) && $photoBase64)
                        <img src="{{ $photoBase64 }}" />
                    @else
                        <div style="font-size:5px;color:#aaa;padding-top:35px;">NO PHOTO</div>
                    @endif
                </div>
                <div class="sig">SIGNATURE</div>
                <div style="text-align:center;margin:2px auto;">
                    @if(isset($qrCodeBase64) && $qrCodeBase64)
                        <img src="{{ $qrCodeBase64 }}" style="width:58px;height:58px;" />
                    @endif
                </div>
                <table class="tx">
                    <tr><td class="tx-l">Date</td><td>{{ $dateIssued }}</td></tr>
                    <tr><td class="tx-l">Agency</td><td>NBI</td></tr>
                    <tr><td class="tx-l">O.R. No.</td><td>{{ $clearance->payment_reference ?? 'N/A' }}</td></tr>
                    <tr><td class="tx-l">DST PAID</td><td>{{ $clearance->payment_amount ? 'Php '.$clearance->payment_amount : 'N/A' }}</td></tr>
                </table>
            </td>
        </tr>
    </table>
</div>

{{-- Separator --}}
<hr class="sep" />

{{-- ═══════════ PERSONAL COPY ═══════════ --}}
<div class="card">

    <div class="stamp">PERSONAL COPY</div>

    <table class="hdr">
        <tr>
            <td class="hdr-logo"><div class="logo-box">BAGONG<br>PILIPINAS</div></td>
            <td class="hdr-center">
                <div style="font-size:5px;font-weight:700;color:#1a3a6b;letter-spacing:1.5px;text-transform:uppercase;">BAGONG PILIPINAS</div>
                <div style="font-size:10px;font-weight:900;text-transform:uppercase;">REPUBLIC OF THE PHILIPPINES</div>
                <div style="font-size:7.5px;font-weight:700;text-transform:uppercase;color:#333;">DEPARTMENT OF JUSTICE</div>
                <div style="font-size:12px;font-weight:900;text-transform:uppercase;color:#1a3a6b;letter-spacing:1px;">NATIONAL BUREAU OF INVESTIGATION</div>
            </td>
            <td class="hdr-logo"><div class="nbi-box">NBI</div></td>
        </tr>
    </table>

    <div class="cert">This is to certify that the person whose name, picture, signature and thumbprint appearing herein applied for NBI Clearance and the results is as follows:</div>

    <table style="width:100%;border-collapse:collapse;">
        <tr>
            <td style="vertical-align:top;padding-right:8px;">

                <table style="width:100%;border-collapse:collapse;"><tr>
                    <td style="width:50%;padding-right:4px;"><div class="lbl">NBI ID No.</div><div class="val val-sm">{{ $clearance->clearance_number }}</div></td>
                    <td style="width:50%;"><div class="lbl">Valid Until</div><div class="val val-sm">{{ strtoupper($validUntil) }}</div></td>
                </tr></table>

                <table style="width:100%;border-collapse:collapse;"><tr>
                    <td style="width:33%;padding-right:4px;"><div class="lbl">Family Name</div><div class="val val-lg">{{ strtoupper($clearance->last_name) }}</div></td>
                    <td style="width:33%;padding-right:4px;"><div class="lbl">First Name</div><div class="val val-lg">{{ strtoupper($clearance->first_name) }}</div></td>
                    <td style="width:34%;"><div class="lbl">Middle Name</div><div class="val val-lg">{{ strtoupper($clearance->middle_name ?? 'N/A') }}</div></td>
                </tr></table>

                <div class="lbl">Address</div>
                <div class="val val-sm">{{ $address }}</div>

                <table style="width:100%;border-collapse:collapse;"><tr>
                    <td style="width:50%;padding-right:4px;"><div class="lbl">Date of Birth</div><div class="val">{{ $dob }}</div></td>
                    <td style="width:50%;"><div class="lbl">Place of Birth</div><div class="val">{{ strtoupper($clearance->place_of_birth) }}</div></td>
                </tr></table>

                <table style="width:100%;border-collapse:collapse;"><tr>
                    <td style="width:33%;padding-right:4px;"><div class="lbl">Citizenship</div><div class="val">{{ strtoupper($clearance->nationality) }}</div></td>
                    <td style="width:33%;padding-right:4px;"><div class="lbl">Civil Status</div><div class="val">{{ strtoupper($clearance->civil_status) }}</div></td>
                    <td style="width:34%;"><div class="lbl">Gender</div><div class="val">{{ strtoupper($clearance->sex) }}</div></td>
                </tr></table>

                <div class="lbl">Purpose</div>
                <div class="val">{{ strtoupper($clearance->purpose) }}</div>

                <div class="rmk">
                    <div class="lbl">Remarks</div>
                    <div class="rmk-val">{{ $remarks }}</div>
                </div>

                <table style="width:100%;border-collapse:collapse;"><tr>
                    <td style="width:55%;vertical-align:bottom;">
                        @if(isset($barcodeBase64) && $barcodeBase64)
                            <img src="{{ $barcodeBase64 }}" style="width:150px;height:22px;" />
                        @endif
                        <div style="font-size:5.5px;font-family:monospace;text-align:center;margin-top:1px;">{{ $clearance->clearance_number }}</div>
                    </td>
                    <td style="width:45%;text-align:center;vertical-align:bottom;">
                        <div style="border-top:1px solid #000;width:85px;margin:0 auto 1px auto;"></div>
                        <div style="font-size:6px;font-weight:900;text-transform:uppercase;">ATTY. NBI DIRECTOR</div>
                        <div style="font-size:5px;color:#555;text-transform:uppercase;">Director</div>
                    </td>
                </tr></table>

            </td>

            <td style="width:78px;vertical-align:top;text-align:center;">
                <div class="badge">{{ $badgeId }}</div>
                <div class="photo">
                    @if(isset($photoBase64) && $photoBase64)
                        <img src="{{ $photoBase64 }}" />
                    @else
                        <div style="font-size:5px;color:#aaa;padding-top:35px;">NO PHOTO</div>
                    @endif
                </div>
                <div class="sig">SIGNATURE</div>
                <div style="text-align:center;margin:2px auto;">
                    @if(isset($qrCodeBase64) && $qrCodeBase64)
                        <img src="{{ $qrCodeBase64 }}" style="width:58px;height:58px;" />
                    @endif
                </div>
                <table class="tx">
                    <tr><td class="tx-l">Date</td><td>{{ $dateIssued }}</td></tr>
                    <tr><td class="tx-l">Agency</td><td>NBI</td></tr>
                    <tr><td class="tx-l">O.R. No.</td><td>{{ $clearance->payment_reference ?? 'N/A' }}</td></tr>
                    <tr><td class="tx-l">DST PAID</td><td>{{ $clearance->payment_amount ? 'Php '.$clearance->payment_amount : 'N/A' }}</td></tr>
                </table>
            </td>
        </tr>
    </table>
</div>

</body>
</html>