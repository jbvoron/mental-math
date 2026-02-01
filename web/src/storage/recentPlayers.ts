const KEY = "mm_recent_players_v1";
const MAX = 10;

export interface RecentPlayer {
  pseudo: string;
  emoji: string;
  lastUsedEpochMs: number;
}

function read(): RecentPlayer[] {
  try {
    const raw = localStorage.getItem(KEY);
    if (!raw) return [];
    const parsed = JSON.parse(raw) as RecentPlayer[];
    return Array.isArray(parsed) ? parsed : [];
  } catch {
    return [];
  }
}

function write(players: RecentPlayer[]) {
  localStorage.setItem(KEY, JSON.stringify(players));
}

export function listRecentPlayers(): RecentPlayer[] {
  return read().sort((a, b) => b.lastUsedEpochMs - a.lastUsedEpochMs);
}

export function upsertRecentPlayer(pseudo: string, emoji: string) {
  const now = Date.now();
  const players = read().filter(p => p.pseudo !== pseudo);
  players.unshift({ pseudo, emoji, lastUsedEpochMs: now });
  write(players.slice(0, MAX));
}

export function deleteRecentPlayer(pseudo: string) {
  write(read().filter(p => p.pseudo !== pseudo));
}