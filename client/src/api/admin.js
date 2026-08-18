const TOKEN_KEY = 'builtbywho_admin_token';

function getApiBase() {
  return import.meta.env.VITE_API_URL || '';
}

export function getToken() {
  return sessionStorage.getItem(TOKEN_KEY);
}

export function setToken(token) {
  sessionStorage.setItem(TOKEN_KEY, token);
}

export function clearToken() {
  sessionStorage.removeItem(TOKEN_KEY);
}

async function adminFetch(path, options = {}) {
  const token = getToken();
  const headers = {
    'Content-Type': 'application/json',
    ...options.headers,
  };

  if (token) {
    headers.Authorization = `Bearer ${token}`;
  }

  const res = await fetch(`${getApiBase()}${path}`, { ...options, headers });
  const data = await res.json().catch(() => ({}));

  if (!res.ok) {
    const err = new Error(data.message || 'Request failed.');
    err.status = res.status;
    throw err;
  }

  return data;
}

export async function login(email, password) {
  const data = await adminFetch('/api/auth/login', {
    method: 'POST',
    body: JSON.stringify({ email, password }),
  });
  setToken(data.token);
  return data;
}

export async function verifySession() {
  return adminFetch('/api/auth/me');
}

export async function fetchLeads(page = 1, limit = 20) {
  return adminFetch(`/api/leads?page=${page}&limit=${limit}`);
}

export async function fetchReviews(page = 1, limit = 20) {
  return adminFetch(`/api/reviews/all?page=${page}&limit=${limit}`);
}

export async function updateReviewPublished(id, published) {
  return adminFetch(`/api/reviews/${id}`, {
    method: 'PATCH',
    body: JSON.stringify({ published }),
  });
}

export async function deleteReview(id) {
  return adminFetch(`/api/reviews/${id}`, { method: 'DELETE' });
}

export function logout() {
  clearToken();
}
