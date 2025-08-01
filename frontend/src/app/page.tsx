"use client";

import { useEffect, useState } from "react";
import sampleMovies from '@/app/sample-action-movies.json';
import { Movie, Modal} from "@/components/Movie";
import SectionTitle from "@/components/SectionTitle";
import { allMovies } from "@/services/services";

export default function HomePage() {
  const [movies, setMovies] = useState<[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [message, setMessage] = useState<string>("");

  
  useEffect(() => {
    allMovies.then((m) => setMovies(m))
  },[]);

  const romance = movies && movies.filter((item) => item.genre.toLowerCase().includes('romance'))

  const action = movies && movies.filter((item) => item.genre.toLowerCase().includes('action'))

  const drama = movies && movies.filter((item) => item.genre.toLowerCase().includes('drama'))

  const comedy = movies && movies.filter((item) => item.genre.toLowerCase().includes('comedy'))

  const thriller = movies && movies.filter((item) => item.genre.toLowerCase().includes('thriller'))

  const oldmovies = movies && movies.filter((item) => item.releaseYear < 1990)

  const latest = movies && movies.filter((item) => item.releaseYear === 2025)

  return (
    <main className="page">
      
      {error && <div className="message" style={{ color: "red" }}>Error: {error}</div>}
      {!error && movies.length === 0 && <div className="message">Loading Movies...</div>}

      <SectionTitle title="The Latest"/>
      <section className="movies-wrapper">
        {latest && latest.map((movie,i) => (
          <Movie key={i} movie={movie}/>
        ))}
      </section>

      <SectionTitle title="Action"/>
      <section className="movies-wrapper">
        {action && action.map((movie,i) => (
          <Movie key={i} movie={movie}/>
        ))}
      </section>

      <SectionTitle title="Romance"/>
      <section className="movies-wrapper">
        {romance && romance.map((movie,i) => (
          <Movie key={i} movie={movie}/>
        ))}
      </section>

      <SectionTitle title="Dramas"/>
      <section className="movies-wrapper">
        {drama && drama.map((movie,i) => (
          <Movie key={i} movie={movie}/>
        ))}
      </section>

      <SectionTitle title="Comedies"/>
      <section className="movies-wrapper">
        {comedy && comedy.map((movie,i) => (
          <Movie key={i} movie={movie}/>
        ))}
      </section>

      <SectionTitle title="Thrillers"/>
      <section className="movies-wrapper">
        {thriller && thriller.map((movie,i) => (
          <Movie key={i} movie={movie}/>
        ))}
      </section>

      <SectionTitle title="Old Movies"/>
      <section className="movies-wrapper">
        {oldmovies && oldmovies.map((movie,i) => (
          <Movie key={i} movie={movie}/>
        ))}
      </section>
    </main>
  );
}
