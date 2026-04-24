import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { Sparkles, Loader2 } from "lucide-react";
import toast from "react-hot-toast";
import { useAuth } from "../context/AuthContext";
import { loginUser } from "../api/client";
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
  const [loading, setLoading]   = useState(false);
  const navigate = useNavigate();
  const auth = useAuth();

  // If already logged in, redirect to dashboard
  if (auth.isAuthenticated) {
    navigate("/", { replace: true });
    return null;
  }

  async function handleSubmit(e) {
    e.preventDefault();
    setLoading(true);

    try {
      const response = await loginUser(email, password);
      auth.login(response);
      toast.success(`Welcome back, ${response.fullName}!`);
      navigate("/", { replace: true });
    } catch (err) {
      const msg =
        err?.response?.data?.message ||
        err?.response?.data?.error ||
        err?.message ||
        "Login failed. Please try again.";

      // Check if account is not verified
      if (err?.response?.status === 403 || msg.includes("USER_NOT_VERIFIED") || msg.toLowerCase().includes("verify")) {
        sessionStorage.setItem("signup_email", email);
        sessionStorage.setItem("signup_step", "otp");
        toast.error("A new OTP has been sent. Please verify your email first. Redirecting...");
        setTimeout(() => navigate("/signup"), 1500);
      } else if (msg.includes("INVALID_CREDENTIALS")) {
        toast.error("Invalid email or password.");
      } else {
        toast.error(msg);
      }
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
                disabled={loading}
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
                disabled={loading}
              />
            </div>

            <div className="auth-extras">
              <Link to="/forgot-password" className="forgot-link">
                Forgot Password?
              </Link>
            </div>

            <button
              className="primary-button auth-button"
              type="submit"
              disabled={loading || !email.trim() || !password.trim()}
            >
              {loading ? <Loader2 className="spinner" size={18} /> : null}
              {loading ? "Signing In..." : "Log In"}
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
