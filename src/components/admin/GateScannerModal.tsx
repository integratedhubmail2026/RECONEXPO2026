import React, { useState, useRef, useEffect, useCallback } from 'react';
import { 
  Camera, 
  X, 
  CheckCircle2, 
  AlertCircle, 
  FlipHorizontal, 
  Search, 
  UserCheck, 
  UserX, 
  QrCode, 
  RefreshCw, 
  ShieldAlert, 
  Clock, 
  Building2, 
  Sparkles,
  Ticket,
  Loader2
} from 'lucide-react';
import { AttendeeTicket } from '../../types';

interface GateScannerModalProps {
  isOpen: boolean;
  onClose: () => void;
  attendees: AttendeeTicket[];
  onToggleCheckIn: (ticketNumber: string) => boolean;
}

export const GateScannerModal: React.FC<GateScannerModalProps> = ({
  isOpen,
  onClose,
  attendees,
  onToggleCheckIn
}) => {
  const [cameraActive, setCameraActive] = useState(false);
  const [isInitializing, setIsInitializing] = useState(false);
  const [cameraError, setCameraError] = useState<string | null>(null);
  const [errorType, setErrorType] = useState<'permission_denied' | 'no_hardware' | 'in_use' | 'other' | null>(null);
  const [facingMode, setFacingMode] = useState<'environment' | 'user'>('environment');
  const [manualCode, setManualCode] = useState('');
  const [scannedAttendee, setScannedAttendee] = useState<AttendeeTicket | null>(null);
  const [scanFeedback, setScanFeedback] = useState<string | null>(null);
  const [showOverrideConfirm, setShowOverrideConfirm] = useState(false);

  const videoRef = useRef<HTMLVideoElement>(null);
  const mediaStreamRef = useRef<MediaStream | null>(null);
  const scanIntervalRef = useRef<number | null>(null);

  // Stop camera media stream cleanly
  const stopCamera = useCallback(() => {
    if (scanIntervalRef.current) {
      clearInterval(scanIntervalRef.current);
      scanIntervalRef.current = null;
    }
    if (mediaStreamRef.current) {
      mediaStreamRef.current.getTracks().forEach(track => {
        try {
          track.stop();
        } catch (e) {
          console.warn('Error stopping scanner track:', e);
        }
      });
      mediaStreamRef.current = null;
    }
    if (videoRef.current) {
      videoRef.current.srcObject = null;
    }
    setCameraActive(false);
    setIsInitializing(false);
  }, []);

  const handleLookup = useCallback((query: string) => {
    const cleanQuery = query.trim().toUpperCase();
    if (!cleanQuery) return;

    // Search by ticket number, barcode, or extract from QR URL/data
    const match = attendees.find(a => {
      const tNum = a.ticketNumber.toUpperCase();
      const bCode = (a.barcode || '').toUpperCase();
      const email = a.email.toUpperCase();
      const name = a.fullName.toUpperCase();

      return tNum === cleanQuery || 
             bCode === cleanQuery || 
             cleanQuery.includes(tNum) ||
             (bCode && cleanQuery.includes(bCode)) ||
             email === cleanQuery ||
             name.includes(cleanQuery);
    });

    if (match) {
      setScannedAttendee(match);
      setScanFeedback(`Found registration for ${match.fullName}`);
    } else {
      setScanFeedback(`No registration matching "${query}". Check code and retry.`);
    }
  }, [attendees]);

  // Start Camera Stream
  const startCamera = useCallback(async (overrideFacingMode?: 'user' | 'environment') => {
    setCameraError(null);
    setErrorType(null);
    setIsInitializing(true);

    const targetFacingMode = overrideFacingMode || facingMode;

    if (!navigator.mediaDevices || !navigator.mediaDevices.getUserMedia) {
      setIsInitializing(false);
      setCameraError('Camera API is not supported in this browser.');
      setErrorType('other');
      return;
    }

    if (mediaStreamRef.current) {
      mediaStreamRef.current.getTracks().forEach(t => t.stop());
      mediaStreamRef.current = null;
    }

    try {
      let stream: MediaStream | null = null;
      try {
        stream = await navigator.mediaDevices.getUserMedia({
          video: {
            facingMode: targetFacingMode,
            width: { ideal: 1280 },
            height: { ideal: 720 }
          },
          audio: false
        });
      } catch (err1) {
        console.warn('Attempting generic camera constraints for scanner...', err1);
        try {
          stream = await navigator.mediaDevices.getUserMedia({
            video: { facingMode: targetFacingMode },
            audio: false
          });
        } catch (err2) {
          stream = await navigator.mediaDevices.getUserMedia({
            video: true,
            audio: false
          });
        }
      }

      if (!stream) throw new Error('Could not start video stream.');

      mediaStreamRef.current = stream;
      setCameraActive(true);
      setIsInitializing(false);

      if (videoRef.current) {
        videoRef.current.srcObject = stream;
        videoRef.current.onloadedmetadata = () => {
          videoRef.current?.play().catch(e => console.warn('Scanner video play error:', e));
        };
      }

      // Initialize native BarcodeDetector if available in browser
      if (typeof window !== 'undefined' && 'BarcodeDetector' in window) {
        try {
          const barcodeDetector = new (window as any).BarcodeDetector({
            formats: ['qr_code', 'code_128', 'code_39', 'ean_13']
          });

          scanIntervalRef.current = window.setInterval(async () => {
            if (videoRef.current && videoRef.current.readyState >= 2) {
              try {
                const barcodes = await barcodeDetector.detect(videoRef.current);
                if (barcodes && barcodes.length > 0) {
                  const rawValue = barcodes[0].rawValue;
                  if (rawValue) {
                    handleLookup(rawValue);
                  }
                }
              } catch (e) {
                // Ignore transient frame detection drops
              }
            }
          }, 600);
        } catch (e) {
          console.warn('Native BarcodeDetector not supported in this context:', e);
        }
      }
    } catch (err: any) {
      console.error('Gate scanner camera access error:', err);
      setIsInitializing(false);
      setCameraActive(false);

      if (err.name === 'NotAllowedError' || err.name === 'PermissionDeniedError') {
        setErrorType('permission_denied');
        setCameraError('Camera access permission was denied. Please allow camera access in your browser.');
      } else if (err.name === 'NotFoundError' || err.name === 'DevicesNotFoundError') {
        setErrorType('no_hardware');
        setCameraError('No camera detected on this device. You can type or paste badge codes below.');
      } else if (err.name === 'NotReadableError' || err.name === 'TrackStartError') {
        setErrorType('in_use');
        setCameraError('Camera is in use by another application. Please close other camera tabs.');
      } else {
        setErrorType('other');
        setCameraError(err.message || 'Could not open camera.');
      }
    }
  }, [facingMode, handleLookup]);

  // Start camera when modal opens
  useEffect(() => {
    if (isOpen) {
      startCamera();
    } else {
      stopCamera();
      setScannedAttendee(null);
      setScanFeedback(null);
      setManualCode('');
    }
    return () => {
      stopCamera();
    };
  }, [isOpen, startCamera, stopCamera]);

  const toggleFacing = () => {
    const next = facingMode === 'environment' ? 'user' : 'environment';
    setFacingMode(next);
    startCamera(next);
  };

  const executeCheckIn = () => {
    if (!scannedAttendee) return;
    const ok = onToggleCheckIn(scannedAttendee.ticketNumber);
    if (ok) {
      setScannedAttendee(prev => prev ? {
        ...prev,
        checkedIn: !prev.checkedIn,
        checkedInAt: !prev.checkedIn ? new Date().toISOString() : undefined
      } : null);
      setScanFeedback(scannedAttendee.checkedIn ? 'Check-in cancelled' : 'Checked In Successfully at Shehu Musa Yar\'Adua Centre!');
    }
  };

  const handleToggleAttendeeCheckIn = () => {
    if (!scannedAttendee) return;
    const isVisitor = scannedAttendee.passType === 'visitor' || scannedAttendee.tier.toLowerCase().includes('visitor') || scannedAttendee.tier.toLowerCase().includes('free') || scannedAttendee.amountPaid === '₦0' || scannedAttendee.amountPaid === 'Free' || scannedAttendee.amountPaid === '$0';
    const isApproved = isVisitor || scannedAttendee.adminApproved === true || scannedAttendee.adminApprovalStatus === 'APPROVED';
    if (!scannedAttendee.checkedIn && !isApproved) {
      setShowOverrideConfirm(true);
      return;
    }
    executeCheckIn();
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[120] bg-black/85 backdrop-blur-md flex items-center justify-center p-4 overflow-y-auto">
      <div className="relative w-full max-w-2xl bg-[#031c11] border border-emerald-500/40 rounded-3xl p-5 sm:p-6 shadow-2xl space-y-5 animate-in fade-in zoom-in-95">
        
        {/* Header */}
        <div className="flex items-center justify-between border-b border-white/10 pb-4">
          <div className="flex items-center gap-3">
            <div className="p-2.5 rounded-2xl bg-emerald-500/20 text-emerald-300 border border-emerald-500/30">
              <QrCode className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-base sm:text-lg font-black text-white font-display flex items-center gap-2">
                Gate QR Scanner & Check-In Desk
                <span className="px-2 py-0.5 rounded-full text-[10px] bg-emerald-500 text-emerald-950 font-bold uppercase tracking-wider">
                  Live Camera
                </span>
              </h3>
              <p className="text-xs text-slate-400">
                Scan attendee badge QR codes or enter ticket numbers to verify entry at Shehu Musa Yar'Adua Centre.
              </p>
            </div>
          </div>

          <button
            type="button"
            onClick={() => {
              stopCamera();
              onClose();
            }}
            className="p-2 rounded-xl bg-white/10 hover:bg-white/20 text-slate-300 hover:text-white cursor-pointer transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Live Camera Viewfinder Box */}
        <div className="relative rounded-2xl overflow-hidden bg-black border-2 border-emerald-500/50 aspect-video sm:aspect-[16/9] flex items-center justify-center shadow-inner">
          {isInitializing && (
            <div className="flex flex-col items-center gap-2 text-center p-4">
              <Loader2 className="w-8 h-8 text-emerald-400 animate-spin" />
              <span className="text-xs font-bold text-white">Opening Camera Gateway...</span>
            </div>
          )}

          {cameraError && !isInitializing && (
            <div className="p-5 text-center space-y-3 max-w-md">
              <div className="w-12 h-12 mx-auto rounded-full bg-red-500/20 border border-red-500/40 flex items-center justify-center text-red-400">
                <AlertCircle className="w-6 h-6" />
              </div>
              <div className="text-sm font-bold text-white">Camera Access Notice</div>
              <p className="text-xs text-slate-300">{cameraError}</p>

              {errorType === 'permission_denied' && (
                <div className="p-3 rounded-xl bg-amber-500/10 border border-amber-500/30 text-amber-200 text-left text-xs space-y-1">
                  <div className="font-bold flex items-center gap-1 text-amber-300">
                    <ShieldAlert className="w-3.5 h-3.5" />
                    <span>Permission Guide:</span>
                  </div>
                  <p className="text-[11px] text-slate-300">
                    Click the padlock or camera icon in your browser's address bar and set Camera to <strong>Allow</strong>, then retry.
                  </p>
                </div>
              )}

              <div className="flex justify-center gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => startCamera()}
                  className="px-4 py-2 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-emerald-950 font-bold text-xs flex items-center gap-1.5 cursor-pointer shadow-md"
                >
                  <RefreshCw className="w-3.5 h-3.5" />
                  <span>Retry Camera Permission</span>
                </button>
              </div>
            </div>
          )}

          {!cameraError && !isInitializing && (
            <>
              <video
                ref={videoRef}
                autoPlay
                playsInline
                muted
                className={`w-full h-full object-cover ${facingMode === 'user' ? 'scale-x-[-1]' : ''}`}
              />

              {/* Scanning Target Box */}
              <div className="absolute inset-8 sm:inset-12 border-2 border-emerald-400/80 rounded-2xl pointer-events-none flex flex-col items-center justify-between p-3">
                <div className="text-[10px] font-bold text-emerald-300 bg-black/70 px-3 py-1 rounded-full backdrop-blur-md flex items-center gap-1.5">
                  <div className="w-2 h-2 rounded-full bg-emerald-400 animate-ping" />
                  <span>Align Badge QR Code Here</span>
                </div>
                <div className="w-full h-0.5 bg-gradient-to-r from-transparent via-emerald-400 to-transparent animate-pulse" />
                <div className="text-[9px] font-mono text-slate-300 bg-black/70 px-2 py-0.5 rounded backdrop-blur-md">
                  RECON EXPO 2026 GATE CHECK-IN
                </div>
              </div>

              {/* Top Controls Overlay */}
              <div className="absolute top-3 right-3 flex items-center gap-2">
                <button
                  type="button"
                  onClick={toggleFacing}
                  className="px-2.5 py-1.5 rounded-xl bg-black/70 hover:bg-black/90 text-slate-200 border border-white/20 text-xs font-bold flex items-center gap-1.5 backdrop-blur-md cursor-pointer transition-colors"
                >
                  <FlipHorizontal className="w-3.5 h-3.5 text-emerald-400" />
                  <span>{facingMode === 'environment' ? 'Rear' : 'Front'}</span>
                </button>
              </div>
            </>
          )}
        </div>

        {/* Manual Lookup & Search */}
        <div className="space-y-2">
          <label className="block text-[11px] uppercase tracking-wider font-bold text-slate-400">
            Manual Ticket ID / Barcode Search:
          </label>
          <div className="flex gap-2">
            <div className="relative flex-1">
              <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                value={manualCode}
                onChange={(e) => setManualCode(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && handleLookup(manualCode)}
                placeholder="Enter Ticket ID (e.g. RECON-2026-...) or Name..."
                className="w-full pl-9 pr-3 py-2.5 bg-black/40 border border-white/15 rounded-xl text-slate-100 placeholder-slate-500 text-xs focus:border-emerald-400 focus:outline-none"
              />
            </div>
            <button
              type="button"
              onClick={() => handleLookup(manualCode)}
              className="px-4 py-2.5 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-emerald-950 font-bold text-xs flex items-center gap-1.5 cursor-pointer shadow-md transition-colors"
            >
              <Search className="w-3.5 h-3.5" />
              <span>Lookup</span>
            </button>
          </div>
        </div>

        {/* Feedback banner */}
        {scanFeedback && (
          <div className={`p-3 rounded-xl text-xs flex items-center gap-2 ${
            scannedAttendee ? 'bg-emerald-500/20 border border-emerald-500/40 text-emerald-200' : 'bg-amber-500/20 border border-amber-500/40 text-amber-200'
          }`}>
            {scannedAttendee ? <CheckCircle2 className="w-4 h-4 text-emerald-400 flex-shrink-0" /> : <AlertCircle className="w-4 h-4 text-amber-400 flex-shrink-0" />}
            <span>{scanFeedback}</span>
          </div>
        )}

        {/* Scanned Delegate Verification Card */}
        {scannedAttendee && (
          <div className="p-4 rounded-2xl bg-white/5 border border-emerald-500/50 space-y-4 animate-in fade-in">
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 border-b border-white/10 pb-3">
              <div className="flex items-center gap-3">
                {scannedAttendee.photoUrl ? (
                  <img
                    src={scannedAttendee.photoUrl}
                    alt={scannedAttendee.fullName}
                    className="w-14 h-14 rounded-xl object-cover ring-2 ring-emerald-400 shadow-md"
                    referrerPolicy="no-referrer"
                  />
                ) : (
                  <div className="w-14 h-14 rounded-xl bg-emerald-500/20 text-emerald-400 flex items-center justify-center font-bold text-lg ring-2 ring-emerald-400">
                    {scannedAttendee.fullName.charAt(0)}
                  </div>
                )}
                <div>
                  <div className="flex items-center gap-1.5 flex-wrap">
                    <h4 className="text-sm font-black text-white">{scannedAttendee.fullName}</h4>
                    <span className="inline-flex items-center gap-0.5 px-1.5 py-0.2 rounded-full bg-blue-600 text-white text-[9px] font-black border border-blue-400">
                      <CheckCircle2 className="w-2.5 h-2.5 fill-white text-blue-600" />
                      <span>VERIFIED</span>
                    </span>
                  </div>
                  <p className="text-xs text-slate-300 flex items-center gap-1 mt-0.5">
                    <Building2 className="w-3.5 h-3.5 text-amber-400" />
                    <span>{scannedAttendee.organization || 'Independent Delegate'}</span>
                  </p>
                  <div className="flex items-center gap-2 mt-1">
                    <span className="text-[10px] font-mono text-emerald-400 font-bold">
                      {scannedAttendee.ticketNumber}
                    </span>
                    <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-white/10 text-slate-200">
                      {scannedAttendee.tier}
                    </span>
                  </div>
                </div>
              </div>

              {/* Check-In Status Badge */}
              <div className="text-right">
                <div className={`px-3 py-1 rounded-xl text-xs font-black inline-flex items-center gap-1.5 ${
                  scannedAttendee.checkedIn 
                    ? 'bg-emerald-500 text-emerald-950 shadow-lg shadow-emerald-500/30' 
                    : 'bg-amber-500/20 text-amber-300 border border-amber-500/30'
                }`}>
                  {scannedAttendee.checkedIn ? (
                    <>
                      <UserCheck className="w-4 h-4" />
                      <span>CHECKED IN</span>
                    </>
                  ) : (
                    <>
                      <Clock className="w-4 h-4" />
                      <span>AWAITING GATE ENTRY</span>
                    </>
                  )}
                </div>
                {scannedAttendee.checkedInAt && (
                  <div className="text-[10px] text-slate-400 mt-1">
                    {new Date(scannedAttendee.checkedInAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                  </div>
                )}
              </div>
            </div>

            {/* Actions */}
            <div className="flex items-center justify-between gap-3 pt-1">
              <button
                type="button"
                onClick={handleToggleAttendeeCheckIn}
                className={`py-2.5 px-6 rounded-xl font-black text-xs uppercase tracking-wider flex items-center gap-2 transition-all cursor-pointer shadow-lg active:scale-95 ${
                  scannedAttendee.checkedIn
                    ? 'bg-red-500/20 hover:bg-red-500/30 text-red-300 border border-red-500/40'
                    : 'bg-gradient-to-r from-emerald-500 to-emerald-400 hover:from-emerald-400 hover:to-emerald-300 text-emerald-950'
                }`}
              >
                {scannedAttendee.checkedIn ? (
                  <>
                    <UserX className="w-4 h-4" />
                    <span>Undo Gate Check-In</span>
                  </>
                ) : (
                  <>
                    <UserCheck className="w-4 h-4" />
                    <span>Confirm Gate Entry & Check-In</span>
                  </>
                )}
              </button>

              <button
                type="button"
                onClick={() => {
                  setScannedAttendee(null);
                  setScanFeedback(null);
                }}
                className="text-xs text-slate-400 hover:text-white cursor-pointer"
              >
                Clear
              </button>
            </div>
          </div>
        )}

        {/* Payment Unapproved Gate Override Confirmation Dialog */}
        {showOverrideConfirm && scannedAttendee && (
          <div className="fixed inset-0 z-[150] flex items-center justify-center p-4 bg-black/85 backdrop-blur-md animate-fade-in">
            <div className="bg-[#031d17] border border-amber-500/40 rounded-2xl p-6 max-w-md w-full shadow-2xl space-y-4 text-left">
              <div className="flex items-start gap-3">
                <div className="w-10 h-10 rounded-full bg-amber-500/20 border border-amber-500/40 flex items-center justify-center text-amber-400 flex-shrink-0 mt-0.5">
                  <ShieldAlert className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="text-base font-extrabold text-white font-display">Payment Unapproved by Admin</h3>
                  <p className="text-xs text-slate-300 mt-1 leading-relaxed">
                    Delegate: <strong className="text-white">{scannedAttendee.fullName}</strong> ({scannedAttendee.tier})<br/>
                    Ticket: <span className="font-mono text-emerald-400">{scannedAttendee.ticketNumber}</span><br/><br/>
                    This payment has not been marked as approved by Secretariat Finance yet. Are you sure you want to override and permit entry?
                  </p>
                </div>
              </div>
              <div className="flex items-center justify-end gap-3 pt-3 border-t border-white/10">
                <button
                  type="button"
                  onClick={() => setShowOverrideConfirm(false)}
                  className="px-4 py-2 rounded-xl bg-white/10 hover:bg-white/20 text-slate-300 text-xs font-bold transition-colors cursor-pointer"
                >
                  Deny Entry
                </button>
                <button
                  type="button"
                  onClick={() => {
                    setShowOverrideConfirm(false);
                    executeCheckIn();
                  }}
                  className="px-5 py-2 rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-950 text-xs font-extrabold transition-all cursor-pointer shadow-lg"
                >
                  Override & Allow Entry
                </button>
              </div>
            </div>
          </div>
        )}

      </div>
    </div>
  );
};
