
'use client'
import { useState, useEffect, ChangeEvent } from 'react'
import { allMovies } from '@/services/services'
import { IMovie } from '@/services/types'
import { MovieSearch } from './Movie'
import { Search, X} from 'lucide-react'

const MenuSearch = () => {
    const [movies, setMovies] = useState<IMovie[]>([])
    const [search, setSearch] = useState<boolean>(false)
    const [searchresults, setSearchresults] = useState<IMovie[] | null>(null)

     useEffect(() => {
    allMovies.then((m) => {
      if ("error" in m) {
        setMovies([])
      } else {
        setMovies(m as IMovie[]);
      }
    });
  }, []);

    const handleSearch = (e: ChangeEvent<HTMLInputElement>) => {
        if(e.target.value.length >= 2 && e.target.value != ''){
        const results = movies?.filter((item:IMovie) => item.title.toLowerCase().includes(e.target.value.toLowerCase()));
        const genres = movies?.filter((item:IMovie) => item.genre.toLowerCase().includes(e.target.value.toLowerCase()));
        const year = movies?.filter((item:IMovie) => item.releaseYear === Number(e.target.value));
        const marray = [...results,...genres,...year];
        setSearchresults(marray);
        }else{
            setSearchresults(null);
        }

    }


    const handleClose = () => {
        setSearch(false);
        setSearchresults(null);
    }


    return(
        <>
        <button type="button" className="search-button" onClick={()=>setSearch(true)}><Search/></button>
        
        
        {search && <div className="tint">   
            <div className="search-wrapper">
                <input type="search" onChange={handleSearch} placeholder="Search movies by title, genre or year" className="search"/><button onClick={handleClose}><X/></button>
            </div>
            <div className="search-results">{searchresults && searchresults.map((r:IMovie,i:number) => {
            return <MovieSearch key={i} movie={r}/>
        })}</div></div>}
        </>
    )
}

export default MenuSearch

