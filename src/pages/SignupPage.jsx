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

export default function SignupPage() {
  const [name, setName]                     = useState("");
  const [email, setEmail]                   = useState("");
  const [password, setPassword]             = useState("");
  const [confirmPassword, setConfirm]       = useState("");

  const passwordsMatch = password === confirmPassword;
  const canSubmit =
    name.trim() && email.trim() &&
    password.trim() && confirmPassword.trim() && passwordsMatch;

  function handleSubmit(e) {
    e.preventDefault();
    toast.success("Signup UI only — connect auth when ready.");
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

        <h2>Your AI writing<br />studio awaits.</h2>
        <p>
          Join thousands of creators using AI to research, write,
          and publish high-quality blog content at scale.
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
          <div className="eyebrow">Get Started</div>
          <h1 style={{ margin: 0, fontSize: "1.75rem" }}>Create Account</h1>
          <p className="card-copy">
            Start generating amazing blog content today.
          </p>

          <form onSubmit={handleSubmit} className="auth-form">
            <label className="field-label" htmlFor="signup-name">Full Name</label>
            <div className="input-shell">
              <input
                id="signup-name"
                className="auth-input"
                type="text"
                placeholder="John Doe"
                value={name}
                onChange={(e) => setName(e.target.value)}
                required
              />
            </div>

            <label className="field-label" htmlFor="signup-email">Email</label>
            <div className="input-shell">
              <input
                id="signup-email"
                className="auth-input"
                type="email"
                placeholder="you@example.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
            </div>

            <label className="field-label" htmlFor="signup-password">Password</label>
            <div className="input-shell">
              <input
                id="signup-password"
                className="auth-input"
                type="password"
                placeholder="At least 8 characters"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
            </div>

            <label className="field-label" htmlFor="signup-confirm">Confirm Password</label>
            <div className="input-shell">
              <input
                id="signup-confirm"
                className="auth-input"
                type="password"
                placeholder="Type your password again"
                value={confirmPassword}
                onChange={(e) => setConfirm(e.target.value)}
                required
              />
            </div>

            {confirmPassword && !passwordsMatch && (
              <p className="password-mismatch">Passwords don't match</p>
            )}

            <button
              className="primary-button auth-button"
              type="submit"
              disabled={!canSubmit}
            >
              Create Account
            </button>
          </form>

          <p className="auth-switch">
            Already have an account? <Link to="/login">Log in</Link>
          </p>
        </motion.div>
      </div>
    </main>
  );
}
