"use client";

import { useEffect, useState } from "react";
import { Movie, Modal } from "@/components/Movie";
import SectionTitle from "@/components/SectionTitle";
import { allMovies, fader } from "@/services/services";
import { IMovie } from "@/services/types";
import { PulseLoader } from "react-spinners";

export default function HomePage() {
  const [movies, setMovies] = useState<IMovie[]>([]);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    //allMovies.then((m) => setMovies(m))
    allMovies.then((m) => {
      if (m.length && "error" in m[0]) {
        setError((m[0] as { error: string }).error);
      } else {
        setMovies(m as IMovie[]);
      }
    });
    scroller();
  }, []);

  const scroller = () => {
    setTimeout(() => fader(), 1000);
    window.addEventListener("scroll", () => {
      fader();
    });
  };

  // Get Romance Movies
  const romance =
    movies &&
    movies.filter((item: IMovie) =>
      item.genre.toLowerCase().includes("romance")
    );

  // Get Action Movies
  const action =
    movies &&
    movies.filter((item: IMovie) =>
      item.genre.toLowerCase().includes("action")
    );

  // Get Drama Movies
  const drama =
    movies &&
    movies.filter((item: IMovie) => item.genre.toLowerCase().includes("drama"));

  // Get Comedy Movies
  const comedy =
    movies &&
    movies.filter((item: IMovie) =>
      item.genre.toLowerCase().includes("comedy")
    );

  // Get Thriller Movies
  const thriller =
    movies &&
    movies.filter((item: IMovie) =>
      item.genre.toLowerCase().includes("thriller")
    );

  // Get Horror Movies
  const horror =
    movies &&
    movies.filter((item: IMovie) =>
      item.genre.toLowerCase().includes("horror")
    );

  // Get Old Movies
  const oldmovies =
    movies && movies.filter((item: IMovie) => item.releaseYear < 1990);

  // Get Latest Movies
  const latest =
    movies && movies.filter((item: IMovie) => item.releaseYear === 2025);

  return (
    <main className="page">
      {error && (
        <div className="message" style={{ color: "red" }}>
          Error: {error}
        </div>
      )}
      {!error && movies.length === 0 && (
        <div className="message">
          <PulseLoader color="yellow" />
        </div>
      )}

      <SectionTitle title="The Latest" />
      <section className="movies-wrapper">
        {latest && latest.map((movie, i) => <Movie key={i} movie={movie} />)}
      </section>

      <SectionTitle title="Action" />
      <section className="movies-wrapper">
        {action && action.map((movie, i) => <Movie key={i} movie={movie} />)}
      </section>

      <SectionTitle title="Romance" />
      <section className="movies-wrapper">
        {romance && romance.map((movie, i) => <Movie key={i} movie={movie} />)}
      </section>

      <SectionTitle title="Dramas" />
      <section className="movies-wrapper">
        {drama && drama.map((movie, i) => <Movie key={i} movie={movie} />)}
      </section>

      <SectionTitle title="Comedies" />
      <section className="movies-wrapper">
        {comedy && comedy.map((movie, i) => <Movie key={i} movie={movie} />)}
      </section>

      <SectionTitle title="Thrillers" />
      <section className="movies-wrapper">
        {thriller &&
          thriller.map((movie, i) => <Movie key={i} movie={movie} />)}
      </section>

      <SectionTitle title="Old Movies" />
      <section className="movies-wrapper">
        {oldmovies &&
          oldmovies.map((movie, i) => <Movie key={i} movie={movie} />)}
      </section>

      <SectionTitle title="Horrors" />
      <section className="movies-wrapper">
        {horror && horror.map((movie, i) => <Movie key={i} movie={movie} />)}
      </section>
    </main>
  );
}
