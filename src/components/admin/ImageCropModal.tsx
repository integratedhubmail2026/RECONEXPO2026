import React, { useState, useRef, useEffect, useCallback } from 'react';
import { 
  Crop, 
  ZoomIn, 
  ZoomOut, 
  RotateCw, 
  RotateCcw, 
  FlipHorizontal, 
  RefreshCw, 
  Check, 
  X, 
  Grid, 
  User, 
  Sparkles,
  Maximize2
} from 'lucide-react';

export type AspectRatioOption = '1:1' | '4:5' | '3:4' | '16:9' | 'free';

interface ImageCropModalProps {
  isOpen: boolean;
  imageUrl: string;
  title?: string;
  aspectRatio?: AspectRatioOption;
  outputMaxWidth?: number;
  outputQuality?: number;
  onApplyCrop: (croppedDataUrl: string) => void;
  onClose: () => void;
  onSkipCrop?: () => void;
}

export const ImageCropModal: React.FC<ImageCropModalProps> = ({
  isOpen,
  imageUrl,
  title = "Crop & Frame Keynote / Panelist Photo",
  aspectRatio: initialAspectRatio = '1:1',
  outputMaxWidth = 800,
  outputQuality = 0.88,
  onApplyCrop,
  onClose,
  onSkipCrop
}) => {
  // Image metadata
  const [imageSize, setImageSize] = useState<{ width: number; height: number }>({ width: 0, height: 0 });
  const [isImageLoaded, setIsImageLoaded] = useState<boolean>(false);
  const [imageError, setImageError] = useState<string | null>(null);

  // Crop / Transform state
  const [zoom, setZoom] = useState<number>(1);
  const [pan, setPan] = useState<{ x: number; y: number }>({ x: 0, y: 0 });
  const [rotation, setRotation] = useState<number>(0); // 0, 90, 180, 270
  const [isFlippedH, setIsFlippedH] = useState<boolean>(false);
  const [selectedRatio, setSelectedRatio] = useState<AspectRatioOption>(initialAspectRatio);
  const [showGrid, setShowGrid] = useState<boolean>(true);
  const [showFaceGuide, setShowFaceGuide] = useState<boolean>(true);
  const [previewDataUrl, setPreviewDataUrl] = useState<string>('');
  const [isProcessingCrop, setIsProcessingCrop] = useState<boolean>(false);

  // Dragging state
  const [isDragging, setIsDragging] = useState<boolean>(false);
  const dragStartRef = useRef<{ x: number; y: number }>({ x: 0, y: 0 });
  const panStartRef = useRef<{ x: number; y: number }>({ x: 0, y: 0 });

  // Viewport container ref
  const viewportRef = useRef<HTMLDivElement>(null);
  const imgRef = useRef<HTMLImageElement | null>(null);

  // Load image whenever modal opens or imageUrl changes
  useEffect(() => {
    if (!isOpen || !imageUrl) return;

    setIsImageLoaded(false);
    setImageError(null);
    setZoom(1);
    setPan({ x: 0, y: 0 });
    setRotation(0);
    setIsFlippedH(false);
    setSelectedRatio(initialAspectRatio);

    const img = new Image();
    img.crossOrigin = "anonymous";
    img.onload = () => {
      setImageSize({ width: img.naturalWidth, height: img.naturalHeight });
      setIsImageLoaded(true);
      imgRef.current = img;
    };
    img.onerror = () => {
      setImageError("Could not load image for cropping.");
    };
    img.src = imageUrl;
  }, [isOpen, imageUrl, initialAspectRatio]);

  // Determine aspect ratio numerical value
  const getRatioValue = useCallback((ratio: AspectRatioOption): number => {
    switch (ratio) {
      case '1:1': return 1;
      case '4:5': return 4 / 5;
      case '3:4': return 3 / 4;
      case '16:9': return 16 / 9;
      case 'free': return 1;
      default: return 1;
    }
  }, []);

  // Compute crop box dimensions based on container viewport
  const getCropBoxDimensions = useCallback(() => {
    const maxWidth = 340;
    const maxHeight = 340;
    const targetRatio = getRatioValue(selectedRatio);

    let width = maxWidth;
    let height = width / targetRatio;

    if (height > maxHeight) {
      height = maxHeight;
      width = height * targetRatio;
    }

    return { width, height };
  }, [selectedRatio, getRatioValue]);

  // Generate live preview when transform state changes
  useEffect(() => {
    if (!isImageLoaded || !imgRef.current) return;

    const timer = setTimeout(() => {
      generateCroppedCanvas(180, 180, 0.7)
        .then((url) => setPreviewDataUrl(url))
        .catch(() => {});
    }, 60);

    return () => clearTimeout(timer);
  }, [isImageLoaded, zoom, pan, rotation, isFlippedH, selectedRatio]);

  // Render crop onto canvas
  const generateCroppedCanvas = (
    targetMaxW = outputMaxWidth,
    targetMaxH = outputMaxWidth,
    quality = outputQuality
  ): Promise<string> => {
    return new Promise((resolve, reject) => {
      const img = imgRef.current;
      if (!img) {
        reject(new Error("No image loaded"));
        return;
      }

      const { width: cropBoxW, height: cropBoxH } = getCropBoxDimensions();
      const targetRatio = cropBoxW / cropBoxH;

      // Determine output dimensions maintaining chosen aspect ratio
      let outW = targetMaxW;
      let outH = Math.round(outW / targetRatio);

      if (outH > targetMaxH) {
        outH = targetMaxH;
        outW = Math.round(outH * targetRatio);
      }

      const canvas = document.createElement('canvas');
      canvas.width = outW;
      canvas.height = outH;
      const ctx = canvas.getContext('2d');

      if (!ctx) {
        reject(new Error("Could not get canvas context"));
        return;
      }

      // Smooth rendering
      ctx.imageSmoothingEnabled = true;
      ctx.imageSmoothingQuality = 'high';

      // Fill with dark neutral background in case of edge transparency
      ctx.fillStyle = '#0f172a';
      ctx.fillRect(0, 0, outW, outH);

      // Translate context to center of output canvas
      ctx.save();
      ctx.translate(outW / 2, outH / 2);

      // Handle rotation and flip
      ctx.rotate((rotation * Math.PI) / 180);
      ctx.scale(isFlippedH ? -1 : 1, 1);

      // Calculate scale relative to crop box
      const scaleFactor = outW / cropBoxW;
      const effectiveZoom = zoom * scaleFactor;

      // Map pan coordinates from viewport pixels to canvas pixels
      const drawX = pan.x * scaleFactor;
      const drawY = pan.y * scaleFactor;

      // Draw the image centered with pan & zoom applied
      const drawW = img.naturalWidth * (effectiveZoom / (img.naturalWidth / cropBoxW));
      const drawH = img.naturalHeight * (effectiveZoom / (img.naturalWidth / cropBoxW));

      // Depending on whether image was rotated 90 or 270 deg
      ctx.drawImage(
        img,
        drawX - drawW / 2,
        drawY - drawH / 2,
        drawW,
        drawH
      );

      ctx.restore();

      const format = imageUrl.startsWith('data:image/png') ? 'image/png' : 'image/jpeg';
      resolve(canvas.toDataURL(format, quality));
    });
  };

  // Mouse / Touch handlers for panning
  const handlePointerDown = (e: React.PointerEvent<HTMLDivElement>) => {
    setIsDragging(true);
    dragStartRef.current = { x: e.clientX, y: e.clientY };
    panStartRef.current = { ...pan };
    (e.target as HTMLElement).setPointerCapture(e.pointerId);
  };

  const handlePointerMove = (e: React.PointerEvent<HTMLDivElement>) => {
    if (!isDragging) return;
    const deltaX = e.clientX - dragStartRef.current.x;
    const deltaY = e.clientY - dragStartRef.current.y;
    setPan({
      x: panStartRef.current.x + deltaX,
      y: panStartRef.current.y + deltaY
    });
  };

  const handlePointerUp = (e: React.PointerEvent<HTMLDivElement>) => {
    setIsDragging(false);
    try {
      (e.target as HTMLElement).releasePointerCapture(e.pointerId);
    } catch {
      // Ignore pointer capture errors
    }
  };

  // Mouse wheel zoom
  const handleWheel = (e: React.WheelEvent) => {
    e.preventDefault();
    const zoomStep = 0.08;
    const newZoom = e.deltaY < 0 ? zoom + zoomStep : zoom - zoomStep;
    setZoom(Math.max(0.6, Math.min(3.5, Number(newZoom.toFixed(2)))));
  };

  // Rotation controls
  const handleRotateCw = () => setRotation((prev) => (prev + 90) % 360);
  const handleRotateCcw = () => setRotation((prev) => (prev - 90 + 360) % 360);
  const handleFlipH = () => setIsFlippedH((prev) => !prev);
  const handleReset = () => {
    setZoom(1);
    setPan({ x: 0, y: 0 });
    setRotation(0);
    setIsFlippedH(false);
  };

  // Apply crop handler
  const handleApply = async () => {
    setIsProcessingCrop(true);
    try {
      const croppedResult = await generateCroppedCanvas(outputMaxWidth, outputMaxWidth, outputQuality);
      onApplyCrop(croppedResult);
      onClose();
    } catch (err) {
      console.error("Failed to apply crop:", err);
      // Fallback to original
      onApplyCrop(imageUrl);
      onClose();
    } finally {
      setIsProcessingCrop(false);
    }
  };

  if (!isOpen) return null;

  const cropBox = getCropBoxDimensions();

  return (
    <div className="fixed inset-0 z-[9999] flex items-center justify-center p-3 sm:p-5 bg-black/85 backdrop-blur-md animate-fadeIn">
      <div 
        className="w-full max-w-4xl max-h-[92vh] flex flex-col rounded-3xl bg-[#091319] border border-emerald-500/40 shadow-2xl overflow-hidden"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-white/10 bg-black/40">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-emerald-500/15 border border-emerald-500/30 flex items-center justify-center text-emerald-400">
              <Crop className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-base sm:text-lg font-bold text-white font-heading flex items-center gap-2">
                <span>{title}</span>
                <span className="text-[10px] uppercase font-bold tracking-wider px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-300 border border-emerald-500/30">
                  Headshot Framing Tool
                </span>
              </h2>
              <p className="text-xs text-slate-400">
                Drag to reposition, scroll/slider to zoom, and center the executive speaker face.
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="w-8 h-8 rounded-full bg-white/10 hover:bg-white/20 text-slate-300 hover:text-white flex items-center justify-center transition-colors cursor-pointer"
            title="Cancel"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Content Body: Split Workspace (Canvas + Controls/Preview) */}
        <div className="flex-1 overflow-y-auto p-4 sm:p-6 grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
          
          {/* Main Cropper Interactive Canvas (Left Column) */}
          <div className="lg:col-span-7 flex flex-col items-center">
            {/* Instruction banner */}
            <div className="w-full mb-3 flex items-center justify-between text-[11px] text-slate-400 px-1">
              <span className="flex items-center gap-1.5 text-emerald-400 font-semibold">
                <Sparkles className="w-3.5 h-3.5" />
                <span>Interactive Viewport: Drag image to center headshot</span>
              </span>
              <span>Scroll to zoom</span>
            </div>

            {/* Interactive Viewport Area */}
            <div 
              ref={viewportRef}
              onWheel={handleWheel}
              onPointerDown={handlePointerDown}
              onPointerMove={handlePointerMove}
              onPointerUp={handlePointerUp}
              className="relative w-full h-[360px] sm:h-[400px] rounded-2xl bg-[#03070a] border border-white/15 overflow-hidden flex items-center justify-center cursor-grab active:cursor-grabbing select-none shadow-inner"
              style={{
                backgroundImage: 'radial-gradient(#1e293b 1px, transparent 1px)',
                backgroundSize: '16px 16px'
              }}
            >
              {isImageLoaded && imgRef.current ? (
                <>
                  {/* The Scaled/Transformed Image Layer */}
                  <div
                    className="absolute pointer-events-none transition-transform duration-75 ease-out"
                    style={{
                      transform: `translate(${pan.x}px, ${pan.y}px) rotate(${rotation}deg) scaleX(${isFlippedH ? -1 : 1}) scale(${zoom})`,
                      transformOrigin: 'center center'
                    }}
                  >
                    <img
                      src={imageUrl}
                      alt="Source for cropping"
                      className="max-w-none pointer-events-none select-none"
                      style={{
                        width: `${cropBox.width}px`,
                        height: 'auto'
                      }}
                      draggable={false}
                    />
                  </div>

                  {/* Darkened Mask Over Outside Area */}
                  <div className="absolute inset-0 pointer-events-none flex items-center justify-center">
                    <div 
                      className="relative border-2 border-emerald-400/90 shadow-[0_0_0_9999px_rgba(0,0,0,0.65)] rounded-2xl overflow-hidden transition-all duration-200"
                      style={{
                        width: `${cropBox.width}px`,
                        height: `${cropBox.height}px`
                      }}
                    >
                      {/* Rule of Thirds Grid Lines */}
                      {showGrid && (
                        <div className="absolute inset-0 grid grid-cols-3 grid-rows-3 pointer-events-none">
                          <div className="border-r border-b border-white/20"></div>
                          <div className="border-r border-b border-white/20"></div>
                          <div className="border-b border-white/20"></div>
                          <div className="border-r border-b border-white/20"></div>
                          <div className="border-r border-b border-white/20"></div>
                          <div className="border-b border-white/20"></div>
                          <div className="border-r border-white/20"></div>
                          <div className="border-r border-white/20"></div>
                          <div></div>
                        </div>
                      )}

                      {/* Headshot Face & Eye-line Framing Oval */}
                      {showFaceGuide && (
                        <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none">
                          {/* Face Oval */}
                          <div className="w-[62%] h-[72%] rounded-[50%] border-2 border-dashed border-emerald-300/60 flex flex-col items-center justify-center relative shadow-[0_0_15px_rgba(16,185,129,0.2)]">
                            {/* Eye line guide */}
                            <div className="w-full border-t border-dotted border-emerald-300/40 absolute top-[38%]"></div>
                            {/* Mouth/chin guide */}
                            <div className="w-1/2 border-t border-dotted border-emerald-300/40 absolute bottom-[22%]"></div>
                            <span className="text-[9px] font-bold tracking-widest text-emerald-300/80 uppercase bg-black/60 px-1.5 py-0.5 rounded-full absolute -top-3">
                              Face Alignment
                            </span>
                          </div>
                        </div>
                      )}

                      {/* Corner Accents */}
                      <div className="absolute top-0 left-0 w-3 h-3 border-t-2 border-l-2 border-emerald-300"></div>
                      <div className="absolute top-0 right-0 w-3 h-3 border-t-2 border-r-2 border-emerald-300"></div>
                      <div className="absolute bottom-0 left-0 w-3 h-3 border-b-2 border-l-2 border-emerald-300"></div>
                      <div className="absolute bottom-0 right-0 w-3 h-3 border-b-2 border-r-2 border-emerald-300"></div>
                    </div>
                  </div>
                </>
              ) : imageError ? (
                <div className="p-4 text-center text-red-400 text-xs">
                  <p className="font-bold">{imageError}</p>
                </div>
              ) : (
                <div className="flex flex-col items-center justify-center text-slate-400 gap-2">
                  <RefreshCw className="w-6 h-6 animate-spin text-emerald-400" />
                  <span className="text-xs font-bold">Preparing image for framing...</span>
                </div>
              )}
            </div>

            {/* Quick Canvas Controls Bar (Under Viewport) */}
            <div className="w-full mt-3 flex flex-wrap items-center justify-between gap-3 p-3 rounded-2xl bg-black/40 border border-white/10 text-xs">
              {/* Zoom Slider */}
              <div className="flex items-center gap-2 flex-1 min-w-[200px]">
                <button
                  type="button"
                  onClick={() => setZoom(Math.max(0.6, Number((zoom - 0.1).toFixed(2))))}
                  className="p-1 rounded-lg bg-white/5 hover:bg-white/15 text-slate-300 transition-colors cursor-pointer"
                  title="Zoom Out"
                >
                  <ZoomOut className="w-4 h-4" />
                </button>
                <input
                  type="range"
                  min="0.6"
                  max="3.0"
                  step="0.05"
                  value={zoom}
                  onChange={(e) => setZoom(parseFloat(e.target.value))}
                  className="flex-1 accent-emerald-400 cursor-pointer h-1.5 rounded-lg bg-white/20"
                />
                <button
                  type="button"
                  onClick={() => setZoom(Math.min(3.0, Number((zoom + 0.1).toFixed(2))))}
                  className="p-1 rounded-lg bg-white/5 hover:bg-white/15 text-slate-300 transition-colors cursor-pointer"
                  title="Zoom In"
                >
                  <ZoomIn className="w-4 h-4" />
                </button>
                <span className="text-[11px] font-mono font-bold text-emerald-400 w-12 text-right">
                  {Math.round(zoom * 100)}%
                </span>
              </div>

              {/* Rotate & Reset Action Buttons */}
              <div className="flex items-center gap-1.5">
                <button
                  type="button"
                  onClick={handleRotateCcw}
                  className="p-1.5 rounded-xl bg-white/5 hover:bg-white/15 text-slate-300 hover:text-white transition-colors cursor-pointer"
                  title="Rotate 90° Left"
                >
                  <RotateCcw className="w-3.5 h-3.5" />
                </button>
                <button
                  type="button"
                  onClick={handleRotateCw}
                  className="p-1.5 rounded-xl bg-white/5 hover:bg-white/15 text-slate-300 hover:text-white transition-colors cursor-pointer"
                  title="Rotate 90° Right"
                >
                  <RotateCw className="w-3.5 h-3.5" />
                </button>
                <button
                  type="button"
                  onClick={handleFlipH}
                  className={`p-1.5 rounded-xl transition-colors cursor-pointer ${
                    isFlippedH ? 'bg-emerald-500/25 text-emerald-300 border border-emerald-500/40' : 'bg-white/5 hover:bg-white/15 text-slate-300'
                  }`}
                  title="Flip Horizontal"
                >
                  <FlipHorizontal className="w-3.5 h-3.5" />
                </button>
                <button
                  type="button"
                  onClick={handleReset}
                  className="px-2.5 py-1.5 rounded-xl bg-white/5 hover:bg-white/15 text-slate-300 text-[11px] font-bold flex items-center gap-1 transition-colors cursor-pointer"
                  title="Center Position"
                >
                  <RefreshCw className="w-3 h-3" />
                  <span>Center</span>
                </button>
              </div>
            </div>
          </div>

          {/* Right Column: Aspect Ratio Presets & Real-Time Keynote Card Preview */}
          <div className="lg:col-span-5 space-y-4">
            
            {/* Aspect Ratio Presets */}
            <div className="p-4 rounded-2xl bg-black/40 border border-white/10 space-y-2.5">
              <label className="block text-xs font-bold text-slate-300">
                Aspect Ratio Frame
              </label>
              <div className="grid grid-cols-3 gap-2 text-xs">
                <button
                  type="button"
                  onClick={() => setSelectedRatio('1:1')}
                  className={`px-3 py-2 rounded-xl font-bold flex flex-col items-center justify-center gap-1 border transition-all cursor-pointer ${
                    selectedRatio === '1:1'
                      ? 'bg-emerald-500/20 border-emerald-400 text-emerald-300 shadow-md'
                      : 'bg-white/5 border-white/10 text-slate-300 hover:bg-white/10'
                  }`}
                >
                  <span className="text-xs">1:1 Square</span>
                  <span className="text-[9px] text-slate-400 font-normal">Card Standard</span>
                </button>

                <button
                  type="button"
                  onClick={() => setSelectedRatio('4:5')}
                  className={`px-3 py-2 rounded-xl font-bold flex flex-col items-center justify-center gap-1 border transition-all cursor-pointer ${
                    selectedRatio === '4:5'
                      ? 'bg-emerald-500/20 border-emerald-400 text-emerald-300 shadow-md'
                      : 'bg-white/5 border-white/10 text-slate-300 hover:bg-white/10'
                  }`}
                >
                  <span className="text-xs">4:5 Tall</span>
                  <span className="text-[9px] text-slate-400 font-normal">Executive</span>
                </button>

                <button
                  type="button"
                  onClick={() => setSelectedRatio('3:4')}
                  className={`px-3 py-2 rounded-xl font-bold flex flex-col items-center justify-center gap-1 border transition-all cursor-pointer ${
                    selectedRatio === '3:4'
                      ? 'bg-emerald-500/20 border-emerald-400 text-emerald-300 shadow-md'
                      : 'bg-white/5 border-white/10 text-slate-300 hover:bg-white/10'
                  }`}
                >
                  <span className="text-xs">3:4 Portrait</span>
                  <span className="text-[9px] text-slate-400 font-normal">Headshot</span>
                </button>
              </div>

              {/* Guide Toggles */}
              <div className="pt-2 border-t border-white/10 flex items-center justify-between text-xs text-slate-300">
                <button
                  type="button"
                  onClick={() => setShowFaceGuide(!showFaceGuide)}
                  className={`px-2.5 py-1.5 rounded-xl border flex items-center gap-1.5 text-[11px] font-semibold transition-colors cursor-pointer ${
                    showFaceGuide
                      ? 'bg-emerald-500/20 text-emerald-300 border-emerald-500/40'
                      : 'bg-white/5 text-slate-400 border-white/10 hover:text-white'
                  }`}
                >
                  <User className="w-3.5 h-3.5" />
                  <span>Face Oval Guide</span>
                </button>

                <button
                  type="button"
                  onClick={() => setShowGrid(!showGrid)}
                  className={`px-2.5 py-1.5 rounded-xl border flex items-center gap-1.5 text-[11px] font-semibold transition-colors cursor-pointer ${
                    showGrid
                      ? 'bg-emerald-500/20 text-emerald-300 border-emerald-500/40'
                      : 'bg-white/5 text-slate-400 border-white/10 hover:text-white'
                  }`}
                >
                  <Grid className="w-3.5 h-3.5" />
                  <span>Rule of Thirds</span>
                </button>
              </div>
            </div>

            {/* Live Realistic Keynote & Panelist Previews */}
            <div className="p-4 rounded-2xl bg-black/40 border border-white/10 space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-slate-300">Live Website Previews</span>
                <span className="text-[10px] text-emerald-400 font-semibold flex items-center gap-1">
                  <Sparkles className="w-3 h-3" />
                  <span>Real-time sync</span>
                </span>
              </div>

              <div className="grid grid-cols-2 gap-3 items-center">
                {/* Preview 1: Realistic Keynote Card Miniature */}
                <div className="p-2.5 rounded-2xl bg-[#011e15] border border-emerald-500/40 shadow-lg text-center flex flex-col items-center">
                  <span className="px-2 py-0.5 rounded-full bg-red-600 text-white text-[9px] font-black tracking-wider uppercase mb-1.5 shadow">
                    Keynote Chair
                  </span>
                  
                  {/* Miniature Image Frame */}
                  <div className="w-24 h-24 sm:w-28 sm:h-28 rounded-xl overflow-hidden bg-black/60 border border-emerald-500/50 relative shadow-inner">
                    {previewDataUrl ? (
                      <img
                        src={previewDataUrl}
                        alt="Cropped Preview"
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center text-slate-600">
                        <User className="w-8 h-8" />
                      </div>
                    )}
                  </div>

                  <p className="text-[10px] font-bold text-white mt-1.5 truncate max-w-[120px]">
                    Speaker Card
                  </p>
                  <p className="text-[8px] text-emerald-400 font-mono">
                    Official Framing
                  </p>
                </div>

                {/* Preview 2: Circular Avatar / Badge View */}
                <div className="p-2.5 rounded-2xl bg-[#09151c] border border-white/15 text-center flex flex-col items-center justify-center">
                  <span className="px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-300 text-[9px] font-bold tracking-wider uppercase mb-1.5 border border-emerald-500/30">
                    Panelist Avatar
                  </span>

                  {/* Circular Avatar */}
                  <div className="w-20 h-20 rounded-full overflow-hidden bg-black/60 border-2 border-emerald-400 shadow-md relative">
                    {previewDataUrl ? (
                      <img
                        src={previewDataUrl}
                        alt="Cropped Avatar Preview"
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center text-slate-600">
                        <User className="w-6 h-6" />
                      </div>
                    )}
                  </div>

                  <p className="text-[10px] font-bold text-white mt-1.5 truncate max-w-[120px]">
                    Round Badge
                  </p>
                  <p className="text-[8px] text-slate-400 font-mono">
                    Plenary / Agenda
                  </p>
                </div>
              </div>
            </div>

            {/* Pro Tip note */}
            <div className="p-3 rounded-xl bg-emerald-500/10 border border-emerald-500/20 text-[11px] text-emerald-200 leading-relaxed">
              💡 <strong>Pro Tip:</strong> Position the speaker’s eyes along the upper third line inside the face oval for executive-grade conference presence.
            </div>

          </div>
        </div>

        {/* Modal Footer Actions */}
        <div className="px-6 py-4 border-t border-white/10 bg-black/60 flex flex-wrap items-center justify-between gap-3">
          <div>
            {onSkipCrop && (
              <button
                type="button"
                onClick={onSkipCrop}
                className="px-3.5 py-2 rounded-xl bg-white/5 hover:bg-white/15 text-slate-300 hover:text-white text-xs font-semibold transition-colors cursor-pointer"
              >
                Use Full Image (Skip Crop)
              </button>
            )}
          </div>

          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 rounded-xl bg-white/10 hover:bg-white/20 text-slate-300 hover:text-white text-xs font-bold transition-colors cursor-pointer"
            >
              Cancel
            </button>

            <button
              type="button"
              onClick={handleApply}
              disabled={isProcessingCrop || !isImageLoaded}
              className="px-5 py-2.5 rounded-xl bg-emerald-500 hover:bg-emerald-400 active:scale-95 text-emerald-950 font-black text-xs flex items-center gap-2 shadow-lg shadow-emerald-500/20 transition-all cursor-pointer disabled:opacity-50"
            >
              {isProcessingCrop ? (
                <>
                  <RefreshCw className="w-3.5 h-3.5 animate-spin" />
                  <span>Processing Crop...</span>
                </>
              ) : (
                <>
                  <Check className="w-4 h-4 stroke-[3]" />
                  <span>Apply & Save Crop</span>
                </>
              )}
            </button>
          </div>
        </div>

      </div>
    </div>
  );
};
