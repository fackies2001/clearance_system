import React from 'react';
import { Head, Link } from '@inertiajs/react';
import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';

const STATUS_CONFIG = {
    pending: { label: 'Pending Review', color: 'text-gray-500', icon: '🕐' },
    under_review: { label: 'Under Verification', color: 'text-blue-500', icon: '🔍' },
    biometrics_captured: { label: 'Under Verification', color: 'text-purple-500', icon: '🔍' },
    hit: { label: 'Under Verification', color: 'text-orange-500', icon: '⚠️' },
    approved: { label: 'Ready for Release', color: 'text-green-500', icon: '✅' },
    released: { label: 'Released', color: 'text-emerald-600', icon: '🎉' },
    rejected: { label: 'Rejected', color: 'text-red-500', icon: '❌' },
};

const TimelineItem = ({ step, active, completed, date }) => (
    <div className={`flex items-start gap-4 ${completed ? 'opacity-100' : 'opacity-40'}`}>
        <div className="flex flex-col items-center">
            <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold border-2 ${
                completed ? 'bg-blue-600 border-blue-600 text-white' : 'bg-white border-gray-300 text-gray-400'
            }`}>
                {completed ? '✓' : step}
            </div>
            <div className={`w-0.5 h-12 ${completed ? 'bg-blue-600' : 'bg-gray-200'}`} />
        </div>
        <div className="pt-1 pb-8">
            <h4 className={`text-sm font-bold ${completed ? 'text-gray-900' : 'text-gray-400'}`}>{active}</h4>
            {date && <p className="text-xs text-gray-500">{new Date(date).toLocaleDateString('en-PH', { month: 'short', day: 'numeric', year: 'numeric' })}</p>}
        </div>
    </div>
);

export default function Status({ auth, clearances }) {
    const clearance = clearances[0]; // Most recent

    if (!clearance) {
        return (
            <AuthenticatedLayout user={auth.user}>
                <Head title="Application Status" />
                <div className="py-12">
                    <div className="max-w-4xl mx-auto sm:px-6 lg:px-8 text-center text-gray-500">
                        No applications found. <Link href={route('apply.form')} className="text-blue-600 underline">Apply now</Link>.
                    </div>
                </div>
            </AuthenticatedLayout>
        );
    }

    const currentIdx = Object.keys(STATUS_CONFIG).indexOf(clearance.workflow_status);
    const steps = [
        { key: 'pending', label: 'Application Submitted' },
        { key: 'under_review', label: 'Admin Review' },
        { key: 'biometrics_captured', label: 'Biometrics Captured' },
        { key: 'approved', label: 'Ready for Release' },
        { key: 'released', label: 'Released' },
    ];

    return (
        <AuthenticatedLayout user={auth.user}>
            <Head title="Application Status" />

            <div className="py-12">
                <div className="max-w-4xl mx-auto sm:px-6 lg:px-8">
                    <div className="bg-white overflow-hidden shadow-sm sm:rounded-lg p-8">
                        <div className="flex justify-between items-start mb-8 border-b pb-6">
                            <div>
                                <h2 className="text-2xl font-bold text-gray-900 uppercase tracking-tight">Application Status</h2>
                                <p className="text-sm text-gray-500 mt-1">Tracking NO: <span className="font-mono font-bold text-gray-800">{clearance.tracking_no}</span></p>
                            </div>
                            <div className="text-right">
                                <span className={`inline-flex items-center gap-2 px-4 py-2 rounded-full text-xs font-bold uppercase tracking-wider border-2 ${
                                    STATUS_CONFIG[clearance.workflow_status]?.color.replace('text-', 'bg-').replace('-500', '-50') + ' ' +
                                    STATUS_CONFIG[clearance.workflow_status]?.color.replace('text-', 'border-').replace('-500', '-200') + ' ' +
                                    STATUS_CONFIG[clearance.workflow_status]?.color
                                }`}>
                                    <span className="animate-pulse">{STATUS_CONFIG[clearance.workflow_status]?.icon}</span>
                                    {STATUS_CONFIG[clearance.workflow_status]?.label}
                                </span>
                            </div>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-12 mt-8">
                            {/* Timeline section */}
                            <div>
                                <h3 className="text-sm font-black text-gray-400 uppercase tracking-widest mb-6">Process Timeline</h3>
                                <div className="ml-2">
                                    {steps.map((s, i) => {
                                        const isCompleted = Object.keys(STATUS_CONFIG).indexOf(clearance.workflow_status) >= Object.keys(STATUS_CONFIG).indexOf(s.key);
                                        return (
                                            <TimelineItem 
                                                key={s.key}
                                                step={i + 1}
                                                active={s.label}
                                                completed={isCompleted}
                                                date={isCompleted ? (s.key === 'pending' ? clearance.created_at : (s.key === 'released' ? clearance.released_at : null)) : null}
                                            />
                                        );
                                    })}
                                </div>
                            </div>

                            {/* Details section */}
                            <div className="space-y-6">
                                <div className="bg-slate-50 p-6 rounded-2xl border border-slate-100">
                                    <h3 className="text-sm font-black text-gray-400 uppercase tracking-widest mb-4">Payment Information</h3>
                                    <div className="space-y-3">
                                        <div className="flex justify-between items-center text-sm">
                                            <span className="text-gray-500 font-medium">Status</span>
                                            <span className={`font-bold px-2 py-0.5 rounded text-[10px] uppercase border ${
                                                clearance.payment_status === 'paid' 
                                                ? 'bg-green-50 border-green-200 text-green-700' 
                                                : 'bg-yellow-50 border-yellow-200 text-yellow-700'
                                            }`}>
                                                {clearance.payment_status || 'unpaid'}
                                            </span>
                                        </div>
                                        <div className="flex justify-between items-center text-sm">
                                            <span className="text-gray-500 font-medium">Method</span>
                                            <span className="font-bold text-gray-900 uppercase">{clearance.payment_method || '—'}</span>
                                        </div>
                                        {clearance.payment_status !== 'paid' && (
                                            <Link 
                                                href={route('payment.show', clearance.tracking_no)}
                                                className="block w-full mt-4 text-center py-2 bg-blue-600 text-white rounded-lg font-bold text-sm hover:bg-blue-700 transition shadow-lg shadow-blue-200"
                                            >
                                                Pay Now
                                            </Link>
                                        )}
                                    </div>
                                </div>

                                {clearance.workflow_status === 'released' && (
                                    <div className="bg-emerald-50 p-6 rounded-2xl border border-emerald-100">
                                        <h3 className="text-sm font-black text-emerald-600 uppercase tracking-widest mb-4">Action Required</h3>
                                        <p className="text-sm text-emerald-800 mb-4">Your clearance certificate is now available for download.</p>
                                        <Link 
                                            href={route('clearance.view', clearance.tracking_no)}
                                            className="block w-full text-center py-3 bg-emerald-600 text-white rounded-lg font-bold text-sm hover:bg-emerald-700 transition shadow-lg shadow-emerald-200"
                                        >
                                            View Clearance Certificate
                                        </Link>
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </AuthenticatedLayout>
    );
}
