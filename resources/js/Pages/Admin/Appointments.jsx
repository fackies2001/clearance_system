import React, { useState, useEffect, useRef } from 'react';
import { Head, router, usePage, Link } from '@inertiajs/react';
import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';

const STATUS_CONFIG = {
    pending:   { label: 'Pending',   classes: 'bg-amber-50 text-amber-700 border-amber-200',    dot: 'bg-amber-400'   },
    confirmed: { label: 'Confirmed', classes: 'bg-emerald-50 text-emerald-700 border-emerald-200', dot: 'bg-emerald-400' },
    cancelled: { label: 'Cancelled', classes: 'bg-rose-50 text-rose-700 border-rose-200',        dot: 'bg-rose-400'    },
    completed: { label: 'Completed', classes: 'bg-blue-50 text-blue-700 border-blue-200',        dot: 'bg-blue-400'    },
};

const RANGE_OPTIONS = [
    { key: 'today',       label: 'Today'            },
    { key: 'yesterday',   label: 'Yesterday'        },
    { key: 'last_7_days', label: 'Last 7 Days'      },
    { key: 'last_month',  label: 'Last Month'       },
    { key: 'last_year',   label: 'Last Year'        },
    { key: 'all_time',    label: 'All-Time Records' },
];

const getRangeLabel = (range) => {
    const found = RANGE_OPTIONS.find(o => o.key === range);
    if (found) return found.label;
    if (range && /^\d{4}-\d{2}-\d{2}$/.test(range)) {
        const [y, m, d] = range.split('-');
        return `${m}/${d}/${y}`;
    }
    return 'Today';
};

export default function AdminAppointments({ appointments = {}, stats = {}, filters = {} }) {
    const { flash } = usePage().props;
    const dataRows = appointments.data || [];
    const dropdownRef = useRef(null);

    const [searchTerm, setSearchTerm]         = useState(filters.search || '');
    const [isDropdownOpen, setIsDropdownOpen] = useState(false);
    const [selected, setSelected]             = useState(null);
    const [confirmModal, setConfirmModal]     = useState(null);

    useEffect(() => {
        const handler = (e) => {
            if (dropdownRef.current && !dropdownRef.current.contains(e.target)) {
                setIsDropdownOpen(false);
            }
        };
        document.addEventListener('mousedown', handler);
        return () => document.removeEventListener('mousedown', handler);
    }, []);

    const updateFilters = (newParams) => {
        router.get(route('admin.appointments.index'), {
            search:     searchTerm,
            status:     filters.status     || '',
            range: filters.range || 'all_time',
            per_page:   filters.per_page   || 10,
            sort_field: filters.sort_field || 'time_slot',
            sort_order: filters.sort_order || 'asc',
            ...newParams,
        }, { preserveState: true, preserveScroll: true, replace: true });
    };

    useEffect(() => {
        const t = setTimeout(() => {
            if (searchTerm !== (filters.search || '')) updateFilters({ search: searchTerm });
        }, 400);
        return () => clearTimeout(t);
    }, [searchTerm]);

    const handleSort = (field) => {
        const isAsc = filters.sort_field === field && filters.sort_order === 'asc';
        updateFilters({ sort_field: field, sort_order: isAsc ? 'desc' : 'asc' });
    };

    const confirmUpdate = () => {
        router.patch(
            route('admin.appointments.update-status', confirmModal.appointment.id),
            { status: confirmModal.newStatus },
            { preserveScroll: true, onFinish: () => setConfirmModal(null) }
        );
    };

    const fmtDate = (str) => {
    if (!str) return 'N/A';
    try {
        // Handle both "YYYY-MM-DD" and "YYYY-MM-DDTHH:mm:ss.000000Z"
        const dateStr = typeof str === 'string' ? str.substring(0, 10) : str;
        const [y, m, d] = dateStr.split('-');
        return new Date(Number(y), Number(m) - 1, Number(d)).toLocaleDateString('en-PH', {
            month: 'short', day: 'numeric', year: 'numeric',
        });
    } catch { return 'Invalid Date'; }
};

    const SortIcon = ({ field }) => {
        const active = filters.sort_field === field;
        const asc    = filters.sort_order === 'asc';
        return (
            <span className="ml-1 flex flex-col gap-[2px]">
                <svg className={`w-2 h-2 ${active && asc ? 'text-white' : 'text-slate-500'}`} viewBox="0 0 8 5" fill="currentColor">
                    <path d="M4 0L8 5H0L4 0Z" />
                </svg>
                <svg className={`w-2 h-2 ${active && !asc ? 'text-white' : 'text-slate-500'}`} viewBox="0 0 8 5" fill="currentColor">
                    <path d="M4 5L0 0H8L4 5Z" />
                </svg>
            </span>
        );
    };

    /* ── Custom Select ─────────────────────────────────────────── */
    const StyledSelect = ({ value, onChange, children, minWidth = '' }) => (
        <div className="relative">
            <select
                value={value}
                onChange={onChange}
                className={`appearance-none border border-slate-200 rounded-lg pl-3 pr-8 py-1.5 text-sm bg-white text-slate-700 font-semibold focus:outline-none focus:ring-2 focus:ring-slate-200 cursor-pointer shadow-sm ${minWidth}`}
            >
                {children}
            </select>
            <svg className="pointer-events-none absolute right-2.5 top-1/2 -translate-y-1/2 w-3 h-3 text-slate-400" viewBox="0 0 12 12" fill="none" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 4.5l3 3 3-3" />
            </svg>
        </div>
    );

        const STAT_CARDS = [
        {
            label: 'Total Today',   value: stats.total     || 0,
            sub: `${stats.pending || 0} pending processing`,
            color: '#3b82f6', 
        },
        {
            label: 'Pending',       value: stats.pending   || 0,
            sub: 'Awaiting confirmation',
            color: '#f59e0b', 
        },
        {
            label: 'Confirmed',     value: stats.confirmed || 0,
            sub: 'Ready for processing',
            color: '#10b981', 
        },
        {
            label: 'Completed',     value: stats.completed || 0,
            sub: 'Successfully processed',
            color: '#8b5cf6', 
        },
    ];

    const TH = ({ field, children }) => (
        <th
            onClick={() => handleSort(field)}
            className="py-3.5 px-4 font-semibold text-xs tracking-wider uppercase border-r border-slate-700 cursor-pointer hover:bg-slate-700/60 transition-colors select-none last:border-r-0"
        >
            <div className="flex items-center gap-1">
                {children}
                <SortIcon field={field} />
            </div>
        </th>
    );

    return (
        <AuthenticatedLayout
            header={
                <div className="flex items-center gap-3">
                    <h2 className="font-bold text-xl text-slate-900 tracking-tight">Appointments</h2>
                    <span className="text-slate-300">|</span>
                    <span className="text-slate-400 text-sm font-normal">Schedule Management</span>
                </div>
            }
        >
            <Head title="Appointments" />

            <div className="max-w-7xl mx-auto space-y-5 pb-12 pt-6 px-4">

                {/* Flash */}
                {flash?.success && (
                    <div className="flex items-center gap-2.5 px-4 py-3 bg-emerald-50 border border-emerald-200 text-emerald-800 rounded-xl text-sm font-medium">
                        <span className="text-emerald-500">✓</span>
                        {flash.success}
                    </div>
                )}

                {/* ── Stats Cards ── */}
                <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
                    {STAT_CARDS.map(card => (
                        <div key={card.label} style={{
                            background: '#fff',
                            border: '1.5px solid #e2e8f0',
                            borderLeft: `4px solid ${card.color}`,
                            borderRadius: 14,
                            padding: '20px 22px',
                            display: 'flex',
                            justifyContent: 'space-between',
                            alignItems: 'flex-start',
                        }}>
                            <div>
                                <div style={{ fontSize: 11, color: '#94a3b8', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.08em', marginBottom: 6 }}>
                                    {card.label}
                                </div>
                                <div style={{ fontSize: 32, fontWeight: 800, color: card.color, lineHeight: 1 }}>
                                    {card.value}
                                </div>
                                {card.sub && (
                                    <div style={{ fontSize: 11, color: '#94a3b8', marginTop: 6, fontWeight: 500 }}>
                                        {card.sub}
                                    </div>
                                )}
                            </div>
                            <div style={{ fontSize: 26, opacity: 0.5 }}>{card.icon}</div>
                        </div>
                    ))}
                </div>

                {/* ── Main Table Card ── */}
                <div className="bg-white rounded-2xl border border-slate-200 shadow-sm">

                    {/* Card Header */}
                    <div className="px-6 pt-5 pb-4 border-b border-slate-100">
                        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">

                            {/* ── Left Controls ── */}
                            <div className="flex flex-wrap items-center gap-3">

                                {/* Show entries */}
                                <div className="flex items-center gap-2">
                                    <span className="text-sm font-medium text-slate-500">Show</span>
                                    <StyledSelect
                                        value={filters.per_page || 10}
                                        onChange={e => updateFilters({ per_page: e.target.value })}
                                    >
                                        {[5, 10, 25, 50, 100].map(v => <option key={v} value={v}>{v}</option>)}
                                    </StyledSelect>
                                    <span className="text-sm font-medium text-slate-500">entries</span>
                                </div>

                                <div className="h-5 w-px bg-slate-200 hidden sm:block" />

                                {/* Status */}
                                <div className="flex items-center gap-2">
                                    <span className="text-sm font-medium text-slate-500">Status:</span>
                                    <StyledSelect
                                        value={filters.status || ''}
                                        onChange={e => updateFilters({ status: e.target.value })}
                                        minWidth="min-w-[110px]"
                                    >
                                        <option value="">All Status</option>
                                        <option value="pending">Pending</option>
                                        <option value="confirmed">Confirmed</option>
                                        <option value="completed">Completed</option>
                                        <option value="cancelled">Cancelled</option>
                                    </StyledSelect>
                                </div>

                            </div>

                            {/* ── Right Controls ── */}
                            <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3">

                                {/* Date Range Dropdown */}
                                <div className="relative" ref={dropdownRef}>
                                    <button
                                        onClick={() => setIsDropdownOpen(v => !v)}
                                        className="flex items-center justify-between gap-3 border border-slate-200 bg-white rounded-lg px-4 py-2 text-sm font-semibold text-slate-700 shadow-sm hover:bg-slate-50 transition-colors focus:outline-none focus:ring-2 focus:ring-slate-200 w-full sm:w-auto min-w-[180px]"
                                    >
                                        <span className="flex items-center gap-2">
                                            <span>📅</span>
                                            <span>{getRangeLabel(filters.range || 'today')}</span>
                                        </span>
                                        <svg className={`w-3 h-3 text-slate-400 flex-shrink-0 transition-transform duration-200 ${isDropdownOpen ? 'rotate-180' : ''}`} viewBox="0 0 12 12" fill="none" stroke="currentColor">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 4.5l3 3 3-3" />
                                        </svg>
                                    </button>

                                    {isDropdownOpen && (
                                        <div className="absolute right-0 mt-2 bg-white border border-slate-200 shadow-xl rounded-xl p-1.5 z-50 w-56">
                                            {RANGE_OPTIONS.map(opt => {
                                                const active = (filters.range || 'today') === opt.key;
                                                return (
                                                    <button key={opt.key}
                                                        onClick={() => { updateFilters({ range: opt.key }); setIsDropdownOpen(false); }}
                                                        className={`w-full flex items-center gap-2.5 px-3 py-2 rounded-lg text-sm font-medium transition-colors text-left ${
                                                            active ? 'bg-slate-900 text-white' : 'text-slate-600 hover:bg-slate-50'
                                                        }`}
                                                    >
                                                        <span className="text-base">{opt.icon}</span>
                                                        <span>{opt.label}</span>
                                                        {active && <span className="ml-auto text-xs opacity-70">✓</span>}
                                                    </button>
                                                );
                                            })}
                                            <div className="h-px bg-slate-100 my-1.5 mx-1" />
                                            <div className="p-2 rounded-lg bg-slate-50 border border-slate-100 mx-0.5">
                                                <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-1.5">Custom Date</p>
                                                <input type="date"
                                                    defaultValue={!RANGE_OPTIONS.find(o => o.key === filters.range) ? filters.range : ''}
                                                    onChange={e => { if (e.target.value) { updateFilters({ range: e.target.value }); setIsDropdownOpen(false); } }}
                                                    className="w-full border border-slate-200 bg-white rounded-lg px-2.5 py-1.5 text-xs text-slate-700 focus:outline-none focus:ring-2 focus:ring-slate-200 cursor-pointer"
                                                />
                                            </div>
                                        </div>
                                    )}
                                </div>

                                {/* Search */}
                                <div className="flex items-center gap-2 text-sm text-slate-600">
                                    <span className="font-medium whitespace-nowrap text-slate-500">Search:</span>
                                    <div className="relative">
                                        <input
                                            type="text"
                                            value={searchTerm}
                                            onChange={e => setSearchTerm(e.target.value)}
                                            placeholder="Name, queue, time..."
                                            className="border border-slate-200 rounded-lg pl-3 pr-8 py-2 text-sm w-full sm:w-52 focus:outline-none focus:ring-2 focus:ring-slate-200 shadow-sm bg-white placeholder-slate-400"
                                        />
                                        {searchTerm && (
                                            <button onClick={() => setSearchTerm('')} className="absolute right-2.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 transition-colors text-xs">✕</button>
                                        )}
                                    </div>
                                </div>

                            </div>
                        </div>
                    </div>

                    {/* ── Table ── */}
                    <div className="overflow-x-auto">
                        <table className="w-full text-sm text-left">
                            <thead>
                                <tr className="bg-slate-800 text-slate-200 text-xs">
                                    <TH field="queue_number">Queue No.</TH>
                                    <TH field="user_id">Applicant</TH>
                                    <TH field="appointment_date">Date</TH>
                                    <TH field="time_slot">Time Slot</TH>
                                    <TH field="type">Type</TH>
                                    <TH field="status">Status</TH>
                                    <th className="py-3.5 px-4 font-semibold text-xs tracking-wider uppercase text-slate-400 select-none">Action</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-slate-100">
                                {dataRows.length === 0 ? (
                                    <tr>
                                        <td colSpan="7" className="py-20 text-center bg-slate-50/30">
                                            <div className="flex flex-col items-center gap-2">
                                                <div className="w-12 h-12 rounded-2xl bg-slate-100 flex items-center justify-center text-xl">📅</div>
                                                <p className="font-bold text-slate-600 text-sm">No appointments found</p>
                                                <p className="text-xs text-slate-400">Try adjusting your search or date filters</p>
                                            </div>
                                        </td>
                                    </tr>
                                ) : (
                                    dataRows.map(appt => (
                                        <tr key={appt.id}
                                            onClick={() => setSelected(appt)}
                                            className="hover:bg-slate-50 transition-colors cursor-pointer group"
                                        >
                                            {/* Queue */}
                                            <td className="px-4 py-3.5">
                                                <span className="font-mono font-bold text-blue-600 text-xs bg-blue-50 px-2 py-1 rounded-lg border border-blue-100">
                                                    {appt.queue_number}
                                                </span>
                                            </td>

                                            {/* Applicant */}
                                            <td className="px-4 py-3.5">
                                                <div className="flex items-center gap-3">
                                                    <div className="w-8 h-8 rounded-full bg-slate-800 text-white flex items-center justify-center text-xs font-bold uppercase flex-shrink-0 shadow-sm">
                                                        {appt.user?.name?.charAt(0) || '?'}
                                                    </div>
                                                    <div className="min-w-0">
                                                        <p className="font-semibold text-slate-800 group-hover:text-blue-600 transition-colors truncate text-xs leading-tight">{appt.user?.name || 'N/A'}</p>
                                                        <p className="text-[11px] text-slate-400 truncate leading-tight mt-0.5">{appt.user?.email}</p>
                                                    </div>
                                                </div>
                                            </td>

                                            {/* Date */}
                                            <td className="px-4 py-3.5 text-slate-600 text-xs font-medium whitespace-nowrap">{fmtDate(appt.appointment_date)}</td>

                                            {/* Time */}
                                            <td className="px-4 py-3.5">
                                                <span className="text-slate-700 text-xs font-bold">{appt.time_slot}</span>
                                            </td>

                                            {/* Type */}
                                            <td className="px-4 py-3.5">
                                                <span className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[10px] font-bold uppercase tracking-wide border ${
                                                    appt.type === 'walk_in'
                                                        ? 'bg-purple-50 text-purple-700 border-purple-200'
                                                        : 'bg-sky-50 text-sky-700 border-sky-200'
                                                }`}>
                                                    {appt.type === 'walk_in' ? '🚶 Walk-in' : '📅 Scheduled'}
                                                </span>
                                            </td>

                                            {/* Status */}
                                            <td className="px-4 py-3.5">
                                                <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[10px] font-bold uppercase tracking-wide border ${STATUS_CONFIG[appt.status]?.classes}`}>
                                                    <span className={`w-1.5 h-1.5 rounded-full ${STATUS_CONFIG[appt.status]?.dot} flex-shrink-0`} />
                                                    {STATUS_CONFIG[appt.status]?.label}
                                                </span>
                                            </td>

                                            {/* Action */}
                                            <td className="px-4 py-3.5" onClick={e => e.stopPropagation()}>
                                                <div className="relative">
                                                    <select
                                                        value={appt.status}
                                                        onChange={e => setConfirmModal({ appointment: appt, newStatus: e.target.value })}
                                                        className="appearance-none border border-slate-200 bg-white font-semibold rounded-lg py-1.5 pl-2.5 pr-8 text-xs focus:outline-none cursor-pointer text-slate-700 hover:border-slate-300 transition-all shadow-sm min-w-[110px]"
                                                    >
                                                        <option value="pending">Pending</option>
                                                        <option value="confirmed">Confirmed</option>
                                                        <option value="completed">Completed</option>
                                                        <option value="cancelled">Cancelled</option>
                                                    </select>
                                                    <svg className="pointer-events-none absolute right-2.5 top-1/2 -translate-y-1/2 w-3 h-3 text-slate-400" viewBox="0 0 12 12" fill="none" stroke="currentColor">
                                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 4.5l3 3 3-3" />
                                                    </svg>
                                                </div>
                                            </td>
                                        </tr>
                                    ))
                                )}
                            </tbody>
                        </table>
                    </div>

                    {/* ── Pagination Footer ── */}
                    <div className="px-6 py-4 border-t border-slate-100 flex flex-col sm:flex-row justify-between items-center gap-3">
                        <p className="text-xs font-medium text-slate-500">
                            Showing{' '}
                            <span className="text-slate-800 font-bold">{appointments.from || 0}</span>
                            {' '}to{' '}
                            <span className="text-slate-800 font-bold">{appointments.to || 0}</span>
                            {' '}of{' '}
                            <span className="text-slate-800 font-bold">{appointments.total || 0}</span>
                            {' '}entries
                        </p>

                        {appointments.links && appointments.links.length > 3 && (
                            <div className="flex items-center border border-slate-200 rounded-xl overflow-hidden shadow-sm bg-white">
                                {appointments.links.map((link, idx) => {
                                    let label = link.label
                                        .replace('&laquo; Previous', '← Prev')
                                        .replace('Next &raquo;', 'Next →');
                                    const isNum = !isNaN(label);
                                    return (
                                        <Link key={idx} href={link.url || '#'}
                                            className={`px-3 py-2 text-xs font-semibold border-r last:border-r-0 border-slate-200 flex items-center justify-center transition-all ${
                                                link.active
                                                    ? 'bg-slate-900 text-white'
                                                    : !link.url
                                                        ? 'bg-slate-50 text-slate-300 cursor-not-allowed pointer-events-none'
                                                        : 'bg-white text-slate-600 hover:bg-slate-50 hover:text-slate-900'
                                            }`}
                                            style={{ minWidth: isNum ? '36px' : 'auto' }}
                                        >
                                            {label}
                                        </Link>
                                    );
                                })}
                            </div>
                        )}
                    </div>
                </div>
            </div>

            {/* ── Detail Modal ── */}
            {selected && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4" onClick={() => setSelected(null)}>
                    <div className="bg-white rounded-2xl shadow-2xl w-full max-w-lg overflow-hidden" onClick={e => e.stopPropagation()}>
                        <div className="bg-slate-900 px-6 py-5 flex items-start justify-between">
                            <div>
                                <h2 className="text-white font-bold text-lg leading-tight">Appointment Details</h2>
                                <p className="text-slate-400 text-xs mt-1 font-mono">{selected.queue_number}</p>
                            </div>
                            <button onClick={() => setSelected(null)} className="text-slate-400 hover:text-white transition-colors p-1.5 rounded-lg hover:bg-slate-800 mt-0.5">
                                <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M6 18L18 6M6 6l12 12" />
                                </svg>
                            </button>
                        </div>
                        <div className="p-6">
                            <div className="grid grid-cols-2 gap-3">
                                {[
                                    { label: 'Applicant',    value: selected.user?.name },
                                    { label: 'Email',        value: selected.user?.email },
                                    { label: 'Queue Number', value: selected.queue_number, mono: true },
                                    { label: 'Date',         value: fmtDate(selected.appointment_date) },
                                    { label: 'Time Slot',    value: selected.time_slot },
                                    { label: 'Type',         value: selected.type === 'walk_in' ? '🚶 Walk-in' : '📅 Scheduled' },
                                ].map(({ label, value, mono }) => (
                                    <div key={label} className="bg-slate-50 rounded-xl p-3.5 border border-slate-100">
                                        <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-1">{label}</p>
                                        <p className={`text-slate-900 font-semibold text-sm truncate ${mono ? 'font-mono' : ''}`}>{value || 'N/A'}</p>
                                    </div>
                                ))}
                                <div className="bg-slate-50 rounded-xl p-3.5 border border-slate-100">
                                    <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-1.5">Status</p>
                                    <span className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-wide border ${STATUS_CONFIG[selected.status]?.classes}`}>
                                        <span className={`w-1.5 h-1.5 rounded-full ${STATUS_CONFIG[selected.status]?.dot}`} />
                                        {STATUS_CONFIG[selected.status]?.label}
                                    </span>
                                </div>
                                {selected.notes && (
                                    <div className="bg-slate-50 rounded-xl p-3.5 border border-slate-100 col-span-2">
                                        <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-1">Notes</p>
                                        <p className="text-slate-700 text-sm">{selected.notes}</p>
                                    </div>
                                )}
                            </div>
                        </div>
                        <div className="border-t border-slate-100 px-6 py-4 flex justify-end bg-slate-50/50">
                            <button onClick={() => setSelected(null)} className="px-5 py-2.5 rounded-xl bg-slate-900 text-white text-sm font-semibold hover:bg-slate-800 transition-colors shadow-sm">
                                Close
                            </button>
                        </div>
                    </div>
                </div>
            )}

            {/* ── Confirm Status Modal ── */}
            {confirmModal && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4" onClick={() => setConfirmModal(null)}>
                    <div className="bg-white rounded-2xl shadow-2xl w-full max-w-sm overflow-hidden" onClick={e => e.stopPropagation()}>
                        <div className="bg-slate-900 px-6 py-5">
                            <h2 className="text-white font-bold text-base">Confirm Status Update</h2>
                            <p className="text-slate-400 text-xs mt-1 leading-relaxed">This will save changes and trigger registered workflow events.</p>
                        </div>
                        <div className="p-6">
                            <div className="bg-slate-50 rounded-xl border border-slate-100 overflow-hidden">
                                {[
                                    { label: 'Applicant',  value: confirmModal.appointment?.user?.name },
                                    { label: 'Queue No.',  value: confirmModal.appointment?.queue_number, mono: true },
                                    { label: 'Current',    value: confirmModal.appointment?.status?.toUpperCase() },
                                    { label: 'New Status', value: confirmModal.newStatus?.toUpperCase(),
                                      color: { confirmed: 'text-emerald-600', cancelled: 'text-rose-600', completed: 'text-blue-600', pending: 'text-amber-600' }[confirmModal.newStatus] },
                                ].map(({ label, value, mono, color }, i, arr) => (
                                    <div key={label} className={`flex justify-between items-center px-4 py-3 text-sm ${i < arr.length - 1 ? 'border-b border-slate-100' : ''}`}>
                                        <span className="text-slate-500 font-medium">{label}</span>
                                        <span className={`font-bold ${mono ? 'font-mono text-xs' : ''} ${color || 'text-slate-900'}`}>{value || 'N/A'}</span>
                                    </div>
                                ))}
                            </div>
                        </div>
                        <div className="border-t border-slate-100 px-6 py-4 flex justify-end gap-2.5 bg-slate-50/50">
                            <button onClick={() => setConfirmModal(null)} className="px-5 py-2.5 rounded-xl border border-slate-200 text-slate-700 text-sm font-semibold hover:bg-slate-100 transition-all">
                                Cancel
                            </button>
                            <button onClick={confirmUpdate} className="px-5 py-2.5 rounded-xl bg-slate-900 text-white text-sm font-semibold hover:bg-slate-800 transition-all shadow-sm">
                                Confirm Update
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </AuthenticatedLayout>
    );
}
