"use client";
import { useState, useEffect, useCallback } from "react";
import { Film, Eye, EyeOff, Clock, Plus } from "lucide-react";
import { api } from "@/services/api";
import MovieCard from "@/components/movies/MovieCard";
import MovieModal from "@/components/movies/MovieModal";
import StatCard from "@/components/common/StatCard";
import LoadingSpinner from "@/components/common/LoadingSpinner";
import EmptyState from "@/components/common/EmptyState";
import ErrorMessage from "@/components/common/ErrorMessage";

export default function MoviesPage() {
  const [movies, setMovies] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [modal, setModal] = useState(null); // null | { mode: "add" | "edit", movie? }

  const fetchMovies = useCallback(async () => {
    try {
      const data = await api.getMovies();
      setMovies(data.data);
    } catch (err) {
      setError(err.message || "Failed to load movies.");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => { fetchMovies(); }, [fetchMovies]);

  const handleSave = async (formData) => {
    if (modal.mode === "add") {
      await api.createMovie(formData);
    } else {
      await api.updateMovie(modal.movie._id, formData);
    }
    await fetchMovies();
  };

  const handleToggleWatched = async (movie) => {
    try {
      await api.updateMovie(movie._id, { watched: !movie.watched });
      await fetchMovies();
    } catch (err) {
      setError(err.message || "Failed to update movie.");
    }
  };

  const totalRuntime = movies.reduce((s, m) => s + m.runtime, 0);
  const watchedCount = movies.filter((m) => m.watched).length;
  const unwatchedCount = movies.length - watchedCount;
  const totalHrs = Math.floor(totalRuntime / 60);
  const totalMins = totalRuntime % 60;

  return (
    <div className="space-y-8">
      {/* Page Header */}
      <div className="flex items-start justify-between gap-4">
        <div>
          <h2 className="text-2xl font-bold text-white">My Movies</h2>
          <p className="text-zinc-500 text-sm mt-1">Manage your MCU movie collection and track your watching progress.</p>
        </div>
        <button
          onClick={() => setModal({ mode: "add" })}
          className="flex items-center gap-2 bg-red-600 hover:bg-red-500 active:bg-red-700 text-white px-4 py-2.5 rounded-xl text-sm font-semibold transition-all flex-shrink-0 shadow-lg shadow-red-900/30"
        >
          <Plus className="w-4 h-4" />
          Add Movie
        </button>
      </div>

      {/* Stats */}
      {movies.length > 0 && (
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
          <StatCard icon={<Film className="w-5 h-5" />} label="Total Movies" value={movies.length} accent="zinc" />
          <StatCard icon={<Eye className="w-5 h-5" />} label="Watched" value={watchedCount} accent="green" />
          <StatCard icon={<EyeOff className="w-5 h-5" />} label="Unwatched" value={unwatchedCount} accent="red" />
          <StatCard
            icon={<Clock className="w-5 h-5" />}
            label="Total Runtime"
            value={`${totalHrs}h ${totalMins}m`}
            accent="orange"
          />
        </div>
      )}

      <ErrorMessage message={error} onDismiss={() => setError("")} />

      {/* Content */}
      {loading ? (
        <div className="py-20"><LoadingSpinner size="lg" text="Loading movies..." /></div>
      ) : movies.length === 0 ? (
        <EmptyState
          icon="🎬"
          title="No movies yet"
          description="Start building your MCU watchlist by adding your first movie."
          action={
            <button
              onClick={() => setModal({ mode: "add" })}
              className="flex items-center gap-2 bg-red-600 hover:bg-red-500 text-white px-5 py-2.5 rounded-xl text-sm font-semibold transition-all"
            >
              <Plus className="w-4 h-4" /> Add First Movie
            </button>
          }
        />
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {movies.map((movie) => (
            <MovieCard
              key={movie._id}
              movie={movie}
              onToggleWatched={handleToggleWatched}
              onEditPrereqs={(m) => setModal({ mode: "edit", movie: m })}
            />
          ))}
        </div>
      )}

      {/* Modal */}
      {modal && (
        <MovieModal
          mode={modal.mode}
          movie={modal.movie}
          allMovies={movies}
          onSave={handleSave}
          onClose={() => setModal(null)}
        />
      )}
    </div>
  );
}
