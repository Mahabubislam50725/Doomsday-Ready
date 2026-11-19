"use client";
import { useState, useEffect, useCallback } from "react";
import { Ticket, Building2, Users, CheckCircle2, Plus } from "lucide-react";
import { api } from "@/services/api";
import BookingResult from "@/components/booking/BookingResult";
import LoadingSpinner from "@/components/common/LoadingSpinner";
import ErrorMessage from "@/components/common/ErrorMessage";
import EmptyState from "@/components/common/EmptyState";
import SearchableSelect from "@/components/common/SearchableSelect";

export default function BookingPage() {
  const [cinemas, setCinemas] = useState([]);
  const [loading, setLoading] = useState(true);

  // Add Cinema form
  const [form, setForm] = useState({ name: "", bundleSizes: "" });
  const [formError, setFormError] = useState("");
  const [formLoading, setFormLoading] = useState(false);

  // Booking
  const [selectedCinema, setSelectedCinema] = useState("");
  const [groupSize, setGroupSize] = useState("");
  const [result, setResult] = useState(null);
  const [quoteError, setQuoteError] = useState("");
  const [quoteLoading, setQuoteLoading] = useState(false);

  const fetchCinemas = useCallback(async () => {
    try {
      const data = await api.getCinemas();
      setCinemas(data.data);
    } catch {}
    finally { setLoading(false); }
  }, []);

  useEffect(() => { fetchCinemas(); }, [fetchCinemas]);

  const handleCreateCinema = async (e) => {
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

  const handleSelectCinema = (id) => {
    setSelectedCinema((prev) => prev === id ? "" : id);
    setResult(null);
    setQuoteError("");
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
        <h2 className="text-2xl font-bold text-white">Cinemas & Booking</h2>
        <p className="text-zinc-500 text-sm mt-1">Manage cinemas and book your opening-night watch party.</p>
      </div>

      {/* Add Cinema Form */}
      <div className="bg-zinc-900 border border-zinc-800 rounded-2xl overflow-hidden">
        <div className="px-5 py-4 border-b border-zinc-800 flex items-center gap-2">
          <Plus className="w-4 h-4 text-red-400" />
          <h3 className="font-semibold text-zinc-200">Add New Cinema</h3>
        </div>
        <form onSubmit={handleCreateCinema} className="p-5 space-y-3">
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

      {/* Cinema Cards */}
      <div>
        <div className="flex items-center justify-between mb-3">
          <h3 className="font-semibold text-zinc-200 flex items-center gap-2">
            <Building2 className="w-4 h-4 text-red-400" />
            Select a Cinema
          </h3>
          {selectedCinema && (
            <button
              onClick={() => { setSelectedCinema(""); setResult(null); }}
              className="text-xs text-zinc-500 hover:text-zinc-300 transition-colors"
            >
              Clear selection
            </button>
          )}
        </div>

        {loading ? (
          <div className="py-12"><LoadingSpinner size="lg" text="Loading cinemas..." /></div>
        ) : cinemas.length === 0 ? (
          <EmptyState icon="🎭" title="No cinemas yet" description="Add your first cinema above." />
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {cinemas.map((c) => {
              const isSelected = selectedCinema === c._id;
              return (
                <button
                  key={c._id}
                  onClick={() => handleSelectCinema(c._id)}
                  className={`text-left bg-zinc-900 border rounded-2xl p-4 space-y-3 transition-all duration-200 hover:shadow-lg hover:shadow-black/40 ${
                    isSelected
                      ? "border-red-500/60 ring-1 ring-red-500/30 bg-red-950/10"
                      : "border-zinc-800 hover:border-zinc-700"
                  }`}
                >
                  <div className="flex items-center justify-between gap-2">
                    <div className="flex items-center gap-2 min-w-0">
                      <div className={`w-8 h-8 rounded-lg flex items-center justify-center flex-shrink-0 ${
                        isSelected ? "bg-red-600/20 border border-red-500/30" : "bg-zinc-800 border border-zinc-700"
                      }`}>
                        <Building2 className={`w-4 h-4 ${isSelected ? "text-red-400" : "text-zinc-500"}`} />
                      </div>
                      <p className={`font-semibold truncate ${isSelected ? "text-white" : "text-zinc-300"}`}>
                        {c.name}
                      </p>
                    </div>
                    {isSelected && <CheckCircle2 className="w-5 h-5 text-red-400 flex-shrink-0" />}
                  </div>
                  <div className="flex flex-wrap gap-1.5">
                    {c.bundleSizes.map((s) => (
                      <span
                        key={s}
                        className={`text-xs px-2.5 py-1 rounded-full border ${
                          isSelected
                            ? "bg-red-600/10 border-red-500/30 text-red-300"
                            : "bg-zinc-800 border-zinc-700 text-zinc-400"
                        }`}
                      >
                        {s} seats
                      </span>
                    ))}
                  </div>
                  <p className={`text-xs ${isSelected ? "text-red-400 font-medium" : "text-zinc-600"}`}>
                    {isSelected ? "✓ Selected — enter group size below" : "Click to select"}
                  </p>
                </button>
              );
            })}
          </div>
        )}
      </div>

      {/* Booking Quote */}
      <div className="bg-zinc-900 border border-zinc-800 rounded-2xl overflow-hidden">
        <div className="px-5 py-4 border-b border-zinc-800 flex items-center gap-2">
          <Ticket className="w-4 h-4 text-red-400" />
          <h3 className="font-semibold text-zinc-200">Get Booking Quote</h3>
        </div>
        <div className="p-5 space-y-4">
          <div>
            <label className="text-xs text-zinc-500 uppercase tracking-wide mb-1.5 block">Cinema</label>
            <SearchableSelect
              options={cinemas.map((c) => ({
                value: c._id,
                label: c.name,
                sub: c.bundleSizes.join(", ") + " seats",
              }))}
              value={selectedCinema}
              onChange={(val) => { setSelectedCinema(val); setResult(null); setQuoteError(""); }}
              placeholder="Search and select a cinema..."
            />
          </div>

          {activeCinema && (
            <div className="flex items-center gap-3 bg-red-950/20 border border-red-800/30 rounded-xl px-4 py-3">
              <Building2 className="w-4 h-4 text-red-400 flex-shrink-0" />
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium text-white truncate">{activeCinema.name}</p>
                <p className="text-xs text-zinc-500 mt-0.5">Bundles: {activeCinema.bundleSizes.join(", ")} seats</p>
              </div>
            </div>
          )}

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
            <BookingResult result={result} groupSize={groupSize} cinemaName={activeCinema?.name} />
          )}
        </div>
      </div>
    </div>
  );
}
