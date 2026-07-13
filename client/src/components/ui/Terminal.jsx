import { useEffect, useRef, useState } from 'react';

const LINES = [
  { html: '<span class="prompt">$</span> git clone client-brief.git', delay: 35 },
  { html: '<span class="comment">Cloning into \'project\'...</span>', delay: 20 },
  { html: '<span class="prompt">$</span> npm run design', delay: 35 },
  { html: '<span class="ok">✓</span> wireframes approved', delay: 15 },
  { html: '<span class="ok">✓</span> frontend built', delay: 15 },
  { html: '<span class="ok">✓</span> backend wired up', delay: 15 },
  { html: '<span class="prompt">$</span> npm run deploy <span class="tag">--fast</span>', delay: 35 },
  { html: '<span class="comment">Building for production...</span>', delay: 20 },
  { html: '<span class="ok">✓</span> optimized · 0 errors', delay: 15 },
  { html: '<span class="ok">STATUS: LIVE</span> — Day 7', delay: 0 },
];

function typeLine(container, html, speed) {
  return new Promise((resolve) => {
    const text = html.replace(/<[^>]+>/g, '');
    let i = 0;
    const plain = document.createElement('div');
    container.appendChild(plain);

    const interval = setInterval(() => {
      i++;
      plain.textContent = text.slice(0, i);
      if (i >= text.length) {
        clearInterval(interval);
        plain.innerHTML = html;
        resolve();
      }
    }, speed);
  });
}

export default function Terminal() {
  const termBodyRef = useRef(null);
  const [showCursor, setShowCursor] = useState(false);

  useEffect(() => {
    const termBody = termBodyRef.current;
    if (!termBody) return;

    let cancelled = false;

    async function runTerminal() {
      const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

      if (reduced) {
        termBody.innerHTML = LINES.map((l) => `<div>${l.html}</div>`).join('');
        return;
      }

      for (const line of LINES) {
        if (cancelled) return;
        await typeLine(termBody, line.html, 28);
        await new Promise((r) => setTimeout(r, line.delay === 0 ? 0 : 200));
      }

      if (!cancelled) setShowCursor(true);
    }

    runTerminal();

    return () => {
      cancelled = true;
    };
  }, []);

  return (
    <div className="terminal">
      <div className="term-bar">
        <div className="term-dot" style={{ background: '#ff5f57' }} />
        <div className="term-dot" style={{ background: '#febc2e' }} />
        <div className="term-dot" style={{ background: '#28c840' }} />
        <span className="term-title">builtbywho — deploy.sh</span>
      </div>
      <div className="term-body" ref={termBodyRef}>
        {showCursor && <span className="cursor" />}
      </div>
    </div>
  );
}
