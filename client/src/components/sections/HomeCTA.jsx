import { Link } from 'react-router-dom';

export default function HomeCTA() {
  return (
    <section className="final-cta">
      <div className="eyebrow" style={{ justifyContent: 'center' }}>
        Let&apos;s Build Something
      </div>
      <h2>
        READY TO
        <br />
        <span style={{ color: 'var(--red)' }}>SHIP FAST?</span>
      </h2>
      <p>Tell us what you need. We&apos;ll tell you honestly if we can do it in a week.</p>
      <div className="btn-row">
        <Link to="/contact" className="btn btn-primary">
          Get a quote
        </Link>
        <Link to="/work" className="btn btn-outline">
          See our work
        </Link>
      </div>
    </section>
  );
}
