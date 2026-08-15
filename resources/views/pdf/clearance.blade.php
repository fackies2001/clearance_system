{{-- resources/views/pdf/clearance.blade.php --}}
{{-- Matching the browser print preview layout exactly --}}
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <title>NBI Clearance - {{ $clearance->clearance_number }}</title>
    <style>
        @page { size: A4 portrait; margin: 12mm 14mm; }
        * { margin: 0; padding: 0; box-sizing: border-box; }
        body { background: #fff; color: #000; font-family: Arial, sans-serif; font-size: 8px; }

        /* ─── Wrapper: provides equal margins on ALL sides ─── */
        .wrapper {
            width: 100%;
            padding: 0;
        }

        /* ─── Card ─── */
        .card {
            width: 100%;
            padding: 10px 14px 8px 14px;
            position: relative;
        }

        /* ─── Separator ─── */
        .sep { border: none; border-top: 1.5px dashed #999; margin: 5px 0; }

        /* ─── Header row ─── */
        .hdr {
            width: 100%;
            border-collapse: collapse;
            border-bottom: 2.5px solid #1a3a6b;
            margin-bottom: 4px;
        }
        .hdr td { vertical-align: middle; }
        .hdr-logo-cell { width: 44px; padding: 3px 4px; }
        .hdr-center { text-align: center; padding: 2px 8px; }

        .logo-frame {
            width: 36px; height: 36px;
            border: 1px solid #ccc;
            font-size: 4.5px; color: #888;
            line-height: 1.1; padding-top: 8px;
            font-weight: 700; text-align: center;
        }
        .nbi-frame {
            width: 36px; height: 36px;
            border: 1.5px solid #1a3a6b;
            font-size: 10px; color: #1a3a6b;
            font-weight: 900; line-height: 34px;
            text-align: center;
        }

        .cert { font-size: 5.5px; text-align: center; color: #555; font-style: italic; margin-bottom: 5px; }

        /* ─── Labels & Values ─── */
        .lbl { font-size: 5.5px; font-weight: 700; text-transform: uppercase; color: #555; letter-spacing: 0.3px; }
        .val { font-size: 8.5px; font-weight: 700; text-transform: uppercase; color: #000; border-bottom: 0.5px solid #aaa; padding-bottom: 1px; margin-bottom: 3px; }
        .val-sm { font-size: 8px; }
        .val-lg { font-size: 10.5px; font-weight: 900; }

        /* ─── Remarks ─── */
        .rmk { border: 1.5px solid #000; padding: 2px 6px; margin-top: 2px; margin-bottom: 5px; }
        .rmk-val { font-size: 9px; font-weight: 900; text-transform: uppercase; }

        /* ─── Body layout: left data + right photo column ─── */
        .body-table { width: 100%; border-collapse: collapse; table-layout: fixed; }
        .body-left { vertical-align: top; padding-right: 6px; }
        .body-right { width: 80px; vertical-align: top; text-align: center; }

        /* ─── Right column elements ─── */
        .badge { background: #1a3a6b; color: #fff; font-size: 6px; font-weight: 900; padding: 2px 0; letter-spacing: 0.5px; text-align: center; margin-bottom: 2px; }
        .photo { width: 70px; height: 85px; border: 1.5px solid #555; background: #eee; overflow: hidden; text-align: center; margin: 0 auto 2px auto; }
        .photo img { width: 70px; height: 85px; }
        .sig { width: 70px; height: 18px; border: 0.5px solid #999; text-align: center; font-size: 5px; color: #999; line-height: 18px; text-transform: uppercase; margin: 0 auto 2px auto; }

        /* ─── QR ─── */
        .qr { text-align: center; margin: 2px auto; }
        .qr img { width: 55px; height: 55px; }

        /* ─── Transaction ─── */
        .tx { width: 100%; border-collapse: collapse; font-size: 5px; }
        .tx td { padding: 1px 2px; border: 0.5px solid #ccc; }
        .tx-l { color: #555; font-weight: 700; text-transform: uppercase; white-space: nowrap; }

        /* ─── Bottom row: barcode + director ─── */
        .bot { width: 100%; border-collapse: collapse; margin-top: 1px; }
        .bot td { vertical-align: bottom; }

        /* ─── Watermark ─── */
        .stamp {
            position: absolute; top: 32%; left: 20%;
            font-size: 22px; font-weight: 900;
            color: rgba(200,30,30,0.12);
            border: 3px solid rgba(200,30,30,0.12);
            padding: 3px 10px; text-transform: uppercase;
            letter-spacing: 2px; transform: rotate(-22deg);
        }
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

    {{-- HEADER --}}
    <table class="hdr">
        <tr>
            <td class="hdr-logo-cell"><div class="logo-frame">BAGONG<br>PILIPINAS</div></td>
            <td class="hdr-center">
                <div style="font-size:5px;font-weight:700;color:#1a3a6b;letter-spacing:1.5px;text-transform:uppercase;">BAGONG PILIPINAS</div>
                <div style="font-size:10px;font-weight:900;text-transform:uppercase;">REPUBLIC OF THE PHILIPPINES</div>
                <div style="font-size:7.5px;font-weight:700;text-transform:uppercase;color:#333;">DEPARTMENT OF JUSTICE</div>
                <div style="font-size:12px;font-weight:900;text-transform:uppercase;color:#1a3a6b;letter-spacing:1px;">NATIONAL BUREAU OF INVESTIGATION</div>
            </td>
            <td class="hdr-logo-cell"><div class="nbi-frame">NBI</div></td>
        </tr>
    </table>

    <div class="cert">This is to certify that the person whose name, picture, signature and thumbprint appearing herein applied for NBI Clearance and the results is as follows:</div>

    {{-- BODY --}}
    <table class="body-table">
        <tr>
            <td class="body-left">

                {{-- NBI ID + Valid Until --}}
                <table style="width:100%;border-collapse:collapse;"><tr>
                    <td style="width:50%;padding-right:4px;"><div class="lbl">NBI ID No.</div><div class="val val-sm">{{ $clearance->clearance_number }}</div></td>
                    <td style="width:50%;"><div class="lbl">Valid Until</div><div class="val val-sm">{{ strtoupper($validUntil) }}</div></td>
                </tr></table>

                {{-- Name --}}
                <table style="width:100%;border-collapse:collapse;"><tr>
                    <td style="width:33%;padding-right:4px;"><div class="lbl">Family Name</div><div class="val val-lg">{{ strtoupper($clearance->last_name) }}</div></td>
                    <td style="width:33%;padding-right:4px;"><div class="lbl">First Name</div><div class="val val-lg">{{ strtoupper($clearance->first_name) }}</div></td>
                    <td style="width:34%;"><div class="lbl">Middle Name</div><div class="val val-lg">{{ strtoupper($clearance->middle_name ?? 'N/A') }}</div></td>
                </tr></table>

                {{-- Address --}}
                <div class="lbl">Address</div>
                <div class="val val-sm">{{ $address }}</div>

                {{-- DOB + POB --}}
                <table style="width:100%;border-collapse:collapse;"><tr>
                    <td style="width:50%;padding-right:4px;"><div class="lbl">Date of Birth</div><div class="val">{{ $dob }}</div></td>
                    <td style="width:50%;"><div class="lbl">Place of Birth</div><div class="val">{{ strtoupper($clearance->place_of_birth) }}</div></td>
                </tr></table>

                {{-- Citizenship / Civil Status / Gender --}}
                <table style="width:100%;border-collapse:collapse;"><tr>
                    <td style="width:33%;padding-right:4px;"><div class="lbl">Citizenship</div><div class="val">{{ strtoupper($clearance->nationality) }}</div></td>
                    <td style="width:33%;padding-right:4px;"><div class="lbl">Civil Status</div><div class="val">{{ strtoupper($clearance->civil_status) }}</div></td>
                    <td style="width:34%;"><div class="lbl">Gender</div><div class="val">{{ strtoupper($clearance->sex) }}</div></td>
                </tr></table>

                {{-- Purpose --}}
                <div class="lbl">Purpose</div>
                <div class="val">{{ strtoupper($clearance->purpose) }}</div>

                {{-- Remarks --}}
                <div class="rmk">
                    <div class="lbl">Remarks</div>
                    <div class="rmk-val">{{ $remarks }}</div>
                </div>

            </td>

            {{-- RIGHT COLUMN --}}
            <td class="body-right">
                <div class="badge">{{ $badgeId }}</div>
                <div class="photo">
                    @if(isset($photoBase64) && $photoBase64)
                        <img src="{{ $photoBase64 }}" />
                    @else
                        <div style="font-size:5px;color:#aaa;padding-top:35px;">NO PHOTO</div>
                    @endif
                </div>
                <div class="sig">SIGNATURE</div>
                <div class="qr">
                    @if(isset($qrCodeBase64) && $qrCodeBase64)
                        <img src="{{ $qrCodeBase64 }}" />
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

    {{-- BOTTOM: Barcode + Director (full width, below body table) --}}
    <table class="bot">
        <tr>
            <td style="width:60%;">
                @if(isset($barcodeBase64) && $barcodeBase64)
                    <img src="{{ $barcodeBase64 }}" style="width:100%;height:28px;" />
                @endif
                <div style="font-size:5.5px;font-family:monospace;text-align:center;margin-top:1px;">{{ $clearance->clearance_number }}</div>
            </td>
            <td style="width:40%;text-align:right;">
                <div style="border-top:1px solid #000;width:90px;margin:0 0 1px auto;"></div>
                <div style="font-size:6.5px;font-weight:900;text-transform:uppercase;">ATTY. NBI DIRECTOR</div>
                <div style="font-size:5px;color:#555;text-transform:uppercase;">Director</div>
            </td>
        </tr>
    </table>

</div>

{{-- Separator --}}
<hr class="sep" />

{{-- ═══════════ PERSONAL COPY ═══════════ --}}
<div class="card">

    <div class="stamp">PERSONAL COPY</div>

    {{-- HEADER --}}
    <table class="hdr">
        <tr>
            <td class="hdr-logo-cell"><div class="logo-frame">BAGONG<br>PILIPINAS</div></td>
            <td class="hdr-center">
                <div style="font-size:5px;font-weight:700;color:#1a3a6b;letter-spacing:1.5px;text-transform:uppercase;">BAGONG PILIPINAS</div>
                <div style="font-size:10px;font-weight:900;text-transform:uppercase;">REPUBLIC OF THE PHILIPPINES</div>
                <div style="font-size:7.5px;font-weight:700;text-transform:uppercase;color:#333;">DEPARTMENT OF JUSTICE</div>
                <div style="font-size:12px;font-weight:900;text-transform:uppercase;color:#1a3a6b;letter-spacing:1px;">NATIONAL BUREAU OF INVESTIGATION</div>
            </td>
            <td class="hdr-logo-cell"><div class="nbi-frame">NBI</div></td>
        </tr>
    </table>

    <div class="cert">This is to certify that the person whose name, picture, signature and thumbprint appearing herein applied for NBI Clearance and the results is as follows:</div>

    {{-- BODY --}}
    <table class="body-table">
        <tr>
            <td class="body-left">

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

            </td>

            {{-- RIGHT COLUMN --}}
            <td class="body-right">
                <div class="badge">{{ $badgeId }}</div>
                <div class="photo">
                    @if(isset($photoBase64) && $photoBase64)
                        <img src="{{ $photoBase64 }}" />
                    @else
                        <div style="font-size:5px;color:#aaa;padding-top:35px;">NO PHOTO</div>
                    @endif
                </div>
                <div class="sig">SIGNATURE</div>
                <div class="qr">
                    @if(isset($qrCodeBase64) && $qrCodeBase64)
                        <img src="{{ $qrCodeBase64 }}" />
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

    {{-- BOTTOM: Barcode + Director --}}
    <table class="bot">
        <tr>
            <td style="width:60%;">
                @if(isset($barcodeBase64) && $barcodeBase64)
                    <img src="{{ $barcodeBase64 }}" style="width:100%;height:28px;" />
                @endif
                <div style="font-size:5.5px;font-family:monospace;text-align:center;margin-top:1px;">{{ $clearance->clearance_number }}</div>
            </td>
            <td style="width:40%;text-align:right;">
                <div style="border-top:1px solid #000;width:90px;margin:0 0 1px auto;"></div>
                <div style="font-size:6.5px;font-weight:900;text-transform:uppercase;">ATTY. NBI DIRECTOR</div>
                <div style="font-size:5px;color:#555;text-transform:uppercase;">Director</div>
            </td>
        </tr>
    </table>

</div>

</body>
</html>