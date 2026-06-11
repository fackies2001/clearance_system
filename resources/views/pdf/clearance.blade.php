{{-- resources/views/pdf/clearance.blade.php --}}
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <title>NBI Clearance - {{ $clearance->clearance_number }}</title>
    <style>
        * { margin: 0; padding: 0; box-sizing: border-box; }
        body {
            font-family: Arial, sans-serif;
            color: #000;
            background: #fff;
            font-size: 11px;
        }

        .page {
            width: 215mm;
            min-height: 140mm;
            padding: 8mm 10mm;
            position: relative;
            overflow: hidden;
        }

        /* Watermark */
        .watermark {
            position: absolute;
            inset: 0;
            display: flex;
            flex-wrap: wrap;
            align-items: center;
            justify-content: center;
            opacity: 0.045;
            pointer-events: none;
            z-index: 0;
            gap: 0;
            overflow: hidden;
        }
        .watermark span {
            font-size: 13px;
            font-weight: 900;
            text-transform: uppercase;
            letter-spacing: 1px;
            white-space: nowrap;
            color: #1a3a6b;
            padding: 4px 6px;
        }

        .content { position: relative; z-index: 1; }

        /* Header */
        .header {
            display: flex;
            align-items: center;
            justify-content: center;
            gap: 16px;
            margin-bottom: 6px;
            padding-bottom: 6px;
            border-bottom: 1.5px solid #1a3a6b;
        }
        .header-logo {
            width: 52px;
            height: 52px;
            flex-shrink: 0;
        }
        .header-text { text-align: center; }
        .header-text .bagong { font-size: 8px; font-weight: 700; text-transform: uppercase; color: #1a3a6b; letter-spacing: 2px; }
        .header-text .republic { font-size: 13px; font-weight: 900; text-transform: uppercase; }
        .header-text .doj { font-size: 11px; font-weight: 700; text-transform: uppercase; }
        .header-text .nbi { font-size: 17px; font-weight: 900; text-transform: uppercase; color: #1a3a6b; letter-spacing: 1px; }

        .cert-tagline {
            font-size: 8px;
            text-align: center;
            color: #333;
            margin-bottom: 8px;
            font-style: italic;
        }

        /* Main body */
        .main-body {
            display: flex;
            gap: 10px;
        }

        /* Left section */
        .left-col { flex: 1; }

        .field-row {
            display: flex;
            gap: 12px;
            margin-bottom: 6px;
        }
        .field { flex: 1; }
        .field-label {
            font-size: 7px;
            font-weight: 700;
            text-transform: uppercase;
            color: #555;
            border-bottom: 0.5px solid #999;
            padding-bottom: 1px;
            margin-bottom: 2px;
            letter-spacing: 0.5px;
        }
        .field-value {
            font-size: 11px;
            font-weight: 700;
            text-transform: uppercase;
            color: #000;
        }
        .field-value.large {
            font-size: 15px;
            font-weight: 900;
            letter-spacing: -0.3px;
        }
        .field-value.blue { color: #1a3a6b; }
        .field-value.mono { font-family: 'Courier New', monospace; }

        .remarks-box {
            margin-top: 8px;
            border: 1.5px solid #000;
            padding: 6px 10px;
        }
        .remarks-label { font-size: 7px; font-weight: 700; text-transform: uppercase; color: #555; margin-bottom: 3px; }
        .remarks-value { font-size: 13px; font-weight: 900; text-transform: uppercase; letter-spacing: 0.5px; }

        /* Right section */
        .right-col {
            width: 105px;
            display: flex;
            flex-direction: column;
            align-items: center;
            gap: 6px;
        }

        .nbi-id-badge {
            background: #1a3a6b;
            color: #fff;
            font-size: 9px;
            font-weight: 900;
            padding: 2px 8px;
            letter-spacing: 1px;
            text-align: center;
            width: 100%;
        }

        .photo-box {
            width: 90px;
            height: 110px;
            border: 1.5px solid #555;
            overflow: hidden;
            background: #eee;
            display: flex;
            align-items: center;
            justify-content: center;
        }
        .photo-box img { width: 100%; height: 100%; object-fit: cover; }
        .photo-placeholder { font-size: 8px; color: #aaa; text-align: center; }

        .sig-box {
            width: 90px;
            height: 36px;
            border: 0.5px solid #999;
            display: flex;
            align-items: center;
            justify-content: center;
        }
        .sig-label { font-size: 7px; color: #555; text-align: center; text-transform: uppercase; }

        .qr-box {
            width: 80px;
            height: 80px;
        }
        .qr-box img { width: 100%; height: 100%; }

        /* Bottom section */
        .bottom-section {
            margin-top: 8px;
            display: flex;
            gap: 10px;
            align-items: flex-end;
        }

        .barcode-section { flex: 1; }
        .barcode-section img { width: 100%; max-height: 36px; }
        .barcode-no { font-size: 8px; font-family: 'Courier New', monospace; text-align: center; margin-top: 2px; }

        .transaction-table {
            font-size: 7px;
            border-collapse: collapse;
            width: 180px;
        }
        .transaction-table td {
            padding: 1px 4px;
            border: 0.5px solid #ccc;
        }
        .transaction-table .t-label { color: #555; font-weight: 700; text-transform: uppercase; }

        .signature-section {
            text-align: center;
            flex: 1;
        }
        .sig-line { border-top: 1px solid #000; width: 120px; margin: 30px auto 2px; }
        .sig-name { font-size: 9px; font-weight: 900; text-transform: uppercase; }
        .sig-title { font-size: 7px; color: #555; text-transform: uppercase; }

        .validity-box {
            font-size: 8px;
            text-align: right;
            color: #333;
        }
        .valid-until { font-size: 11px; font-weight: 900; color: #1a3a6b; }

        @page { size: 215mm 140mm landscape; margin: 0; }
        @media print { body { margin: 0; } }
    </style>
</head>
<body>
<div class="page">

    {{-- Watermark --}}
    <div class="watermark">
        @for($i = 0; $i < 80; $i++)
            <span>National Bureau of Investigation</span>
        @endfor
    </div>

    <div class="content">

        {{-- Header --}}
        <div class="header">
            {{-- Left logo placeholder --}}
            <div style="width:52px;height:52px;border:1px solid #ccc;display:flex;align-items:center;justify-content:center;font-size:7px;color:#aaa;text-align:center;">BAGONG<br>PILIPINAS</div>
            <div class="header-text">
                <div class="bagong">Bagong Pilipinas</div>
                <div class="republic">Republic of the Philippines</div>
                <div class="doj">Department of Justice</div>
                <div class="nbi">National Bureau of Investigation</div>
            </div>
            {{-- Right NBI logo placeholder --}}
            <div style="width:52px;height:52px;border:1px solid #ccc;display:flex;align-items:center;justify-content:center;font-size:9px;color:#1a3a6b;font-weight:900;">NBI</div>
        </div>

        <p class="cert-tagline">This is to certify that the person whose name, picture, signature and thumbprint appearing herein applied for NBI Clearance and the results is as follows:</p>

        {{-- Main Body --}}
        <div class="main-body">
            <div class="left-col">

                {{-- NBI ID & Valid Until --}}
                <div class="field-row">
                    <div class="field">
                        <div class="field-label">NBI ID No.</div>
                        <div class="field-value blue mono">{{ $clearance->clearance_number }}</div>
                    </div>
                    <div class="field">
                        <div class="field-label">Valid Until</div>
                        <div class="field-value">{{ \Carbon\Carbon::parse($clearance->released_at)->addYear()->format('F d, Y') }}</div>
                    </div>
                </div>

                {{-- Name --}}
                <div class="field-row">
                    <div class="field" style="flex:2">
                        <div class="field-label">Family Name</div>
                        <div class="field-value large">{{ strtoupper($clearance->last_name) }}</div>
                    </div>
                    <div class="field" style="flex:2">
                        <div class="field-label">First Name</div>
                        <div class="field-value large">{{ strtoupper($clearance->first_name) }}</div>
                    </div>
                    <div class="field">
                        <div class="field-label">Middle Name</div>
                        <div class="field-value large">{{ strtoupper($clearance->middle_name ?? '') }}</div>
                    </div>
                </div>

                {{-- Address --}}
                <div class="field-row">
                    <div class="field">
                        <div class="field-label">Address</div>
                        <div class="field-value" style="font-size:10px">{{ strtoupper($clearance->present_street . ' BRGY ' . $clearance->present_barangay . ' ' . $clearance->present_city . ' ' . $clearance->present_province) }}</div>
                    </div>
                </div>

                {{-- DOB, POB, Citizenship, Civil Status, Gender --}}
                <div class="field-row">
                    <div class="field">
                        <div class="field-label">Date of Birth</div>
                        <div class="field-value">{{ \Carbon\Carbon::parse($clearance->date_of_birth)->format('F d, Y') }}</div>
                    </div>
                    <div class="field">
                        <div class="field-label">Place of Birth</div>
                        <div class="field-value">{{ strtoupper($clearance->place_of_birth) }}</div>
                    </div>
                </div>
                <div class="field-row">
                    <div class="field">
                        <div class="field-label">Citizenship</div>
                        <div class="field-value">{{ strtoupper($clearance->nationality) }}</div>
                    </div>
                    <div class="field">
                        <div class="field-label">Civil Status</div>
                        <div class="field-value">{{ strtoupper($clearance->civil_status) }}</div>
                    </div>
                    <div class="field">
                        <div class="field-label">Gender</div>
                        <div class="field-value">{{ strtoupper($clearance->sex) }}</div>
                    </div>
                </div>

                {{-- Purpose --}}
                <div class="field-row">
                    <div class="field">
                        <div class="field-label">Purpose</div>
                        <div class="field-value">{{ strtoupper($clearance->purpose) }}</div>
                    </div>
                </div>

                {{-- Remarks --}}
                <div class="remarks-box">
                    <div class="remarks-label">Remarks</div>
                    <div class="remarks-value">{{ $clearance->status === 'CLEARED' ? 'NO DEROGATORY RECORD' : 'WITH DEROGATORY RECORD' }}</div>
                </div>

            </div>

            {{-- Right Column --}}
            <div class="right-col">
                <div class="nbi-id-badge">A-{{ substr($clearance->clearance_number, -7) }}</div>

                <div class="photo-box">
                    @if($clearance->photo_path)
                        <img src="{{ storage_path('app/public/' . $clearance->photo_path) }}" alt="Photo">
                    @else
                        <div class="photo-placeholder">NO PHOTO</div>
                    @endif
                </div>

                <div class="sig-box">
                    <div class="sig-label">Signature</div>
                </div>

                {{-- QR Code --}}
                <div class="qr-box">
                    {!! QrCode::size(80)->generate($clearance->clearance_number . '|' . $clearance->tracking_no . '|' . $clearance->last_name . ',' . $clearance->first_name) !!}
                </div>
            </div>
        </div>

        {{-- Bottom --}}
        <div class="bottom-section">

            {{-- Barcode --}}
            <div class="barcode-section">
                @php
                    $generator = new Picqer\Barcode\BarcodeGeneratorSVG();
                    $barcode = $generator->getBarcode($clearance->clearance_number, $generator::TYPE_CODE_128, 1.5, 36);
                @endphp
                {!! $barcode !!}
                <div class="barcode-no">{{ $clearance->clearance_number }}</div>
            </div>

            {{-- Signature --}}
            <div class="signature-section">
                <div class="sig-line"></div>
                <div class="sig-name">ATTY. NBI DIRECTOR</div>
                <div class="sig-title">Director</div>
            </div>

            {{-- Transaction Info --}}
            <div>
                <div style="font-size:7px;color:#555;margin-bottom:2px;">Date Printed: {{ now()->format('M d, Y g:i A') }}</div>
                <table class="transaction-table">
                    <tr><td class="t-label">Agency</td><td>NBI</td><td class="t-label">DATIO</td><td>openaa</td></tr>
                    <tr><td class="t-label">CASID</td><td>openaa</td><td class="t-label">BGIID</td><td>openaa</td></tr>
                    <tr><td class="t-label">O.R. No.</td><td>{{ $clearance->payment_reference ?? 'N/A' }}</td><td class="t-label">RECID</td><td>dataref</td></tr>
                    <tr><td class="t-label">O.R. Date</td><td>{{ $clearance->paid_at ? \Carbon\Carbon::parse($clearance->paid_at)->format('m/d/Y') : 'N/A' }}</td><td class="t-label">PRTID</td><td>nbiref</td></tr>
                    <tr><td class="t-label">DST PAID</td><td colspan="3">{{ $clearance->payment_amount ? '₱'.$clearance->payment_amount : 'N/A' }}</td></tr>
                </table>
            </div>

        </div>

    </div>
</div>
</body>
</html>