import React, { useState } from 'react';
import { Head, router } from '@inertiajs/react';
import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';

const METHOD_LABELS = {
    gcash: 'GCash',
    maya: 'Maya',
    bank_transfer: 'Bank Transfer',
    walkin: 'Walk-in Cash',
};

const METHOD_COLORS = {
    gcash: { gradient: 'from-blue-500 to-blue-700', bg: 'bg-blue-50', text: 'text-blue-700', border: 'border-blue-200' },
    maya: { gradient: 'from-green-500 to-emerald-700', bg: 'bg-green-50', text: 'text-green-700', border: 'border-green-200' },
    bank_transfer: { gradient: 'from-indigo-500 to-purple-700', bg: 'bg-indigo-50', text: 'text-indigo-700', border: 'border-indigo-200' },
    walkin: { gradient: 'from-amber-500 to-orange-600', bg: 'bg-amber-50', text: 'text-amber-700', border: 'border-amber-200' },
};

export default function MockCheckout({ clearance }) {
    const [processing, setProcessing] = useState(false);
    const [action, setAction] = useState(null); // 'success' or 'failed'

    const colors = METHOD_COLORS[clearance.payment_method] || METHOD_COLORS.gcash;

    const handlePayment = (type) => {
        setAction(type);
        setProcessing(true);

        // Simulate a delay for realism (1.5 seconds)
        setTimeout(() => {
            const routeName = type === 'success' ? 'payment.success' : 'payment.failed';
            router.post(route(routeName, clearance.tracking_no), {}, {
                onFinish: () => {
                    setProcessing(false);
                    setAction(null);
                },
            });
        }, 1500);
    };

    const headerContent = (
        <div className="flex items-center gap-3">
            <div className="p-2 bg-blue-50 rounded-xl">
                <svg className="w-6 h-6 text-blue-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                </svg>
            </div>
            <h2 className="font-bold text-xl text-slate-900">Secure Checkout</h2>
        </div>
    );

    return (
        <AuthenticatedLayout header={headerContent}>
            <Head title="Payment — Checkout" />

            <div className="max-w-lg mx-auto py-8 px-4">

                {/* Mock Payment Terminal */}
                <div className="bg-white rounded-3xl border border-slate-200 shadow-xl overflow-hidden">

                    {/* Terminal Header */}
                    <div className={`bg-gradient-to-br ${colors.gradient} px-6 py-8 text-center relative overflow-hidden`}>
                        {/* Background pattern */}
                        <div className="absolute inset-0 opacity-10">
                            <div className="absolute top-4 left-4 w-20 h-20 border-2 border-white rounded-full" />
                            <div className="absolute bottom-4 right-4 w-32 h-32 border-2 border-white rounded-full" />
                            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-40 h-40 border border-white rounded-full" />
                        </div>

                        <div className="relative z-10">
                            <div className="inline-flex items-center gap-2 bg-white/20 backdrop-blur-sm rounded-full px-4 py-1.5 mb-4">
                                <div className="w-2 h-2 bg-white rounded-full animate-pulse" />
                                <span className="text-white text-xs font-bold uppercase tracking-wider">
                                    {METHOD_LABELS[clearance.payment_method]} Checkout
                                </span>
                            </div>
                            <p className="text-white/80 text-xs uppercase tracking-widest mb-2">Amount to Pay</p>
                            <p className="text-white text-5xl font-black tracking-tight">
                                ₱{Number(clearance.payment_amount).toFixed(2)}
                            </p>
                        </div>
                    </div>

                    {/* Transaction Details */}
                    <div className="px-6 py-6 space-y-4">

                        <div className="space-y-3">
                            <div className="flex justify-between items-center py-2 border-b border-slate-100">
                                <span className="text-xs text-slate-400 font-semibold uppercase tracking-wider">Applicant</span>
                                <span className="text-sm text-slate-900 font-bold">{clearance.full_name}</span>
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
                                <span className="text-xs text-slate-400 font-semibold uppercase tracking-wider">Method</span>
                                <span className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold ${colors.bg} ${colors.text} ${colors.border} border`}>
                                    {METHOD_LABELS[clearance.payment_method]}
                                </span>
                            </div>
                        </div>

                        {/* Walk-in Instructions */}
                        {clearance.payment_method === 'walkin' && (
                            <div className="bg-amber-50 border border-amber-200 rounded-2xl p-4 mt-4">
                                <div className="flex items-start gap-3">
                                    <div className="p-1.5 bg-amber-100 rounded-lg shrink-0 mt-0.5">
                                        <svg className="w-4 h-4 text-amber-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                                        </svg>
                                    </div>
                                    <div>
                                        <p className="text-amber-800 font-bold text-sm mb-1">Walk-in Payment Instructions</p>
                                        <ul className="text-amber-700 text-xs space-y-1">
                                            <li>• Present your Reference No. at the NBI counter</li>
                                            <li>• Pay ₱{Number(clearance.payment_amount).toFixed(2)} in cash</li>
                                            <li>• Keep your receipt for processing</li>
                                        </ul>
                                    </div>
                                </div>
                            </div>
                        )}

                        {/* Simulation Notice */}
                        <div className="bg-slate-50 border border-slate-200 rounded-2xl p-4">
                            <div className="flex items-center gap-2 mb-2">
                                <svg className="w-4 h-4 text-slate-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
                                </svg>
                                <p className="text-slate-600 font-bold text-xs uppercase tracking-wider">Simulated Payment</p>
                            </div>
                            <p className="text-slate-500 text-xs leading-relaxed">
                                This is a mock checkout for demonstration purposes. Click the buttons below to simulate a successful or failed payment.
                            </p>
                        </div>

                        {/* Action Buttons */}
                        <div className="space-y-3 pt-2">
                            <button
                                id="simulate-payment-success"
                                type="button"
                                onClick={() => handlePayment('success')}
                                disabled={processing}
                                className="w-full py-4 rounded-2xl bg-emerald-600 text-white font-bold text-sm hover:bg-emerald-700 transition-all shadow-lg hover:shadow-xl active:scale-[0.98] disabled:opacity-60 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                            >
                                {processing && action === 'success' ? (
                                    <>
                                        <svg className="animate-spin h-5 w-5" viewBox="0 0 24 24">
                                            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
                                            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                                        </svg>
                                        Processing Payment...
                                    </>
                                ) : (
                                    <>
                                        <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
                                        </svg>
                                        Simulate Payment — SUCCESS
                                    </>
                                )}
                            </button>

                            <button
                                id="simulate-payment-failed"
                                type="button"
                                onClick={() => handlePayment('failed')}
                                disabled={processing}
                                className="w-full py-4 rounded-2xl bg-white text-red-600 font-bold text-sm border-2 border-red-200 hover:bg-red-50 hover:border-red-300 transition-all active:scale-[0.98] disabled:opacity-60 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                            >
                                {processing && action === 'failed' ? (
                                    <>
                                        <svg className="animate-spin h-5 w-5" viewBox="0 0 24 24">
                                            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
                                            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                                        </svg>
                                        Processing...
                                    </>
                                ) : (
                                    <>
                                        <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
                                        </svg>
                                        Simulate Payment — FAILED
                                    </>
                                )}
                            </button>
                        </div>
                    </div>
                </div>

                {/* Security footer */}
                <div className="mt-6 flex items-center justify-center gap-2 text-xs text-slate-400">
                    <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                    </svg>
                    <span>Protected by rate-limiting & CSRF verification</span>
                </div>
            </div>
        </AuthenticatedLayout>
    );
}
