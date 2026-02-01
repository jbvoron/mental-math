import { go } from "../../app/router";
import { state, type Level } from "../../app/state";
import { listRecentPlayers, upsertRecentPlayer, deleteRecentPlayer } from "../../storage/recentPlayers";
import { Button } from "../components/Button";
import { Card } from "../components/Card";
import { EmojiPicker } from "../components/EmojiPicker";
import { levelLabel as getLevelLabel } from "../../game/levelLabels";

export function HomeScreen(): HTMLElement {
  const root = document.createElement("div");
  root.className = "screen";

  const title = document.createElement("h1");
  title.textContent = "Calcul Mental ⚡️";

  // --- recent players
  const recentTitle = document.createElement("h2");
  recentTitle.textContent = "Joueurs récents";

  const recentList = document.createElement("div");
  recentList.className = "recentList";

  function renderRecent() {
    recentList.innerHTML = "";
    const players = listRecentPlayers();

    if (players.length === 0) {
      const empty = document.createElement("div");
      empty.className = "muted";
      empty.textContent = "Aucun pseudo enregistré.";
      recentList.appendChild(empty);
      return;
    }

    for (const p of players) {
      const row = document.createElement("div");
      row.className = "recentRow";

      const left = document.createElement("button");
      left.type = "button";
      left.className = "recentPick";
      left.textContent = `${p.emoji}  ${p.pseudo}`;
      left.addEventListener("click", () => {
        pseudoInput.value = p.pseudo;
        selectedEmoji = p.emoji;
        renderEmoji();
      });

      const del = document.createElement("button");
      del.type = "button";
      del.className = "iconBtn";
      del.setAttribute("aria-label", "Supprimer ce pseudo");
      del.textContent = "🗑️";
      del.addEventListener("click", () => {
        deleteRecentPlayer(p.pseudo);
        renderRecent();
      });

      row.append(left, del);
      recentList.appendChild(row);
    }
  }

  // --- new / selected player
  let selectedEmoji = "😺";

  const pseudoLabelEl = document.createElement("label");
  pseudoLabelEl.textContent = "Pseudo";

  const pseudoInput = document.createElement("input");
  pseudoInput.className = "input";
  pseudoInput.placeholder = "Ex: Léo";
  pseudoInput.maxLength = 20;

  const emojiLabel = document.createElement("div");
  emojiLabel.className = "labelRow";
  emojiLabel.textContent = "Choisis ton emoji";

  const emojiHost = document.createElement("div");
  function renderEmoji() {
    emojiHost.innerHTML = "";
    emojiHost.appendChild(
      EmojiPicker(selectedEmoji, (e) => {
        selectedEmoji = e;
        renderEmoji();
      })
    );
  }

  // --- level
  const levelLabelEl = document.createElement("label");
  levelLabelEl.textContent = "Niveau";

  const levelSelect = document.createElement("select");
  levelSelect.className = "input";

  // 1..6 dans l'ordre, et labels centralisés via game/levelLabels.ts
  for (let lvl = 1 as Level; lvl <= 6; lvl = (lvl + 1) as Level) {
    const opt = document.createElement("option");
    opt.value = String(lvl);
    opt.textContent = getLevelLabel(lvl);
    levelSelect.appendChild(opt);
  }

  levelSelect.value = String(state.level);
  levelSelect.addEventListener("change", () => {
    state.level = Number(levelSelect.value) as Level;
  });

  const actions = document.createElement("div");
  actions.className = "actions";

  const playBtn = Button("Jouer (2 min)", () => {
    const pseudo = pseudoInput.value.trim();
    if (!pseudo) {
      pseudoInput.focus();
      pseudoInput.classList.add("shake");
      setTimeout(() => pseudoInput.classList.remove("shake"), 250);
      return;
    }

    state.player = { pseudo, emoji: selectedEmoji };
    upsertRecentPlayer(pseudo, selectedEmoji);

    go("game");
  }, "primary");

  const scoreBtn = Button("Voir les meilleurs scores", () => go("scores"), "ghost");

  actions.append(playBtn, scoreBtn);

  const card = Card([
    pseudoLabelEl,
    pseudoInput,
    emojiLabel,
    emojiHost,
    levelLabelEl,
    levelSelect,
    actions,
  ]);

  root.append(title, Card([recentTitle, recentList], "subcard"), card);

  renderRecent();
  renderEmoji();

  return root;
}