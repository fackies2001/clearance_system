import React from 'react';
import { Head, Link } from '@inertiajs/react';
import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';

const METHOD_LABELS = {
    gcash: 'GCash',
    maya: 'Maya',
    bank_transfer: 'Bank Transfer',
    walkin: 'Walk-in Cash',
};

export default function Receipt({ clearance }) {
    const handlePrint = () => {
        window.print();
    };

    const formatDate = (dateStr) => {
        if (!dateStr) return '—';
        return new Date(dateStr).toLocaleDateString('en-US', {
            year: 'numeric',
            month: 'long',
            day: 'numeric',
            hour: '2-digit',
            minute: '2-digit',
        });
    };

    const headerContent = (
        <div className="flex items-center gap-3">
            <div className="p-2 bg-emerald-50 rounded-xl">
                <svg className="w-6 h-6 text-emerald-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
            </div>
            <h2 className="font-bold text-xl text-slate-900">Payment Receipt</h2>
        </div>
    );

    return (
        <AuthenticatedLayout header={headerContent}>
            <Head title="Payment — Receipt" />

            <div className="max-w-lg mx-auto py-8 px-4">

                {/* Receipt Card */}
                <div id="receipt-card" className="bg-white rounded-3xl border border-slate-200 shadow-xl overflow-hidden">

                    {/* Success Banner */}
                    <div className="bg-gradient-to-br from-emerald-500 via-emerald-600 to-teal-700 px-6 py-10 text-center relative overflow-hidden">
                        {/* Decorative rings */}
                        <div className="absolute inset-0 opacity-10">
                            <div className="absolute -top-10 -left-10 w-40 h-40 border-4 border-white rounded-full" />
                            <div className="absolute -bottom-10 -right-10 w-48 h-48 border-4 border-white rounded-full" />
                        </div>

                        <div className="relative z-10">
                            {/* Animated checkmark */}
                            <div className="mx-auto w-20 h-20 bg-white/20 rounded-full flex items-center justify-center mb-4 backdrop-blur-sm border-2 border-white/30">
                                <div className="w-14 h-14 bg-white rounded-full flex items-center justify-center shadow-lg">
                                    <svg className="w-8 h-8 text-emerald-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M5 13l4 4L19 7" />
                                    </svg>
                                </div>
                            </div>
                            <h2 className="text-white text-2xl font-black mb-1">Payment Successful!</h2>
                            <p className="text-emerald-100 text-sm">Your NBI Clearance application fee has been received.</p>
                        </div>
                    </div>

                    {/* Receipt Details */}
                    <div className="px-6 py-6">
                        {/* Dashed separator (receipt style) */}
                        <div className="border-t-2 border-dashed border-slate-200 mb-6 -mx-6" />

                        <div className="space-y-4">
                            <div className="flex justify-between items-center py-2">
                                <span className="text-xs text-slate-400 font-semibold uppercase tracking-wider">Applicant</span>
                                <span className="text-sm text-slate-900 font-bold text-right max-w-[60%]">{clearance.full_name}</span>
                            </div>

                            <div className="flex justify-between items-center py-2 border-t border-slate-100">
                                <span className="text-xs text-slate-400 font-semibold uppercase tracking-wider">Purpose</span>
                                <span className="text-sm text-slate-700 font-medium">{clearance.purpose}</span>
                            </div>

                            <div className="flex justify-between items-center py-2 border-t border-slate-100">
                                <span className="text-xs text-slate-400 font-semibold uppercase tracking-wider">Tracking No.</span>
                                <span className="text-sm text-blue-600 font-mono font-bold">{clearance.tracking_no}</span>
                            </div>

                            <div className="flex justify-between items-center py-2 border-t border-slate-100">
                                <span className="text-xs text-slate-400 font-semibold uppercase tracking-wider">Reference No.</span>
                                <span className="text-sm text-slate-700 font-mono font-semibold">{clearance.payment_reference}</span>
                            </div>

                            <div className="flex justify-between items-center py-2 border-t border-slate-100">
                                <span className="text-xs text-slate-400 font-semibold uppercase tracking-wider">Payment Method</span>
                                <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-bold bg-slate-100 text-slate-700 border border-slate-200">
                                    {METHOD_LABELS[clearance.payment_method] || clearance.payment_method}
                                </span>
                            </div>

                            <div className="flex justify-between items-center py-2 border-t border-slate-100">
                                <span className="text-xs text-slate-400 font-semibold uppercase tracking-wider">Date & Time</span>
                                <span className="text-sm text-slate-700 font-medium">{formatDate(clearance.paid_at)}</span>
                            </div>

                            {/* Amount — emphasized */}
                            <div className="bg-slate-50 rounded-2xl p-4 mt-2 border border-slate-100">
                                <div className="flex justify-between items-center">
                                    <span className="text-sm text-slate-500 font-semibold uppercase tracking-wider">Total Paid</span>
                                    <span className="text-3xl text-slate-900 font-black">₱{Number(clearance.payment_amount).toFixed(2)}</span>
                                </div>
                            </div>
                        </div>

                        {/* Dashed separator */}
                        <div className="border-t-2 border-dashed border-slate-200 my-6 -mx-6" />

                        {/* Status badge */}
                        <div className="text-center mb-6">
                            <span className="inline-flex items-center gap-2 px-5 py-2 rounded-full text-xs font-black bg-emerald-100 text-emerald-700 uppercase tracking-widest border border-emerald-200">
                                <span className="w-2 h-2 bg-emerald-500 rounded-full animate-pulse" />
                                Payment Confirmed
                            </span>
                        </div>

                        {/* Next steps info */}
                        <div className="bg-blue-50 border border-blue-200 rounded-2xl p-4 mb-6">
                            <div className="flex items-start gap-3">
                                <div className="p-1.5 bg-blue-100 rounded-lg shrink-0 mt-0.5">
                                    <svg className="w-4 h-4 text-blue-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                                    </svg>
                                </div>
                                <div>
                                    <p className="text-blue-800 font-bold text-sm mb-1">What's Next?</p>
                                    <ul className="text-blue-700 text-xs space-y-1">
                                        <li>• Your application is now queued for processing</li>
                                        <li>• Check your Dashboard for status updates</li>
                                        <li>• You'll be notified once your clearance is ready</li>
                                    </ul>
                                </div>
                            </div>
                        </div>

                        {/* Action Buttons */}
                        <div className="space-y-3">
                            <button
                                id="print-receipt"
                                type="button"
                                onClick={handlePrint}
                                className="w-full py-3 rounded-2xl bg-white text-slate-700 font-bold text-sm border-2 border-slate-200 hover:bg-slate-50 hover:border-slate-300 transition-all flex items-center justify-center gap-2"
                            >
                                <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 17h2a2 2 0 002-2v-4a2 2 0 00-2-2H5a2 2 0 00-2 2v4a2 2 0 002 2h2m2 4h6a2 2 0 002-2v-4a2 2 0 00-2-2H9a2 2 0 00-2 2v4a2 2 0 002 2zm8-12V5a2 2 0 00-2-2H9a2 2 0 00-2 2v4h10z" />
                                </svg>
                                Print Receipt
                            </button>

                            <Link
                                id="go-to-application-status"
                                href={route('application.status')}
                                className="w-full py-3 rounded-2xl bg-slate-900 text-white font-bold text-sm hover:bg-slate-800 transition-all shadow-lg hover:shadow-xl flex items-center justify-center gap-2"
                            >
                                <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
                                </svg>
                                Check Application Status
                            </Link>
                        </div>
                    </div>
                </div>
            </div>
        </AuthenticatedLayout>
    );
}
