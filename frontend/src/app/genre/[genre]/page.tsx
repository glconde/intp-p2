import { allMovies } from "@/services/services";
import GenreClientPage from "./GenreClientPage";
import { IMovie } from "@/services/types";

export async function generateStaticParams() {
  const movies = await allMovies;

  // Check if we got an error
  if ('error' in movies) {
    return [];
  }

  // Now movies is IMovie[]
  const uniqueGenres = Array.from(
    new Set(
      (movies as IMovie[]).flatMap((m) =>
        m.genre.split(",").map((g) => g.trim().toLowerCase())
      )
    )
  );

  return uniqueGenres.map((genre) => ({ genre }));
}

export default function Page() {
  return <GenreClientPage />;
}

