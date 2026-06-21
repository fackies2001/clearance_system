import InputError from '@/Components/InputError';
import { Transition } from '@headlessui/react';
import { Link, useForm, usePage } from '@inertiajs/react';
import { useState, useRef } from 'react';

const inputClass  = "w-full px-4 py-3 rounded-xl border border-slate-200 bg-white text-sm text-slate-800 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all";
const labelClass  = "block text-xs font-bold text-slate-500 uppercase tracking-wider mb-1.5";

export default function UpdateProfileInformation({ mustVerifyEmail, status }) {
    const user = usePage().props.auth.user;
    const avatarInput = useRef();
    const [avatarPreview, setAvatarPreview] = useState(null);

    const { data, setData, patch, errors, processing, recentlySuccessful } = useForm({
        name: user.name,
        email: user.email,
        avatar: null,
    });

    const submit = (e) => {
        e.preventDefault();
        patch(route('profile.update'), {
            forceFormData: true,
        });
    };

    const handleAvatarChange = (e) => {
        const file = e.target.files[0];
        if (file) {
            setData('avatar', file);
            setAvatarPreview(URL.createObjectURL(file));
        }

    };


    return (
        <section>
            <div className="mb-5">
                <h2 className="text-base font-black text-[#0f172a] tracking-tight">Profile Information</h2>
                <p className="text-slate-500 text-sm mt-0.5">Update your account's profile information and email address.</p>
            </div>

            <form onSubmit={submit} className="space-y-4">
                <div>
                    <label className={labelClass}>Full Name</label>
                    <input
                        type="text"
                        value={data.name}
                        onChange={e => setData('name', e.target.value)}
                        className={inputClass}
                        placeholder="Juan Dela Cruz"
                        required
                        autoFocus
                    />
                    <InputError message={errors.name} className="mt-1.5" />
                </div>

                <div>
                    <label className={labelClass}>Email Address</label>
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

                {mustVerifyEmail && user.email_verified_at === null && (
                    <div className="rounded-xl bg-yellow-50 border border-yellow-200 px-4 py-3 text-sm text-yellow-800">
                        Your email address is unverified.{' '}
                        <Link
                            href={route('verification.send')}
                            method="post"
                            as="button"
                            className="font-bold underline hover:text-yellow-900"
                        >
                            Click here to re-send the verification email.
                        </Link>
                        {status === 'verification-link-sent' && (
                            <p className="mt-1 font-medium text-green-600">
                                A new verification link has been sent to your email address.
                            </p>
                        )}
                    </div>
                )}

                <div className="flex items-center gap-4 pt-1">
                    <button
                        type="submit"
                        disabled={processing}
                        className="px-6 py-2.5 rounded-xl bg-[#1e3a5f] text-white font-bold text-sm hover:bg-[#1d4ed8] transition-all disabled:opacity-60 shadow-sm"
                    >
                        {processing ? 'Saving...' : 'Save Changes'}
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

                                <div className="flex items-center gap-4">
                    <button
                        type="button"
                        onClick={() => avatarInput.current.click()}
                        className="relative w-16 h-16 rounded-full overflow-hidden border-2 border-slate-200 flex-shrink-0 group"
                    >
                        {(avatarPreview || user.avatar_url) ? (
                            <img
                                src={avatarPreview || user.avatar_url}
                                alt="Avatar"
                                className="w-full h-full object-cover"
                            />
                        ) : (
                            <div className="w-full h-full bg-[#1e3a5f] flex items-center justify-center text-white font-bold text-lg">
                                {user.name?.charAt(0).toUpperCase()}
                            </div>
                        )}
                        <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 flex items-center justify-center transition-opacity">
                            <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 9a2 2 0 012-2h.93a2 2 0 001.664-.89l.812-1.22A2 2 0 0110.07 4h3.86a2 2 0 011.664.89l.812 1.22A2 2 0 0018.07 7H19a2 2 0 012 2v9a2 2 0 01-2 2H5a2 2 0 01-2-2V9z" />
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 13a3 3 0 11-6 0 3 3 0 016 0z" />
                            </svg>
                        </div>
                    </button>
                    <div>
                        <button
                            type="button"
                            onClick={() => avatarInput.current.click()}
                            className="text-sm font-bold text-blue-600 hover:text-blue-700"
                        >
                            Change Photo
                        </button>
                        <p className="text-xs text-slate-400 mt-0.5">JPG or PNG, max 2MB</p>
                        <input
                            type="file"
                            ref={avatarInput}
                            onChange={handleAvatarChange}
                            accept="image/png, image/jpeg, image/jpg"
                            className="hidden"
                        />
                        <InputError message={errors.avatar} className="mt-1" />
                    </div>
                </div>
            </form>
        </section>
    );
}