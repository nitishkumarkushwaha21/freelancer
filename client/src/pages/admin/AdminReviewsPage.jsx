import { useCallback, useEffect, useRef, useState } from 'react';
import AdminModal from '../../components/admin/AdminModal';
import AdminFieldHint from '../../components/admin/AdminFieldHint';
import ReviewsTable from '../../components/admin/ReviewsTable';
import StarRating from '../../components/ui/StarRating';
import { useAdminFormDraft } from '../../hooks/useAdminFormDraft';
import {
  createReview,
  deleteReview,
  fetchReviews,
  updateReview,
  updateReviewPublished,
} from '../../api/admin';

const PROJECT_TYPES = ['Landing Page', 'Portfolio Site', 'E-commerce', 'Web App', 'Other'];

const emptyReview = {
  name: '',
  role: '',
  rating: 5,
  projectType: 'Landing Page',
  experience: '',
  published: true,
};

function buildReviewFormData(initial) {
  return { ...emptyReview, ...initial };
}

function ReviewAdminForm({ initial, entityId, isNew, onSave, onCancel, saving, onDraftState }) {
  const [form, setForm] = useState(() => buildReviewFormData(initial));

  const { isDirty, clearDraft } = useAdminFormDraft({
    section: 'reviews',
    mode: isNew ? 'new' : 'edit',
    entityId,
    initialData: buildReviewFormData(initial),
    form,
    setForm,
  });

  useEffect(() => {
    onDraftState?.({ isDirty, clearDraft });
  }, [isDirty, clearDraft, onDraftState]);

  const set = (field) => (e) => {
    const value = e.target.type === 'checkbox' ? e.target.checked : e.target.value;
    setForm((prev) => ({ ...prev, [field]: value }));
  };

  return (
    <form
      className="admin-form admin-form-grid"
      onSubmit={(e) => {
        e.preventDefault();
        if (form.rating < 1) return;
        onSave({ ...form, rating: Number(form.rating) });
      }}
    >
      <label>
        Name *
        <input required value={form.name} onChange={set('name')} placeholder="Jane Doe" />
      </label>
      <label>
        Role / company *
        <input required value={form.role} onChange={set('role')} placeholder="Founder, Bakery Co." />
      </label>

      <div className="admin-form-full">
        <span className="admin-form-label">Rating</span>
        <AdminFieldHint>Star count displayed on the public testimonials section.</AdminFieldHint>
        <StarRating
          value={form.rating}
          onChange={(rating) => setForm((prev) => ({ ...prev, rating }))}
          size="sm"
        />
      </div>

      <label className="admin-form-full">
        Project type *
        <AdminFieldHint>Category tag shown on the review card, e.g. Landing Page.</AdminFieldHint>
        <select required value={form.projectType} onChange={set('projectType')}>
          {PROJECT_TYPES.map((type) => (
            <option key={type} value={type}>
              {type}
            </option>
          ))}
        </select>
      </label>

      <label className="admin-form-full">
        Review comment *
        <textarea
          required
          rows={5}
          value={form.experience}
          onChange={set('experience')}
          placeholder="Client feedback…"
        />
      </label>

      <label className="admin-form-check admin-form-full">
        <input type="checkbox" checked={form.published} onChange={set('published')} />
        <span>
          Published on site
          <AdminFieldHint>Hidden reviews are saved but not shown on the public reviews page.</AdminFieldHint>
        </span>
      </label>

      <div className="admin-form-actions admin-form-full">
        <button type="button" className="admin-btn admin-btn-outline" onClick={onCancel}>
          Cancel
        </button>
        <button type="submit" className="admin-btn admin-btn-primary" disabled={saving || form.rating < 1}>
          {saving ? 'Saving…' : 'Save review'}
        </button>
      </div>
    </form>
  );
}

export default function AdminReviewsPage() {
  const [reviews, setReviews] = useState([]);
  const [total, setTotal] = useState(0);
  const [page, setPage] = useState(1);
  const [pages, setPages] = useState(1);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [busyId, setBusyId] = useState(null);
  const [editing, setEditing] = useState(null);
  const [creating, setCreating] = useState(false);
  const [saving, setSaving] = useState(false);
  const [formDirty, setFormDirty] = useState(false);
  const clearDraftRef = useRef(() => {});

  const handleDraftState = useCallback(({ isDirty, clearDraft }) => {
    setFormDirty(isDirty);
    clearDraftRef.current = clearDraft;
  }, []);

  const closeForm = useCallback(() => {
    setCreating(false);
    setEditing(null);
    setFormDirty(false);
  }, []);

  const requestClose = useCallback(() => {
    if (formDirty) {
      const keepDraft = window.confirm(
        'You have unsaved changes. Close this form? Your draft will be kept for this session.',
      );
      if (!keepDraft) return;
    }
    closeForm();
  }, [formDirty, closeForm]);

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

  const handleSave = async (payload) => {
    setSaving(true);
    setError('');

    try {
      if (editing) {
        const data = await updateReview(editing._id, payload);
        setReviews((prev) => prev.map((r) => (r._id === editing._id ? data.review : r)));
      } else {
        await createReview(payload);
        await loadReviews(page);
      }
      setEditing(null);
      setCreating(false);
      clearDraftRef.current();
      setFormDirty(false);
    } catch (err) {
      setError(err.message || 'Failed to save review.');
    } finally {
      setSaving(false);
    }
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
              ? 'No reviews yet'
              : `${total} total · ${pendingCount} hidden on this page`}
          </p>
        </div>
        <div className="admin-header-actions">
          <button type="button" className="admin-btn admin-btn-outline" onClick={() => loadReviews(page)} disabled={loading}>
            Refresh
          </button>
          <button type="button" className="admin-btn admin-btn-primary" onClick={() => setCreating(true)}>
            Add review
          </button>
        </div>
      </div>

      {loading && <p className="admin-muted">Loading reviews…</p>}
      {error && <p className="admin-error">{error}</p>}
      {!loading && (
        <ReviewsTable
          reviews={reviews}
          onEdit={setEditing}
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

      <AdminModal
        title={editing ? 'Edit review' : 'New review'}
        open={creating || Boolean(editing)}
        onClose={requestClose}
        wide
      >
        <ReviewAdminForm
          key={editing?._id || (creating ? 'new' : 'closed')}
          initial={editing || emptyReview}
          entityId={editing?._id}
          isNew={!editing}
          onSave={handleSave}
          onCancel={requestClose}
          saving={saving}
          onDraftState={handleDraftState}
        />
      </AdminModal>
    </div>
  );
}
