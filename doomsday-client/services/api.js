const BASE = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000/api";

async function request(path, options = {}) {
  const res = await fetch(`${BASE}${path}`, {
    headers: { "Content-Type": "application/json" },
    ...options,
  });
  const data = await res.json();
  if (!data.success) throw { status: res.status, message: data.message, code: data.error };
  return data;
}

export const api = {
  // Movies
  getMovies: () => request("/movies"),
  createMovie: (body) => request("/movies", { method: "POST", body: JSON.stringify(body) }),
  updateMovie: (id, body) => request(`/movies/${id}`, { method: "PATCH", body: JSON.stringify(body) }),
  getRewatchOrder: (id) => request(`/movies/${id}/rewatch-order`),

  // Cinemas
  getCinemas: () => request("/cinemas"),
  createCinema: (body) => request("/cinemas", { method: "POST", body: JSON.stringify(body) }),
  getBookingQuote: (id, groupSize) => request(`/cinemas/${id}/booking?groupSize=${groupSize}`),
};
