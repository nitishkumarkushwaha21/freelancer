import Reveal from '../ui/Reveal';

export default function TeamFallbackGrid({ team = [] }) {
  return (
    <div className="team-fallback-grid">
      {team.map((member) => (
        <Reveal key={member._id || member.name} className="founder-card">
          {member.imageUrl ? (
            <img src={member.imageUrl} alt={member.name} className="avatar avatar-img" />
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
