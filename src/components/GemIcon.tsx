import React from 'react';
import { GemType, SpecialType } from '../types/game';

interface GemIconProps {
  type: GemType;
  special?: SpecialType;
  size?: number;
  isHinted?: boolean;
  isSelected?: boolean;
  isFrozen?: boolean;
}

export const GemIcon: React.FC<GemIconProps> = ({
  type,
  special = 'normal',
  size = 40,
  isHinted = false,
  isSelected = false,
  isFrozen = false,
}) => {
  return (
    <div
      className={`relative flex items-center justify-center select-none transition-transform duration-100 ${
        isSelected ? 'scale-115' : 'hover:scale-105'
      } ${isHinted ? 'animate-pulse' : ''}`}
      style={{ width: size, height: size }}
    >
      {/* Selection Glow / Ring */}
      {isSelected && (
        <div className="absolute inset-0 rounded-md border-2 border-white shadow-[0_0_8px_rgba(255,255,255,0.9)] animate-pulse pointer-events-none" />
      )}

      {/* Hint Sparkle Effect */}
      {isHinted && (
        <div className="absolute inset-[-4px] rounded-full border border-yellow-300 shadow-[0_0_12px_#ffe600] animate-ping pointer-events-none" />
      )}

      {/* Special: Flame aura */}
      {special === 'flame' && (
        <div className="absolute inset-[-3px] rounded-full bg-gradient-to-r from-amber-500 via-red-500 to-yellow-400 opacity-75 blur-xs animate-pulse pointer-events-none" />
      )}

      {/* Special: Hypercube aura */}
      {special === 'hypercube' && (
        <div className="absolute inset-[-4px] rounded-full bg-gradient-to-tr from-cyan-400 via-fuchsia-500 to-amber-300 opacity-90 blur-[2px] animate-spin pointer-events-none [animation-duration:3s]" />
      )}

      {/* Frozen / Locked Ice Effect (Level 2+ Difficulty) */}
      {isFrozen && (
        <div className="absolute inset-0 z-10 rounded-md bg-cyan-300/30 border border-cyan-200/90 shadow-[inset_0_0_8px_rgba(255,255,255,0.9),0_0_6px_rgba(56,189,248,0.6)] backdrop-blur-[0.5px] pointer-events-none flex items-start justify-end p-0.5">
          {/* Ice crack lines */}
          <svg className="absolute inset-0 w-full h-full opacity-70" viewBox="0 0 40 40">
            <path d="M5,10 L15,22 L10,35 M15,22 L28,24 L35,12 M28,24 L32,36" stroke="#ffffff" strokeWidth="1" fill="none" strokeLinecap="round" />
          </svg>
          <span className="text-[10px] drop-shadow-[0_1px_2px_rgba(0,0,0,0.8)] relative z-10 leading-none">❄️</span>
        </div>
      )}

      <svg
        viewBox="0 0 100 100"
        width={size}
        height={size}
        className="drop-shadow-[0_2px_3px_rgba(0,0,0,0.6)]"
      >
        <defs>
          {/* Specular White Shimmer */}
          <linearGradient id="shimmer" x1="0" y1="0" x2="1" y2="1">
            <stop offset="0%" stopColor="#ffffff" stopOpacity="0.85" />
            <stop offset="50%" stopColor="#ffffff" stopOpacity="0.1" />
            <stop offset="100%" stopColor="#ffffff" stopOpacity="0" />
          </linearGradient>

          {/* Hypercube Multi-color Gradient */}
          <radialGradient id="hyperGrad" cx="35%" cy="35%" r="65%">
            <stop offset="0%" stopColor="#ffffff" />
            <stop offset="25%" stopColor="#67e8f9" />
            <stop offset="50%" stopColor="#c084fc" />
            <stop offset="75%" stopColor="#fbbf24" />
            <stop offset="100%" stopColor="#f43f5e" />
          </radialGradient>
        </defs>

        {special === 'hypercube' ? (
          // Hypercube 5-match
          <g>
            <rect x="15" y="15" width="70" height="70" rx="8" fill="url(#hyperGrad)" stroke="#ffffff" strokeWidth="2.5" />
            <polygon points="15,15 50,30 50,70 15,85" fill="rgba(255,255,255,0.3)" />
            <polygon points="85,15 50,30 50,70 85,85" fill="rgba(0,0,0,0.25)" />
            <polygon points="15,15 85,15 50,30" fill="rgba(255,255,255,0.6)" />
            <polygon points="15,85 85,85 50,70" fill="rgba(0,0,0,0.4)" />
            <circle cx="50" cy="50" r="12" fill="#ffffff" filter="drop-shadow(0 0 4px #ffffff)" />
            {/* 4-point star glint */}
            <path d="M50 30 Q50 50 30 50 Q50 50 50 70 Q50 50 70 50 Q50 50 50 30 Z" fill="#ffff99" />
          </g>
        ) : (
          renderGemSvg(type)
        )}

        {/* Flame Gem flame badge icon overlay */}
        {special === 'flame' && (
          <g transform="translate(56, 12) scale(0.32)">
            <path
              d="M12 0 C12 7 18 10 18 16 C18 21.5 13.5 26 8 26 C2.5 26 -2 21.5 -2 16 C-2 11 4 8 4 3 C4 8 9 9 9 14 C9 17 6.5 19 4 19 C7 19 12 16 12 10 Z"
              fill="#ff4500"
              stroke="#ffe600"
              strokeWidth="2"
              filter="drop-shadow(0 0 3px #ffea00)"
            />
          </g>
        )}
      </svg>
    </div>
  );
};

function renderGemSvg(type: GemType) {
  switch (type) {
    case 'ruby':
      // Red square cushion cut with 4-square cross pillow bevel and upper left bright specular light
      return (
        <g id="ruby">
          {/* Base outer rounded square */}
          <rect x="10" y="10" width="80" height="80" rx="8" fill="#80000a" stroke="#4a0006" strokeWidth="2" />
          {/* Inner 4-facet cross */}
          {/* Top-Left facet: bright crimson */}
          <polygon points="12,12 50,22 50,50 22,50" fill="#e60026" />
          {/* Top-Right facet */}
          <polygon points="88,12 78,50 50,50 50,22" fill="#b8001a" />
          {/* Bottom-Left facet */}
          <polygon points="12,88 22,50 50,50 50,78" fill="#a10015" />
          {/* Bottom-Right facet: deep red */}
          <polygon points="88,88 50,78 50,50 78,50" fill="#6b000b" />

          {/* Center cushion pad */}
          <rect x="26" y="26" width="48" height="48" rx="4" fill="#d90429" stroke="#ff4d6d" strokeWidth="1.5" />
          {/* Upper left bright 4-square cushion highlights like in reference */}
          <rect x="30" y="30" width="18" height="18" fill="#ff758f" />
          <rect x="52" y="30" width="18" height="18" fill="#ef233c" />
          <rect x="30" y="52" width="18" height="18" fill="#d90429" />
          <rect x="52" y="52" width="18" height="18" fill="#a8031d" />

          {/* Sparkling white highlight spot */}
          <circle cx="28" cy="28" r="4" fill="#ffffff" />
          <polygon points="28,20 29.5,28 36,28 30.5,31 33,38 28,33 23,38 25.5,31 20,28 26.5,28" fill="#ffffff" opacity="0.85" />
        </g>
      );

    case 'diamond':
      // White/Silver 8-facet brilliant cut diamond
      return (
        <g id="diamond">
          {/* Outer octagon base */}
          <polygon
            points="30,10 70,10 90,30 90,70 70,90 30,90 10,70 10,30"
            fill="#a8b2c1"
            stroke="#5c6575"
            strokeWidth="2"
          />
          {/* Outer facet bevels */}
          <polygon points="30,10 70,10 65,28 35,28" fill="#ffffff" />
          <polygon points="70,10 90,30 72,35 65,28" fill="#dbe1e8" />
          <polygon points="90,30 90,70 72,65 72,35" fill="#94a3b8" />
          <polygon points="90,70 70,90 65,72 72,65" fill="#64748b" />
          <polygon points="70,90 30,90 35,72 65,72" fill="#475569" />
          <polygon points="30,90 10,70 28,65 35,72" fill="#64748b" />
          <polygon points="10,70 10,30 28,35 28,65" fill="#cbd5e1" />
          <polygon points="10,30 30,10 35,28 28,35" fill="#f1f5f9" />

          {/* Inner octagon table */}
          <polygon
            points="35,28 65,28 72,35 72,65 65,72 35,72 28,65 28,35"
            fill="#e2e8f0"
            stroke="#ffffff"
            strokeWidth="1.5"
          />
          {/* Facet reflections */}
          <polygon points="35,28 50,50 28,35" fill="#ffffff" />
          <polygon points="65,28 50,50 35,28" fill="#f8fafc" />
          <polygon points="72,35 50,50 65,28" fill="#dbe1e8" />
          <polygon points="72,65 50,50 72,35" fill="#cbd5e1" />
          <polygon points="65,72 50,50 72,65" fill="#94a3b8" />
          <polygon points="35,72 50,50 65,72" fill="#64748b" />
          <polygon points="28,65 50,50 35,72" fill="#94a3b8" />
          <polygon points="28,35 50,50 28,65" fill="#e2e8f0" />

          {/* Glistening white glint */}
          <circle cx="36" cy="30" r="3.5" fill="#ffffff" />
        </g>
      );

    case 'citrine':
      // Orange horizontal hexagon
      return (
        <g id="citrine">
          {/* Base elongated horizontal hexagon */}
          <polygon
            points="22,18 78,18 94,50 78,82 22,82 6,50"
            fill="#d97706"
            stroke="#78350f"
            strokeWidth="2"
          />
          {/* Top slope facet: golden orange */}
          <polygon points="22,18 78,18 70,35 30,35" fill="#fbbf24" />
          {/* Top-right facet */}
          <polygon points="78,18 94,50 75,50 70,35" fill="#f59e0b" />
          {/* Bottom-right facet */}
          <polygon points="94,50 78,82 70,65 75,50" fill="#b45309" />
          {/* Bottom slope facet: deep brown amber */}
          <polygon points="78,82 22,82 30,65 70,65" fill="#92400e" />
          {/* Bottom-left facet */}
          <polygon points="22,82 6,50 25,50 30,65" fill="#b45309" />
          {/* Top-left facet: bright amber */}
          <polygon points="6,50 22,18 30,35 25,50" fill="#fde68a" />

          {/* Central flat facet */}
          <polygon
            points="30,35 70,35 75,50 70,65 30,65 25,50"
            fill="#f59e0b"
            stroke="#fed7aa"
            strokeWidth="1.2"
          />
          {/* Longitudinal cut line & bright reflection */}
          <polygon points="30,35 70,35 75,50 25,50" fill="#fbbf24" opacity="0.6" />
          <ellipse cx="38" cy="30" rx="8" ry="3" fill="#ffffff" opacity="0.75" />
        </g>
      );

    case 'topaz':
      // Yellow 45-degree diamond / rhombus
      return (
        <g id="topaz">
          {/* Base diamond */}
          <polygon
            points="50,6 94,50 50,94 6,50"
            fill="#ca8a04"
            stroke="#713f12"
            strokeWidth="2"
          />
          {/* Top-left triangular facet: luminous yellow */}
          <polygon points="50,6 6,50 50,50" fill="#fef08a" />
          {/* Top-right facet */}
          <polygon points="50,6 94,50 50,50" fill="#facc15" />
          {/* Bottom-left facet */}
          <polygon points="6,50 50,94 50,50" fill="#eab308" />
          {/* Bottom-right facet: dark golden shadow */}
          <polygon points="94,50 50,94 50,50" fill="#a16207" />

          {/* Inner pyramid facet lines */}
          <polygon points="50,22 78,50 50,78 22,50" fill="#fde047" stroke="#ffffff" strokeWidth="1" />
          <polygon points="50,22 50,50 22,50" fill="#ffffff" opacity="0.7" />
          <polygon points="50,22 78,50 50,50" fill="#facc15" opacity="0.6" />

          {/* Sparkle glint on top apex */}
          <circle cx="50" cy="18" r="3" fill="#ffffff" />
        </g>
      );

    case 'emerald':
      // Green regular octagon
      return (
        <g id="emerald">
          {/* Regular Octagon Base */}
          <polygon
            points="32,8 68,8 92,32 92,68 68,92 32,92 8,68 8,32"
            fill="#15803d"
            stroke="#052e16"
            strokeWidth="2"
          />
          {/* Outer octagon facets */}
          <polygon points="32,8 68,8 63,25 37,25" fill="#4ade80" />
          <polygon points="68,8 92,32 75,37 63,25" fill="#22c55e" />
          <polygon points="92,32 92,68 75,63 75,37" fill="#16a34a" />
          <polygon points="92,68 68,92 63,75 75,63" fill="#15803d" />
          <polygon points="68,92 32,92 37,75 63,75" fill="#14532d" />
          <polygon points="32,92 8,68 25,63 37,75" fill="#15803d" />
          <polygon points="8,68 8,32 25,37 25,63" fill="#16a34a" />
          <polygon points="8,32 32,8 37,25 25,37" fill="#86efac" />

          {/* Central large table octagon */}
          <polygon
            points="37,25 63,25 75,37 75,63 63,75 37,75 25,63 25,37"
            fill="#22c55e"
            stroke="#bbf7d0"
            strokeWidth="1.5"
          />
          {/* Highlight across the center */}
          <polygon points="37,25 63,25 50,50 25,37" fill="#4ade80" opacity="0.65" />
          <ellipse cx="44" cy="27" rx="8" ry="2.5" fill="#ffffff" opacity="0.8" />
        </g>
      );

    case 'sapphire':
      // Blue pointed teardrop / diamond drop
      return (
        <g id="sapphire">
          {/* Pointed top with diamond cut lower base */}
          <polygon
            points="50,6 88,38 74,88 26,88 12,38"
            fill="#1d4ed8"
            stroke="#0f172a"
            strokeWidth="2"
          />
          {/* Top-left facet: bright cyan-blue */}
          <polygon points="50,6 12,38 35,46 50,30" fill="#38bdf8" />
          {/* Top-right facet */}
          <polygon points="50,6 88,38 65,46 50,30" fill="#2563eb" />
          {/* Mid-left facet */}
          <polygon points="12,38 26,88 40,68 35,46" fill="#1d4ed8" />
          {/* Mid-right facet */}
          <polygon points="88,38 74,88 60,68 65,46" fill="#1e40af" />
          {/* Bottom facet */}
          <polygon points="26,88 74,88 60,68 40,68" fill="#1e3a8a" />

          {/* Center pointed jewel facet */}
          <polygon
            points="50,30 65,46 60,68 40,68 35,46"
            fill="#0284c7"
            stroke="#bae6fd"
            strokeWidth="1.5"
          />
          <polygon points="50,30 65,46 50,55 35,46" fill="#7dd3fc" opacity="0.8" />

          {/* Brilliant specular glare near top */}
          <circle cx="50" cy="18" r="3" fill="#ffffff" />
          <path d="M50 10 L52 18 L50 26 L48 18 Z" fill="#ffffff" opacity="0.8" />
        </g>
      );

    case 'amethyst':
      // Purple upward equilateral triangle
      return (
        <g id="amethyst">
          {/* Base triangle */}
          <polygon
            points="50,10 94,86 6,86"
            fill="#7e22ce"
            stroke="#3b0764"
            strokeWidth="2"
          />
          {/* Left slope facet: bright magenta / violet */}
          <polygon points="50,10 6,86 35,62 50,42" fill="#d946ef" />
          {/* Right slope facet: deep purple */}
          <polygon points="50,10 94,86 65,62 50,42" fill="#a855f7" />
          {/* Bottom facet */}
          <polygon points="6,86 94,86 65,62 35,62" fill="#581c87" />

          {/* Inner faceted triangle */}
          <polygon
            points="50,42 65,62 35,62"
            fill="#c084fc"
            stroke="#f5d0fe"
            strokeWidth="1.2"
          />
          <polygon points="50,10 50,42 35,62" fill="#f0abfc" opacity="0.75" />

          {/* Sparkle top vertex */}
          <circle cx="50" cy="20" r="3.2" fill="#ffffff" />
          <polygon points="50,14 51.5,20 56,20 52,22 54,27 50,23 46,27 48,22 44,20 48.5,20" fill="#ffffff" opacity="0.9" />
        </g>
      );

    default:
      return null;
  }
}
