import { useEffect, useState } from 'react';
import AdminModal from '../../components/admin/AdminModal';
import {
  createProject,
  deleteProject,
  fetchAdminProjects,
  updateProject,
} from '../../api/admin';

const emptyProject = {
  slug: '',
  title: '',
  tag: '',
  category: 'landing',
  description: '',
  featured: false,
  published: true,
  timeline: '',
  stack: [],
  problem: '',
  solution: '',
  results: [],
  liveUrl: '',
  imageUrl: '',
  sortOrder: 0,
};

function ProjectForm({ initial, onSave, onCancel, saving }) {
  const [form, setForm] = useState({
    ...emptyProject,
    ...initial,
    stack: initial?.stack ?? [],
    results: initial?.results ?? [],
    liveUrl: initial?.liveUrl || '',
    imageUrl: initial?.imageUrl || '',
  });

  const set = (field) => (e) => {
    const value = e.target.type === 'checkbox' ? e.target.checked : e.target.value;
    setForm((prev) => ({ ...prev, [field]: value }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const payload = {
      ...form,
      stack: String(form.stackText || form.stack.join(', '))
        .split(',')
        .map((s) => s.trim())
        .filter(Boolean),
      results: String(form.resultsText || form.results.join('\n'))
        .split('\n')
        .map((s) => s.trim())
        .filter(Boolean),
      liveUrl: form.liveUrl?.trim() || null,
      imageUrl: form.imageUrl?.trim() || '',
      sortOrder: Number(form.sortOrder) || 0,
    };
    delete payload.stackText;
    delete payload.resultsText;
    onSave(payload);
  };

  return (
    <form className="admin-form admin-form-grid" onSubmit={handleSubmit}>
      <label>
        Title *
        <input required value={form.title} onChange={set('title')} />
      </label>
      <label>
        Slug
        <input value={form.slug} onChange={set('slug')} placeholder="auto-generated from title" />
      </label>
      <label>
        Tag
        <input value={form.tag} onChange={set('tag')} />
      </label>
      <label>
        Category
        <select value={form.category} onChange={set('category')}>
          <option value="landing">Landing</option>
          <option value="ecommerce">E-commerce</option>
          <option value="portfolio">Portfolio</option>
          <option value="webapp">Web App</option>
        </select>
      </label>
      <label className="admin-form-full">
        Description
        <input value={form.description} onChange={set('description')} />
      </label>
      <label>
        Timeline
        <input value={form.timeline} onChange={set('timeline')} />
      </label>
      <label>
        Sort order
        <input type="number" value={form.sortOrder} onChange={set('sortOrder')} />
      </label>
      <label>
        Live URL
        <input value={form.liveUrl} onChange={set('liveUrl')} placeholder="https://..." />
      </label>
      <label>
        Image URL
        <input value={form.imageUrl} onChange={set('imageUrl')} placeholder="https://..." />
      </label>
      <label className="admin-form-full">
        Stack (comma-separated)
        <input
          value={form.stackText ?? form.stack.join(', ')}
          onChange={(e) => setForm((p) => ({ ...p, stackText: e.target.value }))}
        />
      </label>
      <label className="admin-form-full">
        Problem
        <textarea rows={3} value={form.problem} onChange={set('problem')} />
      </label>
      <label className="admin-form-full">
        Solution
        <textarea rows={3} value={form.solution} onChange={set('solution')} />
      </label>
      <label className="admin-form-full">
        Results (one per line)
        <textarea
          rows={4}
          value={form.resultsText ?? form.results.join('\n')}
          onChange={(e) => setForm((p) => ({ ...p, resultsText: e.target.value }))}
        />
      </label>
      <label className="admin-form-check">
        <input type="checkbox" checked={form.featured} onChange={set('featured')} />
        Featured on home
      </label>
      <label className="admin-form-check">
        <input type="checkbox" checked={form.published} onChange={set('published')} />
        Published
      </label>
      <div className="admin-form-actions admin-form-full">
        <button type="button" className="admin-btn admin-btn-outline" onClick={onCancel}>
          Cancel
        </button>
        <button type="submit" className="admin-btn admin-btn-primary" disabled={saving}>
          {saving ? 'Saving…' : 'Save project'}
        </button>
      </div>
    </form>
  );
}

export default function AdminProjectsPage() {
  const [projects, setProjects] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [editing, setEditing] = useState(null);
  const [creating, setCreating] = useState(false);
  const [saving, setSaving] = useState(false);

  const load = async () => {
    setLoading(true);
    setError('');
    try {
      const data = await fetchAdminProjects();
      setProjects(data.projects);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    document.title = 'Projects — BuiltByWho Admin';
    load();
  }, []);

  const handleSave = async (payload) => {
    setSaving(true);
    try {
      if (editing) {
        await updateProject(editing._id, payload);
      } else {
        await createProject(payload);
      }
      setEditing(null);
      setCreating(false);
      await load();
    } catch (err) {
      setError(err.message);
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (project) => {
    if (!window.confirm(`Delete "${project.title}"?`)) return;
    try {
      await deleteProject(project._id);
      await load();
    } catch (err) {
      setError(err.message);
    }
  };

  return (
    <div className="admin-leads-page">
      <div className="admin-leads-header">
        <div>
          <h1>Projects</h1>
          <p className="admin-muted">Manage portfolio case studies and work page entries.</p>
        </div>
        <div className="admin-header-actions">
          <button type="button" className="admin-btn admin-btn-outline" onClick={load} disabled={loading}>
            Refresh
          </button>
          <button type="button" className="admin-btn admin-btn-primary" onClick={() => setCreating(true)}>
            Add project
          </button>
        </div>
      </div>

      {loading && <p className="admin-muted">Loading projects…</p>}
      {error && <p className="admin-error">{error}</p>}

      {!loading && projects.length === 0 ? (
        <div className="admin-empty">
          <h2>No projects yet</h2>
          <p className="admin-muted">Add your first portfolio project.</p>
        </div>
      ) : (
        <div className="admin-table-wrap">
          <table className="admin-table">
            <thead>
              <tr>
                <th>Title</th>
                <th>Category</th>
                <th>Featured</th>
                <th>Status</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {projects.map((p) => (
                <tr key={p._id}>
                  <td>{p.title}</td>
                  <td>{p.category}</td>
                  <td>{p.featured ? 'Yes' : 'No'}</td>
                  <td>
                    <span className={`admin-badge${p.published ? ' admin-badge-live' : ''}`}>
                      {p.published ? 'Live' : 'Hidden'}
                    </span>
                  </td>
                  <td className="admin-cell-actions">
                    <button
                      type="button"
                      className="admin-btn admin-btn-outline admin-btn-sm"
                      onClick={() => setEditing(p)}
                    >
                      Edit
                    </button>
                    <button
                      type="button"
                      className="admin-btn admin-btn-ghost admin-btn-sm"
                      onClick={() => handleDelete(p)}
                    >
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
        title={editing ? 'Edit project' : 'New project'}
        open={creating || editing}
        onClose={() => {
          setCreating(false);
          setEditing(null);
        }}
        wide
      >
        <ProjectForm
          initial={editing || emptyProject}
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
