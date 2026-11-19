import { CheckCircle2, Clock, Calendar } from "lucide-react";

export default function RewatchTimeline({ order }) {
  return (
    <div className="space-y-2">
      {order.map((movie, i) => (
        <div
          key={movie._id}
          className={`flex items-center gap-4 bg-zinc-900 border rounded-2xl px-5 py-4 transition-all ${
            movie.watched
              ? "border-zinc-800/50 opacity-60"
              : "border-zinc-800 hover:border-zinc-700"
          }`}
        >
          {/* Step number */}
          <div className={`w-7 h-7 rounded-full flex items-center justify-center text-xs font-bold flex-shrink-0 ${
            movie.watched ? "bg-green-500/15 text-green-500" : "bg-zinc-800 text-zinc-500"
          }`}>
            {movie.watched ? <CheckCircle2 className="w-4 h-4" /> : i + 1}
          </div>

          {/* Info */}
          <div className="flex-1 min-w-0">
            <p className={`font-medium truncate ${movie.watched ? "line-through text-zinc-500" : "text-white"}`}>
              {movie.title}
            </p>
            <div className="flex items-center gap-3 mt-0.5 text-xs text-zinc-600">
              <span className="flex items-center gap-1"><Calendar className="w-3 h-3" />{movie.releaseYear ?? "—"}</span>
              <span className="flex items-center gap-1"><Clock className="w-3 h-3" />{movie.runtime}m</span>
            </div>
          </div>

          {/* Badge */}
          {movie.watched ? (
            <span className="flex-shrink-0 text-xs font-medium bg-green-500/10 text-green-400 border border-green-500/20 px-2.5 py-1 rounded-full">
              ✓ Done
            </span>
          ) : (
            <span className="flex-shrink-0 text-xs text-zinc-600 bg-zinc-800 border border-zinc-700 px-2.5 py-1 rounded-full">
              {movie.runtime}m
            </span>
          )}
        </div>
      ))}
    </div>
  );
}
