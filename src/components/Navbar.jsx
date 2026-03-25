import { useEffect, useState } from "react";
import { NavLink, useLocation } from "react-router-dom";
import { AnimatePresence, motion } from "framer-motion";
import { Menu, Moon, Sparkles, Sun, X } from "lucide-react";
import clsx from "clsx";
import { useTheme } from "../context/ThemeContext";
import "./Navbar.css";

export default function Navbar() {
  const { theme, toggleTheme } = useTheme();
  const [open, setOpen] = useState(false);
  const location = useLocation();

  useEffect(() => {
    setOpen(false);
  }, [location.pathname]);

  const linkClass = ({ isActive }) =>
    clsx("nav-link", isActive && "nav-link-active");

  return (
    <header className="navbar-shell">
      <nav className="navbar glass">
        <NavLink to="/" className="navbar-brand" aria-label="AI Blog Automation Studio">
          <span className="brand-icon">
            <Sparkles size={18} />
          </span>
          <span className="brand-text">AI Blog Studio</span>
        </NavLink>

        <div className="navbar-right">
          <div className="navbar-links">
            <NavLink to="/" end className={linkClass}>
              Dashboard
            </NavLink>
            <NavLink to="/login" className={linkClass}>
              Login
            </NavLink>
            <NavLink to="/signup" className={linkClass}>
              Sign Up
            </NavLink>
          </div>

          <button className="icon-button theme-toggle" onClick={toggleTheme} aria-label="Toggle theme">
            {theme === "dark" ? <Sun size={18} /> : <Moon size={18} />}
          </button>

          <button className="icon-button hamburger" onClick={() => setOpen((p) => !p)} aria-label="Toggle menu">
            {open ? <X size={20} /> : <Menu size={20} />}
          </button>
        </div>
      </nav>

      <AnimatePresence>
        {open && (
          <motion.div
            className="mobile-drawer glass"
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.18 }}
          >
            <div className="mobile-links">
              <NavLink to="/" end className={linkClass}>
                Dashboard
              </NavLink>
              <NavLink to="/login" className={linkClass}>
                Login
              </NavLink>
              <NavLink to="/signup" className={linkClass}>
                Sign Up
              </NavLink>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
}
