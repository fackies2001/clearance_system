import { useState } from "react"; 

import { Head, router } from "@inertiajs/react";
import AuthenticatedLayout from "@/Layouts/AuthenticatedLayout";
import ReactApexChart from "react-apexcharts";

// ── Status Helpers ──────────────────────────────────────────────────────────
const STATUS_COLORS = {
    pending:             "#64748b",
    under_review:        "#0ea5e9",
    biometrics_captured: "#8b5cf6",
    approved:            "#22c55e",
    released:            "#059669",
    rejected:            "#ef4444",
    hit:                 "#f59e0b",
};

const STATUS_LABELS = {
    pending:             "Pending",
    under_review:        "Under Review",
    biometrics_captured: "Biometrics",
    approved:            "Approved",
    released:            "Released",
    rejected:            "Rejected",
    hit:                 "HIT",
};

const WORKFLOW_BADGE = {
    pending:             { bg: "#f1f5f9", text: "#64748b", border: "#e2e8f0" },
    under_review:        { bg: "#e0f2fe", text: "#0369a1", border: "#bae6fd" },
    biometrics_captured: { bg: "#ede9fe", text: "#6d28d9", border: "#ddd6fe" },
    approved:            { bg: "#dcfce7", text: "#15803d", border: "#bbf7d0" },
    released:            { bg: "#d1fae5", text: "#065f46", border: "#a7f3d0" },
    rejected:            { bg: "#fee2e2", text: "#dc2626", border: "#fecaca" },
    hit:                 { bg: "#fef3c7", text: "#b45309", border: "#fde68a" },
};

const PAYMENT_BADGE = {
    paid:    { bg: "#dcfce7", text: "#15803d" },
    pending: { bg: "#fef3c7", text: "#b45309" },
};

function fmtMonth(ym) {
    if (!ym) return "";
    const [year, month] = ym.split("-");
    return new Date(year, month - 1).toLocaleDateString("en-PH", { month: "short" });
}

function timeAgo(dateStr) {
    const diff = Date.now() - new Date(dateStr).getTime();
    const mins = Math.floor(diff / 60000);
    if (mins < 1) return "just now";
    if (mins < 60) return `${mins}m ago`;
    const hrs = Math.floor(mins / 60);
    if (hrs < 24) return `${hrs}h ago`;
    return `${Math.floor(hrs / 24)}d ago`;
}

// ── Stat Card ───────────────────────────────────────────────────────────────
// 1. Add the "onClick" prop to the component arguments
const STAT_ICONS = {
    "#3b82f6": "📋",
    "#059669": "✅",
    "#f59e0b": "⚠️",    
    "#8b5cf6": "📅",
    "#ef4444": "💳",
    "#0ea5e9": "👥",
};

function StatCard({ label, value, sub, color, icon, onClick }) {
    const emoji = icon || STAT_ICONS[color] || "📊";
    return (
        <div
            onClick={onClick}
            style={{
                background: "#fff",
                border: "1px solid #f1f5f9",
                borderTop: `3px solid ${color}`,
                borderRadius: 14,
                padding: "18px 20px",
                flex: 1,
                minWidth: 160,
                cursor: onClick ? "pointer" : "default",
                transition: "box-shadow 0.2s, transform 0.2s",
            }}
            onMouseEnter={e => {
                if (onClick) {
                    e.currentTarget.style.boxShadow = "0 6px 20px rgba(0,0,0,0.07)";
                    e.currentTarget.style.transform = "translateY(-2px)";
                }
            }}
            onMouseLeave={e => {
                if (onClick) {
                    e.currentTarget.style.boxShadow = "none";
                    e.currentTarget.style.transform = "translateY(0)";
                }
            }}
        >
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start" }}>
                <div style={{ flex: 1 }}>
                    <div style={{
                        fontSize: 11, fontWeight: 700, color: "#94a3b8",
                        textTransform: "uppercase", letterSpacing: "0.07em", marginBottom: 8,
                    }}>
                        {label}
                    </div>
                    <div style={{ fontSize: 36, fontWeight: 800, color, lineHeight: 1 }}>
                        {value}
                    </div>
                    {sub && (
                        <div style={{
                            fontSize: 11, color: "#94a3b8", marginTop: 8,
                            fontWeight: 500, display: "flex", alignItems: "center", gap: 4,
                        }}>
                            {sub}
                        </div>
                    )}
                </div>
                <div style={{
                    width: 42, height: 42, borderRadius: 10,
                    background: `${color}15`,
                    display: "flex", alignItems: "center",
                    justifyContent: "center", fontSize: 20, flexShrink: 0,
                }}>
                    {emoji}
                </div>
            </div>
        </div>
    );
}

// ── Chart Card ──────────────────────────────────────────────────────────────
function ChartCard({ title, subtitle, children, style }) {
    return (
        <div style={{
            background: "#fff",
            border: "1px solid #f1f5f9",
            borderRadius: 16,
            padding: "20px 24px",
            ...style,
        }}>
            <div style={{
                display: "flex", alignItems: "flex-start",
                justifyContent: "space-between", marginBottom: 18,
                paddingBottom: 14, borderBottom: "1px solid #f8fafc",
            }}>
                <div>
                    <div style={{
                        fontSize: 14, fontWeight: 800,
                        color: "#0f172a", letterSpacing: "-0.01em",
                    }}>
                        {title}
                    </div>
                    {subtitle && (
                        <div style={{ fontSize: 12, color: "#94a3b8", marginTop: 3 }}>
                            {subtitle}
                        </div>
                    )}
                </div>
            </div>
            {children}
        </div>
    );
}

// ── Main Dashboard ──────────────────────────────────────────────────────────
export default function Dashboard({
    stats,
    monthlyApplications,
    statusBreakdown,
    paymentMethods,
    recentApplications,
    todayAppointments,
}) {
    // ADD THIS STATE FOR THE OPTION A DROPDOWN TOGGLE:
    const [isDropdownOpen, setIsDropdownOpen] = useState(false);
    // ── Chart 1: Monthly Applications — Area ────────────────────────────
    const monthlyChart = {
        options: {
            chart: { type: "area", toolbar: { show: false }, fontFamily: "'DM Sans', system-ui" },
            stroke: { curve: "smooth", width: 2.5 },
            fill: { type: "gradient", gradient: { shadeIntensity: 1, opacityFrom: 0.4, opacityTo: 0.02 } },
            colors: ["#3b82f6"],
            xaxis: {
                categories: (monthlyApplications || []).map(d => d.month),
                labels: { style: { fontSize: "11px", colors: "#94a3b8" } },
            },
            yaxis: { labels: { style: { fontSize: "11px", colors: "#94a3b8" } } },
            tooltip: { theme: "light" },
            grid: { borderColor: "#f1f5f9", strokeDashArray: 4 },
            dataLabels: { enabled: false },
        },
        series: [{ name: "Applications", data: (monthlyApplications || []).map(d => d.total) }],
    };

    // ── Chart 2: Workflow Status — Donut ─────────────────────────────────
    const donutLabels  = (statusBreakdown || []).map(d => STATUS_LABELS[d.status] || d.status);
    const donutValues  = (statusBreakdown || []).map(d => d.total);
    const donutColors  = (statusBreakdown || []).map(d => STATUS_COLORS[d.status] || "#94a3b8");

    const donutChart = {
        options: {
            chart: { type: "donut", fontFamily: "'DM Sans', system-ui" },
            labels: donutLabels,
            colors: donutColors,
            legend: { position: "bottom", fontSize: "12px", fontWeight: 600 },
            plotOptions: { pie: { donut: { size: "68%", labels: {
                show: true,
                total: { show: true, label: "Total", fontSize: "13px", fontWeight: 700, color: "#64748b" },
            } } } },
            tooltip: { theme: "light" },
            dataLabels: { style: { fontSize: "11px", fontWeight: 700 } },
            stroke: { width: 3, colors: ["#fff"] },
        },
        series: donutValues,
    };

    // ── Chart 3: Payment Methods — Pie  ─────────────────────────────────
    const paymentLabels  = (paymentMethods || []).map(d => {
        const map = { gcash: "GCash", maya: "Maya", bank: "Bank Transfer", walkin: "Walk-in" };
        return map[d.payment_method] || d.payment_method;
    });
    const paymentValues  = (paymentMethods || []).map(d => d.total);

    const paymentChart = {
        options: {
            chart: { type: "pie", fontFamily: "'DM Sans', system-ui" },
            labels: paymentLabels,
            colors: ["#06b6d4", "#8b5cf6", "#3b82f6", "#f59e0b"],
            legend: { position: "bottom", fontSize: "12px", fontWeight: 600 },
            tooltip: { theme: "light" },
            dataLabels: { style: { fontSize: "11px", fontWeight: 700 } },
            stroke: { width: 3, colors: ["#fff"] },
        },
        series: paymentValues,
    };

    return (
        <AuthenticatedLayout
        
        header={
            <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", width: "100%" }}>
                <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
                    <div style={{
                        width: 38, height: 38, borderRadius: 10,
                        background: "linear-gradient(135deg, #1e3a5f, #3b82f6)",
                        display: "flex", alignItems: "center", justifyContent: "center",
                        fontSize: 18, color: "#fff",
                    }}>📊</div>
                    <div>
                        <h2 style={{ margin: 0, fontSize: 20, fontWeight: 800, color: "#0f172a", letterSpacing: "-0.02em" }}>
                            Admin Dashboard
                        </h2>
                    </div>
                </div>
                
                {/* Premium Range Selection Filter Menu Dropdown */}
                <div style={{ position: "relative" }}>
                    <button 
                        onClick={() => setIsDropdownOpen(!isDropdownOpen)}
                        style={{
                            padding: "9px 16px",
                            borderRadius: 12,
                            border: isDropdownOpen ? "1.5px solid #3b82f6" : "1.5px solid #e2e8f0",
                            background: "#fff",
                            fontSize: 13,
                            fontWeight: 700,
                            color: "#1e293b",
                            cursor: "pointer",
                            display: "flex",
                            alignItems: "center",
                            gap: 10,
                            boxShadow: "0 1px 2px rgba(15, 23, 42, 0.05)",
                            transition: "all 0.2s ease",
                            outline: "none"
                        }}
                        onMouseEnter={e => { if(!isDropdownOpen) e.currentTarget.style.borderColor = "#cbd5e1"; }}
                        onMouseLeave={e => { if(!isDropdownOpen) e.currentTarget.style.borderColor = "#e2e8f0"; }}
                    >
                        <span style={{ fontSize: 14 }}>📅</span>
                        <span>
                            {
                                stats.active_range === 'today' ? 'Today' :
                                stats.active_range === 'yesterday' ? 'Yesterday' :
                                stats.active_range === 'last_7_days' ? 'Last 7 Days' :
                                stats.active_range === 'last_month' ? 'Last Month' :
                                stats.active_range === 'last_year' ? 'Last Year' : 
                                `Custom: ${stats.active_range.split('-').reverse().join('/')}` // Cleaner display format (DD/MM/YYYY)
                            }
                        </span>
                        <span style={{ 
                            fontSize: 10, 
                            color: isDropdownOpen ? "#3b82f6" : "#94a3b8",
                            transform: isDropdownOpen ? "rotate(180deg)" : "rotate(0deg)",
                            transition: "transform 0.2s ease",
                            display: "inline-block"
                        }}>▼</span>
                    </button>

                    {isDropdownOpen && (
                        <div style={{
                            position: "absolute",
                            top: "calc(100% + 8px)",
                            right: 0,
                            background: "rgba(255, 255, 255, 0.96)",
                            backdropFilter: "blur(8px)",
                            border: "1px solid rgba(226, 232, 240, 0.8)",
                            borderRadius: 16,
                            boxShadow: "0 12px 30px -4px rgba(15, 23, 42, 0.12), 0 4px 12px -2px rgba(15, 23, 42, 0.04)",
                            padding: "8px",
                            zIndex: 100,
                            minWidth: 210,
                            display: "flex",
                            flexDirection: "column",
                            gap: 3,
                        }}>
                            {[
                                { key: 'today', label: 'Today'},
                                { key: 'yesterday', label: 'Yesterday' },
                                { key: 'last_7_days', label: 'Last 7 Days' },
                                { key: 'last_month', label: 'Last Month'},
                                { key: 'last_year', label: 'Last Year' },
                                // ADDED THE ALL-TIME CONTEXT ACTION INTERFACE SELECTION OPTION:
                                { key: 'all_time', label: 'All-Time Records'}
                            ].map((option) => {
                                const isSelected = stats.active_range === option.key;
                                return (
                                    <button
                                        key={option.key}
                                        onClick={() => {
                                            router.get(route('admin.dashboard'), { range: option.key }, { preserveState: true });
                                            setIsDropdownOpen(false);
                                        }}
                                        style={{
                                            width: "100%",
                                            padding: "9px 12px",
                                            borderRadius: 10,
                                            border: "none",
                                            background: isSelected ? "#eff6ff" : "transparent",
                                            color: isSelected ? "#1d4ed8" : "#334155",
                                            fontSize: 13,
                                            fontWeight: isSelected ? 700 : 600,
                                            textAlign: "left",
                                            cursor: "pointer",
                                            display: "flex",
                                            alignItems: "center",
                                            gap: 10,
                                            transition: "all 0.15s ease"
                                        }}
                                        onMouseEnter={e => { if(!isSelected) { e.currentTarget.style.background = "#f1f5f9"; e.currentTarget.style.color = "#0f172a"; } }}
                                        onMouseLeave={e => { if(!isSelected) { e.currentTarget.style.background = "transparent"; e.currentTarget.style.color = "#334155"; } }}
                                    >
                                        <span style={{ opacity: isSelected ? 1 : 0.7, fontSize: 14 }}>{option.icon}</span>
                                        <span>{option.label}</span>
                                        {isSelected && <span style={{ marginLeft: "auto", fontSize: 12 }}>✓</span>}
                                    </button>
                                );
                            })}

                            {/* Styled horizontal separator row */}
                            <div style={{ height: "1px", background: "#f1f5f9", margin: "6px 6px" }} />

                            {/* Integrated Custom Manual Date Selection Input Node Fields */}
                            <div style={{ 
                                margin: "2px 4px 4px",
                                padding: "10px", 
                                borderRadius: 12,
                                background: "#f8fafc",
                                border: "1px solid #f1f5f9",
                                display: "flex", 
                                flexDirection: "column", 
                                gap: 6 
                            }}>
                                <label style={{ 
                                    fontSize: 10, 
                                    fontWeight: 800, 
                                    color: "#94a3b8", 
                                    textTransform: "uppercase", 
                                    letterSpacing: "0.06em" 
                                }}>
                                     Custom Date Lookup
                                </label>
                                <input 
                                    type="date" 
                                    defaultValue={!['today', 'yesterday', 'last_7_days', 'last_month', 'last_year'].includes(stats.active_range) ? stats.active_range : new Date().toISOString().split('T')[0]}
                                    onChange={(e) => {
                                        if(e.target.value) {
                                            router.get(route('admin.dashboard'), { range: e.target.value }, { preserveState: true });
                                            setIsDropdownOpen(false);
                                        }
                                    }}
                                    style={{
                                        width: "100%",
                                        padding: "6px 8px",
                                        borderRadius: 8,
                                        border: "1.5px solid #e2e8f0",
                                        fontSize: 12,
                                        fontWeight: 600,
                                        color: "#1e293b",
                                        background: "#fff",
                                        outline: "none",
                                        boxSizing: "border-box",
                                        cursor: "pointer"
                                    }}
                                />
                            </div>
                        </div>
                    )}
                </div>
            </div>
        }
        >
            <Head title="Admin Dashboard" />

            <div style={{ padding: "24px 28px", fontFamily: "'DM Sans', system-ui, sans-serif" }}>

                    {/* ── Row 1: Stat Cards ── */}
                    <div style={{ display: "flex", gap: 14, flexWrap: "wrap", marginBottom: 28 }}>
                        <StatCard 
                            label="Today's Applications" 
                            value={stats.current_applications} // Starts at 0 on daily resets
                            sub={`${stats.pending_applications} pending processing`} 
                            color="#3b82f6" 
                            onClick={() => router.visit(route('admin.clearance.index'))}
                        />
                        <StatCard 
                            label="Released Clearances" 
                            value={stats.released} // Reflects items issued within the active date period
                            sub={`Total record: ${stats.all_time_applications} overall`} 
                            color="#059669" 
                            onClick={() => router.visit(route('admin.clearance.index'))}
                        />
                        <StatCard 
                            label="HIT Cases Detected" 
                            value={stats.hit_cases} // Matches hits found during the active date range boundary
                            color="#f59e0b" 
                            onClick={() => router.visit(route('admin.hit.index'))}
                        />
                        <StatCard 
                            label="Scheduled Appointments" 
                            value={stats.appointments_count} // Displays the actual list volume count for the active date filter
                            sub={`${stats.pending_appointments} pending validation`} 
                            color="#8b5cf6" 
                            onClick={() => router.visit(route('admin.appointments.index'))}
                        />
                        <StatCard 
                            label="Pending Payments" 
                            value={stats.pending_payment} // Tracks current active cycle unsettled balances
                            sub={`${stats.paid_applications} successfully paid`} 
                            color="#ef4444" 
                            onClick={() => router.visit(route('admin.transactions.index'))}
                        />
                        <StatCard 
                            label="Total System Users" 
                            value={stats.total_users} // Static metric constant accumulation display
                            sub="Registered client accounts"
                            color="#0ea5e9" 
                            onClick={() => router.visit(route('admin.users.index'))}
                        />
                    </div>

                    {/* ── Row 2: Monthly Applications + Workflow Donut ── */}
                <div style={{ display: "grid", gridTemplateColumns: "1.5fr 1fr", gap: 18, marginBottom: 18 }}>
                        <ChartCard title="Monthly Applications" subtitle={['today', 'yesterday', 'last_7_days', 'last_month'].includes(stats.active_range) ? "6-Month historical trend" : (stats.active_range === 'all_time' ? "All-time history overview" : "Active range visualization matrix")}>
                            {(monthlyApplications || []).length > 0 ? (
                                <ReactApexChart
                                    options={monthlyChart.options}
                                    series={monthlyChart.series}
                                    type="area"
                                    height={280}
                                />
                            ) : (
                                <EmptyState message="No application records match this specific date filter range yet." />
                            )}
                        </ChartCard>

                        <ChartCard title="Workflow Status" subtitle="Status distribution map data metrics">
                            {(statusBreakdown || []).length > 0 ? (
                                <ReactApexChart
                                    options={donutChart.options}
                                    series={donutChart.series}
                                    type="donut"
                                    height={280}
                                />
                            ) : (
                                <EmptyState message="No workflow activity statuses found within this timeframe filter limits." />
                            )}
                        </ChartCard>
                    </div>

                {/* ── Row 3: Payment Methods + Today's Schedule ── */}
                <div style={{ display: "grid", gridTemplateColumns: "1fr 1.6fr", gap: 18, marginBottom: 18 }}>
                    <ChartCard title="Payment Methods" subtitle="Paid applications by channel">
                        {(paymentMethods || []).length > 0 ? (
                            <ReactApexChart
                                options={paymentChart.options}
                                series={paymentChart.series}
                                type="pie"
                                height={260}
                            />
                        ) : (
                            <EmptyState message="No payment data yet." />
                        )}
                    </ChartCard>

                    <ChartCard title="Today's Appointments" subtitle={`${(todayAppointments || []).length} scheduled for today`}>
                        {(todayAppointments || []).length > 0 ? (
                            <div style={{ maxHeight: 260, overflowY: "auto" }}>
                                <table style={{ width: "100%", borderCollapse: "collapse", fontSize: 13 }}>
                                    <thead>
                                        <tr style={{ borderBottom: "2px solid #f1f5f9" }}>
                                            <TH>Queue</TH>
                                            <TH>Applicant</TH>
                                            <TH>Time Slot</TH>
                                            <TH>Status</TH>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {(todayAppointments || []).map(apt => (
                                           <tr
                                                key={apt.id}
                                                style={{ borderBottom: "1px solid #f8fafc", transition: "background 0.15s" }}
                                                onMouseEnter={e => e.currentTarget.style.background = "#f8fafc"}
                                                onMouseLeave={e => e.currentTarget.style.background = "transparent"}
                                            >
                                                <td style={{ padding: "10px 8px", fontWeight: 600, color: "#334155" }}>
                                                    {apt.user?.name || "—"}
                                                </td>
                                                <td style={{ padding: "10px 8px", color: "#64748b", fontWeight: 500 }}>
                                                    {apt.time_slot}
                                                </td>
                                                <td style={{ padding: "10px 8px" }}>
                                                    <AppointBadge status={apt.status} />
                                                </td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>
                        ) : (
                            <EmptyState message="No appointments for today." />
                        )}
                    </ChartCard>
                </div>

                {/* ── Row 4: Recent Applications ── */}
                <ChartCard title="Recent Applications" subtitle="Latest 8 applications submitted">
                    {(recentApplications || []).length > 0 ? (
                        <div style={{ overflowX: "auto" }}>
                            <table style={{ width: "100%", borderCollapse: "collapse", fontSize: 13, tableLayout: "fixed" }}>
                                <thead>
                                    <tr style={{ borderBottom: "2px solid #f1f5f9" }}>
                                        <TH width="22%">Tracking No.</TH>
                                        <TH width="25%">Applicant</TH>
                                        <TH width="18%">Status</TH>
                                        <TH width="15%">Payment</TH>
                                        <TH width="20%" align="right">Submitted</TH>
                                    </tr>
                                </thead>
                                <tbody>
                                    {(recentApplications || []).map(app => {
                                        const ws = WORKFLOW_BADGE[app.workflow_status] || WORKFLOW_BADGE.pending;
                                        const ps = PAYMENT_BADGE[app.payment_status]   || PAYMENT_BADGE.pending;
                                        return (
                                            <tr
                                                key={app.id}
                                                style={{ borderBottom: "1px solid #f8fafc", transition: "background 0.15s", cursor: "default" }}
                                                onMouseEnter={e => e.currentTarget.style.background = "#f8fafc"}
                                                onMouseLeave={e => e.currentTarget.style.background = "transparent"}
                                            >
                                                <td style={{ padding: "10px 8px", fontFamily: "monospace", fontWeight: 700, color: "#3b82f6", fontSize: 12 }}>
                                                {app.tracking_no}
                                            </td>
                                            <td style={{ padding: "10px 8px", fontWeight: 600, color: "#1e293b" }}>
                                                {app.first_name} {app.last_name}
                                            </td>
                                            <td style={{ padding: "10px 8px" }}>
                                                <span style={{
                                                    display: "inline-block", padding: "3px 10px", borderRadius: 20,
                                                    fontSize: 10, fontWeight: 800, textTransform: "uppercase",
                                                    letterSpacing: "0.04em",
                                                    background: (WORKFLOW_BADGE[app.workflow_status] || WORKFLOW_BADGE.pending).bg,
                                                    color: (WORKFLOW_BADGE[app.workflow_status] || WORKFLOW_BADGE.pending).text,
                                                    border: `1px solid ${(WORKFLOW_BADGE[app.workflow_status] || WORKFLOW_BADGE.pending).border}`,
                                                }}>
                                                    {STATUS_LABELS[app.workflow_status] || app.workflow_status}
                                                </span>
                                            </td>
                                            <td style={{ padding: "10px 8px" }}>
                                                <span style={{
                                                    display: "inline-block", padding: "3px 10px", borderRadius: 20,
                                                    fontSize: 10, fontWeight: 800, textTransform: "uppercase",
                                                }}>
                                                    {app.payment_method
                                                        ? { gcash: "GCash", maya: "Maya", bank_transfer: "Bank Transfer", walkin: "Walk-in" }[app.payment_method] || app.payment_method
                                                        : "—"}
                                                </span>
                                            </td>
                                            <td style={{ padding: "10px 8px", textAlign: "right", color: "#94a3b8", fontSize: 11, fontWeight: 500 }}>
                                                {timeAgo(app.created_at)}
                                            </td>
                                            </tr>
                                        );
                                    })}
                                </tbody>
                            </table>
                        </div>
                    ) : (
                        <EmptyState message="No applications yet." />
                    )}
                </ChartCard>

            </div>
        </AuthenticatedLayout>
    );
}

// ── Sub-Components ──────────────────────────────────────────────────────────
function TH({ children, align = "left", width }) {
    return (
        <th style={{
            padding: "10px 8px",
            textAlign: align,
            fontSize: 10,
            fontWeight: 800,
            color: "#94a3b8",
            textTransform: "uppercase",
            letterSpacing: "0.08em",
            width: width || "auto",
        }}>
            {children}
        </th>
    );
}

function AppointBadge({ status }) {
    const map = {
        pending:   { bg: "#fef3c7", text: "#b45309" },
        confirmed: { bg: "#dcfce7", text: "#15803d" },
        cancelled: { bg: "#fee2e2", text: "#dc2626" },
        completed: { bg: "#e0f2fe", text: "#0369a1" },
    };
    const s = map[status] || map.pending;
    return (
        <span style={{
            display: "inline-block", padding: "3px 10px", borderRadius: 20,
            fontSize: 10, fontWeight: 800, textTransform: "uppercase",
            background: s.bg, color: s.text,
        }}>
            {status}
        </span>
    );
}

const EMPTY_ICONS = {
    "No application records match this specific date filter range yet.": "📋",
    "No workflow activity statuses found within this timeframe filter limits.": "🔄",
    "No payment data yet.": "💳",
    "No appointments for today.": "📅",
    "No applications yet.": "📄",
};

function EmptyState({ message = "No data available." }) {
    const emoji = EMPTY_ICONS[message] || "📭";
    return (
        <div style={{
            height: 200, display: "flex", flexDirection: "column",
            alignItems: "center", justifyContent: "center", gap: 10,
        }}>
            <div style={{
                width: 52, height: 52, borderRadius: 14,
                background: "#f8fafc", border: "1.5px solid #f1f5f9",
                display: "flex", alignItems: "center",
                justifyContent: "center", fontSize: 24,
            }}>
                {emoji}
            </div>
            <div style={{ fontSize: 13, fontWeight: 600, color: "#94a3b8" }}>
                {message}
            </div>
        </div>
    );
}
