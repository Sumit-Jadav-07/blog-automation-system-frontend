import { useEffect, useState } from "react";
import { NavLink, useLocation, useNavigate } from "react-router-dom";
import { AnimatePresence, motion } from "framer-motion";
import { Menu, Moon, Sparkles, Sun, X, LogOut, User } from "lucide-react";
import clsx from "clsx";
import { useTheme } from "../context/ThemeContext";
import { useAuth } from "../context/AuthContext";
import ThemeSwitcher from "./ThemeSwitcher";
import "./Navbar.css";

export default function Navbar() {
  const { theme, toggleTheme } = useTheme();
  const { isAuthenticated, user, logout } = useAuth();
  const [open, setOpen] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();

  useEffect(() => {
    setOpen(false);
  }, [location.pathname]);

  const linkClass = ({ isActive }) =>
    clsx("nav-link", isActive && "nav-link-active");

  function handleLogout() {
    logout();
    navigate("/login", { replace: true });
  }

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
            {isAuthenticated ? (
              <>
                <NavLink to="/" end className={linkClass}>
                  Dashboard
                </NavLink>
                <div className="nav-user-info">
                  <User size={15} />
                  <span className="nav-user-name">{user?.fullName?.split(" ")[0] || "User"}</span>
                </div>
                <button className="nav-link logout-btn" onClick={handleLogout}>
                  <LogOut size={15} />
                  <span>Logout</span>
                </button>
              </>
            ) : (
              <>
                <NavLink to="/login" className={linkClass}>
                  Login
                </NavLink>
                <NavLink to="/signup" className={linkClass}>
                  Sign Up
                </NavLink>
              </>
            )}
          </div>

          <button className="icon-button theme-toggle" onClick={toggleTheme} aria-label="Toggle theme">
            {theme === "dark" ? <Sun size={18} /> : <Moon size={18} />}
          </button>

          <button className="icon-button hamburger" onClick={() => setOpen((p) => !p)} aria-label="Toggle menu">
            {open ? <X size={20} /> : <Menu size={20} />}
          </button>

          <ThemeSwitcher />
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
              {isAuthenticated ? (
                <>
                  <NavLink to="/" end className={linkClass}>
                    Dashboard
                  </NavLink>
                  <div className="nav-user-info mobile-user-info">
                    <User size={15} />
                    <span className="nav-user-name">{user?.fullName || "User"}</span>
                  </div>
                  <button className="nav-link logout-btn" onClick={handleLogout}>
                    <LogOut size={15} />
                    <span>Logout</span>
                  </button>
                </>
              ) : (
                <>
                  <NavLink to="/login" className={linkClass}>
                    Login
                  </NavLink>
                  <NavLink to="/signup" className={linkClass}>
                    Sign Up
                  </NavLink>
                </>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
}
