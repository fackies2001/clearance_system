import React, { useState } from 'react';
import { Head, router, usePage } from '@inertiajs/react';
import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';

const PAYMENT_METHODS = [
    {
        id: 'gcash',
        name: 'GCash',
        description: 'Pay instantly via GCash e-wallet',
        color: 'from-blue-500 to-blue-600',
        bgHover: 'hover:border-blue-400',
        iconBg: 'bg-blue-500',
        icon: (
            <svg className="w-7 h-7 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 18h.01M8 21h8a2 2 0 002-2V5a2 2 0 00-2-2H8a2 2 0 00-2 2v14a2 2 0 002 2z" />
            </svg>
        ),
    },
    {
        id: 'maya',
        name: 'Maya',
        description: 'Pay via Maya digital wallet',
        color: 'from-green-500 to-emerald-600',
        bgHover: 'hover:border-green-400',
        iconBg: 'bg-green-500',
        icon: (
            <svg className="w-7 h-7 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 9V7a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2m2 4h10a2 2 0 002-2v-6a2 2 0 00-2-2H9a2 2 0 00-2 2v6a2 2 0 002 2zm7-5a2 2 0 11-4 0 2 2 0 014 0z" />
            </svg>
        ),
    },
    {
        id: 'bank_transfer',
        name: 'Bank Transfer',
        description: 'Direct bank transfer (BDO, BPI, etc.)',
        color: 'from-indigo-500 to-purple-600',
        bgHover: 'hover:border-indigo-400',
        iconBg: 'bg-indigo-500',
        icon: (
            <svg className="w-7 h-7 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
            </svg>
        ),
    },
    {
        id: 'walkin',
        name: 'Walk-in Cash',
        description: 'Pay at the NBI office counter',
        color: 'from-amber-500 to-orange-600',
        bgHover: 'hover:border-amber-400',
        iconBg: 'bg-amber-500',
        icon: (
            <svg className="w-7 h-7 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 9V7a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2m2 4h10a2 2 0 002-2v-6a2 2 0 00-2-2H9a2 2 0 00-2 2v6a2 2 0 002 2zm7-5a2 2 0 11-4 0 2 2 0 014 0z" />
            </svg>
        ),
    },
];

export default function PaymentSelection({ clearance }) {
    const [selected, setSelected] = useState(null);
    const [processing, setProcessing] = useState(false);
    const { flash } = usePage().props;

    const handleSubmit = () => {
        if (!selected) return;
        setProcessing(true);
        router.post(route('payment.process', clearance.tracking_no), {
            payment_method: selected,
        }, {
            onFinish: () => setProcessing(false),
        });
    };

    const headerContent = (
        <div className="flex items-center gap-3">
            <div className="p-2 bg-blue-50 rounded-xl">
                <svg className="w-6 h-6 text-blue-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z" />
                </svg>
            </div>
            <h2 className="font-bold text-xl text-slate-900">Payment Center</h2>
        </div>
    );

    return (
        <AuthenticatedLayout header={headerContent}>
            <Head title="Payment — Select Method" />

            <div className="max-w-3xl mx-auto py-8 px-4">

                {/* Error Flash (for failed payment retries) */}
                {flash?.error && (
                    <div className="mb-6 bg-red-50 border border-red-200 text-red-700 px-5 py-4 rounded-2xl flex items-center gap-3 animate-[fadeIn_0.3s_ease-out]">
                        <div className="p-2 bg-red-100 rounded-xl shrink-0">
                            <svg className="w-5 h-5 text-red-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                            </svg>
                        </div>
                        <p className="text-sm font-medium">{flash.error}</p>
                    </div>
                )}

                {/* Application Summary Card */}
                <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden mb-8">
                    <div className="bg-gradient-to-r from-slate-900 via-slate-800 to-slate-900 px-6 py-5">
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-slate-400 text-xs font-semibold uppercase tracking-widest mb-1">Application Summary</p>
                                <h3 className="text-white font-bold text-lg">{clearance.full_name}</h3>
                            </div>
                            <div className="text-right">
                                <p className="text-slate-400 text-xs font-semibold uppercase tracking-widest mb-1">Tracking No.</p>
                                <p className="text-blue-400 font-mono font-bold text-sm">{clearance.tracking_no}</p>
                            </div>
                        </div>
                    </div>
                    <div className="px-6 py-4 flex items-center justify-between bg-slate-50/50">
                        <div>
                            <p className="text-xs text-slate-400 font-semibold uppercase tracking-wider">Purpose</p>
                            <p className="text-slate-700 font-medium text-sm mt-0.5">{clearance.purpose}</p>
                        </div>
                        <div className="text-right">
                            <p className="text-xs text-slate-400 font-semibold uppercase tracking-wider">Amount Due</p>
                            <p className="text-2xl font-black text-slate-900 mt-0.5">
                                ₱{Number(clearance.payment_amount).toFixed(2)}
                            </p>
                        </div>
                    </div>
                </div>

                {/* Payment Methods */}
                <div className="mb-8">
                    <h3 className="text-lg font-bold text-slate-900 mb-1">Select Payment Method</h3>
                    <p className="text-sm text-slate-500 mb-5">Choose how you'd like to pay for your NBI Clearance.</p>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        {PAYMENT_METHODS.map((method) => (
                            <button
                                key={method.id}
                                id={`payment-method-${method.id}`}
                                type="button"
                                onClick={() => setSelected(method.id)}
                                className={`relative text-left p-5 rounded-2xl border-2 transition-all duration-200 group ${
                                    selected === method.id
                                        ? 'border-slate-900 bg-slate-50 shadow-lg scale-[1.02]'
                                        : `border-slate-200 bg-white hover:shadow-md ${method.bgHover}`
                                }`}
                            >
                                {/* Selected indicator */}
                                {selected === method.id && (
                                    <div className="absolute top-3 right-3 w-6 h-6 bg-slate-900 rounded-full flex items-center justify-center">
                                        <svg className="w-4 h-4 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M5 13l4 4L19 7" />
                                        </svg>
                                    </div>
                                )}

                                <div className="flex items-center gap-4">
                                    <div className={`p-3 rounded-xl bg-gradient-to-br ${method.color} shadow-sm`}>
                                        {method.icon}
                                    </div>
                                    <div>
                                        <h4 className="font-bold text-slate-900 text-base">{method.name}</h4>
                                        <p className="text-xs text-slate-500 mt-0.5">{method.description}</p>
                                    </div>
                                </div>
                            </button>
                        ))}
                    </div>
                </div>

                {/* Submit Button */}
                <button
                    id="proceed-to-checkout"
                    type="button"
                    onClick={handleSubmit}
                    disabled={!selected || processing}
                    className={`w-full py-4 rounded-2xl font-bold text-base transition-all duration-300 flex items-center justify-center gap-2 ${
                        selected
                            ? 'bg-slate-900 text-white hover:bg-slate-800 shadow-xl hover:shadow-2xl cursor-pointer active:scale-[0.98]'
                            : 'bg-slate-200 text-slate-400 cursor-not-allowed'
                    }`}
                >
                    {processing ? (
                        <>
                            <svg className="animate-spin h-5 w-5" viewBox="0 0 24 24">
                                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
                                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                            </svg>
                            Processing...
                        </>
                    ) : (
                        <>
                            Proceed to Checkout
                            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 7l5 5m0 0l-5 5m5-5H6" />
                            </svg>
                        </>
                    )}
                </button>

                {/* Security Notice */}
                <div className="mt-6 flex items-center justify-center gap-2 text-xs text-slate-400">
                    <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                    </svg>
                    <span>Secured & encrypted transaction • Rate-limited for your protection</span>
                </div>
            </div>
        </AuthenticatedLayout>
    );
}
