import { useState } from "react";
import { Link } from "react-router-dom";
import { marked } from "marked";
import { motion } from "framer-motion";
import { ArrowRight, ExternalLink, Loader2, Trash2 } from "lucide-react";
import StatusBadge from "./StatusBadge";
import "./BlogPreview.css";
import DeleteConfirmModal from "./DeleteConfirmModal";

marked.setOptions({ breaks: false, gfm: true });

export default function BlogPreview({ blog, onDelete, loading }) {
  const [showDeleteModal, setShowDeleteModal] = useState(false);

  if (!blog) {
    return (
      <section className="preview-card glass empty-state">
        <div className="empty-preview">
          <div className="sparkle" />
          <h2>Select a blog</h2>
          <p className="empty-copy">
            Your generated article, metadata, and Medium link will appear here.
          </p>
        </div>
      </section>
    );
  }

  function handleDeleteConfirm() {
    setShowDeleteModal(false);
    onDelete(blog.id);
  }

  const contentIsEmpty = !blog.content;

  return (
    <section className="preview-card glass">
      <div className="preview-header">
        <div>
          <div className="eyebrow">Preview</div>
          <h2>{blog.title || blog.topic}</h2>
          {blog.summary && <p className="preview-summary">{blog.summary}</p>}
        </div>
        <div className="preview-actions">
          <StatusBadge status={blog.status} />
          <Link to={`/blog/${blog.id}`} className="secondary-button preview-read-btn">
            <ExternalLink size={16} /> Read Full
          </Link>
          <button
            className="danger-button-outline"
            type="button"
            onClick={() => setShowDeleteModal(true)}
          >
            <Trash2 size={16} /> Delete
          </button>
        </div>
      </div>

      <div className="meta-grid">
        <div>
          <span className="meta-label">Meta description</span>
          <p>{blog.metaDescription || "Not available yet"}</p>
        </div>
        <div>
          <span className="meta-label">Medium tags</span>
          <div className="tag-row">
            {blog.tags ? (
              blog.tags.split(",").map((tag) => (
                <span key={tag.trim()} className="tag-chip">{tag.trim()}</span>
              ))
            ) : (
              <p className="muted">No tags generated yet.</p>
            )}
          </div>
        </div>
        <div>
          <span className="meta-label">Keywords</span>
          <p>{blog.keywords || "No keywords yet."}</p>
        </div>
        <div>
          <span className="meta-label">Medium URL</span>
          <p>
            {blog.storyUrl ? (
              <a href={blog.storyUrl} target="_blank" rel="noreferrer">
                {blog.storyUrl}
              </a>
            ) : (
              "Not published yet"
            )}
          </p>
        </div>
      </div>

      {loading || contentIsEmpty ? (
        <div className="preview-skeleton">
          <div className="skeleton shimmer" />
          <div className="skeleton shimmer" />
          <div className="skeleton shimmer short" />
          <div className="skeleton shimmer" />
        </div>
      ) : (
        <motion.article
          className="markdown-preview"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.25 }}
          dangerouslySetInnerHTML={{ __html: marked.parse(blog.content || "") }}
        />
      )}

      {blog.storyUrl ? (
        <a className="ghost-link" href={blog.storyUrl} target="_blank" rel="noreferrer">
          Read it on Medium <ArrowRight size={14} />
        </a>
      ) : null}

      {showDeleteModal && (
        <DeleteConfirmModal
          blogTitle={blog.title || blog.topic}
          onConfirm={handleDeleteConfirm}
          onCancel={() => setShowDeleteModal(false)}
        />
      )}

      {loading && (
        <div className="inline-loading">
          <Loader2 className="spinner" size={16} />
          <span>Compiling outline & SEO...</span>
        </div>
      )}
    </section>
  );
}
