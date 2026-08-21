import { useState } from 'react';
import StarRating from '../ui/StarRating';

function formatDate(iso) {
  return new Date(iso).toLocaleString('en-IN', {
    day: 'numeric',
    month: 'short',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  });
}

function ReviewRow({ review, onEdit, onTogglePublished, onDelete, busy }) {
  const [expanded, setExpanded] = useState(false);
  const text = review.experience;
  const truncated = text.length > 100 ? `${text.slice(0, 100)}…` : text;

  return (
    <tr className={expanded ? 'admin-row-expanded' : ''}>
      <td className="admin-cell-date">{formatDate(review.createdAt)}</td>
      <td>{review.name}</td>
      <td>{review.role}</td>
      <td>
        <StarRating value={review.rating} size="sm" />
      </td>
      <td>{review.projectType}</td>
      <td>
        <span className={`admin-badge${review.published ? ' admin-badge-live' : ''}`}>
          {review.published ? 'Live' : 'Hidden'}
        </span>
      </td>
      <td className="admin-cell-message">{expanded ? text : truncated}</td>
      <td className="admin-cell-actions">
        {text.length > 100 && (
          <button type="button" className="admin-btn admin-btn-ghost admin-btn-sm" onClick={() => setExpanded((v) => !v)}>
            {expanded ? 'Less' : 'More'}
          </button>
        )}
        <button
          type="button"
          className="admin-btn admin-btn-outline admin-btn-sm"
          disabled={busy}
          onClick={() => onEdit(review)}
        >
          Edit
        </button>
        <button
          type="button"
          className="admin-btn admin-btn-outline admin-btn-sm"
          disabled={busy}
          onClick={() => onTogglePublished(review)}
        >
          {review.published ? 'Unpublish' : 'Publish'}
        </button>
        <button
          type="button"
          className="admin-btn admin-btn-ghost admin-btn-sm"
          disabled={busy}
          onClick={() => onDelete(review)}
        >
          Delete
        </button>
      </td>
    </tr>
  );
}

export default function ReviewsTable({ reviews, onEdit, onTogglePublished, onDelete, busyId }) {
  if (!reviews.length) {
    return (
      <div className="admin-empty">
        <h2>No reviews yet</h2>
        <p className="admin-muted">User submissions from /reviews appear here automatically. You can edit, hide, or delete any review.</p>
      </div>
    );
  }

  return (
    <div className="admin-table-wrap">
      <table className="admin-table">
        <thead>
          <tr>
            <th>Date</th>
            <th>Name</th>
            <th>Role</th>
            <th>Stars</th>
            <th>Project</th>
            <th>Status</th>
            <th>Experience</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {reviews.map((review) => (
            <ReviewRow
              key={review._id}
              review={review}
              onEdit={onEdit}
              onTogglePublished={onTogglePublished}
              onDelete={onDelete}
              busy={busyId === review._id}
            />
          ))}
        </tbody>
      </table>
    </div>
  );
}
