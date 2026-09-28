import React from 'react';
import { BackgroundTheme, GameMode } from '../types/game';
import { GemIcon } from './GemIcon';

interface HomeScreenProps {
  highScore: number;
  levelGoal: number;
  onStartGame: (mode: GameMode) => void;
  onOpenScores: () => void;
  onOpenHelp: () => void;
  backgroundTheme: BackgroundTheme;
  onSelectTheme: (theme: BackgroundTheme) => void;
}

export const HomeScreen: React.FC<HomeScreenProps> = ({
  highScore,
  levelGoal,
  onStartGame,
  onOpenScores,
  onOpenHelp,
  backgroundTheme,
  onSelectTheme,
}) => {
  return (
    <div className="relative w-full aspect-square bg-gradient-to-b from-[#0b132b] via-[#091535] to-[#04091a] flex flex-col justify-between p-3.5 select-none overflow-hidden text-white">
      {/* Background Decorative Sparkles */}
      <div className="absolute inset-0 opacity-20 pointer-events-none">
        <div className="absolute top-3 left-6 w-1.5 h-1.5 bg-yellow-300 rounded-full animate-ping" />
        <div className="absolute top-16 right-8 w-2 h-2 bg-sky-300 rounded-full animate-pulse" />
        <div className="absolute bottom-8 left-12 w-1.5 h-1.5 bg-rose-400 rounded-full animate-ping" />
      </div>

      {/* Top Floating Gem Row */}
      <div className="flex items-center justify-center space-x-3 pt-1">
        <div className="animate-bounce [animation-delay:0ms]"><GemIcon type="ruby" size={26} /></div>
        <div className="animate-bounce [animation-delay:150ms]"><GemIcon type="sapphire" size={28} /></div>
        <div className="animate-bounce [animation-delay:300ms]"><GemIcon type="diamond" size={32} special="hypercube" /></div>
        <div className="animate-bounce [animation-delay:450ms]"><GemIcon type="emerald" size={28} /></div>
        <div className="animate-bounce [animation-delay:600ms]"><GemIcon type="topaz" size={26} /></div>
      </div>

      {/* Title & Brand Header */}
      <div className="text-center my-auto">
        <h1
          className="text-3xl font-black tracking-wider text-transparent bg-clip-text bg-gradient-to-b from-[#fff3b0] via-[#ffd700] to-[#b38000] drop-shadow-[0_2px_4px_rgba(0,0,0,0.9)]"
          style={{
            fontFamily: '"Impact", "Arial Black", sans-serif',
            letterSpacing: '0.08em',
          }}
        >
          BEJEWELED
        </h1>
        <div className="text-[10px] font-bold tracking-widest text-sky-300 uppercase mt-0.5 drop-shadow-[0_1px_2px_rgba(0,0,0,0.8)]">
          POCKET PC EDITION
        </div>

        {/* Goal & Record Capsule */}
        <div className="inline-flex items-center space-x-2 mt-2 px-2.5 py-1 bg-blue-950/80 border border-blue-400/40 rounded-full shadow-inner text-[10px]">
          <span className="text-amber-300 font-bold">🏆 최고점: {highScore.toLocaleString()}</span>
          <span className="text-blue-300">|</span>
          <span className="text-emerald-300 font-bold">🎯 목표: {levelGoal.toLocaleString()}</span>
        </div>
      </div>

      {/* Main Menu Action Buttons */}
      <div className="space-y-1.5 w-full max-w-[270px] mx-auto z-10">
        {/* 1. Classic Mode (Recommended) */}
        <button
          onClick={() => onStartGame('classic')}
          className="w-full py-2 px-3 bg-gradient-to-b from-[#22c55e] via-[#16a34a] to-[#14532d] hover:brightness-110 active:scale-98 transition-all border border-[#86efac] rounded-xs shadow-[inset_0_1px_1px_rgba(255,255,255,0.6),0_2px_4px_rgba(0,0,0,0.5)] flex items-center justify-between cursor-pointer"
        >
          <div className="flex items-center space-x-2 text-left">
            <span className="text-base">💎</span>
            <div>
              <div className="text-xs font-black text-white leading-tight">클래식 모드 시작</div>
              <div className="text-[9px] text-green-100 font-normal">20,000점 달성 시 레벨 2 승급!</div>
            </div>
          </div>
          <span className="text-[10px] bg-white/20 px-1.5 py-0.5 rounded font-bold font-mono">PLAY</span>
        </button>

        {/* 2. Time Attack & Endless in 2 columns */}
        <div className="grid grid-cols-2 gap-1.5">
          <button
            onClick={() => onStartGame('timeAttack')}
            className="py-1.5 px-2 bg-gradient-to-b from-[#3b82f6] to-[#1e40af] hover:brightness-110 active:scale-98 transition-all border border-[#93c5fd] rounded-xs shadow-[inset_0_1px_1px_rgba(255,255,255,0.4)] flex items-center justify-center space-x-1 cursor-pointer"
          >
            <span className="text-xs">⏱️</span>
            <span className="text-xs font-bold text-white">타임어택</span>
          </button>

          <button
            onClick={() => onStartGame('endless')}
            className="py-1.5 px-2 bg-gradient-to-b from-[#8b5cf6] to-[#5b21b6] hover:brightness-110 active:scale-98 transition-all border border-[#c4b5fd] rounded-xs shadow-[inset_0_1px_1px_rgba(255,255,255,0.4)] flex items-center justify-center space-x-1 cursor-pointer"
          >
            <span className="text-xs">♾️</span>
            <span className="text-xs font-bold text-white">무제한 모드</span>
          </button>
        </div>

        {/* 3. Sub menus */}
        <div className="grid grid-cols-2 gap-1.5 pt-0.5">
          <button
            onClick={onOpenScores}
            className="py-1 px-2 bg-[#1e293b]/90 hover:bg-[#334155] border border-slate-600 rounded-xs text-[10px] font-bold text-slate-200 flex items-center justify-center space-x-1 cursor-pointer active:scale-98"
          >
            <span>🏆</span>
            <span>명예의 전당</span>
          </button>

          <button
            onClick={onOpenHelp}
            className="py-1 px-2 bg-[#1e293b]/90 hover:bg-[#334155] border border-slate-600 rounded-xs text-[10px] font-bold text-slate-200 flex items-center justify-center space-x-1 cursor-pointer active:scale-98"
          >
            <span>📖</span>
            <span>규칙 & 얼음보석</span>
          </button>
        </div>
      </div>

      {/* Footer Info */}
      <div className="flex items-center justify-between text-[9px] text-sky-400/80 border-t border-blue-900/60 pt-1.5 mt-1">
        <span>Windows Mobile 2003</span>
        <button
          onClick={() => {
            const themes: BackgroundTheme[] = ['cosmic', 'cavern', 'desk', 'minimal'];
            const nextIdx = (themes.indexOf(backgroundTheme) + 1) % themes.length;
            onSelectTheme(themes[nextIdx]);
          }}
          className="hover:text-white underline cursor-pointer"
        >
          🎨 테마 변경
        </button>
      </div>
    </div>
  );
};
