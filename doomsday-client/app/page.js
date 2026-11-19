"use client";
import { useState, useEffect } from "react";

const API = "http://localhost:5000/api";

export default function MoviesPage() {
  const [movies, setMovies] = useState([]);
  const [form, setForm] = useState({ title: "", releaseYear: "", runtime: "" });
  const [error, setError] = useState("");
  const [editingPrereqs, setEditingPrereqs] = useState(null); // movie id being edited
  const [selectedPrereqs, setSelectedPrereqs] = useState([]);

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
    setError("");
  };

  const savePrereqs = async () => {
    setError("");
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
      setError(data.error === "CIRCULAR_DEPENDENCY" ? "⚠ Circular dependency detected!" : data.message);
    }
  };

  const togglePrereq = (id) => {
    setSelectedPrereqs((prev) =>
      prev.includes(id) ? prev.filter((p) => p !== id) : [...prev, id]
    );
  };

  return (
    <div className="space-y-8">
      <h1 className="text-2xl font-bold text-red-400">Movies</h1>

      {/* Add Movie Form */}
      <form onSubmit={handleCreate} className="bg-zinc-900 rounded-xl p-5 space-y-3 border border-zinc-800">
        <h2 className="font-semibold text-zinc-300">Add Movie</h2>
        <div className="flex gap-3 flex-wrap">
          <input
            className="flex-1 min-w-40 bg-zinc-800 rounded-lg px-3 py-2 text-sm outline-none focus:ring-1 focus:ring-red-500"
            placeholder="Title"
            value={form.title}
            onChange={(e) => setForm({ ...form, title: e.target.value })}
            required
          />
          <input
            className="w-32 bg-zinc-800 rounded-lg px-3 py-2 text-sm outline-none focus:ring-1 focus:ring-red-500"
            placeholder="Year"
            type="number"
            value={form.releaseYear}
            onChange={(e) => setForm({ ...form, releaseYear: e.target.value })}
            required
          />
          <input
            className="w-32 bg-zinc-800 rounded-lg px-3 py-2 text-sm outline-none focus:ring-1 focus:ring-red-500"
            placeholder="Runtime (min)"
            type="number"
            value={form.runtime}
            onChange={(e) => setForm({ ...form, runtime: e.target.value })}
            required
          />
          <button className="bg-red-600 hover:bg-red-500 px-4 py-2 rounded-lg text-sm font-medium transition-colors">
            Add
          </button>
        </div>
        {error && <p className="text-red-400 text-sm">{error}</p>}
      </form>

      {/* Movie List */}
      <div className="space-y-3">
        {movies.map((movie) => (
          <div key={movie._id} className="bg-zinc-900 border border-zinc-800 rounded-xl p-4">
            <div className="flex items-center justify-between gap-4 flex-wrap">
              <div className="flex items-center gap-3">
                <input
                  type="checkbox"
                  checked={movie.watched}
                  onChange={() => toggleWatched(movie)}
                  className="w-4 h-4 accent-red-500 cursor-pointer"
                />
                <span className={`font-medium ${movie.watched ? "line-through text-zinc-500" : ""}`}>
                  {movie.title}
                </span>
                <span className="text-zinc-500 text-sm">{movie.releaseYear} · {movie.runtime}m</span>
              </div>
              <button
                onClick={() => openPrereqEditor(movie)}
                className="text-xs text-zinc-400 hover:text-white border border-zinc-700 rounded-lg px-3 py-1 transition-colors"
              >
                Edit Prerequisites
              </button>
            </div>

            {movie.prerequisites?.length > 0 && (
              <p className="text-xs text-zinc-500 mt-2 ml-7">
                Prereqs: {movie.prerequisites.map((p) => p.title || p).join(", ")}
              </p>
            )}

            {/* Inline prerequisite editor */}
            {editingPrereqs === movie._id && (
              <div className="mt-3 ml-7 space-y-2">
                <p className="text-xs text-zinc-400">Select prerequisites:</p>
                <div className="flex flex-wrap gap-2">
                  {movies
                    .filter((m) => m._id !== movie._id)
                    .map((m) => (
                      <label key={m._id} className="flex items-center gap-1 text-xs cursor-pointer">
                        <input
                          type="checkbox"
                          checked={selectedPrereqs.includes(m._id)}
                          onChange={() => togglePrereq(m._id)}
                          className="accent-red-500"
                        />
                        {m.title}
                      </label>
                    ))}
                </div>
                {error && <p className="text-red-400 text-xs">{error}</p>}
                <div className="flex gap-2">
                  <button onClick={savePrereqs} className="bg-red-600 hover:bg-red-500 px-3 py-1 rounded-lg text-xs transition-colors">
                    Save
                  </button>
                  <button onClick={() => setEditingPrereqs(null)} className="text-zinc-400 hover:text-white text-xs px-3 py-1 rounded-lg border border-zinc-700 transition-colors">
                    Cancel
                  </button>
                </div>
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}
