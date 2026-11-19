"use client";
import { useState, useEffect } from "react";

const API = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000/api";

export default function BookingPage() {
  const [cinemas, setCinemas] = useState([]);
  const [cinemaForm, setCinemaForm] = useState({ name: "", bundleSizes: "" });
  const [selectedCinema, setSelectedCinema] = useState("");
  const [groupSize, setGroupSize] = useState("");
  const [result, setResult] = useState(null);
  const [error, setError] = useState("");
  const [cinemaError, setCinemaError] = useState("");

  const fetchCinemas = async () => {
    const res = await fetch(`${API}/cinemas`);
    const data = await res.json();
    if (data.success) setCinemas(data.data);
  };

  useEffect(() => { fetchCinemas(); }, []);

  const handleCreateCinema = async (e) => {
    e.preventDefault();
    setCinemaError("");
    const sizes = cinemaForm.bundleSizes
      .split(",")
      .map((s) => Number(s.trim()))
      .filter((n) => !isNaN(n) && n > 0);

    const res = await fetch(`${API}/cinemas`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ name: cinemaForm.name, bundleSizes: sizes }),
    });
    const data = await res.json();
    if (data.success) {
      setCinemaForm({ name: "", bundleSizes: "" });
      fetchCinemas();
    } else {
      setCinemaError(data.message);
    }
  };

  const handleQuote = async () => {
    if (!selectedCinema || !groupSize) return;
    setError("");
    setResult(null);
    const res = await fetch(`${API}/cinemas/${selectedCinema}/booking?groupSize=${groupSize}`);
    const data = await res.json();
    if (data.success) setResult(data.data);
    else setError(data.message);
  };

  const activeCinema = cinemas.find((c) => c._id === selectedCinema);

  return (
    <div className="space-y-8">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold text-white">Watch Party Booking</h1>
        <p className="text-zinc-400 text-sm mt-1">Find the perfect bundle combo for your group</p>
      </div>

      {/* Add Cinema Card */}
      <div className="bg-zinc-900 rounded-2xl border border-zinc-800 overflow-hidden">
        <div className="px-5 py-4 border-b border-zinc-800 flex items-center gap-2">
          <span className="text-red-500">🎭</span>
          <h2 className="font-semibold text-zinc-200">Add Cinema</h2>
        </div>
        <form onSubmit={handleCreateCinema} className="p-5 space-y-3">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <input
              className="bg-zinc-800 border border-zinc-700 rounded-xl px-4 py-2.5 text-sm outline-none focus:border-red-500 focus:ring-1 focus:ring-red-500 transition-colors placeholder:text-zinc-500"
              placeholder="Cinema name"
              value={cinemaForm.name}
              onChange={(e) => setCinemaForm({ ...cinemaForm, name: e.target.value })}
              required
            />
            <input
              className="bg-zinc-800 border border-zinc-700 rounded-xl px-4 py-2.5 text-sm outline-none focus:border-red-500 focus:ring-1 focus:ring-red-500 transition-colors placeholder:text-zinc-500"
              placeholder="Bundle sizes (e.g. 2, 5, 10)"
              value={cinemaForm.bundleSizes}
              onChange={(e) => setCinemaForm({ ...cinemaForm, bundleSizes: e.target.value })}
              required
            />
          </div>
          {cinemaError && (
            <div className="bg-red-950 border border-red-800 rounded-xl px-4 py-2.5 text-red-400 text-sm">
              {cinemaError}
            </div>
          )}
          <button className="w-full sm:w-auto bg-red-600 hover:bg-red-500 active:bg-red-700 px-6 py-2.5 rounded-xl text-sm font-semibold transition-colors">
            Add Cinema
          </button>
        </form>
      </div>

      {/* Cinema List */}
      {cinemas.length > 0 && (
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          {cinemas.map((c) => (
            <div key={c._id} className="bg-zinc-900 border border-zinc-800 rounded-2xl p-4 space-y-2">
              <p className="font-semibold text-white">{c.name}</p>
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

      {/* Booking Quote Card */}
      <div className="bg-zinc-900 rounded-2xl border border-zinc-800 overflow-hidden">
        <div className="px-5 py-4 border-b border-zinc-800 flex items-center gap-2">
          <span className="text-red-500">🎟</span>
          <h2 className="font-semibold text-zinc-200">Get Booking Quote</h2>
        </div>
        <div className="p-5 space-y-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="text-xs text-zinc-500 mb-1.5 block uppercase tracking-wide">Cinema</label>
              <select
                className="w-full bg-zinc-800 border border-zinc-700 rounded-xl px-4 py-2.5 text-sm outline-none focus:border-red-500 focus:ring-1 focus:ring-red-500 transition-colors"
                value={selectedCinema}
                onChange={(e) => { setSelectedCinema(e.target.value); setResult(null); setError(""); }}
              >
                <option value="">Select a cinema...</option>
                {cinemas.map((c) => (
                  <option key={c._id} value={c._id}>{c.name}</option>
                ))}
              </select>
            </div>
            <div>
              <label className="text-xs text-zinc-500 mb-1.5 block uppercase tracking-wide">Group Size</label>
              <input
                type="number"
                min="1"
                max="10000"
                className="w-full bg-zinc-800 border border-zinc-700 rounded-xl px-4 py-2.5 text-sm outline-none focus:border-red-500 focus:ring-1 focus:ring-red-500 transition-colors placeholder:text-zinc-500"
                placeholder="e.g. 11"
                value={groupSize}
                onChange={(e) => { setGroupSize(e.target.value); setResult(null); setError(""); }}
              />
            </div>
          </div>

          {activeCinema && (
            <p className="text-xs text-zinc-500">
              Available bundles: {activeCinema.bundleSizes.map((s) => `${s} seats`).join(", ")}
            </p>
          )}

          {error && (
            <div className="bg-red-950 border border-red-800 rounded-xl px-4 py-2.5 text-red-400 text-sm">
              {error}
            </div>
          )}

          <button
            onClick={handleQuote}
            disabled={!selectedCinema || !groupSize}
            className="w-full sm:w-auto bg-red-600 hover:bg-red-500 disabled:opacity-40 disabled:cursor-not-allowed px-6 py-2.5 rounded-xl text-sm font-semibold transition-colors"
          >
            Get Quote
          </button>

          {/* Result */}
          {result && (
            <div className={`rounded-2xl border p-5 space-y-3 ${
              result.possible ? "bg-green-950 border-green-800" : "bg-yellow-950 border-yellow-800"
            }`}>
              {!result.possible ? (
                <div className="flex items-center gap-3">
                  <span className="text-2xl">❌</span>
                  <div>
                    <p className="font-semibold text-yellow-300">Not Possible</p>
                    <p className="text-yellow-500 text-sm">No exact bundle combination exists for {groupSize} seats.</p>
                  </div>
                </div>
              ) : (
                <>
                  <div className="flex items-center gap-3">
                    <span className="text-2xl">✅</span>
                    <div>
                      <p className="font-semibold text-green-300">
                        {result.totalBundles} bundle{result.totalBundles !== 1 ? "s" : ""} for {groupSize} seats
                      </p>
                      <p className="text-green-600 text-sm">Minimum bundles found</p>
                    </div>
                  </div>
                  <div className="flex flex-wrap gap-2 pt-1">
                    {result.bundles.map(({ size, count }) => (
                      <div key={size} className="bg-green-900 border border-green-700 rounded-xl px-4 py-3 text-center min-w-24">
                        <p className="text-2xl font-bold text-green-300">×{count}</p>
                        <p className="text-green-500 text-xs mt-0.5">{size}-seat bundle</p>
                      </div>
                    ))}
                  </div>
                </>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
