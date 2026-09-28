export type GemType =
  | 'ruby'       // Red square cushion
  | 'diamond'    // White 8-facet brilliant
  | 'citrine'    // Orange horizontal hexagon
  | 'topaz'      // Yellow 45-degree diamond
  | 'emerald'    // Green octagon
  | 'sapphire'   // Blue teardrop/diamond
  | 'amethyst';   // Purple triangle

export type SpecialType = 'normal' | 'flame' | 'hypercube';

export interface Gem {
  id: string;
  type: GemType;
  special: SpecialType;
  row: number;
  col: number;
  isMatched?: boolean;
  isNew?: boolean;
  isFrozen?: boolean;
}

export type Board = (Gem | null)[][];

export interface Position {
  row: number;
  col: number;
}

export interface MatchResult {
  matches: Position[];
  flameCreated?: Position;
  hypercubeCreated?: Position;
  clearedSpecialGems?: { pos: Position; type: SpecialType }[];
  isSquareMatch?: boolean;
  squareMatchCount?: number;
}

export type GameMode = 'classic' | 'timeAttack' | 'endless';

export type BackgroundTheme = 'cosmic' | 'cavern' | 'desk' | 'minimal';

export interface ScorePopup {
  id: string;
  x: number;
  y: number;
  score: number;
  label?: string;
  color?: string;
}

export interface Particle {
  id: string;
  x: number;
  y: number;
  vx: number;
  vy: number;
  color: string;
  size: number;
  life: number;
  maxLife: number;
}

export interface HighScoreRecord {
  mode: GameMode;
  score: number;
  level: number;
  date: string;
}
