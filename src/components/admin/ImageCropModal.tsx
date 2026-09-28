import React, { useState } from 'react';
import { X, Check, Crop } from 'lucide-react';
import { playSound } from '../../utils/soundService';

interface ImageCropModalProps {
  imageSrc: string;
  onCropComplete: (croppedUrl: string) => void;
  onClose: () => void;
}

export const ImageCropModal: React.FC<ImageCropModalProps> = ({
  imageSrc,
  onCropComplete,
  onClose
}) => {
  const handleSave = () => {
    playSound('success');
    onCropComplete(imageSrc);
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/85 backdrop-blur-md flex items-center justify-center p-4">
      <div className="bg-slate-950 border border-emerald-500/40 rounded-3xl max-w-md w-full p-6 text-white shadow-2xl relative">
        <button
          onClick={onClose}
          className="absolute top-5 right-5 text-slate-400 hover:text-white p-1 rounded-xl bg-slate-900 border border-slate-800"
        >
          <X className="w-5 h-5" />
        </button>

        <div className="flex items-center gap-2 text-xs font-bold text-emerald-400 uppercase tracking-wider mb-2">
          <Crop className="w-4 h-4" />
          <span>Image Adjuster</span>
        </div>
        <h3 className="text-lg font-black mb-4">Confirm Badge Photo Crop</h3>

        <div className="w-48 h-48 mx-auto rounded-2xl overflow-hidden border-2 border-emerald-500/60 bg-slate-900 shadow-xl mb-6 flex items-center justify-center">
          <img src={imageSrc} alt="Crop view" className="w-full h-full object-cover" />
        </div>

        <div className="flex gap-2">
          <button
            type="button"
            onClick={onClose}
            className="flex-1 py-2.5 rounded-xl bg-slate-900 text-slate-300 text-xs font-semibold hover:bg-slate-800"
          >
            Cancel
          </button>
          <button
            type="button"
            onClick={handleSave}
            className="flex-1 py-2.5 rounded-xl bg-emerald-500 text-slate-950 font-bold text-xs hover:bg-emerald-400"
          >
            Apply Photo
          </button>
        </div>
      </div>
    </div>
  );
};
