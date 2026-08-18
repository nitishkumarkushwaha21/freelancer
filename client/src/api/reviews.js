function getApiBase() {
  return import.meta.env.VITE_API_URL || '';
}

export async function fetchPublishedReviews() {
  const res = await fetch(`${getApiBase()}/api/reviews`);
  const data = await res.json().catch(() => ({}));

  if (!res.ok) {
    throw new Error(data.message || 'Failed to load reviews.');
  }

  return data.reviews;
}

export async function submitReview(payload) {
  const res = await fetch(`${getApiBase()}/api/reviews`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(payload),
  });

  const data = await res.json().catch(() => ({}));

  if (!res.ok) {
    throw new Error(data.message || 'Failed to submit review.');
  }

  return data;
}
