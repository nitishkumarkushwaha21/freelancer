import { useState } from 'react';
import Reveal from '../ui/Reveal';
import { getMailtoUrl, getWhatsAppUrl } from '../../config/site';

const PROJECT_TYPES = ['Landing Page', 'Portfolio Site', 'E-commerce', 'Web App', 'Other'];
const BUDGET_RANGES = ['Under ₹10,000', '₹10,000 – ₹25,000', '₹25,000 – ₹50,000', '₹50,000+'];

const initialForm = {
  name: '',
  email: '',
  phone: '',
  projectType: '',
  budget: '',
  message: '',
};

export default function ContactForm() {
  const [form, setForm] = useState(initialForm);
  const [status, setStatus] = useState('idle');
  const [errorMsg, setErrorMsg] = useState('');

  const update = (field) => (e) => {
    setForm((prev) => ({ ...prev, [field]: e.target.value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setStatus('loading');
    setErrorMsg('');

    try {
      const apiBase = import.meta.env.VITE_API_URL || '';
      const res = await fetch(`${apiBase}/api/leads`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(form),
      });

      const data = await res.json().catch(() => ({}));

      if (!res.ok) {
        throw new Error(data.message || 'Something went wrong. Try again or WhatsApp us.');
      }

      setForm(initialForm);
      setStatus('success');
    } catch (err) {
      setErrorMsg(err.message);
      setStatus('error');
    }
  };

  if (status === 'success') {
    return (
      <div className="form-success">
        <h3>Message sent.</h3>
        <p>We&apos;ll get back to you within 24 hours. Need a faster reply?</p>
        <div className="btn-row">
          <a href={getWhatsAppUrl()} className="btn btn-primary" target="_blank" rel="noreferrer">
            WhatsApp us
          </a>
          <button type="button" className="btn btn-outline" onClick={() => setStatus('idle')}>
            Send another
          </button>
        </div>
      </div>
    );
  }

  return (
    <form className="contact-form" onSubmit={handleSubmit}>
      <div className="form-row">
        <label>
          Name *
          <input type="text" required value={form.name} onChange={update('name')} placeholder="Your name" />
        </label>
        <label>
          Email *
          <input type="email" required value={form.email} onChange={update('email')} placeholder="you@email.com" />
        </label>
      </div>
      <div className="form-row">
        <label>
          Phone
          <input type="tel" value={form.phone} onChange={update('phone')} placeholder="+91..." />
        </label>
        <label>
          Project type *
          <select required value={form.projectType} onChange={update('projectType')}>
            <option value="">Select type</option>
            {PROJECT_TYPES.map((type) => (
              <option key={type} value={type}>
                {type}
              </option>
            ))}
          </select>
        </label>
      </div>
      <label>
        Budget range *
        <select required value={form.budget} onChange={update('budget')}>
          <option value="">Select range</option>
          {BUDGET_RANGES.map((range) => (
            <option key={range} value={range}>
              {range}
            </option>
          ))}
        </select>
      </label>
      <label>
        Tell us about the project *
        <textarea
          required
          rows={5}
          value={form.message}
          onChange={update('message')}
          placeholder="What do you need built? Timeline? Any reference sites?"
        />
      </label>

      {status === 'error' && <p className="form-error">{errorMsg}</p>}

      <button type="submit" className="btn btn-primary" disabled={status === 'loading'}>
        {status === 'loading' ? 'Sending…' : 'Send inquiry'}
      </button>
    </form>
  );
}

export function ContactPageContent() {
  return (
    <div className="page-contact">
      <section className="page-hero">
        <div className="wrap contact-layout">
          <Reveal className="contact-intro">
            <div className="eyebrow">Contact</div>
            <h2>Start a project.</h2>
            <p>
              Fill out the form and we&apos;ll reply within 24 hours. Prefer chat? Hit us on WhatsApp
              — we actually reply.
            </p>
            <div className="contact-quick">
              <a href={getWhatsAppUrl()} className="btn btn-outline" target="_blank" rel="noreferrer">
                WhatsApp us
              </a>
              <a href={getMailtoUrl()} className="btn btn-outline">
                Email us
              </a>
            </div>
          </Reveal>
          <Reveal className="contact-form-wrap">
            <ContactForm />
          </Reveal>
        </div>
      </section>
    </div>
  );
}
