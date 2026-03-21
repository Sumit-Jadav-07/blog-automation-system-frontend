/**
 * BlogReaderPage.jsx
 *
 * This is where users read a full blog post — like opening an article on Medium.
 * It shows the title big at the top, then the content as rendered markdown,
 * and at the bottom you can see the meta tags, keywords, and description.
 *
 * There's also a delete button here that opens a GitHub-style confirmation
 * popup before actually deleting anything.
 *
 * The blog ID comes from the URL (e.g. /blog/abc-123), and we fetch the
 * full blog data when the page loads.
 */

import { useEffect, useState } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import { marked } from "marked";
import toast from "react-hot-toast";
import { fetchBlog, deleteBlog } from "../api/client";
import StatusBadge from "../components/StatusBadge";
import DeleteConfirmModal from "../components/DeleteConfirmModal";
import "./BlogReaderPage.css";

// Set up the markdown parser to handle GitHub-style markdown
marked.setOptions({ breaks: false, gfm: true });

export default function BlogReaderPage() {
  // Grab the blog ID from the URL and the navigate function for redirects
  const { id } = useParams();
  const navigate = useNavigate();

  // Blog data, loading state, and delete modal visibility
  const [blog, setBlog] = useState(null);
  const [loading, setLoading] = useState(true);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [deleting, setDeleting] = useState(false);

  // Fetch the blog when the page loads or when the ID changes
  useEffect(() => {
    loadBlog();
  }, [id]);

  async function loadBlog() {
    setLoading(true);
    try {
      const data = await fetchBlog(id);
      setBlog(data);
    } catch (err) {
      toast.error(err?.response?.data?.detail || err?.message || "Could not load blog.");
    } finally {
      setLoading(false);
    }
  }

  // Delete the blog and go back to the dashboard
  async function handleDelete() {
    setDeleting(true);
    const toastId = toast.loading("Deleting blog...");
    try {
      await deleteBlog(id);
      toast.success("Blog deleted", { id: toastId });
      navigate("/"); // Go home after deleting
    } catch (err) {
      toast.error(err?.response?.data?.detail || err?.message || "Failed to delete blog.", { id: toastId });
      setShowDeleteModal(false);
    } finally {
      setDeleting(false);
    }
  }

  // Show a loading skeleton while fetching
  if (loading) {
    return (
      <main className="reader-page">
        <div className="reader-container fade-in">
          <div className="reader-skeleton">
            <div className="skeleton-line skeleton-title" />
            <div className="skeleton-line skeleton-subtitle" />
            <div className="skeleton-line" />
            <div className="skeleton-line" />
            <div className="skeleton-line skeleton-short" />
          </div>
        </div>
      </main>
    );
  }



  // No blog found for this ID
  if (!blog) {
    return (
      <main className="reader-page">
        <div className="reader-container fade-in">
          <p>Blog not found.</p>
          <Link to="/" className="back-link">← Back to Dashboard</Link>
        </div>
      </main>
    );
  }

  return (
    <main className="reader-page">
      <article className="reader-container fade-in">
        {/* Top bar with back link and actions */}
        <div className="reader-top-bar">
          <Link to="/" className="back-link">← Back to Dashboard</Link>
          <div className="reader-top-actions">
            <StatusBadge status={blog.status} />
            <button
              className="danger-button-outline"
              type="button"
              onClick={() => setShowDeleteModal(true)}
            >
              🗑 Delete
            </button>
          </div>
        </div>

        {/* Blog title — big and bold like a proper article */}
        <header className="reader-header slide-up">
          <h1 className="reader-title">{blog.title || blog.topic}</h1>
          {blog.summary && (
            <p className="reader-summary">{blog.summary}</p>
          )}
          <div className="reader-date">
            {new Date(blog.created_at).toLocaleDateString("en-US", {
              year: "numeric",
              month: "long",
              day: "numeric",
            })}
          </div>
        </header>

        {/* Divider line */}
        <hr className="reader-divider" />

        {/* The actual blog content — rendered from markdown */}
        <div
          className="reader-content markdown-preview"
          dangerouslySetInnerHTML={{ __html: marked.parse(blog.content || "") }}
        />

        {/* Divider before meta info */}
        <hr className="reader-divider" />

        {/* Meta information section — tags, keywords, description */}
        <footer className="reader-meta slide-up">
          {/* Tags */}
          {blog.medium_tags?.length > 0 && (
            <div className="reader-meta-section">
              <span className="meta-label">Tags</span>
              <div className="tag-row">
                {blog.medium_tags.map((tag) => (
                  <span key={tag} className="tag-chip">{tag}</span>
                ))}
              </div>
            </div>
          )}

          {/* Keywords */}
          {blog.keywords?.length > 0 && (
            <div className="reader-meta-section">
              <span className="meta-label">Keywords</span>
              <p className="reader-keywords">{blog.keywords.join(", ")}</p>
            </div>
          )}

          {/* Meta description */}
          {blog.meta_description && (
            <div className="reader-meta-section">
              <span className="meta-label">Meta Description</span>
              <p>{blog.meta_description}</p>
            </div>
          )}

          {/* Medium URL if published */}
          {blog.story_url && (
            <div className="reader-meta-section">
              <span className="meta-label">Published on Medium</span>
              <a href={blog.story_url} target="_blank" rel="noreferrer">
                {blog.story_url}
              </a>
            </div>
          )}
        </footer>
      </article>

      {/* GitHub-style delete confirmation modal */}
      {showDeleteModal && (
        <DeleteConfirmModal
          blogTitle={blog.title || blog.topic}
          onConfirm={handleDelete}
          onCancel={() => setShowDeleteModal(false)}
        />
      )}
    </main>
  );
}
