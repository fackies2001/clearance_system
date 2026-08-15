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
            <div style="margin-bottom: 12px; text-align: center;">
                <svg width="48" height="48" viewBox="0 0 200 200" fill="none" xmlns="http://www.w3.org/2000/svg" style="display: inline-block;">
                    <defs>
                        <linearGradient id="emailGoldGrad" x1="0%" y1="0%" x2="100%" y2="100%">
                            <stop offset="0%" stop-color="#fbbf24" />
                            <stop offset="45%" stop-color="#f59e0b" />
                            <stop offset="100%" stop-color="#d97706" />
                        </linearGradient>
                    </defs>
                    <g stroke="url(#emailGoldGrad)" stroke-width="3.5" stroke-linecap="round" opacity="0.85">
                        <path d="M72 65 C80 50, 120 50, 128 65" stroke-dasharray="3 3" />
                        <path d="M64 78 C75 58, 125 58, 136 78" />
                        <path d="M58 90 C72 68, 128 68, 142 90" />
                    </g>
                    <g stroke="url(#emailGoldGrad)" stroke-width="3.5" stroke-linecap="round" opacity="0.85">
                        <path d="M75 145 C85 165, 115 165, 125 145" />
                        <path d="M68 158 C82 180, 118 180, 132 158" />
                        <path d="M78 172 C88 186, 112 186, 122 172" />
                    </g>
                    <path d="M 35 75 C 50 68, 75 62, 100 62 C 125 62, 150 68, 165 75" fill="none" stroke="url(#emailGoldGrad)" stroke-width="6" stroke-linecap="round" />
                    <path d="M 100 60 C 86 60, 80 75, 80 92 C 80 108, 86 116, 90 120 C 86 135, 82 145, 100 150 C 118 145, 114 135, 110 120 C 114 116, 120 108, 120 92 C 120 75, 114 60, 100 60 Z" fill="url(#emailGoldGrad)" />
                    <path d="M 100 80 A 9 9 0 1 0 100 98 A 9 9 0 0 0 100 80 Z M 95 94 L 105 94 L 108 128 L 92 128 Z" fill="#0f172a" />
                    <circle cx="35" cy="75" r="5" fill="none" stroke="url(#emailGoldGrad)" stroke-width="3" />
                    <path d="M 30 78 L 18 115 M 40 78 L 52 115" stroke="url(#emailGoldGrad)" stroke-width="2.5" stroke-linecap="round" />
                    <path d="M 14 115 L 56 115 Q 35 130 14 115 Z" fill="url(#emailGoldGrad)" />
                    <circle cx="165" cy="75" r="5" fill="none" stroke="url(#emailGoldGrad)" stroke-width="3" />
                    <path d="M 160 78 L 148 115 M 170 78 L 182 115" stroke="url(#emailGoldGrad)" stroke-width="2.5" stroke-linecap="round" />
                    <path d="M 144 115 L 186 115 Q 165 130 144 115 Z" fill="url(#emailGoldGrad)" />
                </svg>
            </div>
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
                 <strong>Do not share this code with anyone.</strong><br>
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