<!DOCTYPE html>
<html>
<head>
    <meta charset="utf-8">
    <style>
        body {
            font-family: Arial, sans-serif;
            background-color: #f4f4f4;
            margin: 0;
            padding: 0;
        }
        .container {
            max-width: 500px;
            margin: 40px auto;
            background-color: #ffffff;
            border-radius: 8px;
            overflow: hidden;
            box-shadow: 0 2px 8px rgba(0,0,0,0.1);
        }
        .header {
            background-color: #1a1a2e;
            padding: 24px;
            text-align: center;
        }
        .header h1 {
            color: #ffffff;
            margin: 0;
            font-size: 20px;
            letter-spacing: 1px;
        }
        .body {
            padding: 32px;
            text-align: center;
        }
        .body p {
            color: #555555;
            font-size: 15px;
            margin-bottom: 24px;
        }
        .otp-box {
            display: inline-block;
            background-color: #f0f4ff;
            border: 2px dashed #4a6cf7;
            border-radius: 8px;
            padding: 16px 40px;
            font-size: 36px;
            font-weight: bold;
            letter-spacing: 8px;
            color: #1a1a2e;
            margin-bottom: 24px;
        }
        .warning {
            color: #e74c3c;
            font-size: 13px;
        }
        .footer {
            background-color: #f4f4f4;
            padding: 16px;
            text-align: center;
            font-size: 12px;
            color: #999999;
        }
    </style>
</head>
<body>
    <div class="container">
        <div class="header">
            <h1>NBI CLEARANCE SYSTEM</h1>
        </div>
        <div class="body">
            <p>Hello, <strong>{{ $userName }}</strong>!</p>
            <p>Your One-Time Password (OTP) for login verification is:</p>
            <div class="otp-box">{{ $otp }}</div>
            <p>This OTP is valid for <strong>10 minutes</strong>.</p>
            <p class="warning">⚠️ Do not share this code with anyone.</p>
        </div>
        <div class="footer">
            &copy; {{ date('Y') }} NBI Clearance System. All rights reserved.
        </div>
    </div>
</body>
</html>