import React, { useState, useMemo } from 'react';
import { Head, router } from '@inertiajs/react';
import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';

// ── Action badge configuration mapping ──────────────────────────────────────
const ACTION_CONFIG = {
    status_changed: { label: 'Status Changed', color: '#3b82f6', bg: '#eff6ff', icon: '⇄' },
    role_updated:   { label: 'Role Updated',   color: '#8b5cf6', bg: '#f5f3ff', icon: '👤' },
    login:          { label: 'Login',           color: '#10b981', bg: '#ecfdf5', icon: '→' },
    logout:         { label: 'Logout',          color: '#6b7280', bg: '#f9fafb', icon: '←' },
    created:        { label: 'Created',         color: '#f59e0b', bg: '#fffbeb', icon: '+' },
    deleted:        { label: 'Deleted',         color: '#ef4444', bg: '#fef2f2', icon: '✕' },
};

function getActionConfig(action) {
    return ACTION_CONFIG[action] ?? { label: action, color: '#6b7280', bg: '#f9fafb', icon: '•' };
}

function ActionBadge({ action }) {
    const cfg = getActionConfig(action);
    return (
        <span style={{
            backgroundColor: cfg.bg,
            color: cfg.color,
            border: `1px solid ${cfg.color}30`,
            fontSize: '11px',
            fontWeight: '700',
            padding: '3px 10px',
            borderRadius: '20px',
            letterSpacing: '0.03em',
            display: 'inline-flex',
            alignItems: 'center',
            gap: '5px',
            whiteSpace: 'nowrap',
        }}>
            <span>{cfg.icon}</span>
            {cfg.label}
        </span>
    );
}

function formatDate(dateStr) {
    if (!dateStr) return '—';
    const d = new Date(dateStr);
    return d.toLocaleDateString('en-PH', { month: 'short', day: 'numeric', year: 'numeric' })
        + ' ' + d.toLocaleTimeString('en-PH', { hour: '2-digit', minute: '2-digit' });
}

function StatCard({ label, value, color }) {
    return (
        <div style={{
            background: '#fff',
            border: `1px solid #e5e7eb`,
            borderLeft: `4px solid ${color}`,
            borderRadius: '12px',
            padding: '16px 20px',
            display: 'flex',
            alignItems: 'center',
            minWidth: '140px',
            flex: 1,
        }}>
            <div>
                <p style={{ fontSize: '22px', fontWeight: '800', color: '#111827', lineHeight: 1 }}>{value}</p>
                <p style={{ fontSize: '11px', color: '#6b7280', marginTop: '2px', fontWeight: '600', textTransform: 'uppercase', letterSpacing: '0.05em' }}>{label}</p>
            </div>
        </div>
    );
}

export default function AuditLogs({ logs = [], stats = {}, currentFilter = 'today' }) {
    const [search, setSearch]         = useState('');
    const [filterAction, setFilter]   = useState('all');
    const [perPage, setPerPage]       = useState(10);
    const [page, setPage]             = useState(1);
    const [sortConfig, setSortConfig] = useState({ key: 'created_at', direction: 'desc' });
    const [dateFilter, setDateFilter] = useState(currentFilter);

    // Dynamic distinct action types filtered through collection properties
    const uniqueActions = useMemo(() => [...new Set(logs.map(l => l.action))], [logs]);

    const requestSort = (key) => {
        let direction = 'asc';
        if (sortConfig.key === key && sortConfig.direction === 'asc') {
            direction = 'desc';
        }
        setSortConfig({ key, direction });
        setPage(1);
    };

    // Client side filtering for table records layout tracking matrices
    const processedLogs = useMemo(() => {
        let result = logs.filter(log => {
            const matchAction = filterAction === 'all' || log.action === filterAction;
            const q = search.toLowerCase();
            return matchAction && (!q
                || log.admin?.toLowerCase().includes(q)
                || log.description?.toLowerCase().includes(q));
        });

        if (sortConfig.key !== null) {
            result.sort((a, b) => {
                let aVal = a[sortConfig.key];
                let bVal = b[sortConfig.key];

                if (sortConfig.key === 'created_at') {
                    aVal = new Date(aVal);
                    bVal = new Date(bVal);
                } else {
                    aVal = aVal?.toString().toLowerCase() || '';
                    bVal = bVal?.toString().toLowerCase() || '';
                }

                if (aVal < bVal) return sortConfig.direction === 'asc' ? -1 : 1;
                if (aVal > bVal) return sortConfig.direction === 'asc' ? 1 : -1;
                return 0;
            });
        }
        return result;
    }, [logs, search, filterAction, sortConfig]);

    const totalEntries = processedLogs.length;
    const totalPages = Math.max(1, Math.ceil(totalEntries / perPage));
    
    const indexOfLastRecord = page * perPage;
    const indexOfFirstRecord = indexOfLastRecord - perPage;
    const paginated = processedLogs.slice(indexOfFirstRecord, indexOfLastRecord);

    const showingFrom = totalEntries === 0 ? 0 : indexOfFirstRecord + 1;
    const showingTo = indexOfLastRecord > totalEntries ? totalEntries : indexOfLastRecord;

    const handleFilterChange = (val) => { setFilter(val); setPage(1); };
    const handleSearch = (e) => { setSearch(e.target.value); setPage(1); };

    // Handles live server-side date range filtering via Inertia router requests
    const handleDateFilterChange = (e) => {
        const selectedDateFilter = e.target.value;
        setDateFilter(selectedDateFilter);
        setPage(1);

        router.get(
            window.location.pathname,
            { date_filter: selectedDateFilter },
            {
                preserveState: true,
                preserveScroll: true,
                only: ['logs', 'currentFilter']
            }
        );
    };

    const renderSortArrows = (key) => {
        const active = sortConfig.key === key;
        const asc = sortConfig.direction === 'asc';
        return (
            <span className="ml-1 flex flex-col gap-[2px]">
                <svg className={`w-2 h-2 ${active && asc ? 'text-white' : 'text-slate-500'}`} viewBox="0 0 8 5" fill="currentColor">
                    <path d="M4 0L8 5H0L4 0Z"/>
                </svg>
                <svg className={`w-2 h-2 ${active && !asc ? 'text-white' : 'text-slate-500'}`} viewBox="0 0 8 5" fill="currentColor">
                    <path d="M4 5L0 0H8L4 5Z"/>
                </svg>
            </span>
        );
    };

    return (
        <AuthenticatedLayout
            header={
                <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                    <div style={{
                        width: '36px', height: '36px', borderRadius: '10px',
                        background: '#fef3c7', display: 'flex', alignItems: 'center', justifyContent: 'center',
                        fontSize: '18px', border: '1px solid #fcd34d'
                    }}>📋</div>
                    <div>
                        <h2 style={{ fontSize: '18px', fontWeight: '800', color: '#111827', margin: 0 }}>Audit Logs</h2>
                        <p style={{ fontSize: '12px', color: '#6b7280', margin: 0 }}>Track all admin actions in the system</p>
                    </div>
                </div>
            }
        >
            <Head title="Audit Logs" />

            <div style={{ maxWidth: '1400px', margin: '0 auto', padding: '0 4px' }}>

                {/* Stats Row linked directly to pre-calculated server states */}
                <div style={{ display: 'flex', gap: '12px', flexWrap: 'wrap', marginBottom: '20px' }}>
                    <StatCard label="Total Logs"      value={stats.total_logs ?? 0}      color="#3b82f6" />
                    <StatCard label="Status Changes"  value={stats.status_changes ?? 0}  color="#8b5cf6" />
                    <StatCard label="Role Updates"    value={stats.role_updates ?? 0}    color="#f59e0b" />
                    <StatCard label="Today"           value={stats.today_logs ?? 0}      color="#10b981" />
                </div>

                {/* Table Card */}
                <div style={{ background: '#fff', border: '1px solid #e5e7eb', borderRadius: '16px', overflow: 'hidden', boxShadow: '0 1px 6px rgba(0,0,0,0.06)' }}>

                    {/* Toolbar / Table Controls */}
                    <div style={{ padding: '16px 20px', borderBottom: '1px solid #f3f4f6', display: 'flex', alignItems: 'center', gap: '16px', flexWrap: 'wrap', background: '#fafafa' }}>
                        
                        {/* Show Entries Control */}
                        <div className="flex items-center gap-2">
                            <span className="text-sm font-medium text-slate-500">Show</span>
                            <div className="relative">
                                <select
                                    value={perPage}
                                    onChange={(e) => { setPerPage(Number(e.target.value)); setPage(1); }}
                                    className="appearance-none border border-slate-200 rounded-lg pl-3 pr-8 py-1.5 text-sm bg-white text-slate-700 font-semibold focus:outline-none focus:ring-2 focus:ring-slate-200 cursor-pointer shadow-sm"
                                >
                                    {[5, 10, 25, 50, 100].map(v => <option key={v} value={v}>{v}</option>)}
                                </select>
                                <svg className="pointer-events-none absolute right-2.5 top-1/2 -translate-y-1/2 w-3 h-3 text-slate-400" viewBox="0 0 12 12" fill="none" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 4.5l3 3 3-3"/>
                                </svg>
                            </div>
                            <span className="text-sm font-medium text-slate-500">entries</span>
                        </div>

                       {/* Action Filter Dropdown */}
                        <div className="flex items-center gap-2">
                            <span className="text-sm font-medium text-slate-500">Action:</span>
                            <div className="relative">
                                <select
                                    value={filterAction}
                                    onChange={(e) => handleFilterChange(e.target.value)}
                                    className="appearance-none border border-slate-200 rounded-lg pl-3 pr-8 py-1.5 text-sm bg-white text-slate-700 font-semibold focus:outline-none focus:ring-2 focus:ring-slate-200 cursor-pointer shadow-sm"
                                >
                                    <option value="all">All Status</option>
                                    {uniqueActions.map(action => {
                                        const cfg = getActionConfig(action);
                                        return (
                                            <option key={action} value={action}>
                                                {cfg.label}
                                            </option>
                                        );
                                    })}
                                </select>
                                <svg className="pointer-events-none absolute right-2.5 top-1/2 -translate-y-1/2 w-3 h-3 text-slate-400" viewBox="0 0 12 12" fill="none" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 4.5l3 3 3-3"/>
                                </svg>
                            </div>
                        </div>

                        {/* Search and Date Filter Dropdown Wrapper Align Right */}
                        <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginLeft: 'auto' }}>
                            <div className="relative">
                                <select
                                    value={dateFilter}
                                    onChange={handleDateFilterChange}
                                    className="appearance-none border border-slate-200 rounded-lg pl-3 pr-8 py-1.5 text-sm bg-white text-slate-700 font-semibold focus:outline-none focus:ring-2 focus:ring-slate-200 cursor-pointer shadow-sm"
                                >
                                    <option value="today">Today</option>
                                    <option value="yesterday">Yesterday</option>
                                    <option value="7_days_ago">7 Days Ago</option>
                                    <option value="last_month">Last Month</option>
                                    <option value="last_year">Last Year</option>
                                    <option value="all_time">All Time Records</option>
                                </select>
                                <svg className="pointer-events-none absolute right-2.5 top-1/2 -translate-y-1/2 w-3 h-3 text-slate-400" viewBox="0 0 12 12" fill="none" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 4.5l3 3 3-3"/>
                                </svg>
                            </div>

                            <div style={{ position: 'relative' }}>
                                <span style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)', fontSize: '13px', color: '#64748b', fontWeight: '600' }}>Search:</span>
                                <input
                                    type="text"
                                    value={search}
                                    onChange={handleSearch}
                                    className="border border-slate-200 rounded-lg py-1.5 text-sm bg-white text-slate-700 font-semibold focus:outline-none focus:ring-2 focus:ring-slate-200 shadow-sm"
                                    style={{
                                        width: '220px',
                                        paddingLeft: '64px',
                                        paddingRight: '12px',
                                    }}
                                />
                            </div>
                        </div>
                    </div>

                    {/* Table Area */}
                    <div style={{ overflowX: 'auto' }}>
                        <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '13px' }}>
                                <thead>
                                    <tr style={{ background: '#111827' }}>
                                        <th style={{ padding: '12px 14px', textAlign: 'left', color: '#9ca3af', fontWeight: '700', fontSize: '11px', letterSpacing: '0.05em', textTransform: 'uppercase' }}>#</th>
                                        <th onClick={() => requestSort('action')} className="py-3 px-4 text-left text-xs font-bold text-slate-300 uppercase tracking-wider cursor-pointer hover:bg-slate-800 transition-colors select-none border-r border-slate-700">
                                            <div className="flex items-center gap-1">Action {renderSortArrows('action')}</div>
                                        </th>
                                        <th onClick={() => requestSort('admin')} className="py-3 px-4 text-left text-xs font-bold text-slate-300 uppercase tracking-wider cursor-pointer hover:bg-slate-800 transition-colors select-none border-r border-slate-700">
                                            <div className="flex items-center gap-1">Admin {renderSortArrows('admin')}</div>
                                        </th>
                                        <th className="py-3 px-4 text-left text-xs font-bold text-slate-400 uppercase tracking-wider select-none border-r border-slate-700">Description</th>
                                        <th onClick={() => requestSort('created_at')} className="py-3 px-4 text-left text-xs font-bold text-slate-300 uppercase tracking-wider cursor-pointer hover:bg-slate-800 transition-colors select-none">
                                            <div className="flex items-center gap-1">Date & Time {renderSortArrows('created_at')}</div>
                                        </th>
                                    </tr>
                                </thead>
                            <tbody>
                                {paginated.length === 0 ? (
                                    <tr>
                                        <td colSpan={5} style={{ textAlign: 'center', padding: '60px 20px', color: '#9ca3af' }}>
                                            <div style={{ fontSize: '32px', marginBottom: '8px' }}>📭</div>
                                            <p style={{ fontWeight: '600' }}>No audit logs found under this timeframe parameters.</p>
                                        </td>
                                    </tr>
                                ) : paginated.map((log, i) => (
                                    <tr key={log.id} style={{
                                        borderBottom: '1px solid #f3f4f6',
                                        background: i % 2 === 0 ? '#fff' : '#fafafa',
                                    }}>
                                        <td style={{ padding: '12px 14px', color: '#9ca3af', fontSize: '12px', fontWeight: '600' }}>
                                            {indexOfFirstRecord + i + 1}
                                        </td>
                                        <td style={{ padding: '12px 14px' }}>
                                            <ActionBadge action={log.action} />
                                        </td>
                                        <td style={{ padding: '12px 14px' }}>
                                            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                                                <div style={{ width: '28px', height: '28px', borderRadius: '50%', background: '#3b82f6', color: '#fff', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: '800', fontSize: '11px', flexShrink: 0 }}>
                                                    {(log.admin ?? 'S').charAt(0).toUpperCase()}
                                                </div>
                                                <span style={{ fontWeight: '600', color: '#111827', whiteSpace: 'nowrap' }}>
                                                    {log.admin ?? 'System'}
                                                </span>
                                            </div>
                                        </td>
                                        <td style={{ padding: '12px 14px', color: '#374151' }}>
                                            {log.description ?? '—'}
                                        </td>
                                        <td style={{ padding: '12px 14px', whiteSpace: 'nowrap', color: '#6b7280', fontSize: '12px' }}>
                                            {formatDate(log.created_at)}
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>

                    {/* Footer Area */}
                    <div style={{ padding: '14px 20px', borderTop: '1px solid #f3f4f6', display: 'flex', alignItems: 'center', justifyContent: 'space-between', background: '#fafafa', flexWrap: 'wrap', gap: '10px' }}>
                        <div style={{ fontSize: '12px', color: '#6b7280' }}>
                            Showing records <span style={{ fontWeight: '600', color: '#374151' }}>{showingFrom}</span> to <span style={{ fontWeight: '600', color: '#374151' }}>{showingTo}</span> of total <span style={{ fontWeight: '600', color: '#374151' }}>{totalEntries}</span> entries
                        </div>
                        
                        {totalPages > 1 && (
                            <div style={{ display: 'flex', gap: '6px' }}>
                                <button
                                    onClick={() => setPage(p => Math.max(1, p - 1))}
                                    disabled={page === 1}
                                    style={{ padding: '6px 14px', borderRadius: '8px', fontSize: '12px', fontWeight: '700', border: '1px solid #e5e7eb', cursor: page === 1 ? 'not-allowed' : 'pointer', background: page === 1 ? '#f9fafb' : '#fff', color: page === 1 ? '#9ca3af' : '#374151' }}
                                >Previous</button>
                                {Array.from({ length: totalPages }, (_, i) => (
                                    <button key={i + 1} onClick={() => setPage(i + 1)}
                                        style={{ padding: '6px 12px', borderRadius: '8px', fontSize: '12px', fontWeight: '700', border: '1px solid #e5e7eb', cursor: 'pointer', background: (i + 1) === page ? '#111827' : '#fff', color: (i + 1) === page ? '#fff' : '#374151' }}
                                    >{i + 1}</button>
                                ))}
                                <button
                                    onClick={() => setPage(p => Math.min(totalPages, p + 1))}
                                    disabled={page === totalPages}
                                    style={{ padding: '6px 14px', borderRadius: '8px', fontSize: '12px', fontWeight: '700', border: '1px solid #e5e7eb', cursor: page === totalPages ? 'not-allowed' : 'pointer', background: page === totalPages ? '#f9fafb' : '#fff', color: page === totalPages ? '#9ca3af' : '#374151' }}
                                >Next</button>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </AuthenticatedLayout>
    );
}