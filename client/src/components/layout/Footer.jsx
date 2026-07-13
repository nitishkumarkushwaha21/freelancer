import { Link } from 'react-router-dom';

export default function Footer() {
  const links = [
    { href: '#work', label: 'Work' },
    { href: '#services', label: 'Services' },
    { href: '#pricing', label: 'Pricing' },
    { href: '#faq', label: 'FAQ' },
  ];

  return (
    <footer>
      <div className="footer-inner">
        <p>© 2026 BUILTBYWHO — TWO DEVS, NO EXCUSES.</p>
        <div className="footer-links">
          {links.map(({ href, label }) => (
            <a key={href} href={href}>
              {label}
            </a>
          ))}
        </div>
      </div>
    </footer>
  );
}
