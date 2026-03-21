/**
 * BlogHistory.jsx
 *
 * This shows the list of all previously generated blogs in the sidebar.
 * Each blog shows its title, topic, status badge, and creation date.
 *
 * Clicking on a blog selects it and shows it in the preview panel.
 * There's also a "Read" link that takes you to the full blog reader page.
 *
 * Props:
 *   blogs          → Array of blog objects from the server
 *   selectedBlogId → ID of the currently selected blog (gets highlighted)
 *   onSelect       → Called when a blog is clicked
 */

import { Link } from "react-router-dom";
import StatusBadge from "./StatusBadge";
import "./BlogHistory.css";

export default function BlogHistory({ blogs, selectedBlogId, onSelect }) {
  return (
    <section className="history-card slide-up">
      <div className="section-heading">
        <div>
          <div className="eyebrow">History</div>
          <h2>Generated Blogs</h2>
        </div>
      </div>

      {/* Blog list — or a friendly message if there are none yet */}
      <div className="history-list">
        {blogs.length === 0 ? (
          <p className="empty-copy">No blogs yet. Generate your first topic to populate the queue.</p>
        ) : (
          blogs.map((blog, index) => (
            <Link
              to={`/blog/${blog.id}`}
              key={blog.id}
              className={`history-item stagger-item ${selectedBlogId === blog.id ? "selected" : ""}`}
              style={{ animationDelay: `${index * 60}ms`, textDecoration: 'none', display: 'block', color: 'inherit' }}
            >
              <div className="history-main">
                <div className="history-title">{blog.title || blog.topic}</div>
                <div className="history-topic">{blog.topic}</div>
              </div>
              <div className="history-meta">
                <StatusBadge status={blog.status} />
                <span>{new Date(blog.created_at).toLocaleString()}</span>
              </div>
            </Link>
          ))
        )}
      </div>
    </section>
  );
}
