import { motion } from "framer-motion";
import { Loader2, Sparkles } from "lucide-react";
import "./BlogForm.css";;

const PLATFORM_OPTIONS = [
  { value: "DevTo", label: "Dev.to", status: "ready" },
  { value: "Hashnode", label: "Hashnode", status: "coming-soon" },
  { value: "Medium", label: "Medium", status: "coming-soon" },
];

export default function BlogForm({
  topic,
  platform,
  onTopicChange,
  onPlatformChange,
  onSubmit,
  loading,
}) {

  const selectedPlatform = PLATFORM_OPTIONS.find((option) => option.value === platform);
  const isComingSoon = selectedPlatform?.status === "coming-soon";

  return (
    <motion.form
      className="composer-card glass"
      onSubmit={onSubmit}
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.25, ease: "easeOut" }}
    >
      <div className="form-header">
        <span className="eyebrow">AI Generation</span>
        <h1>AI Blog Automation Studio</h1>
        <p className="card-copy">
          Feed a topic and watch the automation pipeline research, draft, and polish a full Plateform-ready article.
        </p>
      </div>

      <div className="floating-field">
        <textarea
          id="topic"
          className="topic-input"
          value={topic}
          onChange={(event) => onTopicChange(event.target.value)}
          placeholder="Example: How AI agents are reshaping startup content operations in 2026"
          rows={4}
        />
        <label htmlFor="topic">Topic</label>
        <div className="field-hint">Use a specific angle; the studio adds outline, SEO, and keywords automatically.</div>
      </div>

      <div className="select-field">
        <label htmlFor="platform">Publishing platform</label>
        <select
          id="platform"
          className="platform-select"
          value={platform}
          onChange={(event) => onPlatformChange(event.target.value)}
        >
          {PLATFORM_OPTIONS.map((option) => (
            <option key={option.value} value={option.value}>
              {option.label} {option.status === "coming-soon" ? "(Not Available)" : ""}
            </option>
          ))}
        </select>
        <div className="field-hint">Choose the platform where this draft should be tailored.</div>
      </div>

      <div className="form-actions">
        {loading ? (
          <div className="typing-indicator" aria-hidden="true">
            <span className="dot" />
            <span className="dot" />
            <span className="dot" />
          </div>
        ) : (
          <div className="field-hint">
            {isComingSoon
              ? <span className="status-info">🚀 Launching soon!!</span>
              : "Autogenerates title, content, and tags."}
          </div>
        )}
        <button className="primary-button" type="submit" disabled={loading || !topic.trim() || isComingSoon}>
          {loading ? <Loader2 className="spinner" size={18} /> : <Sparkles size={18} />}
          {loading ? "Generating" : (isComingSoon ? "Not Available" : "Generate Blog")}
        </button>
      </div>
    </motion.form>
  );
}
