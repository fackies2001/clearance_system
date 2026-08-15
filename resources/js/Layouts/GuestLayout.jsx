import { Link } from '@inertiajs/react';

export default function GuestLayout({ children }) {
    return (
        <div className="min-h-screen flex font-sans">
            {/* Left Panel — Branding */}
            <div className="hidden lg:flex lg:w-1/2 bg-[#fdf8f0] border-r border-amber-200/60 flex-col items-center justify-center p-12 relative overflow-hidden">
                {/* Background circles */}
                <div className="absolute top-[-80px] left-[-80px] w-[300px] h-[300px] rounded-full bg-amber-200/20" />
                <div className="absolute bottom-[-60px] right-[-60px] w-[250px] h-[250px] rounded-full bg-amber-200/20" />
                <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] rounded-full bg-amber-100/30" />

                {/* Logo + Title */}
                <div className="relative z-10 text-center">
                    <div className="w-20 h-20 bg-white shadow-md rounded-2xl flex items-center justify-center mx-auto mb-6 border border-amber-200">
                        <span className="text-4xl">🛡️</span>
                    </div>
                    <h1 className="text-4xl font-black text-[#0f172a] tracking-tight mb-3">
                        NBI <span className="text-amber-600">SYS</span>
                    </h1>
                    <p className="text-slate-600 text-base font-medium mb-10 max-w-xs leading-relaxed">
                        National Bureau of Investigation<br />Clearance Online Application System
                    </p>

                    {/* Features */}
                    <div className="space-y-3.5 text-left max-w-xs">
                        {[
                            { icon: '📋', text: 'Online Application Form' },
                            { icon: '💳', text: 'Secure Online Payment' },
                            { icon: '📅', text: 'Appointment Scheduling' },
                            { icon: '🪪', text: 'Digital Clearance Release' },
                        ].map(f => (
                            <div key={f.text} className="flex items-center gap-3 bg-white border border-amber-100/80 rounded-xl p-3.5 shadow-sm hover:shadow-md transition-all">
                                <div className="w-8 h-8 rounded-lg bg-amber-50 border border-amber-200/50 flex items-center justify-center text-sm flex-shrink-0">
                                    {f.icon}
                                </div>
                                <span className="text-slate-700 text-sm font-semibold">{f.text}</span>
                            </div>
                        ))}
                    </div>
                </div>
            </div>

            {/* Right Panel — Form */}
            <div className="w-full lg:w-1/2 flex items-center justify-center bg-white p-8">
                <div className="w-full max-w-md">
                    {/* Mobile logo */}
                    <div className="lg:hidden text-center mb-8">
                        <div className="w-14 h-14 bg-amber-50 rounded-2xl border border-amber-200 flex items-center justify-center mx-auto mb-3 shadow-sm">
                            <span className="text-2xl">🛡️</span>
                        </div>
                        <h1 className="text-2xl font-black text-[#0f172a]">NBI <span className="text-amber-600">SYS</span></h1>
                    </div>

                    {children}
                </div>
            </div>
        </div>
    );
}