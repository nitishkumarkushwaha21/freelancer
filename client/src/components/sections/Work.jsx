import Reveal from '../ui/Reveal';
import { projects } from '../../data/siteData';

export default function Work() {
  return (
    <section id="work">
      <div className="wrap">
        <Reveal className="section-head">
          <div className="eyebrow">Recent Builds</div>
          <h2>Work in progress.</h2>
          <p>
            We&apos;re a new studio — this section fills up fast. Here&apos;s where finished
            projects will live.
          </p>
        </Reveal>
        <div className="work-grid">
          {projects.map((project) => (
            <Reveal key={project.title} className="work-card">
              <div className="work-thumb" />
              <div className="work-info">
                <span className="work-tag">{project.tag}</span>
                <h3>{project.title}</h3>
                <p>{project.description}</p>
              </div>
            </Reveal>
          ))}
        </div>
        <p className="work-note">
          Swap these three cards with real screenshots + links the moment your first projects ship.
        </p>
      </div>
    </section>
  );
}
