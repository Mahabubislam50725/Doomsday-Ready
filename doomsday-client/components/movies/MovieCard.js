"use client";
import { useState, useEffect } from "react";
import { Clock, Calendar, CheckCircle2, Circle, Pencil, Zap, Film } from "lucide-react";
import { fetchMoviePoster } from "@/services/tmdb";

export default function MovieCard({ movie, onToggleWatched, onEditPrereqs }) {
  const [poster, setPoster] = useState(null);

  useEffect(() => {
    fetchMoviePoster(movie.title, movie.releaseYear).then(setPoster);
  }, [movie.title, movie.releaseYear]);

  const hrs = Math.floor(movie.runtime / 60);
  const mins = movie.runtime % 60;
  const runtimeLabel = hrs > 0 ? `${hrs}h ${mins}m` : `${mins}m`;

  return (
    <div className={`bg-zinc-900 border rounded-2xl overflow-hidden transition-all duration-200 hover:shadow-xl hover:shadow-black/50 flex flex-col ${
      movie.watched
        ? "border-zinc-800/40 opacity-75 hover:opacity-100"
        : "border-zinc-800 hover:border-zinc-700"
    }`}>
      {/* Poster */}
      <div className="relative w-full h-52 bg-zinc-800 flex-shrink-0 overflow-hidden">
        {poster ? (
          <img
            src={poster}
            alt={movie.title}
            className={`w-full h-full object-cover transition-all duration-300 ${movie.watched ? "grayscale-[40%]" : ""}`}
          />
        ) : (
          <div className="w-full h-full flex flex-col items-center justify-center gap-2">
            <Film className="w-10 h-10 text-zinc-700" />
            <p className="text-zinc-600 text-xs">No poster</p>
          </div>
        )}

        {/* Gradient overlay */}
        <div className="absolute inset-0 bg-gradient-to-t from-zinc-900 via-zinc-900/20 to-transparent" />

        {/* Watched badge on poster */}
        <div className="absolute top-3 right-3">
          <span className={`text-xs font-semibold px-2.5 py-1 rounded-full border backdrop-blur-sm ${
            movie.watched
              ? "bg-green-500/20 text-green-400 border-green-500/30"
              : "bg-zinc-900/70 text-zinc-400 border-zinc-700/60"
          }`}>
            {movie.watched ? "✓ Watched" : "Unwatched"}
          </span>
        </div>

        {/* Title on poster bottom */}
        <div className="absolute bottom-0 left-0 right-0 px-4 pb-3">
          <h3 className={`font-bold text-base leading-snug ${movie.watched ? "line-through text-zinc-400" : "text-white"}`}>
            {movie.title}
          </h3>
        </div>
      </div>

      <div className="p-4 flex flex-col gap-3 flex-1">
        {/* Meta chips */}
        <div className="flex items-center gap-2 flex-wrap">
          <div className="flex items-center gap-1.5 bg-zinc-800 border border-zinc-700/60 rounded-lg px-2.5 py-1.5">
            <Calendar className="w-3.5 h-3.5 text-zinc-500" />
            <span className="text-zinc-300 text-xs font-medium">{movie.releaseYear}</span>
          </div>
          <div className="flex items-center gap-1.5 bg-zinc-800 border border-zinc-700/60 rounded-lg px-2.5 py-1.5">
            <Clock className="w-3.5 h-3.5 text-zinc-500" />
            <span className="text-zinc-300 text-xs font-medium">{runtimeLabel}</span>
          </div>
          <div className="flex items-center gap-1.5 bg-zinc-800 border border-zinc-700/60 rounded-lg px-2.5 py-1.5">
            <Zap className="w-3.5 h-3.5 text-zinc-500" />
            <span className="text-zinc-300 text-xs font-medium">
              {movie.prerequisites?.length > 0
                ? `${movie.prerequisites.length} prereq${movie.prerequisites.length > 1 ? "s" : ""}`
                : "No prereqs"}
            </span>
          </div>
        </div>

        {/* Prerequisites */}
        {movie.prerequisites?.length > 0 && (
          <div className="bg-zinc-800/40 border border-zinc-700/40 rounded-xl px-3 py-2.5 space-y-1.5">
            <p className="text-zinc-600 text-xs font-semibold uppercase tracking-wide">Watch First</p>
            <div className="flex flex-wrap gap-1.5">
              {movie.prerequisites.map((p) => (
                <span key={p._id || p} className="bg-zinc-800 border border-zinc-700 text-zinc-400 text-xs px-2.5 py-1 rounded-full">
                  {p.title || p}
                </span>
              ))}
            </div>
          </div>
        )}

        {/* Action buttons */}
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
              ? <><Circle className="w-4 h-4" /> Unwatched</>
              : <><CheckCircle2 className="w-4 h-4" /> Watched</>
            }
          </button>
          <button
            onClick={() => onEditPrereqs(movie)}
            className="flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl text-sm font-medium bg-zinc-800 hover:bg-zinc-700 border border-zinc-700 hover:border-zinc-600 text-zinc-400 hover:text-white transition-all"
          >
            <Pencil className="w-4 h-4" />
            Edit
          </button>
        </div>
      </div>
    </div>
  );
}
