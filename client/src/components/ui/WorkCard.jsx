import { Link } from 'react-router-dom';

export default function WorkCard({ project }) {
  return (
    <Link to={`/work/${project.slug}`} className="work-card">
      <div className="work-thumb" />
      <div className="work-info">
        <span className="work-tag">{project.tag}</span>
        <h3>{project.title}</h3>
        <p>{project.description}</p>
        {project.timeline && <span className="work-timeline">{project.timeline} turnaround</span>}
      </div>
    </Link>
  );
}
