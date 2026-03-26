import { useEffect, useRef, useState } from "react";
import { Palette } from "lucide-react";
import { useTheme } from "../context/ThemeContext";

export default function ThemeSwitcher() {
  const { palette, setPalette, theme, PALETTES } = useTheme();
  const [open, setOpen] = useState(false);
  const ref = useRef(null);

  const current = PALETTES.find((p) => p.id === palette) ?? PALETTES[0];
  const colors   = theme === "dark" ? current.dark : current.light;

  // Outside click se band ho
  useEffect(() => {
    if (!open) return;
    const handler = (e) => {
      if (ref.current && !ref.current.contains(e.target)) setOpen(false);
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, [open]);

  return (
    <div ref={ref} style={{ position: "relative" }}>

      {/* ── Trigger — current palette ka gradient ── */}
      <button
        className="icon-button"
        onClick={() => setOpen((o) => !o)}
        aria-label={`Palette: ${current.name}`}
        title={`${current.emoji} ${current.name}`}
        style={{
          background: `linear-gradient(135deg, ${colors.c1}, ${colors.c2})`,
          border: `2px solid ${open ? "var(--accent)" : "var(--line)"}`,
          transition: "border-color 0.2s ease",
          overflow: "hidden",
          padding: 0,
        }}
      >
        {/* Gradient hi indicator hai, icon ki zaroorat nahi */}
      </button>

      {/* ── Dropdown ── */}
      {open && (
        <div
          className="glass fade-in"
          style={{
            position: "absolute",
            right: 0,
            top: "calc(100% + 10px)",
            zIndex: 200,
            padding: "14px",
            width: 196,
            display: "flex",
            flexDirection: "column",
            gap: 10,
          }}
        >
          {/* Header */}
          <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
            <Palette size={13} style={{ color: "var(--muted)" }} />
            <span className="eyebrow" style={{ margin: 0 }}>
              Color Palette
            </span>
          </div>

          {/* Swatches grid — 4 columns */}
          <div
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(4, 1fr)",
              gap: 7,
            }}
          >
            {PALETTES.map((p) => {
              const c      = theme === "dark" ? p.dark : p.light;
              const active = palette === p.id;
              return (
                <button
                  key={p.id}
                  onClick={() => { setPalette(p.id); setOpen(false); }}
                  title={`${p.emoji} ${p.name}`}
                  aria-label={p.name}
                  aria-pressed={active}
                  style={{
                    aspectRatio: "1",
                    border: active
                      ? "2.5px solid var(--text)"
                      : "2.5px solid transparent",
                    outline: active ? "2px solid var(--accent)" : "none",
                    outlineOffset: "2px",
                    borderRadius: "var(--radius-btn)",
                    background: `linear-gradient(135deg, ${c.c1}, ${c.c2})`,
                    cursor: "pointer",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    color: "#fff",
                    fontSize: "0.68rem",
                    fontWeight: 800,
                    textShadow: "0 1px 4px rgba(0,0,0,0.55)",
                    transform: active ? "scale(1.12)" : "scale(1)",
                    transition: "transform 0.15s ease, outline 0.15s ease",
                    padding: 0,
                  }}
                >
                  {active ? "✓" : ""}
                </button>
              );
            })}
          </div>

          {/* Active palette name */}
          <p
            className="muted"
            style={{
              textAlign: "center",
              margin: 0,
              fontSize: "0.75rem",
              fontWeight: 700,
              letterSpacing: "0.02em",
            }}
          >
            {current.emoji} {current.name} · {theme === "dark" ? "Dark" : "Light"}
          </p>
        </div>
      )}
    </div>
  );
}
