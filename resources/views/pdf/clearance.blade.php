<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <title>NBI Clearance - {{ $clearance->clearance_number }}</title>
    <style>
        @page {
            size: A4 portrait;
            margin: 8mm 15mm;
        }
        * {
            margin: 0;
            padding: 0;
            box-sizing: border-box;
            font-family: Arial, Helvetica, sans-serif;
        }
        body {
            background: #ffffff;
            color: #000000;
            font-size: 8px;
        }

        /* ─── Copy Container (Zero horizontal padding to avoid right margin overflow) ─── */
        .clearance-copy {
            width: 100%;
            height: 382px;
            padding: 4px 0;
            position: relative;
            background: #ffffff;
            overflow: hidden;
        }

        /* ─── Background Watermark Pattern ─── */
        .watermark-bg {
            position: absolute;
            top: 0;
            left: 0;
            right: 0;
            bottom: 0;
            z-index: 0;
            opacity: 0.035;
            overflow: hidden;
            font-size: 8px;
            font-weight: 900;
            color: #1a3a6b;
            text-transform: uppercase;
            line-height: 1.6;
            letter-spacing: 0.5px;
            word-spacing: 2px;
        }

        /* ─── Content Layer ─── */
        .content-layer {
            position: relative;
            z-index: 1;
        }

        /* ─── Header: Logos Clustered with Title ─── */
        .header-wrap {
            width: 100%;
            border-bottom: 2px solid #1a3a6b;
            padding-bottom: 4px;
            margin-bottom: 4px;
        }
        .header-table {
            margin: 0 auto;
            border-collapse: collapse;
        }
        .header-table td {
            vertical-align: middle;
        }
        .logo-box {
            width: 38px;
            height: 38px;
            border: 1px solid #cccccc;
            font-size: 5px;
            color: #888888;
            font-weight: bold;
            text-align: center;
            line-height: 1.1;
            padding-top: 8px;
        }
        .nbi-box {
            width: 38px;
            height: 38px;
            border: 1.5px solid #1a3a6b;
            font-size: 10px;
            color: #1a3a6b;
            font-weight: 900;
            text-align: center;
            line-height: 35px;
        }
        .header-center-text {
            text-align: center;
            padding: 0 14px;
        }
        .h-sub {
            font-size: 5.5px;
            font-weight: bold;
            color: #1a3a6b;
            letter-spacing: 2px;
            text-transform: uppercase;
        }
        .h-rep {
            font-size: 10.5px;
            font-weight: 900;
            text-transform: uppercase;
            line-height: 1.2;
        }
        .h-doj {
            font-size: 8.5px;
            font-weight: bold;
            text-transform: uppercase;
            line-height: 1.2;
        }
        .h-nbi {
            font-size: 13px;
            font-weight: 900;
            color: #1a3a6b;
            letter-spacing: 0.8px;
            text-transform: uppercase;
            line-height: 1.2;
        }

        .cert-statement {
            font-size: 6px;
            text-align: center;
            color: #444444;
            font-style: italic;
            margin-bottom: 5px;
        }

        /* ─── Main 2-Column Grid (table-layout fixed to prevent column overflow) ─── */
        .main-grid {
            width: 100%;
            border-collapse: collapse;
        }
        .col-left {
            vertical-align: top;
            padding-right: 8px;
        }
        .col-right {
            width: 86px;
            vertical-align: top;
            text-align: center;
        }

        /* ─── Fields ─── */
        .field-table {
            width: 100%;
            border-collapse: collapse;
        }
        .lbl {
            font-size: 6px;
            font-weight: bold;
            color: #555555;
            text-transform: uppercase;
            letter-spacing: 0.3px;
            margin-bottom: 1px;
        }
        .val {
            font-size: 9px;
            font-weight: bold;
            color: #000000;
            text-transform: uppercase;
            border-bottom: 0.5px solid #888888;
            padding-bottom: 1px;
            margin-bottom: 4px;
        }
        .val-id {
            font-size: 8.5px;
            font-weight: bold;
            color: #000000;
        }
        .val-lg {
            font-size: 12px;
            font-weight: 900;
        }

        /* ─── Remarks ─── */
        .remarks-box {
            border: 1.5px solid #000000;
            padding: 3px 6px;
            margin-top: 2px;
            margin-bottom: 6px;
        }
        .remarks-lbl {
            font-size: 6px;
            font-weight: bold;
            color: #555555;
            text-transform: uppercase;
        }
        .remarks-val {
            font-size: 10.5px;
            font-weight: 900;
            text-transform: uppercase;
            color: #000000;
        }

        /* ─── Bottom Row: Barcode + Director Signature Line ─── */
        .bottom-row {
            width: 100%;
            border-collapse: collapse;
        }
        .bottom-row td {
            vertical-align: bottom;
        }

        /* ─── Right Column Components ─── */
        .badge-id {
            background: #1a3a6b;
            color: #ffffff;
            font-size: 7.5px;
            font-weight: 900;
            text-align: center;
            padding: 2px 0;
            letter-spacing: 0.8px;
            width: 86px;
            margin: 0 auto 3px auto;
        }
        .photo-frame {
            width: 82px;
            height: 96px;
            border: 1.5px solid #555555;
            background: #f1f5f9;
            text-align: center;
            margin: 0 auto 3px auto;
            overflow: hidden;
        }
        .photo-frame img {
            width: 82px;
            height: 96px;
            display: block;
        }
        .sig-frame {
            width: 82px;
            height: 22px;
            border: 0.5px solid #999999;
            text-align: center;
            font-size: 5.5px;
            color: #888888;
            line-height: 22px;
            text-transform: uppercase;
            margin: 0 auto 3px auto;
        }
        .qr-frame {
            width: 66px;
            height: 66px;
            margin: 0 auto 1px auto;
            text-align: center;
        }
        .qr-frame img {
            width: 66px;
            height: 66px;
        }
        .qr-subtext {
            font-size: 5.5px;
            color: #888888;
            text-transform: uppercase;
            text-align: center;
            margin-bottom: 3px;
        }

        /* ─── Transaction Table ─── */
        .tx-table {
            width: 86px;
            border-collapse: collapse;
            font-size: 5.5px;
            margin: 0 auto;
        }
        .tx-table td {
            border: 0.5px solid #cccccc;
            padding: 1px 2px;
        }
        .tx-label {
            font-weight: bold;
            color: #555555;
            text-transform: uppercase;
            white-space: nowrap;
        }

        /* ─── Dashed Cut Line ─── */
        .cut-line {
            border-top: 1.5px dashed #888888;
            margin: 4px 0;
        }

        /* ─── Personal Copy Watermark ─── */
        .personal-stamp {
            position: absolute;
            top: 125px;
            left: 110px;
            font-size: 32px;
            font-weight: 900;
            color: rgba(220, 50, 50, 0.18);
            border: 3.5px solid rgba(220, 50, 50, 0.18);
            padding: 3px 12px;
            text-transform: uppercase;
            letter-spacing: 2px;
            transform: rotate(-25deg);
            z-index: 5;
            font-family: Arial, Helvetica, sans-serif;
        }
    </style>
</head>
<body>

@php
    $validUntil = $clearance->released_at
        ? \Carbon\Carbon::parse($clearance->released_at)->addYear()->format('F d, Y')
        : '—';
    $dob = $clearance->date_of_birth
        ? strtoupper(\Carbon\Carbon::parse($clearance->date_of_birth)->format('F d, Y'))
        : '—';
    $dateIssued = $clearance->released_at
        ? \Carbon\Carbon::parse($clearance->released_at)->format('F d, Y')
        : '—';
    $fullAddress = strtoupper(implode(', ', array_filter([
        $clearance->present_street,
        'BRGY ' . $clearance->present_barangay,
        $clearance->present_city,
        $clearance->present_province
    ])));
    $remarks = ($clearance->status === 'CLEARED') ? 'NO DEROGATORY RECORD' : 'WITH DEROGATORY RECORD';
    $badgeId = 'A--' . substr($clearance->clearance_number, -6);
@endphp

{{-- ════════════════════════════════════════════════════════════════════ --}}
{{-- 1. ORIGINAL COPY (TOP) --}}
{{-- ════════════════════════════════════════════════════════════════════ --}}
<div class="clearance-copy">

    {{-- Background Watermark Text Pattern --}}
    <div class="watermark-bg">
        @for($i = 0; $i < 35; $i++)
            NATIONAL BUREAU OF INVESTIGATION &bull; NATIONAL BUREAU OF INVESTIGATION &bull; NATIONAL BUREAU OF INVESTIGATION &bull; NATIONAL BUREAU OF INVESTIGATION<br>
        @endfor
    </div>

    <div class="content-layer">

        {{-- Header: Logos + Centered Text --}}
        <div class="header-wrap">
            <table class="header-table">
                <tr>
                    <td><div class="logo-box">BAGONG<br>PILIPINAS</div></td>
                    <td class="header-center-text">
                        <div class="h-sub">Bagong Pilipinas</div>
                        <div class="h-rep">Republic of the Philippines</div>
                        <div class="h-doj">Department of Justice</div>
                        <div class="h-nbi">National Bureau of Investigation</div>
                    </td>
                    <td><div class="nbi-box">NBI</div></td>
                </tr>
            </table>
        </div>

        <div class="cert-statement">
            This is to certify that the person whose name, picture, signature and thumbprint appearing herein applied for NBI Clearance and the results is as follows:
        </div>

        {{-- Main 2-Column Body --}}
        <table class="main-grid">
            <tr>
                {{-- Left Column: Data Fields --}}
                <td class="col-left">

                    {{-- Row 1: NBI ID No. & Valid Until --}}
                    <table class="field-table">
                        <tr>
                            <td style="width: 50%; padding-right: 6px;">
                                <div class="lbl">NBI ID No.</div>
                                <div class="val val-id">{{ $clearance->clearance_number }}</div>
                            </td>
                            <td style="width: 50%;">
                                <div class="lbl">Valid Until</div>
                                <div class="val val-id">{{ strtoupper($validUntil) }}</div>
                            </td>
                        </tr>
                    </table>

                    {{-- Row 2: Family Name, First Name, Middle Name --}}
                    <table class="field-table">
                        <tr>
                            <td style="width: 35%; padding-right: 5px;">
                                <div class="lbl">Family Name</div>
                                <div class="val val-lg">{{ strtoupper($clearance->last_name) }}</div>
                            </td>
                            <td style="width: 35%; padding-right: 5px;">
                                <div class="lbl">First Name</div>
                                <div class="val val-lg">{{ strtoupper($clearance->first_name) }}</div>
                            </td>
                            <td style="width: 30%;">
                                <div class="lbl">Middle Name</div>
                                <div class="val val-lg">{{ strtoupper($clearance->middle_name ?? 'N/A') }}</div>
                            </td>
                        </tr>
                    </table>

                    {{-- Row 3: Address --}}
                    <div class="lbl">Address</div>
                    <div class="val" style="font-size: 8px;">{{ $fullAddress }}</div>

                    {{-- Row 4: Date of Birth & Place of Birth --}}
                    <table class="field-table">
                        <tr>
                            <td style="width: 50%; padding-right: 6px;">
                                <div class="lbl">Date of Birth</div>
                                <div class="val">{{ $dob }}</div>
                            </td>
                            <td style="width: 50%;">
                                <div class="lbl">Place of Birth</div>
                                <div class="val">{{ strtoupper($clearance->place_of_birth) }}</div>
                            </td>
                        </tr>
                    </table>

                    {{-- Row 5: Citizenship, Civil Status, Gender --}}
                    <table class="field-table">
                        <tr>
                            <td style="width: 33%; padding-right: 4px;">
                                <div class="lbl">Citizenship</div>
                                <div class="val">{{ strtoupper($clearance->nationality) }}</div>
                            </td>
                            <td style="width: 33%; padding-right: 4px;">
                                <div class="lbl">Civil Status</div>
                                <div class="val">{{ strtoupper($clearance->civil_status) }}</div>
                            </td>
                            <td style="width: 34%;">
                                <div class="lbl">Gender</div>
                                <div class="val">{{ strtoupper($clearance->sex) }}</div>
                            </td>
                        </tr>
                    </table>

                    {{-- Row 6: Purpose --}}
                    <div class="lbl">Purpose</div>
                    <div class="val">{{ strtoupper($clearance->purpose) }}</div>

                    {{-- Remarks Box --}}
                    <div class="remarks-box">
                        <div class="remarks-lbl">Remarks</div>
                        <div class="remarks-val">{{ $remarks }}</div>
                    </div>

                    {{-- Bottom: Barcode + Director Signature Line --}}
                    <table class="bottom-row">
                        <tr>
                            <td style="width: 55%; vertical-align: bottom;">
                                @if(isset($barcodeBase64) && $barcodeBase64)
                                    <img src="{{ $barcodeBase64 }}" style="width: 175px; height: 26px;" />
                                @endif
                                <div style="font-size: 6px; font-family: monospace; margin-top: 1px; font-weight: bold;">
                                    {{ $clearance->clearance_number }}
                                </div>
                            </td>
                            <td style="width: 45%; text-align: center; vertical-align: bottom;">
                                <div style="border-top: 1px solid #000000; width: 95px; margin: 0 auto 2px auto;"></div>
                                <div style="font-size: 6.5px; font-weight: 900; text-transform: uppercase;">ATTY. NBI DIRECTOR</div>
                                <div style="font-size: 5px; color: #555555; text-transform: uppercase;">Director</div>
                            </td>
                        </tr>
                    </table>

                </td>

                {{-- Right Column: Badge, Photo, Signature, QR, Transaction Table --}}
                <td class="col-right">

                    <div class="badge-id">{{ $badgeId }}</div>

                    <div class="photo-frame">
                        @if(isset($photoBase64) && $photoBase64)
                            <img src="{{ $photoBase64 }}" />
                        @else
                            <div style="font-size: 6px; color: #aaaaaa; line-height: 96px;">NO PHOTO</div>
                        @endif
                    </div>

                    <div class="sig-frame">Signature</div>

                    <div class="qr-frame">
                        @if(isset($qrCodeBase64) && $qrCodeBase64)
                            <img src="{{ $qrCodeBase64 }}" />
                        @endif
                    </div>
                    <div class="qr-subtext">Scan QR to verify</div>

                    <table class="tx-table">
                        <tr><td class="tx-label">Date</td><td>{{ $dateIssued }}</td></tr>
                        <tr><td class="tx-label">Agency</td><td>NBI</td></tr>
                        <tr><td class="tx-label">O.R. No.</td><td>{{ $clearance->payment_reference ?? 'N/A' }}</td></tr>
                        <tr><td class="tx-label">DST PAID</td><td>{{ $clearance->payment_amount ? 'Php '.$clearance->payment_amount : 'N/A' }}</td></tr>
                    </table>

                </td>
            </tr>
        </table>

    </div>

</div>

{{-- Cut Line Separator --}}
<div class="cut-line"></div>

{{-- ════════════════════════════════════════════════════════════════════ --}}
{{-- 2. PERSONAL COPY (BOTTOM) --}}
{{-- ════════════════════════════════════════════════════════════════════ --}}
<div class="clearance-copy">

    {{-- Background Watermark Text Pattern --}}
    <div class="watermark-bg">
        @for($i = 0; $i < 35; $i++)
            NATIONAL BUREAU OF INVESTIGATION &bull; NATIONAL BUREAU OF INVESTIGATION &bull; NATIONAL BUREAU OF INVESTIGATION &bull; NATIONAL BUREAU OF INVESTIGATION<br>
        @endfor
    </div>

    {{-- Personal Copy Diagonal Stamp --}}
    <div class="personal-stamp">PERSONAL COPY</div>

    <div class="content-layer">

        {{-- Header: Logos + Centered Text --}}
        <div class="header-wrap">
            <table class="header-table">
                <tr>
                    <td><div class="logo-box">BAGONG<br>PILIPINAS</div></td>
                    <td class="header-center-text">
                        <div class="h-sub">Bagong Pilipinas</div>
                        <div class="h-rep">Republic of the Philippines</div>
                        <div class="h-doj">Department of Justice</div>
                        <div class="h-nbi">National Bureau of Investigation</div>
                    </td>
                    <td><div class="nbi-box">NBI</div></td>
                </tr>
            </table>
        </div>

        <div class="cert-statement">
            This is to certify that the person whose name, picture, signature and thumbprint appearing herein applied for NBI Clearance and the results is as follows:
        </div>

        {{-- Main 2-Column Body --}}
        <table class="main-grid">
            <tr>
                {{-- Left Column: Data Fields --}}
                <td class="col-left">

                    {{-- Row 1: NBI ID No. & Valid Until --}}
                    <table class="field-table">
                        <tr>
                            <td style="width: 50%; padding-right: 6px;">
                                <div class="lbl">NBI ID No.</div>
                                <div class="val val-id">{{ $clearance->clearance_number }}</div>
                            </td>
                            <td style="width: 50%;">
                                <div class="lbl">Valid Until</div>
                                <div class="val val-id">{{ strtoupper($validUntil) }}</div>
                            </td>
                        </tr>
                    </table>

                    {{-- Row 2: Family Name, First Name, Middle Name --}}
                    <table class="field-table">
                        <tr>
                            <td style="width: 35%; padding-right: 5px;">
                                <div class="lbl">Family Name</div>
                                <div class="val val-lg">{{ strtoupper($clearance->last_name) }}</div>
                            </td>
                            <td style="width: 35%; padding-right: 5px;">
                                <div class="lbl">First Name</div>
                                <div class="val val-lg">{{ strtoupper($clearance->first_name) }}</div>
                            </td>
                            <td style="width: 30%;">
                                <div class="lbl">Middle Name</div>
                                <div class="val val-lg">{{ strtoupper($clearance->middle_name ?? 'N/A') }}</div>
                            </td>
                        </tr>
                    </table>

                    {{-- Row 3: Address --}}
                    <div class="lbl">Address</div>
                    <div class="val" style="font-size: 8px;">{{ $fullAddress }}</div>

                    {{-- Row 4: Date of Birth & Place of Birth --}}
                    <table class="field-table">
                        <tr>
                            <td style="width: 50%; padding-right: 6px;">
                                <div class="lbl">Date of Birth</div>
                                <div class="val">{{ $dob }}</div>
                            </td>
                            <td style="width: 50%;">
                                <div class="lbl">Place of Birth</div>
                                <div class="val">{{ strtoupper($clearance->place_of_birth) }}</div>
                            </td>
                        </tr>
                    </table>

                    {{-- Row 5: Citizenship, Civil Status, Gender --}}
                    <table class="field-table">
                        <tr>
                            <td style="width: 33%; padding-right: 4px;">
                                <div class="lbl">Citizenship</div>
                                <div class="val">{{ strtoupper($clearance->nationality) }}</div>
                            </td>
                            <td style="width: 33%; padding-right: 4px;">
                                <div class="lbl">Civil Status</div>
                                <div class="val">{{ strtoupper($clearance->civil_status) }}</div>
                            </td>
                            <td style="width: 34%;">
                                <div class="lbl">Gender</div>
                                <div class="val">{{ strtoupper($clearance->sex) }}</div>
                            </td>
                        </tr>
                    </table>

                    {{-- Row 6: Purpose --}}
                    <div class="lbl">Purpose</div>
                    <div class="val">{{ strtoupper($clearance->purpose) }}</div>

                    {{-- Remarks Box --}}
                    <div class="remarks-box">
                        <div class="remarks-lbl">Remarks</div>
                        <div class="remarks-val">{{ $remarks }}</div>
                    </div>

                    {{-- Bottom: Barcode + Director Signature Line --}}
                    <table class="bottom-row">
                        <tr>
                            <td style="width: 55%; vertical-align: bottom;">
                                @if(isset($barcodeBase64) && $barcodeBase64)
                                    <img src="{{ $barcodeBase64 }}" style="width: 175px; height: 26px;" />
                                @endif
                                <div style="font-size: 6px; font-family: monospace; margin-top: 1px; font-weight: bold;">
                                    {{ $clearance->clearance_number }}
                                </div>
                            </td>
                            <td style="width: 45%; text-align: center; vertical-align: bottom;">
                                <div style="border-top: 1px solid #000000; width: 95px; margin: 0 auto 2px auto;"></div>
                                <div style="font-size: 6.5px; font-weight: 900; text-transform: uppercase;">ATTY. NBI DIRECTOR</div>
                                <div style="font-size: 5px; color: #555555; text-transform: uppercase;">Director</div>
                            </td>
                        </tr>
                    </table>

                </td>

                {{-- Right Column: Badge, Photo, Signature, QR, Transaction Table --}}
                <td class="col-right">

                    <div class="badge-id">{{ $badgeId }}</div>

                    <div class="photo-frame">
                        @if(isset($photoBase64) && $photoBase64)
                            <img src="{{ $photoBase64 }}" />
                        @else
                            <div style="font-size: 6px; color: #aaaaaa; line-height: 96px;">NO PHOTO</div>
                        @endif
                    </div>

                    <div class="sig-frame">Signature</div>

                    <div class="qr-frame">
                        @if(isset($qrCodeBase64) && $qrCodeBase64)
                            <img src="{{ $qrCodeBase64 }}" />
                        @endif
                    </div>
                    <div class="qr-subtext">Scan QR to verify</div>

                    <table class="tx-table">
                        <tr><td class="tx-label">Date</td><td>{{ $dateIssued }}</td></tr>
                        <tr><td class="tx-label">Agency</td><td>NBI</td></tr>
                        <tr><td class="tx-label">O.R. No.</td><td>{{ $clearance->payment_reference ?? 'N/A' }}</td></tr>
                        <tr><td class="tx-label">DST PAID</td><td>{{ $clearance->payment_amount ? 'Php '.$clearance->payment_amount : 'N/A' }}</td></tr>
                    </table>

                </td>
            </tr>
        </table>

    </div>

</div>

</body>
</html>