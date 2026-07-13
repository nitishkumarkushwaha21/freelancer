import Reveal from '../ui/Reveal';
import { founders } from '../../data/siteData';

export default function About() {
  return (
    <section id="about">
      <div className="wrap">
        <Reveal className="section-head">
          <div className="eyebrow">Who&apos;s Behind It</div>
          <h2>Two devs. One deadline.</h2>
        </Reveal>
        <div className="about-grid">
          {founders.map((founder) => (
            <Reveal key={founder.name} className="founder-card">
              <div className="avatar">{founder.initial}</div>
              <div>
                <h3>{founder.name}</h3>
                <span className="founder-role">{founder.role}</span>
                <p>{founder.bio}</p>
              </div>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}
