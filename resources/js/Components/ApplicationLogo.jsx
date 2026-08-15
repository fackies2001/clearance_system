import React from 'react';

export default function ApplicationLogo({ className = "w-10 h-10", variant = "gold", ...props }) {
    // Gold gradient colors
    const isLight = variant === "light";
    
    return (
        <svg
            viewBox="0 0 200 200"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
            className={className}
            {...props}
        >
            <defs>
                <linearGradient id="nbiGoldGrad" x1="0%" y1="0%" x2="100%" y2="100%">
                    <stop offset="0%" stopColor="#fbbf24" />
                    <stop offset="45%" stopColor="#d97706" />
                    <stop offset="100%" stopColor="#92400e" />
                </linearGradient>

                <linearGradient id="nbiCreamGrad" x1="0%" y1="0%" x2="100%" y2="100%">
                    <stop offset="0%" stopColor="#fffbeb" />
                    <stop offset="100%" stopColor="#fef3c7" />
                </linearGradient>

                <filter id="goldGlow" x="-10%" y="-10%" width="120%" height="120%">
                    <feDropShadow dx="0" dy="2" stdDeviation="3" floodColor="#d97706" floodOpacity="0.25" />
                </filter>
            </defs>

            {/* ── BACKGROUND ACCENT CIRCLE (OPTIONAL) ── */}
            <circle cx="100" cy="100" r="92" fill="url(#nbiCreamGrad)" opacity="0.15" />

            {/* ── FINGERPRINT TOP ARCH RIDGES ── */}
            <g stroke="url(#nbiGoldGrad)" strokeWidth="3" strokeLinecap="round" opacity="0.85">
                <path d="M72 65 C80 50, 120 50, 128 65" strokeDasharray="3 3" />
                <path d="M64 78 C75 58, 125 58, 136 78" />
                <path d="M58 90 C72 68, 128 68, 142 90" />
            </g>

            {/* ── FINGERPRINT BOTTOM RIDGES ── */}
            <g stroke="url(#nbiGoldGrad)" strokeWidth="3" strokeLinecap="round" opacity="0.85">
                <path d="M75 145 C85 165, 115 165, 125 145" />
                <path d="M68 158 C82 180, 118 180, 132 158" />
                <path d="M78 172 C88 186, 112 186, 122 172" />
            </g>

            {/* ── SCALES OF JUSTICE BEAM & KEYHOLE CORE ── */}
            {/* Horizontal Balance Beam */}
            <path
                d="M 35 75 C 50 68, 75 62, 100 62 C 125 62, 150 68, 165 75"
                fill="none"
                stroke="url(#nbiGoldGrad)"
                strokeWidth="6"
                strokeLinecap="round"
                filter="url(#goldGlow)"
            />

            {/* Center Pillar & Keyhole Outer Ring */}
            <path
                d="M 100 60 C 86 60, 80 75, 80 92 C 80 108, 86 116, 90 120 C 86 135, 82 145, 100 150 C 118 145, 114 135, 110 120 C 114 116, 120 108, 120 92 C 120 75, 114 60, 100 60 Z"
                fill="url(#nbiGoldGrad)"
                filter="url(#goldGlow)"
            />

            {/* Inner Keyhole Cutout (Creamy / Transparent) */}
            <path
                d="M 100 80 A 9 9 0 1 0 100 98 A 9 9 0 0 0 100 80 Z M 95 94 L 105 94 L 108 128 L 92 128 Z"
                fill={isLight ? "#ffffff" : "#fdf8f0"}
            />

            {/* Left Balance Ring & Pan */}
            <circle cx="35" cy="75" r="5" fill="none" stroke="url(#nbiGoldGrad)" strokeWidth="3" />
            {/* Left Chains */}
            <path d="M 30 78 L 18 115 M 40 78 L 52 115" stroke="url(#nbiGoldGrad)" strokeWidth="2.5" strokeLinecap="round" />
            {/* Left Scale Pan Triangle Base */}
            <path
                d="M 14 115 L 56 115 Q 35 130 14 115 Z"
                fill="url(#nbiGoldGrad)"
            />

            {/* Right Balance Ring & Pan */}
            <circle cx="165" cy="75" r="5" fill="none" stroke="url(#nbiGoldGrad)" strokeWidth="3" />
            {/* Right Chains */}
            <path d="M 160 78 L 148 115 M 170 78 L 182 115" stroke="url(#nbiGoldGrad)" strokeWidth="2.5" strokeLinecap="round" />
            {/* Right Scale Pan Triangle Base */}
            <path
                d="M 144 115 L 186 115 Q 165 130 144 115 Z"
                fill="url(#nbiGoldGrad)"
            />
        </svg>
    );
}
