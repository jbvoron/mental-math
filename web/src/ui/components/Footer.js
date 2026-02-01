export function Footer(): HTMLElement {
  const el = document.createElement("footer");
  el.className = "footer";

  // Petit message sympa, sobre, sans lien pour l’instant
  el.textContent = "Made with ❤️ & ⚡ by ChatGPT + Cloudflare.";

  return el;
}