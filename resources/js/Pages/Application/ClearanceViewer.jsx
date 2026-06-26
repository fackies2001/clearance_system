// resources/js/Pages/Clearance/ClearanceViewer.jsx
import React from 'react';
import { Head, Link } from '@inertiajs/react';
import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';

const Label = ({ children }) => (
    <div style={{ fontSize: 7, fontWeight: 700, textTransform: 'uppercase', color: '#555', letterSpacing: '0.5px', marginBottom: 1 }}>
        {children}
    </div>
);

const Val = ({ children, size = 11 }) => (
    <div style={{ fontSize: size, fontWeight: 700, textTransform: 'uppercase', color: '#000', borderBottom: '0.5px solid #999', paddingBottom: 2, marginBottom: 5 }}>
        {children || ' '}
    </div>
);

function ClearanceCopy({ clearance, qrCodeSvg, isPersonalCopy = false }) {
    const validUntil = clearance.released_at
        ? new Date(new Date(clearance.released_at).setFullYear(new Date(clearance.released_at).getFullYear() + 1))
            .toLocaleDateString('en-PH', { month: 'long', day: 'numeric', year: 'numeric' }).toUpperCase()
        : '—';

    const dateIssued = clearance.released_at
        ? new Date(clearance.released_at).toLocaleDateString('en-PH', { month: 'long', day: 'numeric', year: 'numeric' })
        : '—';

    const dob = clearance.date_of_birth
        ? new Date(clearance.date_of_birth).toLocaleDateString('en-PH', { month: 'long', day: 'numeric', year: 'numeric' }).toUpperCase()
        : '—';

    const address = [
        clearance.present_street,
        'BRGY ' + clearance.present_barangay,
        clearance.present_city,
        clearance.present_province,
    ].filter(Boolean).join(', ').toUpperCase();

    return (
        <div style={{
            width: '100%',
            background: '#fff',
            padding: '14px 18px',
            position: 'relative',
            overflow: 'hidden',
            fontFamily: 'Arial, sans-serif',
            borderBottom: isPersonalCopy ? 'none' : '2px dashed #999',
        }}>
            {/* Watermark */}
            <div style={{ position: 'absolute', inset: 0, zIndex: 0, display: 'flex', flexWrap: 'wrap', overflow: 'hidden', opacity: 0.04, pointerEvents: 'none', alignContent: 'flex-start' }}>
                {Array.from({ length: 150 }).map((_, i) => (
                    <span key={i} style={{ fontSize: 10, fontWeight: 900, textTransform: 'uppercase', color: '#1a3a6b', whiteSpace: 'nowrap', padding: '2px 4px' }}>
                        National Bureau of Investigation
                    </span>
                ))}
            </div>

            {/* Personal Copy Stamp */}
            {isPersonalCopy && (
                <div style={{
                    position: 'absolute', top: '35%', left: '30%', transform: 'rotate(-25deg)',
                    fontSize: 36, fontWeight: 900, color: 'rgba(220,50,50,0.18)',
                    border: '4px solid rgba(220,50,50,0.18)', padding: '4px 12px',
                    textTransform: 'uppercase', letterSpacing: 2, zIndex: 2, pointerEvents: 'none',
                    fontFamily: 'Arial Black, Arial',
                }}>
                    PERSONAL COPY
                </div>
            )}

            <div style={{ position: 'relative', zIndex: 1 }}>
                {/* Header */}
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 12, paddingBottom: 6, borderBottom: '2px solid #1a3a6b', marginBottom: 5 }}>
                    <div style={{ width: 44, height: 44, border: '1px solid #ccc', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 5.5, color: '#888', textAlign: 'center', flexShrink: 0 }}>
                        BAGONG<br/>PILIPINAS
                    </div>
                    <div style={{ textAlign: 'center' }}>
                        <div style={{ fontSize: 6, fontWeight: 700, color: '#1a3a6b', letterSpacing: 2, textTransform: 'uppercase' }}>Bagong Pilipinas</div>
                        <div style={{ fontSize: 12, fontWeight: 900, textTransform: 'uppercase' }}>Republic of the Philippines</div>
                        <div style={{ fontSize: 10, fontWeight: 700, textTransform: 'uppercase' }}>Department of Justice</div>
                        <div style={{ fontSize: 15, fontWeight: 900, textTransform: 'uppercase', color: '#1a3a6b', letterSpacing: 1 }}>National Bureau of Investigation</div>
                    </div>
                    <div style={{ width: 44, height: 44, border: '1px solid #1a3a6b', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 10, color: '#1a3a6b', fontWeight: 900, flexShrink: 0 }}>
                        NBI
                    </div>
                </div>

                <p style={{ fontSize: 7, textAlign: 'center', color: '#444', marginBottom: 8, fontStyle: 'italic' }}>
                    This is to certify that the person whose name, picture, signature and thumbprint appearing herein applied for NBI Clearance and the results is as follows:
                </p>

                {/* Main 2-column layout */}
                <div style={{ display: 'flex', gap: 10 }}>

                    {/* Left: Info */}
                    <div style={{ flex: 1 }}>

                        {/* Row 1: NBI ID + Valid Until */}
                        <div style={{ display: 'flex', gap: 12 }}>
                            <div style={{ flex: 1 }}>
                                <Label>NBI ID No.</Label>
                                <Val size={10}>{clearance.clearance_number}</Val>
                            </div>
                            <div style={{ flex: 1 }}>
                                <Label>Valid Until</Label>
                                <Val size={10}>{validUntil}</Val>
                            </div>
                        </div>

                        {/* Row 2: Family Name + First Name + Middle Name */}
                        <div style={{ display: 'flex', gap: 12 }}>
                            <div style={{ flex: 1 }}>
                                <Label>Family Name</Label>
                                <Val size={14}>{clearance.last_name}</Val>
                            </div>
                            <div style={{ flex: 1 }}>
                                <Label>First Name</Label>
                                <Val size={14}>{clearance.first_name}</Val>
                            </div>
                            <div style={{ flex: 1 }}>
                                <Label>Middle Name</Label>
                                <Val size={14}>{clearance.middle_name || 'N/A'}</Val>
                            </div>
                        </div>

                        {/* Row 3: Address */}
                        <div>
                            <Label>Address</Label>
                            <Val size={10}>{address}</Val>
                        </div>

                        {/* Row 4: Date of Birth + Place of Birth */}
                        <div style={{ display: 'flex', gap: 12 }}>
                            <div style={{ flex: 1 }}>
                                <Label>Date of Birth</Label>
                                <Val>{dob}</Val>
                            </div>
                            <div style={{ flex: 1 }}>
                                <Label>Place of Birth</Label>
                                <Val>{clearance.place_of_birth}</Val>
                            </div>
                        </div>

                        {/* Row 5: Citizenship + Civil Status + Gender */}
                        <div style={{ display: 'flex', gap: 12 }}>
                            <div style={{ flex: 1 }}>
                                <Label>Citizenship</Label>
                                <Val>{clearance.nationality}</Val>
                            </div>
                            <div style={{ flex: 1 }}>
                                <Label>Civil Status</Label>
                                <Val>{clearance.civil_status}</Val>
                            </div>
                            <div style={{ flex: 1 }}>
                                <Label>Gender</Label>
                                <Val>{clearance.sex}</Val>
                            </div>
                        </div>

                        {/* Row 6: Purpose */}
                        <div>
                            <Label>Purpose</Label>
                            <Val>{clearance.purpose}</Val>
                        </div>

                        {/* Remarks */}
                        <div style={{ border: '1.5px solid #000', padding: '4px 8px', marginTop: 2, marginBottom: 8 }}>
                            <Label>Remarks</Label>
                            <div style={{ fontSize: 12, fontWeight: 900, textTransform: 'uppercase' }}>
                                {clearance.status === 'CLEARED' ? 'NO DEROGATORY RECORD' : 'WITH DEROGATORY RECORD'}
                            </div>
                        </div>

                        {/* Bottom: Barcode + Signature */}
                        <div style={{ display: 'flex', alignItems: 'flex-end', gap: 16 }}>
                            <div style={{ flex: 1 }}>
                                <div style={{ background: '#000', height: 32, width: '100%', position: 'relative', overflow: 'hidden' }}>
                                    {Array.from({ length: 80 }).map((_, i) => (
                                        <div key={i} style={{
                                            position: 'absolute', top: 0, bottom: 0,
                                            left: `${i * 1.25}%`,
                                            width: `${Math.random() > 0.5 ? 0.5 : 0.25}%`,
                                            background: '#fff',
                                        }}/>
                                    ))}
                                </div>
                                <div style={{ fontSize: 7, fontFamily: 'monospace', textAlign: 'center', marginTop: 1 }}>
                                    {clearance.clearance_number}
                                </div>
                            </div>
                            <div style={{ textAlign: 'center' }}>
                                <div style={{ borderTop: '1px solid #000', width: 110, marginBottom: 2 }}/>
                                <div style={{ fontSize: 7.5, fontWeight: 900, textTransform: 'uppercase' }}>ATTY. NBI DIRECTOR</div>
                                <div style={{ fontSize: 6.5, color: '#555', textTransform: 'uppercase' }}>Director</div>
                            </div>
                        </div>

                    </div>

                    {/* Right: Photo + QR + Transaction */}
                    <div style={{ width: 95, display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 5, flexShrink: 0 }}>

                        <div style={{ background: '#1a3a6b', color: '#fff', fontSize: 8, fontWeight: 900, padding: '2px 6px', letterSpacing: 1, textAlign: 'center', width: '100%' }}>
                            A-{clearance.clearance_number?.slice(-7)}
                        </div>

                        {/* Photo */}
                        <div style={{ width: 85, height: 105, border: '1.5px solid #555', overflow: 'hidden', background: '#eee', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                            {clearance.photo_path
                                ? <img src={`/storage/${clearance.photo_path}`} alt="Photo" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                                : <span style={{ fontSize: 7, color: '#aaa', textAlign: 'center' }}>NO PHOTO</span>
                            }
                        </div>

                        {/* Signature */}
                        <div style={{ width: 85, height: 28, border: '0.5px solid #999', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                            <span style={{ fontSize: 6.5, color: '#888', textTransform: 'uppercase' }}>Signature</span>
                        </div>

                        {/* QR */}
                        <div style={{ width: 75, height: 75, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                            {qrCodeSvg ? (
                                <div dangerouslySetInnerHTML={{ __html: qrCodeSvg }} style={{ width: '100%', height: '100%' }} />
                            ) : (
                                <div style={{ background: '#000', width: '100%', height: '100%' }}></div>
                            )}
                        </div>
                        <div style={{ fontSize: 6.5, color: '#888', textTransform: 'uppercase', textAlign: 'center' }}>Scan QR to verify</div>

                        {/* Transaction */}
                        <table style={{ fontSize: 6, borderCollapse: 'collapse', width: '100%' }}>
                            <tbody>
                                {[
                                    ['Date', dateIssued],
                                    ['Agency', 'NBI'],
                                    ['O.R. No.', clearance.payment_reference || 'N/A'],
                                    ['DST PAID', clearance.payment_amount ? '₱' + clearance.payment_amount : 'N/A'],
                                ].map(([k, v]) => (
                                    <tr key={k}>
                                        <td style={{ padding: '1px 3px', border: '0.5px solid #ccc', color: '#555', fontWeight: 700 }}>{k}</td>
                                        <td style={{ padding: '1px 3px', border: '0.5px solid #ccc' }}>{v}</td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>

                    </div>
                </div>
            </div>
        </div>
    );
}

export default function ClearanceViewer({ auth, clearance, qrCodeSvg }) {
    return (
        <AuthenticatedLayout user={auth.user}>
            <Head title={`NBI Clearance - ${clearance.clearance_number}`}>
                <style>{`
                    @media print {
                        @page { size: portrait; margin: 0; }
                        body { -webkit-print-color-adjust: exact; print-color-adjust: exact; background: white !important; margin: 0; padding: 0; }
                        
                        /* Hide app layout elements */
                        nav, aside, header, .print\\:hidden { display: none !important; }
                        
                        /* Fix layout shifts by absolutely positioning the print wrapper */
                        #clearance-print-wrapper {
                            position: absolute;
                            top: 0;
                            left: 0;
                            width: 100%;
                            padding: 0;
                            margin: 0;
                        }

                        #clearance-print {
                            border: none !important;
                            box-shadow: none !important;
                            width: 100% !important;
                            max-width: 800px;
                            margin: 0 auto;
                        }
                    }
                `}</style>
            </Head>

            {/* Action Buttons */}
            <div className="flex justify-between items-center px-6 py-4 print:hidden">
                <Link href={route('application.status')} className="inline-flex items-center gap-2 text-sm text-gray-500 hover:text-gray-900 transition">
                    <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10 19l-7-7m0 0l7-7m-7 7h18" />
                    </svg>
                    Back to Status
                </Link>
                <div className="flex gap-3">
                    <a href={route('clearance.download', clearance.tracking_no)}
                        className="inline-flex items-center gap-2 px-4 py-2 bg-slate-100 text-slate-700 rounded-lg text-sm font-bold hover:bg-slate-200 transition">
                        Download PDF
                    </a>
                    <button onClick={() => window.print()}
                        className="inline-flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg text-sm font-bold hover:bg-blue-700 transition">
                        Print Clearance
                    </button>
                </div>
            </div>

            {/* Two Copies */}
            <div id="clearance-print-wrapper" className="flex justify-center px-4 pb-12 print:p-0">
                <div id="clearance-print" style={{ width: 820, border: '1px solid #ccc', boxShadow: '0 4px 24px rgba(0,0,0,0.10)', background: 'white' }}>
                    <ClearanceCopy clearance={clearance} qrCodeSvg={qrCodeSvg} isPersonalCopy={false} />
                    <ClearanceCopy clearance={clearance} qrCodeSvg={qrCodeSvg} isPersonalCopy={true} />
                </div>
            </div>

        </AuthenticatedLayout>
    );
}