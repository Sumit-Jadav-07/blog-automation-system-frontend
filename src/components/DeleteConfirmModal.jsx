import { useState } from "react";
import { motion } from "framer-motion";
import { ShieldAlert, X } from "lucide-react";
import "./DeleteConfirmModal.css";

export default function DeleteConfirmModal({ blogTitle, onConfirm, onCancel }) {
  const [typedName, setTypedName] = useState("");
  const isMatch = typedName === blogTitle;

  return (
    <div className="modal-overlay" onClick={onCancel}>
      <motion.div
        className="modal-box glass"
        onClick={(e) => e.stopPropagation()}
        initial={{ opacity: 0, scale: 0.96, y: 6 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.96, y: 6 }}
        transition={{ duration: 0.2 }}
      >
        <div className="modal-header">
          <div className="modal-icon">
            <ShieldAlert size={18} />
          </div>
          <div>
            <h2>Delete blog?</h2>
            <p className="modal-description">This action cannot be undone.</p>
          </div>
          <button className="icon-button" onClick={onCancel} aria-label="Close dialog">
            <X size={16} />
          </button>
        </div>

        <p className="modal-instruction">
          Type <strong className="modal-blog-name">{blogTitle}</strong> to confirm.
        </p>

        <input
          className="modal-input"
          type="text"
          placeholder="Type the blog title here"
          value={typedName}
          onChange={(e) => setTypedName(e.target.value)}
          autoFocus
        />

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
            Delete permanently
          </button>
        </div>
      </motion.div>
    </div>
  );
}
