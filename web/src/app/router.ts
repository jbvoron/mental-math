export type ScreenId = "home" | "game" | "scores";
type RenderFn = () => HTMLElement;

const routes = new Map<ScreenId, RenderFn>();
let root: HTMLElement | null = null;

/**
 * Router SPA minimaliste :
 * - pas de rechargement de page
 * - navigation avec history + hash
 */
export function initRouter(rootEl: HTMLElement) {
  root = rootEl;
}

export function register(screen: ScreenId, render: RenderFn) {
  routes.set(screen, render);
}

export function go(screen: ScreenId) {
  if (!root) throw new Error("Router not initialized");
  const render = routes.get(screen);
  if (!render) throw new Error(`Unknown screen: ${screen}`);

  root.innerHTML = "";
  root.appendChild(render());

  history.pushState({ screen }, "", `#${screen}`);
}

window.addEventListener("popstate", (e: PopStateEvent) => {
  if (!root) return;
  const screen = (e.state?.screen ?? "home") as ScreenId;
  const render = routes.get(screen);
  if (!render) return;
  root.innerHTML = "";
  root.appendChild(render());
});