import React, { useState } from 'react';
import { BackgroundTheme, GameMode, HighScoreRecord } from '../types/game';

interface GameToolsModalProps {
  isOpen: boolean;
  onClose: () => void;
  currentMode: GameMode;
  onSelectMode: (mode: GameMode) => void;
  onNewGame: () => void;
  isMuted: boolean;
  onToggleMute: () => void;
  isHapticEnabled: boolean;
  onToggleHaptic: () => void;
  displayMode: 'compact' | 'pda';
  onToggleDisplayMode: () => void;
  backgroundTheme: BackgroundTheme;
  onSelectTheme: (theme: BackgroundTheme) => void;
  highScores: HighScoreRecord[];
  onGoHome?: () => void;
}

export const GameToolsModal: React.FC<GameToolsModalProps> = ({
  isOpen,
  onClose,
  currentMode,
  onSelectMode,
  onNewGame,
  isMuted,
  onToggleMute,
  isHapticEnabled,
  onToggleHaptic,
  displayMode,
  onToggleDisplayMode,
  backgroundTheme,
  onSelectTheme,
  highScores,
  onGoHome,
}) => {
  const [activeTab, setActiveTab] = useState<'menu' | 'mode' | 'scores' | 'help'>('menu');

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 bg-black/70 backdrop-blur-[2px] flex items-center justify-center p-3 select-none">
      <div className="w-full max-w-[340px] bg-[#ece9d8] border-2 border-[#0055ea] rounded-t-sm shadow-[0_10px_25px_rgba(0,0,0,0.8)] overflow-hidden font-sans text-xs">
        {/* Windows Mobile Dialog Header */}
        <div className="h-6 bg-gradient-to-r from-[#0a4595] via-[#0f54b6] to-[#0a4595] text-white flex items-center justify-between px-2 font-bold shadow-xs">
          <div className="flex items-center space-x-1.5">
            <span className="text-yellow-300 text-[11px]">💎</span>
            <span className="text-[11px] tracking-wide">Game Tools - Bejeweled</span>
          </div>
          <button
            onClick={onClose}
            className="w-4 h-4 rounded-xs bg-[#c42b1c] hover:bg-red-700 text-white flex items-center justify-center font-bold text-[10px] leading-none"
          >
            ✕
          </button>
        </div>

        {/* Tab Nav Buttons */}
        <div className="flex bg-[#d4d0c8] border-b border-[#808080] px-1 pt-1 space-x-1">
          <button
            onClick={() => setActiveTab('menu')}
            className={`px-2.5 py-1 text-[11px] font-medium rounded-t-xs border-t border-l border-r ${
              activeTab === 'menu'
                ? 'bg-[#ece9d8] border-[#808080] font-bold text-[#00227b] -mb-[1px]'
                : 'bg-[#d8d4cc] border-transparent text-neutral-600 hover:text-black'
            }`}
          >
            메뉴
          </button>
          <button
            onClick={() => setActiveTab('mode')}
            className={`px-2.5 py-1 text-[11px] font-medium rounded-t-xs border-t border-l border-r ${
              activeTab === 'mode'
                ? 'bg-[#ece9d8] border-[#808080] font-bold text-[#00227b] -mb-[1px]'
                : 'bg-[#d8d4cc] border-transparent text-neutral-600 hover:text-black'
            }`}
          >
            게임 모드
          </button>
          <button
            onClick={() => setActiveTab('scores')}
            className={`px-2.5 py-1 text-[11px] font-medium rounded-t-xs border-t border-l border-r ${
              activeTab === 'scores'
                ? 'bg-[#ece9d8] border-[#808080] font-bold text-[#00227b] -mb-[1px]'
                : 'bg-[#d8d4cc] border-transparent text-neutral-600 hover:text-black'
            }`}
          >
            기록
          </button>
          <button
            onClick={() => setActiveTab('help')}
            className={`px-2.5 py-1 text-[11px] font-medium rounded-t-xs border-t border-l border-r ${
              activeTab === 'help'
                ? 'bg-[#ece9d8] border-[#808080] font-bold text-[#00227b] -mb-[1px]'
                : 'bg-[#d8d4cc] border-transparent text-neutral-600 hover:text-black'
            }`}
          >
            규칙/보석
          </button>
        </div>

        {/* Content Body */}
        <div className="p-3 text-neutral-800 min-h-[220px]">
          {/* TAB 1: Main Menu & Settings */}
          {activeTab === 'menu' && (
            <div className="space-y-2.5">
              <button
                onClick={() => {
                  onNewGame();
                  onClose();
                }}
                className="w-full py-2 bg-gradient-to-b from-[#ffffff] to-[#d8d4cc] hover:from-[#f0f0f0] hover:to-[#ccc] border border-[#7a7a7a] active:border-black rounded-xs shadow-[inset_0_1px_0_#fff,0_1px_2px_rgba(0,0,0,0.2)] font-bold text-left px-3 flex items-center justify-between cursor-pointer"
              >
                <span>🔄 새 게임 시작 (New Game)</span>
                <span className="text-[10px] text-neutral-500 font-mono">Restart</span>
              </button>

              {onGoHome && (
                <button
                  onClick={() => {
                    onGoHome();
                    onClose();
                  }}
                  className="w-full py-2 bg-gradient-to-b from-[#ffffff] to-[#d8d4cc] hover:from-[#f0f0f0] hover:to-[#ccc] border border-[#7a7a7a] active:border-black rounded-xs shadow-[inset_0_1px_0_#fff,0_1px_2px_rgba(0,0,0,0.2)] font-bold text-left px-3 flex items-center justify-between cursor-pointer"
                >
                  <span>🏠 홈 화면으로 이동 (Home Screen)</span>
                  <span className="text-[10px] text-blue-700 font-mono font-bold">Title</span>
                </button>
              )}

              <button
                onClick={() => setActiveTab('mode')}
                className="w-full py-2 bg-gradient-to-b from-[#ffffff] to-[#d8d4cc] hover:from-[#f0f0f0] hover:to-[#ccc] border border-[#7a7a7a] active:border-black rounded-xs shadow-[inset_0_1px_0_#fff,0_1px_2px_rgba(0,0,0,0.2)] font-bold text-left px-3 flex items-center justify-between"
              >
                <span>🎮 게임 모드 변경</span>
                <span className="text-[10px] text-blue-700 uppercase font-mono font-bold">
                  {currentMode === 'classic'
                    ? '클래식'
                    : currentMode === 'timeAttack'
                    ? '타임어택'
                    : '무제한'}
                </span>
              </button>

              {/* Toggles */}
              <div className="border border-[#bbb] p-2 bg-[#f4f2ec] rounded-xs space-y-2 mt-2">
                <div className="flex items-center justify-between">
                  <span className="font-medium">사운드 효과음</span>
                  <button
                    onClick={onToggleMute}
                    className={`px-3 py-0.5 rounded-xs font-bold border ${
                      !isMuted
                        ? 'bg-[#0055ea] text-white border-[#00227b]'
                        : 'bg-white text-neutral-600 border-[#999]'
                    }`}
                  >
                    {!isMuted ? 'ON' : 'OFF'}
                  </button>
                </div>

                <div className="flex items-center justify-between">
                  <span className="font-medium">모바일 햅틱 진동</span>
                  <button
                    onClick={onToggleHaptic}
                    className={`px-3 py-0.5 rounded-xs font-bold border ${
                      isHapticEnabled
                        ? 'bg-[#0055ea] text-white border-[#00227b]'
                        : 'bg-white text-neutral-600 border-[#999]'
                    }`}
                  >
                    {isHapticEnabled ? 'ON' : 'OFF'}
                  </button>
                </div>

                <div className="flex items-center justify-between">
                  <span className="font-medium">기기 외형 모드</span>
                  <button
                    onClick={onToggleDisplayMode}
                    className="px-2 py-0.5 rounded-xs font-bold border bg-white text-blue-900 border-[#999] hover:bg-neutral-100"
                  >
                    {displayMode === 'pda' ? 'PDA 핸드헬드' : '전체화면'}
                  </button>
                </div>

                {/* Wallpaper Theme Selector */}
                <div className="pt-2 border-t border-[#ccc]">
                  <span className="font-bold text-[11px] text-neutral-800 block mb-1.5">🎨 배경 테마 (Wallpaper)</span>
                  <div className="grid grid-cols-2 gap-1.5 text-[11px]">
                    <button
                      onClick={() => onSelectTheme('cosmic')}
                      className={`p-1.5 rounded-xs border text-left flex items-center space-x-1.5 cursor-pointer ${
                        backgroundTheme === 'cosmic'
                          ? 'bg-[#0055ea] text-white border-[#00227b] font-bold shadow-xs'
                          : 'bg-white text-neutral-800 border-[#999] hover:bg-neutral-100'
                      }`}
                    >
                      <span className="text-sm">🌌</span>
                      <span className="truncate">우주 성운 (추천)</span>
                    </button>
                    <button
                      onClick={() => onSelectTheme('cavern')}
                      className={`p-1.5 rounded-xs border text-left flex items-center space-x-1.5 cursor-pointer ${
                        backgroundTheme === 'cavern'
                          ? 'bg-[#0055ea] text-white border-[#00227b] font-bold shadow-xs'
                          : 'bg-white text-neutral-800 border-[#999] hover:bg-neutral-100'
                      }`}
                    >
                      <span className="text-sm">💎</span>
                      <span className="truncate">보석 동굴</span>
                    </button>
                    <button
                      onClick={() => onSelectTheme('desk')}
                      className={`p-1.5 rounded-xs border text-left flex items-center space-x-1.5 cursor-pointer ${
                        backgroundTheme === 'desk'
                          ? 'bg-[#0055ea] text-white border-[#00227b] font-bold shadow-xs'
                          : 'bg-white text-neutral-800 border-[#999] hover:bg-neutral-100'
                      }`}
                    >
                      <span className="text-sm">🪑</span>
                      <span className="truncate">클래식 데스크</span>
                    </button>
                    <button
                      onClick={() => onSelectTheme('minimal')}
                      className={`p-1.5 rounded-xs border text-left flex items-center space-x-1.5 cursor-pointer ${
                        backgroundTheme === 'minimal'
                          ? 'bg-[#0055ea] text-white border-[#00227b] font-bold shadow-xs'
                          : 'bg-white text-neutral-800 border-[#999] hover:bg-neutral-100'
                      }`}
                    >
                      <span className="text-sm">🌑</span>
                      <span className="truncate">다크 미니멀</span>
                    </button>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* TAB 2: Game Modes */}
          {activeTab === 'mode' && (
            <div className="space-y-2">
              <div
                onClick={() => {
                  onSelectMode('classic');
                  onClose();
                }}
                className={`p-2 rounded-xs border cursor-pointer transition-colors ${
                  currentMode === 'classic'
                    ? 'bg-[#e2eafc] border-[#0055ea] ring-1 ring-[#0055ea]'
                    : 'bg-white border-[#aaa] hover:bg-neutral-50'
                }`}
              >
                <div className="font-bold text-neutral-900 flex items-center justify-between">
                  <span>🏆 클래식 모드 (Classic)</span>
                  {currentMode === 'classic' && (
                    <span className="text-[10px] text-[#0055ea] font-bold">선택됨</span>
                  )}
                </div>
                <p className="text-[11px] text-neutral-600 mt-1">
                  매치를 통해 하단 게이지를 100% 채워 다음 레벨로 승급하는 원작 정통 모드입니다.
                </p>
              </div>

              <div
                onClick={() => {
                  onSelectMode('timeAttack');
                  onClose();
                }}
                className={`p-2 rounded-xs border cursor-pointer transition-colors ${
                  currentMode === 'timeAttack'
                    ? 'bg-[#e2eafc] border-[#0055ea] ring-1 ring-[#0055ea]'
                    : 'bg-white border-[#aaa] hover:bg-neutral-50'
                }`}
              >
                <div className="font-bold text-neutral-900 flex items-center justify-between">
                  <span>⏱️ 타임어택 모드 (Time Attack)</span>
                  {currentMode === 'timeAttack' && (
                    <span className="text-[10px] text-[#0055ea] font-bold">선택됨</span>
                  )}
                </div>
                <p className="text-[11px] text-neutral-600 mt-1">
                  시간이 지날수록 게이지가 줄어듭니다. 신속한 연속 매치로 시간을 확보해야 합니다!
                </p>
              </div>

              <div
                onClick={() => {
                  onSelectMode('endless');
                  onClose();
                }}
                className={`p-2 rounded-xs border cursor-pointer transition-colors ${
                  currentMode === 'endless'
                    ? 'bg-[#e2eafc] border-[#0055ea] ring-1 ring-[#0055ea]'
                    : 'bg-white border-[#aaa] hover:bg-neutral-50'
                }`}
              >
                <div className="font-bold text-neutral-900 flex items-center justify-between">
                  <span>🧘 무제한 연습 모드 (Endless)</span>
                  {currentMode === 'endless' && (
                    <span className="text-[10px] text-[#0055ea] font-bold">선택됨</span>
                  )}
                </div>
                <p className="text-[11px] text-neutral-600 mt-1">
                  게임오버나 시간 제한 없이 편안하게 보석을 맞추며 최고 점수를 목표로 합니다.
                </p>
              </div>
            </div>
          )}

          {/* TAB 3: High Scores */}
          {activeTab === 'scores' && (
            <div>
              <div className="font-bold text-[#00227b] mb-1.5 flex justify-between items-center">
                <span>🏆 최고 기록 명예의 전당</span>
                <span className="text-[10px] text-neutral-500">최근 TOP 5</span>
              </div>
              <div className="bg-white border border-[#999] rounded-xs p-1 min-h-[140px] max-h-[160px] overflow-y-auto">
                {highScores.length === 0 ? (
                  <div className="text-center text-neutral-400 py-8">
                    아직 등록된 기록이 없습니다.
                  </div>
                ) : (
                  <table className="w-full text-left text-[11px]">
                    <thead>
                      <tr className="border-b border-neutral-200 text-neutral-500 font-bold">
                        <th className="py-1 px-1">순위</th>
                        <th className="py-1 px-1">모드</th>
                        <th className="py-1 px-1">점수</th>
                        <th className="py-1 px-1">레벨</th>
                      </tr>
                    </thead>
                    <tbody>
                      {highScores.map((h, i) => (
                        <tr
                          key={i}
                          className={`border-b border-neutral-100 ${
                            i === 0 ? 'bg-amber-50 font-bold' : ''
                          }`}
                        >
                          <td className="py-1 px-1">
                            {i === 0 ? '🥇' : i === 1 ? '🥈' : i === 2 ? '🥉' : `${i + 1}`}
                          </td>
                          <td className="py-1 px-1 capitalize">{h.mode}</td>
                          <td className="py-1 px-1 font-mono text-blue-900">
                            {h.score.toLocaleString()}
                          </td>
                          <td className="py-1 px-1">{h.level}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                )}
              </div>
            </div>
          )}

          {/* TAB 4: Rules & Special Gems */}
          {activeTab === 'help' && (
            <div className="space-y-2 text-[11px] leading-relaxed max-h-[180px] overflow-y-auto pr-1">
              <div className="bg-amber-50 p-2 border border-amber-300 rounded-xs">
                <span className="font-bold text-amber-900">🏆 레벨 승급 (목표 20,000점) & 난이도 상승</span>
                <p className="text-neutral-700 mt-0.5">
                  <strong>레벨 1 목표는 20,000점</strong>입니다. 20,000점에 도달하면 레벨 2로 승급하며 난이도가 상승합니다:
                </p>
                <ul className="list-disc pl-4 text-neutral-600 mt-1 space-y-0.5">
                  <li><strong>❄️ 얼음 보석 출현:</strong> 직접 이동할 수 없으며, 인접 보석 매칭 또는 폭발로 깨뜨릴 수 있습니다 (+200점 보너스).</li>
                  <li><strong>점수 1.5배 보너스:</strong> 높아진 난이도에 비례해 모든 매치 점수가 1.5배로 증가합니다.</li>
                </ul>
              </div>

              <div className="bg-white p-2 border border-[#bbb] rounded-xs">
                <span className="font-bold text-sky-700">🟨 사각/직사각형 폭발 (Square & Rectangle Blast)</span>
                <p className="text-neutral-600 mt-0.5">
                  2x2 정사각형이나 2x3, 3x2, 3x3 등 <strong>여러 개의 동일한 보석이 사각형으로 묶여지면 통째로 폭발</strong>하며 보너스 점수와 함께 폭발 보석(Flame Gem)이 생성됩니다!
                </p>
              </div>

              <div className="bg-white p-2 border border-[#bbb] rounded-xs">
                <span className="font-bold text-amber-700">🔥 4-매치 폭발 보석 (Flame Gem)</span>
                <p className="text-neutral-600 mt-0.5">
                  가로 또는 세로로 4개의 보석을 일치시키거나 사각 매치 시 생성됩니다. 매치 시 <strong>주변 3x3 범위의 모든 보석을 폭파</strong>하여 큰 추가 점수를 획득합니다!
                </p>
              </div>

              <div className="bg-white p-2 border border-[#bbb] rounded-xs">
                <span className="font-bold text-purple-700">⚡ 5-매치 하이퍼큐브 (Hypercube)</span>
                <p className="text-neutral-600 mt-0.5">
                  5개의 보석을 일치시키면 생성됩니다. 다른 보석과 스와프하면 <strong>보드에 있는 해당 색상 보석 전체가 즉시 파괴</strong>됩니다!
                </p>
              </div>

              <div className="bg-white p-2 border border-[#bbb] rounded-xs">
                <span className="font-bold text-blue-700">✨ 연쇄 콤보 (Cascades)</span>
                <p className="text-neutral-600 mt-0.5">
                  보석이 떨어진 후 연속으로 매치가 발생할 때마다 점수가 2배, 3배, 4배로 기하급수적으로 증가합니다!
                </p>
              </div>
            </div>
          )}
        </div>

        {/* Dialog Footer */}
        <div className="bg-[#d4d0c8] border-t border-[#808080] p-2 flex justify-end space-x-2">
          <button
            onClick={onClose}
            className="px-4 py-1 bg-gradient-to-b from-[#ffffff] to-[#d8d4cc] hover:from-[#f0f0f0] hover:to-[#ccc] border border-[#7a7a7a] active:border-black rounded-xs font-bold text-xs shadow-xs cursor-pointer"
          >
            확인 (OK)
          </button>
        </div>
      </div>
    </div>
  );
};
