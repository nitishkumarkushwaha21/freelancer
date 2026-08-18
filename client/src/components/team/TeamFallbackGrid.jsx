import Reveal from '../ui/Reveal';
import { team } from '../../data/siteData';

export default function TeamFallbackGrid() {
  return (
    <div className="team-fallback-grid">
      {team.map((member) => (
        <Reveal key={member.name} className="founder-card">
          {member.image ? (
            <img src={member.image} alt={member.name} className="avatar avatar-img" />
          ) : (
            <div className="avatar" style={{ background: member.color }}>
              {member.initial}
            </div>
          )}
          <div>
            <h3>{member.name}</h3>
            <span className="founder-role">{member.role}</span>
            <p>{member.bio}</p>
          </div>
        </Reveal>
      ))}
    </div>
  );
}
