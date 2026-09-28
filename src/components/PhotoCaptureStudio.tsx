import React, { useState, useRef } from 'react';
import { Camera, RefreshCw, Upload, Check, AlertCircle } from 'lucide-react';
import { playSound } from '../utils/soundService';

interface PhotoCaptureStudioProps {
  onPhotoCaptured: (base64Url: string) => void;
  initialPhotoUrl?: string;
}

export const PhotoCaptureStudio: React.FC<PhotoCaptureStudioProps> = ({
  onPhotoCaptured,
  initialPhotoUrl
}) => {
  const [mode, setMode] = useState<'idle' | 'webcam' | 'preview'>(initialPhotoUrl ? 'preview' : 'idle');
  const [photoUrl, setPhotoUrl] = useState<string | null>(initialPhotoUrl || null);
  const [webcamActive, setWebcamActive] = useState(false);
  const [cameraError, setCameraError] = useState<string | null>(null);

  const videoRef = useRef<HTMLVideoElement | null>(null);
  const streamRef = useRef<MediaStream | null>(null);
  const fileInputRef = useRef<HTMLInputElement | null>(null);

  const startWebcam = async () => {
    setCameraError(null);
    try {
      const stream = await navigator.mediaDevices.getUserMedia({
        video: { width: { ideal: 480 }, height: { ideal: 480 }, facingMode: 'user' }
      });
      streamRef.current = stream;
      if (videoRef.current) {
        videoRef.current.srcObject = stream;
        videoRef.current.play();
      }
      setWebcamActive(true);
      setMode('webcam');
      playSound('click');
    } catch (err: any) {
      console.warn('Webcam error:', err);
      setCameraError('Camera access denied or unavailable. You can upload an image file instead.');
    }
  };

  const stopWebcam = () => {
    if (streamRef.current) {
      streamRef.current.getTracks().forEach(t => t.stop());
      streamRef.current = null;
    }
    setWebcamActive(false);
  };

  const captureSnapshot = () => {
    if (!videoRef.current) return;
    const video = videoRef.current;
    const canvas = document.createElement('canvas');
    canvas.width = 400;
    canvas.height = 400;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    // Draw centered square crop
    const size = Math.min(video.videoWidth, video.videoHeight);
    const startX = (video.videoWidth - size) / 2;
    const startY = (video.videoHeight - size) / 2;

    ctx.drawImage(video, startX, startY, size, size, 0, 0, 400, 400);
    const dataUrl = canvas.toDataURL('image/jpeg', 0.85);

    stopWebcam();
    setPhotoUrl(dataUrl);
    setMode('preview');
    onPhotoCaptured(dataUrl);
    playSound('badge_print');
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (event) => {
      const result = event.target?.result as string;
      setPhotoUrl(result);
      setMode('preview');
      onPhotoCaptured(result);
      playSound('success');
    };
    reader.readAsDataURL(file);
  };

  const handleReset = () => {
    stopWebcam();
    setPhotoUrl(null);
    setMode('idle');
    onPhotoCaptured('');
    playSound('click');
  };

  return (
    <div className="bg-slate-900/80 border border-emerald-500/20 rounded-2xl p-4 flex flex-col items-center text-center">
      <div className="text-xs font-bold text-slate-300 mb-3 flex items-center gap-1.5">
        <Camera className="w-4 h-4 text-emerald-400" />
        <span>Official Delegate ID Photo (Optional for Smart Badge)</span>
      </div>

      {cameraError && (
        <div className="mb-3 px-3 py-2 rounded-xl bg-amber-500/10 border border-amber-500/30 text-amber-300 text-xs flex items-center gap-2 text-left">
          <AlertCircle className="w-4 h-4 shrink-0" />
          <span>{cameraError}</span>
        </div>
      )}

      {/* Viewport Frame */}
      <div className="relative w-36 h-36 sm:w-40 sm:h-40 rounded-2xl overflow-hidden border-2 border-dashed border-emerald-500/40 bg-slate-950 flex items-center justify-center shadow-inner mb-4">
        {mode === 'idle' && (
          <div className="text-slate-500 flex flex-col items-center p-3">
            <Camera className="w-8 h-8 text-emerald-500/40 mb-1" />
            <span className="text-[11px] font-medium text-slate-400">Take Live Selfie or Upload Photo</span>
          </div>
        )}

        {mode === 'webcam' && (
          <div className="w-full h-full relative">
            <video
              ref={videoRef}
              playsInline
              muted
              className="w-full h-full object-cover mirror-mode"
            />
            {/* Guide circle */}
            <div className="absolute inset-2 border-2 border-emerald-400/60 rounded-full pointer-events-none" />
          </div>
        )}

        {mode === 'preview' && photoUrl && (
          <div className="w-full h-full relative group">
            <img src={photoUrl} alt="Delegate badge preview" className="w-full h-full object-cover" />
            <div className="absolute inset-0 bg-emerald-950/20" />
            <div className="absolute bottom-1 right-1 bg-emerald-500 text-slate-950 p-1 rounded-full">
              <Check className="w-3.5 h-3.5 stroke-[3]" />
            </div>
          </div>
        )}
      </div>

      {/* Actions */}
      <div className="flex flex-wrap items-center justify-center gap-2 w-full">
        {mode === 'idle' && (
          <>
            <button
              type="button"
              onClick={startWebcam}
              className="px-3.5 py-2 rounded-xl bg-emerald-500/20 text-emerald-300 border border-emerald-500/40 hover:bg-emerald-500/30 text-xs font-bold flex items-center gap-1.5 transition-all"
            >
              <Camera className="w-3.5 h-3.5" />
              <span>Use Camera</span>
            </button>
            <button
              type="button"
              onClick={() => fileInputRef.current?.click()}
              className="px-3.5 py-2 rounded-xl bg-slate-800 text-slate-200 border border-slate-700 hover:bg-slate-700 text-xs font-bold flex items-center gap-1.5 transition-all"
            >
              <Upload className="w-3.5 h-3.5" />
              <span>Upload File</span>
            </button>
          </>
        )}

        {mode === 'webcam' && (
          <>
            <button
              type="button"
              onClick={captureSnapshot}
              className="px-4 py-2 rounded-xl bg-emerald-500 text-slate-950 font-black text-xs shadow-lg hover:bg-emerald-400 flex items-center gap-1.5"
            >
              <Check className="w-4 h-4" />
              <span>Snap Photo</span>
            </button>
            <button
              type="button"
              onClick={handleReset}
              className="px-3 py-2 rounded-xl bg-slate-800 text-slate-300 text-xs font-semibold"
            >
              Cancel
            </button>
          </>
        )}

        {mode === 'preview' && (
          <button
            type="button"
            onClick={handleReset}
            className="px-3.5 py-1.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-medium flex items-center gap-1.5"
          >
            <RefreshCw className="w-3 h-3" />
            <span>Retake / Change</span>
          </button>
        )}

        <input
          ref={fileInputRef}
          type="file"
          accept="image/*"
          onChange={handleFileUpload}
          className="hidden"
        />
      </div>
    </div>
  );
};
