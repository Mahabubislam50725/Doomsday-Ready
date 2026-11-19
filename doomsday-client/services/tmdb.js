const TMDB_KEY = process.env.NEXT_PUBLIC_TMDB_KEY;
const TMDB_BASE = "https://api.themoviedb.org/3";
export const TMDB_IMG = "https://image.tmdb.org/t/p/w500";

export async function fetchMoviePoster(title, year) {
  try {
    const query = encodeURIComponent(title);
    const yearParam = year ? `&year=${year}` : "";
    const res = await fetch(
      `${TMDB_BASE}/search/movie?api_key=${TMDB_KEY}&query=${query}${yearParam}&language=en-US&page=1`
    );
    const data = await res.json();
    const result = data.results?.[0];
    return result?.poster_path ? `${TMDB_IMG}${result.poster_path}` : null;
  } catch {
    return null;
  }
}
