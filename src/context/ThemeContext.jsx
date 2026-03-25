import { createContext, useContext, useEffect, useMemo, useState } from "react";

const ThemeContext = createContext({ theme: "light", toggleTheme: () => {} });

function getInitialTheme() {
  if (typeof window === "undefined") return "light";
  const stored = localStorage.getItem("abs-theme");
  if (stored === "light" || stored === "dark") return stored;
  const media = window.matchMedia ? window.matchMedia("(prefers-color-scheme: dark)") : null;
  return media?.matches ? "dark" : "light";
}

export function ThemeProvider({ children }) {
  const [theme, setTheme] = useState(getInitialTheme);

  useEffect(() => {
    const root = document.documentElement;
    root.dataset.theme = theme;
    localStorage.setItem("abs-theme", theme);
  }, [theme]);

  useEffect(() => {
    const media = window.matchMedia ? window.matchMedia("(prefers-color-scheme: dark)") : null;
    if (!media) return undefined;
    const handler = (event) => {
      const stored = localStorage.getItem("abs-theme");
      if (!stored) {
        setTheme(event.matches ? "dark" : "light");
      }
    };
    media.addEventListener("change", handler);
    return () => media.removeEventListener("change", handler);
  }, []);

  const value = useMemo(
    () => ({ theme, toggleTheme: () => setTheme((prev) => (prev === "dark" ? "light" : "dark")) }),
    [theme]
  );

  return <ThemeContext.Provider value={value}>{children}</ThemeContext.Provider>;
}

export function useTheme() {
  return useContext(ThemeContext);
}
