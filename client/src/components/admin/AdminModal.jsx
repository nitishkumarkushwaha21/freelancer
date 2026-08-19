export default function AdminModal({ title, open, onClose, children, wide }) {
  if (!open) return null;

  return (
    <div className="admin-modal-backdrop" onClick={onClose}>
      <div
        className={`admin-modal${wide ? ' admin-modal-wide' : ''}`}
        onClick={(e) => e.stopPropagation()}
      >
        <div className="admin-modal-header">
          <h2>{title}</h2>
          <button type="button" className="admin-btn admin-btn-ghost admin-btn-sm" onClick={onClose}>
            Close
          </button>
        </div>
        <div className="admin-modal-body">{children}</div>
      </div>
    </div>
  );
}
