export default function StarRating({ value, onChange, size = 'md', label = 'Rating' }) {
  const interactive = typeof onChange === 'function';
  const stars = [1, 2, 3, 4, 5];

  return (
    <div
      className={`star-rating star-rating-${size}${interactive ? ' star-rating-input' : ''}`}
      role={interactive ? 'group' : 'img'}
      aria-label={`${value} out of 5 stars`}
    >
      {interactive && <span className="star-rating-label">{label} *</span>}
      <div className="star-rating-row">
        {stars.map((star) =>
          interactive ? (
            <button
              key={star}
              type="button"
              className={`star-btn${star <= value ? ' filled' : ''}`}
              onClick={() => onChange(star)}
              aria-label={`${star} star${star === 1 ? '' : 's'}`}
              aria-pressed={star <= value}
            >
              ★
            </button>
          ) : (
            <span key={star} className={`star-btn${star <= value ? ' filled' : ''}`} aria-hidden="true">
              ★
            </span>
          )
        )}
        {interactive && value > 0 && <span className="star-rating-value">{value}/5</span>}
      </div>
    </div>
  );
}
