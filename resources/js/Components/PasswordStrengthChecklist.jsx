export default function PasswordStrengthChecklist({ password = '' }) {
    const requirements = [
        { label: 'At least 8 characters', test: (pw) => pw.length >= 8 },
        { label: 'One uppercase letter', test: (pw) => /[A-Z]/.test(pw) },
        { label: 'One lowercase letter', test: (pw) => /[a-z]/.test(pw) },
        { label: 'One number', test: (pw) => /[0-9]/.test(pw) },
        { label: 'One special character', test: (pw) => /[^A-Za-z0-9]/.test(pw) },
    ];

    if (!password) return null;

    return (
        <ul className="mt-2 space-y-1">
            {requirements.map((req, i) => {
                const passed = req.test(password);
                return (
                    <li
                        key={i}
                        className={`flex items-center gap-1.5 text-xs transition-colors ${
                            passed ? 'text-green-600' : 'text-slate-400'
                        }`}
                    >
                        {passed ? (
                            <svg className="w-3.5 h-3.5 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                            </svg>
                        ) : (
                            <svg className="w-3.5 h-3.5 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                            </svg>
                        )}
                        {req.label}
                    </li>
                );
            })}
        </ul>
    );
}