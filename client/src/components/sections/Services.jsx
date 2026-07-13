import Reveal from '../ui/Reveal';
import { services } from '../../data/siteData';

export default function Services() {
  return (
    <section id="services">
      <div className="wrap">
        <Reveal className="section-head">
          <div className="eyebrow">What We Build</div>
          <h2>Pick your build.</h2>
          <p>
            Whatever you need shipped, we&apos;re set up to move on it immediately — no bloated
            discovery phase, no 40-slide proposal deck.
          </p>
        </Reveal>
      </div>
      <div className="services-grid wrap" style={{ maxWidth: '1240px' }}>
        {services.map((service) => (
          <Reveal key={service.title} className="service-card">
            <div className="service-icon">{service.icon}</div>
            <h3>{service.title}</h3>
            <p>{service.description}</p>
          </Reveal>
        ))}
      </div>
    </section>
  );
}
