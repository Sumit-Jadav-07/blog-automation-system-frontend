import { useEffect, useState, useRef } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import { marked } from "marked";
import toast from "react-hot-toast";
import { motion, AnimatePresence } from "framer-motion";
import {
  ArrowLeft,
  Trash2,
  Calendar,
  Clock,
  ExternalLink,
  Share2,
  Tag,
  AlertCircle,
  FileText,
  Edit3
} from "lucide-react";
import { fetchBlog, deleteBlog } from "../api/client";
import StatusBadge from "../components/StatusBadge";  // Aapka existing component
import DeleteConfirmModal from "../components/DeleteConfirmModal";  // Aapka existing component
import "./BlogReaderPage.css";

// Configure marked
marked.setOptions({
  breaks: true,
  gfm: true,
  headerIds: true,
  mangle: false
});

export default function BlogReaderPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const contentRef = useRef(null);

  const [blog, setBlog] = useState(null);
  const [loading, setLoading] = useState(true);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [deleting, setDeleting] = useState(false);
  const [readingProgress, setReadingProgress] = useState(0);
  const [copied, setCopied] = useState(false);

  // Calculate reading time
  const getReadingTime = (content) => {
    if (!content) return "1 min read";
    const wordsPerMinute = 200;
    const words = content.trim().split(/\s+/).length;
    const minutes = Math.ceil(words / wordsPerMinute);
    return `${minutes} min read`;
  };

  // Handle scroll progress
  useEffect(() => {
    const handleScroll = () => {
      const totalHeight = document.documentElement.scrollHeight - window.innerHeight;
      const progress = (window.scrollY / totalHeight) * 100;
      setReadingProgress(Math.min(100, Math.max(0, progress)));
    };

    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, [blog]);

  useEffect(() => {
    loadBlog();
  }, [id]);

  async function loadBlog() {
    setLoading(true);
    try {
      const data = await fetchBlog(id);
      setBlog(data);
      document.title = `${data.title || data.topic} | Blog Reader`;
    } catch (err) {
      toast.error(err?.response?.data?.detail || "Could not load blog.");
    } finally {
      setLoading(false);
    }
  }

  async function handleDelete() {
    setDeleting(true);
    const toastId = toast.loading("Deleting blog...");
    try {
      await deleteBlog(id);
      toast.success("Blog deleted successfully", { id: toastId });
      navigate("/");
    } catch (err) {
      toast.error(err?.response?.data?.detail || "Failed to delete blog.", { id: toastId });
      setDeleting(false);
      // Modal band nahi karenge error pe, taaki user dobara try kar sake
    }
  }

  const handleShare = async () => {
    try {
      await navigator.clipboard.writeText(window.location.href);
      setCopied(true);
      toast.success("Link copied to clipboard");
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      toast.error("Failed to copy link");
    }
  };

  // Loading state
  if (loading) {
    return (
      <main className="reader-page">
        <div className="skeleton-wrapper">
          <div className="skeleton-main">
            <div className="skeleton-header">
              <div className="skeleton-badge" />
              <div className="skeleton-title" />
              <div className="skeleton-summary" />
            </div>
            <div className="skeleton-line" />
            <div className="skeleton-line" />
            <div className="skeleton-line" />
            <div className="skeleton-line" />
            <div className="skeleton-line" />
          </div>
        </div>
      </main>
    );
  }

  // Empty state
  if (!blog) {
    return (
      <main className="reader-page">
        <div className="reader-wrapper">
          <div className="empty-state">
            <AlertCircle className="empty-state-icon" size={80} />
            <h2>Blog Not Found</h2>
            <p>The blog you're looking for doesn't exist or has been removed.</p>
            <Link to="/" className="action-btn action-btn-primary" style={{ display: "inline-flex", width: "auto", padding: "12px 24px" }}>
              <ArrowLeft size={18} /> Back to Dashboard
            </Link>
          </div>
        </div>
      </main>
    );
  }

  return (
    <main className="reader-page">
      {/* Subtle reading progress */}
      <div className="reading-progress" style={{ width: `${readingProgress}%` }} />

      {/* Top Bar - Non-sticky, sits below your fixed navbar */}
      <div className="reader-top-bar">
        <Link to="/" className="back-link">
          <ArrowLeft size={18} /> Back to Dashboard
        </Link>

        <div className="top-actions">
          <button
            className="icon-btn icon-btn-secondary"
            onClick={handleShare}
          >
            <Share2 size={16} />
            <span className="hide-mobile">{copied ? "Copied!" : "Share"}</span>
          </button>

          <button
            className="icon-btn icon-btn-danger"
            onClick={() => setShowDeleteModal(true)}
            disabled={deleting}
          >
            <Trash2 size={16} />
            <span className="hide-mobile">Delete</span>
          </button>
        </div>
      </div>

      <div className="reader-wrapper">
        {/* Main Content */}
        <motion.article
          className="reader-main"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, ease: [0.25, 0.46, 0.45, 0.94] }}
        >
          <div className="reader-content-padding" ref={contentRef}>
            {/* Header */}
            <header className="reader-header">
              <div className="reader-category">
                <FileText size={14} />
                {blog.status || "Draft"}
              </div>

              <h1 className="reader-title">
                {blog.title || blog.topic}
              </h1>

              {blog.summary && (
                <p className="reader-summary">{blog.summary}</p>
              )}

              <div className="reader-meta-header">
                <span className="reader-meta-item">
                  <Calendar size={14} />
                  {new Date(blog.createdAt).toLocaleDateString("en-US", {
                    year: "numeric",
                    month: "long",
                    day: "numeric",
                  })}
                </span>
                <span className="meta-separator" />
                <span className="reader-meta-item">
                  <Clock size={14} />
                  {getReadingTime(blog.content)}
                </span>
                {blog.updatedAt && blog.updatedAt !== blog.createdAt && (
                  <>
                    <span className="meta-separator" />
                    <span className="reader-meta-item" style={{ opacity: 0.7 }}>
                      Updated {new Date(blog.updatedAt).toLocaleDateString()}
                    </span>
                  </>
                )}
              </div>
            </header>

            {/* Content */}
            <div
              className="reader-content"
              dangerouslySetInnerHTML={{
                __html: marked.parse(blog.content || "")
              }}
            />
          </div>
        </motion.article>

        {/* Sidebar */}
        <aside className="reader-sidebar">
          {/* Quick Actions Card */}
          {/* <motion.div
            className="sidebar-card"
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.1 }}
            style={{ background: "linear-gradient(135deg, var(--reader-panel-strong), var(--reader-panel))" }}
          >
            <div className="sidebar-actions">
              <button
                className="action-btn action-btn-primary"
                onClick={() => navigate(`/edit/${id}`)}
              >
                <Edit3 size={16} /> Edit Blog
              </button>
              <button
                className="action-btn action-btn-secondary"
                onClick={handleShare}
              >
                <Share2 size={16} /> {copied ? "Link Copied!" : "Share Blog"}
              </button>
              <button
                className="action-btn action-btn-danger"
                onClick={() => setShowDeleteModal(true)}
                disabled={deleting}
              >
                <Trash2 size={16} /> Delete Blog
              </button>
            </div>
          </motion.div> */}

          {/* Status Card - Using YOUR StatusBadge component */}
          <motion.div
            className="sidebar-card"
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.2 }}
          >
            <div className="sidebar-header">
              <span className="sidebar-title">
                <FileText size={14} />
                Status
              </span>
              {/* Yeh aapka existing StatusBadge component hai */}
              <StatusBadge status={blog.status} />
            </div>
            <p className="meta-text muted">
              This blog is currently {blog.status?.toLowerCase() || "in draft mode"}.
              {blog.status?.toLowerCase() === "published" && " It's live and visible to readers."}
              {blog.status?.toLowerCase() === "draft" && " Only you can see this draft."}
              {blog.status?.toLowerCase() === "generating" && " Content is being generated."}
            </p>
          </motion.div>

          {/* Tags Card */}
          {blog.tags && (
            <motion.div
              className="sidebar-card"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.3 }}
            >
              <div className="sidebar-title">
                <Tag size={14} />
                Tags
              </div>
              <div className="tag-cloud">
                {blog.tags.split(",").map((tag, index) => (
                  <motion.span
                    key={tag.trim()}
                    className="tag-chip"
                    initial={{ opacity: 0, scale: 0.8 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ delay: 0.3 + (index * 0.05) }}
                    whileHover={{ scale: 1.05 }}
                  >
                    {tag.trim()}
                  </motion.span>
                ))}
              </div>
            </motion.div>
          )}

          {/* Keywords Card */}
          {blog.keywords && (
            <motion.div
              className="sidebar-card"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.4 }}
            >
              <div className="sidebar-title">
                <FileText size={14} />
                Keywords
              </div>
              <p className="meta-text" style={{ fontStyle: "italic", color: "var(--reader-muted)" }}>
                "{blog.keywords}"
              </p>
            </motion.div>
          )}

          {/* Meta Description Card */}
          {blog.metaDescription && (
            <motion.div
              className="sidebar-card"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.5 }}
            >
              <div className="sidebar-title">Meta Description</div>
              <p className="meta-text" style={{ fontSize: "0.8125rem", lineHeight: 1.7 }}>
                {blog.metaDescription}
              </p>
            </motion.div>
          )}

          {/* Medium Link Card */}
          {blog.storyUrl && (
            <motion.div
              className="sidebar-card"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.6 }}
            >
              <div className="sidebar-title">Published On</div>
              <a
                href={blog.storyUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="external-link"
              >
                <ExternalLink size={16} />
                View on Medium
              </a>
            </motion.div>
          )}

          {/* Info Card */}
          <motion.div
            className="sidebar-card"
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.7 }}
            style={{ background: "var(--reader-panel-strong)" }}
          >
            <div className="sidebar-title">
              <Clock size={14} />
              Reading Stats
            </div>
            <div style={{ display: "flex", flexDirection: "column", gap: "12px" }}>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                <span className="meta-text muted">Word Count</span>
                <span className="meta-text" style={{ fontWeight: 600 }}>
                  {(blog.content || "").trim().split(/\s+/).length.toLocaleString()}
                </span>
              </div>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                <span className="meta-text muted">Reading Time</span>
                <span className="meta-text" style={{ fontWeight: 600 }}>
                  {getReadingTime(blog.content)}
                </span>
              </div>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                <span className="meta-text muted">Created</span>
                <span className="meta-text" style={{ fontWeight: 600 }}>
                  {new Date(blog.createdAt).toLocaleDateString()}
                </span>
              </div>
            </div>
          </motion.div>
        </aside>
      </div>

      {/* Delete Modal - Using YOUR DeleteConfirmModal component */}
      <AnimatePresence>
        {showDeleteModal && (
          <DeleteConfirmModal
            blogTitle={blog.title || blog.topic}
            onConfirm={handleDelete}
            onCancel={() => setShowDeleteModal(false)}
          />
        )}
      </AnimatePresence>
    </main>
  );
}
