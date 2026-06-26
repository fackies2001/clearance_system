import { Head, router } from "@inertiajs/react";
import AuthenticatedLayout from "@/Layouts/AuthenticatedLayout";
import React, { useState } from "react";
import ReactApexChart from "react-apexcharts";

// ── Helpers ───────────────────────────────────────────────────────────────────
const STATUS_COLORS = {
    pending:             "#64748b",
    under_review:        "#0369a1",
    biometrics_captured: "#7c3aed",
    approved:            "#15803d",
    released:            "#065f46",
    rejected:            "#dc2626",
    hit:                 "#d97706",
};

const STATUS_LABELS = {
    pending:             "Pending",
    under_review:        "Under Review",
    biometrics_captured: "Biometrics Captured",
    approved:            "Approved",
    released:            "Released",
    rejected:            "Rejected",
    hit:                 "HIT",
};

function fmtMonth(ym) {
    if (!ym) return "";
    const [year, month] = ym.split("-");
    return new Date(year, month - 1).toLocaleDateString("en-PH", { month: "short", year: "numeric" });
}

// ── Stat Card Component ───────────────────────────────────────────────────────
function StatCard({ label, value, sub, color, icon }) {
    return (
        <div style={{
            background: "#fff",
            border: `1.5px solid ${color}25`,
            borderLeft: `4px solid ${color}`,
            borderRadius: 12,
            padding: "18px 20px",
            flex: 1, minWidth: 150,
        }}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start" }}>
                <div>
                    <div style={{ fontSize: 11, color: "#94a3b8", fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.08em", marginBottom: 6 }}>
                        {label}
                    </div>
                    <div style={{ fontSize: 30, fontWeight: 800, color, lineHeight: 1 }}>{value}</div>
                    {sub && <div style={{ fontSize: 11, color: "#94a3b8", marginTop: 5, fontWeight: 500 }}>{sub}</div>}
                </div>
                <div style={{ fontSize: 26, opacity: 0.6 }}>{icon}</div>
            </div>
        </div>
    );
}

// ── Chart Card Wrapper Component ──────────────────────────────────────────────
function ChartCard({ title, subtitle, children }) {
    return (
        <div style={{
            background: "#fff",
            border: "1.5px solid #e2e8f0",
            borderRadius: 14,
            padding: "20px 24px",
            boxShadow: "0 1px 4px rgba(0,0,0,0.04)",
        }}>
            <div style={{ marginBottom: 16 }}>
                <div style={{ fontSize: 15, fontWeight: 800, color: "#0f172a" }}>{title}</div>
                {subtitle && <div style={{ fontSize: 12, color: "#94a3b8", marginTop: 2 }}>{subtitle}</div>}
            </div>
            {children}
        </div>
    );
}

// ── Main Page Component ───────────────────────────────────────────────────────
export default function Reports({
    monthlyApplications,
    statusBreakdown,
    hitVsClearedVsPending,
    peakDays,
    monthlyReleased,
    summary,
    currentFilter = "today", // Receives filter value from backend, defaults to "today"
}) {
    // State to hold the current selected filter option
    const [filter, setFilter] = useState(currentFilter);

    const handleFilterChange = (e) => {
        const selectedFilter = e.target.value;
        setFilter(selectedFilter);
        
        // Sends a real-time HTTP request using Inertia to re-query database tables matching the filter state
        router.get(
            window.location.pathname, 
            { filter: selectedFilter }, 
            { 
                preserveState: true, 
                preserveScroll: true,
                only: ['summary', 'monthlyApplications', 'statusBreakdown', 'hitVsClearedVsPending', 'peakDays', 'monthlyReleased', 'currentFilter']
            }
        );
    };

    // ── Chart 1: Monthly Applications — Line Chart ────────────────────────
    const monthlyAppChart = {
        options: {
            chart: { type: "area", toolbar: { show: false }, fontFamily: "DM Sans, system-ui" },
            stroke: { curve: "smooth", width: 2 },
            fill: { type: "gradient", gradient: { shadeIntensity: 1, opacityFrom: 0.35, opacityTo: 0.02 } },
            colors: ["#1d4ed8"],
            xaxis: {
                categories: monthlyApplications.map(d => d.month),
                labels: { style: { fontSize: "11px", colors: "#94a3b8" } },
            },
            yaxis: { labels: { style: { fontSize: "11px", colors: "#94a3b8" } } },
            tooltip: { theme: "light" },
            grid: { borderColor: "#f1f5f9" },
            dataLabels: { enabled: false },
        },
        series: [{ name: "Applications", data: monthlyApplications.map(d => d.total) }],
    };

    // ── Chart 2: Monthly Released — Slim Column Bar Chart ─────────────────
    const monthlyReleasedChart = {
        options: {
            chart: { type: "bar", toolbar: { show: false }, fontFamily: "DM Sans, system-ui" },
            colors: ["#065f46"],
            plotOptions: { 
                bar: { 
                    borderRadius: 4, 
                    columnWidth: "35%", // Set narrower column widths for consistent spacing
                    distributed: false 
                } 
            },
            xaxis: {
                categories: monthlyReleased.map(d => d.month),
                labels: { style: { fontSize: "11px", colors: "#94a3b8" } },
            },
            yaxis: { labels: { style: { fontSize: "11px", colors: "#94a3b8" } } },
            tooltip: { theme: "light" },
            grid: { borderColor: "#f1f5f9" },
            dataLabels: { enabled: false },
        },
        series: [{ name: "Released", data: monthlyReleased.map(d => d.total) }],
    };

    // ── Chart 3: Applications by Status — Pie Chart ───────────────────────
    const statusData = statusBreakdown.sort((a, b) => b.total - a.total);
    const statusPieChart = {
        options: {
            chart: { type: "pie", fontFamily: "DM Sans, system-ui" },
            labels: statusData.map(d => STATUS_LABELS[d.status] || d.status),
            colors: statusData.map(d => STATUS_COLORS[d.status] || "#64748b"),
            legend: { 
                position: "bottom", 
                fontSize: "11px",
                horizontalAlign: "center",
                itemMargin: { horizontal: 8, vertical: 4 }
            },
            tooltip: { theme: "light" },
            dataLabels: { 
                enabled: true,
                style: { fontSize: "11px", fontWeight: "bold" },
                dropShadow: { enabled: false }
            },
        },
        series: statusData.map(d => d.total),
    };

    // ── Chart 4: HIT vs Cleared vs In Progress — Donut ────────────────────────
    const donutChart = {
        options: {
            chart: { type: "donut", fontFamily: "DM Sans, system-ui" },
            labels: ["HIT", "Released / Cleared", "In Progress", "Rejected"],
            colors: ["#d97706", "#065f46", "#0369a1", "#dc2626"],
            legend: { position: "bottom", fontSize: "12px" },
            plotOptions: { pie: { donut: { size: "65%" } } },
            tooltip: { theme: "light" },
            dataLabels: { style: { fontSize: "12px" } },
        },
        series: [
            hitVsClearedVsPending.hit,
            hitVsClearedVsPending.cleared,
            hitVsClearedVsPending.pending,
            hitVsClearedVsPending.rejected,
        ],
    };

    // ── Chart 5: Peak Processing Days — Narrow Bar Chart ──────────────────
    const peakChart = {
        options: {
            chart: { type: "bar", toolbar: { show: false }, fontFamily: "DM Sans, system-ui" },
            colors: ["#7c3aed"],
            plotOptions: { 
                bar: { 
                    borderRadius: 6, 
                    columnWidth: "22%" // Adjusted column width to make bars slim and narrow
                } 
            },
            xaxis: {
                categories: peakDays.map(d => d.day),
                labels: { style: { fontSize: "11px", colors: "#94a3b8" } },
            },
            yaxis: { labels: { style: { fontSize: "11px", colors: "#94a3b8" } } },
            tooltip: { theme: "light" },
            grid: { borderColor: "#f1f5f9" },
            dataLabels: { enabled: false },
        },
        series: [{ name: "Processed", data: peakDays.map(d => d.total) }],
    };

    return (
        <AuthenticatedLayout
            header={
                <div style={{ display: "flex", alignItems: "center", justifyContent: "between", width: "100%", gap: 12, flexWrap: "wrap" }}>
                    <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
                        <div style={{
                            width: 36, height: 36, borderRadius: 10,
                            background: "#7c3aed", display: "flex",
                            alignItems: "center", justifyContent: "center", fontSize: 18,
                        }}>📊</div>
                        <div>
                            <h2 style={{ margin: 0, fontSize: 20, fontWeight: 800, color: "#0f172a" }}>
                                Reports & Analytics
                            </h2>
                            <p style={{ margin: 0, fontSize: 12, color: "#64748b" }}>
                                NBI Clearance System — Data Overview
                            </p>
                        </div>
                    </div>

                    {/* Filter Dropdown targeting current filter choice */}
                    <div style={{ marginLeft: "auto" }}>
                        <select
                            value={filter}
                            onChange={handleFilterChange}
                            style={{
                                padding: "8px 16px",
                                borderRadius: "8px",
                                border: "1.5px solid #e2e8f0",
                                background: "#fff",
                                fontSize: "13px",
                                fontWeight: 600,
                                color: "#334155",
                                boxShadow: "0 1px 2px rgba(0,0,0,0.05)",
                                outline: "none",
                                cursor: "pointer"
                            }}
                        >
                            <option value="today">Today</option>
                            <option value="yesterday">Yesterday</option>
                            <option value="7_days_ago">7 Days Ago</option>
                            <option value="last_month">Last Month</option>
                            <option value="last_year">Last Year</option>
                            <option value="all_time">All Time Records</option>
                        </select>
                    </div>
                </div>
            }
        >
            <Head title="Reports & Analytics" />

            <div style={{ padding: "24px 28px", fontFamily: "'DM Sans', system-ui, sans-serif" }}>

                {/* ── Summary Stat Cards ── */}
                <div style={{ display: "flex", gap: 12, flexWrap: "wrap", marginBottom: 28 }}>
                    <StatCard
                        label="Total Applications"
                        value={summary.total_applications}
                        sub={`${summary.this_month_apps} this month`}
                        color="#1d4ed8"
                        icon="📋"
                    />
                    <StatCard
                        label="Released"
                        value={summary.total_released}
                        sub={`${summary.this_month_released} this month`}
                        color="#065f46"
                        icon="✅"
                    />
                    <StatCard
                        label="HIT Cases"
                        value={summary.total_hits}
                        color="#d97706"
                        icon="⚠️"
                    />
                    <StatCard
                        label="Rejected"
                        value={summary.total_rejected}
                        color="#dc2626"
                        icon="❌"
                    />
                    <StatCard
                        label="Pending"
                        value={summary.total_pending}
                        color="#64748b"
                        icon="🕐"
                    />
                    <StatCard
                        label="Avg. Processing"
                        value={`${summary.avg_processing_days}d`}
                        sub="from filed to resolved"
                        color="#7c3aed"
                        icon="⏱️"
                    />
                </div>

                {/* ── Row 1: Monthly Applications + Monthly Released ── */}
                <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 16, marginBottom: 16 }}>
                    <ChartCard
                        title="Monthly Applications Filed"
                        subtitle="6-Month historical trend"
                    >
                        {monthlyApplications.length > 0 ? (
                            <ReactApexChart
                                options={monthlyAppChart.options}
                                series={monthlyAppChart.series}
                                type="area"
                                height={260}
                            />
                        ) : (
                            <EmptyChart />
                        )}
                    </ChartCard>

                    <ChartCard
                        title="Monthly Clearances Released"
                        subtitle="6-Month historical trend"
                    >
                        {monthlyReleased.length > 0 ? (
                            <ReactApexChart
                                options={monthlyReleasedChart.options}
                                series={monthlyReleasedChart.series}
                                type="bar"
                                height={260}
                            />
                        ) : (
                            <EmptyChart />
                        )}
                    </ChartCard>
                </div>

                {/* ── Row 2: Status Breakdown + Donut ── */}
                <div style={{ display: "grid", gridTemplateColumns: "1.2fr 1fr", gap: 16, marginBottom: 16 }}>
                    <ChartCard
                        title="Applications by Status"
                        subtitle="Status distribution breakdown"
                    >
                        {statusBreakdown.length > 0 ? (
                            <ReactApexChart
                                options={statusPieChart.options}
                                series={statusPieChart.series}
                                type="pie"
                                height={290}
                            />
                        ) : (
                            <EmptyChart />
                        )}
                    </ChartCard>

                    <ChartCard
                        title="HIT vs Cleared vs In Progress"
                        subtitle="Overall distribution"
                    >
                        <ReactApexChart
                            options={donutChart.options}
                            series={donutChart.series}
                            type="donut"
                            height={280}
                        />
                    </ChartCard>
                </div>

                {/* ── Row 3: Peak Processing Days ── */}
                <div style={{ marginBottom: 16 }}>
                    <ChartCard
                        title="Peak Processing Days"
                        subtitle="Which days of the week admins process the most applications"
                    >
                        {peakDays.length > 0 ? (
                            <ReactApexChart
                                options={peakChart.options}
                                series={peakChart.series}
                                type="bar"
                                height={240}
                            />
                        ) : (
                            <EmptyChart message="No processed applications yet." />
                        )}
                    </ChartCard>
                </div>

            </div>
        </AuthenticatedLayout>
    );
}

function EmptyChart({ message = "No data available yet." }) {
    return (
        <div style={{
            height: 220, display: "flex", alignItems: "center",
            justifyContent: "center", color: "#cbd5e1",
            fontSize: 13, fontWeight: 600,
        }}>
            {message}
        </div>
    );
}