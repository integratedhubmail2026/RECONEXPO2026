import React, { useState, useRef, useEffect, useCallback } from 'react';
import { 
  Camera, 
  Upload, 
  RefreshCw, 
  Check, 
  AlertCircle, 
  X, 
  User, 
  FlipHorizontal, 
  ShieldAlert, 
  Loader2,
  Sun,
  Moon,
  Zap,
  Lightbulb,
  SunMedium,
  RotateCcw,
  Sliders,
  CheckCircle2
} from 'lucide-react';

interface PhotoCaptureStudioProps {
  currentPhotoUrl?: string;
  onPhotoSelected?: (photoUrl: string) => void;
  fullName?: string;
  isOpen?: boolean;
  onClose?: () => void;
  onPhotoCaptured?: (photoUrl: string) => void;
}

// Helper: Calculate average luminance (0 - 255) from canvas context
function calculateAverageBrightness(ctx: CanvasRenderingContext2D, width: number, height: number): number {
  try {
    // Sample the center region (where the face usually is)
    const sampleW = Math.max(20, Math.floor(width * 0.6));
    const sampleH = Math.max(20, Math.floor(height * 0.6));
    const sampleX = Math.floor((width - sampleW) / 2);
    const sampleY = Math.floor((height - sampleH) / 2);

    const imgData = ctx.getImageData(sampleX, sampleY, sampleW, sampleH);
    const data = imgData.data;
    let totalLuminance = 0;
    const pixelCount = data.length / 4;

    for (let i = 0; i < data.length; i += 4) {
      const r = data[i];
      const g = data[i + 1];
      const b = data[i + 2];
      // Standard perceptual luminance formula
      const lum = 0.299 * r + 0.587 * g + 0.114 * b;
      totalLuminance += lum;
    }

    return pixelCount > 0 ? totalLuminance / pixelCount : 128;
  } catch (e) {
    console.warn('Brightness calculation warning:', e);
    return 128;
  }
}

// Helper: Auto-enhance/brighten a dark canvas
function autoBrightenCanvas(canvas: HTMLCanvasElement, factor: number = 1.45): string {
  const ctx = canvas.getContext('2d');
  if (!ctx) return canvas.toDataURL('image/jpeg', 0.92);

  const imgData = ctx.getImageData(0, 0, canvas.width, canvas.height);
  const data = imgData.data;

  for (let i = 0; i < data.length; i += 4) {
    // Gamma correction / brightening
    data[i] = Math.min(255, Math.pow(data[i] / 255, 0.65) * 255 * factor);
    data[i + 1] = Math.min(255, Math.pow(data[i + 1] / 255, 0.65) * 255 * factor);
    data[i + 2] = Math.min(255, Math.pow(data[i + 2] / 255, 0.65) * 255 * factor);
  }

  ctx.putImageData(imgData, 0, 0);
  return canvas.toDataURL('image/jpeg', 0.92);
}

export const PhotoCaptureStudio: React.FC<PhotoCaptureStudioProps> = ({
  currentPhotoUrl,
  onPhotoSelected,
  fullName: _fullName,
  onPhotoCaptured
}) => {
  const emitPhotoSelected = (url: string) => {
    if (onPhotoSelected) onPhotoSelected(url);
    if (onPhotoCaptured) onPhotoCaptured(url);
  };
  const [mode, setMode] = useState<'options' | 'camera' | 'upload'>('options');
  const [photoPreview, setPhotoPreview] = useState<string>(currentPhotoUrl || '');
  const [cameraActive, setCameraActive] = useState(false);
  const [isInitializing, setIsInitializing] = useState(false);
  const [cameraError, setCameraError] = useState<string | null>(null);
  const [errorType, setErrorType] = useState<'permission_denied' | 'no_hardware' | 'in_use' | 'other' | null>(null);
  const [facingMode, setFacingMode] = useState<'user' | 'environment'>('user');
  const [countdown, setCountdown] = useState<number | null>(null);
  const [_showPermissionGuide, setShowPermissionGuide] = useState(false);
  
  // Real-time lighting detection states
  const [currentLuminance, setCurrentLuminance] = useState<number>(120);
  const [isLowLight, setIsLowLight] = useState<boolean>(false);
  const [screenFillLight, setScreenFillLight] = useState<boolean>(false);
  
  // Captured Dark Photo review modal
  const [darkPhotoReview, setDarkPhotoReview] = useState<{
    dataUrl: string;
    rawCanvas: HTMLCanvasElement;
    luminance: number;
  } | null>(null);

  const videoRef = useRef<HTMLVideoElement>(null);
  const mediaStreamRef = useRef<MediaStream | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const lightMonitorIntervalRef = useRef<number | null>(null);

  // Stop camera stream when unmounting or switching modes
  const stopCamera = useCallback(() => {
    if (lightMonitorIntervalRef.current) {
      clearInterval(lightMonitorIntervalRef.current);
      lightMonitorIntervalRef.current = null;
    }
    if (mediaStreamRef.current) {
      mediaStreamRef.current.getTracks().forEach(track => {
        try {
          track.stop();
        } catch (e) {
          console.warn('Error stopping media track:', e);
        }
      });
      mediaStreamRef.current = null;
    }
    if (videoRef.current) {
      videoRef.current.srcObject = null;
    }
    setCameraActive(false);
    setIsInitializing(false);
    setCountdown(null);
    setScreenFillLight(false);
  }, []);

  useEffect(() => {
    return () => {
      stopCamera();
    };
  }, [stopCamera]);

  // Periodic real-time live video frame lighting analyzer
  useEffect(() => {
    if (cameraActive && mode === 'camera' && videoRef.current) {
      const offscreenCanvas = document.createElement('canvas');
      offscreenCanvas.width = 160;
      offscreenCanvas.height = 160;
      const offscreenCtx = offscreenCanvas.getContext('2d', { willReadFrequently: true });

      lightMonitorIntervalRef.current = window.setInterval(() => {
        const video = videoRef.current;
        if (video && video.readyState >= 2 && offscreenCtx) {
          try {
            offscreenCtx.drawImage(video, 0, 0, 160, 160);
            const lum = calculateAverageBrightness(offscreenCtx, 160, 160);
            setCurrentLuminance(Math.round(lum));
            // Consider dark if luminance < 65 out of 255 (~25% brightness)
            setIsLowLight(lum < 68);
          } catch (e) {
            // Ignore minor canvas drawing frames
          }
        }
      }, 450);
    } else {
      if (lightMonitorIntervalRef.current) {
        clearInterval(lightMonitorIntervalRef.current);
        lightMonitorIntervalRef.current = null;
      }
    }

    return () => {
      if (lightMonitorIntervalRef.current) {
        clearInterval(lightMonitorIntervalRef.current);
        lightMonitorIntervalRef.current = null;
      }
    };
  }, [cameraActive, mode]);

  // Securely attach stream to video element whenever mode or stream updates
  useEffect(() => {
    if (mode === 'camera' && mediaStreamRef.current && videoRef.current) {
      const video = videoRef.current;
      video.srcObject = mediaStreamRef.current;
      video.onloadedmetadata = () => {
        video.play().catch(e => console.warn('Auto-play blocked or delayed:', e));
      };
    }
  }, [mode, cameraActive]);

  // Start Live Webcam with multi-tiered fallback constraints
  const startCamera = async (overrideFacingMode?: 'user' | 'environment') => {
    setCameraError(null);
    setErrorType(null);
    setShowPermissionGuide(false);
    setIsInitializing(true);
    setDarkPhotoReview(null);
    setMode('camera');

    const targetFacingMode = overrideFacingMode || facingMode;

    // Check mediaDevices support
    if (!navigator.mediaDevices || !navigator.mediaDevices.getUserMedia) {
      setIsInitializing(false);
      setCameraError('Camera API is not supported in this browser environment. Please upload a photo instead.');
      setErrorType('other');
      return;
    }

    // Stop any existing stream before starting a new one
    if (mediaStreamRef.current) {
      mediaStreamRef.current.getTracks().forEach(track => track.stop());
      mediaStreamRef.current = null;
    }

    try {
      let stream: MediaStream | null = null;

      // Tier 1: Try with ideal portrait constraints
      try {
        stream = await navigator.mediaDevices.getUserMedia({
          video: {
            facingMode: targetFacingMode,
            width: { ideal: 720 },
            height: { ideal: 720 }
          },
          audio: false
        });
      } catch (firstErr: any) {
        console.warn('Tier 1 camera constraints failed, attempting fallback generic constraints...', firstErr);
        // Tier 2: Fallback to basic video constraint without dimension limitations
        try {
          stream = await navigator.mediaDevices.getUserMedia({
            video: { facingMode: targetFacingMode },
            audio: false
          });
        } catch (secondErr: any) {
          console.warn('Tier 2 camera constraints failed, attempting unconstrained fallback...', secondErr);
          // Tier 3: Pure unconstrained video
          stream = await navigator.mediaDevices.getUserMedia({
            video: true,
            audio: false
          });
        }
      }

      if (!stream) {
        throw new Error('Could not establish video stream.');
      }

      mediaStreamRef.current = stream;
      setCameraActive(true);
      setIsInitializing(false);

      // Bind to video ref if already rendered
      if (videoRef.current) {
        videoRef.current.srcObject = stream;
        videoRef.current.onloadedmetadata = () => {
          videoRef.current?.play().catch(e => console.warn('Video play interrupted:', e));
        };
      }
    } catch (err: any) {
      console.error('Camera access error:', err);
      setIsInitializing(false);
      setCameraActive(false);

      if (err.name === 'NotAllowedError' || err.name === 'PermissionDeniedError') {
        setErrorType('permission_denied');
        setCameraError('Camera access permission was denied. Please allow camera permissions in your browser bar.');
        setShowPermissionGuide(true);
      } else if (err.name === 'NotFoundError' || err.name === 'DevicesNotFoundError') {
        setErrorType('no_hardware');
        setCameraError('No active camera hardware found on this device. You can upload a photo directly from your files.');
      } else if (err.name === 'NotReadableError' || err.name === 'TrackStartError') {
        setErrorType('in_use');
        setCameraError('Camera is currently locked or in use by another application. Please close other camera tabs/apps and retry.');
      } else {
        setErrorType('other');
        setCameraError(err.message || 'Unable to access camera. Please check your browser device permissions.');
      }
    }
  };

  // Toggle Front / Rear Camera
  const toggleFacingMode = () => {
    const nextMode = facingMode === 'user' ? 'environment' : 'user';
    setFacingMode(nextMode);
    startCamera(nextMode);
  };

  // Capture Photo with optional 3-second timer
  const triggerCapture = () => {
    setCountdown(3);
    const interval = setInterval(() => {
      setCountdown(prev => {
        if (prev === null || prev <= 1) {
          clearInterval(interval);
          performCapture();
          return null;
        }
        return prev - 1;
      });
    }, 1000);
  };

  const performCapture = () => {
    if (!videoRef.current) return;
    const video = videoRef.current;
    
    // Ensure video has received frames
    const vWidth = video.videoWidth || 640;
    const vHeight = video.videoHeight || 480;
    const size = Math.min(vWidth, vHeight);

    const canvas = document.createElement('canvas');
    canvas.width = 600;
    canvas.height = 600;
    const ctx = canvas.getContext('2d', { willReadFrequently: true });
    if (!ctx) return;

    // Crop square center
    const sx = (vWidth - size) / 2;
    const sy = (vHeight - size) / 2;

    // Mirror if front camera
    if (facingMode === 'user') {
      ctx.translate(600, 0);
      ctx.scale(-1, 1);
    }

    ctx.drawImage(video, sx, sy, size, size, 0, 0, 600, 600);

    // Calculate actual captured brightness
    const capturedLuminance = calculateAverageBrightness(ctx, 600, 600);
    const dataUrl = canvas.toDataURL('image/jpeg', 0.92);

    // If photo is too dark (Luminance < 68/255), prompt user with dark warning & action choices
    if (capturedLuminance < 68) {
      setDarkPhotoReview({
        dataUrl,
        rawCanvas: canvas,
        luminance: Math.round(capturedLuminance)
      });
      return;
    }

    // Photo has sufficient lighting
    setPhotoPreview(dataUrl);
    emitPhotoSelected(dataUrl);
    stopCamera();
    setMode('options');
  };

  // Accept dark photo anyway
  const handleAcceptDarkPhoto = () => {
    if (!darkPhotoReview) return;
    setPhotoPreview(darkPhotoReview.dataUrl);
    emitPhotoSelected(darkPhotoReview.dataUrl);
    setDarkPhotoReview(null);
    stopCamera();
    setMode('options');
  };

  // Auto-brighten dark photo
  const handleAutoEnhancePhoto = () => {
    if (!darkPhotoReview) return;
    const brightenedUrl = autoBrightenCanvas(darkPhotoReview.rawCanvas);
    setPhotoPreview(brightenedUrl);
    emitPhotoSelected(brightenedUrl);
    setDarkPhotoReview(null);
    stopCamera();
    setMode('options');
  };

  // Retake photo in better light
  const handleRetakeDarkPhoto = () => {
    setDarkPhotoReview(null);
    if (!cameraActive) {
      startCamera();
    }
  };

  // Handle File Upload with dark image detection
  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (!file.type.startsWith('image/')) {
      alert('Please select an image file (JPG, PNG, or WEBP)');
      return;
    }

    const reader = new FileReader();
    reader.onload = (event) => {
      const result = event.target?.result as string;
      
      // Analyze uploaded image brightness
      const img = new Image();
      img.onload = () => {
        const c = document.createElement('canvas');
        c.width = 600;
        c.height = 600;
        const ctx = c.getContext('2d', { willReadFrequently: true });
        if (ctx) {
          ctx.drawImage(img, 0, 0, 600, 600);
          const lum = calculateAverageBrightness(ctx, 600, 600);
          if (lum < 68) {
            setDarkPhotoReview({
              dataUrl: result,
              rawCanvas: c,
              luminance: Math.round(lum)
            });
            return;
          }
        }
        setPhotoPreview(result);
        emitPhotoSelected(result);
        setMode('options');
      };
      img.src = result;
    };
    reader.readAsDataURL(file);
  };

  // Convert luminance 0-255 to percentage
  const lightPercentage = Math.min(100, Math.round((currentLuminance / 255) * 100));

  return (
    <div className="w-full" id="photo-capture-studio-container">
      {/* Current Photo Status & Preview */}
      <div className="flex flex-col sm:flex-row items-center gap-5 p-4 rounded-2xl bg-white/5 border border-white/10 mb-4">
        {/* Photo Preview */}
        <div className="relative flex-shrink-0">
          <div className="w-24 h-24 sm:w-28 sm:h-28 rounded-2xl p-1 bg-gradient-to-tr from-emerald-500 via-amber-400 to-emerald-400 ring-2 ring-white/20 overflow-hidden shadow-xl">
            {photoPreview ? (
              <img 
                src={photoPreview} 
                alt="Delegate Portrait" 
                className="w-full h-full object-cover rounded-xl"
                referrerPolicy="no-referrer"
              />
            ) : (
              <div className="w-full h-full bg-[#02180e] rounded-xl flex flex-col items-center justify-center text-slate-400">
                <User className="w-10 h-10 text-slate-400 mb-0.5" />
                <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">No Photo</span>
              </div>
            )}
          </div>
          {photoPreview && (
            <div className="absolute -top-1.5 -right-1.5 p-1 rounded-full bg-emerald-500 text-black shadow-md">
              <Check className="w-3.5 h-3.5 stroke-[3]" />
            </div>
          )}
        </div>

        {/* Action Prompt */}
        <div className="flex-1 text-center sm:text-left">
          <div className="flex items-center justify-center sm:justify-start gap-2">
            <h4 className="text-sm font-extrabold text-white">
              {photoPreview ? 'ID Badge Photo Ready' : 'Add Photo for Smart ID Badge'}
            </h4>
            {photoPreview && (
              <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-emerald-500/20 text-emerald-300 border border-emerald-500/30">
                Active
              </span>
            )}
          </div>
          <p className="text-xs text-slate-300 mt-0.5 leading-relaxed">
            Take a live selfie photo with lighting check or upload a picture for your RECON 2026 Smart ID pass.
          </p>

          {/* Quick Option Buttons */}
          <div className="flex flex-wrap items-center gap-2 mt-3 justify-center sm:justify-start">
            <button
              type="button"
              id="btn-snap-camera"
              onClick={() => startCamera()}
              className="py-2 px-3.5 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-emerald-950 font-bold text-xs flex items-center gap-1.5 transition-all cursor-pointer shadow-md active:scale-95"
            >
              <Camera className="w-3.5 h-3.5" />
              <span>{photoPreview ? 'Retake Live Photo' : 'Snap Live Photo'}</span>
            </button>

            <button
              type="button"
              id="btn-upload-photo"
              onClick={() => fileInputRef.current?.click()}
              className="py-2 px-3.5 rounded-xl bg-white/10 hover:bg-white/15 border border-white/20 text-white font-bold text-xs flex items-center gap-1.5 transition-colors cursor-pointer"
            >
              <Upload className="w-3.5 h-3.5 text-amber-300" />
              <span>Upload Picture</span>
            </button>
          </div>
        </div>
      </div>

      {/* Hidden File Input */}
      <input 
        ref={fileInputRef}
        type="file"
        accept="image/*"
        onChange={handleFileUpload}
        className="hidden"
      />

      {/* Dark Photo Detection & Recapture Warning Dialog */}
      {darkPhotoReview && (
        <div className="p-5 rounded-3xl bg-[#1c1204] border-2 border-amber-500/70 shadow-2xl mb-4 animate-in fade-in zoom-in-95 space-y-4">
          <div className="flex items-start gap-3">
            <div className="p-2.5 rounded-2xl bg-amber-500/20 text-amber-400 border border-amber-500/40 flex-shrink-0">
              <Moon className="w-6 h-6 animate-pulse" />
            </div>
            <div className="flex-1">
              <div className="flex items-center gap-2">
                <h4 className="text-sm font-black text-amber-300">
                  Dark Photo Detected ({darkPhotoReview.luminance}/255 Light Level)
                </h4>
                <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-amber-500/30 text-amber-200 border border-amber-500/40">
                  Low Light Warning
                </span>
              </div>
              <p className="text-xs text-slate-200 mt-1 leading-relaxed">
                This picture is too dark for official identification and badge printing at <strong>Shehu Musa Yar'Adua Centre</strong>. 
                Please snap a brighter picture in a well-lit area or use screen illumination.
              </p>
            </div>
          </div>

          {/* Side-by-side preview and guidance */}
          <div className="flex flex-col sm:flex-row items-center gap-4 p-3.5 rounded-2xl bg-black/50 border border-white/10">
            <img 
              src={darkPhotoReview.dataUrl} 
              alt="Dark Capture Preview" 
              className="w-24 h-24 rounded-xl object-cover ring-2 ring-amber-500/50"
            />
            <div className="text-xs text-slate-300 space-y-1.5 flex-1">
              <div className="font-bold text-amber-200 flex items-center gap-1.5">
                <Lightbulb className="w-4 h-4 text-amber-400" />
                <span>Tips for a sharp, bright badge photo:</span>
              </div>
              <ul className="list-disc list-inside text-[11px] text-slate-300 space-y-1">
                <li>Face towards a window, indoor ceiling light, or lamp.</li>
                <li>Avoid sitting directly in front of a bright background (backlighting).</li>
                <li>Turn on the <strong className="text-amber-300">"Screen Flash / Fill Light"</strong> in the camera studio.</li>
              </ul>
            </div>
          </div>

          {/* Action buttons */}
          <div className="flex flex-wrap items-center gap-2.5 pt-1">
            <button
              type="button"
              onClick={handleRetakeDarkPhoto}
              className="py-2.5 px-4 rounded-xl bg-gradient-to-r from-amber-400 to-amber-500 hover:from-amber-300 hover:to-amber-400 text-amber-950 font-black text-xs uppercase tracking-wider flex items-center gap-2 shadow-lg shadow-amber-950/50 cursor-pointer active:scale-95 transition-all"
            >
              <Camera className="w-4 h-4" />
              <span>Snap Brighter Picture</span>
            </button>

            <button
              type="button"
              onClick={handleAutoEnhancePhoto}
              className="py-2.5 px-3.5 rounded-xl bg-emerald-500/20 hover:bg-emerald-500/30 text-emerald-300 border border-emerald-500/40 font-bold text-xs flex items-center gap-1.5 cursor-pointer transition-colors"
              title="Automatically brighten and boost exposure"
            >
              <Sliders className="w-3.5 h-3.5" />
              <span>Auto-Brighten Photo</span>
            </button>

            <button
              type="button"
              onClick={handleAcceptDarkPhoto}
              className="py-2.5 px-3 rounded-xl bg-transparent hover:bg-white/5 text-slate-400 hover:text-slate-200 text-xs cursor-pointer ml-auto"
            >
              Use Anyway
            </button>
          </div>
        </div>
      )}

      {/* Live Camera Viewfinder Overlay */}
      {mode === 'camera' && !darkPhotoReview && (
        <div className={`p-4 rounded-2xl border transition-all duration-300 mb-4 animate-in fade-in shadow-2xl ${
          screenFillLight 
            ? 'bg-white text-slate-900 border-amber-300 ring-8 ring-white/70 shadow-[0_0_50px_rgba(255,255,255,0.7)]' 
            : 'bg-black/95 border-emerald-500/50'
        }`}>
          <div className="flex items-center justify-between mb-3">
            <div className="flex items-center gap-2">
              <div className="w-2.5 h-2.5 rounded-full bg-red-500 animate-ping" />
              <span className={`text-xs font-bold flex items-center gap-1.5 ${screenFillLight ? 'text-slate-900' : 'text-emerald-400'}`}>
                <Camera className="w-4 h-4" />
                Live Camera ID Studio
              </span>
            </div>

            <div className="flex items-center gap-1.5">
              {/* Screen Fill-Light / Flash Toggle */}
              {cameraActive && (
                <button
                  type="button"
                  onClick={() => setScreenFillLight(!screenFillLight)}
                  className={`px-2.5 py-1 rounded-lg text-xs font-bold flex items-center gap-1.5 transition-all cursor-pointer ${
                    screenFillLight
                      ? 'bg-amber-400 text-amber-950 shadow-md ring-1 ring-amber-500'
                      : 'bg-white/10 hover:bg-white/20 text-amber-300'
                  }`}
                  title="Turn on soft white screen illumination to light up your face"
                >
                  <Sun className={`w-3.5 h-3.5 ${screenFillLight ? 'animate-spin' : ''}`} />
                  <span className="text-[10px] uppercase">{screenFillLight ? 'Flash ON' : 'Fill Light'}</span>
                </button>
              )}

              {/* Flip camera button */}
              {cameraActive && (
                <button
                  type="button"
                  onClick={toggleFacingMode}
                  className={`p-1.5 rounded-lg text-xs flex items-center gap-1 ${
                    screenFillLight ? 'bg-slate-200 text-slate-800' : 'bg-white/10 text-slate-300 hover:text-white'
                  }`}
                  title="Switch Front/Rear Camera"
                >
                  <FlipHorizontal className="w-3.5 h-3.5 text-emerald-400" />
                  <span className="hidden sm:inline text-[10px]">Flip</span>
                </button>
              )}

              <button
                type="button"
                onClick={() => {
                  stopCamera();
                  setMode('options');
                }}
                className={`p-1.5 rounded-lg cursor-pointer ${
                  screenFillLight ? 'bg-slate-200 text-slate-800' : 'bg-white/10 text-slate-300 hover:text-white'
                }`}
                title="Close camera"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
          </div>

          {/* Real-time Ambient Lighting Meter */}
          {cameraActive && !cameraError && (
            <div className={`mb-3 p-2.5 rounded-xl border flex items-center justify-between gap-3 text-xs transition-all ${
              isLowLight 
                ? 'bg-amber-500/20 border-amber-500/50 text-amber-200' 
                : 'bg-emerald-500/15 border-emerald-500/30 text-emerald-200'
            }`}>
              <div className="flex items-center gap-2">
                {isLowLight ? (
                  <Moon className="w-4 h-4 text-amber-400 animate-pulse" />
                ) : (
                  <SunMedium className="w-4 h-4 text-emerald-400" />
                )}
                <div>
                  <span className="font-bold">
                    {isLowLight ? 'Lighting Too Dark' : 'Optimal Lighting'}
                  </span>
                  <span className="text-[10px] text-slate-300 ml-1.5">
                    ({lightPercentage}% Brightness)
                  </span>
                </div>
              </div>

              {/* Progress bar meter */}
              <div className="flex items-center gap-2">
                <div className="w-20 sm:w-28 h-2 rounded-full bg-black/40 overflow-hidden p-0.5 border border-white/20">
                  <div 
                    className={`h-full rounded-full transition-all duration-300 ${
                      isLowLight ? 'bg-amber-400' : 'bg-emerald-400'
                    }`}
                    style={{ width: `${Math.max(10, Math.min(100, lightPercentage))}%` }}
                  />
                </div>
                {isLowLight && (
                  <span className="text-[10px] font-bold text-amber-300 animate-pulse hidden sm:inline">
                    Move into light
                  </span>
                )}
              </div>
            </div>
          )}

          {/* Loading / Initializing State */}
          {isInitializing && (
            <div className="py-12 flex flex-col items-center justify-center text-center space-y-3">
              <Loader2 className="w-8 h-8 text-emerald-400 animate-spin" />
              <div className="text-xs font-bold text-white">Requesting Camera Permission & Initializing Video...</div>
              <p className="text-[11px] text-slate-400 max-w-xs">
                Please click <strong className="text-emerald-300">"Allow"</strong> on the browser prompt when requested.
              </p>
            </div>
          )}

          {/* Camera Error & Permission Recovery */}
          {cameraError && !isInitializing && (
            <div className="space-y-3 my-2">
              <div className="p-3.5 rounded-xl bg-red-500/10 border border-red-500/30 text-red-300 text-xs flex items-start gap-2.5">
                <AlertCircle className="w-4 h-4 flex-shrink-0 mt-0.5 text-red-400" />
                <div className="flex-1 space-y-1">
                  <div className="font-bold text-white">Camera Access Notice</div>
                  <div className="text-slate-300">{cameraError}</div>
                </div>
              </div>

              {/* Step-by-Step Permission Instruction */}
              {errorType === 'permission_denied' && (
                <div className="p-3 rounded-xl bg-amber-500/10 border border-amber-500/30 text-amber-200 text-xs space-y-2">
                  <div className="font-bold flex items-center gap-1.5 text-amber-300">
                    <ShieldAlert className="w-4 h-4" />
                    <span>How to allow camera permission in your browser:</span>
                  </div>
                  <ol className="list-decimal list-inside space-y-1 text-[11px] text-slate-300 pl-1">
                    <li>Look at your browser's address bar (URL bar) at the top.</li>
                    <li>Click the <strong>padlock icon (🔒)</strong> or <strong>camera icon (🎥)</strong> on the left side of the URL.</li>
                    <li>Change <strong>Camera</strong> from "Block" to <strong>"Allow"</strong>.</li>
                    <li>Click the <strong>"Retry Camera"</strong> button below.</li>
                  </ol>
                </div>
              )}

              <div className="flex flex-wrap items-center gap-2 pt-1">
                <button
                  type="button"
                  onClick={() => startCamera()}
                  className="px-4 py-2 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-emerald-950 font-bold text-xs flex items-center gap-1.5 cursor-pointer shadow-md"
                >
                  <RefreshCw className="w-3.5 h-3.5" />
                  <span>Retry Camera Permission</span>
                </button>

                <button
                  type="button"
                  onClick={() => fileInputRef.current?.click()}
                  className="px-4 py-2 rounded-xl bg-white/10 hover:bg-white/15 text-white font-bold text-xs flex items-center gap-1.5 border border-white/20 cursor-pointer"
                >
                  <Upload className="w-3.5 h-3.5 text-amber-300" />
                  <span>Upload Picture Instead</span>
                </button>
              </div>
            </div>
          )}

          {/* Active Video Viewfinder */}
          {!cameraError && !isInitializing && (
            <div className="relative w-full max-w-xs mx-auto aspect-square rounded-2xl overflow-hidden bg-black border-2 border-emerald-400 shadow-inner">
              <video 
                ref={videoRef}
                autoPlay 
                playsInline 
                muted 
                className={`w-full h-full object-cover ${facingMode === 'user' ? 'scale-x-[-1]' : ''}`}
              />

              {/* Live Low Light Alert Banner over viewfinder */}
              {isLowLight && (
                <div className="absolute top-3 inset-x-3 bg-black/80 border border-amber-400/80 rounded-xl p-2 text-center backdrop-blur-md animate-in fade-in">
                  <div className="flex items-center justify-center gap-1 text-[11px] font-black text-amber-300">
                    <Moon className="w-3.5 h-3.5 animate-bounce text-amber-400" />
                    <span>Lighting is Dim! Move towards light</span>
                  </div>
                  <div className="text-[9px] text-slate-300 mt-0.5">
                    Face a window or turn on Screen Flash for clear ID badge.
                  </div>
                </div>
              )}

              {/* ID Frame Guidelines Overlay */}
              <div className="absolute inset-4 border-2 border-dashed border-white/40 rounded-2xl pointer-events-none flex flex-col items-center justify-between p-3">
                <div className="text-[10px] uppercase font-bold text-white/70 bg-black/60 px-2.5 py-0.5 rounded-full backdrop-blur-sm">
                  Position Face Inside Border
                </div>
                <div className={`w-16 h-16 rounded-full border-2 transition-colors ${
                  isLowLight ? 'border-amber-400/60' : 'border-emerald-400/60'
                }`} />
                <div className="text-[9px] font-mono text-emerald-300/80 bg-black/60 px-2 py-0.5 rounded backdrop-blur-sm">
                  RECON 2026 DIGITAL BADGE
                </div>
              </div>

              {/* Countdown Overlay */}
              {countdown !== null && (
                <div className="absolute inset-0 bg-black/60 backdrop-blur-sm flex flex-col items-center justify-center animate-in zoom-in">
                  <span className="text-7xl font-black text-amber-300 animate-bounce">
                    {countdown}
                  </span>
                  <span className="text-xs font-bold text-white uppercase tracking-widest mt-2">
                    Hold Steady...
                  </span>
                </div>
              )}
            </div>
          )}

          {/* Camera Trigger Buttons */}
          {!cameraError && !isInitializing && cameraActive && (
            <div className="flex flex-wrap items-center justify-center gap-3 mt-4">
              <button
                type="button"
                id="btn-take-snapshot"
                onClick={triggerCapture}
                className="py-2.5 px-6 rounded-xl bg-gradient-to-r from-emerald-500 to-emerald-400 hover:from-emerald-400 hover:to-emerald-300 text-emerald-950 font-black text-xs uppercase tracking-wider flex items-center gap-2 shadow-lg shadow-emerald-950/60 cursor-pointer active:scale-95 transition-all"
              >
                <Camera className="w-4 h-4" />
                <span>Snap 3s Timer</span>
              </button>

              <button
                type="button"
                onClick={performCapture}
                className={`py-2.5 px-5 rounded-xl font-bold text-xs cursor-pointer border active:scale-95 transition-all ${
                  screenFillLight
                    ? 'bg-slate-900 text-white border-slate-700'
                    : 'bg-white/10 hover:bg-white/20 text-white border-white/20'
                }`}
              >
                Instant Snap
              </button>

              <button
                type="button"
                onClick={() => {
                  stopCamera();
                  setMode('options');
                }}
                className={`py-2.5 px-3 rounded-xl text-xs cursor-pointer ${
                  screenFillLight ? 'text-slate-600 hover:text-slate-900' : 'text-slate-400 hover:text-white'
                }`}
              >
                Cancel
              </button>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

