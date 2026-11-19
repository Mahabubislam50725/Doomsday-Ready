export default function LoadingSpinner({ size = "md", text = "" }) {
  const s = size === "sm" ? "w-4 h-4" : size === "lg" ? "w-10 h-10" : "w-6 h-6";
  return (
    <div className="flex items-center justify-center gap-3">
      <div className={`${s} border-2 border-zinc-700 border-t-red-500 rounded-full animate-spin`} />
      {text && <span className="text-zinc-400 text-sm">{text}</span>}
    </div>
  );
}
