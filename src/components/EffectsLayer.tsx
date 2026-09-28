import React from 'react';
import { Particle, ScorePopup } from '../types/game';

interface EffectsLayerProps {
  popups: ScorePopup[];
  particles: Particle[];
}

export const EffectsLayer: React.FC<EffectsLayerProps> = ({ popups, particles }) => {
  return (
    <div className="absolute inset-0 pointer-events-none overflow-hidden z-20">
      {/* Floating score text */}
      {popups.map((popup) => (
        <div
          key={popup.id}
          className="absolute font-black tracking-wider text-yellow-300 drop-shadow-[0_2px_4px_rgba(0,0,0,0.9)] animate-[fadeUp_0.8s_ease-out_forwards] flex flex-col items-center select-none"
          style={{
            left: `${popup.x}px`,
            top: `${popup.y}px`,
            transform: 'translate(-50%, -50%)',
            color: popup.color || '#fde047',
          }}
        >
          <span className="text-xl sm:text-2xl font-bold font-mono">+{popup.score}</span>
          {popup.label && (
            <span className="text-xs uppercase bg-black/60 px-1.5 py-0.5 rounded text-amber-200 border border-amber-400/50 -mt-1 font-sans">
              {popup.label}
            </span>
          )}
        </div>
      ))}

      {/* Sparkle and shatter particles */}
      {particles.map((p) => {
        const opacity = Math.max(0, p.life / p.maxLife);
        return (
          <div
            key={p.id}
            className="absolute rounded-full pointer-events-none"
            style={{
              left: `${p.x}px`,
              top: `${p.y}px`,
              width: `${p.size}px`,
              height: `${p.size}px`,
              backgroundColor: p.color,
              opacity,
              boxShadow: `0 0 6px ${p.color}`,
              transform: 'translate(-50%, -50%)',
            }}
          />
        );
      })}
    </div>
  );
};
