import type { Level } from "../app/state";

export const LEVEL_LABELS: Record<Level, string> = {
  1: "🟢 Niveau 1 – Additions faciles",
  2: "🔵 Niveau 2 – Additions & soustractions",
  3: "🟡 Niveau 3 – Multiplications (×5)",
  4: "🟠 Niveau 4 – Multiplications (×10)",
  5: "🔴 Niveau 5 – Avec divisions",
  6: "🟣 Niveau 6 – Calculs combinés",
};

export function levelLabel(level: Level): string {
  return LEVEL_LABELS[level] ?? `Niveau ${level}`;
}