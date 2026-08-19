import { Link } from 'react-router-dom';
import Terminal from '../ui/Terminal';
import { useSiteContent } from '../../context/SiteContentContext';
import { useSiteLinks } from '../../hooks/useSiteLinks';

export default function Hero() {
  const { settings, loading } = useSiteContent();
  const { getWhatsAppUrl } = useSiteLinks();
  const hero = settings.hero || {};

  const headlineLines = (hero.headline || 'SMALL TEAM.\nBIG OBSESSION\nWITH DETAIL.').split('\n');

  return (
    <section className="hero" style={{ paddingTop: '70px' }}>
      <div>
        <div className="eyebrow">
          {loading ? '…' : hero.eyebrow || 'Web Studio — 2 Devs, 0 Excuses'}
        </div>
        <h1>
          {headlineLines.map((line, i) => (
            <span key={i}>
              {i > 0 && <br />}
              {i === headlineLines.length - 1 ? <span className="accent">{line}</span> : line}
            </span>
          ))}
        </h1>
        <p>
          {loading
            ? 'Loading…'
            : hero.subheadline ||
              'We build fast, clean, no-nonsense websites for small businesses and founders who need it done right — and done in a week, not a quarter.'}
        </p>
        <div className="btn-row">
          <Link to="/contact" className="btn btn-primary">
            Book a call
          </Link>
          <a href={getWhatsAppUrl()} className="btn btn-outline" target="_blank" rel="noreferrer">
            WhatsApp us
          </a>
        </div>
      </div>
      <Terminal />
    </section>
  );
}
