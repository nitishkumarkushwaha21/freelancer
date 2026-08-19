import { useEffect, useState } from 'react';
import { fetchAdminSettings, updateAdminSettings } from '../../api/admin';

function linesToArray(text) {
  return text
    .split('\n')
    .map((s) => s.trim())
    .filter(Boolean);
}

export default function AdminSettingsPage() {
  const [form, setForm] = useState(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  const load = async () => {
    setLoading(true);
    setError('');
    try {
      const data = await fetchAdminSettings();
      const s = data.settings;
      setForm({
        ...s,
        marqueeText: (s.marqueeItems || []).join('\n'),
        pricingFeaturesText: (s.pricingFeatures || []).join('\n'),
        contactProjectTypesText: (s.contactProjectTypes || []).join('\n'),
        contactBudgetRangesText: (s.contactBudgetRanges || []).join('\n'),
        categoriesText: JSON.stringify(s.projectCategories || [], null, 2),
        heroEyebrow: s.hero?.eyebrow || '',
        heroHeadline: s.hero?.headline || '',
        heroSubheadline: s.hero?.subheadline || '',
      });
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    document.title = 'Settings — BuiltByWho Admin';
    load();
  }, []);

  const set = (field) => (e) => setForm((prev) => ({ ...prev, [field]: e.target.value }));

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSaving(true);
    setError('');
    setSuccess('');

    try {
      let projectCategories = [];
      try {
        projectCategories = JSON.parse(form.categoriesText);
      } catch {
        throw new Error('Project categories must be valid JSON array.');
      }

      await updateAdminSettings({
        marqueeItems: linesToArray(form.marqueeText),
        projectCategories,
        pricingAmount: form.pricingAmount,
        pricingFeatures: linesToArray(form.pricingFeaturesText),
        contactProjectTypes: linesToArray(form.contactProjectTypesText),
        contactBudgetRanges: linesToArray(form.contactBudgetRangesText),
        hero: {
          eyebrow: form.heroEyebrow,
          headline: form.heroHeadline,
          subheadline: form.heroSubheadline,
        },
        contactEmail: form.contactEmail,
        whatsappNumber: form.whatsappNumber,
      });

      setSuccess('Settings saved.');
      await load();
    } catch (err) {
      setError(err.message);
    } finally {
      setSaving(false);
    }
  };

  if (loading || !form) {
    return <p className="admin-muted">Loading settings…</p>;
  }

  return (
    <div className="admin-leads-page">
      <div className="admin-leads-header">
        <div>
          <h1>Site settings</h1>
          <p className="admin-muted">Hero copy, pricing, marquee, contact form options, and contact links.</p>
        </div>
        <button type="button" className="admin-btn admin-btn-outline" onClick={load}>
          Refresh
        </button>
      </div>

      {error && <p className="admin-error">{error}</p>}
      {success && <p className="admin-success">{success}</p>}

      <form className="admin-form admin-settings-form" onSubmit={handleSubmit}>
        <h3 className="admin-section-title">Hero</h3>
        <label>
          Eyebrow
          <input value={form.heroEyebrow} onChange={set('heroEyebrow')} />
        </label>
        <label>
          Headline (use newlines for line breaks; last line becomes accent)
          <textarea rows={3} value={form.heroHeadline} onChange={set('heroHeadline')} />
        </label>
        <label>
          Subheadline
          <textarea rows={3} value={form.heroSubheadline} onChange={set('heroSubheadline')} />
        </label>

        <h3 className="admin-section-title">Pricing</h3>
        <label>
          Starting amount
          <input value={form.pricingAmount} onChange={set('pricingAmount')} placeholder="₹5,000" />
        </label>
        <label>
          Pricing features (one per line)
          <textarea rows={4} value={form.pricingFeaturesText} onChange={set('pricingFeaturesText')} />
        </label>

        <h3 className="admin-section-title">Marquee</h3>
        <label>
          Marquee items (one per line)
          <textarea rows={4} value={form.marqueeText} onChange={set('marqueeText')} />
        </label>

        <h3 className="admin-section-title">Contact</h3>
        <label>
          Contact email
          <input value={form.contactEmail} onChange={set('contactEmail')} />
        </label>
        <label>
          WhatsApp number (no +)
          <input value={form.whatsappNumber} onChange={set('whatsappNumber')} />
        </label>
        <label>
          Project types (one per line)
          <textarea rows={4} value={form.contactProjectTypesText} onChange={set('contactProjectTypesText')} />
        </label>
        <label>
          Budget ranges (one per line)
          <textarea rows={4} value={form.contactBudgetRangesText} onChange={set('contactBudgetRangesText')} />
        </label>

        <h3 className="admin-section-title">Work page categories</h3>
        <label>
          Project categories (JSON array of {`{ id, label }`})
          <textarea rows={6} value={form.categoriesText} onChange={set('categoriesText')} />
        </label>

        <button type="submit" className="admin-btn admin-btn-primary" disabled={saving}>
          {saving ? 'Saving…' : 'Save settings'}
        </button>
      </form>
    </div>
  );
}
