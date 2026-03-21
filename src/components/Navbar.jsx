/**
 * Navbar.jsx
 *
 * This is the top navigation bar that shows on every page.
 * It has the app name on the left and navigation links on the right.
 * The current page link gets highlighted so users always know where they are.
 */

import { NavLink } from "react-router-dom";
import "./Navbar.css";

export default function Navbar() {
  return (
    <nav className="navbar">
      {/* App brand / logo area */}
      <NavLink to="/" className="navbar-brand">
        <span className="navbar-icon">✦</span>
        AI Blog Studio
      </NavLink>

      {/* Navigation links — NavLink automatically adds "active" class */}
      <div className="navbar-links">
        <NavLink to="/" end className="nav-link">
          Dashboard
        </NavLink>
        <NavLink to="/login" className="nav-link">
          Login
        </NavLink>
        <NavLink to="/signup" className="nav-link nav-link-accent">
          Sign Up
        </NavLink>
      </div>
    </nav>
  );
}
