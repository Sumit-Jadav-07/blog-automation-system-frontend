/**
 * App.jsx
 *
 * Root shell with animated page transitions and global navigation.
 * All backend interactions live inside the individual pages; we only
 * wrap them with motion + layout here.
 */

import { Routes, Route, useLocation } from "react-router-dom";
import { AnimatePresence, motion } from "framer-motion";
import Navbar from "./components/Navbar";
import DashboardPage from "./pages/DashboardPage";
import LoginPage from "./pages/LoginPage";
import SignupPage from "./pages/SignupPage";
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

export default function App() {
  const location = useLocation();

  return (
    <>
    <Navbar />
    <AnimatePresence mode="wait">
      <Routes>
        <Route path="/login" element={<LoginPage />} />
        <Route path="/signup" element={<SignupPage />} />
      </Routes>
    </AnimatePresence>
    <div className="app-shell">
      <AnimatePresence mode="wait">
        <Routes location={location} key={location.pathname}>
          <Route path="/" element={<PageShell><DashboardPage /></PageShell>} />
          <Route path="/blog/:id" element={<PageShell><BlogReaderPage /></PageShell>} />
        </Routes>
      </AnimatePresence>
    </div>
    </>
  );
}
