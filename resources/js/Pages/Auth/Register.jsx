import InputError from '@/Components/InputError';
import GuestLayout from '@/Layouts/GuestLayout';
import { Head, Link, useForm } from '@inertiajs/react';

export default function Register() {
    const { data, setData, post, processing, errors, reset } = useForm({
        name: '',
        email: '',
        password: '',
        password_confirmation: '',
    });

    const submit = (e) => {
        e.preventDefault();
        post(route('register'), {
            onFinish: () => reset('password', 'password_confirmation'),
        });
    };

    return (
        <GuestLayout>
            <Head title="Register" />

            <div className="mb-8">
                <h2 className="text-2xl font-black text-[#0f172a] tracking-tight">Create an account</h2>
                <p className="text-slate-500 text-sm mt-1">Register to apply for your NBI Clearance online.</p>
            </div>

            <form onSubmit={submit} className="space-y-5">
                <div>
                    <label className="block text-xs font-700 text-slate-500 uppercase tracking-wider mb-1.5">
                        Full Name
                    </label>
                    <input
                        type="text"
                        value={data.name}
                        onChange={e => setData('name', e.target.value)}
                        className="w-full px-4 py-3 rounded-xl border border-slate-200 bg-white text-sm text-slate-800 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                        placeholder="Juan Dela Cruz"
                        autoFocus
                        required
                    />
                    <InputError message={errors.name} className="mt-1.5" />
                </div>

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
                        placeholder="Min. 8 characters"
                        required
                    />
                    <InputError message={errors.password} className="mt-1.5" />
                </div>

                <div>
                    <label className="block text-xs font-700 text-slate-500 uppercase tracking-wider mb-1.5">
                        Confirm Password
                    </label>
                    <input
                        type="password"
                        value={data.password_confirmation}
                        onChange={e => setData('password_confirmation', e.target.value)}
                        className="w-full px-4 py-3 rounded-xl border border-slate-200 bg-white text-sm text-slate-800 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                        placeholder="••••••••"
                        required
                    />
                    <InputError message={errors.password_confirmation} className="mt-1.5" />
                </div>

                <button
                    type="submit"
                    disabled={processing}
                    className="w-full py-3 rounded-xl bg-[#1e3a5f] text-white font-bold text-sm hover:bg-[#1d4ed8] transition-all disabled:opacity-60 shadow-lg shadow-blue-900/20"
                >
                    {processing ? 'Creating account...' : 'Create Account →'}
                </button>

                <p className="text-center text-sm text-slate-500">
                    Already have an account?{' '}
                    <Link href={route('login')} className="text-blue-600 font-bold hover:text-blue-700">
                        Sign in here
                    </Link>
                </p>
            </form>
        </GuestLayout>
    );
}