'use client'
import { useState, useEffect } from 'react'
import { allMovies } from '@/services/services'
import { IMovie } from '@/services/types'
import { MovieSearch } from './Movie'
const MenuSearch = () => {
    const [movies, setMovies] = useState<[]>([])
    const [searchresults, setSearchresults] = useState<[]>([])
    useEffect(()=>{
        allMovies.then((m) => setMovies(m))
    })
    const handleSearch = (e) => {
        if(e.target.value.length >= 2 && e.target.value != ''){
        const results = movies && movies.filter((item) => item.title.toLowerCase().includes(e.target.value.toLowerCase()) )
        setSearchresults(results);
        }else{
            setSearchresults(null)
        }
    }


    return(
        <div className="search-wrapper">
        <input type="search" onChange={handleSearch} placeholder="Search for movies" className="search"/>
        <div className="search-results">{searchresults && searchresults.map((r:IMovie,i:number) => {
            return <MovieSearch key={i} movie={r}/>
        })}</div>
        </div>
    )
}

export default MenuSearch