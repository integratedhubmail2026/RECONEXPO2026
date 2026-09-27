import React, { useState, useRef } from 'react';
import { 
  FileText, 
  Upload, 
  Trash2, 
  ExternalLink, 
  CheckCircle2, 
  Link2, 
  AlertCircle, 
  Download,
  Loader2,
  FileCheck
} from 'lucide-react';

interface PdfUploadInputProps {
  currentPdfUrl?: string;
  currentPdfName?: string;
  currentPdfSize?: string;
  currentPdfUpdatedAt?: string;
  onPdfChange: (pdfData: { url: string; name: string; size: string; updatedAt: string } | null) => void;
  onGenerateDefaultPdf?: () => void;
  onSyncLivePdf?: () => void;
}

export const PdfUploadInput: React.FC<PdfUploadInputProps> = ({
  currentPdfUrl,
  currentPdfName,
  currentPdfSize,
  currentPdfUpdatedAt,
  onPdfChange,
  onGenerateDefaultPdf,
  onSyncLivePdf
}) => {
  const [isDragging, setIsDragging] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [isSyncing, setIsSyncing] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [showUrlInput, setShowUrlInput] = useState(false);
  const [isEditingName, setIsEditingName] = useState(false);
  const [editedName, setEditedName] = useState('');
  const [manualUrl, setManualUrl] = useState('');
  const [manualName, setManualName] = useState('');
  
  const fileInputRef = useRef<HTMLInputElement>(null);

  const formatFileSize = (bytes: number): string => {
    if (bytes < 1024) return `${bytes} B`;
    if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
    return `${(bytes / (1024 * 1024)).toFixed(2)} MB`;
  };

  const handleFile = (file: File) => {
    setError(null);

    // Verify it is a PDF
    if (file.type !== 'application/pdf' && !file.name.toLowerCase().endsWith('.pdf')) {
      setError('Please upload a valid PDF document (.pdf)');
      return;
    }

    // Check size limit: warn if above 15MB for localStorage
    if (file.size > 15 * 1024 * 1024) {
      setError('PDF file is too large (max 15MB recommended). Please optimize your PDF file.');
      return;
    }

    setIsLoading(true);
    const reader = new FileReader();

    reader.onload = (e) => {
      const dataUrl = e.target?.result as string;
      if (dataUrl) {
        const formattedSize = formatFileSize(file.size);
        const now = new Date().toLocaleString('en-US', { 
          month: 'short', 
          day: 'numeric', 
          year: 'numeric',
          hour: '2-digit', 
          minute: '2-digit' 
        });
        onPdfChange({
          url: dataUrl,
          name: file.name,
          size: formattedSize,
          updatedAt: now
        });
      }
      setIsLoading(false);
    };

    reader.onerror = () => {
      setError('Failed to read PDF file. Please try again.');
      setIsLoading(false);
    };

    reader.readAsDataURL(file);
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      handleFile(e.dataTransfer.files[0]);
    }
  };

  const handleManualUrlSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!manualUrl.trim()) return;

    const trimmedUrl = manualUrl.trim();
    const derivedName = manualName.trim() || trimmedUrl.split('/').pop() || 'RECON_Expo_2026_Conference_Schedule.pdf';
    const now = new Date().toLocaleString('en-US', { 
      month: 'short', 
      day: 'numeric', 
      year: 'numeric',
      hour: '2-digit', 
      minute: '2-digit' 
    });

    onPdfChange({
      url: trimmedUrl,
      name: derivedName.endsWith('.pdf') ? derivedName : `${derivedName}.pdf`,
      size: 'Remote Link / Cloud URL',
      updatedAt: now
    });

    setManualUrl('');
    setManualName('');
    setShowUrlInput(false);
  };

  const handleSaveEditedName = () => {
    if (!currentPdfUrl) return;
    const finalName = editedName.trim();
    if (finalName) {
      onPdfChange({
        url: currentPdfUrl,
        name: finalName.endsWith('.pdf') ? finalName : `${finalName}.pdf`,
        size: currentPdfSize || 'Document',
        updatedAt: new Date().toLocaleString('en-US', { 
          month: 'short', 
          day: 'numeric', 
          year: 'numeric',
          hour: '2-digit', 
          minute: '2-digit' 
        })
      });
    }
    setIsEditingName(false);
  };

  const handleSyncClick = async () => {
    if (!onSyncLivePdf) return;
    setIsSyncing(true);
    try {
      await onSyncLivePdf();
    } finally {
      setIsSyncing(false);
    }
  };

  const handleDownloadTest = () => {
    if (!currentPdfUrl) return;

    if (currentPdfUrl.startsWith('data:')) {
      const a = document.createElement('a');
      a.href = currentPdfUrl;
      a.download = currentPdfName || 'RECON_Expo_2026_Full_Conference_Schedule.pdf';
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
    } else {
      window.open(currentPdfUrl, '_blank', 'noopener,noreferrer');
    }
  };

  return (
    <div className="p-5 rounded-2xl bg-black/50 border border-emerald-500/30 space-y-4">
      {/* Header */}
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div className="flex items-center gap-2.5">
          <div className="w-9 h-9 rounded-xl bg-emerald-500/20 border border-emerald-500/40 flex items-center justify-center text-emerald-400">
            <FileText className="w-5 h-5" />
          </div>
          <div>
            <h3 className="text-sm font-bold text-white flex items-center gap-2">
              Full Conference Schedule PDF Document
              {currentPdfUrl ? (
                <span className="px-2 py-0.5 rounded-full text-[10px] font-extrabold bg-emerald-500/20 text-emerald-300 border border-emerald-500/40 uppercase tracking-wider">
                  Custom Upload Active
                </span>
              ) : (
                <span className="px-2 py-0.5 rounded-full text-[10px] font-extrabold bg-amber-500/20 text-amber-300 border border-amber-500/40 uppercase tracking-wider">
                  Dynamic Auto-Generator Active
                </span>
              )}
            </h3>
            <p className="text-xs text-slate-400">
              {currentPdfUrl 
                ? 'Public delegates download this uploaded PDF document. You can update, replace, or sync it below.' 
                : 'No static PDF uploaded. The app automatically compiles all live sessions into a branded PDF in real-time.'}
            </p>
          </div>
        </div>

        {/* Action Controls */}
        <div className="flex flex-wrap items-center gap-2">
          {onSyncLivePdf && (
            <button
              type="button"
              onClick={handleSyncClick}
              disabled={isSyncing}
              className="px-3.5 py-1.5 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-emerald-950 text-xs font-extrabold flex items-center gap-1.5 transition-all shadow-md cursor-pointer disabled:opacity-50"
              title="Compile and save the latest live sessions as the active updated PDF"
            >
              {isSyncing ? (
                <Loader2 className="w-3.5 h-3.5 animate-spin" />
              ) : (
                <CheckCircle2 className="w-3.5 h-3.5" />
              )}
              <span>{currentPdfUrl ? 'Update PDF from Live Database' : 'Save Live Sessions as PDF'}</span>
            </button>
          )}

          <button
            type="button"
            onClick={() => setShowUrlInput(!showUrlInput)}
            className="px-3 py-1.5 rounded-xl bg-white/5 hover:bg-white/10 text-slate-300 text-xs font-medium border border-white/10 flex items-center gap-1.5 transition-colors cursor-pointer"
          >
            <Link2 className="w-3.5 h-3.5 text-emerald-400" />
            <span>{showUrlInput ? 'Upload File Mode' : 'Link External URL'}</span>
          </button>

          {onGenerateDefaultPdf && (
            <button
              type="button"
              onClick={onGenerateDefaultPdf}
              className="px-3 py-1.5 rounded-xl bg-white/5 hover:bg-white/10 text-slate-300 text-xs font-medium border border-white/10 flex items-center gap-1.5 transition-colors cursor-pointer"
              title="Test auto-generated schedule PDF"
            >
              <FileCheck className="w-3.5 h-3.5 text-emerald-400" />
              <span>Test Preview</span>
            </button>
          )}
        </div>
      </div>

      {/* Error Message */}
      {error && (
        <div className="p-3 rounded-xl bg-red-500/10 border border-red-500/30 text-red-300 text-xs flex items-center gap-2">
          <AlertCircle className="w-4 h-4 flex-shrink-0" />
          <span>{error}</span>
        </div>
      )}

      {/* Upload Box or URL Form */}
      {showUrlInput ? (
        <form onSubmit={handleManualUrlSubmit} className="p-4 rounded-xl bg-white/5 border border-white/10 space-y-3">
          <div className="text-xs font-bold text-slate-200">
            Paste Direct Downloadable PDF URL (e.g. AWS S3, Google Drive, Cloud Storage, or CDN)
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            <div>
              <label className="block text-[11px] text-slate-400 mb-1">PDF File URL *</label>
              <input
                type="url"
                required
                placeholder="https://example.com/RECON-2026-Schedule.pdf"
                value={manualUrl}
                onChange={(e) => setManualUrl(e.target.value)}
                className="w-full px-3 py-2 rounded-xl bg-black/60 border border-white/15 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-emerald-400"
              />
            </div>
            <div>
              <label className="block text-[11px] text-slate-400 mb-1">Display Document Name (Optional)</label>
              <input
                type="text"
                placeholder="RECON_Expo_2026_Official_Programme.pdf"
                value={manualName}
                onChange={(e) => setManualName(e.target.value)}
                className="w-full px-3 py-2 rounded-xl bg-black/60 border border-white/15 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-emerald-400"
              />
            </div>
          </div>
          <div className="flex justify-end gap-2">
            <button
              type="button"
              onClick={() => setShowUrlInput(false)}
              className="px-3 py-1.5 rounded-xl bg-white/10 hover:bg-white/15 text-slate-300 text-xs font-medium cursor-pointer"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-4 py-1.5 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-emerald-950 text-xs font-bold shadow-md cursor-pointer"
            >
              Save PDF Link
            </button>
          </div>
        </form>
      ) : (
        <div>
          <input
            ref={fileInputRef}
            type="file"
            accept=".pdf,application/pdf"
            className="hidden"
            onChange={(e) => {
              if (e.target.files && e.target.files[0]) {
                handleFile(e.target.files[0]);
              }
            }}
          />

          <div
            onDragOver={handleDragOver}
            onDragLeave={handleDragLeave}
            onDrop={handleDrop}
            onClick={() => fileInputRef.current?.click()}
            className={`p-6 rounded-2xl border-2 border-dashed transition-all flex flex-col items-center justify-center text-center cursor-pointer ${
              isDragging
                ? 'border-emerald-400 bg-emerald-500/10'
                : 'border-white/20 hover:border-emerald-400/60 bg-black/40 hover:bg-black/60'
            }`}
          >
            {isLoading ? (
              <div className="flex flex-col items-center gap-2 py-3">
                <Loader2 className="w-8 h-8 animate-spin text-emerald-400" />
                <p className="text-xs font-bold text-slate-200">Processing & loading PDF document...</p>
              </div>
            ) : (
              <div className="flex flex-col items-center gap-2">
                <div className="w-12 h-12 rounded-2xl bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center text-emerald-400 mb-1">
                  <Upload className="w-6 h-6" />
                </div>
                <div className="text-sm font-bold text-white">
                  {currentPdfUrl ? 'Click to Upload / Update New PDF File Version' : 'Click to Browse or Drag & Drop PDF Document'}
                </div>
                <p className="text-xs text-slate-400 max-w-md">
                  Upload the updated conference booklet or full schedule PDF. Supported formats: <strong className="text-emerald-300">.pdf</strong> up to 15MB.
                </p>
              </div>
            )}
          </div>
        </div>
      )}

      {/* Active PDF Status Card with Update & Rename options */}
      {currentPdfUrl && (
        <div className="p-4 rounded-xl bg-white/5 border border-emerald-500/30 flex flex-wrap items-center justify-between gap-3">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-red-500/20 border border-red-500/30 flex items-center justify-center text-red-400 font-bold flex-shrink-0">
              <FileText className="w-5 h-5" />
            </div>
            <div>
              {isEditingName ? (
                <div className="flex items-center gap-2">
                  <input
                    type="text"
                    value={editedName}
                    onChange={(e) => setEditedName(e.target.value)}
                    className="px-2 py-1 rounded-lg bg-black/70 border border-emerald-400 text-xs text-white focus:outline-none"
                    placeholder="Document_Name.pdf"
                    autoFocus
                  />
                  <button
                    type="button"
                    onClick={handleSaveEditedName}
                    className="px-2 py-1 rounded-lg bg-emerald-500 text-emerald-950 text-xs font-bold"
                  >
                    Save
                  </button>
                  <button
                    type="button"
                    onClick={() => setIsEditingName(false)}
                    className="px-2 py-1 rounded-lg bg-white/10 text-slate-300 text-xs"
                  >
                    Cancel
                  </button>
                </div>
              ) : (
                <div className="text-xs font-bold text-white flex items-center gap-2">
                  <span>{currentPdfName || 'RECON_Expo_2026_Full_Conference_Programme.pdf'}</span>
                  <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
                  <button
                    type="button"
                    onClick={() => {
                      setEditedName(currentPdfName || 'RECON_Expo_2026_Full_Conference_Programme.pdf');
                      setIsEditingName(true);
                    }}
                    className="text-[10px] text-slate-400 hover:text-emerald-300 underline ml-1 cursor-pointer"
                  >
                    Rename
                  </button>
                </div>
              )}
              
              <div className="text-[11px] text-slate-400 flex flex-wrap items-center gap-3 mt-0.5 font-mono">
                {currentPdfSize && <span>Size: {currentPdfSize}</span>}
                {currentPdfUpdatedAt && <span>Updated: {currentPdfUpdatedAt}</span>}
              </div>
            </div>
          </div>

          <div className="flex flex-wrap items-center gap-2">
            <button
              type="button"
              onClick={() => fileInputRef.current?.click()}
              className="px-3 py-1.5 rounded-xl bg-white/10 hover:bg-white/20 text-white text-xs font-bold flex items-center gap-1.5 transition-all cursor-pointer border border-white/10"
              title="Replace current PDF with a newer file"
            >
              <Upload className="w-3.5 h-3.5 text-emerald-400" />
              <span>Replace File</span>
            </button>

            <button
              type="button"
              onClick={handleDownloadTest}
              className="px-3 py-1.5 rounded-xl bg-emerald-500/20 hover:bg-emerald-500 hover:text-emerald-950 text-emerald-300 text-xs font-bold flex items-center gap-1.5 transition-all cursor-pointer"
              title="Test & download current uploaded PDF"
            >
              <Download className="w-3.5 h-3.5" />
              <span>Download Test</span>
            </button>

            <button
              type="button"
              onClick={() => onPdfChange(null)}
              className="p-2 rounded-xl bg-white/10 hover:bg-red-500 hover:text-white text-slate-400 transition-colors cursor-pointer"
              title="Remove custom PDF and revert to dynamic schedule generator"
            >
              <Trash2 className="w-4 h-4" />
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
