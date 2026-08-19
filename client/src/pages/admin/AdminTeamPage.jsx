import { useEffect, useState } from 'react';
import AdminModal from '../../components/admin/AdminModal';
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

function MemberForm({ initial, onSave, onCancel, saving }) {
  const [form, setForm] = useState({ ...emptyMember, ...initial, imageUrl: initial?.imageUrl || '' });

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
        <input value={form.initial} onChange={set('initial')} />
      </label>
      <label>
        Role *
        <input required value={form.role} onChange={set('role')} />
      </label>
      <label>
        Color
        <input value={form.color} onChange={set('color')} placeholder="#22d3ee" />
      </label>
      <label>
        Image URL
        <input value={form.imageUrl} onChange={set('imageUrl')} placeholder="https://..." />
      </label>
      <label>
        Sort order
        <input type="number" value={form.sortOrder} onChange={set('sortOrder')} />
      </label>
      <label className="admin-form-full">
        Bio
        <textarea rows={3} value={form.bio} onChange={set('bio')} />
      </label>
      <label className="admin-form-check">
        <input type="checkbox" checked={form.isFounder} onChange={set('isFounder')} />
        Founder (shows on home About)
      </label>
      <label className="admin-form-check">
        <input type="checkbox" checked={form.published} onChange={set('published')} />
        Published
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
        onClose={() => {
          setCreating(false);
          setEditing(null);
        }}
      >
        <MemberForm
          initial={editing || emptyMember}
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
