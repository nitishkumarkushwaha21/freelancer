import { useEffect, useRef, useState } from 'react';
import AdminFieldHint from '../../components/admin/AdminFieldHint';
import { fetchAdminSettings, updateAdminSettings } from '../../api/admin';
import { useAdminFormDraft } from '../../hooks/useAdminFormDraft';
import { draftKey, loadDraft } from '../../utils/adminDrafts';

function linesToArray(text) {
  return text
    .split('\n')
    .map((s) => s.trim())
    .filter(Boolean);
}

function buildSettingsFormData(settings) {
  return {
    ...settings,
    marqueeText: (settings.marqueeItems || []).join('\n'),
    pricingFeaturesText: (settings.pricingFeatures || []).join('\n'),
    contactProjectTypesText: (settings.contactProjectTypes || []).join('\n'),
    contactBudgetRangesText: (settings.contactBudgetRanges || []).join('\n'),
    categoriesText: JSON.stringify(settings.projectCategories || [], null, 2),
    heroEyebrow: settings.hero?.eyebrow || '',
    heroHeadline: settings.hero?.headline || '',
    heroSubheadline: settings.hero?.subheadline || '',
  };
}

export default function AdminSettingsPage() {
  const [form, setForm] = useState(null);
  const [serverBaseline, setServerBaseline] = useState(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const clearDraftRef = useRef(() => {});

  const { isDirty, clearDraft, draftRestored } = useAdminFormDraft({
    section: 'settings',
    mode: 'new',
    initialData: serverBaseline,
    form,
    setForm,
    enabled: Boolean(form && serverBaseline),
  });

  useEffect(() => {
    clearDraftRef.current = clearDraft;
  }, [clearDraft]);

  const load = async () => {
    setLoading(true);
    setError('');
    try {
      const data = await fetchAdminSettings();
      const formData = buildSettingsFormData(data.settings);
      const draft = loadDraft(draftKey('settings', 'new'));
      setServerBaseline(formData);
      setForm(draft ? { ...formData, ...draft } : formData);
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

      clearDraftRef.current();
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
      {draftRestored && (
        <p className="admin-draft-notice">Restored unsaved changes from this session.</p>
      )}
      {isDirty && !draftRestored && (
        <p className="admin-draft-notice admin-draft-notice-muted">
          Unsaved changes are saved to this session until you click Save settings.
        </p>
      )}

      <form className="admin-form admin-settings-form" onSubmit={handleSubmit}>
        <h3 className="admin-section-title">Hero</h3>
        <label>
          Eyebrow
          <AdminFieldHint>Small label above the home page hero headline.</AdminFieldHint>
          <input value={form.heroEyebrow} onChange={set('heroEyebrow')} />
        </label>
        <label>
          Headline
          <AdminFieldHint>Main hero text. Use line breaks; the last line is highlighted in accent color.</AdminFieldHint>
          <textarea rows={3} value={form.heroHeadline} onChange={set('heroHeadline')} />
        </label>
        <label>
          Subheadline
          <textarea rows={3} value={form.heroSubheadline} onChange={set('heroSubheadline')} />
        </label>

        <h3 className="admin-section-title">Pricing</h3>
        <label>
          Starting amount
          <AdminFieldHint>Price shown in the home page pricing band, e.g. ₹5,000.</AdminFieldHint>
          <input value={form.pricingAmount} onChange={set('pricingAmount')} placeholder="₹5,000" />
        </label>
        <label>
          Pricing features (one per line)
          <AdminFieldHint>Bullet list of what is included in the starting package.</AdminFieldHint>
          <textarea rows={4} value={form.pricingFeaturesText} onChange={set('pricingFeaturesText')} />
        </label>

        <h3 className="admin-section-title">Marquee</h3>
        <label>
          Marquee items (one per line)
          <AdminFieldHint>Scrolling text phrases in the home page marquee strip.</AdminFieldHint>
          <textarea rows={4} value={form.marqueeText} onChange={set('marqueeText')} />
        </label>

        <h3 className="admin-section-title">Contact</h3>
        <label>
          Contact email
          <input value={form.contactEmail} onChange={set('contactEmail')} />
        </label>
        <label>
          WhatsApp number (no +)
          <AdminFieldHint>Country code + number without +, e.g. 919876543210 for wa.me links.</AdminFieldHint>
          <input value={form.whatsappNumber} onChange={set('whatsappNumber')} />
        </label>
        <label>
          Project types (one per line)
          <AdminFieldHint>Dropdown options on the contact form “Project type” field.</AdminFieldHint>
          <textarea rows={4} value={form.contactProjectTypesText} onChange={set('contactProjectTypesText')} />
        </label>
        <label>
          Budget ranges (one per line)
          <AdminFieldHint>Dropdown options on the contact form “Budget” field.</AdminFieldHint>
          <textarea rows={4} value={form.contactBudgetRangesText} onChange={set('contactBudgetRangesText')} />
        </label>

        <h3 className="admin-section-title">Work page categories</h3>
        <label>
          Project categories (JSON array of {`{ id, label }`})
          <AdminFieldHint>
            Filters on the Work page. Example: [{'{"id":"landing","label":"Landing Pages"}'}]
          </AdminFieldHint>
          <textarea rows={6} value={form.categoriesText} onChange={set('categoriesText')} />
        </label>

        <button type="submit" className="admin-btn admin-btn-primary" disabled={saving}>
          {saving ? 'Saving…' : 'Save settings'}
        </button>
      </form>
    </div>
  );
}
