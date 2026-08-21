import { useCallback, useEffect, useRef, useState } from 'react';
import AdminModal from '../../components/admin/AdminModal';
import AdminFieldHint from '../../components/admin/AdminFieldHint';
import { useAdminFormDraft } from '../../hooks/useAdminFormDraft';
import {
  createService,
  deleteService,
  fetchAdminServices,
  updateService,
} from '../../api/admin';

const emptyService = { icon: '▣', title: '', description: '', sortOrder: 0, published: true };

function buildServiceFormData(initial) {
  return { ...emptyService, ...initial };
}

function ServiceForm({ initial, entityId, isNew, onSave, onCancel, saving, onDraftState }) {
  const [form, setForm] = useState(() => buildServiceFormData(initial));

  const { isDirty, clearDraft } = useAdminFormDraft({
    section: 'services',
    mode: isNew ? 'new' : 'edit',
    entityId,
    initialData: buildServiceFormData(initial),
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
      className="admin-form"
      onSubmit={(e) => {
        e.preventDefault();
        onSave({ ...form, sortOrder: Number(form.sortOrder) || 0 });
      }}
    >
      <label>
        Icon
        <AdminFieldHint>Single character or emoji displayed on the service card.</AdminFieldHint>
        <input value={form.icon} onChange={set('icon')} />
      </label>
      <label>
        Title *
        <input required value={form.title} onChange={set('title')} />
      </label>
      <label>
        Sort order
        <AdminFieldHint>Controls display order in the home “What We Build” section.</AdminFieldHint>
        <input type="number" value={form.sortOrder} onChange={set('sortOrder')} />
      </label>
      <label>
        Description
        <textarea rows={3} value={form.description} onChange={set('description')} />
      </label>
      <label className="admin-form-check">
        <input type="checkbox" checked={form.published} onChange={set('published')} />
        <span>
          Published
          <AdminFieldHint>Hidden services are not shown on the home page.</AdminFieldHint>
        </span>
      </label>
      <div className="admin-form-actions">
        <button type="button" className="admin-btn admin-btn-outline" onClick={onCancel}>Cancel</button>
        <button type="submit" className="admin-btn admin-btn-primary" disabled={saving}>
          {saving ? 'Saving…' : 'Save service'}
        </button>
      </div>
    </form>
  );
}

export default function AdminServicesPage() {
  const [services, setServices] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
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

  const load = async () => {
    setLoading(true);
    setError('');
    try {
      const data = await fetchAdminServices();
      setServices(data.services);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    document.title = 'Services — BuiltByWho Admin';
    load();
  }, []);

  const handleSave = async (payload) => {
    setSaving(true);
    try {
      if (editing) await updateService(editing._id, payload);
      else await createService(payload);
      setEditing(null);
      setCreating(false);
      clearDraftRef.current();
      setFormDirty(false);
      await load();
    } catch (err) {
      setError(err.message);
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (service) => {
    if (!window.confirm(`Delete "${service.title}"?`)) return;
    try {
      await deleteService(service._id);
      await load();
    } catch (err) {
      setError(err.message);
    }
  };

  return (
    <div className="admin-leads-page">
      <div className="admin-leads-header">
        <div>
          <h1>Services</h1>
          <p className="admin-muted">Home page “What We Build” cards.</p>
        </div>
        <div className="admin-header-actions">
          <button type="button" className="admin-btn admin-btn-outline" onClick={load} disabled={loading}>
            Refresh
          </button>
          <button type="button" className="admin-btn admin-btn-primary" onClick={() => setCreating(true)}>
            Add service
          </button>
        </div>
      </div>

      {loading && <p className="admin-muted">Loading services…</p>}
      {error && <p className="admin-error">{error}</p>}

      {!loading && services.length > 0 && (
        <div className="admin-table-wrap">
          <table className="admin-table">
            <thead>
              <tr>
                <th>Title</th>
                <th>Status</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {services.map((s) => (
                <tr key={s._id}>
                  <td>{s.title}</td>
                  <td>
                    <span className={`admin-badge${s.published ? ' admin-badge-live' : ''}`}>
                      {s.published ? 'Live' : 'Hidden'}
                    </span>
                  </td>
                  <td className="admin-cell-actions">
                    <button type="button" className="admin-btn admin-btn-outline admin-btn-sm" onClick={() => setEditing(s)}>
                      Edit
                    </button>
                    <button type="button" className="admin-btn admin-btn-ghost admin-btn-sm" onClick={() => handleDelete(s)}>
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
        title={editing ? 'Edit service' : 'New service'}
        open={creating || editing}
        onClose={requestClose}
      >
        <ServiceForm
          key={editing?._id || (creating ? 'new' : 'closed')}
          initial={editing || emptyService}
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
