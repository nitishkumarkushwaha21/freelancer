import { useState } from 'react';
import Reveal from '../components/ui/Reveal';
import WorkCard from '../components/ui/WorkCard';
import { useSiteContent } from '../context/SiteContentContext';

export default function WorkPage() {
  const { projects, settings, loading } = useSiteContent();
  const [activeCategory, setActiveCategory] = useState('all');
  const projectCategories = settings.projectCategories || [{ id: 'all', label: 'All' }];

  const filtered =
    activeCategory === 'all'
      ? projects
      : projects.filter((p) => p.category === activeCategory);

  return (
    <div className="page-work">
      <section className="page-hero">
        <div className="wrap">
          <Reveal className="section-head">
            <div className="eyebrow">Portfolio</div>
            <h2>Work we ship.</h2>
            <p>
              Case studies from recent builds. Filter by type — each project links to the full
              breakdown.
            </p>
          </Reveal>
        </div>
      </section>

      <section>
        <div className="wrap">
          <div className="filter-row">
            {projectCategories.map((cat) => (
              <button
                key={cat.id}
                type="button"
                className={`filter-btn${activeCategory === cat.id ? ' active' : ''}`}
                onClick={() => setActiveCategory(cat.id)}
              >
                {cat.label}
              </button>
            ))}
          </div>

          {loading ? (
            <p className="admin-muted">Loading projects…</p>
          ) : filtered.length > 0 ? (
            <div className="work-grid">
              {filtered.map((project) => (
                <Reveal key={project.slug}>
                  <WorkCard project={project} />
                </Reveal>
              ))}
            </div>
          ) : (
            <div className="empty-state">
              <p>No projects in this category yet — check back soon.</p>
            </div>
          )}
        </div>
      </section>
    </div>
  );
}
