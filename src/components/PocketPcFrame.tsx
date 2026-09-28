import React, { useState, useEffect } from 'react';

interface PocketPcFrameProps {
  score: number;
  highScore: number;
  level: number;
  levelGoal: number;
  difficultyLabel: string;
  progressPercent: number; // 0 to 100
  isMuted: boolean;
  isPaused: boolean;
  displayMode: 'compact' | 'pda';
  isHomeScreen?: boolean;
  onHintClick: () => void;
  onToggleMute: () => void;
  onTogglePause: () => void;
  onRestart: () => void;
  onOpenMenu: () => void;
  onGoHome?: () => void;
  children: React.ReactNode;
}

export const PocketPcFrame: React.FC<PocketPcFrameProps> = ({
  score,
  highScore,
  level,
  levelGoal,
  difficultyLabel,
  progressPercent,
  isMuted,
  isPaused,
  displayMode,
  isHomeScreen = false,
  onHintClick,
  onToggleMute,
  onTogglePause,
  onRestart,
  onOpenMenu,
  onGoHome,
  children,
}) => {
  const [timeStr, setTimeStr] = useState('22:31');

  useEffect(() => {
    const updateTime = () => {
      const d = new Date();
      const h = String(d.getHours()).padStart(2, '0');
      const m = String(d.getMinutes()).padStart(2, '0');
      setTimeStr(`${h}:${m}`);
    };
    updateTime();
    const interval = setInterval(updateTime, 10000);
    return () => clearInterval(interval);
  }, []);

  const screenContent = (
    <div className="flex flex-col w-full bg-[#001036] rounded-t-sm shadow-2xl border-2 border-[#1e3a8a] overflow-hidden select-none font-sans">
      {/* 1. Pocket PC Top Windows OS Status Bar */}
      <div className="h-7 bg-gradient-to-b from-[#0c5ece] via-[#094ca7] to-[#043477] text-white flex items-center justify-between px-2 text-[11px] font-sans font-semibold border-b border-[#2563eb]/40 shadow-sm shrink-0">
        {/* Windows Flag & Title */}
        <div className="flex items-center space-x-1.5 cursor-pointer" onClick={onOpenMenu}>
          {/* Authentic 4-color Windows Flag */}
          <div className="grid grid-cols-2 gap-[1px] w-3.5 h-3.5 transform -skew-x-6">
            <div className="bg-[#f25022] rounded-[1px]" />
            <div className="bg-[#7fba00] rounded-[1px]" />
            <div className="bg-[#00a4ef] rounded-[1px]" />
            <div className="bg-[#ffb900] rounded-[1px]" />
          </div>
          <span className="tracking-wide text-white drop-shadow-[0_1px_1px_rgba(0,0,0,0.8)] text-xs font-bold">
            Bejeweled
          </span>
        </div>

        {/* Status Indicators & Clock */}
        <div className="flex items-center space-x-2 text-white/90">
          {/* Sync arrows */}
          <span className="text-[10px] tracking-tighter opacity-80" title="ActiveSync">
            ⇄
          </span>
          {/* Speaker Icon */}
          <button
            onClick={onToggleMute}
            className="hover:text-yellow-300 focus:outline-hidden p-0.5"
            title={isMuted ? '음소거 해제' : '음소거'}
          >
            {isMuted ? (
              <span className="text-red-300 font-bold">🔇</span>
            ) : (
              <span>🔊</span>
            )}
          </button>
          {/* Digital Clock */}
          <span className="font-mono text-xs text-white drop-shadow-[0_1px_1px_rgba(0,0,0,0.8)]">
            {timeStr}
          </span>
          {/* Close (X) circle button -> Home or Menu */}
          <button
            onClick={() => {
              if (!isHomeScreen && onGoHome) {
                onGoHome();
              } else {
                onOpenMenu();
              }
            }}
            className="w-4 h-4 rounded-full bg-white flex items-center justify-center shadow-xs hover:bg-neutral-200 transition-colors cursor-pointer"
            title={!isHomeScreen ? '홈으로 이동' : '메뉴'}
          >
            <span className="text-[#094ca7] font-black text-[10px] leading-none">
              {!isHomeScreen ? '⌂' : '✕'}
            </span>
          </button>
        </div>
      </div>

      {/* 2. Top Score Bar */}
      <div className="h-9 bg-gradient-to-b from-[#0b2b6d] via-[#082054] to-[#04153b] flex items-center justify-between px-3 border-b border-[#1e3a8a] shadow-inner shrink-0">
        {isHomeScreen ? (
          <div className="flex items-center justify-between w-full">
            <span
              className="text-[#649fff] text-lg font-bold tracking-tight italic"
              style={{
                fontFamily: '"Brush Script MT", "Caveat", "Dancing Script", cursive',
                textShadow: '0 0 6px rgba(100, 159, 255, 0.7)',
              }}
            >
              Pocket Bejeweled
            </span>
            <span className="text-[10px] text-amber-300 font-mono font-bold bg-blue-950/80 px-2 py-0.5 rounded border border-amber-500/40">
              HI: {highScore.toLocaleString()}
            </span>
          </div>
        ) : (
          <>
            <div className="flex items-baseline space-x-2">
              {/* Cursive score script */}
              <span
                className="text-[#649fff] text-xl font-bold tracking-tight italic"
                style={{
                  fontFamily: '"Brush Script MT", "Caveat", "Dancing Script", cursive',
                  textShadow: '0 0 6px rgba(100, 159, 255, 0.7)',
                }}
              >
                score
              </span>
              {/* Bright yellow score digits */}
              <span className="text-yellow-300 text-lg font-black tracking-wider font-mono drop-shadow-[0_1px_2px_rgba(0,0,0,0.9)]">
                {score.toLocaleString()}
              </span>

              {/* High Score Badge */}
              <span className="hidden sm:inline-block text-[10px] text-amber-200/90 font-mono bg-amber-950/70 px-1.5 py-0.5 rounded border border-amber-500/40">
                HI: {highScore.toLocaleString()}
              </span>
            </div>

            {/* Level & Difficulty indicator & HINT button */}
            <div className="flex items-center space-x-1.5">
              <span className="text-[10px] font-bold text-sky-200 uppercase tracking-wider bg-blue-950/90 px-1.5 py-0.5 rounded border border-blue-500/50 flex items-center space-x-1">
                <span>LVL {level}</span>
                <span className={`text-[8px] font-black px-1 rounded ${
                  level >= 3 ? 'bg-purple-600 text-white' : level === 2 ? 'bg-rose-600 text-white' : 'bg-emerald-600 text-white'
                }`}>
                  {difficultyLabel}
                </span>
              </span>

              <button
                onClick={onHintClick}
                className="px-2.5 py-0.5 bg-gradient-to-b from-[#1c55ad] to-[#0d2f66] active:from-[#0d2f66] active:to-[#1c55ad] border border-[#3b82f6]/90 text-[#e0edff] hover:text-white font-mono font-bold text-[11px] tracking-wider rounded-xs shadow-[inset_0_1px_0_rgba(255,255,255,0.4),0_1px_2px_rgba(0,0,0,0.5)] cursor-pointer active:scale-95 transition-transform"
              >
                HINT
              </button>
            </div>
          </>
        )}
      </div>

      {/* 3. Center Board Area (Children) */}
      <div className="relative w-full aspect-square bg-[#0b0c0e]">
        {children}

        {/* Pause Overlay */}
        {isPaused && (
          <div className="absolute inset-0 bg-black/80 backdrop-blur-[2px] flex flex-col items-center justify-center z-30 p-4">
            <div className="bg-[#ece9d8] border-2 border-[#0055ea] p-4 rounded shadow-2xl text-center max-w-[240px] w-full">
              <div className="text-base font-black text-[#00227b] mb-1">GAME PAUSED</div>
              <p className="text-xs text-neutral-700 mb-3">일시 정지되었습니다.</p>
              <button
                onClick={onTogglePause}
                className="w-full py-1.5 bg-[#0055ea] hover:bg-[#0041b3] text-white font-bold text-xs rounded border border-[#00227b] shadow-md cursor-pointer"
              >
                계속하기 (Resume)
              </button>
            </div>
          </div>
        )}
      </div>

      {/* 4. Bottom Progress Tube Bar */}
      <div className="h-9 bg-gradient-to-b from-[#0b2b6d] via-[#071f54] to-[#04153b] flex items-center justify-between px-3 border-t border-[#1e3a8a] shrink-0">
        {/* Left Red Jewel / Reset */}
        <button
          className="w-5 h-5 rounded-full bg-gradient-to-br from-[#ff6b6b] via-[#d60000] to-[#700000] border border-[#ff9999] shadow-[0_0_6px_rgba(255,0,0,0.8),inset_0_1px_2px_rgba(255,255,255,0.8)] cursor-pointer active:scale-90 transition-transform focus:outline-hidden"
          onClick={onRestart}
          title="새로 시작"
        />

        {/* Center Progress Capsule Tube */}
        <div className="flex-1 mx-2.5 h-4 bg-[#15171d] rounded-full p-[2px] border border-[#525763] shadow-[inset_0_2px_4px_rgba(0,0,0,0.8),0_1px_1px_rgba(255,255,255,0.2)] relative overflow-hidden flex items-center">
          {/* Glass tube specular reflection line */}
          <div className="absolute top-[1px] left-2 right-2 h-[2px] bg-white/40 rounded-full z-10 pointer-events-none" />

          {/* Fluid fill gauge */}
          <div
            className="h-full rounded-full bg-gradient-to-r from-[#38bdf8] via-[#818cf8] to-[#c084fc] shadow-[0_0_10px_rgba(129,140,248,0.9)] transition-all duration-300"
            style={{ width: `${Math.min(100, Math.max(0, progressPercent))}%` }}
          />

          {/* Score / Goal target text */}
          <div className="absolute inset-0 flex items-center justify-center text-[9px] font-mono font-bold text-white/90 drop-shadow-[0_1px_2px_rgba(0,0,0,0.9)] z-20 pointer-events-none tracking-tight">
            {score.toLocaleString()} / {levelGoal.toLocaleString()} ({Math.floor(progressPercent)}%)
          </div>
        </div>

        {/* Right Green Jewel / Hint */}
        <button
          className="w-5 h-5 rounded-full bg-gradient-to-br from-[#4ade80] via-[#16a34a] to-[#052e16] border border-[#86efac] shadow-[0_0_6px_rgba(34,197,94,0.8),inset_0_1px_2px_rgba(255,255,255,0.8)] cursor-pointer active:scale-90 transition-transform focus:outline-hidden"
          onClick={onHintClick}
          title="힌트"
        />
      </div>

      {/* 5. Pocket PC Bottom Command Bar */}
      <div className="h-8 bg-[#ece9d8] border-t border-[#808080] flex items-center justify-between px-2 text-black text-xs font-sans shadow-inner select-none shrink-0">
        {/* Game Tools Button */}
        <button
          onClick={onOpenMenu}
          className="flex items-center space-x-1 px-2 py-0.5 hover:bg-[#d4d0c8] active:bg-[#b0aca4] border-r border-[#999] pr-3 text-neutral-800 font-medium cursor-pointer"
        >
          <span>Game Tools</span>
        </button>

        {/* Action icons */}
        <div className="flex items-center space-x-2">
          {/* Mute button */}
          <button
            onClick={onToggleMute}
            className={`w-6 h-5.5 flex items-center justify-center border border-[#808080] bg-[#fff] active:bg-[#ccc] rounded-[2px] shadow-xs cursor-pointer ${
              isMuted ? 'text-red-600 bg-red-50' : 'text-neutral-800'
            }`}
            title={isMuted ? '음소거 해제' : '음소거'}
          >
            {isMuted ? '♪x' : '♪'}
          </button>

          {/* Pause button */}
          <button
            onClick={onTogglePause}
            className="w-6 h-5.5 flex items-center justify-center border border-[#808080] bg-[#fff] active:bg-[#ccc] rounded-[2px] shadow-xs cursor-pointer font-bold text-[10px]"
            title={isPaused ? 'Resume' : 'Pause'}
          >
            {isPaused ? '▶' : '❚❚'}
          </button>

          {/* Restart button */}
          <button
            onClick={onRestart}
            className="w-6 h-5.5 flex items-center justify-center border border-[#808080] bg-[#fff] active:bg-[#ccc] rounded-[2px] shadow-xs cursor-pointer font-bold text-neutral-800 text-[10px]"
            title="새 게임"
          >
            ✖
          </button>

          {/* Keyboard / SIP icon on far right */}
          <button
            onClick={onOpenMenu}
            className="flex items-center pl-1 border-l border-[#999] hover:bg-[#d4d0c8] p-0.5 rounded-[2px] cursor-pointer"
            title="메뉴"
          >
            <span className="text-[12px] opacity-80">⌨</span>
            <span className="text-[7px] ml-0.5">▲</span>
          </button>
        </div>
      </div>
    </div>
  );

  if (displayMode === 'compact') {
    return (
      <div className="w-full max-w-[420px] mx-auto px-2 flex flex-col items-center">
        {screenContent}
      </div>
    );
  }

  // PDA Vintage Handheld Case Mode (Compaq iPAQ style metallic casing)
  return (
    <div className="w-full max-w-[420px] mx-auto px-2 py-2 flex flex-col items-center select-none">
      {/* Metallic PDA Bezel Shell */}
      <div className="w-full bg-gradient-to-b from-[#bcc4cf] via-[#e5e9f0] to-[#9faab8] p-3 sm:p-4 rounded-[28px] shadow-[0_15px_35px_rgba(0,0,0,0.8),inset_0_2px_4px_#fff,inset_0_-2px_4px_#475569] border border-[#cbd5e1] flex flex-col items-center">
        {/* Top Speaker Ear-piece & Power Button */}
        <div className="w-full flex items-center justify-between px-4 pb-2">
          {/* Brand/Model mark */}
          <span className="text-[10px] font-black tracking-widest text-[#475569] uppercase font-mono">
            POCKET PC
          </span>

          {/* Ear-piece speaker slots */}
          <div className="flex space-x-1">
            <div className="w-4 h-1 bg-[#475569] rounded-full shadow-inner" />
            <div className="w-6 h-1 bg-[#475569] rounded-full shadow-inner" />
            <div className="w-4 h-1 bg-[#475569] rounded-full shadow-inner" />
          </div>

          {/* Power LED */}
          <div className="w-2 h-2 rounded-full bg-emerald-500 shadow-[0_0_5px_#10b981]" />
        </div>

        {/* Screen Bezel Inset */}
        <div className="w-full p-1 bg-[#1e293b] rounded-md shadow-[inset_0_2px_8px_rgba(0,0,0,0.9)] border border-[#0f172a]">
          {screenContent}
        </div>

        {/* Bottom Hardware Controls: Directional Pad & Action Buttons */}
        <div className="w-full mt-3 flex items-center justify-between px-3">
          {/* Left Action Button (Menu) */}
          <button
            onClick={onOpenMenu}
            className="w-9 h-6 bg-gradient-to-b from-[#f8fafc] to-[#94a3b8] rounded border border-[#64748b] shadow-md flex items-center justify-center active:scale-95 cursor-pointer text-[9px] font-bold text-neutral-700"
            title="Menu"
          >
            MENU
          </button>

          {/* Center Vintage Metallic Directional Pad */}
          <div className="relative w-12 h-12 rounded-full bg-gradient-to-b from-[#f1f5f9] to-[#64748b] p-1 shadow-lg border border-[#475569] flex items-center justify-center">
            <div className="w-6 h-6 rounded-full bg-gradient-to-tr from-[#64748b] to-[#e2e8f0] shadow-inner flex items-center justify-center border border-[#94a3b8]">
              <div className="w-2 h-2 rounded-full bg-[#475569]" />
            </div>
          </div>

          {/* Right Action Button (Hint) */}
          <button
            onClick={onHintClick}
            className="w-9 h-6 bg-gradient-to-b from-[#f8fafc] to-[#94a3b8] rounded border border-[#64748b] shadow-md flex items-center justify-center active:scale-95 cursor-pointer text-[9px] font-bold text-neutral-700"
            title="Hint"
          >
            HINT
          </button>
        </div>
      </div>
    </div>
  );
};
