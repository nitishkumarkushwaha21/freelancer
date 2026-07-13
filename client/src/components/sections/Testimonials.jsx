import Reveal from '../ui/Reveal';
import { testimonials } from '../../data/siteData';

export default function Testimonials() {
  return (
    <section id="testimonials">
      <div className="wrap">
        <Reveal className="section-head">
          <div className="eyebrow">Word on the street</div>
          <h2>Placeholder praise.</h2>
          <p>
            No clients yet — these are placeholders. Swap in real quotes as they come in.
          </p>
        </Reveal>
        <div className="testi-grid">
          {testimonials.map((testimonial, i) => (
            <Reveal key={i} className="testi-card">
              <p className="quote">{testimonial.quote}</p>
              <div className="testi-who">
                <b>{testimonial.name}</b> — {testimonial.role}
              </div>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}
