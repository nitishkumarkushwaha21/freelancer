import { useState } from 'react';
import StarRating from '../ui/StarRating';
import { submitReview } from '../../api/reviews';

const PROJECT_TYPES = ['Landing Page', 'Portfolio Site', 'E-commerce', 'Web App', 'Other'];

const initialForm = {
  name: '',
  role: '',
  rating: 0,
  projectType: '',
  experience: '',
};

export default function ReviewForm({ onSubmitted }) {
  const [form, setForm] = useState(initialForm);
  const [status, setStatus] = useState('idle');
  const [errorMsg, setErrorMsg] = useState('');

  const update = (field) => (e) => {
    setForm((prev) => ({ ...prev, [field]: e.target.value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrorMsg('');

    if (form.rating < 1) {
      setErrorMsg('Please select a star rating.');
      return;
    }

    setStatus('loading');

    try {
      await submitReview(form);
      setForm(initialForm);
      setStatus('success');
      onSubmitted?.();
    } catch (err) {
      setErrorMsg(err.message);
      setStatus('error');
    }
  };

  if (status === 'success') {
    return (
      <div className="form-success">
        <h3>Review submitted.</h3>
        <p>Thanks for sharing your experience. We&apos;ll publish it after a quick check.</p>
        <button type="button" className="btn btn-outline" onClick={() => setStatus('idle')}>
          Submit another
        </button>
      </div>
    );
  }

  return (
    <form className="contact-form review-form" onSubmit={handleSubmit}>
      <div className="form-row">
        <label>
          Your name *
          <input type="text" required value={form.name} onChange={update('name')} placeholder="Jane Doe" />
        </label>
        <label>
          Role / company *
          <input
            type="text"
            required
            value={form.role}
            onChange={update('role')}
            placeholder="Founder, Bakery Co."
          />
        </label>
      </div>

      <StarRating value={form.rating} onChange={(rating) => setForm((prev) => ({ ...prev, rating }))} />

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

      <label>
        Your experience *
        <textarea
          required
          rows={5}
          value={form.experience}
          onChange={update('experience')}
          placeholder="How was working with us? Delivery, communication, results…"
        />
      </label>

      {(status === 'error' || errorMsg) && <p className="form-error">{errorMsg}</p>}

      <button type="submit" className="btn btn-primary" disabled={status === 'loading'}>
        {status === 'loading' ? 'Submitting…' : 'Submit review'}
      </button>
    </form>
  );
}
