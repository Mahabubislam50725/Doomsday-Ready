import { Clock } from "lucide-react";

export default function RewatchProgress({ total, watched, unwatchedRuntime }) {
  const progress = total > 0 ? Math.round((watched / total) * 100) : 0;
  const hrs = Math.floor(unwatchedRuntime / 60);
  const mins = unwatchedRuntime % 60;

  return (
    <div className="bg-zinc-900 border border-zinc-800 rounded-2xl p-5 space-y-4">
      <div className="flex items-center justify-between">
        <div>
          <p className="text-white font-semibold">{watched} of {total} movies watched</p>
          <p className="text-zinc-500 text-sm mt-0.5">{progress}% complete</p>
        </div>
        {unwatchedRuntime > 0 ? (
          <div className="flex items-center gap-1.5 bg-zinc-800 border border-zinc-700 rounded-xl px-3 py-2">
            <Clock className="w-3.5 h-3.5 text-red-400" />
            <span className="text-sm text-zinc-300 font-medium">
              {hrs > 0 ? `${hrs}h ` : ""}{mins}m left
            </span>
          </div>
        ) : (
          <span className="text-green-400 text-sm font-medium bg-green-500/10 border border-green-500/20 px-3 py-2 rounded-xl">
            ✓ All done!
          </span>
        )}
      </div>

      <div className="w-full bg-zinc-800 rounded-full h-2.5 overflow-hidden">
        <div
          className="h-2.5 rounded-full bg-gradient-to-r from-red-600 via-red-500 to-orange-400 transition-all duration-700"
          style={{ width: `${progress}%` }}
        />
      </div>
    </div>
  );
}
