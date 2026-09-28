/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect, useRef, useCallback } from 'react';
import { BackgroundTheme, Board, GameMode, HighScoreRecord, Particle, Position, ScorePopup } from './types/game';
import {
  createInitialBoard,
  findMatches,
  swapGems,
  isAdjacent,
  applyGravity,
  refillBoard,
  hasValidMoves,
  findHint,
  shuffleBoard,
  resolveHypercubeMatch,
  cloneBoard,
  BOARD_SIZE,
} from './utils/gemEngine';
import { soundManager } from './audio/soundManager';
import { hapticManager } from './utils/haptics';
import { PocketPcFrame } from './components/PocketPcFrame';
import { GameBoard } from './components/GameBoard';
import { EffectsLayer } from './components/EffectsLayer';
import { GameToolsModal } from './components/GameToolsModal';
import { HomeScreen } from './components/HomeScreen';
import { RatingModal, RatingData } from './components/RatingModal';
import cosmicBg from './assets/images/cosmic_space_nebula_1790583382664.jpg';
import cavernBg from './assets/images/crystal_gem_cavern_1790583398995.jpg';
import deskBg from './assets/images/vintage_pda_desk_1790583415779.jpg';

export const getLevelGoal = (lvl: number): number => {
  if (lvl === 1) return 20000;
  if (lvl === 2) return 50000;
  if (lvl === 3) return 90000;
  return 90000 + (lvl - 3) * 50000;
};

export const getLevelStartScore = (lvl: number): number => {
  if (lvl === 1) return 0;
  if (lvl === 2) return 20000;
  if (lvl === 3) return 50000;
  return 90000 + (lvl - 4) * 50000;
};

export const getDifficultyLabel = (lvl: number): string => {
  if (lvl === 1) return 'NORMAL';
  if (lvl === 2) return 'HARD';
  return 'EXPERT';
};

export default function App() {
  const [board, setBoard] = useState<Board>(() => createInitialBoard());
  const [selectedPos, setSelectedPos] = useState<Position | null>(null);
  const [hintPos, setHintPos] = useState<{ from: Position; to: Position } | null>(null);
  const [isProcessing, setIsProcessing] = useState<boolean>(false);

  // Game Stats
  const [score, setScore] = useState<number>(0);
  const [level, setLevel] = useState<number>(1);
  const [progressPercent, setProgressPercent] = useState<number>(10);
  const [gameMode, setGameMode] = useState<GameMode>('classic');
  const [isPaused, setIsPaused] = useState<boolean>(false);
  const [gameOver, setGameOver] = useState<boolean>(false);
  const [shuffleAlert, setShuffleAlert] = useState<boolean>(false);
  const [currentScreen, setCurrentScreen] = useState<'home' | 'game'>('home');
  const [ratingModal, setRatingModal] = useState<{
    show: boolean;
    trigger: 'level_up' | 'game_over';
  } | null>(null);
  const [levelUpNotice, setLevelUpNotice] = useState<{
    show: boolean;
    level: number;
    goal: number;
    difficulty: string;
  } | null>(null);

  // Settings & UI state
  const [isMuted, setIsMuted] = useState<boolean>(() => soundManager.getMuted());
  const [isHapticEnabled, setIsHapticEnabled] = useState<boolean>(() => hapticManager.isEnabled());
  const [displayMode, setDisplayMode] = useState<'compact' | 'pda'>('pda');
  const [backgroundTheme, setBackgroundTheme] = useState<BackgroundTheme>(() => {
    try {
      const saved = localStorage.getItem('bejeweled_theme');
      return (saved as BackgroundTheme) || 'cosmic';
    } catch {
      return 'cosmic';
    }
  });
  const [isMenuOpen, setIsMenuOpen] = useState<boolean>(false);

  // Visual effects state
  const [popups, setPopups] = useState<ScorePopup[]>([]);
  const [particles, setParticles] = useState<Particle[]>([]);

  // High Scores - initial record 20,000 as requested
  const [highScores, setHighScores] = useState<HighScoreRecord[]>(() => {
    try {
      const saved = localStorage.getItem('bejeweled_highscores');
      if (saved) return JSON.parse(saved);
      return [
        { mode: 'classic', score: 20000, level: 1, date: 'Champion Record' },
        { mode: 'timeAttack', score: 15000, level: 1, date: 'Speed Master' },
        { mode: 'endless', score: 12000, level: 1, date: 'Zen Master' },
      ];
    } catch {
      return [{ mode: 'classic', score: 20000, level: 1, date: 'Champion Record' }];
    }
  });

  const boardRef = useRef<Board>(board);
  boardRef.current = board;

  const hintTimerRef = useRef<number | null>(null);

  // Save high score helper
  const recordHighScore = useCallback((finalScore: number, finalLevel: number) => {
    if (finalScore <= 0) return;
    setHighScores((prev) => {
      const updated = [
        ...prev,
        {
          mode: gameMode,
          score: finalScore,
          level: finalLevel,
          date: new Date().toLocaleDateString(),
        },
      ]
        .sort((a, b) => b.score - a.score)
        .slice(0, 10);
      try {
        localStorage.setItem('bejeweled_highscores', JSON.stringify(updated));
      } catch {
        // storage fallback
      }
      return updated;
    });
  }, [gameMode]);

  // Particle physics tick
  useEffect(() => {
    if (particles.length === 0) return;
    const frame = requestAnimationFrame(() => {
      setParticles((prev) =>
        prev
          .map((p) => ({
            ...p,
            x: p.x + p.vx,
            y: p.y + p.vy,
            vy: p.vy + 0.3, // gravity
            life: p.life - 1,
          }))
          .filter((p) => p.life > 0)
      );
    });
    return () => cancelAnimationFrame(frame);
  }, [particles]);

  // Spawn visual particle explosion for cleared cells
  const spawnExplosion = (positions: Position[], isFlame: boolean = false) => {
    const newParticles: Particle[] = [];
    const colors = ['#ffffff', '#facc15', '#f43f5e', '#38bdf8', '#4ade80', '#c084fc'];

    positions.forEach((pos) => {
      // Cell approximate center coordinate in 360x360 board
      const cellPx = 360 / BOARD_SIZE;
      const cx = (pos.col + 0.5) * cellPx;
      const cy = (pos.row + 0.5) * cellPx;

      const count = isFlame ? 18 : 8;
      for (let i = 0; i < count; i++) {
        const angle = Math.random() * Math.PI * 2;
        const speed = Math.random() * (isFlame ? 6 : 3.5) + 1;
        newParticles.push({
          id: `p_${Date.now()}_${Math.random()}`,
          x: cx,
          y: cy,
          vx: Math.cos(angle) * speed,
          vy: Math.sin(angle) * speed,
          color: colors[Math.floor(Math.random() * colors.length)],
          size: Math.random() * 5 + 3,
          life: 25,
          maxLife: 25,
        });
      }
    });

    setParticles((prev) => [...prev.slice(-60), ...newParticles]);
  };

  // Add floating score text
  const addScorePopup = (x: number, y: number, points: number, label?: string, color?: string) => {
    const id = `popup_${Date.now()}_${Math.random()}`;
    setPopups((prev) => [...prev, { id, x, y, score: points, label, color }]);
    setTimeout(() => {
      setPopups((prev) => prev.filter((p) => p.id !== id));
    }, 850);
  };

  // Cascade resolution loop
  const resolveCascade = async (
    initialBoard: Board,
    swappedP1?: Position,
    swappedP2?: Position
  ) => {
    setIsProcessing(true);
    let currentBoard = initialBoard;
    let combo = 1;
    let totalTurnScore = 0;

    while (true) {
      const matchResult = findMatches(currentBoard, swappedP1, swappedP2);
      if (matchResult.matches.length === 0) {
        break;
      }

      const matchCount = matchResult.matches.length;
      const isFlameTriggered = matchResult.clearedSpecialGems?.some((g) => g.type === 'flame');
      const isSquareMatch = matchResult.isSquareMatch;

      // Check if any matched gem was frozen
      const frozenClearedCount = matchResult.matches.filter((pos) => {
        const g = currentBoard[pos.row]?.[pos.col];
        return g?.isFrozen;
      }).length;

      if (frozenClearedCount > 0) {
        soundManager.playIceCrack();
        hapticManager.squareBlast();
      } else if (isFlameTriggered) {
        soundManager.playFlameExplosion();
        hapticManager.explosion();
      } else if (isSquareMatch) {
        soundManager.playSquareBlast();
        hapticManager.explosion();
      } else {
        soundManager.playMatch(combo);
        hapticManager.match();
      }

      // Calculate score with level multiplier (1.0x Level 1, 1.5x Level 2, 2.0x Level 3+)
      let basePoints = matchCount * 30;
      if (matchResult.flameCreated) basePoints += 150;
      if (matchResult.hypercubeCreated) basePoints += 300;
      if (isFlameTriggered) basePoints += 250;
      if (isSquareMatch) basePoints += (matchResult.squareMatchCount || 1) * 120;
      if (frozenClearedCount > 0) basePoints += frozenClearedCount * 200;

      const levelMultiplier = level >= 3 ? 2.0 : level === 2 ? 1.5 : 1.0;
      const comboPoints = Math.round(basePoints * (1 + (combo - 1) * 0.5) * levelMultiplier);
      totalTurnScore += comboPoints;

      // Popup position
      const firstMatch = matchResult.matches[0];
      const cellPx = 360 / BOARD_SIZE;
      const pxX = (firstMatch.col + 0.5) * cellPx;
      const pxY = (firstMatch.row + 0.5) * cellPx;

      let popupLabel: string | undefined;
      if (frozenClearedCount > 0) {
        popupLabel = `❄️ ICE BROKEN (+${frozenClearedCount * 200})`;
      } else if (combo > 1) {
        popupLabel = `COMBO x${combo}`;
      } else if (isFlameTriggered) {
        popupLabel = '💥 FLAME BLAST!';
      } else if (isSquareMatch) {
        popupLabel = (matchResult.squareMatchCount || 1) > 1 ? '🟦 RECTANGLE MATCH!' : '🟨 SQUARE BLAST!';
      }

      addScorePopup(
        pxX,
        pxY,
        comboPoints,
        popupLabel,
        frozenClearedCount > 0 ? '#67e8f9' : combo > 2 ? '#f43f5e' : combo > 1 ? '#fbbf24' : isSquareMatch ? '#38bdf8' : '#fde047'
      );

      spawnExplosion(matchResult.matches, isFlameTriggered || !!isSquareMatch);

      // Animate match disappearing
      const markedBoard = currentBoard.map((row) =>
        row.map((gem) =>
          gem && matchResult.matches.some((p) => p.row === gem.row && p.col === gem.col)
            ? { ...gem, isMatched: true }
            : gem
        )
      );
      setBoard(markedBoard);
      await new Promise((r) => setTimeout(r, 180));

      // Remove matched gems and spawn created special gems
      const boardAfterRemoval = markedBoard.map((row) =>
        row.map((gem) => (gem?.isMatched ? null : gem))
      );

      // Place Flame Gem if created
      if (matchResult.flameCreated) {
        const { row, col } = matchResult.flameCreated;
        boardAfterRemoval[row][col] = {
          id: `flame_${Date.now()}`,
          type: currentBoard[row][col]?.type || 'ruby',
          special: 'flame',
          row,
          col,
        };
      }

      // Place Hypercube if created
      if (matchResult.hypercubeCreated) {
        const { row, col } = matchResult.hypercubeCreated;
        boardAfterRemoval[row][col] = {
          id: `hyper_${Date.now()}`,
          type: 'diamond',
          special: 'hypercube',
          row,
          col,
        };
      }

      // Gravity fall
      const { board: fallenBoard } = applyGravity(boardAfterRemoval);
      setBoard(fallenBoard);
      await new Promise((r) => setTimeout(r, 140));

      // Refill top with current level difficulty
      const { board: refilledBoard } = refillBoard(fallenBoard, level);
      setBoard(refilledBoard);
      currentBoard = refilledBoard;
      await new Promise((r) => setTimeout(r, 160));

      combo++;
      swappedP1 = undefined;
      swappedP2 = undefined;
    }

    // Update score and level progression (Goal: 20000 for level 1)
    if (totalTurnScore > 0) {
      setScore((s) => {
        const newScore = s + totalTurnScore;
        const currentGoal = getLevelGoal(level);

        if (newScore >= currentGoal) {
          const nextLvl = level + 1;
          setLevel(nextLvl);
          soundManager.playLevelUp();
          hapticManager.levelUp();
          setLevelUpNotice({
            show: true,
            level: nextLvl,
            goal: getLevelGoal(nextLvl),
            difficulty: getDifficultyLabel(nextLvl),
          });

          // Prompt star rating when advancing to next level
          setTimeout(() => {
            setRatingModal({
              show: true,
              trigger: 'level_up',
            });
          }, 1200);

          // In Level 2+, freeze 2 random gems on the board for difficulty rise
          setTimeout(() => {
            setBoard((b) => {
              const updated = cloneBoard(b);
              let frozen = 0;
              for (let r = 0; r < BOARD_SIZE && frozen < 2; r++) {
                for (let c = 0; c < BOARD_SIZE && frozen < 2; c++) {
                  if (updated[r][c] && !updated[r][c]?.isFrozen && Math.random() < 0.4) {
                    updated[r][c]!.isFrozen = true;
                    frozen++;
                  }
                }
              }
              return updated;
            });
          }, 350);
        }

        return newScore;
      });

      if (gameMode === 'timeAttack') {
        setProgressPercent((p) => Math.min(100, p + Math.min(35, Math.floor(totalTurnScore / 25))));
      } else if (gameMode === 'endless') {
        setProgressPercent((p) => (p + 5) % 100);
      }
    }

    // Check if legal moves remain
    if (!hasValidMoves(currentBoard)) {
      setShuffleAlert(true);
      await new Promise((r) => setTimeout(r, 800));
      const shuffled = shuffleBoard(currentBoard);
      setBoard(shuffled);
      setShuffleAlert(false);
    }

    setIsProcessing(false);
  };

  // Perform Swap with validation
  const handleSwap = async (p1: Position, p2: Position) => {
    if (isProcessing || isPaused || gameOver) return;
    if (!isAdjacent(p1, p2)) return;

    // Clear active hint
    setHintPos(null);
    setSelectedPos(null);
    setIsProcessing(true);

    const gem1 = board[p1.row][p1.col];
    const gem2 = board[p2.row][p2.col];
    if (!gem1 || !gem2) {
      setIsProcessing(false);
      return;
    }

    // Frozen Gem check - cannot be swapped directly!
    if (gem1.isFrozen || gem2.isFrozen) {
      soundManager.playInvalid();
      hapticManager.invalid();
      const frozenPos = gem1.isFrozen ? p1 : p2;
      const cellPx = 360 / BOARD_SIZE;
      addScorePopup(
        (frozenPos.col + 0.5) * cellPx,
        (frozenPos.row + 0.5) * cellPx,
        0,
        '❄️ 얼음에 갇힌 보석!',
        '#67e8f9'
      );
      setIsProcessing(false);
      return;
    }

    soundManager.playSwap();
    hapticManager.tap();

    // 1. Check for Hypercube swap
    if (gem1.special === 'hypercube' || gem2.special === 'hypercube') {
      const hypercubePos = gem1.special === 'hypercube' ? p1 : p2;
      const otherGem = gem1.special === 'hypercube' ? gem2 : gem1;

      soundManager.playHypercube();
      hapticManager.explosion();

      // Clear all gems of target type
      const targetMatches = resolveHypercubeMatch(board, hypercubePos, otherGem.type);
      const points = targetMatches.length * 80;
      setScore((s) => s + points);

      const cellPx = 360 / BOARD_SIZE;
      addScorePopup((p1.col + 0.5) * cellPx, (p1.row + 0.5) * cellPx, points, 'HYPER ZAP!', '#c084fc');
      spawnExplosion(targetMatches, true);

      // Animate match
      const markedBoard = board.map((row) =>
        row.map((gem) =>
          gem && targetMatches.some((p) => p.row === gem.row && p.col === gem.col)
            ? { ...gem, isMatched: true }
            : gem
        )
      );
      setBoard(markedBoard);
      await new Promise((r) => setTimeout(r, 200));

      const cleared = markedBoard.map((row) =>
        row.map((gem) => (gem?.isMatched ? null : gem))
      );
      const { board: fallen } = applyGravity(cleared);
      setBoard(fallen);
      await new Promise((r) => setTimeout(r, 140));

      const { board: refilled } = refillBoard(fallen, level);
      setBoard(refilled);
      await new Promise((r) => setTimeout(r, 160));

      await resolveCascade(refilled);
      setIsProcessing(false);
      return;
    }

    // 2. Standard Swap
    const swappedBoard = swapGems(board, p1, p2);
    setBoard(swappedBoard);

    await new Promise((r) => setTimeout(r, 150));

    const matches = findMatches(swappedBoard, p1, p2);
    if (matches.matches.length > 0) {
      // Valid move!
      await resolveCascade(swappedBoard, p1, p2);
    } else {
      // Invalid move -> Bounce back
      soundManager.playInvalid();
      hapticManager.invalid();
      await new Promise((r) => setTimeout(r, 180));
      setBoard(board); // revert
      setIsProcessing(false);
    }
  };

  // Handle cell click / selection
  const handleCellClick = (r: number, c: number) => {
    if (isProcessing || isPaused || gameOver) return;

    if (!selectedPos) {
      soundManager.playSelect();
      hapticManager.tap();
      setSelectedPos({ row: r, col: c });
    } else {
      if (selectedPos.row === r && selectedPos.col === c) {
        // Deselect
        setSelectedPos(null);
      } else if (isAdjacent(selectedPos, { row: r, col: c })) {
        // Swap adjacent
        handleSwap(selectedPos, { row: r, col: c });
      } else {
        // Select new cell
        soundManager.playSelect();
        hapticManager.tap();
        setSelectedPos({ row: r, col: c });
      }
    }
  };

  // Handle gesture swipe
  const handleSwipe = (from: Position, to: Position) => {
    handleSwap(from, to);
  };

  // Hint button click
  const handleHintClick = () => {
    if (isProcessing || isPaused || gameOver) return;
    soundManager.playHint();
    hapticManager.tap();

    const hint = findHint(board);
    if (hint) {
      setHintPos(hint);
      if (hintTimerRef.current) clearTimeout(hintTimerRef.current);
      hintTimerRef.current = window.setTimeout(() => {
        setHintPos(null);
      }, 3500);
    }
  };

  // Time Attack Loop
  useEffect(() => {
    if (gameMode !== 'timeAttack' || isPaused || gameOver) return;

    const interval = setInterval(() => {
      setProgressPercent((prev) => {
        const drain = 0.8 + level * 0.15;
        const next = prev - drain;
        if (next <= 0) {
          // Game Over!
          setGameOver(true);
          soundManager.playGameOver();
          recordHighScore(score, level);
          // Prompt Star Rating upon game defeat
          setTimeout(() => {
            setRatingModal({ show: true, trigger: 'game_over' });
          }, 700);
          return 0;
        }
        return next;
      });
    }, 200);

    return () => clearInterval(interval);
  }, [gameMode, isPaused, gameOver, level, score, recordHighScore]);

  // Start game from Home screen
  const handleStartGameFromHome = (mode: GameMode) => {
    setGameMode(mode);
    const newBoard = createInitialBoard();
    setBoard(newBoard);
    setSelectedPos(null);
    setHintPos(null);
    setScore(0);
    setLevel(1);
    setProgressPercent(mode === 'timeAttack' ? 100 : 10);
    setGameOver(false);
    setIsPaused(false);
    setIsProcessing(false);
    setCurrentScreen('game');
    soundManager.playLevelUp();
    hapticManager.levelUp();
  };

  // Return to Home screen
  const handleGoHome = () => {
    setCurrentScreen('home');
    setGameOver(false);
    setIsPaused(false);
    setIsProcessing(false);
    setRatingModal(null);
  };

  // Restart game
  const handleNewGame = () => {
    const newBoard = createInitialBoard();
    setBoard(newBoard);
    setSelectedPos(null);
    setHintPos(null);
    setScore(0);
    setLevel(1);
    setProgressPercent(gameMode === 'timeAttack' ? 100 : 15);
    setGameOver(false);
    setIsPaused(false);
    setIsProcessing(false);
    soundManager.playLevelUp();
  };

  const handleSelectMode = (mode: GameMode) => {
    setGameMode(mode);
    const newBoard = createInitialBoard();
    setBoard(newBoard);
    setSelectedPos(null);
    setHintPos(null);
    setScore(0);
    setLevel(1);
    setProgressPercent(mode === 'timeAttack' ? 100 : 15);
    setGameOver(false);
    setIsPaused(false);
    setIsProcessing(false);
  };

  const toggleMute = () => {
    const next = soundManager.toggleMute();
    setIsMuted(next);
  };

  const toggleHaptic = () => {
    const next = hapticManager.toggle();
    setIsHapticEnabled(next);
  };

  const levelGoal = getLevelGoal(level);
  const levelStart = getLevelStartScore(level);
  const classicProgress = Math.min(
    100,
    Math.max(0, ((score - levelStart) / (levelGoal - levelStart)) * 100)
  );
  const displayProgress = gameMode === 'classic' ? classicProgress : progressPercent;
  const currentHighScore = Math.max(20000, ...highScores.map((h) => h.score), score);
  const difficultyLabel = getDifficultyLabel(level);

  const getBackgroundStyle = (): React.CSSProperties => {
    if (backgroundTheme === 'cosmic') {
      return {
        backgroundImage: `linear-gradient(rgba(5, 7, 20, 0.45), rgba(5, 7, 20, 0.72)), url(${cosmicBg})`,
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        backgroundRepeat: 'no-repeat',
      };
    }
    if (backgroundTheme === 'cavern') {
      return {
        backgroundImage: `linear-gradient(rgba(8, 6, 22, 0.45), rgba(5, 4, 16, 0.7)), url(${cavernBg})`,
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        backgroundRepeat: 'no-repeat',
      };
    }
    if (backgroundTheme === 'desk') {
      return {
        backgroundImage: `linear-gradient(rgba(12, 10, 8, 0.4), rgba(8, 7, 5, 0.7)), url(${deskBg})`,
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        backgroundRepeat: 'no-repeat',
      };
    }
    return {
      backgroundColor: '#07090e',
      backgroundImage: 'radial-gradient(circle at 50% 30%, #1e1b4b 0%, #030712 100%)',
    };
  };

  const handleSelectTheme = (theme: BackgroundTheme) => {
    setBackgroundTheme(theme);
    localStorage.setItem('bejeweled_theme', theme);
  };

  return (
    <div
      className="min-h-screen text-white flex flex-col items-center justify-center p-2 sm:p-4 select-none touch-none transition-all duration-500 relative"
      style={getBackgroundStyle()}
    >
      {/* Quick Wallpaper Theme Switcher Button */}
      <button
        onClick={() => {
          const themes: BackgroundTheme[] = ['cosmic', 'cavern', 'desk', 'minimal'];
          const nextIdx = (themes.indexOf(backgroundTheme) + 1) % themes.length;
          handleSelectTheme(themes[nextIdx]);
        }}
        className="fixed bottom-3 right-3 sm:top-3 sm:bottom-auto bg-black/65 hover:bg-black/85 backdrop-blur-md text-white/90 border border-white/25 text-xs px-3 py-1.5 rounded-full flex items-center space-x-1.5 shadow-xl z-30 cursor-pointer active:scale-95 transition-all"
        title="클릭하여 배경 테마 변경"
      >
        <span>🎨</span>
        <span className="hidden sm:inline text-neutral-300">배경:</span>
        <span className="font-bold text-amber-300">
          {backgroundTheme === 'cosmic'
            ? '우주 성운'
            : backgroundTheme === 'cavern'
            ? '보석 동굴'
            : backgroundTheme === 'desk'
            ? '클래식 데스크'
            : '다크 미니멀'}
        </span>
      </button>

      {/* Pocket PC Handheld / Compact Frame */}
      <PocketPcFrame
        score={score}
        highScore={currentHighScore}
        level={level}
        levelGoal={levelGoal}
        difficultyLabel={difficultyLabel}
        progressPercent={displayProgress}
        isMuted={isMuted}
        isPaused={isPaused}
        displayMode={displayMode}
        isHomeScreen={currentScreen === 'home'}
        onHintClick={handleHintClick}
        onToggleMute={toggleMute}
        onTogglePause={() => setIsPaused(!isPaused)}
        onRestart={handleNewGame}
        onOpenMenu={() => setIsMenuOpen(true)}
        onGoHome={handleGoHome}
      >
        {currentScreen === 'home' ? (
          <HomeScreen
            highScore={currentHighScore}
            levelGoal={levelGoal}
            onStartGame={handleStartGameFromHome}
            onOpenScores={() => setIsMenuOpen(true)}
            onOpenHelp={() => setIsMenuOpen(true)}
            backgroundTheme={backgroundTheme}
            onSelectTheme={handleSelectTheme}
          />
        ) : (
          <>
            {/* Game Board */}
            <GameBoard
              board={board}
              selectedPos={selectedPos}
              hintPos={hintPos}
              onCellClick={handleCellClick}
              onSwipe={handleSwipe}
              isProcessing={isProcessing}
            />

            {/* Floating Scores & Particles */}
            <EffectsLayer popups={popups} particles={particles} />

            {/* Level Up Celebration Dialog */}
            {levelUpNotice?.show && (
              <div className="absolute inset-0 bg-black/80 backdrop-blur-xs flex items-center justify-center z-40 p-3">
                <div className="bg-[#ece9d8] border-2 border-[#0055ea] rounded-xs shadow-2xl p-4 max-w-[280px] w-full text-center font-sans text-neutral-900">
                  <div className="flex items-center justify-center space-x-1.5 text-amber-600 mb-1">
                    <span className="text-xl">🏆</span>
                    <span className="text-sm font-black text-[#00227b] uppercase tracking-wider">LEVEL CLEAR!</span>
                    <span className="text-xl">🏆</span>
                  </div>
                  <div className="text-lg font-black text-blue-900 mb-1">
                    LEVEL {levelUpNotice.level} 돌파!
                  </div>
                  <div className="text-xs text-neutral-700 bg-white border border-neutral-300 p-2.5 rounded-xs mb-3 text-left space-y-1.5">
                    <div className="flex justify-between font-bold text-neutral-800">
                      <span>새 난이도:</span>
                      <span className={`px-1 rounded text-white text-[10px] font-black ${
                        levelUpNotice.level >= 3 ? 'bg-purple-600' : 'bg-rose-600'
                      }`}>
                        {levelUpNotice.difficulty}
                      </span>
                    </div>
                    <div className="flex justify-between text-neutral-600 text-[11px]">
                      <span>다음 목표 점수:</span>
                      <span className="font-mono font-bold text-blue-800">{levelUpNotice.goal.toLocaleString()}점</span>
                    </div>
                    <div className="text-[11px] text-sky-800 pt-1.5 border-t border-neutral-200 leading-snug">
                      {levelUpNotice.level === 2
                        ? '❄️ 난이도 상승: 얼음에 갇힌 보석이 등장합니다! 직접 이동할 수 없으며 주변 매칭이나 폭발로 얼음을 깨뜨릴 수 있습니다. (점수 1.5배 보너스)'
                        : '🔥 최고 난이도: 얼음 보석 빈도 증가 및 더 빠른 템포! (점수 2.0배 보너스)'}
                    </div>
                  </div>
                  <div className="space-y-1.5">
                    <button
                      onClick={() => setLevelUpNotice(null)}
                      className="w-full py-1.5 bg-gradient-to-b from-[#2563eb] to-[#1d4ed8] hover:from-[#1d4ed8] hover:to-[#1e40af] text-white font-bold text-xs rounded-xs shadow-md border border-blue-950 cursor-pointer active:scale-98 transition-transform"
                    >
                      도전 시작 (Continue)
                    </button>
                    <button
                      onClick={() => setRatingModal({ show: true, trigger: 'level_up' })}
                      className="w-full py-1 bg-amber-100 hover:bg-amber-200 text-amber-900 border border-amber-400 font-bold text-[11px] rounded-xs cursor-pointer active:scale-98"
                    >
                      ⭐ 레벨 승급 별점 남기기
                    </button>
                  </div>
                </div>
              </div>
            )}

            {/* Shuffle Notification Toast */}
            {shuffleAlert && (
              <div className="absolute inset-0 bg-black/75 flex items-center justify-center z-30">
                <div className="bg-[#ece9d8] border-2 border-[#0055ea] px-4 py-2 rounded shadow-2xl text-center">
                  <span className="text-sm font-bold text-[#00227b]">NO MORE MOVES!</span>
                  <p className="text-[11px] text-neutral-600">보드를 자동으로 섞는 중입니다...</p>
                </div>
              </div>
            )}

            {/* Game Over Screen */}
            {gameOver && (
              <div className="absolute inset-0 bg-black/85 backdrop-blur-[2px] flex flex-col items-center justify-center z-40 p-4">
                <div className="bg-[#ece9d8] border-2 border-[#c42b1c] p-4 rounded shadow-2xl text-center max-w-[260px] w-full text-neutral-900">
                  <div className="text-xl font-black text-[#c42b1c] mb-1 font-mono">GAME OVER</div>
                  <div className="text-xs text-neutral-600 mb-2">시간이 모두 소진되었습니다!</div>
                  <div className="bg-white border border-[#999] p-2 rounded mb-3">
                    <div className="text-[10px] text-neutral-500 font-bold uppercase">최종 점수</div>
                    <div className="text-2xl font-black font-mono text-blue-900">
                      {score.toLocaleString()}
                    </div>
                    <div className="text-[11px] text-neutral-600 mt-0.5">도달 레벨: {level}</div>
                  </div>
                  <div className="space-y-1.5">
                    <button
                      onClick={handleNewGame}
                      className="w-full py-1.5 bg-[#0055ea] hover:bg-[#0041b3] text-white font-bold text-xs rounded border border-[#00227b] shadow-md cursor-pointer active:scale-95"
                    >
                      다시 도전 (Play Again)
                    </button>
                    <button
                      onClick={() => setRatingModal({ show: true, trigger: 'game_over' })}
                      className="w-full py-1.5 bg-[#f59e0b] hover:bg-[#d97706] text-white font-bold text-xs rounded border border-amber-800 shadow-md cursor-pointer active:scale-95 flex items-center justify-center space-x-1"
                    >
                      <span>⭐ 별점 평가 남기기</span>
                    </button>
                    <button
                      onClick={handleGoHome}
                      className="w-full py-1.5 bg-[#d8d4cc] hover:bg-[#ccc] text-neutral-800 font-bold text-xs rounded border border-[#888] cursor-pointer active:scale-95"
                    >
                      🏠 홈 화면으로 이동
                    </button>
                  </div>
                </div>
              </div>
            )}
          </>
        )}

        {/* Rating Modal for Game Over or Level Up */}
        {ratingModal?.show && (
          <RatingModal
            isOpen={ratingModal.show}
            trigger={ratingModal.trigger}
            currentLevel={level}
            currentScore={score}
            onClose={() => setRatingModal(null)}
            onSubmit={(_data) => {
              // rating submitted
            }}
          />
        )}
      </PocketPcFrame>

      {/* Windows Mobile Game Tools Modal Dialog */}
      <GameToolsModal
        isOpen={isMenuOpen}
        onClose={() => setIsMenuOpen(false)}
        currentMode={gameMode}
        onSelectMode={handleSelectMode}
        onNewGame={handleNewGame}
        isMuted={isMuted}
        onToggleMute={toggleMute}
        isHapticEnabled={isHapticEnabled}
        onToggleHaptic={toggleHaptic}
        displayMode={displayMode}
        onToggleDisplayMode={() => setDisplayMode(displayMode === 'pda' ? 'compact' : 'pda')}
        backgroundTheme={backgroundTheme}
        onSelectTheme={handleSelectTheme}
        highScores={highScores}
        onGoHome={handleGoHome}
      />
    </div>
  );
}
