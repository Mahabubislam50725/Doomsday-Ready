"use client";
import { useState, useEffect } from "react";

const API = "http://localhost:5000/api";

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

  return (
    <div className="space-y-8">
      <h1 className="text-2xl font-bold text-red-400">Rewatch Plan</h1>

      <div className="bg-zinc-900 border border-zinc-800 rounded-xl p-5 space-y-4">
        <div className="flex gap-3 flex-wrap items-end">
          <div className="flex-1 min-w-48">
            <label className="text-xs text-zinc-400 mb-1 block">Target Movie</label>
            <select
              className="w-full bg-zinc-800 rounded-lg px-3 py-2 text-sm outline-none focus:ring-1 focus:ring-red-500"
              value={targetId}
              onChange={(e) => { setTargetId(e.target.value); setResult(null); }}
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
            className="bg-red-600 hover:bg-red-500 disabled:opacity-50 px-5 py-2 rounded-lg text-sm font-medium transition-colors"
          >
            {loading ? "Loading..." : "Get Plan"}
          </button>
        </div>
        {error && <p className="text-red-400 text-sm">{error}</p>}
      </div>

      {result && (
        <div className="space-y-4">
          {total === 0 ? (
            <p className="text-zinc-400">No prerequisites needed — you can watch this right now!</p>
          ) : (
            <>
              {/* Progress bar */}
              <div className="bg-zinc-900 border border-zinc-800 rounded-xl p-4 space-y-2">
                <div className="flex justify-between text-sm">
                  <span className="text-zinc-300">{watched} of {total} watched</span>
                  <span className="text-zinc-400">
                    {result.unwatchedRuntime > 0
                      ? `${hrs > 0 ? `${hrs}h ` : ""}${mins}m remaining`
                      : "All done!"}
                  </span>
                </div>
                <div className="w-full bg-zinc-800 rounded-full h-2">
                  <div
                    className="bg-red-500 h-2 rounded-full transition-all"
                    style={{ width: `${progress}%` }}
                  />
                </div>
              </div>

              {/* Ordered list */}
              <div className="space-y-2">
                {result.order.map((movie, i) => (
                  <div
                    key={movie._id}
                    className="flex items-center gap-3 bg-zinc-900 border border-zinc-800 rounded-xl px-4 py-3"
                  >
                    <span className="text-zinc-600 text-sm w-5">{i + 1}</span>
                    <span className={`flex-1 font-medium ${movie.watched ? "line-through text-zinc-500" : ""}`}>
                      {movie.title}
                    </span>
                    <span className="text-zinc-500 text-sm">{movie.runtime}m</span>
                    {movie.watched && (
                      <span className="text-green-500 text-xs font-medium">✓ Watched</span>
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
