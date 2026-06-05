import React, { useState, useMemo } from 'react';
import { Head, router } from '@inertiajs/react';
import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';

export default function Transactions({ auth, transactions = [], currentFilter = 'today' }) {
    const [searchTerm, setSearchTerm] = useState('');
    const [perPage, setPerPage]       = useState(10);
    const [currentPage, setCurrentPage] = useState(1);
    const [sortConfig, setSortConfig] = useState({ key: 'paid_at', direction: 'desc' });
    const [dateFilter, setDateFilter] = useState(currentFilter);

    // Triggers sorting states adjustments cleanly on header selection events
    const requestSort = (key) => {
        let direction = 'asc';
        if (sortConfig.key === key && sortConfig.direction === 'asc') direction = 'desc';
        setSortConfig({ key, direction });
        setCurrentPage(1);
    };

    // Submits live server-side date filtering context queries via Inertia background pipeline requests
    const handleDateFilterChange = (e) => {
        const selectedDateFilter = e.target.value;
        setDateFilter(selectedDateFilter);
        setCurrentPage(1);

        router.get(
            window.location.pathname,
            { date_filter: selectedDateFilter },
            {
                preserveState: true,
                preserveScroll: true,
                only: ['transactions', 'currentFilter']
            }
        );
    };

    const renderSortArrows = (key) => {
        const active = sortConfig.key === key;
        const asc    = sortConfig.direction === 'asc';
        return (
            <span className="ml-1 inline-flex flex-col gap-[2px]">
                <svg className={`w-2 h-2 ${active && asc ? 'text-white' : 'text-slate-500'}`} viewBox="0 0 8 5" fill="currentColor">
                    <path d="M4 0L8 5H0L4 0Z"/>
                </svg>
                <svg className={`w-2 h-2 ${active && !asc ? 'text-white' : 'text-slate-500'}`} viewBox="0 0 8 5" fill="currentColor">
                    <path d="M4 5L0 0H8L4 5Z"/>
                </svg>
            </span>
        );
    };

    // Client-side text input search and layout filtering evaluations
    const processedTransactions = useMemo(() => {
        let result = [...transactions];

        if (searchTerm) {
            const lower = searchTerm.toLowerCase();
            result = result.filter(t =>
                t.tracking_no?.toLowerCase().includes(lower) ||
                t.applicant_name?.toLowerCase().includes(lower) ||
                t.reference?.toLowerCase().includes(lower)
            );
        }

        if (sortConfig.key !== null) {
            result.sort((a, b) => {
                let aVal = a[sortConfig.key];
                let bVal = b[sortConfig.key];

                if (sortConfig.key === 'paid_at') {
                    aVal = new Date(aVal);
                    bVal = new Date(bVal);
                } else if (sortConfig.key === 'amount') {
                    aVal = Number(aVal);
                    bVal = Number(bVal);
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
    }, [transactions, searchTerm, sortConfig]);

    const totalEntries       = processedTransactions.length;
    const totalPages         = Math.ceil(totalEntries / perPage);
    const indexOfLastRecord  = currentPage * perPage;
    const indexOfFirstRecord = indexOfLastRecord - perPage;
    const currentRecords     = processedTransactions.slice(indexOfFirstRecord, indexOfLastRecord);
    const showingFrom        = totalEntries === 0 ? 0 : indexOfFirstRecord + 1;
    const showingTo          = indexOfLastRecord > totalEntries ? totalEntries : indexOfLastRecord;

    return (
        <AuthenticatedLayout user={auth.user}>
            <Head title="Transaction History" />

            <div className="py-12">
                <div className="max-w-7xl mx-auto sm:px-6 lg:px-8 space-y-6">
                    <div className="bg-white overflow-hidden shadow-sm sm:rounded-2xl border border-slate-200">

                        {/* Page Header */}
                        <div className="p-6 text-slate-900 border-b border-slate-100 bg-white">
                            <h2 className="text-xl font-bold">Payment Transaction History</h2>
                            <p className="text-sm text-slate-500">View and track all clearance payments.</p>
                        </div>

                        {/* ── Toolbar ── */}
                        <div className="p-5 border-b border-slate-100 bg-slate-50/50 flex flex-col md:flex-row md:items-center md:justify-between gap-4">

                            {/* Left — Show entries */}
                            <div className="flex items-center gap-2">
                                <span className="text-sm font-medium text-slate-500">Show</span>
                                <div className="relative">
                                    <select
                                        value={perPage}
                                        onChange={(e) => { setPerPage(Number(e.target.value)); setCurrentPage(1); }}
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

                            {/* Right — Live Filter Dropdown + Search Input Layout Area */}
                            <div className="flex items-center gap-3 ml-auto w-full md:w-auto justify-end">
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
                                
                                <div className="flex items-center gap-2 text-sm text-slate-600">
                                    <span className="font-medium text-slate-500 whitespace-nowrap">Search:</span>
                                    <div className="relative">
                                        <input
                                            type="text"
                                            value={searchTerm}
                                            onChange={e => { setSearchTerm(e.target.value); setCurrentPage(1); }}
                                            placeholder="Tracking, name, ref..."
                                            className="border border-slate-200 rounded-lg pl-3 pr-8 py-1.5 text-sm w-52 focus:outline-none focus:ring-2 focus:ring-slate-200 shadow-sm bg-white placeholder-slate-400"
                                        />
                                        {searchTerm && (
                                            <button onClick={() => { setSearchTerm(''); setCurrentPage(1); }} className="absolute right-2.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 text-xs">✕</button>
                                        )}
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* ── Table ── */}
                        <div className="overflow-x-auto">
                            <table className="w-full text-left text-sm">
                                <thead>
                                    <tr className="bg-slate-900 text-white text-xs">
                                        <th onClick={() => requestSort('paid_at')} className="px-5 py-3.5 font-semibold uppercase tracking-wider border-r border-slate-700 cursor-pointer hover:bg-slate-700/60 transition-colors select-none">
                                            <div className="flex items-center gap-1">Paid At {renderSortArrows('paid_at')}</div>
                                        </th>
                                        <th onClick={() => requestSort('tracking_no')} className="px-5 py-3.5 font-semibold uppercase tracking-wider border-r border-slate-700 cursor-pointer hover:bg-slate-700/60 transition-colors select-none">
                                            <div className="flex items-center gap-1">Tracking No. {renderSortArrows('tracking_no')}</div>
                                        </th>
                                        <th onClick={() => requestSort('applicant_name')} className="px-5 py-3.5 font-semibold uppercase tracking-wider border-r border-slate-700 cursor-pointer hover:bg-slate-700/60 transition-colors select-none">
                                            <div className="flex items-center gap-1">Applicant {renderSortArrows('applicant_name')}</div>
                                        </th>
                                        <th onClick={() => requestSort('method')} className="px-5 py-3.5 font-semibold uppercase tracking-wider border-r border-slate-700 cursor-pointer hover:bg-slate-700/60 transition-colors select-none">
                                            <div className="flex items-center gap-1">Method {renderSortArrows('method')}</div>
                                        </th>
                                        <th className="px-5 py-3.5 font-semibold uppercase tracking-wider border-r border-slate-700 text-slate-400 select-none">Reference</th>
                                        <th onClick={() => requestSort('amount')} className="px-5 py-3.5 font-semibold uppercase tracking-wider border-r border-slate-700 cursor-pointer hover:bg-slate-700/60 transition-colors select-none text-right">
                                            <div className="flex items-center justify-end gap-1">Amount {renderSortArrows('amount')}</div>
                                        </th>
                                        <th className="px-5 py-3.5 font-semibold uppercase tracking-wider text-slate-400 select-none">Status</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-slate-100">
                                    {currentRecords.length === 0 ? (
                                        <tr>
                                            <td colSpan="7" className="px-6 py-20 text-center">
                                                <div className="flex flex-col items-center gap-2">
                                                    <div className="w-12 h-12 rounded-2xl bg-slate-100 flex items-center justify-center text-xl">💳</div>
                                                    <p className="font-bold text-slate-600 text-sm">No transactions found</p>
                                                    <p className="text-xs text-slate-400">Try adjusting your search filters</p>
                                                </div>
                                            </td>
                                        </tr>
                                    ) : (
                                        currentRecords.map((t) => (
                                            <tr key={t.id} className="hover:bg-slate-50 transition-colors">
                                                <td className="px-5 py-3.5 whitespace-nowrap text-slate-600 text-xs">
                                                    {new Date(t.paid_at).toLocaleString('en-PH', { month: 'short', day: 'numeric', year: 'numeric', hour: '2-digit', minute: '2-digit' })}
                                                </td>
                                                <td className="px-5 py-3.5 font-mono font-bold text-blue-600 text-xs">
                                                    {t.tracking_no}
                                                </td>
                                                <td className="px-5 py-3.5 font-semibold text-slate-900 text-xs">
                                                    {t.applicant_name}
                                                </td>
                                                <td className="px-5 py-3.5 uppercase font-medium text-slate-700 text-xs">
                                                    {t.method}
                                                </td>
                                                <td className="px-5 py-3.5 font-mono text-slate-400 text-xs">
                                                    {t.reference || '—'}
                                                </td>
                                                <td className="px-5 py-3.5 text-right font-black text-slate-900">
                                                    ₱{Number(t.amount).toLocaleString(undefined, { minimumFractionDigits: 2 })}
                                                </td>
                                                <td className="px-5 py-3.5">
                                                    <span className="bg-emerald-50 text-emerald-700 border border-emerald-200 text-[10px] font-black uppercase px-2.5 py-1 rounded-full">
                                                        {t.status}
                                                    </span>
                                                </td>
                                            </tr>
                                        ))
                                    )}
                                </tbody>
                            </table>
                        </div>

                        {/* ── Pagination Footer ── */}
                        <div className="p-5 border-t border-slate-100 flex flex-col sm:flex-row justify-between items-center gap-4 bg-white">
                            <p className="text-xs font-medium text-slate-500">
                                Showing{' '}
                                <span className="text-slate-800 font-bold">{showingFrom}</span>
                                {' '}to{' '}
                                <span className="text-slate-800 font-bold">{showingTo}</span>
                                {' '}of{' '}
                                <span className="text-slate-800 font-bold">{totalEntries}</span>
                                {' '}entries
                            </p>
                            {totalPages > 1 && (
                                <div className="flex items-center border border-slate-200 rounded-xl overflow-hidden shadow-sm bg-white">
                                    <button
                                        onClick={() => setCurrentPage(p => Math.max(p - 1, 1))}
                                        disabled={currentPage === 1}
                                        className={`px-3 py-2 text-xs font-semibold border-r border-slate-200 transition-all ${currentPage === 1 ? 'bg-slate-50 text-slate-300 cursor-not-allowed' : 'bg-white text-slate-600 hover:bg-slate-50'}`}
                                    >← Prev</button>
                                    {[...Array(totalPages)].map((_, i) => (
                                        <button key={i + 1} onClick={() => setCurrentPage(i + 1)}
                                            className={`px-3 py-2 text-xs font-semibold border-r border-slate-200 transition-all ${currentPage === i + 1 ? 'bg-slate-900 text-white' : 'bg-white text-slate-600 hover:bg-slate-50'}`}
                                            style={{ minWidth: '36px' }}
                                        >{i + 1}</button>
                                    ))}
                                    <button
                                        onClick={() => setCurrentPage(p => Math.min(p + 1, totalPages))}
                                        disabled={currentPage === totalPages}
                                        className={`px-3 py-2 text-xs font-semibold transition-all ${currentPage === totalPages ? 'bg-slate-50 text-slate-300 cursor-not-allowed' : 'bg-white text-slate-600 hover:bg-slate-50'}`}
                                    >Next →</button>
                                </div>
                            )}
                        </div>

                    </div>
                </div>
            </div>
        </AuthenticatedLayout>
    );
}