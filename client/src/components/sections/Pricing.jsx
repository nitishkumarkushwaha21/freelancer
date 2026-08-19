import { Link } from 'react-router-dom';
import Reveal from '../ui/Reveal';
import { useSiteContent } from '../../context/SiteContentContext';

export default function Pricing() {
  const { settings, loading } = useSiteContent();
  const features = settings.pricingFeatures || [];

  return (
    <section id="pricing">
      <div className="wrap">
        <Reveal className="section-head">
          <div className="eyebrow">Pricing</div>
          <h2>No fixed menu. Fair quotes.</h2>
        </Reveal>
        <Reveal className="pricing-band">
          <div>
            <div className="price-tag">
              {loading ? '…' : settings.pricingAmount || '₹5,000'}
              <span>+</span>
            </div>
            <div className="price-sub">STARTING PRICE — SCOPE DEPENDENT</div>
          </div>
          <ul className="price-list">
            {features.map((feature) => (
              <li key={feature}>{feature}</li>
            ))}
          </ul>
          <Link to="/contact" className="btn btn-primary">
            Get a quote
          </Link>
        </Reveal>
      </div>
    </section>
  );
}
