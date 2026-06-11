import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head } from '@inertiajs/react';
import DeleteUserForm from './Partials/DeleteUserForm';
import UpdatePasswordForm from './Partials/UpdatePasswordForm';
import UpdateProfileInformationForm from './Partials/UpdateProfileInformationForm';

export default function Edit({ mustVerifyEmail, status }) {
    return (
        <AuthenticatedLayout
            header={
                <h2 className="text-xl font-semibold leading-tight text-gray-800">
                    Profile
                </h2>
            }
        >
            <Head title="Profile" />

            <div className="py-10">
                <div className="mx-auto max-w-2xl space-y-6 px-4 sm:px-6">

                    {/* Profile Info */}
                    <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-6">
                        <UpdateProfileInformationForm
                            mustVerifyEmail={mustVerifyEmail}
                            status={status}
                        />
                    </div>

                    {/* Update Password */}
                    <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-6">
                        <UpdatePasswordForm />
                    </div>

                    {/* Delete Account */}
                    <div className="bg-white rounded-2xl border border-red-100 shadow-sm p-6">
                        <DeleteUserForm />
                    </div>

                </div>
            </div>
        </AuthenticatedLayout>
    );
}