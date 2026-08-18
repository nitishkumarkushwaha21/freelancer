import { Link, NavLink, Outlet } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';

export default function AdminLayout() {
  const { user, logout } = useAuth();

  return (
    <div className="admin-shell">
      <header className="admin-header">
        <div className="admin-header-inner">
          <div>
            <Link to="/admin/leads" className="admin-brand">
              BuiltByWho <span>Admin</span>
            </Link>
            <nav className="admin-nav">
              <NavLink to="/admin/leads" className={({ isActive }) => `admin-nav-link${isActive ? ' active' : ''}`}>
                Inquiries
              </NavLink>
              <NavLink to="/admin/reviews" className={({ isActive }) => `admin-nav-link${isActive ? ' active' : ''}`}>
                Reviews
              </NavLink>
            </nav>
          </div>
          <div className="admin-header-actions">
            <span className="admin-user">{user?.email}</span>
            <button type="button" className="admin-btn admin-btn-outline" onClick={logout}>
              Log out
            </button>
            <a href="/" className="admin-btn admin-btn-ghost">
              View site
            </a>
          </div>
        </div>
      </header>
      <main className="admin-main">
        <Outlet />
      </main>
    </div>
  );
}
