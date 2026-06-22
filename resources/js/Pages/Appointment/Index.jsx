import React, { useState, useEffect, useMemo } from 'react';
import { Head, router, usePage } from '@inertiajs/react';
import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';

// ─── CALENDAR COMPONENT ──────────────────────────────────────────────────────
function CalendarPicker({ selectedDate, onSelect }) {
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    const [view, setView] = useState({
        year: today.getFullYear(),
        month: today.getMonth(),
    });

    const MONTHS = [
        'January','February','March','April','May','June',
        'July','August','September','October','November','December',
    ];

    const daysInMonth   = new Date(view.year, view.month + 1, 0).getDate();
    const firstWeekDay  = new Date(view.year, view.month, 1).getDay();

    const navigate = (dir) => {
        setView(prev => {
            let m = prev.month + dir;
            let y = prev.year;
            if (m < 0)  { m = 11; y--; }
            if (m > 11) { m = 0;  y++; }
            return { year: y, month: m };
        });
    };

    const handleClick = (day) => {
        const d = new Date(view.year, view.month, day);
        if (d <= today || d.getDay() === 0) return;
        const iso = `${view.year}-${String(view.month + 1).padStart(2,'0')}-${String(day).padStart(2,'0')}`;
        onSelect(iso);
    };

    const cells = [
        ...Array(firstWeekDay).fill(null),
        ...Array.from({ length: daysInMonth }, (_, i) => i + 1),
    ];

    return (
        <div className="bg-white rounded-2xl border border-slate-200 p-5 select-none">
            {/* Month Navigation */}
            <div className="flex items-center justify-between mb-4">
                <button onClick={() => navigate(-1)}
                    className="p-2 rounded-lg hover:bg-slate-100 transition-colors text-slate-500 hover:text-slate-900">
                    <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 19l-7-7 7-7" />
                    </svg>
                </button>
                <p className="font-bold text-slate-900 text-sm">{MONTHS[view.month]} {view.year}</p>
                <button onClick={() => navigate(1)}
                    className="p-2 rounded-lg hover:bg-slate-100 transition-colors text-slate-500 hover:text-slate-900">
                    <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5l7 7-7 7" />
                    </svg>
                </button>
            </div>

            {/* Day Labels */}
            <div className="grid grid-cols-7 mb-1">
                {['Su','Mo','Tu','We','Th','Fr','Sa'].map(d => (
                    <div key={d} className={`text-center text-[10px] font-black uppercase tracking-wider py-1.5 ${d === 'Su' ? 'text-rose-400' : 'text-slate-400'}`}>
                        {d}
                    </div>
                ))}
            </div>

            {/* Day Grid */}
            <div className="grid grid-cols-7 gap-0.5">
                {cells.map((day, idx) => {
                    if (!day) return <div key={`e-${idx}`} />;

                    const thisDate  = new Date(view.year, view.month, day);
                    const isPast    = thisDate <= today;  // Fixed: strictly less than today
                    const isSunday  = thisDate.getDay() === 0;
                    const disabled  = isPast || isSunday;
                    const iso       = `${view.year}-${String(view.month+1).padStart(2,'0')}-${String(day).padStart(2,'0')}`;
                    const isSelected = selectedDate === iso;
                    const isToday   = thisDate.getTime() === today.getTime();

                    return (
                        <button
                            key={day}
                            type="button"
                            onClick={() => handleClick(day)}
                            disabled={disabled}
                            className={[
                                'aspect-square flex items-center justify-center text-xs rounded-lg font-semibold transition-all',
                                isSelected  ? 'bg-blue-600 text-white shadow-md scale-110'          : '',
                                !isSelected && isToday   ? 'ring-2 ring-blue-400 text-blue-700 font-bold' : '',
                                !isSelected && !disabled ? 'hover:bg-blue-50 hover:text-blue-700 text-slate-700 cursor-pointer' : '',
                                disabled    ? 'text-slate-200 cursor-not-allowed lines-through opacity-40' : '',
                            ].join(' ')}
                        >
                            {day}
                        </button>
                    );
                })}
            </div>

            {/* Legend */}
            <div className="mt-4 pt-3 border-t border-slate-100 flex items-center gap-4 text-[10px] text-slate-400 flex-wrap">
                <span className="flex items-center gap-1.5">
                    <span className="w-3 h-3 rounded bg-blue-600 inline-block" /> Selected
                </span>
                <span className="flex items-center gap-1.5">
                    <span className="w-3 h-3 rounded ring-2 ring-blue-400 inline-block" /> Today
                </span>
                <span className="flex items-center gap-1.5 text-rose-300">
                    <span className="w-3 h-3 rounded bg-rose-100 inline-block" /> Sunday (Closed)
                </span>
            </div>
        </div>
    );
}

// ─── MAIN PAGE ────────────────────────────────────────────────────────────────
export default function AppointmentIndex({ myAppointment, paidClearance, releasedClearance }) {
    const { flash, errors } = usePage().props;

    const [appointmentType, setAppointmentType] = useState('scheduled');
    const [selectedDate,    setSelectedDate]    = useState('');
    const [selectedSlot,    setSelectedSlot]    = useState('');
    const [notes,           setNotes]           = useState('');
    const [slots,           setSlots]           = useState([]);
    const [loadingSlots,    setLoadingSlots]    = useState(false);
    const [submitting,      setSubmitting]      = useState(false);
    const [showCancel,      setShowCancel]      = useState(false);

    // Auto-handle type swap logic
    useEffect(() => {
        if (appointmentType === 'walk_in') {
            setSelectedSlot('Walk-in'); // Bypass slot matching on client side
        } else {
            if (selectedSlot === 'Walk-in') setSelectedSlot('');
        }
    }, [appointmentType]);

    // Fetch time slots whenever selected date changes (Only if scheduled mode)
    useEffect(() => {
        if (!selectedDate || appointmentType === 'walk_in') { 
            if (appointmentType !== 'walk_in') { setSlots([]); setSelectedSlot(''); }
            return; 
        }
        setLoadingSlots(true);
        setSelectedSlot('');
        fetch(`/appointment/slots?date=${selectedDate}`)
            .then(r => r.json())
            .then(data => { setSlots(Array.isArray(data) ? data : []); setLoadingSlots(false); })
            .catch(() => setLoadingSlots(false));
    }, [selectedDate, appointmentType]);

    const handleBook = () => {
        if (!selectedDate || !selectedSlot) return;
        setSubmitting(true);
        router.post(route('appointment.store'), {
            appointment_date: selectedDate,
            time_slot: selectedSlot,
            type: appointmentType,
            notes,
        }, { onFinish: () => setSubmitting(false) });
    };

    const handleCancel = () => {
        router.delete(route('appointment.cancel', myAppointment.id), {
            onSuccess: () => setShowCancel(false),
        });
    };

        const fmtDate = (str) => {
        if (!str) return 'N/A';
        try {
            const dateStr = typeof str === 'string' ? str.substring(0, 10) : str;
            const [y, m, d] = dateStr.split('-');
            return new Date(Number(y), Number(m) - 1, Number(d)).toLocaleDateString('en-PH', {
                weekday: 'long', year: 'numeric', month: 'long', day: 'numeric',
            });
        } catch { return str; }
    };

    const statusStyle = {
        pending:   'bg-amber-100 text-amber-700 border-amber-200',
        confirmed: 'bg-emerald-100 text-emerald-700 border-emerald-200',
        cancelled: 'bg-rose-100 text-rose-700 border-rose-200',
        completed: 'bg-blue-100 text-blue-700 border-blue-200',
    };

    const headerContent = (
        <h2 className="font-bold text-2xl text-slate-900 tracking-tight">
            My Appointment
            <span className="text-slate-400 font-normal text-sm ml-2">| NBI Clearance Scheduling</span>
        </h2>
    );

    // Conditional visibility helper for submit triggers
    const canSubmitForm = selectedDate && selectedSlot;

    return (
        <AuthenticatedLayout header={headerContent}>
            <Head title="My Appointment" />

            <div className="max-w-4xl mx-auto space-y-6 pb-12 pt-6">

                {/* Flash Messages */}
                {flash?.success && (
                    <div className="px-4 py-3 bg-emerald-50 border border-emerald-200 text-emerald-800 rounded-xl text-sm font-medium shadow-sm">
                        ✅ {flash.success}
                    </div>
                )}
                {errors?.appointment && (
                    <div className="px-4 py-3 bg-rose-50 border border-rose-200 text-rose-800 rounded-xl text-sm font-medium shadow-sm">
                        ❌ {errors.appointment}
                    </div>
                )}

                {/* ═══════════ EXISTING APPOINTMENT VIEW ═══════════ */}
                {myAppointment ? (
                    <div className="space-y-4">
                        {/* Queue Number Hero */}
                        <div className="bg-slate-900 rounded-2xl p-8 flex flex-col md:flex-row items-center justify-between gap-6 shadow-xl">
                            <div className="w-full md:w-auto">
                                <p className="text-slate-400 text-xs font-bold uppercase tracking-widest mb-2">Your Queue Number</p>
                                <div className="text-6xl font-black text-white tracking-tight font-mono leading-none">
                                    {myAppointment.queue_number}
                                </div>
                                <div className="mt-4 flex flex-col gap-1">
                                    <p className="text-slate-500 text-xs font-bold uppercase tracking-widest">NBI Tracking No.</p>
                                    <p className="text-blue-400 font-mono font-black text-lg">
                                        {myAppointment.clearance?.tracking_no || myAppointment.tracking_no}
                                    </p>
                                </div>
                            </div>
                            <div className="flex flex-col items-end gap-3 w-full md:w-auto">
                                <span className={`inline-flex items-center px-4 py-2 rounded-full text-xs font-black uppercase tracking-widest border ${statusStyle[myAppointment.status]}`}>
                                    ● {myAppointment.status}
                                </span>
                                <p className="text-slate-500 text-xs text-right">
                                    {myAppointment.type === 'walk_in' ? '🚶 Walk-in' : '📅 Scheduled'}
                                </p>
                            </div>
                        </div>

                        {/* Details View */}
                        <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-6">
                            <h3 className="font-bold text-lg text-slate-900 mb-5">Appointment Details</h3>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <div className="bg-slate-50 rounded-xl p-4 border border-slate-100">
                                    <p className="text-xs font-semibold text-slate-400 uppercase tracking-wider mb-1">Appointment Date</p>
                                    <p className="text-slate-900 font-bold">{fmtDate(myAppointment.appointment_date)}</p>
                                </div>
                                <div className="bg-slate-50 rounded-xl p-4 border border-slate-100">
                                    <p className="text-xs font-semibold text-slate-400 uppercase tracking-wider mb-1">Time Slot</p>
                                    <p className="text-slate-900 font-bold">{myAppointment.time_slot}</p>
                                </div>
                                <div className="bg-slate-50 rounded-xl p-4 border border-slate-100">
                                    <p className="text-xs font-semibold text-slate-400 uppercase tracking-wider mb-1">Tracking Number</p>
                                    <p className="text-blue-600 font-mono font-bold">{myAppointment.clearance?.tracking_no || myAppointment.tracking_no}</p>
                                </div>
                                <div className="bg-slate-50 rounded-xl p-4 border border-slate-100">
                                    <p className="text-xs font-semibold text-slate-400 uppercase tracking-wider mb-1">Queue Number</p>
                                    <p className="text-slate-900 font-mono font-bold text-lg">{myAppointment.queue_number}</p>
                                </div>
                            </div>

                            {['pending', 'confirmed'].includes(myAppointment.status) && (
                                <div className="mt-6 flex justify-end">
                                    <button onClick={() => setShowCancel(true)}
                                        className="px-5 py-2 rounded-xl bg-rose-50 text-rose-600 border border-rose-200 text-sm font-semibold hover:bg-rose-100 transition-colors">
                                        Cancel Appointment
                                    </button>
                                </div>
                            )}
                        </div>
                    </div>
                ) : releasedClearance ? (
                    /* ═══════════ RELEASED VIEW ═══════════ */
                    <div className="bg-white rounded-2xl border border-slate-200 shadow-xl overflow-hidden">
                        <div className="bg-emerald-500 h-2 w-full" />
                        <div className="p-10 text-center">
                            <h3 className="text-2xl font-black text-slate-800 mb-3">Clearance Released!</h3>
                            <a href={route('application.status')} className="w-full max-w-xs mx-auto py-4 bg-emerald-600 text-white rounded-xl font-bold hover:bg-emerald-700 transition-all shadow-lg flex items-center justify-center">
                                View My Clearance →
                            </a>
                        </div>
                    </div>
                ) : !paidClearance ? (
                    /* ═══════════ UNPAID REDIRECTS ═══════════ */
                    <div className="flex flex-col gap-3 max-w-xs mx-auto">
                        <a href={route('payment.show', 'LATEST')} className="w-full py-4 bg-blue-600 text-white rounded-xl font-bold text-center shadow-lg">
                            Go to Payment Center
                        </a>
                    </div>
                ) : (
                    /* ═══════════ BOOKING FORM ═══════════ */
                    <div className="space-y-5">
                        <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-6">
                            <h3 className="font-bold text-lg text-slate-900">Book an Appointment</h3>
                            <p className="text-sm text-slate-500 mt-1">
                                Tracking Code: <span className="font-mono font-bold text-blue-600">{paidClearance.tracking_no}</span>
                            </p>
                        </div>

                        {/* STEP 1 — Type Selection */}
                        <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-6">
                            <h3 className="font-bold text-xs text-slate-500 uppercase tracking-widest mb-4 flex items-center gap-2">
                                <span className="w-6 h-6 rounded-full bg-slate-900 text-white text-xs flex items-center justify-center font-black">1</span>
                                Select Appointment Type
                            </h3>
                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                {[
                                    { value: 'scheduled', label: 'Scheduled', desc: 'Pick a specific date and time slot in advance.', icon: 'M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z' },
                                    { value: 'walk_in', label: 'Walk-in', desc: 'Process without strict time constraints.', icon: 'M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0z' }
                                ].map(t => (
                                    <button key={t.value} type="button" onClick={() => setAppointmentType(t.value)}
                                        className={`p-5 rounded-xl border-2 text-left transition-all ${appointmentType === t.value ? 'border-blue-500 bg-blue-50' : 'border-slate-200 bg-white'}`}>
                                        <p className="font-bold text-sm text-slate-900">{t.label}</p>
                                        <p className="text-xs text-slate-500 mt-1">{t.desc}</p>
                                    </button>
                                ))}
                            </div>
                        </div>

                        {/* STEP 2 — Date Selection */}
                        <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-6">
                            <h3 className="font-bold text-xs text-slate-500 uppercase tracking-widest mb-4 flex items-center gap-2">
                                <span className="w-6 h-6 rounded-full bg-slate-900 text-white text-xs flex items-center justify-center font-black">2</span>
                                Select Date
                            </h3>
                            <CalendarPicker selectedDate={selectedDate} onSelect={setSelectedDate} />
                        </div>

                        {/* STEP 3 — Time Slot Picker (Conditional for Scheduled Mode only) */}
                        {selectedDate && appointmentType === 'scheduled' && (
                            <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-6">
                                <h3 className="font-bold text-xs text-slate-500 uppercase tracking-widest mb-4 flex items-center gap-2">
                                    <span className="w-6 h-6 rounded-full bg-slate-900 text-white text-xs flex items-center justify-center font-black">3</span>
                                    Select Time Slot
                                </h3>
                                {loadingSlots ? (
                                    <div className="text-center py-6 text-sm text-slate-400">Loading slots...</div>
                                ) : (
                                    <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                                        {slots.map(s => {
                                            const full = s.available === 0;
                                            const isSelected = selectedSlot === s.slot;
                                            return (
                                                <button key={s.slot} type="button" disabled={full} onClick={() => setSelectedSlot(s.slot)}
                                                    className={`p-3 rounded-xl border-2 text-center text-xs font-bold ${isSelected ? 'bg-blue-600 text-white border-blue-500' : 'bg-white border-slate-200'}`}>
                                                    {s.slot} <span className="block text-[10px] font-normal">{full ? 'FULL' : `${s.available} open`}</span>
                                                </button>
                                            );
                                        })}
                                    </div>
                                )}
                            </div>
                        )}

                        {/* STEP 4 — Optional Notes */}
                        {selectedDate && (appointmentType === 'walk_in' || selectedSlot) && (
                            <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-6">
                                <h3 className="font-bold text-xs text-slate-500 uppercase tracking-widest mb-4 flex items-center gap-2">
                                    <span className="w-6 h-6 rounded-full bg-slate-900 text-white text-xs flex items-center justify-center font-black">
                                        {appointmentType === 'walk_in' ? '3' : '4'}
                                    </span>
                                    Additional Notes <span className="text-slate-400 font-normal normal-case text-xs">(Optional)</span>
                                </h3>
                                <textarea value={notes} onChange={e => setNotes(e.target.value)} rows={3} className="w-full border border-slate-200 bg-slate-50 rounded-xl p-3 text-sm focus:outline-none focus:bg-white resize-none" placeholder="Special concerns..." />
                            </div>
                        )}

                        {/* Submit Actions */}
                        {canSubmitForm && (
                            <button onClick={handleBook} disabled={submitting}
                                className="w-full py-4 rounded-2xl bg-slate-900 text-white font-bold text-base hover:bg-slate-700 transition-all shadow-lg disabled:opacity-50">
                                {submitting ? 'Booking your appointment...' : 'Confirm Appointment →'}
                            </button>
                        )}
                    </div>
                )}
            </div>

            {/* Modal Dialog */}
            {showCancel && myAppointment && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm p-4" onClick={() => setShowCancel(false)}>
                    <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md overflow-hidden" onClick={e => e.stopPropagation()}>
                        <div className="p-6">
                            <p className="text-slate-700 text-sm">Are you sure you want to cancel your appointment?</p>
                        </div>
                        <div className="border-t border-slate-100 px-6 py-4 flex justify-end gap-3">
                            <button onClick={() => setShowCancel(false)} className="px-5 py-2 rounded-xl border text-sm font-semibold">Keep</button>
                            <button onClick={handleCancel} className="px-5 py-2 rounded-xl bg-rose-600 text-white text-sm font-semibold">Cancel</button>
                        </div>
                    </div>
                </div>
            )}
        </AuthenticatedLayout>
    );
}