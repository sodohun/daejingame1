import { Board, Gem, GemType, MatchResult, Position, SpecialType } from '../types/game';

export const BOARD_SIZE = 8;
export const GEM_TYPES: GemType[] = [
  'ruby',
  'diamond',
  'citrine',
  'topaz',
  'emerald',
  'sapphire',
  'amethyst',
];

export function getRandomGemType(): GemType {
  const index = Math.floor(Math.random() * GEM_TYPES.length);
  return GEM_TYPES[index];
}

export function createGem(
  row: number,
  col: number,
  type?: GemType,
  special: SpecialType = 'normal',
  isFrozen: boolean = false
): Gem {
  return {
    id: `gem_${Date.now()}_${Math.random().toString(36).substring(2, 8)}`,
    type: type || getRandomGemType(),
    special,
    row,
    col,
    isFrozen,
  };
}

/**
 * Checks if a specific cell matches 3 in a row horizontally or vertically
 */
function causesInitialMatch(board: Board, row: number, col: number, type: GemType): boolean {
  // Horizontal check to the left
  if (
    col >= 2 &&
    board[row][col - 1]?.type === type &&
    board[row][col - 2]?.type === type
  ) {
    return true;
  }
  // Vertical check upwards
  if (
    row >= 2 &&
    board[row - 1][col]?.type === type &&
    board[row - 2][col]?.type === type
  ) {
    return true;
  }
  // Square (2x2) check top-left
  if (
    row >= 1 &&
    col >= 1 &&
    board[row - 1][col]?.type === type &&
    board[row][col - 1]?.type === type &&
    board[row - 1][col - 1]?.type === type
  ) {
    return true;
  }
  return false;
}

export function createInitialBoard(): Board {
  let board: Board;
  let attempts = 0;

  do {
    board = Array(BOARD_SIZE)
      .fill(null)
      .map(() => Array(BOARD_SIZE).fill(null));

    for (let r = 0; r < BOARD_SIZE; r++) {
      for (let c = 0; c < BOARD_SIZE; c++) {
        let type: GemType;
        let tries = 0;
        do {
          type = getRandomGemType();
          tries++;
        } while (causesInitialMatch(board, r, c, type) && tries < 20);

        board[r][c] = createGem(r, c, type);
      }
    }
    attempts++;
  } while (!hasValidMoves(board) && attempts < 10);

  return board;
}

/**
 * Check if two positions are orthogonal neighbors
 */
export function isAdjacent(pos1: Position, pos2: Position): boolean {
  const dr = Math.abs(pos1.row - pos2.row);
  const dc = Math.abs(pos1.col - pos2.col);
  return (dr === 1 && dc === 0) || (dr === 0 && dc === 1);
}

/**
 * Clone board matrix
 */
export function cloneBoard(board: Board): Board {
  return board.map((row) =>
    row.map((gem) => (gem ? { ...gem } : null))
  );
}

/**
 * Swap two gems on board
 */
export function swapGems(board: Board, p1: Position, p2: Position): Board {
  const newBoard = cloneBoard(board);
  const temp = newBoard[p1.row][p1.col];
  newBoard[p1.row][p1.col] = newBoard[p2.row][p2.col];
  newBoard[p2.row][p2.col] = temp;

  if (newBoard[p1.row][p1.col]) {
    newBoard[p1.row][p1.col]!.row = p1.row;
    newBoard[p1.row][p1.col]!.col = p1.col;
  }
  if (newBoard[p2.row][p2.col]) {
    newBoard[p2.row][p2.col]!.row = p2.row;
    newBoard[p2.row][p2.col]!.col = p2.col;
  }
  return newBoard;
}

/**
 * Find all matches on board, detecting 3, 4 (flame), and 5 (hypercube) runs
 */
export function findMatches(board: Board, swappedP1?: Position, swappedP2?: Position): MatchResult {
  const matchSet = new Set<string>();
  let flameCreated: Position | undefined;
  let hypercubeCreated: Position | undefined;
  const clearedSpecialGems: { pos: Position; type: SpecialType }[] = [];

  // Helper key
  const toKey = (r: number, c: number) => `${r},${c}`;
  const fromKey = (k: string): Position => {
    const [r, c] = k.split(',').map(Number);
    return { row: r, col: c };
  };

  // 1. Horizontal runs
  for (let r = 0; r < BOARD_SIZE; r++) {
    let run = 1;
    for (let c = 0; c < BOARD_SIZE; c++) {
      const current = board[r][c];
      const next = c + 1 < BOARD_SIZE ? board[r][c + 1] : null;

      if (current && next && current.type === next.type) {
        run++;
      } else {
        if (run >= 3) {
          const runCoords: Position[] = [];
          for (let i = c - run + 1; i <= c; i++) {
            matchSet.add(toKey(r, i));
            runCoords.push({ row: r, col: i });
          }

          // Special Gem Spawn logic
          if (run >= 5) {
            // Priority: placed where player swapped, or middle
            const chosen = runCoords.find(
              (p) =>
                (swappedP1 && p.row === swappedP1.row && p.col === swappedP1.col) ||
                (swappedP2 && p.row === swappedP2.row && p.col === swappedP2.col)
            ) || runCoords[Math.floor(run / 2)];
            hypercubeCreated = chosen;
          } else if (run === 4 && !hypercubeCreated) {
            const chosen = runCoords.find(
              (p) =>
                (swappedP1 && p.row === swappedP1.row && p.col === swappedP1.col) ||
                (swappedP2 && p.row === swappedP2.row && p.col === swappedP2.col)
            ) || runCoords[1];
            flameCreated = chosen;
          }
        }
        run = 1;
      }
    }
  }

  // 2. Vertical runs
  for (let c = 0; c < BOARD_SIZE; c++) {
    let run = 1;
    for (let r = 0; r < BOARD_SIZE; r++) {
      const current = board[r][c];
      const next = r + 1 < BOARD_SIZE ? board[r + 1][c] : null;

      if (current && next && current.type === next.type) {
        run++;
      } else {
        if (run >= 3) {
          const runCoords: Position[] = [];
          for (let i = r - run + 1; i <= r; i++) {
            matchSet.add(toKey(i, c));
            runCoords.push({ row: i, col: c });
          }

          if (run >= 5) {
            const chosen = runCoords.find(
              (p) =>
                (swappedP1 && p.row === swappedP1.row && p.col === swappedP1.col) ||
                (swappedP2 && p.row === swappedP2.row && p.col === swappedP2.col)
            ) || runCoords[Math.floor(run / 2)];
            hypercubeCreated = chosen;
          } else if (run === 4 && !hypercubeCreated && !flameCreated) {
            const chosen = runCoords.find(
              (p) =>
                (swappedP1 && p.row === swappedP1.row && p.col === swappedP1.col) ||
                (swappedP2 && p.row === swappedP2.row && p.col === swappedP2.col)
            ) || runCoords[1];
            flameCreated = chosen;
          }
        }
        run = 1;
      }
    }
  }

  // 3. Square (2x2) and rectangular cluster matches (2x2, 2x3, 3x2, 3x3 etc.)
  const squareCells = new Set<string>();
  let detectedSquareCount = 0;

  for (let r = 0; r < BOARD_SIZE - 1; r++) {
    for (let c = 0; c < BOARD_SIZE - 1; c++) {
      const g1 = board[r][c];
      const g2 = board[r][c + 1];
      const g3 = board[r + 1][c];
      const g4 = board[r + 1][c + 1];

      if (
        g1 && g2 && g3 && g4 &&
        g1.type === g2.type &&
        g1.type === g3.type &&
        g1.type === g4.type
      ) {
        detectedSquareCount++;
        squareCells.add(toKey(r, c));
        squareCells.add(toKey(r, c + 1));
        squareCells.add(toKey(r + 1, c));
        squareCells.add(toKey(r + 1, c + 1));
      }
    }
  }

  const isSquareMatch = detectedSquareCount > 0;
  if (isSquareMatch) {
    for (const key of squareCells) {
      matchSet.add(key);
    }
    // When squares/rectangles match, create a Flame Gem if no special gem is queued
    if (!flameCreated && !hypercubeCreated) {
      const squareList = Array.from(squareCells).map(fromKey);
      const chosen = squareList.find(
        (p) =>
          (swappedP1 && p.row === swappedP1.row && p.col === swappedP1.col) ||
          (swappedP2 && p.row === swappedP2.row && p.col === swappedP2.col)
      ) || squareList[0];
      flameCreated = chosen;
    }
  }

  // 4. Check for flame gem activations inside matches (3x3 explosive radius)
  const initialMatches = Array.from(matchSet).map(fromKey);
  const queue = [...initialMatches];
  const processed = new Set<string>(matchSet);

  while (queue.length > 0) {
    const pos = queue.shift()!;
    const gem = board[pos.row][pos.col];
    if (gem && gem.special === 'flame') {
      clearedSpecialGems.push({ pos, type: 'flame' });
      // Clear 3x3 surrounding
      for (let dr = -1; dr <= 1; dr++) {
        for (let dc = -1; dc <= 1; dc++) {
          const nr = pos.row + dr;
          const nc = pos.col + dc;
          if (nr >= 0 && nr < BOARD_SIZE && nc >= 0 && nc < BOARD_SIZE) {
            const key = toKey(nr, nc);
            if (!processed.has(key)) {
              processed.add(key);
              matchSet.add(key);
              queue.push({ row: nr, col: nc });
            }
          }
        }
      }
    }
  }

  const finalMatches = Array.from(matchSet).map(fromKey);
  return {
    matches: finalMatches,
    flameCreated,
    hypercubeCreated,
    clearedSpecialGems,
    isSquareMatch,
    squareMatchCount: detectedSquareCount,
  };
}

/**
 * Handle Hypercube swap resolution (destroy all gems of target type)
 */
export function resolveHypercubeMatch(
  board: Board,
  hypercubePos: Position,
  targetType: GemType
): Position[] {
  const matches: Position[] = [{ ...hypercubePos }];
  for (let r = 0; r < BOARD_SIZE; r++) {
    for (let c = 0; c < BOARD_SIZE; c++) {
      const gem = board[r][c];
      if (gem && gem.type === targetType) {
        matches.push({ row: r, col: c });
      }
    }
  }
  return matches;
}

/**
 * Apply gravity - gems drop down to fill null gaps
 */
export function applyGravity(board: Board): { board: Board; hasFallen: boolean } {
  const newBoard = cloneBoard(board);
  let hasFallen = false;

  for (let c = 0; c < BOARD_SIZE; c++) {
    let writeRow = BOARD_SIZE - 1;
    for (let r = BOARD_SIZE - 1; r >= 0; r--) {
      if (newBoard[r][c] !== null) {
        if (writeRow !== r) {
          newBoard[writeRow][c] = newBoard[r][c];
          newBoard[writeRow][c]!.row = writeRow;
          newBoard[r][c] = null;
          hasFallen = true;
        }
        writeRow--;
      }
    }
  }

  return { board: newBoard, hasFallen };
}

/**
 * Refill empty spots at the top with new random gems
 * Higher levels (Level 2+) introduce frozen gems
 */
export function refillBoard(board: Board, level: number = 1): { board: Board; newCount: number } {
  const newBoard = cloneBoard(board);
  let newCount = 0;
  // Frozen gem spawn chance: 0% on Level 1, 7% on Level 2, 12% on Level 3+
  const frozenChance = level >= 3 ? 0.12 : level >= 2 ? 0.07 : 0;

  for (let c = 0; c < BOARD_SIZE; c++) {
    for (let r = 0; r < BOARD_SIZE; r++) {
      if (newBoard[r][c] === null) {
        const isFrozen = Math.random() < frozenChance;
        const gem = createGem(r, c, undefined, 'normal', isFrozen);
        gem.isNew = true;
        newBoard[r][c] = gem;
        newCount++;
      }
    }
  }

  return { board: newBoard, newCount };
}

/**
 * Check if the board has any valid legal moves
 */
export function hasValidMoves(board: Board): boolean {
  return findHint(board) !== null;
}

/**
 * Find a valid move for Hint highlighting
 * Respects frozen gems (cannot be swapped)
 */
export function findHint(board: Board): { from: Position; to: Position } | null {
  for (let r = 0; r < BOARD_SIZE; r++) {
    for (let c = 0; c < BOARD_SIZE; c++) {
      const gem = board[r][c];
      if (!gem || gem.isFrozen) continue;

      // Check right swap
      if (c + 1 < BOARD_SIZE) {
        const targetGem = board[r][c + 1];
        if (targetGem && !targetGem.isFrozen) {
          if (gem.special === 'hypercube' || targetGem.special === 'hypercube') {
            return { from: { row: r, col: c }, to: { row: r, col: c + 1 } };
          }
          const testBoard = swapGems(board, { row: r, col: c }, { row: r, col: c + 1 });
          if (findMatches(testBoard).matches.length > 0) {
            return { from: { row: r, col: c }, to: { row: r, col: c + 1 } };
          }
        }
      }

      // Check down swap
      if (r + 1 < BOARD_SIZE) {
        const targetGem = board[r + 1][c];
        if (targetGem && !targetGem.isFrozen) {
          if (gem.special === 'hypercube' || targetGem.special === 'hypercube') {
            return { from: { row: r, col: c }, to: { row: r + 1, col: c } };
          }
          const testBoard = swapGems(board, { row: r, col: c }, { row: r, col: c + 1 });
          if (findMatches(testBoard).matches.length > 0) {
            return { from: { row: r, col: c }, to: { row: r + 1, col: c } };
          }
        }
      }
    }
  }
  return null;
}

/**
 * Shuffle board when no moves remain
 */
export function shuffleBoard(board: Board): Board {
  const gems: Gem[] = [];
  for (let r = 0; r < BOARD_SIZE; r++) {
    for (let c = 0; c < BOARD_SIZE; c++) {
      if (board[r][c]) {
        gems.push({ ...board[r][c]! });
      }
    }
  }

  let shuffled: Board;
  let attempts = 0;

  do {
    // Fisher-Yates shuffle
    for (let i = gems.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [gems[i], gems[j]] = [gems[j], gems[i]];
    }

    shuffled = Array(BOARD_SIZE)
      .fill(null)
      .map(() => Array(BOARD_SIZE).fill(null));

    let idx = 0;
    for (let r = 0; r < BOARD_SIZE; r++) {
      for (let c = 0; c < BOARD_SIZE; c++) {
        const g = { ...gems[idx++] };
        g.row = r;
        g.col = c;
        shuffled[r][c] = g;
      }
    }

    attempts++;
  } while (
    (findMatches(shuffled).matches.length > 0 || !hasValidMoves(shuffled)) &&
    attempts < 50
  );

  return shuffled;
}
