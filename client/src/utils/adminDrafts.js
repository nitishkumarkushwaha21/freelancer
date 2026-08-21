const DRAFT_PREFIX = 'builtbywho_admin_draft:';

export function draftKey(section, mode, id) {
  if (mode === 'new') {
    return `${DRAFT_PREFIX}${section}:new`;
  }
  return `${DRAFT_PREFIX}${section}:edit:${id}`;
}

export function loadDraft(key) {
  if (!key) return null;
  const raw = sessionStorage.getItem(key);
  if (!raw) return null;
  try {
    return JSON.parse(raw);
  } catch {
    return null;
  }
}

export function saveDraft(key, data) {
  if (!key || data == null) return;
  sessionStorage.setItem(key, JSON.stringify(data));
}

export function clearDraft(key) {
  if (!key) return;
  sessionStorage.removeItem(key);
}

export function stripSensitive(data, fields = ['password']) {
  if (!data || typeof data !== 'object') return data;
  const next = { ...data };
  for (const field of fields) {
    delete next[field];
  }
  return next;
}

export function formsEqual(a, b) {
  return JSON.stringify(a) === JSON.stringify(b);
}
