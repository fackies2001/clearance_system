import React, { useState } from 'react';
import { Head, router } from '@inertiajs/react';
import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';

export default function WalkinPayment({ auth, applicant, search, pendingApplicants = [] }) {
    const [trackingNo, setTrackingNo] = useState(search || '');
    const [processing, setProcessing] = useState(false);
    const [showConfirmModal, setShowConfirmModal] = useState(false);
    const [showSuccessModal, setShowSuccessModal] = useState(false);
    const [selectedApplicant, setSelectedApplicant] = useState(applicant || null);

    const handleSearch = () => {
        router.get(route('admin.walkin.search'), { tracking_no: trackingNo });
    };

    const handleSelectFromList = (item) => {
        setSelectedApplicant(item);
        window.scrollTo({ top: 0, behavior: 'smooth' });
    };

    const handleConfirmPayment = () => {
        setShowConfirmModal(false);
        setProcessing(true);
        router.post(route('admin.walkin.pay', selectedApplicant.id), {}, {
            onSuccess: () => {
                setProcessing(false);
                setShowSuccessModal(true);
            },
            onError: () => {
                setProcessing(false);
                alert('Something went wrong. Please try again.');
            },
        });
    };

    return (
        <AuthenticatedLayout
            user={auth.user}
            header={
                <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
                    <div style={{
                        width: 38, height: 38, borderRadius: 10,
                        background: "linear-gradient(135deg, #064e3b, #059669)",
                        display: "flex", alignItems: "center", justifyContent: "center",
                        fontSize: 18,
                    }}>💵</div>
                    <h2 style={{ margin: 0, fontSize: 20, fontWeight: 800, color: "#0f172a", letterSpacing: "-0.02em" }}>
                        Walk-in Payment Verification
                    </h2>
                </div>
            }
        >
            <Head title="Walk-in Payment" />

            <div style={{ padding: "24px 28px", fontFamily: "'DM Sans', system-ui, sans-serif" }}>
                <div style={{ maxWidth: 780, margin: "0 auto" }}>

                    {/* Search Section */}
                    <div style={{
                        background: "#fff", borderRadius: 16, padding: "24px 28px",
                        marginBottom: 20, border: "1px solid #f1f5f9",
                        boxShadow: "0 1px 4px rgba(0,0,0,0.04)"
                    }}>
                        <div style={{ fontSize: 11, fontWeight: 700, color: "#94a3b8", textTransform: "uppercase", letterSpacing: "0.07em", marginBottom: 14 }}>
                            Search Applicant
                        </div>
                        <div style={{ display: "flex", gap: 12 }}>
                            <input
                                type="text"
                                style={{
                                    flex: 1, padding: "10px 16px", borderRadius: 10,
                                    border: "1.5px solid #e2e8f0", fontSize: 14,
                                    fontWeight: 500, color: "#1e293b", outline: "none",
                                }}
                                placeholder="Enter NBI Tracking Number..."
                                value={trackingNo}
                                onChange={e => setTrackingNo(e.target.value)}
                                onKeyDown={e => e.key === 'Enter' && handleSearch()}
                                onFocus={e => e.target.style.borderColor = "#3b82f6"}
                                onBlur={e => e.target.style.borderColor = "#e2e8f0"}
                            />
                            <button
                                type="button"
                                onClick={handleSearch}
                                style={{
                                    padding: "10px 24px", borderRadius: 10,
                                    background: "#0f172a", color: "#fff", border: "none",
                                    fontSize: 14, fontWeight: 700, cursor: "pointer",
                                }}
                                onMouseEnter={e => e.currentTarget.style.background = "#334155"}
                                onMouseLeave={e => e.currentTarget.style.background = "#0f172a"}
                            >
                                Search
                            </button>
                        </div>
                    </div>

                    {/* Search Result */}
                    {selectedApplicant && (
                        <div style={{
                            background: "#fff", borderRadius: 16, padding: "28px",
                            border: "1px solid #f1f5f9", borderTop: "3px solid #3b82f6",
                            boxShadow: "0 1px 4px rgba(0,0,0,0.04)", marginBottom: 20,
                        }}>
                            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 28 }}>
                                <div>
                                    <span style={{
                                        fontSize: 10, fontWeight: 800, color: "#3b82f6",
                                        textTransform: "uppercase", letterSpacing: "0.08em",
                                        background: "#eff6ff", padding: "3px 10px", borderRadius: 20,
                                    }}>Application Found</span>
                                    <h2 style={{ margin: "10px 0 4px", fontSize: 26, fontWeight: 800, color: "#0f172a" }}>
                                        {selectedApplicant.first_name} {selectedApplicant.last_name}
                                    </h2>
                                    <p style={{ margin: 0, fontFamily: "monospace", fontSize: 13, color: "#64748b" }}>{selectedApplicant.tracking_no}</p>
                                </div>
                                <div style={{ textAlign: "right" }}>
                                    <p style={{ fontSize: 10, fontWeight: 700, color: "#94a3b8", textTransform: "uppercase", marginBottom: 6 }}>Payment Status</p>
                                    <span style={{
                                        display: "inline-block", padding: "4px 14px", borderRadius: 20,
                                        fontSize: 11, fontWeight: 800, textTransform: "uppercase",
                                        background: selectedApplicant.payment_status === 'paid' ? "#dcfce7" : "#fef3c7",
                                        color: selectedApplicant.payment_status === 'paid' ? "#15803d" : "#b45309",
                                        border: `1px solid ${selectedApplicant.payment_status === 'paid' ? "#bbf7d0" : "#fde68a"}`,
                                    }}>
                                        ● {selectedApplicant.payment_status}
                                    </span>
                                </div>
                            </div>

                            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 14, marginBottom: 28 }}>
                                <DetailBox label="Birth Date" value={selectedApplicant.date_of_birth} />
                                <DetailBox label="Address" value={`${selectedApplicant.present_street}, ${selectedApplicant.present_barangay}, ${selectedApplicant.present_city}`} />
                                <DetailBox label="Purpose" value={selectedApplicant.purpose} />
                                <DetailBox label="Amount Due" value="₱150.00" highlight />
                            </div>

                            {selectedApplicant.payment_status !== 'paid' ? (
                                <button
                                    onClick={() => setShowConfirmModal(true)}
                                    disabled={processing}
                                    style={{
                                        width: "100%", padding: "14px", borderRadius: 12,
                                        background: "#059669", color: "#fff", border: "none",
                                        fontSize: 15, fontWeight: 800, cursor: "pointer",
                                        display: "flex", alignItems: "center", justifyContent: "center", gap: 10,
                                    }}
                                    onMouseEnter={e => e.currentTarget.style.background = "#047857"}
                                    onMouseLeave={e => e.currentTarget.style.background = "#059669"}
                                >
                                    <svg style={{ width: 20, height: 20 }} fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M5 13l4 4L19 7" />
                                    </svg>
                                    Confirm Walk-in Payment
                                </button>
                            ) : (
                                <div style={{
                                    background: "#f8fafc", padding: "20px", borderRadius: 12,
                                    border: "1.5px dashed #e2e8f0", textAlign: "center",
                                }}>
                                    <p style={{ color: "#94a3b8", fontWeight: 600, margin: 0 }}>This application is already paid.</p>
                                </div>
                            )}
                        </div>
                    )}

                    {/* Pending Walk-in List */}
                    <div style={{
                        background: "#fff", borderRadius: 16, padding: "24px 28px",
                        border: "1px solid #f1f5f9",
                        boxShadow: "0 1px 4px rgba(0,0,0,0.04)"
                    }}>
                        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 18 }}>
                            <div style={{ fontSize: 11, fontWeight: 700, color: "#94a3b8", textTransform: "uppercase", letterSpacing: "0.07em" }}>
                                Pending Walk-in Payments
                            </div>
                            <span style={{
                                background: "#fef3c7", color: "#b45309", border: "1px solid #fde68a",
                                borderRadius: 20, padding: "2px 10px", fontSize: 11, fontWeight: 800,
                            }}>
                                {pendingApplicants.length} pending
                            </span>
                        </div>

                        {pendingApplicants.length === 0 ? (
                            <div style={{ textAlign: "center", padding: "32px 0", color: "#94a3b8" }}>
                                <div style={{ fontSize: 32, marginBottom: 8 }}>✅</div>
                                <p style={{ margin: 0, fontWeight: 600, fontSize: 14 }}>No pending walk-in payments</p>
                            </div>
                        ) : (
                            <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
                                {pendingApplicants.map((item) => (
                                    <div
                                        key={item.id}
                                        style={{
                                            display: "flex", alignItems: "center", justifyContent: "space-between",
                                            padding: "14px 18px", borderRadius: 12,
                                            border: "1.5px solid #f1f5f9", background: "#f8fafc",
                                            cursor: "pointer", transition: "all 0.15s",
                                        }}
                                        onMouseEnter={e => {
                                            e.currentTarget.style.borderColor = "#fbbf24";
                                            e.currentTarget.style.background = "#fffbeb";
                                        }}
                                        onMouseLeave={e => {
                                            e.currentTarget.style.borderColor = "#f1f5f9";
                                            e.currentTarget.style.background = "#f8fafc";
                                        }}
                                        onClick={() => handleSelectFromList(item)}
                                    >
                                        <div>
                                            <p style={{ margin: "0 0 2px", fontWeight: 700, fontSize: 14, color: "#0f172a" }}>
                                                {item.first_name} {item.last_name}
                                            </p>
                                            <p style={{ margin: 0, fontFamily: "monospace", fontSize: 12, color: "#64748b" }}>
                                                {item.tracking_no}
                                            </p>
                                        </div>
                                        <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
                                            <span style={{ fontSize: 13, fontWeight: 700, color: "#2563eb" }}>₱150.00</span>
                                            <span style={{
                                                background: "#fef3c7", color: "#b45309",
                                                border: "1px solid #fde68a", borderRadius: 20,
                                                padding: "2px 10px", fontSize: 10, fontWeight: 800, textTransform: "uppercase",
                                            }}>
                                                Pending
                                            </span>
                                            <svg style={{ width: 16, height: 16, color: "#94a3b8" }} fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5l7 7-7 7" />
                                            </svg>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>

                </div>
            </div>

            {/* Confirm Modal */}
            {showConfirmModal && (
                <div style={{
                    position: "fixed", inset: 0, background: "rgba(0,0,0,0.5)",
                    display: "flex", alignItems: "center", justifyContent: "center", zIndex: 50,
                }}>
                    <div style={{
                        background: "#fff", borderRadius: 20, padding: 32,
                        maxWidth: 420, width: "100%", margin: "0 16px",
                        boxShadow: "0 20px 60px rgba(0,0,0,0.15)",
                    }}>
                        <div style={{ textAlign: "center", marginBottom: 24 }}>
                            <div style={{
                                width: 64, height: 64, borderRadius: "50%",
                                background: "#fef3c7", display: "flex",
                                alignItems: "center", justifyContent: "center",
                                margin: "0 auto 16px", fontSize: 28,
                            }}>⚠️</div>
                            <h3 style={{ margin: "0 0 8px", fontSize: 18, fontWeight: 800, color: "#0f172a" }}>Confirm Payment</h3>
                            <p style={{ margin: "0 0 4px", color: "#64748b", fontSize: 14 }}>Confirm walk-in payment for</p>
                            <p style={{ margin: "0 0 8px", fontWeight: 800, color: "#0f172a", fontSize: 16 }}>
                                {selectedApplicant?.first_name} {selectedApplicant?.last_name}?
                            </p>
                            <p style={{ margin: 0, fontWeight: 800, color: "#2563eb", fontSize: 24 }}>₱150.00</p>
                        </div>
                        <div style={{ display: "flex", gap: 12 }}>
                            <button
                                onClick={() => setShowConfirmModal(false)}
                                style={{
                                    flex: 1, padding: "12px", borderRadius: 10,
                                    border: "1.5px solid #e2e8f0", background: "#fff",
                                    color: "#64748b", fontWeight: 700, fontSize: 14, cursor: "pointer",
                                }}
                                onMouseEnter={e => e.currentTarget.style.background = "#f8fafc"}
                                onMouseLeave={e => e.currentTarget.style.background = "#fff"}
                            >
                                Cancel
                            </button>
                            <button
                                onClick={handleConfirmPayment}
                                style={{
                                    flex: 1, padding: "12px", borderRadius: 10,
                                    background: "#059669", color: "#fff", border: "none",
                                    fontWeight: 700, fontSize: 14, cursor: "pointer",
                                }}
                                onMouseEnter={e => e.currentTarget.style.background = "#047857"}
                                onMouseLeave={e => e.currentTarget.style.background = "#059669"}
                            >
                                Yes, Confirm
                            </button>
                        </div>
                    </div>
                </div>
            )}

            {/* Success Modal */}
            {showSuccessModal && (
                <div style={{
                    position: "fixed", inset: 0, background: "rgba(0,0,0,0.5)",
                    display: "flex", alignItems: "center", justifyContent: "center", zIndex: 50,
                }}>
                    <div style={{
                        background: "#fff", borderRadius: 20, padding: 32,
                        maxWidth: 420, width: "100%", margin: "0 16px",
                        textAlign: "center", boxShadow: "0 20px 60px rgba(0,0,0,0.15)",
                    }}>
                        <div style={{
                            width: 72, height: 72, borderRadius: "50%",
                            background: "#dcfce7", display: "flex",
                            alignItems: "center", justifyContent: "center",
                            margin: "0 auto 16px", fontSize: 32,
                        }}>✅</div>
                        <h3 style={{ margin: "0 0 8px", fontSize: 22, fontWeight: 800, color: "#0f172a" }}>Payment Confirmed!</h3>
                        <p style={{ margin: "0 0 4px", color: "#64748b", fontSize: 14 }}>Walk-in payment for</p>
                        <p style={{ margin: "0 0 4px", fontWeight: 800, color: "#0f172a", fontSize: 16 }}>
                            {selectedApplicant?.first_name} {selectedApplicant?.last_name}
                        </p>
                        <p style={{ margin: "0 0 24px", color: "#64748b", fontSize: 14 }}>has been successfully recorded.</p>
                        <button
                            onClick={() => router.visit(route('admin.clearance.index'))}
                            style={{
                                width: "100%", padding: "12px", borderRadius: 10,
                                background: "#0f172a", color: "#fff", border: "none",
                                fontWeight: 700, fontSize: 14, cursor: "pointer",
                            }}
                            onMouseEnter={e => e.currentTarget.style.background = "#334155"}
                            onMouseLeave={e => e.currentTarget.style.background = "#0f172a"}
                        >
                            Go to Clearance Processing
                        </button>
                    </div>
                </div>
            )}

        </AuthenticatedLayout>
    );
}

const DetailBox = ({ label, value, highlight }) => (
    <div style={{
        background: "#f8fafc", padding: "16px 18px",
        borderRadius: 12, border: "1px solid #f1f5f9",
    }}>
        <p style={{ margin: "0 0 6px", fontSize: 10, fontWeight: 700, color: "#94a3b8", textTransform: "uppercase", letterSpacing: "0.07em" }}>
            {label}
        </p>
        <p style={{ margin: 0, fontWeight: highlight ? 800 : 600, fontSize: highlight ? 22 : 14, color: highlight ? "#2563eb" : "#1e293b" }}>
            {value}
        </p>
    </div>
);