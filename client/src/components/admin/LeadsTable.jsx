import { useState } from 'react';

function formatDate(iso) {
  return new Date(iso).toLocaleString('en-IN', {
    day: 'numeric',
    month: 'short',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  });
}

function LeadRow({ lead }) {
  const [expanded, setExpanded] = useState(false);

  return (
    <>
      <tr className={expanded ? 'admin-row-expanded' : ''}>
        <td className="admin-cell-date">{formatDate(lead.createdAt)}</td>
        <td>{lead.name}</td>
        <td>
          <a href={`mailto:${lead.email}`} className="admin-link">
            {lead.email}
          </a>
        </td>
        <td>{lead.phone || '—'}</td>
        <td>{lead.projectType}</td>
        <td>{lead.budget}</td>
        <td className="admin-cell-message">
          {expanded ? lead.message : `${lead.message.slice(0, 80)}${lead.message.length > 80 ? '…' : ''}`}
        </td>
        <td>
          {lead.message.length > 80 && (
            <button type="button" className="admin-btn admin-btn-ghost admin-btn-sm" onClick={() => setExpanded((v) => !v)}>
              {expanded ? 'Less' : 'More'}
            </button>
          )}
        </td>
      </tr>
    </>
  );
}

export default function LeadsTable({ leads }) {
  if (!leads.length) {
    return (
      <div className="admin-empty">
        <h2>No inquiries yet</h2>
        <p className="admin-muted">Submissions from the contact form will appear here.</p>
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
            <th>Email</th>
            <th>Phone</th>
            <th>Project</th>
            <th>Budget</th>
            <th colSpan={2}>Message</th>
          </tr>
        </thead>
        <tbody>
          {leads.map((lead) => (
            <LeadRow key={lead._id} lead={lead} />
          ))}
        </tbody>
      </table>
    </div>
  );
}
