import React from 'react';
import { Head, Link } from '@inertiajs/react';
import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';

export default function WalkinPending({ clearance }) {
    const headerContent = (
        <div className="flex items-center gap-3">
            <div className="p-2 bg-amber-50 rounded-xl">
                <svg className="w-6 h-6 text-amber-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 9V7a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2m2 4h10a2 2 0 002-2v-6a2 2 0 00-2-2H9a2 2 0 00-2 2v6a2 2 0 002 2zm7-5a2 2 0 11-4 0 2 2 0 014 0z" />
                </svg>
            </div>
            <h2 className="font-bold text-xl text-slate-900">Walk-in Payment</h2>
        </div>
    );

    return (
        <AuthenticatedLayout header={headerContent}>
            <Head title="Walk-in Payment — Pending" />

            <div className="max-w-lg mx-auto py-8 px-4">
                <div className="bg-white rounded-3xl border border-slate-200 shadow-xl overflow-hidden">

                    {/* Header */}
                    <div className="bg-gradient-to-br from-amber-500 to-orange-600 px-6 py-10 text-center relative overflow-hidden">
                        <div className="absolute inset-0 opacity-10">
                            <div className="absolute top-4 left-4 w-20 h-20 border-2 border-white rounded-full" />
                            <div className="absolute bottom-4 right-4 w-32 h-32 border-2 border-white rounded-full" />
                        </div>
                        <div className="relative z-10">
                            {/* Icon */}
                            <div className="w-16 h-16 bg-white/20 rounded-full flex items-center justify-center mx-auto mb-4">
                                <svg className="w-8 h-8 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                                </svg>
                            </div>
                            <h3 className="text-white text-2xl font-black mb-1">Application Registered!</h3>
                            <p className="text-white/80 text-sm">Please proceed to the NBI counter to complete your payment.</p>
                        </div>
                    </div>

                    {/* Details */}
                    <div className="px-6 py-6 space-y-4">

                        <div className="space-y-3">
                            <div className="flex justify-between items-center py-2 border-b border-slate-100">
                                <span className="text-xs text-slate-400 font-semibold uppercase tracking-wider">Applicant</span>
                                <span className="text-sm text-slate-900 font-bold">{clearance.full_name}</span>
                            </div>
                            <div className="flex justify-between items-center py-2 border-b border-slate-100">
                                <span className="text-xs text-slate-400 font-semibold uppercase tracking-wider">Purpose</span>
                                <span className="text-sm text-slate-700 font-medium">{clearance.purpose}</span>
                            </div>
                            <div className="flex justify-between items-center py-2 border-b border-slate-100">
                                <span className="text-xs text-slate-400 font-semibold uppercase tracking-wider">Tracking No.</span>
                                <span className="text-sm text-blue-600 font-mono font-bold">{clearance.tracking_no}</span>
                            </div>
                            <div className="flex justify-between items-center py-2 border-b border-slate-100">
                                <span className="text-xs text-slate-400 font-semibold uppercase tracking-wider">Reference No.</span>
                                <span className="text-sm text-slate-700 font-mono font-semibold">{clearance.payment_reference}</span>
                            </div>
                            <div className="flex justify-between items-center py-2">
                                <span className="text-xs text-slate-400 font-semibold uppercase tracking-wider">Amount to Pay</span>
                                <span className="text-xl font-black text-slate-900">₱{Number(clearance.payment_amount).toFixed(2)}</span>
                            </div>
                        </div>

                        {/* Instructions */}
                        <div className="bg-amber-50 border border-amber-200 rounded-2xl p-4">
                            <div className="flex items-start gap-3">
                                <div className="p-1.5 bg-amber-100 rounded-lg shrink-0 mt-0.5">
                                    <svg className="w-4 h-4 text-amber-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                                    </svg>
                                </div>
                                <div>
                                    <p className="text-amber-800 font-bold text-sm mb-2">Walk-in Payment Instructions</p>
                                    <ul className="text-amber-700 text-xs space-y-1.5">
                                        <li>• Go to the nearest <span className="font-bold">NBI Clearance Center</span></li>
                                        <li>• Present your <span className="font-bold">Reference No.</span> at the counter</li>
                                        <li>• Pay <span className="font-bold">₱{Number(clearance.payment_amount).toFixed(2)}</span> in cash</li>
                                        <li>• Keep your <span className="font-bold">official receipt</span> for processing</li>
                                    </ul>
                                </div>
                            </div>
                        </div>

                        {/* Status Badge */}
                        <div className="flex items-center justify-center gap-2 py-2">
                            <div className="w-2 h-2 bg-amber-400 rounded-full animate-pulse" />
                            <span className="text-xs font-bold text-amber-600 uppercase tracking-wider">Awaiting Walk-in Payment</span>
                        </div>

                        {/* CTA */}
                        <Link
                            href={route('application.status')}
                            className="w-full py-4 rounded-2xl bg-slate-900 text-white font-bold text-sm hover:bg-slate-800 transition-all shadow-lg flex items-center justify-center gap-2"
                        >
                            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
                            </svg>
                            View Application Status
                        </Link>
                    </div>
                </div>

                {/* Footer note */}
                <div className="mt-6 flex items-center justify-center gap-2 text-xs text-slate-400">
                    <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                    </svg>
                    <span>Your application is saved • Admin will confirm your payment</span>
                </div>
            </div>
        </AuthenticatedLayout>
    );
}