"use client";

import { useEffect, useState } from "react";
import { Movie, Modal} from "@/components/Movie";
import SectionTitle from "@/components/SectionTitle";
import { allMovies, fader } from "@/services/services";
import { IMovie } from "@/services/types";
import { PulseLoader } from "react-spinners";
import { useParams } from "next/navigation";


const Page = () => {
  const [movies, setMovies] = useState<[]>([]);
  const [error, setError] = useState<string | null>(null);
const { genre } = useParams<{genre:string}>()
  useEffect(() => {
    
    allMovies.then((m) => setMovies(m))
    scroller(); 
  },[]);

  const scroller = () => {
    setTimeout(()=>fader(),1000)
    window.addEventListener("scroll",()=>{
      fader()
    })
  }

   const filter = movies && movies.filter((item:IMovie) => item.genre.toLowerCase().includes('romance'))
  return (
    <main className="page">
      
      {error && <div className="message" style={{ color: "red" }}>Error: {error}</div>}
      {!error && movies.length === 0 && <div className="message"><PulseLoader color="yellow"/></div>}

      <SectionTitle title={genre}/>
      <section className="movies-wrapper">
        {filter && filter.map((movie,i) => (
          <Movie key={i} movie={movie}/>
        ))}
      </section>
      </main>
    )
}

export default Page