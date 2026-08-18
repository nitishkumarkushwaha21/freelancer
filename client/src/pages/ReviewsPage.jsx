import { useCallback, useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import Reveal from '../components/ui/Reveal';
import StarRating from '../components/ui/StarRating';
import ReviewForm from '../components/sections/ReviewForm';
import { fetchPublishedReviews } from '../api/reviews';

function ReviewCard({ review }) {
  return (
    <Reveal className="testi-card review-card">
      <StarRating value={review.rating} size="sm" />
      <p className="quote">{review.experience}</p>
      <div className="review-meta">
        <span className="review-tag">{review.projectType}</span>
      </div>
      <div className="testi-who">
        <b>{review.name}</b> — {review.role}
      </div>
    </Reveal>
  );
}

export default function ReviewsPage() {
  const [reviews, setReviews] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const loadReviews = useCallback(async () => {
    setLoading(true);
    setError('');

    try {
      const data = await fetchPublishedReviews();
      setReviews(data);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    document.title = 'Reviews — BuiltByWho';
    loadReviews();
  }, [loadReviews]);

  return (
    <div className="page-reviews">
      <section className="page-hero">
        <div className="wrap reviews-layout">
          <Reveal className="reviews-intro">
            <div className="eyebrow">Reviews</div>
            <h2>Client experiences.</h2>
            <p>
              Real feedback from people we&apos;ve built for. Worked with us? Share your experience — it helps the
              next client decide.
            </p>
            <Link to="/contact" className="btn btn-outline">
              Start a project →
            </Link>
          </Reveal>

          <Reveal className="contact-form-wrap">
            <h3 className="reviews-form-title">Leave a review</h3>
            <ReviewForm onSubmitted={loadReviews} />
          </Reveal>
        </div>
      </section>

      <section className="reviews-list-section">
        <div className="wrap">
          <Reveal className="section-head">
            <div className="eyebrow">Published</div>
            <h2>What clients say.</h2>
          </Reveal>

          {loading && <p className="reviews-status">Loading reviews…</p>}
          {error && <p className="form-error">{error}</p>}

          {!loading && !error && reviews.length === 0 && (
            <div className="reviews-empty">
              <p>No published reviews yet. Be the first to share your experience above.</p>
            </div>
          )}

          {!loading && !error && reviews.length > 0 && (
            <div className="testi-grid">
              {reviews.map((review) => (
                <ReviewCard key={review._id} review={review} />
              ))}
            </div>
          )}
        </div>
      </section>
    </div>
  );
}
