"use client";

import { useEffect, useState } from "react";
import { Movie, Modal } from "@/components/Movie";
import SectionTitle from "@/components/SectionTitle";
import { allMovies, fader } from "@/services/services";
import { IMovie } from "@/services/types";
import { PulseLoader } from "react-spinners";
import { useParams } from "next/navigation";

const GenreClientPage = () => {
  const [movies, setMovies] = useState<IMovie[]>([]);
  const [error, setError] = useState<string | null>(null);
  const { genre } = useParams<{ genre: string }>();

  // useEffect(() => {

  //   allMovies.then((m) => setMovies(m))
  //   scroller();
  // },[]);

  useEffect(() => {
    allMovies.then((m) => {
      if (m.length && "error" in m[0]) {
        setError((m[0] as { error: string }).error);
      } else {
        setMovies(m as IMovie[]);
      }
    });
    scroller();
  }, []);

  // const scroller = () => {
  //   setTimeout(()=>fader(),1000)
  //   window.addEventListener("scroll",()=>{
  //     fader()
  //   })
  // }

  const scroller = () => {
    setTimeout(() => fader(), 1000);
    window.addEventListener("scroll", () => {
      fader();
    });
  };

  //  const filter = movies && movies.filter((item:IMovie) => item.genre.toLowerCase().includes('romance'))
  const filtered = movies.filter((item) =>
    item.genre.toLowerCase().includes(genre.toLowerCase())
  );

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

      <SectionTitle title={genre} />
      <section className="movies-wrapper">
        {filtered &&
          filtered.map((movie, i) => <Movie key={i} movie={movie} />)}
      </section>
    </main>
  );
};


export default GenreClientPage;

