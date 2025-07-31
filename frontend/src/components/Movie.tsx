import { Popcorn, Ellipsis, CircleX } from "lucide-react";
import Image from "next/image";
import { useState } from "react";

interface IMovieType {
  id: number;
  title: string;
  releaseYear: number;
  genre: string;
  posterUrl: string;
  description: string;
};

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
            <p className="movie-description">{movie.description}</p>
            
          </div>
          </div>
          </>
    )
}

export const Modal = ({data, openModal, modal}:IModal) => {
    return(
        <div className="modal">
            <div><CircleX onClick={()=>openModal(!modal)} size={30}/></div>
            <div className="modal-title">{data.title}</div>
            <p>{data.description}</p>
        </div>
    )
}
