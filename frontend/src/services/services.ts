export const apiURL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8080";


export const getMovies = async () => {
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
