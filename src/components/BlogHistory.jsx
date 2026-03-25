import { AnimatePresence, motion } from "framer-motion";
import { CalendarClock, Inbox } from "lucide-react";
import StatusBadge from "./StatusBadge";
import "./BlogHistory.css";

export default function BlogHistory({ blogs, selectedBlogId, onSelect }) {
  const empty = !blogs || blogs.length === 0;

  return (
    <section className="history-card glass">
      <div className="section-heading">
        <div>
          <div className="eyebrow">History</div>
          <h2>Generated Blogs</h2>
          <p className="card-copy">Tap a card to preview. Newest appears first.</p>
        </div>
        <div className="history-count">
          <CalendarClock size={16} />
          <span>{blogs?.length || 0} saved</span>
        </div>
      </div>

      <div className="history-grid">
        {empty ? (
          <div className="empty-history">
            <div className="empty-icon">
              <Inbox size={22} />
            </div>
            <p className="empty-title">No blogs yet</p>
            <p className="empty-copy">Generate your first idea to see it appear here.</p>
          </div>
        ) : (
          <AnimatePresence>
            {blogs.map((blog, index) => (
              <motion.button
                key={blog.id}
                type="button"
                className={`history-item ${selectedBlogId === blog.id ? "selected" : ""}`}
                onClick={() => onSelect(blog.id)}
                initial={{ opacity: 0, y: 12 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -12 }}
                transition={{ delay: index * 0.05, duration: 0.2 }}
              >
                <div className="history-item-top">
                  <div className="history-title">{blog.title || blog.topic}</div>
                  <StatusBadge status={blog.status} />
                </div>
                <div className="history-topic">{blog.topic}</div>
                <div className="history-meta">
                  <span>{new Date(blog.createdAt).toLocaleDateString()}</span>
                  <span className="history-dot" />
                  <span className="history-subtle">{blog.summary ? "Summary ready" : "Draft"}</span>
                </div>
              </motion.button>
            ))}
          </AnimatePresence>
        )}
      </div>
    </section>
  );
}
