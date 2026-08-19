import { createContext, useContext, useEffect, useMemo, useState } from 'react';
import { fetchAllContent } from '../api/content';

const SiteContentContext = createContext(null);

const defaultSettings = {
  marqueeItems: [],
  projectCategories: [{ id: 'all', label: 'All' }],
  pricingAmount: '₹5,000',
  pricingFeatures: [],
  contactProjectTypes: [],
  contactBudgetRanges: [],
  hero: { eyebrow: '', headline: '', subheadline: '' },
  contactEmail: import.meta.env.VITE_CONTACT_EMAIL || 'hello@builtbywho.com',
  whatsappNumber: import.meta.env.VITE_WHATSAPP_NUMBER || '919876543210',
};

export function SiteContentProvider({ children }) {
  const [content, setContent] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    let cancelled = false;

    fetchAllContent()
      .then((data) => {
        if (!cancelled) setContent(data);
      })
      .catch((err) => {
        if (!cancelled) setError(err.message || 'Failed to load site content.');
      })
      .finally(() => {
        if (!cancelled) setLoading(false);
      });

    return () => {
      cancelled = true;
    };
  }, []);

  const value = useMemo(() => {
    const settings = { ...defaultSettings, ...content?.settings };

    return {
      loading,
      error,
      projects: content?.projects ?? [],
      team: content?.team ?? [],
      services: content?.services ?? [],
      process: content?.process ?? [],
      faq: content?.faq ?? [],
      settings,
      founders: (content?.team ?? []).filter((m) => m.isFounder),
      featuredProjects: (content?.projects ?? []).filter((p) => p.featured && p.published),
    };
  }, [content, loading, error]);

  return <SiteContentContext.Provider value={value}>{children}</SiteContentContext.Provider>;
}

export function useSiteContent() {
  const ctx = useContext(SiteContentContext);
  if (!ctx) throw new Error('useSiteContent must be used within SiteContentProvider');
  return ctx;
}
