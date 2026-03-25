import { useState } from "react";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import toast from "react-hot-toast";
import "./AuthPages.css";

export default function SignupPage() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  const passwordsMatch = password === confirmPassword;
  const canSubmit =
    name.trim() && email.trim() && password.trim() && confirmPassword.trim() && passwordsMatch;

  function handleSubmit(event) {
    event.preventDefault();
    toast.success("Signup UI only – connect your auth flow when ready.");
  }

  return (
    <main className="auth-page">
      <div className="ambient ambient-left" />
      <div className="ambient ambient-right" />

      <motion.div
        className="auth-card glass"
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.25 }}
      >
        <div className="eyebrow">Get Started</div>
        <h1>Create Account</h1>
        <p className="card-copy">
          Join the AI Blog Automation Studio and start generating amazing blog content.
        </p>

        <form onSubmit={handleSubmit} className="auth-form">
          <label className="field-label" htmlFor="signup-name">
            Full Name
          </label>
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

          <label className="field-label" htmlFor="signup-email">
            Email
          </label>
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

          <label className="field-label" htmlFor="signup-password">
            Password
          </label>
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

          <label className="field-label" htmlFor="signup-confirm">
            Confirm Password
          </label>
          <div className="input-shell">
            <input
              id="signup-confirm"
              className="auth-input"
              type="password"
              placeholder="Type your password again"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
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
    </main>
  );
}
