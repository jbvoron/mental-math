import type { Level } from "../app/state";

const KEY = "mm_scores_v1";
const MAX_PER_LEVEL = 20;

export interface ScoreEntry {
  pseudo: string;
  emoji: string;
  level: Level;
  score: number;

  // Nouveau
  bestStreak: number;
  bestBadgeThreshold: number | null; // ex: 10 si badge 10 atteint, sinon null

  createdAtEpochMs: number;
}

function read(): ScoreEntry[] {
  try {
    const raw = localStorage.getItem(KEY);
    if (!raw) return [];
    const parsed = JSON.parse(raw) as ScoreEntry[];
    return Array.isArray(parsed) ? parsed : [];
  } catch {
    return [];
  }
}
function write(items: ScoreEntry[]) {
  localStorage.setItem(KEY, JSON.stringify(items));
}

/**
 * Enregistre un score.
 * Stratégie : on conserve TOP N par niveau, triés par score desc puis date asc.
 */
export function addScore(entry: Omit<ScoreEntry, "createdAtEpochMs">) {
  const items = read();
  const full: ScoreEntry = { ...entry, createdAtEpochMs: Date.now() };
  items.push(full);

  const byLevel = new Map<number, ScoreEntry[]>();
  for (const s of items) {
    const arr = byLevel.get(s.level) ?? [];
    arr.push(s);
    byLevel.set(s.level, arr);
  }

  const compacted: ScoreEntry[] = [];
  for (const [_, arr] of byLevel.entries()) {
    arr.sort((a, b) => (b.score - a.score) || (a.createdAtEpochMs - b.createdAtEpochMs));
    compacted.push(...arr.slice(0, MAX_PER_LEVEL));
  }

  write(compacted);
}

export function getTopScores(level?: Level): ScoreEntry[] {
  const items = read();
  const filtered = level ? items.filter(s => s.level === level) : items;
  return filtered.sort((a, b) => (b.score - a.score) || (a.createdAtEpochMs - b.createdAtEpochMs));
}

export function clearScores() {
  localStorage.removeItem(KEY);
}