import { useCallback, useEffect, useRef, useState } from 'react';
import AdminModal from '../../components/admin/AdminModal';
import AdminFieldHint from '../../components/admin/AdminFieldHint';
import ImageUpload from '../../components/admin/ImageUpload';
import { useAdminFormDraft } from '../../hooks/useAdminFormDraft';
import {
  createTeamMember,
  deleteTeamMember,
  fetchAdminTeam,
  updateTeamMember,
} from '../../api/admin';

const emptyMember = {
  initial: '',
  name: '',
  role: '',
  bio: '',
  color: '#22d3ee',
  imageUrl: '',
  isFounder: false,
  sortOrder: 0,
  published: true,
};

function buildMemberFormData(initial) {
  return { ...emptyMember, ...initial, imageUrl: initial?.imageUrl || '' };
}

function MemberForm({ initial, entityId, isNew, onSave, onCancel, saving, onDraftState }) {
  const [form, setForm] = useState(() => buildMemberFormData(initial));

  const { isDirty, clearDraft } = useAdminFormDraft({
    section: 'team',
    mode: isNew ? 'new' : 'edit',
    entityId,
    initialData: buildMemberFormData(initial),
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
        onSave({ ...form, sortOrder: Number(form.sortOrder) || 0 });
      }}
    >
      <label>
        Name *
        <input required value={form.name} onChange={set('name')} />
      </label>
      <label>
        Initial
        <AdminFieldHint>Single letter shown in the avatar when no photo is uploaded.</AdminFieldHint>
        <input value={form.initial} onChange={set('initial')} />
      </label>
      <label>
        Role *
        <input required value={form.role} onChange={set('role')} />
      </label>
      <label>
        Color
        <AdminFieldHint>Accent color for the avatar circle on team cards (hex code).</AdminFieldHint>
        <input value={form.color} onChange={set('color')} placeholder="#22d3ee" />
      </label>
      <label>
        Image
        <AdminFieldHint>Profile photo on /my-team and team cards.</AdminFieldHint>
        <ImageUpload
          value={form.imageUrl}
          onChange={(url) => setForm((p) => ({ ...p, imageUrl: url }))}
        />
      </label>
      <label>
        Sort order
        <AdminFieldHint>Lower numbers appear first on the team page.</AdminFieldHint>
        <input type="number" value={form.sortOrder} onChange={set('sortOrder')} />
      </label>
      <label className="admin-form-full">
        Bio
        <textarea rows={3} value={form.bio} onChange={set('bio')} />
      </label>
      <label className="admin-form-check">
        <input type="checkbox" checked={form.isFounder} onChange={set('isFounder')} />
        <span>
          Founder (shows on home About)
          <AdminFieldHint>Only founders appear in the home page About section.</AdminFieldHint>
        </span>
      </label>
      <label className="admin-form-check">
        <input type="checkbox" checked={form.published} onChange={set('published')} />
        <span>
          Published
          <AdminFieldHint>Hidden members stay off the public team page.</AdminFieldHint>
        </span>
      </label>
      <div className="admin-form-actions admin-form-full">
        <button type="button" className="admin-btn admin-btn-outline" onClick={onCancel}>Cancel</button>
        <button type="submit" className="admin-btn admin-btn-primary" disabled={saving}>
          {saving ? 'Saving…' : 'Save member'}
        </button>
      </div>
    </form>
  );
}

export default function AdminTeamPage() {
  const [team, setTeam] = useState([]);
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
      const data = await fetchAdminTeam();
      setTeam(data.team);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    document.title = 'Team — BuiltByWho Admin';
    load();
  }, []);

  const handleSave = async (payload) => {
    setSaving(true);
    try {
      if (editing) await updateTeamMember(editing._id, payload);
      else await createTeamMember(payload);
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

  const handleDelete = async (member) => {
    if (!window.confirm(`Delete "${member.name}"?`)) return;
    try {
      await deleteTeamMember(member._id);
      await load();
    } catch (err) {
      setError(err.message);
    }
  };

  return (
    <div className="admin-leads-page">
      <div className="admin-leads-header">
        <div>
          <h1>Team</h1>
          <p className="admin-muted">Manage team members for /my-team and home About section.</p>
        </div>
        <div className="admin-header-actions">
          <button type="button" className="admin-btn admin-btn-outline" onClick={load} disabled={loading}>
            Refresh
          </button>
          <button type="button" className="admin-btn admin-btn-primary" onClick={() => setCreating(true)}>
            Add member
          </button>
        </div>
      </div>

      {loading && <p className="admin-muted">Loading team…</p>}
      {error && <p className="admin-error">{error}</p>}

      {!loading && team.length > 0 && (
        <div className="admin-table-wrap">
          <table className="admin-table">
            <thead>
              <tr>
                <th>Name</th>
                <th>Role</th>
                <th>Founder</th>
                <th>Status</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {team.map((m) => (
                <tr key={m._id}>
                  <td>{m.name}</td>
                  <td>{m.role}</td>
                  <td>{m.isFounder ? 'Yes' : 'No'}</td>
                  <td>
                    <span className={`admin-badge${m.published ? ' admin-badge-live' : ''}`}>
                      {m.published ? 'Live' : 'Hidden'}
                    </span>
                  </td>
                  <td className="admin-cell-actions">
                    <button type="button" className="admin-btn admin-btn-outline admin-btn-sm" onClick={() => setEditing(m)}>
                      Edit
                    </button>
                    <button type="button" className="admin-btn admin-btn-ghost admin-btn-sm" onClick={() => handleDelete(m)}>
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
        title={editing ? 'Edit team member' : 'New team member'}
        open={creating || editing}
        onClose={requestClose}
      >
        <MemberForm
          key={editing?._id || (creating ? 'new' : 'closed')}
          initial={editing || emptyMember}
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
