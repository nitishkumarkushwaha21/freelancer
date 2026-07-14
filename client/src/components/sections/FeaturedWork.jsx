import { Link } from 'react-router-dom';
import Reveal from '../ui/Reveal';
import WorkCard from '../ui/WorkCard';
import { getFeaturedProjects } from '../../data/siteData';

export default function FeaturedWork() {
  const featured = getFeaturedProjects(3);

  if (featured.length === 0) return null;

  return (
    <section id="work">
      <div className="wrap">
        <Reveal className="section-head">
          <div className="eyebrow">Recent Builds</div>
          <h2>Featured work.</h2>
          <p>
            A preview of what we ship — full case studies live on the work page.
          </p>
        </Reveal>
        <div className="work-grid">
          {featured.map((project) => (
            <Reveal key={project.slug}>
              <WorkCard project={project} />
            </Reveal>
          ))}
        </div>
        <div className="section-cta-row">
          <Link to="/work" className="btn btn-outline">
            View all work →
          </Link>
        </div>
      </div>
    </section>
  );
}
