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
            font-size: 10px;
        }
        .clearance-card {
            width: 100%;
            border: 1px solid #000000;
            padding: 8px 12px;
            position: relative;
            background: #ffffff;
        }
        .cut-line {
            border-top: 1.5px dashed #666666;
            margin: 10px 0;
            text-align: center;
            position: relative;
        }
        .cut-line-text {
            background: #ffffff;
            padding: 0 8px;
            font-size: 8px;
            color: #666666;
            position: relative;
            top: -6px;
            text-transform: uppercase;
        }

        /* Header Table */
        .header-table {
            width: 100%;
            border-collapse: collapse;
            border-bottom: 2px solid #1a3a6b;
            margin-bottom: 4px;
        }
        .header-title {
            text-align: center;
        }
        .bagong-text { font-size: 6px; font-weight: bold; color: #1a3a6b; letter-spacing: 1.5px; text-transform: uppercase; }
        .republic-text { font-size: 11px; font-weight: 900; text-transform: uppercase; }
        .doj-text { font-size: 9px; font-weight: bold; text-transform: uppercase; }
        .nbi-text { font-size: 15px; font-weight: 900; color: #1a3a6b; letter-spacing: 1px; text-transform: uppercase; }

        .cert-statement {
            font-size: 7px;
            text-align: center;
            color: #333333;
            font-style: italic;
            margin-bottom: 6px;
        }

        /* Data Fields */
        .field-label {
            font-size: 6.5px;
            font-weight: bold;
            color: #444444;
            text-transform: uppercase;
            border-bottom: 0.5px solid #888888;
            padding-bottom: 1px;
            margin-bottom: 1px;
        }
        .field-value {
            font-size: 10px;
            font-weight: bold;
            color: #000000;
            text-transform: uppercase;
            padding-bottom: 4px;
        }
        .field-value-large {
            font-size: 13px;
            font-weight: 900;
            color: #000000;
            text-transform: uppercase;
            padding-bottom: 4px;
        }
        .field-value-blue {
            font-size: 10px;
            font-weight: bold;
            color: #1a3a6b;
            font-family: 'Courier New', monospace;
            padding-bottom: 4px;
        }

        /* Remarks Box */
        .remarks-container {
            border: 1.5px solid #000000;
            padding: 3px 6px;
            margin-top: 4px;
            margin-bottom: 6px;
        }
        .remarks-title { font-size: 6.5px; font-weight: bold; color: #444444; text-transform: uppercase; }
        .remarks-text { font-size: 11px; font-weight: 900; text-transform: uppercase; color: #000000; }

        /* Right Column Elements */
        .nbi-badge {
            background: #1a3a6b;
            color: #ffffff;
            font-size: 8px;
            font-weight: 900;
            text-align: center;
            padding: 2px 0;
            letter-spacing: 1px;
            width: 100%;
            margin-bottom: 4px;
        }
        .photo-frame {
            width: 80px;
            height: 96px;
            border: 1px solid #444444;
            background: #f1f5f9;
            text-align: center;
            margin: 0 auto 4px auto;
        }
        .photo-img {
            width: 80px;
            height: 96px;
            object-fit: cover;
        }
        .sig-frame {
            width: 80px;
            height: 24px;
            border: 0.5px solid #888888;
            text-align: center;
            font-size: 6px;
            color: #666666;
            line-height: 24px;
            margin: 0 auto 4px auto;
            text-transform: uppercase;
        }

        /* Watermark Personal Copy */
        .personal-watermark {
            position: absolute;
            top: 32%;
            left: 20%;
            font-size: 32px;
            font-weight: 900;
            color: rgba(220, 38, 38, 0.15);
            border: 3px solid rgba(220, 38, 38, 0.15);
            padding: 4px 16px;
            transform: rotate(-20deg);
            text-transform: uppercase;
            letter-spacing: 2px;
        }

        /* Transaction Table */
        .tx-table {
            width: 100%;
            border-collapse: collapse;
            font-size: 6px;
        }
        .tx-table td {
            border: 0.5px solid #cccccc;
            padding: 1px 3px;
        }
        .tx-label {
            font-weight: bold;
            color: #555555;
            text-transform: uppercase;
        }
    </style>
</head>
<body>

@php
    $validUntil = $clearance->released_at
        ? \Carbon\Carbon::parse($clearance->released_at)->addYear()->format('F d, Y')
        : '—';
    $dob = $clearance->date_of_birth
        ? \Carbon\Carbon::parse($clearance->date_of_birth)->format('F d, Y')
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
@endphp

{{-- ════════════════════════════════════════════════════════════════════ text --}}
{{-- 1. ORIGINAL COPY (TOP) --}}
{{-- ════════════════════════════════════════════════════════════════════ text --}}
<div class="clearance-card">

    <!-- Header -->
    <table class="header-table">
        <tr>
            <td style="width: 48px; text-align: center; vertical-align: middle;">
                <div style="width: 42px; height: 42px; border: 1px solid #cccccc; font-size: 5px; color: #666; line-height: 1.1; padding-top: 10px; font-weight: bold;">
                    BAGONG<br>PILIPINAS
                </div>
            </td>
            <td class="header-title">
                <div class="bagong-text">Bagong Pilipinas</div>
                <div class="republic-text">Republic of the Philippines</div>
                <div class="doj-text">Department of Justice</div>
                <div class="nbi-text">National Bureau of Investigation</div>
            </td>
            <td style="width: 48px; text-align: center; vertical-align: middle;">
                <div style="width: 42px; height: 42px; border: 1.5px solid #1a3a6b; font-size: 11px; color: #1a3a6b; font-weight: 900; line-height: 40px;">
                    NBI
                </div>
            </td>
        </tr>
    </table>

    <div class="cert-statement">
        This is to certify that the person whose name, picture, signature and thumbprint appearing herein applied for NBI Clearance and the results is as follows:
    </div>

    <!-- Main Content Grid Table -->
    <table style="width: 100%; border-collapse: collapse;">
        <tr>
            <!-- Left Column: Personal Information -->
            <td style="vertical-align: top; padding-right: 10px;">
                
                <!-- NBI ID & Valid Until -->
                <table style="width: 100%; border-collapse: collapse;">
                    <tr>
                        <td style="width: 50%; padding-right: 8px;">
                            <div class="field-label">NBI ID No.</div>
                            <div class="field-value-blue">{{ $clearance->clearance_number }}</div>
                        </td>
                        <td style="width: 50%;">
                            <div class="field-label">Valid Until</div>
                            <div class="field-value">{{ strtoupper($validUntil) }}</div>
                        </td>
                    </tr>
                </table>

                <!-- Name Row -->
                <table style="width: 100%; border-collapse: collapse;">
                    <tr>
                        <td style="width: 40%; padding-right: 6px;">
                            <div class="field-label">Family Name</div>
                            <div class="field-value-large">{{ strtoupper($clearance->last_name) }}</div>
                        </td>
                        <td style="width: 40%; padding-right: 6px;">
                            <div class="field-label">First Name</div>
                            <div class="field-value-large">{{ strtoupper($clearance->first_name) }}</div>
                        </td>
                        <td style="width: 20%;">
                            <div class="field-label">Middle Name</div>
                            <div class="field-value-large">{{ strtoupper($clearance->middle_name ?? 'N/A') }}</div>
                        </td>
                    </tr>
                </table>

                <!-- Address -->
                <div style="width: 100%;">
                    <div class="field-label">Address</div>
                    <div class="field-value" style="font-size: 9px;">{{ $fullAddress }}</div>
                </div>

                <!-- DOB & POB -->
                <table style="width: 100%; border-collapse: collapse;">
                    <tr>
                        <td style="width: 50%; padding-right: 8px;">
                            <div class="field-label">Date of Birth</div>
                            <div class="field-value">{{ strtoupper($dob) }}</div>
                        </td>
                        <td style="width: 50%;">
                            <div class="field-label">Place of Birth</div>
                            <div class="field-value">{{ strtoupper($clearance->place_of_birth) }}</div>
                        </td>
                    </tr>
                </table>

                <!-- Citizenship, Civil Status, Gender -->
                <table style="width: 100%; border-collapse: collapse;">
                    <tr>
                        <td style="width: 33%; padding-right: 6px;">
                            <div class="field-label">Citizenship</div>
                            <div class="field-value">{{ strtoupper($clearance->nationality) }}</div>
                        </td>
                        <td style="width: 33%; padding-right: 6px;">
                            <div class="field-label">Civil Status</div>
                            <div class="field-value">{{ strtoupper($clearance->civil_status) }}</div>
                        </td>
                        <td style="width: 34%;">
                            <div class="field-label">Gender</div>
                            <div class="field-value">{{ strtoupper($clearance->sex) }}</div>
                        </td>
                    </tr>
                </table>

                <!-- Purpose -->
                <div style="width: 100%;">
                    <div class="field-label">Purpose</div>
                    <div class="field-value">{{ strtoupper($clearance->purpose) }}</div>
                </div>

                <!-- Remarks Box -->
                <div class="remarks-container">
                    <div class="remarks-title">Remarks</div>
                    <div class="remarks-text">
                        {{ $clearance->status === 'CLEARED' ? 'NO DEROGATORY RECORD' : 'WITH DEROGATORY RECORD' }}
                    </div>
                </div>

                <!-- Barcode & Director Signature Footer -->
                <table style="width: 100%; border-collapse: collapse; margin-top: 2px;">
                    <tr>
                        <td style="width: 60%; vertical-align: bottom;">
                            @if(isset($barcodeBase64) && $barcodeBase64)
                                <img src="data:image/png;base64,{{ $barcodeBase64 }}" style="width: 180px; height: 28px;" />
                            @endif
                            <div style="font-size: 7px; font-family: monospace; font-weight: bold; margin-top: 1px;">
                                {{ $clearance->clearance_number }}
                            </div>
                        </td>
                        <td style="width: 40%; text-align: center; vertical-align: bottom;">
                            <div style="border-top: 1px solid #000000; width: 100px; margin: 0 auto 2px auto;"></div>
                            <div style="font-size: 7px; font-weight: 900; text-transform: uppercase;">ATTY. NBI DIRECTOR</div>
                            <div style="font-size: 6px; color: #555555; text-transform: uppercase;">Director</div>
                        </td>
                    </tr>
                </table>

            </td>

            <!-- Right Column: Badge, Photo, Signature, QR, Tx Table -->
            <td style="width: 90px; vertical-align: top; text-align: center;">
                
                <div class="nbi-badge">
                    A-{{ strtoupper(substr($clearance->clearance_number, -7)) }}
                </div>

                <div class="photo-frame">
                    @if(isset($photoBase64) && $photoBase64)
                        <img src="{{ $photoBase64 }}" class="photo-img" />
                    @else
                        <div style="font-size: 6px; color: #999; line-height: 96px;">NO PHOTO</div>
                    @endif
                </div>

                <div class="sig-frame">Signature</div>

                <div style="margin: 2px auto;">
                    @if(isset($qrCodeBase64) && $qrCodeBase64)
                        <img src="data:image/png;base64,{{ $qrCodeBase64 }}" style="width: 64px; height: 64px;" />
                    @endif
                </div>

                <table class="tx-table">
                    <tr><td class="tx-label">Date</td><td>{{ $dateIssued }}</td></tr>
                    <tr><td class="tx-label">Agency</td><td>NBI</td></tr>
                    <tr><td class="tx-label">O.R. No.</td><td>{{ $clearance->payment_reference ?? 'N/A' }}</td></tr>
                    <tr><td class="tx-label">DST PAID</td><td>{{ $clearance->payment_amount ? '₱'.$clearance->payment_amount : 'N/A' }}</td></tr>
                </table>

            </td>
        </tr>
    </table>

</div>

<!-- Cut Line -->
<div class="cut-line">
    <span class="cut-line-text">✂ Cut along line &bull; Personal Copy Below</span>
</div>

{{-- ════════════════════════════════════════════════════════════════════ text --}}
{{-- 2. PERSONAL COPY (BOTTOM) --}}
{{-- ════════════════════════════════════════════════════════════════════ text --}}
<div class="clearance-card">

    <div class="personal-watermark">PERSONAL COPY</div>

    <!-- Header -->
    <table class="header-table">
        <tr>
            <td style="width: 48px; text-align: center; vertical-align: middle;">
                <div style="width: 42px; height: 42px; border: 1px solid #cccccc; font-size: 5px; color: #666; line-height: 1.1; padding-top: 10px; font-weight: bold;">
                    BAGONG<br>PILIPINAS
                </div>
            </td>
            <td class="header-title">
                <div class="bagong-text">Bagong Pilipinas</div>
                <div class="republic-text">Republic of the Philippines</div>
                <div class="doj-text">Department of Justice</div>
                <div class="nbi-text">National Bureau of Investigation</div>
            </td>
            <td style="width: 48px; text-align: center; vertical-align: middle;">
                <div style="width: 42px; height: 42px; border: 1.5px solid #1a3a6b; font-size: 11px; color: #1a3a6b; font-weight: 900; line-height: 40px;">
                    NBI
                </div>
            </td>
        </tr>
    </table>

    <div class="cert-statement">
        This is to certify that the person whose name, picture, signature and thumbprint appearing herein applied for NBI Clearance and the results is as follows:
    </div>

    <!-- Main Content Grid Table -->
    <table style="width: 100%; border-collapse: collapse;">
        <tr>
            <!-- Left Column: Personal Information -->
            <td style="vertical-align: top; padding-right: 10px;">
                
                <!-- NBI ID & Valid Until -->
                <table style="width: 100%; border-collapse: collapse;">
                    <tr>
                        <td style="width: 50%; padding-right: 8px;">
                            <div class="field-label">NBI ID No.</div>
                            <div class="field-value-blue">{{ $clearance->clearance_number }}</div>
                        </td>
                        <td style="width: 50%;">
                            <div class="field-label">Valid Until</div>
                            <div class="field-value">{{ strtoupper($validUntil) }}</div>
                        </td>
                    </tr>
                </table>

                <!-- Name Row -->
                <table style="width: 100%; border-collapse: collapse;">
                    <tr>
                        <td style="width: 40%; padding-right: 6px;">
                            <div class="field-label">Family Name</div>
                            <div class="field-value-large">{{ strtoupper($clearance->last_name) }}</div>
                        </td>
                        <td style="width: 40%; padding-right: 6px;">
                            <div class="field-label">First Name</div>
                            <div class="field-value-large">{{ strtoupper($clearance->first_name) }}</div>
                        </td>
                        <td style="width: 20%;">
                            <div class="field-label">Middle Name</div>
                            <div class="field-value-large">{{ strtoupper($clearance->middle_name ?? 'N/A') }}</div>
                        </td>
                    </tr>
                </table>

                <!-- Address -->
                <div style="width: 100%;">
                    <div class="field-label">Address</div>
                    <div class="field-value" style="font-size: 9px;">{{ $fullAddress }}</div>
                </div>

                <!-- DOB & POB -->
                <table style="width: 100%; border-collapse: collapse;">
                    <tr>
                        <td style="width: 50%; padding-right: 8px;">
                            <div class="field-label">Date of Birth</div>
                            <div class="field-value">{{ strtoupper($dob) }}</div>
                        </td>
                        <td style="width: 50%;">
                            <div class="field-label">Place of Birth</div>
                            <div class="field-value">{{ strtoupper($clearance->place_of_birth) }}</div>
                        </td>
                    </tr>
                </table>

                <!-- Citizenship, Civil Status, Gender -->
                <table style="width: 100%; border-collapse: collapse;">
                    <tr>
                        <td style="width: 33%; padding-right: 6px;">
                            <div class="field-label">Citizenship</div>
                            <div class="field-value">{{ strtoupper($clearance->nationality) }}</div>
                        </td>
                        <td style="width: 33%; padding-right: 6px;">
                            <div class="field-label">Civil Status</div>
                            <div class="field-value">{{ strtoupper($clearance->civil_status) }}</div>
                        </td>
                        <td style="width: 34%;">
                            <div class="field-label">Gender</div>
                            <div class="field-value">{{ strtoupper($clearance->sex) }}</div>
                        </td>
                    </tr>
                </table>

                <!-- Purpose -->
                <div style="width: 100%;">
                    <div class="field-label">Purpose</div>
                    <div class="field-value">{{ strtoupper($clearance->purpose) }}</div>
                </div>

                <!-- Remarks Box -->
                <div class="remarks-container">
                    <div class="remarks-title">Remarks</div>
                    <div class="remarks-text">
                        {{ $clearance->status === 'CLEARED' ? 'NO DEROGATORY RECORD' : 'WITH DEROGATORY RECORD' }}
                    </div>
                </div>

                <!-- Barcode & Director Signature Footer -->
                <table style="width: 100%; border-collapse: collapse; margin-top: 2px;">
                    <tr>
                        <td style="width: 60%; vertical-align: bottom;">
                            @if(isset($barcodeBase64) && $barcodeBase64)
                                <img src="data:image/png;base64,{{ $barcodeBase64 }}" style="width: 180px; height: 28px;" />
                            @endif
                            <div style="font-size: 7px; font-family: monospace; font-weight: bold; margin-top: 1px;">
                                {{ $clearance->clearance_number }}
                            </div>
                        </td>
                        <td style="width: 40%; text-align: center; vertical-align: bottom;">
                            <div style="border-top: 1px solid #000000; width: 100px; margin: 0 auto 2px auto;"></div>
                            <div style="font-size: 7px; font-weight: 900; text-transform: uppercase;">ATTY. NBI DIRECTOR</div>
                            <div style="font-size: 6px; color: #555555; text-transform: uppercase;">Director</div>
                        </td>
                    </tr>
                </table>

            </td>

            <!-- Right Column: Badge, Photo, Signature, QR, Tx Table -->
            <td style="width: 90px; vertical-align: top; text-align: center;">
                
                <div class="nbi-badge">
                    A-{{ strtoupper(substr($clearance->clearance_number, -7)) }}
                </div>

                <div class="photo-frame">
                    @if(isset($photoBase64) && $photoBase64)
                        <img src="{{ $photoBase64 }}" class="photo-img" />
                    @else
                        <div style="font-size: 6px; color: #999; line-height: 96px;">NO PHOTO</div>
                    @endif
                </div>

                <div class="sig-frame">Signature</div>

                <div style="margin: 2px auto;">
                    @if(isset($qrCodeBase64) && $qrCodeBase64)
                        <img src="data:image/png;base64,{{ $qrCodeBase64 }}" style="width: 64px; height: 64px;" />
                    @endif
                </div>

                <table class="tx-table">
                    <tr><td class="tx-label">Date</td><td>{{ $dateIssued }}</td></tr>
                    <tr><td class="tx-label">Agency</td><td>NBI</td></tr>
                    <tr><td class="tx-label">O.R. No.</td><td>{{ $clearance->payment_reference ?? 'N/A' }}</td></tr>
                    <tr><td class="tx-label">DST PAID</td><td>{{ $clearance->payment_amount ? '₱'.$clearance->payment_amount : 'N/A' }}</td></tr>
                </table>

            </td>
        </tr>
    </table>

</div>

</body>
</html>