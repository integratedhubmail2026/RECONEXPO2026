import React, { useState } from 'react';
import { useExpoData } from '../context/ExpoDataContext';

interface ReconLogoProps {
  className?: string;
  size?: 'sm' | 'md' | 'lg' | 'xl' | '2xl';
  showSubtitle?: boolean;
  glow?: boolean;
  align?: 'start' | 'center';
  customLogoUrl?: string;
}

export const ReconLogo: React.FC<ReconLogoProps> = ({
  className = '',
  size = 'md',
  showSubtitle = false,
  glow = false,
  align = 'start',
  customLogoUrl
}) => {
  const [imageError, setImageError] = useState(false);

  // Safely attempt to read context if available
  let contextLogoUrl: string | undefined;
  try {
    const { expoDetails } = useExpoData();
    contextLogoUrl = expoDetails?.logoUrl;
  } catch {
    // Component used outside of provider if any
    contextLogoUrl = undefined;
  }

  const activeLogoUrl = customLogoUrl || contextLogoUrl;

  const sizeMap = {
    sm: 'h-10 sm:h-12 w-auto',
    md: 'h-14 sm:h-16 w-auto',
    lg: 'h-20 sm:h-24 w-auto',
    xl: 'h-28 sm:h-32 w-auto',
    '2xl': 'h-36 sm:h-44 w-auto'
  };

  const alignClass = align === 'center' ? 'items-center text-center' : 'items-start text-left';

  return (
    <div className={`inline-flex flex-col ${alignClass} select-none ${className}`}>
      {activeLogoUrl && !imageError ? (
        <img
          src={activeLogoUrl}
          alt="RECON Expo 2026 Logo"
          onError={() => setImageError(true)}
          className={`${sizeMap[size]} object-contain max-w-full transition-transform duration-300 ${
            glow ? 'filter drop-shadow-[0_0_20px_rgba(34,197,94,0.4)]' : 'filter drop-shadow-[0_4px_12px_rgba(0,0,0,0.2)]'
          }`}
        />
      ) : (
        <svg
          viewBox="0 0 980 400"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
          className={`${sizeMap[size]} transition-transform duration-300 ${
            glow ? 'filter drop-shadow-[0_0_20px_rgba(34,197,94,0.4)]' : 'filter drop-shadow-[0_4px_12px_rgba(0,0,0,0.2)]'
          }`}
        >
        <defs>
          {/* Main 3D Emerald Gradients */}
          <linearGradient id="reconEmeraldGrad" x1="0%" y1="0%" x2="0%" y2="100%">
            <stop offset="0%" stopColor="#00b047" />
            <stop offset="35%" stopColor="#009139" />
            <stop offset="100%" stopColor="#00501f" />
          </linearGradient>

          <linearGradient id="reconEmeraldLightFacet" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#00d655" />
            <stop offset="100%" stopColor="#00943a" />
          </linearGradient>

          <linearGradient id="reconEmeraldDarkFacet" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#006b29" />
            <stop offset="100%" stopColor="#003d16" />
          </linearGradient>

          <linearGradient id="reconExpoGreen" x1="0%" y1="0%" x2="0%" y2="100%">
            <stop offset="0%" stopColor="#00be4d" />
            <stop offset="100%" stopColor="#007a30" />
          </linearGradient>

          {/* Red 2026 Badge Gradient */}
          <linearGradient id="reconRedBadge" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#ff2828" />
            <stop offset="45%" stopColor="#e01818" />
            <stop offset="100%" stopColor="#9e0a0a" />
          </linearGradient>

          {/* Swoosh Gradients */}
          <linearGradient id="reconSwooshGreen" x1="0%" y1="0%" x2="100%" y2="0%">
            <stop offset="0%" stopColor="#00b84c" />
            <stop offset="50%" stopColor="#008836" />
            <stop offset="100%" stopColor="#004d1d" />
          </linearGradient>

          <linearGradient id="reconSwooshRed" x1="0%" y1="0%" x2="100%" y2="0%">
            <stop offset="0%" stopColor="#f02424" />
            <stop offset="60%" stopColor="#cb1616" />
            <stop offset="100%" stopColor="#8a0808" />
          </linearGradient>

          {/* Badge Filter */}
          <filter id="reconBadgeFilter" x="-10%" y="-10%" width="130%" height="130%">
            <feDropShadow dx="0" dy="4" stdDeviation="4" floodColor="#000000" floodOpacity="0.25" />
          </filter>
        </defs>

        {/* 1. LEFT ARCHITECTURAL ICONOGRAPHY (Buildings, Brick Chimney, House Gable) */}
        <g id="left-architectural-emblem">
          {/* Far Left Green Building (3D Faceted Block) */}
          <path
            d="M15 315 L15 150 L85 105 L135 130 L135 315 Z"
            fill="url(#reconEmeraldDarkFacet)"
          />
          <path
            d="M85 105 L135 130 L135 315 L85 315 Z"
            fill="url(#reconEmeraldLightFacet)"
          />
          {/* Left top beveled highlight */}
          <path
            d="M15 150 L85 105 L65 140 L15 170 Z"
            fill="#00e65b"
            opacity="0.9"
          />

          {/* Center Tall Emerald Skyscraper (3D Faceted Tower) */}
          <path
            d="M190 260 L190 60 L275 15 L275 290 Z"
            fill="#005421"
          />
          <path
            d="M275 15 L320 50 L320 290 L275 290 Z"
            fill="url(#reconEmeraldLightFacet)"
          />
          {/* Tower 3D Bevel Facet Highlight */}
          <path
            d="M225 80 L275 15 L275 290 L230 290 Z"
            fill="#00ff66"
            opacity="0.6"
          />

          {/* Red Brick Chimney / Vertical Wall */}
          <path
            d="M115 280 L115 80 L195 80 L195 280 Z"
            fill="#d31e1e"
          />
          {/* Brick White Mortar Grid Lines */}
          <g stroke="#ffffff" strokeWidth="2.8" opacity="0.95">
            {/* Horizontal Mortar Lines */}
            <line x1="115" y1="102" x2="195" y2="102" />
            <line x1="115" y1="124" x2="195" y2="124" />
            <line x1="115" y1="146" x2="195" y2="146" />
            <line x1="115" y1="168" x2="195" y2="168" />
            <line x1="115" y1="190" x2="195" y2="190" />
            <line x1="115" y1="212" x2="195" y2="212" />
            <line x1="115" y1="234" x2="195" y2="234" />
            {/* Staggered Vertical Mortar Joints */}
            <line x1="142" y1="80" x2="142" y2="102" />
            <line x1="168" y1="80" x2="168" y2="102" />
            <line x1="128" y1="102" x2="128" y2="124" />
            <line x1="155" y1="102" x2="155" y2="124" />
            <line x1="182" y1="102" x2="182" y2="124" />
            <line x1="142" y1="124" x2="142" y2="146" />
            <line x1="168" y1="124" x2="168" y2="146" />
            <line x1="128" y1="146" x2="128" y2="168" />
            <line x1="155" y1="146" x2="155" y2="168" />
            <line x1="182" y1="146" x2="182" y2="168" />
            <line x1="142" y1="168" x2="142" y2="190" />
            <line x1="168" y1="168" x2="168" y2="190" />
            <line x1="128" y1="190" x2="128" y2="212" />
            <line x1="155" y1="190" x2="155" y2="212" />
            <line x1="182" y1="190" x2="182" y2="212" />
          </g>

          {/* Foreground Residential House Structure */}
          {/* White Outer Roof Chevron Rim */}
          <path
            d="M25 330 L205 195 L340 315 L318 328 L205 225 L45 340 Z"
            fill="#ffffff"
          />
          {/* Red Apex Roof Trim */}
          <path
            d="M10 338 L205 180 L355 315 L330 335 L205 212 L35 352 Z"
            fill="#ea2020"
          />
          {/* Clean White Triangular House Base Wall */}
          <path
            d="M55 338 L205 215 L305 320 L305 338 L55 338 Z"
            fill="#ffffff"
          />

          {/* 4-Pane Square Green House Window */}
          <g transform="translate(175, 238)">
            <rect x="0" y="0" width="18" height="18" fill="#008033" rx="2" />
            <rect x="23" y="0" width="18" height="18" fill="#008033" rx="2" />
            <rect x="0" y="23" width="18" height="18" fill="#008033" rx="2" />
            <rect x="23" y="23" width="18" height="18" fill="#008033" rx="2" />
          </g>
        </g>

        {/* 2. MAIN LOGO TYPOGRAPHY "RECON" */}
        <g id="recon-main-text">
          {/* 'R' */}
          <path
            d="M340 70 H415 C455 70 480 92 480 125 C480 152 460 172 428 178 L490 255 H432 L382 188 H372 V255 H340 Z M372 98 V160 H410 C432 160 448 148 448 130 C448 112 432 98 410 98 Z"
            fill="url(#reconEmeraldGrad)"
          />
          {/* R 3D Highlight */}
          <path
            d="M340 70 L372 70 L400 102 L372 102 Z"
            fill="#00e65b"
            opacity="0.4"
          />

          {/* 'E' */}
          <path
            d="M495 70 H580 V102 H530 V142 H572 V174 H530 V222 H585 V255 H495 Z"
            fill="url(#reconEmeraldGrad)"
          />
          {/* E 3D Highlight */}
          <path
            d="M495 70 H580 L560 90 H530 V70 Z"
            fill="#00e65b"
            opacity="0.35"
          />

          {/* 'C' */}
          <path
            d="M668 102 C658 80 638 70 612 70 C575 70 542 102 542 162 C542 222 575 255 612 255 C638 255 658 245 668 222 L640 202 C634 215 624 224 612 224 C590 224 576 200 576 162 C576 124 590 100 612 100 C624 100 634 110 640 122 Z"
            fill="url(#reconEmeraldGrad)"
          />

          {/* 'O' with Emblem (Ring + Mini Skyline nested on top) */}
          <g id="recon-letter-o-emblem">
            {/* Outer Circular Green Ring of O */}
            <path
              d="M680 162 C680 102 715 68 765 68 C815 68 850 102 850 162 C850 222 815 258 765 258 C715 258 680 222 680 162 Z M714 162 C714 204 735 226 765 226 C795 226 816 204 816 162 C816 120 795 98 765 98 C735 98 714 120 714 162 Z"
              fill="url(#reconEmeraldGrad)"
            />

            {/* Miniature Skyline sitting inside/top of 'O' */}
            <g transform="translate(740, 10)">
              {/* Mini Green Skyscraper */}
              <path d="M15 82 L15 35 L36 15 L36 82 Z" fill="#005823" />
              <path d="M36 15 L52 28 L52 82 L36 82 Z" fill="#00a342" />
              {/* Mini Red Brick Chimney */}
              <rect x="0" y="44" width="16" height="38" fill="#d31e1e" />
              <g stroke="#ffffff" strokeWidth="1.6" opacity="0.95">
                <line x1="0" y1="54" x2="16" y2="54" />
                <line x1="0" y1="64" x2="16" y2="64" />
                <line x1="0" y1="74" x2="16" y2="74" />
                <line x1="8" y1="44" x2="8" y2="54" />
                <line x1="4" y1="54" x2="4" y2="64" />
                <line x1="12" y1="54" x2="12" y2="64" />
                <line x1="8" y1="64" x2="8" y2="74" />
              </g>
              {/* Mini Red Roof Gable in O Center */}
              <path d="M-18 108 L26 62 L70 108 L56 116 L26 86 L-4 116 Z" fill="#ea2020" />
              <path d="M-6 108 L26 76 L58 108 Z" fill="#ffffff" />
            </g>
          </g>

          {/* 'N' */}
          <path
            d="M865 70 H900 L952 195 V70 H985 V255 H952 L898 128 V255 H865 Z"
            fill="url(#reconEmeraldGrad)"
          />
        </g>

        {/* 3. "Expo" & "2026" RED SPEED CAPSULE BADGE */}
        <g id="expo-2026-badge" transform="translate(340, 245)">
          {/* "Expo" in Bold Italic Emerald Font */}
          <text
            x="0"
            y="76"
            fontFamily="'Syne', 'Outfit', system-ui, sans-serif"
            fontWeight="900"
            fontSize="94"
            fill="url(#reconExpoGreen)"
            fontStyle="italic"
            letterSpacing="-2"
          >
            Expo
          </text>

          {/* Aerodynamic 3D Red Badge Container */}
          <g transform="translate(255, -8)" filter="url(#reconBadgeFilter)">
            <path
              d="M32 6 C16 6 5 18 0 30 L-22 92 C-26 104 -16 114 -4 114 L340 114 C366 114 378 94 382 78 L392 24 C395 12 384 6 368 6 Z"
              fill="url(#reconRedBadge)"
            />
            {/* Top Gloss Reflection Arc */}
            <path
              d="M28 14 L360 14 C372 14 376 20 372 32 L360 52 L6 52 L22 22 C24 16 26 14 28 14 Z"
              fill="#ffffff"
              opacity="0.28"
            />
            {/* "2026" in Heavy Slanted White Display Type */}
            <text
              x="178"
              y="88"
              textAnchor="middle"
              fontFamily="'Outfit', 'Plus Jakarta Sans', system-ui, sans-serif"
              fontWeight="900"
              fontSize="90"
              fill="#ffffff"
              fontStyle="italic"
              letterSpacing="1"
            >
              2026
            </text>
          </g>
        </g>

        {/* 4. DYNAMIC RACING SWOOSHES (EMERALD GREEN & VIBRANT RED) */}
        <g id="bottom-flowing-swooshes">
          {/* Emerald Green Primary Flowing Swoosh */}
          <path
            d="M10 360 C140 295 360 305 560 325 C750 345 900 325 970 250 C960 278 830 342 610 342 C380 342 180 388 10 360 Z"
            fill="url(#reconSwooshGreen)"
          />
          {/* Vibrant Red Secondary Racing Swoosh */}
          <path
            d="M165 358 C270 380 490 392 680 365 C800 342 880 320 940 292 C885 332 770 375 620 388 C420 405 255 392 165 358 Z"
            fill="url(#reconSwooshRed)"
          />
        </g>
      </svg>
      )}

      {showSubtitle && (
        <span className="text-[10px] sm:text-xs uppercase font-bold tracking-[0.25em] text-[#22c55e] ml-1 mt-1">
          Real Estate & Construction Expo • Abuja
        </span>
      )}
    </div>
  );
};


