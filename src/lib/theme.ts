export type Theme = "dark" | "light" | "system";

export const THEME_STORAGE_KEY = "studylens-theme";
const DEFAULT_THEME: Theme = "dark";

let systemQuery: MediaQueryList | null = null;
let systemListener: (() => void) | null = null;

export function resolveTheme(theme: Theme): "dark" | "light" {
  if (theme !== "system") return theme;
  if (typeof window === "undefined") return "dark";
  return window.matchMedia("(prefers-color-scheme: dark)").matches ? "dark" : "light";
}

export function getStoredTheme(): Theme {
  if (typeof window === "undefined") return DEFAULT_THEME;
  const stored = window.localStorage.getItem(THEME_STORAGE_KEY);
  return stored === "dark" || stored === "light" || stored === "system" ? stored : DEFAULT_THEME;
}

export function applyTheme(theme: Theme) {
  if (typeof window === "undefined") return;

  window.localStorage.setItem(THEME_STORAGE_KEY, theme);
  document.documentElement.dataset.theme = resolveTheme(theme);

  if (systemQuery && systemListener) {
    systemQuery.removeEventListener("change", systemListener);
    systemQuery = null;
    systemListener = null;
  }

  if (theme === "system") {
    systemQuery = window.matchMedia("(prefers-color-scheme: dark)");
    systemListener = () => {
      document.documentElement.dataset.theme = resolveTheme("system");
    };
    systemQuery.addEventListener("change", systemListener);
  }
}
