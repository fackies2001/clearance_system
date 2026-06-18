<!DOCTYPE html>
<html>
<head>
    <meta charset="utf-8">
    <style>
        * { box-sizing: border-box; margin: 0; padding: 0; }
        body {
            font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Arial, sans-serif;
            background-color: #f1f5f9;
            padding: 40px 16px;
        }
        .container {
            max-width: 480px;
            margin: 0 auto;
            background: #ffffff;
            border-radius: 16px;
            overflow: hidden;
            box-shadow: 0 4px 24px rgba(15,23,42,0.10);
        }
        .header {
            background: linear-gradient(135deg, #0f172a 0%, #1e3a5f 100%);
            padding: 28px 32px;
            text-align: center;
        }
        .logo-icon {
            width: 48px;
            height: 48px;
            background: rgba(255,255,255,0.1);
            border: 1px solid rgba(255,255,255,0.2);
            border-radius: 12px;
            display: inline-flex;
            align-items: center;
            justify-content: center;
            margin-bottom: 12px;
        }
        .header h1 {
            color: #ffffff;
            font-size: 16px;
            font-weight: 900;
            letter-spacing: 2px;
            text-transform: uppercase;
            margin: 0;
        }
        .header h1 span {
            color: #60a5fa;
        }
        .header p {
            color: rgba(255,255,255,0.5);
            font-size: 11px;
            margin-top: 4px;
            letter-spacing: 0.5px;
        }
        .body {
            padding: 36px 32px;
            text-align: center;
        }
        .greeting {
            font-size: 15px;
            color: #334155;
            margin-bottom: 8px;
        }
        .greeting strong {
            color: #0f172a;
        }
        .subtitle {
            font-size: 13px;
            color: #64748b;
            margin-bottom: 28px;
            line-height: 1.6;
        }
        .otp-label {
            font-size: 10px;
            font-weight: 700;
            color: #94a3b8;
            text-transform: uppercase;
            letter-spacing: 2px;
            margin-bottom: 12px;
        }
        .otp-box {
            display: inline-block;
            background: #f0f7ff;
            border: 2px dashed #3b82f6;
            border-radius: 12px;
            padding: 18px 44px;
            font-size: 38px;
            font-weight: 900;
            letter-spacing: 10px;
            color: #0f172a;
            margin-bottom: 28px;
        }
        .validity {
            font-size: 13px;
            color: #475569;
            margin-bottom: 16px;
        }
        .validity strong {
            color: #0f172a;
        }
        .warning-box {
            background: #fffbeb;
            border: 1px solid #fde68a;
            border-radius: 10px;
            padding: 12px 16px;
            font-size: 12px;
            color: #92400e;
            margin-top: 8px;
        }
        .divider {
            height: 1px;
            background: #f1f5f9;
            margin: 28px 0;
        }
        .security-note {
            font-size: 11px;
            color: #94a3b8;
            line-height: 1.6;
        }
        .footer {
            background: #f8fafc;
            border-top: 1px solid #e2e8f0;
            padding: 16px 32px;
            text-align: center;
            font-size: 11px;
            color: #94a3b8;
        }
    </style>
</head>
<body>
    <div class="container">

        <div class="header">
            <div style="margin-bottom:12px;">
                <!-- Shield icon inline SVG -->
                <svg width="36" height="36" viewBox="0 0 24 24" fill="none" stroke="#60a5fa" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" style="display:inline-block;">
                    <path d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z"/>
                </svg>
            </div>
            <h1>NBI <span>CLEARANCE</span> SYSTEM</h1>
            <p>National Bureau of Investigation — Official Portal</p>
        </div>

        <div class="body">
            <p class="greeting">Hello, <strong>{{ $userName }}</strong>!</p>
            <p class="subtitle">
                You are receiving this email because a login attempt<br>
                was made to your NBI Clearance account.
            </p>

            <p class="otp-label">Your One-Time Password</p>
            <div class="otp-box">{{ $otp }}</div>

            <p class="validity">This OTP is valid for <strong>10 minutes</strong> only.</p>

            <div class="warning-box">
                ⚠️ <strong>Do not share this code with anyone.</strong><br>
                NBI Clearance System will never ask for your OTP via phone or chat.
            </div>

            <div class="divider"></div>

            <p class="security-note">
                If you did not attempt to log in, please ignore this email<br>
                or contact support immediately. Your account may be at risk.
            </p>
        </div>

        <div class="footer">
            &copy; {{ date('Y') }} NBI Clearance Online System &mdash; All rights reserved.<br>
            <span style="color:#cbd5e1;">no-reply@nbiclearance.gov.ph</span>
        </div>

    </div>
</body>
</html>