'use client'
import { apiURL } from "@/services/services"
import { FormEvent, useEffect, useState } from "react";
import { IMovie } from "@/services/types";
import { Loader } from "./Loader";

interface IMovieForm{
    id:unknown;
    getMovies:()=>void;
}
const AddMovieForm = ({id, getMovies}:IMovieForm) => {
    const [movie, setMovie] = useState<IMovie>()
    const [message, setMessage] = useState<string>('')
    const [update, setUpdate] = useState<boolean>(false)
    useEffect(()=>{
        if(id) getMovie();
    })

    const addMovie = async (e:unknown) => {
        setUpdate(true)
        e.preventDefault();
        const formData = new FormData(e.currentTarget)
        const obj: { [key: string]: string | string[] | number } = {};
        for(const [key, value] of formData.entries()){
            if(key === "releaseYear" && typeof value === 'string'){
               obj[key] = Number(value);
            }else{
            obj[key] = value as string;
            }
        }
        try{ 
            const add = id ? `/${id}` : ''
            const response = await fetch(`${apiURL}/api/movies${add}`,{
               method: id ? 'PUT' : 'POST',
               headers: {
                'Content-Type': 'application/json'
                },
               body: JSON.stringify(obj)
            });
            if(response.ok){
            await response.json()
            setMessage(`Successfully updated`)
            setUpdate(false)
            e.target.reset()
            getMovies();
            setMessage('')
            }else{
                setMessage('Error')
            }
        }catch(error){
            alert('Error'+error)
        }
    }

    const getMovie = async () => {
        try{
            const response = await fetch(`${apiURL}/api/movies/${id}`);
            if(response.ok){
            const data = await response.json()
            setMovie(data)
            }
        }catch(error){
            alert('Error'+error)
        }
    }

if(id){
    if(!movie) return <Loader/>
}
    return(
        <>
        
        <form onSubmit={addMovie}>
            <h2>{id ? 'Update' : "Add"} Movie</h2>
            {message}
            <div className="form-section">
                <label>Title</label>
                <input type="text" name="title" defaultValue={movie && movie.title} minLength={3} placeholder="Enter movie title" required/>
            </div>
            <div className="form-section">
                <label>Release Year</label>
                <input type="number" name="releaseYear" min={1950} max={2030} placeholder="Enter year of release" defaultValue={movie && movie.releaseYear} required/>
            </div>
            <div className="form-section">
                <label>Genre</label>
                <input type="text" name="genre" placeholder="Enter genre of movie" minLength={4} defaultValue={movie && movie.genre} required/>
            </div>
            <div className="form-section">
                <label>Poster URL</label>
                <input type="text" placeholder="Poster link" name="posterUrl" defaultValue={movie && movie.posterUrl} minLength={10} required/>
            </div>
            <div className="form-section">
                <label>Description</label>
                <textarea name="description" placeholder="Enter description for movie" defaultValue={movie && movie.description} minLength={10} maxLength={300} required ></textarea>
            </div>
            <button type="submit">{id ? 'Update' : 'Add'} Movie {update && ' Updating...'}</button>
        </form>
        </>
    )
}

export default AddMovieForm;