import { Head, useForm } from '@inertiajs/react';
import GuestLayout from '@/Layouts/GuestLayout';

export default function TwoFactor({ status }) {
    const { data, setData, post, processing, errors, reset } = useForm({
        code: '',
    });

    const handleVerify = (e) => {
        e.preventDefault();
        post(route('two-factor.verify'), {
            onFinish: () => reset('code'),
        });
    };

    const handleResend = (e) => {
        e.preventDefault();
        post(route('two-factor.resend'));
    };

    return (
        <GuestLayout>
            <Head title="Two-Factor Verification" />

            {/* Header */}
            <div className="mb-8 text-center">
                <div className="mx-auto mb-4 w-16 h-16 rounded-2xl bg-[#1e3a5f] flex items-center justify-center shadow-lg shadow-blue-900/20">
                    <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                            d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                    </svg>
                </div>
                <h2 className="text-2xl font-black text-[#0f172a] tracking-tight">Email Verification</h2>
                <p className="mt-1.5 text-sm text-slate-500 leading-relaxed">
                    We sent a 6-digit OTP to your email address.<br />
                    Enter it below to continue.
                </p>
            </div>

            {/* Status message */}
            {status && (
                <div className="mb-4 rounded-xl bg-green-50 border border-green-200 px-4 py-3 text-center text-sm text-green-700 font-medium">
                    ✓ {status}
                </div>
            )}

            {/* OTP Form */}
            <form onSubmit={handleVerify} className="space-y-5">
                <div>
                    <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-2 text-center">
                        One-Time Password
                    </label>
                    <input
                        type="text"
                        inputMode="numeric"
                        maxLength={6}
                        value={data.code}
                        onChange={(e) => setData('code', e.target.value.replace(/\D/g, ''))}
                        placeholder="• • • • • •"
                        className="w-full px-4 py-4 rounded-xl border border-slate-200 bg-white text-center text-3xl font-black tracking-[0.5em] text-[#0f172a] focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all placeholder:text-slate-300 placeholder:tracking-widest"
                        autoFocus
                    />
                    {errors.code && (
                        <p className="mt-2 text-sm text-red-600 text-center font-medium">{errors.code}</p>
                    )}
                </div>

                <button
                    type="submit"
                    disabled={processing || data.code.length !== 6}
                    className="w-full py-3 rounded-xl bg-[#1e3a5f] text-white font-bold text-sm hover:bg-[#1d4ed8] transition-all disabled:opacity-50 disabled:cursor-not-allowed shadow-lg shadow-blue-900/20"
                >
                    {processing ? 'Verifying...' : 'Verify OTP →'}
                </button>
            </form>

            {/* Resend */}
            <p className="mt-5 text-center text-sm text-slate-500">
                Didn't receive the code?{' '}
                <button
                    onClick={handleResend}
                    disabled={processing}
                    className="text-blue-600 font-bold hover:text-blue-700 disabled:opacity-50 transition-colors"
                >
                    Resend OTP
                </button>
            </p>

            {/* Warning */}
            <div className="mt-5 rounded-xl bg-amber-50 border border-amber-200 px-4 py-3 text-center text-xs text-amber-700">
                <span className="font-bold">⚠️ OTP is valid for 10 minutes only.</span><br />
                Do not share this code with anyone.
            </div>
        </GuestLayout>
    );
}