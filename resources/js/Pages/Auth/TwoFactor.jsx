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
            <Head title="Two Factor Authentication" />

            {/* Header */}
            <div className="mb-6 text-center">
                <div className="mx-auto mb-3 flex h-14 w-14 items-center justify-center rounded-full bg-blue-100">
                    <svg className="h-7 w-7 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                            d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                    </svg>
                </div>
                <h2 className="text-xl font-bold text-gray-800">Two-Factor Verification</h2>
                <p className="mt-1 text-sm text-gray-500">
                    We sent a 6-digit OTP to your email address. <br />
                    Please enter it below to continue.
                </p>
            </div>

            {/* Status message */}
            {status && (
                <div className="mb-4 rounded-lg bg-green-50 p-3 text-center text-sm text-green-700">
                    {status}
                </div>
            )}

            {/* OTP Form */}
            <form onSubmit={handleVerify}>
                <div className="mb-4">
                    <label className="mb-1 block text-sm font-medium text-gray-700">
                        OTP Code
                    </label>
                    <input
                        type="text"
                        maxLength={6}
                        value={data.code}
                        onChange={(e) => setData('code', e.target.value.replace(/\D/g, ''))}
                        placeholder="000000"
                        className="w-full rounded-lg border border-gray-300 px-4 py-3 text-center text-2xl font-bold tracking-widest focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
                        autoFocus
                    />
                    {errors.code && (
                        <p className="mt-1 text-sm text-red-600">{errors.code}</p>
                    )}
                </div>

                {/* Verify Button */}
                <button
                    type="submit"
                    disabled={processing || data.code.length !== 6}
                    className="w-full rounded-lg bg-blue-600 px-4 py-3 font-semibold text-white transition hover:bg-blue-700 disabled:cursor-not-allowed disabled:opacity-50"
                >
                    {processing ? 'Verifying...' : 'Verify OTP'}
                </button>
            </form>

            {/* Resend OTP */}
            <div className="mt-4 text-center">
                <p className="text-sm text-gray-500">
                    Didn't receive the code?{' '}
                    <button
                        onClick={handleResend}
                        disabled={processing}
                        className="font-medium text-blue-600 hover:underline disabled:opacity-50"
                    >
                        Resend OTP
                    </button>
                </p>
            </div>

            {/* Warning */} 
            <div className="mt-4 rounded-lg bg-yellow-50 p-3 text-center text-xs text-yellow-700">
                ⚠️ OTP is valid for <strong>10 minutes</strong> only. Do not share this code with anyone.
            </div>
        </GuestLayout>
    );
}