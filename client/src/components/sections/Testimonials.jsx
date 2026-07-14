import Reveal from '../ui/Reveal';
import { getPublishedTestimonials } from '../../data/siteData';

export default function Testimonials() {
  const testimonials = getPublishedTestimonials();

  if (testimonials.length === 0) return null;

  return (
    <section id="testimonials">
      <div className="wrap">
        <Reveal className="section-head">
          <div className="eyebrow">Word on the street</div>
          <h2>Client feedback.</h2>
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
