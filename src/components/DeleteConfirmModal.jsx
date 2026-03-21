/**
 * DeleteConfirmModal.jsx
 *
 * This is the scary delete confirmation popup — works just like GitHub's
 * repo deletion dialog. The user has to type the exact blog title into
 * an input field before the delete button becomes active.
 *
 * This prevents accidental deletions because you really have to mean it.
 */

import { useState } from "react";
import "./DeleteConfirmModal.css";

export default function DeleteConfirmModal({ blogTitle, onConfirm, onCancel }) {
  // Track what the user types in the confirmation input
  const [typedName, setTypedName] = useState("");

  // Only enable the delete button when the typed text matches the blog title exactly
  const isMatch = typedName === blogTitle;

  return (
    // The dark overlay behind the modal — clicking it cancels the action
    <div className="modal-overlay fade-in" onClick={onCancel}>
      {/* The actual modal box — stop clicks from bubbling to the overlay */}
      <div className="modal-box slide-up" onClick={(e) => e.stopPropagation()}>
        {/* Warning icon and title */}
        <div className="modal-header">
          <span className="modal-warning-icon">⚠</span>
          <h2>Are you sure?</h2>
        </div>

        <p className="modal-description">
          This action <strong>cannot be undone</strong>. This will permanently
          delete the blog post and all its content.
        </p>

        {/* The confirmation instruction */}
        <p className="modal-instruction">
          Please type <strong className="modal-blog-name">{blogTitle}</strong> to
          confirm.
        </p>

        {/* Input where user types the blog title to confirm */}
        <input
          className="modal-input"
          type="text"
          placeholder="Type the blog title here"
          value={typedName}
          onChange={(e) => setTypedName(e.target.value)}
          autoFocus
        />

        {/* Action buttons */}
        <div className="modal-actions">
          <button className="secondary-button" type="button" onClick={onCancel}>
            Cancel
          </button>
          <button
            className="danger-button"
            type="button"
            disabled={!isMatch}
            onClick={onConfirm}
          >
            I understand, delete this blog
          </button>
        </div>
      </div>
    </div>
  );
}
