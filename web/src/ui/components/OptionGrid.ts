export function OptionGrid(
  options: number[],
  onSelect: (value: number) => void
): HTMLElement {
  const grid = document.createElement("div");
  grid.className = "optionGrid";

  for (const value of options) {
    const btn = document.createElement("button");
    btn.type = "button";
    btn.className = "optionBtn";
    btn.textContent = String(value);
    btn.dataset.value = String(value);

    grid.appendChild(btn);
  }

  // Un seul handler pour toute la grille
  grid.addEventListener("click", (e) => {
    const target = e.target as HTMLElement;
    if (!(target instanceof HTMLButtonElement)) return;

    const raw = target.dataset.value;
    if (!raw) return;

    onSelect(Number(raw));
  });

  return grid;
}