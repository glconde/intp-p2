import { IMovie } from "@/services/types";

export const apiURL =
  process.env.NEXT_PUBLIC_API_URL || "http://localhost:8080";

/**
 * Legacy: single-use promise (kept for backward compatibility)
 * Works with `.then()` pattern: allMovies.then(...)
 */
export const allMovies: Promise<IMovie[] | { error: string }[]> = fetch(
  `${apiURL}/api/movies`
)
  .then(async (res) => {
    if (!res.ok) throw new Error(`HTTP error! status: ${res.status}`);
    return await res.json();
  })
  .catch((err: unknown) => [
    { error: err instanceof Error ? err.message : "Unknown error" },
  ]);

/**
 * Fetch all movies (async function)
 * Use this if you need to call multiple times or refresh.
 */
export const getMovies = async (): Promise<IMovie[] | { error: string }[]> => {
  try {
    const res = await fetch(`${apiURL}/api/movies`);
    if (!res.ok) throw new Error(`HTTP error! status: ${res.status}`);
    return await res.json();
  } catch (err: unknown) {
    return [{ error: err instanceof Error ? err.message : "Unknown error" }];
  }
};

/**
 * Fetch a single movie by ID
 */
export const getMovieById = async (
  id: number
): Promise<IMovie | { error: string }> => {
  try {
    const res = await fetch(`${apiURL}/api/movies/${id}`);
    if (!res.ok) throw new Error(`HTTP error! status: ${res.status}`);
    return await res.json();
  } catch (err: unknown) {
    return { error: err instanceof Error ? err.message : "Unknown error" };
  }
};

/**
 * Delete a movie by ID
 */
export const deleteMovieById = async (id: number): Promise<boolean> => {
  try {
    const res = await fetch(`${apiURL}/api/movies/${id}`, { method: "DELETE" });
    return res.ok;
  } catch {
    return false;
  }
};

/**
 * Fetch external OMDb metadata using title and release year
 */
const OMDB_API_KEY = process.env.NEXT_PUBLIC_OMDB_API_KEY;

export const getMovieData = async (title: string, releaseYear: number) => {
  try {
    if (!OMDB_API_KEY) throw new Error("OMDb API key is missing");
    const res = await fetch(
      `https://www.omdbapi.com/?apikey=${OMDB_API_KEY}&t=${encodeURIComponent(
        title
      )}&y=${releaseYear}`
    );
    if (!res.ok) throw new Error(`HTTP error! status: ${res.status}`);
    return await res.json();
  } catch (err) {
    console.error("Error fetching OMDb data:", err);
    return null;
  }
};

/**
 * Fader utility (if you still need it for animations)
 */
export const fader = () => {
  const elements = document.querySelectorAll(".hide");
  elements.forEach((el) => {
    const rect = el.getBoundingClientRect();
    if (rect.top < window.innerHeight - 50) {
      el.classList.add("show");
    } else {
      el.classList.remove("show");
    }
  });
};
