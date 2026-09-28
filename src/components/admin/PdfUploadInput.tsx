import React, { useRef, useState } from 'react';
import { FileText, Upload, X, Check } from 'lucide-react';
import { playSound } from '../../utils/soundService';

interface PdfUploadInputProps {
  label: string;
  value?: string;
  onChange: (fileName: string, base64Url: string) => void;
}

export const PdfUploadInput: React.FC<PdfUploadInputProps> = ({ label, value, onChange }) => {
  const fileInputRef = useRef<HTMLInputElement | null>(null);
  const [fileName, setFileName] = useState<string>(value || '');

  const handleFile = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setFileName(file.name);
    const reader = new FileReader();
    reader.onload = (event) => {
      onChange(file.name, event.target?.result as string);
      playSound('success');
    };
    reader.readAsDataURL(file);
  };

  const handleRemove = () => {
    setFileName('');
    onChange('', '');
    if (fileInputRef.current) fileInputRef.current.value = '';
    playSound('click');
  };

  return (
    <div>
      <label className="block text-[11px] font-semibold text-slate-300 mb-1">{label}</label>
      
      <div className="flex items-center gap-3">
        {fileName ? (
          <div className="flex-1 bg-slate-950 border border-emerald-500/40 rounded-xl px-3 py-2 flex items-center justify-between text-xs text-white">
            <div className="flex items-center gap-2 truncate">
              <FileText className="w-4 h-4 text-emerald-400 shrink-0" />
              <span className="truncate">{fileName}</span>
            </div>
            <button
              type="button"
              onClick={handleRemove}
              className="text-red-400 hover:text-white p-1"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        ) : (
          <button
            type="button"
            onClick={() => fileInputRef.current?.click()}
            className="px-4 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-semibold inline-flex items-center gap-2"
          >
            <Upload className="w-4 h-4 text-emerald-400" />
            <span>Select PDF Guidebook / Schedule</span>
          </button>
        )}
      </div>

      <input
        ref={fileInputRef}
        type="file"
        accept="application/pdf"
        onChange={handleFile}
        className="hidden"
      />
    </div>
  );
};
