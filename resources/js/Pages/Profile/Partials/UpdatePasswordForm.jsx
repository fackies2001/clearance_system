import InputError from '@/Components/InputError';
import { Transition } from '@headlessui/react';
import { useForm } from '@inertiajs/react';
import { useRef } from 'react';
import PasswordStrengthChecklist from '@/Components/PasswordStrengthChecklist';

const inputClass = "w-full px-4 py-3 rounded-xl border border-slate-200 bg-white text-sm text-slate-800 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all";
const labelClass = "block text-xs font-bold text-slate-500 uppercase tracking-wider mb-1.5";

export default function UpdatePasswordForm() {
    const passwordInput = useRef();
    const currentPasswordInput = useRef();

    const { data, setData, errors, put, reset, processing, recentlySuccessful } = useForm({
        current_password: '',
        password: '',
        password_confirmation: '',
    });

    const updatePassword = (e) => {
        e.preventDefault();
        put(route('password.update'), {
            preserveScroll: true,
            onSuccess: () => reset(),
            onError: (errors) => {
                if (errors.password) {
                    reset('password', 'password_confirmation');
                    passwordInput.current.focus();
                }
                if (errors.current_password) {
                    reset('current_password');
                    currentPasswordInput.current.focus();
                }
            },
        });
    };

    return (
        <section>
            <div className="mb-5">
                <h2 className="text-base font-black text-[#0f172a] tracking-tight">Update Password</h2>
                <p className="text-slate-500 text-sm mt-0.5">Ensure your account is using a long, random password to stay secure.</p>
            </div>

            <form onSubmit={updatePassword} className="space-y-4">
                <div>
                    <label className={labelClass}>Current Password</label>
                    <input
                        type="password"
                        ref={currentPasswordInput}
                        value={data.current_password}
                        onChange={e => setData('current_password', e.target.value)}
                        className={inputClass}
                        placeholder="Enter current password"
                        autoComplete="current-password"
                    />
                    <InputError message={errors.current_password} className="mt-1.5" />
                </div>

                <div className="grid grid-cols-2 gap-3">
                    <div>
                        <label className={labelClass}>New Password</label>
                        <input
                            type="password"
                            ref={passwordInput}
                            value={data.password}
                            onChange={e => setData('password', e.target.value)}
                            className={inputClass}
                            placeholder="Min. 8 characters"
                            autoComplete="new-password"
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
                            autoComplete="new-password"
                        />
                        <InputError message={errors.password_confirmation} className="mt-1.5" />
                    </div>
                </div>

                <div className="flex items-center gap-4 pt-1">
                    <button
                        type="submit"
                        disabled={processing}
                        className="px-6 py-2.5 rounded-xl bg-[#1e3a5f] text-white font-bold text-sm hover:bg-[#1d4ed8] transition-all disabled:opacity-60 shadow-sm"
                    >
                        {processing ? 'Updating...' : 'Update Password'}
                    </button>
                    <Transition
                        show={recentlySuccessful}
                        enter="transition ease-in-out duration-300"
                        enterFrom="opacity-0"
                        leave="transition ease-in-out duration-300"
                        leaveTo="opacity-0"
                    >
                        <span className="text-sm text-green-600 font-medium flex items-center gap-1">
                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" /></svg>
                            Saved!
                        </span>
                    </Transition>
                </div>
            </form>
        </section>
    );
}