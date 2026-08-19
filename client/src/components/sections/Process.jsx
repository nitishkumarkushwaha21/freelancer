import Reveal from '../ui/Reveal';
import { useSiteContent } from '../../context/SiteContentContext';

export default function Process() {
  const { process, loading } = useSiteContent();

  return (
    <section id="process">
      <div className="wrap">
        <Reveal className="section-head">
          <div className="eyebrow">How It Works</div>
          <h2>Day 1 to live.</h2>
          <p>No mystery process. Here is exactly what happens after you reach out.</p>
        </Reveal>
        <div className="process-grid">
          {loading ? (
            <p className="admin-muted">Loading process…</p>
          ) : (
            process.map((step) => (
              <Reveal key={step._id || step.num} className="process-card">
                <span className="process-num">{step.num}</span>
                <h3>{step.title}</h3>
                <p>{step.description}</p>
              </Reveal>
            ))
          )}
        </div>
      </div>
    </section>
  );
}
