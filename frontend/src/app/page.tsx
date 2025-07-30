"use client";

import { useEffect, useState } from "react";
import sampleMovies from '@/app/sample-action-movies.json';
import Movie from "@/components/Movie";
import SectionTitle from "@/components/SectionTitle";

export default function HomePage() {
  const [movies, setMovies] = useState([]);
  const [error, setError] = useState<string | null>(null);
  const [message, setMessage] = useState<string>("");

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
        //setMessage("Failed to fetch movies:"+ err);
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
    <main className="page">
      <SectionTitle title="Action Movies"/>
      {error && <div className="message" style={{ color: "red" }}>Error: {error}</div>}
      {!error && movies.length === 0 && <div className="message">Loading Movies...</div>}
      <section className="movies-wrapper">
        
        {sampleMovies.map((movie,i) => (
          <Movie key={i} movie={movie}/>
        ))}
      </section>
    </main>
  );
}
