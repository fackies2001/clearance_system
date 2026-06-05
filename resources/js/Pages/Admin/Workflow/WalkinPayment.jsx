import React, { useState } from 'react';
import { Head, router } from '@inertiajs/react';
import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';

export default function WalkinPayment({ auth, applicant, search }) {
    const [trackingNo, setTrackingNo] = useState(search || '');
    const [processing, setProcessing] = useState(false);
    const [showConfirmModal, setShowConfirmModal] = useState(false);
    const [showSuccessModal, setShowSuccessModal] = useState(false);

    const handleSearch = () => {
        router.get(route('admin.walkin.search'), { tracking_no: trackingNo });
    };

    const handleConfirmPayment = () => {
        setShowConfirmModal(false);
        router.post(route('admin.walkin.pay', applicant.id), {}, {
            onSuccess: () => setShowSuccessModal(true),
            onError: () => alert('Something went wrong. Please try again.'),
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
                                disabled={processing}
                                style={{
                                    padding: "10px 24px", borderRadius: 10,
                                    background: "#0f172a", color: "#fff", border: "none",
                                    fontSize: 14, fontWeight: 700, cursor: "pointer",
                                }}
                                onMouseEnter={e => e.currentTarget.style.background = "#334155"}
                                onMouseLeave={e => e.currentTarget.style.background = "#0f172a"}
                            >
                                {processing ? 'Searching...' : 'Search'}
                            </button>
                        </div>
                    </div>

                    {/* Result Section */}
                    {applicant && (
                        <div style={{
                            background: "#fff", borderRadius: 16, padding: "28px",
                            border: "1px solid #f1f5f9", borderTop: "3px solid #3b82f6",
                            boxShadow: "0 1px 4px rgba(0,0,0,0.04)"
                        }}>
                            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 28 }}>
                                <div>
                                    <span style={{
                                        fontSize: 10, fontWeight: 800, color: "#3b82f6",
                                        textTransform: "uppercase", letterSpacing: "0.08em",
                                        background: "#eff6ff", padding: "3px 10px", borderRadius: 20,
                                    }}>Application Found</span>
                                    <h2 style={{ margin: "10px 0 4px", fontSize: 26, fontWeight: 800, color: "#0f172a", letterSpacing: "-0.02em" }}>
                                        {applicant.first_name} {applicant.last_name}
                                    </h2>
                                    <p style={{ margin: 0, fontFamily: "monospace", fontSize: 13, color: "#64748b" }}>{applicant.tracking_no}</p>
                                </div>
                                <div style={{ textAlign: "right" }}>
                                    <p style={{ fontSize: 10, fontWeight: 700, color: "#94a3b8", textTransform: "uppercase", marginBottom: 6 }}>Payment Status</p>
                                    <span style={{
                                        display: "inline-block", padding: "4px 14px", borderRadius: 20,
                                        fontSize: 11, fontWeight: 800, textTransform: "uppercase",
                                        background: applicant.payment_status === 'paid' ? "#dcfce7" : "#fef3c7",
                                        color: applicant.payment_status === 'paid' ? "#15803d" : "#b45309",
                                        border: `1px solid ${applicant.payment_status === 'paid' ? "#bbf7d0" : "#fde68a"}`,
                                    }}>
                                        ● {applicant.payment_status}
                                    </span>
                                </div>
                            </div>

                            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 14, marginBottom: 28 }}>
                                <DetailBox label="Birth Date" value={applicant.date_of_birth} />
                                <DetailBox label="Address" value={`${applicant.present_street}, ${applicant.present_barangay}, ${applicant.present_city}`} />
                                <DetailBox label="Purpose" value={applicant.purpose} />
                                <DetailBox label="Amount Due" value="₱150.00" highlight />
                            </div>

                            {applicant.payment_status !== 'paid' ? (
                                <button
                                    onClick={() => setShowConfirmModal(true)}
                                    style={{
                                        width: "100%", padding: "14px", borderRadius: 12,
                                        background: "#059669", color: "#fff", border: "none",
                                        fontSize: 15, fontWeight: 800, cursor: "pointer",
                                        display: "flex", alignItems: "center", justifyContent: "center", gap: 10,
                                        transition: "background 0.2s",
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
                            <p style={{ margin: "0 0 4px", color: "#64748b", fontSize: 14 }}>Are you sure you want to confirm walk-in payment for</p>
                            <p style={{ margin: "0 0 8px", fontWeight: 800, color: "#0f172a", fontSize: 16 }}>{applicant?.first_name} {applicant?.last_name}?</p>
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
                        <p style={{ margin: "0 0 4px", fontWeight: 800, color: "#0f172a", fontSize: 16 }}>{applicant?.first_name} {applicant?.last_name}</p>
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
