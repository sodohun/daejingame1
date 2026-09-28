import React, { useRef, useState, useEffect } from 'react';
import { Board, Position } from '../types/game';
import { GemIcon } from './GemIcon';
import { BOARD_SIZE, isAdjacent } from '../utils/gemEngine';

interface GameBoardProps {
  board: Board;
  selectedPos: Position | null;
  hintPos: { from: Position; to: Position } | null;
  onCellClick: (row: number, col: number) => void;
  onSwipe: (from: Position, to: Position) => void;
  isProcessing: boolean;
}

export const GameBoard: React.FC<GameBoardProps> = ({
  board,
  selectedPos,
  hintPos,
  onCellClick,
  onSwipe,
  isProcessing,
}) => {
  const [touchStart, setTouchStart] = useState<{ row: number; col: number; x: number; y: number } | null>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  // Handle pointer down for drag/swipe detection
  const handlePointerDown = (e: React.PointerEvent, r: number, c: number) => {
    if (isProcessing) return;
    setTouchStart({
      row: r,
      col: c,
      x: e.clientX,
      y: e.clientY,
    });
  };

  const handlePointerUp = (e: React.PointerEvent, r: number, c: number) => {
    if (isProcessing || !touchStart) {
      setTouchStart(null);
      return;
    }

    const dx = e.clientX - touchStart.x;
    const dy = e.clientY - touchStart.y;
    const dist = Math.hypot(dx, dy);

    // If moved more than 20 pixels, treat as a swipe/drag
    if (dist > 20) {
      let targetRow = touchStart.row;
      let targetCol = touchStart.col;

      if (Math.abs(dx) > Math.abs(dy)) {
        // Horizontal swipe
        targetCol += dx > 0 ? 1 : -1;
      } else {
        // Vertical swipe
        targetRow += dy > 0 ? 1 : -1;
      }

      if (
        targetRow >= 0 &&
        targetRow < BOARD_SIZE &&
        targetCol >= 0 &&
        targetCol < BOARD_SIZE
      ) {
        onSwipe(
          { row: touchStart.row, col: touchStart.col },
          { row: targetRow, col: targetCol }
        );
      }
    } else {
      // Tap / click
      onCellClick(r, c);
    }

    setTouchStart(null);
  };

  return (
    <div
      ref={containerRef}
      className="relative w-full aspect-square bg-[#0b0c0e] border-[3px] border-[#0a1224] shadow-inner select-none p-1 sm:p-1.5 touch-none"
    >
      {/* 8x8 Grid Tiles */}
      <div className="grid grid-cols-8 grid-rows-8 w-full h-full gap-[1px] bg-[#121418]">
        {board.map((row, r) =>
          row.map((gem, c) => {
            const isDarkTile = (r + c) % 2 === 1;
            const isSelected = selectedPos?.row === r && selectedPos?.col === c;
            const isHinted =
              (hintPos?.from.row === r && hintPos?.from.col === c) ||
              (hintPos?.to.row === r && hintPos?.to.col === c);

            return (
              <div
                key={`cell_${r}_${c}`}
                onPointerDown={(e) => handlePointerDown(e, r, c)}
                onPointerUp={(e) => handlePointerUp(e, r, c)}
                className={`relative flex items-center justify-center cursor-pointer transition-colors duration-150 overflow-hidden ${
                  isDarkTile ? 'bg-[#181a1f]' : 'bg-[#22252c]'
                } ${isSelected ? 'ring-2 ring-white/90 bg-indigo-950/60 z-10' : ''}`}
                style={{
                  boxShadow: 'inset 0 0 4px rgba(0, 0, 0, 0.4)',
                }}
              >
                {gem && (
                  <div
                    className={`transform transition-all duration-200 ${
                      gem.isMatched ? 'scale-0 opacity-0' : 'scale-100 opacity-100'
                    }`}
                  >
                    <GemIcon
                      type={gem.type}
                      special={gem.special}
                      size={36}
                      isSelected={isSelected}
                      isHinted={isHinted}
                      isFrozen={gem.isFrozen}
                    />
                  </div>
                )}
              </div>
            );
          })
        )}
      </div>
    </div>
  );
};
