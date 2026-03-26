import { motion } from "framer-motion";
import { Loader2, Sparkles } from "lucide-react";
import "./BlogForm.css";

export default function BlogForm({ topic, onTopicChange, onSubmit, loading }) {
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

      <div className="form-actions">
        {loading ? (
          <div className="typing-indicator" aria-hidden="true">
            <span className="dot" />
            <span className="dot" />
            <span className="dot" />
          </div>
        ) : (
          <div className="field-hint">Autogenerates outline, keywords, and tags.</div>
        )}
        <button className="primary-button" type="submit" disabled={loading || !topic.trim()}>
          {loading ? <Loader2 className="spinner" size={18} /> : <Sparkles size={18} />}
          {loading ? "Generating" : "Generate Blog"}
        </button>
      </div>
    </motion.form>
  );
}
