import { useCallback, useEffect, useState } from 'react';
import LeadsTable from '../../components/admin/LeadsTable';
import { fetchLeads } from '../../api/admin';

export default function AdminLeadsPage() {
  const [leads, setLeads] = useState([]);
  const [total, setTotal] = useState(0);
  const [page, setPage] = useState(1);
  const [pages, setPages] = useState(1);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const loadLeads = useCallback(async (pageNum) => {
    setLoading(true);
    setError('');

    try {
      const data = await fetchLeads(pageNum);
      setLeads(data.leads);
      setTotal(data.total);
      setPage(data.page);
      setPages(data.pages);
    } catch (err) {
      setError(err.message || 'Failed to load inquiries.');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    document.title = 'Inquiries — BuiltByWho Admin';
    loadLeads(1);
  }, [loadLeads]);

  const goToPage = (next) => {
    if (next < 1 || next > pages || next === page) return;
    loadLeads(next);
  };

  return (
    <div className="admin-leads-page">
      <div className="admin-leads-header">
        <div>
          <h1>Inquiries</h1>
          <p className="admin-muted">
            {total === 0 ? 'No submissions yet' : `${total} total submission${total === 1 ? '' : 's'}`}
          </p>
        </div>
        <button type="button" className="admin-btn admin-btn-outline" onClick={() => loadLeads(page)} disabled={loading}>
          Refresh
        </button>
      </div>

      {loading && <p className="admin-muted">Loading inquiries…</p>}
      {error && <p className="admin-error">{error}</p>}
      {!loading && !error && <LeadsTable leads={leads} />}

      {pages > 1 && (
        <div className="admin-pagination">
          <button type="button" className="admin-btn admin-btn-outline" disabled={page <= 1 || loading} onClick={() => goToPage(page - 1)}>
            Previous
          </button>
          <span className="admin-muted">
            Page {page} of {pages}
          </span>
          <button type="button" className="admin-btn admin-btn-outline" disabled={page >= pages || loading} onClick={() => goToPage(page + 1)}>
            Next
          </button>
        </div>
      )}
    </div>
  );
}
