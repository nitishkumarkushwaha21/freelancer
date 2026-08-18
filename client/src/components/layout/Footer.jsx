import { Link } from 'react-router-dom';

export default function Footer() {
  const links = [
    { to: '/work', label: 'Work' },
    { to: '/my-team', label: 'My Team' },
    { to: '/#services', label: 'Services' },
    { to: '/#pricing', label: 'Pricing' },
    { to: '/contact', label: 'Contact' },
  ];

  return (
    <footer>
      <div className="footer-inner">
        <p>© 2026 BUILTBYWHO — TWO DEVS, NO EXCUSES.</p>
        <div className="footer-links">
          {links.map(({ to, label }) => (
            <Link key={to} to={to}>
              {label}
            </Link>
          ))}
        </div>
      </div>
    </footer>
  );
}
