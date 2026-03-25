import { useState } from "react";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import toast from "react-hot-toast";
import "./AuthPages.css";

export default function LoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  function handleSubmit(event) {
    event.preventDefault();
    toast.success("Login UI only – connect auth to your backend when ready.");
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
        <div className="eyebrow">Welcome Back</div>
        <h1>Log In</h1>
        <p className="card-copy">
          Sign in to manage, preview, and publish your AI-generated blogs.
        </p>

        <form onSubmit={handleSubmit} className="auth-form">
          <label className="field-label" htmlFor="login-email">
            Email
          </label>
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

          <label className="field-label" htmlFor="login-password">
            Password
          </label>
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
    </main>
  );
}
