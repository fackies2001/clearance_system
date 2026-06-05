import { useState, useMemo, useEffect } from "react";
import { Head, router, usePage, Link } from "@inertiajs/react";
import AuthenticatedLayout from "@/Layouts/AuthenticatedLayout";

// ── Status Config ────────────────────────────────────────────────────────────
const WORKFLOW_STEPS = [
    { key: "pending",             label: "Pending",             short: "PENDING" },
    { key: "under_review",        label: "Under Review",        short: "REVIEW" },
    { key: "biometrics_captured", label: "Biometrics Captured", short: "BIO" },
    { key: "approved",            label: "Approved",            short: "APPROVED" },
    { key: "released",            label: "Released",            short: "RELEASED" },
];

const BRANCH_STATUSES = ["rejected", "hit"];

const STATUS_META = {
    pending:             { color: "#64748b", bg: "#f1f5f9", border: "#cbd5e1", label: "Pending" },
    under_review:        { color: "#0369a1", bg: "#e0f2fe", border: "#7dd3fc", label: "Under Review" },
    biometrics_captured: { color: "#7c3aed", bg: "#ede9fe", border: "#c4b5fd", label: "Biometrics" },
    approved:            { color: "#15803d", bg: "#dcfce7", border: "#86efac", label: "Approved" },
    released:            { color: "#065f46", bg: "#d1fae5", border: "#6ee7b7", label: "Released" },
    rejected:            { color: "#b91c1c", bg: "#fee2e2", border: "#fca5a5", label: "Rejected" },
    hit:                 { color: "#92400e", bg: "#fef3c7", border: "#fcd34d", label: "HIT" },
};

const ALLOWED_TRANSITIONS = {
    pending:             ["under_review", "rejected"],
    under_review:        ["biometrics_captured", "rejected", "hit"],
    biometrics_captured: ["approved", "rejected", "hit"],
    approved:            ["released"],
    hit:                 ["under_review", "rejected"],
    released:            [],
    rejected:            [],
};

const TRANSITION_LABELS = {
    under_review:        "Start Review",
    biometrics_captured: "Mark Biometrics Done",
    approved:            "Approve",
    released:            "Release Clearance",
    rejected:            "Reject",
    hit:                 "Flag as HIT",
};

// ── Helpers ──────────────────────────────────────────────────────────────────
function fmtDate(d) {
    if (!d) return "—";
    return new Date(d).toLocaleDateString("en-PH", {
        year: "numeric", month: "short", day: "numeric",
        hour: "2-digit", minute: "2-digit",
    });
}

function fmtDateShort(d) {
    if (!d) return "—";
    return new Date(d).toLocaleDateString("en-PH", {
        month: "short", day: "numeric", year: "numeric"
    });
}

function fullName(c) {
    return [c.first_name, c.middle_name, c.last_name].filter(Boolean).join(" ");
}

function getStepIndex(status) {
    return WORKFLOW_STEPS.findIndex(s => s.key === status);
}

// ── Sub-components ───────────────────────────────────────────────────────────

function StatusBadge({ status }) {
    const meta = STATUS_META[status] || STATUS_META.pending;
    return (
        <span style={{
            display: "inline-flex", alignItems: "center", gap: 5,
            padding: "3px 10px", borderRadius: 20,
            fontSize: 11, fontWeight: 700, letterSpacing: "0.05em",
            color: meta.color, background: meta.bg,
            border: `1.5px solid ${meta.border}`,
            textTransform: "uppercase",
        }}>
            <span style={{
                width: 6, height: 6, borderRadius: "50%",
                background: meta.color, flexShrink: 0,
            }} />
            {meta.label}
        </span>
    );
}

function MiniTimeline({ status }) {
    const currentIdx = getStepIndex(status);
    const isTerminal = status === "released" || status === "rejected";
    const isHit = status === "hit";

    return (
        <div style={{ display: "flex", alignItems: "center", gap: 0 }}>
            {WORKFLOW_STEPS.map((step, i) => {
                const done = currentIdx > i;
                const active = currentIdx === i && !isHit && !isTerminal && status !== "rejected";
                return (
                    <div key={step.key} style={{ display: "flex", alignItems: "center" }}>
                        <div style={{
                            width: 8, height: 8, borderRadius: "50%",
                            background: done ? "#1d4ed8" : active ? "#1d4ed8" : "#e2e8f0",
                            border: active ? "2px solid #93c5fd" : "none",
                            transition: "all 0.2s",
                        }} />
                        {i < WORKFLOW_STEPS.length - 1 && (
                            <div style={{
                                width: 16, height: 2,
                                background: done ? "#1d4ed8" : "#e2e8f0",
                            }} />
                        )}
                    </div>
                );
            })}
        </div>
    );
}

function StatCard({ label, value, color, onClick, active }) {
    return (
        <button onClick={onClick} style={{
            background: active ? color + "15" : "#fff",
            border: `2px solid ${active ? color : "#e2e8f0"}`,
            borderRadius: 10, padding: "14px 18px",
            cursor: "pointer", textAlign: "left",
            transition: "all 0.15s", minWidth: 110,
            boxShadow: active ? `0 0 0 3px ${color}25` : "none",
        }}>
            <div style={{ fontSize: 26, fontWeight: 800, color, lineHeight: 1 }}>{value}</div>
            <div style={{ fontSize: 11, color: "#64748b", marginTop: 3, fontWeight: 600, textTransform: "uppercase", letterSpacing: "0.06em" }}>{label}</div>
        </button>
    );
}

// ── Side Panel ───────────────────────────────────────────────────────────────

function DetailPanel({ clearance, onClose, onSuccess }) {
    const [newStatus, setNewStatus] = useState("");
    const [remarks, setRemarks] = useState(clearance.admin_remarks || "");
    const [hitRes, setHitRes] = useState(clearance.hit_resolution || "confirmed");
    const [hitNotes, setHitNotes] = useState(clearance.hit_notes || "");
    const [submitting, setSubmitting] = useState(false);
    const [errors, setErrors] = useState({});

    const currentStatus = clearance.workflow_status ?? "pending";
    const allowed = ALLOWED_TRANSITIONS[currentStatus] ?? [];
    const stepIdx = getStepIndex(currentStatus);

    function handleSubmit() {
        if (!newStatus) return;
        setSubmitting(true);
        setErrors({});

        router.patch(
            route("admin.clearance.update-status", clearance.id),
            {
                workflow_status: newStatus,
                admin_remarks: remarks || null,
                hit_resolution: newStatus === "hit" ? hitRes : null,
                hit_notes: newStatus === "hit" ? hitNotes : null,
            },
            {
                preserveScroll: true,
                onSuccess: () => { setSubmitting(false); onSuccess?.(); onClose(); },
                onError: (e) => { setSubmitting(false); setErrors(e); },
            }
        );
    }

    return (
        <div style={{
            position: "fixed", inset: 0, zIndex: 50,
            display: "flex", alignItems: "flex-start", justifyContent: "flex-end",
        }}>
            {/* Overlay */}
            <div onClick={onClose} style={{
                position: "absolute", inset: 0,
                background: "rgba(15,23,42,0.45)", backdropFilter: "blur(2px)",
            }} />

            {/* Panel */}
            <div style={{
                position: "relative", zIndex: 10,
                width: "100%", maxWidth: 520,
                height: "100dvh", overflowY: "auto",
                background: "#fff",
                boxShadow: "-8px 0 40px rgba(0,0,0,0.15)",
                display: "flex", flexDirection: "column",
            }}>
                {/* Header */}
                <div style={{
                    padding: "20px 24px 16px",
                    borderBottom: "1px solid #e2e8f0",
                    background: "#f8fafc",
                    position: "sticky", top: 0, zIndex: 5,
                }}>
                    <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start" }}>
                        <div>
                            <div style={{ fontSize: 11, color: "#94a3b8", fontWeight: 700, letterSpacing: "0.1em", textTransform: "uppercase", marginBottom: 2 }}>
                                Tracking No.
                            </div>
                            <div style={{ fontSize: 18, fontWeight: 800, color: "#0f172a", letterSpacing: "0.02em" }}>
                                {clearance.tracking_no}
                            </div>
                        </div>
                        <button onClick={onClose} style={{
                            width: 32, height: 32, borderRadius: 8,
                            border: "1px solid #e2e8f0", background: "#fff",
                            cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center",
                            color: "#64748b", fontSize: 18, lineHeight: 1,
                        }}>×</button>
                    </div>
                    <div style={{ marginTop: 10 }}>
                        <StatusBadge status={currentStatus} />
                    </div>
                </div>

                <div style={{ padding: "20px 24px", flex: 1 }}>
                    {/* Applicant Info */}
                    <Section title="Applicant Information">
                        <InfoRow label="Full Name" value={fullName(clearance)} />
                        <InfoRow label="Purpose" value={clearance.purpose} />
                        <InfoRow label="Filed" value={fmtDate(clearance.created_at)} />

                        <InfoRow label="Biometrics" value={
                            <span style={{
                                fontSize: 11, fontWeight: 700, padding: "2px 8px", borderRadius: 20,
                                background: clearance.fingerprint_status === 'COMPLETED' ? "#dcfce7" : "#f1f5f9",
                                color: clearance.fingerprint_status === 'COMPLETED' ? "#15803d" : "#64748b",
                                border: `1px solid ${clearance.fingerprint_status === 'COMPLETED' ? "#86efac" : "#cbd5e1"}`,
                            }}>
                                {clearance.fingerprint_status === 'COMPLETED' ? "✓ Captured" : "Not Yet"}
                            </span>
                        } />

                        <InfoRow label="Fingerprint Status" value={
                            <span style={{ fontWeight: 600, color: "#374151" }}>
                                {clearance.fingerprint_status || "PENDING"}
                            </span>
                        } />
                        <InfoRow label="Payment Status" value={
                            <div className="flex items-center gap-2">
                                <span style={{
                                    fontSize: 11, fontWeight: 700, padding: "2px 8px", borderRadius: 20,
                                    background: clearance.payment_status === 'paid' ? "#dcfce7" : "#fef3c7",
                                    color: clearance.payment_status === 'paid' ? "#15803d" : "#92400e",
                                    border: `1px solid ${clearance.payment_status === 'paid' ? "#86efac" : "#fcd34d"}`,
                                }}>
                                    {clearance.payment_status?.toUpperCase() || "UNPAID"}
                                </span>
                                {clearance.payment_status !== 'paid' && (
                                    <button 
                                        onClick={() => {
                                            if(confirm("Mark this application as PAID?")) {
                                                router.post(route('admin.clearance.mark-paid', clearance.id));
                                            }
                                        }}
                                        style={{ fontSize: 10, color: "#1d4ed8", fontWeight: 700, border: "none", background: "none", cursor: "pointer", textDecoration: "underline" }}
                                    >
                                        Confirm Payment
                                    </button>
                                )}
                            </div>
                        } />
                        {clearance.clearance_number && (
                            <InfoRow label="Clearance No." value={<span className="font-mono text-blue-600">{clearance.clearance_number}</span>} />
                        )}
                    </Section>

                    {/* Workflow Timeline */}
                    <Section title="Workflow Progress">
                        <div style={{ padding: "4px 0 8px" }}>
                            {WORKFLOW_STEPS.map((step, i) => {
                                const done = stepIdx > i;
                                const active = stepIdx === i && !BRANCH_STATUSES.includes(currentStatus);
                                return (
                                    <div key={step.key} style={{ display: "flex", gap: 14, marginBottom: 0 }}>
                                        <div style={{ display: "flex", flexDirection: "column", alignItems: "center" }}>
                                            <div style={{
                                                width: 28, height: 28, borderRadius: "50%", flexShrink: 0,
                                                display: "flex", alignItems: "center", justifyContent: "center",
                                                fontSize: 12, fontWeight: 800,
                                                background: done ? "#1d4ed8" : active ? "#eff6ff" : "#f1f5f9",
                                                border: done ? "none" : active ? "2px solid #1d4ed8" : "2px solid #e2e8f0",
                                                color: done ? "#fff" : active ? "#1d4ed8" : "#94a3b8",
                                            }}>
                                                {done ? "✓" : i + 1}
                                            </div>
                                            {i < WORKFLOW_STEPS.length - 1 && (
                                                <div style={{
                                                    width: 2, height: 28,
                                                    background: done ? "#1d4ed8" : "#e2e8f0",
                                                }} />
                                            )}
                                        </div>
                                        <div style={{ paddingBottom: i < WORKFLOW_STEPS.length - 1 ? 10 : 0, paddingTop: 4 }}>
                                            <div style={{
                                                fontSize: 13, fontWeight: active ? 700 : 600,
                                                color: done ? "#1d4ed8" : active ? "#0f172a" : "#94a3b8",
                                            }}>
                                                {step.label}
                                            </div>
                                        </div>
                                    </div>
                                );
                            })}

                            {/* Branch statuses */}
                            {(currentStatus === "hit" || currentStatus === "rejected") && (
                                <div style={{
                                    marginTop: 8, padding: "10px 14px", borderRadius: 8,
                                    background: currentStatus === "hit" ? "#fef3c7" : "#fee2e2",
                                    border: `1px solid ${currentStatus === "hit" ? "#fcd34d" : "#fca5a5"}`,
                                }}>
                                    <div style={{
                                        fontSize: 13, fontWeight: 700,
                                        color: currentStatus === "hit" ? "#92400e" : "#b91c1c",
                                    }}>
                                        {currentStatus === "hit" ? "⚠ HIT Flagged" : "✗ Rejected"}
                                    </div>
                                    {clearance.hit_notes && (
                                        <div style={{ fontSize: 12, color: "#6b7280", marginTop: 4 }}>{clearance.hit_notes}</div>
                                    )}
                                </div>
                            )}
                        </div>
                    </Section>

                    {/* Reviewer Info */}
                    {clearance.reviewed_by_name && (
                        <Section title="Last Review">
                            <InfoRow label="Reviewed By" value={clearance.reviewed_by_name} />
                            <InfoRow label="Reviewed At" value={fmtDate(clearance.reviewed_at)} />
                            {clearance.admin_remarks && (
                                <div style={{ marginTop: 8, padding: "10px 12px", background: "#f8fafc", borderRadius: 8, border: "1px solid #e2e8f0" }}>
                                    <div style={{ fontSize: 11, color: "#64748b", fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.06em", marginBottom: 4 }}>Remarks</div>
                                    <div style={{ fontSize: 13, color: "#374151" }}>{clearance.admin_remarks}</div>
                                </div>
                            )}
                        </Section>
                    )}

                    {/* Action Form */}
                    {allowed.length > 0 && (
                        <Section title="Update Status">
                            {errors.workflow_status && (
                                <div style={{
                                    padding: "8px 12px", background: "#fee2e2", border: "1px solid #fca5a5",
                                    borderRadius: 8, color: "#b91c1c", fontSize: 13, marginBottom: 12,
                                }}>
                                    {errors.workflow_status}
                                </div>
                            )}

                            <div style={{ display: "flex", flexWrap: "wrap", gap: 8, marginBottom: 12 }}>
                                {allowed.map(s => {
                                    const meta = STATUS_META[s];
                                    const selected = newStatus === s;
                                    return (
                                        <button key={s} onClick={() => setNewStatus(s)} style={{
                                            padding: "6px 14px", borderRadius: 8, cursor: "pointer",
                                            fontSize: 12, fontWeight: 700,
                                            background: selected ? meta.color : meta.bg,
                                            color: selected ? "#fff" : meta.color,
                                            border: `1.5px solid ${selected ? meta.color : meta.border}`,
                                            transition: "all 0.15s",
                                        }}>
                                            {TRANSITION_LABELS[s] || s}
                                        </button>
                                    );
                                })}
                            </div>

                            {/* HIT-specific fields */}
                            {newStatus === "hit" && (
                                <div style={{ marginBottom: 12 }}>
                                    <label style={labelStyle}>HIT Resolution</label>
                                    <select value={hitRes} onChange={e => setHitRes(e.target.value)} style={inputStyle}>
                                        <option value="confirmed">Confirmed HIT</option>
                                        <option value="overridden">Override (False Positive)</option>
                                    </select>
                                    <label style={{ ...labelStyle, marginTop: 10 }}>HIT Notes</label>
                                    <textarea
                                        rows={3}
                                        value={hitNotes}
                                        onChange={e => setHitNotes(e.target.value)}
                                        placeholder="Describe the hit or reason for override..."
                                        style={{ ...inputStyle, resize: "vertical" }}
                                    />
                                </div>
                            )}

                            <label style={labelStyle}>Admin Remarks (optional)</label>
                            <textarea
                                rows={3}
                                value={remarks}
                                onChange={e => setRemarks(e.target.value)}
                                placeholder="Add remarks for this status change..."
                                style={{ ...inputStyle, resize: "vertical", marginBottom: 14 }}
                            />

                            <button
                                onClick={handleSubmit}
                                disabled={!newStatus || submitting}
                                style={{
                                    width: "100%", padding: "11px", borderRadius: 8,
                                    background: newStatus ? "#1d4ed8" : "#e2e8f0",
                                    color: newStatus ? "#fff" : "#94a3b8",
                                    border: "none", cursor: newStatus ? "pointer" : "not-allowed",
                                    fontSize: 14, fontWeight: 700, transition: "all 0.15s",
                                    opacity: submitting ? 0.6 : 1,
                                }}
                            >
                                {submitting ? "Updating…" : newStatus ? `Confirm: ${TRANSITION_LABELS[newStatus] || newStatus}` : "Select an action above"}
                            </button>
                        </Section>
                    )}

                    {allowed.length === 0 && (
                        <div style={{
                            padding: "12px 16px", borderRadius: 8,
                            background: "#f8fafc", border: "1px solid #e2e8f0",
                            color: "#64748b", fontSize: 13, textAlign: "center",
                            fontWeight: 600,
                        }}>
                            Terminal status — no further actions available.
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}

function Section({ title, children }) {
    return (
        <div style={{ marginBottom: 22 }}>
            <div style={{
                fontSize: 10, fontWeight: 800, letterSpacing: "0.12em",
                textTransform: "uppercase", color: "#94a3b8",
                marginBottom: 10, paddingBottom: 6,
                borderBottom: "1px solid #f1f5f9",
            }}>
                {title}
            </div>
            {children}
        </div>
    );
}

function InfoRow({ label, value }) {
    return (
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 8 }}>
            <span style={{ fontSize: 12, color: "#94a3b8", fontWeight: 600 }}>{label}</span>
            <span style={{ fontSize: 13, color: "#1e293b", fontWeight: 600, maxWidth: "65%", textAlign: "right" }}>{value}</span>
        </div>
    );
}

const labelStyle = {
    display: "block", fontSize: 11, fontWeight: 700,
    color: "#64748b", textTransform: "uppercase",
    letterSpacing: "0.06em", marginBottom: 5,
};
const inputStyle = {
    width: "100%", padding: "9px 12px", borderRadius: 8,
    border: "1.5px solid #e2e8f0", fontSize: 13, color: "#1e293b",
    background: "#f8fafc", outline: "none",
    boxSizing: "border-box",
};

// ── Main Page ────────────────────────────────────────────────────────────────

export default function ClearanceProcessing({ clearances = {}, stats = {}, filters = {} }) {
    const { flash } = usePage().props;

    const dataRows = clearances.data || [];

    const [selected, setSelected]   = useState(null);
    const [searchTerm, setSearchTerm] = useState(filters.search || '');
    const [isDropdownOpen, setIsDropdownOpen] = useState(false);

    const updateFilters = (newParams) => {
        const mergedParams = {
            search: searchTerm,
            status: filters.status || '',
            range: filters.range || 'today',
            per_page: filters.per_page || 10,
            sort_field: filters.sort_field || 'created_at',
            sort_order: filters.sort_order || 'desc',
            ...newParams
        };

        router.get(route('admin.clearance.index'), mergedParams, {
            preserveState: true,
            preserveScroll: true,
            replace: true
        });
    };

    useEffect(() => {
        const delayDebounce = setTimeout(() => {
            if (searchTerm !== (filters.search || '')) {
                updateFilters({ search: searchTerm });
            }
        }, 400);
        return () => clearTimeout(delayDebounce);
    }, [searchTerm]);

    const handleSort = (field) => {
        const isAsc = filters.sort_field === field && filters.sort_order === 'asc';
        updateFilters({
            sort_field: field,
            sort_order: isAsc ? 'desc' : 'asc'
        });
    };

    const STAT_FILTERS = [
    { key: "all",                 label: "Total",       value: stats.total,               color: "#0f172a", icon: "📋" },
    { key: "pending",             label: "Pending",     value: stats.pending,             color: "#64748b", icon: "⏳" },
    { key: "under_review",        label: "In Review",   value: stats.under_review,        color: "#0369a1", icon: "🔍" },
    { key: "biometrics_captured", label: "Bio Done",    value: stats.biometrics_captured, color: "#7c3aed", icon: "👆" },
    { key: "approved",            label: "Approved",    value: stats.approved,            color: "#15803d", icon: "✅" },
    { key: "released",            label: "Released",    value: stats.released,            color: "#065f46", icon: "🎉" },
    { key: "hit",                 label: "HIT",         value: stats.hit,                 color: "#d97706", icon: "⚠️" },
    { key: "rejected",            label: "Rejected",    value: stats.rejected,            color: "#dc2626", icon: "❌" },
];

    const renderSortArrow = (field) => {

    const active = filters.sort_field === field;
    const asc = filters.sort_order === 'asc';
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
                <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
                    <div style={{
                        width: 36, height: 36, borderRadius: 10,
                        background: "#1d4ed8", display: "flex",
                        alignItems: "center", justifyContent: "center",
                    }}>
                        <span style={{ fontSize: 18 }}>🗂</span>
                    </div>
                    <div>
                        <h2 style={{ margin: 0, fontSize: 20, fontWeight: 800, color: "#0f172a" }}>
                            Clearance Processing
                        </h2>
                        <p style={{ margin: 0, fontSize: 12, color: "#64748b" }}>
                            NBI Clearance Application Workflow
                        </p>
                    </div>
                </div>
            }
        >
            <Head title="Clearance Processing" />

            <div style={{ padding: "24px 28px", fontFamily: "'DM Sans', system-ui, sans-serif" }}>

                {/* Flash message */}
                {flash?.success && (
                    <div style={{
                        padding: "12px 16px", background: "#dcfce7",
                        border: "1px solid #86efac", borderRadius: 10,
                        color: "#15803d", fontSize: 13, fontWeight: 600,
                        marginBottom: 20, display: "flex", alignItems: "center", gap: 8,
                    }}>
                        <span>✓</span> {flash.success}
                    </div>
                )}

                {/* Stat Cards */}
                <div style={{ display: "flex", gap: 10, flexWrap: "wrap", marginBottom: 24 }}>
                    {STAT_FILTERS.map(sf => (
                        <div
                            key={sf.key}
                            onClick={() => updateFilters({ status: sf.key === 'all' ? '' : sf.key })}
                          style={{
                                background: (filters.status === sf.key || (sf.key === 'all' && !filters.status)) ? sf.color + '12' : '#fff',
                                borderTop: '1.5px solid ' + ((filters.status === sf.key || (sf.key === 'all' && !filters.status)) ? sf.color : '#e2e8f0'),
                                borderRight: '1.5px solid ' + ((filters.status === sf.key || (sf.key === 'all' && !filters.status)) ? sf.color : '#e2e8f0'),
                                borderBottom: '1.5px solid ' + ((filters.status === sf.key || (sf.key === 'all' && !filters.status)) ? sf.color : '#e2e8f0'),
                                borderLeft: `4px solid ${sf.color}`,
                                borderRadius: 14,
                                padding: '16px 20px',
                                cursor: 'pointer',
                                flex: '1 1 120px',
                                maxWidth: 'calc(12.5% - 10px)',
                                display: 'flex',
                                justifyContent: 'space-between',
                                alignItems: 'flex-start',
                                transition: 'all 0.15s',
                                boxShadow: (filters.status === sf.key || (sf.key === 'all' && !filters.status)) ? `0 0 0 3px ${sf.color}20` : 'none',
                           }}
        
                        >
                            <div>
                                <div style={{ fontSize: 10, color: '#94a3b8', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.08em', marginBottom: 6 }}>
                                    {sf.label}
                                </div>
                                <div style={{ fontSize: 28, fontWeight: 800, color: sf.color, lineHeight: 1 }}>
                                    {sf.value}
                                </div>
                            </div>
                            <div style={{ fontSize: 22, opacity: 0.45 }}>{sf.icon}</div>
                        </div>
                    ))}
                </div>

                    {/* Search + Table */}
                    <div style={{
                        background: "#fff", borderRadius: 14,
                        border: "1px solid #e2e8f0",
                        boxShadow: "0 1px 4px rgba(0,0,0,0.05)",
                        overflow: "hidden",
                        padding: "24px"
                    }}>
                    
                        {/* Table toolbar */}
                        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 text-sm text-slate-700 mb-5">
                            
                            <div className="flex items-center gap-2">
                                <span className="text-sm font-medium text-slate-500">Show</span>
                                    <div className="relative">
                                        <select
                                            value={filters.per_page || 10}
                                            onChange={e => updateFilters({ per_page: e.target.value })}
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

                            <div className="hidden sm:block h-5 w-px bg-slate-200" />

                            <div className="flex items-center gap-2">
                                <span className="text-sm font-medium text-slate-500">Status:</span>
                                    <div className="relative">
                                    <select
                                        value={filters.status || ''}
                                        onChange={e => updateFilters({ status: e.target.value })}
                                        className="appearance-none border border-slate-200 rounded-lg pl-3 pr-8 py-1.5 text-sm bg-white text-slate-700 font-semibold focus:outline-none focus:ring-2 focus:ring-slate-200 cursor-pointer shadow-sm min-w-[130px]"
                                    >
                                        <option value="">All Status</option>
                                        <option value="pending">Pending</option>
                                        <option value="under_review">Under Review</option>
                                        <option value="biometrics_captured">Biometrics Captured</option>
                                        <option value="approved">Approved</option>
                                        <option value="released">Released</option>
                                        <option value="hit">HIT</option>
                                        <option value="rejected">Rejected</option>
                                    </select>
                                    <svg className="pointer-events-none absolute right-2.5 top-1/2 -translate-y-1/2 w-3 h-3 text-slate-400" viewBox="0 0 12 12" fill="none" stroke="currentColor">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 4.5l3 3 3-3"/>
                                    </svg>
                                </div>
                            </div>

                        <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3 w-full md:w-auto justify-end">
                            
                            <div className="relative">
                                <button 
                                    onClick={() => setIsDropdownOpen(!isDropdownOpen)}
                                    className="w-full border border-gray-300 bg-white rounded px-3 py-1.5 text-sm font-semibold text-slate-700 flex items-center justify-between gap-2 shadow-sm transition-all focus:outline-none"
                                >
                                    <span className="flex items-center gap-1.5">
                                        <span>📅</span>
                                        <span>
                                            {
                                                filters.range === 'today' ? 'Today' :
                                                filters.range === 'yesterday' ? 'Yesterday' :
                                                filters.range === 'last_7_days' ? 'Last 7 Days' :
                                                filters.range === 'last_month' ? 'Last Month' :
                                                filters.range === 'last_year' ? 'Last Year' : 
                                                filters.range === 'all_time' ? 'All-Time Records' : 
                                                (filters.range && typeof filters.range === 'string' && filters.range.includes('-'))
                                                    ? `Custom: ${filters.range.split('-').reverse().join('/')}`
                                                    : `Custom: ${filters.range || 'Today'}`
                                            }
                                        </span>
                                    </span>
                                    <span className="text-[10px] text-slate-400">▼</span>
                                </button>

                                {isDropdownOpen && (
                                    <div className="absolute right-0 mt-1 bg-white border border-slate-200 shadow-2xl rounded-xl p-1.5 z-50 flex flex-col gap-0.5" style={{ minWidth: 200 }}>
                                            {[
                                            { key: 'today',       label: 'Today'            },
                                            { key: 'yesterday',   label: 'Yesterday'        },
                                            { key: 'last_7_days', label: 'Last 7 Days'      },
                                            { key: 'last_month',  label: 'Last Month'       },
                                            { key: 'last_year',   label: 'Last Year'        },
                                            { key: 'all_time',    label: 'All-Time Records' },
                                            ].map((option) => {
                                            const isSelected = (filters.range || 'today') === option.key;
                                            return (
                                                <button key={option.key}
                                                    onClick={() => {
                                                        updateFilters({ range: option.key });
                                                        setIsDropdownOpen(false);
                                                    }}
                                                    className={`w-full px-3 py-2 rounded-lg text-left text-xs font-semibold border-none transition-all cursor-pointer ${
                                                        isSelected ? 'bg-slate-900 text-white' : 'text-slate-600 hover:bg-slate-50'
                                                    }`}
                                                >
                                                    {option.label}
                                                    {isSelected && <span className="ml-auto float-right opacity-70">✓</span>}
                                                </button>
                                            );
                                        })}
                                        <div className="h-px bg-slate-100 my-1 mx-1" />
                                        <div className="p-2 rounded-lg bg-slate-50 border border-slate-100 flex flex-col gap-1 m-0.5">
                                            <label className="text-[9px] font-black text-slate-400 uppercase tracking-wider">Custom Date</label>
                                            <input type="date"
                                                defaultValue={!['today', 'yesterday', 'last_7_days', 'last_month', 'last_year', 'all_time'].includes(filters.range) ? filters.range : ''}
                                                onChange={(e) => {
                                                    if(e.target.value) {
                                                        updateFilters({ range: e.target.value });
                                                        setIsDropdownOpen(false);
                                                    }
                                                }}
                                                className="w-full border border-gray-300 bg-white rounded px-2 py-0.5 text-xs text-slate-700 outline-none cursor-pointer focus:border-gray-500"
                                            />
                                        </div>
                                    </div>
                                )}
                            </div>

                            <div className="flex items-center gap-2">
                                <span>Search:</span>
                                <input 
                                    type="text" 
                                    value={searchTerm} 
                                    onChange={e => setSearchTerm(e.target.value)}
                                    className="border border-gray-300 rounded px-2.5 py-1.5 text-sm w-full sm:w-48 focus:outline-none focus:border-gray-500 shadow-sm bg-white" 
                                />
                            </div>
                        </div>
                    </div>

                    {/* Table */}
                    <div style={{ overflowX: "auto" }} className="border border-slate-200 rounded-xl shadow-sm">
                        <table style={{ width: "100%", borderCollapse: "collapse", fontSize: 13 }}>
                            <thead className="bg-slate-900 text-white text-[13px] tracking-wide select-none">
                                <tr>
                                    <th onClick={() => handleSort('tracking_no')} className="py-3 px-4 font-bold border-r border-slate-800 cursor-pointer hover:bg-slate-800 transition-colors select-none text-white text-left">
                                        <div className="flex items-center justify-between gap-1">
                                            <span>Tracking No.</span>
                                            {renderSortArrow('tracking_no')}
                                        </div>
                                    </th>
                                    <th onClick={() => handleSort('last_name')} className="py-3 px-4 font-bold border-r border-slate-800 cursor-pointer hover:bg-slate-800 transition-colors select-none text-white text-left">
                                        <div className="flex items-center justify-between gap-1">
                                            <span>Applicant</span>
                                            {renderSortArrow('last_name')}
                                        </div>
                                    </th>
                                    <th onClick={() => handleSort('purpose')} className="py-3 px-4 font-bold border-r border-slate-800 cursor-pointer hover:bg-slate-800 transition-colors select-none text-white text-left">
                                        <div className="flex items-center justify-between gap-1">
                                            <span>Purpose</span>
                                            {renderSortArrow('purpose')}
                                        </div>
                                    </th>
                                    <th onClick={() => handleSort('workflow_status')} className="py-3 px-4 font-bold border-r border-slate-800 cursor-pointer hover:bg-slate-800 transition-colors select-none text-white text-left">
                                        <div className="flex items-center justify-between gap-1">
                                            <span>Status</span>
                                            {renderSortArrow('workflow_status')}
                                        </div>
                                    </th>
                                    <th className="py-3 px-4 font-bold border-r border-slate-800 text-slate-200 select-none text-left">
                                        Progress
                                    </th>
                                    <th onClick={() => handleSort('created_at')} className="py-3 px-4 font-bold border-r border-slate-800 cursor-pointer hover:bg-slate-800 transition-colors select-none text-white text-left">
                                        <div className="flex items-center justify-between gap-1">
                                            <span>Filed</span>
                                            {renderSortArrow('created_at')}
                                        </div>
                                    </th>
                                    <th className="py-3 px-4 font-bold text-slate-200 select-none text-center">Action</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-slate-100 bg-white">
                                {dataRows.length === 0 ? (
                                    <tr>
                                        <td colSpan={7} style={{ padding: "40px 20px", textAlign: "center", color: "#94a3b8", fontSize: 14 }}>
                                            No clearance applications found under this timeframe block parameters.
                                        </td>
                                    </tr>
                                ) : dataRows.map((c, i) => (
                                    <tr
                                        key={c.id}
                                        onClick={() => setSelected(c)}
                                        className="hover:bg-slate-50/80 transition-colors cursor-pointer group"
                                        style={{ background: i % 2 === 0 ? "#fff" : "#fafafa" }}
                                    >
                                        <td style={{ padding: "12px 14px", fontWeight: 700, color: "#1d4ed8", fontFamily: "monospace", fontSize: 12 }}>
                                            {c.tracking_no}
                                        </td>
                                        <td style={{ padding: "12px 14px" }}>
                                            <div className="font-bold text-slate-800 group-hover:text-blue-600 transition-colors">{fullName(c)}</div>
                                            {c.fingerprint_status === 'COMPLETED' && (
                                                <div style={{ fontSize: 11, color: "#7c3aed", fontWeight: 600, marginTop: 2 }}>
                                                    ✓ Biometrics on file
                                                </div>
                                            )}
                                        </td>
                                        <td style={{ padding: "12px 14px", color: "#64748b", maxWidth: 160 }}>
                                            <div style={{ overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>
                                                {c.purpose || "—"}
                                            </div>
                                        </td>
                                        <td style={{ padding: "12px 14px" }}>
                                            <StatusBadge status={c.workflow_status} />
                                        </td>
                                        <td style={{ padding: "12px 14px" }}>
                                            <MiniTimeline status={c.workflow_status} />
                                        </td>
                                        <td style={{ padding: "12px 14px", color: "#64748b", whiteSpace: "nowrap" }}>
                                            {fmtDateShort(c.created_at)}
                                        </td>
                                        <td style={{ padding: "12px 14px", textAlign: "center" }} onClick={e => e.stopPropagation()}>
                                            <button
                                                onClick={() => setSelected(c)}
                                                style={{
                                                    padding: "5px 12px", borderRadius: 6,
                                                    background: "#eff6ff", color: "#1d4ed8",
                                                    border: "1px solid #bfdbfe",
                                                    fontSize: 12, fontWeight: 700, cursor: "pointer",
                                                }}
                                            >
                                                View
                                            </button>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>

                    {/* Pagination Links */}
                    <div className="flex flex-col sm:flex-row justify-between items-center gap-3 pt-4 text-xs font-medium text-slate-500 select-none">
                        <div>
                            Showing records <span className="text-slate-800 font-bold">{clearances.from || 0}</span> to <span className="text-slate-800 font-bold">{clearances.to || 0}</span> of total <span className="text-slate-800 font-bold">{clearances.total || 0}</span> entries
                        </div>
                        
                        {clearances.links && clearances.links.length > 3 && (
                            <div className="flex border border-gray-300 rounded bg-white overflow-hidden shadow-sm">
                                {clearances.links.map((link, idx) => {
                                    let cleanLabel = link.label;
                                    if (cleanLabel.includes('Previous')) cleanLabel = 'Previous';
                                    if (cleanLabel.includes('Next')) cleanLabel = 'Next';

                                    const isPageNumber = !isNaN(cleanLabel);

                                    return (
                                        <Link key={idx} href={link.url || '#'} disabled={!link.url}
                                            className={`px-3 py-1.5 border-r last:border-r-0 text-xs font-semibold flex items-center justify-center transition-all ${
                                                link.active 
                                                    ? 'bg-blue-600 text-white border-blue-600 font-bold' 
                                                    : !link.url 
                                                        ? 'bg-gray-50 text-gray-300 cursor-not-allowed' 
                                                        : 'bg-white text-gray-700 hover:bg-gray-100'
                                            }`}
                                            style={{ minWidth: isPageNumber ? "32px" : "auto" }}
                                        >
                                            {cleanLabel}
                                        </Link>
                                    );
                                })}
                            </div>
                        )}
                    </div>
                </div>
            </div>

            {/* Detail Panel */}
            {selected && (
                <DetailPanel
                    clearance={selected}
                    onClose={() => setSelected(null)}
                    onSuccess={() => setSelected(null)}
                />
            )}
        </AuthenticatedLayout>
    );
}