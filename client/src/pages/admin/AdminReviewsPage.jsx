import { useCallback, useEffect, useState } from 'react';
import ReviewsTable from '../../components/admin/ReviewsTable';
import { deleteReview, fetchReviews, updateReviewPublished } from '../../api/admin';

export default function AdminReviewsPage() {
  const [reviews, setReviews] = useState([]);
  const [total, setTotal] = useState(0);
  const [page, setPage] = useState(1);
  const [pages, setPages] = useState(1);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [busyId, setBusyId] = useState(null);

  const loadReviews = useCallback(async (pageNum) => {
    setLoading(true);
    setError('');

    try {
      const data = await fetchReviews(pageNum);
      setReviews(data.reviews);
      setTotal(data.total);
      setPage(data.page);
      setPages(data.pages);
    } catch (err) {
      setError(err.message || 'Failed to load reviews.');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    document.title = 'Reviews — BuiltByWho Admin';
    loadReviews(1);
  }, [loadReviews]);

  const goToPage = (next) => {
    if (next < 1 || next > pages || next === page) return;
    loadReviews(next);
  };

  const handleTogglePublished = async (review) => {
    setBusyId(review._id);
    setError('');

    try {
      const data = await updateReviewPublished(review._id, !review.published);
      setReviews((prev) => prev.map((r) => (r._id === review._id ? data.review : r)));
    } catch (err) {
      setError(err.message || 'Failed to update review.');
    } finally {
      setBusyId(null);
    }
  };

  const handleDelete = async (review) => {
    if (!window.confirm(`Delete review from ${review.name}?`)) return;

    setBusyId(review._id);
    setError('');

    try {
      await deleteReview(review._id);
      await loadReviews(page);
    } catch (err) {
      setError(err.message || 'Failed to delete review.');
    } finally {
      setBusyId(null);
    }
  };

  const pendingCount = reviews.filter((r) => !r.published).length;

  return (
    <div className="admin-leads-page">
      <div className="admin-leads-header">
        <div>
          <h1>Reviews</h1>
          <p className="admin-muted">
            {total === 0
              ? 'No submissions yet'
              : `${total} total · ${pendingCount} pending on this page`}
          </p>
        </div>
        <button type="button" className="admin-btn admin-btn-outline" onClick={() => loadReviews(page)} disabled={loading}>
          Refresh
        </button>
      </div>

      {loading && <p className="admin-muted">Loading reviews…</p>}
      {error && <p className="admin-error">{error}</p>}
      {!loading && (
        <ReviewsTable
          reviews={reviews}
          onTogglePublished={handleTogglePublished}
          onDelete={handleDelete}
          busyId={busyId}
        />
      )}

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
