import { useRef, useState } from 'react';
import Reveal from '../ui/Reveal';
import { faqItems } from '../../data/siteData';

function FaqItem({ item, isOpen, onToggle }) {
  const answerRef = useRef(null);

  return (
    <div className={`faq-item${isOpen ? ' open' : ''}`}>
      <button type="button" className="faq-q" onClick={onToggle}>
        <span>
          <span className="num">{item.num}</span>
          {item.question}
        </span>
        <span className="faq-icon">+</span>
      </button>
      <div
        className="faq-a"
        style={{ maxHeight: isOpen ? `${answerRef.current?.scrollHeight ?? 0}px` : undefined }}
      >
        <p ref={answerRef}>{item.answer}</p>
      </div>
    </div>
  );
}

export default function FAQ() {
  const [openIndex, setOpenIndex] = useState(null);

  const toggle = (index) => {
    setOpenIndex((current) => (current === index ? null : index));
  };

  return (
    <section id="faq">
      <div className="wrap">
        <Reveal className="section-head">
          <div className="eyebrow">Frequently Asked</div>
          <h2>Before you ask.</h2>
        </Reveal>
        <Reveal>
          {faqItems.map((item, index) => (
            <FaqItem
              key={item.num}
              item={item}
              isOpen={openIndex === index}
              onToggle={() => toggle(index)}
            />
          ))}
        </Reveal>
      </div>
    </section>
  );
}
