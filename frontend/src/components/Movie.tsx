import { Popcorn } from "lucide-react";
import Image from "next/image";

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

const Movie = ({movie}:IMovieProps) => {
    return(
        <div
            key={movie.id}
            className="movie-wrapper"
          >
            { /*<Image
              src={movie.posterUrl}
              alt={movie.title}
            /> */}
            <div className="movie-poster"><Popcorn size={60} color="#404040"/></div>
            <div className="movie-content">
            <div className="movie-title">{movie.title}</div>
            <div className="movie-year">
              {movie.releaseYear} • {movie.genre}
            </div>
            <p className="movie-description">{movie.description}</p>
          </div>
          </div>
    )
}

export default Movie;