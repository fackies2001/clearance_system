{{-- resources/views/pdf/clearance.blade.php --}}
{{-- Faithfully replicates ClearanceViewer.jsx layout using DomPDF-compatible tables --}}
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <title>NBI Clearance - {{ $clearance->clearance_number }}</title>
    <style>
        @page { size: A4 portrait; margin: 10mm 12mm; }
        * { margin: 0; padding: 0; box-sizing: border-box; }
        body { background: #fff; color: #000; font-family: Arial, sans-serif; font-size: 10px; }

        /* ─── Card wrapper ─── */
        .card {
            width: 100%;
            padding: 14px 18px;
            position: relative;
            overflow: hidden;
        }

        /* ─── Dashed separator ─── */
        .separator {
            border-top: 2px dashed #999;
            margin: 0;
        }

        /* ─── Header ─── */
        .hdr-table { width: 100%; border-collapse: collapse; }
        .hdr-logo {
            width: 44px;
            vertical-align: middle;
            text-align: center;
            padding: 0;
        }
        .hdr-center {
            text-align: center;
            vertical-align: middle;
            padding: 0 12px;
        }
        .hdr-border {
            border-bottom: 2px solid #1a3a6b;
            padding-bottom: 6px;
            margin-bottom: 5px;
        }

        /* ─── Label / Value (matches JSX Label + Val components) ─── */
        .lbl {
            font-size: 7px;
            font-weight: 700;
            text-transform: uppercase;
            color: #555;
            letter-spacing: 0.5px;
            margin-bottom: 1px;
        }
        .val {
            font-size: 11px;
            font-weight: 700;
            text-transform: uppercase;
            color: #000;
            border-bottom: 0.5px solid #999;
            padding-bottom: 2px;
            margin-bottom: 5px;
        }
        .val-sm { font-size: 10px; }
        .val-lg { font-size: 14px; font-weight: 900; }

        /* ─── Remarks ─── */
        .rmk {
            border: 1.5px solid #000;
            padding: 4px 8px;
            margin-top: 2px;
            margin-bottom: 8px;
        }
        .rmk-val { font-size: 12px; font-weight: 900; text-transform: uppercase; }

        /* ─── Right column ─── */
        .badge {
            background: #1a3a6b;
            color: #fff;
            font-size: 8px;
            font-weight: 900;
            padding: 2px 6px;
            letter-spacing: 1px;
            text-align: center;
            margin-bottom: 5px;
        }
        .photo-box {
            width: 85px;
            height: 105px;
            border: 1.5px solid #555;
            background: #eee;
            overflow: hidden;
            text-align: center;
            margin: 0 auto 5px auto;
        }
        .photo-box img {
            width: 85px;
            height: 105px;
            object-fit: cover;
        }
        .sig-box {
            width: 85px;
            height: 28px;
            border: 0.5px solid #999;
            text-align: center;
            font-size: 6.5px;
            color: #888;
            line-height: 28px;
            text-transform: uppercase;
            margin: 0 auto 5px auto;
        }
        .qr-area {
            text-align: center;
            margin: 0 auto 5px auto;
        }

        /* ─── Transaction table ─── */
        .tx { width: 100%; border-collapse: collapse; font-size: 6px; }
        .tx td { padding: 1px 3px; border: 0.5px solid #ccc; }
        .tx-l { color: #555; font-weight: 700; }

        /* ─── Personal Copy watermark ─── */
        .stamp {
            position: absolute;
            top: 35%;
            left: 25%;
            font-size: 30px;
            font-weight: 900;
            color: rgba(220, 50, 50, 0.14);
            border: 3.5px solid rgba(220, 50, 50, 0.14);
            padding: 4px 12px;
            text-transform: uppercase;
            letter-spacing: 2px;
            transform: rotate(-22deg);
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

{{-- ══════════════════════════════════════ --}}
{{-- ORIGINAL COPY --}}
{{-- ══════════════════════════════════════ --}}
<div class="card">

    {{-- Header --}}
    <div class="hdr-border">
        <table class="hdr-table">
            <tr>
                <td class="hdr-logo">
                    <div style="width:44px;height:44px;border:1px solid #ccc;text-align:center;font-size:5.5px;color:#888;line-height:1.2;padding-top:10px;font-weight:700;">
                        BAGONG<br>PILIPINAS
                    </div>
                </td>
                <td class="hdr-center">
                    <div style="font-size:6px;font-weight:700;color:#1a3a6b;letter-spacing:2px;text-transform:uppercase;">BAGONG PILIPINAS</div>
                    <div style="font-size:12px;font-weight:900;text-transform:uppercase;">REPUBLIC OF THE PHILIPPINES</div>
                    <div style="font-size:10px;font-weight:700;text-transform:uppercase;">DEPARTMENT OF JUSTICE</div>
                    <div style="font-size:15px;font-weight:900;text-transform:uppercase;color:#1a3a6b;letter-spacing:1px;">NATIONAL BUREAU OF INVESTIGATION</div>
                </td>
                <td class="hdr-logo">
                    <div style="width:44px;height:44px;border:1px solid #1a3a6b;text-align:center;font-size:10px;color:#1a3a6b;font-weight:900;line-height:44px;">
                        NBI
                    </div>
                </td>
            </tr>
        </table>
    </div>

    <div style="font-size:7px;text-align:center;color:#444;margin-bottom:8px;font-style:italic;">
        This is to certify that the person whose name, picture, signature and thumbprint appearing herein applied for NBI Clearance and the results is as follows:
    </div>

    {{-- Body: 2-column layout --}}
    <table style="width:100%;border-collapse:collapse;">
        <tr>
            {{-- LEFT COLUMN --}}
            <td style="vertical-align:top;padding-right:10px;">

                {{-- NBI ID + Valid Until --}}
                <table style="width:100%;border-collapse:collapse;"><tr>
                    <td style="width:50%;padding-right:6px;">
                        <div class="lbl">NBI ID No.</div>
                        <div class="val val-sm">{{ $clearance->clearance_number }}</div>
                    </td>
                    <td style="width:50%;">
                        <div class="lbl">Valid Until</div>
                        <div class="val val-sm">{{ strtoupper($validUntil) }}</div>
                    </td>
                </tr></table>

                {{-- Name --}}
                <table style="width:100%;border-collapse:collapse;"><tr>
                    <td style="width:33%;padding-right:6px;">
                        <div class="lbl">Family Name</div>
                        <div class="val val-lg">{{ strtoupper($clearance->last_name) }}</div>
                    </td>
                    <td style="width:33%;padding-right:6px;">
                        <div class="lbl">First Name</div>
                        <div class="val val-lg">{{ strtoupper($clearance->first_name) }}</div>
                    </td>
                    <td style="width:34%;">
                        <div class="lbl">Middle Name</div>
                        <div class="val val-lg">{{ strtoupper($clearance->middle_name ?? 'N/A') }}</div>
                    </td>
                </tr></table>

                {{-- Address --}}
                <div class="lbl">Address</div>
                <div class="val val-sm">{{ $address }}</div>

                {{-- DOB + POB --}}
                <table style="width:100%;border-collapse:collapse;"><tr>
                    <td style="width:50%;padding-right:6px;">
                        <div class="lbl">Date of Birth</div>
                        <div class="val">{{ $dob }}</div>
                    </td>
                    <td style="width:50%;">
                        <div class="lbl">Place of Birth</div>
                        <div class="val">{{ strtoupper($clearance->place_of_birth) }}</div>
                    </td>
                </tr></table>

                {{-- Citizenship + Civil Status + Gender --}}
                <table style="width:100%;border-collapse:collapse;"><tr>
                    <td style="width:33%;padding-right:6px;">
                        <div class="lbl">Citizenship</div>
                        <div class="val">{{ strtoupper($clearance->nationality) }}</div>
                    </td>
                    <td style="width:33%;padding-right:6px;">
                        <div class="lbl">Civil Status</div>
                        <div class="val">{{ strtoupper($clearance->civil_status) }}</div>
                    </td>
                    <td style="width:34%;">
                        <div class="lbl">Gender</div>
                        <div class="val">{{ strtoupper($clearance->sex) }}</div>
                    </td>
                </tr></table>

                {{-- Purpose --}}
                <div class="lbl">Purpose</div>
                <div class="val">{{ strtoupper($clearance->purpose) }}</div>

                {{-- Remarks --}}
                <div class="rmk">
                    <div class="lbl">Remarks</div>
                    <div class="rmk-val">{{ $remarks }}</div>
                </div>

                {{-- Barcode + Director --}}
                <table style="width:100%;border-collapse:collapse;"><tr>
                    <td style="width:55%;vertical-align:bottom;">
                        @if(isset($barcodeBase64) && $barcodeBase64)
                            <img src="{{ $barcodeBase64 }}" style="width:100%;max-width:200px;height:32px;" />
                        @endif
                        <div style="font-size:7px;font-family:monospace;text-align:center;margin-top:1px;">{{ $clearance->clearance_number }}</div>
                    </td>
                    <td style="width:45%;text-align:center;vertical-align:bottom;">
                        <div style="border-top:1px solid #000;width:110px;margin:0 auto 2px auto;"></div>
                        <div style="font-size:7.5px;font-weight:900;text-transform:uppercase;">ATTY. NBI DIRECTOR</div>
                        <div style="font-size:6.5px;color:#555;text-transform:uppercase;">Director</div>
                    </td>
                </tr></table>

            </td>

            {{-- RIGHT COLUMN (width: 95px, matching JSX) --}}
            <td style="width:95px;vertical-align:top;text-align:center;">

                <div class="badge">{{ $badgeId }}</div>

                <div class="photo-box">
                    @if(isset($photoBase64) && $photoBase64)
                        <img src="{{ $photoBase64 }}" />
                    @else
                        <div style="font-size:7px;color:#aaa;padding-top:45px;">NO PHOTO</div>
                    @endif
                </div>

                <div class="sig-box">SIGNATURE</div>

                <div class="qr-area">
                    @if(isset($qrCodeBase64) && $qrCodeBase64)
                        <img src="{{ $qrCodeBase64 }}" style="width:75px;height:75px;" />
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
<div class="separator"></div>

{{-- ══════════════════════════════════════ --}}
{{-- PERSONAL COPY --}}
{{-- ══════════════════════════════════════ --}}
<div class="card">

    <div class="stamp">PERSONAL COPY</div>

    {{-- Header --}}
    <div class="hdr-border">
        <table class="hdr-table">
            <tr>
                <td class="hdr-logo">
                    <div style="width:44px;height:44px;border:1px solid #ccc;text-align:center;font-size:5.5px;color:#888;line-height:1.2;padding-top:10px;font-weight:700;">
                        BAGONG<br>PILIPINAS
                    </div>
                </td>
                <td class="hdr-center">
                    <div style="font-size:6px;font-weight:700;color:#1a3a6b;letter-spacing:2px;text-transform:uppercase;">BAGONG PILIPINAS</div>
                    <div style="font-size:12px;font-weight:900;text-transform:uppercase;">REPUBLIC OF THE PHILIPPINES</div>
                    <div style="font-size:10px;font-weight:700;text-transform:uppercase;">DEPARTMENT OF JUSTICE</div>
                    <div style="font-size:15px;font-weight:900;text-transform:uppercase;color:#1a3a6b;letter-spacing:1px;">NATIONAL BUREAU OF INVESTIGATION</div>
                </td>
                <td class="hdr-logo">
                    <div style="width:44px;height:44px;border:1px solid #1a3a6b;text-align:center;font-size:10px;color:#1a3a6b;font-weight:900;line-height:44px;">
                        NBI
                    </div>
                </td>
            </tr>
        </table>
    </div>

    <div style="font-size:7px;text-align:center;color:#444;margin-bottom:8px;font-style:italic;">
        This is to certify that the person whose name, picture, signature and thumbprint appearing herein applied for NBI Clearance and the results is as follows:
    </div>

    {{-- Body --}}
    <table style="width:100%;border-collapse:collapse;">
        <tr>
            {{-- LEFT COLUMN --}}
            <td style="vertical-align:top;padding-right:10px;">

                <table style="width:100%;border-collapse:collapse;"><tr>
                    <td style="width:50%;padding-right:6px;">
                        <div class="lbl">NBI ID No.</div>
                        <div class="val val-sm">{{ $clearance->clearance_number }}</div>
                    </td>
                    <td style="width:50%;">
                        <div class="lbl">Valid Until</div>
                        <div class="val val-sm">{{ strtoupper($validUntil) }}</div>
                    </td>
                </tr></table>

                <table style="width:100%;border-collapse:collapse;"><tr>
                    <td style="width:33%;padding-right:6px;">
                        <div class="lbl">Family Name</div>
                        <div class="val val-lg">{{ strtoupper($clearance->last_name) }}</div>
                    </td>
                    <td style="width:33%;padding-right:6px;">
                        <div class="lbl">First Name</div>
                        <div class="val val-lg">{{ strtoupper($clearance->first_name) }}</div>
                    </td>
                    <td style="width:34%;">
                        <div class="lbl">Middle Name</div>
                        <div class="val val-lg">{{ strtoupper($clearance->middle_name ?? 'N/A') }}</div>
                    </td>
                </tr></table>

                <div class="lbl">Address</div>
                <div class="val val-sm">{{ $address }}</div>

                <table style="width:100%;border-collapse:collapse;"><tr>
                    <td style="width:50%;padding-right:6px;">
                        <div class="lbl">Date of Birth</div>
                        <div class="val">{{ $dob }}</div>
                    </td>
                    <td style="width:50%;">
                        <div class="lbl">Place of Birth</div>
                        <div class="val">{{ strtoupper($clearance->place_of_birth) }}</div>
                    </td>
                </tr></table>

                <table style="width:100%;border-collapse:collapse;"><tr>
                    <td style="width:33%;padding-right:6px;">
                        <div class="lbl">Citizenship</div>
                        <div class="val">{{ strtoupper($clearance->nationality) }}</div>
                    </td>
                    <td style="width:33%;padding-right:6px;">
                        <div class="lbl">Civil Status</div>
                        <div class="val">{{ strtoupper($clearance->civil_status) }}</div>
                    </td>
                    <td style="width:34%;">
                        <div class="lbl">Gender</div>
                        <div class="val">{{ strtoupper($clearance->sex) }}</div>
                    </td>
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
                            <img src="{{ $barcodeBase64 }}" style="width:100%;max-width:200px;height:32px;" />
                        @endif
                        <div style="font-size:7px;font-family:monospace;text-align:center;margin-top:1px;">{{ $clearance->clearance_number }}</div>
                    </td>
                    <td style="width:45%;text-align:center;vertical-align:bottom;">
                        <div style="border-top:1px solid #000;width:110px;margin:0 auto 2px auto;"></div>
                        <div style="font-size:7.5px;font-weight:900;text-transform:uppercase;">ATTY. NBI DIRECTOR</div>
                        <div style="font-size:6.5px;color:#555;text-transform:uppercase;">Director</div>
                    </td>
                </tr></table>

            </td>

            {{-- RIGHT COLUMN --}}
            <td style="width:95px;vertical-align:top;text-align:center;">

                <div class="badge">{{ $badgeId }}</div>

                <div class="photo-box">
                    @if(isset($photoBase64) && $photoBase64)
                        <img src="{{ $photoBase64 }}" />
                    @else
                        <div style="font-size:7px;color:#aaa;padding-top:45px;">NO PHOTO</div>
                    @endif
                </div>

                <div class="sig-box">SIGNATURE</div>

                <div class="qr-area">
                    @if(isset($qrCodeBase64) && $qrCodeBase64)
                        <img src="{{ $qrCodeBase64 }}" style="width:75px;height:75px;" />
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