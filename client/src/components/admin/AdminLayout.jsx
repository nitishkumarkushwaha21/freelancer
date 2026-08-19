import { Link, NavLink, Outlet } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';

const navItems = [
  { to: '/admin/projects', label: 'Projects' },
  { to: '/admin/team', label: 'Team' },
  { to: '/admin/services', label: 'Services' },
  { to: '/admin/process', label: 'Process' },
  { to: '/admin/faq', label: 'FAQ' },
  { to: '/admin/settings', label: 'Settings' },
  { to: '/admin/leads', label: 'Inquiries' },
  { to: '/admin/reviews', label: 'Reviews' },
  { to: '/admin/users', label: 'Users' },
];

export default function AdminLayout() {
  const { user, logout } = useAuth();

  return (
    <div className="admin-shell">
      <header className="admin-header">
        <div className="admin-header-inner">
          <div>
            <Link to="/admin/projects" className="admin-brand">
              BuiltByWho <span>Admin</span>
            </Link>
            <nav className="admin-nav">
              {navItems.map((item) => (
                <NavLink
                  key={item.to}
                  to={item.to}
                  className={({ isActive }) => `admin-nav-link${isActive ? ' active' : ''}`}
                >
                  {item.label}
                </NavLink>
              ))}
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
