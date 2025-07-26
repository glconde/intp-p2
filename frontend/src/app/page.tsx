"use client";

import { useEffect, useState } from "react";
import Image from "next/image";

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
      } catch (err: unknown) {
        console.error("Failed to fetch movies:", err);
        if (err instanceof Error) {
          setError(err.message);
        } else {
          setError("An unknown error occurred");
        }
      }
    };

    fetchMovies();
  }, [apiURL]); // are you happy now eslint??

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
            <Image
              src={movie.posterUrl}
              alt={movie.title}
              width={250}
              style={{ objectFit: "cover" }}
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
