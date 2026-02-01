import { go } from "../../app/router";
import type { Level } from "../../app/state";
import { getTopScores, clearScores, type ScoreEntry } from "../../storage/scores";
import { Button } from "../components/Button";
import { Card } from "../components/Card";
import { Footer } from "../components/Footer";
import { levelLabel } from "../../game/levelLabels";

function formatDateShort(ms: number): string {
  const d = new Date(ms);
  // Format court, plus lisible en tableau
  return d.toLocaleString("fr-FR", { dateStyle: "short", timeStyle: "short" });
}

function badgeEmoji(threshold: number | null): string | null {
  if (!threshold) return null;
  if (threshold === 3) return "✨";
  if (threshold === 5) return "⭐";
  if (threshold === 10) return "🔥";
  if (threshold === 15) return "🚀";
  if (threshold === 20) return "🏆";
  if (threshold === 30) return "👑";
  return "🏅";
}

function levelTitle(level: Level): string {
  return levelLabel(level);
}

function renderLevelSection(level: Level): HTMLElement {
  const section = document.createElement("div");
  section.className = "levelSection";

  const header = document.createElement("div");
  header.className = "levelHeader";

  const h = document.createElement("h2");
  h.textContent = levelTitle(level);

  header.appendChild(h);
  section.appendChild(header);

  const scores = getTopScores(level); // top scores du niveau

  if (scores.length === 0) {
    const empty = document.createElement("div");
    empty.className = "muted";
    empty.textContent = "Aucun score pour ce niveau.";
    section.appendChild(empty);
    return section;
  }

  const table = document.createElement("div");
  table.className = "scoreTable";

  scores.forEach((s: ScoreEntry, idx: number) => {
    const row = document.createElement("div");
    row.className = "scoreRow simple";

    const rank = document.createElement("div");
    rank.className = "scoreRank";
    rank.textContent = String(idx + 1);

    const who = document.createElement("div");
    who.className = "scoreWho";

    const name = document.createElement("div");
    name.className = "scoreName";
    name.textContent = `${s.emoji} ${s.pseudo}`;

    const meta = document.createElement("div");
    meta.className = "scoreMeta";

    // 🔥 meilleure série
    const streak = document.createElement("span");
    streak.className = "pill";
    streak.textContent = `🔥 ${s.bestStreak}`;
    streak.title = "Meilleure série : nombre de bonnes réponses consécutives";

    // 🏅 badge atteint (✨⭐🔥🚀🏆👑) si présent
    const badge = badgeEmoji(s.bestBadgeThreshold);
    const badgeEl = document.createElement("span");
    badgeEl.className = "pill";
    badgeEl.textContent = badge ? `${badge} ${s.bestBadgeThreshold}` : "🏅 —";
    badgeEl.title = badge
      ? `Badge débloqué pour une série de ${s.bestBadgeThreshold}`
      : "Aucun badge débloqué";

    meta.append(streak, badgeEl);

    who.append(name, meta);

    const score = document.createElement("div");
    score.className = "scoreValue big";
    score.textContent = String(s.score);

    const date = document.createElement("div");
    date.className = "scoreDate";
    date.textContent = formatDateShort(s.createdAtEpochMs);

    row.append(rank, who, score, date);
    table.appendChild(row);
  });

  section.appendChild(table);
  return section;
}

export function ScoreScreen(): HTMLElement {
  const root = document.createElement("div");
  root.className = "screen";

  const title = document.createElement("h1");
  title.textContent = "Meilleurs scores 🏆";

  const listHost = document.createElement("div");
  listHost.className = "levelsHost";

  for (let lvl = 1 as Level; lvl <= 6; lvl = (lvl + 1) as Level) {
    listHost.appendChild(renderLevelSection(lvl));
  }

  // ✅ Légende (entre la liste et les boutons)
  const legend = document.createElement("div");
  legend.className = "scoreLegend";

  const r1 = document.createElement("div");
  r1.className = "legendRow";
  r1.textContent = "🔥  Meilleure série = bonnes réponses d’affilée";

  const r2 = document.createElement("div");
  r2.className = "legendRow";
  r2.textContent = "✨ ⭐ 🔥 🚀 🏆 👑  Badges = paliers de série (3, 5, 10, 15, 20, 30)";

  legend.append(r1, r2);

  const actions = document.createElement("div");
  actions.className = "actions";

  actions.append(
    Button("Accueil", () => go("home"), "primary"),
    Button("Effacer les scores (local)", () => {
      clearScores();
      listHost.innerHTML = "";
      for (let lvl = 1 as Level; lvl <= 6; lvl = (lvl + 1) as Level) {
        listHost.appendChild(renderLevelSection(lvl));
      }
    }, "ghost")
  );

  // ✅ Card : ordre propre
  const card = Card([listHost, legend, actions]);
  root.append(title, card, Footer());

  return root;
}