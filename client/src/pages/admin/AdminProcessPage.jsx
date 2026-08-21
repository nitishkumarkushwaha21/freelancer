import { useCallback, useEffect, useRef, useState } from 'react';
import AdminModal from '../../components/admin/AdminModal';
import AdminFieldHint from '../../components/admin/AdminFieldHint';
import { useAdminFormDraft } from '../../hooks/useAdminFormDraft';
import {
  createProcessStep,
  deleteProcessStep,
  fetchAdminProcess,
  updateProcessStep,
} from '../../api/admin';

const emptyStep = { num: '', title: '', description: '', sortOrder: 0 };

function buildStepFormData(initial) {
  return { ...emptyStep, ...initial };
}

function StepForm({ initial, entityId, isNew, onSave, onCancel, saving, onDraftState }) {
  const [form, setForm] = useState(() => buildStepFormData(initial));

  const { isDirty, clearDraft } = useAdminFormDraft({
    section: 'process',
    mode: isNew ? 'new' : 'edit',
    entityId,
    initialData: buildStepFormData(initial),
    form,
    setForm,
  });

  useEffect(() => {
    onDraftState?.({ isDirty, clearDraft });
  }, [isDirty, clearDraft, onDraftState]);

  const set = (field) => (e) => setForm((prev) => ({ ...prev, [field]: e.target.value }));

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
        <AdminFieldHint>Step label shown on the card, e.g. 01, 02, 03.</AdminFieldHint>
        <input value={form.num} onChange={set('num')} placeholder="01" />
      </label>
      <label>
        Title *
        <input required value={form.title} onChange={set('title')} />
      </label>
      <label>
        Sort order
        <AdminFieldHint>Order of steps in the home “How It Works” section.</AdminFieldHint>
        <input type="number" value={form.sortOrder} onChange={set('sortOrder')} />
      </label>
      <label>
        Description
        <textarea rows={3} value={form.description} onChange={set('description')} />
      </label>
      <div className="admin-form-actions">
        <button type="button" className="admin-btn admin-btn-outline" onClick={onCancel}>Cancel</button>
        <button type="submit" className="admin-btn admin-btn-primary" disabled={saving}>
          {saving ? 'Saving…' : 'Save step'}
        </button>
      </div>
    </form>
  );
}

export default function AdminProcessPage() {
  const [steps, setSteps] = useState([]);
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
      const data = await fetchAdminProcess();
      setSteps(data.process);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    document.title = 'Process — BuiltByWho Admin';
    load();
  }, []);

  const handleSave = async (payload) => {
    setSaving(true);
    try {
      if (editing) await updateProcessStep(editing._id, payload);
      else await createProcessStep(payload);
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

  const handleDelete = async (step) => {
    if (!window.confirm(`Delete step "${step.title}"?`)) return;
    try {
      await deleteProcessStep(step._id);
      await load();
    } catch (err) {
      setError(err.message);
    }
  };

  return (
    <div className="admin-leads-page">
      <div className="admin-leads-header">
        <div>
          <h1>Process</h1>
          <p className="admin-muted">Home page “How It Works” steps.</p>
        </div>
        <div className="admin-header-actions">
          <button type="button" className="admin-btn admin-btn-outline" onClick={load} disabled={loading}>
            Refresh
          </button>
          <button type="button" className="admin-btn admin-btn-primary" onClick={() => setCreating(true)}>
            Add step
          </button>
        </div>
      </div>

      {loading && <p className="admin-muted">Loading process…</p>}
      {error && <p className="admin-error">{error}</p>}

      {!loading && steps.length > 0 && (
        <div className="admin-table-wrap">
          <table className="admin-table">
            <thead>
              <tr>
                <th>#</th>
                <th>Title</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {steps.map((s) => (
                <tr key={s._id}>
                  <td>{s.num}</td>
                  <td>{s.title}</td>
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
        title={editing ? 'Edit process step' : 'New process step'}
        open={creating || editing}
        onClose={requestClose}
      >
        <StepForm
          key={editing?._id || (creating ? 'new' : 'closed')}
          initial={editing || emptyStep}
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
