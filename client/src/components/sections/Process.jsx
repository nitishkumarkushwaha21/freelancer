import Reveal from '../ui/Reveal';
import { processSteps } from '../../data/siteData';

export default function Process() {
  return (
    <section id="process">
      <div className="wrap">
        <Reveal className="section-head">
          <div className="eyebrow">How It Works</div>
          <h2>Day 1 to live.</h2>
          <p>No mystery process. Here is exactly what happens after you reach out.</p>
        </Reveal>
        <div className="process-grid">
          {processSteps.map((step) => (
            <Reveal key={step.num} className="process-card">
              <span className="process-num">{step.num}</span>
              <h3>{step.title}</h3>
              <p>{step.description}</p>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}
