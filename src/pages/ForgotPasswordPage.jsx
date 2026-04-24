import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { Sparkles, Loader2, ArrowLeft, KeyRound, ShieldCheck } from "lucide-react";
import toast from "react-hot-toast";
import { useAuth } from "../context/AuthContext";
import { forgotPassword, resetPassword } from "../api/client";
import "./AuthPages.css";

const FEATURES = [
  "AI-powered blog generation",
  "One-click Medium publishing",
  "SEO-optimized content",
  "Real-time preview & editing",
];

export default function ForgotPasswordPage() {
  const navigate = useNavigate();
  const auth = useAuth();

  // If already logged in, redirect to dashboard
  if (auth.isAuthenticated) {
    navigate("/", { replace: true });
    return null;
  }

  // Step: "email" → "reset"
  const [step, setStep]                   = useState("email");
  const [email, setEmail]                 = useState("");
  const [otp, setOtp]                     = useState("");
  const [newPassword, setNewPassword]     = useState("");
  const [confirmPassword, setConfirm]     = useState("");
  const [loading, setLoading]             = useState(false);

  const passwordsMatch = newPassword === confirmPassword;
  const canSubmitReset =
    otp.length === 6 && newPassword.trim().length >= 8 &&
    confirmPassword.trim() && passwordsMatch;

  // ── Step 1: Request OTP ───────────────────────────────────────
  async function handleRequestOtp(e) {
    e.preventDefault();
    setLoading(true);

    try {
      await forgotPassword(email);
      toast.success("If an account exists, an OTP has been sent to your email.");
      setStep("reset");
    } catch (err) {
      const msg =
        err?.response?.data?.message ||
        err?.message ||
        "Something went wrong.";
      toast.error(msg);
    } finally {
      setLoading(false);
    }
  }

  // ── Step 2: Reset Password ────────────────────────────────────
  async function handleResetPassword(e) {
    e.preventDefault();
    setLoading(true);

    try {
      const response = await resetPassword(email, otp, newPassword);

      if (response.success) {
        toast.success("Password reset successfully! Please log in.");
        navigate("/login", { replace: true });
      } else {
        toast.error(response.message || "Password reset failed.");
      }
    } catch (err) {
      const msg =
        err?.response?.data?.message ||
        err?.message ||
        "Password reset failed.";
      toast.error(msg);
    } finally {
      setLoading(false);
    }
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

        <h2>Reset your<br />password.</h2>
        <p>
          Don't worry, it happens to the best of us.
          We'll get you back in no time.
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
        <AnimatePresence mode="wait">
          {step === "email" ? (
            <motion.div
              key="email-step"
              className="auth-card"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.25 }}
            >
              <Link to="/login" className="back-to-step">
                <ArrowLeft size={16} /> Back to Login
              </Link>

              <div className="otp-icon-wrapper">
                <KeyRound size={32} className="otp-icon" />
              </div>

              <div className="eyebrow">Forgot Password</div>
              <h1 style={{ margin: 0, fontSize: "1.75rem" }}>Reset Password</h1>
              <p className="card-copy">
                Enter your email address and we'll send you a verification code.
              </p>

              <form onSubmit={handleRequestOtp} className="auth-form">
                <label className="field-label" htmlFor="forgot-email">Email Address</label>
                <div className="input-shell">
                  <input
                    id="forgot-email"
                    className="auth-input"
                    type="email"
                    placeholder="you@example.com"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                    disabled={loading}
                  />
                </div>

                <button
                  className="primary-button auth-button"
                  type="submit"
                  disabled={loading || !email.trim()}
                >
                  {loading ? <Loader2 className="spinner" size={18} /> : null}
                  {loading ? "Sending..." : "Send Reset Code"}
                </button>
              </form>

              <p className="auth-switch">
                Remember your password? <Link to="/login">Log in</Link>
              </p>
            </motion.div>
          ) : (
            /* ── Reset Step: OTP + New Password ── */
            <motion.div
              key="reset-step"
              className="auth-card"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.25 }}
            >
              <button
                className="back-to-step"
                type="button"
                onClick={() => setStep("email")}
              >
                <ArrowLeft size={16} /> Back
              </button>

              <div className="otp-icon-wrapper">
                <ShieldCheck size={32} className="otp-icon" />
              </div>

              <div className="eyebrow">Almost Done</div>
              <h1 style={{ margin: 0, fontSize: "1.75rem" }}>New Password</h1>
              <p className="card-copy">
                Enter the code sent to <strong>{email}</strong> and your new password.
              </p>

              <form onSubmit={handleResetPassword} className="auth-form">
                <label className="field-label" htmlFor="reset-otp">Verification Code</label>
                <div className="input-shell">
                  <input
                    id="reset-otp"
                    className="auth-input"
                    type="text"
                    placeholder="000000"
                    value={otp}
                    onChange={(e) => {
                      const val = e.target.value.replace(/\D/g, "").slice(0, 6);
                      setOtp(val);
                    }}
                    maxLength={6}
                    required
                    disabled={loading}
                    autoComplete="one-time-code"
                    inputMode="numeric"
                    style={{ letterSpacing: "0.5em", textAlign: "center", fontSize: "1.25rem", fontWeight: 700 }}
                  />
                </div>

                <label className="field-label" htmlFor="reset-password">New Password</label>
                <div className="input-shell">
                  <input
                    id="reset-password"
                    className="auth-input"
                    type="password"
                    placeholder="At least 8 characters"
                    value={newPassword}
                    onChange={(e) => setNewPassword(e.target.value)}
                    required
                    disabled={loading}
                  />
                </div>

                <label className="field-label" htmlFor="reset-confirm">Confirm New Password</label>
                <div className="input-shell">
                  <input
                    id="reset-confirm"
                    className="auth-input"
                    type="password"
                    placeholder="Type your password again"
                    value={confirmPassword}
                    onChange={(e) => setConfirm(e.target.value)}
                    required
                    disabled={loading}
                  />
                </div>

                {confirmPassword && !passwordsMatch && (
                  <p className="password-mismatch">Passwords don't match</p>
                )}

                <button
                  className="primary-button auth-button"
                  type="submit"
                  disabled={!canSubmitReset || loading}
                >
                  {loading ? <Loader2 className="spinner" size={18} /> : null}
                  {loading ? "Resetting..." : "Reset Password"}
                </button>
              </form>

              <p className="auth-switch">
                Didn't receive the code? Check your spam folder.
              </p>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </main>
  );
}
