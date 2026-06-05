import React from 'react';
import { Head, Link } from '@inertiajs/react';
import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';

export default function ClearanceViewer({ auth, clearance }) {
    const handlePrint = () => {
        window.print();
    };

    return (
        <AuthenticatedLayout user={auth.user}>
            <Head title={`NBI Clearance - ${clearance.clearance_number}`} />

            <div className="py-12 px-4 print:p-0 print:py-0">
                <div className="max-w-3xl mx-auto">
                    {/* Actions - Hidden on print */}
                    <div className="flex justify-between items-center mb-6 print:hidden">
                        <Link 
                            href={route('application.status')}
                            className="inline-flex items-center gap-2 text-sm text-gray-500 hover:text-gray-900 transition"
                        >
                             <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10 19l-7-7m0 0l7-7m-7 7h18" /></svg>
                            Back to Status
                        </Link>
                        <div className="flex gap-3">
                            <Link
                                href={route('clearance.download', clearance.tracking_no)}
                                className="inline-flex items-center gap-2 px-4 py-2 bg-slate-100 text-slate-700 rounded-lg text-sm font-bold hover:bg-slate-200 transition"
                            >
                                <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" /></svg>
                                Download PDF
                            </Link>
                            <button
                                onClick={handlePrint}
                                className="inline-flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg text-sm font-bold hover:bg-blue-700 transition"
                            >
                                <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 17h2a2 2 0 002-2v-4a2 2 0 00-2-2H5a2 2 0 00-2 2v4a2 2 0 002 2h2m2 4h6a2 2 0 002-2v-4a2 2 0 00-2-2H9a2 2 0 00-2 2v4a2 2 0 002 2zm8-12V5a2 2 0 00-2-2H9a2 2 0 00-2 2v4h10z" /></svg>
                                Print Clearance
                            </button>
                        </div>
                    </div>

                    {/* The NBI Clearance Certificate */}
                    <div className="bg-white border-[1px] border-slate-300 shadow-2xl p-0 min-h-[800px] relative overflow-hidden print:shadow-none print:border-none rounded-lg print:rounded-none">
                        
                        {/* Security Background Pattern (CSS based) */}
                        <div className="absolute inset-0 opacity-[0.03] pointer-events-none select-none overflow-hidden" 
                             style={{ backgroundImage: 'radial-gradient(#1e3a8a 1px, transparent 0)', backgroundSize: '24px 24px' }}>
                        </div>

                        {/* Certificate Body */}
                        <div className="relative z-10 p-12 flex flex-col h-full">
                            
                            {/* Header */}
                            <div className="text-center mb-8 border-b-2 border-slate-900 pb-6">
                                <h1 className="text-3xl font-black tracking-tighter text-slate-900 mb-1 uppercase">Republic of the Philippines</h1>
                                <h2 className="text-xl font-bold tracking-tight text-slate-800 mb-0.5 uppercase">Department of Justice</h2>
                                <h3 className="text-2xl font-black tracking-widest text-blue-900 uppercase">National Bureau of Investigation</h3>
                                <p className="text-[10px] text-gray-500 font-bold uppercase tracking-widest mt-2">Manila Division</p>
                            </div>

                            {/* Info Section */}
                            <div className="grid grid-cols-12 gap-8 mb-12">
                                <div className="col-span-8 space-y-6">
                                    <div className="flex justify-between items-start border-b border-slate-100 pb-2">
                                        <div>
                                            <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Clearance Number</p>
                                            <p className="font-mono font-bold text-lg text-blue-600">{clearance.clearance_number}</p>
                                        </div>
                                        <div className="text-right">
                                            <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Date Issued</p>
                                            <p className="font-bold text-sm text-gray-900">{new Date(clearance.released_at).toLocaleDateString('en-PH', { month: 'long', day: 'numeric', year: 'numeric' })}</p>
                                        </div>
                                    </div>

                                    <div>
                                        <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-1">Name</p>
                                        <p className="text-3xl font-black text-slate-900 uppercase leading-none">
                                            {clearance.last_name}, {clearance.first_name} {clearance.middle_name} {clearance.suffix}
                                        </p>
                                    </div>

                                    <div className="grid grid-cols-2 gap-4">
                                        <div>
                                            <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-1">Birthdate</p>
                                            <p className="font-bold text-sm uppercase text-gray-900">{new Date(clearance.date_of_birth).toLocaleDateString()}</p>
                                        </div>
                                        <div>
                                            <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-1">Purpose</p>
                                            <p className="font-bold text-sm uppercase text-gray-900">{clearance.purpose}</p>
                                        </div>
                                    </div>

                                    <div className="bg-emerald-50 border border-emerald-100 p-4 rounded-lg">
                                        <p className="text-[10px] font-black text-emerald-600 uppercase tracking-widest mb-1">Verification Status</p>
                                        <p className="text-2xl font-black text-emerald-700 tracking-widest uppercase">Cleared / No Record</p>
                                    </div>
                                </div>

                                <div className="col-span-4 flex flex-col items-center gap-4">
                                    {/* Photo Placeholder */}
                                    <div className="w-full aspect-[3/4] bg-slate-100 border-2 border-slate-200 rounded-lg overflow-hidden flex items-center justify-center">
                                       {clearance.photo_path ? (
                                            <img src={`/storage/${clearance.photo_path}`} alt="Applicant" className="w-full h-full object-cover" />
                                       ) : (
                                            <div className="text-gray-300 text-xs text-center p-4 uppercase font-bold">Photo Placeholder</div>
                                       )}
                                    </div>
                                    
                                    {/* QR Code Placeholder */}
                                    <div className="w-24 h-24 bg-white border border-slate-200 p-1">
                                        {/* Simplified QR Placeholder */}
                                        <div className="w-full h-full bg-slate-900 flex items-center justify-center">
                                            <div className="grid grid-cols-4 grid-rows-4 w-full h-full gap-1 p-1">
                                                {[...Array(16)].map((_, i) => (
                                                    <div key={i} className={`w-full h-full ${Math.random() > 0.4 ? 'bg-white' : 'bg-transparent'}`}></div>
                                                ))}
                                            </div>
                                        </div>
                                    </div>
                                    <p className="text-[8px] font-bold text-gray-400 uppercase tracking-widest">Verify authenticity via QR</p>
                                </div>
                            </div>

                            {/* Fingerprints section */}
                            <div className="grid grid-cols-2 gap-8 mb-12 flex-1">
                                <div className="border border-slate-200 p-4 rounded-xl">
                                    <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest text-center mb-2">Left Thumb</p>
                                    <div className="w-full h-32 flex items-center justify-center grayscale opacity-20">
                                        {/* Fingerprint Glyph */}
                                        <svg className="w-20 h-20 text-slate-900" fill="currentColor" viewBox="0 0 20 20">
                                            <path fillRule="evenodd" d="M10 2a8 8 0 100 16 8 8 0 000-16zM5.121 14.879A7.48 7.48 0 0110 13c1.774 0 3.393.616 4.665 1.644l.214.18c.08.067.16.136.242.204a8 8 0 11-10.021-11.879l.068.04c.792.484 1.488 1.13 2.057 1.9l.481.654A7.481 7.481 0 0110 7c1.774 0 3.393.616 4.665 1.644.154.129.303.264.446.404L15.343 9.49a7.51 7.51 0 01-.176.152l-.125.101A7.476 7.476 0 0110 11c-1.774 0-3.393-.616-4.665-1.644a7.502 7.502 0 01-1.156-1.127l-.122-.162z" clipRule="evenodd" />
                                        </svg>
                                    </div>
                                </div>
                                <div className="border border-slate-200 p-4 rounded-xl">
                                    <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest text-center mb-2">Right Thumb</p>
                                    <div className="w-full h-32 flex items-center justify-center grayscale opacity-20">
                                         <svg className="w-20 h-20 text-slate-900" fill="currentColor" viewBox="0 0 20 20">
                                            <path fillRule="evenodd" d="M10 2a8 8 0 100 16 8 8 0 000-16zM5.121 14.879A7.48 7.48 0 0110 13c1.774 0 3.393.616 4.665 1.644l.214.18c.08.067.16.136.242.204a8 8 0 11-10.021-11.879l.068.04c.792.484 1.488 1.13 2.057 1.9l.481.654A7.481 7.481 0 0110 7c1.774 0 3.393.616 4.665 1.644.154.129.303.264.446.404L15.343 9.49a7.51 7.51 0 01-.176.152l-.125.101A7.476 7.476 0 0110 11c-1.774 0-3.393-.616-4.665-1.644a7.502 7.502 0 01-1.156-1.127l-.122-.162z" clipRule="evenodd" />
                                        </svg>
                                    </div>
                                </div>
                            </div>

                            {/* Footer */}
                            <div className="flex justify-between items-end">
                                <div className="text-center">
                                    <div className="w-32 h-px bg-slate-900 mb-2 mx-auto"></div>
                                    <p className="text-[10px] font-black uppercase text-slate-900">NBI Authorized Officer</p>
                                </div>
                                <div className="text-right">
                                    <p className="text-[8px] text-gray-400 font-bold uppercase italic max-w-xs">
                                        This certificate is issued for official use only. Any alteration or unauthorized reproduction will invalidate this document.
                                    </p>
                                </div>
                            </div>

                        </div>
                    </div>
                </div>
            </div>
        </AuthenticatedLayout>
    );
}
