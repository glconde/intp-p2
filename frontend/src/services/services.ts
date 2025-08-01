export const apiURL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8080";


const getMovies = async () => {
     try {
        const res = await fetch(`${apiURL}/api/movies`);
        if (!res.ok) {
          throw new Error(`HTTP error! status: ${res.status}`);
        }
        const data = await res.json();
        return data
      } catch (err: unknown) {
        //setMessage("Failed to fetch movies:"+ err);
        if (err instanceof Error) {
          return [{error: err.message}]
        } else {
          return [{error: "An unknown error occurred"}];
        }
      }
}

export const getMovieData = async (title:string, year:number) => {
  try{
    const response = await fetch(`http://www.omdbapi.com/?apikey=${process.env.NEXT_PUBLIC_MOVIE_API}&t=${title}&y=${year}`);
    if(response.ok){
      const data = await response.json();
      return data
    }
    
  }catch(error){
    return error
  }
}

export const fader = () => {
  const hidden = document.querySelectorAll(".hide");
  hidden.forEach((item)=>{
    const pos = item.getBoundingClientRect()
      if(pos.y < 900){
        item.classList.add('show');
      }else{
        item.classList.remove('show');
      }
  })
}

export const allMovies = getMovies()
