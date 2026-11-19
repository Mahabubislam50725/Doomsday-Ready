"use client";
import { useState, useEffect } from "react";

const API = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000/api";

export default function MoviesPage() {
  const [movies, setMovies] = useState([]);
  const [form, setForm] = useState({ title: "", releaseYear: "", runtime: "" });
  const [error, setError] = useState("");
  const [editingPrereqs, setEditingPrereqs] = useState(null);
  const [selectedPrereqs, setSelectedPrereqs] = useState([]);
  const [prereqError, setPrereqError] = useState("");

  const fetchMovies = async () => {
    const res = await fetch(`${API}/movies`);
    const data = await res.json();
    if (data.success) setMovies(data.data);
  };

  useEffect(() => { fetchMovies(); }, []);

  const handleCreate = async (e) => {
    e.preventDefault();
    setError("");
    const res = await fetch(`${API}/movies`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        title: form.title,
        releaseYear: Number(form.releaseYear),
        runtime: Number(form.runtime),
      }),
    });
    const data = await res.json();
    if (data.success) {
      setForm({ title: "", releaseYear: "", runtime: "" });
      fetchMovies();
    } else {
      setError(data.message);
    }
  };

  const toggleWatched = async (movie) => {
    await fetch(`${API}/movies/${movie._id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ watched: !movie.watched }),
    });
    fetchMovies();
  };

  const openPrereqEditor = (movie) => {
    setEditingPrereqs(movie._id);
    setSelectedPrereqs(movie.prerequisites.map((p) => p._id || p));
    setPrereqError("");
  };

  const savePrereqs = async () => {
    setPrereqError("");
    const res = await fetch(`${API}/movies/${editingPrereqs}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ prerequisites: selectedPrereqs }),
    });
    const data = await res.json();
    if (data.success) {
      setEditingPrereqs(null);
      fetchMovies();
    } else {
      setPrereqError(data.error === "CIRCULAR_DEPENDENCY" ? "⚠ Circular dependency detected!" : data.message);
    }
  };

  const togglePrereq = (id) => {
    setSelectedPrereqs((prev) =>
      prev.includes(id) ? prev.filter((p) => p !== id) : [...prev, id]
    );
  };

  const watchedCount = movies.filter((m) => m.watched).length;

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-white">Movies</h1>
          <p className="text-zinc-400 text-sm mt-1">Manage your MCU watchlist</p>
        </div>
        {movies.length > 0 && (
          <div className="bg-zinc-900 border border-zinc-800 rounded-xl px-4 py-2 text-center">
            <p className="text-2xl font-bold text-red-400">{watchedCount}<span className="text-zinc-500 text-lg">/{movies.length}</span></p>
            <p className="text-zinc-500 text-xs">watched</p>
          </div>
        )}
      </div>

      {/* Add Movie Card */}
      <div className="bg-zinc-900 rounded-2xl border border-zinc-800 overflow-hidden">
        <div className="px-5 py-4 border-b border-zinc-800 flex items-center gap-2">
          <span className="text-red-500 text-lg">＋</span>
          <h2 className="font-semibold text-zinc-200">Add New Movie</h2>
        </div>
        <form onSubmit={handleCreate} className="p-5 space-y-3">
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            <input
              className="sm:col-span-1 bg-zinc-800 border border-zinc-700 rounded-xl px-4 py-2.5 text-sm outline-none focus:border-red-500 focus:ring-1 focus:ring-red-500 transition-colors placeholder:text-zinc-500"
              placeholder="Movie title"
              value={form.title}
              onChange={(e) => setForm({ ...form, title: e.target.value })}
              required
            />
            <input
              className="bg-zinc-800 border border-zinc-700 rounded-xl px-4 py-2.5 text-sm outline-none focus:border-red-500 focus:ring-1 focus:ring-red-500 transition-colors placeholder:text-zinc-500"
              placeholder="Release year"
              type="number"
              value={form.releaseYear}
              onChange={(e) => setForm({ ...form, releaseYear: e.target.value })}
              required
            />
            <input
              className="bg-zinc-800 border border-zinc-700 rounded-xl px-4 py-2.5 text-sm outline-none focus:border-red-500 focus:ring-1 focus:ring-red-500 transition-colors placeholder:text-zinc-500"
              placeholder="Runtime (minutes)"
              type="number"
              value={form.runtime}
              onChange={(e) => setForm({ ...form, runtime: e.target.value })}
              required
            />
          </div>
          {error && (
            <div className="bg-red-950 border border-red-800 rounded-xl px-4 py-2.5 text-red-400 text-sm">
              {error}
            </div>
          )}
          <button className="w-full sm:w-auto bg-red-600 hover:bg-red-500 active:bg-red-700 px-6 py-2.5 rounded-xl text-sm font-semibold transition-colors">
            Add Movie
          </button>
        </form>
      </div>

      {/* Movie Cards Grid */}
      {movies.length === 0 ? (
        <div className="text-center py-16 text-zinc-600">
          <p className="text-4xl mb-3">🎬</p>
          <p className="font-medium">No movies yet. Add one above!</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {movies.map((movie) => (
            <div
              key={movie._id}
              className={`bg-zinc-900 border rounded-2xl overflow-hidden transition-all ${
                movie.watched ? "border-zinc-700 opacity-75" : "border-zinc-800 hover:border-zinc-700"
              }`}
            >
              {/* Card Top Bar */}
              <div className={`h-1 w-full ${movie.watched ? "bg-green-600" : "bg-red-600"}`} />

              <div className="p-5 space-y-4">
                {/* Title Row */}
                <div className="flex items-start justify-between gap-3">
                  <div className="flex items-start gap-3 flex-1 min-w-0">
                    <button
                      onClick={() => toggleWatched(movie)}
                      className={`mt-0.5 w-5 h-5 rounded-full border-2 flex-shrink-0 flex items-center justify-center transition-all ${
                        movie.watched
                          ? "bg-green-600 border-green-600 text-white"
                          : "border-zinc-600 hover:border-red-500"
                      }`}
                    >
                      {movie.watched && (
                        <svg className="w-3 h-3" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3}>
                          <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                        </svg>
                      )}
                    </button>
                    <div className="min-w-0">
                      <p className={`font-semibold leading-tight truncate ${movie.watched ? "line-through text-zinc-500" : "text-white"}`}>
                        {movie.title}
                      </p>
                      <p className="text-zinc-500 text-xs mt-0.5">{movie.releaseYear}</p>
                    </div>
                  </div>
                  <span className={`flex-shrink-0 text-xs font-medium px-2.5 py-1 rounded-full ${
                    movie.watched ? "bg-green-950 text-green-400" : "bg-zinc-800 text-zinc-400"
                  }`}>
                    {movie.watched ? "Watched" : `${movie.runtime}m`}
                  </span>
                </div>

                {/* Meta */}
                <div className="flex items-center gap-3 text-xs text-zinc-500">
                  <span className="flex items-center gap-1">
                    <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                      <circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/>
                    </svg>
                    {movie.runtime} min
                  </span>
                  {movie.prerequisites?.length > 0 && (
                    <span className="flex items-center gap-1">
                      <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                        <path strokeLinecap="round" strokeLinejoin="round" d="M13 10V3L4 14h7v7l9-11h-7z"/>
                      </svg>
                      {movie.prerequisites.length} prereq{movie.prerequisites.length !== 1 ? "s" : ""}
                    </span>
                  )}
                </div>

                {/* Prerequisites Tags */}
                {movie.prerequisites?.length > 0 && editingPrereqs !== movie._id && (
                  <div className="flex flex-wrap gap-1.5">
                    {movie.prerequisites.map((p) => (
                      <span key={p._id || p} className="bg-zinc-800 text-zinc-400 text-xs px-2.5 py-1 rounded-full border border-zinc-700">
                        {p.title || p}
                      </span>
                    ))}
                  </div>
                )}

                {/* Prereq Editor */}
                {editingPrereqs === movie._id ? (
                  <div className="bg-zinc-800 rounded-xl p-4 space-y-3 border border-zinc-700">
                    <p className="text-xs font-medium text-zinc-300">Select prerequisites:</p>
                    <div className="flex flex-wrap gap-2">
                      {movies
                        .filter((m) => m._id !== movie._id)
                        .map((m) => (
                          <label
                            key={m._id}
                            className={`flex items-center gap-1.5 text-xs px-3 py-1.5 rounded-full border cursor-pointer transition-all ${
                              selectedPrereqs.includes(m._id)
                                ? "bg-red-600 border-red-500 text-white"
                                : "bg-zinc-900 border-zinc-700 text-zinc-400 hover:border-zinc-500"
                            }`}
                          >
                            <input
                              type="checkbox"
                              checked={selectedPrereqs.includes(m._id)}
                              onChange={() => togglePrereq(m._id)}
                              className="hidden"
                            />
                            {m.title}
                          </label>
                        ))}
                    </div>
                    {prereqError && <p className="text-red-400 text-xs">{prereqError}</p>}
                    <div className="flex gap-2">
                      <button onClick={savePrereqs} className="bg-red-600 hover:bg-red-500 px-4 py-1.5 rounded-lg text-xs font-medium transition-colors">
                        Save
                      </button>
                      <button onClick={() => setEditingPrereqs(null)} className="text-zinc-400 hover:text-white text-xs px-4 py-1.5 rounded-lg border border-zinc-700 hover:border-zinc-500 transition-colors">
                        Cancel
                      </button>
                    </div>
                  </div>
                ) : (
                  <button
                    onClick={() => openPrereqEditor(movie)}
                    className="w-full text-xs text-zinc-500 hover:text-zinc-300 border border-zinc-800 hover:border-zinc-700 rounded-xl py-2 transition-colors"
                  >
                    {movie.prerequisites?.length > 0 ? "Edit Prerequisites" : "+ Add Prerequisites"}
                  </button>
                )}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
