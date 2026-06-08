export default function EmptyState({ icon, title, description }) {
  return (
    <div className="p-12 text-center text-on-surface-variant flex flex-col items-center">
      <span className="material-symbols-outlined text-5xl mb-4 opacity-50">{icon}</span>
      <p className="text-lg font-medium mb-1">{title}</p>
      <p className="text-sm">{description}</p>
    </div>
  );
}