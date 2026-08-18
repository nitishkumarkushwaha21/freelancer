import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import Reveal from '../ui/Reveal';
import StarRating from '../ui/StarRating';
import { fetchPublishedReviews } from '../../api/reviews';

export default function Testimonials() {
  const [testimonials, setTestimonials] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchPublishedReviews()
      .then(setTestimonials)
      .catch(() => setTestimonials([]))
      .finally(() => setLoading(false));
  }, []);

  if (loading || testimonials.length === 0) return null;

  return (
    <section id="testimonials">
      <div className="wrap">
        <Reveal className="section-head">
          <div className="eyebrow">Word on the street</div>
          <h2>Client feedback.</h2>
        </Reveal>
        <div className="testi-grid">
          {testimonials.slice(0, 3).map((testimonial) => (
            <Reveal key={testimonial._id} className="testi-card review-card">
              <StarRating value={testimonial.rating} size="sm" />
              <p className="quote">{testimonial.experience}</p>
              <div className="testi-who">
                <b>{testimonial.name}</b> — {testimonial.role}
              </div>
            </Reveal>
          ))}
        </div>
        {testimonials.length > 0 && (
          <Reveal className="testi-cta">
            <Link to="/reviews" className="btn btn-outline">
              See all reviews →
            </Link>
          </Reveal>
        )}
      </div>
    </section>
  );
}
