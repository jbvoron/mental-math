export type Level = 1 | 2 | 3 | 4 | 5 | 6;

export interface PlayerProfile {
  pseudo: string;
  emoji: string;
}

export interface AppState {
  player: PlayerProfile | null;
  level: Level;
  // Le score courant de la partie
  score: number;
  // Fin de partie
  endsAtEpochMs: number;
}

export const state: AppState = {
  player: null,
  level: 1,
  score: 0,
  endsAtEpochMs: 0,
};