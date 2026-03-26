import { useState } from "react";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { Sparkles } from "lucide-react";
import toast from "react-hot-toast";
import "./AuthPages.css";

const FEATURES = [
  "AI-powered blog generation",
  "One-click Medium publishing",
  "SEO-optimized content",
  "Real-time preview & editing",
];

export default function LoginPage() {
  const [email, setEmail]       = useState("");
  const [password, setPassword] = useState("");

  function handleSubmit(e) {
    e.preventDefault();
    toast.success("Login UI only — connect auth when ready.");
  }

  return (
    <main className="auth-page">

      {/* ── Left: Brand Panel ── */}
      <div className="auth-brand">
        <div className="auth-brand-glow" />

        <div className="auth-brand-logo">
          <div className="auth-brand-icon">
            <Sparkles size={20} />
          </div>
          <span className="auth-brand-name">AI Blog Studio</span>
        </div>

        <h2>Write smarter,<br />publish faster.</h2>
        <p>
          Generate Medium-ready blog posts with AI, preview them instantly,
          and publish with a single click.
        </p>

        <div className="auth-features">
          {FEATURES.map((f) => (
            <div key={f} className="auth-feature-item">
              <span className="auth-feature-dot" />
              {f}
            </div>
          ))}
        </div>
      </div>

      {/* ── Right: Form Panel ── */}
      <div className="auth-form-panel">
        <motion.div
          className="auth-card"
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.25 }}
        >
          <div className="eyebrow">Welcome Back</div>
          <h1 style={{ margin: 0, fontSize: "1.75rem" }}>Log In</h1>
          <p className="card-copy">
            Sign in to manage and publish your AI-generated blogs.
          </p>

          <form onSubmit={handleSubmit} className="auth-form">
            <label className="field-label" htmlFor="login-email">Email</label>
            <div className="input-shell">
              <input
                id="login-email"
                className="auth-input"
                type="email"
                placeholder="you@example.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
            </div>

            <label className="field-label" htmlFor="login-password">Password</label>
            <div className="input-shell">
              <input
                id="login-password"
                className="auth-input"
                type="password"
                placeholder="Enter your password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
            </div>

            <button
              className="primary-button auth-button"
              type="submit"
              disabled={!email.trim() || !password.trim()}
            >
              Log In
            </button>
          </form>

          <p className="auth-switch">
            Don't have an account? <Link to="/signup">Sign up</Link>
          </p>
        </motion.div>
      </div>
    </main>
  );
}
