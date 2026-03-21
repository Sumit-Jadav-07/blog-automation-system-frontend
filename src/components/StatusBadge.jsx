/**
 * StatusBadge.jsx
 *
 * A small colored pill that shows the current status of a blog.
 * It changes color based on the status:
 *   - draft (green)
 *   - generating / publishing (orange)
 *   - published (blue)
 *   - failed (red)
 */

import "./StatusBadge.css";

export default function StatusBadge({ status }) {
  // Normalize the status text — default to "draft" if nothing is provided
  const value = (status || "draft").toLowerCase();
  return <span className={`status-badge status-${value}`}>{value}</span>;
}
