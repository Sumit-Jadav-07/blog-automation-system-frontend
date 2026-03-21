/**
 * SignupPage.jsx
 *
 * This is the signup page — it has a form with name, email, password,
 * and confirm password fields. Like the login page, it's visual only
 * for now (no real account creation happens).
 *
 * Users can click "Log in" to go back to the login page if they
 * already have an account.
 */

import { useState } from "react";
import { Link } from "react-router-dom";
import "./AuthPages.css";

export default function SignupPage() {
  // Track all the signup form fields
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  // Simple check — do the two passwords match?
  const passwordsMatch = password === confirmPassword;

  // Can we submit? All fields filled and passwords match
  const canSubmit =
    name.trim() && email.trim() && password.trim() && confirmPassword.trim() && passwordsMatch;

  function handleSubmit(event) {
    event.preventDefault();
    // TODO: Hook up real signup later
    alert("Signup functionality coming soon!");
  }

  return (
    <main className="auth-page">
      {/* Background glow effects */}
      <div className="ambient ambient-left" />
      <div className="ambient ambient-right" />

      <div className="auth-card fade-in">
        <div className="eyebrow">Get Started</div>
        <h1>Create Account</h1>
        <p className="card-copy">
          Join the AI Blog Automation Studio and start generating amazing blog content.
        </p>

        <form onSubmit={handleSubmit}>
          {/* Full name */}
          <label className="field-label" htmlFor="signup-name">
            Full Name
          </label>
          <input
            id="signup-name"
            className="auth-input"
            type="text"
            placeholder="John Doe"
            value={name}
            onChange={(e) => setName(e.target.value)}
            required
          />

          {/* Email */}
          <label className="field-label" htmlFor="signup-email">
            Email
          </label>
          <input
            id="signup-email"
            className="auth-input"
            type="email"
            placeholder="you@example.com"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />

          {/* Password */}
          <label className="field-label" htmlFor="signup-password">
            Password
          </label>
          <input
            id="signup-password"
            className="auth-input"
            type="password"
            placeholder="At least 8 characters"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />

          {/* Confirm password */}
          <label className="field-label" htmlFor="signup-confirm">
            Confirm Password
          </label>
          <input
            id="signup-confirm"
            className="auth-input"
            type="password"
            placeholder="Type your password again"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            required
          />

          {/* Show a little warning if passwords don't match */}
          {confirmPassword && !passwordsMatch && (
            <p className="password-mismatch">Passwords don't match</p>
          )}

          {/* Submit button */}
          <button
            className="primary-button auth-button"
            type="submit"
            disabled={!canSubmit}
          >
            Create Account
          </button>
        </form>

        {/* Link to login for existing users */}
        <p className="auth-switch">
          Already have an account?{" "}
          <Link to="/login">Log in</Link>
        </p>
      </div>
    </main>
  );
}
