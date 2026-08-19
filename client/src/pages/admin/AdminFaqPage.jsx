import { useEffect, useState } from 'react';
import AdminModal from '../../components/admin/AdminModal';
import {
  createFaqItem,
  deleteFaqItem,
  fetchAdminFaq,
  updateFaqItem,
} from '../../api/admin';

const emptyFaq = { num: '', question: '', answer: '', sortOrder: 0, published: true };

function FaqForm({ initial, onSave, onCancel, saving }) {
  const [form, setForm] = useState({ ...emptyFaq, ...initial });

  const set = (field) => (e) => {
    const value = e.target.type === 'checkbox' ? e.target.checked : e.target.value;
    setForm((prev) => ({ ...prev, [field]: value }));
  };

  return (
    <form
      className="admin-form"
      onSubmit={(e) => {
        e.preventDefault();
        onSave({ ...form, sortOrder: Number(form.sortOrder) || 0 });
      }}
    >
      <label>
        Number
        <input value={form.num} onChange={set('num')} placeholder="01" />
      </label>
      <label>
        Question *
        <input required value={form.question} onChange={set('question')} />
      </label>
      <label>
        Sort order
        <input type="number" value={form.sortOrder} onChange={set('sortOrder')} />
      </label>
      <label>
        Answer
        <textarea rows={4} value={form.answer} onChange={set('answer')} />
      </label>
      <label className="admin-form-check">
        <input type="checkbox" checked={form.published} onChange={set('published')} />
        Published
      </label>
      <div className="admin-form-actions">
        <button type="button" className="admin-btn admin-btn-outline" onClick={onCancel}>Cancel</button>
        <button type="submit" className="admin-btn admin-btn-primary" disabled={saving}>
          {saving ? 'Saving…' : 'Save FAQ'}
        </button>
      </div>
    </form>
  );
}

export default function AdminFaqPage() {
  const [faq, setFaq] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [editing, setEditing] = useState(null);
  const [creating, setCreating] = useState(false);
  const [saving, setSaving] = useState(false);

  const load = async () => {
    setLoading(true);
    setError('');
    try {
      const data = await fetchAdminFaq();
      setFaq(data.faq);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    document.title = 'FAQ — BuiltByWho Admin';
    load();
  }, []);

  const handleSave = async (payload) => {
    setSaving(true);
    try {
      if (editing) await updateFaqItem(editing._id, payload);
      else await createFaqItem(payload);
      setEditing(null);
      setCreating(false);
      await load();
    } catch (err) {
      setError(err.message);
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (item) => {
    if (!window.confirm(`Delete FAQ "${item.question}"?`)) return;
    try {
      await deleteFaqItem(item._id);
      await load();
    } catch (err) {
      setError(err.message);
    }
  };

  return (
    <div className="admin-leads-page">
      <div className="admin-leads-header">
        <div>
          <h1>FAQ</h1>
          <p className="admin-muted">Home page frequently asked questions.</p>
        </div>
        <div className="admin-header-actions">
          <button type="button" className="admin-btn admin-btn-outline" onClick={load} disabled={loading}>
            Refresh
          </button>
          <button type="button" className="admin-btn admin-btn-primary" onClick={() => setCreating(true)}>
            Add FAQ
          </button>
        </div>
      </div>

      {loading && <p className="admin-muted">Loading FAQ…</p>}
      {error && <p className="admin-error">{error}</p>}

      {!loading && faq.length > 0 && (
        <div className="admin-table-wrap">
          <table className="admin-table">
            <thead>
              <tr>
                <th>#</th>
                <th>Question</th>
                <th>Status</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {faq.map((item) => (
                <tr key={item._id}>
                  <td>{item.num}</td>
                  <td>{item.question}</td>
                  <td>
                    <span className={`admin-badge${item.published ? ' admin-badge-live' : ''}`}>
                      {item.published ? 'Live' : 'Hidden'}
                    </span>
                  </td>
                  <td className="admin-cell-actions">
                    <button type="button" className="admin-btn admin-btn-outline admin-btn-sm" onClick={() => setEditing(item)}>
                      Edit
                    </button>
                    <button type="button" className="admin-btn admin-btn-ghost admin-btn-sm" onClick={() => handleDelete(item)}>
                      Delete
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      <AdminModal
        title={editing ? 'Edit FAQ' : 'New FAQ'}
        open={creating || editing}
        onClose={() => {
          setCreating(false);
          setEditing(null);
        }}
      >
        <FaqForm
          initial={editing || emptyFaq}
          onSave={handleSave}
          onCancel={() => {
            setCreating(false);
            setEditing(null);
          }}
          saving={saving}
        />
      </AdminModal>
    </div>
  );
}
