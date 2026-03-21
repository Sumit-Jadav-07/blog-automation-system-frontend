/**
 * BlogForm.jsx
 *
 * This is the form where users type a topic and hit "Generate Blog".
 * The AI pipeline then researches, writes, and optimizes a full blog post.
 *
 * Props:
 *   topic        → The current text in the textarea
 *   onTopicChange→ Called when the user types something
 *   onSubmit     → Called when the form is submitted
 *   loading      → True while the AI is generating (disables the button)
 */

import "./BlogForm.css";

export default function BlogForm({ topic, onTopicChange, onSubmit, loading }) {
  return (
    <form className="composer-card slide-up" onSubmit={onSubmit}>
      {/* Small label above the title */}
      <div className="eyebrow">Generate</div>
      <h1>AI Blog Automation Studio</h1>
      <p className="card-copy">
        Enter a topic and let the CrewAI pipeline research, write, optimize, edit, and prepare
        it for Medium.
      </p>

      {/* Topic input — where the magic starts */}
      <label className="field-label" htmlFor="topic">
        Topic
      </label>
      <textarea
        id="topic"
        className="topic-input"
        value={topic}
        onChange={(event) => onTopicChange(event.target.value)}
        placeholder="Example: How AI agents are reshaping startup content operations in 2026"
        rows={4}
      />

      {/* Generate button — disabled while loading or if the topic is empty */}
      <button className="primary-button" type="submit" disabled={loading || !topic.trim()}>
        {loading ? "Generating..." : "Generate Blog"}
      </button>
    </form>
  );
}
