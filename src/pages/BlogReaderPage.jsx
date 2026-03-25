import { useEffect, useState } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import { marked } from "marked";
import toast from "react-hot-toast";
import { motion } from "framer-motion";
import { ArrowLeft, Trash2 } from "lucide-react";
import { fetchBlog, deleteBlog } from "../api/client";
import StatusBadge from "../components/StatusBadge";
import DeleteConfirmModal from "../components/DeleteConfirmModal";
import "./BlogReaderPage.css";

marked.setOptions({ breaks: false, gfm: true });

export default function BlogReaderPage() {
  const { id } = useParams();
  const navigate = useNavigate();

  const [blog, setBlog] = useState(null);
  const [loading, setLoading] = useState(true);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [deleting, setDeleting] = useState(false);

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

  async function handleDelete() {
    setDeleting(true);
    const toastId = toast.loading("Deleting blog...");
    try {
      await deleteBlog(id);
      toast.success("Blog deleted", { id: toastId });
      navigate("/");
    } catch (err) {
      toast.error(err?.response?.data?.detail || err?.message || "Failed to delete blog.", { id: toastId });
      setShowDeleteModal(false);
    } finally {
      setDeleting(false);
    }
  }

  if (loading) {
    return (
      <main className="reader-page">
        <div className="reader-container glass fade-in">
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

  if (!blog) {
    return (
      <main className="reader-page">
        <div className="reader-container glass fade-in">
          <p>Blog not found.</p>
          <Link to="/" className="back-link">Back to Dashboard</Link>
        </div>
      </main>
    );
  }

  return (
    <main className="reader-page">
      <motion.article
        className="reader-container glass"
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.25 }}
      >
        <div className="reader-top-bar">
          <Link to="/" className="back-link">
            <ArrowLeft size={16} /> Dashboard
          </Link>
          <div className="reader-top-actions">
            <StatusBadge status={blog.status} />
            <button
              className="danger-button-outline"
              type="button"
              onClick={() => setShowDeleteModal(true)}
              disabled={deleting}
            >
              <Trash2 size={16} /> Delete
            </button>
          </div>
        </div>

        <header className="reader-header">
          <h1 className="reader-title">{blog.title || blog.topic}</h1>
          {blog.summary && <p className="reader-summary">{blog.summary}</p>}
          <div className="reader-date">
            {new Date(blog.createdAt).toLocaleDateString("en-US", {
              year: "numeric",
              month: "long",
              day: "numeric",
            })}
          </div>
        </header>

        <hr className="reader-divider" />

        <div
          className="reader-content markdown-preview"
          dangerouslySetInnerHTML={{ __html: marked.parse(blog.content || "") }}
        />

        <hr className="reader-divider" />

        <footer className="reader-meta">
          {blog.tags && (
            <div className="reader-meta-section">
              <span className="meta-label">Tags</span>
              <div className="tag-row">
                {blog.tags.split(",").map((tag) => (
                  <span key={tag.trim()} className="tag-chip">{tag.trim()}</span>
                ))}
              </div>
            </div>
          )}

          {blog.keywords && (
            <div className="reader-meta-section">
              <span className="meta-label">Keywords</span>
              <p className="reader-keywords">{blog.keywords}</p>
            </div>
          )}

          {blog.metaDescription && (
            <div className="reader-meta-section">
              <span className="meta-label">Meta Description</span>
              <p>{blog.metaDescription}</p>
            </div>
          )}

          {blog.storyUrl && (
            <div className="reader-meta-section">
              <span className="meta-label">Published on Medium</span>
              <a href={blog.storyUrl} target="_blank" rel="noreferrer">
                {blog.storyUrl}
              </a>
            </div>
          )}
        </footer>
      </motion.article>

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
