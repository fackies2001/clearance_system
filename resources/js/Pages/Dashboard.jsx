import React, { useState, useMemo } from 'react';
import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head } from '@inertiajs/react';

export default function Dashboard({ auth, clearances = [], stats = { total: 0, cleared: 0, hit: 0 } }) {

    // 1. STATS COMPUTATION
    const total = stats?.total || 0;
    const cleared = stats?.cleared || 0;
    const hit = stats?.hit || 0;
    const pendingCount = total - (cleared + hit);

    // 2. STATES FOR TABLE CONTROLS
    const [activeFilter, setActiveFilter] = useState('all');
    const [sortConfig, setSortConfig] = useState({ key: 'created_at', direction: 'desc' });
    const [currentPage, setCurrentPage] = useState(1);
    const [searchTerm, setSearchTerm] = useState('');
    const [itemsPerPage, setItemsPerPage] = useState(5);
    const [dateFilter, setDateFilter] = useState('all');
    
    // Modal state for applicant details
    const [selectedApp, setSelectedApp] = useState(null); 

    // 3. DATE RANGE HELPER FUNCTION
    const getDateRange = (preset) => {
        const now = new Date();
        const startOfDay = new Date(now.getFullYear(), now.getMonth(), now.getDate());

        if (preset === 'today') return { from: startOfDay, to: now };

        if (preset === 'this_week') {
            const startOfWeek = new Date(startOfDay);
            startOfWeek.setDate(startOfDay.getDate() - now.getDay());
            return { from: startOfWeek, to: now };
        }

        if (preset === 'this_month') {
            return { from: new Date(now.getFullYear(), now.getMonth(), 1), to: now };
        }

        return null;
    };

    // 4. TABLE LOGIC (Filter -> Sort -> Paginate)
    const processedData = useMemo(() => {
        let filtered = clearances;

        // Apply Search Filter
        if (searchTerm) {
            const lowSearch = searchTerm.toLowerCase();
            filtered = filtered.filter(item =>
                item.tracking_no.toLowerCase().includes(lowSearch) ||
                item.first_name.toLowerCase().includes(lowSearch) ||
                item.last_name.toLowerCase().includes(lowSearch) ||
                item.purpose.toLowerCase().includes(lowSearch)
            );
        }

        // Apply Status Filter
        if (activeFilter !== 'all') {
            filtered = filtered.filter(item => item.status === activeFilter);
        }

        // Apply Date Filter
        const range = getDateRange(dateFilter);
        if (range) {
            filtered = filtered.filter(item => {
                const created = new Date(item.created_at);
                return created >= range.from && created <= range.to;
            });
        }

        // Apply Sorting
        let sorted = [...filtered].sort((a, b) => {
            if (a[sortConfig.key] < b[sortConfig.key]) return sortConfig.direction === 'asc' ? -1 : 1;
            if (a[sortConfig.key] > b[sortConfig.key]) return sortConfig.direction === 'asc' ? 1 : -1;
            return 0;
        });

        // Apply Pagination
        const startIndex = (currentPage - 1) * itemsPerPage;
        const paginated = sorted.slice(startIndex, startIndex + itemsPerPage);

        return {
            data: paginated,
            totalPages: Math.ceil(sorted.length / itemsPerPage),
            totalFiltered: sorted.length
        };
    }, [clearances, activeFilter, sortConfig, currentPage, searchTerm, itemsPerPage, dateFilter]);

    // Handle column sorting click
    const handleSort = (key) => {
        let direction = 'asc';
        if (sortConfig.key === key && sortConfig.direction === 'asc') direction = 'desc';
        setSortConfig({ key, direction });
    };

    // Handle preset date filter click
    const handleDateFilter = (preset) => {
        setDateFilter(preset);
        setCurrentPage(1); // Reset to first page when filtering
    };

    // Helper to render sort icons correctly
    const getSortIcon = (key) => {
        const isAsc = sortConfig.key === key && sortConfig.direction === 'asc';
        const isDesc = sortConfig.key === key && sortConfig.direction === 'desc';
        return (
            <div className="flex flex-col ml-3 -space-y-[1px]">
                <svg className={`w-[14px] h-[14px] ${isAsc ? 'text-white' : 'text-slate-500 group-hover:text-slate-300'} transition-colors`} fill="currentColor" viewBox="0 0 24 24">
                    <path d="M12 8l-5 6h10z" />
                </svg>
                <svg className={`w-[14px] h-[14px] ${isDesc ? 'text-white' : 'text-slate-500 group-hover:text-slate-300'} transition-colors`} fill="currentColor" viewBox="0 0 24 24">
                    <path d="M12 16l-5-6h10z" />
                </svg>
            </div>
        );
    };

    const datePresets = [
        { key: 'all', label: 'All' },
        { key: 'today', label: 'Today' },
        { key: 'this_week', label: 'This Week' },
        { key: 'this_month', label: 'This Month' },
    ];

    // 5. HEADER CONTENT (Passed to AuthenticatedLayout)
    // Note: Notification Bell logic was moved to AuthenticatedLayout for global access
    const headerContent = (
        <div className="flex items-center justify-between w-full">
            <h2 className="font-bold text-2xl text-slate-900 tracking-tight leading-tight">
                Command Center <span className="text-slate-400 font-normal text-sm ml-2">| Live Overview</span>
            </h2>
        </div>
    );

    return (
        <AuthenticatedLayout header={headerContent}>
            <Head title="Dashboard" />

            <div className="max-w-7xl mx-auto space-y-8 pb-12 pt-6 font-['Inter',_sans-serif]">

                {/* ================= SUMMARY CARDS ================= */}
                <div className="grid grid-cols-1 md:grid-cols-4 gap-6">

                    {/* Total Applications Card */}
                    <button
                        onClick={() => { setActiveFilter('all'); setCurrentPage(1); }}
                        className={`group relative overflow-hidden text-left rounded-2xl p-6 transition-all duration-300 shadow-[0_4px_20px_-4px_rgba(0,0,0,0.05)] flex items-start gap-4 border ${activeFilter === 'all' ? 'bg-slate-900 border-slate-900 scale-[1.02]' : 'bg-white border-slate-100 hover:border-slate-300 hover:shadow-lg'}`}
                    >
                        <div className={`p-3 rounded-xl transition-colors ${activeFilter === 'all' ? 'bg-slate-800 text-white' : 'bg-slate-100 text-slate-600 group-hover:bg-slate-200'}`}>
                            <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" /></svg>
                        </div>
                        <div className="z-10 relative">
                            <h3 className={`text-sm font-semibold tracking-wide ${activeFilter === 'all' ? 'text-slate-300' : 'text-slate-500'}`}>Total Applications</h3>
                            <div className={`text-4xl mt-1 font-black tracking-tight ${activeFilter === 'all' ? 'text-white' : 'text-slate-800'}`}>{total}</div>
                        </div>
                    </button>

                    {/* Pending Review Card */}
                    <button
                        onClick={() => { setActiveFilter('pending'); setCurrentPage(1); }}
                        className={`group relative overflow-hidden text-left rounded-2xl p-6 transition-all duration-300 shadow-[0_4px_20px_-4px_rgba(0,0,0,0.05)] flex items-start gap-4 border ${activeFilter === 'pending' ? 'bg-amber-50 border-amber-200 scale-[1.02]' : 'bg-white border-slate-100 hover:border-amber-200 hover:shadow-lg'}`}
                    >
                        {activeFilter === 'pending' && <div className="absolute top-0 left-0 w-1 h-full bg-amber-500" />}
                        <div className={`p-3 rounded-xl transition-colors ${activeFilter === 'pending' ? 'bg-amber-100 text-amber-700' : 'bg-slate-100 text-slate-600 group-hover:bg-amber-50 group-hover:text-amber-600'}`}>
                            <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
                        </div>
                        <div className="z-10 relative">
                            <h3 className={`text-sm font-semibold tracking-wide ${activeFilter === 'pending' ? 'text-amber-700' : 'text-slate-500'}`}>Pending Review</h3>
                            <div className={`text-4xl mt-1 font-black tracking-tight ${activeFilter === 'pending' ? 'text-amber-900' : 'text-slate-800'}`}>{pendingCount}</div>
                        </div>
                    </button>

                    {/* Cleared (No Hit) Card */}
                    <button
                        onClick={() => { setActiveFilter('cleared'); setCurrentPage(1); }}
                        className={`group relative overflow-hidden text-left rounded-2xl p-6 transition-all duration-300 shadow-[0_4px_20px_-4px_rgba(0,0,0,0.05)] flex items-start gap-4 border ${activeFilter === 'cleared' ? 'bg-emerald-50 border-emerald-200 scale-[1.02]' : 'bg-white border-slate-100 hover:border-emerald-200 hover:shadow-lg'}`}
                    >
                        {activeFilter === 'cleared' && <div className="absolute top-0 left-0 w-1 h-full bg-emerald-500" />}
                        <div className={`p-3 rounded-xl transition-colors ${activeFilter === 'cleared' ? 'bg-emerald-100 text-emerald-700' : 'bg-slate-100 text-slate-600 group-hover:bg-emerald-50 group-hover:text-emerald-600'}`}>
                            <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
                        </div>
                        <div className="z-10 relative">
                            <h3 className={`text-sm font-semibold tracking-wide ${activeFilter === 'cleared' ? 'text-emerald-700' : 'text-slate-500'}`}>Cleared (No Hit)</h3>
                            <div className={`text-4xl mt-1 font-black tracking-tight ${activeFilter === 'cleared' ? 'text-emerald-900' : 'text-slate-800'}`}>{cleared}</div>
                        </div>
                    </button>

                    {/* Detected HITs Card */}
                    <button
                        onClick={() => { setActiveFilter('hit'); setCurrentPage(1); }}
                        className={`group relative overflow-hidden text-left rounded-2xl p-6 transition-all duration-300 shadow-[0_4px_20px_-4px_rgba(225,29,72,0.1)] flex items-start gap-4 border ${activeFilter === 'hit' ? 'bg-rose-50 border-rose-200 scale-[1.02]' : 'bg-white border-slate-100 hover:border-rose-200 hover:shadow-lg'}`}
                    >
                        {activeFilter === 'hit' && <div className="absolute top-0 left-0 w-1 h-full bg-rose-500" />}
                        <div className={`p-3 rounded-xl transition-colors ${activeFilter === 'hit' ? 'bg-rose-100 text-rose-700' : 'bg-slate-100 text-slate-600 group-hover:bg-rose-50 group-hover:text-rose-600'}`}>
                            <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" /></svg>
                        </div>
                        <div className="z-10 relative">
                            <h3 className={`text-sm font-semibold tracking-wide ${activeFilter === 'hit' ? 'text-rose-700' : 'text-slate-500'}`}>Detected HITs</h3>
                            <div className={`text-4xl mt-1 font-black tracking-tight ${activeFilter === 'hit' ? 'text-rose-900' : 'text-slate-800'}`}>{hit}</div>
                        </div>
                    </button>
                </div>

                {/* ================= DATA TABLE AREA ================= */}
                <div className="rounded-2xl border border-slate-200 bg-white shadow-sm overflow-hidden flex flex-col">

                    {/* Controls Header */}
                    <div className="flex flex-col gap-4 p-6 border-b border-slate-100 bg-white">

                        {/* Top row: Title + Show Entries + Search */}
                        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 sm:gap-0">
                            <div>
                                <h3 className="font-bold text-lg text-slate-900">Applications Database</h3>
                                <p className="text-sm text-slate-500 mt-1">
                                    Showing {activeFilter === 'all' ? 'all records' : `filtered by ${activeFilter.toUpperCase()}`}. <span className="font-medium text-slate-700">({processedData.totalFiltered} found)</span>
                                </p>
                            </div>

                            <div className="flex flex-col sm:flex-row items-center gap-4 w-full sm:w-auto">
                                {/* Show Entries Selector */}
                                <div className="flex items-center gap-2 self-start sm:self-auto select-none">
                                    <span className="text-sm text-slate-500">Show</span>
                                    <select
                                        value={itemsPerPage}
                                        onChange={(e) => { setItemsPerPage(Number(e.target.value)); setCurrentPage(1); }}
                                        className="border border-slate-200 bg-slate-50 rounded-xl py-2 px-3 focus:bg-white focus:ring-1 focus:ring-slate-400 focus:border-slate-400 transition-all text-sm outline-none shadow-inner cursor-pointer"
                                    >
                                        <option value={5}>5</option>
                                        <option value={10}>10</option>
                                        <option value={20}>20</option>
                                        <option value={50}>50</option>
                                    </select>
                                    <span className="text-sm text-slate-500">entries</span>
                                </div>

                                {/* Search Input */}
                                <div className="relative w-full sm:w-auto group">
                                    <svg className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-slate-400 group-focus-within:text-slate-600 transition-colors" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                                    </svg>
                                    <input
                                        type="text"
                                        placeholder="Search"
                                        value={searchTerm}
                                        onChange={(e) => { setSearchTerm(e.target.value); setCurrentPage(1); }}
                                        className="pl-10 pr-4 py-2.5 border border-slate-200 bg-slate-50 rounded-xl w-full sm:w-64 focus:bg-white focus:ring-0 focus:border-slate-400 transition-all text-sm outline-none shadow-inner"
                                    />
                                </div>
                            </div>
                        </div>

                        {/* Date Range Preset Buttons */}
                        <div className="flex items-center gap-2 flex-wrap">
                            <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider mr-1">Date:</span>
                            {datePresets.map((preset) => (
                                <button
                                    key={preset.key}
                                    onClick={() => handleDateFilter(preset.key)}
                                    className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all border ${
                                        dateFilter === preset.key
                                            ? 'bg-slate-900 text-white border-slate-900'
                                            : 'bg-white text-slate-600 border-slate-200 hover:border-slate-400 hover:text-slate-900'
                                    }`}
                                >
                                    {preset.label}
                                </button>
                            ))}
                            {dateFilter !== 'all' && (
                                <span className="text-xs text-slate-400 ml-1">
                                    — showing results for <span className="font-semibold text-slate-600">{datePresets.find(p => p.key === dateFilter)?.label}</span>
                                </span>
                            )}
                        </div>
                    </div>

                    {/* Main Table Container */}
                    <div className="w-full overflow-x-auto min-h-[350px]">
                        <table className="w-full text-sm text-left">
                            <thead className="bg-slate-900 text-white text-[13px]">
                                <tr>
                                    <th onClick={() => handleSort('tracking_no')} className="py-4 px-6 font-bold cursor-pointer group hover:bg-slate-800 transition-colors select-none border-r border-slate-800">
                                        <div className="flex items-center">
                                            <div className="flex flex-col leading-[1.1]"><span>Tracking</span><span>No.</span></div>
                                            {getSortIcon('tracking_no')}
                                        </div>
                                    </th>
                                    <th onClick={() => handleSort('last_name')} className="py-4 px-6 font-bold cursor-pointer group hover:bg-slate-800 transition-colors select-none border-r border-slate-800">
                                        <div className="flex items-center">
                                            <div className="flex flex-col leading-[1.1]"><span>Applicant</span><span>Name</span></div>
                                            {getSortIcon('last_name')}
                                        </div>
                                    </th>
                                    <th onClick={() => handleSort('purpose')} className="py-4 px-6 font-bold cursor-pointer group hover:bg-slate-800 transition-colors select-none border-r border-slate-800">
                                        <div className="flex items-center"><span>Purpose</span>{getSortIcon('purpose')}</div>
                                    </th>
                                    <th onClick={() => handleSort('created_at')} className="py-4 px-6 font-bold cursor-pointer group hover:bg-slate-800 transition-colors select-none border-r border-slate-800">
                                        <div className="flex items-center">
                                            <div className="flex flex-col leading-[1.1]"><span>Date</span><span>Applied</span></div>
                                            {getSortIcon('created_at')}
                                        </div>
                                    </th>
                                    <th onClick={() => handleSort('status')} className="py-4 px-6 font-bold cursor-pointer group hover:bg-slate-800 transition-colors select-none">
                                        <div className="flex items-center"><span>Status</span>{getSortIcon('status')}</div>
                                    </th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-slate-100">
                                {processedData.data.length === 0 ? (
                                    <tr>
                                        <td colSpan="5" className="p-16 text-center h-64 align-middle">
                                            <div className="inline-flex flex-col items-center justify-center">
                                                <div className="w-16 h-16 mb-4 rounded-full bg-slate-50 flex items-center justify-center border border-slate-100 shadow-sm">
                                                    <svg className="w-8 h-8 text-slate-300" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M9 13h6m-3-3v6m-9 1V7a2 2 0 012-2h6l2 2h6a2 2 0 012 2v8a2 2 0 01-2 2H5a2 2 0 01-2-2z" /></svg>
                                                </div>
                                                <h3 className="text-base font-semibold text-slate-800 mb-1">No records found</h3>
                                                <p className="text-sm text-slate-500">Try adjusting your filters or search criteria.</p>
                                            </div>
                                        </td>
                                    </tr>
                                ) : (
                                    processedData.data.map((app) => (
                                        <tr
                                            key={app.id}
                                            onClick={() => setSelectedApp(app)}
                                            className="hover:bg-slate-50 transition-colors group cursor-pointer"
                                        >
                                            <td className="px-6 py-4 font-mono text-[13px] text-slate-700 tracking-wide font-semibold">{app.tracking_no}</td>
                                            <td className="px-6 py-4 font-bold text-slate-900 uppercase">{app.first_name} {app.last_name}</td>
                                            <td className="px-6 py-4 text-slate-600">{app.purpose}</td>
                                            <td className="px-6 py-4 text-slate-600">
                                                {new Date(app.created_at).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
                                            </td>
                                            <td className="px-6 py-4">
                                                {app.status === 'cleared' && <span className="inline-flex items-center px-3 py-1 rounded-full text-[10px] font-bold bg-green-100 text-green-700 uppercase tracking-widest border border-green-200">Cleared</span>}
                                                {app.status === 'hit' && <span className="inline-flex items-center px-3 py-1 rounded-full text-[10px] font-bold bg-red-100 text-red-700 uppercase tracking-widest border border-red-200">Hit</span>}
                                                {app.status === 'pending' && <span className="inline-flex items-center px-3 py-1 rounded-full text-[10px] font-bold bg-orange-100 text-orange-700 uppercase tracking-widest border border-orange-200">Pending</span>}
                                            </td>
                                        </tr>
                                    ))
                                )}
                            </tbody>
                        </table>
                    </div>

                    {/* Pagination Controls */}
                    <div className="border-t border-slate-100 p-4 flex items-center justify-between bg-white">
                        <div className="text-sm text-slate-500">
                            Page <span className="font-bold text-slate-800">{currentPage}</span> of <span className="font-bold text-slate-800">{processedData.totalPages || 1}</span>
                        </div>
                        <div className="flex gap-2">
                            <button
                                onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
                                disabled={currentPage === 1}
                                className="px-4 py-2 border border-slate-200 rounded-lg text-sm font-semibold bg-white text-slate-700 hover:bg-slate-50 hover:border-slate-300 shadow-sm disabled:opacity-50 disabled:shadow-none disabled:cursor-not-allowed transition-all"
                            >
                                Previous
                            </button>
                            <button
                                onClick={() => setCurrentPage(prev => Math.min(prev + 1, processedData.totalPages))}
                                disabled={currentPage >= processedData.totalPages || processedData.totalPages === 0}
                                className="px-4 py-2 border border-slate-200 rounded-lg text-sm font-semibold bg-white text-slate-700 hover:bg-slate-50 hover:border-slate-300 shadow-sm disabled:opacity-50 disabled:shadow-none disabled:cursor-not-allowed transition-all"
                            >
                                Next
                            </button>
                        </div>
                    </div>
                </div>

            </div>

            {/* ========== APPLICANT DETAIL MODAL ========== */}
            {selectedApp && (
                <div
                    className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm p-4"
                    onClick={() => setSelectedApp(null)}
                >
                    <div
                        className="bg-white rounded-2xl shadow-2xl w-full max-w-lg overflow-hidden"
                        onClick={(e) => e.stopPropagation()}
                    >
                        {/* Modal Header */}
                        <div className="bg-slate-900 px-6 py-5 flex items-center justify-between">
                            <div>
                                <h2 className="text-white font-bold text-lg">Applicant Details</h2>
                                <p className="text-slate-400 text-xs mt-0.5 font-mono">{selectedApp.tracking_no}</p>
                            </div>
                            <button
                                onClick={() => setSelectedApp(null)}
                                className="text-slate-400 hover:text-white transition-colors p-1 rounded-lg hover:bg-slate-800"
                            >
                                <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
                                </svg>
                            </button>
                        </div>

                        {/* Modal Body */}
                        <div className="p-6 space-y-4">
                            <div className="flex justify-end">
                                {selectedApp.status === 'cleared' && <span className="inline-flex items-center px-3 py-1 rounded-full text-[10px] font-bold bg-green-100 text-green-700 uppercase tracking-widest border border-green-200">Cleared</span>}
                                {selectedApp.status === 'hit' && <span className="inline-flex items-center px-3 py-1 rounded-full text-[10px] font-bold bg-red-100 text-red-700 uppercase tracking-widest border border-red-200">Hit</span>}
                                {selectedApp.status === 'pending' && <span className="inline-flex items-center px-3 py-1 rounded-full text-[10px] font-bold bg-orange-100 text-orange-700 uppercase tracking-widest border border-orange-200">Pending</span>}
                            </div>

                            <div className="grid grid-cols-2 gap-4">
                                <div className="bg-slate-50 rounded-xl p-4 border border-slate-100">
                                    <p className="text-xs font-semibold text-slate-400 uppercase tracking-wider mb-1">First Name</p>
                                    <p className="text-slate-900 font-bold uppercase">{selectedApp.first_name}</p>
                                </div>
                                <div className="bg-slate-50 rounded-xl p-4 border border-slate-100">
                                    <p className="text-xs font-semibold text-slate-400 uppercase tracking-wider mb-1">Last Name</p>
                                    <p className="text-slate-900 font-bold uppercase">{selectedApp.last_name}</p>
                                </div>
                                <div className="bg-slate-50 rounded-xl p-4 border border-slate-100 col-span-2">
                                    <p className="text-xs font-semibold text-slate-400 uppercase tracking-wider mb-1">Purpose</p>
                                    <p className="text-slate-900 font-medium">{selectedApp.purpose}</p>
                                </div>
                                <div className="bg-slate-50 rounded-xl p-4 border border-slate-100">
                                    <p className="text-xs font-semibold text-slate-400 uppercase tracking-wider mb-1">Date Applied</p>
                                    <p className="text-slate-900 font-medium">
                                        {new Date(selectedApp.created_at).toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })}
                                    </p>
                                </div>
                                <div className="bg-slate-50 rounded-xl p-4 border border-slate-100">
                                    <p className="text-xs font-semibold text-slate-400 uppercase tracking-wider mb-1">Tracking No.</p>
                                    <p className="text-slate-700 font-mono text-sm font-semibold">{selectedApp.tracking_no}</p>
                                </div>
                            </div>
                        </div>

                        {/* Modal Footer */}
                        <div className="border-t border-slate-100 px-6 py-4 flex justify-end">
                            <button
                                onClick={() => setSelectedApp(null)}
                                className="px-5 py-2 rounded-xl bg-slate-900 text-white text-sm font-semibold hover:bg-slate-700 transition-colors"
                            >
                                Close
                            </button>
                        </div>
                    </div>
                </div>
            )}

        </AuthenticatedLayout>
    );
}