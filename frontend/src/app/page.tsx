"use client";
import { GoogleGenAI } from "@google/genai";
import { useEffect, useState } from "react";
import { Movie} from "@/components/Movie";
import SectionTitle from "@/components/SectionTitle";
import { allMovies, fader } from "@/services/services";
import { IMovie } from "@/services/types";
import { PulseLoader } from "react-spinners";
import Link from "next/link";
import Filter from "@/components/Filter";
//import { Genai } from "@/components/Genai";

export default function HomePage() {
  const [movies, setMovies] = useState<IMovie[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [filtered, setFiltered] = useState<IMovie[] | null>(null);
  const [airesponse, setAiresponse] = useState<unknown | null>("")
  const ai = new GoogleGenAI({apiKey: process.env.NEXT_PUBLIC_GEMINI_API_KEY});
  useEffect(() => {
    //allMovies.then((m) => setMovies(m))
    allMovies.then((m) => {
      if ("error" in m) {
        setError((m as { error: string }).error);
      } else {
        setMovies(m as IMovie[]);
      }
    });
    if(movies) {scroller(); }
    if(filtered){ scroller();}

  
  }, [filtered, movies]);

  const scroller = () => {
    fader();
    window.addEventListener("scroll", () => {
      fader();
    });
  };

  const gai = async () => {
    const response = await ai.models.generateContent({
    model: "gemini-2.5-flash",
    contents: "Explain how AI works in a few words",
  });
    setAiresponse(response.text)

  }

  // Get Romance Movies
  const romance = movies?.filter((item: IMovie) => item.genre.toLowerCase().includes("romance"));

  // Get Action Movies
  const action = movies?.filter((item: IMovie) => item.genre.toLowerCase().includes("action"));

  // Get Drama Movies
  const drama = movies?.filter((item: IMovie) => item.genre.toLowerCase().includes("drama"));

  // Get Comedy Movies
  const comedy = movies?.filter((item: IMovie) => item.genre.toLowerCase().includes("comedy"));

  // Get Thriller Movies
  const thriller = movies?.filter((item: IMovie) => item.genre.toLowerCase().includes("thriller"));

  // Get Horror Movies
  const horror = movies?.filter((item: IMovie) => item.genre.toLowerCase().includes("horror"));

  // Get Old Movies
  const oldmovies = movies?.filter((item: IMovie) => item.releaseYear < 1990);

  // Get Latest Movies
  const latest = movies && movies.filter((item: IMovie) => item.releaseYear === 2025);

  return (
    <main className="page">
      <Filter filtered={movies} setFiltered={setFiltered}/>
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

      { filtered ? <><div className="subtitle">{filtered?.length} movies found</div><section className="movies-wrapper"> {filtered.map((movie, i) => <Movie key={i} movie={movie} />)} </section></> :
      <>
      
      <div className="genre-wrapper">
        <Link href="#action">Action</Link>
        <Link href="#romance">Romance</Link>
        <Link href="#comedy">Comedies</Link>
        <Link href="#drama">Dramas</Link>
        <Link href="#thriller">Thrillers</Link>
        <Link href="#oldies">Oldies</Link>
        <Link href="#horror">Horrors</Link>
      </div>

      <SectionTitle title="The Latest" />
      <section className="movies-wrapper">
        {latest && latest.map((movie, i) => <Movie key={i} movie={movie} />)}
      </section>
      <div id="action"></div>
      <SectionTitle title="Action" />
      <section className="movies-wrapper">
        {action && action.map((movie, i) => <Movie key={i} movie={movie} />)}
      </section>
      <div id="romance"></div> 
      <SectionTitle title="Romance" />
      <section className="movies-wrapper">
        {romance && romance.map((movie, i) => <Movie key={i} movie={movie} />)}
      </section>
      <div id="drama"></div>
      <SectionTitle title="Dramas" />
      <section className="movies-wrapper">
        {drama && drama.map((movie, i) => <Movie key={i} movie={movie} />)}
      </section>
      <div id="comedy"></div>
      <SectionTitle title="Comedies" />
      <section className="movies-wrapper">
        {comedy && comedy.map((movie, i) => <Movie key={i} movie={movie} />)}
      </section>
      <div id="thriller"></div>
      <SectionTitle title="Thrillers" />
      <section className="movies-wrapper">
        {thriller &&
          thriller.map((movie, i) => <Movie key={i} movie={movie} />)}
      </section>
      <div id="oldies"></div>
      <SectionTitle title="Old Movies" />
      <section className="movies-wrapper">
        {oldmovies &&
          oldmovies.map((movie, i) => <Movie key={i} movie={movie} />)}
      </section>
      <div id="horror"></div>
      <SectionTitle title="Horrors" />
      <section className="movies-wrapper">
        {horror && horror.map((movie, i) => <Movie key={i} movie={movie} />)}
      </section>
      </>
}
    </main>
  );
}
