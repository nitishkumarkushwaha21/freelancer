import { Link } from 'react-router-dom';
import Reveal from '../ui/Reveal';
import WorkCard from '../ui/WorkCard';
import { useSiteContent } from '../../context/SiteContentContext';

export default function FeaturedWork() {
  const { featuredProjects, loading } = useSiteContent();
  const featured = featuredProjects.slice(0, 3);

  if (!loading && featured.length === 0) return null;

  return (
    <section id="work">
      <div className="wrap">
        <Reveal className="section-head">
          <div className="eyebrow">Recent Builds</div>
          <h2>Featured work.</h2>
          <p>A preview of what we ship — full case studies live on the work page.</p>
        </Reveal>
        {loading ? (
          <p className="admin-muted">Loading projects…</p>
        ) : (
          <div className="work-grid">
            {featured.map((project) => (
              <Reveal key={project.slug}>
                <WorkCard project={project} />
              </Reveal>
            ))}
          </div>
        )}
        <div className="section-cta-row">
          <Link to="/work" className="btn btn-outline">
            View all work →
          </Link>
        </div>
      </div>
    </section>
  );
}
