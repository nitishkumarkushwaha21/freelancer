import { useCallback, useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import Reveal from '../ui/Reveal';
import StarRating from '../ui/StarRating';
import ReviewForm from './ReviewForm';
import { fetchPublishedReviews } from '../../api/reviews';

export default function Testimonials() {
  const [testimonials, setTestimonials] = useState([]);
  const [loading, setLoading] = useState(true);

  const loadReviews = useCallback(async () => {
    setLoading(true);
    try {
      const data = await fetchPublishedReviews();
      setTestimonials(data);
    } catch {
      setTestimonials([]);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    loadReviews();
  }, [loadReviews]);

  return (
    <section id="reviews">
      <div className="wrap">
        <Reveal className="section-head">
          <div className="eyebrow">Word on the street</div>
          <h2>Client feedback.</h2>
        </Reveal>

        {loading && <p className="reviews-status">Loading reviews…</p>}

        {!loading && testimonials.length > 0 && (
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
        )}

        {!loading && testimonials.length === 0 && (
          <Reveal className="reviews-empty">
            <p>No reviews yet. Be the first to share your experience below.</p>
          </Reveal>
        )}

        {!loading && testimonials.length > 0 && (
          <Reveal className="testi-cta">
            <Link to="/reviews" className="btn btn-outline">
              See all reviews →
            </Link>
          </Reveal>
        )}

        <div className="testi-submit">
          <Reveal className="testi-submit-intro">
            <h3>Worked with us?</h3>
            <p>Leave a 5-star rating and tell others about your experience.</p>
          </Reveal>
          <Reveal className="testi-submit-form">
            <ReviewForm onSubmitted={loadReviews} />
          </Reveal>
        </div>
      </div>
    </section>
  );
}
