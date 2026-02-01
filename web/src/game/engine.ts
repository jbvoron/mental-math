import type { Level } from "../app/state";
import type { Question } from "./types";
import { generateQuestion } from "./generator";

export interface GameSnapshot {
  question: Question;
  score: number;
  remainingSeconds: number;
  isOver: boolean;

  // Nouveau : série
  streak: number;
  bestStreak: number;

  // Nouveau : badge (si un palier vient d'être atteint)
  lastBadgeUnlocked: Badge | null;
}

export interface Badge {
  threshold: number; // ex: 5
  label: string;     // ex: "⭐ Série de 5 !"
  emoji: string;     // ex: "⭐"
}

/**
 * Badges (paliers de série).
 * Ajuste à ton goût : on peut mettre beaucoup de paliers, ça motive !
 */
const BADGES: Badge[] = [
  { threshold: 3,  label: "Bien joué ! Série de 3",  emoji: "✨" },
  { threshold: 5,  label: "Super ! Série de 5",     emoji: "⭐" },
  { threshold: 10, label: "Wow ! Série de 10",      emoji: "🔥" },
  { threshold: 15, label: "Incroyable ! Série de 15", emoji: "🚀" },
  { threshold: 20, label: "Champion ! Série de 20", emoji: "🏆" },
  { threshold: 30, label: "Légende ! Série de 30",  emoji: "👑" },
];

function badgeForStreak(streak: number): Badge | null {
  // Retourne le badge EXACT correspondant au palier atteint (pas le dernier en dessous)
  return BADGES.find(b => b.threshold === streak) ?? null;
}

/**
 * Moteur isolé de la UI :
 * - timer, score, questions
 * - streak/bestStreak + badges
 */
export class GameEngine {
  private level: Level;
  private score = 0;
  private endsAt = 0;
  private current: Question;

  // Nouveau
  private streak = 0;
  private bestStreak = 0;
  private lastBadgeUnlocked: Badge | null = null;

  constructor(level: Level) {
    this.level = level;
    this.current = generateQuestion(level);
  }

  start(durationSeconds: number) {
    this.score = 0;
    this.streak = 0;
    this.bestStreak = 0;
    this.lastBadgeUnlocked = null;

    this.endsAt = Date.now() + durationSeconds * 1000;
    this.current = generateQuestion(this.level);
  }

  getSnapshot(): GameSnapshot {
    const remainingMs = Math.max(0, this.endsAt - Date.now());
    const remainingSeconds = Math.ceil(remainingMs / 1000);

    return {
      question: this.current,
      score: this.score,
      remainingSeconds,
      isOver: remainingMs <= 0,

      streak: this.streak,
      bestStreak: this.bestStreak,
      lastBadgeUnlocked: this.lastBadgeUnlocked,
    };
  }

  answer(selected: number) {
    if (Date.now() >= this.endsAt) return;

    const isCorrect = selected === this.current.answer;

    if (isCorrect) {
      this.score += 1;

      // Série++
      this.streak += 1;
      if (this.streak > this.bestStreak) this.bestStreak = this.streak;

      // Badge si palier atteint
      this.lastBadgeUnlocked = badgeForStreak(this.streak);
    } else {
      // Plancher score à 0
      this.score = Math.max(0, this.score - 1);

      // Série reset
      this.streak = 0;

      // Pas de badge sur erreur
      this.lastBadgeUnlocked = null;
    }

    this.current = generateQuestion(this.level);
  }

  getFinalScore(): number {
    return this.score;
  }

  getBestStreak(): number {
    return this.bestStreak;
  }
}