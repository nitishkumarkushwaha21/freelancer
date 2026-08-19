import { Link } from 'react-router-dom';
import Reveal from '../ui/Reveal';
import { useSiteContent } from '../../context/SiteContentContext';

export default function About() {
  const { founders, loading } = useSiteContent();

  return (
    <section id="about">
      <div className="wrap">
        <Reveal className="section-head">
          <div className="eyebrow">Who&apos;s Behind It</div>
          <h2>Two devs. One deadline.</h2>
        </Reveal>
        <div className="about-grid">
          {loading ? (
            <p className="admin-muted">Loading…</p>
          ) : (
            founders.map((founder) => (
              <Reveal key={founder._id || founder.name} className="founder-card">
                <div className="avatar">{founder.initial}</div>
                <div>
                  <h3>{founder.name}</h3>
                  <span className="founder-role">{founder.role}</span>
                  <p>{founder.bio}</p>
                </div>
              </Reveal>
            ))
          )}
        </div>
        <Reveal className="btn-row about-team-cta">
          <Link to="/my-team" className="btn btn-outline">
            Meet the team →
          </Link>
        </Reveal>
      </div>
    </section>
  );
}
