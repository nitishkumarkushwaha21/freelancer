import { useReveal } from '../../hooks/useReveal';

export default function Reveal({ children, className = '', as: Tag = 'div' }) {
  const { ref, className: revealClass } = useReveal();

  return (
    <Tag ref={ref} className={`${revealClass}${className ? ` ${className}` : ''}`}>
      {children}
    </Tag>
  );
}
