'use client'
import { useState, useEffect, ChangeEvent } from 'react'
import { Plus, Trash, SquarePen, ChevronDown, ChevronUp } from 'lucide-react'
import { PulseLoader } from 'react-spinners'
import { useRouter } from 'next/navigation'
import { apiURL } from '@/services/services'
import { IMovie } from '@/services/types'
import AddMovieForm from '@/components/AddMovieForm'
import FormModal from '@/components/FormModal'
import { useAuth } from '@/services/AuthContext'
 import { allMovies } from '@/services/services'
const Page = () => {
    const [movies, setMovies] = useState<IMovie[] | null>(null)
   const [results, setResults] = useState<IMovie[] | null>(null)
    const [isVisible, setVisible] = useState(true)
    const [form, setForm] = useState<boolean>(false)
    const [id, setId] = useState<unknown>(null)
    const { user } = useAuth()
    const router = useRouter()
    useEffect(()=>{
        if(!user){router.replace('/');}
        getMovies()
    },[user, router])

    const getMovies = async () => {
        allMovies.then((m)=>setMovies(m));
    }

    const deleteMovie = async (id:number) => {
        const con = confirm('Are you sure you want to delete?');
        if(con){
        try{
        const response = await fetch(`${apiURL}/api/movies/${id}`,{
            method:'DELETE',
        });
        if(response.ok){
            await response.text();
            alert('Movie was deleted successfully');
            getMovies();
        }
        }catch(error){
            alert('Error+'+error);
        }
    }
    }

    const handleSearch = async (e: ChangeEvent<HTMLInputElement>) => {
        const searchValue = e.target.value.trim(); 
        if (searchValue.length > 1) {
            const moviesearch = movies?.filter((item: IMovie) =>
            item.title?.toLowerCase().includes(searchValue.toLowerCase())) || [];
            setResults(moviesearch);
        } else {
        try {
            setResults(null);
            await getMovies(); // Assuming getMovies is async
        } catch (error) {
            console.error('Error fetching movies:', error);
        }
        }
    };
    
    return(
        <>
        { form && <FormModal form={form} setForm={setForm} setId={setId}><AddMovieForm id={id} getMovies={getMovies}/></FormModal>}
        <section className="dashboard-section">
            <div className="dashboard-link" onClick={()=>setForm(!form)}><Plus size={80}/><div>Add Movie</div></div>
            
        </section>
        <section className="dashboard-section2"><div className="toggle-div" onClick={()=>setVisible(!isVisible)}>View Movies {!isVisible ? <ChevronDown size={20}/> :<ChevronUp size={20}/> }</div></section>
        { isVisible &&
        <>
        <div className="dashboard-search"><input type="search" placeholder="Search movies" onChange={handleSearch}/></div>
        <section className="dashboard-section2">
            {!movies ? <PulseLoader color="yellow"/> : 
            <table>
                <thead>
                <tr>
                    <td>Title</td>
                    <td>Year</td>
                    <td>Genre</td>
                    <td></td>
                </tr>
                </thead>
                <tbody>
            
            { results ? results.map((movie, i)=>{
                return <tr key={i}>
                    <td>{movie.title}</td>
                    <td>{movie.releaseYear}</td>
                    <td>{movie.genre}</td>
                    <td className="table-buttons"><button onClick={()=>{setId(movie.id); setForm(!form)}}><SquarePen/></button><button onClick={()=>{deleteMovie(movie.id) }}><Trash/></button></td>
                </tr>  
            }) :
            
            movies.map((movie, i)=>{
                return <tr key={i}>
                    <td>{movie.title}</td>
                    <td>{movie.releaseYear}</td>
                    <td>{movie.genre}</td>
                    <td className="table-buttons"><button onClick={()=>{setId(movie.id); setForm(!form)}}><SquarePen/></button><button onClick={()=>{deleteMovie(movie.id) }}><Trash/></button></td>
                </tr>  
            })}
             </tbody>
            </table>
        
        }
        </section></>
        }
    </>
    
    )
}

export default Page