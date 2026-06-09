import React, { useState, useRef, useCallback } from 'react';
import { Head, router, useForm, usePage } from '@inertiajs/react';
import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import Webcam from "react-webcam";

const Field = ({ label, error, children }) => (
    <div>
        <label style={{
            display: "block", fontSize: 11, fontWeight: 700,
            color: "#94a3b8", marginBottom: 5,
            textTransform: "uppercase", letterSpacing: "0.06em",
        }}>{label}</label>
        {React.cloneElement(children, {
            onFocus: e => e.target.style.borderColor = "#3b82f6",
            onBlur: e => e.target.style.borderColor = error ? "#ef4444" : "#e2e8f0",
            style: {
                ...children.props.style,
                border: error ? "1.5px solid #ef4444" : "1.5px solid #e2e8f0",
            }
        })}
        {error && <div style={{ color: "#ef4444", fontSize: 11, marginTop: 4, fontWeight: 600 }}>{error}</div>}
    </div>
);;

const inputStyle = {
    marginTop: 4, display: "block", width: "100%", borderRadius: 8,
    border: "1.5px solid #e2e8f0", padding: "9px 14px", fontSize: 13,
    color: "#1e293b", outline: "none", boxSizing: "border-box",
    background: "#fff", transition: "border-color 0.15s",
};

const selectStyle = {
    marginTop: 4, display: "block", width: "100%", borderRadius: 8,
    border: "1.5px solid #e2e8f0", padding: "9px 14px", fontSize: 13,
    color: "#1e293b", outline: "none", boxSizing: "border-box",
    background: "#fff", transition: "border-color 0.15s",
};

export default function BiometricsCapture({ auth, applicant, search, showCapture }) {
    const webcamRef = useRef(null);
    const [imgSrc, setImgSrc] = useState(null);
    const imgSrcRef = useRef(null);
    const [sameAddress, setSameAddress] = useState(false);
    const [showCaptureSection, setShowCaptureSection] = useState(showCapture === true || showCapture === 'true' || showCapture === 1 || showCapture === '1');
    const [showSuccessModal, setShowSuccessModal] = useState(false);

    const pageErrors = usePage().props.errors || {};

    const { data: searchData, setData: setSearchData, processing: searchProcessing } = useForm({
        tracking_no: search || '',
    });

    const { data, setData, post, processing, errors } = useForm({
        first_name:         applicant?.first_name || '',
        middle_name:        applicant?.middle_name || '',
        last_name:          applicant?.last_name || '',
        suffix:             applicant?.suffix || '',
        date_of_birth:      applicant?.date_of_birth || '',
        place_of_birth:     applicant?.place_of_birth || '',
        sex:                applicant?.sex || '',
        civil_status:       applicant?.civil_status || '',
        nationality:        applicant?.nationality || 'Filipino',
        present_street:     applicant?.present_street || '',
        present_barangay:   applicant?.present_barangay || '',
        present_city:       applicant?.present_city || '',
        present_province:   applicant?.present_province || '',
        present_zip:        applicant?.present_zip || '',
        permanent_street:   applicant?.permanent_street || '',
        permanent_barangay: applicant?.permanent_barangay || '',
        permanent_city:     applicant?.permanent_city || '',
        permanent_province: applicant?.permanent_province || '',
        permanent_zip:      applicant?.permanent_zip || '',
        mobile_number:      applicant?.mobile_number || '',
        email_address:      applicant?.email_address || '',
        purpose:            applicant?.purpose || '',
    });

    const handleSearch = () => {
        router.get(route('admin.biometrics.index'), { tracking_no: searchData.tracking_no });
    };

    const handleSameAddress = (e) => {
        const checked = e.target.checked;
        setSameAddress(checked);
        if (checked) {
            setData(prev => ({
                ...prev,
                permanent_street:   prev.present_street,
                permanent_barangay: prev.present_barangay,
                permanent_city:     prev.present_city,
                permanent_province: prev.present_province,
                permanent_zip:      prev.present_zip,
            }));
        }
    };

    const handlePresentAddressChange = (field, value) => {
        if (sameAddress) {
            const permField = field.replace('present_', 'permanent_');
            setData(prev => ({ ...prev, [field]: value, [permField]: value }));
        } else {
            setData(field, value);
        }
    };

     const handleFormSubmit = (e) => {
        e.preventDefault();
        router.post(route('admin.biometrics.update', applicant.id), data, {
            onSuccess: () => setShowCaptureSection(true),
            preserveScroll: true,
        });
    };

        const capture = useCallback(() => {
            if (!webcamRef.current) return;
            const imageSrc = webcamRef.current.getScreenshot();
            setImgSrc(imageSrc);
            imgSrcRef.current = imageSrc;
        }, [webcamRef]);

    const retake = () => {
        setImgSrc(null);
        imgSrcRef.current = null;
    };

    const handleFingerprint = (status) => {
        if (!imgSrcRef.current) {
            alert('No photo captured. Please capture a photo first.');
            return;
        }
        router.post(route('admin.biometrics.store', applicant.id), {
            photo_base64: imgSrcRef.current,
            fingerprint_status: status,
        }, {
            onSuccess: () => setShowSuccessModal(true),
        });
    };

    return (
        <AuthenticatedLayout
            user={auth.user}
            header={
                <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
                    <div style={{
                        width: 38, height: 38, borderRadius: 10,
                        background: "linear-gradient(135deg, #1e3a5f, #3b82f6)",
                        display: "flex", alignItems: "center", justifyContent: "center",
                        fontSize: 18,
                    }}>🫆</div>
                    <h2 style={{ margin: 0, fontSize: 20, fontWeight: 800, color: "#0f172a", letterSpacing: "-0.02em" }}>
                        Biometrics Capture (Walk-in)
                    </h2>
                </div>
            }
        >
            <Head title="Biometrics Capture" />

            <div style={{ padding: "24px 28px", fontFamily: "'DM Sans', system-ui, sans-serif" }}>
                <div style={{ maxWidth: 960, margin: "0 auto", display: "flex", flexDirection: "column", gap: 20 }}>

                    {/* Search Card */}
                    {!applicant && (
                        <div style={{
                            background: "#fff", borderRadius: 16, padding: "24px 28px",
                            border: "1px solid #f1f5f9", boxShadow: "0 1px 4px rgba(0,0,0,0.04)"
                        }}>
                            <div style={{ fontSize: 15, fontWeight: 800, color: "#0f172a", marginBottom: 6 }}>
                                Start Biometrics Capture
                            </div>
                            <div style={{ fontSize: 13, color: "#94a3b8", marginBottom: 18 }}>
                                Search for an applicant with a paid transaction to begin photo and fingerprint capture.
                            </div>
                            <div style={{ display: "flex", gap: 12 }}>
                                <input
                                    type="text"
                                    style={{
                                        ...inputStyle,
                                        flex: 1, marginTop: 0,
                                        border: pageErrors.tracking_no ? "1.5px solid #ef4444" : "1.5px solid #e2e8f0",
                                    }}
                                    placeholder="Enter Tracking No. (e.g. NBI-2026-XXXX)"
                                    value={searchData.tracking_no}
                                    onChange={e => setSearchData('tracking_no', e.target.value)}
                                    onKeyDown={e => e.key === 'Enter' && handleSearch()}
                                    onFocus={e => e.target.style.borderColor = "#3b82f6"}
                                    onBlur={e => e.target.style.borderColor = pageErrors.tracking_no ? "#ef4444" : "#e2e8f0"}
                                />
                                <button
                                    type="button"
                                    onClick={handleSearch}
                                    disabled={searchProcessing}
                                    style={{
                                        padding: "10px 24px", borderRadius: 10,
                                        background: "#0f172a", color: "#fff", border: "none",
                                        fontSize: 14, fontWeight: 700, cursor: "pointer",
                                        opacity: searchProcessing ? 0.6 : 1,
                                    }}
                                    onMouseEnter={e => e.currentTarget.style.background = "#334155"}
                                    onMouseLeave={e => e.currentTarget.style.background = "#0f172a"}
                                >
                                    {searchProcessing ? 'Searching...' : 'Search Applicant'}
                                </button>
                            </div>
                            {pageErrors.tracking_no && (
                                <p style={{ color: "#ef4444", fontSize: 12, marginTop: 6, fontWeight: 600 }}>{pageErrors.tracking_no}</p>
                            )}
                        </div>
                    )}

                                       {/* Application Form */}
                    {applicant && !showCaptureSection && (
                        <div style={{
                            background: "#fff", borderRadius: 16, padding: "28px",
                            border: "1px solid #f1f5f9", boxShadow: "0 1px 4px rgba(0,0,0,0.04)"
                        }}>
                            {/* Form Header */}
                            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 28 }}>
                                <div>
                                    <span style={{
                                        fontSize: 10, fontWeight: 800, color: "#3b82f6",
                                        textTransform: "uppercase", letterSpacing: "0.08em",
                                        background: "#eff6ff", padding: "3px 10px", borderRadius: 20,
                                    }}>Active Applicant</span>
                                    <h2 style={{ margin: "10px 0 4px", fontSize: 20, fontWeight: 800, color: "#0f172a" }}>
                                        Verify & Edit Application
                                    </h2>
                                    <p style={{ margin: 0, fontSize: 13, color: "#94a3b8" }}>
                                        Review and edit the applicant's information before proceeding to biometrics capture.
                                    </p>
                                </div>
                                <button
                                    type="button"
                                    onClick={() => router.get(route('admin.biometrics.index'))}
                                    style={{
                                        fontSize: 12, color: "#94a3b8", fontWeight: 700,
                                        background: "none", border: "none", cursor: "pointer",
                                    }}
                                    onMouseEnter={e => e.currentTarget.style.color = "#ef4444"}
                                    onMouseLeave={e => e.currentTarget.style.color = "#94a3b8"}
                                >
                                    Cancel & New Search
                                </button>
                            </div>

                            <form onSubmit={handleFormSubmit} style={{ display: "flex", flexDirection: "column", gap: 32 }}>

                                {/* Personal Information */}
                                <section>
                                    <div style={{
                                        fontSize: 13, fontWeight: 800, color: "#0f172a",
                                        borderLeft: "3px solid #3b82f6", paddingLeft: 12,
                                        marginBottom: 16,
                                    }}>
                                        👤 Personal Information
                                    </div>
                                    <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr 1fr", gap: 14, marginBottom: 14 }}>
                                        <Field label="First Name *" error={errors.first_name}>
                                            <input type="text" style={inputStyle} value={data.first_name} onChange={e => setData('first_name', e.target.value)} required />
                                        </Field>
                                        <Field label="Middle Name" error={errors.middle_name}>
                                            <input type="text" style={inputStyle} value={data.middle_name} onChange={e => setData('middle_name', e.target.value)} />
                                        </Field>
                                        <Field label="Last Name *" error={errors.last_name}>
                                            <input type="text" style={inputStyle} value={data.last_name} onChange={e => setData('last_name', e.target.value)} required />
                                        </Field>
                                        <Field label="Suffix" error={errors.suffix}>
                                            <select style={selectStyle} value={data.suffix} onChange={e => setData('suffix', e.target.value)}>
                                                <option value="">None</option>
                                                <option value="Jr.">Jr.</option>
                                                <option value="Sr.">Sr.</option>
                                                <option value="II">II</option>
                                                <option value="III">III</option>
                                                <option value="IV">IV</option>
                                            </select>
                                        </Field>
                                    </div>
                                    <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: 14 }}>
                                        <Field label="Date of Birth *" error={errors.date_of_birth}>
                                            <input type="date" style={inputStyle} value={data.date_of_birth} onChange={e => setData('date_of_birth', e.target.value)} required />
                                        </Field>
                                        <Field label="Place of Birth *" error={errors.place_of_birth}>
                                            <input type="text" style={inputStyle} value={data.place_of_birth} onChange={e => setData('place_of_birth', e.target.value)} required />
                                        </Field>
                                        <Field label="Sex *" error={errors.sex}>
                                            <select style={selectStyle} value={data.sex} onChange={e => setData('sex', e.target.value)} required>
                                                <option value="" disabled>Select Sex</option>
                                                <option value="Male">Male</option>
                                                <option value="Female">Female</option>
                                            </select>
                                        </Field>
                                        <Field label="Civil Status *" error={errors.civil_status}>
                                            <select style={selectStyle} value={data.civil_status} onChange={e => setData('civil_status', e.target.value)} required>
                                                <option value="" disabled>Select Status</option>
                                                <option value="Single">Single</option>
                                                <option value="Married">Married</option>
                                                <option value="Widowed">Widowed</option>
                                                <option value="Separated">Separated</option>
                                                <option value="Annulled">Annulled</option>
                                            </select>
                                        </Field>
                                        <Field label="Nationality *" error={errors.nationality}>
                                            <input type="text" style={inputStyle} value={data.nationality} onChange={e => setData('nationality', e.target.value)} required />
                                        </Field>
                                    </div>
                                </section>

                                {/* Present Address */}
                                <section>
                                    <div style={{
                                        fontSize: 13, fontWeight: 800, color: "#0f172a",
                                        borderLeft: "3px solid #3b82f6", paddingLeft: 12,
                                        marginBottom: 16,
                                    }}>
                                        📍 Present Address
                                    </div>
                                    <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 14 }}>
                                        <Field label="Street / House No. / Subdivision *" error={errors.present_street}>
                                            <input type="text" style={inputStyle} value={data.present_street} onChange={e => handlePresentAddressChange('present_street', e.target.value)} required />
                                        </Field>
                                        <Field label="Barangay *" error={errors.present_barangay}>
                                            <input type="text" style={inputStyle} value={data.present_barangay} onChange={e => handlePresentAddressChange('present_barangay', e.target.value)} required />
                                        </Field>
                                        <Field label="City / Municipality *" error={errors.present_city}>
                                            <input type="text" style={inputStyle} value={data.present_city} onChange={e => handlePresentAddressChange('present_city', e.target.value)} required />
                                        </Field>
                                        <Field label="Province *" error={errors.present_province}>
                                            <input type="text" style={inputStyle} value={data.present_province} onChange={e => handlePresentAddressChange('present_province', e.target.value)} required />
                                        </Field>
                                        <Field label="Zip Code *" error={errors.present_zip}>
                                            <input type="text" style={inputStyle} value={data.present_zip} onChange={e => handlePresentAddressChange('present_zip', e.target.value)} required maxLength={4} />
                                        </Field>
                                    </div>
                                </section>

                                {/* Permanent Address */}
                                <section>
                                    <div style={{
                                        display: "flex", justifyContent: "space-between",
                                        alignItems: "center", marginBottom: 16,
                                    }}>
                                        <div style={{
                                            fontSize: 13, fontWeight: 800, color: "#0f172a",
                                            borderLeft: "3px solid #3b82f6", paddingLeft: 12,
                                        }}>
                                            🏠 Permanent Address
                                        </div>
                                        <label style={{ display: "flex", alignItems: "center", gap: 8, fontSize: 13, color: "#64748b", cursor: "pointer" }}>
                                            <input type="checkbox" checked={sameAddress} onChange={handleSameAddress} />
                                            Same as Present Address
                                        </label>
                                    </div>
                                    <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 14 }}>
                                        <Field label="Street / House No. / Subdivision *" error={errors.permanent_street}>
                                            <input type="text" style={{ ...inputStyle, background: sameAddress ? "#f8fafc" : "#fff" }} value={data.permanent_street} onChange={e => setData('permanent_street', e.target.value)} disabled={sameAddress} required />
                                        </Field>
                                        <Field label="Barangay *" error={errors.permanent_barangay}>
                                            <input type="text" style={{ ...inputStyle, background: sameAddress ? "#f8fafc" : "#fff" }} value={data.permanent_barangay} onChange={e => setData('permanent_barangay', e.target.value)} disabled={sameAddress} required />
                                        </Field>
                                        <Field label="City / Municipality *" error={errors.permanent_city}>
                                            <input type="text" style={{ ...inputStyle, background: sameAddress ? "#f8fafc" : "#fff" }} value={data.permanent_city} onChange={e => setData('permanent_city', e.target.value)} disabled={sameAddress} required />
                                        </Field>
                                        <Field label="Province *" error={errors.permanent_province}>
                                            <input type="text" style={{ ...inputStyle, background: sameAddress ? "#f8fafc" : "#fff" }} value={data.permanent_province} onChange={e => setData('permanent_province', e.target.value)} disabled={sameAddress} required />
                                        </Field>
                                        <Field label="Zip Code *" error={errors.permanent_zip}>
                                            <input type="text" style={{ ...inputStyle, background: sameAddress ? "#f8fafc" : "#fff" }} value={data.permanent_zip} onChange={e => setData('permanent_zip', e.target.value)} disabled={sameAddress} required maxLength={4} />
                                        </Field>
                                    </div>
                                </section>

                                {/* Contact Information */}
                                <section>
                                    <div style={{
                                        fontSize: 13, fontWeight: 800, color: "#0f172a",
                                        borderLeft: "3px solid #3b82f6", paddingLeft: 12,
                                        marginBottom: 16,
                                    }}>
                                        📞 Contact Information
                                    </div>
                                    <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 14 }}>
                                        <Field label="Mobile Number *" error={errors.mobile_number}>
                                            <input type="tel" style={inputStyle} value={data.mobile_number} onChange={e => setData('mobile_number', e.target.value)} required maxLength={11} />
                                        </Field>
                                        <Field label="Email Address *" error={errors.email_address}>
                                            <input type="email" style={inputStyle} value={data.email_address} onChange={e => setData('email_address', e.target.value)} required />
                                        </Field>
                                    </div>
                                </section>

                                {/* Purpose */}
                                <section>
                                    <div style={{
                                        fontSize: 13, fontWeight: 800, color: "#0f172a",
                                        borderLeft: "3px solid #3b82f6", paddingLeft: 12,
                                        marginBottom: 16,
                                    }}>
                                        💼 Purpose of Application
                                    </div>
                                    <div style={{ maxWidth: 400 }}>
                                        <Field label="Purpose *" error={errors.purpose}>
                                            <select style={selectStyle} value={data.purpose} onChange={e => setData('purpose', e.target.value)} required>
                                                <option value="" disabled>Select Purpose</option>
                                                <option value="Local Employment">Local Employment</option>
                                                <option value="Travel Abroad">Travel Abroad</option>
                                                <option value="Business Requirement">Business Requirement</option>
                                                <option value="Government Requirement">Government Requirement</option>
                                                <option value="Firearm License">Firearm License</option>
                                                <option value="Other">Other</option>
                                            </select>
                                        </Field>
                                    </div>
                                </section>

                                <div style={{ display: "flex", justifyContent: "flex-end", paddingTop: 8, borderTop: "1px solid #f1f5f9" }}>
                                    <button
                                        type="submit"
                                        disabled={processing}
                                        style={{
                                            padding: "13px 32px", borderRadius: 10,
                                            background: "#2563eb", color: "#fff", border: "none",
                                            fontSize: 14, fontWeight: 700, cursor: "pointer",
                                            opacity: processing ? 0.6 : 1,
                                            boxShadow: "0 4px 14px rgba(37, 99, 235, 0.25)",
                                            transition: "all 0.2s",
                                        }}
                                        onMouseEnter={e => e.currentTarget.style.background = "#1d4ed8"}
                                        onMouseLeave={e => e.currentTarget.style.background = "#2563eb"}
                                    >
                                        {processing ? 'Saving...' : 'Confirm & Proceed to Biometrics →'}
                                    </button>
                                </div>

                            </form>
                        </div>
                    )}


                                        {/* Biometrics Capture Section */}
                    {applicant && showCaptureSection && (
                        <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>

                            {/* Main Capture Card */}
                            <div style={{
                                background: "#fff", borderRadius: 16, overflow: "hidden",
                                border: "1px solid #f1f5f9", boxShadow: "0 1px 4px rgba(0,0,0,0.04)",
                            }}>
                                {/* Card Header */}
                                <div style={{
                                    padding: "14px 20px", background: "#f8fafc",
                                    borderBottom: "1px solid #f1f5f9",
                                    display: "flex", justifyContent: "space-between", alignItems: "center",
                                }}>
                                    <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
                                        <div style={{
                                            width: 28, height: 28, borderRadius: 8,
                                            background: imgSrc ? "#dcfce7" : "#eff6ff",
                                            display: "flex", alignItems: "center", justifyContent: "center",
                                            fontSize: 14,
                                        }}>
                                            {imgSrc ? "✅" : "📷"}
                                        </div>
                                        <div>
                                            <div style={{ fontSize: 13, fontWeight: 800, color: "#0f172a" }}>
                                                Step 1: Face Capture
                                            </div>
                                            <div style={{ fontSize: 11, color: "#94a3b8" }}>
                                                {imgSrc ? "Photo captured successfully" : "Position applicant in front of the camera"}
                                            </div>
                                        </div>
                                    </div>
                                    {imgSrc && (
                                        <span style={{
                                            fontSize: 10, fontWeight: 800, color: "#059669",
                                            background: "#dcfce7", padding: "3px 10px", borderRadius: 20,
                                            textTransform: "uppercase", letterSpacing: "0.06em",
                                        }}>✓ Captured</span>
                                    )}
                                </div>

                                {/* Side by Side Content */}
                                <div style={{ display: "grid", gridTemplateColumns: "1.6fr 1fr", minHeight: 420 }}>

                                    {/* Left — Webcam */}
                                    <div style={{
                                        padding: 24, borderRight: "1px solid #f1f5f9",
                                        display: "flex", flexDirection: "column",
                                        alignItems: "center", justifyContent: "center", gap: 16,
                                    }}>
                                        {!imgSrc ? (
                                            <>
                                                <div style={{
                                                    width: "100%", maxWidth: 440,
                                                    borderRadius: 12, overflow: "hidden",
                                                    background: "#000",
                                                    boxShadow: "0 8px 24px rgba(0,0,0,0.12)",
                                                }}>
                                                    <Webcam
                                                        audio={false}
                                                        ref={webcamRef}
                                                        screenshotFormat="image/png"
                                                        style={{ width: "100%", display: "block" }}
                                                        videoConstraints={{ facingMode: "user" }}
                                                        onUserMediaError={(err) => console.error("Camera error:", err)}
                                                    />
                                                </div>
                                                <button
                                                    onClick={capture}
                                                    style={{
                                                        padding: "11px 32px", borderRadius: 50,
                                                        background: "#0f172a", color: "#fff", border: "none",
                                                        fontSize: 13, fontWeight: 800, cursor: "pointer",
                                                        display: "flex", alignItems: "center", gap: 8,
                                                        boxShadow: "0 4px 12px rgba(15,23,42,0.15)",
                                                    }}
                                                    onMouseEnter={e => e.currentTarget.style.background = "#334155"}
                                                    onMouseLeave={e => e.currentTarget.style.background = "#0f172a"}
                                                >
                                                    <div style={{
                                                        width: 10, height: 10, borderRadius: "50%",
                                                        background: "#ef4444",
                                                        boxShadow: "0 0 0 3px rgba(239,68,68,0.3)",
                                                    }} />
                                                    CAPTURE IMAGE
                                                </button>
                                            </>
                                        ) : (
                                            <>
                                                <img
                                                    src={imgSrc}
                                                    style={{
                                                        width: "100%", maxWidth: 340,
                                                        borderRadius: 12,
                                                        border: "3px solid #10b981",
                                                        boxShadow: "0 8px 24px rgba(16,185,129,0.15)",
                                                    }}
                                                    alt="Captured"
                                                />
                                                <button
                                                    onClick={retake}
                                                    style={{
                                                        padding: "9px 24px", borderRadius: 8,
                                                        background: "#f1f5f9", color: "#64748b",
                                                        border: "none", fontSize: 13, fontWeight: 700,
                                                        cursor: "pointer",
                                                    }}
                                                    onMouseEnter={e => e.currentTarget.style.background = "#e2e8f0"}
                                                    onMouseLeave={e => e.currentTarget.style.background = "#f1f5f9"}
                                                >
                                                    ↺ Retake Photo
                                                </button>
                                            </>
                                        )}
                                    </div>

                                    {/* Right — Applicant Info + Controls */}
                                    <div style={{
                                        padding: 24, display: "flex",
                                        flexDirection: "column", justifyContent: "space-between",
                                    }}>
                                        {/* Applicant Info */}
                                        <div>
                                            <span style={{
                                                fontSize: 10, fontWeight: 800, color: "#3b82f6",
                                                textTransform: "uppercase", letterSpacing: "0.08em",
                                                background: "#eff6ff", padding: "3px 10px", borderRadius: 20,
                                            }}>Active Applicant</span>
                                            <h3 style={{ margin: "10px 0 2px", fontSize: 18, fontWeight: 800, color: "#0f172a" }}>
                                                {applicant.first_name} {applicant.last_name}
                                            </h3>
                                            <p style={{ margin: "0 0 16px", fontFamily: "monospace", fontSize: 11, color: "#94a3b8" }}>
                                                {applicant.tracking_no}
                                            </p>

                                            <div style={{ display: "flex", flexDirection: "column", gap: 10, borderTop: "1px solid #f1f5f9", paddingTop: 14 }}>
                                                {[
                                                    { label: "Sex", value: applicant.sex },
                                                    { label: "Date of Birth", value: applicant.date_of_birth },
                                                    { label: "Purpose", value: applicant.purpose },
                                                ].map(item => (
                                                    <div key={item.label} style={{ display: "flex", justifyContent: "space-between", alignItems: "center", fontSize: 12 }}>
                                                        <span style={{ color: "#94a3b8", fontWeight: 500 }}>{item.label}</span>
                                                        <span style={{ fontWeight: 700, color: "#334155", textAlign: "right", maxWidth: 120, wordBreak: "break-word" }}>{item.value}</span>
                                                    </div>
                                                ))}
                                                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", fontSize: 12 }}>
                                                    <span style={{ color: "#94a3b8", fontWeight: 500 }}>Payment</span>
                                                    <span style={{
                                                        fontSize: 10, fontWeight: 800, color: "#059669",
                                                        background: "#dcfce7", padding: "2px 8px",
                                                        borderRadius: 20, textTransform: "uppercase",
                                                    }}>● PAID</span>
                                                </div>
                                            </div>
                                        </div>

                                        {/* Nav Buttons */}
                                        <div style={{ display: "flex", flexDirection: "column", gap: 6, marginTop: 20 }}>
                                            <button
                                                onClick={() => setShowCaptureSection(false)}
                                                style={{
                                                    width: "100%", padding: "8px", fontSize: 12,
                                                    color: "#64748b", fontWeight: 700, background: "#f8fafc",
                                                    border: "1px solid #f1f5f9", borderRadius: 8, cursor: "pointer",
                                                }}
                                                onMouseEnter={e => e.currentTarget.style.color = "#3b82f6"}
                                                onMouseLeave={e => e.currentTarget.style.color = "#64748b"}
                                            >
                                                ← Back to Form
                                            </button>
                                            <button
                                                onClick={() => router.get(route('admin.biometrics.index'))}
                                                style={{
                                                    width: "100%", padding: "8px", fontSize: 12,
                                                    color: "#94a3b8", fontWeight: 700, background: "none",
                                                    border: "none", cursor: "pointer",
                                                }}
                                                onMouseEnter={e => e.currentTarget.style.color = "#ef4444"}
                                                onMouseLeave={e => e.currentTarget.style.color = "#94a3b8"}
                                            >
                                                Cancel & New Search
                                            </button>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            {/* Step 2: Fingerprint — shows after photo captured */}
                            {imgSrc && (
                                <div style={{
                                    background: "#fff", borderRadius: 16, overflow: "hidden",
                                    border: "2px solid #3b82f6", boxShadow: "0 1px 4px rgba(0,0,0,0.04)",
                                }}>
                                    <div style={{
                                        padding: "14px 20px", background: "#f8fafc",
                                        borderBottom: "1px solid #f1f5f9",
                                        display: "flex", alignItems: "center", gap: 10,
                                    }}>
                                        <div style={{
                                            width: 28, height: 28, borderRadius: 8,
                                            background: "#eff6ff",
                                            display: "flex", alignItems: "center", justifyContent: "center",
                                            fontSize: 14,
                                        }}>🫆</div>
                                        <div>
                                            <div style={{ fontSize: 13, fontWeight: 800, color: "#0f172a" }}>
                                                Step 2: Fingerprint Scanning
                                            </div>
                                            <div style={{ fontSize: 11, color: "#94a3b8" }}>
                                                SIMULATED — Ensure hardware is connected
                                            </div>
                                        </div>
                                    </div>

                                    <div style={{
                                        padding: "32px 24px", display: "flex",
                                        alignItems: "center", justifyContent: "space-between", gap: 24,
                                    }}>
                                        <div style={{ display: "flex", alignItems: "center", gap: 16 }}>
                                            <div style={{
                                                width: 64, height: 64, borderRadius: 16,
                                                background: "#eff6ff", display: "flex",
                                                alignItems: "center", justifyContent: "center", fontSize: 28,
                                                flexShrink: 0,
                                            }}>🫆</div>
                                            <div>
                                                <div style={{ fontSize: 14, fontWeight: 700, color: "#0f172a", marginBottom: 4 }}>
                                                    Place applicant's right thumb on the scanner
                                                </div>
                                                <div style={{ fontSize: 12, color: "#94a3b8" }}>
                                                    Ensure the finger is clean and properly positioned
                                                </div>
                                            </div>
                                        </div>

                                        <div style={{ display: "flex", gap: 10, flexShrink: 0 }}>
                                            <button
                                                onClick={() => handleFingerprint('COMPLETED')}
                                                style={{
                                                    padding: "11px 24px", borderRadius: 10,
                                                    background: "#2563eb", color: "#fff", border: "none",
                                                    fontSize: 13, fontWeight: 700, cursor: "pointer",
                                                    boxShadow: "0 4px 12px rgba(37,99,235,0.2)",
                                                }}
                                                onMouseEnter={e => e.currentTarget.style.background = "#1d4ed8"}
                                                onMouseLeave={e => e.currentTarget.style.background = "#2563eb"}
                                            >
                                                ✓ Simulate Scan Success
                                            </button>
                                            <button
                                                onClick={() => handleFingerprint('FAILED')}
                                                style={{
                                                    padding: "11px 20px", borderRadius: 10,
                                                    background: "#f1f5f9", color: "#94a3b8", border: "none",
                                                    fontSize: 13, fontWeight: 700, cursor: "pointer",
                                                }}
                                                onMouseEnter={e => e.currentTarget.style.background = "#e2e8f0"}
                                                onMouseLeave={e => e.currentTarget.style.background = "#f1f5f9"}
                                            >
                                                ✕ Fail
                                            </button>
                                        </div>
                                    </div>
                                </div>
                            )}

                        </div>
                    )}


                </div>
            </div>

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
                            width: 72, height: 72, borderRadius: "50%", background: "#dcfce7",
                            display: "flex", alignItems: "center", justifyContent: "center",
                            margin: "0 auto 16px", fontSize: 32,
                        }}>✅</div>
                        <h3 style={{ margin: "0 0 8px", fontSize: 22, fontWeight: 800, color: "#0f172a" }}>Biometrics Complete!</h3>
                        <p style={{ margin: "0 0 4px", color: "#64748b", fontSize: 14 }}>Biometrics for</p>
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
