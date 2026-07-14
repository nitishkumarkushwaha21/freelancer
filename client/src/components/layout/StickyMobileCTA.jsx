import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';

export default function StickyMobileCTA() {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const onScroll = () => setVisible(window.scrollY > 400);
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  return (
    <div className={`sticky-mobile-cta${visible ? ' show' : ''}`}>
      <Link to="/contact" className="btn btn-primary">
        Start a project →
      </Link>
    </div>
  );
}
