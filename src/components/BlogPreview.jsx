/**
 * BlogPreview.jsx
 *
 * This is the preview panel on the right side of the dashboard.
 * It shows the currently selected blog with its:
 *   - Title and summary
 *   - Meta description, tags, keywords
 *   - The full content rendered from markdown
 *   - Publish button (to push to Medium)
 *   - Delete button (with GitHub-style confirmation)
 *   - "Read Full Blog" link (opens the dedicated reader page)
 *
 * If no blog is selected, it shows a friendly empty state message.
 *
 * Props:
 *   blog       → The blog object to preview (or null)
 *   onPublish  → Called when the "Publish" button is clicked
 *   onDelete   → Called when the delete is confirmed
 *   publishing → True while a publish request is in progress
 */

import { useState } from "react";
import { Link } from "react-router-dom";
import { marked } from "marked";
import StatusBadge from "./StatusBadge";
import "./BlogPreview.css";
import DeleteConfirmModal from "./DeleteConfirmModal";

// Set up the markdown parser
marked.setOptions({ breaks: false, gfm: true });

export default function BlogPreview({ blog, onPublish, onDelete, publishing }) {
  // Track whether the delete confirmation modal is showing
  const [showDeleteModal, setShowDeleteModal] = useState(false);

  // Empty state — no blog selected yet
  if (!blog) {
    return (
      <section className="preview-card empty-state fade-in">
        <div className="eyebrow">Preview</div>
        <h2>Select a blog</h2>
        <p className="empty-copy">
          The latest generated article will appear here with metadata, tags, and a Medium publish
          action.
        </p>
      </section>
    );
  }

  // Handle the delete confirmation
  function handleDeleteConfirm() {
    setShowDeleteModal(false);
    onDelete(blog.id);
  }

  return (
    <section className="preview-card fade-in">
      {/* Header with title, status, and action buttons */}
      <div className="preview-header">
        <div>
          <div className="eyebrow">Preview</div>
          <h2>{blog.title || blog.topic}</h2>
          <p className="preview-summary">{blog.summary}</p>
        </div>
        <div className="preview-actions">
          <StatusBadge status={blog.status} />

          {/* Link to the full blog reader page */}
          <Link to={`/blog/${blog.id}`} className="secondary-button preview-read-btn">
            Read Full Blog
          </Link>

          {/* Publish to Medium button */}
          <button
            className="secondary-button"
            type="button"
            onClick={() => onPublish(blog.id)}
            disabled={publishing || !blog.content || blog.status === "generating"}
          >
            {publishing ? "Publishing..." : "Publish to Medium"}
          </button>

          {/* Delete button — opens the scary confirmation modal */}
          <button
            className="danger-button-outline"
            type="button"
            onClick={() => setShowDeleteModal(true)}
          >
            🗑 Delete
          </button>
        </div>
      </div>

      {/* Meta information grid — description, tags, keywords, URL */}
      <div className="meta-grid">
        <div>
          <span className="meta-label">Meta description</span>
          <p>{blog.meta_description || "Not available yet"}</p>
        </div>
        <div>
          <span className="meta-label">Medium tags</span>
          <div className="tag-row">
            {blog.medium_tags?.length ? (
              blog.medium_tags.map((tag) => (
                <span key={tag} className="tag-chip">{tag}</span>
              ))
            ) : (
              <p>No tags generated yet.</p>
            )}
          </div>
        </div>
        <div>
          <span className="meta-label">Keywords</span>
          <p>{blog.keywords?.join(", ") || "No keywords yet."}</p>
        </div>
        <div>
          <span className="meta-label">Medium URL</span>
          <p>
            {blog.story_url ? (
              <a href={blog.story_url} target="_blank" rel="noreferrer">
                {blog.story_url}
              </a>
            ) : (
              "Not published yet"
            )}
          </p>
        </div>
      </div>

      {/* Error message if something went wrong */}
      {blog.error_message ? <div className="error-banner">{blog.error_message}</div> : null}

      {/* The blog content rendered as HTML from markdown */}
      <article
        className="markdown-preview"
        dangerouslySetInnerHTML={{ __html: marked.parse(blog.content || "") }}
      />

      {/* Delete confirmation modal — only shows when the button is clicked */}
      {showDeleteModal && (
        <DeleteConfirmModal
          blogTitle={blog.title || blog.topic}
          onConfirm={handleDeleteConfirm}
          onCancel={() => setShowDeleteModal(false)}
        />
      )}
    </section>
  );
}
