<!DOCTYPE html>
<html>
<head>
    <meta charset="utf-8">
    <style>
        * { box-sizing: border-box; margin: 0; padding: 0; }
        body {
            font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif;
            background-color: #f8fafc;
            padding: 40px 16px;
        }
        .container {
            max-width: 480px;
            margin: 0 auto;
            background: #ffffff;
            border-radius: 16px;
            overflow: hidden;
            border: 1px solid #e2e8f0;
            box-shadow: 0 10px 25px -5px rgba(15, 23, 42, 0.08);
        }
        .header {
            background-color: #0f172a;
            padding: 28px 32px;
            text-align: center;
            border-bottom: 3px solid #d97706;
        }
        .header h1 {
            color: #ffffff;
            font-size: 17px;
            font-weight: 900;
            letter-spacing: 2px;
            text-transform: uppercase;
            margin: 0;
        }
        .header h1 span {
            color: #f59e0b;
        }
        .header p {
            color: rgba(255, 255, 255, 0.6);
            font-size: 11px;
            margin-top: 6px;
            letter-spacing: 0.5px;
            font-weight: 500;
        }
        .body {
            padding: 36px 32px;
            text-align: center;
        }
        .greeting {
            font-size: 16px;
            color: #334155;
            margin-bottom: 8px;
        }
        .greeting strong {
            color: #0f172a;
        }
        .subtitle {
            font-size: 13px;
            color: #64748b;
            margin-bottom: 30px;
            line-height: 1.6;
        }
        .otp-label {
            font-size: 10px;
            font-weight: 800;
            color: #94a3b8;
            text-transform: uppercase;
            letter-spacing: 2px;
            margin-bottom: 14px;
        }
        .otp-box {
            display: inline-block;
            background: #fdf8f0;
            border: 2px solid #fde68a;
            border-radius: 14px;
            padding: 16px 36px;
            font-size: 38px;
            font-weight: 900;
            letter-spacing: 12px;
            color: #0f172a;
            margin-bottom: 28px;
            box-shadow: inset 0 2px 4px rgba(0,0,0,0.02);
        }
        .validity {
            font-size: 13px;
            color: #475569;
            margin-bottom: 20px;
        }
        .validity strong {
            color: #0f172a;
        }
        .warning-box {
            background: #fffbeb;
            border: 1px solid #fde68a;
            border-radius: 12px;
            padding: 14px 18px;
            font-size: 12px;
            color: #92400e;
            text-align: center;
            line-height: 1.5;
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
            background: #fdf8f0;
            border-top: 1px solid #fef3c7;
            padding: 20px 32px;
            text-align: center;
            font-size: 11px;
            color: #78350f;
        }
        .footer a {
            color: #d97706;
            text-decoration: none;
        }
    </style>
</head>
<body>
    <div class="container">

        <div class="header">
            <h1>NBI <span>CLEARANCE</span> SYSTEM</h1>
            <p>National Bureau of Investigation &mdash; Official Portal</p>
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
            <a href="mailto:no-reply@nbiclearance.gov.ph">no-reply@nbiclearance.gov.ph</a>
        </div>

    </div>
</body>
</html>