import { useState } from 'react';
import { Link } from 'react-router-dom';
import ThemeToggle from '../ui/ThemeToggle';

export default function Navbar() {
  const [menuOpen, setMenuOpen] = useState(false);

  const navLinks = [
    { to: '/work', label: 'Work' },
    { to: '/#services', label: 'Services' },
    { to: '/#pricing', label: 'Pricing' },
    { to: '/#faq', label: 'FAQ' },
  ];

  const closeMenu = () => setMenuOpen(false);

  return (
    <header>
      <nav>
        <Link to="/" className="logo" onClick={closeMenu}>
          BUILTBY<span>WHO</span>
        </Link>
        <ul className={`nav-links${menuOpen ? ' open' : ''}`}>
          {navLinks.map(({ to, label }) => (
            <li key={to}>
              <Link to={to} onClick={closeMenu}>
                {label}
              </Link>
            </li>
          ))}
        </ul>
        <div className="nav-actions">
          <ThemeToggle />
          <Link to="/contact" className="nav-cta" onClick={closeMenu}>
            Start a project →
          </Link>
        </div>
        <button
          type="button"
          className="burger"
          aria-label="menu"
          onClick={() => setMenuOpen((open) => !open)}
        >
          ☰
        </button>
      </nav>
    </header>
  );
}
