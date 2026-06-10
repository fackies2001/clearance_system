import Checkbox from '@/Components/Checkbox';
import InputError from '@/Components/InputError';
import GuestLayout from '@/Layouts/GuestLayout';
import { Head, Link, useForm } from '@inertiajs/react';

export default function Login({ status, canResetPassword }) {
    const { data, setData, post, processing, errors, reset } = useForm({
        email: '',
        password: '',
        remember: false,
    });

    const submit = (e) => {
        e.preventDefault();
        post(route('login'), {
            onFinish: () => reset('password'),
        });
    };

    return (
        <GuestLayout>
            <Head title="Log in" />

            <div className="mb-8">
                <h2 className="text-2xl font-black text-[#0f172a] tracking-tight">Welcome back</h2>
                <p className="text-slate-500 text-sm mt-1">Sign in to your NBI account to continue.</p>
            </div>

            {status && (
                <div className="mb-4 text-sm font-medium text-emerald-600 bg-emerald-50 px-4 py-3 rounded-xl border border-emerald-200">
                    {status}
                </div>
            )}

            <form onSubmit={submit} className="space-y-5">
                <div>
                    <label className="block text-xs font-700 text-slate-500 uppercase tracking-wider mb-1.5">
                        Email Address
                    </label>
                    <input
                        type="email"
                        value={data.email}
                        onChange={e => setData('email', e.target.value)}
                        className="w-full px-4 py-3 rounded-xl border border-slate-200 bg-white text-sm text-slate-800 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                        placeholder="you@email.com"
                        autoFocus
                        required
                    />
                    <InputError message={errors.email} className="mt-1.5" />
                </div>

                <div>
                    <label className="block text-xs font-700 text-slate-500 uppercase tracking-wider mb-1.5">
                        Password
                    </label>
                    <input
                        type="password"
                        value={data.password}
                        onChange={e => setData('password', e.target.value)}
                        className="w-full px-4 py-3 rounded-xl border border-slate-200 bg-white text-sm text-slate-800 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                        placeholder="••••••••"
                        required
                    />
                    <InputError message={errors.password} className="mt-1.5" />
                </div>

                <div className="flex items-center justify-between">
                    <label className="flex items-center gap-2 cursor-pointer">
                        <Checkbox
                            checked={data.remember}
                            onChange={e => setData('remember', e.target.checked)}
                        />
                        <span className="text-sm text-slate-600">Remember me</span>
                    </label>
                    {canResetPassword && (
                        <Link href={route('password.request')} className="text-sm text-blue-600 hover:text-blue-700 font-medium">
                            Forgot password?
                        </Link>
                    )}
                </div>

                <button
                    type="submit"
                    disabled={processing}
                    className="w-full py-3 rounded-xl bg-[#1e3a5f] text-white font-bold text-sm hover:bg-[#1d4ed8] transition-all disabled:opacity-60 shadow-lg shadow-blue-900/20"
                >
                    {processing ? 'Signing in...' : 'Sign In →'}
                </button>

                <p className="text-center text-sm text-slate-500">
                    Don't have an account?{' '}
                    <Link href={route('register')} className="text-blue-600 font-bold hover:text-blue-700">
                        Create one here
                    </Link>
                </p>
            </form>
        </GuestLayout>
    );
}