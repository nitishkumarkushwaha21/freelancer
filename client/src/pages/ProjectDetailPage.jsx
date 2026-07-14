import { Link, Navigate, useParams } from 'react-router-dom';
import Reveal from '../components/ui/Reveal';
import { getProjectBySlug } from '../data/siteData';
import { getWhatsAppUrl } from '../config/site';

export default function ProjectDetailPage() {
  const { slug } = useParams();
  const project = getProjectBySlug(slug);

  if (!project) {
    return <Navigate to="/work" replace />;
  }

  return (
    <div className="page-project">
      <section className="page-hero">
        <div className="wrap">
          <Link to="/work" className="back-link">
            ← Back to work
          </Link>
          <Reveal className="section-head project-head">
            <span className="work-tag">{project.tag}</span>
            <h2>{project.title}</h2>
            <p>{project.description}</p>
            <div className="project-meta">
              {project.timeline && <span className="meta-pill">{project.timeline} turnaround</span>}
              {project.stack?.map((tech) => (
                <span key={tech} className="meta-pill meta-pill-dim">
                  {tech}
                </span>
              ))}
            </div>
          </Reveal>
        </div>
      </section>

      <section>
        <div className="wrap">
          <div className="project-thumb-large" />
          <div className="case-study-grid">
            <Reveal className="case-block">
              <h3>The problem</h3>
              <p>{project.problem}</p>
            </Reveal>
            <Reveal className="case-block">
              <h3>What we built</h3>
              <p>{project.solution}</p>
            </Reveal>
            <Reveal className="case-block case-block-full">
              <h3>Results</h3>
              <ul className="price-list">
                {project.results.map((item) => (
                  <li key={item}>{item}</li>
                ))}
              </ul>
            </Reveal>
          </div>

          <div className="project-actions">
            {project.liveUrl ? (
              <a href={project.liveUrl} className="btn btn-primary" target="_blank" rel="noreferrer">
                View live site →
              </a>
            ) : (
              <span className="coming-soon-label">Live link coming when project ships</span>
            )}
            <a href={getWhatsAppUrl()} className="btn btn-outline" target="_blank" rel="noreferrer">
              Build something like this
            </a>
          </div>
        </div>
      </section>
    </div>
  );
}
