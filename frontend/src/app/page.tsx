"use client";

import { useEffect, useState } from "react";

type Movie = {
  id: number;
  title: string;
  releaseYear: number;
  genre: string;
  posterUrl: string;
  description: string;
};

export default function HomePage() {
  const [movies, setMovies] = useState<Movie[]>([]);
  const [error, setError] = useState<string | null>(null);

  const apiURL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8080";

  useEffect(() => {
    const fetchMovies = async () => {
      try {
        const res = await fetch(`${apiURL}/api/movies`);
        if (!res.ok) {
          throw new Error(`HTTP error! status: ${res.status}`);
        }
        const data = await res.json();
        setMovies(data);
      } catch (err: any) {
        console.error("Failed to fetch movies:", err);
        setError(err.message);
      }
    };

    fetchMovies();
  }, []);

  console.log("Movies:", movies);

  return (
    <main style={{ padding: "2rem" }}>
      <h1>Action Movies</h1>
      {error && <p style={{ color: "red" }}>Error: {error}</p>}
      {!error && movies.length === 0 && <p>Loading...</p>}
      <div style={{ display: "flex", flexWrap: "wrap", gap: "1rem" }}>
        {movies.map((movie) => (
          <div
            key={movie.id}
            style={{
              border: "1px solid #ccc",
              padding: "1rem",
              width: "250px",
            }}
          >
            <img
              src={movie.posterUrl}
              alt={movie.title}
              style={{ width: "100%" }}
            />
            <h2>{movie.title}</h2>
            <p>
              <strong>{movie.releaseYear}</strong> • {movie.genre}
            </p>
            <p>{movie.description}</p>
          </div>
        ))}
      </div>
    </main>
  );
}
