import { Link } from 'react-router-dom';

export default function NotFoundPage() {
  return (
    <section className="not-found">
      <h1>
        404<span style={{ color: 'var(--red)' }}>.</span>
      </h1>
      <p>This page doesn&apos;t exist — but we can build you one in a week.</p>
      <Link to="/" className="btn btn-primary">
        Back to home
      </Link>
    </section>
  );
}
