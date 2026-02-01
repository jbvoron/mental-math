export function Footer(): HTMLElement {
  var el = document.createElement("footer");
  el.className = "footer";

  // Ces valeurs sont injectées par Vite au build si présentes
  // Fallback sûr pour tous les navigateurs
  var buildDate =
    typeof (window as any).__BUILD_DATE__ !== "undefined"
      ? (window as any).__BUILD_DATE__
      : "local";

  var gitSha =
    typeof (window as any).__GIT_SHA__ !== "undefined"
      ? (window as any).__GIT_SHA__
      : "local";

  el.textContent =
    "Made with ❤️ & ⚡ by ChatGPT + Cloudflare · v" +
    buildDate +
    "+" +
    gitSha;

  return el;
}