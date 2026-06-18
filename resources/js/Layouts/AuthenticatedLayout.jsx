import React, { useState, useEffect } from 'react';
import { Link, usePage, router } from '@inertiajs/react';

// --- SHADCN UI IMPORTS ---
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

// ─── Nav Link Component ───────────────────────────────────────────────────────
function NavLink({ href, active, activeColor = 'bg-blue-600', icon, children, onNavigate }) {
    return (
        <Link
            href={href}
            onClick={onNavigate}
            className={`flex items-center px-4 py-3 rounded-lg transition-colors ${
                active
                    ? `${activeColor} text-white shadow-md`
                    : 'text-gray-400 hover:bg-gray-800 hover:text-white'
            }`}
        >
            <svg className="w-5 h-5 mr-3 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                {icon}
            </svg>
            <span className="text-sm">{children}</span>
        </Link>
    );
}

// ─── SVG Path Shorthands ──────────────────────────────────────────────────────
const ICONS = {
    home:        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />,
    walkin:      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z" />,
    biometrics:  <><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 9a2 2 0 012-2h.93a2 2 0 001.664-.89l.812-1.22A2 2 0 0110.07 4h3.86a2 2 0 011.664.89l.812 1.22A2 2 0 0018.07 7H19a2 2 0 012 2v9a2 2 0 01-2 2H5a2 2 0 01-2-2V9z" /><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 13a3 3 0 11-6 0 3 3 0 016 0z" /></>,
    calendar:    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />,
    form:        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />,
    clearance:   <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-6 9l2 2 4-4" />,
    users:       <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0z" />,
    hit:         <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 9v2m0 4h.01M10.29 3.86L1.82 18a2 2 0 001.71 3h16.94a2 2 0 001.71-3L13.71 3.86a2 2 0 00-3.42 0z" />,
    reports:     <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />,
    audit:       <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-3 7h3m-3 4h3m-6-4h.01M9 16h.01" />,
    transactions:<path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z" />,
    status:      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />,
};

// ─── Sidebar Content ──────────────────────────────────────────────────────────
function SidebarContent({ isAdmin, isConfirmer, onNavigate }) {
    const c = (name) => route().current(name);
    return (
        <nav className="flex-1 px-4 py-6 space-y-1 overflow-y-auto">

            {/* ── ADMIN ── */}
            {isAdmin && (
                <>
                    <p className="text-xs text-gray-500 uppercase tracking-widest px-4 mb-2">Admin</p>

                    <NavLink href={route('admin.dashboard')} active={c('admin.dashboard')} icon={ICONS.home} onNavigate={onNavigate}>
                        Dashboard
                    </NavLink>

                    <p className="text-[10px] text-gray-600 uppercase tracking-[0.2em] px-4 mt-6 mb-2 font-black">
                        Processing Workflow
                    </p>

                    <NavLink href={route('admin.walkin.index')} active={c('admin.walkin.index')} activeColor="bg-emerald-600" icon={ICONS.walkin} onNavigate={onNavigate}>
                        Walk-in Payment
                    </NavLink>
                    <NavLink href={route('admin.biometrics.index')} active={c('admin.biometrics.index')} icon={ICONS.biometrics} onNavigate={onNavigate}>
                        Biometrics Capture
                    </NavLink>

                    <hr className="border-gray-800 my-4" />

                    <NavLink href={route('admin.appointments.index')} active={c('admin.appointments.index')} icon={ICONS.calendar} onNavigate={onNavigate}>
                        Appointments
                    </NavLink>
                    <NavLink href={route('apply.form')} active={c('apply.form')} icon={ICONS.form} onNavigate={onNavigate}>
                        Application Form
                    </NavLink>
                    <NavLink href={route('admin.clearance.index')} active={c('admin.clearance.index')} icon={ICONS.clearance} onNavigate={onNavigate}>
                        Clearance Processing
                    </NavLink>
                    <NavLink href={route('admin.users.index')} active={c('admin.users.index')} icon={ICONS.users} onNavigate={onNavigate}>
                        User Management
                    </NavLink>
                    <NavLink href={route('admin.hit.index')} active={c('admin.hit.index')} activeColor="bg-red-600" icon={ICONS.hit} onNavigate={onNavigate}>
                        HIT Verification
                    </NavLink>
                    <NavLink href={route('admin.reports.index')} active={c('admin.reports.index')} activeColor="bg-purple-600" icon={ICONS.reports} onNavigate={onNavigate}>
                        Reports & Analytics
                    </NavLink>
                    <NavLink href={route('admin.audit.index')} active={c('admin.audit.index')} activeColor="bg-yellow-600" icon={ICONS.audit} onNavigate={onNavigate}>
                        Audit Logs
                    </NavLink>
                    <NavLink href={route('admin.transactions.index')} active={c('admin.transactions.index')} icon={ICONS.transactions} onNavigate={onNavigate}>
                        Transaction History
                    </NavLink>
                </>
            )}

            {/* ── CONFIRMER ── */}
            {isConfirmer && (
                <>
                    <p className="text-xs text-gray-500 uppercase tracking-widest px-4 mb-2">Confirmer</p>
                    <NavLink href={route('dashboard')} active={c('dashboard')} icon={ICONS.home} onNavigate={onNavigate}>
                        Dashboard
                    </NavLink>
                    <NavLink href={route('admin.appointments.index')} active={c('admin.appointments.index')} icon={ICONS.calendar} onNavigate={onNavigate}>
                        Appointments
                    </NavLink>
                </>
            )}

            {/* ── APPLICANT ── */}
            {!isAdmin && (
                <>
                    <p className="text-xs text-gray-500 uppercase tracking-widest px-4 mb-2">Applicant</p>
                    <NavLink href={route('apply.form')} active={c('apply.form')} icon={ICONS.form} onNavigate={onNavigate}>
                        Application Form
                    </NavLink>
                    <NavLink href={route('appointment.index')} active={c('appointment.index')} icon={ICONS.calendar} onNavigate={onNavigate}>
                        My Appointment
                    </NavLink>
                    <NavLink href={route('application.status')} active={c('application.status')} icon={ICONS.status} onNavigate={onNavigate}>
                        Application Status
                    </NavLink>
                    <NavLink href={route('payment.show', 'LATEST')} active={c('payment.show')} icon={ICONS.walkin} onNavigate={onNavigate}>
                        Payment Center
                    </NavLink>
                </>
            )}
        </nav>
    );
}

// ─── Main Layout ──────────────────────────────────────────────────────────────
export default function AuthenticatedLayout({ header, children }) {
    const { auth } = usePage().props;
    const user = auth.user;
    const isAdmin      = user?.role === 'admin';
    const isConfirmer  = user?.role === 'appointment_confirmer';

    const [showNotifications, setShowNotifications] = useState(false);
    // sidebarOpen = true means sidebar is VISIBLE, false means HIDDEN
    const [sidebarOpen, setSidebarOpen] = useState(true);

    const unreadCount   = auth.unreadCount   || 0;
    const notifications = auth.notifications || [];

    // On mobile default to closed
    useEffect(() => {
        if (window.innerWidth < 1024) {
            setSidebarOpen(false);
        }
    }, []);

    // Lock body scroll when mobile sidebar is open
    useEffect(() => {
        const isMobile = window.innerWidth < 1024;
        if (isMobile) {
            document.body.style.overflow = sidebarOpen ? 'hidden' : '';
        }
        return () => { document.body.style.overflow = ''; };
    }, [sidebarOpen]);

    const toggleSidebar = () => setSidebarOpen(prev => !prev);
    const closeSidebar  = () => setSidebarOpen(false);

    const c = (name) => route().current(name);

    return (
        <div className="flex h-screen bg-gray-100 font-sans">

            {/* ══════════════════════════════════════════
                DESKTOP SIDEBAR
                - Fully visible (w-64) when sidebarOpen = true
                - Fully hidden (w-0, overflow-hidden) when false
                No more icon-only collapsed state.
            ══════════════════════════════════════════ */}
            <aside
                className={`
                    hidden lg:flex flex-col bg-gray-900 text-white shadow-xl z-20 shrink-0
                    transition-all duration-300 ease-in-out overflow-hidden
                    ${sidebarOpen ? 'w-64' : 'w-0'}
                `}
            >
                {/* Sidebar header */}
                <div className="flex items-center justify-center h-20 px-4 border-b border-gray-800 shrink-0 min-w-[256px]">
                    <div className="flex flex-col items-center gap-1.5">
                        <div className="w-10 h-10 rounded-xl bg-blue-600/20 border border-blue-500/30 flex items-center justify-center">
                            <svg className="w-6 h-6 text-blue-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                            </svg>
                        </div>
                        <h1 className="text-base font-black tracking-widest leading-none">
                            <span className="text-blue-400">NBI</span><span className="text-white"> SYS</span>
                        </h1>
                    </div>
                </div>

                {/* Nav links — min-w prevents content from wrapping during animation */}
                <div className="flex-1 overflow-y-auto min-w-[256px]">
                    <SidebarContent isAdmin={isAdmin} isConfirmer={isConfirmer} onNavigate={() => {}} />
                </div>
            </aside>

            {/* ══════════════════════════════════════════
                MOBILE SIDEBAR (slide-over drawer)
            ══════════════════════════════════════════ */}

            {/* Backdrop */}
            <div
                className={`lg:hidden fixed inset-0 bg-black/60 z-30 transition-opacity duration-300 ${
                    sidebarOpen ? 'opacity-100 pointer-events-auto' : 'opacity-0 pointer-events-none'
                }`}
                onClick={closeSidebar}
                aria-hidden="true"
            />

            {/* Drawer */}
            <aside
                className={`lg:hidden fixed top-0 left-0 h-full w-72 max-w-[85vw] bg-gray-900 text-white flex flex-col shadow-2xl z-40 transition-transform duration-300 ease-in-out ${
                    sidebarOpen ? 'translate-x-0' : '-translate-x-full'
                }`}
            >
                {/* Close button */}
                <button
                    onClick={closeSidebar}
                    aria-label="Close sidebar"
                    className="absolute top-4 right-4 p-1.5 rounded-lg text-gray-400 hover:text-white hover:bg-gray-700 transition-colors"
                >
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
                    </svg>
                </button>

                <div className="h-20 flex items-center justify-center px-6 border-b border-gray-800 shrink-0">
                    <div className="flex flex-col items-center gap-1.5">
                        <div className="w-10 h-10 rounded-xl bg-blue-600/20 border border-blue-500/30 flex items-center justify-center">
                            <svg className="w-6 h-6 text-blue-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                            </svg>
                        </div>
                        <h1 className="text-base font-black tracking-widest leading-none">
                            <span className="text-blue-400">NBI</span><span className="text-white"> SYS</span>
                        </h1>
                    </div>
                </div>

                <SidebarContent isAdmin={isAdmin} isConfirmer={isConfirmer} onNavigate={closeSidebar} />
            </aside>

            {/* ══════════════════════════════════════════
                MAIN CONTENT
            ══════════════════════════════════════════ */}
            <div className="flex-1 flex flex-col overflow-hidden min-w-0">

                {header && (
                    <header className="bg-white shadow-sm border-b border-gray-200 z-10">
                        <div className="flex items-center justify-between py-4 px-4 sm:px-6 lg:px-8">

                            <div className="flex items-center gap-3">
                                {/* ── Burger / Hamburger toggle — works on BOTH mobile & desktop ── */}
                                <button
                                    onClick={toggleSidebar}
                                    aria-label="Toggle sidebar"
                                    className="p-2 rounded-lg text-gray-600 hover:bg-gray-100 transition-colors focus:outline-none focus:ring-2 focus:ring-blue-200"
                                >
                                    <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 12h16M4 18h16" />
                                    </svg>
                                </button>
                                <div>{header}</div>
                            </div>

                            <div className="flex items-center gap-4 sm:gap-6">

                                {/* ── Notification Bell ── */}
                                <div className="relative">
                                    <button
                                        onClick={() => setShowNotifications(prev => !prev)}
                                        className="relative p-2 rounded-xl hover:bg-slate-100 transition-colors focus:outline-none focus:ring-2 focus:ring-blue-100"
                                        aria-label="Notifications"
                                    >
                                        <svg className="w-6 h-6 text-slate-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2"
                                                d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" />
                                        </svg>
                                        {unreadCount > 0 && (
                                            <span className="absolute -top-1 -right-1 bg-rose-500 text-white text-[10px] font-black rounded-full w-5 h-5 flex items-center justify-center border-2 border-white">
                                                {unreadCount > 9 ? '9+' : unreadCount}
                                            </span>
                                        )}
                                    </button>

                                    {showNotifications && (
                                        <>
                                            <div className="fixed inset-0 z-40" onClick={() => setShowNotifications(false)} />
                                            <div className="absolute right-0 mt-2 w-80 bg-white rounded-2xl shadow-2xl border border-slate-200 z-50 overflow-hidden">
                                                <div className="px-4 py-3 border-b border-slate-100 flex items-center justify-between bg-slate-50">
                                                    <h3 className="font-bold text-sm text-slate-900">Notifications</h3>
                                                    {unreadCount > 0 && (
                                                        <span className="text-xs bg-rose-100 text-rose-700 font-bold px-2 py-0.5 rounded-full border border-rose-200">
                                                            {unreadCount} alerts
                                                        </span>
                                                    )}
                                                </div>

                                                <div className="max-h-80 overflow-y-auto divide-y divide-slate-50">
                                                    {notifications.length === 0 ? (
                                                        <div className="p-6 text-center text-sm text-slate-400">
                                                            All caught up! No new alerts.
                                                        </div>
                                                    ) : (
                                                        notifications.map(notif => (
                                                            <Link
                                                                href={notif.link || '#'}
                                                                key={notif.id}
                                                                onClick={(e) => {
                                                                    // If the notification item is still unread, fire the database record update request
                                                                    if (!notif.read_at) {
                                                                        // Prevent immediate navigation so the Inertia background update task can execute first
                                                                        e.preventDefault();
                                                                        
                                                                        router.post(route('admin.notifications.read', notif.id), {}, {
                                                                            preserveScroll: true,
                                                                            onSuccess: () => {
                                                                                // Once successfully saved to the database, proceed with the redirection link navigation
                                                                                if (notif.link) {
                                                                                    router.visit(notif.link);
                                                                                }
                                                                            }
                                                                        });
                                                                    }
                                                                }}
                                                                className="px-4 py-3 hover:bg-slate-50 transition-colors flex gap-3 items-start border-b border-slate-50 block"
                                                            >
                                                                                                                    <div className="flex-1">
                                                                    <p className="text-xs font-bold text-slate-900">{notif.title}</p>
                                                                    <p className="text-[11px] text-slate-500 leading-tight mt-0.5">{notif.message}</p>
                                                                    <p className="text-[10px] text-slate-400 mt-1">
                                                                        {new Date(notif.created_at).toLocaleTimeString()}
                                                                    </p>
                                                                </div>
                                                                {/* Dynamic logical rendering: The blue indicator dot appears only if the read_at timestamp is null */}
                                                                {!notif.read_at && <div className="w-1.5 h-1.5 bg-blue-600 rounded-full mt-1 shrink-0" />}
                                                            </Link>
                                                        ))
                                                    )}
                                                </div>

                                                <div className="px-4 py-3 border-t border-slate-100 bg-slate-50 hover:bg-slate-100 transition-colors cursor-pointer text-center">
                                                    <p className="text-xs font-semibold text-blue-600">View all activity</p>
                                                </div>
                                            </div>
                                        </>
                                    )}
                                </div>

                                {/* ── Profile Dropdown ── */}
                                <DropdownMenu>
                                    <DropdownMenuTrigger className="outline-none focus:ring-4 focus:ring-blue-100 rounded-full">
                                        <Avatar className="cursor-pointer border-2 border-gray-200 hover:border-blue-400 transition-all shadow-sm">
                                            <AvatarImage src={user?.avatar || ""} />
                                            <AvatarFallback className="bg-blue-600 text-white font-bold uppercase">
                                                {user?.name?.charAt(0) || 'U'}
                                            </AvatarFallback>
                                        </Avatar>
                                    </DropdownMenuTrigger>

                                <DropdownMenuContent 
                                    align="end" 
                                    className="w-56 mt-2 border-slate-200 rounded-xl"
                                    style={{
                                        background: "#ffffff",      // Forces a solid white background fill to block elements underneath
                                        backgroundColor: "#ffffff", // Standby fallback color declaration
                                        boxShadow: "0 10px 25px -5px rgba(15, 23, 42, 0.12), 0 8px 16px -4px rgba(15, 23, 42, 0.06)", // Deep professional shadow
                                        zIndex: 9999,               // Elevates the menu high above cards, icons, and layout graphics
                                        position: "relative"        // Anchors the explicit styling rules safely
                                        }}
                                    >
                                        <DropdownMenuSeparator className="bg-slate-100" />

                                        <DropdownMenuItem asChild className="cursor-pointer py-2 focus:bg-slate-50">
                                            <Link href={route('profile.edit')} className="w-full flex items-center text-slate-700 font-medium">
                                                <svg className="w-4 h-4 mr-2 text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                                                </svg>
                                                My Profile
                                            </Link>
                                        </DropdownMenuItem>

                                        <DropdownMenuSeparator className="bg-slate-100" />

                                        <DropdownMenuItem asChild className="cursor-pointer py-2 focus:bg-rose-50">
                                            <Link href={route('logout')} method="post" as="button" className="w-full flex items-center text-rose-600 font-bold">
                                                <svg className="w-4 h-4 mr-2 text-rose-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
                                                </svg>
                                                Log Out
                                            </Link>
                                        </DropdownMenuItem>
                                    </DropdownMenuContent>
                                </DropdownMenu>

                            </div>
                        </div>
                    </header>
                )}

                <main className="flex-1 overflow-y-auto bg-gray-50 p-4 sm:p-6">
                    {children}
                </main>
            </div>
        </div>
    );
}
