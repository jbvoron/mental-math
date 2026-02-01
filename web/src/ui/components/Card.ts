export function Card(children: HTMLElement[], className = ""): HTMLElement {
  const el = document.createElement("div");
  el.className = `card ${className}`.trim();
  children.forEach(c => el.appendChild(c));
  return el;
}