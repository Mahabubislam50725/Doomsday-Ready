"use client";
import { useState, useEffect } from "react";

const API = "http://localhost:5000/api";

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

  return (
    <div className="space-y-8">
      <h1 className="text-2xl font-bold text-red-400">Watch Party Booking</h1>

      {/* Add Cinema */}
      <form onSubmit={handleCreateCinema} className="bg-zinc-900 border border-zinc-800 rounded-xl p-5 space-y-3">
        <h2 className="font-semibold text-zinc-300">Add Cinema</h2>
        <div className="flex gap-3 flex-wrap">
          <input
            className="flex-1 min-w-40 bg-zinc-800 rounded-lg px-3 py-2 text-sm outline-none focus:ring-1 focus:ring-red-500"
            placeholder="Cinema name"
            value={cinemaForm.name}
            onChange={(e) => setCinemaForm({ ...cinemaForm, name: e.target.value })}
            required
          />
          <input
            className="flex-1 min-w-48 bg-zinc-800 rounded-lg px-3 py-2 text-sm outline-none focus:ring-1 focus:ring-red-500"
            placeholder="Bundle sizes (e.g. 2, 5)"
            value={cinemaForm.bundleSizes}
            onChange={(e) => setCinemaForm({ ...cinemaForm, bundleSizes: e.target.value })}
            required
          />
          <button className="bg-red-600 hover:bg-red-500 px-4 py-2 rounded-lg text-sm font-medium transition-colors">
            Add
          </button>
        </div>
        {cinemaError && <p className="text-red-400 text-sm">{cinemaError}</p>}
      </form>

      {/* Booking Quote */}
      <div className="bg-zinc-900 border border-zinc-800 rounded-xl p-5 space-y-4">
        <h2 className="font-semibold text-zinc-300">Get Booking Quote</h2>
        <div className="flex gap-3 flex-wrap items-end">
          <div className="flex-1 min-w-48">
            <label className="text-xs text-zinc-400 mb-1 block">Cinema</label>
            <select
              className="w-full bg-zinc-800 rounded-lg px-3 py-2 text-sm outline-none focus:ring-1 focus:ring-red-500"
              value={selectedCinema}
              onChange={(e) => { setSelectedCinema(e.target.value); setResult(null); }}
            >
              <option value="">Select a cinema...</option>
              {cinemas.map((c) => (
                <option key={c._id} value={c._id}>
                  {c.name} (bundles: {c.bundleSizes.join(", ")})
                </option>
              ))}
            </select>
          </div>
          <div>
            <label className="text-xs text-zinc-400 mb-1 block">Group Size</label>
            <input
              type="number"
              min="1"
              max="10000"
              className="w-32 bg-zinc-800 rounded-lg px-3 py-2 text-sm outline-none focus:ring-1 focus:ring-red-500"
              placeholder="e.g. 11"
              value={groupSize}
              onChange={(e) => { setGroupSize(e.target.value); setResult(null); }}
            />
          </div>
          <button
            onClick={handleQuote}
            disabled={!selectedCinema || !groupSize}
            className="bg-red-600 hover:bg-red-500 disabled:opacity-50 px-5 py-2 rounded-lg text-sm font-medium transition-colors"
          >
            Get Quote
          </button>
        </div>
        {error && <p className="text-red-400 text-sm">{error}</p>}

        {result && (
          <div className="mt-2">
            {!result.possible ? (
              <p className="text-yellow-400 font-medium">Not possible — no exact bundle combination exists for {groupSize} seats.</p>
            ) : (
              <div className="space-y-2">
                <p className="text-green-400 font-medium">
                  {result.totalBundles} bundle{result.totalBundles !== 1 ? "s" : ""} needed for {groupSize} seats:
                </p>
                <div className="flex flex-wrap gap-2">
                  {result.bundles.map(({ size, count }) => (
                    <span key={size} className="bg-zinc-800 border border-zinc-700 rounded-lg px-3 py-1 text-sm">
                      {size}-seat bundle × {count}
                    </span>
                  ))}
                </div>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
