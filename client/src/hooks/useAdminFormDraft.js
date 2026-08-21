import { useCallback, useEffect, useRef, useState } from 'react';
import {
  clearDraft as clearDraftStorage,
  draftKey,
  formsEqual,
  loadDraft,
  saveDraft,
  stripSensitive,
} from '../utils/adminDrafts';

const DEBOUNCE_MS = 400;

export function useAdminFormDraft({
  section,
  mode = 'new',
  entityId = null,
  initialData,
  form,
  setForm,
  enabled = true,
  sensitiveFields = [],
}) {
  const key = enabled ? draftKey(section, mode, entityId) : null;
  const baselineRef = useRef(initialData);
  const restoredRef = useRef(false);
  const [hasDraft, setHasDraft] = useState(false);
  const [draftRestored, setDraftRestored] = useState(false);

  useEffect(() => {
    baselineRef.current = initialData;
    restoredRef.current = false;
  }, [initialData, key]);

  useEffect(() => {
    if (!enabled || !key || !setForm) return;

    const draft = loadDraft(key);
    if (draft) {
      setForm((prev) => ({ ...prev, ...draft }));
      baselineRef.current = draft;
      restoredRef.current = true;
      setHasDraft(true);
      setDraftRestored(true);
    } else {
      setHasDraft(false);
      setDraftRestored(false);
    }
  }, [enabled, key, setForm]);

  useEffect(() => {
    if (!enabled || !key || form == null) return undefined;

    const timeoutId = window.setTimeout(() => {
      const payload = sensitiveFields.length
        ? stripSensitive(form, sensitiveFields)
        : form;
      saveDraft(key, payload);
      if (!formsEqual(payload, baselineRef.current)) {
        setHasDraft(true);
      }
    }, DEBOUNCE_MS);

    return () => window.clearTimeout(timeoutId);
  }, [enabled, key, form, sensitiveFields]);

  const isDirty = form != null && !formsEqual(form, baselineRef.current);

  useEffect(() => {
    if (!enabled || !isDirty) return undefined;

    const handleBeforeUnload = (event) => {
      event.preventDefault();
      event.returnValue = '';
    };

    window.addEventListener('beforeunload', handleBeforeUnload);
    return () => window.removeEventListener('beforeunload', handleBeforeUnload);
  }, [enabled, isDirty]);

  const clearDraft = useCallback(() => {
    if (key) {
      clearDraftStorage(key);
    }
    baselineRef.current = form;
    restoredRef.current = false;
    setHasDraft(false);
    setDraftRestored(false);
  }, [key, form]);

  return {
    draftKey: key,
    isDirty,
    hasDraft: hasDraft || restoredRef.current,
    draftRestored,
    clearDraft,
  };
}
