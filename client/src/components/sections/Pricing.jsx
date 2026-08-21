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
          <h2>Professional sites. Founder-friendly rates.</h2>
          <p>
            Clear starting price for standard landing pages. Final quote confirmed before work
            begins.
          </p>
        </Reveal>
        <Reveal className="pricing-band">
          <div className="pricing-price-block">
            <div className="price-sub">Starting from</div>
            <div className="price-tag">
              {loading ? '…' : settings.pricingAmount || '₹5,000'}
              <span className="price-tag-suffix">+</span>
            </div>
            <p className="price-note">
              Scope, pages, and integrations affect the final number — no hidden fees.
            </p>
          </div>
          <ul className="price-list">
            {features.map((feature) => (
              <li key={feature}>{feature}</li>
            ))}
          </ul>
          <Link to="/contact" className="btn btn-primary pricing-cta">
            Request a quote
          </Link>
        </Reveal>
      </div>
    </section>
  );
}
