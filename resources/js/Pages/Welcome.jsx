import { Head, Link } from '@inertiajs/react';
import { useState } from 'react';

const faqs = [
    { q: 'How much is NBI Clearance?', a: 'The standard fee is ₱130 for regular processing. Additional fees may apply for same-day or rush processing.' },
    { q: 'How do I apply for NBI Clearance online?', a: 'Register an account, fill out the application form, pay the fee online, set an appointment, then appear for biometrics capture.' },
    { q: 'How long does it take to get my NBI Clearance?', a: 'Regular processing takes 1–3 business days after biometrics. Same-day release is available at select branches.' },
    { q: 'What documents do I need for my NBI appointment?', a: 'You need at least 2 valid government-issued IDs (original, not photocopies), clear photos, and not expired.' },
    { q: 'What is a "hit" in NBI Clearance?', a: 'A "hit" means your name matched an entry in the NBI database with a pending criminal case or record. It requires additional verification.' },
    { q: 'Can I reschedule my NBI appointment?', a: 'Yes, you can reschedule through the online portal before your appointment date.' },
    { q: 'How do I know if my NBI payment was successful?', a: 'You will receive a confirmation email and the system will show your payment status as "Paid" in your dashboard.' },
    { q: 'How do I update incorrect information on my NBI Clearance?', a: 'Visit the nearest NBI branch with your valid IDs and request a correction. Bring supporting documents for the correct information.' },
];

const steps = [
    { n: '1', title: 'Create an Account', desc: 'Register on this portal by clicking Get Started. Fill in your personal details and create a password.' },
    { n: '2', title: 'Fill Out Application Form', desc: 'After logging in, click Apply Now and fill out all required personal information accurately.' },
    { n: '3', title: 'Pay the Clearance Fee', desc: 'Choose your payment method — GCash, Maya, Bank Transfer, or walk-in cash payment at the NBI office.' },
    { n: '4', title: 'Set Your Appointment', desc: 'Schedule your biometrics capture appointment at your preferred date and time slot.' },
    { n: '5', title: 'Appear for Biometrics', desc: 'Visit the NBI office on your appointment date. Bring 2 valid IDs. Your photo and fingerprints will be taken.' },
    { n: '6', title: 'Receive Your Clearance', desc: 'Once processed and cleared, download or print your NBI Clearance digitally from your dashboard.' },
];

const tips = [
    { n: '01', title: 'Plan Ahead', desc: 'Appointment slots fill up quickly. Book as early as possible, especially if you need clearance for urgent requirements.' },
    { n: '02', title: 'First-Time Jobseeker Exemption', desc: 'First-time jobseekers may qualify for a fee exemption under Republic Act No. 11261. Present your barangay clearance and register through the portal.' },
    { n: '03', title: 'Prepare Documents in Advance', desc: 'Bring at least 2 valid IDs (not expired) and extra copies of your application and payment receipt to avoid delays.' },
    { n: '04', title: 'Choose Off-Peak Months', desc: 'Apply during March to May or September to November to avoid the rush months of January, June, and July.' },
    { n: '05', title: 'Book Early Morning Slots', desc: 'Morning slots (8:00–10:00 AM) tend to be less crowded and more efficient than afternoon slots.' },
    { n: '06', title: 'Arrive Early', desc: 'On your appointment day, arrive 15–30 minutes early to account for any delays and ensure prompt processing.' },
    { n: '07', title: 'Stable Internet Connection', desc: 'When applying online or making payments, use a stable connection to prevent errors or disruptions.' },
    { n: '08', title: 'Save Digital Copies', desc: 'Always screenshot or save a PDF of your payment confirmation and reference number. Store in Google Drive or Dropbox.' },
    { n: '09', title: 'Check for Hits in Advance', desc: 'If you have a common name or have faced issues before, call the NBI office ahead of time to check for any potential issues.' },
];

const issues = [
    { title: 'Hit Status', desc: 'Your name matched an entry in the NBI database with a pending criminal case. This may take 5–70 days to resolve. NBI will contact you for further documents or interviews.' },
    { title: 'Payment Problems', desc: 'If payment fails, ensure your payment details are accurate. Try another payment method or contact your bank. You can also visit the NBI office to complete payment manually.' },
    { title: 'Full Appointment Slots', desc: 'Slots fill up quickly. Check regularly for cancellations or choose a different NBI branch with available slots.' },
    { title: 'Missing Documents', desc: 'Failure to bring required documents will prevent you from completing the process. Always double-check the list and carry extra copies.' },
    { title: 'Incorrect Personal Information', desc: 'Mistakes in entering personal details can cause delays. Contact NBI support or visit the nearest branch to correct the details before your appointment.' },
    { title: 'Payment Confirmation Issues', desc: 'If you encounter issues with your reference number, verify the payment with your provider and contact NBI support. Always save your receipt.' },
];

function FAQItem({ q, a }) {
    const [open, setOpen] = useState(false);
    return (
        <div
            className="border border-slate-200 rounded-2xl overflow-hidden cursor-pointer select-none"
            onClick={() => setOpen(o => !o)}
        >
            <div className="flex items-center justify-between px-6 py-4">
                <span className="font-semibold text-[#0f172a] text-sm">{q}</span>
                <svg className={`w-5 h-5 text-slate-400 transition-transform flex-shrink-0 ml-4 ${open ? 'rotate-180' : ''}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                </svg>
            </div>
            {open && (
                <div className="px-6 pb-5 text-sm text-slate-600 leading-relaxed border-t border-slate-100 pt-3">
                    {a}
                </div>
            )}
        </div>
    );
}

export default function Welcome({ auth }) {
    return (
        <>
            <Head title="NBI Clearance Online System" />
            <div className="min-h-screen bg-white font-sans">

                {/* ── NAVBAR ── */}
                <nav className="sticky top-0 z-50 bg-[#0f172a]/95 backdrop-blur border-b border-white/10">
                    <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">
                        <div className="flex items-center gap-3">
                            <div className="w-9 h-9 bg-white/10 rounded-xl flex items-center justify-center border border-white/20">
                                <span className="text-lg">🛡️</span>
                            </div>
                            <span className="text-white font-black text-lg tracking-tight">
                                NBI <span className="text-blue-400">SYS</span>
                            </span>
                        </div>
                        <div className="flex items-center gap-3">
                            {auth.user ? (
                                <Link href={route('dashboard')} className="px-5 py-2 rounded-xl bg-white text-[#1e3a5f] font-bold text-sm hover:bg-blue-50 transition-all">
                                    Go to Dashboard →
                                </Link>
                            ) : (
                                <>
                                    <Link href={route('login')} className="px-5 py-2 rounded-xl text-white/70 font-semibold text-sm hover:text-white hover:bg-white/10 transition-all">
                                        Sign In
                                    </Link>
                                    <Link href={route('register')} className="px-5 py-2 rounded-xl bg-white text-[#1e3a5f] font-bold text-sm hover:bg-blue-50 transition-all shadow-lg">
                                        Get Started
                                    </Link>
                                </>
                            )}
                        </div>
                    </div>
                </nav>

                {/* ── HERO ── */}
                <section className="bg-gradient-to-br from-[#0f172a] via-[#1e3a5f] to-[#1d4ed8] relative overflow-hidden">
                    <div className="absolute top-[-100px] right-[-100px] w-[400px] h-[400px] rounded-full bg-white/5" />
                    <div className="absolute bottom-[-80px] left-[-80px] w-[350px] h-[350px] rounded-full bg-white/5" />
                    <div className="max-w-7xl mx-auto px-6 pt-24 pb-28 text-center relative z-10">
                        <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/10 border border-white/20 text-blue-200 text-xs font-bold uppercase tracking-widest mb-8">
                            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
                            Online Application Now Available
                        </div>
                        <h1 className="text-5xl md:text-6xl font-black text-white tracking-tight leading-tight mb-6">
                            NBI Clearance<br />
                            <span className="text-blue-400">Online Appointment</span>
                        </h1>
                        <p className="text-blue-200 text-lg max-w-2xl mx-auto mb-4 leading-relaxed">
                            The NBI Clearance is an official document issued by the National Bureau of Investigation in the Philippines.
                            It proves that a person has no criminal record and is commonly required for jobs, passports, visas, loans, and other legal transactions.
                        </p>
                        <p className="text-blue-300/70 text-sm mb-10">Getting your NBI clearance early helps avoid delays in important applications.</p>
                        <div className="flex flex-col sm:flex-row items-center justify-center gap-4 mb-20">
                            <Link href={route('register')} className="px-8 py-4 rounded-2xl bg-white text-[#1e3a5f] font-black text-base hover:bg-blue-50 transition-all shadow-2xl shadow-blue-900/30 w-full sm:w-auto">
                                Get an Appointment →
                            </Link>
                            <Link href={route('login')} className="px-8 py-4 rounded-2xl bg-white/10 border border-white/20 text-white font-bold text-base hover:bg-white/20 transition-all w-full sm:w-auto">
                                Sign In
                            </Link>
                        </div>
                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 max-w-5xl mx-auto">
                            {[
                                { icon: '📋', title: 'Online Application', desc: 'Fill out your clearance form online anytime, anywhere.' },
                                { icon: '💳', title: 'Secure Payment', desc: 'Pay your clearance fee safely via online payment.' },
                                { icon: '📅', title: 'Set Appointment', desc: 'Schedule your biometrics capture at your convenience.' },
                                { icon: '🪪', title: 'Get Clearance', desc: 'Download or print your NBI Clearance digitally.' },
                            ].map(f => (
                                <div key={f.title} className="bg-white/10 backdrop-blur border border-white/20 rounded-2xl p-6 text-left hover:bg-white/15 transition-all">
                                    <div className="w-12 h-12 rounded-xl bg-white/10 flex items-center justify-center text-2xl mb-4">{f.icon}</div>
                                    <h3 className="text-white font-bold text-sm mb-2">{f.title}</h3>
                                    <p className="text-blue-200 text-xs leading-relaxed">{f.desc}</p>
                                </div>
                            ))}
                        </div>
                    </div>
                </section>

                {/* ── WHY NBI CLEARANCE ── */}
                <section className="py-20 bg-white">
                    <div className="max-w-5xl mx-auto px-6 text-center">
                        <span className="inline-block px-4 py-1.5 rounded-full bg-slate-100 text-slate-500 text-xs font-bold uppercase tracking-widest mb-6">Why It Matters</span>
                        <h2 className="text-3xl md:text-4xl font-black text-[#0f172a] mb-3">
                            Why do we need <span className="text-blue-600">NBI Clearance?</span>
                        </h2>
                        <p className="text-slate-500 text-sm mb-12">It's an essential for multiple important purposes in the Philippines.</p>
                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
                            {[
                                { icon: '🔒', title: 'Personal Security', desc: 'Confirms your name is free of any pending criminal cases.' },
                                { icon: '💼', title: 'Job Applications', desc: 'Many employers require it to check your background.' },
                                { icon: '✈️', title: 'Traveling Abroad', desc: 'Required by some embassies for visas or immigration.' },
                                { icon: '🏛️', title: 'Government Transactions', desc: 'Needed for licenses, permits, and other official documents.' },
                            ].map(c => (
                                <div key={c.title} className="bg-white border border-slate-100 rounded-2xl p-6 text-left shadow-sm hover:shadow-md transition-all">
                                    <div className="w-11 h-11 rounded-xl bg-red-50 flex items-center justify-center text-xl mb-4">{c.icon}</div>
                                    <h3 className="font-bold text-[#0f172a] text-sm mb-2">{c.title}</h3>
                                    <p className="text-slate-500 text-xs leading-relaxed">{c.desc}</p>
                                </div>
                            ))}
                        </div>
                    </div>
                </section>

                {/* ── REQUIREMENTS ── */}
                <section className="py-20 bg-[#fdf8f0]">
                    <div className="max-w-5xl mx-auto px-6">
                        <div className="text-center mb-12">
                            <span className="inline-block px-4 py-1.5 rounded-full bg-amber-100 text-amber-700 text-xs font-bold uppercase tracking-widest mb-6">Documents</span>
                            <h2 className="text-3xl md:text-4xl font-black text-[#0f172a] mb-3">
                                What are the <span className="text-amber-700">Requirements?</span>
                            </h2>
                            <p className="text-slate-500 text-sm">Here are the Clearance requirements you need to prepare.</p>
                        </div>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div className="bg-white rounded-2xl border border-slate-100 shadow-sm p-6">
                                <h3 className="font-black text-[#0f172a] text-sm mb-4 flex items-center gap-2">
                                    <span className="w-6 h-6 rounded-full bg-blue-100 text-blue-600 flex items-center justify-center text-xs font-black">1</span>
                                    Valid Government-Issued ID (2 required)
                                </h3>
                                <ul className="space-y-2">
                                    {['Passport','Driver\'s License','UMID','SSS ID','GSIS ID','Postal ID','Voter\'s ID','PRC License','PhilHealth ID'].map(id => (
                                        <li key={id} className="flex items-center gap-2 text-sm text-slate-600">
                                            <span className="w-2 h-2 rounded-full bg-amber-500 flex-shrink-0" />
                                            {id}
                                        </li>
                                    ))}
                                </ul>
                            </div>
                            <div className="space-y-4">
                                <div className="bg-white rounded-2xl border border-slate-100 shadow-sm p-6">
                                    <h3 className="font-black text-[#0f172a] text-sm mb-3">ID Requirements:</h3>
                                    <ul className="space-y-1.5">
                                        {['Original copy (no photocopies)','Clear photo','Not expired','In good condition'].map(r => (
                                            <li key={r} className="flex items-center gap-2 text-sm text-slate-600">
                                                <span className="w-2 h-2 rounded-full bg-amber-500 flex-shrink-0" />
                                                {r}
                                            </li>
                                        ))}
                                    </ul>
                                </div>
                                <div className="bg-white rounded-2xl border border-slate-100 shadow-sm p-6">
                                    <h3 className="font-black text-[#0f172a] text-sm mb-3">For First-Time Job Seekers:</h3>
                                    <p className="text-sm text-slate-600">Barangay Certificate (for waived fee)</p>
                                </div>
                                <div className="bg-white rounded-2xl border border-slate-100 shadow-sm p-6">
                                    <h3 className="font-black text-[#0f172a] text-sm mb-3">For Multipurpose Clearance NBI:</h3>
                                    <p className="text-sm text-slate-600">Two passport-sized photos, Two valid IDs (e.g. Passport, SSS Card, Birth Certificate)</p>
                                </div>
                            </div>
                        </div>
                    </div>
                </section>

                {/* ── HOW TO APPLY ── */}
                <section className="py-20 bg-white">
                    <div className="max-w-4xl mx-auto px-6">
                        <div className="text-center mb-12">
                            <span className="inline-block px-4 py-1.5 rounded-full bg-slate-100 text-slate-500 text-xs font-bold uppercase tracking-widest mb-6">Step-by-Step</span>
                            <h2 className="text-3xl md:text-4xl font-black text-[#0f172a] mb-3">
                                How to <span className="text-blue-600">Apply Online</span>
                            </h2>
                            <p className="text-slate-500 text-sm">Applying for a Clearance involves a straightforward process. Here is a detailed, step-by-step guide.</p>
                        </div>
                        <div className="space-y-4">
                            {steps.map((s, i) => (
                                <div key={i} className={`rounded-2xl p-6 flex gap-5 items-start ${i % 2 === 0 ? 'bg-[#fdf8f0]' : 'bg-white border border-slate-100 shadow-sm'}`}>
                                    <div className="w-10 h-10 rounded-full bg-[#1e3a5f] text-white font-black text-sm flex items-center justify-center flex-shrink-0">
                                        {s.n}
                                    </div>
                                    <div>
                                        <h3 className="font-black text-[#0f172a] text-sm mb-1">{s.title}</h3>
                                        <p className="text-slate-500 text-sm leading-relaxed">{s.desc}</p>
                                    </div>
                                </div>
                            ))}
                        </div>
                        <div className="text-center mt-10">
                            <Link href={route('register')} className="inline-flex items-center gap-2 px-8 py-4 rounded-2xl bg-[#1e3a5f] text-white font-black text-sm hover:bg-[#1d4ed8] transition-all shadow-lg">
                                Register Now →
                            </Link>
                        </div>
                    </div>
                </section>

                {/* ── TIPS ── */}
                <section className="py-20 bg-[#7a1414]">
                    <div className="max-w-5xl mx-auto px-6">
                        <div className="text-center mb-12">
                            <span className="inline-block px-4 py-1.5 rounded-full bg-white/10 text-amber-300 text-xs font-bold uppercase tracking-widest mb-6">Pro Tips</span>
                            <h2 className="text-3xl md:text-4xl font-black text-white mb-3">
                                Tips for a <span className="text-amber-400">Smooth Process</span>
                            </h2>
                            <p className="text-white/60 text-sm">Follow these tips to streamline your NBI process and avoid common pitfalls.</p>
                        </div>
                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                            {tips.map(t => (
                                <div key={t.n} className="bg-white/10 border border-white/20 rounded-2xl p-5 hover:bg-white/15 transition-all">
                                    <div className="text-amber-400 font-black text-2xl mb-3">{t.n}</div>
                                    <h3 className="text-white font-bold text-sm mb-2">{t.title}</h3>
                                    <p className="text-white/60 text-xs leading-relaxed">{t.desc}</p>
                                </div>
                            ))}
                        </div>
                        <p className="text-center text-white/50 text-sm mt-10">
                            By following these tips, you can streamline your NBI process and avoid common pitfalls, ensuring a quicker and more efficient experience.
                        </p>
                    </div>
                </section>

                {/* ── COMMON ISSUES ── */}
                <section className="py-20 bg-white">
                    <div className="max-w-5xl mx-auto px-6">
                        <div className="text-center mb-12">
                            <span className="inline-block px-4 py-1.5 rounded-full bg-slate-100 text-slate-500 text-xs font-bold uppercase tracking-widest mb-6">Troubleshooting</span>
                            <h2 className="text-3xl md:text-4xl font-black text-[#0f172a] mb-3">
                                Common Issues & <span className="text-blue-600">How to Resolve Them</span>
                            </h2>
                            <p className="text-slate-500 text-sm">Understanding these common issues will help you navigate the NBI clearance process smoothly.</p>
                        </div>
                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
                            {issues.map(issue => (
                                <div key={issue.title} className="bg-white border border-slate-100 rounded-2xl p-6 shadow-sm hover:shadow-md transition-all">
                                    <div className="flex items-center gap-2 mb-3">
                                        <span className="w-2 h-2 rounded-full bg-blue-500 flex-shrink-0" />
                                        <h3 className="font-black text-[#0f172a] text-sm">{issue.title}</h3>
                                    </div>
                                    <p className="text-slate-500 text-xs leading-relaxed">{issue.desc}</p>
                                </div>
                            ))}
                        </div>
                    </div>
                </section>

                {/* ── FAQ ── */}
                <section className="py-20 bg-[#fdf8f0]">
                    <div className="max-w-3xl mx-auto px-6">
                        <div className="text-center mb-12">
                            <span className="inline-block px-4 py-1.5 rounded-full bg-amber-100 text-amber-700 text-xs font-bold uppercase tracking-widest mb-6">FAQs</span>
                            <h2 className="text-3xl md:text-4xl font-black text-[#0f172a] mb-3">
                                Frequently Asked <span className="text-amber-700">Questions</span>
                            </h2>
                            <p className="text-slate-500 text-sm">Find answers to the most common questions about NBI Clearance.</p>
                        </div>
                        <div className="space-y-3">
                            {faqs.map(f => <FAQItem key={f.q} q={f.q} a={f.a} />)}
                        </div>
                    </div>
                </section>

                {/* ── FOOTER ── */}
                <footer className="bg-[#0f172a] py-10">
                    <div className="max-w-7xl mx-auto px-6 flex flex-col sm:flex-row items-center justify-between gap-4">
                        <div className="flex items-center gap-3">
                            <div className="w-8 h-8 bg-white/10 rounded-xl flex items-center justify-center border border-white/20">
                                <span className="text-base">🛡️</span>
                            </div>
                            <span className="text-white font-black text-base tracking-tight">
                                NBI <span className="text-blue-400">SYS</span>
                            </span>
                        </div>
                        <p className="text-blue-300/40 text-xs">© {new Date().getFullYear()} NBI Clearance Online System. All rights reserved.</p>
                        <div className="flex items-center gap-4">
                            <Link href={route('login')} className="text-blue-300/50 text-xs hover:text-blue-300 transition-all">Sign In</Link>
                            <Link href={route('register')} className="text-blue-300/50 text-xs hover:text-blue-300 transition-all">Register</Link>
                        </div>
                    </div>
                </footer>

            </div>
        </>
    );
}