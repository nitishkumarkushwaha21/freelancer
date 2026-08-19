import { useEffect, useState } from 'react';
import { Navigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';

export default function AdminLoginPage() {
  const { isAuthenticated, loading, login } = useAuth();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    document.title = 'Admin Login — BuiltByWho';
  }, []);

  if (loading) {
    return (
      <div className="admin-page admin-login-page">
        <p className="admin-muted">Checking session…</p>
      </div>
    );
  }

  if (isAuthenticated) {
    return <Navigate to="/admin/projects" replace />;
  }

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSubmitting(true);

    try {
      await login(email, password);
    } catch (err) {
      setError(err.message || 'Login failed.');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="admin-page admin-login-page">
      <div className="admin-login-card">
        <p className="admin-eyebrow">BuiltByWho</p>
        <h1>Admin login</h1>
        <p className="admin-muted">Sign in to manage site content, inquiries, and reviews.</p>

        <form className="admin-form" onSubmit={handleSubmit}>
          <label>
            Email
            <input
              type="email"
              autoComplete="username"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="admin@builtbywho.com"
            />
          </label>
          <label>
            Password
            <input
              type="password"
              autoComplete="current-password"
              required
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="••••••••"
            />
          </label>

          {error && <p className="admin-error">{error}</p>}

          <button type="submit" className="admin-btn admin-btn-primary" disabled={submitting}>
            {submitting ? 'Signing in…' : 'Sign in'}
          </button>
        </form>
      </div>
    </div>
  );
}
