import { Popcorn, Ellipsis, CircleX, Star, Award, Film } from "lucide-react";
import Image from "next/image";
import { useState, useEffect } from "react";
import { getMovieData } from "@/services/services";

interface IMovieType {
  id: number;
  title: string;
  releaseYear: number;
  genre: string;
  posterUrl: string;
  description: string;
};

interface IMovieData {
  Director:string;
  Actors:string;
  Writer:string;
  Language:string;
  Runtime:string;
  BoxOffice:string;
  Plot:string;
  Awards:string;
  Ratings?:[];
}

interface IRating {
  Source:string;
  Value:string;
}

interface IMovieProps {
  movie: IMovieType;
}

interface IModal {
    data:IMovieType;
    openModal: (value:boolean)=>void;
    modal:boolean;
}

export const Movie = ({movie}:IMovieProps) => {
    const [modal, setModal] = useState<boolean>(false)

    const handleDetails = () => {
        setModal(!modal)
    }

    return(
        <>
        {modal && <Modal data={movie} openModal={setModal} modal={modal}/>}
        <div
            key={movie.id}
            className="movie-wrapper"
          >
            
            <div className="movie-poster">{movie.posterUrl ? <picture><img className="movie-img"
              src={movie.posterUrl}
              alt={movie.title}
            /></picture> : <Popcorn size={60} color="#404040"/>}</div>
            <div className="movie-content">
            <div className="movie-title">{movie.title} </div>
            <div className="movie-year">
              <span>{movie.releaseYear} • {movie.genre}</span><button className="details-button" onClick={handleDetails}><Ellipsis/></button>
            </div>
            <div className="movie-description">{movie.description}</div>
            
          </div>
          </div>
          </>
    )
}

export const MovieSearch = ({movie}:IMovieProps) => {
    const [modal, setModal] = useState<boolean>(false)

    const handleDetails = () => {
        setModal(!modal)
    }

    return(
        <>
        {modal && <Modal data={movie} openModal={setModal} modal={modal}/>}
        <div
            key={movie.id}
            className="search-result" onClick={handleDetails}
          >
            
            <div className="movie-poster-search">{movie.posterUrl ? <picture><img className="movie-img"
              src={movie.posterUrl}
              alt={movie.title}
            /></picture> : <Popcorn size={60} color="#404040"/>}</div>
            <div className="movie-content">
            <div>{movie.title} </div>
            <div className="movie-year">
              <span>{movie.releaseYear} • {movie.genre}</span>
              
            </div>
       <div className="movie-description">{movie.description}</div>
            
          </div>
          </div>
          </>
    )
}

export const Modal = ({data, openModal, modal}:IModal) => {
  const [moviedata, setMoviedata] = useState<IMovieData>({})
  useEffect(()=>{
    getMovieData(data.title).then(d=>setMoviedata(d))
  },[data.title])
    return(
        <div className="modal">
          <picture><img className="modal-background"
              src={data.posterUrl}
              alt={data.title}
            /></picture>
            <div className="modal-content">
            <div className="modal-header"><CircleX onClick={()=>openModal(!modal)} size={30}/></div>
            <div className="modal-content-section">
            <div className="modal-title">{data.title}</div>
            <p className="modal-description">{data.description}</p>
            <picture><img className="modal-inline-img"
              src={data.posterUrl}
              alt={data.title}
            /></picture>
            <p>{data.releaseYear} • {data.genre} • {moviedata && moviedata.Runtime}</p>
            <h1><Star size={50}/></h1>
                <div>{!moviedata.Ratings ? <p>No ratings available</p> : moviedata.Ratings.map((rating:IRating, i)=>{
                  return <div className="rating"  key={i}><div><Star/>{rating.Source}</div> {rating.Value}</div>
                })}
            </div>

             <h1><Award size={50}/></h1>
                <div>{!moviedata.Ratings ? <p>No ratings available</p> :  <div className="center"><div>{moviedata.Awards}</div></div>
                }
            </div>
           
            <h1 style={{marginTop:'40px'}}><Film size={50}/></h1>
            {
             <table><tbody>
                <tr><td>Director</td><td>{moviedata && moviedata.Director}</td></tr>
                <tr><td>Actors</td><td>{moviedata&& moviedata.Actors}</td></tr>
                <tr><td>Writers</td><td>{moviedata&& moviedata.Writer}</td></tr>
                <tr><td>Languages</td><td>{moviedata&& moviedata.Language}</td></tr>
                <tr><td>Box Office</td><td>{moviedata&& moviedata.BoxOffice}</td></tr>
                <tr><td>Plot</td><td>{moviedata&& moviedata.Plot}</td></tr>
                </tbody></table>
              }
              
            
            </div>
            </div>
        </div>
    )
}
