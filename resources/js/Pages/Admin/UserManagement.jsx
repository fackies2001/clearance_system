import React, { useState, useMemo } from 'react';
import { Head, router, usePage } from '@inertiajs/react';
import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';

export default function UserManagement({ auth, users = [] }) {
    const { flash } = usePage().props;
    const [searchTerm, setSearchTerm] = useState('');
    const [roleFilter, setRoleFilter] = useState('all');
    const [confirmModal, setConfirmModal] = useState(null); // { user, newRole }
    const [deleteModal, setDeleteModal] = useState(null); // { user }

    const [perPage, setPerPage] = useState(10);
    const [currentPage, setCurrentPage] = useState(1);
    const [sortConfig, setSortConfig] = useState({ key: null, direction: 'asc' });

    // Sorting Handler logic
    const requestSort = (key) => {
        let direction = 'asc';
        if (sortConfig.key === key && sortConfig.direction === 'asc') {
            direction = 'desc';
        }
        setSortConfig({ key, direction });
        setCurrentPage(1); // Reset back to page 1 pag nag-sort
    };

    // Filter, Search, and Sort Engine
    const processedUsers = useMemo(() => {
        let result = [...users];

        // 1. Search Filter
        if (searchTerm) {
            const lower = searchTerm.toLowerCase();
            result = result.filter(u =>
                u.name.toLowerCase().includes(lower) ||
                u.email.toLowerCase().includes(lower)
            );
        }

        // 2. Role Filter
        if (roleFilter !== 'all') {
            result = result.filter(u => u.role === roleFilter);
        }

        // 3. Sorting Execution
        if (sortConfig.key !== null) {
            result.sort((a, b) => {
                let aValue = a[sortConfig.key];
                let bValue = b[sortConfig.key];

                // For Date handling consistency
                if (sortConfig.key === 'created_at') {
                    aValue = new Date(aValue);
                    bValue = new Date(bValue);
                } else {
                    aValue = aValue?.toString().toLowerCase() || '';
                    bValue = bValue?.toString().toLowerCase() || '';
                }

                if (aValue < bValue) {
                    return sortConfig.direction === 'asc' ? -1 : 1;
                }
                if (aValue > bValue) {
                    return sortConfig.direction === 'asc' ? 1 : -1;
                }
                return 0;
            });
        }

        return result;
    }, [users, searchTerm, roleFilter, sortConfig]);

    // --- PAGINATION MATHEMATICS ---
    const totalEntries = processedUsers.length;
    const totalPages = Math.ceil(totalEntries / perPage);
    
    const indexOfLastRecord = currentPage * perPage;
    const indexOfFirstRecord = indexOfLastRecord - perPage;
    
   
    const currentRecords = useMemo(() => {
        return processedUsers.slice(indexOfFirstRecord, indexOfLastRecord);
    }, [processedUsers, indexOfFirstRecord, indexOfLastRecord]);

    // Data range details mapping (e.g., "Showing 1 to 10 of 25 entries")
    const showingFrom = totalEntries === 0 ? 0 : indexOfFirstRecord + 1;
    const showingTo = indexOfLastRecord > totalEntries ? totalEntries : indexOfLastRecord;

    // Handle role change confirmation
    const handleRoleChange = (user, newRole) => {
        setConfirmModal({ user, newRole });
    };

    // Confirm and submit role change
    const confirmRoleChange = () => {
        router.patch(
            route('admin.users.update-role', confirmModal.user.id),
            { role: confirmModal.newRole },
            { onFinish: () => setConfirmModal(null) }
        );
    };

    // Confirm at execute delete request via Inertia router
    const confirmDeleteUser = () => {
        router.delete(
            route('admin.users.destroy', deleteModal.user.id),
            { onFinish: () => setDeleteModal(null) }
        );
    };

    // Render sorting indicators helper (Kopya sa standard system layout UI)
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

    const headerContent = (
        <div className="flex items-center justify-between w-full">
            <h2 className="font-bold text-2xl text-slate-900 tracking-tight">
                User Management
                <span className="text-slate-400 font-normal text-sm ml-2">
                    | {users.length} total users
                </span>
            </h2>
        </div>
    );

    return (
        <AuthenticatedLayout header={headerContent}>
            <Head title="User Management" />

            <div className="max-w-7xl mx-auto space-y-6 pb-12 pt-6">

                {/* Flash Messages */}
                {flash?.success && (
                    <div className="px-4 py-3 bg-emerald-50 border border-emerald-200 text-emerald-800 rounded-xl text-sm font-medium">
                         {flash.success}
                    </div>
                )}
                {flash?.error && (
                    <div className="px-4 py-3 bg-rose-50 border border-rose-200 text-rose-800 rounded-xl text-sm font-medium">
                         {flash.error}
                    </div>
                )}

                {/* Stats Cards */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    {[
                        { label: 'Total Users',  value: users.length,                              color: '#3b82f6', icon: '👥', sub: 'Registered client accounts' },
                        { label: 'Admins',       value: users.filter(u => u.role === 'admin').length, color: '#8b5cf6', icon: '👑', sub: 'System administrators' },
                        { label: 'Applicants',   value: users.filter(u => u.role === 'user').length,  color: '#10b981', icon: '👤', sub: 'Regular user accounts' },
                    ].map(card => (
                        <div key={card.label} style={{
                            background: '#fff',
                            borderTop: `1.5px solid #e2e8f0`,
                            borderRight: `1.5px solid #e2e8f0`,
                            borderBottom: `1.5px solid #e2e8f0`,
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
                                <div style={{ fontSize: 11, color: '#94a3b8', marginTop: 6, fontWeight: 500 }}>
                                    {card.sub}
                                </div>
                            </div>
                            <div style={{ fontSize: 26, opacity: 0.5 }}>{card.icon}</div>
                        </div>
                    ))}
                </div>

                {/* Table Card */}
                <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">

                
                    <div className="p-6 border-b border-slate-100 flex flex-col md:flex-row md:items-center md:justify-between gap-4">
                        
                        {/*  Show Entries + Status Dropdown */}
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

                            <div className="flex items-center gap-2">
                                <span className="text-sm font-medium text-slate-500">Role:</span>
                                    <div className="relative">
                                    <select
                                        value={roleFilter}
                                        onChange={(e) => { setRoleFilter(e.target.value); setCurrentPage(1); }}
                                        className="appearance-none border border-slate-200 rounded-lg pl-3 pr-8 py-1.5 text-sm bg-white text-slate-700 font-semibold focus:outline-none focus:ring-2 focus:ring-slate-200 cursor-pointer shadow-sm min-w-[110px]"
                                    >
                                        <option value="all">All Roles</option>
                                        <option value="admin">Admin</option>
                                        <option value="user">User</option>
                                    </select>
                                    <svg className="pointer-events-none absolute right-2.5 top-1/2 -translate-y-1/2 w-3 h-3 text-slate-400" viewBox="0 0 12 12" fill="none" stroke="currentColor">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 4.5l3 3 3-3"/>
                                    </svg>
                                </div>
                            </div>

                        {/* Kanang Bahagi: Filter Date & Search input placeholder alignment */}
                        <div className="flex items-center gap-3 ml-auto w-full md:w-auto justify-end">
                            <div className="text-sm text-slate-600 flex items-center gap-2">
                                <span className="border border-slate-200 bg-slate-50 px-3 py-1.5 rounded-lg text-xs font-semibold flex items-center gap-1 cursor-default">
                                    📅 Today
                                </span>
                            </div>

                            <div className="relative">
                                <span className="absolute left-3 top-1/2 -translate-y-1/2 text-xs font-medium text-slate-500">Search:</span>
                                <input
                                    type="text"
                                    value={searchTerm}
                                    onChange={e => {
                                        setSearchTerm(e.target.value);
                                        setCurrentPage(1);
                                    }}
                                    className="pl-16 pr-4 py-1.5 border border-slate-200 bg-white rounded-lg text-sm focus:outline-none focus:border-slate-400 w-56 transition-all"
                                />
                            </div>
                        </div>
                    </div>

                    {/* Table View Area */}
                    <div className="overflow-x-auto">
                        <table className="w-full text-sm text-left">
                            <thead className="bg-slate-900 text-white text-[13px]">
                                <tr>
                                    <th onClick={() => requestSort('name')} className="py-4 px-6 font-bold border-r border-slate-800 cursor-pointer hover:bg-slate-800 transition-colors select-none">
                                        <div className="flex items-center">
                                            Name {renderSortArrows('name')}
                                        </div>
                                    </th>
                                    <th onClick={() => requestSort('email')} className="py-4 px-6 font-bold border-r border-slate-800 cursor-pointer hover:bg-slate-800 transition-colors select-none">
                                        <div className="flex items-center">
                                            Email {renderSortArrows('email')}
                                        </div>
                                    </th>
                                    <th onClick={() => requestSort('role')} className="py-4 px-6 font-bold border-r border-slate-800 cursor-pointer hover:bg-slate-800 transition-colors select-none">
                                        <div className="flex items-center">
                                            Role {renderSortArrows('role')}
                                        </div>
                                    </th>
                                    <th onClick={() => requestSort('created_at')} className="py-4 px-6 font-bold border-r border-slate-800 cursor-pointer hover:bg-slate-800 transition-colors select-none">
                                        <div className="flex items-center">
                                            Date Registered {renderSortArrows('created_at')}
                                        </div>
                                    </th>
                                    <th className="py-4 px-6 font-bold">Action</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-slate-100">
                                {currentRecords.length === 0 ? (
                                    <tr>
                                        <td colSpan="5" className="p-16 text-center text-slate-400">
                                            No users found under this timeframe parameters.
                                        </td>
                                    </tr>
                                ) : (
                                    currentRecords.map(user => (
                                        <tr key={user.id} className="hover:bg-slate-50 transition-colors">
                                            <td className="px-6 py-4 font-semibold text-slate-900">
                                                <div className="flex items-center gap-3">
                                                    <div className="w-8 h-8 rounded-full bg-blue-600 flex items-center justify-center text-white font-bold text-xs uppercase flex-shrink-0">
                                                        {user.name?.charAt(0) || 'U'}
                                                    </div>
                                                    {user.name}
                                                </div>
                                            </td>
                                            <td className="px-6 py-4 text-slate-600">{user.email}</td>
                                            <td className="px-6 py-4">
                                                {user.role === 'admin' ? (
                                                    <span className="inline-flex items-center px-3 py-1 rounded-full text-[10px] font-bold bg-blue-100 text-blue-700 uppercase tracking-widest border border-blue-200">
                                                         Admin
                                                    </span>
                                                ) : (
                                                    <span className="inline-flex items-center px-3 py-1 rounded-full text-[10px] font-bold bg-emerald-100 text-emerald-700 uppercase tracking-widest border border-emerald-200">
                                                         User
                                                    </span>
                                                )}
                                            </td>
                                            <td className="px-6 py-4 text-slate-600">
                                                {new Date(user.created_at).toLocaleDateString('en-US', {
                                                    month: 'short', day: 'numeric', year: 'numeric'
                                                })}
                                            </td>
                                            <td className="px-6 py-4">
                                                {user.id === 1 ? (
                                                    // UI Flag para sa Pioneer Admin account
                                                    <span className="inline-flex items-center px-2.5 py-1 rounded-md text-xs font-bold bg-amber-50 text-amber-700 border border-amber-200">
                                                        🔒 Pioneer Account
                                                    </span>
                                                ) : user.id === auth.user.id ? (
                                                    <span className="text-xs text-slate-400 italic">Current Account</span>
                                                ) : (
                                                    <div className="flex items-center gap-2">
                                                        <select
                                                            value={user.role}
                                                            onChange={e => handleRoleChange(user, e.target.value)}
                                                            className="border border-slate-200 bg-slate-50 rounded-lg py-1.5 px-3 text-sm focus:outline-none focus:border-slate-400 cursor-pointer"
                                                        >
                                                            <option value="user">👤 User</option>
                                                            <option value="admin">👮 Admin</option>
                                                        </select>

                                                       <button
                                                            onClick={() => setDeleteModal({ user })}
                                                            className="px-3 py-1.5 text-xs font-bold text-rose-600 bg-rose-50 border border-rose-200 hover:bg-rose-600 hover:text-white rounded-lg transition-colors duration-150 flex items-center gap-1 shadow-sm"
                                                            title="Delete User Account"
                                                        >
                                                            🗑️ Delete
                                                        </button>
                                                    </div>
                                                )}
                                            </td>
                                        </tr>
                                    ))
                                )}
                            </tbody>
                        </table>
                    </div>

                    {/* --- PAGINATION & FOOTER CONTROLS --- */}
                    <div className="p-6 border-t border-slate-100 flex flex-col sm:flex-row justify-between items-center gap-4">
                        <div className="text-sm text-slate-500">
                            Showing records <span className="font-semibold text-slate-700">{showingFrom}</span> to <span className="font-semibold text-slate-700">{showingTo}</span> of total <span className="font-semibold text-slate-700">{totalEntries}</span> entries
                        </div>

                        {totalPages > 1 && (
                            <div className="flex gap-1">
                                <button
                                    onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
                                    disabled={currentPage === 1}
                                    className={`px-3 py-1.5 text-xs font-semibold rounded-lg border transition-all ${
                                        currentPage === 1 
                                        ? 'bg-slate-50 text-slate-400 border-slate-100 cursor-not-allowed' 
                                        : 'bg-white text-slate-700 border-slate-200 hover:border-slate-400'
                                    }`}
                                >
                                    Previous
                                </button>
                                
                                {[...Array(totalPages)].map((_, i) => (
                                    <button
                                        key={i + 1}
                                        onClick={() => setCurrentPage(i + 1)}
                                        className={`px-3 py-1.5 text-xs font-semibold rounded-lg border transition-all ${
                                            currentPage === i + 1
                                            ? 'bg-slate-900 text-white border-slate-900'
                                            : 'bg-white text-slate-700 border-slate-200 hover:border-slate-400'
                                        }`}
                                    >
                                        {i + 1}
                                    </button>
                                ))}

                                <button
                                    onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
                                    disabled={currentPage === totalPages}
                                    className={`px-3 py-1.5 text-xs font-semibold rounded-lg border transition-all ${
                                        currentPage === totalPages 
                                        ? 'bg-slate-50 text-slate-400 border-slate-100 cursor-not-allowed' 
                                        : 'bg-white text-slate-700 border-slate-200 hover:border-slate-400'
                                    }`}
                                >
                                    Next
                                </button>
                            </div>
                        )}
                    </div>
                </div>
            </div>

                {/* Confirm Delete User Modal */}
                    {deleteModal && (
                        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm p-4"
                            onClick={() => setDeleteModal(null)}>
                            <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md overflow-hidden"
                                onClick={e => e.stopPropagation()}>

                                {/* Modal Header */}
                                <div className="bg-rose-600 px-6 py-5">
                                    <h2 className="text-white font-bold text-lg flex items-center gap-2">
                                        ⚠️ Warning: Delete User Account
                                    </h2>
                                    <p className="text-rose-100 text-xs mt-1">Are you sure you want to proceed? This action cannot be undone.</p>
                                </div>

                                {/* Modal Body */}
                                <div className="p-6 space-y-4">
                                    <div className="bg-rose-50/60 rounded-xl p-4 border border-rose-100 space-y-2">
                                        <div className="flex justify-between text-sm">
                                            <span className="text-slate-500 font-medium">Name:</span>
                                            <span className="text-slate-900 font-bold">{deleteModal.user.name}</span>
                                        </div>
                                        <div className="flex justify-between text-sm">
                                            <span className="text-slate-500 font-medium">Email:</span>
                                            <span className="text-slate-900 font-semibold font-mono text-xs">{deleteModal.user.email}</span>
                                        </div>
                                        <div className="flex justify-between text-sm">
                                            <span className="text-slate-500 font-medium">Current Role:</span>
                                            <span className="font-bold text-slate-700 uppercase text-xs tracking-wider">{deleteModal.user.role}</span>
                                        </div>
                                    </div>
                                </div>

                                {/* Modal Footer */}
                                <div className="border-t border-slate-100 px-6 py-4 flex justify-end gap-3 bg-slate-50">
                                    <button
                                        onClick={() => setDeleteModal(null)}
                                        className="px-5 py-2 rounded-xl border border-slate-200 text-slate-700 text-sm font-semibold hover:bg-white transition-colors"
                                    >
                                        Cancel
                                    </button>
                                    <button
                                        onClick={() => {
                                            router.delete(route('admin.users.destroy', deleteModal.user.id), {
                                                onFinish: () => setDeleteModal(null)
                                            });
                                        }}
                                        className="px-5 py-2 rounded-xl bg-rose-600 text-white text-sm font-semibold hover:bg-rose-700 transition-colors shadow-lg shadow-rose-200"
                                    >
                                        Yes, Delete Account
                                    </button>
                                </div>
                            </div>
                        </div>
                    )}
        </AuthenticatedLayout>
    );
}