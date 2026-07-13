import Terminal from '../ui/Terminal';

export default function Hero() {
  return (
    <section className="hero" style={{ paddingTop: '70px' }}>
      <div>
        <div className="eyebrow">Web Studio — 2 Devs, 0 Excuses</div>
        <h1>
          SMALL TEAM.
          <br />
          BIG OBSESSION
          <br />
          <span className="accent">WITH DETAIL.</span>
        </h1>
        <p>
          We build fast, clean, no-nonsense websites for small businesses and founders who need it
          done right — and done in a week, not a quarter.
        </p>
        <div className="btn-row">
          <a href="#contact" className="btn btn-primary">
            Book a call
          </a>
          <a href="#contact" className="btn btn-outline">
            WhatsApp us
          </a>
        </div>
      </div>
      <Terminal />
    </section>
  );
}
