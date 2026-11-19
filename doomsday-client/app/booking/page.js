"use client";
import { useState, useEffect } from "react";
import { Ticket, Plus, Building2, Users } from "lucide-react";
import { api } from "@/services/api";
import BookingResult from "@/components/booking/BookingResult";
import LoadingSpinner from "@/components/common/LoadingSpinner";
import ErrorMessage from "@/components/common/ErrorMessage";

export default function BookingPage() {
  const [cinemas, setCinemas] = useState([]);
  const [cinemaForm, setCinemaForm] = useState({ name: "", bundleSizes: "" });
  const [cinemaError, setCinemaError] = useState("");
  const [cinemaLoading, setCinemaLoading] = useState(false);

  const [selectedCinema, setSelectedCinema] = useState("");
  const [groupSize, setGroupSize] = useState("");
  const [result, setResult] = useState(null);
  const [quoteError, setQuoteError] = useState("");
  const [quoteLoading, setQuoteLoading] = useState(false);

  const fetchCinemas = async () => {
    try {
      const data = await api.getCinemas();
      setCinemas(data.data);
    } catch {}
  };

  useEffect(() => { fetchCinemas(); }, []);

  const handleCreateCinema = async (e) => {
    e.preventDefault();
    setCinemaError("");
    setCinemaLoading(true);
    const sizes = cinemaForm.bundleSizes
      .split(",")
      .map((s) => Number(s.trim()))
      .filter((n) => !isNaN(n) && n > 0);
    try {
      await api.createCinema({ name: cinemaForm.name, bundleSizes: sizes });
      setCinemaForm({ name: "", bundleSizes: "" });
      await fetchCinemas();
    } catch (err) {
      setCinemaError(err.message || "Failed to create cinema.");
    } finally {
      setCinemaLoading(false);
    }
  };

  const handleQuote = async () => {
    if (!selectedCinema || !groupSize) return;
    setQuoteError("");
    setResult(null);
    setQuoteLoading(true);
    try {
      const data = await api.getBookingQuote(selectedCinema, groupSize);
      setResult(data.data);
    } catch (err) {
      setQuoteError(err.message || "Failed to get booking quote.");
    } finally {
      setQuoteLoading(false);
    }
  };

  const activeCinema = cinemas.find((c) => c._id === selectedCinema);

  return (
    <div className="space-y-8">
      {/* Header */}
      <div>
        <h2 className="text-2xl font-bold text-white">Plan Your Watch Party</h2>
        <p className="text-zinc-500 text-sm mt-1">Find the minimum number of cinema bundles needed for your group.</p>
      </div>

      {/* Add Cinema */}
      <div className="bg-zinc-900 border border-zinc-800 rounded-2xl overflow-hidden">
        <div className="px-5 py-4 border-b border-zinc-800 flex items-center gap-2">
          <Building2 className="w-4 h-4 text-red-400" />
          <h3 className="font-semibold text-zinc-200">Add Cinema</h3>
        </div>
        <form onSubmit={handleCreateCinema} className="p-5 space-y-3">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="text-xs text-zinc-500 uppercase tracking-wide mb-1.5 block">Cinema Name</label>
              <input
                className="w-full bg-zinc-800 border border-zinc-700 rounded-xl px-4 py-2.5 text-sm text-white outline-none focus:border-red-500 focus:ring-1 focus:ring-red-500/30 transition-all placeholder:text-zinc-600"
                placeholder="e.g. IMAX Cineplex"
                value={cinemaForm.name}
                onChange={(e) => setCinemaForm({ ...cinemaForm, name: e.target.value })}
                required
              />
            </div>
            <div>
              <label className="text-xs text-zinc-500 uppercase tracking-wide mb-1.5 block">Bundle Sizes (comma-separated)</label>
              <input
                className="w-full bg-zinc-800 border border-zinc-700 rounded-xl px-4 py-2.5 text-sm text-white outline-none focus:border-red-500 focus:ring-1 focus:ring-red-500/30 transition-all placeholder:text-zinc-600"
                placeholder="e.g. 2, 5, 10"
                value={cinemaForm.bundleSizes}
                onChange={(e) => setCinemaForm({ ...cinemaForm, bundleSizes: e.target.value })}
                required
              />
            </div>
          </div>
          <ErrorMessage message={cinemaError} onDismiss={() => setCinemaError("")} />
          <button
            type="submit"
            disabled={cinemaLoading}
            className="flex items-center gap-2 bg-red-600 hover:bg-red-500 disabled:opacity-50 text-white px-5 py-2.5 rounded-xl text-sm font-semibold transition-all"
          >
            {cinemaLoading ? <LoadingSpinner size="sm" /> : <Plus className="w-4 h-4" />}
            Add Cinema
          </button>
        </form>
      </div>

      {/* Cinema Cards */}
      {cinemas.length > 0 && (
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          {cinemas.map((c) => (
            <div key={c._id} className="bg-zinc-900 border border-zinc-800 rounded-2xl p-4 space-y-2.5">
              <div className="flex items-center gap-2">
                <Building2 className="w-4 h-4 text-zinc-500 flex-shrink-0" />
                <p className="font-semibold text-white truncate">{c.name}</p>
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

      {/* Booking Quote */}
      <div className="bg-zinc-900 border border-zinc-800 rounded-2xl overflow-hidden">
        <div className="px-5 py-4 border-b border-zinc-800 flex items-center gap-2">
          <Ticket className="w-4 h-4 text-red-400" />
          <h3 className="font-semibold text-zinc-200">Get Booking Quote</h3>
        </div>
        <div className="p-5 space-y-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="text-xs text-zinc-500 uppercase tracking-wide mb-1.5 block">Cinema</label>
              <select
                className="w-full bg-zinc-800 border border-zinc-700 rounded-xl px-4 py-2.5 text-sm text-white outline-none focus:border-red-500 focus:ring-1 focus:ring-red-500/30 transition-all"
                value={selectedCinema}
                onChange={(e) => { setSelectedCinema(e.target.value); setResult(null); setQuoteError(""); }}
              >
                <option value="">Select a cinema...</option>
                {cinemas.map((c) => (
                  <option key={c._id} value={c._id}>{c.name}</option>
                ))}
              </select>
            </div>
            <div>
              <label className="text-xs text-zinc-500 uppercase tracking-wide mb-1.5 block">Group Size (1–10,000)</label>
              <input
                type="number"
                min="1"
                max="10000"
                className="w-full bg-zinc-800 border border-zinc-700 rounded-xl px-4 py-2.5 text-sm text-white outline-none focus:border-red-500 focus:ring-1 focus:ring-red-500/30 transition-all placeholder:text-zinc-600"
                placeholder="e.g. 11"
                value={groupSize}
                onChange={(e) => { setGroupSize(e.target.value); setResult(null); setQuoteError(""); }}
              />
            </div>
          </div>

          {activeCinema && (
            <p className="text-xs text-zinc-600 flex items-center gap-1.5">
              <Ticket className="w-3 h-3" />
              Available bundles: {activeCinema.bundleSizes.map((s) => `${s} seats`).join(", ")}
            </p>
          )}

          <ErrorMessage message={quoteError} onDismiss={() => setQuoteError("")} />

          <button
            onClick={handleQuote}
            disabled={!selectedCinema || !groupSize || quoteLoading}
            className="flex items-center gap-2 bg-red-600 hover:bg-red-500 disabled:opacity-40 disabled:cursor-not-allowed text-white px-6 py-2.5 rounded-xl text-sm font-semibold transition-all shadow-lg shadow-red-900/20"
          >
            {quoteLoading ? <LoadingSpinner size="sm" /> : <Users className="w-4 h-4" />}
            {quoteLoading ? "Calculating..." : "Calculate Bundles"}
          </button>

          {result && (
            <BookingResult
              result={result}
              groupSize={groupSize}
              cinemaName={activeCinema?.name}
            />
          )}
        </div>
      </div>
    </div>
  );
}
