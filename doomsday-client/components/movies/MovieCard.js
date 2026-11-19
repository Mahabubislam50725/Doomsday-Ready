import { Clock, Calendar, CheckCircle2, Circle, Pencil, Zap, Film } from "lucide-react";

export default function MovieCard({ movie, onToggleWatched, onEditPrereqs }) {
  const hrs = Math.floor(movie.runtime / 60);
  const mins = movie.runtime % 60;
  const runtimeLabel = hrs > 0 ? `${hrs}h ${mins}m` : `${mins}m`;

  return (
    <div className={`bg-zinc-900 border rounded-2xl overflow-hidden transition-all duration-200 hover:shadow-xl hover:shadow-black/50 flex flex-col ${
      movie.watched
        ? "border-zinc-800/40 opacity-75 hover:opacity-100"
        : "border-zinc-800 hover:border-zinc-700"
    }`}>
      {/* Accent bar */}
      <div className={`h-1 w-full flex-shrink-0 ${
        movie.watched
          ? "bg-green-600"
          : "bg-gradient-to-r from-red-600 via-red-500 to-orange-500"
      }`} />

      <div className="p-5 flex flex-col gap-4 flex-1">

        {/* ── Row 1: Icon + Title + Status badge ── */}
        <div className="flex items-start gap-3">
          <div className={`w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0 ${
            movie.watched ? "bg-green-500/10 border border-green-500/20" : "bg-red-500/10 border border-red-500/20"
          }`}>
            <Film className={`w-5 h-5 ${movie.watched ? "text-green-400" : "text-red-400"}`} />
          </div>
          <div className="flex-1 min-w-0">
            <h3 className={`font-bold text-base leading-snug ${
              movie.watched ? "line-through text-zinc-500" : "text-white"
            }`}>
              {movie.title}
            </h3>
            <p className="text-zinc-500 text-xs mt-0.5">MCU Film</p>
          </div>
          <span className={`flex-shrink-0 text-xs font-semibold px-2.5 py-1 rounded-full border ${
            movie.watched
              ? "bg-green-500/10 text-green-400 border-green-500/20"
              : "bg-zinc-800 text-zinc-500 border-zinc-700"
          }`}>
            {movie.watched ? "✓ Watched" : "Unwatched"}
          </span>
        </div>

        {/* ── Row 2: Meta info chips ── */}
        <div className="flex items-center gap-2 flex-wrap">
          <div className="flex items-center gap-1.5 bg-zinc-800 border border-zinc-700/60 rounded-lg px-3 py-1.5">
            <Calendar className="w-3.5 h-3.5 text-zinc-500" />
            <span className="text-zinc-300 text-xs font-medium">{movie.releaseYear}</span>
          </div>
          <div className="flex items-center gap-1.5 bg-zinc-800 border border-zinc-700/60 rounded-lg px-3 py-1.5">
            <Clock className="w-3.5 h-3.5 text-zinc-500" />
            <span className="text-zinc-300 text-xs font-medium">{runtimeLabel}</span>
          </div>
          <div className="flex items-center gap-1.5 bg-zinc-800 border border-zinc-700/60 rounded-lg px-3 py-1.5">
            <Zap className="w-3.5 h-3.5 text-zinc-500" />
            <span className="text-zinc-300 text-xs font-medium">
              {movie.prerequisites?.length > 0
                ? `${movie.prerequisites.length} prereq${movie.prerequisites.length > 1 ? "s" : ""}`
                : "No prereqs"}
            </span>
          </div>
        </div>

        {/* ── Row 3: Prerequisites list ── */}
        {movie.prerequisites?.length > 0 && (
          <div className="bg-zinc-800/40 border border-zinc-700/40 rounded-xl px-3 py-2.5 space-y-1.5">
            <p className="text-zinc-600 text-xs font-semibold uppercase tracking-wide">Watch First</p>
            <div className="flex flex-wrap gap-1.5">
              {movie.prerequisites.map((p) => (
                <span
                  key={p._id || p}
                  className="bg-zinc-800 border border-zinc-700 text-zinc-400 text-xs px-2.5 py-1 rounded-full"
                >
                  {p.title || p}
                </span>
              ))}
            </div>
          </div>
        )}

        {/* ── Row 4: Actions ── */}
        <div className="flex gap-2 mt-auto pt-1">
          <button
            onClick={() => onToggleWatched(movie)}
            className={`flex-1 flex items-center justify-center gap-2 py-2.5 rounded-xl text-sm font-medium border transition-all ${
              movie.watched
                ? "bg-zinc-800 hover:bg-zinc-700 border-zinc-700 text-zinc-400 hover:text-white"
                : "bg-green-600/10 hover:bg-green-600/20 border-green-600/30 hover:border-green-500/50 text-green-400"
            }`}
          >
            {movie.watched
              ? <><Circle className="w-4 h-4" /> Mark Unwatched</>
              : <><CheckCircle2 className="w-4 h-4" /> Mark Watched</>
            }
          </button>
          <button
            onClick={() => onEditPrereqs(movie)}
            className="flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl text-sm font-medium bg-zinc-800 hover:bg-zinc-700 border border-zinc-700 hover:border-zinc-600 text-zinc-400 hover:text-white transition-all"
            title="Edit movie"
          >
            <Pencil className="w-4 h-4" />
            Edit
          </button>
        </div>
      </div>
    </div>
  );
}
