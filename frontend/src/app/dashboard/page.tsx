'use client'
import { useState, useEffect } from 'react'
import { Plus, PencilRuler, Trash, SquarePen, ChevronDown, ChevronUp } from 'lucide-react'
import { useRouter } from 'next/navigation'
import { apiURL } from '@/services/services'
import { IMovie } from '@/services/types'
import AddMovieForm from '@/components/AddMovieForm'
import FormModal from '@/components/FormModal'
import { useAuth } from '@/services/AuthContext'
const Page = () => {
    const [movies, setMovies] = useState<IMovie[]>([])
    const [isVisible, setVisible] = useState(false)
    const [form, setForm] = useState<boolean>(false)
    const [id, setId] = useState<unknown>(null)
    const { user } = useAuth()
    const router = useRouter()
    useEffect(()=>{
        if(!user){router.replace('/');}
        getMovies();
    },[])

    const getMovies = async () => {
        try{
        const response = await fetch(`${apiURL}/api/movies`);
        if(response.ok){
            const data = await response.json();
            setMovies(data);
        }
        }catch(error){
            alert('Error+'+error)
        }
    }

    const deleteMovie = async (id:number) => {
        const con = confirm('Are you sure you want to delete?')
        if(con){
        try{
        const response = await fetch(`${apiURL}/api/movies/${id}`,{
            method:'DELETE',
        });
        if(response.ok){
            await response.text();
            alert('Movie was deleted successfully')
            getMovies();
        }
        }catch(error){
            alert('Error+'+error)
        }
    }
    }
    
    return(
        <>
        { form && <FormModal form={form} setForm={setForm} setId={setId} getMovies={getMovies}><AddMovieForm id={id} getMovies={getMovies}/></FormModal>}
        <section className="dashboard-section">
            <div className="dashboard-link" onClick={()=>setForm(!form)}><Plus size={80}/><div>Add Movie</div></div>
            
        </section>
        <section className="dashboard-section2"><div className="toggle-div" onClick={()=>setVisible(!isVisible)}>View Movies {!isVisible ? <ChevronDown size={20}/> :<ChevronUp size={20}/> }</div></section>
        { isVisible &&
        <section className="dashboard-section2">
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
            {movies ? movies.map((movie, i)=>{
                return <tr key={i}>
                    <td>{movie.title}</td>
                    <td>{movie.releaseYear}</td>
                    <td>{movie.genre}</td>
                    <td><div className="table-buttons"><button onClick={()=>{setId(movie.id); setForm(!form)}}><SquarePen/></button><button onClick={()=>{deleteMovie(movie.id) }}><Trash/></button></div></td>
                </tr>
               
            }) : 'Loading...' }
             </tbody>
            </table>
        </section>
        }
        </>
    )
}

export default Page