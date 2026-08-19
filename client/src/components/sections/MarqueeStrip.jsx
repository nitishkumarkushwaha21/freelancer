import { useSiteContent } from '../../context/SiteContentContext';

export default function MarqueeStrip() {
  const { settings, loading } = useSiteContent();
  const marqueeItems = settings.marqueeItems?.length ? settings.marqueeItems : ['LOADING…'];
  const items = loading ? ['LOADING…', 'LOADING…'] : [...marqueeItems, ...marqueeItems];

  return (
    <div className="marquee-strip">
      <div className="marquee-track">
        {items.map((item, i) => (
          <span key={`${item}-${i}`}>{item}</span>
        ))}
      </div>
    </div>
  );
}
