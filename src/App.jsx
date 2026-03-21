/**
 * App.jsx
 *
 * This is the root component of the entire app. It sets up:
 *   - The navigation bar (shows on every page)
 *   - The routes (which page to show based on the URL)
 *
 * Routes:
 *   /        → Dashboard (blog generator + history + preview)
 *   /login   → Login page
 *   /signup  → Signup page
 *   /blog/:id → Full blog reader page
 */

import { Routes, Route } from "react-router-dom";
import Navbar from "./components/Navbar";
import DashboardPage from "./pages/DashboardPage";
import LoginPage from "./pages/LoginPage";
import SignupPage from "./pages/SignupPage";
import BlogReaderPage from "./pages/BlogReaderPage";

export default function App() {
  return (
    <div className="app-shell">
      {/* Navigation bar — always visible at the top */}
      <Navbar />

      {/* Page content — changes based on the current URL */}
      <Routes>
        <Route path="/" element={<DashboardPage />} />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/signup" element={<SignupPage />} />
        <Route path="/blog/:id" element={<BlogReaderPage />} />
      </Routes>
    </div>
  );
}
