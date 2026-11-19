export default function EmptyState({ icon, title, description, action }) {
  return (
    <div className="flex flex-col items-center justify-center py-20 text-center">
      {icon && <div className="text-5xl mb-4">{icon}</div>}
      <p className="text-zinc-300 font-semibold text-lg">{title}</p>
      {description && <p className="text-zinc-500 text-sm mt-1 max-w-xs">{description}</p>}
      {action && <div className="mt-5">{action}</div>}
    </div>
  );
}
