'use client'
import { useState, useEffect } from 'react'
import { allMovies } from '@/services/services'
import { IMovie } from '@/services/types'
import { MovieSearch } from './Movie'
import { Search, X} from 'lucide-react'


const MenuSearch = () => {
    const [movies, setMovies] = useState<IMovie[]>([])
    const [search, setSearch] = useState<boolean>(false)
    const [searchresults, setSearchresults] = useState<IMovie[] | null>(null)
    useEffect(()=>{
        allMovies.then((m) => setMovies(m))
    })
    const handleSearch = (e: { target: { value: string } }) => {
        if(e.target.value.length >= 2 && e.target.value != ''){
        const results = movies && movies.filter((item:IMovie) => item.title.toLowerCase().includes(e.target.value.toLowerCase()));
        setSearchresults(results);
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
                <input type="search" onChange={handleSearch} placeholder="Search for movies" className="search"/><button onClick={handleClose}><X/></button>
            </div>
            <div className="search-results">{searchresults && searchresults.map((r:IMovie,i:number) => {
            return <MovieSearch key={i} movie={r}/>
        })}</div></div>}
        </>
    )
}

export default MenuSearch