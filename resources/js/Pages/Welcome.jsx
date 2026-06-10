import { Head, Link } from '@inertiajs/react';

export default function Welcome({ auth }) {
    return (
        <>
            <Head title="NBI Clearance Online System" />
            <div className="min-h-screen bg-gradient-to-br from-[#0f172a] via-[#1e3a5f] to-[#1d4ed8] relative overflow-hidden">

                {/* Background decorations */}
                <div className="absolute top-[-100px] right-[-100px] w-[400px] h-[400px] rounded-full bg-white/5" />
                <div className="absolute bottom-[-80px] left-[-80px] w-[350px] h-[350px] rounded-full bg-white/5" />
                <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[700px] h-[700px] rounded-full bg-white/[0.02]" />

                {/* Navbar */}
                <nav className="relative z-10 flex items-center justify-between px-8 py-6 max-w-7xl mx-auto">
                    <div className="flex items-center gap-3">
                        <div className="w-10 h-10 bg-white/10 backdrop-blur rounded-xl flex items-center justify-center border border-white/20">
                            <span className="text-xl">🛡️</span>
                        </div>
                        <span className="text-white font-black text-xl tracking-tight">
                            NBI <span className="text-blue-400">SYS</span>
                        </span>
                    </div>
                    <div className="flex items-center gap-3">
                        {auth.user ? (
                            <Link
                                href={route('dashboard')}
                                className="px-5 py-2.5 rounded-xl bg-white text-[#1e3a5f] font-bold text-sm hover:bg-blue-50 transition-all shadow-lg"
                            >
                                Go to Dashboard →
                            </Link>
                        ) : (
                            <>
                                <Link
                                    href={route('login')}
                                    className="px-5 py-2.5 rounded-xl text-white/80 font-semibold text-sm hover:text-white hover:bg-white/10 transition-all"
                                >
                                    Sign In
                                </Link>
                                <Link
                                    href={route('register')}
                                    className="px-5 py-2.5 rounded-xl bg-white text-[#1e3a5f] font-bold text-sm hover:bg-blue-50 transition-all shadow-lg"
                                >
                                    Get Started
                                </Link>
                            </>
                        )}
                    </div>
                </nav>

                {/* Hero Section */}
                <div className="relative z-10 max-w-7xl mx-auto px-8 pt-16 pb-24 text-center">
                    <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/10 border border-white/20 text-blue-200 text-xs font-bold uppercase tracking-widest mb-8">
                        <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
                        Online Application Now Available
                    </div>

                    <h1 className="text-5xl md:text-6xl font-black text-white tracking-tight leading-tight mb-6">
                        NBI Clearance<br />
                        <span className="text-blue-400">Made Simple</span>
                    </h1>

                    <p className="text-blue-200 text-lg max-w-xl mx-auto mb-10 leading-relaxed">
                        Apply for your NBI Clearance online — fast, secure, and hassle-free. No more long queues.
                    </p>

                    <div className="flex flex-col sm:flex-row items-center justify-center gap-4 mb-20">
                        <Link
                            href={route('register')}
                            className="px-8 py-4 rounded-2xl bg-white text-[#1e3a5f] font-black text-base hover:bg-blue-50 transition-all shadow-2xl shadow-blue-900/30 w-full sm:w-auto"
                        >
                            Apply Now →
                        </Link>
                        <Link
                            href={route('login')}
                            className="px-8 py-4 rounded-2xl bg-white/10 border border-white/20 text-white font-bold text-base hover:bg-white/20 transition-all w-full sm:w-auto"
                        >
                            Sign In
                        </Link>
                    </div>

                    {/* Features Grid */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 max-w-5xl mx-auto">
                        {[
                            { icon: '📋', title: 'Online Application', desc: 'Fill out your clearance form online anytime, anywhere.' },
                            { icon: '💳', title: 'Secure Payment', desc: 'Pay your clearance fee safely via online payment.' },
                            { icon: '📅', title: 'Set Appointment', desc: 'Schedule your biometrics capture at your convenience.' },
                            { icon: '🪪', title: 'Get Clearance', desc: 'Download or print your NBI Clearance digitally.' },
                        ].map(f => (
                            <div key={f.title} className="bg-white/10 backdrop-blur border border-white/20 rounded-2xl p-6 text-left hover:bg-white/15 transition-all">
                                <div className="w-12 h-12 rounded-xl bg-white/10 flex items-center justify-center text-2xl mb-4">
                                    {f.icon}
                                </div>
                                <h3 className="text-white font-bold text-sm mb-2">{f.title}</h3>
                                <p className="text-blue-200 text-xs leading-relaxed">{f.desc}</p>
                            </div>
                        ))}
                    </div>
                </div>

                {/* Footer */}
                <div className="relative z-10 text-center pb-8">
                    <p className="text-blue-300/50 text-xs">
                        © {new Date().getFullYear()} NBI Clearance Online System. All rights reserved.
                    </p>
                </div>
            </div>
        </>
    );
}