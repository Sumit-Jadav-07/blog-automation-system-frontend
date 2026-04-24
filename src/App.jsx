/**
 * App.jsx
 *
 * Root shell with animated page transitions and global navigation.
 * Protected routes redirect to /login if not authenticated.
 * Auth pages redirect to / if already authenticated.
 */

import { Routes, Route, useLocation, Navigate } from "react-router-dom";
import { AnimatePresence, motion } from "framer-motion";
import { useAuth } from "./context/AuthContext";
import Navbar from "./components/Navbar";
import DashboardPage from "./pages/DashboardPage";
import LoginPage from "./pages/LoginPage";
import SignupPage from "./pages/SignupPage";
import ForgotPasswordPage from "./pages/ForgotPasswordPage";
import BlogReaderPage from "./pages/BlogReaderPage";

const pageMotion = {
  initial: { opacity: 0, y: 12 },
  animate: { opacity: 1, y: 0 },
  exit: { opacity: 0, y: -12 },
  transition: { duration: 0.25, ease: "easeOut" },
};

function PageShell({ children }) {
  return (
    <motion.div className="page-shell" {...pageMotion}>
      {children}
    </motion.div>
  );
}

/**
 * Inline route guard — redirects to /login if not authenticated.
 */
function ProtectedRoute({ children }) {
  const { isAuthenticated } = useAuth();

  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  return children;
}

export default function App() {
  const location = useLocation();

  return (
    <>
    <Navbar />
    <AnimatePresence mode="wait">
      <Routes>
        <Route path="/login" element={<LoginPage />} />
        <Route path="/signup" element={<SignupPage />} />
        <Route path="/forgot-password" element={<ForgotPasswordPage />} />
      </Routes>
    </AnimatePresence>
    <div className="app-shell">
      <AnimatePresence mode="wait">
        <Routes location={location} key={location.pathname}>
          <Route
            path="/"
            element={
              <ProtectedRoute>
                <PageShell><DashboardPage /></PageShell>
              </ProtectedRoute>
            }
          />
          <Route
            path="/blog/:id"
            element={
              <ProtectedRoute>
                <PageShell><BlogReaderPage /></PageShell>
              </ProtectedRoute>
            }
          />
        </Routes>
      </AnimatePresence>
    </div>
    </>
  );
}
