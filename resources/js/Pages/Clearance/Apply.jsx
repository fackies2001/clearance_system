import React, { useState, useEffect } from 'react';
import { Head, useForm, usePage } from '@inertiajs/react';
import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import Modal from '@/Components/Modal';

const inputStyle = {
    marginTop: 4, display: "block", width: "100%", borderRadius: 8,
    border: "1.5px solid #e2e8f0", padding: "9px 14px", fontSize: 13,
    color: "#1e293b", outline: "none", boxSizing: "border-box",
    background: "#fff", transition: "border-color 0.15s",
    fontFamily: "'DM Sans', system-ui, sans-serif",
};

const selectStyle = {
    marginTop: 4, display: "block", width: "100%", borderRadius: 8,
    border: "1.5px solid #e2e8f0", padding: "9px 14px", fontSize: 13,
    color: "#1e293b", outline: "none", boxSizing: "border-box",
    background: "#fff", transition: "border-color 0.15s",
    fontFamily: "'DM Sans', system-ui, sans-serif",
};

const Field = ({ label, error, children, disabled }) => (
    <div>
        <label style={{
            display: "block", fontSize: 11, fontWeight: 700,
            color: "#94a3b8", marginBottom: 5,
            textTransform: "uppercase", letterSpacing: "0.06em",
        }}>{label}</label>
        {React.cloneElement(children, {
            onFocus: e => { if (!disabled) e.target.style.borderColor = "#3b82f6"; },
            onBlur:  e => { if (!disabled) e.target.style.borderColor = error ? "#ef4444" : "#e2e8f0"; },
            style: {
                ...children.props.style,
                border: error ? "1.5px solid #ef4444" : "1.5px solid #e2e8f0",
                background: disabled ? "#f8fafc" : "#fff",
                cursor: disabled ? "not-allowed" : "text",
                color: disabled ? "#94a3b8" : "#1e293b",
            }
        })}
        {error && <div style={{ color: "#ef4444", fontSize: 11, marginTop: 4, fontWeight: 600 }}>{error}</div>}
    </div>
);

const SectionHeader = ({ emoji, title, right }) => (
    <div style={{
        display: "flex", justifyContent: "space-between",
        alignItems: "center", marginBottom: 16,
    }}>
        <div style={{
            fontSize: 13, fontWeight: 800, color: "#0f172a",
            borderLeft: "3px solid #3b82f6", paddingLeft: 12,
        }}>
            {emoji} {title}
        </div>
        {right}
    </div>
);

export default function Apply({ auth, existingClearance, latestClearance }) {
    const [showSuccessModal, setShowSuccessModal] = useState(false);
    const [sameAddress, setSameAddress]           = useState(false);
    const [isEditMode, setIsEditMode]             = useState(false);

    const { flash } = usePage().props;

    // Editable kung pending or payment_pending at hindi pa paid
    const canEdit = existingClearance &&
        ['pending', 'payment_pending'].includes(existingClearance.workflow_status) &&
        existingClearance.payment_status !== 'paid';

    useEffect(() => {
        if (flash?.clearance) setShowSuccessModal(true);
        if (flash?.success)   setIsEditMode(false);
    }, [flash?.clearance, flash?.success]);

    const sourceData = existingClearance || latestClearance;

    const { data, setData, post, patch, processing, errors, reset } = useForm({
        first_name:         sourceData?.first_name         || '',
        middle_name:        sourceData?.middle_name        || '',
        last_name:          sourceData?.last_name          || '',
        suffix:             sourceData?.suffix             || '',
        date_of_birth:      sourceData?.date_of_birth      || '',
        place_of_birth:     sourceData?.place_of_birth     || '',
        sex:                sourceData?.sex                || '',
        civil_status:       sourceData?.civil_status       || '',
        nationality:        sourceData?.nationality        || 'Filipino',
        present_street:     sourceData?.present_street     || '',
        present_barangay:   sourceData?.present_barangay   || '',
        present_city:       sourceData?.present_city       || '',
        present_province:   sourceData?.present_province   || '',
        present_zip:        sourceData?.present_zip        || '',
        permanent_street:   sourceData?.permanent_street   || '',
        permanent_barangay: sourceData?.permanent_barangay || '',
        permanent_city:     sourceData?.permanent_city     || '',
        permanent_province: sourceData?.permanent_province || '',
        permanent_zip:      sourceData?.permanent_zip      || '',
        mobile_number:      sourceData?.mobile_number      || '',
        email_address:      sourceData?.email_address      || '',
        purpose:            sourceData?.purpose            || '',
    });

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

    const submit = (e) => {
        e.preventDefault();
        if (isEditMode && canEdit) {
            patch(route('apply.update', existingClearance.id), {
                onSuccess: () => setIsEditMode(false),
            });
        } else {
            post(route('apply.submit'));
        }
    };

    const handleCancelEdit = () => {
        // Reset form back to original values
        setData({
            first_name:         sourceData?.first_name         || '',
            middle_name:        sourceData?.middle_name        || '',
            last_name:          sourceData?.last_name          || '',
            suffix:             sourceData?.suffix             || '',
            date_of_birth:      sourceData?.date_of_birth      || '',
            place_of_birth:     sourceData?.place_of_birth     || '',
            sex:                sourceData?.sex                || '',
            civil_status:       sourceData?.civil_status       || '',
            nationality:        sourceData?.nationality        || 'Filipino',
            present_street:     sourceData?.present_street     || '',
            present_barangay:   sourceData?.present_barangay   || '',
            present_city:       sourceData?.present_city       || '',
            present_province:   sourceData?.present_province   || '',
            present_zip:        sourceData?.present_zip        || '',
            permanent_street:   sourceData?.permanent_street   || '',
            permanent_barangay: sourceData?.permanent_barangay || '',
            permanent_city:     sourceData?.permanent_city     || '',
            permanent_province: sourceData?.permanent_province || '',
            permanent_zip:      sourceData?.permanent_zip      || '',
            mobile_number:      sourceData?.mobile_number      || '',
            email_address:      sourceData?.email_address      || '',
            purpose:            sourceData?.purpose            || '',
        });
        setIsEditMode(false);
    };

    // Fields are disabled if: there's an existing clearance AND we're not in edit mode
    const fieldsDisabled = !!existingClearance && !isEditMode;

    return (
        <AuthenticatedLayout user={auth.user}>
            <Head title="Apply for Clearance" />

            <div style={{ padding: "24px 28px", fontFamily: "'DM Sans', system-ui, sans-serif" }}>
                <div style={{ maxWidth: 820, margin: "0 auto" }}>

                    {/* Page Header */}
                    <div style={{ marginBottom: 20, display: "flex", alignItems: "flex-start", justifyContent: "space-between", gap: 12 }}>
                        <div>
                            <h1 style={{ margin: "0 0 4px", fontSize: 22, fontWeight: 800, color: "#0f172a", letterSpacing: "-0.02em" }}>
                                NBI Clearance Application
                            </h1>
                            <p style={{ margin: 0, fontSize: 13, color: "#94a3b8" }}>
                                {isEditMode
                                    ? 'Edit mode — update your application details below.'
                                    : 'Please fill in all required fields accurately.'}
                            </p>
                        </div>

                        {/* Edit Button — visible lang kapag may canEdit at hindi pa naka-edit mode */}
                        {canEdit && !isEditMode && (
                            <button
                                onClick={() => setIsEditMode(true)}
                                style={{
                                    display: "flex", alignItems: "center", gap: 6,
                                    padding: "9px 18px", borderRadius: 10,
                                    background: "#fff", border: "1.5px solid #e2e8f0",
                                    color: "#0f172a", fontSize: 13, fontWeight: 700,
                                    cursor: "pointer", flexShrink: 0,
                                    boxShadow: "0 1px 3px rgba(0,0,0,0.06)",
                                    transition: "all 0.15s",
                                }}
                                onMouseEnter={e => { e.currentTarget.style.borderColor = "#3b82f6"; e.currentTarget.style.color = "#2563eb"; }}
                                onMouseLeave={e => { e.currentTarget.style.borderColor = "#e2e8f0"; e.currentTarget.style.color = "#0f172a"; }}
                            >
                                <svg width="15" height="15" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2"
                                        d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                                </svg>
                                Edit Application
                            </button>
                        )}

                        {/* Edit mode indicator badge */}
                        {isEditMode && (
                            <div style={{
                                display: "flex", alignItems: "center", gap: 6,
                                padding: "7px 14px", borderRadius: 10,
                                background: "#eff6ff", border: "1.5px solid #bfdbfe",
                                color: "#2563eb", fontSize: 12, fontWeight: 700, flexShrink: 0,
                            }}>
                                <span style={{ width: 7, height: 7, borderRadius: "50%", background: "#3b82f6", display: "inline-block" }} />
                                Editing Mode
                            </div>
                        )}
                    </div>

                    {/* Success flash message */}
                    {flash?.success && (
                        <div style={{
                            marginBottom: 16, padding: "12px 16px", borderRadius: 10,
                            background: "#f0fdf4", border: "1px solid #bbf7d0",
                            color: "#166534", fontSize: 13, fontWeight: 600,
                            display: "flex", alignItems: "center", gap: 8,
                        }}>
                            <svg width="16" height="16" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
                            </svg>
                            {flash.success}
                        </div>
                    )}

                    {/* Main Form Card */}
                    <div style={{
                        background: "#fff", borderRadius: 16, padding: "28px 32px",
                        border: isEditMode ? "1.5px solid #bfdbfe" : "1px solid #f1f5f9",
                        boxShadow: isEditMode
                            ? "0 0 0 3px rgba(59,130,246,0.08), 0 1px 4px rgba(0,0,0,0.04)"
                            : "0 1px 4px rgba(0,0,0,0.04)",
                        position: "relative",
                        transition: "border-color 0.2s, box-shadow 0.2s",
                    }}>

                        {/* Existing Clearance Overlay — only show when NOT in edit mode */}
                        {existingClearance && !isEditMode && !canEdit && (
                            <div style={{
                                position: "absolute", inset: 0, background: "rgba(255,255,255,0.85)",
                                backdropFilter: "blur(3px)", zIndex: 20, display: "flex",
                                alignItems: "center", justifyContent: "center", borderRadius: 16,
                            }}>
                                <div style={{
                                    background: "#fff", padding: 32, borderRadius: 20,
                                    boxShadow: "0 20px 60px rgba(0,0,0,0.1)",
                                    border: "1px solid #e0f2fe", maxWidth: 400, width: "100%",
                                    textAlign: "center", margin: "0 16px",
                                }}>
                                    <div style={{
                                        width: 72, height: 72, borderRadius: "50%",
                                        background: "#eff6ff", display: "flex",
                                        alignItems: "center", justifyContent: "center",
                                        margin: "0 auto 16px", fontSize: 32,
                                    }}>✅</div>
                                    <h2 style={{ margin: "0 0 8px", fontSize: 20, fontWeight: 800, color: "#0f172a" }}>
                                        Already Submitted!
                                    </h2>
                                    <p style={{ margin: "0 0 20px", fontSize: 13, color: "#64748b" }}>
                                        You already have an active NBI clearance application in progress.
                                    </p>
                                    <div style={{
                                        background: "#eff6ff", padding: "14px 18px",
                                        borderRadius: 12, marginBottom: 20, textAlign: "left",
                                        border: "1px solid #bfdbfe",
                                    }}>
                                        <p style={{ margin: "0 0 4px", fontSize: 10, fontWeight: 700, color: "#3b82f6", textTransform: "uppercase", letterSpacing: "0.07em" }}>
                                            Your Tracking Number
                                        </p>
                                        <p style={{ margin: 0, fontSize: 18, fontFamily: "monospace", fontWeight: 800, color: "#1d4ed8" }}>
                                            {existingClearance.tracking_no}
                                        </p>
                                    </div>
                                    <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
                                        <a href={route('application.status')} style={{
                                            display: "block", padding: "12px", borderRadius: 10,
                                            background: "#2563eb", color: "#fff", fontWeight: 700,
                                            fontSize: 14, textDecoration: "none", textAlign: "center",
                                        }}>
                                            Check My Status
                                        </a>
                                        {existingClearance.payment_status !== 'paid' && (
                                            <a href={`/payment/${existingClearance.tracking_no}`} style={{
                                                display: "block", padding: "12px", borderRadius: 10,
                                                background: "#f1f5f9", color: "#475569", fontWeight: 700,
                                                fontSize: 14, textDecoration: "none", textAlign: "center",
                                            }}>
                                                Go to Payment
                                            </a>
                                        )}
                                    </div>
                                </div>
                            </div>
                        )}

                        <form onSubmit={submit} style={{ display: "flex", flexDirection: "column", gap: 32 }}>

                            {/* Personal Information */}
                            <section>
                                <SectionHeader emoji="👤" title="Personal Information" />
                                <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr 1fr", gap: 14, marginBottom: 14 }}>
                                    <Field label="First Name *" error={errors.first_name} disabled={fieldsDisabled}>
                                        <input type="text" style={inputStyle} value={data.first_name} onChange={e => setData('first_name', e.target.value)} disabled={fieldsDisabled} required placeholder="e.g. Juan" />
                                    </Field>
                                    <Field label="Middle Name" error={errors.middle_name} disabled={fieldsDisabled}>
                                        <input type="text" style={inputStyle} value={data.middle_name} onChange={e => setData('middle_name', e.target.value)} disabled={fieldsDisabled} placeholder="e.g. Santos" />
                                    </Field>
                                    <Field label="Last Name *" error={errors.last_name} disabled={fieldsDisabled}>
                                        <input type="text" style={inputStyle} value={data.last_name} onChange={e => setData('last_name', e.target.value)} disabled={fieldsDisabled} required placeholder="e.g. Dela Cruz" />
                                    </Field>
                                    <Field label="Suffix" error={errors.suffix} disabled={fieldsDisabled}>
                                        <select style={selectStyle} value={data.suffix} onChange={e => setData('suffix', e.target.value)} disabled={fieldsDisabled}>
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
                                    <Field label="Date of Birth *" error={errors.date_of_birth} disabled={fieldsDisabled}>
                                        <input type="date" style={inputStyle} value={data.date_of_birth} onChange={e => setData('date_of_birth', e.target.value)} disabled={fieldsDisabled} required />
                                    </Field>
                                    <Field label="Place of Birth *" error={errors.place_of_birth} disabled={fieldsDisabled}>
                                        <input type="text" style={inputStyle} value={data.place_of_birth} onChange={e => setData('place_of_birth', e.target.value)} disabled={fieldsDisabled} required placeholder="e.g. Manila City" />
                                    </Field>
                                    <Field label="Sex *" error={errors.sex} disabled={fieldsDisabled}>
                                        <select style={selectStyle} value={data.sex} onChange={e => setData('sex', e.target.value)} disabled={fieldsDisabled} required>
                                            <option value="" disabled>Select Sex</option>
                                            <option value="Male">Male</option>
                                            <option value="Female">Female</option>
                                        </select>
                                    </Field>
                                    <Field label="Civil Status *" error={errors.civil_status} disabled={fieldsDisabled}>
                                        <select style={selectStyle} value={data.civil_status} onChange={e => setData('civil_status', e.target.value)} disabled={fieldsDisabled} required>
                                            <option value="" disabled>Select Status</option>
                                            <option value="Single">Single</option>
                                            <option value="Married">Married</option>
                                            <option value="Widowed">Widowed</option>
                                            <option value="Separated">Separated</option>
                                            <option value="Annulled">Annulled</option>
                                        </select>
                                    </Field>
                                    <Field label="Nationality *" error={errors.nationality} disabled={fieldsDisabled}>
                                        <input type="text" style={inputStyle} value={data.nationality} onChange={e => setData('nationality', e.target.value)} disabled={fieldsDisabled} required />
                                    </Field>
                                </div>
                            </section>

                            {/* Present Address */}
                            <section>
                                <SectionHeader emoji="📍" title="Present Address" />
                                <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 14 }}>
                                    <Field label="Street / House No. / Subdivision *" error={errors.present_street} disabled={fieldsDisabled}>
                                        <input type="text" style={inputStyle} value={data.present_street} onChange={e => handlePresentAddressChange('present_street', e.target.value)} disabled={fieldsDisabled} required placeholder="e.g. 123 Rizal St." />
                                    </Field>
                                    <Field label="Barangay *" error={errors.present_barangay} disabled={fieldsDisabled}>
                                        <input type="text" style={inputStyle} value={data.present_barangay} onChange={e => handlePresentAddressChange('present_barangay', e.target.value)} disabled={fieldsDisabled} required placeholder="e.g. Brgy. San Antonio" />
                                    </Field>
                                    <Field label="City / Municipality *" error={errors.present_city} disabled={fieldsDisabled}>
                                        <input type="text" style={inputStyle} value={data.present_city} onChange={e => handlePresentAddressChange('present_city', e.target.value)} disabled={fieldsDisabled} required placeholder="e.g. Quezon City" />
                                    </Field>
                                    <Field label="Province *" error={errors.present_province} disabled={fieldsDisabled}>
                                        <input type="text" style={inputStyle} value={data.present_province} onChange={e => handlePresentAddressChange('present_province', e.target.value)} disabled={fieldsDisabled} required placeholder="e.g. Metro Manila" />
                                    </Field>
                                    <Field label="Zip Code *" error={errors.present_zip} disabled={fieldsDisabled}>
                                        <input type="text" style={inputStyle} value={data.present_zip} onChange={e => handlePresentAddressChange('present_zip', e.target.value)} disabled={fieldsDisabled} required maxLength={4} placeholder="e.g. 1100" />
                                    </Field>
                                </div>
                            </section>

                            {/* Permanent Address */}
                            <section>
                                <SectionHeader
                                    emoji="🏠"
                                    title="Permanent Address"
                                    right={
                                        !fieldsDisabled && (
                                            <label style={{ display: "flex", alignItems: "center", gap: 8, fontSize: 13, color: "#64748b", cursor: "pointer" }}>
                                                <input type="checkbox" checked={sameAddress} onChange={handleSameAddress} />
                                                Same as Present Address
                                            </label>
                                        )
                                    }
                                />
                                <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 14 }}>
                                    <Field label="Street / House No. / Subdivision *" error={errors.permanent_street} disabled={fieldsDisabled || sameAddress}>
                                        <input type="text" style={inputStyle} value={data.permanent_street} onChange={e => setData('permanent_street', e.target.value)} disabled={fieldsDisabled || sameAddress} required placeholder="e.g. 123 Rizal St." />
                                    </Field>
                                    <Field label="Barangay *" error={errors.permanent_barangay} disabled={fieldsDisabled || sameAddress}>
                                        <input type="text" style={inputStyle} value={data.permanent_barangay} onChange={e => setData('permanent_barangay', e.target.value)} disabled={fieldsDisabled || sameAddress} required placeholder="e.g. Brgy. San Antonio" />
                                    </Field>
                                    <Field label="City / Municipality *" error={errors.permanent_city} disabled={fieldsDisabled || sameAddress}>
                                        <input type="text" style={inputStyle} value={data.permanent_city} onChange={e => setData('permanent_city', e.target.value)} disabled={fieldsDisabled || sameAddress} required placeholder="e.g. Quezon City" />
                                    </Field>
                                    <Field label="Province *" error={errors.permanent_province} disabled={fieldsDisabled || sameAddress}>
                                        <input type="text" style={inputStyle} value={data.permanent_province} onChange={e => setData('permanent_province', e.target.value)} disabled={fieldsDisabled || sameAddress} required placeholder="e.g. Metro Manila" />
                                    </Field>
                                    <Field label="Zip Code *" error={errors.permanent_zip} disabled={fieldsDisabled || sameAddress}>
                                        <input type="text" style={inputStyle} value={data.permanent_zip} onChange={e => setData('permanent_zip', e.target.value)} disabled={fieldsDisabled || sameAddress} required maxLength={4} placeholder="e.g. 1100" />
                                    </Field>
                                </div>
                            </section>

                            {/* Contact Information */}
                            <section>
                                <SectionHeader emoji="📞" title="Contact Information" />
                                <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 14 }}>
                                    <Field label="Mobile Number *" error={errors.mobile_number} disabled={fieldsDisabled}>
                                        <input type="tel" style={inputStyle} value={data.mobile_number} onChange={e => setData('mobile_number', e.target.value)} disabled={fieldsDisabled} required maxLength={11} placeholder="e.g. 09171234567" />
                                    </Field>
                                    <Field label="Email Address *" error={errors.email_address} disabled={fieldsDisabled}>
                                        <input type="email" style={inputStyle} value={data.email_address} onChange={e => setData('email_address', e.target.value)} disabled={fieldsDisabled} required placeholder="e.g. juan@email.com" />
                                    </Field>
                                </div>
                            </section>

                            {/* Purpose */}
                            <section>
                                <SectionHeader emoji="💼" title="Purpose of Application" />
                                <div style={{ maxWidth: 400 }}>
                                    <Field label="Purpose *" error={errors.purpose} disabled={fieldsDisabled}>
                                        <select style={selectStyle} value={data.purpose} onChange={e => setData('purpose', e.target.value)} disabled={fieldsDisabled} required>
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

                            {/* Walk-in Notice */}
                            <div style={{
                                background: "#fffbeb", border: "1px solid #fde68a",
                                borderLeft: "3px solid #f59e0b",
                                borderRadius: 12, padding: "16px 18px",
                                display: "flex", gap: 12, alignItems: "flex-start",
                            }}>
                                <span style={{ fontSize: 18, flexShrink: 0 }}>⚠️</span>
                                <div>
                                    <p style={{ margin: "0 0 4px", fontSize: 13, fontWeight: 700, color: "#92400e" }}>Walk-in Requirement</p>
                                    <p style={{ margin: 0, fontSize: 12, color: "#b45309", lineHeight: 1.6 }}>
                                        Upon submission and payment, you will be required to visit the NBI Clearance Center for <strong>face capture and fingerprinting</strong>. Please bring your Tracking Number shown after submission.
                                    </p>
                                </div>
                            </div>

                            {/* Submit / Save / Cancel Buttons */}
                            <div style={{ display: "flex", justifyContent: "flex-end", gap: 10, paddingTop: 8, borderTop: "1px solid #f1f5f9" }}>

                                {/* Cancel edit */}
                                {isEditMode && (
                                    <button
                                        type="button"
                                        onClick={handleCancelEdit}
                                        disabled={processing}
                                        style={{
                                            padding: "13px 24px", borderRadius: 10,
                                            background: "#f1f5f9", color: "#64748b",
                                            border: "1.5px solid #e2e8f0",
                                            fontSize: 14, fontWeight: 700, cursor: "pointer",
                                            transition: "all 0.2s",
                                        }}
                                    >
                                        Cancel
                                    </button>
                                )}

                                {/* New submission OR Save changes */}
                                {(!existingClearance || isEditMode) && (
                                    <button
                                        type="submit"
                                        disabled={processing}
                                        style={{
                                            padding: "13px 32px", borderRadius: 10,
                                            background: isEditMode ? "#0f172a" : "#2563eb",
                                            color: "#fff", border: "none",
                                            fontSize: 14, fontWeight: 700, cursor: "pointer",
                                            opacity: processing ? 0.6 : 1,
                                            boxShadow: isEditMode
                                                ? "0 4px 14px rgba(15,23,42,0.2)"
                                                : "0 4px 14px rgba(37,99,235,0.25)",
                                            transition: "all 0.2s",
                                            display: "flex", alignItems: "center", gap: 8,
                                        }}
                                    >
                                        {processing ? (
                                            isEditMode ? 'Saving...' : 'Submitting...'
                                        ) : (
                                            isEditMode ? (
                                                <>
                                                    <svg width="15" height="15" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
                                                    </svg>
                                                    Save Changes
                                                </>
                                            ) : 'Submit Application →'
                                        )}
                                    </button>
                                )}
                            </div>

                        </form>
                    </div>
                </div>
            </div>

            {/* Success Modal */}
            <Modal show={showSuccessModal} onClose={() => setShowSuccessModal(false)}>
                <div style={{ padding: 32, fontFamily: "'DM Sans', system-ui, sans-serif" }}>
                    <div style={{
                        width: 72, height: 72, borderRadius: "50%", background: "#dcfce7",
                        display: "flex", alignItems: "center", justifyContent: "center",
                        margin: "0 auto 16px", fontSize: 32,
                    }}>✅</div>
                    <h2 style={{ margin: "0 0 8px", fontSize: 22, fontWeight: 800, color: "#0f172a", textAlign: "center" }}>
                        Application Submitted!
                    </h2>

                    {flash?.clearance && (
                        <div>
                            <p style={{ margin: "0 0 20px", fontSize: 13, color: "#64748b", textAlign: "center" }}>
                                Your application has been received. Please pay the fee to proceed.
                            </p>
                            <div style={{
                                background: "#f8fafc", borderRadius: 12, padding: "16px 18px",
                                border: "1px solid #f1f5f9", marginBottom: 20,
                            }}>
                                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", paddingBottom: 12, borderBottom: "1px solid #f1f5f9", marginBottom: 12 }}>
                                    <span style={{ fontSize: 10, fontWeight: 700, color: "#94a3b8", textTransform: "uppercase", letterSpacing: "0.07em" }}>Tracking Number</span>
                                    <span style={{ fontFamily: "monospace", fontSize: 16, fontWeight: 800, color: "#2563eb" }}>{flash.clearance.tracking_no}</span>
                                </div>
                                {[
                                    { label: "Applicant", value: `${flash.clearance.first_name} ${flash.clearance.last_name}` },
                                    { label: "Fee Amount", value: "₱150.00" },
                                ].map(item => (
                                    <div key={item.label} style={{ display: "flex", justifyContent: "space-between", fontSize: 13, marginBottom: 8 }}>
                                        <span style={{ color: "#94a3b8" }}>{item.label}</span>
                                        <span style={{ fontWeight: 700, color: "#0f172a" }}>{item.value}</span>
                                    </div>
                                ))}
                            </div>
                            <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
                                <a href={`/payment/${flash.clearance.tracking_no}`} style={{
                                    display: "block", padding: "13px", borderRadius: 10,
                                    background: "#2563eb", color: "#fff", fontWeight: 700,
                                    fontSize: 14, textDecoration: "none", textAlign: "center",
                                    boxShadow: "0 4px 14px rgba(37,99,235,0.2)",
                                }}>
                                    Proceed to Payment →
                                </a>
                                <button onClick={() => setShowSuccessModal(false)} style={{
                                    padding: "13px", borderRadius: 10, background: "#f1f5f9",
                                    color: "#64748b", fontWeight: 700, fontSize: 14,
                                    border: "none", cursor: "pointer",
                                }}>
                                    Close
                                </button>
                            </div>
                        </div>
                    )}
                </div>
            </Modal>
        </AuthenticatedLayout>
    );
}