/**
 * LoginPage.jsx
 *
 * This is the login page — it shows a simple email + password form.
 * Right now it doesn't actually authenticate anyone, it's just the
 * visual page so the route exists and looks nice.
 *
 * Users can click "Sign up" to go to the signup page if they don't
 * have an account yet.
 */

import { useState } from "react";
import { Link } from "react-router-dom";
import "./AuthPages.css";

export default function LoginPage() {
  // Keep track of what the user types in the form
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  // When they click "Log In", just prevent the default form submit for now
  function handleSubmit(event) {
    event.preventDefault();
    // TODO: Hook up real authentication later
    alert("Login functionality coming soon!");
  }

  return (
    <main className="auth-page">
      {/* Background glow effects to match our dashboard vibe */}
      <div className="ambient ambient-left" />
      <div className="ambient ambient-right" />

      <div className="auth-card fade-in">
        {/* Small label on top of the card */}
        <div className="eyebrow">Welcome Back</div>
        <h1>Log In</h1>
        <p className="card-copy">
          Sign in to your account to manage and publish your AI-generated blogs.
        </p>

        <form onSubmit={handleSubmit}>
          {/* Email field */}
          <label className="field-label" htmlFor="login-email">
            Email
          </label>
          <input
            id="login-email"
            className="auth-input"
            type="email"
            placeholder="you@example.com"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />

          {/* Password field */}
          <label className="field-label" htmlFor="login-password">
            Password
          </label>
          <input
            id="login-password"
            className="auth-input"
            type="password"
            placeholder="Enter your password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />

          {/* Submit button */}
          <button
            className="primary-button auth-button"
            type="submit"
            disabled={!email.trim() || !password.trim()}
          >
            Log In
          </button>
        </form>

        {/* Link to signup for new users */}
        <p className="auth-switch">
          Don't have an account?{" "}
          <Link to="/signup">Sign up</Link>
        </p>
      </div>
    </main>
  );
}
