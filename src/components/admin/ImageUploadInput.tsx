import React, { useState, useRef, useEffect } from 'react';
import { Upload, Image as ImageIcon, X, Check, RefreshCw, Link2, Crop } from 'lucide-react';
import { ImageCropModal, AspectRatioOption } from './ImageCropModal';

interface ImageUploadInputProps {
  name: string;
  initialValue?: string;
  label: string;
  placeholder?: string;
  maxWidth?: number;
  maxHeight?: number;
  quality?: number;
  required?: boolean;
  className?: string;
  enableCrop?: boolean;
  cropAspectRatio?: AspectRatioOption;
  cropTitle?: string;
  onImageChange?: (dataUrl: string) => void;
}

/**
 * Resizes and compresses an uploaded File into an optimized Base64 JPEG/PNG Data URL
 */
const compressImageFile = (
  file: File,
  maxWidth = 1000,
  quality = 0.82
): Promise<string> => {
  return new Promise((resolve, reject) => {
    // SVGs can be read directly as Data URLs without canvas re-compression
    if (file.type === 'image/svg+xml') {
      const reader = new FileReader();
      reader.onload = (e) => resolve(e.target?.result as string);
      reader.onerror = (err) => reject(err);
      reader.readAsDataURL(file);
      return;
    }

    const reader = new FileReader();
    reader.onload = (e) => {
      const img = new Image();
      img.onload = () => {
        const canvas = document.createElement('canvas');
        let width = img.width;
        let height = img.height;

        if (width > maxWidth) {
          height = Math.round((height * maxWidth) / width);
          width = maxWidth;
        }

        canvas.width = width;
        canvas.height = height;

        const ctx = canvas.getContext('2d');
        if (ctx) {
          ctx.drawImage(img, 0, 0, width, height);
          const dataUrl = canvas.toDataURL(file.type === 'image/png' ? 'image/png' : 'image/jpeg', quality);
          resolve(dataUrl);
        } else {
          resolve(e.target?.result as string);
        }
      };
      img.onerror = () => reject(new Error('Failed to load image file'));
      img.src = e.target?.result as string;
    };
    reader.onerror = (err) => reject(err);
    reader.readAsDataURL(file);
  });
};

export const ImageUploadInput: React.FC<ImageUploadInputProps> = ({
  name,
  initialValue = '',
  label,
  placeholder = 'Click or drag image file here...',
  maxWidth = 1000,
  quality = 0.85,
  required = false,
  className = '',
  enableCrop = false,
  cropAspectRatio = '1:1',
  cropTitle,
  onImageChange
}) => {
  const [value, setValue] = useState<string>(initialValue);
  const [isProcessing, setIsProcessing] = useState<boolean>(false);
  const [isDragging, setIsDragging] = useState<boolean>(false);
  const [showUrlInput, setShowUrlInput] = useState<boolean>(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  
  // Crop state
  const [isCropOpen, setIsCropOpen] = useState<boolean>(false);
  const [cropSourceImage, setCropSourceImage] = useState<string>('');
  const pendingFileRef = useRef<File | null>(null);

  const fileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    setValue(initialValue || '');
  }, [initialValue]);

  const handleValueChange = (newValue: string) => {
    setValue(newValue);
    if (onImageChange) {
      onImageChange(newValue);
    }
  };

  const handleFileSelect = async (file: File) => {
    if (!file.type.startsWith('image/')) {
      setErrorMessage('Please select a valid image file (PNG, JPG, WEBP, SVG)');
      return;
    }

    setIsProcessing(true);
    setErrorMessage(null);

    // If crop is enabled, load the file as data URL and open ImageCropModal
    if (enableCrop) {
      pendingFileRef.current = file;
      const reader = new FileReader();
      reader.onload = (e) => {
        const rawDataUrl = e.target?.result as string;
        setCropSourceImage(rawDataUrl);
        setIsCropOpen(true);
        setIsProcessing(false);
      };
      reader.onerror = () => {
        setErrorMessage('Failed to read image file.');
        setIsProcessing(false);
      };
      reader.readAsDataURL(file);
      return;
    }

    // Default flow without crop
    try {
      const dataUrl = await compressImageFile(file, maxWidth, quality);
      handleValueChange(dataUrl);
    } catch (err) {
      console.error('Error processing image:', err);
      setErrorMessage('Failed to process image file.');
    } finally {
      setIsProcessing(false);
    }
  };

  const handleApplyCrop = (croppedDataUrl: string) => {
    handleValueChange(croppedDataUrl);
    setIsCropOpen(false);
    setCropSourceImage('');
    pendingFileRef.current = null;
  };

  const handleSkipCrop = async () => {
    if (pendingFileRef.current) {
      try {
        const compressed = await compressImageFile(pendingFileRef.current, maxWidth, quality);
        handleValueChange(compressed);
      } catch {
        handleValueChange(cropSourceImage);
      }
    } else if (cropSourceImage) {
      handleValueChange(cropSourceImage);
    }
    setIsCropOpen(false);
    setCropSourceImage('');
    pendingFileRef.current = null;
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (files && files[0]) {
      handleFileSelect(files[0]);
    }
    // Reset input value so same file can be selected again
    e.target.value = '';
  };

  const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsDragging(false);
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      handleFileSelect(e.dataTransfer.files[0]);
    }
  };

  const handleDragOver = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = () => {
    setIsDragging(false);
  };

  return (
    <div className={`space-y-2 ${className}`}>
      <div className="flex items-center justify-between">
        <label className="block text-xs font-bold text-slate-300">
          {label} {required && <span className="text-red-400">*</span>}
        </label>
        <div className="flex items-center gap-2">
          {enableCrop && (
            <span className="text-[10px] text-emerald-400 font-semibold flex items-center gap-0.5 bg-emerald-500/10 px-2 py-0.5 rounded-full border border-emerald-500/20">
              <Crop className="w-2.5 h-2.5" />
              <span>Crop Enabled</span>
            </span>
          )}
          <button
            type="button"
            onClick={() => setShowUrlInput(!showUrlInput)}
            className="text-[10px] text-slate-400 hover:text-emerald-400 flex items-center gap-1 transition-colors cursor-pointer"
          >
            <Link2 className="w-3 h-3" />
            <span>{showUrlInput ? 'Hide URL field' : 'Paste link instead'}</span>
          </button>
        </div>
      </div>

      {/* Hidden form input to communicate with standard HTML Form Data */}
      <input type="hidden" name={name} value={value} required={required} />

      {/* Hidden file input element */}
      <input
        ref={fileInputRef}
        type="file"
        accept="image/*"
        onChange={handleInputChange}
        className="hidden"
      />

      {/* Main Dropzone / Image Preview Area */}
      {value ? (
        <div className="relative rounded-2xl overflow-hidden border border-emerald-500/40 bg-black/60 group p-3 flex items-center gap-4">
          <div className="w-16 h-16 rounded-xl overflow-hidden bg-white/10 flex-shrink-0 border border-white/20 flex items-center justify-center relative group">
            <img
              src={value}
              alt="Uploaded Preview"
              className="w-full h-full object-cover"
              referrerPolicy="no-referrer"
            />
          </div>
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-1.5 text-emerald-400 text-xs font-bold">
              <Check className="w-3.5 h-3.5" />
              <span>Image Loaded & Ready</span>
            </div>
            <p className="text-[10px] text-slate-400 font-mono truncate mt-0.5">
              {value.startsWith('data:') ? 'Local Cropped / Compressed Image' : value}
            </p>
            <div className="flex flex-wrap items-center gap-2 mt-2">
              {enableCrop && (
                <button
                  type="button"
                  onClick={() => {
                    setCropSourceImage(value);
                    setIsCropOpen(true);
                  }}
                  className="px-2.5 py-1 rounded-lg bg-emerald-500/20 hover:bg-emerald-500/30 text-emerald-300 text-[11px] font-bold flex items-center gap-1.5 transition-colors cursor-pointer border border-emerald-500/30"
                  title="Crop and frame this headshot photo"
                >
                  <Crop className="w-3 h-3 text-emerald-400" />
                  <span>Crop / Reposition</span>
                </button>
              )}
              <button
                type="button"
                onClick={() => fileInputRef.current?.click()}
                className="px-2.5 py-1 rounded-lg bg-white/10 hover:bg-white/20 text-slate-300 hover:text-white text-[11px] font-bold flex items-center gap-1 transition-colors cursor-pointer"
              >
                <RefreshCw className="w-3 h-3" />
                <span>Replace Image</span>
              </button>
              <button
                type="button"
                onClick={() => handleValueChange('')}
                className="px-2 py-1 rounded-lg bg-red-500/20 hover:bg-red-500/30 text-red-300 text-[11px] font-bold flex items-center gap-1 transition-colors cursor-pointer"
              >
                <X className="w-3 h-3" />
                <span>Remove</span>
              </button>
            </div>
          </div>
        </div>
      ) : (
        <div
          onDrop={handleDrop}
          onDragOver={handleDragOver}
          onDragLeave={handleDragLeave}
          onClick={() => fileInputRef.current?.click()}
          className={`border-2 border-dashed rounded-2xl p-4 text-center cursor-pointer transition-all duration-300 flex flex-col items-center justify-center gap-2 ${
            isDragging
              ? 'border-emerald-400 bg-emerald-500/10 scale-[1.01]'
              : 'border-white/20 hover:border-emerald-500/60 bg-black/40 hover:bg-black/60'
          }`}
        >
          {isProcessing ? (
            <div className="flex items-center gap-2 text-emerald-400 py-2">
              <RefreshCw className="w-5 h-5 animate-spin" />
              <span className="text-xs font-bold">Processing & loading image file...</span>
            </div>
          ) : (
            <>
              <div className="w-10 h-10 rounded-full bg-emerald-500/10 border border-emerald-500/30 flex items-center justify-center text-emerald-400 group-hover:scale-110 transition-transform">
                {enableCrop ? <Crop className="w-5 h-5" /> : <Upload className="w-5 h-5" />}
              </div>
              <div>
                <p className="text-xs font-bold text-white">Upload Image File</p>
                <p className="text-[10px] text-slate-400 mt-0.5">{placeholder}</p>
                {enableCrop ? (
                  <p className="text-[10px] text-emerald-400 font-semibold mt-1 flex items-center justify-center gap-1">
                    <Crop className="w-3 h-3" />
                    <span>Includes interactive crop & headshot framing tool</span>
                  </p>
                ) : (
                  <p className="text-[9px] text-slate-500 mt-1">Supports PNG, JPG, WEBP, SVG (Auto-compressed for fast loading)</p>
                )}
              </div>
            </>
          )}
        </div>
      )}

      {/* Optional Link Input mode if admin wants to paste a link */}
      {showUrlInput && (
        <div className="pt-1 flex items-center gap-2">
          <input
            type="text"
            value={value}
            onChange={(e) => handleValueChange(e.target.value)}
            placeholder="Or paste direct image URL (https://...)"
            className="flex-1 px-3 py-1.5 rounded-xl bg-black/60 border border-white/15 text-xs text-white placeholder-slate-500 focus:border-emerald-400 focus:outline-none"
          />
          {enableCrop && value && (
            <button
              type="button"
              onClick={() => {
                setCropSourceImage(value);
                setIsCropOpen(true);
              }}
              className="px-3 py-1.5 rounded-xl bg-emerald-500/20 hover:bg-emerald-500/30 border border-emerald-500/30 text-emerald-300 text-xs font-bold flex items-center gap-1 transition-colors cursor-pointer"
            >
              <Crop className="w-3.5 h-3.5" />
              <span>Crop URL</span>
            </button>
          )}
        </div>
      )}

      {errorMessage && (
        <p className="text-[10px] font-bold text-red-400">{errorMessage}</p>
      )}

      {/* Interactive Crop Modal */}
      {enableCrop && (
        <ImageCropModal
          isOpen={isCropOpen}
          imageUrl={cropSourceImage}
          title={cropTitle || `Crop & Frame ${label.replace('(Upload File)', '').trim()}`}
          aspectRatio={cropAspectRatio}
          outputMaxWidth={maxWidth}
          outputQuality={quality}
          onApplyCrop={handleApplyCrop}
          onClose={() => {
            setIsCropOpen(false);
            setCropSourceImage('');
            pendingFileRef.current = null;
          }}
          onSkipCrop={handleSkipCrop}
        />
      )}
    </div>
  );
};

