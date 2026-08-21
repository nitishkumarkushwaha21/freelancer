export default function AdminFieldHint({ children }) {
  if (!children) return null;
  return <span className="admin-field-hint">{children}</span>;
}
