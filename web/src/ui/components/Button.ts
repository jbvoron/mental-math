export function Button(label: string, onClick: () => void, variant: "primary" | "ghost" = "primary"): HTMLButtonElement {
  const btn = document.createElement("button");
  btn.type = "button";
  btn.className = `btn ${variant}`;
  btn.textContent = label;
  btn.addEventListener("click", onClick);
  return btn;
}