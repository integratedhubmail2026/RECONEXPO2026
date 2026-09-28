import React from 'react';
import { SmartIdCard } from '../SmartIdCard';
import { Attendee } from '../../types';
import { X } from 'lucide-react';

export const QrPassViewerModal: React.FC<{ attendee: Attendee; onClose: () => void }> = ({ attendee, onClose }) => {
  return (
    <div className="fixed inset-0 z-50 bg-black/90 backdrop-blur-md flex items-center justify-center p-4">
      <div className="relative">
        <button
          onClick={onClose}
          className="absolute -top-10 right-0 text-slate-400 hover:text-white p-1"
        >
          <X className="w-6 h-6" />
        </button>
        <SmartIdCard attendee={attendee} onClose={onClose} />
      </div>
    </div>
  );
};
