<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <title>NBI Clearance - {{ $clearance->clearance_number }}</title>
    <style>
        @page {
            size: A4 portrait;
            margin: 8mm 10mm;
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
            font-size: 9px;
        }

        /* ─── Card Container ─── */
        .clearance-card {
            width: 100%;
            border: 1.5px solid #1a3a6b;
            padding: 8px 12px;
            position: relative;
            background: #ffffff;
            overflow: hidden;
        }

        /* ─── Cut Line ─── */
        .cut-line {
            border-top: 1.5px dashed #888888;
            margin: 8px 0;
            text-align: center;
            position: relative;
        }
        .cut-line-text {
            background: #ffffff;
            padding: 0 10px;
            font-size: 7px;
            color: #777777;
            position: relative;
            top: -6px;
            text-transform: uppercase;
            font-weight: bold;
            letter-spacing: 0.5px;
        }

        /* ─── Header ─── */
        .header-table {
            width: 100%;
            border-collapse: collapse;
            margin-bottom: 2px;
        }
        .header-border {
            height: 3px;
            background: linear-gradient(to right, #1a3a6b, #2563eb, #1a3a6b);
            margin-bottom: 4px;
        }
        .logo-cell {
            width: 48px;
            text-align: center;
            vertical-align: middle;
            padding: 4px;
        }
        .logo-box {
            width: 40px;
            height: 40px;
            border: 1px solid #bbbbbb;
            font-size: 5px;
            color: #888888;
            font-weight: bold;
            text-align: center;
            line-height: 1.2;
            padding-top: 10px;
        }
        .nbi-logo-box {
            width: 40px;
            height: 40px;
            border: 1.5px solid #1a3a6b;
            font-size: 12px;
            color: #1a3a6b;
            font-weight: 900;
            text-align: center;
            line-height: 38px;
        }
        .header-center {
            text-align: center;
            vertical-align: middle;
            padding: 2px 8px;
        }
        .h-bagong { font-size: 6px; font-weight: bold; color: #1a3a6b; letter-spacing: 2px; text-transform: uppercase; }
        .h-republic { font-size: 11px; font-weight: 900; text-transform: uppercase; line-height: 1.3; }
        .h-doj { font-size: 8px; font-weight: bold; text-transform: uppercase; color: #333333; }
        .h-nbi { font-size: 14px; font-weight: 900; color: #1a3a6b; letter-spacing: 1.5px; text-transform: uppercase; line-height: 1.3; }

        .cert-text {
            font-size: 7px;
            text-align: center;
            color: #444444;
            font-style: italic;
            margin-bottom: 6px;
        }

        /* ─── Data Fields ─── */
        .lbl {
            font-size: 6px;
            font-weight: bold;
            color: #666666;
            text-transform: uppercase;
            letter-spacing: 0.3px;
            border-bottom: 0.5px solid #cccccc;
            padding-bottom: 1px;
            margin-bottom: 1px;
        }
        .val {
            font-size: 9px;
            font-weight: bold;
            color: #000000;
            text-transform: uppercase;
            padding-bottom: 4px;
        }
        .val-lg {
            font-size: 12px;
            font-weight: 900;
            color: #000000;
            text-transform: uppercase;
            padding-bottom: 4px;
        }
        .val-id {
            font-size: 9px;
            font-weight: bold;
            color: #1a3a6b;
            font-family: 'Courier New', monospace;
            padding-bottom: 4px;
        }

        /* ─── Remarks ─── */
        .rmk-box {
            border: 1.5px solid #000000;
            padding: 3px 8px;
            margin-top: 4px;
            margin-bottom: 6px;
        }
        .rmk-label { font-size: 6px; font-weight: bold; color: #666666; text-transform: uppercase; }
        .rmk-value { font-size: 11px; font-weight: 900; text-transform: uppercase; color: #000000; }

        /* ─── Right Column ─── */
        .badge {
            background: #1a3a6b;
            color: #ffffff;
            font-size: 8px;
            font-weight: 900;
            text-align: center;
            padding: 2px 4px;
            letter-spacing: 1px;
            margin-bottom: 3px;
        }
        .photo-box {
            width: 78px;
            height: 95px;
            border: 1px solid #555555;
            background: #f5f5f5;
            text-align: center;
            margin: 0 auto 3px auto;
            overflow: hidden;
        }
        .photo-box img {
            width: 78px;
            height: 95px;
            object-fit: cover;
            display: block;
        }
        .sig-box {
            width: 78px;
            height: 20px;
            border: 0.5px solid #aaaaaa;
            text-align: center;
            font-size: 5.5px;
            color: #888888;
            line-height: 20px;
            margin: 0 auto 3px auto;
            text-transform: uppercase;
        }

        /* ─── Transaction Table ─── */
        .tx-tbl {
            width: 100%;
            border-collapse: collapse;
            font-size: 5.5px;
            margin-top: 2px;
        }
        .tx-tbl td {
            border: 0.5px solid #cccccc;
            padding: 1px 2px;
        }
        .tx-lbl {
            font-weight: bold;
            color: #555555;
            text-transform: uppercase;
            white-space: nowrap;
        }

        /* ─── Personal Copy Stamp ─── */
        .personal-stamp {
            position: absolute;
            top: 85px;
            left: 120px;
            font-size: 26px;
            font-weight: 900;
            color: rgba(200, 30, 30, 0.10);
            border: 2.5px solid rgba(200, 30, 30, 0.10);
            padding: 3px 14px;
            transform: rotate(-15deg);
            text-transform: uppercase;
            letter-spacing: 3px;
            z-index: 5;
        }
    </style>
</head>
<body>

@php
    $validUntil = $clearance->released_at
        ? \Carbon\Carbon::parse($clearance->released_at)->addYear()->format('F d, Y')
        : 'N/A';
    $dob = $clearance->date_of_birth
        ? \Carbon\Carbon::parse($clearance->date_of_birth)->format('F d, Y')
        : 'N/A';
    $dateIssued = $clearance->released_at
        ? \Carbon\Carbon::parse($clearance->released_at)->format('F d, Y')
        : 'N/A';
    $fullAddress = strtoupper(implode(', ', array_filter([
        $clearance->present_street,
        'BRGY ' . $clearance->present_barangay,
        $clearance->present_city,
        $clearance->present_province
    ])));
    $remarks = ($clearance->status === 'CLEARED') ? 'NO DEROGATORY RECORD' : 'WITH DEROGATORY RECORD';
    $badgeId = 'A--' . substr($clearance->clearance_number, -6);
@endphp

{{-- ═══════════════════════════════════════════════ --}}
{{-- ORIGINAL COPY --}}
{{-- ═══════════════════════════════════════════════ --}}
<div class="clearance-card">

    {{-- Header --}}
    <table class="header-table">
        <tr>
            <td class="logo-cell"><div class="logo-box">BAGONG<br>PILIPINAS</div></td>
            <td class="header-center">
                <div class="h-bagong">Bagong Pilipinas</div>
                <div class="h-republic">Republic of the Philippines</div>
                <div class="h-doj">Department of Justice</div>
                <div class="h-nbi">National Bureau of Investigation</div>
            </td>
            <td class="logo-cell"><div class="nbi-logo-box">NBI</div></td>
        </tr>
    </table>
    <div class="header-border"></div>

    <div class="cert-text">
        This is to certify that the person whose name, picture, signature and thumbprint appearing herein applied for NBI Clearance and the results is as follows:
    </div>

    {{-- Body --}}
    <table style="width: 100%; border-collapse: collapse;">
        <tr>
            {{-- Left: Data Fields --}}
            <td style="vertical-align: top; padding-right: 8px;">

                {{-- NBI ID & Valid Until --}}
                <table style="width: 100%; border-collapse: collapse;">
                    <tr>
                        <td style="width: 50%; padding-right: 8px;">
                            <div class="lbl">NBI ID No.</div>
                            <div class="val-id">{{ $clearance->clearance_number }}</div>
                        </td>
                        <td style="width: 50%;">
                            <div class="lbl">Valid Until</div>
                            <div class="val">{{ strtoupper($validUntil) }}</div>
                        </td>
                    </tr>
                </table>

                {{-- Name --}}
                <table style="width: 100%; border-collapse: collapse;">
                    <tr>
                        <td style="width: 38%; padding-right: 6px;">
                            <div class="lbl">Family Name</div>
                            <div class="val-lg">{{ strtoupper($clearance->last_name) }}</div>
                        </td>
                        <td style="width: 38%; padding-right: 6px;">
                            <div class="lbl">First Name</div>
                            <div class="val-lg">{{ strtoupper($clearance->first_name) }}</div>
                        </td>
                        <td style="width: 24%;">
                            <div class="lbl">Middle Name</div>
                            <div class="val-lg">{{ strtoupper($clearance->middle_name ?? 'N/A') }}</div>
                        </td>
                    </tr>
                </table>

                {{-- Address --}}
                <div class="lbl">Address</div>
                <div class="val" style="font-size: 8.5px;">{{ $fullAddress }}</div>

                {{-- DOB & POB --}}
                <table style="width: 100%; border-collapse: collapse;">
                    <tr>
                        <td style="width: 50%; padding-right: 8px;">
                            <div class="lbl">Date of Birth</div>
                            <div class="val">{{ strtoupper($dob) }}</div>
                        </td>
                        <td style="width: 50%;">
                            <div class="lbl">Place of Birth</div>
                            <div class="val">{{ strtoupper($clearance->place_of_birth) }}</div>
                        </td>
                    </tr>
                </table>

                {{-- Citizenship / Civil Status / Gender --}}
                <table style="width: 100%; border-collapse: collapse;">
                    <tr>
                        <td style="width: 33%; padding-right: 6px;">
                            <div class="lbl">Citizenship</div>
                            <div class="val">{{ strtoupper($clearance->nationality) }}</div>
                        </td>
                        <td style="width: 33%; padding-right: 6px;">
                            <div class="lbl">Civil Status</div>
                            <div class="val">{{ strtoupper($clearance->civil_status) }}</div>
                        </td>
                        <td style="width: 34%;">
                            <div class="lbl">Gender</div>
                            <div class="val">{{ strtoupper($clearance->sex) }}</div>
                        </td>
                    </tr>
                </table>

                {{-- Purpose --}}
                <div class="lbl">Purpose</div>
                <div class="val">{{ strtoupper($clearance->purpose) }}</div>

                {{-- Remarks --}}
                <div class="rmk-box">
                    <div class="rmk-label">Remarks</div>
                    <div class="rmk-value">{{ $remarks }}</div>
                </div>

                {{-- Barcode & Director --}}
                <table style="width: 100%; border-collapse: collapse;">
                    <tr>
                        <td style="width: 55%; vertical-align: bottom;">
                            @if(isset($barcodeBase64) && $barcodeBase64)
                                <img src="{{ $barcodeBase64 }}" style="width: 160px; height: 24px;" />
                            @endif
                            <div style="font-size: 6px; font-family: monospace; font-weight: bold; margin-top: 1px;">
                                {{ $clearance->clearance_number }}
                            </div>
                        </td>
                        <td style="width: 45%; text-align: center; vertical-align: bottom;">
                            <div style="border-top: 1px solid #000; width: 90px; margin: 0 auto 2px auto;"></div>
                            <div style="font-size: 6.5px; font-weight: 900; text-transform: uppercase;">ATTY. NBI DIRECTOR</div>
                            <div style="font-size: 5px; color: #666666; text-transform: uppercase;">Director</div>
                        </td>
                    </tr>
                </table>

            </td>

            {{-- Right: Photo / QR / Transaction --}}
            <td style="width: 88px; vertical-align: top; text-align: center;">

                <div class="badge">{{ $badgeId }}</div>

                <div class="photo-box">
                    @if(isset($photoBase64) && $photoBase64)
                        <img src="{{ $photoBase64 }}" />
                    @else
                        <div style="font-size: 6px; color: #aaa; padding-top: 40px;">NO PHOTO</div>
                    @endif
                </div>

                <div class="sig-box">SIGNATURE</div>

                @if(isset($qrCodeBase64) && $qrCodeBase64)
                    <div style="margin: 2px auto; text-align: center;">
                        <img src="{{ $qrCodeBase64 }}" style="width: 55px; height: 55px;" />
                    </div>
                @endif

                <table class="tx-tbl">
                    <tr><td class="tx-lbl">Date</td><td>{{ $dateIssued }}</td></tr>
                    <tr><td class="tx-lbl">Agency</td><td>NBI</td></tr>
                    <tr><td class="tx-lbl">O.R. No.</td><td>{{ $clearance->payment_reference ?? 'N/A' }}</td></tr>
                    <tr><td class="tx-lbl">DST PAID</td><td>{{ $clearance->payment_amount ? 'Php '.$clearance->payment_amount : 'N/A' }}</td></tr>
                </table>

            </td>
        </tr>
    </table>

</div>

{{-- Cut Line --}}
<div class="cut-line">
    <span class="cut-line-text">--- CUT ALONG LINE - PERSONAL COPY BELOW ---</span>
</div>

{{-- ═══════════════════════════════════════════════ --}}
{{-- PERSONAL COPY --}}
{{-- ═══════════════════════════════════════════════ --}}
<div class="clearance-card">

    <div class="personal-stamp">PERSONAL COPY</div>

    {{-- Header --}}
    <table class="header-table">
        <tr>
            <td class="logo-cell"><div class="logo-box">BAGONG<br>PILIPINAS</div></td>
            <td class="header-center">
                <div class="h-bagong">Bagong Pilipinas</div>
                <div class="h-republic">Republic of the Philippines</div>
                <div class="h-doj">Department of Justice</div>
                <div class="h-nbi">National Bureau of Investigation</div>
            </td>
            <td class="logo-cell"><div class="nbi-logo-box">NBI</div></td>
        </tr>
    </table>
    <div class="header-border"></div>

    <div class="cert-text">
        This is to certify that the person whose name, picture, signature and thumbprint appearing herein applied for NBI Clearance and the results is as follows:
    </div>

    {{-- Body --}}
    <table style="width: 100%; border-collapse: collapse;">
        <tr>
            {{-- Left: Data Fields --}}
            <td style="vertical-align: top; padding-right: 8px;">

                <table style="width: 100%; border-collapse: collapse;">
                    <tr>
                        <td style="width: 50%; padding-right: 8px;">
                            <div class="lbl">NBI ID No.</div>
                            <div class="val-id">{{ $clearance->clearance_number }}</div>
                        </td>
                        <td style="width: 50%;">
                            <div class="lbl">Valid Until</div>
                            <div class="val">{{ strtoupper($validUntil) }}</div>
                        </td>
                    </tr>
                </table>

                <table style="width: 100%; border-collapse: collapse;">
                    <tr>
                        <td style="width: 38%; padding-right: 6px;">
                            <div class="lbl">Family Name</div>
                            <div class="val-lg">{{ strtoupper($clearance->last_name) }}</div>
                        </td>
                        <td style="width: 38%; padding-right: 6px;">
                            <div class="lbl">First Name</div>
                            <div class="val-lg">{{ strtoupper($clearance->first_name) }}</div>
                        </td>
                        <td style="width: 24%;">
                            <div class="lbl">Middle Name</div>
                            <div class="val-lg">{{ strtoupper($clearance->middle_name ?? 'N/A') }}</div>
                        </td>
                    </tr>
                </table>

                <div class="lbl">Address</div>
                <div class="val" style="font-size: 8.5px;">{{ $fullAddress }}</div>

                <table style="width: 100%; border-collapse: collapse;">
                    <tr>
                        <td style="width: 50%; padding-right: 8px;">
                            <div class="lbl">Date of Birth</div>
                            <div class="val">{{ strtoupper($dob) }}</div>
                        </td>
                        <td style="width: 50%;">
                            <div class="lbl">Place of Birth</div>
                            <div class="val">{{ strtoupper($clearance->place_of_birth) }}</div>
                        </td>
                    </tr>
                </table>

                <table style="width: 100%; border-collapse: collapse;">
                    <tr>
                        <td style="width: 33%; padding-right: 6px;">
                            <div class="lbl">Citizenship</div>
                            <div class="val">{{ strtoupper($clearance->nationality) }}</div>
                        </td>
                        <td style="width: 33%; padding-right: 6px;">
                            <div class="lbl">Civil Status</div>
                            <div class="val">{{ strtoupper($clearance->civil_status) }}</div>
                        </td>
                        <td style="width: 34%;">
                            <div class="lbl">Gender</div>
                            <div class="val">{{ strtoupper($clearance->sex) }}</div>
                        </td>
                    </tr>
                </table>

                <div class="lbl">Purpose</div>
                <div class="val">{{ strtoupper($clearance->purpose) }}</div>

                <div class="rmk-box">
                    <div class="rmk-label">Remarks</div>
                    <div class="rmk-value">{{ $remarks }}</div>
                </div>

                <table style="width: 100%; border-collapse: collapse;">
                    <tr>
                        <td style="width: 55%; vertical-align: bottom;">
                            @if(isset($barcodeBase64) && $barcodeBase64)
                                <img src="{{ $barcodeBase64 }}" style="width: 160px; height: 24px;" />
                            @endif
                            <div style="font-size: 6px; font-family: monospace; font-weight: bold; margin-top: 1px;">
                                {{ $clearance->clearance_number }}
                            </div>
                        </td>
                        <td style="width: 45%; text-align: center; vertical-align: bottom;">
                            <div style="border-top: 1px solid #000; width: 90px; margin: 0 auto 2px auto;"></div>
                            <div style="font-size: 6.5px; font-weight: 900; text-transform: uppercase;">ATTY. NBI DIRECTOR</div>
                            <div style="font-size: 5px; color: #666666; text-transform: uppercase;">Director</div>
                        </td>
                    </tr>
                </table>

            </td>

            {{-- Right: Photo / QR / Transaction --}}
            <td style="width: 88px; vertical-align: top; text-align: center;">

                <div class="badge">{{ $badgeId }}</div>

                <div class="photo-box">
                    @if(isset($photoBase64) && $photoBase64)
                        <img src="{{ $photoBase64 }}" />
                    @else
                        <div style="font-size: 6px; color: #aaa; padding-top: 40px;">NO PHOTO</div>
                    @endif
                </div>

                <div class="sig-box">SIGNATURE</div>

                @if(isset($qrCodeBase64) && $qrCodeBase64)
                    <div style="margin: 2px auto; text-align: center;">
                        <img src="{{ $qrCodeBase64 }}" style="width: 55px; height: 55px;" />
                    </div>
                @endif

                <table class="tx-tbl">
                    <tr><td class="tx-lbl">Date</td><td>{{ $dateIssued }}</td></tr>
                    <tr><td class="tx-lbl">Agency</td><td>NBI</td></tr>
                    <tr><td class="tx-lbl">O.R. No.</td><td>{{ $clearance->payment_reference ?? 'N/A' }}</td></tr>
                    <tr><td class="tx-lbl">DST PAID</td><td>{{ $clearance->payment_amount ? 'Php '.$clearance->payment_amount : 'N/A' }}</td></tr>
                </table>

            </td>
        </tr>
    </table>

</div>

</body>
</html>