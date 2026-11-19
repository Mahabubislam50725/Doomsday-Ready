"use client";
import { useState, useEffect, useCallback } from "react";
import { Building2, Plus } from "lucide-react";
import { api } from "@/services/api";
import LoadingSpinner from "@/components/common/LoadingSpinner";
import ErrorMessage from "@/components/common/ErrorMessage";
import EmptyState from "@/components/common/EmptyState";

export default function CinemasPage() {
  const [cinemas, setCinemas] = useState([]);
  const [loading, setLoading] = useState(true);
  const [form, setForm] = useState({ name: "", bundleSizes: "" });
  const [formError, setFormError] = useState("");
  const [formLoading, setFormLoading] = useState(false);

  const fetchCinemas = useCallback(async () => {
    try {
      const data = await api.getCinemas();
      setCinemas(data.data);
    } catch {}
    finally { setLoading(false); }
  }, []);

  useEffect(() => { fetchCinemas(); }, [fetchCinemas]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setFormError("");
    setFormLoading(true);
    const sizes = form.bundleSizes
      .split(",")
      .map((s) => Number(s.trim()))
      .filter((n) => !isNaN(n) && n > 0);
    try {
      await api.createCinema({ name: form.name, bundleSizes: sizes });
      setForm({ name: "", bundleSizes: "" });
      await fetchCinemas();
    } catch (err) {
      setFormError(err.message || "Failed to create cinema.");
    } finally {
      setFormLoading(false);
    }
  };

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex items-start justify-between gap-4">
        <div>
          <h2 className="text-2xl font-bold text-white">Cinemas</h2>
          <p className="text-zinc-500 text-sm mt-1">Manage cinemas and their opening-night bundle sizes.</p>
        </div>
        <div className="bg-zinc-900 border border-zinc-800 rounded-xl px-4 py-2 text-center">
          <p className="text-2xl font-bold text-red-400">{cinemas.length}</p>
          <p className="text-zinc-500 text-xs">Total</p>
        </div>
      </div>

      {/* Add Cinema Form */}
      <div className="bg-zinc-900 border border-zinc-800 rounded-2xl overflow-hidden">
        <div className="px-5 py-4 border-b border-zinc-800 flex items-center gap-2">
          <Plus className="w-4 h-4 text-red-400" />
          <h3 className="font-semibold text-zinc-200">Add New Cinema</h3>
        </div>
        <form onSubmit={handleSubmit} className="p-5 space-y-3">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="text-xs text-zinc-500 uppercase tracking-wide mb-1.5 block">Cinema Name</label>
              <input
                className="w-full bg-zinc-800 border border-zinc-700 rounded-xl px-4 py-2.5 text-sm text-white outline-none focus:border-red-500 focus:ring-1 focus:ring-red-500/30 transition-all placeholder:text-zinc-600"
                placeholder="e.g. IMAX Cineplex"
                value={form.name}
                onChange={(e) => setForm({ ...form, name: e.target.value })}
                required
              />
            </div>
            <div>
              <label className="text-xs text-zinc-500 uppercase tracking-wide mb-1.5 block">Bundle Sizes (comma-separated)</label>
              <input
                className="w-full bg-zinc-800 border border-zinc-700 rounded-xl px-4 py-2.5 text-sm text-white outline-none focus:border-red-500 focus:ring-1 focus:ring-red-500/30 transition-all placeholder:text-zinc-600"
                placeholder="e.g. 2, 5, 10"
                value={form.bundleSizes}
                onChange={(e) => setForm({ ...form, bundleSizes: e.target.value })}
                required
              />
            </div>
          </div>
          <ErrorMessage message={formError} onDismiss={() => setFormError("")} />
          <button
            type="submit"
            disabled={formLoading}
            className="flex items-center gap-2 bg-red-600 hover:bg-red-500 disabled:opacity-50 text-white px-5 py-2.5 rounded-xl text-sm font-semibold transition-all shadow-lg shadow-red-900/30"
          >
            {formLoading ? <LoadingSpinner size="sm" /> : <Plus className="w-4 h-4" />}
            Add Cinema
          </button>
        </form>
      </div>

      {/* Cinema List */}
      {loading ? (
        <div className="py-20"><LoadingSpinner size="lg" text="Loading cinemas..." /></div>
      ) : cinemas.length === 0 ? (
        <EmptyState icon="🎭" title="No cinemas yet" description="Add your first cinema above." />
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {cinemas.map((c) => (
            <div key={c._id} className="bg-zinc-900 border border-zinc-800 hover:border-zinc-700 rounded-2xl p-5 space-y-3 transition-all">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-red-500/10 border border-red-500/20 flex items-center justify-center flex-shrink-0">
                  <Building2 className="w-5 h-5 text-red-400" />
                </div>
                <div className="min-w-0">
                  <p className="font-semibold text-white truncate">{c.name}</p>
                  <p className="text-zinc-500 text-xs mt-0.5">{c.bundleSizes.length} bundle size{c.bundleSizes.length > 1 ? "s" : ""}</p>
                </div>
              </div>
              <div className="flex flex-wrap gap-1.5">
                {c.bundleSizes.map((s) => (
                  <span key={s} className="bg-zinc-800 border border-zinc-700 text-zinc-400 text-xs px-2.5 py-1 rounded-full">
                    {s} seats
                  </span>
                ))}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
