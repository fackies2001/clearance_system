import { Link } from '@inertiajs/react';

export default function GuestLayout({ children }) {
    return (
        <div className="min-h-screen flex">
            {/* Left Panel — Branding */}
            <div className="hidden lg:flex lg:w-1/2 bg-gradient-to-br from-[#0f172a] via-[#1e3a5f] to-[#1d4ed8] flex-col items-center justify-center p-12 relative overflow-hidden">
                {/* Background circles */}
                <div className="absolute top-[-80px] left-[-80px] w-[300px] h-[300px] rounded-full bg-white/5" />
                <div className="absolute bottom-[-60px] right-[-60px] w-[250px] h-[250px] rounded-full bg-white/5" />
                <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] rounded-full bg-white/[0.02]" />

                {/* Logo + Title */}
                <div className="relative z-10 text-center">
                    <div className="w-20 h-20 bg-white/10 backdrop-blur rounded-2xl flex items-center justify-center mx-auto mb-6 border border-white/20">
                        <span className="text-4xl">🛡️</span>
                    </div>
                    <h1 className="text-4xl font-black text-white tracking-tight mb-3">
                        NBI <span className="text-blue-400">SYS</span>
                    </h1>
                    <p className="text-blue-200 text-base font-medium mb-10 max-w-xs leading-relaxed">
                        National Bureau of Investigation<br />Clearance Online Application System
                    </p>

                    {/* Features */}
                    <div className="space-y-4 text-left max-w-xs">
                        {[
                            { icon: '📋', text: 'Online Application Form' },
                            { icon: '💳', text: 'Secure Online Payment' },
                            { icon: '📅', text: 'Appointment Scheduling' },
                            { icon: '🪪', text: 'Digital Clearance Release' },
                        ].map(f => (
                            <div key={f.text} className="flex items-center gap-3">
                                <div className="w-8 h-8 rounded-lg bg-white/10 flex items-center justify-center text-sm flex-shrink-0">
                                    {f.icon}
                                </div>
                                <span className="text-blue-100 text-sm font-medium">{f.text}</span>
                            </div>
                        ))}
                    </div>
                </div>
            </div>

            {/* Right Panel — Form */}
            <div className="w-full lg:w-1/2 flex items-center justify-center bg-[#f8fafc] p-8">
                <div className="w-full max-w-md">
                    {/* Mobile logo */}
                    <div className="lg:hidden text-center mb-8">
                        <div className="w-14 h-14 bg-[#1e3a5f] rounded-2xl flex items-center justify-center mx-auto mb-3">
                            <span className="text-2xl">🛡️</span>
                        </div>
                        <h1 className="text-2xl font-black text-[#0f172a]">NBI <span className="text-blue-600">SYS</span></h1>
                    </div>

                    {children}
                </div>
            </div>
        </div>
    );
}