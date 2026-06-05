import React, { useState, useRef, useEffect } from 'react';
import { router } from '@inertiajs/react';

export default function BiometricsVerification({ applicationId, existingBiometric, onVerificationComplete }) {
    // --- Camera States ---
    const [cameraStarted, setCameraStarted] = useState(false);
    const [photoCaptured, setPhotoCaptured] = useState(existingBiometric ? true : false);
    const [photoData, setPhotoData] = useState(existingBiometric ? existingBiometric.photo_path : null);
    const streamRef = useRef(null);
    const videoRef = useRef(null);
    const canvasRef = useRef(null);

    // --- Fingerprint States ---
    const [isScanning, setIsScanning] = useState(false);
    const [fingerprintStatus, setFingerprintStatus] = useState(existingBiometric ? existingBiometric.fingerprint_status : 'PENDING');
    const [scannerMessage, setScannerMessage] = useState(
        existingBiometric
            ? 'Verification Cleared: Historical biometric authentication dataset loaded.'
            : 'Draw your fingerprint on the canvas below.'
    );

    // --- Fingerprint Canvas States ---
    const fingerprintCanvasRef = useRef(null);
    const [isDrawing, setIsDrawing] = useState(false);
    const [strokeCount, setStrokeCount] = useState(0);
    const [canScan, setCanScan] = useState(false);
    const lastPos = useRef(null);

    useEffect(() => {
        return () => {
            if (streamRef.current) {
                streamRef.current.getTracks().forEach(track => track.stop());
            }
        };
    }, []);

    // --- Camera Logic ---
    const startCamera = async () => {
        try {
            const stream = await navigator.mediaDevices.getUserMedia({ video: true, audio: false });
            if (videoRef.current) videoRef.current.srcObject = stream;
            streamRef.current = stream;
            setCameraStarted(true);
            setPhotoCaptured(false);
        } catch (err) {
            alert("Unable to access the camera. Please grant camera permission.");
        }
    };

    const capturePhoto = () => {
        const video = videoRef.current;
        const canvas = canvasRef.current;
        if (video && canvas) {
            canvas.width = video.videoWidth;
            canvas.height = video.videoHeight;
            const ctx = canvas.getContext('2d');
            ctx.drawImage(video, 0, 0, canvas.width, canvas.height);
            const base64Image = canvas.toDataURL('image/jpeg');
            setPhotoData(base64Image);
            if (streamRef.current) streamRef.current.getTracks().forEach(track => track.stop());
            setPhotoCaptured(true);
            setCameraStarted(false);
        }
    };

    const resetPhoto = () => {
        setPhotoCaptured(false);
        setPhotoData(null);
        startCamera();
    };

    // --- Fingerprint Canvas Drawing Logic ---
  const getPos = (e, canvas) => {
    const rect = canvas.getBoundingClientRect();
    const scaleX = canvas.width / rect.width;
    const scaleY = canvas.height / rect.height;
    if (e.touches) {
        return {
            x: (e.touches[0].clientX - rect.left) * scaleX,
            y: (e.touches[0].clientY - rect.top) * scaleY
        };
    }
    return {
        x: (e.clientX - rect.left) * scaleX,
        y: (e.clientY - rect.top) * scaleY
    };
};

    const startDrawing = (e) => {
        if (fingerprintStatus === 'CAPTURED' || isScanning) return;
        e.preventDefault();
        setIsDrawing(true);
        const canvas = fingerprintCanvasRef.current;
        lastPos.current = getPos(e, canvas);
    };

    const draw = (e) => {
        if (!isDrawing || fingerprintStatus === 'CAPTURED' || isScanning) return;
        e.preventDefault();
        const canvas = fingerprintCanvasRef.current;
        const ctx = canvas.getContext('2d');
        const currentPos = getPos(e, canvas);

        ctx.beginPath();
        ctx.moveTo(lastPos.current.x, lastPos.current.y);
        ctx.lineTo(currentPos.x, currentPos.y);
        ctx.strokeStyle = '#22c55e';
        ctx.lineWidth = 2;
        ctx.lineCap = 'round';
        ctx.lineJoin = 'round';
        ctx.stroke();

        lastPos.current = currentPos;
    };

    const stopDrawing = () => {
        if (!isDrawing) return;
        setIsDrawing(false);
        lastPos.current = null;

        const newCount = strokeCount + 1;
        setStrokeCount(newCount);

        // After 3 strokes, enable the scan button
        if (newCount >= 3) {
            setCanScan(true);
            setScannerMessage('Pattern detected! Click "Confirm Scan" to process.');
        } else {
            setScannerMessage(`Drawing... (${newCount}/3 strokes detected)`);
        }
    };

    const clearCanvas = () => {
        const canvas = fingerprintCanvasRef.current;
        const ctx = canvas.getContext('2d');
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        setStrokeCount(0);
        setCanScan(false);
        setScannerMessage('Draw your fingerprint on the canvas below.');
    };

    const startFingerprintScan = () => {
        if (!canScan) return;
        setIsScanning(true);
        setScannerMessage('Processing... Analyzing fingerprint pattern.');

        setTimeout(() => {
            setIsScanning(false);
            setFingerprintStatus('CAPTURED');
            setScannerMessage('Success! Biometric Match Confirmed (ID: FP-MOCK-99).');
            if (onVerificationComplete) onVerificationComplete('CAPTURED');
        }, 2500);
    };

    // --- Submit Biometrics (Admin only) ---
    const handleSubmitVerification = () => {
       if (fingerprintStatus !== 'CAPTURED') {
            alert('Both Photo Capture and Fingerprint must be completed.');
            return;
        }
        router.post(`/admin/applications/${applicationId}/biometrics`, {
            photo: photoData,
            fingerprint_status: fingerprintStatus
        }, {
            onSuccess: () => {
                alert('Biometric logs saved successfully.');
                if (onVerificationComplete) onVerificationComplete('CAPTURED');
            },
            onError: (errors) => {
                console.error(errors);
                alert('Error occurred while saving biometric data.');
            }
        });
    };

    return (
      <div className="p-6 bg-gray-50 rounded-xl">

            {/* ===== FINGERPRINT CANVAS ===== */}
            <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200 flex flex-col justify-between">
                <div>
                    <h3 className="text-md font-bold text-gray-800 mb-1">☝️ Fingerprint Scanner</h3>
                    <p className="text-xs text-gray-400 mb-3">Draw your fingerprint pattern using your mouse or touchpad.</p>

                    {/* Canvas Drawing Area */}
                    <div className="relative border-2 border-dashed border-gray-300 rounded-lg bg-gray-50 overflow-hidden"
                         style={{ height: '180px' }}>

                        {/* Fingerprint background guide */}
                       <svg className="absolute inset-0 w-full h-full opacity-10 pointer-events-none" viewBox="0 0 100 100" preserveAspectRatio="none">
                            {[10,20,30,40,50,60,70,80,90].map(r => (
                                <ellipse key={r} cx="50" cy="50" rx={r * 0.6} ry={r * 0.4} fill="none" stroke="#000" strokeWidth="1"/>
                            ))}
                        </svg>

                        {fingerprintStatus === 'CAPTURED' ? (
                            <div className="absolute inset-0 flex flex-col items-center justify-center bg-green-50">
                                <svg className="w-12 h-12 text-green-500 mb-2" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="1.5">
                                    <path strokeLinecap="round" strokeLinejoin="round" d="M9 12.75L11.25 15 15 9.75M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                                </svg>
                                <p className="text-green-700 text-xs font-bold">Fingerprint Captured</p>
                            </div>
                        ) : (
                            <canvas
                                ref={fingerprintCanvasRef}
                                width={400}
                                height={180}
                                className="w-full h-full cursor-crosshair touch-none"
                                onMouseDown={startDrawing}
                                onMouseMove={draw}
                                onMouseUp={stopDrawing}
                                onMouseLeave={stopDrawing}
                                onTouchStart={startDrawing}
                                onTouchMove={draw}
                                onTouchEnd={stopDrawing}
                            />
                        )}

                        {isScanning && (
                            <div className="absolute inset-0 bg-green-500/10 animate-pulse flex items-center justify-center">
                                <p className="text-green-700 text-xs font-bold animate-bounce">Scanning...</p>
                            </div>
                        )}
                    </div>

                    <p className="mt-2 text-xs text-center text-gray-500">{scannerMessage}</p>
                </div>

                {!existingBiometric ? (
                    <div className="mt-4 flex flex-col gap-2">
                        <div className="flex gap-2">
                            <button
                                type="button"
                                onClick={startFingerprintScan}
                                disabled={!canScan || isScanning || fingerprintStatus === 'CAPTURED'}
                                className="flex-1 px-4 py-2 bg-slate-800 text-white text-sm font-semibold rounded hover:bg-slate-900 disabled:bg-gray-300 disabled:cursor-not-allowed transition">
                                {isScanning ? 'Processing...' : fingerprintStatus === 'CAPTURED' ? '✓ Captured' : 'Confirm Scan'}
                            </button>
                            {fingerprintStatus !== 'CAPTURED' && (
                                <button
                                    type="button"
                                    onClick={clearCanvas}
                                    disabled={isScanning}
                                    className="px-4 py-2 bg-gray-200 text-gray-700 text-sm font-semibold rounded hover:bg-gray-300 disabled:cursor-not-allowed transition">
                                    Clear
                                </button>
                            )}
                        </div>

                        {photoCaptured && fingerprintStatus === 'CAPTURED' && applicationId !== null && (
                            <button type="button" onClick={handleSubmitVerification}
                                className="w-full mt-2 px-4 py-2 bg-green-600 text-white text-sm font-bold rounded hover:bg-green-700 transition shadow-md">
                                💾 Save and Override Status to Cleared
                            </button>
                        )}
                    </div>
                ) : (
                    <div className="w-full mt-4 px-4 py-2.5 bg-green-50 text-green-800 border border-green-200 text-xs font-bold rounded text-center uppercase tracking-wider">
                        🛡️ Record Locked & Authenticated By Admin
                    </div>
                )}
            </div>
        </div>
    );
}