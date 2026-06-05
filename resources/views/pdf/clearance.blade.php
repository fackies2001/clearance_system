<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>NBI Clearance - {{ $clearance->clearance_number }}</title>
    <style>
        body { font-family: 'Helvetica', 'Arial', sans-serif; color: #0f172a; margin: 0; padding: 20px; }
        .certificate { border: 2px solid #e2e8f0; padding: 40px; }
        .header { text-align: center; border-bottom: 2px solid #0f172a; padding-bottom: 20px; margin-bottom: 30px; }
        .header h1 { font-size: 24px; font-weight: 900; margin: 0; text-transform: uppercase; }
        .header h2 { font-size: 16px; margin: 5px 0; text-transform: uppercase; }
        .header h3 { font-size: 20px; color: #1e3a8a; margin: 5px 0; text-transform: uppercase; }
        .main-info { display: table; width: 100%; margin-bottom: 40px; }
        .text-section { display: table-cell; vertical-align: top; width: 70%; }
        .photo-section { display: table-cell; vertical-align: top; width: 30%; text-align: right; }
        .label { font-size: 8px; font-weight: bold; text-transform: uppercase; color: #94a3b8; margin-bottom: 2px; }
        .value { font-size: 14px; font-weight: bold; margin-bottom: 15px; }
        .name-value { font-size: 28px; font-weight: 900; text-transform: uppercase; line-height: 1; }
        .photo-box { width: 140px; height: 180px; background: #f1f5f9; border: 1px solid #e2e8f0; margin-left: auto; margin-bottom: 15px; }
        .status-box { background: #ecfdf5; border: 1px solid #d1fae5; padding: 15px; }
        .status-text { font-size: 20px; font-weight: 900; color: #047857; text-transform: uppercase; letter-spacing: 2px; }
        .fingerprints { display: table; width: 100%; margin-top: 40px; }
        .fp-box { display: table-cell; width: 45%; border: 1px solid #f1f5f9; padding: 10px; text-align: center; }
        .fp-img { opacity: 0.1; height: 80px; }
        .footer { margin-top: 60px; display: table; width: 100%; }
        .signature { display: table-cell; width: 50%; }
        .sig-line { border-top: 1px solid #0f172a; width: 150px; margin-top: 40px; }
        .qr-section { display: table-cell; width: 50%; text-align: right; }
        .qr-box { width: 80px; height: 80px; background: #0f172a; display: inline-block; }
    </style>
</head>
<body>
    <div class="certificate">
        <div class="header">
            <h1>Republic of the Philippines</h1>
            <h2>Department of Justice</h2>
            <h3>National Bureau of Investigation</h3>
        </div>

        <div class="main-info">
            <div class="text-section">
                <div style="display: table; width: 100%;">
                    <div style="display: table-cell;">
                        <p class="label">Clearance Number</p>
                        <p class="value" style="color: #2563eb; font-size: 18px;">{{ $clearance->clearance_number }}</p>
                    </div>
                    <div style="display: table-cell; text-align: right;">
                        <p class="label">Date Issued</p>
                        <p class="value">{{ \Carbon\Carbon::parse($clearance->released_at)->format('F d, Y') }}</p>
                    </div>
                </div>

                <p class="label">Name</p>
                <p class="name-value">{{ $clearance->last_name }}, {{ $clearance->first_name }} {{ $clearance->middle_name }} {{ $clearance->suffix }}</p>

                <div style="display: table; width: 100%; margin-top: 20px;">
                    <div style="display: table-cell;">
                        <p class="label">Birthdate</p>
                        <p class="value">{{ \Carbon\Carbon::parse($clearance->date_of_birth)->format('m/d/Y') }}</p>
                    </div>
                    <div style="display: table-cell;">
                        <p class="label">Purpose</p>
                        <p class="value">{{ strtoupper($clearance->purpose) }}</p>
                    </div>
                </div>

                <div class="status-box">
                    <p class="label" style="color: #059669;">Verification Status</p>
                    <p class="status-text">Cleared / No Record</p>
                </div>
            </div>

            <div class="photo-section">
                <div class="photo-box">
                    @if($clearance->photo_path)
                        <img src="{{ storage_path('app/public/' . $clearance->photo_path) }}" style="width: 100%; height: 100%; object-fit: cover;">
                    @else
                        <div style="padding-top: 80px; font-size: 10px; color: #94a3b8;">PHOTO</div>
                    @endif
                </div>
                <div>
                     {{-- QR Code placeholder --}}
                     <div style="background: #000; width: 60px; height: 60px; display: inline-block;"></div>
                </div>
            </div>
        </div>

        <div class="fingerprints">
            <div class="fp-box" style="margin-right: 20px;">
                <p class="label">Left Thumb</p>
                <div class="fp-img">
                    <img src="https://upload.wikimedia.org/wikipedia/commons/thumb/6/6f/Loop_pattern.png/220px-Loop_pattern.png" style="height: 60px;">
                </div>
            </div>
            <div class="fp-box">
                <p class="label">Right Thumb</p>
                <div class="fp-img">
                    <img src="https://upload.wikimedia.org/wikipedia/commons/thumb/6/6f/Loop_pattern.png/220px-Loop_pattern.png" style="height: 60px;">
                </div>
            </div>
        </div>

        <div class="footer">
            <div class="signature">
                <div class="sig-line"></div>
                <p class="label" style="color: #0f172a;">NBI Authorized Officer</p>
            </div>
            <div class="qr-section">
                <p style="font-size: 8px; color: #94a3b8; font-style: italic;">
                    This certificate is issued for official use only. Any alteration or unauthorized reproduction will invalidate this document.
                </p>
            </div>
        </div>
    </div>
</body>
</html>
