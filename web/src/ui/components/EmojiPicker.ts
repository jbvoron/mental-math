const EMOJIS = ["😺","🦊","🐼","🐸","🐵","🦄","🐙","🐯","🐶","🐰","🤖","👾","😎","🥳","🤩","😈"];

export function EmojiPicker(selected: string, onPick: (emoji: string) => void): HTMLElement {
  const wrap = document.createElement("div");
  wrap.className = "emojiGrid";

  for (const e of EMOJIS) {
    const b = document.createElement("button");
    b.type = "button";
    b.className = "emojiBtn" + (e === selected ? " selected" : "");
    b.textContent = e;
    b.addEventListener("click", () => onPick(e));
    wrap.appendChild(b);
  }
  return wrap;
}