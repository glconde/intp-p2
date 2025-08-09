import { Popcorn, Ellipsis, CircleX, Star, Award, BrainCircuit } from "lucide-react";
import { PropagateLoader } from "react-spinners";
import { useState, useEffect } from "react";
import { getMovieData } from "@/services/services";
import { GoogleGenAI, Type } from "@google/genai";
import { marked } from "marked";

interface IMovieType {
  id: number;
  title: string;
  releaseYear: number;
  genre: string;
  posterUrl: string;
  description: string;
}

interface IMovieData {
  Director: string;
  Actors: string;
  Writer: string;
  Language: string;
  Runtime: string;
  BoxOffice: string;
  Plot: string;
  Awards: string;
  Rated:string;
  Released:string;
  Country:string;
  Ratings: [];
}

interface Recommended {
  movieTitle:string;
  year:number;
  plot:string;
}

interface IRating {
  Source: string;
  Value: string;
}

interface IMovieProps {
  movie: IMovieType;
}

interface IModal {
  data: IMovieType;
  openModal: (value: boolean) => void;
  modal: boolean;
}

export const Movie = ({ movie }: IMovieProps) => {
  const [modal, setModal] = useState<boolean>(false);

  const handleDetails = () => {
    setModal(!modal);
  };


    return(
        <>
        {modal && <Modal data={movie} openModal={setModal} modal={modal}/>}
        <div
            key={movie.id}
            className="movie-wrapper hide"
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
  );
};

export const MovieSearch = ({ movie }: IMovieProps) => {
  const [modal, setModal] = useState<boolean>(false);

  const handleDetails = () => {
    setModal(!modal);
  };

  return (
    <>
      {modal && <Modal data={movie} openModal={setModal} modal={modal} />}
      <div key={movie.id} className="search-result" onClick={handleDetails}>
        <div className="movie-poster-search">
          {movie.posterUrl ? (
            <picture>
              <img
                className="movie-img"
                src={movie.posterUrl}
                alt={movie.title}
              />
            </picture>
          ) : (
            <Popcorn size={60} color="#404040" />
          )}
        </div>
        <div className="movie-content">
          <div>{movie.title} </div>
          <div className="movie-year">
            <span>
              {movie.releaseYear} • {movie.genre}
            </span>
          </div>
          <div className="movie-description">{movie.description}</div>
        </div>
      </div>
    </>
  );
};


export const Modal = ({data, openModal, modal}:IModal) => {
  const [moviedata, setMoviedata] = useState<IMovieData | null>(null)
  const [airesponse, setAiresponse] = useState<string | Promise<string> | undefined>(undefined)
  const [recommended, setRecommended] = useState<Recommended[] | null>(null)
  const [search, setSearch] = useState<boolean>(false)
  const ai = new GoogleGenAI({apiKey: process.env.NEXT_PUBLIC_GEMINI_API_KEY});
  useEffect(()=>{
    getMovieData(data.title, data.releaseYear).then(d=>setMoviedata(d))
    recommendedAi()
  },[data.title, data.releaseYear])

  // Define the grounding tool
  const groundingTool = {
    googleSearch: {},
  };

  // Configure generation settings
  const config = {
    tools: [groundingTool],
  };

  const gai = async () => {
    setAiresponse(undefined)
    setSearch(true)
    const response = await ai.models.generateContent({
    model: "gemini-2.5-flash",
    contents: `where can I stream the movie ${data.title} (${data.releaseYear}) and provide url for the streaming platform`,
    config
  });
  const txt = response?.text;
  
    const html = txt && marked.parse(txt)
    setSearch(false)
    setAiresponse(html)

  }

  const recommendedAi = async () => {
    try{
    const response = await ai.models.generateContent({
    model: "gemini-2.5-flash",
    contents: `Recommend movies like ${data.title} (${data.releaseYear})`,
    config: {
      //tools: [groundingTool],
      responseMimeType: "application/json",
      responseSchema: {
        type: Type.ARRAY,
        items: {
          type: Type.OBJECT,
          properties: {
            movieTitle: {
              type: Type.STRING,
            },
            year: {
              type: Type.INTEGER,
            },
            plot: {
              type: Type.STRING,
            },
          },
          propertyOrdering: ["movieTitle", "year", "plot"],
        },
      },
    },
  });
  const txt = response.text && JSON.parse(response.text);
    console.log(txt)
    //const html = txt && marked.parse(txt)
    setRecommended(txt)
}catch(error){
  console.log('Error occured',error)
}
  }
    return(<>
      <div className="tint"></div>
        <div className="modal">
          <picture><img className="modal-background"
              src={data.posterUrl}
              alt={data.title}
            /></picture>
            <div className="modal-blur"></div>
            <div className="modal-border"></div>
            <div className="modal-content">
            <div className="modal-header"><CircleX onClick={()=>openModal(!modal)} size={30}/></div>
            <div className="modal-content-section">
            <div className="modal-title">{data.title}</div>
            <p className="modal-description">{data.description}</p>
            <div className="picture"><picture><img className="modal-inline-img"
              src={data.posterUrl}
              alt={data.title}
            /></picture></div>
            <p>{data.releaseYear}&nbsp;&nbsp;&nbsp;•&nbsp;&nbsp;&nbsp;{data.genre}&nbsp;&nbsp;&nbsp;•&nbsp;&nbsp;&nbsp;<span className="rated">{moviedata?.Rated}</span></p>
            { !moviedata ? <PropagateLoader color="rgba(255,255,255,0.1)"/> : 
            <>
            <div className="modal-content-section2">
              <div className="mcs">
                <h1><Star size={80} /></h1>
                <div>{moviedata && !moviedata.Ratings ? <p>No ratings available</p> : moviedata && moviedata.Ratings.map((rating:IRating, i)=>{
                  return <div className="rating"  key={i}><div>{rating.Source}</div> {rating.Value}</div>
                })}
              </div>
              </div>
              <div className="mcs">
                <h1><Award size={80}/></h1>
                  <div>{(!moviedata.Ratings || moviedata.Ratings.length == 0) ? <p>No ratings available</p> :  <div className="center"><div>{moviedata.Awards}</div></div>
                      }
                  </div>
              </div>
            </div>
            <div className="ai-wrapper"><h3>Popcorn Ai</h3><div><button onClick={gai}><BrainCircuit/>{search ? 'Getting streaming options...' : 'Use popcorn ai to get streaming options'}</button></div>{!airesponse && search ? <PropagateLoader color="rgba(255,255,255,0.1)"/> : <div style={{textAlign:'left'}} dangerouslySetInnerHTML={{ __html: airesponse?.toString() ?? '' }} />}</div>
            
            <table>
              <tbody>
                <tr><td>Director</td><td>{moviedata.Director}</td></tr>
                <tr><td>Actors</td><td>{moviedata.Actors}</td></tr>
                <tr><td>Writers</td><td>{ moviedata.Writer}</td></tr>
                <tr><td>Languages</td><td>{moviedata.Language}</td></tr>
                <tr><td>Release Date</td><td>{moviedata.Released}</td></tr>
                <tr><td>Runtime</td><td>{moviedata.Runtime}</td></tr>
                <tr><td>Plot</td><td>{moviedata.Plot}</td></tr>
                <tr><td>Box Office</td><td>{moviedata.BoxOffice}</td></tr>
                
                <tr><td>Country</td><td>{moviedata.Country}</td></tr>
              </tbody>
            </table><br/>
            <h3>Similar Recommendations by Popcorn Ai</h3>
            <div className="recommended-ai-wrapper">{!recommended ? <PropagateLoader color="rgba(255,255,255,0.1)"/> : recommended?.map((rec:Recommended,i) => (
              <div key={i} className="recommended-wrapper">
                <Popcorn className="rec-img"/>
                <div>
                <div>{rec.movieTitle} ({rec.year})</div>
                <div className="recommended-year">{rec.plot}</div>
                </div>
              </div>
            ))
            
            }</div>
            
              </>
            }
            </div>
            </div>

        </div>

        </>
    )
}
