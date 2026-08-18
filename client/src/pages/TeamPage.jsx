import { lazy, Suspense, useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import Reveal from '../components/ui/Reveal';
import TeamFallbackGrid from '../components/team/TeamFallbackGrid';
import WebGLErrorBoundary from '../components/team/WebGLErrorBoundary';

const LaptopTeamExperience = lazy(() => import('../components/team/LaptopTeamExperience'));

function hasWebGL() {
  try {
    const canvas = document.createElement('canvas');
    return Boolean(canvas.getContext('webgl2') || canvas.getContext('webgl'));
  } catch {
    return false;
  }
}

function useTeamExperienceMode() {
  const [mode, setMode] = useState(null);

  useEffect(() => {
    const mobile = window.matchMedia('(max-width: 860px)');
    const reduced = window.matchMedia('(prefers-reduced-motion: reduce)');

    const resolve = () => {
      if (mobile.matches || !hasWebGL()) {
        setMode('fallback');
        return;
      }
      setMode(reduced.matches ? '3d-static' : '3d');
    };

    resolve();
    mobile.addEventListener('change', resolve);
    reduced.addEventListener('change', resolve);
    return () => {
      mobile.removeEventListener('change', resolve);
      reduced.removeEventListener('change', resolve);
    };
  }, []);

  return [mode, setMode];
}

function LeadIn() {
  return (
    <section className="page-hero team-lead-in">
      <div className="wrap">
        <Reveal className="section-head">
          <div className="eyebrow">My Team</div>
          <h2>Four developers, one machine.</h2>
          <p>Scroll to open the laptop. The screen boots, then the people behind BuiltByWho step in.</p>
        </Reveal>
      </div>
    </section>
  );
}

function LeadOut({ showGrid }) {
  return (
    <section className="team-lead-out">
      <div className="wrap">
        <Reveal className="section-head">
          <div className="eyebrow">The roster</div>
          <h2>Meet the team.</h2>
          <p>Two founders shipping now — plus two seats we fill as the work grows.</p>
        </Reveal>
        {showGrid ? <TeamFallbackGrid /> : null}
        <div className="btn-row team-lead-out-cta">
          <Link to="/contact" className="btn btn-primary">
            Start a project →
          </Link>
          <Link to="/work" className="btn btn-outline">
            See our work
          </Link>
        </div>
      </div>
    </section>
  );
}

export default function TeamPage() {
  const [mode, setMode] = useTeamExperienceMode();

  useEffect(() => {
    document.title = 'My Team — BuiltByWho';
  }, []);

  const show3d = mode === '3d' || mode === '3d-static';

  return (
    <div className="page-team">
      <LeadIn />

      {mode === null ? <div className="team-stage-placeholder" aria-hidden="true" /> : null}

      {show3d ? (
        <WebGLErrorBoundary
          fallback={<section className="team-fallback-section"><div className="wrap"><TeamFallbackGrid /></div></section>}
          onError={() => setMode('fallback')}
        >
          <Suspense fallback={<div className="team-stage-placeholder" aria-hidden="true" />}>
            <LaptopTeamExperience lockedProgress={mode === '3d-static' ? 1 : null} />
          </Suspense>
        </WebGLErrorBoundary>
      ) : null}

      {mode === 'fallback' ? (
        <section className="team-fallback-section">
          <div className="wrap">
            <TeamFallbackGrid />
          </div>
        </section>
      ) : null}

      {mode ? <LeadOut showGrid={mode !== 'fallback'} /> : null}
    </div>
  );
}
