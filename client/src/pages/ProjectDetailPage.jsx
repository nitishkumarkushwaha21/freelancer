import { useEffect, useState } from 'react';
import { Link, Navigate, useParams } from 'react-router-dom';
import Reveal from '../components/ui/Reveal';
import { fetchProjectBySlug } from '../api/content';
import { useSiteLinks } from '../hooks/useSiteLinks';

export default function ProjectDetailPage() {
  const { slug } = useParams();
  const { getWhatsAppUrl } = useSiteLinks();
  const [project, setProject] = useState(null);
  const [loading, setLoading] = useState(true);
  const [notFound, setNotFound] = useState(false);

  useEffect(() => {
    let cancelled = false;
    setLoading(true);
    setNotFound(false);

    fetchProjectBySlug(slug)
      .then((data) => {
        if (!cancelled) setProject(data.project);
      })
      .catch((err) => {
        if (!cancelled && err.message?.includes('not found')) {
          setNotFound(true);
        }
      })
      .finally(() => {
        if (!cancelled) setLoading(false);
      });

    return () => {
      cancelled = true;
    };
  }, [slug]);

  if (loading) {
    return (
      <div className="page-project">
        <section className="page-hero">
          <div className="wrap">
            <p className="admin-muted">Loading project…</p>
          </div>
        </section>
      </div>
    );
  }

  if (notFound || !project) {
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
          <div
            className="project-thumb-large"
            style={project.imageUrl ? { backgroundImage: `url(${project.imageUrl})`, backgroundSize: 'cover' } : undefined}
          />
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
                {project.results?.map((item) => (
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
