import { useCallback, useEffect, useRef, useState } from 'react';
import AdminModal from '../../components/admin/AdminModal';
import AdminFieldHint from '../../components/admin/AdminFieldHint';
import PasswordInput from '../../components/admin/PasswordInput';
import { useAdminFormDraft } from '../../hooks/useAdminFormDraft';
import { createUser, fetchUsers, updateUser } from '../../api/admin';

const emptyUser = { email: '', password: '', role: 'user' };

function CreateUserForm({ onSave, onCancel, saving, onDraftState }) {
  const [form, setForm] = useState(emptyUser);

  const { isDirty, clearDraft } = useAdminFormDraft({
    section: 'users',
    mode: 'new',
    initialData: emptyUser,
    form,
    setForm,
    sensitiveFields: ['password'],
  });

  useEffect(() => {
    onDraftState?.({ isDirty, clearDraft });
  }, [isDirty, clearDraft, onDraftState]);

  const set = (field) => (e) => {
    const value = e.target.value;
    setForm((prev) => ({ ...prev, [field]: value }));
  };

  return (
    <form
      className="admin-form"
      onSubmit={(e) => {
        e.preventDefault();
        onSave(form);
      }}
    >
      <label>
        Email *
        <input type="email" required value={form.email} onChange={set('email')} />
      </label>
      <label>
        Password *
        <PasswordInput
          required
          autoComplete="new-password"
          value={form.password}
          onChange={set('password')}
        />
      </label>
      <label>
        Role
        <AdminFieldHint>Admins can access all admin pages. Users have standard access only.</AdminFieldHint>
        <select value={form.role} onChange={set('role')}>
          <option value="user">User</option>
          <option value="admin">Admin</option>
        </select>
      </label>
      <div className="admin-form-actions">
        <button type="button" className="admin-btn admin-btn-outline" onClick={onCancel}>Cancel</button>
        <button type="submit" className="admin-btn admin-btn-primary" disabled={saving}>
          {saving ? 'Creating…' : 'Create user'}
        </button>
      </div>
    </form>
  );
}

export default function AdminUsersPage() {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [creating, setCreating] = useState(false);
  const [saving, setSaving] = useState(false);
  const [busyId, setBusyId] = useState(null);
  const [formDirty, setFormDirty] = useState(false);
  const clearDraftRef = useRef(() => {});

  const handleDraftState = useCallback(({ isDirty, clearDraft }) => {
    setFormDirty(isDirty);
    clearDraftRef.current = clearDraft;
  }, []);

  const closeForm = useCallback(() => {
    setCreating(false);
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
      const data = await fetchUsers();
      setUsers(data.users);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    document.title = 'Users — BuiltByWho Admin';
    load();
  }, []);

  const handleCreate = async (payload) => {
    setSaving(true);
    try {
      await createUser(payload);
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

  const toggleRole = async (user) => {
    setBusyId(user._id);
    setError('');
    try {
      const newRole = user.role === 'admin' ? 'user' : 'admin';
      await updateUser(user._id, { role: newRole });
      await load();
    } catch (err) {
      setError(err.message);
    } finally {
      setBusyId(null);
    }
  };

  const toggleActive = async (user) => {
    setBusyId(user._id);
    setError('');
    try {
      await updateUser(user._id, { isActive: !user.isActive });
      await load();
    } catch (err) {
      setError(err.message);
    } finally {
      setBusyId(null);
    }
  };

  return (
    <div className="admin-leads-page">
      <div className="admin-leads-header">
        <div>
          <h1>Users</h1>
          <p className="admin-muted">Create users and promote them to admin.</p>
        </div>
        <div className="admin-header-actions">
          <button type="button" className="admin-btn admin-btn-outline" onClick={load} disabled={loading}>
            Refresh
          </button>
          <button type="button" className="admin-btn admin-btn-primary" onClick={() => setCreating(true)}>
            Add user
          </button>
        </div>
      </div>

      {loading && <p className="admin-muted">Loading users…</p>}
      {error && <p className="admin-error">{error}</p>}

      {!loading && users.length > 0 && (
        <div className="admin-table-wrap">
          <table className="admin-table">
            <thead>
              <tr>
                <th>Email</th>
                <th>Role</th>
                <th>Status</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {users.map((user) => (
                <tr key={user._id}>
                  <td>{user.email}</td>
                  <td>{user.role}</td>
                  <td>
                    <span className={`admin-badge${user.isActive ? ' admin-badge-live' : ''}`}>
                      {user.isActive ? 'Active' : 'Inactive'}
                    </span>
                  </td>
                  <td className="admin-cell-actions">
                    <button
                      type="button"
                      className="admin-btn admin-btn-outline admin-btn-sm"
                      disabled={busyId === user._id}
                      onClick={() => toggleRole(user)}
                    >
                      {user.role === 'admin' ? 'Demote' : 'Make admin'}
                    </button>
                    <button
                      type="button"
                      className="admin-btn admin-btn-ghost admin-btn-sm"
                      disabled={busyId === user._id}
                      onClick={() => toggleActive(user)}
                    >
                      {user.isActive ? 'Deactivate' : 'Activate'}
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      <AdminModal
        title="New user"
        open={creating}
        onClose={requestClose}
      >
        <CreateUserForm
          key={creating ? 'new' : 'closed'}
          onSave={handleCreate}
          onCancel={requestClose}
          saving={saving}
          onDraftState={handleDraftState}
        />
      </AdminModal>
    </div>
  );
}
