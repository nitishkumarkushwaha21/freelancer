function getApiBase() {
  return import.meta.env.VITE_API_URL || '';
}

async function contentFetch(path) {
  const res = await fetch(`${getApiBase()}${path}`);
  const data = await res.json().catch(() => ({}));
  if (!res.ok) {
    throw new Error(data.message || 'Failed to load content.');
  }
  return data;
}

export async function fetchAllContent() {
  return contentFetch('/api/content/all');
}

export async function fetchProjects() {
  return contentFetch('/api/content/projects');
}

export async function fetchProjectBySlug(slug) {
  return contentFetch(`/api/content/projects/${slug}`);
}

export async function fetchTeam() {
  return contentFetch('/api/content/team');
}

export async function fetchServices() {
  return contentFetch('/api/content/services');
}

export async function fetchProcess() {
  return contentFetch('/api/content/process');
}

export async function fetchFaq() {
  return contentFetch('/api/content/faq');
}

export async function fetchSettings() {
  return contentFetch('/api/content/settings');
}
