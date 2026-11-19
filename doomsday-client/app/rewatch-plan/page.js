"use client";
import { useState, useEffect } from "react";
import { Target, Film, CheckCircle2, Clock, ListOrdered } from "lucide-react";
import { api } from "@/services/api";
import RewatchProgress from "@/components/rewatch/RewatchProgress";
import RewatchTimeline from "@/components/rewatch/RewatchTimeline";
import StatCard from "@/components/common/StatCard";
import LoadingSpinner from "@/components/common/LoadingSpinner";
import ErrorMessage from "@/components/common/ErrorMessage";

export default function RewatchPlanPage() {
  const [movies, setMovies] = useState([]);
  const [targetId, setTargetId] = useState("");
  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    api.getMovies()
      .then((d) => setMovies(d.data))
      .catch(() => {});
  }, []);

  const handleGetPlan = async () => {
    if (!targetId) return;
    setLoading(true);
    setError("");
    setResult(null);
    try {
      const data = await api.getRewatchOrder(targetId);
      setResult(data.data);
    } catch (err) {
      setError(err.message || "Failed to get rewatch order.");
    } finally {
      setLoading(false);
    }
  };

  const total = result?.order?.length ?? 0;
  const watched = result?.watchedCount ?? 0;
  const unwatchedRuntime = result?.unwatchedRuntime ?? 0;
  const hrs = Math.floor(unwatchedRuntime / 60);
  const mins = unwatchedRuntime % 60;
  const targetMovie = movies.find((m) => m._id === targetId);

  return (
    <div className="space-y-8">
      {/* Hero */}
      <div className="relative bg-gradient-to-br from-zinc-900 via-zinc-900 to-red-950/30 border border-zinc-800 rounded-2xl overflow-hidden px-6 py-8">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top_right,_rgba(220,38,38,0.08),_transparent_60%)]" />
        <div className="relative">
          <div className="flex items-center gap-2 text-red-500 text-xs font-semibold uppercase tracking-widest mb-3">
            <span className="w-4 h-px bg-red-500" />
            MCU Rewatch Planner
          </div>
          <h2 className="text-2xl sm:text-3xl font-bold text-white leading-tight">
            Your Ultimate<br />
            <span className="text-red-400">Rewatch Plan</span>
          </h2>
          <p className="text-zinc-400 text-sm mt-2 max-w-md">
            Select your target movie and get the perfect watch order to prepare for Avengers: Doomsday.
          </p>
        </div>
      </div>

      {/* Target Selector */}
      <div className="bg-zinc-900 border border-zinc-800 rounded-2xl overflow-hidden">
        <div className="px-5 py-4 border-b border-zinc-800 flex items-center gap-2">
          <Target className="w-4 h-4 text-red-400" />
          <h3 className="font-semibold text-zinc-200">Pick Your Target Movie</h3>
        </div>
        <div className="p-5">
          <div className="flex gap-3 flex-wrap items-end">
            <div className="flex-1 min-w-52">
              <label className="text-xs text-zinc-500 uppercase tracking-wide mb-1.5 block">Target Movie</label>
              <select
                className="w-full bg-zinc-800 border border-zinc-700 rounded-xl px-4 py-2.5 text-sm text-white outline-none focus:border-red-500 focus:ring-1 focus:ring-red-500/30 transition-all"
                value={targetId}
                onChange={(e) => { setTargetId(e.target.value); setResult(null); setError(""); }}
              >
                <option value="">Select a movie...</option>
                {movies.map((m) => (
                  <option key={m._id} value={m._id}>{m.title} ({m.releaseYear})</option>
                ))}
              </select>
            </div>
            <button
              onClick={handleGetPlan}
              disabled={!targetId || loading}
              className="bg-red-600 hover:bg-red-500 disabled:opacity-40 disabled:cursor-not-allowed text-white px-6 py-2.5 rounded-xl text-sm font-semibold transition-all shadow-lg shadow-red-900/20"
            >
              {loading ? "Loading..." : "Get Plan"}
            </button>
          </div>
          <ErrorMessage message={error} onDismiss={() => setError("")} />
        </div>
      </div>

      {/* Loading */}
      {loading && (
        <div className="py-12"><LoadingSpinner size="lg" text="Calculating rewatch order..." /></div>
      )}

      {/* Results */}
      {result && !loading && (
        <div className="space-y-5">
          {total === 0 ? (
            <div className="bg-zinc-900 border border-zinc-800 rounded-2xl p-10 text-center">
              <div className="text-5xl mb-4">🚀</div>
              <p className="text-white font-semibold text-lg">You&apos;re ready to watch!</p>
              <p className="text-zinc-400 text-sm mt-1">
                <span className="text-red-400 font-medium">{targetMovie?.title}</span> has no prerequisites — dive right in!
              </p>
            </div>
          ) : (
            <>
              {/* Stats */}
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                <StatCard icon={<Film className="w-5 h-5" />} label="Required" value={total} accent="zinc" />
                <StatCard icon={<CheckCircle2 className="w-5 h-5" />} label="Watched" value={watched} accent="green" />
                <StatCard icon={<ListOrdered className="w-5 h-5" />} label="Remaining" value={total - watched} accent="red" />
                <StatCard
                  icon={<Clock className="w-5 h-5" />}
                  label="Time Left"
                  value={unwatchedRuntime > 0 ? `${hrs > 0 ? `${hrs}h ` : ""}${mins}m` : "Done!"}
                  accent={unwatchedRuntime > 0 ? "orange" : "green"}
                />
              </div>

              {/* Progress */}
              <RewatchProgress total={total} watched={watched} unwatchedRuntime={unwatchedRuntime} />

              {/* Timeline */}
              <div>
                <h3 className="text-zinc-300 font-semibold mb-3 flex items-center gap-2">
                  <ListOrdered className="w-4 h-4 text-red-400" />
                  Watch Order
                </h3>
                <RewatchTimeline order={result.order} />
              </div>
            </>
          )}
        </div>
      )}
    </div>
  );
}
