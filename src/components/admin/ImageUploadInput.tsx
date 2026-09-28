import React, { useRef, useState } from 'react';
import { Upload, X, Image as ImageIcon, Check } from 'lucide-react';
import { playSound } from '../../utils/soundService';

interface ImageUploadInputProps {
  label: string;
  value?: string;
  onChange: (base64Url: string) => void;
  helperText?: string;
}

export const ImageUploadInput: React.FC<ImageUploadInputProps> = ({
  label,
  value,
  onChange,
  helperText = 'PNG, JPG or WebP (max 5MB)'
}) => {
  const fileInputRef = useRef<HTMLInputElement | null>(null);
  const [preview, setPreview] = useState<string | undefined>(value);

  const handleFile = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (event) => {
      const res = event.target?.result as string;
      setPreview(res);
      onChange(res);
      playSound('success');
    };
    reader.readAsDataURL(file);
  };

  const handleRemove = () => {
    setPreview('');
    onChange('');
    if (fileInputRef.current) fileInputRef.current.value = '';
    playSound('click');
  };

  return (
    <div>
      <label className="block text-[11px] font-semibold text-slate-300 mb-1">{label}</label>
      
      <div className="flex items-center gap-3">
        {preview ? (
          <div className="relative w-16 h-16 rounded-xl overflow-hidden border border-emerald-500/40 bg-slate-950 shrink-0">
            <img src={preview} alt="Upload preview" className="w-full h-full object-cover" />
            <button
              type="button"
              onClick={handleRemove}
              className="absolute top-0.5 right-0.5 p-0.5 rounded bg-black/80 text-red-400 hover:text-white"
            >
              <X className="w-3.5 h-3.5" />
            </button>
          </div>
        ) : (
          <div
            onClick={() => fileInputRef.current?.click()}
            className="w-16 h-16 rounded-xl border border-dashed border-slate-700 hover:border-emerald-500 bg-slate-950 flex flex-col items-center justify-center text-slate-500 hover:text-emerald-400 cursor-pointer transition-colors shrink-0"
          >
            <ImageIcon className="w-5 h-5 mb-0.5" />
            <span className="text-[8px] font-bold uppercase">Upload</span>
          </div>
        )}

        <div className="flex-1 min-w-0">
          <button
            type="button"
            onClick={() => fileInputRef.current?.click()}
            className="px-3 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-semibold inline-flex items-center gap-1.5 transition-colors"
          >
            <Upload className="w-3.5 h-3.5" />
            <span>Choose Image</span>
          </button>
          <p className="text-[10px] text-slate-400 mt-1">{helperText}</p>
        </div>
      </div>

      <input
        ref={fileInputRef}
        type="file"
        accept="image/*"
        onChange={handleFile}
        className="hidden"
      />
    </div>
  );
};
