import { go } from "../../app/router";
import { state } from "../../app/state";
import { GameEngine } from "../../game/engine";
import { addScore } from "../../storage/scores";
import { Button } from "../components/Button";
import { Card } from "../components/Card";
import { OptionGrid } from "../components/OptionGrid";

const GAME_DURATION_SECONDS = 60;

function formatTime(seconds: number): string {
  const m = Math.floor(seconds / 60);
  const s = seconds % 60;
  return `${m}:${String(s).padStart(2, "0")}`;
}

/**
 * Même logique que dans tes badges (seuils).
 * Idéalement : centraliser dans un fichier commun, mais OK pour l’instant.
 */
function bestBadgeThresholdFromStreak(bestStreak: number): number | null {
  if (bestStreak >= 30) return 30;
  if (bestStreak >= 20) return 20;
  if (bestStreak >= 15) return 15;
  if (bestStreak >= 10) return 10;
  if (bestStreak >= 5) return 5;
  if (bestStreak >= 3) return 3;
  return null;
}

export function GameScreen(): HTMLElement {
  const root = document.createElement("div");
  root.className = "screen";

  if (!state.player) {
    go("home");
    return root;
  }

  // ----- UI (créée une seule fois)
  const header = document.createElement("div");
  header.className = "gameHeader";

  const player = document.createElement("div");
  player.className = "playerChip";
  player.textContent = `${state.player.emoji} ${state.player.pseudo}`;

  const timerEl = document.createElement("div");
  timerEl.className = "chip";

  const scoreEl = document.createElement("div");
  scoreEl.className = "chip";

  const streakEl = document.createElement("div");
  streakEl.className = "chip";

  header.append(player, timerEl, scoreEl, streakEl);

  const questionEl = document.createElement("div");
  questionEl.className = "question";

  const feedbackEl = document.createElement("div");
  feedbackEl.className = "feedback";

  const badgeEl = document.createElement("div");
  badgeEl.className = "badgeToast";

  const optionsHost = document.createElement("div");

  const actions = document.createElement("div");
  actions.className = "actions";

  let alive = true; // permet de stopper proprement l'écran (timer, etc.)

  const quitBtn = Button("Quitter", () => {
    alive = false;
    cleanup();
    go("home");
  }, "ghost");

  actions.append(quitBtn);

  const card = Card([questionEl, feedbackEl, badgeEl, optionsHost, actions]);
  root.append(header, card);

  // ----- Engine
  const engine = new GameEngine(state.level);
  engine.start(GAME_DURATION_SECONDS);

  // ----- Rendu "question + options" (PAS en boucle)
  function renderQuestionAndOptions() {
    const snap = engine.getSnapshot();

    questionEl.textContent = snap.question.text;

    // On remplace UNE FOIS les options (à chaque question)
    optionsHost.innerHTML = "";
    optionsHost.appendChild(
      OptionGrid(snap.question.options, (selected) => {
        if (!alive) return;

        const wasCorrect = selected === snap.question.answer;

        // Feedback court (purement visuel)
        feedbackEl.textContent = wasCorrect ? "✅ Bravo !" : "❌ Oups !";
        feedbackEl.className = "feedback " + (wasCorrect ? "ok" : "ko");
        window.setTimeout(() => {
          feedbackEl.textContent = "";
          feedbackEl.className = "feedback";
        }, 180);

        engine.answer(selected);

        // Badge toast si palier atteint
        const after = engine.getSnapshot();
        if (after.lastBadgeUnlocked) {
          badgeEl.textContent = `${after.lastBadgeUnlocked.emoji} ${after.lastBadgeUnlocked.label}`;
          badgeEl.classList.add("show");
          window.setTimeout(() => badgeEl.classList.remove("show"), 900);
        }

        // Affiche la question suivante (et ses 4 boutons) UNE FOIS
        renderQuestionAndOptions();
      })
    );
  }

  // ----- Rendu "status" (timer/score/streak) : interval léger
  function renderStatus() {
    const snap = engine.getSnapshot();

    timerEl.textContent = `⏱️ ${formatTime(snap.remainingSeconds)}`;
    scoreEl.textContent = `⭐️ Score: ${snap.score}`;
    streakEl.textContent = `🔥 Série: ${snap.streak} (max ${snap.bestStreak})`;

    // Fin de partie
    if (snap.isOver) {
      alive = false;
      cleanup();

      const bestStreak = engine.getBestStreak();
      const badgeThreshold = bestBadgeThresholdFromStreak(bestStreak);

      addScore({
        pseudo: state.player!.pseudo,
        emoji: state.player!.emoji,
        level: state.level,
        score: engine.getFinalScore(),
        bestStreak,
        bestBadgeThreshold: badgeThreshold,
      });

      go("scores");
    }
  }

  // Interval : 5 fois/sec (suffisant, fluide, et surtout stable)
  const statusTimer = window.setInterval(() => {
    if (!alive) return;
    renderStatus();
  }, 200);

  function cleanup() {
    window.clearInterval(statusTimer);
  }

  // Initial render
  renderStatus();
  renderQuestionAndOptions();

  return root;
}