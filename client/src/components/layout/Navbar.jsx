import { useState } from 'react';
import { Link } from 'react-router-dom';

export default function Navbar() {
  const [menuOpen, setMenuOpen] = useState(false);

  const navLinks = [
    { href: '#work', label: 'Work' },
    { href: '#services', label: 'Services' },
    { href: '#pricing', label: 'Pricing' },
    { href: '#faq', label: 'FAQ' },
  ];

  const closeMenu = () => setMenuOpen(false);

  return (
    <header>
      <nav>
        <Link to="/" className="logo" onClick={closeMenu}>
          BUILTBY<span>WHO</span>
        </Link>
        <ul className={`nav-links${menuOpen ? ' open' : ''}`}>
          {navLinks.map(({ href, label }) => (
            <li key={href}>
              <a href={href} onClick={closeMenu}>
                {label}
              </a>
            </li>
          ))}
        </ul>
        <a href="#contact" className="nav-cta" onClick={closeMenu}>
          Start a project →
        </a>
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
