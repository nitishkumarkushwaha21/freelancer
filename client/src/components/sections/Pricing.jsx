import { Link } from 'react-router-dom';
import Reveal from '../ui/Reveal';
import { pricingFeatures } from '../../data/siteData';

export default function Pricing() {
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
              ₹5,000<span>+</span>
            </div>
            <div className="price-sub">STARTING PRICE — SCOPE DEPENDENT</div>
          </div>
          <ul className="price-list">
            {pricingFeatures.map((feature) => (
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
