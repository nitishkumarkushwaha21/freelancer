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

// CMS — Projects
export async function fetchAdminProjects() {
  return adminFetch('/api/admin/projects');
}

export async function createProject(data) {
  return adminFetch('/api/admin/projects', { method: 'POST', body: JSON.stringify(data) });
}

export async function updateProject(id, data) {
  return adminFetch(`/api/admin/projects/${id}`, { method: 'PUT', body: JSON.stringify(data) });
}

export async function deleteProject(id) {
  return adminFetch(`/api/admin/projects/${id}`, { method: 'DELETE' });
}

// CMS — Team
export async function fetchAdminTeam() {
  return adminFetch('/api/admin/team');
}

export async function createTeamMember(data) {
  return adminFetch('/api/admin/team', { method: 'POST', body: JSON.stringify(data) });
}

export async function updateTeamMember(id, data) {
  return adminFetch(`/api/admin/team/${id}`, { method: 'PUT', body: JSON.stringify(data) });
}

export async function deleteTeamMember(id) {
  return adminFetch(`/api/admin/team/${id}`, { method: 'DELETE' });
}

// CMS — Services
export async function fetchAdminServices() {
  return adminFetch('/api/admin/services');
}

export async function createService(data) {
  return adminFetch('/api/admin/services', { method: 'POST', body: JSON.stringify(data) });
}

export async function updateService(id, data) {
  return adminFetch(`/api/admin/services/${id}`, { method: 'PUT', body: JSON.stringify(data) });
}

export async function deleteService(id) {
  return adminFetch(`/api/admin/services/${id}`, { method: 'DELETE' });
}

// CMS — Process
export async function fetchAdminProcess() {
  return adminFetch('/api/admin/process');
}

export async function createProcessStep(data) {
  return adminFetch('/api/admin/process', { method: 'POST', body: JSON.stringify(data) });
}

export async function updateProcessStep(id, data) {
  return adminFetch(`/api/admin/process/${id}`, { method: 'PUT', body: JSON.stringify(data) });
}

export async function deleteProcessStep(id) {
  return adminFetch(`/api/admin/process/${id}`, { method: 'DELETE' });
}

// CMS — FAQ
export async function fetchAdminFaq() {
  return adminFetch('/api/admin/faq');
}

export async function createFaqItem(data) {
  return adminFetch('/api/admin/faq', { method: 'POST', body: JSON.stringify(data) });
}

export async function updateFaqItem(id, data) {
  return adminFetch(`/api/admin/faq/${id}`, { method: 'PUT', body: JSON.stringify(data) });
}

export async function deleteFaqItem(id) {
  return adminFetch(`/api/admin/faq/${id}`, { method: 'DELETE' });
}

// CMS — Settings
export async function fetchAdminSettings() {
  return adminFetch('/api/admin/settings');
}

export async function updateAdminSettings(data) {
  return adminFetch('/api/admin/settings', { method: 'PUT', body: JSON.stringify(data) });
}

// Users
export async function fetchUsers() {
  return adminFetch('/api/admin/users');
}

export async function createUser(data) {
  return adminFetch('/api/admin/users', { method: 'POST', body: JSON.stringify(data) });
}

export async function updateUser(id, data) {
  return adminFetch(`/api/admin/users/${id}`, { method: 'PATCH', body: JSON.stringify(data) });
}
