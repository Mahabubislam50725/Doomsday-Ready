"use client";
import { useState, useEffect } from "react";

const API = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000/api";

export default function RewatchPage() {
  const [movies, setMovies] = useState([]);
  const [targetId, setTargetId] = useState("");
  const [result, setResult] = useState(null);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    fetch(`${API}/movies`)
      .then((r) => r.json())
      .then((d) => { if (d.success) setMovies(d.data); });
  }, []);

  const handleFetch = async () => {
    if (!targetId) return;
    setLoading(true);
    setError("");
    setResult(null);
    const res = await fetch(`${API}/movies/${targetId}/rewatch-order`);
    const data = await res.json();
    setLoading(false);
    if (data.success) setResult(data.data);
    else setError(data.message);
  };

  const total = result?.order?.length ?? 0;
  const watched = result?.watchedCount ?? 0;
  const progress = total > 0 ? Math.round((watched / total) * 100) : 0;
  const hrs = Math.floor((result?.unwatchedRuntime ?? 0) / 60);
  const mins = (result?.unwatchedRuntime ?? 0) % 60;
  const targetMovie = movies.find((m) => m._id === targetId);

  return (
    <div className="space-y-8">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold text-white">Rewatch Plan</h1>
        <p className="text-zinc-400 text-sm mt-1">Find out what to watch before your target movie</p>
      </div>

      {/* Selector Card */}
      <div className="bg-zinc-900 rounded-2xl border border-zinc-800 overflow-hidden">
        <div className="px-5 py-4 border-b border-zinc-800 flex items-center gap-2">
          <span className="text-red-500">🎯</span>
          <h2 className="font-semibold text-zinc-200">Pick Your Target</h2>
        </div>
        <div className="p-5 space-y-3">
          <div className="flex gap-3 flex-wrap items-end">
            <div className="flex-1 min-w-48">
              <label className="text-xs text-zinc-500 mb-1.5 block uppercase tracking-wide">Target Movie</label>
              <select
                className="w-full bg-zinc-800 border border-zinc-700 rounded-xl px-4 py-2.5 text-sm outline-none focus:border-red-500 focus:ring-1 focus:ring-red-500 transition-colors"
                value={targetId}
                onChange={(e) => { setTargetId(e.target.value); setResult(null); setError(""); }}
              >
                <option value="">Select a movie...</option>
                {movies.map((m) => (
                  <option key={m._id} value={m._id}>{m.title}</option>
                ))}
              </select>
            </div>
            <button
              onClick={handleFetch}
              disabled={!targetId || loading}
              className="bg-red-600 hover:bg-red-500 disabled:opacity-40 disabled:cursor-not-allowed px-6 py-2.5 rounded-xl text-sm font-semibold transition-colors"
            >
              {loading ? "Loading..." : "Get Plan"}
            </button>
          </div>
          {error && (
            <div className="bg-red-950 border border-red-800 rounded-xl px-4 py-2.5 text-red-400 text-sm">
              {error}
            </div>
          )}
        </div>
      </div>

      {/* Results */}
      {result && (
        <div className="space-y-4">
          {total === 0 ? (
            <div className="bg-zinc-900 border border-zinc-800 rounded-2xl p-8 text-center">
              <p className="text-4xl mb-3">🚀</p>
              <p className="font-semibold text-white">You&apos;re ready to watch!</p>
              <p className="text-zinc-400 text-sm mt-1">
                <span className="text-red-400 font-medium">{targetMovie?.title}</span> has no prerequisites.
              </p>
            </div>
          ) : (
            <>
              {/* Stats Cards */}
              <div className="grid grid-cols-3 gap-3">
                <div className="bg-zinc-900 border border-zinc-800 rounded-2xl p-4 text-center">
                  <p className="text-2xl font-bold text-white">{total}</p>
                  <p className="text-zinc-500 text-xs mt-0.5">Total</p>
                </div>
                <div className="bg-zinc-900 border border-zinc-800 rounded-2xl p-4 text-center">
                  <p className="text-2xl font-bold text-green-400">{watched}</p>
                  <p className="text-zinc-500 text-xs mt-0.5">Watched</p>
                </div>
                <div className="bg-zinc-900 border border-zinc-800 rounded-2xl p-4 text-center">
                  <p className="text-2xl font-bold text-red-400">{total - watched}</p>
                  <p className="text-zinc-500 text-xs mt-0.5">Remaining</p>
                </div>
              </div>

              {/* Progress Card */}
              <div className="bg-zinc-900 border border-zinc-800 rounded-2xl p-5 space-y-3">
                <div className="flex justify-between items-center">
                  <span className="text-sm font-medium text-zinc-300">{watched} of {total} watched</span>
                  <span className="text-sm text-zinc-500">
                    {result.unwatchedRuntime > 0
                      ? `${hrs > 0 ? `${hrs}h ` : ""}${mins}m left`
                      : "✓ All done!"}
                  </span>
                </div>
                <div className="w-full bg-zinc-800 rounded-full h-2.5">
                  <div
                    className="bg-gradient-to-r from-red-600 to-red-400 h-2.5 rounded-full transition-all duration-500"
                    style={{ width: `${progress}%` }}
                  />
                </div>
                <p className="text-xs text-zinc-600">{progress}% complete</p>
              </div>

              {/* Ordered Movie Cards */}
              <div className="space-y-2">
                {result.order.map((movie, i) => (
                  <div
                    key={movie._id}
                    className={`flex items-center gap-4 bg-zinc-900 border rounded-2xl px-5 py-4 transition-all ${
                      movie.watched ? "border-zinc-800 opacity-60" : "border-zinc-800 hover:border-zinc-700"
                    }`}
                  >
                    <span className="text-zinc-700 font-bold text-sm w-6 text-center flex-shrink-0">{i + 1}</span>
                    <div className={`w-2 h-2 rounded-full flex-shrink-0 ${movie.watched ? "bg-green-500" : "bg-red-500"}`} />
                    <span className={`flex-1 font-medium ${movie.watched ? "line-through text-zinc-500" : "text-white"}`}>
                      {movie.title}
                    </span>
                    <span className="text-zinc-600 text-sm flex-shrink-0">{movie.runtime}m</span>
                    {movie.watched && (
                      <span className="bg-green-950 text-green-400 text-xs font-medium px-2.5 py-1 rounded-full flex-shrink-0">
                        ✓ Done
                      </span>
                    )}
                  </div>
                ))}
              </div>
            </>
          )}
        </div>
      )}
    </div>
  );
}
