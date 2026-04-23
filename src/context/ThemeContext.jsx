// import { createContext, useContext, useEffect, useMemo, useState } from "react";

// const ThemeContext = createContext({ theme: "light", toggleTheme: () => {} });

// function getInitialTheme() {
//   if (typeof window === "undefined") return "light";
//   const stored = localStorage.getItem("abs-theme");
//   if (stored === "light" || stored === "dark") return stored;
//   const media = window.matchMedia ? window.matchMedia("(prefers-color-scheme: dark)") : null;
//   return media?.matches ? "dark" : "light";
// }

// export function ThemeProvider({ children }) {
//   const [theme, setTheme] = useState(getInitialTheme);

//   useEffect(() => {
//     const root = document.documentElement;
//     root.dataset.theme = theme;
//     localStorage.setItem("abs-theme", theme);
//   }, [theme]);

//   useEffect(() => {
//     const media = window.matchMedia ? window.matchMedia("(prefers-color-scheme: dark)") : null;
//     if (!media) return undefined;
//     const handler = (event) => {
//       const stored = localStorage.getItem("abs-theme");
//       if (!stored) {
//         setTheme(event.matches ? "dark" : "light");
//       }
//     };
//     media.addEventListener("change", handler);
//     return () => media.removeEventListener("change", handler);
//   }, []);

//   const value = useMemo(
//     () => ({ theme, toggleTheme: () => setTheme((prev) => (prev === "dark" ? "light" : "dark")) }),
//     [theme]
//   );

//   return <ThemeContext.Provider value={value}>{children}</ThemeContext.Provider>;
// }

// export function useTheme() {
//   return useContext(ThemeContext);
// }

import { createContext, useContext, useEffect, useMemo, useState } from "react";

// ── Palette definitions ──────────────────────────────────────────
export const PALETTES = [
  { id: "aurora",   name: "Aurora",   emoji: "🟣",
    light: { c1: "#6366f1", c2: "#22d3ee" },
    dark:  { c1: "#8b5cf6", c2: "#22d3ee" } },
  { id: "ocean",    name: "Ocean",    emoji: "🔵",
    light: { c1: "#0ea5e9", c2: "#06b6d4" },
    dark:  { c1: "#38bdf8", c2: "#22d3ee" } },
  { id: "sunset",   name: "Sunset",   emoji: "🟠",
    light: { c1: "#f97316", c2: "#f43f5e" },
    dark:  { c1: "#fb923c", c2: "#fb7185" } },
  { id: "forest",   name: "Forest",   emoji: "🟢",
    light: { c1: "#10b981", c2: "#84cc16" },
    dark:  { c1: "#34d399", c2: "#a3e635" } },
  { id: "sakura",   name: "Sakura",   emoji: "🌸",
    light: { c1: "#ec4899", c2: "#a855f7" },
    dark:  { c1: "#f472b6", c2: "#c084fc" } },
  { id: "midnight", name: "Midnight", emoji: "🌙",
    light: { c1: "#2563eb", c2: "#d97706" },
    dark:  { c1: "#60a5fa", c2: "#fbbf24" } },
  { id: "crimson",  name: "Crimson",  emoji: "🔴",
    light: { c1: "#ef4444", c2: "#f97316" },
    dark:  { c1: "#f87171", c2: "#fb923c" } },
    { id: "lavender", name: "Lavender", emoji: "🪻",
    light: { c1: "#b78bdb", c2: "#7c3aed" },
    dark:  { c1: "#d8b4fe", c2: "#a78bfa" } },
  { id: "monsoon",  name: "Monsoon",  emoji: "🌧️",
    light: { c1: "#0891b2", c2: "#2dd4bf" },
    dark:  { c1: "#06b6d4", c2: "#2dd4bf" } },
    { id: "ember",   name: "Ember",    emoji: "🔥",
    light: { c1: "#d97706", c2: "#78350f" },
    dark:  { c1: "#fbbf24", c2: "#f59e0b" } },
  { id: "nebula",  name: "Nebula",   emoji: "🌌",
    light: { c1: "#db2777", c2: "#701a75" },
    dark:  { c1: "#f472b6", c2: "#e879f9" } },
  { id: "mint",    name: "Mint",     emoji: "🌱",
    light: { c1: "#10b981", c2: "#064e3b" },
    dark:  { c1: "#34d399", c2: "#10b981" } },
    { id: "obsidian-ice", name: "Obsidian Ice", emoji: "💎",
    light: { c1: "#6366f1", c2: "#4f46e5" },
    dark:  { c1: "#818cf8", c2: "#312e81" } },
];

// ── Helpers ──────────────────────────────────────────────────────
function getInitialTheme() {
  if (typeof window === "undefined") return "light";
  const stored = localStorage.getItem("abs-theme");
  if (stored === "light" || stored === "dark") return stored;
  const media = window.matchMedia?.("(prefers-color-scheme: dark)");
  return media?.matches ? "dark" : "light";
}

function getInitialPalette() {
  if (typeof window === "undefined") return "aurora";
  const stored = localStorage.getItem("abs-palette");
  return PALETTES.some((p) => p.id === stored) ? stored : "aurora";
}

// ── Context ──────────────────────────────────────────────────────
const ThemeContext = createContext({
  theme: "light",
  toggleTheme: () => {},
  palette: "aurora",
  setPalette: () => {},
  PALETTES,
});

// ── Provider ─────────────────────────────────────────────────────
export function ThemeProvider({ children }) {
  const [theme, setTheme]     = useState(getInitialTheme);
  const [palette, setPaletteState] = useState(getInitialPalette);

  // Dark / light — same as before
  useEffect(() => {
    document.documentElement.dataset.theme = theme;
    localStorage.setItem("abs-theme", theme);
  }, [theme]);

  // Palette — naya
  useEffect(() => {
    document.documentElement.dataset.palette = palette;
    localStorage.setItem("abs-palette", palette);
  }, [palette]);

  // System preference listener — same as before
  useEffect(() => {
    const media = window.matchMedia?.("(prefers-color-scheme: dark)");
    if (!media) return;
    const handler = (e) => {
      if (!localStorage.getItem("abs-theme")) {
        setTheme(e.matches ? "dark" : "light");
      }
    };
    media.addEventListener("change", handler);
    return () => media.removeEventListener("change", handler);
  }, []);

  const value = useMemo(
    () => ({
      theme,
      toggleTheme: () => setTheme((prev) => (prev === "dark" ? "light" : "dark")),
      palette,
      setPalette: setPaletteState,
      PALETTES,
    }),
    [theme, palette]
  );

  return <ThemeContext.Provider value={value}>{children}</ThemeContext.Provider>;
}

export function useTheme() {
  return useContext(ThemeContext);
}
