import { marqueeItems } from '../../data/siteData';

export default function MarqueeStrip() {
  const items = [...marqueeItems, ...marqueeItems];

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
