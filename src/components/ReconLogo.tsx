import React from 'react';

interface ReconLogoProps {
  size?: 'sm' | 'md' | 'lg';
  showSubtitle?: boolean;
}

export const ReconLogo: React.FC<ReconLogoProps> = ({ size = 'md', showSubtitle = true }) => {
  const iconSizes = {
    sm: 'w-8 h-8 text-sm',
    md: 'w-10 h-10 text-base',
    lg: 'w-14 h-14 text-2xl'
  };

  const titleSizes = {
    sm: 'text-sm',
    md: 'text-base font-black',
    lg: 'text-2xl font-black'
  };

  return (
    <div className="flex items-center gap-3 select-none">
      {/* 3D Geometric Architectural Monogram */}
      <div className={`relative ${iconSizes[size]} rounded-xl bg-gradient-to-br from-emerald-400 via-emerald-600 to-teal-950 p-[1.5px] shadow-lg shadow-emerald-950/60 flex items-center justify-center`}>
        <div className="w-full h-full bg-slate-950/90 rounded-[10px] flex items-center justify-center relative overflow-hidden backdrop-blur-md">
          {/* Subtle Grid Accent */}
          <div className="absolute inset-0 bg-[linear-gradient(to_right,#10b98115_1px,transparent_1px),linear-gradient(to_bottom,#10b98115_1px,transparent_1px)] bg-[size:6px_6px]" />
          <span className="font-black text-transparent bg-clip-text bg-gradient-to-r from-emerald-300 via-teal-200 to-amber-300 tracking-tighter">
            R
          </span>
        </div>
        {/* Glowing Corner Pip */}
        <div className="absolute -top-0.5 -right-0.5 w-2 h-2 bg-emerald-400 rounded-full blur-[1px]" />
      </div>

      <div>
        <div className="flex items-center gap-1.5 leading-none">
          <span className={`${titleSizes[size]} text-white tracking-tight font-extrabold`}>
            RECON
          </span>
          <span className={`${titleSizes[size]} text-emerald-400 tracking-tight font-black`}>
            EXPO
          </span>
          <span className="text-[10px] font-bold px-1.5 py-0.5 rounded bg-emerald-500/20 text-emerald-300 border border-emerald-500/40 ml-0.5">
            2026
          </span>
        </div>
        {showSubtitle && (
          <p className="text-[10px] sm:text-[11px] font-medium text-slate-400 tracking-tight mt-0.5">
            8th Real Estate & Construction Expo • Abuja
          </p>
        )}
      </div>
    </div>
  );
};
