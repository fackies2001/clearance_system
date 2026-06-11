import InputError from '@/Components/InputError';
import Modal from '@/Components/Modal';
import { useForm } from '@inertiajs/react';
import { useRef, useState } from 'react';

export default function DeleteUserForm() {
    const [confirmingUserDeletion, setConfirmingUserDeletion] = useState(false);
    const passwordInput = useRef();

    const { data, setData, delete: destroy, processing, reset, errors, clearErrors } = useForm({
        password: '',
    });

    const confirmUserDeletion = () => setConfirmingUserDeletion(true);

    const deleteUser = (e) => {
        e.preventDefault();
        destroy(route('profile.destroy'), {
            preserveScroll: true,
            onSuccess: () => closeModal(),
            onError: () => passwordInput.current.focus(),
            onFinish: () => reset(),
        });
    };

    const closeModal = () => {
        setConfirmingUserDeletion(false);
        clearErrors();
        reset();
    };

    return (
        <section>
            <div className="mb-5">
                <h2 className="text-base font-black text-red-600 tracking-tight">Delete Account</h2>
                <p className="text-slate-500 text-sm mt-0.5">
                    Once your account is deleted, all of its resources and data will be permanently deleted.
                    Please download any data you wish to retain before proceeding.
                </p>
            </div>

            <button
                onClick={confirmUserDeletion}
                className="px-6 py-2.5 rounded-xl bg-red-600 text-white font-bold text-sm hover:bg-red-700 transition-all shadow-sm"
            >
                Delete Account
            </button>

            <Modal show={confirmingUserDeletion} onClose={closeModal}>
                <form onSubmit={deleteUser} className="p-6">
                    <div className="flex items-center gap-3 mb-4">
                        <div className="w-10 h-10 rounded-full bg-red-100 flex items-center justify-center flex-shrink-0">
                            <svg className="w-5 h-5 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01M10.29 3.86L1.82 18a2 2 0 001.71 3h16.94a2 2 0 001.71-3L13.71 3.86a2 2 0 00-3.42 0z" />
                            </svg>
                        </div>
                        <div>
                            <h2 className="text-base font-black text-[#0f172a]">Delete your account?</h2>
                            <p className="text-sm text-slate-500">This action cannot be undone.</p>
                        </div>
                    </div>

                    <p className="text-sm text-slate-600 mb-4">
                        All your data will be permanently deleted. Enter your password to confirm.
                    </p>

                    <div className="mb-5">
                        <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-1.5">
                            Password
                        </label>
                        <input
                            type="password"
                            ref={passwordInput}
                            value={data.password}
                            onChange={e => setData('password', e.target.value)}
                            className="w-full px-4 py-3 rounded-xl border border-slate-200 bg-white text-sm text-slate-800 focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-transparent transition-all"
                            placeholder="Enter your password"
                            autoFocus
                        />
                        <InputError message={errors.password} className="mt-1.5" />
                    </div>

                    <div className="flex justify-end gap-3">
                        <button
                            type="button"
                            onClick={closeModal}
                            className="px-5 py-2.5 rounded-xl border border-slate-200 text-slate-700 font-bold text-sm hover:bg-slate-50 transition-all"
                        >
                            Cancel
                        </button>
                        <button
                            type="submit"
                            disabled={processing}
                            className="px-5 py-2.5 rounded-xl bg-red-600 text-white font-bold text-sm hover:bg-red-700 transition-all disabled:opacity-60"
                        >
                            {processing ? 'Deleting...' : 'Yes, Delete Account'}
                        </button>
                    </div>
                </form>
            </Modal>
        </section>
    );
}