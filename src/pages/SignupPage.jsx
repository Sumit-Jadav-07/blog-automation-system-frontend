import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { Sparkles, Loader2, ArrowLeft, CheckCircle2 } from "lucide-react";
import toast from "react-hot-toast";
import { useAuth } from "../context/AuthContext";
import { signupUser, verifyOtp } from "../api/client";
import "./AuthPages.css";

const FEATURES = [
  "AI-powered blog generation",
  "One-click Medium publishing",
  "SEO-optimized content",
  "Real-time preview & editing",
];

export default function SignupPage() {
  const navigate = useNavigate();
  const auth = useAuth();

  // If already logged in, redirect to dashboard
  if (auth.isAuthenticated) {
    navigate("/", { replace: true });
    return null;
  }

  // Step: "register" or "otp"
  const [step, setStep]                       = useState(() => sessionStorage.getItem("signup_step") || "register");
  const [name, setName]                       = useState("");
  const [email, setEmail]                     = useState(() => sessionStorage.getItem("signup_email") || "");
  const [password, setPassword]               = useState("");
  const [confirmPassword, setConfirm]         = useState("");
  const [otp, setOtp]                         = useState("");
  const [loading, setLoading]                 = useState(false);

  const passwordsMatch = password === confirmPassword;
  const canSubmitRegister =
    name.trim() && email.trim() &&
    password.trim() && confirmPassword.trim() && passwordsMatch;

  // ── Step 1: Register ──────────────────────────────────────────
  async function handleRegister(e) {
    e.preventDefault();
    setLoading(true);

    try {
      const response = await signupUser(email, password, name);

      if (response.success) {
        toast.success("Account created! Check your email for the OTP.");
        sessionStorage.setItem("signup_email", email);
        sessionStorage.setItem("signup_step", "otp");
        setStep("otp");
      } else {
        toast.error(response.message || "Signup failed.");
      }
    } catch (err) {
      const msg =
        err?.response?.data?.message ||
        err?.message ||
        "Signup failed. Please try again.";
      toast.error(msg);
    } finally {
      setLoading(false);
    }
  }

  // ── Step 2: Verify OTP ────────────────────────────────────────
  async function handleVerifyOtp(e) {
    e.preventDefault();
    setLoading(true);

    try {
      const response = await verifyOtp(email, otp);

      if (response.success) {
        toast.success("Email verified! You can now log in.");
        sessionStorage.removeItem("signup_email");
        sessionStorage.removeItem("signup_step");
        navigate("/login", { replace: true });
      } else {
        const errorMsg = response.message === "OTP_EXPIRED" 
          ? "Your OTP has expired or is invalid. Please request a new one." 
          : (response.message || "OTP verification failed.");
        toast.error(errorMsg);
      }
    } catch (err) {
      const msg =
        err?.response?.data?.message ||
        err?.message ||
        "OTP verification failed.";
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
        <AnimatePresence mode="wait">
          {step === "register" ? (
            <motion.div
              key="register"
              className="auth-card"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.25 }}
            >
              <div className="eyebrow">Get Started</div>
              <h1 style={{ margin: 0, fontSize: "1.75rem" }}>Create Account</h1>
              <p className="card-copy">
                Start generating amazing blog content today.
              </p>

              <form onSubmit={handleRegister} className="auth-form">
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
                    disabled={loading}
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
                    disabled={loading}
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
                    disabled={loading}
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
                    disabled={loading}
                  />
                </div>

                {confirmPassword && !passwordsMatch && (
                  <p className="password-mismatch">Passwords don't match</p>
                )}

                <button
                  className="primary-button auth-button"
                  type="submit"
                  disabled={!canSubmitRegister || loading}
                >
                  {loading ? <Loader2 className="spinner" size={18} /> : null}
                  {loading ? "Creating Account..." : "Create Account"}
                </button>
              </form>

              <p className="auth-switch">
                Already have an account? <Link to="/login">Log in</Link>
              </p>
            </motion.div>
          ) : (
            /* ── OTP Verification Step ── */
            <motion.div
              key="otp"
              className="auth-card"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.25 }}
            >
              <button
                className="back-to-step"
                type="button"
                onClick={() => setStep("register")}
              >
                <ArrowLeft size={16} /> Back
              </button>

              <div className="otp-icon-wrapper">
                <CheckCircle2 size={32} className="otp-icon" />
              </div>

              <div className="eyebrow">Verify Email</div>
              <h1 style={{ margin: 0, fontSize: "1.75rem" }}>Enter OTP</h1>
              <p className="card-copy">
                We've sent a 6-digit verification code to <strong>{email}</strong>.
                Please enter it below.
              </p>

              <form onSubmit={handleVerifyOtp} className="auth-form">
                <label className="field-label" htmlFor="otp-input">Verification Code</label>
                <div className="input-shell">
                  <input
                    id="otp-input"
                    className="auth-input otp-input"
                    type="text"
                    placeholder="000000"
                    value={otp}
                    onChange={(e) => {
                      // Only allow digits, max 6
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

                <button
                  className="primary-button auth-button"
                  type="submit"
                  disabled={otp.length !== 6 || loading}
                >
                  {loading ? <Loader2 className="spinner" size={18} /> : null}
                  {loading ? "Verifying..." : "Verify Email"}
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
