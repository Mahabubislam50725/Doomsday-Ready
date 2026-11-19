"use client";
import { useState, useEffect } from "react";
import { X, Film, AlertTriangle } from "lucide-react";
import LoadingSpinner from "@/components/common/LoadingSpinner";
import ErrorMessage from "@/components/common/ErrorMessage";

export default function MovieModal({ mode, movie, allMovies, onSave, onClose }) {
  const isEdit = mode === "edit";

  const [form, setForm] = useState({
    title: "",
    releaseYear: "",
    runtime: "",
    watched: false,
  });
  const [selectedPrereqs, setSelectedPrereqs] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    if (isEdit && movie) {
      setForm({
        title: movie.title,
        releaseYear: movie.releaseYear,
        runtime: movie.runtime,
        watched: movie.watched,
      });
      setSelectedPrereqs(movie.prerequisites?.map((p) => p._id || p) ?? []);
    }
  }, [isEdit, movie]);

  const togglePrereq = (id) => {
    setSelectedPrereqs((prev) =>
      prev.includes(id) ? prev.filter((p) => p !== id) : [...prev, id]
    );
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);
    try {
      await onSave({
        ...form,
        releaseYear: Number(form.releaseYear),
        runtime: Number(form.runtime),
        prerequisites: selectedPrereqs,
      });
      onClose();
    } catch (err) {
      setError(
        err.code === "CIRCULAR_DEPENDENCY"
          ? "⚠ Circular dependency detected! This would create a cycle."
          : err.message || "Something went wrong."
      );
    } finally {
      setLoading(false);
    }
  };

  const eligibleMovies = allMovies.filter((m) => !isEdit || m._id !== movie?._id);

  return (
    <div className="fixed inset-0 bg-black/70 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <div className="bg-zinc-900 border border-zinc-800 rounded-2xl w-full max-w-lg shadow-2xl shadow-black/60 max-h-[90vh] flex flex-col">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-zinc-800">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 bg-red-600/15 border border-red-600/20 rounded-lg flex items-center justify-center">
              <Film className="w-4 h-4 text-red-400" />
            </div>
            <h2 className="font-semibold text-white">{isEdit ? "Edit Movie" : "Add New Movie"}</h2>
          </div>
          <button onClick={onClose} className="text-zinc-500 hover:text-white transition-colors">
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Body */}
        <form onSubmit={handleSubmit} className="flex-1 overflow-y-auto">
          <div className="px-6 py-5 space-y-4">
            <div>
              <label className="text-xs text-zinc-400 uppercase tracking-wide mb-1.5 block">Movie Title</label>
              <input
                className="w-full bg-zinc-800 border border-zinc-700 rounded-xl px-4 py-2.5 text-sm text-white outline-none focus:border-red-500 focus:ring-1 focus:ring-red-500/30 transition-all placeholder:text-zinc-600"
                placeholder="e.g. Avengers: Endgame"
                value={form.title}
                onChange={(e) => setForm({ ...form, title: e.target.value })}
                required
              />
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="text-xs text-zinc-400 uppercase tracking-wide mb-1.5 block">Release Year</label>
                <input
                  type="number"
                  className="w-full bg-zinc-800 border border-zinc-700 rounded-xl px-4 py-2.5 text-sm text-white outline-none focus:border-red-500 focus:ring-1 focus:ring-red-500/30 transition-all placeholder:text-zinc-600"
                  placeholder="2019"
                  value={form.releaseYear}
                  onChange={(e) => setForm({ ...form, releaseYear: e.target.value })}
                  required
                />
              </div>
              <div>
                <label className="text-xs text-zinc-400 uppercase tracking-wide mb-1.5 block">Runtime (min)</label>
                <input
                  type="number"
                  className="w-full bg-zinc-800 border border-zinc-700 rounded-xl px-4 py-2.5 text-sm text-white outline-none focus:border-red-500 focus:ring-1 focus:ring-red-500/30 transition-all placeholder:text-zinc-600"
                  placeholder="181"
                  value={form.runtime}
                  onChange={(e) => setForm({ ...form, runtime: e.target.value })}
                  required
                />
              </div>
            </div>

            {/* Watched toggle */}
            <div className="flex items-center justify-between bg-zinc-800/50 border border-zinc-700/50 rounded-xl px-4 py-3">
              <div>
                <p className="text-sm text-zinc-300 font-medium">Watched</p>
                <p className="text-xs text-zinc-500">Mark this movie as already watched</p>
              </div>
              <button
                type="button"
                onClick={() => setForm({ ...form, watched: !form.watched })}
                className={`w-11 h-6 rounded-full transition-all relative ${form.watched ? "bg-green-600" : "bg-zinc-700"}`}
              >
                <div className={`absolute top-0.5 w-5 h-5 bg-white rounded-full shadow transition-all ${form.watched ? "left-5.5 translate-x-0.5" : "left-0.5"}`} />
              </button>
            </div>

            {/* Prerequisites */}
            {eligibleMovies.length > 0 && (
              <div>
                <label className="text-xs text-zinc-400 uppercase tracking-wide mb-1.5 block">Prerequisites</label>
                <div className="bg-zinc-800/40 border border-zinc-700/50 rounded-xl p-3 max-h-40 overflow-y-auto space-y-1">
                  {eligibleMovies.map((m) => (
                    <label key={m._id} className="flex items-center gap-3 px-2 py-1.5 rounded-lg hover:bg-zinc-700/40 cursor-pointer transition-colors">
                      <div className={`w-4 h-4 rounded border-2 flex items-center justify-center flex-shrink-0 transition-all ${
                        selectedPrereqs.includes(m._id)
                          ? "bg-red-600 border-red-600"
                          : "border-zinc-600"
                      }`}>
                        {selectedPrereqs.includes(m._id) && (
                          <svg className="w-2.5 h-2.5 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3}>
                            <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                          </svg>
                        )}
                      </div>
                      <span className="text-sm text-zinc-300">{m.title}</span>
                      <span className="text-xs text-zinc-600 ml-auto">{m.releaseYear}</span>
                    </label>
                  ))}
                </div>
              </div>
            )}

            {error && (
              <div className="flex items-start gap-2 bg-red-950/50 border border-red-800/50 rounded-xl px-4 py-3">
                <AlertTriangle className="w-4 h-4 text-red-400 flex-shrink-0 mt-0.5" />
                <p className="text-red-300 text-sm">{error}</p>
              </div>
            )}
          </div>

          {/* Footer */}
          <div className="px-6 py-4 border-t border-zinc-800 flex gap-3">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 bg-zinc-800 hover:bg-zinc-700 text-zinc-300 hover:text-white px-4 py-2.5 rounded-xl text-sm font-medium transition-all"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={loading}
              className="flex-1 bg-red-600 hover:bg-red-500 disabled:opacity-50 text-white px-4 py-2.5 rounded-xl text-sm font-semibold transition-all flex items-center justify-center gap-2"
            >
              {loading ? <LoadingSpinner size="sm" /> : null}
              {loading ? "Saving..." : isEdit ? "Save Changes" : "Add Movie"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
