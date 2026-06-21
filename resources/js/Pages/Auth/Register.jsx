import InputError from '@/Components/InputError';
import GuestLayout from '@/Layouts/GuestLayout';
import { Head, Link, useForm } from '@inertiajs/react';
import PasswordStrengthChecklist from '@/Components/PasswordStrengthChecklist';

export default function Register() {
    const { data, setData, post, processing, errors, reset } = useForm({
        first_name: '',
        middle_name: '',
        last_name: '',
        gender: '',
        civil_status: '',
        birth_year: '',
        birth_month: '',
        birth_day: '',
        mobile_number: '',
        email: '',
        password: '',
        password_confirmation: '',
    });

    const submit = (e) => {
        e.preventDefault();

        // Combine name fields before submitting
        const middleInitial = data.middle_name ? data.middle_name.trim() : '';
        const fullName = [data.first_name.trim(), middleInitial, data.last_name.trim()]
            .filter(Boolean)
            .join(' ');

        post(route('register'), {
            data: {
                ...data,
                name: fullName,
            },
            onFinish: () => reset('password', 'password_confirmation'),
        });
    };

    const years = Array.from({ length: 100 }, (_, i) => new Date().getFullYear() - i);
    const months = [
        'January','February','March','April','May','June',
        'July','August','September','October','November','December'
    ];
    const days = Array.from({ length: 31 }, (_, i) => i + 1);

    const selectClass = "w-full px-4 py-3 rounded-xl border border-slate-200 bg-white text-sm text-slate-800 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all appearance-none";
    const inputClass  = "w-full px-4 py-3 rounded-xl border border-slate-200 bg-white text-sm text-slate-800 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all";
    const labelClass  = "block text-xs font-bold text-slate-500 uppercase tracking-wider mb-1.5";

    return (
        <GuestLayout>
            <Head title="Register" />

            <div className="mb-6">
                <h2 className="text-2xl font-black text-[#0f172a] tracking-tight">Create an account</h2>
                <p className="text-slate-500 text-sm mt-1">Register to apply for your NBI Clearance online.</p>
            </div>

            <form onSubmit={submit} className="space-y-4">

                {/* Gender + Civil Status */}
                <div className="grid grid-cols-2 gap-3">
                    <div>
                        <label className={labelClass}>Gender</label>
                        <div className="relative">
                            <select value={data.gender} onChange={e => setData('gender', e.target.value)} className={selectClass} required>
                                <option value="">Sex</option>
                                <option value="Male">Male</option>
                                <option value="Female">Female</option>
                            </select>
                            <span className="pointer-events-none absolute inset-y-0 right-3 flex items-center text-slate-400">
                                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" /></svg>
                            </span>
                        </div>
                        <InputError message={errors.gender} className="mt-1.5" />
                    </div>
                    <div>
                        <label className={labelClass}>Civil Status</label>
                        <div className="relative">
                            <select value={data.civil_status} onChange={e => setData('civil_status', e.target.value)} className={selectClass} required>
                                <option value="">Civil Status</option>
                                <option value="Single">Single</option>
                                <option value="Married">Married</option>
                                <option value="Widowed">Widowed</option>
                                <option value="Separated">Separated</option>
                            </select>
                            <span className="pointer-events-none absolute inset-y-0 right-3 flex items-center text-slate-400">
                                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" /></svg>
                            </span>
                        </div>
                        <InputError message={errors.civil_status} className="mt-1.5" />
                    </div>
                </div>

                {/* Birthdate */}
                <div>
                    <label className={labelClass}>Birth Date</label>
                    <div className="grid grid-cols-3 gap-2">
                        <div className="relative">
                            <select value={data.birth_year} onChange={e => setData('birth_year', e.target.value)} className={selectClass} required>
                                <option value="">- Year -</option>
                                {years.map(y => <option key={y} value={y}>{y}</option>)}
                            </select>
                            <span className="pointer-events-none absolute inset-y-0 right-3 flex items-center text-slate-400">
                                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" /></svg>
                            </span>
                        </div>
                        <div className="relative">
                            <select value={data.birth_month} onChange={e => setData('birth_month', e.target.value)} className={selectClass} required>
                                <option value="">- Month -</option>
                                {months.map((m, i) => <option key={i} value={String(i + 1).padStart(2, '0')}>{m}</option>)}
                            </select>
                            <span className="pointer-events-none absolute inset-y-0 right-3 flex items-center text-slate-400">
                                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" /></svg>
                            </span>
                        </div>
                        <div className="relative">
                            <select value={data.birth_day} onChange={e => setData('birth_day', e.target.value)} className={selectClass} required>
                                <option value="">- Day -</option>
                                {days.map(d => <option key={d} value={String(d).padStart(2, '0')}>{d}</option>)}
                            </select>
                            <span className="pointer-events-none absolute inset-y-0 right-3 flex items-center text-slate-400">
                                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" /></svg>
                            </span>
                        </div>
                    </div>
                </div>

                {/* First Name */}
                <div>
                    <label className={labelClass}>First Name</label>
                    <input
                        type="text"
                        value={data.first_name}
                        onChange={e => setData('first_name', e.target.value)}
                        className={inputClass}
                        placeholder="Ex. JUAN, MARIA JOSE"
                        required
                    />
                    <InputError message={errors.first_name} className="mt-1.5" />
                </div>

                {/* Middle Name */}
                <div>
                    <label className={labelClass}>Middle Name</label>
                    <input
                        type="text"
                        value={data.middle_name}
                        onChange={e => setData('middle_name', e.target.value)}
                        className={inputClass}
                        placeholder="Middle Name (optional)"
                    />
                    <InputError message={errors.middle_name} className="mt-1.5" />
                </div>

                {/* Last Name */}
                <div>
                    <label className={labelClass}>Last Name</label>
                    <input
                        type="text"
                        value={data.last_name}
                        onChange={e => setData('last_name', e.target.value)}
                        className={inputClass}
                        placeholder="Surname"
                        required
                    />
                    <InputError message={errors.last_name} className="mt-1.5" />
                </div>

                {/* Mobile Number */}
                <div>
                    <label className={labelClass}>Mobile Number</label>
                    <input
                        type="tel"
                        value={data.mobile_number}
                        onChange={e => setData('mobile_number', e.target.value)}
                        className={inputClass}
                        placeholder="09XXXXXXXXX"
                        maxLength={11}
                        required
                    />
                    <InputError message={errors.mobile_number} className="mt-1.5" />
                </div>

                {/* Email */}
                <div>
                    <label className={labelClass}>Email Address <span className="normal-case text-slate-400 font-normal">(must be active)</span></label>
                    <input
                        type="email"
                        value={data.email}
                        onChange={e => setData('email', e.target.value)}
                        className={inputClass}
                        placeholder="you@email.com"
                        required
                    />
                    <InputError message={errors.email} className="mt-1.5" />
                </div>

                {/* Password + Confirm side by side */}
                <div className="grid grid-cols-2 gap-3">
                    <div>
                        <label className={labelClass}>Password</label>
                        <input
                            type="password"
                            value={data.password}
                            onChange={e => setData('password', e.target.value)}
                            className={inputClass}
                            placeholder="Min. 8 characters"
                            required
                        />
                        <InputError message={errors.password} className="mt-1.5" />
                        <PasswordStrengthChecklist password={data.password} />
                    </div>
                    <div>
                        <label className={labelClass}>Confirm Password</label>
                        <input
                            type="password"
                            value={data.password_confirmation}
                            onChange={e => setData('password_confirmation', e.target.value)}
                            className={inputClass}
                            placeholder="••••••••"
                            required
                        />
                        <InputError message={errors.password_confirmation} className="mt-1.5" />
                    </div>
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