import { Clock, Calendar, CheckCircle2, Circle, ChevronRight, Zap } from "lucide-react";

export default function MovieCard({ movie, onToggleWatched, onEditPrereqs }) {
  return (
    <div className={`group bg-zinc-900 border rounded-2xl overflow-hidden transition-all duration-200 hover:shadow-lg hover:shadow-black/40 ${
      movie.watched ? "border-zinc-800/50 opacity-70 hover:opacity-90" : "border-zinc-800 hover:border-zinc-700"
    }`}>
      {/* Top accent bar */}
      <div className={`h-0.5 w-full ${movie.watched ? "bg-green-600" : "bg-gradient-to-r from-red-600 to-orange-500"}`} />

      <div className="p-5">
        {/* Title + watched toggle */}
        <div className="flex items-start gap-3 mb-4">
          <button
            onClick={() => onToggleWatched(movie)}
            className="mt-0.5 flex-shrink-0 transition-transform hover:scale-110"
            title={movie.watched ? "Mark as unwatched" : "Mark as watched"}
          >
            {movie.watched
              ? <CheckCircle2 className="w-5 h-5 text-green-500" />
              : <Circle className="w-5 h-5 text-zinc-600 hover:text-red-400 transition-colors" />
            }
          </button>
          <div className="flex-1 min-w-0">
            <h3 className={`font-semibold leading-snug ${movie.watched ? "line-through text-zinc-500" : "text-white"}`}>
              {movie.title}
            </h3>
            <div className="flex items-center gap-3 mt-1.5 text-xs text-zinc-500">
              <span className="flex items-center gap-1">
                <Calendar className="w-3 h-3" />{movie.releaseYear}
              </span>
              <span className="flex items-center gap-1">
                <Clock className="w-3 h-3" />{movie.runtime}m
              </span>
            </div>
          </div>
          <span className={`flex-shrink-0 text-xs font-medium px-2.5 py-1 rounded-full ${
            movie.watched
              ? "bg-green-500/10 text-green-400 border border-green-500/20"
              : "bg-zinc-800 text-zinc-500 border border-zinc-700"
          }`}>
            {movie.watched ? "Watched" : "Unwatched"}
          </span>
        </div>

        {/* Prerequisites */}
        {movie.prerequisites?.length > 0 && (
          <div className="mb-4">
            <p className="text-zinc-600 text-xs mb-1.5 flex items-center gap-1">
              <Zap className="w-3 h-3" /> Prerequisites
            </p>
            <div className="flex flex-wrap gap-1.5">
              {movie.prerequisites.map((p) => (
                <span key={p._id || p} className="bg-zinc-800/80 text-zinc-400 text-xs px-2.5 py-1 rounded-full border border-zinc-700/60">
                  {p.title || p}
                </span>
              ))}
            </div>
          </div>
        )}

        {/* Edit button */}
        <button
          onClick={() => onEditPrereqs(movie)}
          className="w-full flex items-center justify-between text-xs text-zinc-500 hover:text-zinc-300 bg-zinc-800/40 hover:bg-zinc-800 border border-zinc-800 hover:border-zinc-700 rounded-xl px-3 py-2 transition-all"
        >
          <span>{movie.prerequisites?.length > 0 ? "Edit Prerequisites" : "+ Add Prerequisites"}</span>
          <ChevronRight className="w-3.5 h-3.5" />
        </button>
      </div>
    </div>
  );
}
