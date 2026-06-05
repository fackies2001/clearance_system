import { useState, useMemo } from "react";
import { Head, router, usePage } from "@inertiajs/react";
import AuthenticatedLayout from "@/Layouts/AuthenticatedLayout";

function fmtDate(d) {
    if (!d) return "—";
    return new Date(d).toLocaleDateString("en-PH", {
        year: "numeric", month: "short", day: "numeric",
        hour: "2-digit", minute: "2-digit",
    });
}

function fullName(c) {
    return [c.first_name, c.middle_name, c.last_name].filter(Boolean).join(" ");
}

function StatCard({ label, value, color }) {
    return (
        <div style={{
            background: '#fff',
            borderTop: `1.5px solid #e2e8f0`,
            borderRight: `1.5px solid #e2e8f0`,
            borderBottom: `1.5px solid #e2e8f0`,
            borderLeft: `4px solid ${color}`,
            borderRadius: 14,
            padding: '20px 22px',
            flex: 1,
            minWidth: 140,
        }}>
            <div style={{ fontSize: 11, color: '#94a3b8', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.08em', marginBottom: 6 }}>
                {label}
            </div>
            <div style={{ fontSize: 32, fontWeight: 800, color, lineHeight: 1 }}>
                {value}
            </div>
        </div>
    );
}

function ResolutionBadge({ resolution }) {
    const config = {
        confirmed:         { label: "Confirmed HIT",     bg: "#fef3c7", color: "#92400e", border: "#fcd34d" },
        for_investigation: { label: "For Investigation", bg: "#fee2e2", color: "#b91c1c", border: "#fca5a5" },
        overridden:        { label: "Cleared",           bg: "#dcfce7", color: "#15803d", border: "#86efac" },
    };
    const c = config[resolution] || { label: "Pending Review", bg: "#f1f5f9", color: "#64748b", border: "#cbd5e1" };
    return (
        <span style={{ display: "inline-flex", alignItems: "center", gap: 5, padding: "3px 10px", borderRadius: 20, fontSize: 11, fontWeight: 700, letterSpacing: "0.05em", color: c.color, background: c.bg, border: `1.5px solid ${c.border}`, textTransform: "uppercase" }}>
            <span style={{ width: 6, height: 6, borderRadius: "50%", background: c.color }} />
            {c.label}
        </span>
    );
}

function DetailPanel({ item, onClose }) {
    const [resolution, setResolution] = useState("");
    const [notes, setNotes]           = useState(item.hit_notes || "");
    const [submitting, setSubmitting] = useState(false);
    const [errors, setErrors]         = useState({});

    const isLocked = item.hit_resolution === "for_investigation";

    function handleSubmit() {
        if (!resolution) return;
        setSubmitting(true);
        setErrors({});
        router.patch(
            route("admin.hit.resolve", item.id),
            { resolution, notes: notes || null },
            {
                preserveScroll: true,
                onSuccess: () => { setSubmitting(false); onClose(); },
                onError: (e) => { setSubmitting(false); setErrors(e); },
            }
        );
    }

    return (
        <div style={{ position: "fixed", inset: 0, zIndex: 50, display: "flex", alignItems: "flex-start", justifyContent: "flex-end" }}>
            <div onClick={onClose} style={{ position: "absolute", inset: 0, background: "rgba(15,23,42,0.5)", backdropFilter: "blur(2px)" }} />
            <div style={{ position: "relative", zIndex: 10, width: "100%", maxWidth: 580, height: "100dvh", overflowY: "auto", background: "#fff", boxShadow: "-8px 0 40px rgba(0,0,0,0.18)", display: "flex", flexDirection: "column" }}>
                {/* Panel Header */}
                <div style={{ padding: "20px 24px 16px", borderBottom: "1px solid #e2e8f0", background: "#fef2f2", position: "sticky", top: 0, zIndex: 5 }}>
                    <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start" }}>
                        <div>
                            <div style={{ fontSize: 11, color: "#ef4444", fontWeight: 700, letterSpacing: "0.1em", textTransform: "uppercase", marginBottom: 2 }}>⚠ HIT Case</div>
                            <div style={{ fontSize: 18, fontWeight: 800, color: "#0f172a", letterSpacing: "0.02em" }}>{item.tracking_no}</div>
                        </div>
                        <button onClick={onClose} style={{ width: 32, height: 32, borderRadius: 8, border: "1px solid #fecaca", background: "#fff", cursor: "pointer", fontSize: 18, color: "#64748b", display: "flex", alignItems: "center", justifyContent: "center" }}>×</button>
                    </div>
                    <div style={{ marginTop: 10 }}><ResolutionBadge resolution={item.hit_resolution} /></div>
                </div>

                <div style={{ padding: "20px 24px", flex: 1 }}>
                    <SectionTitle>Name Match Comparison</SectionTitle>
                    <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12, marginBottom: 22 }}>
                        <div style={{ background: "#f0f9ff", border: "1.5px solid #7dd3fc", borderRadius: 10, padding: "14px 16px" }}>
                            <div style={{ fontSize: 10, fontWeight: 800, color: "#0369a1", textTransform: "uppercase", letterSpacing: "0.1em", marginBottom: 10 }}>Applicant</div>
                            <Field label="First Name"  value={item.first_name}        highlight />
                            <Field label="Middle Name" value={item.middle_name || "—"} />
                            <Field label="Last Name"   value={item.last_name}         highlight />
                            <Field label="Purpose"     value={item.purpose} />
                            <Field label="Filed"       value={fmtDate(item.created_at)} />
                        </div>
                        <div style={{ background: item.matched_record ? "#fef2f2" : "#f8fafc", border: `1.5px solid ${item.matched_record ? "#fca5a5" : "#e2e8f0"}`, borderRadius: 10, padding: "14px 16px" }}>
                            <div style={{ fontSize: 10, fontWeight: 800, color: item.matched_record ? "#b91c1c" : "#64748b", textTransform: "uppercase", letterSpacing: "0.1em", marginBottom: 10 }}>Criminal Record</div>
                            {item.matched_record ? (
                                <>
                                    <Field label="First Name"    value={item.matched_record.first_name}    highlight />
                                    <Field label="Last Name"     value={item.matched_record.last_name}     highlight />
                                    <Field label="Crime Details" value={item.matched_record.crime_details} danger />
                                </>
                            ) : (
                                <div style={{ fontSize: 13, color: "#94a3b8", fontWeight: 600, paddingTop: 8 }}>
                                    No exact match found in criminal records database.
                                    <div style={{ fontSize: 11, color: "#cbd5e1", marginTop: 6 }}>This may have been flagged manually by an admin.</div>
                                </div>
                            )}
                        </div>
                    </div>

                    {item.reviewed_by_name && (
                        <>
                            <SectionTitle>Last Review</SectionTitle>
                            <div style={{ marginBottom: 22 }}>
                                <Field label="Reviewed By" value={item.reviewed_by_name} />
                                <Field label="Reviewed At" value={fmtDate(item.reviewed_at)} />
                                {item.hit_notes && (
                                    <div style={{ marginTop: 8, padding: "10px 12px", background: "#fef3c7", borderRadius: 8, border: "1px solid #fcd34d" }}>
                                        <div style={{ fontSize: 11, color: "#92400e", fontWeight: 700, marginBottom: 4 }}>Notes</div>
                                        <div style={{ fontSize: 13, color: "#78350f" }}>{item.hit_notes}</div>
                                    </div>
                                )}
                            </div>
                        </>
                    )}

                    {!isLocked ? (
                        <>
                            <SectionTitle>Admin Decision</SectionTitle>
                            {errors.resolution && (
                                <div style={{ padding: "8px 12px", background: "#fee2e2", border: "1px solid #fca5a5", borderRadius: 8, color: "#b91c1c", fontSize: 13, marginBottom: 12 }}>
                                    {errors.resolution}
                                </div>
                            )}
                            <div style={{ display: "flex", gap: 10, marginBottom: 14 }}>
                                <button onClick={() => setResolution("cleared")} style={{ flex: 1, padding: "10px 0", borderRadius: 8, cursor: "pointer", fontSize: 13, fontWeight: 700, background: resolution === "cleared" ? "#15803d" : "#f0fdf4", color: resolution === "cleared" ? "#fff" : "#15803d", border: `1.5px solid ${resolution === "cleared" ? "#15803d" : "#86efac"}` }}>
                                    ✓ CLEAR
                                    <div style={{ fontSize: 10, fontWeight: 500, marginTop: 2, opacity: 0.8 }}>False positive — return to workflow</div>
                                </button>
                                <button onClick={() => setResolution("for_investigation")} style={{ flex: 1, padding: "10px 0", borderRadius: 8, cursor: "pointer", fontSize: 13, fontWeight: 700, background: resolution === "for_investigation" ? "#b91c1c" : "#fef2f2", color: resolution === "for_investigation" ? "#fff" : "#b91c1c", border: `1.5px solid ${resolution === "for_investigation" ? "#b91c1c" : "#fca5a5"}` }}>
                                    ⚠ FOR INVESTIGATION
                                    <div style={{ fontSize: 10, fontWeight: 500, marginTop: 2, opacity: 0.8 }}>Confirmed hit — lock case</div>
                                </button>
                            </div>
                            <label style={labelStyle}>Notes (optional)</label>
                            <textarea rows={3} value={notes} onChange={e => setNotes(e.target.value)} placeholder="Add notes about this decision..." style={{ ...inputStyle, resize: "vertical", marginBottom: 14 }} />
                            <button
                                onClick={handleSubmit}
                                disabled={!resolution || submitting}
                                style={{ width: "100%", padding: "11px", borderRadius: 8, border: "none", background: !resolution ? "#e2e8f0" : resolution === "cleared" ? "#15803d" : "#b91c1c", color: !resolution ? "#94a3b8" : "#fff", fontSize: 14, fontWeight: 700, cursor: !resolution ? "not-allowed" : "pointer", opacity: submitting ? 0.6 : 1 }}
                            >
                                {submitting ? "Saving…" : !resolution ? "Select a decision above" : `Confirm: ${resolution === "cleared" ? "CLEAR this case" : "FOR INVESTIGATION"}`}
                            </button>
                        </>
                    ) : (
                        <div style={{ padding: "14px 16px", background: "#fee2e2", border: "1.5px solid #fca5a5", borderRadius: 10, color: "#b91c1c", fontSize: 13, fontWeight: 600, textAlign: "center" }}>
                            🔒 Case is locked — marked For Investigation.
                            <div style={{ fontSize: 11, color: "#ef4444", marginTop: 4, fontWeight: 500 }}>Contact a supervisor to unlock this case.</div>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}

function SectionTitle({ children }) {
    return (
        <div style={{ fontSize: 10, fontWeight: 800, letterSpacing: "0.12em", textTransform: "uppercase", color: "#94a3b8", marginBottom: 10, paddingBottom: 6, borderBottom: "1px solid #f1f5f9" }}>
            {children}
        </div>
    );
}

function Field({ label, value, highlight, danger }) {
    return (
        <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 7 }}>
            <span style={{ fontSize: 11, color: "#94a3b8", fontWeight: 600 }}>{label}</span>
            <span style={{ fontSize: 13, fontWeight: highlight ? 800 : 600, color: danger ? "#b91c1c" : highlight ? "#0f172a" : "#374151", maxWidth: "65%", textAlign: "right" }}>{value || "—"}</span>
        </div>
    );
}

const labelStyle = { display: "block", fontSize: 11, fontWeight: 700, color: "#64748b", textTransform: "uppercase", letterSpacing: "0.06em", marginBottom: 5 };
const inputStyle = { width: "100%", padding: "9px 12px", borderRadius: 8, border: "1.5px solid #e2e8f0", fontSize: 13, color: "#1e293b", background: "#f8fafc", outline: "none", boxSizing: "border-box" };

// ── Main Page ────────────────────────────────────────────────────────────────

export default function HitVerification({ hitClearances = [], stats }) {
    const { flash } = usePage().props;
    const [selected, setSelected]     = useState(null);
    const [search, setSearch]         = useState("");
    const [perPage, setPerPage]       = useState(10);
    const [page, setPage]             = useState(1);
    const [sortConfig, setSortConfig] = useState({ key: 'created_at', direction: 'desc' });

    const requestSort = (key) => {
        let direction = 'asc';
        if (sortConfig.key === key && sortConfig.direction === 'asc') direction = 'desc';
        setSortConfig({ key, direction });
        setPage(1);
    };

    // ── Consistent SVG sort arrows ──
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

    const processedHits = useMemo(() => {
        let result = hitClearances.filter(c => {
            if (!search.trim()) return true;
            const q = search.toLowerCase();
            return fullName(c).toLowerCase().includes(q) || c.tracking_no?.toLowerCase().includes(q);
        });

        if (sortConfig.key !== null) {
            result.sort((a, b) => {
                let aVal = a[sortConfig.key];
                let bVal = b[sortConfig.key];
                if (sortConfig.key === 'created_at' || sortConfig.key === 'reviewed_at') {
                    aVal = new Date(aVal || 0);
                    bVal = new Date(bVal || 0);
                } else if (sortConfig.key === 'name') {
                    aVal = fullName(a).toLowerCase();
                    bVal = fullName(b).toLowerCase();
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
    }, [hitClearances, search, sortConfig]);

    const totalEntries       = processedHits.length;
    const totalPages         = Math.ceil(totalEntries / perPage);
    const indexOfLastRecord  = page * perPage;
    const indexOfFirstRecord = indexOfLastRecord - perPage;
    const currentRecords     = processedHits.slice(indexOfFirstRecord, indexOfLastRecord);
    const showingFrom        = totalEntries === 0 ? 0 : indexOfFirstRecord + 1;
    const showingTo          = indexOfLastRecord > totalEntries ? totalEntries : indexOfLastRecord;

    return (
        <AuthenticatedLayout
            header={
                <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
                    <div style={{ width: 36, height: 36, borderRadius: 10, background: "#dc2626", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 18 }}>⚠</div>
                    <div>
                        <h2 style={{ margin: 0, fontSize: 20, fontWeight: 800, color: "#0f172a" }}>HIT Verification</h2>
                        <p style={{ margin: 0, fontSize: 12, color: "#64748b" }}>Review and resolve flagged HIT cases</p>
                    </div>
                </div>
            }
        >
            <Head title="HIT Verification" />

            <div style={{ padding: "24px 28px", fontFamily: "'DM Sans', system-ui, sans-serif" }}>

                {flash?.success && (
                    <div style={{ padding: "12px 16px", background: "#dcfce7", border: "1px solid #86efac", borderRadius: 10, color: "#15803d", fontSize: 13, fontWeight: 600, marginBottom: 20, display: "flex", alignItems: "center", gap: 8 }}>
                        <span>✓</span> {flash.success}
                    </div>
                )}

                {/* Stat Cards */}
                <div style={{ display: "flex", gap: 14, flexWrap: "wrap", marginBottom: 24 }}>
                    <StatCard label="Total HIT Cases"   value={stats.total_hits}        color="#dc2626" />
                    <StatCard label="With Record Match" value={stats.with_match}        color="#b91c1c" />
                    <StatCard label="No Record Match"   value={stats.without_match}     color="#64748b" />
                    <StatCard label="For Investigation" value={stats.for_investigation} color="#92400e" />
                    <StatCard label="Cleared"           value={stats.confirmed}         color="#15803d" />
                </div>

                <div style={{ background: "#fff", borderRadius: 14, border: "1px solid #e2e8f0", boxShadow: "0 1px 4px rgba(0,0,0,0.05)", overflow: "hidden" }}>

                    {/* ── Toolbar ── */}
                    <div className="px-5 py-3.5 border-b border-slate-100 bg-slate-50 flex flex-wrap items-center gap-4">

                        {/* Show entries */}
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

                        {/* Right side */}
                        <div className="flex items-center gap-3 ml-auto">
                            <span className="border border-slate-200 bg-white px-3 py-1.5 rounded-lg text-xs font-semibold text-slate-600 flex items-center gap-1.5 cursor-default shadow-sm">
                                📅 Today
                            </span>
                            <div className="flex items-center gap-2 text-sm text-slate-600">
                                <span className="font-medium text-slate-500 whitespace-nowrap">Search:</span>
                                <div className="relative">
                                    <input
                                        type="text"
                                        value={search}
                                        onChange={e => { setSearch(e.target.value); setPage(1); }}
                                        className="border border-slate-200 rounded-lg pl-3 pr-8 py-1.5 text-sm w-52 focus:outline-none focus:ring-2 focus:ring-slate-200 shadow-sm bg-white placeholder-slate-400"
                                    />
                                    {search && (
                                        <button onClick={() => { setSearch(''); setPage(1); }} className="absolute right-2.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 text-xs">✕</button>
                                    )}
                                </div>
                            </div>
                        </div>

                    </div>

                    {/* ── Table ── */}
                    <div style={{ overflowX: "auto" }}>
                        <table style={{ width: "100%", borderCollapse: "collapse", fontSize: 13 }}>
                            <thead>
                                <tr style={{ background: "#111827", borderBottom: "2px solid #e2e8f0" }}>
                                    <th onClick={() => requestSort('tracking_no')} className="py-3 px-4 text-left text-xs font-bold text-slate-300 uppercase tracking-wider cursor-pointer hover:bg-slate-800 transition-colors select-none border-r border-slate-700">
                                        <div className="flex items-center gap-1">Tracking No. {renderSortArrows('tracking_no')}</div>
                                    </th>
                                    <th onClick={() => requestSort('name')} className="py-3 px-4 text-left text-xs font-bold text-slate-300 uppercase tracking-wider cursor-pointer hover:bg-slate-800 transition-colors select-none border-r border-slate-700">
                                        <div className="flex items-center gap-1">Applicant {renderSortArrows('name')}</div>
                                    </th>
                                    <th className="py-3 px-4 text-left text-xs font-bold text-slate-400 uppercase tracking-wider select-none border-r border-slate-700">Criminal Record Match</th>
                                    <th className="py-3 px-4 text-left text-xs font-bold text-slate-400 uppercase tracking-wider select-none border-r border-slate-700">Crime Details</th>
                                    <th className="py-3 px-4 text-left text-xs font-bold text-slate-400 uppercase tracking-wider select-none border-r border-slate-700">Resolution</th>
                                    <th onClick={() => requestSort('created_at')} className="py-3 px-4 text-left text-xs font-bold text-slate-300 uppercase tracking-wider cursor-pointer hover:bg-slate-800 transition-colors select-none border-r border-slate-700">
                                        <div className="flex items-center gap-1">Flagged On {renderSortArrows('created_at')}</div>
                                    </th>
                                    <th className="py-3 px-4 text-left text-xs font-bold text-slate-400 uppercase tracking-wider select-none">Action</th>
                                </tr>
                            </thead>
                            <tbody>
                                {currentRecords.length === 0 ? (
                                    <tr>
                                        <td colSpan={7} style={{ padding: "48px 20px", textAlign: "center", color: "#94a3b8", fontSize: 14 }}>
                                            No HIT cases found.
                                        </td>
                                    </tr>
                                ) : currentRecords.map((c, i) => (
                                    <tr
                                        key={c.id}
                                        onClick={() => setSelected(c)}
                                        style={{ background: i % 2 === 0 ? "#fff" : "#fafafa", borderBottom: "1px solid #f1f5f9", cursor: "pointer" }}
                                        onMouseEnter={e => e.currentTarget.style.background = "#fff5f5"}
                                        onMouseLeave={e => e.currentTarget.style.background = i % 2 === 0 ? "#fff" : "#fafafa"}
                                    >
                                        <td style={{ padding: "12px 14px", fontWeight: 700, color: "#dc2626", fontFamily: "monospace", fontSize: 12 }}>{c.tracking_no}</td>
                                        <td style={{ padding: "12px 14px" }}>
                                            <div style={{ fontWeight: 700, color: "#0f172a" }}>{fullName(c)}</div>
                                            <div style={{ fontSize: 11, color: "#94a3b8", marginTop: 2 }}>{c.purpose || "—"}</div>
                                        </td>
                                        <td style={{ padding: "12px 14px" }}>
                                            {c.matched_record ? (
                                                <span style={{ display: "inline-flex", alignItems: "center", gap: 5, padding: "3px 10px", borderRadius: 20, fontSize: 11, fontWeight: 700, background: "#fee2e2", color: "#b91c1c", border: "1.5px solid #fca5a5" }}>● Match Found</span>
                                            ) : (
                                                <span style={{ display: "inline-flex", alignItems: "center", gap: 5, padding: "3px 10px", borderRadius: 20, fontSize: 11, fontWeight: 700, background: "#f1f5f9", color: "#64748b", border: "1.5px solid #cbd5e1" }}>○ No Match</span>
                                            )}
                                        </td>
                                        <td style={{ padding: "12px 14px", color: "#64748b", maxWidth: 180 }}>
                                            <div style={{ overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{c.matched_record?.crime_details || "—"}</div>
                                        </td>
                                        <td style={{ padding: "12px 14px" }}><ResolutionBadge resolution={c.hit_resolution} /></td>
                                        <td style={{ padding: "12px 14px", color: "#64748b", whiteSpace: "nowrap", fontSize: 12 }}>{fmtDate(c.reviewed_at || c.created_at)}</td>
                                        <td style={{ padding: "12px 14px" }}>
                                            <button
                                                onClick={e => { e.stopPropagation(); setSelected(c); }}
                                                style={{ padding: "5px 12px", borderRadius: 6, background: "#fef2f2", color: "#dc2626", border: "1px solid #fecaca", fontSize: 12, fontWeight: 700, cursor: "pointer" }}
                                            >
                                                Review
                                            </button>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>

                    {/* ── Pagination ── */}
                    <div className="px-5 py-3.5 border-t border-slate-100 bg-slate-50 flex flex-wrap items-center justify-between gap-3">
                        <div className="text-xs text-slate-500 font-medium">
                            Showing records <span className="font-bold text-slate-800">{showingFrom}</span> to <span className="font-bold text-slate-800">{showingTo}</span> of total <span className="font-bold text-slate-800">{totalEntries}</span> entries
                        </div>
                        {totalPages > 1 && (
                            <div className="flex gap-1.5">
                                <button
                                    onClick={() => setPage(p => Math.max(1, p - 1))}
                                    disabled={page === 1}
                                    className={`px-3 py-1.5 rounded-lg text-xs font-semibold border transition-all ${page === 1 ? 'bg-slate-50 text-slate-300 border-slate-100 cursor-not-allowed' : 'bg-white text-slate-700 border-slate-200 hover:border-slate-400'}`}
                                >
                                    Previous
                                </button>
                                {Array.from({ length: totalPages }, (_, i) => (
                                    <button
                                        key={i + 1}
                                        onClick={() => setPage(i + 1)}
                                        className={`px-3 py-1.5 rounded-lg text-xs font-semibold border transition-all ${(i + 1) === page ? 'bg-slate-900 text-white border-slate-900' : 'bg-white text-slate-700 border-slate-200 hover:border-slate-400'}`}
                                    >
                                        {i + 1}
                                    </button>
                                ))}
                                <button
                                    onClick={() => setPage(p => Math.min(totalPages, p + 1))}
                                    disabled={page === totalPages}
                                    className={`px-3 py-1.5 rounded-lg text-xs font-semibold border transition-all ${page === totalPages ? 'bg-slate-50 text-slate-300 border-slate-100 cursor-not-allowed' : 'bg-white text-slate-700 border-slate-200 hover:border-slate-400'}`}
                                >
                                    Next
                                </button>
                            </div>
                        )}
                    </div>

                </div>
            </div>

            {selected && <DetailPanel item={selected} onClose={() => setSelected(null)} />}
        </AuthenticatedLayout>
    );
}
